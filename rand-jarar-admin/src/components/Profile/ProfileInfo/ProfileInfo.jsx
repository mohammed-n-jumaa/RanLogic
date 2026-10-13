import React, { useState, useEffect } from 'react';
import { Mail, User, Phone, Save } from 'lucide-react';
import './ProfileInfo.scss';
import { t } from '../../../i18n';

const ProfileInfo = ({ userData, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Check if there are changes
      const changed = 
        newData.name !== userData.name ||
        newData.email !== userData.email ||
        newData.phone !== (userData.phone || '');
      
      setHasChanges(changed);
      
      return newData;
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('الاسم مطلوب');
    } else if (formData.name.length > 255) {
      newErrors.name = t('الاسم يجب أن لا يتجاوز 255 حرف');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('البريد الإلكتروني مطلوب');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('البريد الإلكتروني غير صالح');
    }

    if (formData.phone && formData.phone.length > 20) {
      newErrors.phone = t('رقم الهاتف يجب أن لا يتجاوز 20 حرف');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  const handleReset = () => {
    setFormData({
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
    });
    setErrors({});
    setHasChanges(false);
  };

  return (
    <div className="profile-info-container">
      <div className="info-header">
        <User size={24} />
        <div className="header-text">
          <h2>{t('المعلومات الشخصية')}</h2>
          <p>{t('تحديث بياناتك الأساسية')}</p>
        </div>
      </div>

      <form className="info-form" onSubmit={handleSubmit}>
        <div className="form-fields">
          {/* الاسم */}
          <div className="field-wrapper">
            <label className="field-label">
              <User size={16} />
              {t('الاسم الكامل')}
            </label>
            <input
              type="text"
              name="name"
              className={`field-input ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder={t('أدخل اسمك الكامل')}
            />
            {errors.name && (
              <span className="error-text">{errors.name}</span>
            )}
          </div>

          {/* البريد الإلكتروني */}
          <div className="field-wrapper">
            <label className="field-label">
              <Mail size={16} />
              {t('البريد الإلكتروني')}
            </label>
            <input
              type="email"
              name="email"
              className={`field-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder={t('أدخل بريدك الإلكتروني')}
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          {/* رقم الهاتف */}
          <div className="field-wrapper">
            <label className="field-label">
              <Phone size={16} />
              {t('رقم الهاتف')}
            </label>
            <input
              type="tel"
              name="phone"
              className={`field-input ${errors.phone ? 'error' : ''}`}
              value={formData.phone}
              onChange={handleChange}
              placeholder={t('أدخل رقم هاتفك (اختياري)')}
            />
            {errors.phone && (
              <span className="error-text">{errors.phone}</span>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-reset"
            onClick={handleReset}
            disabled={!hasChanges || isLoading}
          >
            {t('إلغاء')}
          </button>
          <button
            type="submit"
            className="btn-save"
            disabled={!hasChanges || isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                {t('جاري الحفظ...')}
              </>
            ) : (
              <>
                <Save size={18} />
                {t('حفظ التغييرات')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;