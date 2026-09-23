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
  const [sectionSettings, setSectionSettings] = useState({
    titleAr: '',
    titleEn: '',
    subtitleAr: '',
    subtitleEn: '',
  });

  const [arabicQuestions, setArabicQuestions] = useState([]);
  const [englishQuestions, setEnglishQuestions] = useState([]);
  const [userQuestions, setUserQuestions] = useState([]);

  const [editingArabic, setEditingArabic] = useState(null);
  const [editingEnglish, setEditingEnglish] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('arabic');
  const [activeUserTab, setActiveUserTab] = useState('faq');
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchFaqData();
  }, []);

  const fetchFaqData = async () => {
    setIsLoading(true);
    try {
      const response = await faqApi.getAll();
      if (response.success && response.data) {
        const { section, arabic_questions, english_questions, user_questions, unread_count } = response.data;
        if (section) {
          setSectionSettings({
            titleEn: section.title_en || '',
            titleAr: section.title_ar || '',
            subtitleEn: section.subtitle_en || '',
            subtitleAr: section.subtitle_ar || '',
          });
        }
        setArabicQuestions(arabic_questions || []);
        setEnglishQuestions(english_questions || []);
        setUserQuestions(user_questions || []);
        setUnreadCount(unread_count || 0);
      }
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
      Swal.fire({ title: 'خطأ', text: 'فشل تحميل البيانات', icon: 'error', confirmButtonColor: '#e91e63' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddArabicQuestion = () => {
    setArabicQuestions([...arabicQuestions, { id: null, category: '', question: '', answer: '', icon: '❓' }]);
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
      cancelButtonText: 'إلغاء',
    });
    if (!result.isConfirmed) return;
    setArabicQuestions(arabicQuestions.filter((_, i) => i !== index));
    if (editingArabic === index) setEditingArabic(null);
  };

  const handleAddEnglishQuestion = () => {
    setEnglishQuestions([...englishQuestions, { id: null, category: '', question: '', answer: '', icon: '❓' }]);
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
      cancelButtonText: 'Cancel',
    });
    if (!result.isConfirmed) return;
    setEnglishQuestions(englishQuestions.filter((_, i) => i !== index));
    if (editingEnglish === index) setEditingEnglish(null);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await faqApi.markAsRead(id);
      setUserQuestions(userQuestions.map((q) => (q.id === id ? { ...q, is_read: true } : q)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAsUnread = async (id) => {
    try {
      await faqApi.markAsUnread(id);
      setUserQuestions(userQuestions.map((q) => (q.id === id ? { ...q, is_read: false } : q)));
      setUnreadCount((prev) => prev + 1);
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
      cancelButtonText: 'إلغاء',
    });
    if (!result.isConfirmed) return;
    try {
      await faqApi.deleteUserQuestion(id);
      setUserQuestions(userQuestions.filter((q) => q.id !== id));
      Swal.fire({ icon: 'success', title: 'تم الحذف', text: 'تم حذف السؤال بنجاح', timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error('Error deleting question:', error);
      Swal.fire({ title: 'خطأ', text: 'فشل حذف السؤال', icon: 'error', confirmButtonColor: '#e91e63' });
    }
  };

  const handleSaveChanges = async () => {
    if (!sectionSettings.titleAr || !sectionSettings.titleEn) {
      Swal.fire({ title: 'تنبيه', text: 'يرجى ملء عنوان القسم بالعربية والإنجليزية', icon: 'warning', confirmButtonColor: '#e91e63' });
      return;
    }
    setIsSaving(true);
    try {
      const data = {
        section: {
          title_en: sectionSettings.titleEn,
          title_ar: sectionSettings.titleAr,
          subtitle_en: sectionSettings.subtitleEn,
          subtitle_ar: sectionSettings.subtitleAr,
        },
        arabic_questions: arabicQuestions.map((q, i) => ({ id: q.id, category: q.category, question: q.question, answer: q.answer, icon: q.icon, order: i })),
        english_questions: englishQuestions.map((q, i) => ({ id: q.id, category: q.category, question: q.question, answer: q.answer, icon: q.icon, order: i })),
      };
      const response = await faqApi.updateAll(data);
      if (response.success) {
        setUploadStatus('success');
        setTimeout(() => setUploadStatus(null), 3000);
        Swal.fire({ icon: 'success', title: 'تم الحفظ بنجاح!', text: 'تم حفظ جميع التغييرات', timer: 2000, confirmButtonColor: '#E91E63' });
        await fetchFaqData();
        setEditingArabic(null);
        setEditingEnglish(null);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      setUploadStatus('error');
      setTimeout(() => setUploadStatus(null), 3000);
      Swal.fire({ title: 'خطأ', text: error.response?.data?.message || 'فشل حفظ التغييرات', icon: 'error', confirmButtonColor: '#e91e63' });
    } finally {
      setIsSaving(false);
    }
  };

  const questions = activeTab === 'arabic' ? arabicQuestions : englishQuestions;
  const editing = activeTab === 'arabic' ? editingArabic : editingEnglish;
  const setEditing = activeTab === 'arabic' ? setEditingArabic : setEditingEnglish;
  const handleAdd = activeTab === 'arabic' ? handleAddArabicQuestion : handleAddEnglishQuestion;
  const handleUpdate = activeTab === 'arabic' ? handleUpdateArabicQuestion : handleUpdateEnglishQuestion;
  const handleDeleteQ = activeTab === 'arabic' ? handleDeleteArabicQuestion : handleDeleteEnglishQuestion;
  const isAr = activeTab === 'arabic';

  if (isLoading) {
    return (
      <div className="fq">
        <div className="fq__loader">
          <div className="fq__loader-spin" />
          <span>جاري تحميل البيانات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fq">
      {/* ── Top Bar ── */}
      <div className="fq__topbar">
        <div>
          <h1 className="fq__title">إدارة الأسئلة الشائعة</h1>
          <p className="fq__desc">إدارة الأسئلة الشائعة وأسئلة المستخدمين</p>
        </div>
        <motion.button
          className="fq__save"
          onClick={handleSaveChanges}
          disabled={isSaving}
          whileTap={{ scale: 0.97 }}
        >
          {isSaving ? (
            <>
              <div className="fq__spinner" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>حفظ التغييرات</span>
            </>
          )}
        </motion.button>
      </div>

      {/* ── Main Tabs (FAQ / User Questions) ── */}
      <div className="fq__main-tabs">
        <button
          className={`fq__main-tab ${activeUserTab === 'faq' ? 'fq__main-tab--on' : ''}`}
          onClick={() => setActiveUserTab('faq')}
        >
          <HelpCircle size={16} />
          الأسئلة الشائعة
        </button>
        <button
          className={`fq__main-tab ${activeUserTab === 'user-questions' ? 'fq__main-tab--on' : ''}`}
          onClick={() => setActiveUserTab('user-questions')}
        >
          <MessageSquare size={16} />
          أسئلة المستخدمين
          {unreadCount > 0 && <span className="fq__badge">{unreadCount}</span>}
        </button>
      </div>

      {/* ════════ FAQ Section ════════ */}
      {activeUserTab === 'faq' && (
        <motion.div
          className="fq__content"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Section Settings */}
          <div className="fq__settings">
            <div className="fq__settings-title">إعدادات القسم</div>
            <div className="fq__settings-grid">
              <div className="fq__field">
                <label className="fq__label">🇸🇦 العنوان (عربي)</label>
                <input
                  type="text"
                  className="fq__input"
                  value={sectionSettings.titleAr}
                  onChange={(e) => setSectionSettings({ ...sectionSettings, titleAr: e.target.value })}
                />
              </div>
              <div className="fq__field">
                <label className="fq__label">🇬🇧 Title (English)</label>
                <input
                  type="text"
                  className="fq__input"
                  value={sectionSettings.titleEn}
                  onChange={(e) => setSectionSettings({ ...sectionSettings, titleEn: e.target.value })}
                />
              </div>
              <div className="fq__field">
                <label className="fq__label">🇸🇦 الوصف (عربي)</label>
                <input
                  type="text"
                  className="fq__input"
                  value={sectionSettings.subtitleAr}
                  onChange={(e) => setSectionSettings({ ...sectionSettings, subtitleAr: e.target.value })}
                />
              </div>
              <div className="fq__field">
                <label className="fq__label">🇬🇧 Subtitle (English)</label>
                <input
                  type="text"
                  className="fq__input"
                  value={sectionSettings.subtitleEn}
                  onChange={(e) => setSectionSettings({ ...sectionSettings, subtitleEn: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Language Tabs */}
          <div className="fq__lang">
            <button
              className={`fq__lang-tab ${activeTab === 'arabic' ? 'fq__lang-tab--on' : ''}`}
              onClick={() => setActiveTab('arabic')}
            >
              🇸🇦 الأسئلة العربية ({arabicQuestions.length})
            </button>
            <button
              className={`fq__lang-tab ${activeTab === 'english' ? 'fq__lang-tab--on' : ''}`}
              onClick={() => setActiveTab('english')}
            >
              🇬🇧 English ({englishQuestions.length})
            </button>
          </div>

          {/* Questions List */}
          <div className="fq__qlist">
            <div className="fq__qlist-head">
              <span className="fq__qlist-title">
                {isAr ? 'الأسئلة' : 'Questions'}
              </span>
              <button className="fq__qlist-add" onClick={handleAdd}>
                <Plus size={15} />
                {isAr ? 'إضافة سؤال' : 'Add Question'}
              </button>
            </div>

            <div className="fq__qlist-items">
              {questions.length === 0 && (
                <div className="fq__qlist-empty">
                  <HelpCircle size={32} />
                  <p>{isAr ? 'لا توجد أسئلة' : 'No questions yet'}</p>
                </div>
              )}

              {questions.map((q, index) => (
                <motion.div
                  key={index}
                  className={`fq__q ${editing === index ? 'fq__q--edit' : ''}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  {editing === index ? (
                    /* ── Edit Mode ── */
                    <div className="fq__q-form">
                      <div className="fq__q-form-row">
                        <input
                          className="fq__q-icon-input"
                          value={q.icon}
                          onChange={(e) => handleUpdate(index, 'icon', e.target.value)}
                          maxLength="2"
                          placeholder="❓"
                        />
                        <input
                          className="fq__q-cat-input"
                          value={q.category}
                          onChange={(e) => handleUpdate(index, 'category', e.target.value)}
                          placeholder={isAr ? 'الفئة' : 'Category'}
                        />
                        <button
                          className="fq__q-ok"
                          onClick={() => setEditing(null)}
                        >
                          <Check size={16} />
                        </button>
                      </div>
                      <input
                        className="fq__q-input"
                        value={q.question}
                        onChange={(e) => handleUpdate(index, 'question', e.target.value)}
                        placeholder={isAr ? 'السؤال...' : 'Question...'}
                      />
                      <textarea
                        className="fq__q-textarea"
                        value={q.answer}
                        onChange={(e) => handleUpdate(index, 'answer', e.target.value)}
                        placeholder={isAr ? 'الجواب...' : 'Answer...'}
                        rows="3"
                      />
                    </div>
                  ) : (
                    /* ── Display Mode ── */
                    <>
                      <div
                        className="fq__q-row"
                        onClick={() =>
                          setExpandedQuestion(expandedQuestion === index ? null : index)
                        }
                      >
                        <span className="fq__q-icon">{q.icon}</span>
                        <div className="fq__q-text">
                          {q.category && (
                            <span className="fq__q-cat">{q.category}</span>
                          )}
                          <span className="fq__q-question">{q.question}</span>
                        </div>
                        <div className="fq__q-acts">
                          <motion.div
                            className="fq__q-chevron"
                            animate={{ rotate: expandedQuestion === index ? 180 : 0 }}
                          >
                            <ChevronDown size={16} />
                          </motion.div>
                          <button
                            className="fq__q-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditing(index);
                            }}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            className="fq__q-btn fq__q-btn--del"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQ(index);
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedQuestion === index && (
                          <motion.div
                            className="fq__q-answer"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <p>{q.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ════════ User Questions Section ════════ */}
      {activeUserTab === 'user-questions' && (
        <motion.div
          className="fq__uq"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {userQuestions.length === 0 ? (
            <div className="fq__uq-empty">
              <MessageSquare size={32} />
              <p>لا توجد أسئلة من المستخدمين</p>
            </div>
          ) : (
            <div className="fq__uq-list">
              {userQuestions.map((uq, index) => (
                <motion.div
                  key={uq.id}
                  className={`fq__uq-item ${uq.is_read ? 'fq__uq-item--read' : ''}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="fq__uq-top">
                    <div className="fq__uq-user">
                      <div className="fq__uq-avatar">
                        <User size={16} />
                      </div>
                      <div>
                        <span className="fq__uq-name">{uq.name}</span>
                        <span className="fq__uq-meta">
                          <Mail size={11} /> {uq.email}
                        </span>
                        <span className="fq__uq-meta">
                          <Calendar size={11} /> {uq.date}
                        </span>
                      </div>
                    </div>
                    <span className={`fq__uq-status ${uq.is_read ? 'fq__uq-status--read' : ''}`}>
                      {uq.is_read ? (
                        <>
                          <CheckCircle size={13} /> مقروء
                        </>
                      ) : (
                        <>
                          <AlertCircle size={13} /> جديد
                        </>
                      )}
                    </span>
                  </div>

                  <p className="fq__uq-question">{uq.question}</p>

                  <div className="fq__uq-acts">
                    {uq.is_read ? (
                      <button
                        className="fq__uq-btn"
                        onClick={() => handleMarkAsUnread(uq.id)}
                      >
                        <EyeOff size={14} /> غير مقروء
                      </button>
                    ) : (
                      <button
                        className="fq__uq-btn fq__uq-btn--primary"
                        onClick={() => handleMarkAsRead(uq.id)}
                      >
                        <Eye size={14} /> مقروء
                      </button>
                    )}
                    <button
                      className="fq__uq-btn fq__uq-btn--del"
                      onClick={() => handleDeleteUserQuestion(uq.id)}
                    >
                      <Trash2 size={14} /> حذف
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default FAQ;