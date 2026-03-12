import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Medal,
  Plus,
  Edit2,
  Trash2,
  Save,
  Check,
  Eye,
  GripVertical,
  Languages,
  Globe
} from 'lucide-react';
import Swal from 'sweetalert2';
import certificationsApi from '../../../api/certificationsApi';
import './Certifications.scss';

const Certifications = () => {
  // Language State
  const [activeTab, setActiveTab] = useState('ar'); // 'ar' or 'en'
  
  // Certifications State
  const [certifications, setCertifications] = useState([]);
  const [editingCert, setEditingCert] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState(null);
  
  // Load data on mount
  useEffect(() => {
    fetchCertifications();
  }, []);
  
  // Fetch certifications from API
  const fetchCertifications = async () => {
    setIsLoading(true);
    try {
      const response = await certificationsApi.getAllCertifications();
      
      if (response.success) {
        setCertifications(response.data);
      }
    } catch (error) {
      console.error('Error fetching certifications:', error);
      Swal.fire({
        title: 'خطأ',
        text: 'فشل تحميل الشهادات',
        icon: 'error',
        confirmButtonColor: '#e91e63'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add new certification
  const handleAddCertification = () => {
    const newCert = {
      id: null, // null indicates new certification
      icon: '🎖️',
      title_en: '',
      title_ar: '',
      organization_en: '',
      organization_ar: '',
      is_verified: false,
      order: certifications.length
    };
    setCertifications([...certifications, newCert]);
    setEditingCert(certifications.length); // Edit the new one immediately
  };
  
  // Edit certification
  const handleEditCert = (index) => {
    setEditingCert(index);
  };
  
  // Update certification field
  const handleUpdateCert = (index, field, value) => {
    const updatedCerts = [...certifications];
    updatedCerts[index] = {
      ...updatedCerts[index],
      [field]: value
    };
    setCertifications(updatedCerts);
  };
  
  // Delete certification
  const handleDeleteCert = async (index) => {
    const cert = certifications[index];
    
    // Confirm deletion
    const result = await Swal.fire({
      title: 'تأكيد الحذف',
      text: 'هل أنت متأكد من حذف هذه الشهادة؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#607d8b',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء'
    });
    
    if (!result.isConfirmed) return;
    
    // Remove from state
    const updatedCerts = certifications.filter((_, i) => i !== index);
    setCertifications(updatedCerts);
    
    // Show success message
    Swal.fire({
      title: 'تم الحذف',
      text: 'تم حذف الشهادة بنجاح',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  };
  
  // Save individual certification (just close edit mode)
  const handleSaveCert = (index) => {
    setEditingCert(null);
  };
  
  // Save all changes (Bulk Update)
  const handleSaveChanges = async () => {
    // Validate all certifications
    const isValid = certifications.every(cert => 
      cert.icon &&
      cert.title_en && cert.title_ar &&
      cert.organization_en && cert.organization_ar
    );
    
    if (!isValid) {
      Swal.fire({
        title: 'تنبيه',
        text: 'يرجى ملء جميع الحقول (عربي وإنجليزي) لكل شهادة',
        icon: 'warning',
        confirmButtonColor: '#e91e63'
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Prepare data
      const data = certifications.map((cert, index) => ({
        id: cert.id, // null for new certifications
        icon: cert.icon,
        title_en: cert.title_en,
        title_ar: cert.title_ar,
        organization_en: cert.organization_en,
        organization_ar: cert.organization_ar,
        is_verified: cert.is_verified,
        order: index,
        is_active: true
      }));
      
      // Call bulk update API
      const response = await certificationsApi.bulkUpdateCertifications(data);
      
      if (response.success) {
        setUploadStatus('success');
        setTimeout(() => setUploadStatus(null), 3000);
        
        Swal.fire({
          title: 'نجح',
          text: 'تم حفظ جميع الشهادات بنجاح',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        
        // Refresh data
        await fetchCertifications();
        setEditingCert(null);
      }
    } catch (error) {
      console.error('Error saving certifications:', error);
      setUploadStatus('error');
      setTimeout(() => setUploadStatus(null), 3000);
      
      Swal.fire({
        title: 'خطأ',
        text: error.response?.data?.message || 'فشل حفظ الشهادات',
        icon: 'error',
        confirmButtonColor: '#e91e63'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Drag and Drop functionality
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };
  
  const handleDragOver = (e, index) => {
    e.preventDefault();
  };
  
  const handleDrop = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newCertifications = [...certifications];
    const [draggedItem] = newCertifications.splice(draggedIndex, 1);
    newCertifications.splice(index, 0, draggedItem);
    
    setCertifications(newCertifications);
    setDraggedIndex(null);
  };
  
  if (isLoading) {
    return (
      <div className="certifications">
        <div className="certifications__loading">
          <div className="spinner-large"></div>
          <p>جاري تحميل الشهادات...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="certifications">
      {/* Page Header */}
      <motion.div
        className="certifications__header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="certifications__header-content">
          <div className="certifications__title-section">
            <h1 className="certifications__title">
              <Medal size={32} />
              الشهادات والدورات
            </h1>
            <p className="certifications__subtitle">
              قم بإدارة شهاداتك المهنية والدورات التدريبية المعتمدة (عربي / English)
            </p>
          </div>
          
          <motion.button
            className="certifications__save-btn"
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
      
      {/* Status Messages */}
      <AnimatePresence>
        {uploadStatus === 'success' && (
          <motion.div
            className="certifications__alert certifications__alert--success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Check size={20} />
            <span>تم حفظ التغييرات بنجاح!</span>
          </motion.div>
        )}
        
        {uploadStatus === 'error' && (
          <motion.div
            className="certifications__alert certifications__alert--error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <span>خطأ: فشل حفظ التغييرات</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Language Tabs */}
      <div className="language-tabs">
        <button
          className={`language-tab ${activeTab === 'ar' ? 'active' : ''}`}
          onClick={() => setActiveTab('ar')}
        >
          <Globe size={18} />
          العربية
        </button>
        <button
          className={`language-tab ${activeTab === 'en' ? 'active' : ''}`}
          onClick={() => setActiveTab('en')}
        >
          <Languages size={18} />
          English
        </button>
      </div>
      
      {/* Main Content */}
      <div className="certifications__content">
        {/* Left Side - Certifications List */}
        <motion.div
          className="certifications__list-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="certifications-card">
            <div className="certifications-card__header">
              <h2 className="certifications-card__title">قائمة الشهادات</h2>
              <button
                className="certifications-card__add-btn"
                onClick={handleAddCertification}
                aria-label="إضافة شهادة جديدة"
              >
                <Plus size={18} />
                إضافة شهادة
              </button>
            </div>
            
            <div className="certifications-list">
              <AnimatePresence>
                {certifications.length === 0 ? (
                  <motion.div
                    className="certifications-list__empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Medal size={48} />
                    <p>لا توجد شهادات حالياً</p>
                    <p className="certifications-list__empty-hint">
                      انقر على "إضافة شهادة" لإضافة شهادة جديدة
                    </p>
                  </motion.div>
                ) : (
                  certifications.map((cert, index) => (
                    <motion.div
                      key={index}
                      className={`cert-item ${editingCert === index ? 'cert-item--editing' : ''}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                      draggable={editingCert !== index}
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={() => handleDrop(index)}
                    >
                      {editingCert === index ? (
                        <div className="cert-item__form">
                          <div className="cert-item__form-header">
                            <input
                              type="text"
                              className="cert-item__icon-input"
                              value={cert.icon}
                              onChange={(e) => handleUpdateCert(index, 'icon', e.target.value)}
                              placeholder="🏆"
                              maxLength="10"
                              aria-label="أيقونة الشهادة"
                            />
                            <button
                              className="cert-item__save-btn"
                              onClick={() => handleSaveCert(index)}
                              aria-label="حفظ التعديلات"
                            >
                              <Check size={18} />
                            </button>
                          </div>
                          
                          {/* Show fields based on active tab */}
                          <AnimatePresence mode="wait">
                            {activeTab === 'ar' ? (
                              <motion.div
                                key="ar-fields"
                                className="cert-item__lang-fields"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                              >
                                <label className="cert-item__label">العربية</label>
                                <input
                                  type="text"
                                  className="cert-item__input"
                                  value={cert.title_ar}
                                  onChange={(e) => handleUpdateCert(index, 'title_ar', e.target.value)}
                                  placeholder="موثق من قبل"
                                  aria-label="العنوان بالعربية"
                                />
                                
                                <input
                                  type="text"
                                  className="cert-item__input cert-item__input--org"
                                  value={cert.organization_ar}
                                  onChange={(e) => handleUpdateCert(index, 'organization_ar', e.target.value)}
                                  placeholder="اسم المنظمة بالعربية"
                                  aria-label="المنظمة بالعربية"
                                />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="en-fields"
                                className="cert-item__lang-fields"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                              >
                                <label className="cert-item__label">English</label>
                                <input
                                  type="text"
                                  className="cert-item__input"
                                  value={cert.title_en}
                                  onChange={(e) => handleUpdateCert(index, 'title_en', e.target.value)}
                                  placeholder="Certified by"
                                  aria-label="Title in English"
                                />
                                
                                <input
                                  type="text"
                                  className="cert-item__input cert-item__input--org"
                                  value={cert.organization_en}
                                  onChange={(e) => handleUpdateCert(index, 'organization_en', e.target.value)}
                                  placeholder="Organization Name"
                                  aria-label="Organization in English"
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          <label className="cert-item__checkbox">
                            <input
                              type="checkbox"
                              checked={cert.is_verified}
                              onChange={(e) => handleUpdateCert(index, 'is_verified', e.target.checked)}
                              aria-label="شهادة معتمدة"
                            />
                            <span>معتمد ✓ / Verified</span>
                          </label>
                        </div>
                      ) : (
                        <div className="cert-item__display">
                          <div 
                            className="cert-item__drag"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', index);
                              handleDragStart(index);
                            }}
                          >
                            <GripVertical size={20} />
                          </div>
                          
                          <div className="cert-item__icon-badge">
                            {cert.icon}
                          </div>
                          
                          <div className="cert-item__content">
                            <div className="cert-item__title">
                              {activeTab === 'ar' ? cert.title_ar : cert.title_en}
                              {cert.is_verified && (
                                <span className="cert-item__verified">✓</span>
                              )}
                            </div>
                            <div className="cert-item__organization" title={
                              activeTab === 'ar' ? cert.organization_ar : cert.organization_en
                            }>
                              {activeTab === 'ar' ? cert.organization_ar : cert.organization_en}
                            </div>
                          </div>
                          
                          <div className="cert-item__actions">
                            <button
                              className="cert-item__action-btn"
                              onClick={() => handleEditCert(index)}
                              aria-label="تعديل الشهادة"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="cert-item__action-btn cert-item__action-btn--danger"
                              onClick={() => handleDeleteCert(index)}
                              aria-label="حذف الشهادة"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Guidelines */}
          <div className="guidelines-card">
            <h3 className="guidelines-card__title">
              💡 نصائح لعرض الشهادات
            </h3>
            <ul className="guidelines-card__list">
              <li>استخدم أيقونات تعبيرية (Emoji) مناسبة لكل شهادة</li>
              <li>املأ جميع الحقول بالعربية والإنجليزية</li>
              <li>اكتب اسم المنظمة بالكامل باللغتين</li>
              <li>ضع علامة "معتمد" للشهادات الموثقة فقط</li>
              <li>رتّب الشهادات حسب الأهمية (الأعلى أولاً)</li>
              <li>اضغط "حفظ التغييرات" لحفظ جميع الشهادات</li>
            </ul>
          </div>
        </motion.div>
        
        {/* Right Side - Preview */}
        <motion.div
          className="certifications__preview-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="preview-card">
            <div className="preview-card__header">
              <h2 className="preview-card__title">
                <Eye size={24} />
                معاينة على الموقع
              </h2>
              <p className="preview-card__subtitle">
                كيف ستظهر الشهادات للزوار ({activeTab === 'ar' ? 'بالعربية' : 'بالإنجليزية'})
              </p>
            </div>
            
            <div className="certifications-preview">
              <div className="certifications-preview__container">
                {certifications.length > 0 ? (
                  certifications.map((cert, index) => (
                    <motion.div
                      key={index}
                      className="cert-preview-card"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="cert-preview-card__icon">
                        {cert.icon}
                      </div>
                      <div className="cert-preview-card__content">
                        <p className="cert-preview-card__title">
                          {activeTab === 'ar' ? cert.title_ar : cert.title_en}
                        </p>
                        <h3 className="cert-preview-card__organization">
                          {activeTab === 'ar' ? cert.organization_ar : cert.organization_en}
                        </h3>
                        {cert.is_verified && (
                          <div className="cert-preview-card__badge">
                            <Check size={14} />
                            <span>{activeTab === 'ar' ? 'معتمد' : 'Verified'}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="certifications-preview__empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Medal size={64} />
                    <p>لا توجد شهادات لعرضها</p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Certifications;