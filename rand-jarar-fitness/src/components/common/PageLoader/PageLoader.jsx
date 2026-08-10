import './PageLoader.scss';

const PageLoader = () => {
  return (
    <div className="page-loader">
      <div className="page-loader__bar">
        <div className="page-loader__progress" />
      </div>

      <div className="page-loader__content">
        <div className="page-loader__icon">
          <svg width="40" height="40" viewBox="0 0 50 50">
            <circle
              cx="25" cy="25" r="20"
              fill="none"
              stroke="#FDB813"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="80 40"
              className="page-loader__spinner"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;