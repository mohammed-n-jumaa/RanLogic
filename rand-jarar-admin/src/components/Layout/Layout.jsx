import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.scss';

const Layout = () => {
  return (
    <div className="layout">
      {/* Sidebar with its own mobile toggle logic */}
      <Sidebar />
      
      <div className="layout__main">
        <Header currentSection="لوحة التحكم" />
        
        <main className="layout__content">
          <div className="layout__content-wrapper">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;