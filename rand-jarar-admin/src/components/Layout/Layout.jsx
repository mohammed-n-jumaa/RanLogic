import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import PageLoader from '../PageLoader/PageLoader';
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
            {/* Lazy pages load here while sidebar/header stay visible */}
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
