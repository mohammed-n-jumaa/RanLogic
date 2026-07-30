import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  ChevronDown,
  Dumbbell,
  Upload,
  X,
  Youtube,
  Save,
  Loader,
  ChevronRight,
  ChevronLeft,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import trainingApi from '../../../api/trainingApi';
import Swal from 'sweetalert2';
import './WorkoutPlan.scss';

const WorkoutPlan = ({ clientId, workoutPlan, onRefresh }) => {
  const [expandedDays, setExpandedDays] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRefs = useRef({});
  const autoSaveTimeout = useRef(null);
  const lastSavedData = useRef(null);
  const isInitialMount = useRef(true);
  const [pdfFile, setPdfFile] = useState(null);
  const [existingPdf, setExistingPdf] = useState(workoutPlan?.pdf_file || null);
  const pdfInputRef = useRef(null);
  const [excelFile, setExcelFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const excelInputRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const currentDate = new Date();
  let displayYear = currentDate.getFullYear();
  let displayMonth = currentDate.getMonth() + 1;

  if (workoutPlan && workoutPlan.month_start_date) {
    const planDate = new Date(workoutPlan.month_start_date);
    displayYear = planDate.getFullYear();
    displayMonth = planDate.getMonth() + 1;
  }

  const daysInMonth = new Date(displayYear, displayMonth, 0).getDate();

  const daysOfMonth = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(displayYear, displayMonth - 1, day);
    const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    return {
      id: day,
      name: dayNames[date.getDay()],
      date: `${displayYear}-${String(displayMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      fullDate: date
    };
  });

  const DAYS_PER_PAGE = 10;
  const totalPages = Math.ceil(daysInMonth / DAYS_PER_PAGE);
  const currentDays = daysOfMonth.slice(
    (currentPage - 1) * DAYS_PER_PAGE,
    currentPage * DAYS_PER_PAGE
  );

  const pageLabels = Array.from({ length: totalPages }, (_, i) => {
    const start = i * DAYS_PER_PAGE + 1;
    const end = Math.min((i + 1) * DAYS_PER_PAGE, daysInMonth);
    return `${start} - ${end}`;
  });

  const normalizeDate = (dateString) => {
    if (!dateString) return null;
    return dateString.split('T')[0];
  };

  const sanitizeYoutubeInput = (raw = '') => {
    let s = String(raw || '').trim();

    const urlMatch = s.match(
      /(https?:\/\/[^\s]+|youtu\.be\/[^\s]+|www\.youtube\.com\/[^\s]+|youtube\.com\/[^\s]+)/i
    );
    if (urlMatch) s = urlMatch[1];

    if (/^(youtu\.be\/|www\.youtube\.com\/|youtube\.com\/)/i.test(s)) {
      s = `https://${s}`;
    }

    s = s.replace(/[)\]}>,.،;!؟]+$/g, '');

    return s;
  };

  const extractYoutubeId = (url = '') => {
    const u = sanitizeYoutubeInput(url);
    if (!u) return null;

    const v = u.match(/[?&]v=([^&]+)/);
    if (v?.[1]) return v[1];

    const s = u.match(/youtu\.be\/([^?&]+)/);
    if (s?.[1]) return s[1];

    const e = u.match(/\/(embed|shorts)\/([^?&/]+)/);
    if (e?.[2]) return e[2];

    return null;
  };

  const saveToSessionStorage = useCallback(() => {
    if (exercises.length > 0) {
      const dataToSave = {
        exercises: exercises,
        currentPage: currentPage,
        expandedDays: expandedDays,
        timestamp: Date.now(),
        year: displayYear,
        month: displayMonth
      };
      sessionStorage.setItem(`workoutPlan_session_${clientId}`, JSON.stringify(dataToSave));
      console.log('✅ تم حفظ الجلسة في sessionStorage');
    }
  }, [exercises, currentPage, expandedDays, clientId, displayYear, displayMonth]);

  const restoreFromSessionStorage = useCallback(() => {
    const saved = sessionStorage.getItem(`workoutPlan_session_${clientId}`);
    if (saved) {
      try {
        const { exercises: savedExercises, currentPage: savedPage, expandedDays: savedExpandedDays, timestamp, year, month } = JSON.parse(saved);

        if (year === displayYear && month === displayMonth && Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          console.log('🔄 استعادة البيانات من sessionStorage');
          if (savedExercises && savedExercises.length > 0) {
            setExercises(savedExercises);
          }
          if (savedPage) {
            setCurrentPage(savedPage);
          }
          if (savedExpandedDays) {
            setExpandedDays(savedExpandedDays);
          }
          return true;
        } else {
          sessionStorage.removeItem(`workoutPlan_session_${clientId}`);
        }
      } catch (error) {
        console.error('خطأ في استعادة البيانات:', error);
      }
    }
    return false;
  }, [clientId, displayYear, displayMonth]);

  const refreshWorkoutData = useCallback(async () => {
    try {
      console.log('Refreshing workout data...');
      const response = await trainingApi.getTraineeDetails(clientId, displayYear, displayMonth);
      console.log('Refresh response:', response.data);

      if (response.data.success && response.data.data.workout_plan) {
        const planData = response.data.data.workout_plan;
        if (planData.exercises) {
          const loadedExercises = planData.exercises.map(ex => ({
            id: ex.id,
            exercise_date: normalizeDate(ex.exercise_date),
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            notes: ex.notes || '',
            youtube_url: ex.youtube_url || '',
            video_file: ex.video_file || null,
            completed: ex.completed || false,
            order: ex.order || 0
          }));
          setExercises(loadedExercises);
          lastSavedData.current = JSON.stringify(loadedExercises);
          saveToSessionStorage();
          console.log('Refreshed exercises count:', loadedExercises.length);
        }
        if (planData.pdf_file) {
          setExistingPdf(planData.pdf_file);
        }
      }
    } catch (error) {
      console.error('Error refreshing workout data:', error);
    }
  }, [clientId, displayYear, displayMonth, saveToSessionStorage]);

  const performAutoSave = useCallback(async () => {
    if (isSaving) return;

    const currentData = JSON.stringify(exercises);
    if (lastSavedData.current === currentData && !pdfFile) return;

    setIsAutoSaving(true);
    try {
      const formData = new FormData();
      formData.append('year', displayYear);
      formData.append('month', displayMonth);

      console.log('📄 PDF File State in save:', {
        pdfFile: pdfFile,
        isFile: pdfFile instanceof File,
        fileName: pdfFile?.name,
        fileSize: pdfFile?.size,
        fileType: pdfFile?.type
      });

      if (pdfFile instanceof File) {
        console.log('✅ Adding PDF file to FormData:', pdfFile.name, pdfFile.size);
        formData.append('pdf_file', pdfFile, pdfFile.name);
      } else {
        console.log('⚠️ No PDF file to upload');
      }

      const exercisesData = [];
      let videoIndex = 0;

      exercises.forEach((exercise, index) => {
        const exerciseData = {
          exercise_date: exercise.exercise_date,
          name: exercise.name,
          sets: parseInt(exercise.sets) || 3,
          reps: parseInt(exercise.reps) || 12,
          notes: exercise.notes || '',
          youtube_url: sanitizeYoutubeInput(exercise.youtube_url) || '',
          order: index,
          completed: exercise.completed || false
        };

        if (!String(exercise.id).startsWith('temp-')) {
          exerciseData.id = exercise.id;
        }

        if (exercise.video_file instanceof File) {
          const videoKey = `video_${videoIndex}`;
          formData.append(videoKey, exercise.video_file);
          exerciseData.video_file_key = videoKey;
          videoIndex++;
        }

        exercisesData.push(exerciseData);
      });

      formData.append('exercises', JSON.stringify(exercisesData));

      console.log('📦 FormData contents:');
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`  ${pair[0]}: File(${pair[1].name}, ${pair[1].size} bytes, ${pair[1].type})`);
        } else {
          console.log(`  ${pair[0]}: ${pair[1]}`);
        }
      }

      const response = await trainingApi.saveWorkoutPlan(clientId, formData);

      if (response.data.success) {
        if (response.data.data && response.data.data.exercises) {
          const savedExercises = response.data.data.exercises.map(ex => ({
            id: ex.id,
            exercise_date: normalizeDate(ex.exercise_date),
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            notes: ex.notes || '',
            youtube_url: ex.youtube_url || '',
            video_file: ex.video_file || null,
            completed: ex.completed || false,
            order: ex.order || 0
          }));
          setExercises(savedExercises);

          if (response.data.data.pdf_file) {
            console.log('✅ PDF saved successfully:', response.data.data.pdf_file);
            setExistingPdf(response.data.data.pdf_file);
            setPdfFile(null);
          }
          lastSavedData.current = JSON.stringify(savedExercises);
        }
        console.log('💾 حفظ تلقائي ناجح');
      }
    } catch (error) {
      console.error('❌ خطأ في الحفظ التلقائي:', error);
    } finally {
      setIsAutoSaving(false);
    }
  }, [exercises, clientId, displayYear, displayMonth, isSaving, pdfFile]);

  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimeout.current) {
      clearTimeout(autoSaveTimeout.current);
    }

    autoSaveTimeout.current = setTimeout(() => {
      performAutoSave();
    }, 5000);
  }, [performAutoSave]);

  useEffect(() => {
    if (pdfFile instanceof File) {
      console.log('📄 pdfFile changed, triggering auto-save:', pdfFile.name);
      const timer = setTimeout(() => {
        performAutoSave();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [pdfFile, performAutoSave]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('📱 المستخدم غادر التطبيق، حفظ فوري...');
        saveToSessionStorage();
        performAutoSave();
      } else {
        console.log('📱 المستخدم عاد للتطبيق، محاولة استعادة البيانات...');
        const restored = restoreFromSessionStorage();
        if (!restored && exercises.length === 0) {
          if (workoutPlan && workoutPlan.exercises) {
            const loadedExercises = workoutPlan.exercises.map(ex => ({
              id: ex.id,
              exercise_date: normalizeDate(ex.exercise_date),
              name: ex.name,
              sets: ex.sets,
              reps: ex.reps,
              notes: ex.notes || '',
              youtube_url: ex.youtube_url || '',
              video_file: ex.video_file || null,
              completed: ex.completed || false,
              order: ex.order || 0
            }));
            setExercises(loadedExercises);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [saveToSessionStorage, restoreFromSessionStorage, workoutPlan, exercises.length, performAutoSave]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (exercises.length > 0) {
        console.log('⏰ حفظ دوري كل 30 ثانية');
        saveToSessionStorage();
        performAutoSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [exercises, saveToSessionStorage, performAutoSave]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (exercises.length > 0) {
        saveToSessionStorage();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [exercises, saveToSessionStorage]);

  useEffect(() => {
    console.log('=== WorkoutPlan useEffect ===');

    const restored = restoreFromSessionStorage();

    if (!restored && workoutPlan && workoutPlan.exercises && workoutPlan.exercises.length > 0) {
      console.log(`Found ${workoutPlan.exercises.length} exercises`);
      const loadedExercises = workoutPlan.exercises.map(ex => {
        const normalizedDate = normalizeDate(ex.exercise_date);
        return {
          id: ex.id,
          exercise_date: normalizedDate,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          notes: ex.notes || '',
          youtube_url: ex.youtube_url || '',
          video_file: ex.video_file || null,
          completed: ex.completed || false,
          order: ex.order || 0
        };
      });
      setExercises(loadedExercises);
      lastSavedData.current = JSON.stringify(loadedExercises);
    }

    isInitialMount.current = false;
  }, [workoutPlan, restoreFromSessionStorage]);

  const getExercisesForDate = (date) => {
    const filtered = exercises.filter(ex => ex.exercise_date === date);
    return filtered;
  };

  const handleAddExercise = (date) => {
    const newExercise = {
      id: `temp-${Date.now()}`,
      exercise_date: date,
      name: '',
      sets: 3,
      reps: 12,
      notes: '',
      youtube_url: '',
      video_file: null,
      completed: false,
      order: exercises.filter(ex => ex.exercise_date === date).length
    };

    setExercises(prev => [...prev, newExercise]);
    triggerAutoSave();
    saveToSessionStorage();
  };

  const handleUpdateExercise = (exerciseId, field, value) => {
    let cleanedValue = value;

    if (field === 'youtube_url') {
      const str = String(value || '');
      if (str.includes('youtu') || str.includes('http') || str.includes('www') || str.includes('.com')) {
        cleanedValue = sanitizeYoutubeInput(str);
      } else {
        cleanedValue = '';
      }
    }

    setExercises(prev => prev.map(ex =>
      ex.id === exerciseId ? { ...ex, [field]: cleanedValue } : ex
    ));
    triggerAutoSave();
    saveToSessionStorage();
  };

  const handleVideoUpload = (exerciseId, file) => {
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      Swal.fire({
        icon: 'warning',
        title: 'ملف كبير',
        html: '<p>حجم الفيديو يجب ألا يتجاوز 20MB</p>',
        confirmButtonText: 'حسناً',
      });
      return;
    }

    if (!file.type.startsWith('video/')) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يجب اختيار ملف فيديو',
      });
      return;
    }

    handleUpdateExercise(exerciseId, 'video_file', file);
  };

  const handleDeleteExercise = async (exerciseId) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'سيتم حذف هذا التمرين',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
    });

    if (!result.isConfirmed) return;

    if (!String(exerciseId).startsWith('temp-')) {
      try {
        await trainingApi.deleteExercise(exerciseId);
        Swal.fire({
          icon: 'success',
          title: 'تم الحذف',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Error deleting:', error);
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'حدث خطأ أثناء الحذف',
        });
        return;
      }
    }

    setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
    triggerAutoSave();
    saveToSessionStorage();
  };

  const handleToggleCompletion = async (exerciseId) => {
    if (String(exerciseId).startsWith('temp-')) {
      Swal.fire({
        icon: 'info',
        title: 'تنبيه',
        text: 'يجب حفظ التمرين أولاً',
      });
      return;
    }

    try {
      const response = await trainingApi.toggleExercise(exerciseId);
      if (response.data.success) {
        setExercises(prev => prev.map(ex =>
          ex.id === exerciseId ? { ...ex, completed: response.data.data.completed } : ex
        ));
        triggerAutoSave();
        saveToSessionStorage();
      }
    } catch (error) {
      console.error('Error toggling:', error);
    }
  };

  const handleSaveWorkoutPlan = async () => {
    setIsSaving(true);
    await performAutoSave();
    setIsSaving(false);

    Swal.fire({
      icon: 'success',
      title: 'تم الحفظ',
      text: 'تم حفظ البرنامج التدريبي بنجاح',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const toggleDay = (dayId) => {
    setExpandedDays(prev =>
      prev.includes(dayId) ? prev.filter(id => id !== dayId) : [...prev, dayId]
    );
    saveToSessionStorage();
  };

  const getDayProgress = (date) => {
    const dayExercises = getExercisesForDate(date);
    if (dayExercises.length === 0) return 0;
    const completed = dayExercises.filter(ex => ex.completed).length;
    return Math.round((completed / dayExercises.length) * 100);
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_URL}/storage/${path}`;
  };

  const getYoutubeEmbedUrl = (url) => {
    const id = extractYoutubeId(url);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setExpandedDays([]);
    saveToSessionStorage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePdfUpload = (file) => {
    console.log('📄 handlePdfUpload called with:', file);

    if (!file) {
      console.log('No file provided');
      return;
    }

    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    if (file.type !== 'application/pdf') {
      console.log('Invalid file type:', file.type);
      Swal.fire({ icon: 'error', title: 'خطأ', text: 'يجب اختيار ملف PDF فقط' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      console.log('File too large:', file.size);
      Swal.fire({ icon: 'warning', title: 'ملف كبير', text: 'حجم PDF يجب ألا يتجاوز 10MB' });
      return;
    }

    console.log('✅ Setting pdfFile state:', file.name);
    setPdfFile(file);

    Swal.fire({
      icon: 'info',
      title: 'تم اختيار الملف',
      text: `تم اختيار ملف ${file.name}، سيتم حفظه تلقائياً`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
    if (pdfInputRef.current) {
      pdfInputRef.current.value = '';
    }
    console.log('📄 PDF file removed');
  };

  const handleExcelUpload = async () => {
  if (!excelFile) {
    Swal.fire({ icon: 'warning', title: 'تنبيه', text: 'الرجاء اختيار ملف Excel أولاً' });
    return;
  }

  setIsImporting(true);
  
  const formData = new FormData();
  formData.append('excel_file', excelFile);
  formData.append('year', displayYear);
  formData.append('month', displayMonth);
  formData.append('replace_existing', replaceExisting ? '1' : '0');

  try {
    const response = await trainingApi.importWorkoutExcel(clientId, formData);
    
    if (response.data.success) {
      // امسح session storage أولاً
      sessionStorage.removeItem(`workoutPlan_session_${clientId}`);
      
      await refreshWorkoutData();
      
      let message = `تم استيراد ${response.data.data?.imported || 0} تمرين بنجاح`;
      if (response.data.data?.errors && response.data.data.errors.length > 0) {
        message += `\n\n⚠️ الأخطاء:\n${response.data.data.errors.slice(0, 5).join('\n')}`;
        if (response.data.data.errors.length > 5) {
          message += `\n... و${response.data.data.errors.length - 5} خطأ آخر`;
        }
      }
      
      Swal.fire({
        icon: 'success',
        title: 'تم الاستيراد',
        html: message.replace(/\n/g, '<br>'),
        confirmButtonText: 'حسناً',
      });
      
      setShowImportModal(false);
      setExcelFile(null);
      if (excelInputRef.current) excelInputRef.current.value = '';
      setExpandedDays([]);
      
      
    } else {
      Swal.fire({
        icon: 'error',
        title: 'خطأ في الاستيراد',
        text: response.data?.message || 'حدث خطأ أثناء استيراد الملف',
      });
    }
  } catch (error) {
    console.error('Error importing Excel:', error);
    Swal.fire({
      icon: 'error',
      title: 'خطأ في الاستيراد',
      text: error.response?.data?.message || error.message || 'حدث خطأ أثناء استيراد الملف',
    });
  } finally {
    setIsImporting(false);
  }
};

   

const handleExcelFileSelect = (file) => {
  if (!file) return;
  
  const validExtensions = ['.xlsx', '.xls', '.csv'];
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  
  if (!validExtensions.includes(fileExtension)) {
    Swal.fire({
      icon: 'error',
      title: 'خطأ',
      text: 'الرجاء اختيار ملف Excel بصيغة xlsx, xls, أو csv',
    });
    if (excelInputRef.current) {
      excelInputRef.current.value = '';
    }
    return;
  }
  
  if (file.size > 10 * 1024 * 1024) {
    Swal.fire({
      icon: 'warning',
      title: 'ملف كبير',
      text: 'حجم الملف يجب ألا يتجاوز 10MB',
    });
    if (excelInputRef.current) {
      excelInputRef.current.value = '';
    }
    return;
  }
  
  setExcelFile(file);
};

const downloadExcelTemplate = () => {
  const templateData = [
    ['exercise_date', 'name', 'sets', 'reps', 'notes', 'youtube_url'],

    // اليوم 1
    ['2026-04-01', 'تمرين الضغط', '4', '12', 'تمارين الصباح', 'https://youtu.be/example1'],
    ['2026-04-01', 'سكوات', '4', '15', '', ''],
    ['2026-04-01', 'بلانك', '3', '30 ثانية', 'ثانية', ''],
    ['2026-04-01', 'انحناء روماني', '3', '12', 'بدمبل', ''],
    ['2026-04-01', 'رفع جانبي للكتف', '3', '15', 'أوزان خفيفة', ''],
    ['2026-04-01', 'تمرين البايسبس بالدمبل', '3', '12', '', 'https://youtu.com/example_bicep'],

    // اليوم 2
    ['2026-04-02', 'تمرين الضغط', '4', '12', '', ''],
    ['2026-04-02', 'سكوات', '4', '15', '', ''],
    ['2026-04-02', 'تمرين الترايسبس', '3', '12', 'خلف الرأس', ''],
    ['2026-04-02', 'رفع الساق', '3', '20', 'استشفاء', ''],
    ['2026-04-02', 'بلانك جانبي', '3', '25 ثانية', 'كل جانب', ''],
    ['2026-04-02', 'اندفاع أمامي', '3', '12', 'لكل رجل', ''],

    // اليوم 3
    ['2026-04-03', 'سكوات', '4', '12', 'وزن الجسم', ''],
    ['2026-04-03', 'تمرين الضغط', '4', '10', '', 'https://youtu.be/pushup_guide'],
    ['2026-04-03', 'رفع أثقال الظهر', '3', '12', 'انحناء', ''],
    ['2026-04-03', 'رفع كتف أمامي', '3', '12', '', ''],
    ['2026-04-03', 'تمرين البطن (كرunches)', '3', '20', '', ''],
    ['2026-04-03', 'جسر الألوية', '3', '15', '', ''],

    // اليوم 4
    ['2026-04-04', 'تمرين الضغط', '4', '12', '', ''],
    ['2026-04-04', 'اندفاع خلفي', '3', '12', 'لكل رجل', ''],
    ['2026-04-04', 'بلانك', '3', '35 ثانية', '', ''],
    ['2026-04-04', 'تمرين البايسبس', '3', '12', '', ''],
    ['2026-04-04', 'رفع جانبي', '3', '15', '', ''],
    ['2026-04-04', 'سكوات بقفز', '3', '10', 'بليومترية', ''],

    // اليوم 5
    ['2026-04-05', 'سكوات', '4', '15', '', ''],
    ['2026-04-05', 'تمرين الضغط', '4', '10', 'توقف 1 ثانية بالأسفل', ''],
    ['2026-04-05', 'تمرين الترايسبس', '3', '12', '', ''],
    ['2026-04-05', 'رفع ساق', '3', '20', '', ''],
    ['2026-04-05', 'بلانك جانبي', '3', '25 ثانية', '', ''],
    ['2026-04-05', 'انحناء روماني', '3', '12', '', ''],

    // اليوم 6
    ['2026-04-06', 'تمرين الضغط', '4', '12', '', 'https://youtu.be/pushup_variation'],
    ['2026-04-06', 'اندفاع أمامي', '3', '12', '', ''],
    ['2026-04-06', 'تمرين البطن V-ups', '3', '15', '', ''],
    ['2026-04-06', 'رفع جانبي', '3', '12', '', ''],
    ['2026-04-06', 'سكوات', '3', '15', '', ''],
    ['2026-04-06', 'تمرين البايسبس', '3', '12', '', ''],

    // اليوم 7 — راحة خفيفة
    ['2026-04-07', 'مشي سريع', '1', '30 دقيقة', 'راحة نشطة', ''],
    ['2026-04-07', 'تمدد', '1', '15 دقيقة', '', ''],
    ['2026-04-07', 'بلانك', '2', '20 ثانية', '', ''],
    ['2026-04-07', 'يوغا خفيفة', '1', '20 دقيقة', '', ''],
    ['2026-04-07', 'تنفس عميق', '1', '5 دقائق', '', ''],
    ['2026-04-07', 'تمارين رقبة', '1', '5 دقائق', '', ''],

    // اليوم 8
    ['2026-04-08', 'سكوات', '4', '15', '', ''],
    ['2026-04-08', 'تمرين الضغط', '4', '12', '', ''],
    ['2026-04-08', 'بلانك', '3', '40 ثانية', '', ''],
    ['2026-04-08', 'انحناء روماني', '3', '12', '', ''],
    ['2026-04-08', 'رفع كتف خلفي', '3', '12', '', ''],
    ['2026-04-08', 'اندفاع جانبي', '3', '10', '', ''],

    // اليوم 9
    ['2026-04-09', 'تمرين الضغط', '4', '12', '', ''],
    ['2026-04-09', 'سكوات بقفز', '3', '10', '', ''],
    ['2026-04-09', 'تمرين البايسبس', '3', '12', '', ''],
    ['2026-04-09', 'تمرين الترايسبس', '3', '12', '', ''],
    ['2026-04-09', 'رفع ساق', '3', '20', '', ''],
    ['2026-04-09', 'جسر ألوية برجل واحدة', '3', '10', '', ''],

    // اليوم 10
    ['2026-04-10', 'سكوات', '4', '12', '', ''],
    ['2026-04-10', 'تمرين الضغط', '4', '10', 'بطيء', ''],
    ['2026-04-10', 'بلانك جانبي', '3', '30 ثانية', '', ''],
    ['2026-04-10', 'رفع جانبي', '3', '12', '', ''],
    ['2026-04-10', 'اندفاع خلفي', '3', '12', '', ''],
    ['2026-04-10', 'تمرين البطن', '3', '20', '', ''],

    // اليوم 11
    ['2026-04-11', 'تمرين الضغط', '4', '12', '', 'https://youtu.be/example_day11'],
    ['2026-04-11', 'سكوات', '4', '15', '', ''],
    ['2026-04-11', 'تمرين الترايسبس', '3', '12', '', ''],
    ['2026-04-11', 'بلانك', '3', '35 ثانية', '', ''],
    ['2026-04-11', 'رفع ساق', '3', '20', '', ''],
    ['2026-04-11', 'انحناء روماني', '3', '12', '', ''],

    // اليوم 12
    ['2026-04-12', 'سكوات', '4', '15', '', ''],
    ['2026-04-12', 'تمرين الضغط', '4', '12', '', ''],
    ['2026-04-12', 'اندفاع أمامي', '3', '12', '', ''],
    ['2026-04-12', 'تمرين البايسبس', '3', '12', '', ''],
    ['2026-04-12', 'بلانك جانبي', '3', '25 ثانية', '', ''],
    ['2026-04-12', 'رفع جانبي', '3', '12', '', ''],

    // اليوم 13
    ['2026-04-13', 'تمرين الضغط', '4', '10', 'واسع', ''],
    ['2026-04-13', 'سكوات', '4', '12', '', ''],
    ['2026-04-13', 'جسر ألوية', '3', '15', '', ''],
    ['2026-04-13', 'تمرين البطن (flutter kicks)', '3', '20', '', ''],
    ['2026-04-13', 'رفع كتف أمامي', '3', '12', '', ''],
    ['2026-04-13', 'بلانك', '3', '35 ثانية', '', ''],

    // اليوم 14 — راحة
    ['2026-04-14', 'تمدد كامل', '1', '20 دقيقة', '', ''],
    ['2026-04-14', 'مشي', '1', '30 دقيقة', '', ''],
    ['2026-04-14', 'تنفس', '1', '10 دقائق', '', ''],
    ['2026-04-14', 'بلانك خفيف', '2', '20 ثانية', '', ''],
    ['2026-04-14', 'يوغا', '1', '20 دقيقة', '', ''],
    ['2026-04-14', 'تمارين رقبة', '1', '5 دقائق', '', ''],

    // اليوم 15
    ['2026-04-15', 'سكوات', '4', '15', '', ''],
    ['2026-04-15', 'تمرين الضغط', '4', '12', '', ''],
    ['2026-04-15', 'اندفاع خلفي', '3', '12', '', ''],
    ['2026-04-15', 'رفع ساق', '3', '20', '', ''],
    ['2026-04-15', 'تمرين الترايسبس', '3', '12', '', ''],
    ['2026-04-15', 'بلانك', '3', '40 ثانية', '', ''],

    // اليوم 16
    ['2026-04-16', 'تمرين الضغط', '4', '12', 'ضيق', ''],
    ['2026-04-16', 'سكوات بقفز', '3', '10', '', ''],
    ['2026-04-16', 'تمرين البايسبس', '3', '12', '', ''],
    ['2026-04-16', 'بلانك جانبي', '3', '25 ثانية', '', ''],
    ['2026-04-16', 'رفع جانبي', '3', '12', '', ''],
    ['2026-04-16', 'انحناء روماني', '3', '12', '', ''],

    // اليوم 17
    ['2026-04-17', 'سكوات', '4', '15', '', ''],
    ['2026-04-17', 'تمرين الضغط', '4', '10', '', ''],
    ['2026-04-17', 'تمرين البطن', '3', '20', '', ''],
    ['2026-04-17', 'اندفاع أمامي', '3', '12', '', ''],
    ['2026-04-17', 'رفع كتف خلفي', '3', '12', '', ''],
    ['2026-04-17', 'جسر ألوية', '3', '15', '', ''],

    // اليوم 18
    ['2026-04-18', 'تمرين الضغط', '4', '12', '', ''],
    ['2026-04-18', 'سكوات', '4', '12', '', ''],
    ['2026-04-18', 'بلانك', '3', '35 ثانية', '', ''],
    ['2026-04-18', 'تمرين الترايسبس', '3', '12', '', ''],
    ['2026-04-18', 'رفع ساق', '3', '20', '', ''],
    ['2026-04-18', 'اندفاع جانبي', '3', '10', '', ''],

    // اليوم 19
    ['2026-04-19', 'سكوات', '4', '15', '', ''],
    ['2026-04-19', 'تمرين الضغط', '4', '12', '', ''],
    ['2026-04-19', 'تمرين البايسبس', '3', '12', '', ''],
    ['2026-04-19', 'بلانك جانبي', '3', '30 ثانية', '', ''],
    ['2026-04-19', 'رفع جانبي', '3', '12', '', ''],
    ['2026-04-19', 'انحناء روماني', '3', '12', '', ''],

    // اليوم 20
    ['2026-04-20', 'تمرين الضغط', '4', '12', '', 'https://youtu.example/day20'],
    ['2026-04-20', 'سكوات بقفز', '3', '12', '', ''],
    ['2026-04-20', 'بلانك', '3', '40 ثانية', '', ''],
    ['2026-04-20', 'تمرين البطن V-ups', '3', '15', '', ''],
    ['2026-04-20', 'اندفاع خلفي', '3', '12', '', ''],
    ['2026-04-20', 'تمرين الترايسبس', '3', '12', '', ''],

    // اليوم 21
    ['2026-04-21', 'سكوات', '4', '15', '', ''],
    ['2026-04-21', 'تمرين الضغط', '4', '10', 'بطيء جدًا', ''],
    ['2026-04-21', 'جسر ألوية برجل واحدة', '3', '10', '', ''],
    ['2026-04-21', 'رفع ساق', '3', '20', '', ''],
    ['2026-04-21', 'بلانك', '3', '35 ثانية', '', ''],
    ['2026-04-21', 'رفع جانبي', '3', '12', '', ''],

    // اليوم 22
    ['2026-04-22', 'تمرين الضغط', '4', '12', '', ''],
    ['2026-04-22', 'سكوات', '4', '15', '', ''],
    ['2026-04-22', 'اندفاع أمامي', '3', '12', '', ''],
    ['2026-04-22', 'تمرين البطن', '3', '20', '', ''],
    ['2026-04-22', 'بلانك جانبي', '3', '25 ثانية', '', ''],
    ['2026-04-22', 'تمرين البايسبس', '3', '12', '', ''],

    // اليوم 23
    ['2026-04-23', 'سكوات', '4', '15', '', ''],
    ['2026-04-23', 'تمرين الضغط', '4', '12', '', ''],
    ['2026-04-23', 'تمرين الترايسبس', '3', '12', '', ''],
    ['2026-04-23', 'بلانك', '3', '40 ثانية', '', ''],
    ['2026-04-23', 'رفع جانبي', '3', '12', '', ''],
    ['2026-04-23', 'انحناء روماني', '3', '12', '', ''],

    // اليوم 24 — راحة
    ['2026-04-24', 'مشي', '1', '40 دقيقة', 'راحة نشطة', ''],
    ['2026-04-24', 'تمدد', '1', '20 دقيقة', '', ''],
    ['2026-04-24', 'تنفس', '1', '10 دقائق', '', ''],
    ['2026-04-24', 'بلانك خفيف', '2', '20 ثانية', '', ''],
    ['2026-04-24', 'يوغا', '1', '20 دقيقة', '', ''],
    ['2026-04-24', 'تمارين كتف', '1', '5 دقائق', '', ''],

    // اليوم 25
    ['2026-04-25', 'تمرين الضغط', '4', '12', '', ''],
    ['2026-04-25', 'سكوات', '4', '15', '', ''],
    ['2026-04-25', 'اندفاع خلفي', '3', '12', '', ''],
    ['2026-04-25', 'بلانك', '3', '40 ثانية', '', ''],
    ['2026-04-25', 'تمرين البطن', '3', '20', '', ''],
    ['2026-04-25', 'تمرين البايسبس', '3', '12', '', ''],

    // اليوم 26
    ['2026-04-26', 'سكوات بقفز', '3', '12', '', ''],
    ['2026-04-26', 'تمرين الضغط', '4', '12', '', ''],
    ['2026-04-26', 'بلانك جانبي', '3', '30 ثانية', '', ''],
    ['2026-04-26', 'رفع ساق', '3', '20', '', ''],
    ['2026-04-26', 'جسر ألوية', '3', '15', '', ''],
    ['2026-04-26', 'رفع كتف أمامي', '3', '12', '', ''],

    // اليوم 27
    ['2026-04-27', 'تمرين الضغط', '4', '12', '', ''],
    ['2026-04-27', 'سكوات', '4', '15', '', ''],
    ['2026-04-27', 'تمرين الترايسبس', '3', '12', '', ''],
    ['2026-04-27', 'بلانك', '3', '35 ثانية', '', ''],
    ['2026-04-27', 'اندفاع أمامي', '3', '12', '', ''],
    ['2026-04-27', 'رفع جانبي', '3', '12', '', ''],

    // اليوم 28
    ['2026-04-28', 'سكوات', '4', '15', '', ''],
    ['2026-04-28', 'تمرين الضغط', '4', '10', 'واسع', ''],
    ['2026-04-28', 'تمرين البطن', '3', '20', '', ''],
    ['2026-04-28', 'بلانك جانبي', '3', '25 ثانية', '', ''],
    ['2026-04-28', 'تمرين البايسبس', '3', '12', '', ''],
    ['2026-04-28', 'انحناء روماني', '3', '12', '', ''],

    // اليوم 29
    ['2026-04-29', 'تمرين الضغط', '4', '12', '', 'https://youtu.example/day29'],
    ['2026-04-29', 'سكوات بقفز', '3', '12', '', ''],
    ['2026-04-29', 'بلانك', '3', '45 ثانية', 'تحدي', ''],
    ['2026-04-29', 'رفع ساق', '3', '20', '', ''],
    ['2026-04-29', 'اندفاع خلفي', '3', '12', '', ''],
    ['2026-04-29', 'تمرين الترايسبس', '3', '12', '', ''],

    // اليوم 30
    ['2026-04-30', 'سكوات', '4', '20', 'ختام قوي', ''],
    ['2026-04-30', 'تمرين الضغط', '4', '15', 'ختام قوي', ''],
    ['2026-04-30', 'بلانك', '3', '60 ثانية', 'تحدي نهائي', ''],
    ['2026-04-30', 'تمرين البطن', '3', '25', '', ''],
    ['2026-04-30', 'اندفاع أمامي', '3', '15', '', ''],
    ['2026-04-30', 'تمدد كامل', '1', '15 دقيقة', 'تبريد', '']
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', 'workout_template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  Swal.fire({
    icon: 'success',
    title: 'تم التحميل',
    text: 'تم تحميل ملف القالب بنجاح',
    timer: 1500,
    showConfirmButton: false,
  });
};

return (
  <div className="workout-plan">
    {isAutoSaving && (
      <div className="auto-save-indicator">
        <Loader size={14} className="spinner" />
        <span>جاري الحفظ التلقائي...</span>
      </div>
    )}

    <div className="workout-plan__header">
      <div className="workout-plan__header-top">
        <h2 className="workout-plan__title">
          <Dumbbell size={24} />
          البرنامج التدريبي الشهري
        </h2>

        <div className="workout-plan__week-info">
          {new Date(displayYear, displayMonth - 1).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long'
          })}
        </div>

        <button
          className="workout-plan__import-excel-btn"
          onClick={() => setShowImportModal(true)}
        >
          <FileSpreadsheet size={18} />
          <span>استيراد من Excel</span>
        </button>

        <button
          className="workout-plan__save-btn"
          onClick={handleSaveWorkoutPlan}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader size={18} className="spinner" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>حفظ التعديلات</span>
            </>
          )}
        </button>
      </div>

      <div className="workout-plan__pdf-section">
        <input
          ref={pdfInputRef}
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            console.log('📄 File input onChange triggered');
            console.log('Files:', e.target.files);
            if (e.target.files && e.target.files[0]) {
              handlePdfUpload(e.target.files[0]);
            }
          }}
          style={{ display: 'none' }}
        />

        {existingPdf && !pdfFile && (
          <div className="workout-plan__pdf-existing">
            <a
              href={getImageUrl(existingPdf)}
              target="_blank"
              rel="noopener noreferrer"
              className="workout-plan__pdf-view-btn"
            >
              📄 عرض PDF الحالي
            </a>
          </div>
        )}

        {pdfFile && (
          <div className="workout-plan__pdf-selected">
            <span className="workout-plan__pdf-name">
              📄 {pdfFile.name}
            </span>
            <button
              className="workout-plan__pdf-remove"
              onClick={handleRemovePdf}
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <button
          className={`workout-plan__pdf-btn ${pdfFile ? 'workout-plan__pdf-btn--selected' : ''}`}
          onClick={() => {
            console.log('📄 PDF button clicked, opening file dialog');
            pdfInputRef.current?.click();
          }}
          type="button"
        >
          <Upload size={16} />
          <span>{pdfFile ? 'تغيير الملف' : 'رفع PDF للشهر'}</span>
        </button>
      </div>
    </div>

    <div className="workout-plan__pagination">
      <button
        className="workout-plan__pagination-btn"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronRight size={18} />
      </button>

      {pageLabels.map((label, i) => (
        <button
          key={i}
          className={`workout-plan__pagination-page ${currentPage === i + 1 ? 'workout-plan__pagination-page--active' : ''}`}
          onClick={() => handlePageChange(i + 1)}
        >
          {label}
        </button>
      ))}

      <button
        className="workout-plan__pagination-btn"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronLeft size={18} />
      </button>
    </div>

    <div className="workout-plan__page-title">
      <span>الأيام {pageLabels[currentPage - 1]}</span>
    </div>

    <div className="workout-plan__days">
      {currentDays.map((dayInfo, index) => {
        const dayExercises = getExercisesForDate(dayInfo.date);
        const isExpanded = expandedDays.includes(dayInfo.id);
        const progress = getDayProgress(dayInfo.date);
        const isToday = dayInfo.date === new Date().toISOString().split('T')[0];

        return (
          <motion.div
            key={dayInfo.id}
            className={`workout-day ${isToday ? 'workout-day--today' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="workout-day__header" onClick={() => toggleDay(dayInfo.id)}>
              <div className="workout-day__header-top">
                <motion.div
                  className="workout-day__chevron"
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                >
                  <ChevronDown size={20} />
                </motion.div>

                <div className="workout-day__title-section">
                  <div className="workout-day__title-wrapper">
                    <h3 className="workout-day__title">{dayInfo.name}</h3>
                    {isToday && <span className="workout-day__today-badge">اليوم</span>}
                  </div>
                  <span className="workout-day__date">{dayInfo.date}</span>
                </div>

                <div className="workout-day__count">
                  {dayExercises.length} تمرين
                </div>
              </div>

              <div className="workout-day__header-bottom" onClick={(e) => e.stopPropagation()}>
                <div className="workout-day__progress">
                  <div
                    className="workout-day__progress-bar"
                    style={{ width: `${progress}%` }}
                  />
                  <span className="workout-day__progress-text">{progress}%</span>
                </div>

                <button
                  className="workout-day__expand-btn"
                  onClick={() => toggleDay(dayInfo.id)}
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  className="workout-day__content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div className="workout-day__exercises">
                    {dayExercises.length > 0 ? (
                      dayExercises.map((exercise) => (
                        <motion.div
                          key={exercise.id}
                          className="exercise-item"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <div className="exercise-item__left">
                            <button
                              className={`exercise-item__check ${exercise.completed ? 'exercise-item__check--completed' : ''}`}
                              onClick={() => handleToggleCompletion(exercise.id)}
                              disabled={String(exercise.id).startsWith('temp-')}
                            >
                              {exercise.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                            </button>
                          </div>

                          <div className="exercise-item__content">
                            <div className="exercise-item__main">
                              <input
                                type="text"
                                className="exercise-item__name"
                                value={exercise.name}
                                onChange={(e) => handleUpdateExercise(exercise.id, 'name', e.target.value)}
                                placeholder="اسم التمرين"
                              />

                              <div className="exercise-item__details">
                                <div className="exercise-item__detail">
                                  <label className="exercise-item__detail-label">مجموعات</label>
                                  <input
                                    type="number"
                                    value={exercise.sets}
                                    onChange={(e) => handleUpdateExercise(exercise.id, 'sets', e.target.value)}
                                    min="1"
                                  />
                                </div>

                                <div className="exercise-item__detail">
                                  <label className="exercise-item__detail-label">تكرارات</label>
                                  <input
                                    type="number"
                                    value={exercise.reps}
                                    onChange={(e) => handleUpdateExercise(exercise.id, 'reps', e.target.value)}
                                    min="1"
                                  />
                                </div>
                              </div>
                            </div>

                            <textarea
                              className="exercise-item__notes"
                              value={exercise.notes}
                              onChange={(e) => handleUpdateExercise(exercise.id, 'notes', e.target.value)}
                              placeholder="ملاحظات التمرين (اختياري)"
                              rows="2"
                            />

                            <div className="exercise-item__youtube-input">
                              <Youtube size={18} />
                              <input
                                type="url"
                                inputMode="url"
                                autoCorrect="off"
                                autoCapitalize="none"
                                spellCheck={false}
                                autoComplete="off"
                                value={exercise.youtube_url}
                                onChange={(e) => handleUpdateExercise(exercise.id, 'youtube_url', e.target.value)}
                                placeholder="رابط YouTube"
                              />
                            </div>

                            <div className="exercise-item__media-section">
                              <input
                                ref={el => fileInputRefs.current[exercise.id] = el}
                                type="file"
                                accept="video/*"
                                onChange={(e) => handleVideoUpload(exercise.id, e.target.files?.[0])}
                                style={{ display: 'none' }}
                              />

                              {exercise.youtube_url && getYoutubeEmbedUrl(exercise.youtube_url) && (
                                <div className="exercise-media-preview">
                                  <div className="exercise-media-preview__youtube">
                                    <iframe
                                      src={getYoutubeEmbedUrl(exercise.youtube_url)}
                                      title="YouTube video"
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    />
                                  </div>
                                </div>
                              )}

                              {exercise.video_file && (
                                <div className="exercise-media-preview">
                                  <div className="exercise-media-preview__video">
                                    {exercise.video_file instanceof File ? (
                                      <video controls>
                                        <source src={URL.createObjectURL(exercise.video_file)} type={exercise.video_file.type} />
                                      </video>
                                    ) : (
                                      <video src={getImageUrl(exercise.video_file)} controls />
                                    )}
                                    <button
                                      className="exercise-media-preview__remove"
                                      onClick={() => handleUpdateExercise(exercise.id, 'video_file', null)}
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                </div>
                              )}

                              {!exercise.video_file && (
                                <button
                                  className="exercise-item__upload-btn"
                                  onClick={() => fileInputRefs.current[exercise.id]?.click()}
                                >
                                  <Upload size={16} />
                                  <span>رفع فيديو</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="exercise-item__right">
                            <button
                              className="exercise-item__delete"
                              onClick={() => handleDeleteExercise(exercise.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="workout-day__empty">
                        <Dumbbell size={40} />
                        <p>لا توجد تمارين لهذا اليوم</p>
                        <p className="workout-day__empty-sub">انقر على "إضافة تمرين" لبدء إنشاء البرنامج</p>
                      </div>
                    )}
                  </div>

                  <button
                    className="workout-day__add-exercise"
                    onClick={() => handleAddExercise(dayInfo.date)}
                  >
                    <Plus size={16} />
                    إضافة تمرين
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>

    <div className="workout-plan__pagination workout-plan__pagination--bottom">
      <button
        className="workout-plan__pagination-btn"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronRight size={18} />
      </button>

      {pageLabels.map((label, i) => (
        <button
          key={i}
          className={`workout-plan__pagination-page ${currentPage === i + 1 ? 'workout-plan__pagination-page--active' : ''}`}
          onClick={() => handlePageChange(i + 1)}
        >
          {label}
        </button>
      ))}

      <button
        className="workout-plan__pagination-btn"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronLeft size={18} />
      </button>
    </div>

    {showImportModal && (
      <div className="workout-plan__modal-overlay" onClick={() => setShowImportModal(false)}>
        <div className="workout-plan__modal" onClick={(e) => e.stopPropagation()}>
          <div className="workout-plan__modal-header">
            <h3>
              <FileSpreadsheet size={20} />
              استيراد تمارين من Excel
            </h3>
            <button className="workout-plan__modal-close" onClick={() => setShowImportModal(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="workout-plan__modal-body">
            <div className="workout-plan__import-info">
              <AlertCircle size={16} />
              <span>الأعمدة المطلوبة: exercise_date, name (sets, reps, notes, youtube_url اختيارية)</span>
            </div>

            <button
              className="workout-plan__template-btn"
              onClick={downloadExcelTemplate}
              type="button"
            >
              <FileSpreadsheet size={16} />
              تحميل ملف قالب
            </button>

            <div className="workout-plan__file-input-wrapper">
              <input
                ref={excelInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => handleExcelFileSelect(e.target.files?.[0])}
                className="workout-plan__file-input"
              />
              {excelFile && (
                <div className="workout-plan__selected-file">
                  <span>📄 {excelFile.name}</span>
                  <button onClick={() => setExcelFile(null)}>
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <label className="workout-plan__checkbox">
              <input
                type="checkbox"
                checked={replaceExisting}
                onChange={(e) => setReplaceExisting(e.target.checked)}
              />
              <span>استبدال التمارين الحالية (بدلاً من دمجها)</span>
            </label>

            <div className="workout-plan__modal-buttons">
              <button
                className="workout-plan__modal-cancel"
                onClick={() => setShowImportModal(false)}
              >
                إلغاء
              </button>
              <button
                className="workout-plan__modal-import"
                onClick={handleExcelUpload}
                disabled={!excelFile || isImporting}
              >
                {isImporting ? (
                  <>
                    <Loader size={16} className="spinner" />
                    جاري الاستيراد...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet size={16} />
                    استيراد
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default WorkoutPlan;