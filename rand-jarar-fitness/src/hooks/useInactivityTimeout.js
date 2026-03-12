import { useEffect, useRef, useCallback } from 'react';
import authApi from '../api/authApi';
import Swal from 'sweetalert2';

const useInactivityTimeout = (timeoutMinutes = 30, warningMinutes = 5) => {
  const timeoutIdRef = useRef(null);
  const warningIdRef = useRef(null);
  const isWarningShownRef = useRef(false);

  const timeoutDuration = timeoutMinutes * 60 * 1000;
  const warningDuration = (timeoutMinutes - warningMinutes) * 60 * 1000;

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
      
      Swal.fire({
        title: 'تم تسجيل الخروج',
        text: 'تم تسجيل خروجك تلقائياً بسبب عدم النشاط',
        icon: 'info',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#FDB813',
        timer: 3000,
        timerProgressBar: true
      }).then(() => {
        window.location.href = '/';
      });
    } catch (error) {
      console.error('Logout error:', error);
      authApi.clearAuthData();
      window.location.href = '/';
    }
  }, []);

  const showWarning = useCallback(() => {
    if (isWarningShownRef.current) return;
    
    isWarningShownRef.current = true;

    Swal.fire({
      title: 'تنبيه!',
      html: `سيتم تسجيل خروجك تلقائياً خلال <b>${warningMinutes}</b> دقائق بسبب عدم النشاط.<br/><br/>هل تريد البقاء مسجلاً؟`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، أريد البقاء',
      cancelButtonText: 'تسجيل الخروج الآن',
      confirmButtonColor: '#FDB813',
      cancelButtonColor: '#d33',
      timer: warningMinutes * 60 * 1000,
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        const content = Swal.getHtmlContainer();
        const b = content.querySelector('b');
        let remainingSeconds = warningMinutes * 60;
        
        const interval = setInterval(() => {
          remainingSeconds--;
          const minutes = Math.floor(remainingSeconds / 60);
          const seconds = remainingSeconds % 60;
          b.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          
          if (remainingSeconds <= 0) {
            clearInterval(interval);
          }
        }, 1000);
      }
    }).then((result) => {
      isWarningShownRef.current = false;
      
      if (result.isConfirmed) {
        resetTimer();
        
        Swal.fire({
          title: 'تم التحديث!',
          text: 'تم تمديد جلستك بنجاح',
          icon: 'success',
          confirmButtonText: 'متابعة',
          confirmButtonColor: '#FDB813',
          timer: 2000,
          timerProgressBar: true
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        logout();
      } else if (result.dismiss === Swal.DismissReason.timer) {
        logout();
      }
    });
  }, [warningMinutes, logout]);

  const resetTimer = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    if (warningIdRef.current) {
      clearTimeout(warningIdRef.current);
    }

    if (isWarningShownRef.current) {
      Swal.close();
      isWarningShownRef.current = false;
    }

    if (!authApi.isAuthenticated()) {
      return;
    }

    authApi.updateLastActivity();

    warningIdRef.current = setTimeout(() => {
      showWarning();
    }, warningDuration);

    timeoutIdRef.current = setTimeout(() => {
      logout();
    }, timeoutDuration);

  }, [timeoutDuration, warningDuration, showWarning, logout]);

  useEffect(() => {
    if (!authApi.isAuthenticated()) {
      return;
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click', 'focus'];

    resetTimer();

    events.forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      if (warningIdRef.current) {
        clearTimeout(warningIdRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      
      if (isWarningShownRef.current) {
        Swal.close();
      }
    };
  }, [resetTimer]);

  return { resetTimer, logout };
};

export default useInactivityTimeout;