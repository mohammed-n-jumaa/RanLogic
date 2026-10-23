import React from 'react';
import './PageLoader.scss';
import { t } from '../../i18n';

/**
 * PageLoader
 * Spinner used while auth is being verified or a lazy page chunk is loading.
 *
 * @param {boolean} props.fullScreen - Cover the whole viewport (default: false)
 */
const PageLoader = ({ fullScreen = false }) => (
  <div className={`page-loader${fullScreen ? ' page-loader--full' : ''}`}>
    <div className="page-loader__spinner" />
    <p>{t('جاري التحميل...')}</p>
  </div>
);

export default PageLoader;
