import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.scss';
import { t } from '../../i18n';

const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />

      <div className="layout__main">
        <Header currentSection={t('لوحة التحكم')} />

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
