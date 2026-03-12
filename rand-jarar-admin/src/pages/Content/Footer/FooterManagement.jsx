import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Globe, 
  Link, 
  Plus, 
  Trash2, 
  Eye,
  Share2,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import footerApi from '../../../api/footerApi';
import './FooterManagement.scss';

const FooterManagement = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [language, setLanguage] = useState('ar');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('');

  // دالة لتحميل Font Awesome ديناميكي إذا لم يكن مضاف
  useEffect(() => {
    const loadFontAwesome = () => {
      if (!document.querySelector('link[href*="font-awesome"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(link);
      }
    };
    
    loadFontAwesome();
  }, []);

  const [footerData, setFooterData] = useState({
    description_en: '',
    description_ar: '',
    copyright_en: '',
    copyright_ar: '',
    quick_links_title_en: 'Quick Links',
    quick_links_title_ar: 'روابط سريعة',
    email: '',
    phone: '',
    address_en: '',
    address_ar: '',
    quick_links: [],
    legal_links: [],
    social_links: [],
  });

  const [newQuickLink, setNewQuickLink] = useState({ text_en: '', text_ar: '', url: '' });
  const [newLegalLink, setNewLegalLink] = useState({ text_en: '', text_ar: '', url: '' });
  const [newSocialLink, setNewSocialLink] = useState({ platform: 'facebook', url: '' });

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    setIsLoading(true);
    try {
      const response = await footerApi.getFooterForAdmin();
      
      if (response.success && response.data) {
        setFooterData({
          ...response.data,
          quick_links: response.data.quick_links || [],
          legal_links: response.data.legal_links || [],
          social_links: response.data.social_links || [],
        });
      } else {
        // إذا لم تكن هناك بيانات، استخدم القيم الافتراضية
        setFooterData({
          ...footerData,
          quick_links: footerApi.defaultQuickLinks,
          legal_links: footerApi.defaultLegalLinks,
          social_links: [
            { platform: 'facebook', url: 'https://facebook.com/randjarar' },
            { platform: 'instagram', url: 'https://instagram.com/randjarar' },
            { platform: 'twitter', url: 'https://twitter.com/randjarar' },
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
      showStatus('error', 'فشل في تحميل بيانات الفوتر، استخدام القيم الافتراضية');
      
      // استخدام القيم الافتراضية عند فشل التحميل
      setFooterData({
        ...footerData,
        description_en: 'Internationally Certified Fitness Coach helping you achieve your goals.',
        description_ar: 'مدربة لياقة بدنية معتمدة دولياً تساعدك في تحقيق أهدافك.',
        copyright_en: '© 2024 RAND JARAR. All rights reserved.',
        copyright_ar: '© 2024 RAND JARAR. جميع الحقوق محفوظة.',
        quick_links: footerApi.defaultQuickLinks,
        legal_links: footerApi.defaultLegalLinks,
        social_links: [
          { platform: 'facebook', url: 'https://facebook.com/randjarar' },
          { platform: 'instagram', url: 'https://instagram.com/randjarar' },
          { platform: 'twitter', url: 'https://twitter.com/randjarar' },
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showStatus = (type, message) => {
    setStatusType(type);
    setStatusMessage(message);
    setTimeout(() => {
      setStatusType('');
      setStatusMessage('');
    }, 4000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await footerApi.updateFooter(footerData);
      
      if (response.success) {
        showStatus('success', response.message || 'تم حفظ التغييرات بنجاح');
      } else {
        showStatus('error', response.message);
      }
    } catch (error) {
      showStatus('error', 'حدث خطأ أثناء الحفظ');
      console.error('Error saving footer:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addQuickLink = () => {
    if (!newQuickLink.text_en.trim() || !newQuickLink.text_ar.trim() || !newQuickLink.url.trim()) {
      showStatus('error', 'يرجى ملء جميع الحقول');
      return;
    }

    setFooterData(prev => ({
      ...prev,
      quick_links: [...prev.quick_links, { ...newQuickLink }]
    }));

    setNewQuickLink({ text_en: '', text_ar: '', url: '' });
    showStatus('success', 'تمت إضافة الرابط');
  };

  const addLegalLink = () => {
    if (!newLegalLink.text_en.trim() || !newLegalLink.text_ar.trim() || !newLegalLink.url.trim()) {
      showStatus('error', 'يرجى ملء جميع الحقول');
      return;
    }

    setFooterData(prev => ({
      ...prev,
      legal_links: [...prev.legal_links, { ...newLegalLink }]
    }));

    setNewLegalLink({ text_en: '', text_ar: '', url: '' });
    showStatus('success', 'تمت إضافة الرابط القانوني');
  };

  const addSocialLink = () => {
    if (!newSocialLink.url.trim()) {
      showStatus('error', 'يرجى إدخال رابط السوشيال ميديا');
      return;
    }

    setFooterData(prev => ({
      ...prev,
      social_links: [...prev.social_links, { ...newSocialLink }]
    }));

    setNewSocialLink({ platform: 'facebook', url: '' });
    showStatus('success', 'تمت إضافة رابط السوشيال ميديا');
  };

  const removeQuickLink = (index) => {
    setFooterData(prev => ({
      ...prev,
      quick_links: prev.quick_links.filter((_, i) => i !== index)
    }));
    showStatus('success', 'تم حذف الرابط');
  };

  const removeLegalLink = (index) => {
    setFooterData(prev => ({
      ...prev,
      legal_links: prev.legal_links.filter((_, i) => i !== index)
    }));
    showStatus('success', 'تم حذف الرابط القانوني');
  };

  const removeSocialLink = (index) => {
    setFooterData(prev => ({
      ...prev,
      social_links: prev.social_links.filter((_, i) => i !== index)
    }));
    showStatus('success', 'تم حذف رابط السوشيال ميديا');
  };

  const updateField = (field, value) => {
    setFooterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const tabs = [
    { id: 'general', label: 'عام', icon: Globe },
    { id: 'social', label: 'السوشيال ميديا', icon: Share2 },
    { id: 'contact', label: 'معلومات الاتصال', icon: Mail },
  ];

  // دالة للحصول على أيقونة السوشيال ميديا
  const getSocialIcon = (platform) => {
    const platformInfo = footerApi.socialPlatforms.find(p => p.value === platform);
    return platformInfo ? platformInfo.icon : 'fas fa-link';
  };

  // دالة للحصول على لون السوشيال ميديا
  const getSocialColor = (platform) => {
    const platformInfo = footerApi.socialPlatforms.find(p => p.value === platform);
    return platformInfo ? platformInfo.color : '#6c757d';
  };

  // دالة للحصول على اسم السوشيال ميديا
  const getSocialLabel = (platform) => {
    const platformInfo = footerApi.socialPlatforms.find(p => p.value === platform);
    return platformInfo ? platformInfo.label : platform;
  };

  if (isLoading) {
    return (
      <div className="footer-management">
        <div className="footer-management__loading">
          <div className="spinner"></div>
          <p>جاري تحميل بيانات الفوتر...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="footer-management">
      <motion.div
        className="footer-management__header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="footer-management__header-content">
          <div className="footer-management__title-section">
            <h1 className="footer-management__title">
              <Globe size={32} />
              إدارة الفوتر (الذيول)
            </h1>
            <p className="footer-management__subtitle">
              إدارة محتوى الفوتر للغة العربية والإنجليزية
            </p>
          </div>

          <div className="footer-management__actions">
            <div className="language-toggle">
              <button
                className={`language-toggle__btn ${language === 'ar' ? 'active' : ''}`}
                onClick={() => setLanguage('ar')}
              >
                🇸🇦 العربية
              </button>
              <button
                className={`language-toggle__btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                🇬🇧 English
              </button>
            </div>

            <motion.button
              className="footer-management__save-btn"
              onClick={handleSave}
              disabled={isSaving}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Save size={18} />
              <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {statusMessage && (
        <motion.div
          className={`footer-management__alert footer-management__alert--${statusType}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span>{statusMessage}</span>
        </motion.div>
      )}

      <div className="footer-management__content">
        <div className="footer-management__tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`footer-management__tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="footer-management__tab-content">
          {activeTab === 'general' && (
            <motion.div
              className="general-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="form-grid">
                <div className="form-section">
                  <h3 className="form-section__title">
                    وصف الفوتر
                  </h3>
                  <textarea
                    className="form-input form-input--textarea"
                    value={language === 'ar' ? footerData.description_ar : footerData.description_en}
                    onChange={(e) => updateField(
                      language === 'ar' ? 'description_ar' : 'description_en',
                      e.target.value
                    )}
                    placeholder={language === 'ar' 
                      ? "أدخل وصف الفوتر باللغة العربية..." 
                      : "Enter footer description in English..."
                    }
                    rows="4"
                  />
                  <div className="form-hint">
                    هذا النص سيظهر تحت الشعار في الفوتر
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section__title">
                    حقوق النشر
                  </h3>
                  <input
                    type="text"
                    className="form-input"
                    value={language === 'ar' ? footerData.copyright_ar : footerData.copyright_en}
                    onChange={(e) => updateField(
                      language === 'ar' ? 'copyright_ar' : 'copyright_en',
                      e.target.value
                    )}
                    placeholder={language === 'ar' 
                      ? "© 2024 RAND JARAR. جميع الحقوق محفوظة." 
                      : "© 2024 RAND JARAR. All rights reserved."
                    }
                  />
                  <div className="form-hint">
                    سيظهر هذا النص في أسفل الفوتر
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'links' && (
            <motion.div
              className="links-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="links-grid">
                <div className="links-section">
                  <div className="links-section__header">
                    <h3 className="links-section__title">
                      الروابط السريعة
                    </h3>
                    <div className="links-section__title-input">
                      <input
                        type="text"
                        className="form-input"
                        value={language === 'ar' 
                          ? footerData.quick_links_title_ar 
                          : footerData.quick_links_title_en
                        }
                        onChange={(e) => updateField(
                          language === 'ar' ? 'quick_links_title_ar' : 'quick_links_title_en',
                          e.target.value
                        )}
                        placeholder="عنوان قسم الروابط السريعة"
                      />
                    </div>
                  </div>

                  <div className="add-link-form">
                    <div className="add-link-form__grid">
                      <input
                        type="text"
                        className="form-input"
                        placeholder={language === 'ar' ? 'النص بالعربية' : 'Text in English'}
                        value={language === 'ar' ? newQuickLink.text_ar : newQuickLink.text_en}
                        onChange={(e) => setNewQuickLink(prev => ({
                          ...prev,
                          [language === 'ar' ? 'text_ar' : 'text_en']: e.target.value
                        }))}
                      />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="الرابط (URL)"
                        value={newQuickLink.url}
                        onChange={(e) => setNewQuickLink(prev => ({
                          ...prev,
                          url: e.target.value
                        }))}
                      />
                      <button
                        className="add-link-form__btn"
                        onClick={addQuickLink}
                      >
                        <Plus size={16} />
                        <span>إضافة</span>
                      </button>
                    </div>
                  </div>

                  <div className="links-list">
                    {footerData.quick_links.map((link, index) => (
                      <div key={index} className="link-item">
                        <div className="link-item__content">
                          <div className="link-item__text">
                            <span className="link-item__language">EN: </span>
                            <span className="link-item__text-value">{link.text_en}</span>
                          </div>
                          <div className="link-item__text">
                            <span className="link-item__language">AR: </span>
                            <span className="link-item__text-value">{link.text_ar}</span>
                          </div>
                          <div className="link-item__url">
                            <Link size={14} />
                            <span className="link-item__url-value">{link.url}</span>
                          </div>
                        </div>
                        <button
                          className="link-item__delete"
                          onClick={() => removeQuickLink(index)}
                          title="حذف الرابط"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="links-section">
                  <h3 className="links-section__title">
                    الروابط القانونية
                  </h3>

                  <div className="add-link-form">
                    <div className="add-link-form__grid">
                      <input
                        type="text"
                        className="form-input"
                        placeholder={language === 'ar' ? 'النص بالعربية' : 'Text in English'}
                        value={language === 'ar' ? newLegalLink.text_ar : newLegalLink.text_en}
                        onChange={(e) => setNewLegalLink(prev => ({
                          ...prev,
                          [language === 'ar' ? 'text_ar' : 'text_en']: e.target.value
                        }))}
                      />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="الرابط (URL)"
                        value={newLegalLink.url}
                        onChange={(e) => setNewLegalLink(prev => ({
                          ...prev,
                          url: e.target.value
                        }))}
                      />
                      <button
                        className="add-link-form__btn"
                        onClick={addLegalLink}
                      >
                        <Plus size={16} />
                        <span>إضافة</span>
                      </button>
                    </div>
                  </div>

                  <div className="links-list">
                    {footerData.legal_links.map((link, index) => (
                      <div key={index} className="link-item">
                        <div className="link-item__content">
                          <div className="link-item__text">
                            <span className="link-item__language">EN: </span>
                            <span className="link-item__text-value">{link.text_en}</span>
                          </div>
                          <div className="link-item__text">
                            <span className="link-item__language">AR: </span>
                            <span className="link-item__text-value">{link.text_ar}</span>
                          </div>
                          <div className="link-item__url">
                            <Link size={14} />
                            <span className="link-item__url-value">{link.url}</span>
                          </div>
                        </div>
                        <button
                          className="link-item__delete"
                          onClick={() => removeLegalLink(index)}
                          title="حذف الرابط"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'social' && (
            <motion.div
              className="social-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="social-section">
                <h3 className="social-section__title">
                  روابط السوشيال ميديا
                </h3>

                <div className="add-social-form">
                  <div className="add-social-form__grid">
                    <select
                      className="form-select"
                      value={newSocialLink.platform}
                      onChange={(e) => setNewSocialLink(prev => ({
                        ...prev,
                        platform: e.target.value
                      }))}
                    >
                      {footerApi.socialPlatforms.map(platform => (
                        <option key={platform.value} value={platform.value}>
                          {platform.label}
                        </option>
                      ))}
                    </select>
                    
                    <input
                      type="text"
                      className="form-input"
                      placeholder="رابط الملف الشخصي (URL)"
                      value={newSocialLink.url}
                      onChange={(e) => setNewSocialLink(prev => ({
                        ...prev,
                        url: e.target.value
                      }))}
                    />
                    
                    <button
                      className="add-social-form__btn"
                      onClick={addSocialLink}
                    >
                      <Plus size={16} />
                      <span>إضافة</span>
                    </button>
                  </div>
                </div>

                <div className="social-links-grid">
                  {footerData.social_links.map((social, index) => (
                    <div key={index} className="social-link-item">
                      <div 
                        className="social-link-item__icon"
                        style={{ backgroundColor: getSocialColor(social.platform) }}
                      >
                        <i className={getSocialIcon(social.platform)}></i>
                      </div>
                      
                      <div className="social-link-item__content">
                        <div className="social-link-item__platform">
                          {getSocialLabel(social.platform)}
                        </div>
                        <div className="social-link-item__url">
                          {social.url}
                        </div>
                      </div>
                      
                      <button
                        className="social-link-item__delete"
                        onClick={() => removeSocialLink(index)}
                        title="حذف الرابط"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              className="contact-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="form-grid">
                <div className="form-section">
                  <h3 className="form-section__title">
                    <Mail size={20} />
                    البريد الإلكتروني
                  </h3>
                  <input
                    type="email"
                    className="form-input"
                    value={footerData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="info@randjarar.com"
                  />
                </div>

                <div className="form-section">
                  <h3 className="form-section__title">
                    <Phone size={20} />
                    رقم الهاتف
                  </h3>
                  <input
                    type="text"
                    className="form-input"
                    value={footerData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+966 55 123 4567"
                  />
                </div>

                <div className="form-section">
                  <h3 className="form-section__title">
                    <MapPin size={20} />
                    {language === 'ar' ? 'العنوان' : 'Address'}
                  </h3>
                  <textarea
                    className="form-input form-input--textarea"
                    value={language === 'ar' ? footerData.address_ar : footerData.address_en}
                    onChange={(e) => updateField(
                      language === 'ar' ? 'address_ar' : 'address_en',
                      e.target.value
                    )}
                    placeholder={language === 'ar' 
                      ? "أدخل العنوان باللغة العربية..." 
                      : "Enter address in English..."
                    }
                    rows="3"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="footer-management__preview">
          <div className="preview-card">
            <div className="preview-card__header">
              <h3 className="preview-card__title">
                <Eye size={20} />
                معاينة الفوتر ({language === 'ar' ? 'العربية' : 'English'})
              </h3>
            </div>

            <div className="preview-card__content">
              <div className="website-footer-preview">
                <div className="footer-preview__logo">
                  <div className="footer-preview__logo-placeholder">
                    <Globe size={24} />
                    <span>RAND JARAR</span>
                  </div>
                </div>

                {footerData[`description_${language}`] && (
                  <div className="footer-preview__description">
                    {footerData[`description_${language}`]}
                  </div>
                )}

                {footerData.quick_links.length > 0 && (
                  <div className="footer-preview__section">
                    <h4 className="footer-preview__section-title">
                      {footerData[`quick_links_title_${language}`]}
                    </h4>
                    <div className="footer-preview__links">
                      {footerData.quick_links.map((link, index) => (
                        <a 
                          key={index} 
                          href={link.url} 
                          className="footer-preview__link"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {link[`text_${language}`]}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {footerData.social_links.length > 0 && (
                  <div className="footer-preview__social">
                    {footerData.social_links.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        className="footer-preview__social-link"
                        style={{ backgroundColor: getSocialColor(social.platform) }}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={getSocialLabel(social.platform)}
                      >
                        <i className={getSocialIcon(social.platform)}></i>
                      </a>
                    ))}
                  </div>
                )}

                <div className="footer-preview__copyright">
                  {footerData[`copyright_${language}`] || 
                    (language === 'ar' 
                      ? '© 2026 RAND JARAR. جميع الحقوق محفوظة.' 
                      : '© 2026 RAND JARAR. All rights reserved.'
                    )
                  }
                </div>

                {footerData.legal_links.length > 0 && (
                  <div className="footer-preview__legal">
                    {footerData.legal_links.map((link, index) => (
                      <React.Fragment key={index}>
                        <a 
                          href={link.url} 
                          className="footer-preview__legal-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link[`text_${language}`]}
                        </a>
                        {index < footerData.legal_links.length - 1 && ' | '}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterManagement;