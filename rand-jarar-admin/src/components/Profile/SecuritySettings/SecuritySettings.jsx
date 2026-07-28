import React, { useState } from 'react';
import {
    Lock,
    Eye,
    EyeOff,
    CheckCircle,
    XCircle,
    Save
} from 'lucide-react';
import './SecuritySettings.scss';

const SecuritySettings = ({ onSave, isLoading }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'كلمة المرور الحالية مطلوبة';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'كلمة المرور الجديدة مطلوبة';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
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
        
        // Reset form after successful save
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setShowPasswords({
            current: false,
            new: false,
            confirm: false
        });
    };

    const passwordRequirements = [
        { label: '8 أحرف على الأقل', test: val => val.length >= 8 },
        { label: 'حرف كبير واحد على الأقل', test: val => /[A-Z]/.test(val) },
        { label: 'حرف صغير واحد على الأقل', test: val => /[a-z]/.test(val) },
        { label: 'رقم واحد على الأقل', test: val => /\d/.test(val) }
    ];

    const hasAnyInput = formData.currentPassword || formData.newPassword || formData.confirmPassword;

    return (
        <div className="security-settings-container">
            <div className="security-header-section">
                <Lock className="header-icon" />
                <div className="header-text">
                    <h2 className="header-title">تغيير كلمة المرور</h2>
                    <p className="header-subtitle">قم بتحديث كلمة المرور لتعزيز أمان حسابك</p>
                </div>
            </div>

            <form className="security-form-container" onSubmit={handleSubmit}>
                {/* Password Fields */}
                <div className="password-section">
                    <div className="password-fields">
                        {/* كلمة المرور الحالية */}
                        <div className="input-group">
                            <label className="input-label">كلمة المرور الحالية</label>
                            <div className="password-input-container">
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    name="currentPassword"
                                    className={`input-field password-field ${errors.currentPassword ? 'error' : ''}`}
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    placeholder="أدخل كلمة المرور الحالية"
                                />
                                <button
                                    type="button"
                                    className="toggle-password-btn"
                                    onClick={() => togglePasswordVisibility('current')}
                                    tabIndex={-1}
                                >
                                    {showPasswords.current ? 
                                        <EyeOff className="eye-icon" /> : 
                                        <Eye className="eye-icon" />
                                    }
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <span className="error-text">{errors.currentPassword}</span>
                            )}
                        </div>

                        {/* كلمة المرور الجديدة */}
                        <div className="input-group">
                            <label className="input-label">كلمة المرور الجديدة</label>
                            <div className="password-input-container">
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    name="newPassword"
                                    className={`input-field password-field ${errors.newPassword ? 'error' : ''}`}
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="أدخل كلمة المرور الجديدة"
                                />
                                <button
                                    type="button"
                                    className="toggle-password-btn"
                                    onClick={() => togglePasswordVisibility('new')}
                                    tabIndex={-1}
                                >
                                    {showPasswords.new ? 
                                        <EyeOff className="eye-icon" /> : 
                                        <Eye className="eye-icon" />
                                    }
                                </button>
                            </div>
                            {errors.newPassword && (
                                <span className="error-text">{errors.newPassword}</span>
                            )}
                        </div>

                        {/* تأكيد كلمة المرور */}
                        <div className="input-group">
                            <label className="input-label">تأكيد كلمة المرور</label>
                            <div className="password-input-container">
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    name="confirmPassword"
                                    className={`input-field password-field ${errors.confirmPassword ? 'error' : ''}`}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="أعد إدخال كلمة المرور الجديدة"
                                />
                                <button
                                    type="button"
                                    className="toggle-password-btn"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    tabIndex={-1}
                                >
                                    {showPasswords.confirm ? 
                                        <EyeOff className="eye-icon" /> : 
                                        <Eye className="eye-icon" />
                                    }
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <span className="error-text">{errors.confirmPassword}</span>
                            )}
                        </div>

                        {/* متطلبات كلمة المرور */}
                        {formData.newPassword && (
                            <div className="requirements-box">
                                <p className="requirements-heading">متطلبات كلمة المرور:</p>
                                <ul className="requirements-list">
                                    {passwordRequirements.map((req, i) => {
                                        const valid = req.test(formData.newPassword);
                                        return (
                                            <li key={i} className={`requirement ${valid ? 'valid' : 'invalid'}`}>
                                                {valid ? 
                                                    <CheckCircle className="req-icon" /> : 
                                                    <XCircle className="req-icon" />
                                                }
                                                {req.label}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* زر الحفظ */}
                <div className="form-footer">
                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={isLoading || !hasAnyInput}
                    >
                        {isLoading ? (
                            <>
                                <div className="spinner-btn"></div>
                                جاري الحفظ...
                            </>
                        ) : (
                            <>
                                <Save className="btn-icon" />
                                حفظ التغييرات
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SecuritySettings;