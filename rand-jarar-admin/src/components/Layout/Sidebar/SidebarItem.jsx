import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import Badge from '../../common/Badge';
import './SidebarItem.scss';

const SidebarItem = ({ item, isCollapsed }) => {
  const Icon = item.icon;
  
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => 
        `sidebar-item ${isActive ? 'active' : ''} ${item.danger ? 'danger' : ''}`
      }
    >
      <motion.div
        className="sidebar-item__content"
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        <div className="sidebar-item__icon">
          <Icon size={18} />
        </div>
        
        {!isCollapsed && (
          <span className="sidebar-item__label">{item.label}</span>
        )}
        
        {item.badge && !isCollapsed && (
          <Badge count={item.badge} pulse />
        )}
      </motion.div>
    </NavLink>
  );
};

export default SidebarItem;