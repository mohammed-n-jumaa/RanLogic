import PaymentStatusCard from './PaymentStatusCard';
import SubscriptionTimeline from './SubscriptionTimeline';
import RenewalCard from './RenewalCard';
import PaymentHistory from './PaymentHistory';

const PaymentGrid = ({ userData }) => {
  return (
    <div className="payment-grid">
      <PaymentStatusCard userData={userData} delay={0.1} />
      <SubscriptionTimeline userData={userData} delay={0.2} />
      <RenewalCard userData={userData} delay={0.3} />
      <PaymentHistory userData={userData} delay={0.4} />
    </div>
  );
};

export default PaymentGrid;