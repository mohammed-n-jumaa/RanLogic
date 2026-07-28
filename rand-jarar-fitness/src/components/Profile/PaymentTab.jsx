import PaymentGrid from './payment/PaymentGrid';

const PaymentTab = ({ userData }) => {
  return (
    <div className="payment-tab">
      <PaymentGrid userData={userData} />
    </div>
  );
};

export default PaymentTab;