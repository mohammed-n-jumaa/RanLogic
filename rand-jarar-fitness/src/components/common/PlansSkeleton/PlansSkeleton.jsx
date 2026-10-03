import '../HomeSkeleton/HomeSkeleton.scss';
import './PlansSkeleton.scss';

const PlansSkeleton = () => (
  <div className="home-skeleton plans-skeleton">
    {/* Header */}
    <div className="hs-header">
      <div className="hs-bone" style={{ width: 110, height: 36 }} />
      <div className="hs-header__nav">
        {[70, 55, 65].map((w, i) => (
          <div key={i} className="hs-bone" style={{ width: w, height: 14 }} />
        ))}
      </div>
      <div className="hs-header__actions">
        <div className="hs-bone" style={{ width: 50, height: 14 }} />
        <div className="hs-bone" style={{ width: 50, height: 14 }} />
      </div>
    </div>

    {/* Hero */}
    <div className="ps-hero">
      <div className="hs-bone hs-bone--badge" style={{ width: 190, height: 34 }} />
      <div className="hs-bone" style={{ width: '60%', maxWidth: 560, height: 44, marginTop: 24 }} />
      <div className="hs-bone" style={{ width: '80%', maxWidth: 600, height: 16, marginTop: 24 }} />
      <div className="hs-bone" style={{ width: '65%', maxWidth: 480, height: 16, marginTop: 8 }} />
      <div className="hs-bone ps-offer" style={{ width: '70%', maxWidth: 440, height: 64, marginTop: 32 }} />
    </div>

    {/* Plan cards */}
    <div className="ps-grid">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="ps-card">
          <div className="hs-bone" style={{ width: '55%', height: 22 }} />
          <div className="hs-bone" style={{ width: '85%', height: 12, marginTop: 12 }} />
          <div className="hs-bone" style={{ width: '40%', height: 36, marginTop: 24 }} />
          <div className="ps-card__durations">
            {[1, 2, 3].map(d => (
              <div key={d} className="hs-bone" style={{ flex: 1, height: 34 }} />
            ))}
          </div>
          <div className="ps-card__features">
            {[90, 75, 85, 65, 80].map((w, f) => (
              <div key={f} className="hs-bone" style={{ width: `${w}%`, height: 12 }} />
            ))}
          </div>
          <div className="hs-bone hs-bone--btn" style={{ width: '100%', height: 48, marginTop: 'auto' }} />
        </div>
      ))}
    </div>
  </div>
);

export default PlansSkeleton;
