import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaQuestionCircle, FaPaperPlane, FaCheckCircle, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useLanguage } from '../../contexts/LanguageContext';
import faqApi from '../../api/faqApi';
import './FAQ.scss';

const FAQ = () => {
  const [faqData, setFaqData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [formData, setFormData] = useState({ question: '', name: '', email: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { currentLang, isArabic } = useLanguage();

  useEffect(() => {
    fetchFaqData();
  }, [currentLang]);

  const fetchFaqData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await faqApi.getFaq(currentLang);
      
      if (response.success && response.data) {
        setFaqData(response.data);
      } else {
        setError('Failed to load FAQ');
      }
    } catch (err) {
      console.error('Error fetching FAQ data:', err);
      setError('Error loading FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionClick = (id) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate form
      if (!formData.question.trim() || !formData.name.trim() || !formData.email.trim()) {
        Swal.fire({
          title: isArabic ? 'يرجى تعبئة جميع الحقول' : 'Please fill all fields',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#FDB813'
        });
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Swal.fire({
          title: isArabic ? 'البريد الإلكتروني غير صالح' : 'Invalid email address',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#FDB813'
        });
        return;
      }

      // Submit to API
      const response = await faqApi.submitUserQuestion({
        name: formData.name,
        email: formData.email,
        question: formData.question
      });

      if (response.success) {
        Swal.fire({
          title: isArabic ? 'شكراً لك! ❤️' : 'Thank you! ❤️',
          text: isArabic ? 'سؤالك تم إرساله بنجاح وسيتم الرد عليك قريباً' : 'Your question has been sent successfully and will be answered soon',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#FDB813',
          iconColor: '#FDB813',
          background: '#fff',
          customClass: {
            popup: 'faq-swal-popup',
            title: 'faq-swal-title',
            confirmButton: 'faq-swal-button'
          }
        });

        // Reset form
        setFormData({ question: '', name: '', email: '' });
        setFormSubmitted(true);
        
        // Reset form submitted status after 3 seconds
        setTimeout(() => setFormSubmitted(false), 3000);
      } else {
        throw new Error(response.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Error submitting question:', err);
      Swal.fire({
        title: isArabic ? 'عذراً، حدث خطأ' : 'Sorry, an error occurred',
        text: isArabic ? 'لم نتمكن من إرسال سؤالك. يرجى المحاولة مرة أخرى.' : 'We couldn\'t send your question. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#FDB813'
      });
    }
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="faq-container">
        <div className="faq-loading">
          <FaQuestionCircle className="loading-icon" />
          <p>{isArabic ? 'جاري تحميل الأسئلة الشائعة...' : 'Loading FAQ...'}</p>
        </div>
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error || !faqData) {
    return (
      <div className="faq-container">
        <div className="faq-error">
          <p>{isArabic ? 'عذراً، حدث خطأ في تحميل الأسئلة الشائعة' : 'Sorry, error loading FAQ'}</p>
          <button 
            className="retry-btn"
            onClick={fetchFaqData}
          >
            {isArabic ? 'إعادة المحاولة' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  const { section, questions = [] } = faqData;

  // تصفية الأسئلة بناءً على البحث
  const filteredQuestions = searchQuery.trim() === '' 
    ? questions 
    : questions.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // الحصول على الفئات الفريدة
  const categories = [...new Set(filteredQuestions.map(q => q.category))];

  return (
    <div className="faq-container">
      {/* Hero Section */}
      <motion.div 
        className="faq-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="hero-icon"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <FaQuestionCircle />
        </motion.div>
        
        <h1 className="faq-title">
          {section?.title || (isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions')}
        </h1>
        
        <p className="faq-subtitle">
          {section?.subtitle || (isArabic ? 'كل ما تحتاج معرفته عن رحلتك الرياضية ❤️' : 'Everything you need to know about your fitness journey 🤍')}
        </p>
        
        {/* Search Bar */}
        <motion.div 
          className="faq-search"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FaSearch className="search-left-icon" />
          <input
            type="text"
            placeholder={isArabic ? 'ابحث عن إجابات...' : 'Search for answers...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            dir={isArabic ? 'rtl' : 'ltr'}
          />
          <FaQuestionCircle className="search-icon" />
        </motion.div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="faq-stats"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="stat-item">
          <span className="stat-number">{questions.length}</span>
          <span className="stat-label">
            {isArabic ? 'سؤال تمت الإجابة عليه' : 'Questions Answered'}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-number">24/7</span>
          <span className="stat-label">
            {isArabic ? 'دعم متاح' : 'Support Available'}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-number">100%</span>
          <span className="stat-label">
            {isArabic ? 'معدل الاستجابة' : 'Response Rate'}
          </span>
        </div>
      </motion.div>

      {/* FAQ Accordion */}
      <div className="faq-content">
        {searchQuery.trim() !== '' && (
          <motion.div 
            className="search-results-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>
              {isArabic ? `تم العثور على ${filteredQuestions.length} نتيجة` : `Found ${filteredQuestions.length} results`}
              {searchQuery && (
                <span> {isArabic ? 'للبحث:' : 'for:'} "{searchQuery}"</span>
              )}
            </p>
          </motion.div>
        )}

        <motion.div 
          className="faq-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {categories.map((category) => (
            <div key={category} className="category-section">
              <h3 className="category-title">{category}</h3>
              <div className="category-questions">
                {filteredQuestions
                  .filter(q => q.category === category)
                  .map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      className={`faq-item ${activeQuestion === faq.id ? 'active' : ''}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      dir={isArabic ? 'rtl' : 'ltr'}
                    >
                      <div 
                        className="faq-question"
                        onClick={() => handleQuestionClick(faq.id)}
                      >
                        <div className="question-left">
                          <span className="question-icon">{faq.icon}</span>
                          <div className="question-content">
                            <h3>{faq.question}</h3>
                          </div>
                        </div>
                        <motion.div
                          className="question-toggle"
                          animate={{ rotate: activeQuestion === faq.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <FaChevronDown />
                        </motion.div>
                      </div>

                      <AnimatePresence>
                        {activeQuestion === faq.id && (
                          <motion.div
                            className="faq-answer"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="answer-content">
                              <FaCheckCircle className="check-icon" />
                              <p>{faq.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Custom Question Form */}
        <motion.div 
          id="custom-question-form"
          className="custom-question-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="form-header">
            <div className="header-icon">💬</div>
            <h2>{isArabic ? 'لا زلت لديك أسئلة؟' : 'Still Have Questions?'}</h2>
            <p>{isArabic ? 'اسألنا أي شيء! نحن هنا لمساعدتك على النجاح' : 'Ask us anything! We\'re here to help you succeed'}</p>
          </div>

          <form onSubmit={handleFormSubmit} className="question-form">
            <div className="form-group">
              <label>{isArabic ? 'سؤالك' : 'Your Question'}</label>
              <textarea
                placeholder={isArabic ? 'ماذا تود أن تعرف؟' : 'What would you like to know?'}
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                required
                rows="4"
                dir={isArabic ? 'rtl' : 'ltr'}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{isArabic ? 'اسمك' : 'Your Name'}</label>
                <input
                  type="text"
                  placeholder={isArabic ? 'اسمك الكامل' : 'Your full name'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  dir={isArabic ? 'rtl' : 'ltr'}
                />
              </div>

              <div className="form-group">
                <label>{isArabic ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <input
                  type="email"
                  placeholder={isArabic ? 'بريدك الإلكتروني' : 'Your email address'}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  dir="ltr"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              className="submit-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={formSubmitted}
            >
              <FaPaperPlane />
              {formSubmitted 
                ? (isArabic ? 'جاري الإرسال...' : 'Sending...')
                : (isArabic ? 'أرسل سؤالك' : 'Send Your Question')
              }
            </motion.button>

            <p className="form-note">
              {isArabic ? 'سنجيب خلال 24 ساعة ❤️' : 'We\'ll respond within 24 hours ❤️'}
            </p>
          </form>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="faq-decorations">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-shape"
            style={{
              left: `${(i * 12.5) + 5}%`,
              top: `${Math.random() * 80 + 10}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              rotate: [0, 360]
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FAQ;