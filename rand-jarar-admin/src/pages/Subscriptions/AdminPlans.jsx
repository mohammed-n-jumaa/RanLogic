import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, LayoutGrid } from 'lucide-react';
import notify from '../../lib/notify';
import plansApi from '../../api/plansApi';
import PlanCard from '../../components/PlanCard/PlanCard';
import './AdminPlans.scss';
import { t } from '../../i18n';

const AdminPlans = () => {
    const [plans, setPlans]         = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [savingId, setSavingId]   = useState(null); // which plan is saving

    useEffect(() => { fetchPlans(); }, []);

    const fetchPlans = async () => {
        setIsLoading(true);
        try {
            const res = await plansApi.getAll();
            if (res.success) setPlans(res.data);
        } catch {
            notify.fire({ title: t('خطأ'), text: t('فشل تحميل الخطط'), icon: 'error', confirmButtonColor: '#e91e63' });
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Save a single plan.
     * onDone() — callback to clear the dirty flag inside PlanCard.
     */
    const handleSave = async (id, payload, onDone) => {
        setSavingId(id);
        try {
            const res = await plansApi.update(id, payload);
            if (res.success) {
                // Replace the updated plan in local state
                setPlans(prev => prev.map(p => (p.id === id ? res.data : p)));
                onDone();
                notify.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: t('تم الحفظ بنجاح'),
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });
            } else {
                throw new Error(res.message || t('خطأ غير معروف'));
            }
        } catch (err) {
            notify.fire({
                title: t('خطأ في الحفظ'),
                text: err?.response?.data?.message || err.message || t('حدث خطأ'),
                icon: 'error',
                confirmButtonColor: '#e91e63',
            });
        } finally {
            setSavingId(null);
        }
    };

    return (
        <div className="admin-plans">
            {/* Header */}
            <div className="admin-plans__header">
                <div className="admin-plans__header-left">
                    <div className="admin-plans__header-icon">
                        <LayoutGrid size={20} />
                    </div>
                    <div>
                        <h1 className="admin-plans__title">{t('إدارة خطط الاشتراك')}</h1>
                        <p className="admin-plans__subtitle">
                            {t('التغييرات تنعكس فوراً على صفحة الاشتراك وعلى PayPal')}
                        </p>
                    </div>
                </div>

                <button className="admin-plans__refresh-btn" onClick={fetchPlans} disabled={isLoading}>
                    <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
                    <span>{t('تحديث')}</span>
                </button>
            </div>

            {/* Info banner */}
            <div className="admin-plans__info-banner">
                <span className="admin-plans__info-icon">ℹ️</span>
                <p>
                    {t('أدخل')} <strong>{t('السعر الأصلي')}</strong> {t('وخصم % اختياري — سيُحسب السعر النهائي تلقائياً. عند الحفظ، يُرسل السعر النهائي لـ PayPal مباشرةً.')}
                </p>
            </div>

            {/* Plans grid */}
            {isLoading ? (
                <div className="admin-plans__loading">
                    <div className="spinner-large" />
                    <p>{t('جارٍ تحميل الخطط...')}</p>
                </div>
            ) : (
                <motion.div
                    className="admin-plans__grid"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {plans.map(plan => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            onSave={handleSave}
                            isSaving={savingId === plan.id}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default AdminPlans;
