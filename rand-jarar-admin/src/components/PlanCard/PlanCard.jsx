import React, { useState, useCallback, useMemo } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Save, RotateCcw } from 'lucide-react';
import './PlanCard.scss';

// ─── Constants ────────────────────────────────────────────────────────────────

const DURATION_LABELS = {
    '1month':  '1 Month',
    '3months': '3 Months',
    '6months': '6 Months',
};

const COLOR_MAP = {
    blue:  { accent: '#2196f3', bg: 'rgba(33,150,243,0.08)'  },
    green: { accent: '#4caf50', bg: 'rgba(76,175,80,0.08)'   },
    pink:  { accent: '#e91e63', bg: 'rgba(233,30,99,0.08)'   },
    gold:  { accent: '#ff9800', bg: 'rgba(255,152,0,0.08)'   },
};

const TAB_LABELS = {
    pricing:  '💰 أسعار',
    names:    '✏️ أسماء',
    features: '📋 مميزات',
    badge:    '🏅 شارة',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Safely parse features — handles both array and JSON string from API.
 */
const parseFeatures = (val) => {
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val || '[]'); } catch { return []; }
};

/**
 * Compute discounted price from original + discount%.
 */
const calcPrice = (original, discount) => {
    const orig = parseFloat(original) || 0;
    const disc = Math.min(Math.max(parseInt(discount) || 0, 0), 100);
    return +(orig * (1 - disc / 100)).toFixed(2);
};

/**
 * Build initial local state from plan prop.
 */
const buildInitialState = (plan) => ({
    name_ar:     plan.name_ar     ?? '',
    name_en:     plan.name_en     ?? '',
    subtitle_ar: plan.subtitle_ar ?? '',
    subtitle_en: plan.subtitle_en ?? '',
    features_ar: parseFeatures(plan.features_ar),
    features_en: parseFeatures(plan.features_en),
    is_popular:  plan.is_popular  ?? false,
    badge_ar:    plan.badge_ar    ?? '',
    badge_en:    plan.badge_en    ?? '',
    pricing: {
        '1month':  { original_price: plan.pricing?.['1month']?.original_price  ?? 0, discount: plan.pricing?.['1month']?.discount  ?? 0 },
        '3months': { original_price: plan.pricing?.['3months']?.original_price ?? 0, discount: plan.pricing?.['3months']?.discount ?? 0 },
        '6months': { original_price: plan.pricing?.['6months']?.original_price ?? 0, discount: plan.pricing?.['6months']?.discount ?? 0 },
    },
});

// ─── PricingRow ───────────────────────────────────────────────────────────────

const PricingRow = React.memo(({ label, pricing, onChange }) => {
    const finalPrice = useMemo(
        () => calcPrice(pricing.original_price, pricing.discount),
        [pricing.original_price, pricing.discount],
    );

    return (
        <div className="plan-card__pricing-row">
            <span className="plan-card__pricing-label">{label}</span>

            <div className="plan-card__pricing-inputs">
                <div className="plan-card__field-wrap">
                    <label>السعر الأصلي $</label>
                    <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={pricing.original_price}
                        onChange={e => onChange({ original_price: e.target.value })}
                        className="plan-card__input"
                    />
                </div>

                <div className="plan-card__field-wrap">
                    <label>خصم %</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={pricing.discount}
                        onChange={e => onChange({ discount: e.target.value })}
                        placeholder="0"
                        className="plan-card__input"
                    />
                </div>

                <div className="plan-card__field-wrap plan-card__field-wrap--result">
                    <label>السعر النهائي $</label>
                    <div className="plan-card__final-price">{finalPrice}</div>
                </div>
            </div>
        </div>
    );
});

PricingRow.displayName = 'PricingRow';

// ─── PlanCard ─────────────────────────────────────────────────────────────────

