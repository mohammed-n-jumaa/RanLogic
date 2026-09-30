import './HomeSkeleton.scss';

const HomeSkeleton = () => (
  <div className="home-skeleton">
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
    <div className="hs-hero">
      <div className="hs-hero__inner">
        <div className="hs-hero__text">
          <div className="hs-bone hs-bone--badge" style={{ width: 150, height: 30 }} />
          <div className="hs-bone" style={{ width: '90%', height: 40, marginTop: 20 }} />
          <div className="hs-bone" style={{ width: '70%', height: 40, marginTop: 10 }} />
          <div className="hs-bone" style={{ width: '80%', height: 16, marginTop: 24 }} />
          <div className="hs-bone" style={{ width: '55%', height: 16, marginTop: 8 }} />
          <div className="hs-bone hs-bone--btn" style={{ width: 180, height: 50, marginTop: 28 }} />
          <div className="hs-hero__stats">
            {[1, 2, 3].map(i => (
              <div key={i} className="hs-hero__stat">
                <div className="hs-bone" style={{ width: 55, height: 28 }} />
                <div className="hs-bone" style={{ width: 80, height: 12, marginTop: 6 }} />
              </div>
            ))}
          </div>
        </div>
        <div className="hs-hero__media">
          <div className="hs-bone hs-bone--media" />
        </div>
      </div>
    </div>

    {/* Section - Cards */}
    <div className="hs-section">
      <div className="hs-bone" style={{ width: 220, height: 22, margin: '0 auto' }} />
      <div className="hs-cards">
        {[1, 2, 3].map(i => (
          <div key={i} className="hs-card">
            <div className="hs-bone" style={{ width: '100%', height: 140 }} />
            <div style={{ padding: 16 }}>
              <div className="hs-bone" style={{ width: '60%', height: 16 }} />
              <div className="hs-bone" style={{ width: '90%', height: 12, marginTop: 10 }} />
              <div className="hs-bone" style={{ width: '75%', height: 12, marginTop: 6 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default HomeSkeleton;