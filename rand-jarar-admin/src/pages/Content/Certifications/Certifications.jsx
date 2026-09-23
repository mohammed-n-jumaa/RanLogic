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
  const [activeTab, setActiveTab] = useState('ar');
  const [certifications, setCertifications] = useState([]);
  const [editingCert, setEditingCert] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    fetchCertifications();
  }, []);

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
        confirmButtonColor: '#e91e63',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCertification = () => {
    const newCert = {
      id: null,
      icon: '🎖️',
      title_en: '',
      title_ar: '',
      organization_en: '',
      organization_ar: '',
      is_verified: false,
      order: certifications.length,
    };
    setCertifications([...certifications, newCert]);
    setEditingCert(certifications.length);
  };

  const handleEditCert = (index) => {
    setEditingCert(index);
  };

  const handleUpdateCert = (index, field, value) => {
    const updatedCerts = [...certifications];
    updatedCerts[index] = { ...updatedCerts[index], [field]: value };
    setCertifications(updatedCerts);
  };

  const handleDeleteCert = async (index) => {
    const result = await Swal.fire({
      title: 'تأكيد الحذف',
      text: 'هل أنت متأكد من حذف هذه الشهادة؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#607d8b',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
    });

    if (!result.isConfirmed) return;

    setCertifications(certifications.filter((_, i) => i !== index));
    Swal.fire({
      title: 'تم الحذف',
      text: 'تم حذف الشهادة بنجاح',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleSaveCert = (index) => {
    setEditingCert(null);
  };

  const handleSaveChanges = async () => {
    const isValid = certifications.every(
      (cert) =>
        cert.icon &&
        cert.title_en &&
        cert.title_ar &&
        cert.organization_en &&
        cert.organization_ar
    );

    if (!isValid) {
      Swal.fire({
        title: 'تنبيه',
        text: 'يرجى ملء جميع الحقول (عربي وإنجليزي) لكل شهادة',
        icon: 'warning',
        confirmButtonColor: '#e91e63',
      });
      return;
    }

    setIsSaving(true);

    try {
      const data = certifications.map((cert, index) => ({
        id: cert.id,
        icon: cert.icon,
        title_en: cert.title_en,
        title_ar: cert.title_ar,
        organization_en: cert.organization_en,
        organization_ar: cert.organization_ar,
        is_verified: cert.is_verified,
        order: index,
        is_active: true,
      }));

      const response = await certificationsApi.bulkUpdateCertifications(data);

      if (response.success) {
        setUploadStatus('success');
        setTimeout(() => setUploadStatus(null), 3000);

        Swal.fire({
          title: 'نجح',
          text: 'تم حفظ جميع الشهادات بنجاح',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });

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
        confirmButtonColor: '#e91e63',
      });
    } finally {
      setIsSaving(false);
    }
  };

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

  const isAr = activeTab === 'ar';

  if (isLoading) {
    return (
      <div className="ct">
        <div className="ct__loader">
          <div className="ct__loader-spin" />
          <span>جاري تحميل الشهادات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ct">
      {/* ── Top Bar ── */}
      <div className="ct__topbar">
        <div>
          <h1 className="ct__title">الشهادات والدورات</h1>
          <p className="ct__desc">
            إدارة الشهادات المهنية والدورات التدريبية المعتمدة — عربي / English
          </p>
        </div>
        <motion.button
          className="ct__save"
          onClick={handleSaveChanges}
          disabled={isSaving}
          whileTap={{ scale: 0.97 }}
        >
          {isSaving ? (
            <>
              <div className="ct__spinner" />
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

      {/* ── Main Grid ── */}
      <div className="ct__grid">
        {/* ═══ COL 1: Certifications List ═══ */}
        <motion.div
          className="ct__col"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Language Tabs */}
          <div className="ct__lang">
            <button
              className={`ct__lang-tab ${activeTab === 'ar' ? 'ct__lang-tab--on' : ''}`}
              onClick={() => setActiveTab('ar')}
            >
              <Globe size={15} /> العربية
            </button>
            <button
              className={`ct__lang-tab ${activeTab === 'en' ? 'ct__lang-tab--on' : ''}`}
              onClick={() => setActiveTab('en')}
            >
              <Languages size={15} /> English
            </button>
          </div>

          {/* Certs Card */}
          <div className="ct__certs">
            <div className="ct__certs-head">
              <span className="ct__certs-title">قائمة الشهادات</span>
              <button
                className="ct__certs-add"
                onClick={handleAddCertification}
              >
                <Plus size={15} /> إضافة شهادة
              </button>
            </div>

            <div className="ct__certs-list">
              <AnimatePresence>
                {certifications.length === 0 ? (
                  <motion.div
                    className="ct__certs-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Medal size={32} />
                    <p>لا توجد شهادات حالياً</p>
                    <span>انقر على "إضافة شهادة" للبدء</span>
                  </motion.div>
                ) : (
                  certifications.map((cert, index) => (
                    <motion.div
                      key={index}
                      className={`ct__cert ${editingCert === index ? 'ct__cert--edit' : ''}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ delay: index * 0.05 }}
                      draggable={editingCert !== index}
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={() => handleDrop(index)}
                    >
                      {editingCert === index ? (
                        /* ── Edit Mode ── */
                        <div className="ct__cert-form">
                          <div className="ct__cert-form-top">
                            <input
                              className="ct__cert-icon-input"
                              value={cert.icon}
                              onChange={(e) =>
                                handleUpdateCert(index, 'icon', e.target.value)
                              }
                              maxLength="10"
                              placeholder="🏆"
                            />
                            <label className="ct__cert-check">
                              <input
                                type="checkbox"
                                checked={cert.is_verified}
                                onChange={(e) =>
                                  handleUpdateCert(
                                    index,
                                    'is_verified',
                                    e.target.checked
                                  )
                                }
                              />
                              <span>معتمد ✓</span>
                            </label>
                            <button
                              className="ct__cert-ok"
                              onClick={() => handleSaveCert(index)}
                            >
                              <Check size={16} />
                            </button>
                          </div>

                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activeTab}
                              className="ct__cert-fields"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              dir={isAr ? 'rtl' : 'ltr'}
                            >
                              <span className="ct__cert-lang-label">
                                {isAr ? 'العربية' : 'English'}
                              </span>
                              <input
                                className="ct__cert-input"
                                value={
                                  isAr ? cert.title_ar : cert.title_en
                                }
                                onChange={(e) =>
                                  handleUpdateCert(
                                    index,
                                    isAr ? 'title_ar' : 'title_en',
                                    e.target.value
                                  )
                                }
                                placeholder={
                                  isAr ? 'عنوان الشهادة' : 'Certificate title'
                                }
                              />
                              <input
                                className="ct__cert-input"
                                value={
                                  isAr
                                    ? cert.organization_ar
                                    : cert.organization_en
                                }
                                onChange={(e) =>
                                  handleUpdateCert(
                                    index,
                                    isAr
                                      ? 'organization_ar'
                                      : 'organization_en',
                                    e.target.value
                                  )
                                }
                                placeholder={
                                  isAr ? 'اسم المنظمة' : 'Organization name'
                                }
                              />
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      ) : (
                        /* ── Display Mode ── */
                        <div className="ct__cert-row">
                          <div className="ct__cert-drag">
                            <GripVertical size={16} />
                          </div>
                          <span className="ct__cert-icon">{cert.icon}</span>
                          <div className="ct__cert-text">
                            <span className="ct__cert-name">
                              {isAr ? cert.title_ar : cert.title_en}
                              {cert.is_verified && (
                                <span className="ct__cert-verified">✓</span>
                              )}
                            </span>
                            <span className="ct__cert-org">
                              {isAr
                                ? cert.organization_ar
                                : cert.organization_en}
                            </span>
                          </div>
                          <div className="ct__cert-acts">
                            <button
                              className="ct__cert-btn"
                              onClick={() => handleEditCert(index)}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="ct__cert-btn ct__cert-btn--del"
                              onClick={() => handleDeleteCert(index)}
                            >
                              <Trash2 size={14} />
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

          {/* Tips */}
          <div className="ct__tips">
            <div className="ct__tips-head">💡 نصائح</div>
            <div className="ct__tips-list">
              <span>Emoji مناسب لكل شهادة</span>
              <span>املأ عربي + إنجليزي</span>
              <span>اسحب لإعادة الترتيب</span>
              <span>"معتمد" للموثقة فقط</span>
            </div>
          </div>
        </motion.div>

        {/* ═══ COL 2: Preview ═══ */}
        <motion.div
          className="ct__col"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="ct__preview-label">
            <Eye size={15} />
            <span>
              معاينة على الموقع ({isAr ? 'بالعربية' : 'بالإنجليزية'})
            </span>
          </div>

          <div className="ct__preview">
            {certifications.length > 0 ? (
              <div className="ct__preview-list">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    className="ct__pcard"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="ct__pcard-icon">{cert.icon}</span>
                    <div className="ct__pcard-text">
                      <span className="ct__pcard-title">
                        {isAr ? cert.title_ar : cert.title_en}
                      </span>
                      <span className="ct__pcard-org">
                        {isAr ? cert.organization_ar : cert.organization_en}
                      </span>
                    </div>
                    {cert.is_verified && (
                      <span className="ct__pcard-badge">
                        <Check size={12} />
                        {isAr ? 'معتمد' : 'Verified'}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="ct__preview-empty">
                <Medal size={40} />
                <p>لا توجد شهادات لعرضها</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Certifications;