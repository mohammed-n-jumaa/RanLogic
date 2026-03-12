import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MacrosSummary from './nutrition/MacrosSummary';
import NutritionCalendar from './nutrition/NutritionCalendar';
import MealsList from './nutrition/MealsList';
import { FaFilePdf, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import profileApi from '../../api/profileApi';
import Swal from 'sweetalert2';
import { FaStar, FaCalendarDay } from 'react-icons/fa';
const NutritionTab = () => {
  const { t } = useProfileLanguage();
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [viewMode, setViewMode] = useState('daily');
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPeriod, setCurrentPeriod] = useState(1);

  useEffect(() => {
    fetchNutritionPlan();
  }, []);

  const fetchNutritionPlan = async () => {
  try {
    setLoading(true);
    const now = new Date();
    const response = await profileApi.getMyNutritionPlan(now.getFullYear(), now.getMonth() + 1);
    
    console.log('📊 Nutrition response in component:', response);
    
    if (response.success && response.data) {

      setNutritionPlan(response.data);
    } else {
      setNutritionPlan(null);
    }
  } catch (error) {
    console.error('Error fetching nutrition plan:', error);
    setNutritionPlan(null);
  } finally {
    setLoading(false);
  }
};

  const handleToggleMealItem = async (itemId) => {
    try {
      const response = await profileApi.toggleMealItem(itemId);
      
      if (response.success) {
        await fetchNutritionPlan();
      }
    } catch (error) {
      console.error('Error toggling meal item:', error);
      Swal.fire({
        title: t('خطأ', 'Error'),
        text: t('فشل في تحديث حالة الوجبة', 'Failed to update meal status'),
        icon: 'error',
        confirmButtonText: t('حسناً', 'OK'),
        confirmButtonColor: '#FDB813'
      });
    }
  };

  const handleDownloadMonthlyPDF = () => {
    if (nutritionPlan?.plan?.pdf_file) {
      const pdfUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${nutritionPlan.plan.pdf_file}`;
      window.open(pdfUrl, '_blank');
    } else {
      Swal.fire({
        title: t('تنبيه', 'Notice'),
        text: t('لا يوجد ملف PDF متاح حالياً', 'No PDF file available at the moment'),
        icon: 'info',
        confirmButtonText: t('حسناً', 'OK'),
        confirmButtonColor: '#FDB813'
      });
    }
  };

const getCurrentPeriodDays = () => {
  if (!nutritionPlan?.meals || nutritionPlan.meals.length === 0) return [];
  
  console.log('🔍 Processing nutrition plan:', nutritionPlan);
  
  const startDay = (currentPeriod - 1) * 10 + 1;
  const endDay = Math.min(currentPeriod * 10, 31);
  
  const normalizeDate = (dateString) => {
    if (!dateString) return null;

    return dateString.split('T')[0];
  };
  
  const mealsByDate = {};
  nutritionPlan.meals.forEach(meal => {
    const normalizedDate = normalizeDate(meal.meal_date);
    console.log(`📅 Meal date: ${meal.meal_date} → normalized: ${normalizedDate}`);
    
    if (!mealsByDate[normalizedDate]) {
      mealsByDate[normalizedDate] = [];
    }
    mealsByDate[normalizedDate].push(meal);
  });

  console.log('📊 Meals grouped by date:', mealsByDate);

  let monthStartDate;
  if (nutritionPlan.plan?.month_start_date) {
    monthStartDate = new Date(nutritionPlan.plan.month_start_date);
  } else {
    const now = new Date();
    monthStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  console.log('📅 Month start date:', monthStartDate);

  const days = [];
  for (let day = startDay; day <= endDay; day++) {
    const date = new Date(monthStartDate);
    date.setDate(day);
    
    if (isNaN(date.getTime())) {
      console.error(`Invalid date for day ${day}`);
      continue;
    }
    
    const dateString = normalizeDate(date.toISOString());
    
    console.log(`🔍 Day ${day}: looking for ${dateString} in meals`);
    
    const dayMeals = mealsByDate[dateString] || [];
    
    console.log(`✅ Day ${day} has ${dayMeals.length} meals`);
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    dayMeals.forEach(meal => {
      meal.items?.forEach(item => {
        totalCalories += item.calories || 0;
        totalProtein += item.protein || 0;
        totalCarbs += item.carbs || 0;
        totalFats += item.fats || 0;
      });
    });

    days.push({
      day: day,
      date: date.toLocaleDateString(t('ar-SA', 'en-US'), { month: 'short', day: 'numeric' }),
      meals: dayMeals.map(meal => ({
        id: meal.id,
        name: meal.meal_type,
        time: meal.meal_time || '12:00',
        calories: meal.items?.reduce((sum, item) => sum + (item.calories || 0), 0) || 0,
        protein: meal.items?.reduce((sum, item) => sum + (item.protein || 0), 0) || 0,
        carbs: meal.items?.reduce((sum, item) => sum + (item.carbs || 0), 0) || 0,
        fats: meal.items?.reduce((sum, item) => sum + (item.fats || 0), 0) || 0,
        items: meal.items?.map(item => item.name) || [],
        instructions: '',
        checked: meal.items?.every(item => item.completed) || false,
        meal_image: meal.meal_image,
        fullMealData: meal
      })),
      totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fats: totalFats
    });
  }

  console.log('✅ Final days array:', days);
  return days;
};

  const periodDays = getCurrentPeriodDays();
  const currentDayData = periodDays[selectedDay - 1] || { meals: [], totalCalories: 0, protein: 0, carbs: 0, fats: 0 };

  if (loading) {
    return (
      <div className="nutrition-tab loading">
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>{t('جاري تحميل خطة التغذية...', 'Loading nutrition plan...')}</p>
        </div>
      </div>
    );
  }

  if (!nutritionPlan || !nutritionPlan.meals || nutritionPlan.meals.length === 0) {
    return (
      <div className="nutrition-tab empty">
        <div className="empty-state">
          <FaCalendarAlt className="empty-icon" />
          <h3>{t('لا توجد خطة تغذية', 'No Nutrition Plan')}</h3>
          <p>{t('لم يتم إنشاء خطة تغذية لهذا الشهر بعد', 'No nutrition plan has been created for this month yet')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nutrition-tab">
      <MacrosSummary macros={currentDayData} />

      <div className="nutrition-controls">
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'daily' ? 'active' : ''}`}
            onClick={() => setViewMode('daily')}
          >
            <FaCalendarAlt />
            <span>{t('العرض اليومي', 'Daily View')}</span>
          </button>
          <button
            className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            <FaCalendarAlt />
            <span>{t('تقويم 10 أيام', '10-Day Calendar')}</span>
          </button>
        </div>

        <div className="period-selector">
          <button
            className={`period-btn ${currentPeriod === 1 ? 'active' : ''}`}
            onClick={() => {
              setCurrentPeriod(1);
              setSelectedDay(1);
            }}
          >
            {t('أيام 1-10', 'Days 1-10')}
          </button>
          <button
            className={`period-btn ${currentPeriod === 2 ? 'active' : ''}`}
            onClick={() => {
              setCurrentPeriod(2);
              setSelectedDay(1);
            }}
          >
            {t('أيام 11-20', 'Days 11-20')}
          </button>
          <button
            className={`period-btn ${currentPeriod === 3 ? 'active' : ''}`}
            onClick={() => {
              setCurrentPeriod(3);
              setSelectedDay(1);
            }}
          >
            {t('أيام 21-31', 'Days 21-31')}
          </button>
        </div>

        <motion.button
          className="monthly-pdf-btn"
          onClick={handleDownloadMonthlyPDF}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaFilePdf />
          <span>{t('تحميل الخطة الشهرية (PDF)', 'Download Monthly Plan (PDF)')}</span>
        </motion.button>
      </div>

      {viewMode === 'daily' ? (
        <>
         <div className="day-selector">
            {periodDays.map((day, index) => {
              const today = new Date();
              const isToday = (() => {
                const monthStart = nutritionPlan?.plan?.month_start_date
                  ? new Date(nutritionPlan.plan.month_start_date)
                  : new Date(today.getFullYear(), today.getMonth(), 1);
                return (
                  day.day === today.getDate() &&
                  monthStart.getMonth() === today.getMonth() &&
                  monthStart.getFullYear() === today.getFullYear()
                );
              })();

              return (
                <button
                  key={index}
                  className={`day-btn ${selectedDay === index + 1 ? 'active' : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => {
                    setSelectedDay(index + 1);
                    setSelectedMeal(null);
                  }}
                >
                  {isToday && (
                    <motion.div
                      className="day-btn-today-badge"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500, delay: 0.3 }}
                    >
                      <FaStar className="day-btn-star-icon" />
                      <span>{t('اليوم', 'Today')}</span>
                    </motion.div>
                  )}

                  <span className="day-number">
                    {isToday && (
                      <motion.span
                        className="day-btn-today-indicator"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                      >
                      </motion.span>
                    )}
                    {t('يوم', 'Day')} {day.day}
                  </span>
                  <span className="day-date">{day.date}</span>
                </button>
              );
            })}
          </div>

          <MealsList
            meals={currentDayData.meals}
            selectedMeal={selectedMeal}
            setSelectedMeal={setSelectedMeal}
            dayNumber={selectedDay}
            onToggleMealItem={handleToggleMealItem}
          />
        </>
      ) : (
        <NutritionCalendar
          days={periodDays}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          setViewMode={setViewMode}
        />
      )}
    </div>
  );
};

export default NutritionTab;