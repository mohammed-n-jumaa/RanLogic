import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronDown, Globe, MessageSquare, Moon, Sun, Pencil, Home, LogOut } from 'lucide-react';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';
import { getAvatarUrl, onAvatarError } from './profileShared';

const ProfileTopbar = ({ title, userData, unreadCount, recentMessages, onOpenChat, onEditProfile, theme, onToggleTheme, onLogout }) => {
  const { t, currentLang, toggleLanguage } = useProfileLanguage();
  const [bellOpen, setBellOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [bellPos, setBellPos] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const bellRef = useRef(null);
  const userRef = useRef(null);

  useDismiss(bellOpen, bellRef, () => setBellOpen(false));
  useDismiss(userOpen, userRef, () => setUserOpen(false));

  const locale = currentLang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
  const today = new Date().toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (msg) => {
    const d = new Date(msg.created_at || msg.timestamp);
    return isNaN(d) ? '' : d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header className="pf-topbar">
      <div className="pf-topbar__heading">
        <p className="pf-topbar__date">{today}</p>
        <h1 className="pf-topbar__title">{title}</h1>
      </div>

      <div className="pf-topbar__actions">
        <button type="button" className="pf-lang-btn" onClick={toggleLanguage} lang={currentLang === 'ar' ? 'en' : 'ar'}
          aria-label={currentLang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}>
          <Globe />
          <span className="pf-lang-btn__long">{currentLang === 'ar' ? 'English' : 'العربية'}</span>
          <span className="pf-lang-btn__short">{currentLang === 'ar' ? 'EN' : 'ع'}</span>
        </button>

        <button type="button" className="pf-icon-btn" onClick={onToggleTheme} aria-pressed={theme === 'dark'}
          aria-label={theme === 'dark' ? t('الوضع الفاتح', 'Light mode') : t('الوضع الليلي', 'Dark mode')}
          title={theme === 'dark' ? t('الوضع الفاتح', 'Light mode') : t('الوضع الليلي', 'Dark mode')}>
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>

        <div className="pf-bell" ref={bellRef}>
          <button
            type="button"
            className="pf-icon-btn"
            onClick={(e) => { setBellPos(popoverPosition(e.currentTarget)); setBellOpen(open => !open); }}
            aria-label={t('رسائل المدربة', "Trainer's messages")}
            aria-expanded={bellOpen}
          >
            <Bell />
            {unreadCount > 0 && <span className="pf-dot-badge pf-num">{unreadCount > 99 ? '99+' : unreadCount}</span>}
          </button>

          {bellOpen && (
            <div className={`pf-popover pf-popover--${bellPos?.side} pf-view`} style={bellPos?.style}>
              <div className="pf-popover__head">
                <strong>{t('رسائل المدربة', "Trainer's messages")}</strong>
                {unreadCount > 0 && <span className="pf-pill pf-pill--primary pf-num">{unreadCount}</span>}
              </div>
              <div className="pf-popover__body">
                {recentMessages.length === 0
                  ? <p className="pf-popover__empty">{t('لا توجد رسائل جديدة', 'No new messages')}</p>
                  : recentMessages.map((msg, i) => (
                    <div key={msg.id ?? i} className={`pf-popover__msg ${!msg.is_read ? 'is-unread' : ''}`}>
                      <p>{msg.content?.length > 80 ? `${msg.content.slice(0, 80)}…` : msg.content}</p>
                      <small className="pf-num">{formatTime(msg)}</small>
                    </div>
                  ))}
              </div>
              <button type="button" className="pf-popover__foot" onClick={() => { setBellOpen(false); onOpenChat(); }}>
                <MessageSquare /> {t('فتح المحادثة', 'Open chat')}
              </button>
            </div>
          )}
        </div>

        <div className="pf-user" ref={userRef}>
          <button type="button" className="pf-chip" onClick={(e) => { setUserPos(popoverPosition(e.currentTarget)); setUserOpen(open => !open); }}
            aria-label={t('قائمة الحساب', 'Account menu')} aria-expanded={userOpen} aria-haspopup="menu">
            <img src={getAvatarUrl(userData)} alt="" onError={onAvatarError} />
            <span className="pf-chip__text">
              <strong>{userData?.name || t('مستخدم', 'User')}</strong>
              <small>{userData?.program || t('برنامج تدريبي', 'Training program')}</small>
            </span>
            <ChevronDown />
          </button>

          {userOpen && (
            <div className={`pf-popover pf-popover--${userPos?.side} pf-menu pf-view`} style={userPos?.style} role="menu">
              <div className="pf-menu__who">
                <strong>{userData?.name || t('مستخدم', 'User')}</strong>
                <small>{userData?.email}</small>
              </div>
              <button type="button" role="menuitem" className="pf-menu__item" onClick={() => { setUserOpen(false); onEditProfile(); }}>
                <Pencil /> {t('تعديل الملف الشخصي', 'Edit profile')}
              </button>
              <Link to="/" role="menuitem" className="pf-menu__item" onClick={() => setUserOpen(false)}>
                <Home /> {t('الصفحة الرئيسية', 'Home page')}
              </Link>
              <button type="button" role="menuitem" className="pf-menu__item pf-menu__item--danger" onClick={() => { setUserOpen(false); onLogout(); }}>
                <LogOut /> {t('تسجيل خروج', 'Log out')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Where to open a header popover so it never runs off screen:
// desktop → hang from the side of the button that faces the middle of the screen;
// phones → handled in CSS as a full-width panel, placed just under the button.
function popoverPosition(button) {
  const r = button.getBoundingClientRect();
  return {
    side: r.left + r.width / 2 < window.innerWidth / 2 ? 'left' : 'right',
    style: { '--pf-pop-top': `${Math.round(r.bottom + 8)}px` },
  };
}

// Close a popover on outside click or Escape
function useDismiss(open, ref, close) {
  useEffect(() => {
    if (!open) return undefined;
    const onDown = e => { if (!ref.current?.contains(e.target)) close(); };
    const onKey = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, ref, close]);
}

export default ProfileTopbar;
