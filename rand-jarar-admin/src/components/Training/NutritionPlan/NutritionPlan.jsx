import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2,
  CheckCircle,
  Circle,
  ChevronDown,
  Apple,
  Clock,
  Upload,
  X,
  Flame,
  Zap,
  Droplets,
  Beef,
  Save,
  Loader,
  FileText
} from 'lucide-react';
import trainingApi from '../../../api/trainingApi';
import Swal from 'sweetalert2';
import './NutritionPlan.scss';

const NutritionPlan = ({ clientId, nutritionPlan, onRefresh }) => {
  const [expandedDays, setExpandedDays] = useState([1]);
  const [meals, setMeals] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [currentPdf, setCurrentPdf] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRefs = useRef({});
  const pdfInputRef = useRef(null);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const currentDate = new Date();
  let displayYear = currentDate.getFullYear();
  let displayMonth = currentDate.getMonth() + 1;
  
  if (nutritionPlan && nutritionPlan.month_start_date) {
    const planDate = new Date(nutritionPlan.month_start_date);
    displayYear = planDate.getFullYear();
    displayMonth = planDate.getMonth() + 1;
  }
  
  const daysInMonth = new Date(displayYear, displayMonth, 0).getDate();
  
  const daysOfMonth = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(displayYear, displayMonth - 1, day);
    const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    
    return {
      id: day,
      name: dayNames[date.getDay()],
      date: `${displayYear}-${String(displayMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      fullDate: date
    };
  });
  
  // CRITICAL FIX: Convert date to YYYY-MM-DD format
  const normalizeDate = (dateString) => {
    if (!dateString) return null;
    // Handle ISO timestamps: 2026-01-01T00:00:00.000000Z -> 2026-01-01
    return dateString.split('T')[0];
  };
  
  useEffect(() => {
    console.log('=== NutritionPlan useEffect ===');
    console.log('nutritionPlan:', nutritionPlan);
    
    if (nutritionPlan) {
      if (nutritionPlan.pdf_file) {
        setCurrentPdf(nutritionPlan.pdf_file);
      } else {
        setCurrentPdf(null);
      }
      
      if (nutritionPlan.meals && nutritionPlan.meals.length > 0) {
        console.log(`Found ${nutritionPlan.meals.length} meals`);
        
        const loadedMeals = nutritionPlan.meals.map(meal => {
          const normalizedDate = normalizeDate(meal.meal_date);
          console.log(`Meal ${meal.id}:`, {
            original_date: meal.meal_date,
            normalized_date: normalizedDate,
            type: meal.meal_type
          });
          
          return {
            id: meal.id,
            meal_date: normalizedDate, // FIXED: Normalize the date
            meal_type: meal.meal_type || '',
            meal_time: meal.meal_time || '12:00',
            meal_image: meal.meal_image || null,
            order: meal.order || 0,
            items: meal.items ? meal.items.map(item => ({
              id: item.id,
              name: item.name || '',
              calories: item.calories || 0,
              protein: item.protein || 0,
              carbs: item.carbs || 0,
              fats: item.fats || 0,
              completed: item.completed || false,
              order: item.order || 0
            })) : []
          };
        });
        
        console.log('Setting meals:', loadedMeals);
        setMeals(loadedMeals);
        
        const daysWithData = [...new Set(loadedMeals.map(meal => {
          const day = parseInt(meal.meal_date.split('-')[2]);
          return day;
        }))];
        console.log('Auto-expanding days:', daysWithData);
        setExpandedDays(prev => [...new Set([...prev, ...daysWithData])]);
      } else {
        console.log('No meals');
        setMeals([]);
      }
    } else {
      console.log('No nutrition plan');
      setMeals([]);
      setCurrentPdf(null);
    }
  }, [nutritionPlan]);
  
  const getMealsForDate = (date) => {
    const filtered = meals.filter(meal => meal.meal_date === date);
    if (filtered.length > 0) {
      console.log(`✅ Found ${filtered.length} meals for ${date}`);
    }
    return filtered;
  };
  
  const handleAddMeal = (date) => {
    const newMeal = {
      id: `temp-${Date.now()}`,
      meal_date: date,
      meal_type: 'وجبة جديدة',
      meal_time: '12:00',
      meal_image: null,
      items: [],
      order: meals.filter(m => m.meal_date === date).length
    };
    
    setMeals(prev => [...prev, newMeal]);
  };
  
  const handleUpdateMeal = (mealId, field, value) => {
    setMeals(prev => prev.map(meal =>
      meal.id === mealId ? { ...meal, [field]: value } : meal
    ));
  };
  
  const handleMealImageUpload = (mealId, file) => {
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حجم الصورة يجب ألا يتجاوز 5MB',
      });
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يجب اختيار ملف صورة',
      });
      return;
    }
    
    handleUpdateMeal(mealId, 'meal_image', file);
  };
  
  const handleDeleteMeal = async (mealId) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'سيتم حذف هذه الوجبة وجميع عناصرها',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
    });
    
    if (!result.isConfirmed) return;
    
    if (!String(mealId).startsWith('temp-')) {
      try {
        await trainingApi.deleteMeal(mealId);
        Swal.fire({
          icon: 'success',
          title: 'تم الحذف',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Error deleting:', error);
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'حدث خطأ أثناء الحذف',
        });
        return;
      }
    }
    
    setMeals(prev => prev.filter(meal => meal.id !== mealId));
  };
  
  const handleAddItem = (mealId) => {
    setMeals(prev => prev.map(meal => {
      if (meal.id === mealId) {
        return {
          ...meal,
          items: [...meal.items, {
            id: `temp-${Date.now()}`,
            name: '',
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
            completed: false,
            order: meal.items.length
          }]
        };
      }
      return meal;
    }));
  };
  
  const handleUpdateItem = (mealId, itemId, field, value) => {
    setMeals(prev => prev.map(meal => {
      if (meal.id === mealId) {
        return {
          ...meal,
          items: meal.items.map(item =>
            item.id === itemId ? { ...item, [field]: value } : item
          )
        };
      }
      return meal;
    }));
  };
  
  const handleDeleteItem = (mealId, itemId) => {
    setMeals(prev => prev.map(meal => {
      if (meal.id === mealId) {
        return {
          ...meal,
          items: meal.items.filter(item => item.id !== itemId)
        };
      }
      return meal;
    }));
  };
  
  const handleToggleItemCompletion = async (itemId) => {
    if (String(itemId).startsWith('temp-')) {
      Swal.fire({
        icon: 'info',
        title: 'تنبيه',
        text: 'يجب حفظ العنصر أولاً',
      });
      return;
    }
    
    try {
      const response = await trainingApi.toggleMealItem(itemId);
      if (response.data.success) {
        setMeals(prev => prev.map(meal => ({
          ...meal,
          items: meal.items.map(item =>
            item.id === itemId ? { ...item, completed: response.data.data.completed } : item
          )
        })));
      }
    } catch (error) {
      console.error('Error toggling:', error);
    }
  };
  
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حجم الملف يجب ألا يتجاوز 10MB',
      });
      e.target.value = null;
      return;
    }
    
    if (file.type !== 'application/pdf') {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يجب أن يكون الملف PDF',
      });
      e.target.value = null;
      return;
    }
    
    setPdfFile(file);
  };
  
  const handleSaveNutritionPlan = async () => {
    setIsSaving(true);
    
    try {
      const formData = new FormData();
      formData.append('year', displayYear);
      formData.append('month', displayMonth);
      
      if (pdfFile) {
        formData.append('pdf_file', pdfFile);
      }
      
      const mealsData = [];
      let imageIndex = 0;
      
      meals.forEach((meal, mealIndex) => {
        const mealData = {
          meal_date: meal.meal_date,
          meal_type: meal.meal_type,
          meal_time: meal.meal_time || '12:00',
          order: mealIndex,
          items: meal.items.map((item, itemIndex) => ({
            name: item.name,
            calories: parseInt(item.calories) || 0,
            protein: parseFloat(item.protein) || 0,
            carbs: parseFloat(item.carbs) || 0,
            fats: parseFloat(item.fats) || 0,
            completed: item.completed || false,
            order: itemIndex
          }))
        };
        
        if (!String(meal.id).startsWith('temp-')) {
          mealData.id = meal.id;
        }
        
        if (meal.meal_image instanceof File) {
          const imageKey = `image_${imageIndex}`;
          formData.append(imageKey, meal.meal_image);
          mealData.meal_image_key = imageKey;
          imageIndex++;
        }
        
        mealsData.push(mealData);
      });
      
      formData.append('meals', JSON.stringify(mealsData));
      
      const response = await trainingApi.saveNutritionPlan(clientId, formData);
      
      if (response.data.success) {
        setPdfFile(null);
        if (pdfInputRef.current) {
          pdfInputRef.current.value = null;
        }
        
        await Swal.fire({
          icon: 'success',
          title: 'تم الحفظ',
          text: 'تم حفظ النظام الغذائي بنجاح',
          timer: 2000,
          showConfirmButton: false,
        });
        
        if (onRefresh) {
          await onRefresh();
        }
      }
    } catch (error) {
      console.error('Error saving:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: error.response?.data?.message || 'حدث خطأ أثناء الحفظ',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const toggleDay = (dayId) => {
    setExpandedDays(prev =>
      prev.includes(dayId) ? prev.filter(id => id !== dayId) : [...prev, dayId]
    );
  };
  
  const getDayProgress = (date) => {
    const dayMeals = getMealsForDate(date);
    const totalItems = dayMeals.reduce((sum, meal) => sum + meal.items.length, 0);
    if (totalItems === 0) return 0;
    const completedItems = dayMeals.reduce((sum, meal) => 
      sum + meal.items.filter(item => item.completed).length, 0
    );
    return Math.round((completedItems / totalItems) * 100);
  };
  
  const getDayTotalCalories = (date) => {
    const dayMeals = getMealsForDate(date);
    return dayMeals.reduce((sum, meal) => 
      sum + meal.items.reduce((mealSum, item) => mealSum + (parseInt(item.calories) || 0), 0), 0
    );
  };
  
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_URL}/storage/${path}`;
  };
  
  console.log('Total meals:', meals.length);
  
  return (
    <div className="nutrition-plan">
      <div className="nutrition-plan__header">
        <div className="nutrition-plan__header-top">
          <h2 className="nutrition-plan__title">
            <Apple size={24} />
            النظام الغذائي الشهري
          </h2>
          
          <div className="nutrition-plan__week-info">
            {new Date(displayYear, displayMonth - 1).toLocaleDateString('ar-SA', { 
              year: 'numeric', 
              month: 'long' 
            })}
          </div>
          
          <button 
            className="nutrition-plan__save-btn"
            onClick={handleSaveNutritionPlan}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader size={18} className="spinner" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>حفظ التعديلات</span>
              </>
            )}
          </button>
        </div>
        
        <div className="nutrition-plan__pdf-upload">
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
            style={{ display: 'none' }}
          />
          
          <button
            className="nutrition-plan__pdf-btn"
            onClick={() => pdfInputRef.current?.click()}
            disabled={isSaving}
          >
            <FileText size={18} />
            {pdfFile ? `تم اختيار: ${pdfFile.name}` : 'رفع PDF الشهر'}
          </button>
          
          <div className="nutrition-plan__pdf-info">
            {pdfFile ? (
              <span className="pdf-selected">ملف جديد محدد: {pdfFile.name}</span>
            ) : currentPdf ? (
              <span className="pdf-exists">
                PDF موجود - 
                <a 
                  href={getImageUrl(currentPdf)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ marginRight: '5px', color: '#4caf50' }}
                >
                  عرض
                </a>
              </span>
            ) : (
              <span className="pdf-none">لم يتم رفع PDF للشهر الحالي</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="nutrition-plan__days">
        {daysOfMonth.map((dayInfo, index) => {
          const dayMeals = getMealsForDate(dayInfo.date);
          const isExpanded = expandedDays.includes(dayInfo.id);
          const progress = getDayProgress(dayInfo.date);
          const totalCalories = getDayTotalCalories(dayInfo.date);
          const isToday = dayInfo.date === new Date().toISOString().split('T')[0];
          
          return (
            <motion.div
              key={dayInfo.id}
              className={`nutrition-day ${isToday ? 'nutrition-day--today' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <div className="nutrition-day__header" onClick={() => toggleDay(dayInfo.id)}>
                <div className="nutrition-day__header-top">
                  <motion.div
                    className="nutrition-day__chevron"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                  
                  <div className="nutrition-day__title-section">
                    <div className="nutrition-day__title-wrapper">
                      <h3 className="nutrition-day__title">{dayInfo.name}</h3>
                      {isToday && <span className="nutrition-day__today-badge">اليوم</span>}
                    </div>
                    <span className="nutrition-day__date">{dayInfo.date}</span>
                  </div>
                  
                  <div className="nutrition-day__stats">
                    <div className="nutrition-day__stat">
                      <span className="nutrition-day__stat-value">{dayMeals.length}</span>
                      <span className="nutrition-day__stat-label">وجبة</span>
                    </div>
                    
                    <div className="nutrition-day__stat">
                      <Flame size={12} className="nutrition-day__calorie-icon" />
                      <span className="nutrition-day__stat-value">{totalCalories}</span>
                      <span className="nutrition-day__stat-label">cal</span>
                    </div>
                  </div>
                </div>
                
                <div className="nutrition-day__header-bottom" onClick={(e) => e.stopPropagation()}>
                  <div className="nutrition-day__progress">
                    <div
                      className="nutrition-day__progress-bar"
                      style={{ width: `${progress}%` }}
                    />
                    <span className="nutrition-day__progress-text">{progress}%</span>
                  </div>
                  
                  <button 
                    className="nutrition-day__expand-btn"
                    onClick={() => toggleDay(dayInfo.id)}
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="nutrition-day__content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    {dayMeals.length > 0 ? (
                      <div className="nutrition-day__meals">
                        {dayMeals.map((meal) => (
                          <motion.div
                            key={meal.id}
                            className="meal-card"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <div className="meal-card__header">
                              <div className="meal-card__info">
                                <div className="meal-card__type-wrapper">
                                  <Apple size={14} />
                                  <input
                                    type="text"
                                    className="meal-card__type"
                                    value={meal.meal_type}
                                    onChange={(e) => handleUpdateMeal(meal.id, 'meal_type', e.target.value)}
                                    placeholder="نوع الوجبة"
                                  />
                                </div>
                                
                                <div className="meal-card__time-wrapper">
                                  <Clock size={14} />
                                  <input
                                    type="time"
                                    className="meal-card__time"
                                    value={meal.meal_time}
                                    onChange={(e) => handleUpdateMeal(meal.id, 'meal_time', e.target.value)}
                                  />
                                </div>
                              </div>
                              
                              <button
                                className="meal-card__delete-btn"
                                onClick={() => handleDeleteMeal(meal.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            
                            <div className="meal-card__image-section">
                              <input
                                ref={el => fileInputRefs.current[meal.id] = el}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                onChange={(e) => handleMealImageUpload(meal.id, e.target.files[0])}
                                style={{ display: 'none' }}
                              />
                              
                              {meal.meal_image ? (
                                <div className="meal-image-preview">
                                  {meal.meal_image instanceof File ? (
                                    <img src={URL.createObjectURL(meal.meal_image)} alt="Meal" />
                                  ) : (
                                    <img src={getImageUrl(meal.meal_image)} alt="Meal" />
                                  )}
                                  <button
                                    className="meal-image-preview__remove"
                                    onClick={() => handleUpdateMeal(meal.id, 'meal_image', null)}
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="meal-card__upload-btn"
                                  onClick={() => fileInputRefs.current[meal.id]?.click()}
                                >
                                  <Upload size={16} />
                                  <span>رفع صورة الوجبة</span>
                                </button>
                              )}
                            </div>
                            
                            <div className="meal-card__items">
                              {meal.items && meal.items.length > 0 ? (
                                meal.items.map((item) => (
                                  <div key={item.id} className="nutrition-item">
                                    <div className="nutrition-item__left">
                                      <button
                                        className={`nutrition-item__check ${item.completed ? 'nutrition-item__check--completed' : ''}`}
                                        onClick={() => handleToggleItemCompletion(item.id)}
                                        disabled={String(item.id).startsWith('temp-')}
                                      >
                                        {item.completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                                      </button>
                                    </div>
                                    
                                    <div className="nutrition-item__content">
                                      <input
                                        type="text"
                                        className="nutrition-item__name"
                                        value={item.name}
                                        onChange={(e) => handleUpdateItem(meal.id, item.id, 'name', e.target.value)}
                                        placeholder="اسم الطعام"
                                      />
                                      
                                      <div className="nutrition-item__macros">
                                        <div className="nutrition-item__macro">
                                          <div className="nutrition-item__macro-icon">
                                            <Flame size={10} />
                                          </div>
                                          <input
                                            type="number"
                                            value={item.calories}
                                            onChange={(e) => handleUpdateItem(meal.id, item.id, 'calories', e.target.value)}
                                            min="0"
                                            placeholder="0"
                                          />
                                          <span className="nutrition-item__macro-label">cal</span>
                                        </div>
                                        
                                        <div className="nutrition-item__macro">
                                          <div className="nutrition-item__macro-icon">
                                            <Beef size={10} />
                                          </div>
                                          <input
                                            type="number"
                                            value={item.protein}
                                            onChange={(e) => handleUpdateItem(meal.id, item.id, 'protein', e.target.value)}
                                            min="0"
                                            step="0.1"
                                            placeholder="0"
                                          />
                                          <span className="nutrition-item__macro-label">بروتين</span>
                                        </div>
                                        
                                        <div className="nutrition-item__macro">
                                          <div className="nutrition-item__macro-icon">
                                            <Zap size={10} />
                                          </div>
                                          <input
                                            type="number"
                                            value={item.carbs}
                                            onChange={(e) => handleUpdateItem(meal.id, item.id, 'carbs', e.target.value)}
                                            min="0"
                                            step="0.1"
                                            placeholder="0"
                                          />
                                          <span className="nutrition-item__macro-label">كارب</span>
                                        </div>
                                        
                                        <div className="nutrition-item__macro">
                                          <div className="nutrition-item__macro-icon">
                                            <Droplets size={10} />
                                          </div>
                                          <input
                                            type="number"
                                            value={item.fats}
                                            onChange={(e) => handleUpdateItem(meal.id, item.id, 'fats', e.target.value)}
                                            min="0"
                                            step="0.1"
                                            placeholder="0"
                                          />
                                          <span className="nutrition-item__macro-label">دهون</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="nutrition-item__right">
                                      <button
                                        className="nutrition-item__delete"
                                        onClick={() => handleDeleteItem(meal.id, item.id)}
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                                  لا توجد عناصر غذائية
                                </div>
                              )}
                            </div>
                            
                            <button
                              className="meal-card__add-item"
                              onClick={() => handleAddItem(meal.id)}
                            >
                              <Plus size={14} />
                              إضافة عنصر غذائي
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="nutrition-day__empty">
                        <Apple size={40} className="nutrition-day__empty-icon" />
                        <p className="nutrition-day__empty-text">لا توجد وجبات لهذا اليوم</p>
                        <p className="nutrition-day__empty-sub">انقر على "إضافة وجبة" لبدء إنشاء النظام الغذائي</p>
                      </div>
                    )}
                    
                    <button
                      className="nutrition-day__add-meal"
                      onClick={() => handleAddMeal(dayInfo.date)}
                    >
                      <Plus size={16} />
                      إضافة وجبة
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default NutritionPlan;