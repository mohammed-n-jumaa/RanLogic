import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ticket, Percent, DollarSign } from 'lucide-react';

const PLANS = [
    { key: 'basic', label: 'Basic' },
    { key: 'nutrition', label: 'Nutrition' },
    { key: 'elite', label: 'Elite' },
    { key: 'vip', label: 'VIP' },
];

const DURATIONS = [
    { key: '1month', label: '1 شهر' },
    { key: '3months', label: '3 أشهر' },
    { key: '6months', label: '6 أشهر' },
];

const EMPTY_FORM = {
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_amount: '',
    allowed_plans: [],
    allowed_durations: [],
    max_uses: '',
    is_active: true,
    starts_at: '',
    expires_at: '',
};

const CouponModal = ({ isOpen, onClose, onSubmit, coupon, isSaving }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const isEdit = Boolean(coupon);

    useEffect(() => {
        if (coupon) {
            setForm({
                code: coupon.code || '',
                discount_type: coupon.discount_type || 'percentage',
                discount_value: coupon.discount_value ?? '',
                min_amount: coupon.min_amount ?? '',
                allowed_plans: coupon.allowed_plans || [],
                allowed_durations: coupon.allowed_durations || [],
                max_uses: coupon.max_uses ?? '',
                is_active: coupon.is_active ?? true,
                starts_at: coupon.starts_at ? coupon.starts_at.slice(0, 16) : '',
                expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 16) : '',
            });
        } else {
            setForm(EMPTY_FORM);
        }
    }, [coupon, isOpen]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const toggleArrayItem = (field, item) => {
        setForm(prev => {
            const arr = prev[field];
            return {
                ...prev,
                [field]: arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item],
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            discount_value: Number(form.discount_value),
            min_amount: form.min_amount !== '' ? Number(form.min_amount) : null,
            max_uses: form.max_uses !== '' ? Number(form.max_uses) : null,
            allowed_plans: form.allowed_plans.length > 0 ? form.allowed_plans : null,
            allowed_durations: form.allowed_durations.length > 0 ? form.allowed_durations : null,
            starts_at: form.starts_at || null,
            expires_at: form.expires_at || null,
        };

        onSubmit(payload);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="coupon-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="coupon-modal"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="coupon-modal__header">
                            <div className="coupon-modal__header-left">
                                <Ticket size={20} />
                                <span>{isEdit ? 'تعديل كود الخصم' : 'إنشاء كود خصم جديد'}</span>
                            </div>
                            <button className="coupon-modal__close" onClick={onClose}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="coupon-modal__body" onSubmit={handleSubmit}>
                            {/* Code */}
                            <div className="coupon-modal__field">
                                <label>كود الخصم</label>
                                <input
                                    type="text"
                                    value={form.code}
                                    onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                                    placeholder="SUMMER2026"
                                    required
                                />
                            </div>

                            {/* Discount type + value */}
                            <div className="coupon-modal__row">
                                <div className="coupon-modal__field">
                                    <label>نوع الخصم</label>
                                    <div className="coupon-modal__type-toggle">
                                        <button
                                            type="button"
                                            className={form.discount_type === 'percentage' ? 'active' : ''}
                                            onClick={() => handleChange('discount_type', 'percentage')}
                                        >
                                            <Percent size={14} /> نسبة %
                                        </button>
                                        <button
                                            type="button"
                                            className={form.discount_type === 'fixed' ? 'active' : ''}
                                            onClick={() => handleChange('discount_type', 'fixed')}
                                        >
                                            <DollarSign size={14} /> مبلغ ثابت
                                        </button>
                                    </div>
                                </div>
                                <div className="coupon-modal__field">
                                    <label>
                                        {form.discount_type === 'percentage' ? 'النسبة (%)' : 'المبلغ ($)'}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max={form.discount_type === 'percentage' ? 100 : undefined}
                                        value={form.discount_value}
                                        onChange={(e) => handleChange('discount_value', e.target.value)}
                                        placeholder={form.discount_type === 'percentage' ? '20' : '10'}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Min amount + Max uses */}
                            <div className="coupon-modal__row">
                                <div className="coupon-modal__field">
                                    <label>الحد الأدنى للمبلغ ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.min_amount}
                                        onChange={(e) => handleChange('min_amount', e.target.value)}
                                        placeholder="اختياري"
                                    />
                                </div>
                                <div className="coupon-modal__field">
                                    <label>الحد الأقصى للاستخدام</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={form.max_uses}
                                        onChange={(e) => handleChange('max_uses', e.target.value)}
                                        placeholder="غير محدود"
                                    />
                                </div>
                            </div>

                            {/* Allowed plans */}
                            <div className="coupon-modal__field">
                                <label>الخطط المسموحة <span className="coupon-modal__hint">(اتركها فارغة = كل الخطط)</span></label>
                                <div className="coupon-modal__chips">
                                    {PLANS.map(p => (
                                        <button
                                            key={p.key}
                                            type="button"
                                            className={`coupon-modal__chip ${form.allowed_plans.includes(p.key) ? 'active' : ''}`}
                                            onClick={() => toggleArrayItem('allowed_plans', p.key)}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Allowed durations */}
                            <div className="coupon-modal__field">
                                <label>المدد المسموحة <span className="coupon-modal__hint">(اتركها فارغة = كل المدد)</span></label>
                                <div className="coupon-modal__chips">
                                    {DURATIONS.map(d => (
                                        <button
                                            key={d.key}
                                            type="button"
                                            className={`coupon-modal__chip ${form.allowed_durations.includes(d.key) ? 'active' : ''}`}
                                            onClick={() => toggleArrayItem('allowed_durations', d.key)}
                                        >
                                            {d.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="coupon-modal__row">
                                <div className="coupon-modal__field">
                                    <label>تاريخ البداية</label>
                                    <input
                                        type="datetime-local"
                                        value={form.starts_at}
                                        onChange={(e) => handleChange('starts_at', e.target.value)}
                                    />
                                </div>
                                <div className="coupon-modal__field">
                                    <label>تاريخ الانتهاء</label>
                                    <input
                                        type="datetime-local"
                                        value={form.expires_at}
                                        onChange={(e) => handleChange('expires_at', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Active toggle */}
                            <div className="coupon-modal__field coupon-modal__toggle-row">
                                <label>الحالة</label>
                                <button
                                    type="button"
                                    className={`coupon-modal__status-btn ${form.is_active ? 'active' : 'inactive'}`}
                                    onClick={() => handleChange('is_active', !form.is_active)}
                                >
                                    {form.is_active ? 'مفعل' : 'معطل'}
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="coupon-modal__footer">
                            <button className="coupon-modal__btn coupon-modal__btn--cancel" onClick={onClose} disabled={isSaving}>
                                إلغاء
                            </button>
                            <button className="coupon-modal__btn coupon-modal__btn--save" onClick={handleSubmit} disabled={isSaving}>
                                {isSaving ? 'جاري الحفظ...' : isEdit ? 'تحديث' : 'إنشاء'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CouponModal;
