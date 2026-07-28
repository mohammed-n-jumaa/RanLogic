import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Save,
  Check,
  AlertCircle,
  ChevronDown,
  MessageSquare,
  Mail,
  Calendar,
  User,
  CheckCircle,
  Globe,
  Languages,
  Eye,
  EyeOff
} from 'lucide-react';
import Swal from 'sweetalert2';
import faqApi from '../../../api/faqApi';
import './FAQ.scss';

const FAQ = () => {
  // Section Settings
  const [sectionSettings, setSectionSettings] = useState({
    titleAr: '',
    titleEn: '',
    subtitleAr: '',
    subtitleEn: ''
  });
  
  // Separate Arabic and English Questions
  const [arabicQuestions, setArabicQuestions] = useState([]);
  const [englishQuestions, setEnglishQuestions] = useState([]);
  
  // User Questions from Form
  const [userQuestions, setUserQuestions] = useState([]);
  
  // UI State
  const [editingArabic, setEditingArabic] = useState(null);
  const [editingEnglish, setEditingEnglish] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('arabic');
  const [activeUserTab, setActiveUserTab] = useState('faq');
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Load data on mount
  useEffect(() => {
    fetchFaqData();
  }, []);
  
  // Fetch FAQ data
  const fetchFaqData = async () => {
    setIsLoading(true);
    try {
      const response = await faqApi.getAll();
      
      if (response.success && response.data) {
        const { section, arabic_questions, english_questions, user_questions, unread_count } = response.data;
        
        // Set section
        if (section) {
          setSectionSettings({
            titleEn: section.title_en || '',
            titleAr: section.title_ar || '',
            subtitleEn: section.subtitle_en || '',
            subtitleAr: section.subtitle_ar || ''
          });
        }
        
        // Set questions
        setArabicQuestions(arabic_questions || []);
        setEnglishQuestions(english_questions || []);
        setUserQuestions(user_questions || []);
        setUnreadCount(unread_count || 0);
      }
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
      Swal.fire({
        title: 'خطأ',
        text: 'فشل تحميل البيانات',
        icon: 'error',
        confirmButtonColor: '#e91e63'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Arabic Questions Management
  const handleAddArabicQuestion = () => {
    const newQuestion = {
      id: null,
      category: '',
      question: '',
      answer: '',
      icon: '❓'
    };
    setArabicQuestions([...arabicQuestions, newQuestion]);
    setEditingArabic(arabicQuestions.length);
  };
  
  const handleUpdateArabicQuestion = (index, field, value) => {
    const updated = [...arabicQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setArabicQuestions(updated);
  };
  
  const handleDeleteArabicQuestion = async (index) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'سيتم حذف السؤال نهائياً',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E91E63',
      cancelButtonColor: '#757575',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء'
    });
    
    if (!result.isConfirmed) return;
    
    setArabicQuestions(arabicQuestions.filter((_, i) => i !== index));
    if (editingArabic === index) setEditingArabic(null);
  };
  
  // English Questions Management
  const handleAddEnglishQuestion = () => {
    const newQuestion = {
      id: null,
      category: '',
      question: '',
      answer: '',
      icon: '❓'
    };
    setEnglishQuestions([...englishQuestions, newQuestion]);
    setEditingEnglish(englishQuestions.length);
  };
  
  const handleUpdateEnglishQuestion = (index, field, value) => {
    const updated = [...englishQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setEnglishQuestions(updated);
  };
  
  const handleDeleteEnglishQuestion = async (index) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'The question will be permanently deleted',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E91E63',
      cancelButtonColor: '#757575',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    });
    
    if (!result.isConfirmed) return;
    
    setEnglishQuestions(englishQuestions.filter((_, i) => i !== index));
    if (editingEnglish === index) setEditingEnglish(null);
  };
  
  // User Questions Management
  const handleMarkAsRead = async (id) => {
    try {
      await faqApi.markAsRead(id);
      
      setUserQuestions(userQuestions.map(q => 
        q.id === id ? { ...q, is_read: true } : q
      ));
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      Swal.fire({
        icon: 'success',
        title: 'تم',
        text: 'تم تحديد السؤال كمقروء',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };
  
  const handleMarkAsUnread = async (id) => {
    try {
      await faqApi.markAsUnread(id);
      
      setUserQuestions(userQuestions.map(q => 
        q.id === id ? { ...q, is_read: false } : q
      ));
      
      setUnreadCount(prev => prev + 1);
      
      Swal.fire({
        icon: 'success',
        title: 'تم',
        text: 'تم تحديد السؤال كغير مقروء',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error marking as unread:', error);
    }
  };
  
  const handleDeleteUserQuestion = async (id) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'سيتم حذف السؤال نهائياً',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E91E63',
      cancelButtonColor: '#757575',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء'
    });
    
    if (!result.isConfirmed) return;
    
    try {
      await faqApi.deleteUserQuestion(id);
      
      setUserQuestions(userQuestions.filter(q => q.id !== id));
      
      Swal.fire({
        icon: 'success',
        title: 'تم الحذف',
        text: 'تم حذف السؤال بنجاح',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      Swal.fire({
        title: 'خطأ',
        text: 'فشل حذف السؤال',
        icon: 'error',
        confirmButtonColor: '#e91e63'
      });
    }
  };
  
  // Save all changes
  const handleSaveChanges = async () => {
    // Validate
    if (!sectionSettings.titleAr || !sectionSettings.titleEn) {
      Swal.fire({
        title: 'تنبيه',
        text: 'يرجى ملء عنوان القسم بالعربية والإنجليزية',
        icon: 'warning',
        confirmButtonColor: '#e91e63'
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const data = {
        section: {
          title_en: sectionSettings.titleEn,
          title_ar: sectionSettings.titleAr,
          subtitle_en: sectionSettings.subtitleEn,
          subtitle_ar: sectionSettings.subtitleAr
        },
        arabic_questions: arabicQuestions.map((q, index) => ({
          id: q.id,
          category: q.category,
          question: q.question,
          answer: q.answer,
          icon: q.icon,
          order: index
        })),
        english_questions: englishQuestions.map((q, index) => ({
          id: q.id,
          category: q.category,
          question: q.question,
          answer: q.answer,
          icon: q.icon,
          order: index
        }))
      };
      
      const response = await faqApi.updateAll(data);
      
      if (response.success) {
        setUploadStatus('success');
        setTimeout(() => setUploadStatus(null), 3000);
        
        Swal.fire({
          icon: 'success',
          title: 'تم الحفظ بنجاح!',
          text: 'تم حفظ جميع التغييرات',
          confirmButtonColor: '#E91E63',
          timer: 2000
        });
        
        // Refresh data
        await fetchFaqData();
        setEditingArabic(null);
        setEditingEnglish(null);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      setUploadStatus('error');
      setTimeout(() => setUploadStatus(null), 3000);
      
      Swal.fire({
        title: 'خطأ',
        text: error.response?.data?.message || 'فشل حفظ التغييرات',
        icon: 'error',
        confirmButtonColor: '#e91e63'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="faq-admin">
        <div className="faq-admin__loading">
          <div className="spinner-large"></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="faq-admin">
      {/* Page Header */}
      <motion.div
        className="faq-admin__header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="faq-admin__header-content">
          <div className="faq-admin__title-section">
            <h1 className="faq-admin__title">
              <HelpCircle size={32} />
              إدارة الأسئلة الشائعة
            </h1>
            <p className="faq-admin__subtitle">
              قم بإدارة الأسئلة الشائعة وأسئلة المستخدمين
            </p>
          </div>
          
          <motion.button
            className="faq-admin__save-btn"
            onClick={handleSaveChanges}
            disabled={isSaving}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSaving ? (
              <>
                <div className="spinner"></div>
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>حفظ التغييرات</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
      
      {/* Main Tabs */}
      <div className="faq-admin__main-tabs">
        <button
          className={`faq-admin__main-tab ${activeUserTab === 'faq' ? 'faq-admin__main-tab--active' : ''}`}
          onClick={() => setActiveUserTab('faq')}
        >
          <HelpCircle size={20} />
          الأسئلة الشائعة
        </button>
        <button
          className={`faq-admin__main-tab ${activeUserTab === 'user-questions' ? 'faq-admin__main-tab--active' : ''}`}
          onClick={() => setActiveUserTab('user-questions')}
        >
          <MessageSquare size={20} />
          أسئلة المستخدمين
          {unreadCount > 0 && (
            <span className="faq-admin__main-tab-badge">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
      
      {/* FAQ Management Section */}
      {activeUserTab === 'faq' && (
        <div className="faq-admin__content">
          <motion.div
            className="faq-admin__editor-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Section Settings */}
            <div className="section-settings-card">
              <h2 className="section-settings-card__title">
                <Globe size={24} />
                إعدادات القسم
              </h2>
              
              <div className="settings-grid">
                <div className="form-group">
                  <label className="form-label">🇸🇦 العنوان (عربي)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={sectionSettings.titleAr}
                    onChange={(e) => setSectionSettings({...sectionSettings, titleAr: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">🇬🇧 Title (English)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={sectionSettings.titleEn}
                    onChange={(e) => setSectionSettings({...sectionSettings, titleEn: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">🇸🇦 الوصف (عربي)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={sectionSettings.subtitleAr}
                    onChange={(e) => setSectionSettings({...sectionSettings, subtitleAr: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">🇬🇧 Subtitle (English)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={sectionSettings.subtitleEn}
                    onChange={(e) => setSectionSettings({...sectionSettings, subtitleEn: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            {/* Language Tabs */}
            <div className="language-tabs">
              <button
                className={`language-tab ${activeTab === 'arabic' ? 'language-tab--active' : ''}`}
                onClick={() => setActiveTab('arabic')}
              >
                <Languages size={18} />
                🇸🇦 الأسئلة العربية ({arabicQuestions.length})
              </button>
              <button
                className={`language-tab ${activeTab === 'english' ? 'language-tab--active' : ''}`}
                onClick={() => setActiveTab('english')}
              >
                <Languages size={18} />
                🇬🇧 English Questions ({englishQuestions.length})
              </button>
            </div>
            
            {/* Questions List */}
            <div className="questions-list-card">
              <div className="questions-list-card__header">
                <h2 className="questions-list-card__title">
                  {activeTab === 'arabic' ? 'الأسئلة' : 'Questions'}
                </h2>
                <button
                  className="questions-list-card__add-btn"
                  onClick={activeTab === 'arabic' ? handleAddArabicQuestion : handleAddEnglishQuestion}
                >
                  <Plus size={18} />
                  {activeTab === 'arabic' ? 'إضافة سؤال' : 'Add Question'}
                </button>
              </div>
              
              <div className="questions-list">
                {(activeTab === 'arabic' ? arabicQuestions : englishQuestions).map((question, index) => (
                  <QuestionCard
                    key={index}
                    question={question}
                    index={index}
                    isEditing={activeTab === 'arabic' ? editingArabic === index : editingEnglish === index}
                    isExpanded={expandedQuestion === index}
                    lang={activeTab}
                    onEdit={() => activeTab === 'arabic' ? setEditingArabic(index) : setEditingEnglish(index)}
                    onSave={() => activeTab === 'arabic' ? setEditingArabic(null) : setEditingEnglish(null)}
                    onCancel={() => {
                      if (!question.question) {
                        if (activeTab === 'arabic') {
                          handleDeleteArabicQuestion(index);
                        } else {
                          handleDeleteEnglishQuestion(index);
                        }
                      }
                      activeTab === 'arabic' ? setEditingArabic(null) : setEditingEnglish(null);
                    }}
                    onDelete={() => activeTab === 'arabic' ? handleDeleteArabicQuestion(index) : handleDeleteEnglishQuestion(index)}
                    onUpdate={(field, value) => activeTab === 'arabic' ? handleUpdateArabicQuestion(index, field, value) : handleUpdateEnglishQuestion(index, field, value)}
                    onToggleExpand={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* User Questions Section */}
      {activeUserTab === 'user-questions' && (
        <UserQuestionsPanel
          questions={userQuestions}
          onMarkAsRead={handleMarkAsRead}
          onMarkAsUnread={handleMarkAsUnread}
          onDelete={handleDeleteUserQuestion}
        />
      )}
    </div>
  );
};

// Question Card Component (same as before)
const QuestionCard = ({ question, index, isEditing, isExpanded, lang, onEdit, onSave, onCancel, onDelete, onUpdate, onToggleExpand }) => {
  return (
    <motion.div
      className={`question-card ${isEditing ? 'question-card--editing' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {isEditing ? (
        <div className="question-card__form">
          <div className="question-card__icon-section">
            <label className="form-label">{lang === 'arabic' ? 'الأيقونة' : 'Icon'}</label>
            <input
              type="text"
              className="question-card__icon-input"
              value={question.icon}
              onChange={(e) => onUpdate('icon', e.target.value)}
              placeholder="😊"
              maxLength="2"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">{lang === 'arabic' ? 'الفئة' : 'Category'}</label>
            <input
              type="text"
              className="form-input"
              value={question.category}
              onChange={(e) => onUpdate('category', e.target.value)}
              placeholder={lang === 'arabic' ? 'مثال: البداية' : 'Example: Getting Started'}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">{lang === 'arabic' ? 'السؤال' : 'Question'}</label>
            <input
              type="text"
              className="form-input"
              value={question.question}
              onChange={(e) => onUpdate('question', e.target.value)}
              placeholder={lang === 'arabic' ? 'السؤال...' : 'Question...'}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">{lang === 'arabic' ? 'الجواب' : 'Answer'}</label>
            <textarea
              className="form-textarea"
              value={question.answer}
              onChange={(e) => onUpdate('answer', e.target.value)}
              placeholder={lang === 'arabic' ? 'الجواب...' : 'Answer...'}
              rows="3"
            />
          </div>
          
          <div className="question-card__actions">
            <button className="question-card__save-btn" onClick={onSave}>
              <Check size={18} />
              {lang === 'arabic' ? 'حفظ' : 'Save'}
            </button>
            <button className="question-card__cancel-btn" onClick={onCancel}>
              {lang === 'arabic' ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="question-card__header">
            <div className="question-card__icon">{question.icon}</div>
            <div className="question-card__info">
              <div className="question-card__category">{question.category}</div>
              <h3 className="question-card__question">{question.question}</h3>
            </div>
            <div className="question-card__header-actions">
              <button className="question-card__action-btn" onClick={onToggleExpand}>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={18} />
                </motion.div>
              </button>
              <button className="question-card__action-btn" onClick={onEdit}>
                <Edit2 size={16} />
              </button>
              <button className="question-card__action-btn question-card__action-btn--danger" onClick={onDelete}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="question-card__content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="question-card__answer">
                  <strong>{lang === 'arabic' ? 'الجواب:' : 'Answer:'}</strong> {question.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};

// User Questions Panel Component (محدث - بدون إجابة وأرشفة)
const UserQuestionsPanel = ({ questions, onMarkAsRead, onMarkAsUnread, onDelete }) => {
  return (
    <motion.div className="user-questions-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="user-questions-card">
        <h2 className="user-questions-card__title">أسئلة المستخدمين من الفورم</h2>
        
        <div className="user-questions-list">
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              className={`user-question-item ${question.is_read ? 'user-question-item--read' : 'user-question-item--unread'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="user-question-item__header">
                <div className="user-question-item__user">
                  <div className="user-question-item__avatar">
                    <User size={20} />
                  </div>
                  <div className="user-question-item__info">
                    <h3 className="user-question-item__name">{question.name}</h3>
                    <div className="user-question-item__meta">
                      <Mail size={14} />
                      <span>{question.email}</span>
                    </div>
                    <div className="user-question-item__meta">
                      <Calendar size={14} />
                      <span>{question.date}</span>
                    </div>
                  </div>
                </div>
                
                <div className={`user-question-item__status ${question.is_read ? 'user-question-item__status--read' : 'user-question-item__status--unread'}`}>
                  {question.is_read ? (
                    <>
                      <CheckCircle size={16} />
                      <span>مقروء</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} />
                      <span>جديد</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="user-question-item__question">
                <strong>السؤال:</strong> {question.question}
              </div>
              
              <div className="user-question-item__actions">
                {question.is_read ? (
                  <button
                    className="user-question-item__action-btn"
                    onClick={() => onMarkAsUnread(question.id)}
                  >
                    <EyeOff size={16} />
                    تحديد كغير مقروء
                  </button>
                ) : (
                  <button
                    className="user-question-item__action-btn user-question-item__action-btn--primary"
                    onClick={() => onMarkAsRead(question.id)}
                  >
                    <Eye size={16} />
                    تحديد كمقروء
                  </button>
                )}
                <button
                  className="user-question-item__action-btn user-question-item__action-btn--danger"
                  onClick={() => onDelete(question.id)}
                >
                  <Trash2 size={16} />
                  حذف
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {questions.length === 0 && (
          <div className="user-questions-list__empty">
            <MessageSquare size={64} />
            <p>لا توجد أسئلة من المستخدمين</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FAQ;