const PlanCard = ({ plan, onSave, isSaving }) => {
    const colors = COLOR_MAP[plan.color] ?? COLOR_MAP.blue;

    const [local, setLocal]       = useState(() => buildInitialState(plan));
    const [expanded, setExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('pricing');
    const [isDirty, setIsDirty]   = useState(false);

    // ── State updaters ───────────────────────────────────────────────────────

    const set = useCallback((patch) => {
        setLocal(prev => ({ ...prev, ...patch }));
        setIsDirty(true);
    }, []);

    const setPricing = useCallback((duration, patch) => {
        setLocal(prev => ({
            ...prev,
            pricing: {
                ...prev.pricing,
                [duration]: { ...prev.pricing[duration], ...patch },
            },
        }));
        setIsDirty(true);
    }, []);

    const setFeature = useCallback((lang, idx, value) => {
        const key = `features_${lang}`;
        setLocal(prev => {
            const arr = [...prev[key]];
            arr[idx] = value;
            return { ...prev, [key]: arr };
        });
        setIsDirty(true);
    }, []);

    const addFeature = useCallback((lang) => {
        const key = `features_${lang}`;
        setLocal(prev => ({ ...prev, [key]: [...prev[key], ''] }));
        setIsDirty(true);
    }, []);

    const removeFeature = useCallback((lang, idx) => {
        const key = `features_${lang}`;
        setLocal(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) }));
        setIsDirty(true);
    }, []);

    // ── Actions ──────────────────────────────────────────────────────────────

    const handleReset = useCallback(() => {
        setLocal(buildInitialState(plan));
        setIsDirty(false);
    }, [plan]);

    const handleSave = useCallback(() => {
        const payload = {
            name_ar:     local.name_ar,
            name_en:     local.name_en,
            subtitle_ar: local.subtitle_ar,
            subtitle_en: local.subtitle_en,
            features_ar: local.features_ar.filter(f => f.trim() !== ''),
            features_en: local.features_en.filter(f => f.trim() !== ''),
            is_popular:  local.is_popular,
            badge_ar:    local.badge_ar,
            badge_en:    local.badge_en,
            original_price_1m: parseFloat(local.pricing['1month'].original_price)  || 0,
            discount_1m:       parseInt(local.pricing['1month'].discount)           || 0,
            original_price_3m: parseFloat(local.pricing['3months'].original_price) || 0,
            discount_3m:       parseInt(local.pricing['3months'].discount)          || 0,
            original_price_6m: parseFloat(local.pricing['6months'].original_price) || 0,
            discount_6m:       parseInt(local.pricing['6months'].discount)          || 0,
        };
        onSave(plan.id, payload, () => setIsDirty(false));
    }, [local, plan.id, onSave]);

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <div
            className={[
                'plan-card',
                expanded ? 'plan-card--expanded' : '',
                isDirty  ? 'plan-card--dirty'    : '',
            ].join(' ')}
            style={{ '--card-accent': colors.accent, '--card-bg': colors.bg }}
        >
            {/* Header */}
            <div className="plan-card__header" onClick={() => setExpanded(v => !v)}>
                <div className="plan-card__header-left">
                    <span className="plan-card__icon">{plan.icon}</span>
                    <div className="plan-card__title-wrap">
                        <span className="plan-card__title">{local.name_ar}</span>
                        <span className="plan-card__key">{plan.plan_key}</span>
                    </div>
                </div>

                <div className="plan-card__header-right">
                    {local.is_popular && (
                        <span className="plan-card__popular-badge">الأكثر شعبية</span>
                    )}
                    {isDirty && <span className="plan-card__unsaved">● غير محفوظ</span>}
                    {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
            </div>

            {/* Body */}
            {expanded && (
                <div className="plan-card__body">

                    {/* Tabs */}
                    <div className="plan-card__tabs">
                        {Object.entries(TAB_LABELS).map(([tab, label]) => (
                            <button
                                key={tab}
                                className={`plan-card__tab ${activeTab === tab ? 'plan-card__tab--active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* ── Pricing ── */}
                    {activeTab === 'pricing' && (
                        <div className="plan-card__section">
                            {Object.entries(DURATION_LABELS).map(([key, label]) => (
                                <PricingRow
                                    key={key}
                                    label={label}
                                    pricing={local.pricing[key]}
                                    onChange={patch => setPricing(key, patch)}
                                />
                            ))}
                        </div>
                    )}

                    {/* ── Names ── */}
                    {activeTab === 'names' && (
                        <div className="plan-card__section plan-card__section--grid">
                            {[
                                { label: 'اسم عربي',       field: 'name_ar',     dir: 'rtl' },
                                { label: 'اسم إنجليزي',    field: 'name_en',     dir: 'ltr' },
                                { label: 'وصف عربي',       field: 'subtitle_ar', dir: 'rtl' },
                                { label: 'وصف إنجليزي',    field: 'subtitle_en', dir: 'ltr' },
                            ].map(({ label, field, dir }) => (
                                <div key={field} className="plan-card__field-wrap plan-card__field-wrap--full">
                                    <label>{label}</label>
                                    <input
                                        type="text"
                                        value={local[field]}
                                        dir={dir}
                                        onChange={e => set({ [field]: e.target.value })}
                                        className="plan-card__input"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Features ── */}
                    {activeTab === 'features' && (
                        <div className="plan-card__section plan-card__features-wrap">
                            {[
                                { lang: 'ar', label: 'المميزات العربية', dir: 'rtl' },
                                { lang: 'en', label: 'English Features',  dir: 'ltr' },
                            ].map(({ lang, label, dir }) => (
                                <div key={lang} className="plan-card__features-col">
                                    <h4>{label}</h4>
                                    {local[`features_${lang}`].map((feat, idx) => (
                                        <div key={idx} className="plan-card__feature-row">
                                            <input
                                                type="text"
                                                value={feat}
                                                dir={dir}
                                                onChange={e => setFeature(lang, idx, e.target.value)}
                                                className="plan-card__input"
                                                placeholder={`ميزة ${idx + 1}`}
                                            />
                                            <button
                                                className="plan-card__icon-btn plan-card__icon-btn--danger"
                                                onClick={() => removeFeature(lang, idx)}
                                                title="حذف"
                                                type="button"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        className="plan-card__add-feature"
                                        onClick={() => addFeature(lang)}
                                        type="button"
                                    >
                                        <Plus size={14} /> إضافة ميزة
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Badge ── */}
                    {activeTab === 'badge' && (
                        <div className="plan-card__section plan-card__section--grid">
                            <div className="plan-card__field-wrap plan-card__field-wrap--full">
                                <label className="plan-card__toggle-label">
                                    <input
                                        type="checkbox"
                                        checked={local.is_popular}
                                        onChange={e => set({ is_popular: e.target.checked })}
                                    />
                                    <span>تمييز كـ "الأكثر شعبية"</span>
                                </label>
                            </div>
                            {[
                                { label: 'نص الشارة عربي', field: 'badge_ar', dir: 'rtl' },
                                { label: 'Badge text EN',   field: 'badge_en', dir: 'ltr' },
                            ].map(({ label, field, dir }) => (
                                <div key={field} className="plan-card__field-wrap plan-card__field-wrap--full">
                                    <label>{label}</label>
                                    <input
                                        type="text"
                                        value={local[field]}
                                        dir={dir}
                                        onChange={e => set({ [field]: e.target.value })}
                                        className="plan-card__input"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="plan-card__actions">
                        <button
                            type="button"
                            className="plan-card__btn plan-card__btn--ghost"
                            onClick={handleReset}
                            disabled={!isDirty || isSaving}
                        >
                            <RotateCcw size={15} /> تراجع
                        </button>
                        <button
                            type="button"
                            className="plan-card__btn plan-card__btn--primary"
                            onClick={handleSave}
                            disabled={!isDirty || isSaving}
                        >
                            {isSaving
                                ? <span className="plan-card__spinner" />
                                : <><Save size={15} /> حفظ التغييرات</>
                            }
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanCard;