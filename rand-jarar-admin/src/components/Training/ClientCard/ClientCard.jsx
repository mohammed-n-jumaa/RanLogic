import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  TrendingUp, 
  Target, 
  Weight, 
  Ruler,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  User,
  Phone,
  Mail,
  Dumbbell,
  Home,
  MapPin,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ClientCard.scss';

const ClientCard = ({ client, onEdit, onDelete }) => {
  const navigate = useNavigate();
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_URL}/storage/${path}`;
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4caf50';
      case 'expired': return '#f44336';
      case 'pending': return '#ff9800';
      default: return '#9e9e9e';
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'expired': return 'منتهي';
      case 'pending': return 'معلّق';
      default: return 'غير نشط';
    }
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
  
  const handleCardClick = () => {
    navigate(`/training/client/${client.id}`);
  };
  
  // حساب الحالة من تواريخ الاشتراك
  const getSubscriptionStatus = () => {
    if (!client.subscription_start_date || !client.subscription_end_date) {
      return 'pending';
    }
    
    const today = new Date();
    const endDate = new Date(client.subscription_end_date);
    
    if (endDate < today) {
      return 'expired';
    }
    
    return 'active';
  };
  
  const status = getSubscriptionStatus();
  
  return (
    <motion.div
      className="client-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onClick={handleCardClick}
    >
      {/* Card Header */}
      <div className="client-card__header">
        <div className="client-card__avatar-section">
          <div className="client-card__avatar">
            {client.avatar ? (
              <img src={getImageUrl(client.avatar)} alt={client.name} />
            ) : (
              <div className="client-card__avatar-placeholder">
                {client.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          
          <div 
            className="client-card__status"
            style={{ background: getStatusColor(status) }}
          >
            {status === 'active' ? (
              <CheckCircle size={16} />
            ) : (
              <XCircle size={16} />
            )}
            <span>{getStatusText(status)}</span>
          </div>
        </div>
        
        <div className="client-card__actions" onClick={(e) => e.stopPropagation()}>
          <motion.button
            className="client-card__action-btn"
            onClick={() => onEdit(client)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit2 size={16} />
          </motion.button>
          <motion.button
            className="client-card__action-btn client-card__action-btn--danger"
            onClick={() => onDelete(client.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
      
      {/* Card Body */}
      <div className="client-card__body">
        <h3 className="client-card__name">{client.name}</h3>
        
        <div className="client-card__contact">
          {client.email && (
            <div className="client-card__contact-item">
              <Mail size={14} />
              <span>{client.email}</span>
            </div>
          )}
          {client.phone && (
            <div className="client-card__contact-item">
              <Phone size={14} />
              <span>{client.phone}</span>
            </div>
          )}
        </div>
        
        <div className="client-card__info-grid">
          {client.age && (
            <div className="client-card__info-item">
              <div className="client-card__info-icon">
                <TrendingUp size={16} />
              </div>
              <div className="client-card__info-content">
                <span className="client-card__info-label">العمر</span>
                <span className="client-card__info-value">{client.age} سنة</span>
              </div>
            </div>
          )}
          
          {client.gender && (
            <div className="client-card__info-item">
              <div className="client-card__info-icon">
                <User size={16} />
              </div>
              <div className="client-card__info-content">
                <span className="client-card__info-label">الجنس</span>
                <span className="client-card__info-value">{getGenderText(client.gender)}</span>
              </div>
            </div>
          )}
          
          {client.weight && (
            <div className="client-card__info-item">
              <div className="client-card__info-icon">
                <Weight size={16} />
              </div>
              <div className="client-card__info-content">
                <span className="client-card__info-label">الوزن</span>
                <span className="client-card__info-value">{client.weight} كغ</span>
              </div>
            </div>
          )}
          
          {client.height && (
            <div className="client-card__info-item">
              <div className="client-card__info-icon">
                <Ruler size={16} />
              </div>
              <div className="client-card__info-content">
                <span className="client-card__info-label">الطول</span>
                <span className="client-card__info-value">{client.height} سم</span>
              </div>
            </div>
          )}
          
          {client.waist && (
            <div className="client-card__info-item">
              <div className="client-card__info-icon">
                <Activity size={16} />
              </div>
              <div className="client-card__info-content">
                <span className="client-card__info-label">الخصر</span>
                <span className="client-card__info-value">{client.waist} سم</span>
              </div>
            </div>
          )}
          
          {client.hips && (
            <div className="client-card__info-item">
              <div className="client-card__info-icon">
                <Activity size={16} />
              </div>
              <div className="client-card__info-content">
                <span className="client-card__info-label">الأرداف</span>
                <span className="client-card__info-value">{client.hips} سم</span>
              </div>
            </div>
          )}
          
          {client.goal && (
            <div className="client-card__info-item">
              <div className="client-card__info-icon">
                <Target size={16} />
              </div>
              <div className="client-card__info-content">
                <span className="client-card__info-label">الهدف</span>
                <span className="client-card__info-value">{getGoalText(client.goal)}</span>
              </div>
            </div>
          )}
          
          {client.workout_place && (
            <div className="client-card__info-item">
              <div className="client-card__info-icon">
                <Home size={16} />
              </div>
              <div className="client-card__info-content">
                <span className="client-card__info-label">مكان التدريب</span>
                <span className="client-card__info-value">{getWorkoutPlaceText(client.workout_place)}</span>
              </div>
            </div>
          )}
          
          {client.program && (
            <div className="client-card__info-item">
              <div className="client-card__info-icon">
                <Dumbbell size={16} />
              </div>
              <div className="client-card__info-content">
                <span className="client-card__info-label">البرنامج</span>
                <span className="client-card__info-value">{client.program}</span>
              </div>
            </div>
          )}
        </div>
        
        {client.health_notes && (
          <div className="client-card__health-notes">
            <strong>ملاحظات صحية:</strong>
            <p>{client.health_notes}</p>
          </div>
        )}
      </div>
      
      {/* Card Footer */}
      {(client.subscription_start_date || client.subscription_end_date) && (
        <div className="client-card__footer">
          {client.subscription_start_date && (
            <div className="client-card__date">
              <Calendar size={14} />
              <span>بداية: {client.subscription_start_date}</span>
            </div>
          )}
          {client.subscription_end_date && (
            <div className="client-card__date">
              <Calendar size={14} />
              <span>نهاية: {client.subscription_end_date}</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ClientCard;