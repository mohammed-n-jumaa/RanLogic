import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Crown, Calendar, Tag, Flame } from 'lucide-react';
const PlanCard = ({ plan, onSelect, delay, currency }) => {
  const { id, name, subtitle, pricing, popular, badge, features, color, icon } = plan;
  const [selectedDuration, setSelectedDuration] = useState('1month');

  const selectedPricing = pricing[selectedDuration];
  const hasDiscount = selectedPricing.discount > 0;
  const sym = currency?.symbol || '$';
  const code = currency?.code || 'USD';

  return (
    <motion.div
      className={`plan-card ${popular ? 'popular' : ''} ${color}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {popular && badge && (
        <motion.div
          className="popular-badge"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: delay + 0.3, type: 'spring', stiffness: 200 }}
        >
          <Crown fill="currentColor" /> {badge}
        </motion.div>
      )}

      {hasDiscount && (
        <motion.div
          className="discount-badge"
          initial={{ scale: 0, rotate: 12 }}
          animate={{ scale: 1, rotate: -12 }}
          transition={{ delay: delay + 0.5, type: 'spring', stiffness: 150 }}
        >
          <Flame fill="currentColor" />
          <span>{selectedPricing.discount}% OFF</span>
        </motion.div>
      )}

      <div className="plan-header">
        <motion.div
          className="plan-icon"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {icon}
        </motion.div>
        <h3 className="plan-name">{name}</h3>
        <p className="plan-subtitle">{subtitle}</p>
      </div>

      {/* Duration Selector */}
      <div className="duration-selector">
        <motion.button
          className={`duration-btn ${selectedDuration === '1month' ? 'active' : ''}`}
          onClick={() => setSelectedDuration('1month')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Calendar />
          <span>1 Month</span>
        </motion.button>

        <motion.button
          className={`duration-btn ${selectedDuration === '3months' ? 'active' : ''}`}
          onClick={() => setSelectedDuration('3months')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Calendar />
          <span>3 Months</span>
          {pricing['3months'].discount > 0 && (
            <span className="mini-badge">-{pricing['3months'].discount}%</span>
          )}
        </motion.button>

        <motion.button
          className={`duration-btn ${selectedDuration === '6months' ? 'active' : ''}`}
          onClick={() => setSelectedDuration('6months')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Calendar />
          <span>6 Months</span>
          {pricing['6months'].discount > 0 && (
            <span className="mini-badge hot">-{pricing['6months'].discount}%</span>
          )}
        </motion.button>
      </div>

      {/* Pricing Display with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDuration}
          className="plan-pricing"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {hasDiscount && (
            <motion.div
              className="original-price-wrapper"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Tag fill="currentColor" className="tag-icon" />
              <span className="original-price">{sym}{selectedPricing.originalPrice}</span>
            </motion.div>
          )}

          <div className="price-wrapper">
            <span className="currency">{sym}</span>
            <span className="price">{selectedPricing.price}</span>
            <span className="currency-code" style={{ fontSize: '0.75rem', opacity: 0.7, marginLeft: '4px' }}>{code}</span>
          </div>

          <span className="duration">
            {selectedDuration === '1month' ? '/ Month' :
              selectedDuration === '3months' ? '/ 3 Months' :
                '/ 6 Months'}
          </span>

          {hasDiscount && (
            <motion.div
              className="savings-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              Save {sym}{selectedPricing.originalPrice - selectedPricing.price}

            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="plan-features">
        <ul>
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + (index * 0.05) }}
            >
              <Check className="check-icon" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.button
        className="plan-button"
        onClick={() => onSelect(plan, selectedDuration)}
        whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
        whileTap={{ scale: 0.98 }}
      >
        <span>Choose Plan</span>
        <motion.span
          className="arrow"
          initial={{ x: 0 }}
          whileHover={{ x: 5 }}
        >
          →
        </motion.span>
      </motion.button>
    </motion.div>
  );
};

export default PlanCard;