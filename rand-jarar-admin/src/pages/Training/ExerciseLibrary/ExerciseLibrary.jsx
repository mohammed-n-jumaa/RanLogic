import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell, Search, SlidersHorizontal, Plus, X, Play, Copy,
  MoreVertical, Edit2, Trash2, Video, Loader,
  RotateCcw, BookOpen, TrendingUp, Film, CheckCircle, Calendar
} from 'lucide-react';
import Swal from 'sweetalert2';
import exerciseLibraryApi from '../../../api/exerciseLibraryApi';
import ExerciseDetailModal from './ExerciseDetailModal';
import ExerciseFormModal from './ExerciseFormModal';
import FilterSheet from './FilterSheet';
import './ExerciseLibrary.scss';

const API_STORAGE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getYoutubeId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : null;
};

const getYoutubeThumbnail = (url) => {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
};

// Strip time from ISO date strings: "2026-04-30T00:00:00Z" → "2026-04-30"
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return String(dateStr).split('T')[0];
};

const DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const getDayName = (dateStr) => {
  const d = formatDate(dateStr);
  if (!d) return '';
  const date = new Date(d + 'T12:00:00'); // noon avoids timezone day-shift
  return DAY_NAMES[date.getDay()];
};

// ─── Exercise Card ────────────────────────────────────────────────────────────
const ExerciseCard = ({ exercise, onView, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [thumbError, setThumbError] = useState(false);
  const menuRef = useRef(null);

  const ytId = getYoutubeId(exercise.youtube_url);
  const thumbnail = !thumbError && ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null;
  const hasVideo = exercise.youtube_url || exercise.video_file;
  const dateFormatted = formatDate(exercise.exercise_date);
  const dayName = getDayName(exercise.exercise_date);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCopy = async (e) => {
    e.stopPropagation();
    if (!exercise.youtube_url) return;
    await navigator.clipboard.writeText(exercise.youtube_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="exercise-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      layout
      onClick={() => onView(exercise)}
    >
      {/* Thumbnail */}
      <div className="exercise-card__thumb">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={exercise.name}
            loading="lazy"
            onError={() => setThumbError(true)}
          />
        ) : (
          <div className={`exercise-card__thumb-ph ${exercise.video_file ? 'exercise-card__thumb-ph--video' : ''}`}>
            {exercise.video_file ? <Video size={26} /> : <Dumbbell size={26} />}
          </div>
        )}
        {hasVideo && (
          <div className="exercise-card__play">
            <Play size={12} fill="white" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="exercise-card__body">
        <h3 className="exercise-card__name">{exercise.name}</h3>
        <div className="exercise-card__meta">
          <span className="exercise-card__date">
            <Calendar size={11} /> {dayName} {dateFormatted}
          </span>
          <span className="exercise-card__sets">{exercise.sets} × {exercise.reps}</span>
        </div>
        {exercise.notes && <p className="exercise-card__notes">{exercise.notes}</p>}
        {exercise.workout_plan?.user && (
          <p className="exercise-card__trainee">👤 {exercise.workout_plan.user.name}</p>
        )}
      </div>

      {/* Actions */}
      <div className="exercise-card__actions" onClick={(e) => e.stopPropagation()}>
        {exercise.youtube_url && (
          <button
            className="exercise-card__btn exercise-card__btn--watch"
            onClick={(e) => { e.stopPropagation(); onView(exercise); }}
            title="مشاهدة"
          >
            <Play size={12} />
          </button>
        )}
        {exercise.youtube_url && (
          <button
            className={`exercise-card__btn ${copied ? 'exercise-card__btn--copied' : ''}`}
            onClick={handleCopy}
            title="نسخ الرابط"
          >
            {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
          </button>
        )}

        {/* ⋮ Menu */}
        <div className="exercise-card__menu" ref={menuRef}>
          <button
            className="exercise-card__btn exercise-card__btn--more"
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
          >
            <MoreVertical size={13} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className="exercise-card__dropdown"
                initial={{ opacity: 0, scale: 0.88, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.88, y: -6 }}
                transition={{ duration: 0.13 }}
              >
                <button onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit(exercise); }}>
                  <Edit2 size={13} /> تعديل
                </button>
                <button
                  className="danger"
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(exercise); }}
                >
                  <Trash2 size={13} /> حذف
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Stats Bar ────────────────────────────────────────────────────────────────
const StatsBar = ({ stats }) => (
  <div className="ex-library__stats">
    <div className="ex-library__stat"><TrendingUp size={13} /><span>{stats?.total ?? '—'} تمرين</span></div>
    <div className="ex-library__stat"><BookOpen size={13} /><span>{stats?.unique_names ?? '—'} فريد</span></div>
    <div className="ex-library__stat"><Film size={13} /><span>{stats?.with_video ?? '—'} مع فيديو</span></div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const ExerciseLibrary = () => {
  const [exercises, setExercises] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ exercise_date: '', sets: '', reps: '', sort: 'newest' });
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [detailExercise, setDetailExercise] = useState(null);
  const [formExercise, setFormExercise] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const searchTimeout = useRef(null);
  const currentPageRef = useRef(1);
  const searchRef = useRef('');
  const filtersRef = useRef(filters);

  useEffect(() => { filtersRef.current = filters; }, [filters]);
  useEffect(() => {
    const count = Object.values(filters).filter((v) => v && v !== 'newest').length;
    setActiveFiltersCount(count);
  }, [filters]);

  const fetchExercises = useCallback(async (page = 1, append = false, overrideSearch, overrideFilters) => {
    if (page === 1 && !append) setIsLoading(true);
    else setIsLoadingMore(true);

    const s = overrideSearch !== undefined ? overrideSearch : searchRef.current;
    const f = overrideFilters !== undefined ? overrideFilters : filtersRef.current;

    try {
      const params = { page, per_page: 20, ...f };
      if (s) params.search = s;
      Object.keys(params).forEach(k => { if (params[k] === '') delete params[k]; });

      const res = await exerciseLibraryApi.getAll(params);
      if (res.data.success) {
        const { data, ...paginationMeta } = res.data.data;
        if (append) {
          setExercises((prev) => {
            const existingIds = new Set(prev.map(e => e.id));
            return [...prev, ...data.filter(e => !existingIds.has(e.id))];
          });
        } else {
          setExercises(data);
        }
        setPagination(paginationMeta);
        currentPageRef.current = page;
      }
    } catch (err) {
      console.error('Error fetching exercises:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await exerciseLibraryApi.getStats();
      if (res.data.success) setStats(res.data.data);
    } catch (_) {}
  }, []);

  useEffect(() => { fetchExercises(1); fetchStats(); }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    searchRef.current = val;
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => fetchExercises(1, false, val), 350);
  };

  const handleLoadMore = () => {
    if (pagination && currentPageRef.current < pagination.last_page)
      fetchExercises(currentPageRef.current + 1, true);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    filtersRef.current = newFilters;
    setFilterSheetOpen(false);
    fetchExercises(1, false, undefined, newFilters);
  };

  const handleResetFilters = () => {
    const reset = { exercise_date: '', sets: '', reps: '', sort: 'newest' };
    setFilters(reset); filtersRef.current = reset;
    setSearchTerm(''); searchRef.current = '';
    setFilterSheetOpen(false);
    fetchExercises(1, false, '', reset);
  };

  const handleDelete = async (exercise) => {
    const result = await Swal.fire({
      title: 'حذف التمرين؟',
      html: `سيتم حذف <strong>${exercise.name}</strong> نهائياً`,
      icon: 'warning', showCancelButton: true,
      confirmButtonText: 'نعم، احذف', cancelButtonText: 'إلغاء',
      confirmButtonColor: '#e91e63',
      background: 'var(--bg-card)', color: 'var(--text-primary)',
    });
    if (!result.isConfirmed) return;
    try {
      await exerciseLibraryApi.delete(exercise.id);
      setExercises((prev) => prev.filter((e) => e.id !== exercise.id));
      fetchStats();
      Swal.fire({ icon: 'success', title: 'تم الحذف', timer: 1500, showConfirmButton: false, background: 'var(--bg-card)', color: 'var(--text-primary)' });
    } catch {
      Swal.fire({ icon: 'error', title: 'خطأ', text: 'فشل الحذف', confirmButtonText: 'حسناً' });
    }
  };

  const handleFormSave = async (formData, editingId) => {
    try {
      const res = editingId
        ? await exerciseLibraryApi.update(editingId, formData)
        : await exerciseLibraryApi.create(formData);
      if (res.data.success) {
        setIsFormOpen(false); setFormExercise(null);
        fetchExercises(1); fetchStats();
        Swal.fire({ icon: 'success', title: editingId ? 'تم التحديث' : 'تمت الإضافة', timer: 1800, showConfirmButton: false, background: 'var(--bg-card)', color: 'var(--text-primary)' });
      }
    } catch (err) {
      const errData = err.response?.data;
      let msg = errData?.message || 'حدث خطأ';
      if (errData?.errors) {
        const first = Object.values(errData.errors)[0];
        if (Array.isArray(first)) msg = first[0];
      }
      Swal.fire({ icon: 'error', title: 'خطأ في الحفظ', text: msg, confirmButtonText: 'حسناً' });
    }
  };

  const openAdd = () => { setFormExercise({}); setIsFormOpen(true); };
  const openEdit = (ex) => { setFormExercise(ex); setIsFormOpen(true); };

  return (
    <div className="ex-library" dir="rtl">
      {/* Sticky Header */}
      <div className="ex-library__header">
        <div className="ex-library__header-top">
          <div className="ex-library__title-wrap">
            <Dumbbell size={20} className="ex-library__title-icon" />
            <h1 className="ex-library__title">مكتبة التمارين</h1>
          </div>
          <div className="ex-library__header-actions">
            <button
              className={`ex-library__icon-btn ${activeFiltersCount > 0 ? 'ex-library__icon-btn--active' : ''}`}
              onClick={() => setFilterSheetOpen(true)}
            >
              <SlidersHorizontal size={16} />
              {activeFiltersCount > 0 && <span className="ex-library__badge">{activeFiltersCount}</span>}
            </button>
            <button className="ex-library__icon-btn ex-library__icon-btn--primary" onClick={openAdd}>
              <Plus size={17} />
            </button>
          </div>
        </div>

        <div className="ex-library__search-wrap">
          <Search size={14} className="ex-library__search-icon" />
          <input
            className="ex-library__search"
            type="text"
            placeholder="ابحث عن تمرين..."
            value={searchTerm}
            onChange={handleSearchChange}
            autoComplete="off"
          />
          {searchTerm && (
            <button className="ex-library__search-clear"
              onClick={() => { setSearchTerm(''); searchRef.current = ''; fetchExercises(1, false, ''); }}>
              <X size={12} />
            </button>
          )}
        </div>

        <StatsBar stats={stats} />
      </div>

      {/* Content */}
      <div className="ex-library__content">
        {isLoading ? (
          <div className="ex-library__loading">
            <Loader size={28} className="spin" />
            <p>جاري تحميل التمارين...</p>
          </div>
        ) : exercises.length === 0 ? (
          <div className="ex-library__empty">
            <Dumbbell size={44} />
            <h3>لا توجد تمارين</h3>
            <p>{searchTerm || activeFiltersCount > 0 ? 'جرّب تغيير كلمة البحث أو الفلاتر' : 'ابدأ بإضافة تمارين جديدة'}</p>
            {(searchTerm || activeFiltersCount > 0) && (
              <button className="ex-library__btn-reset" onClick={handleResetFilters}>
                <RotateCcw size={12} /> إعادة تعيين
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="ex-library__result-count">
              {pagination?.total ?? exercises.length} نتيجة
              {searchTerm && <span> لـ «{searchTerm}»</span>}
            </p>
            <div className="ex-library__grid">
              <AnimatePresence mode="popLayout">
                {exercises.map((ex) => (
                  <ExerciseCard
                    key={`exercise-${ex.id}`}
                    exercise={ex}
                    onView={setDetailExercise}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
            {pagination && currentPageRef.current < pagination.last_page && (
              <div className="ex-library__load-more">
                <button className="ex-library__btn-load-more" onClick={handleLoadMore} disabled={isLoadingMore}>
                  {isLoadingMore
                    ? <><Loader size={12} className="spin" /> جاري التحميل...</>
                    : <>تحميل المزيد ({pagination.total - exercises.length} متبقي)</>}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <FilterSheet isOpen={filterSheetOpen} filters={filters}
        onClose={() => setFilterSheetOpen(false)} onApply={handleApplyFilters} onReset={handleResetFilters} />

      <ExerciseDetailModal
        exercise={detailExercise} isOpen={!!detailExercise}
        onClose={() => setDetailExercise(null)}
        onEdit={(ex) => { setDetailExercise(null); openEdit(ex); }}
        onDelete={(ex) => { setDetailExercise(null); handleDelete(ex); }}
        apiStorage={API_STORAGE}
      />

      <ExerciseFormModal
        isOpen={isFormOpen} exercise={formExercise}
        onClose={() => { setIsFormOpen(false); setFormExercise(null); }}
        onSave={handleFormSave}
      />
    </div>
  );
};

export default ExerciseLibrary;