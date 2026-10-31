import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell, Search, SlidersHorizontal, Plus, X, Play, Copy, Check, Pencil, Trash2, Video,
  RotateCcw, BookOpen, TrendingUp, Film, CalendarDays, LayoutGrid, List, Youtube, Loader2,
} from 'lucide-react';
import notify from '../../../lib/notify';
import exerciseLibraryApi from '../../../api/exerciseLibraryApi';
import ExerciseDetailModal from './ExerciseDetailModal';
import ExerciseFormModal from './ExerciseFormModal';
import FilterSheet from './FilterSheet';
import { youtubeThumb, dayName, shortDate, initials, artFor, DEFAULT_FILTERS } from './exerciseUtils';
import './ExerciseLibrary.scss';
import { t } from '../../../i18n';
import { BACKEND_URL } from '../../../config';

const PER_PAGE = 20;
const VIEW_KEY = 'exercise-library-view';
const SORT_LABELS = { date: () => t('حسب التاريخ'), order: () => t('حسب الترتيب') };

const readView = () => {
  try { return localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'grid'; } catch { return 'grid'; }
};

const countActive = (f) => ['exercise_date', 'sets', 'reps'].filter((k) => f[k]).length + (f.sort !== 'newest' ? 1 : 0);

// ─── Count-up number for the hero stats ──────────────────────────────────────
const CountUp = ({ value }) => {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (value === null || value === undefined) return undefined;
    const to = Number(value) || 0;
    let raf;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / 700, 1);
      setShown(Math.round(to * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{value === null || value === undefined ? '—' : shown}</>;
};

// ─── Exercise Card ────────────────────────────────────────────────────────────
const ExerciseCard = ({ exercise, index, onView, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [thumbError, setThumbError] = useState(false);

  const thumb = !thumbError ? youtubeThumb(exercise.youtube_url) : null;
  const hasVideo = !!(exercise.youtube_url || exercise.video_file);
  const trainee = exercise.workout_plan?.user?.name;

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(exercise.youtube_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard blocked: ignore */ }
  };

  return (
    <motion.article
      className="exl-card"
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0, transition: { delay: Math.min(index, 10) * 0.035 } }}
      exit={{ opacity: 0, scale: 0.92 }}
      onClick={() => onView(exercise)}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onView(exercise); }}
    >
      <div className="exl-card__thumb">
        {thumb ? (
          <img src={thumb} alt="" loading="lazy" onError={() => setThumbError(true)} />
        ) : (
          <div className="exl-card__art" style={{ background: artFor(exercise.id) }}>
            {exercise.video_file ? <Video size={44} /> : <Dumbbell size={44} />}
          </div>
        )}
        <span className={`exl-badge ${!hasVideo ? 'exl-badge--none' : ''}`}>
          {exercise.youtube_url
            ? <><Youtube size={13} className="exl-badge__yt" /> {t('يوتيوب')}</>
            : exercise.video_file
              ? <><Video size={13} /> {t('فيديو')}</>
              : t('بدون فيديو')}
        </span>
        {exercise.exercise_date && (
          <span className="exl-date">
            <CalendarDays size={12} /> {dayName(exercise.exercise_date)} {shortDate(exercise.exercise_date)}
          </span>
        )}
        {hasVideo && <span className="exl-play"><Play size={20} fill="currentColor" /></span>}
      </div>

      <div className="exl-card__body">
        <h3 className="exl-card__name">{exercise.name}</h3>
        <p className="exl-card__notes">{exercise.notes || t('بدون ملاحظات')}</p>

        <div className="exl-card__meta">
          <div className="exl-pill exl-pill--sets"><b>{exercise.sets}</b><small>{t('مجموعات')}</small></div>
          <div className="exl-pill exl-pill--reps"><b>{exercise.reps}</b><small>{t('تكرار')}</small></div>
        </div>

        <div className="exl-card__foot">
          {trainee ? (
            <div className="exl-trainee"><span className="exl-trainee__ava">{initials(trainee)}</span><span>{trainee}</span></div>
          ) : (
            <div className="exl-trainee exl-trainee--none">{t('غير مرتبط بمتدرب')}</div>
          )}
          <div className="exl-card__actions" onClick={(e) => e.stopPropagation()}>
            {exercise.youtube_url && (
              <button type="button" className={`exl-act ${copied ? 'is-copied' : ''}`} onClick={handleCopy} title={t('نسخ الرابط')} aria-label={t('نسخ الرابط')}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </button>
            )}
            <button type="button" className="exl-act" onClick={() => onEdit(exercise)} title={t('تعديل')} aria-label={t('تعديل')}>
              <Pencil size={15} />
            </button>
            <button type="button" className="exl-act exl-act--danger" onClick={() => onDelete(exercise)} title={t('حذف')} aria-label={t('حذف')}>
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const ExerciseLibrary = () => {
  const [exercises, setExercises] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [detailExercise, setDetailExercise] = useState(null);
  const [formExercise, setFormExercise] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [view, setView] = useState(readView);

  const searchTimeout = useRef(null);
  const currentPageRef = useRef(1);
  const searchRef = useRef('');
  const filtersRef = useRef(filters);
  const searchInputRef = useRef(null);

  const activeFiltersCount = countActive(filters);

  useEffect(() => { filtersRef.current = filters; }, [filters]);
  useEffect(() => {
    try { localStorage.setItem(VIEW_KEY, view); } catch { /* ignore */ }
  }, [view]);

  const fetchExercises = useCallback(async (page = 1, append = false, overrideSearch, overrideFilters) => {
    if (page === 1 && !append) setIsLoading(true);
    else setIsLoadingMore(true);

    const s = overrideSearch !== undefined ? overrideSearch : searchRef.current;
    const f = overrideFilters !== undefined ? overrideFilters : filtersRef.current;

    try {
      const params = { page, per_page: PER_PAGE, ...f };
      if (s) params.search = s;
      Object.keys(params).forEach((k) => { if (params[k] === '') delete params[k]; });

      const res = await exerciseLibraryApi.getAll(params);
      if (res.data.success) {
        const { data, ...paginationMeta } = res.data.data;
        if (append) {
          setExercises((prev) => {
            const existingIds = new Set(prev.map((e) => e.id));
            return [...prev, ...data.filter((e) => !existingIds.has(e.id))];
          });
        } else {
          setExercises(data);
        }
        setPagination(paginationMeta);
        currentPageRef.current = page;
      }
    } catch {
      /* the API client already shows the error */
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await exerciseLibraryApi.getStats();
      if (res.data.success) setStats(res.data.data);
    } catch { /* stats are optional */ }
  }, []);

  useEffect(() => { fetchExercises(1); fetchStats(); }, [fetchExercises, fetchStats]);

  // "/" focuses the search box
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && !document.querySelector('.exs-overlay')) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const runSearch = (val) => {
    setSearchTerm(val);
    searchRef.current = val;
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => fetchExercises(1, false, val), 350);
  };

  const clearSearch = () => {
    clearTimeout(searchTimeout.current);
    setSearchTerm('');
    searchRef.current = '';
    fetchExercises(1, false, '');
  };

  const handleLoadMore = () => {
    if (pagination && currentPageRef.current < pagination.last_page) fetchExercises(currentPageRef.current + 1, true);
  };

  const applyFilters = (next) => {
    setFilters(next);
    filtersRef.current = next;
    setFilterSheetOpen(false);
    fetchExercises(1, false, undefined, next);
  };

  const removeFilter = (key) => applyFilters({ ...filtersRef.current, [key]: DEFAULT_FILTERS[key] });

  const resetAll = () => {
    clearTimeout(searchTimeout.current);
    setFilters(DEFAULT_FILTERS);
    filtersRef.current = DEFAULT_FILTERS;
    setSearchTerm('');
    searchRef.current = '';
    setFilterSheetOpen(false);
    fetchExercises(1, false, '', DEFAULT_FILTERS);
  };

  const handleDelete = async (exercise) => {
    const deleted = await notify.confirmDelete({
      title: t('حذف التمرين؟'),
      text: t('رح ينحذف التمرين من المكتبة ومن خطة المتدرب. ما في رجوع.'),
      item: exercise.name,
      onConfirm: () => exerciseLibraryApi.delete(exercise.id),
    });
    if (!deleted) return;
    setDetailExercise(null);
    setExercises((prev) => prev.filter((e) => e.id !== exercise.id));
    setPagination((p) => (p ? { ...p, total: Math.max((p.total || 1) - 1, 0) } : p));
    fetchStats();
    notify.success(t('تم حذف التمرين'), exercise.name);
  };

  const handleFormSave = async (formData, editingId) => {
    try {
      const res = editingId
        ? await exerciseLibraryApi.update(editingId, formData)
        : await exerciseLibraryApi.create(formData);
      if (res.data.success) {
        setIsFormOpen(false);
        setFormExercise(null);
        fetchExercises(1);
        fetchStats();
        notify.success(editingId ? t('تم حفظ التعديلات 💪') : t('تمت إضافة التمرين 💪'), formData.get('name'));
      }
    } catch (err) {
      const errData = err.response?.data;
      let msg = errData?.message || t('حدث خطأ');
      if (errData?.errors) {
        const first = Object.values(errData.errors)[0];
        if (Array.isArray(first)) msg = first[0];
      }
      notify.error(t('خطأ في الحفظ'), msg);
    }
  };

  const openAdd = () => { setFormExercise({}); setIsFormOpen(true); };
  const openEdit = (ex) => { setDetailExercise(null); setFormExercise(ex); setIsFormOpen(true); };

  const total = pagination?.total ?? exercises.length;
  const hasMore = pagination && currentPageRef.current < pagination.last_page;

  const chips = [];
  if (filters.exercise_date) chips.push({ key: 'exercise_date', label: `📅 ${dayName(filters.exercise_date)} ${shortDate(filters.exercise_date)}` });
  if (filters.sets) chips.push({ key: 'sets', label: `🧱 ${t('{0} مجموعات', filters.sets)}` });
  if (filters.reps) chips.push({ key: 'reps', label: `🔁 ${t('{0} تكرار', filters.reps)}` });
  if (filters.sort !== 'newest') chips.push({ key: 'sort', label: `🔃 ${SORT_LABELS[filters.sort]?.() || filters.sort}` });

  return (
    <div className="exl">
      {/* Hero */}
      <section className="exl-hero">
        <Dumbbell className="exl-hero__mark" aria-hidden="true" />
        <div className="exl-hero__top">
          <div>
            <div className="exl-hero__kicker">{t('كل التمارين اللي بتعطيها لمتدربينك بمكان واحد')}</div>
            <h1><span className="exl-hero__icon"><Dumbbell size={20} /></span> {t('مكتبة التمارين')}</h1>
          </div>
          <button type="button" className="exl-add" onClick={openAdd} aria-label={t('إضافة تمرين')}>
            <Plus size={18} /><span>{t('إضافة تمرين')}</span>
          </button>
        </div>
        <div className="exl-stats">
          <div className="exl-stat">
            <span className="exl-stat__icon exl-stat__icon--pink"><TrendingUp size={18} /></span>
            <div><b><CountUp value={stats?.total} /></b><small>{t('تمرين')}</small></div>
          </div>
          <div className="exl-stat">
            <span className="exl-stat__icon exl-stat__icon--purple"><BookOpen size={18} /></span>
            <div><b><CountUp value={stats?.unique_names} /></b><small>{t('تمرين فريد')}</small></div>
          </div>
          <div className="exl-stat">
            <span className="exl-stat__icon exl-stat__icon--indigo"><Film size={18} /></span>
            <div><b><CountUp value={stats?.with_video} /></b><small>{t('مع فيديو')}</small></div>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="exl-toolbar">
        <label className={`exl-search ${searchTerm ? 'has-value' : ''}`}>
          <Search size={18} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={t('ابحث باسم التمرين أو المتدرب...')}
            value={searchTerm}
            onChange={(e) => runSearch(e.target.value)}
            autoComplete="off"
          />
          <kbd>/</kbd>
          <button type="button" className="exl-search__clear" onClick={(e) => { e.preventDefault(); clearSearch(); }} aria-label={t('مسح')}>
            <X size={14} />
          </button>
        </label>
        <button
          type="button"
          className={`exl-tool ${activeFiltersCount > 0 ? 'is-active' : ''}`}
          onClick={() => setFilterSheetOpen(true)}
        >
          <SlidersHorizontal size={18} />
          <span className="exl-tool__label">{t('الفلاتر')}</span>
          {activeFiltersCount > 0 && <span className="exl-tool__count">{activeFiltersCount}</span>}
        </button>
        <div className="exl-view" role="tablist" aria-label={t('طريقة العرض')}>
          <button type="button" role="tab" aria-selected={view === 'grid'} className={view === 'grid' ? 'is-active' : ''} onClick={() => setView('grid')} aria-label={t('شبكة')}>
            <LayoutGrid size={17} />
          </button>
          <button type="button" role="tab" aria-selected={view === 'list'} className={view === 'list' ? 'is-active' : ''} onClick={() => setView('list')} aria-label={t('قائمة')}>
            <List size={17} />
          </button>
        </div>
      </div>

      {/* Results + active filters */}
      {!isLoading && (
        <div className="exl-subbar">
          <div className="exl-results">
            <b>{total}</b> {t('تمرين')}
            {searchTerm && <span> {t('لـ «{0}»', searchTerm)}</span>}
          </div>
          {chips.length > 0 && (
            <div className="exl-chips">
              {chips.map((c) => (
                <button key={c.key} type="button" className="exl-chip" onClick={() => removeFilter(c.key)}>
                  {c.label}<span><X size={11} /></span>
                </button>
              ))}
              {chips.length > 1 && (
                <button type="button" className="exl-chip exl-chip--clear" onClick={resetAll}>{t('مسح الكل')}</button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className={`exl-grid ${view === 'list' ? 'is-list' : ''}`}>
          {Array.from({ length: 8 }, (_, i) => <div key={i} className="exl-skeleton" />)}
        </div>
      ) : exercises.length === 0 ? (
        <div className="exl-empty">
          <div className="exl-empty__icon"><Dumbbell size={34} /></div>
          <h3>{searchTerm || activeFiltersCount > 0 ? t('ما في تمارين بهالمواصفات') : t('لا توجد تمارين')}</h3>
          <p>{searchTerm || activeFiltersCount > 0 ? t('جرّبي تغيّري كلمة البحث أو الفلاتر') : t('ابدأ بإضافة تمارين جديدة')}</p>
          {searchTerm || activeFiltersCount > 0 ? (
            <button type="button" className="exs-btn" onClick={resetAll}><RotateCcw size={15} /> {t('إعادة تعيين')}</button>
          ) : (
            <button type="button" className="exs-btn exs-btn--brand" onClick={openAdd}><Plus size={16} /> {t('إضافة تمرين')}</button>
          )}
        </div>
      ) : (
        <>
          <div className={`exl-grid ${view === 'list' ? 'is-list' : ''}`}>
            <AnimatePresence mode="popLayout">
              {exercises.map((ex, i) => (
                <ExerciseCard
                  key={`exercise-${ex.id}`}
                  exercise={ex}
                  index={i}
                  onView={setDetailExercise}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>

          {hasMore && (
            <div className="exl-more">
              <div className="exl-more__bar"><span style={{ width: `${Math.min((exercises.length / Math.max(total, 1)) * 100, 100)}%` }} /></div>
              <small>{t('عرض {0} من {1}', exercises.length, total)}</small>
              <button type="button" className="exs-btn" onClick={handleLoadMore} disabled={isLoadingMore}>
                {isLoadingMore ? <><Loader2 size={15} className="spin" /> {t('جاري التحميل...')}</> : t('تحميل المزيد')}
              </button>
            </div>
          )}
        </>
      )}

      <FilterSheet
        isOpen={filterSheetOpen}
        filters={filters}
        search={searchTerm}
        onClose={() => setFilterSheetOpen(false)}
        onApply={applyFilters}
      />

      <ExerciseDetailModal
        exercise={detailExercise}
        isOpen={!!detailExercise}
        onClose={() => setDetailExercise(null)}
        onEdit={openEdit}
        onDelete={handleDelete}
        apiStorage={BACKEND_URL}
      />

      <ExerciseFormModal
        isOpen={isFormOpen}
        exercise={formExercise}
        onClose={() => { setIsFormOpen(false); setFormExercise(null); }}
        onSave={handleFormSave}
      />
    </div>
  );
};

export default ExerciseLibrary;
