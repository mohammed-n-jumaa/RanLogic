import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Save, Loader } from 'lucide-react';
import './AddClientModal.scss';

const AddClientModal = ({ isOpen, onClose, onSave, editClient }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    weight: '',
    height: '',
    waist: '',
    hips: '',
    gender: '',
    goal: '',
    workout_place: '',
    program: '',
    health_notes: '',
    avatar: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  useEffect(() => {
    if (editClient) {
      setFormData({
        name: editClient.name || '',
        email: editClient.email || '',
        password: '', // Don't show password
        phone: editClient.phone || '',
        age: editClient.age || '',
        weight: editClient.weight || '',
        height: editClient.height || '',
        waist: editClient.waist || '',
        hips: editClient.hips || '',
        gender: editClient.gender || '',
        goal: editClient.goal || '',
        workout_place: editClient.workout_place || '',
        program: editClient.program || '',
        health_notes: editClient.health_notes || '',
        avatar: null // Reset avatar on edit
      });
      
      // Show existing avatar if available
      if (editClient.avatar) {
        const avatarUrl = editClient.avatar.startsWith('http') 
          ? editClient.avatar 
          : `${API_URL}/storage/${editClient.avatar}`;
        setImagePreview(avatarUrl);
      } else {
        setImagePreview(null);
      }
    } else {
      // Reset form for new client
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        age: '',
        weight: '',
        height: '',
        waist: '',
        hips: '',
        gender: '',
        goal: '',
        workout_place: '',
        program: '',
        health_notes: '',
        avatar: null
      });
      setImagePreview(null);
    }
  }, [editClient, isOpen, API_URL]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة يجب ألا يتجاوز 5MB');
        e.target.value = null;
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('يجب اختيار ملف صورة');
        e.target.value = null;
        return;
      }
      
      console.log('Selected image file:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      // Store file in state
      setFormData(prev => ({ ...prev, avatar: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, avatar: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      console.log('Preparing form submission...');
      console.log('Form data:', formData);
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        
        // Skip avatar - we'll add it separately
        if (key === 'avatar') {
          return;
        }
        
        // Only add non-empty values
        if (value !== null && value !== '' && value !== undefined) {
          submitData.append(key, value);
        }
      });
      
      // Add avatar file if selected
      if (formData.avatar instanceof File) {
        console.log('Adding avatar file to FormData:', {
          name: formData.avatar.name,
          size: formData.avatar.size,
          type: formData.avatar.type
        });
        submitData.append('avatar', formData.avatar, formData.avatar.name);
      }
      
      // Add _method for PUT when editing (Laravel method spoofing)
      if (editClient) {
        submitData.append('_method', 'PUT');
      }
      
      // Log FormData contents for debugging
      console.log('FormData entries:');
      for (let [key, value] of submitData.entries()) {
        if (value instanceof File) {
          console.log(key, ':', value.name, `(${value.size} bytes, ${value.type})`);
        } else {
          console.log(key, ':', value);
        }
      }
      
      // Call parent save handler
      await onSave(submitData);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          className="add-client-modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="add-client-modal__header">
            <h2 className="add-client-modal__title">
              {editClient ? 'تعديل بيانات المتدرب' : 'إضافة متدرب جديد'}
            </h2>
            <button 
              className="add-client-modal__close" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
          </div>
          
          <form className="add-client-modal__form" onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div className="add-client-modal__image-section">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
                disabled={isSubmitting}
              />
              
              <div 
                className="add-client-modal__image-upload"
                onClick={() => !isSubmitting && fileInputRef.current?.click()}
                style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              >
                {imagePreview ? (
                  <div className="add-client-modal__image-preview">
                    <img src={imagePreview} alt="Client" />
                    {!isSubmitting && (
                      <button
                        type="button"
                        className="add-client-modal__image-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="add-client-modal__image-placeholder">
                    <Upload size={40} />
                    <span>انقر لرفع الصورة</span>
                    <span className="add-client-modal__image-hint">PNG, JPG حتى 5MB</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Form Grid */}
            <div className="add-client-modal__grid">
              <div className="form-group">
                <label className="form-label">الاسم الكامل *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">البريد الإلكتروني *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  كلمة المرور {editClient ? '(اتركها فارغة إذا لم تريد التغيير)' : '*'}
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editClient}
                  minLength={8}
                  disabled={isSubmitting}
                  placeholder={editClient ? 'اترك فارغاً للإبقاء على كلمة المرور الحالية' : ''}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">رقم الهاتف</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">الجنس</label>
                <select
                  name="gender"
                  className="form-input"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="">اختر الجنس</option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">العمر</label>
                <input
                  type="number"
                  name="age"
                  className="form-input"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">الطول (سم)</label>
                <input
                  type="number"
                  name="height"
                  className="form-input"
                  value={formData.height}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">الوزن (كغ)</label>
                <input
                  type="number"
                  name="weight"
                  className="form-input"
                  value={formData.weight}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">محيط الخصر (سم)</label>
                <input
                  type="number"
                  name="waist"
                  className="form-input"
                  value={formData.waist}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  disabled={isSubmitting}
                />
              </div>
              
              {formData.gender === 'female' && (
                <div className="form-group">
                  <label className="form-label">محيط الأرداف (سم)</label>
                  <input
                    type="number"
                    name="hips"
                    className="form-input"
                    value={formData.hips}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                  />
                </div>
              )}
              
              <div className="form-group">
                <label className="form-label">الهدف</label>
                <select
                  name="goal"
                  className="form-input"
                  value={formData.goal}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="">اختر الهدف</option>
                  <option value="weight-loss">إنقاص الوزن</option>
                  <option value="muscle-gain">بناء العضلات</option>
                  <option value="toning">تنشيف</option>
                  <option value="fitness">لياقة عامة</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">مكان التدريب</label>
                <select
                  name="workout_place"
                  className="form-input"
                  value={formData.workout_place}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="">اختر المكان</option>
                  <option value="home">منزل</option>
                  <option value="gym">جيم</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">البرنامج المختار</label>
                <input
                  type="text"
                  name="program"
                  className="form-input"
                  value={formData.program}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">ملاحظات صحية</label>
                <textarea
                  name="health_notes"
                  className="form-input"
                  value={formData.health_notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="إصابات، حساسية، أدوية، إلخ..."
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="add-client-modal__actions">
              <button 
                type="button" 
                className="add-client-modal__cancel" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                إلغاء
              </button>
              <button 
                type="submit" 
                className="add-client-modal__submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={18} className="spinner" />
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>{editClient ? 'حفظ التعديلات' : 'إضافة المتدرب'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddClientModal;