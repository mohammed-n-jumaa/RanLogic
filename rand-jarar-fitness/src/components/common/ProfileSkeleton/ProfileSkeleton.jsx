import '../HomeSkeleton/HomeSkeleton.scss';
import './ProfileSkeleton.scss';

const ProfileSkeleton = () => (
  <div className="profile-skeleton">
    {/* Profile header card */}
    <div className="prs-header">
      <div className="prs-header__top">
        <div className="prs-header__info">
          <div className="hs-bone prs-avatar" />
          <div className="prs-header__text">
            <div className="hs-bone" style={{ width: 180, height: 24 }} />
            <div className="hs-bone" style={{ width: 130, height: 14, marginTop: 10 }} />
            <div className="prs-header__stats">
              {[1, 2, 3].map(i => (
                <div key={i} className="hs-bone" style={{ width: 70, height: 26, borderRadius: 13 }} />
              ))}
            </div>
          </div>
        </div>
        <div className="prs-header__actions">
          <div className="hs-bone prs-circle" />
          <div className="hs-bone prs-circle" />
        </div>
      </div>
      <div className="hs-bone" style={{ width: 140, height: 12 }} />
      <div className="hs-bone" style={{ width: '100%', height: 10, marginTop: 10, borderRadius: 5 }} />
    </div>

    {/* Tabs */}
    <div className="prs-tabs">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="hs-bone prs-tab" />
      ))}
    </div>

    {/* Overview cards */}
    <div className="prs-grid">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="prs-card">
          <div className="hs-bone" style={{ width: '45%', height: 20 }} />
          <div className="prs-card__stats">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="prs-card__stat">
                <div className="hs-bone" style={{ width: 40, height: 40, borderRadius: 12 }} />
                <div className="hs-bone" style={{ width: '60%', height: 18, marginTop: 10 }} />
                <div className="hs-bone" style={{ width: '80%', height: 11, marginTop: 6 }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ProfileSkeleton;
