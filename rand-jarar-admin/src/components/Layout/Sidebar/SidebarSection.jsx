import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import SidebarItem from './SidebarItem';
import Badge from '../../common/Badge';
import './SidebarSection.scss';

const SidebarSection = ({ section, isCollapsed, onLogout, isLoggingOut }) => {
  const [isOpen, setIsOpen] = useState(true);
  const sectionRef = useRef(null);
  const Icon = section.icon;
  
  const toggleSection = () => {
    if (!isCollapsed) {
      setIsOpen(!isOpen);
    }
  };
  
  const totalBadges = section.items?.reduce((sum, item) => sum + (item.badge || 0), 0) || section.badge || 0;
  
  if (section.action === 'logout') {
    return (
      <div className="sidebar-section logout-section">
        <motion.button
          className="sidebar-section__header logout-button"
          onClick={onLogout}
          disabled={isLoggingOut}
          whileHover={{ scale: isLoggingOut ? 1 : 1.02 }}
          whileTap={{ scale: isLoggingOut ? 1 : 0.98 }}
        >
          <div className="sidebar-section__header-content">
            <div 
              className="sidebar-section__icon"
              style={{ color: section.color }}
            >
              <Icon size={20} />
            </div>
            
            {!isCollapsed && (
              <>
                <span className="sidebar-section__title">
                  {isLoggingOut ? 'جاري الخروج...' : section.title}
                </span>
                
                {isLoggingOut && (
                  <span className="logout-spinner"></span>
                )}
              </>
            )}
          </div>
        </motion.button>
      </div>
    );
  }
  
  // Regular section handling
  return (
    <div 
      ref={sectionRef}
      className={`sidebar-section ${isOpen ? 'open' : 'closed'}`}
    >
      <motion.div
        className="sidebar-section__header"
        onClick={toggleSection}
        whileHover={{ scale: isCollapsed ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="sidebar-section__header-content">
          <div 
            className="sidebar-section__icon"
            style={{ color: section.color }}
          >
            <Icon size={20} />
          </div>
          
          {!isCollapsed && (
            <>
              <span className="sidebar-section__title">{section.title}</span>
              
              {totalBadges > 0 && (
                <Badge count={totalBadges} pulse />
              )}
              
              {section.items && section.items.length > 0 && (
                <motion.div
                  className="sidebar-section__chevron"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={16} />
                </motion.div>
              )}
            </>
          )}
        </div>
      </motion.div>
      
      <AnimatePresence>
        {isOpen && !isCollapsed && section.items && section.items.length > 0 && (
          <motion.div
            className="sidebar-section__items"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {section.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <SidebarItem item={item} isCollapsed={isCollapsed} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Collapsed State - Show tooltip on hover */}
      {isCollapsed && section.items && section.items.length > 0 && (
        <div 
          className="sidebar-section__tooltip"
          style={{
            top: sectionRef.current?.offsetTop || 0
          }}
        >
          <div className="sidebar-section__tooltip-content">
            <h4>{section.title}</h4>
            <div className="sidebar-section__tooltip-items">
              {section.items.map(item => (
                <SidebarItem key={item.id} item={item} isCollapsed={false} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarSection;