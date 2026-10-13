import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Medal, Plus, Edit2, Trash2, Save, Check, Eye, GripVertical, Languages, Globe
} from 'lucide-react';
import Swal from 'sweetalert2';
import certificationsApi from '../../../api/certificationsApi';
import './Certifications.scss';
import { t } from '../../../i18n';

const Certifications = () => {
  const [activeTab, setActiveTab] = useState('ar');
  const [certifications, setCertifications] = useState([]);
  const [editingCert, setEditingCert] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [designType, setDesignType] = useState('classic');
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => { fetchCertifications(); }, []);

  const fetchCertifications = async () => {
    setIsLoading(true);
    try {
      const response = await certificationsApi.getAllCertifications();
      if (response.success) {
        setCertifications(response.data);
        if (response.design_type) setDesignType(response.design_type);
      }
    } catch (error) {
      console.error('Error fetching certifications:', error);
      Swal.fire({ title: t('خطأ'), text: t('فشل تحميل الشهادات'), icon: 'error', confirmButtonColor: '#e91e63' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDesignChange = async (type) => {
    setDesignType(type);
    try {
      await certificationsApi.updateDesignType(type);
      Swal.fire({ title: t('تم'), text: t('تم تحديث التصميم'), icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCertification = () => {
    const newCert = { id: null, icon: '🎖️', title_en: '', title_ar: '', organization_en: '', organization_ar: '', is_verified: false, order: certifications.length };
    setCertifications([...certifications, newCert]);
    setEditingCert(certifications.length);
  };

  const handleEditCert = (index) => setEditingCert(index);
  const handleUpdateCert = (index, field, value) => {
    const u = [...certifications];
    u[index] = { ...u[index], [field]: value };
    setCertifications(u);
  };

  const handleDeleteCert = async (index) => {
    const result = await Swal.fire({ title: t('تأكيد الحذف'), text: t('هل أنت متأكد من حذف هذه الشهادة؟'), icon: 'warning', showCancelButton: true, confirmButtonColor: '#e91e63', cancelButtonColor: '#607d8b', confirmButtonText: t('نعم، احذف'), cancelButtonText: t('إلغاء') });
    if (!result.isConfirmed) return;
    setCertifications(certifications.filter((_, i) => i !== index));
    Swal.fire({ title: t('تم الحذف'), text: t('تم حذف الشهادة بنجاح'), icon: 'success', timer: 2000, showConfirmButton: false });
  };

  const handleSaveCert = () => setEditingCert(null);

  const handleSaveChanges = async () => {
    const isValid = certifications.every(c => c.icon && c.title_en && c.title_ar && c.organization_en && c.organization_ar);
    if (!isValid) { Swal.fire({ title: t('تنبيه'), text: t('يرجى ملء جميع الحقول (عربي وإنجليزي) لكل شهادة'), icon: 'warning', confirmButtonColor: '#e91e63' }); return; }
    setIsSaving(true);
    try {
      const data = certifications.map((cert, index) => ({ id: cert.id, icon: cert.icon, title_en: cert.title_en, title_ar: cert.title_ar, organization_en: cert.organization_en, organization_ar: cert.organization_ar, is_verified: cert.is_verified, order: index, is_active: true }));
      const response = await certificationsApi.bulkUpdateCertifications(data);
      if (response.success) {
        setUploadStatus('success'); setTimeout(() => setUploadStatus(null), 3000);
        Swal.fire({ title: t('نجح'), text: t('تم حفظ جميع الشهادات بنجاح'), icon: 'success', timer: 2000, showConfirmButton: false });
        await fetchCertifications(); setEditingCert(null);
      }
    } catch (error) {
      console.error('Error saving certifications:', error);
      setUploadStatus('error'); setTimeout(() => setUploadStatus(null), 3000);
      Swal.fire({ title: t('خطأ'), text: error.response?.data?.message || t('فشل حفظ الشهادات'), icon: 'error', confirmButtonColor: '#e91e63' });
    } finally { setIsSaving(false); }
  };

  const handleDragStart = (index) => setDraggedIndex(index);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const n = [...certifications]; const [d] = n.splice(draggedIndex, 1); n.splice(index, 0, d);
    setCertifications(n); setDraggedIndex(null);
  };

  const isAr = activeTab === 'ar';

  if (isLoading) return (<div className="ct"><div className="ct__loader"><div className="ct__loader-spin" /><span>{t('جاري تحميل الشهادات...')}</span></div></div>);

  return (
    <div className="ct">
      <div className="ct__topbar">
        <div>
          <h1 className="ct__title">{t('الشهادات والدورات')}</h1>
          <p className="ct__desc">{t('إدارة الشهادات المهنية والدورات التدريبية المعتمدة — عربي / English')}</p>
        </div>
        <motion.button className="ct__save" onClick={handleSaveChanges} disabled={isSaving} whileTap={{ scale: 0.97 }}>
          {isSaving ? (<><div className="ct__spinner" /><span>{t('جاري الحفظ...')}</span></>) : (<><Save size={16} /><span>{t('حفظ التغييرات')}</span></>)}
        </motion.button>
      </div>

      <div className="ct__design-bar">
        <span className="ct__design-label">{t('تصميم الشهادات:')}</span>
        <div className="ct__design-tabs">
          {[
            { key: 'classic', name: t('الكلاسيكي'), en: 'Classic' },
            { key: 'dots', name: t('النقاط'), en: 'Dots' },
            { key: 'medals', name: t('الميداليات'), en: 'Medals' },
            { key: 'shields', name: t('الدروع'), en: 'Shields' },
          ].map(d => (
            <button key={d.key} className={`ct__design-tab ${designType === d.key ? 'ct__design-tab--active' : ''}`} onClick={() => handleDesignChange(d.key)}>
              {d.name} <span className="ct__design-tab-en">{d.en}</span>
              {designType === d.key && <span className="ct__design-tab-live">ACTIVE</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="ct__grid">
        <motion.div className="ct__col" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="ct__lang">
            <button className={`ct__lang-tab ${activeTab === 'ar' ? 'ct__lang-tab--on' : ''}`} onClick={() => setActiveTab('ar')}><Globe size={15} /> {t('العربية')}</button>
            <button className={`ct__lang-tab ${activeTab === 'en' ? 'ct__lang-tab--on' : ''}`} onClick={() => setActiveTab('en')}><Languages size={15} /> English</button>
          </div>

          <div className="ct__certs">
            <div className="ct__certs-head">
              <span className="ct__certs-title">{t('قائمة الشهادات')}</span>
              <button className="ct__certs-add" onClick={handleAddCertification}><Plus size={15} /> {t('إضافة شهادة')}</button>
            </div>
            <div className="ct__certs-list">
              <AnimatePresence>
                {certifications.length === 0 ? (
                  <motion.div className="ct__certs-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Medal size={32} /><p>{t('لا توجد شهادات حالياً')}</p><span>{t('انقر على "إضافة شهادة" للبدء')}</span></motion.div>
                ) : (
                  certifications.map((cert, index) => (
                    <motion.div key={index} className={`ct__cert ${editingCert === index ? 'ct__cert--edit' : ''}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ delay: index * 0.05 }} draggable={editingCert !== index} onDragStart={() => handleDragStart(index)} onDragOver={handleDragOver} onDrop={() => handleDrop(index)}>
                      {editingCert === index ? (
                        <div className="ct__cert-form">
                          <div className="ct__cert-form-top">
                            <input className="ct__cert-icon-input" value={cert.icon} onChange={(e) => handleUpdateCert(index, 'icon', e.target.value)} maxLength="10" placeholder="🏆" />
                            <label className="ct__cert-check"><input type="checkbox" checked={cert.is_verified} onChange={(e) => handleUpdateCert(index, 'is_verified', e.target.checked)} /><span>{t('معتمد ✓')}</span></label>
                            <button className="ct__cert-ok" onClick={() => handleSaveCert(index)}><Check size={16} /></button>
                          </div>
                          <AnimatePresence mode="wait">
                            <motion.div key={activeTab} className="ct__cert-fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} dir={isAr ? 'rtl' : 'ltr'}>
                              <span className="ct__cert-lang-label">{isAr ? t('العربية') : 'English'}</span>
                              <input className="ct__cert-input" value={isAr ? cert.title_ar : cert.title_en} onChange={(e) => handleUpdateCert(index, isAr ? 'title_ar' : 'title_en', e.target.value)} placeholder={isAr ? t('عنوان الشهادة') : 'Certificate title'} />
                              <input className="ct__cert-input" value={isAr ? cert.organization_ar : cert.organization_en} onChange={(e) => handleUpdateCert(index, isAr ? 'organization_ar' : 'organization_en', e.target.value)} placeholder={isAr ? t('اسم المنظمة') : 'Organization name'} />
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      ) : (
                        <div className="ct__cert-row">
                          <div className="ct__cert-drag"><GripVertical size={16} /></div>
                          <span className="ct__cert-icon">{cert.icon}</span>
                          <div className="ct__cert-text">
                            <span className="ct__cert-name">{isAr ? cert.title_ar : cert.title_en}{cert.is_verified && <span className="ct__cert-verified">✓</span>}</span>
                            <span className="ct__cert-org">{isAr ? cert.organization_ar : cert.organization_en}</span>
                          </div>
                          <div className="ct__cert-acts">
                            <button className="ct__cert-btn" onClick={() => handleEditCert(index)}><Edit2 size={14} /></button>
                            <button className="ct__cert-btn ct__cert-btn--del" onClick={() => handleDeleteCert(index)}><Trash2 size={14} /></button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="ct__tips"><div className="ct__tips-head">{t('💡 نصائح')}</div><div className="ct__tips-list"><span>{t('Emoji مناسب لكل شهادة')}</span><span>{t('املأ عربي + إنجليزي')}</span><span>{t('اسحب لإعادة الترتيب')}</span><span>{t('"معتمد" للموثقة فقط')}</span></div></div>
        </motion.div>

        <motion.div className="ct__col" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="ct__preview-label"><Eye size={15} /><span>{t('معاينة على الموقع (')}{isAr ? t('بالعربية') : t('بالإنجليزية')})</span></div>
          <div className="ct__preview">
            {certifications.length > 0 ? (
              <div className="ct__preview-list">
                {certifications.map((cert, index) => (
                  <motion.div key={index} className="ct__pcard" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                    <span className="ct__pcard-icon">{cert.icon}</span>
                    <div className="ct__pcard-text">
                      <span className="ct__pcard-title">{isAr ? cert.title_ar : cert.title_en}</span>
                      <span className="ct__pcard-org">{isAr ? cert.organization_ar : cert.organization_en}</span>
                    </div>
                    {cert.is_verified && <span className="ct__pcard-badge"><Check size={12} />{isAr ? t('معتمد') : 'Verified'}</span>}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="ct__preview-empty"><Medal size={40} /><p>{t('لا توجد شهادات لعرضها')}</p></div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Certifications;
