import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, LogOut, LayoutPanelLeft, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { sidebarSections } from '../../../data/sidebarData';
import aboutCoachApi from '../../../api/aboutCoachApi';
import authApi from '../../../api/authApi';
import './Sidebar.scss';

// ─── Section Accordion ───────────────────────────────────────────────────────

const SidebarSection = ({ section, isOpen, onToggle, onNavigate }) => {
  const Icon = section.icon;

  return (
    <div className="sb-section">
      <button className="sb-section__btn" onClick={onToggle}>
        <Icon size={17} className="sb-section__icon" style={{ color: section.color }} />
        <span className="sb-section__title">{section.title}</span>
        <ChevronDown size={14} className={`sb-section__arrow ${isOpen ? 'open' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="sb-section__items"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {section.items.map((item) => {
              const ItemIcon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => `sb-item ${isActive ? 'sb-item--active' : ''}`}
                  onClick={onNavigate}
                >
                  <ItemIcon size={16} className="sb-item__icon" />
                  <span className="sb-item__label">{item.label}</span>
                  {item.badge > 0 && <span className="sb-item__dot" />}
                </NavLink>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Sidebar ────────────────────────────────────────────────────────────

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [coach, setCoach] = useState({ name: '', role: '', image: '' });
  const [openSections, setOpenSections] = useState({});

  // Load coach data
  useEffect(() => {
    const loadCoach = async () => {
      try {
        const res = await aboutCoachApi.getAboutCoach();
        if (res.success && res.data) {
          setCoach({
            name: res.data.name || res.data.title || 'Admin',
            role: res.data.subtitle || res.data.role || '',
            image: res.data.image_url || '',
          });
        }
      } catch {
        // Fallback to auth user
        const user = authApi.getUser();
        if (user) setCoach({ name: user.name || 'Admin', role: '', image: '' });
      }
    };
    loadCoach();
  }, []);

  // Auto-open section that contains the active route
  useEffect(() => {
    const initial = {};
    sidebarSections.forEach((section) => {
      if (section.items?.some((item) => location.pathname.startsWith(item.path))) {
        initial[section.id] = true;
      }
    });
    // Always open dashboard
    const dashSection = sidebarSections.find(s => s.id === 'dashboard');
    if (dashSection) initial[dashSection.id] = true;
    setOpenSections(initial);
  }, []);

  const toggleSection = useCallback((id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleNavigate = () => {
    // Close on mobile after clicking a link
    if (window.innerWidth < 992) setIsOpen(false);
  };

  // Logout
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'تسجيل الخروج',
      text: 'هل أنت متأكد من تسجيل الخروج؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#607d8b',
      confirmButtonText: 'نعم، تسجيل الخروج',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;

    setIsLoggingOut(true);
    try {
      await authApi.logout();
    } catch {
      authApi.clearAuthData();
    } finally {
      setIsLoggingOut(false);
      authApi.clearAuthData();
      navigate('/login');
    }
  };

  // Coach initials fallback
  const initials = coach.name
    ? coach.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'RC';

  // Filter out logout section (we handle it separately)
  const navSections = sidebarSections.filter((s) => s.action !== 'logout' && s.items?.length > 0);

  return (
    <>
      {/* ── Floating Orb Button ────────────────────────────── */}
      <button
        className={`sb-orb ${isOpen ? 'sb-orb--open' : ''}`}
        onClick={isOpen ? handleClose : handleOpen}
        aria-label={isOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
      >
        {!isOpen && <span className="sb-orb__glow" />}
        <LayoutPanelLeft size={isOpen ? 17 : 21} className="sb-orb__icon" />
      </button>

      {/* ── Overlay ───────────────────────────────────────── */}
      <div className={`sb-overlay ${isOpen ? 'sb-overlay--visible' : ''}`} onClick={handleClose} />

      {/* ── Drawer ────────────────────────────────────────── */}
      <aside className={`sb-drawer ${isOpen ? '' : 'sb-drawer--shut'}`}>
        <div className="sb-drawer__inner">

          {/* Profile */}
          <div className="sb-profile">
            <div className="sb-profile__avatar">
              <div className="sb-profile__ring" />
              {coach.image ? (
                <img src={coach.image} alt={coach.name} />
              ) : (
                <div className="sb-profile__initials">{initials}</div>
              )}
              <div className="sb-profile__online" />
            </div>
            <div className="sb-profile__name">{coach.name}</div>
            {coach.role && <div className="sb-profile__role">{coach.role}</div>}
          </div>

          {/* Navigation */}
          <nav className="sb-nav">
            {navSections.map((section, i) => (
              <React.Fragment key={section.id}>
                {i > 0 && <div className="sb-divider" />}
                <SidebarSection
                  section={section}
                  isOpen={!!openSections[section.id]}
                  onToggle={() => toggleSection(section.id)}
                  onNavigate={handleNavigate}
                />
              </React.Fragment>
            ))}
          </nav>

          {/* Bottom */}
          <div className="sb-bottom">
            <button
              className="sb-logout"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut size={17} />
              <span>{isLoggingOut ? 'جاري الخروج...' : 'تسجيل الخروج'}</span>
            </button>
            <div className="sb-version">v1.0.0 — © 2025 Rand Jarar</div>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
