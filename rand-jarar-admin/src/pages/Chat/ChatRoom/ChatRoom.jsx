// src/pages/Chat/ChatRoom/ChatRoom.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  ArrowRight,
  Send,
  Paperclip,
  MoreVertical,
  Info,
  Check,
  CheckCheck,
  Clock,
  X,
  FileText,
  Image as ImageIcon,
  Video,
  Maximize2,
  Minimize2,
  Loader2,
  Download,
  Trash2,
  AlertCircle,
  File
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  getConversation, 
  sendMessage, 
  sendFile, 
  deleteMessage,
  isFileTypeSupported,
  isFileSizeValid,
  formatFileSize,
  MAX_FILE_SIZE
} from '../../../api/chatApi';
import subscriptionsApi from '../../../api/subscriptionsApi'; // ✅ جديد لجلب gender
import './ChatRoom.scss';

// SweetAlert2 Toast configuration
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

const ChatRoom = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showClientInfo, setShowClientInfo] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // ✅ خريطة genders من API المستخدمين (id -> gender)
  const [genderMap, setGenderMap] = useState({});

  const normalizeGender = (raw) => {
    if (raw === undefined || raw === null) return null;
    const v = String(raw).trim().toLowerCase();

    // عربي
    if (v === 'ذكر' || v === 'ولد' || v === 'رجال' || v === 'رجل') return 'male';
    if (v === 'أنثى' || v === 'انثى' || v === 'بنت' || v === 'نساء' || v === 'امرأة' || v === 'مرأة')
      return 'female';

    // إنجليزي/اختصارات
    if (v === 'male' || v === 'm' || v === 'man' || v === 'boy') return 'male';
    if (v === 'female' || v === 'f' || v === 'woman' || v === 'girl') return 'female';

    // أرقام (لو عندكم)
    if (v === '1') return 'male';
    if (v === '2') return 'female';

    return null;
  };

  // ✅ جلب قائمة المستخدمين مرة واحدة وبناء genderMap
  const fetchUsersGenderMap = useCallback(async () => {
    try {
      const response = await subscriptionsApi.getUsers('');
      if (response?.success && Array.isArray(response.data)) {
        const map = {};
        response.data.forEach((u) => {
          const g =
            normalizeGender(u.gender) ||
            normalizeGender(u?.profile?.gender) ||
            normalizeGender(u?.user_gender) ||
            null;

          if (u?.id && g) map[u.id] = g;
        });
        setGenderMap(map);
      }
    } catch (err) {
      console.error('Error fetching users gender map:', err);
    }
  }, []);

  // ✅ تحديد الجندر للعميل من الماب/الرابط
  const getClientGender = useCallback((clientObj) => {
    const id = clientObj?.id || Number(clientId) || clientId;

    if (id && genderMap[id]) return genderMap[id];

    const avatarUrl =
      clientObj?.avatar ||
      clientObj?.avatar_url ||
      clientObj?.image ||
      clientObj?.avatarUrl ||
      clientObj?.photo ||
      clientObj?.photo_url ||
      '';

    const lower = String(avatarUrl || '').toLowerCase();
    if (lower.includes('default-avatar-male')) return 'male';
    if (lower.includes('default-avatar-female')) return 'female';

    return null;
  }, [genderMap, clientId]);

  // ✅ نفس منطق الهيدر لكن عبر genderMap
  const getClientAvatar = useCallback((clientObj) => {
    const fallback = 'https://i.postimg.cc/WpqHf2CH/download.png';
    if (!clientObj) return fallback;

    const avatarUrl =
      clientObj.avatar ||
      clientObj.avatar_url ||
      clientObj.image ||
      clientObj.avatarUrl ||
      clientObj.photo ||
      clientObj.photo_url ||
      '';

    const urlStr = String(avatarUrl || '').trim();
    const lower = urlStr.toLowerCase();

    // لو صورة مرفوعة (مو default)
    const isDefault = lower.includes('default-avatar') || lower.includes('/images/default');
    const hasCustomAvatar = urlStr && !isDefault;
    if (hasCustomAvatar) return urlStr;

    // لو ديفولت: نحددها حسب الجندر من الماب
    const g = getClientGender(clientObj);

    if (g === 'male') {
      return 'https://i.postimg.cc/VNmvRfK2/0b90cfaf-8167-4730-8de0-8872054ff0c5.jpg';
    }
    if (g === 'female') {
      return 'https://i.postimg.cc/bvmy9QDq/fee021a6-b60e-4456-abc4-6febcb2353c4.jpg';
    }

    // احتياط من الرابط نفسه
    if (lower.includes('default-avatar-male')) {
      return 'https://i.postimg.cc/VNmvRfK2/0b90cfaf-8167-4730-8de0-8872054ff0c5.jpg';
    }
    if (lower.includes('default-avatar-female')) {
      return 'https://i.postimg.cc/bvmy9QDq/fee021a6-b60e-4456-abc4-6febcb2353c4.jpg';
    }

    return fallback;
  }, [getClientGender]);

  // جلب المحادثة
  const fetchConversation = useCallback(async () => {
    try {
      setError(null);
      const response = await getConversation(clientId);
      if (response.success) {
        setMessages(response.data.messages || []);
        setClient(response.data.trainee);
        setConversation(response.data.conversation);
      }
    } catch (err) {
      setError('حدث خطأ أثناء جلب المحادثة');
      console.error('Error fetching conversation:', err);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  // جلب البيانات عند التحميل
  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchUsersGenderMap(), fetchConversation()]);
    };
    load();
  }, [fetchUsersGenderMap, fetchConversation]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [newMessage]);

  // تحديث الرسائل دورياً
  useEffect(() => {
    const interval = setInterval(() => {
      if (!sending) {
        fetchConversation();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchConversation, sending]);

  // إرسال رسالة نصية
  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    const messageContent = newMessage.trim();
    const tempId = `temp-${Date.now()}`;
    
    setNewMessage('');
    setSending(true);

    // إضافة الرسالة مؤقتاً
    const tempMessage = {
      id: tempId,
      sender: 'trainer',
      type: 'text',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      is_read: false,
      status: 'sending',
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const response = await sendMessage(clientId, messageContent);
      if (response.success) {
        // تحديث المحادثة من السيرفر
        await fetchConversation();
      }
    } catch (err) {
      // تحديث حالة الرسالة إلى فشل
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempId ? { ...msg, status: 'failed' } : msg
        )
      );
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  // إرسال ملف
  const handleFileUpload = async (file) => {
    if (!file) return;

    // التحقق من نوع الملف
    if (!isFileTypeSupported(file)) {
      Swal.fire({
        icon: 'error',
        title: 'نوع الملف غير مدعوم',
        text: 'الأنواع المدعومة: صور، فيديو، PDF، مستندات Word',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#e91e63',
      });
      return;
    }

    // التحقق من حجم الملف (الفيديو بدون حد)
    const extension = file.name.split('.').pop().toLowerCase();
    const videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'mkv', 'webm', '3gp', 'flv', 'm4v', 'mpeg', 'mpg'];
    const isVideo = file.type.startsWith('video/') || videoExtensions.includes(extension);
    
    if (!isVideo && !isFileSizeValid(file)) {
      Swal.fire({
        icon: 'error',
        title: 'حجم الملف كبير جداً',
        text: `الحد الأقصى ${formatFileSize(MAX_FILE_SIZE)}`,
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#e91e63',
      });
      return;
    }

    const tempId = `temp-${Date.now()}`;
    setSending(true);
    setUploadProgress(0);

    // تحديد نوع الملف (نستخدم extension المعرّف سابقاً)
    let fileType = 'file';
    
    if (file.type.startsWith('image/')) {
      fileType = 'image';
    } else if (isVideo) {
      fileType = 'video';
    } else if (file.type === 'application/pdf' || extension === 'pdf') {
      fileType = 'pdf';
    } else if (file.type.includes('word') || ['doc', 'docx'].includes(extension)) {
      fileType = 'doc';
    }

    // إنشاء preview URL للصور والفيديو
    const previewUrl = URL.createObjectURL(file);

    // إضافة الرسالة مؤقتاً
    const tempMessage = {
      id: tempId,
      sender: 'trainer',
      type: fileType,
      content: null,
      file_name: file.name,
      file_size: formatFileSize(file.size),
      file_url: previewUrl,
      timestamp: new Date().toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      is_read: false,
      status: 'sending',
      uploadProgress: 0,
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const response = await sendFile(clientId, file, '', (progress) => {
        setUploadProgress(progress);
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempId ? { ...msg, uploadProgress: progress } : msg
          )
        );
      });

      if (response.success) {
        // تحرير الـ preview URL القديم
        URL.revokeObjectURL(previewUrl);
        
        // تحديث المحادثة من السيرفر لجلب الرسالة الجديدة
        await fetchConversation();
        
        // رسالة نجاح
        Toast.fire({
          icon: 'success',
          title: 'تم إرسال الملف بنجاح'
        });
      }
    } catch (err) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempId ? { ...msg, status: 'failed' } : msg
        )
      );
      console.error('Error sending file:', err);
      
      if (err.response?.status === 413) {
        Swal.fire({
          icon: 'error',
          title: 'فشل رفع الملف',
          text: 'حجم الملف كبير جداً. يرجى رفع ملف أصغر.',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#e91e63',
        });
      } else if (err.response?.status === 422) {
        Swal.fire({
          icon: 'error',
          title: 'فشل رفع الملف',
          text: 'نوع الملف غير مدعوم.',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#e91e63',
        });
      } else {
        Toast.fire({
          icon: 'error',
          title: 'فشل إرسال الملف'
        });
      }
    } finally {
      setSending(false);
      setUploadProgress(0);
    }
  };

  // حذف رسالة
  const handleDeleteMessage = async (messageId) => {
    const result = await Swal.fire({
      title: 'حذف الرسالة',
      text: 'هل أنت متأكد من حذف هذه الرسالة؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteMessage(messageId);
      if (response.success) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        Toast.fire({
          icon: 'success',
          title: 'تم حذف الرسالة'
        });
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      Toast.fire({
        icon: 'error',
        title: 'فشل حذف الرسالة'
      });
    }
  };

  // إعادة إرسال رسالة فاشلة
  const handleRetryMessage = (message) => {
    // حذف الرسالة الفاشلة
    setMessages(prev => prev.filter(m => m.id !== message.id));
    
    // إعادة الإرسال
    if (message.type === 'text') {
      setNewMessage(message.content);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
      e.target.value = null;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // الحصول على أيقونة نوع الملف
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText size={28} className="file-icon file-icon--pdf" />;
      case 'doc':
        return <File size={28} className="file-icon file-icon--doc" />;
      case 'image':
        return <ImageIcon size={28} className="file-icon file-icon--image" />;
      case 'video':
        return <Video size={28} className="file-icon file-icon--video" />;
      default:
        return <File size={28} className="file-icon" />;
    }
  };

  // رندر الرسالة حسب النوع
  const renderMessageContent = (message) => {
    switch (message.type) {
      case 'image':
        return (
          <div className="message-media">
            <div className="message-media__image-wrapper">
              <img 
                src={message.file_url} 
                alt={message.file_name || 'صورة'} 
                loading="lazy"
                onClick={() => setSelectedImage(message.file_url)}
              />
              {message.status !== 'sending' && (
                <div className="message-media__overlay">
                  <button 
                    className="message-media__expand-btn"
                    onClick={() => setSelectedImage(message.file_url)}
                  >
                    <Maximize2 size={20} />
                  </button>
                </div>
              )}
            </div>
            {message.content && (
              <p className="message-media__caption">{message.content}</p>
            )}
          </div>
        );
      
      case 'video':
        return (
          <div className="message-media message-media--video">
            <div className="message-media__video-wrapper">
              <video controls preload="metadata">
                <source src={message.file_url} type="video/mp4" />
                متصفحك لا يدعم تشغيل الفيديو
              </video>
            </div>
            <div className="message-media__info">
              <span className="message-media__filename">{message.file_name}</span>
              {message.file_size && (
                <span className="message-media__size">{message.file_size}</span>
              )}
            </div>
            {message.content && (
              <p className="message-media__caption">{message.content}</p>
            )}
          </div>
        );
      
      case 'pdf':
      case 'doc':
      case 'file':
        return (
          <div className={`message-file message-file--${message.type}`}>
            <div className="message-file__icon-wrapper">
              {getFileIcon(message.type)}
            </div>
            <div className="message-file__info">
              <span className="message-file__name" title={message.file_name}>
                {message.file_name}
              </span>
              <span className="message-file__size">{message.file_size}</span>
            </div>
            <a 
              href={message.file_url} 
              download={message.file_name}
              target="_blank"
              rel="noopener noreferrer"
              className="message-file__download"
              onClick={(e) => e.stopPropagation()}
            >
              <Download size={18} />
            </a>
          </div>
        );
      
      default:
        return <div className="message__content">{message.content}</div>;
    }
  };

  if (loading) {
    return (
      <div className="chat-room chat-room--loading">
        <div className="chat-room__loader">
          <Loader2 size={48} className="spinner" />
          <p>جاري تحميل المحادثة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-room chat-room--error">
        <div className="chat-room__error-content">
          <AlertCircle size={48} />
          <p>{error}</p>
          <button onClick={fetchConversation}>إعادة المحاولة</button>
          <button onClick={() => navigate('/chat')}>العودة للمحادثات</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`chat-room ${isFullscreen ? 'chat-room--fullscreen' : ''}`}>
      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="image-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="image-lightbox__close"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>
            <img src={selectedImage} alt="صورة مكبرة" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        className="chat-room__header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="chat-room__header-main">
          <button 
            className="chat-room__back-btn" 
            onClick={() => navigate('/chat')}
          >
            <ArrowRight size={20} />
          </button>

          <div className="chat-room__client-info" onClick={() => setShowClientInfo(!showClientInfo)}>
            <div className="chat-room__client-avatar">
              {/* ✅ هنا التعديل: نفس منطق الهيدر/السبسكربشن */}
              <img
                src={getClientAvatar(client)}
                alt={client?.name || 'Client'}
                onError={(e) => {
                  e.target.src = 'https://i.postimg.cc/WpqHf2CH/download.png';
                }}
              />
              {client?.is_online && <div className="chat-room__online-dot" />}
            </div>

            <div className="chat-room__client-details">
              <h2 className="chat-room__client-name">{client?.name || 'مجهول'}</h2>
              <div className="chat-room__client-status">
                {client?.is_online ? (
                  <>
                    <div className="chat-room__status-dot chat-room__status-dot--online" />
                    <span>متصل الآن</span>
                  </>
                ) : (
                  <>
                    <Clock size={12} />
                    <span>{client?.last_seen || 'غير متصل'}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="chat-room__header-actions">
          <button 
            className="chat-room__action-btn"
            onClick={() => setShowClientInfo(!showClientInfo)}
          >
            <Info size={20} />
          </button>
          
          <button 
            className="chat-room__action-btn chat-room__fullscreen-btn"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
          
          <button className="chat-room__action-btn">
            <MoreVertical size={20} />
          </button>
        </div>
      </motion.div>

      {/* Client Info Panel */}
      <AnimatePresence>
        {showClientInfo && client && (
          <motion.div
            className="client-info-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="client-info-panel__header">
              <h3>معلومات المتدرب</h3>
              <button onClick={() => setShowClientInfo(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="client-info-panel__content">
              <div className="client-info-grid">
                <div className="client-info-item">
                  <span className="client-info-label">الهدف</span>
                  <span className="client-info-value">{client.goal || 'غير محدد'}</span>
                </div>
                <div className="client-info-item">
                  <span className="client-info-label">الوزن</span>
                  <span className="client-info-value">{client.weight || 'غير محدد'}</span>
                </div>
                <div className="client-info-item">
                  <span className="client-info-label">الطول</span>
                  <span className="client-info-value">{client.height || 'غير محدد'}</span>
                </div>
                <div className="client-info-item">
                  <span className="client-info-label">العمر</span>
                  <span className="client-info-value">{client.age ? `${client.age} سنة` : 'غير محدد'}</span>
                </div>
                <div className="client-info-item client-info-item--full">
                  <span className="client-info-label">البريد الإلكتروني</span>
                  <span className="client-info-value">{client.email || 'غير محدد'}</span>
                </div>
                {client.phone && (
                  <div className="client-info-item client-info-item--full">
                    <span className="client-info-label">رقم الهاتف</span>
                    <span className="client-info-value">{client.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <div className="chat-room__window">
        {/* Welcome Message */}
        <div className="chat-room__welcome">
          <div className="welcome-message">
            <h3>أنت تتحدث مع {client?.name}</h3>
            <p>{client?.is_online ? 'متصل الآن' : client?.last_seen || 'غير متصل'}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-room__messages">
          <div className="messages-container">
            {messages.map((message, index) => {
              const isTrainer = message.sender === 'trainer';
              const isFirstOfType = index === 0 || messages[index - 1].sender !== message.sender;

              return (
                <motion.div
                  key={message.id}
                  className={`message ${isTrainer ? 'message--trainer' : 'message--client'} ${isFirstOfType ? 'message--first' : ''} ${message.status === 'failed' ? 'message--failed' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  {/* Upload Progress */}
                  {message.status === 'sending' && message.uploadProgress !== undefined && message.uploadProgress > 0 && (
                    <div className="message__upload-progress">
                      <div 
                        className="message__upload-progress-bar"
                        style={{ width: `${message.uploadProgress}%` }}
                      />
                      <span className="message__upload-progress-text">
                        {message.uploadProgress}%
                      </span>
                    </div>
                  )}

                  {renderMessageContent(message)}

                  <div className="message__meta">
                    <span className="message__time">{message.timestamp}</span>
                    {isTrainer && (
                      <span className="message__status">
                        {message.status === 'sending' ? (
                          <Loader2 size={12} className="spinner" />
                        ) : message.status === 'failed' ? (
                          <AlertCircle size={12} />
                        ) : message.is_read ? (
                          <CheckCheck size={12} />
                        ) : (
                          <Check size={12} />
                        )}
                      </span>
                    )}
                    
                    {/* Delete button */}
                    {isTrainer && message.status !== 'sending' && !String(message.id).startsWith('temp-') && (
                      <button 
                        className="message__delete-btn"
                        onClick={() => handleDeleteMessage(message.id)}
                        title="حذف الرسالة"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>

                  {/* Retry button */}
                  {message.status === 'failed' && (
                    <button 
                      className="message__retry-btn"
                      onClick={() => handleRetryMessage(message)}
                    >
                      فشل الإرسال - انقر للمحاولة مرة أخرى
                    </button>
                  )}
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} className="messages-end" />
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="chat-room__input">
        <div className="message-input">
          <div className="message-input__actions">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
            
            <motion.button
              className="message-input__action-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={sending}
            >
              <Paperclip size={20} />
            </motion.button>
          </div>

          <div className="message-input__field">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب رسالتك هنا..."
              rows="1"
              disabled={sending}
            />
          </div>

          <div className="message-input__send">
            <motion.button
              className="message-input__send-btn"
              onClick={handleSendMessage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={!newMessage.trim() || sending}
            >
              {sending ? <Loader2 size={20} className="spinner" /> : <Send size={20} />}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
