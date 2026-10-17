import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';
import { PROFILE_TABS } from './profileShared';

const ProfileBottomNav = ({ activeTab, onSelectTab, unreadCount }) => {
  const { t } = useProfileLanguage();

  return (
    <nav className="pf-bottom-nav" aria-label={t('التنقل', 'Navigation')}>
      {PROFILE_TABS.map(({ id, labelAr, labelEn, Icon, hasBadge }) => (
        <button
          key={id}
          type="button"
          className={activeTab === id ? 'is-active' : ''}
          aria-current={activeTab === id ? 'page' : undefined}
          onClick={() => onSelectTab(id)}
        >
          <Icon />
          <span>{t(labelAr, labelEn)}</span>
          {hasBadge && unreadCount > 0 && <span className="pf-nav__badge pf-num">{unreadCount > 99 ? '99+' : unreadCount}</span>}
        </button>
      ))}
    </nav>
  );
};

export default ProfileBottomNav;
