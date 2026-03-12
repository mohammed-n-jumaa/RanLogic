import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  Users,
  MessageSquareMore,
  ChevronRight,
  Loader2,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getConversations, getChatStats, deleteConversation } from '../../../api/chatApi';
import './ChatList.scss';

const ChatList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [chats, setChats] = useState([]);
  const [stats, setStats] = useState({
    total_conversations: 0,
    unread_messages: 0,
    online_count: 0,
    active_trainees: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ نفس منطق الهيدر: ديفولت حسب الجنس (هنا نستنتج من default-avatar-*.png)
  const getDefaultAvatar = (clientObj) => {
    const fallback = 'https://i.postimg.cc/WpqHf2CH/download.png';
    if (!clientObj) return fallback;

    // عندك هنا الحقل image
    const avatarUrl = clientObj.image || clientObj.avatar_url || clientObj.avatar || '';

    // لو أفاتار مرفوع فعليًا (مو default-avatar)
    const isServerDefault = !avatarUrl || String(avatarUrl).includes('default-avatar');
    const hasCustomAvatar = avatarUrl && !isServerDefault;

    if (hasCustomAvatar) return avatarUrl;

    // ✅ استنتاج الجنس من رابط الديفولت القادم من السيرفر
    if (avatarUrl && String(avatarUrl).includes('default-avatar-male')) {
      return 'https://i.postimg.cc/VNmvRfK2/0b90cfaf-8167-4730-8de0-8872054ff0c5.jpg';
    }

    if (avatarUrl && String(avatarUrl).includes('default-avatar-female')) {
      return 'https://i.postimg.cc/bvmy9QDq/fee021a6-b60e-4456-abc4-6febcb2353c4.jpg';
    }

    return fallback;
  };

  // جلب المحادثات
  const fetchConversations = useCallback(async (search = '') => {
    try {
      setError(null);
      const response = await getConversations(search);
      if (response.success) {
        setChats(response.data);
      }
    } catch (err) {
      setError('حدث خطأ أثناء جلب المحادثات');
      console.error('Error fetching conversations:', err);
    }
  }, []);

  // جلب الإحصائيات
  const fetchStats = useCallback(async () => {
    try {
      const response = await getChatStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // جلب البيانات عند التحميل
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchConversations(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, [fetchConversations, fetchStats]);

  // البحث مع تأخير
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchConversations(searchTerm);
    }, 300);
    return () => clearTimeout(delaySearch);
  }, [searchTerm, fetchConversations]);

  // تحديث البيانات
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchConversations(searchTerm), fetchStats()]);
    setRefreshing(false);
  };

  // التصفية حسب الحالة
  const filteredChats = chats.filter(chat => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'unread') return chat.unread_count > 0;
    return chat.client?.status === filterStatus;
  });

  // الانتقال للمحادثة - المسار الصحيح
  const handleChatSelect = (chat) => {
    navigate(`/chat/${chat.trainee_id}`);
  };

  // حذف محادثة
  const handleDeleteConversation = async (e, conversationId) => {
    e.stopPropagation();
    if (window.confirm('هل أنت متأكد من حذف هذه المحادثة؟')) {
      try {
        const response = await deleteConversation(conversationId);
        if (response.success) {
          setChats(prev => prev.filter(chat => chat.id !== conversationId));
          fetchStats();
        }
      } catch (err) {
        console.error('Error deleting conversation:', err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4caf50';
      case 'expired': return '#f44336';
      case 'pending': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'expired': return 'منتهي';
      case 'pending': return 'معلّق';
      default: return 'غير محدد';
    }
  };

  if (loading) {
    return (
      <div className="chat-list chat-list--loading">
        <div className="chat-list__loader">
          <Loader2 size={48} className="spinner" />
          <p>جاري تحميل المحادثات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-list">
      {/* Page Header */}
      <motion.div
        className="chat-list__header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="chat-list__header-content">
          <div className="chat-list__title-section">
            <h1 className="chat-list__title">
              <MessageSquareMore size={32} />
              محادثات المتدربين
            </h1>
            <p className="chat-list__subtitle">
              تواصل مع المتدربين ومتابعة المحادثات
            </p>
          </div>
          
          <motion.button
            className="chat-list__refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={20} className={refreshing ? 'spinning' : ''} />
            تحديث
          </motion.button>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        className="chat-list__stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="chat-stat-card">
          <div className="chat-stat-card__icon chat-stat-card__icon--primary">
            <MessageSquare size={24} />
          </div>
          <div className="chat-stat-card__content">
            <span className="chat-stat-card__label">إجمالي المحادثات</span>
            <span className="chat-stat-card__value">{stats.total_conversations}</span>
          </div>
        </div>

        <div className="chat-stat-card">
          <div className="chat-stat-card__icon chat-stat-card__icon--warning">
            <MessageSquare size={24} />
          </div>
          <div className="chat-stat-card__content">
            <span className="chat-stat-card__label">غير مقروء</span>
            <span className="chat-stat-card__value">{stats.unread_messages}</span>
          </div>
        </div>

        <div className="chat-stat-card">
          <div className="chat-stat-card__icon chat-stat-card__icon--success">
            <CheckCircle size={24} />
          </div>
          <div className="chat-stat-card__content">
            <span className="chat-stat-card__label">متصل الآن</span>
            <span className="chat-stat-card__value">{stats.online_count}</span>
          </div>
        </div>

        <div className="chat-stat-card">
          <div className="chat-stat-card__icon chat-stat-card__icon--info">
            <Users size={24} />
          </div>
          <div className="chat-stat-card__content">
            <span className="chat-stat-card__label">متدربين نشطين</span>
            <span className="chat-stat-card__value">{stats.active_trainees}</span>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="chat-list__filters"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="chat-search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="ابحث عن محادثة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="chat-filter-box">
          <Filter size={20} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">جميع المحادثات</option>
            <option value="unread">غير مقروءة</option>
            <option value="active">نشط</option>
            <option value="expired">منتهي</option>
            <option value="pending">معلّق</option>
          </select>
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          className="chat-list__error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>{error}</p>
          <button onClick={handleRefresh}>إعادة المحاولة</button>
        </motion.div>
      )}

      {/* Chats List */}
      <motion.div
        className="chat-list__container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="chat-list__content">
          <AnimatePresence>
            {filteredChats.map((chat, index) => (
              <motion.div
                key={chat.id}
                className={`chat-item ${chat.unread_count > 0 ? 'chat-item--unread' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 5 }}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="chat-item__left">
                  <div className="chat-item__avatar">
                    {/* ✅ هنا التعديل: نفس منطق الهيدر */}
                    <img
                      src={getDefaultAvatar(chat.client)}
                      alt={chat.client?.name || 'Client'}
                      onError={(e) => {
                        e.target.src = 'https://i.postimg.cc/WpqHf2CH/download.png';
                      }}
                    />
                    {chat.is_online && <div className="chat-item__online-dot" />}
                  </div>
                  
                  <div className="chat-item__info">
                    <h4 className="chat-item__name">{chat.client?.name || 'مجهول'}</h4>
                    <div className="chat-item__goal">{chat.client?.goal || 'غير محدد'}</div>
                  </div>
                </div>

                <div className="chat-item__right">
                  <div className="chat-item__message-preview">
                    <p className="chat-item__last-message">
                      {chat.last_message || 'لا توجد رسائل'}
                    </p>
                    <div className="chat-item__meta">
                      <span className="chat-item__time">
                        <Clock size={12} />
                        {chat.last_message_time || '--:--'}
                      </span>
                      {chat.unread_count > 0 && (
                        <span className="chat-item__unread-badge">{chat.unread_count}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="chat-item__status-section">
                    <div 
                      className="chat-item__status" 
                      style={{ background: getStatusColor(chat.client?.status) }}
                    >
                      {getStatusLabel(chat.client?.status)}
                    </div>
                    
                    <motion.button
                      className="chat-item__delete-btn"
                      onClick={(e) => handleDeleteConversation(e, chat.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="حذف المحادثة"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                    
                    <ChevronRight size={16} className="chat-item__chevron" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {filteredChats.length === 0 && !loading && (
        <motion.div
          className="chat-list__empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <MessageSquare size={64} />
          <h3>لا توجد محادثات</h3>
          <p>
            {searchTerm 
              ? 'لم يتم العثور على نتائج للبحث' 
              : 'ابدأ محادثة جديدة مع أحد المتدربين'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ChatList;
