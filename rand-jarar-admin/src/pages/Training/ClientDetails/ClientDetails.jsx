import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  User,
  Calendar,
  Target,
  Weight,
  Ruler,
  Mail,
  Phone,
  TrendingUp,
  Dumbbell,
  Apple,
  Activity,
  Loader,
  Home,
  Heart
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import WorkoutPlan from '../../../components/Training/WorkoutPlan';
import NutritionPlan from '../../../components/Training/NutritionPlan';
import ProgressTracker from '../../../components/Training/ProgressTracker';
import trainingApi from '../../../api/trainingApi';
import Swal from 'sweetalert2';
import './ClientDetails.scss';

const ClientDetails = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('workout');
  const [client, setClient] = useState(null);
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentYear] = useState(new Date().getFullYear());
  const [currentMonth] = useState(new Date().getMonth() + 1);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  useEffect(() => {
    console.log('=== ClientDetails mounted ===');
    console.log('Client ID:', clientId);
    console.log('Year:', currentYear, 'Month:', currentMonth);
    fetchClientDetails();
  }, [clientId, refreshKey]);
  
  const fetchClientDetails = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching client details...');
      const response = await trainingApi.getTraineeDetails(clientId, currentYear, currentMonth);
      
      console.log('=== API Response ===');
      console.log('Response:', response.data);
      
      if (response.data.success) {
        const data = response.data.data;
        
        console.log('=== Client Data ===');
        console.log('User:', data.user);
        
        setClient(data.user);
        
        console.log('=== Nutrition Plan ===');
        if (data.nutrition_plan) {
          console.log('Plan ID:', data.nutrition_plan.id);
          console.log('PDF:', data.nutrition_plan.pdf_file);
          console.log('Meals count:', data.nutrition_plan.meals?.length || 0);
          if (data.nutrition_plan.meals && data.nutrition_plan.meals.length > 0) {
            console.log('First meal:', data.nutrition_plan.meals[0]);
            console.log('First meal items:', data.nutrition_plan.meals[0].items);
          }
          setNutritionPlan(data.nutrition_plan);
        } else {
          console.log('No nutrition plan');
          setNutritionPlan(null);
        }
        
        console.log('=== Workout Plan ===');
        if (data.workout_plan) {
          console.log('Plan ID:', data.workout_plan.id);
          console.log('Exercises count:', data.workout_plan.exercises?.length || 0);
          if (data.workout_plan.exercises && data.workout_plan.exercises.length > 0) {
            console.log('First exercise:', data.workout_plan.exercises[0]);
          }
          setWorkoutPlan(data.workout_plan);
        } else {
          console.log('No workout plan');
          setWorkoutPlan(null);
        }
      }
    } catch (error) {
      console.error('=== Error ===');
      console.error('Error:', error);
      console.error('Response:', error.response);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء جلب البيانات',
        confirmButtonText: 'حسناً',
      }).then(() => {
        navigate('/training/clients');
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    console.log('=== Refresh triggered ===');
    setRefreshKey(prev => prev + 1);
  };
  
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_URL}/storage/${path}`;
  };
  
  const getGoalText = (goal) => {
    const goals = {
      'weight-loss': 'إنقاص الوزن',
      'muscle-gain': 'بناء العضلات',
      'toning': 'تنشيف',
      'fitness': 'لياقة عامة'
    };
    return goals[goal] || goal;
  };
  
  const getGenderText = (gender) => {
    return gender === 'male' ? 'ذكر' : gender === 'female' ? 'أنثى' : '-';
  };
  
  const getWorkoutPlaceText = (place) => {
    return place === 'home' ? 'منزل' : place === 'gym' ? 'جيم' : '-';
  };
  
  const getSubscriptionStatus = () => {
    if (!client?.subscription_start_date || !client?.subscription_end_date) {
      return 'pending';
    }
    
    const today = new Date();
    const endDate = new Date(client.subscription_end_date);
    
    if (endDate < today) {
      return 'expired';
    }
    
    return 'active';
  };
  
  if (isLoading) {
    return (
      <div className="client-details">
        <div className="client-details__loading">
          <Loader size={48} className="spinner" />
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }
  
  if (!client) {
    return (
      <div className="client-details">
        <div className="client-details__error">
          <h3>المتدرب غير موجود</h3>
          <button onClick={() => navigate('/training/clients')}>
            العودة للقائمة
          </button>
        </div>
      </div>
    );
  }
  
  const status = getSubscriptionStatus();
  
  return (
    <div className="client-details">
      {/* Header with Back Button */}
      <motion.div
        className="client-details__header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button className="client-details__back-btn" onClick={() => navigate('/training/clients')}>
          <ArrowRight size={20} />
          <span>العودة للقائمة</span>
        </button>
      </motion.div>
      
      {/* Client Info Card */}
      <motion.div
        className="client-info-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="client-info-card__main">
          <div className="client-info-card__avatar">
            {client.avatar ? (
              <img src={getImageUrl(client.avatar)} alt={client.name} />
            ) : (
              <div className="client-info-card__avatar-placeholder">
                <User size={40} />
              </div>
            )}
          </div>
          
          <div className="client-info-card__details">
            <h1 className="client-info-card__name">{client.name}</h1>
            
            <div className="client-info-card__meta">
              {client.email && (
                <div className="client-info-card__meta-item">
                  <Mail size={16} />
                  <span>{client.email}</span>
                </div>
              )}
              {client.phone && (
                <div className="client-info-card__meta-item">
                  <Phone size={16} />
                  <span>{client.phone}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className={`client-info-card__status client-info-card__status--${status}`}>
            {status === 'active' ? 'نشط' : status === 'expired' ? 'منتهي' : 'معلّق'}
          </div>
        </div>
        
        <div className="client-info-card__stats">
          {client.age && (
            <div className="info-stat">
              <div className="info-stat__icon">
                <TrendingUp size={20} />
              </div>
              <div className="info-stat__content">
                <span className="info-stat__label">العمر</span>
                <span className="info-stat__value">{client.age} سنة</span>
              </div>
            </div>
          )}
          
          {client.gender && (
            <div className="info-stat">
              <div className="info-stat__icon">
                <User size={20} />
              </div>
              <div className="info-stat__content">
                <span className="info-stat__label">الجنس</span>
                <span className="info-stat__value">{getGenderText(client.gender)}</span>
              </div>
            </div>
          )}
          
          {client.weight && (
            <div className="info-stat">
              <div className="info-stat__icon">
                <Weight size={20} />
              </div>
              <div className="info-stat__content">
                <span className="info-stat__label">الوزن</span>
                <span className="info-stat__value">{client.weight} كغ</span>
              </div>
            </div>
          )}
          
          {client.height && (
            <div className="info-stat">
              <div className="info-stat__icon">
                <Ruler size={20} />
              </div>
              <div className="info-stat__content">
                <span className="info-stat__label">الطول</span>
                <span className="info-stat__value">{client.height} سم</span>
              </div>
            </div>
          )}
          
          {client.waist && (
            <div className="info-stat">
              <div className="info-stat__icon">
                <Activity size={20} />
              </div>
              <div className="info-stat__content">
                <span className="info-stat__label">محيط الخصر</span>
                <span className="info-stat__value">{client.waist} سم</span>
              </div>
            </div>
          )}
          
          {client.hips && (
            <div className="info-stat">
              <div className="info-stat__icon">
                <Activity size={20} />
              </div>
              <div className="info-stat__content">
                <span className="info-stat__label">محيط الأرداف</span>
                <span className="info-stat__value">{client.hips} سم</span>
              </div>
            </div>
          )}
          
          {client.goal && (
            <div className="info-stat">
              <div className="info-stat__icon">
                <Target size={20} />
              </div>
              <div className="info-stat__content">
                <span className="info-stat__label">الهدف</span>
                <span className="info-stat__value">{getGoalText(client.goal)}</span>
              </div>
            </div>
          )}
          
          {client.workout_place && (
            <div className="info-stat">
              <div className="info-stat__icon">
                <Home size={20} />
              </div>
              <div className="info-stat__content">
                <span className="info-stat__label">مكان التدريب</span>
                <span className="info-stat__value">{getWorkoutPlaceText(client.workout_place)}</span>
              </div>
            </div>
          )}
          
          {client.program && (
            <div className="info-stat">
              <div className="info-stat__icon">
                <Dumbbell size={20} />
              </div>
              <div className="info-stat__content">
                <span className="info-stat__label">البرنامج</span>
                <span className="info-stat__value">{client.program}</span>
              </div>
            </div>
          )}
          
          {client.subscription_start_date && (
            <div className="info-stat">
              <div className="info-stat__icon">
                <Calendar size={20} />
              </div>
              <div className="info-stat__content">
                <span className="info-stat__label">بداية الاشتراك</span>
                <span className="info-stat__value">{client.subscription_start_date}</span>
              </div>
            </div>
          )}
          
          {client.subscription_end_date && (
            <div className="info-stat">
              <div className="info-stat__icon">
                <Calendar size={20} />
              </div>
              <div className="info-stat__content">
                <span className="info-stat__label">نهاية الاشتراك</span>
                <span className="info-stat__value">{client.subscription_end_date}</span>
              </div>
            </div>
          )}
        </div>
        
        {client.health_notes && (
          <div className="client-info-card__health-notes">
            <div className="health-notes-header">
              <Heart size={18} />
              <strong>ملاحظات صحية مهمة:</strong>
            </div>
            <p>{client.health_notes}</p>
          </div>
        )}
      </motion.div>
      
      {/* Tabs */}
      <motion.div
        className="client-details__tabs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          className={`client-details__tab ${activeTab === 'workout' ? 'client-details__tab--active' : ''}`}
          onClick={() => setActiveTab('workout')}
        >
          <Dumbbell size={20} />
          <span>البرنامج التدريبي</span>
        </button>
        
        <button
          className={`client-details__tab ${activeTab === 'nutrition' ? 'client-details__tab--active' : ''}`}
          onClick={() => setActiveTab('nutrition')}
        >
          <Apple size={20} />
          <span>النظام الغذائي</span>
        </button>
        
        <button
          className={`client-details__tab ${activeTab === 'progress' ? 'client-details__tab--active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          <Activity size={20} />
          <span>التقدم والإنجازات</span>
        </button>
      </motion.div>
      
      {/* Tab Content */}
      <motion.div
        className="client-details__content"
        key={`${activeTab}-${refreshKey}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {activeTab === 'workout' && (
          <WorkoutPlan 
            clientId={client.id}
            workoutPlan={workoutPlan}
            onRefresh={handleRefresh}
          />
        )}
        
        {activeTab === 'nutrition' && (
          <NutritionPlan
            clientId={client.id}
            nutritionPlan={nutritionPlan}
            onRefresh={handleRefresh}
          />
        )}
        
        {activeTab === 'progress' && (
          <ProgressTracker
            clientId={client.id}
            year={currentYear}
            month={currentMonth}
          />
        )}
      </motion.div>
    </div>
  );
};

export default ClientDetails;