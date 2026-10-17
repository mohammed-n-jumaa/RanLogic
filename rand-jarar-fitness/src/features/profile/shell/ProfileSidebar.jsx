import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Home, LogOut } from 'lucide-react';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';
import logoApi from '../../../api/logoApi';
import { PROFILE_TABS, getSubscriptionProgress } from './profileShared';

const ProfileSidebar = ({ activeTab, onSelectTab, unreadCount, userData, onLogout }) => {
  const { t } = useProfileLanguage();
  const [logoUrl, setLogoUrl] = useState(null);
  const { daysLeft, pctLeft } = getSubscriptionProgress(userData);
  const active = !!userData?.has_active_subscription;

  useEffect(() => {
    let cancelled = false;
    logoApi.getActiveLogo()
      .then(res => { if (!cancelled && res?.success && res.data?.file_url) setLogoUrl(res.data.file_url); })
      .catch(() => { /* text logo fallback */ });
    return () => { cancelled = true; };
  }, []);

  return (
    <aside className="pf-sidebar" aria-label={t('قائمة الملف الشخصي', 'Profile menu')}>
      <Link to="/" className="pf-brand">
        {logoUrl
          ? <img src={logoUrl} alt="RanLogic" />
          : <><span className="pf-brand__mark"><Dumbbell /></span><span className="pf-brand__name">RanLogic</span></>}
      </Link>

      <nav className="pf-nav">
        {PROFILE_TABS.map(({ id, labelAr, labelEn, Icon, hasBadge }) => (
          <button
            key={id}
            type="button"
            className={`pf-nav__item ${activeTab === id ? 'is-active' : ''}`}
            aria-current={activeTab === id ? 'page' : undefined}
            onClick={() => onSelectTab(id)}
          >
            <Icon />
            <span>{t(labelAr, labelEn)}</span>
            {hasBadge && unreadCount > 0 && <span className="pf-nav__badge pf-num">{unreadCount > 99 ? '99+' : unreadCount}</span>}
          </button>
        ))}
      </nav>

      <div className="pf-sidebar__plan">
        <div className="pf-sidebar__plan-head">
          <span>{t('اشتراكك', 'Your plan')}</span>
          <span className={`pf-pill ${active ? 'pf-pill--ok' : 'pf-pill--bad'}`}>{active ? t('نشط', 'Active') : t('منتهي', 'Expired')}</span>
        </div>
        <div className="pf-sidebar__plan-days">
          <strong className="pf-num">{daysLeft}</strong>{t('يوم متبقي', 'days left')}
        </div>
        <div className="pf-bar"><span style={{ width: `${pctLeft}%` }} /></div>
        <button type="button" className="pf-btn pf-btn--primary pf-btn--block" onClick={() => onSelectTab('payment')}>
          {active ? t('تجديد الاشتراك', 'Renew') : t('اشترك الآن', 'Subscribe')}
        </button>
      </div>

      <div className="pf-sidebar__footer">
        <Link to="/" className="pf-nav__item pf-nav__item--muted"><Home /><span>{t('الصفحة الرئيسية', 'Home page')}</span></Link>
        <button type="button" className="pf-nav__item pf-nav__item--muted" onClick={onLogout}>
          <LogOut /><span>{t('تسجيل خروج', 'Logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
