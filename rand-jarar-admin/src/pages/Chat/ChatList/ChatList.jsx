import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  Trash2,
  MoreVertical,
  Archive,
  ArchiveRestore,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  deleteConversation,
  getChatStats,
  getConversations,
  archiveConversation,
  unarchiveConversation,
  getArchivedConversations,
} from '../../../api/chatApi';
import { getEcho } from '../../../lib/echo';
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
    active_trainees: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showingArchived, setShowingArchived] = useState(false);

  // dropdown state
  const [openItemMenu, setOpenItemMenu] = useState(null);
  const [showGlobalMenu, setShowGlobalMenu] = useState(false);

  const subscriptionsRef = useRef({});
  const globalMenuRef = useRef(null);
  const itemMenuRefs = useRef({});

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (globalMenuRef.current && !globalMenuRef.current.contains(e.target)) {
        setShowGlobalMenu(false);
      }
      if (openItemMenu !== null) {
        const ref = itemMenuRefs.current[openItemMenu];
        if (ref && !ref.contains(e.target)) {
          setOpenItemMenu(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openItemMenu]);

  const getDefaultAvatar = (clientObj) => {
    const fallback = 'https://i.postimg.cc/WpqHf2CH/download.png';
    if (!clientObj) return fallback;

    const avatarUrl = clientObj.image || clientObj.avatar_url || clientObj.avatar || '';
    const isServerDefault = !avatarUrl || String(avatarUrl).includes('default-avatar');
    const hasCustomAvatar = avatarUrl && !isServerDefault;

    if (hasCustomAvatar) return avatarUrl;
    if (avatarUrl && String(avatarUrl).includes('default-avatar-male')) {
      return 'https://i.postimg.cc/VNmvRfK2/0b90cfaf-8167-4730-8de0-8872054ff0c5.jpg';
    }
    if (avatarUrl && String(avatarUrl).includes('default-avatar-female')) {
      return 'https://i.postimg.cc/bvmy9QDq/fee021a6-b60e-4456-abc4-6febcb2353c4.jpg';
    }

    return fallback;
  };

  const fetchConversations = useCallback(async (search = '') => {
    try {
      setError(null);
      const response = await getConversations(search);
      if (response.success) {
        setChats(response.data || []);
      }
    } catch (err) {
      setError('حدث خطأ أثناء جلب المحادثات');
      console.error('Error fetching conversations:', err);
    }
  }, []);

  const fetchArchivedConversations = useCallback(async (search = '') => {
    try {
      setError(null);
      const response = await getArchivedConversations(search);
      if (response.success) {
        setChats(response.data || []);
      }
    } catch (err) {
      setError('حدث خطأ أثناء جلب المحادثات المؤرشفة');
      console.error('Error fetching archived conversations:', err);
    }
  }, []);

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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchConversations(), fetchStats()]);
      setLoading(false);
    };

    loadData();
  }, [fetchConversations, fetchStats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showingArchived) {
        fetchArchivedConversations(searchTerm);
      } else {
        fetchConversations(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchConversations, fetchArchivedConversations, showingArchived]);

  useEffect(() => {
    const echo = getEcho();
    const adminListChannel = echo.private('admin.chat.list');

    adminListChannel.listen('.chat.admin.list.updated', (payload) => {
      if (!payload?.conversation) return;

      if (!showingArchived) {
        setChats((prev) => {
          const filtered = prev.filter((chat) => Number(chat.id) !== Number(payload.conversation.id));
          return [payload.conversation, ...filtered];
        });
      }

      fetchStats();
    });

    return () => {
      echo.leave('private-admin.chat.list');
    };
  }, [fetchStats, showingArchived]);

  useEffect(() => {
    const echo = getEcho();
    const activeConversationIds = new Set(chats.map((chat) => chat.id));

    chats.forEach((chat) => {
      if (!chat?.id || subscriptionsRef.current[chat.id]) return;

      const presence = echo.join(`chat.${chat.id}`);

      presence.here((users) => {
        const traineeExists = users.some((u) => u.role === 'user');
        setChats((prev) =>
          prev.map((item) => (item.id === chat.id ? { ...item, is_online: traineeExists } : item))
        );
      });

      presence.joining((user) => {
        if (user.role === 'user') {
          setChats((prev) =>
            prev.map((item) => (item.id === chat.id ? { ...item, is_online: true } : item))
          );
          setStats((prev) => ({ ...prev, online_count: prev.online_count + 1 }));
        }
      });

      presence.leaving((user) => {
        if (user.role === 'user') {
          setChats((prev) =>
            prev.map((item) => (item.id === chat.id ? { ...item, is_online: false } : item))
          );
          setStats((prev) => ({ ...prev, online_count: Math.max(0, prev.online_count - 1) }));
        }
      });

      subscriptionsRef.current[chat.id] = true;
    });

    Object.keys(subscriptionsRef.current).forEach((id) => {
      if (!activeConversationIds.has(Number(id))) {
        echo.leave(`chat.${id}`);
        delete subscriptionsRef.current[id];
      }
    });

    return () => {};
  }, [chats]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (showingArchived) {
      await fetchArchivedConversations(searchTerm);
    } else {
      await Promise.all([fetchConversations(searchTerm), fetchStats()]);
    }
    setRefreshing(false);
  };

  const handleShowArchived = async () => {
    setShowGlobalMenu(false);
    setShowingArchived(true);
    setLoading(true);
    await fetchArchivedConversations(searchTerm);
    setLoading(false);
  };

  const handleShowAll = async () => {
    setShowingArchived(false);
    setLoading(true);
    await fetchConversations(searchTerm);
    setLoading(false);
  };

  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'unread') return chat.unread_count > 0;
      return chat.client?.status === filterStatus;
    });
  }, [chats, filterStatus]);

  const handleChatSelect = (chat) => {
    navigate(`/chat/${chat.trainee_id}`);
  };

  const handleDeleteConversation = async (e, conversationId) => {
    e.stopPropagation();
    setOpenItemMenu(null);

    if (!window.confirm('هل أنت متأكد من حذف هذه المحادثة؟')) return;

    try {
      const response = await deleteConversation(conversationId);
      if (response.success) {
        setChats((prev) => prev.filter((chat) => chat.id !== conversationId));
        fetchStats();
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
    }
  };

  const handleArchiveConversation = async (e, conversationId) => {
    e.stopPropagation();
    setOpenItemMenu(null);

    try {
      const response = await archiveConversation(conversationId);
      if (response.success) {
        setChats((prev) => prev.filter((chat) => chat.id !== conversationId));
        fetchStats();
      }
    } catch (err) {
      console.error('Error archiving conversation:', err);
    }
  };

  const handleUnarchiveConversation = async (e, conversationId) => {
    e.stopPropagation();
    setOpenItemMenu(null);

    try {
      const response = await unarchiveConversation(conversationId);
      if (response.success) {
        setChats((prev) => prev.filter((chat) => chat.id !== conversationId));
      }
    } catch (err) {
      console.error('Error unarchiving conversation:', err);
    }
  };

  const toggleItemMenu = (e, chatId) => {
    e.stopPropagation();
    setOpenItemMenu((prev) => (prev === chatId ? null : chatId));
    setShowGlobalMenu(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#4caf50';
      case 'expired':
        return '#f44336';
      case 'pending':
        return '#ff9800';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'expired':
        return 'منتهي';
      case 'pending':
        return 'معلّق';
      default:
        return 'غير محدد';
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
      <motion.div className="chat-list__header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="chat-list__header-content">
          <div className="chat-list__title-section">
            <h1 className="chat-list__title">
              <MessageSquareMore size={32} />
              {showingArchived ? 'المحادثات المؤرشفة' : 'محادثات المتدربين'}
            </h1>
            <p className="chat-list__subtitle">
              {showingArchived ? 'عرض المحادثات المؤرشفة' : 'تواصل مع المتدربين ومتابعة المحادثات'}
            </p>
          </div>

          <div className="chat-list__header-actions">
            {showingArchived && (
              <motion.button
                className="chat-list__back-btn"
                onClick={handleShowAll}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight size={18} />
                العودة للمحادثات
              </motion.button>
            )}

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
        </div>
      </motion.div>

      {!showingArchived && (
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
      )}

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

        {/* Global three-dots menu */}
        {!showingArchived && (
          <div className="chat-global-menu" ref={globalMenuRef}>
            <motion.button
              className="chat-global-menu__trigger"
              onClick={() => setShowGlobalMenu((prev) => !prev)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="خيارات إضافية"
            >
              <MoreVertical size={20} />
            </motion.button>

            <AnimatePresence>
              {showGlobalMenu && (
                <motion.div
                  className="chat-dropdown"
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <button
                    className="chat-dropdown__item"
                    onClick={handleShowArchived}
                  >
                    <Archive size={16} />
                    المحادثات المؤرشفة
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {error && (
        <motion.div className="chat-list__error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p>{error}</p>
          <button onClick={handleRefresh}>إعادة المحاولة</button>
        </motion.div>
      )}

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
                transition={{ delay: index * 0.03 }}
                whileHover={{ x: 5 }}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="chat-item__left">
                  <div className="chat-item__avatar">
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
                    <p className="chat-item__last-message">{chat.last_message || 'لا توجد رسائل'}</p>
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
                    <div className="chat-item__status" style={{ background: getStatusColor(chat.client?.status) }}>
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

                    {/* Per-item three-dots menu */}
                    <div
                      className="chat-item__menu-wrapper"
                      ref={(el) => (itemMenuRefs.current[chat.id] = el)}
                    >
                      <motion.button
                        className="chat-item__more-btn"
                        onClick={(e) => toggleItemMenu(e, chat.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="خيارات"
                      >
                        <MoreVertical size={16} />
                      </motion.button>

                      <AnimatePresence>
                        {openItemMenu === chat.id && (
                          <motion.div
                            className="chat-dropdown chat-dropdown--item"
                            initial={{ opacity: 0, scale: 0.95, y: -8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -8 }}
                            transition={{ duration: 0.15 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {showingArchived ? (
                              <button
                                className="chat-dropdown__item"
                                onClick={(e) => handleUnarchiveConversation(e, chat.id)}
                              >
                                <ArchiveRestore size={15} />
                                إلغاء الأرشفة
                              </button>
                            ) : (
                              <button
                                className="chat-dropdown__item"
                                onClick={(e) => handleArchiveConversation(e, chat.id)}
                              >
                                <Archive size={15} />
                                أرشفة المحادثة
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <ChevronRight size={16} className="chat-item__chevron" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {filteredChats.length === 0 && !loading && (
        <motion.div className="chat-list__empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <MessageSquare size={64} />
          <h3>{showingArchived ? 'لا توجد محادثات مؤرشفة' : 'لا توجد محادثات'}</h3>
          <p>{searchTerm ? 'لم يتم العثور على نتائج للبحث' : showingArchived ? 'لم تقم بأرشفة أي محادثة بعد' : 'ابدأ محادثة جديدة مع أحد المتدربين'}</p>
        </motion.div>
      )}
    </div>
  );
};

export default ChatList;