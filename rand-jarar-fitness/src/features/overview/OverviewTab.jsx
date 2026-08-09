import { motion } from 'framer-motion';
import StatsCard from "./StatsCard";
import SubscriptionCard from "./SubscriptionCard";
import TodayCard from "./TodayCard";
import AchievementsCard from "./AchievementsCard";

const OverviewTab = ({ userData }) => {
  return (
    <div className="overview-tab">
      <div className="overview-grid">
        <StatsCard userData={userData} delay={0.1} />
        <SubscriptionCard userData={userData} delay={0.2} />
        <TodayCard delay={0.3} />
        <AchievementsCard delay={0.4} />
      </div>
    </div>
  );
};

export default OverviewTab;