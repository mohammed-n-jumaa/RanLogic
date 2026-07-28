import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import SidebarSection from './SidebarSection';
import { sidebarSections } from '../../../data/sidebarData';
import authApi from '../../../api/authApi';
import './Sidebar.scss';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  /**
   * Handle logout action
   */
  const handleLogout = async () => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'تسجيل الخروج',
      text: 'هل أنت متأكد من تسجيل الخروج؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#607d8b',
      confirmButtonText: 'نعم، تسجيل الخروج',
      cancelButtonText: 'إلغاء',
      reverseButtons: true
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsLoggingOut(true);

    try {
      // Call logout API
      await authApi.logout();

      // Show success message
      await Swal.fire({
        title: 'تم تسجيل الخروج',
        text: 'تم تسجيل خروجك بنجاح',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      // Redirect to login
      navigate('/login');

    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if API fails, still logout locally
      authApi.clearAuthData();
      
      // Show error but still redirect
      await Swal.fire({
        title: 'تنبيه',
        text: 'تم تسجيل الخروج محلياً',
        icon: 'info',
        timer: 1500,
        showConfirmButton: false
      });

      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="sidebar-mobile-toggle"
        onClick={toggleMobile}
        aria-label="Toggle Menu"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobile}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.aside
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
        initial={false}
        animate={{
          width: isCollapsed ? '80px' : '280px'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="sidebar__container">
          {/* Logo Area */}
          <div className="sidebar__logo">
            <motion.div 
              className="sidebar__logo-icon"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <span className="sidebar__logo-emoji">💪</span>
            </motion.div>
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  className="sidebar__logo-text"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2>RAND Control</h2>
                  <p>نظام التحكم الرياضي</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Toggle Button (Desktop) */}
          <motion.button
            className="sidebar__toggle"
            onClick={toggleCollapse}
            aria-label="Toggle Sidebar"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </motion.button>
          
          {/* Sections */}
          <div className="sidebar__sections">
            {sidebarSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <SidebarSection 
                  section={section} 
                  isCollapsed={isCollapsed}
                  onLogout={section.action === 'logout' ? handleLogout : undefined}
                  isLoggingOut={isLoggingOut}
                />
              </motion.div>
            ))}
          </div>
          
          {/* Version Info */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                className="sidebar__footer"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="sidebar__version">v1.0.0</p>
                <p className="sidebar__copyright">© 2025 Rand Jarar</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;