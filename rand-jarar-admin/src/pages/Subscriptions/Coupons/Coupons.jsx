import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Ticket, Plus, RefreshCw, Pencil, Trash2, ToggleLeft, ToggleRight,
    Percent, DollarSign, AlertCircle, Clock, Users,
} from 'lucide-react';
import Swal from 'sweetalert2';
import couponsApi from '../../../api/couponsApi';
import CouponModal from './CouponModal';
import './Coupons.scss';
import { t, loc } from '../../../i18n';

const PLAN_LABELS = { basic: 'Basic', nutrition: 'Nutrition', elite: 'Elite', vip: 'VIP' };
const DUR_LABELS  = { '1month': t('1 شهر'), '3months': t('3 أشهر'), '6months': t('6 أشهر') };

const Coupons = () => {
    const [coupons, setCoupons]       = useState([]);
    const [isLoading, setIsLoading]   = useState(true);
    const [modalOpen, setModalOpen]   = useState(false);
    const [editCoupon, setEditCoupon] = useState(null);
    const [isSaving, setIsSaving]     = useState(false);

    const fetchCoupons = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await couponsApi.getAll();
            if (res.success) setCoupons(res.data);
        } catch {
            Swal.fire({ title: t('خطأ'), text: t('فشل تحميل الكوبونات'), icon: 'error', confirmButtonColor: '#e91e63' });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

    const handleSubmit = async (payload) => {
        setIsSaving(true);
        try {
            const res = editCoupon
                ? await couponsApi.update(editCoupon.id, payload)
                : await couponsApi.create(payload);

            if (res.success) {
                if (editCoupon) {
                    setCoupons(prev => prev.map(c => (c.id === editCoupon.id ? res.data : c)));
                } else {
                    setCoupons(prev => [res.data, ...prev]);
                }
                setModalOpen(false);
                setEditCoupon(null);
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: res.message, showConfirmButton: false, timer: 2000, timerProgressBar: true });
            }
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.errors?.code?.[0] || t('حدث خطأ');
            Swal.fire({ title: t('خطأ'), text: msg, icon: 'error', confirmButtonColor: '#e91e63' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggle = async (coupon) => {
        try {
            const res = await couponsApi.toggle(coupon.id);
            if (res.success) {
                setCoupons(prev => prev.map(c => (c.id === coupon.id ? res.data : c)));
            }
        } catch {
            Swal.fire({ title: t('خطأ'), text: t('فشل تغيير الحالة'), icon: 'error', confirmButtonColor: '#e91e63' });
        }
    };

    const handleDelete = async (coupon) => {
        const result = await Swal.fire({
            title: t('حذف الكوبون'),
            text: t('هل أنت متأكد من حذف "{0}"؟', coupon.code),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e91e63',
            cancelButtonColor: '#607d8b',
            confirmButtonText: t('نعم، احذف'),
            cancelButtonText: t('إلغاء'),
            reverseButtons: true,
        });
        if (!result.isConfirmed) return;
        try {
            const res = await couponsApi.remove(coupon.id);
            if (res.success) {
                setCoupons(prev => prev.filter(c => c.id !== coupon.id));
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: t('تم الحذف'), showConfirmButton: false, timer: 2000 });
            }
        } catch {
            Swal.fire({ title: t('خطأ'), text: t('فشل حذف الكوبون'), icon: 'error', confirmButtonColor: '#e91e63' });
        }
    };

    const getStatus = (c) => {
        if (!c.is_active) return { label: t('معطل'), cls: 'inactive' };
        if (c.is_expired) return { label: t('منتهي'), cls: 'expired' };
        if (c.has_reached_limit) return { label: t('مستنفد'), cls: 'exhausted' };
        return { label: t('مفعل'), cls: 'active' };
    };

    // ── Shared coupon row content (used in both table & card) ────────────────

    const renderCouponCard = (c) => {
        const status = getStatus(c);
        return (
            <motion.div
                key={c.id}
                className="coupons-page__card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                layout
            >
                {/* Card header: code + status + actions */}
                <div className="coupons-page__card-header">
                    <div className="coupons-page__card-code-row">
                        <code className="coupons-page__code">{c.code}</code>
                        <span className={`coupons-page__status coupons-page__status--${status.cls}`}>
                            {status.label}
                        </span>
                    </div>
                    <div className="coupons-page__actions">
                        <button title={c.is_active ? t('تعطيل') : t('تفعيل')} onClick={() => handleToggle(c)}>
                            {c.is_active ? <ToggleRight size={18} className="text-success" /> : <ToggleLeft size={18} />}
                        </button>
                        <button title={t('تعديل')} onClick={() => { setEditCoupon(c); setModalOpen(true); }}>
                            <Pencil size={16} />
                        </button>
                        <button title={t('حذف')} className="danger" onClick={() => handleDelete(c)}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {/* Card body: info grid */}
                <div className="coupons-page__card-body">
                    <div className="coupons-page__card-row">
                        <span className="coupons-page__card-label">{t('الخصم')}</span>
                        <span className="coupons-page__discount-badge">
                            {c.discount_type === 'percentage' ? <Percent size={12} /> : <DollarSign size={12} />}
                            {c.discount_value}{c.discount_type === 'percentage' ? '%' : '$'}
                        </span>
                    </div>
                    <div className="coupons-page__card-row">
                        <span className="coupons-page__card-label">{t('الخطط')}</span>
                        <span>
                            {c.allowed_plans?.length > 0
                                ? c.allowed_plans.map(p => PLAN_LABELS[p] || p).join(t('، '))
                                : <span className="coupons-page__all">{t('الكل')}</span>}
                        </span>
                    </div>
                    <div className="coupons-page__card-row">
                        <span className="coupons-page__card-label">{t('المدد')}</span>
                        <span>
                            {c.allowed_durations?.length > 0
                                ? c.allowed_durations.map(d => DUR_LABELS[d] || d).join(t('، '))
                                : <span className="coupons-page__all">{t('الكل')}</span>}
                        </span>
                    </div>
                    <div className="coupons-page__card-row">
                        <span className="coupons-page__card-label">{t('الاستخدام')}</span>
                        <span className="coupons-page__usage">
                            <Users size={12} />
                            {c.times_used}{c.max_uses ? ` / ${c.max_uses}` : ' / ∞'}
                        </span>
                    </div>
                    <div className="coupons-page__card-row">
                        <span className="coupons-page__card-label">{t('الصلاحية')}</span>
                        {c.expires_at ? (
                            <span className="coupons-page__date">
                                <Clock size={12} />
                                {new Date(c.expires_at).toLocaleDateString(loc('ar-EG'))}
                            </span>
                        ) : (
                            <span className="coupons-page__all">{t('غير محدد')}</span>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    // ── Table row (desktop only) ─────────────────────────────────────────────

    const renderTableRow = (c) => {
        const status = getStatus(c);
        return (
            <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
                <td><code className="coupons-page__code">{c.code}</code></td>
                <td>
                    <span className="coupons-page__discount-badge">
                        {c.discount_type === 'percentage' ? <Percent size={12} /> : <DollarSign size={12} />}
                        {c.discount_value}{c.discount_type === 'percentage' ? '%' : '$'}
                    </span>
                </td>
                <td>
                    {c.allowed_plans?.length > 0
                        ? c.allowed_plans.map(p => PLAN_LABELS[p] || p).join(t('، '))
                        : <span className="coupons-page__all">{t('الكل')}</span>}
                </td>
                <td>
                    {c.allowed_durations?.length > 0
                        ? c.allowed_durations.map(d => DUR_LABELS[d] || d).join(t('، '))
                        : <span className="coupons-page__all">{t('الكل')}</span>}
                </td>
                <td>
                    <span className="coupons-page__usage">
                        <Users size={12} />
                        {c.times_used}{c.max_uses ? ` / ${c.max_uses}` : ' / ∞'}
                    </span>
                </td>
                <td>
                    {c.expires_at ? (
                        <span className="coupons-page__date">
                            <Clock size={12} />
                            {new Date(c.expires_at).toLocaleDateString(loc('ar-EG'))}
                        </span>
                    ) : (
                        <span className="coupons-page__all">{t('غير محدد')}</span>
                    )}
                </td>
                <td>
                    <span className={`coupons-page__status coupons-page__status--${status.cls}`}>
                        {status.label}
                    </span>
                </td>
                <td>
                    <div className="coupons-page__actions">
                        <button title={c.is_active ? t('تعطيل') : t('تفعيل')} onClick={() => handleToggle(c)}>
                            {c.is_active ? <ToggleRight size={18} className="text-success" /> : <ToggleLeft size={18} />}
                        </button>
                        <button title={t('تعديل')} onClick={() => { setEditCoupon(c); setModalOpen(true); }}>
                            <Pencil size={16} />
                        </button>
                        <button title={t('حذف')} className="danger" onClick={() => handleDelete(c)}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                </td>
            </motion.tr>
        );
    };

    return (
        <div className="coupons-page">
            {/* Header */}
            <div className="coupons-page__header">
                <div className="coupons-page__header-left">
                    <div className="coupons-page__header-icon"><Ticket size={22} /></div>
                    <div>
                        <h1 className="coupons-page__title">{t('أكواد الخصم')}</h1>
                        <p className="coupons-page__subtitle">{t('إنشاء وإدارة كوبونات الخصم على الخطط')}</p>
                    </div>
                </div>
                <div className="coupons-page__header-actions">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="coupons-page__btn coupons-page__btn--refresh" onClick={fetchCoupons} disabled={isLoading}>
                        <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="coupons-page__btn coupons-page__btn--add" onClick={() => { setEditCoupon(null); setModalOpen(true); }}>
                        <Plus size={16} /> {t('إنشاء كوبون')}
                    </motion.button>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="coupons-page__loading">
                    <RefreshCw size={28} className="spin" />
                    <p>{t('جاري التحميل...')}</p>
                </div>
            ) : coupons.length === 0 ? (
                <div className="coupons-page__empty">
                    <AlertCircle size={40} />
                    <p>{t('لا يوجد أكواد خصم بعد')}</p>
                </div>
            ) : (
                <>
                    {/* Desktop: Table */}
                    <div className="coupons-page__table-wrap">
                        <table className="coupons-page__table">
                            <thead>
                                <tr>
                                    <th>{t('الكود')}</th>
                                    <th>{t('الخصم')}</th>
                                    <th>{t('الخطط')}</th>
                                    <th>{t('المدد')}</th>
                                    <th>{t('الاستخدام')}</th>
                                    <th>{t('الصلاحية')}</th>
                                    <th>{t('الحالة')}</th>
                                    <th>{t('إجراءات')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coupons.map(renderTableRow)}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile: Cards */}
                    <div className="coupons-page__cards">
                        {coupons.map(renderCouponCard)}
                    </div>
                </>
            )}

            <CouponModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditCoupon(null); }}
                onSubmit={handleSubmit}
                coupon={editCoupon}
                isSaving={isSaving}
            />
        </div>
    );
};

export default Coupons;
