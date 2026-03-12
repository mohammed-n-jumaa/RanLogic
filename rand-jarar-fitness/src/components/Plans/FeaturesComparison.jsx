import { motion } from 'framer-motion';
import { FaCheck, FaTimes } from 'react-icons/fa';

const FeaturesComparison = ({ plans }) => {
  // ✅ Updated to match getDefaultPlans() content exactly
  const allFeatures = [
    {
      name: 'Customized workout plan (Gym or Home)',
      basic: true,
      elite: true,
      vip: true,
      nutrition: false
    },
    {
      name: 'Calculated nutrition plan (Macros/Calories)',
      basic: true,
      elite: true,
      vip: true,
      nutrition: true
    },
    {
      name: 'Monthly plan updates',
      basic: true,
      elite: true, // Elite includes everything in Basic
      vip: true, // VIP includes everything in Elite
      nutrition: false
    },
    {
      name: 'Monthly nutrition updates',
      basic: false,
      elite: true,
      vip: true,
      nutrition: true
    },
    {
      name: 'Food exchange list (to prevent boredom)',
      basic: false,
      elite: true,
      vip: true,
      nutrition: true
    },
    {
      name: 'Clear roadmap / structured plan',
      basic: true,
      elite: true,
      vip: true,
      nutrition: false
    },
    {
      name: 'Guaranteed results (with commitment & follow-up)',
      basic: false,
      elite: true,
      vip: true,
      nutrition: false
    },
    {
      name: 'Regular adjustments for optimal progress',
      basic: false,
      elite: true,
      vip: true,
      nutrition: false
    },
    {
      name: 'Progress follow-up frequency',
      basic: 'No follow-up (Self-managed)',
      elite: 'Weekly follow-up',
      vip: 'Daily support',
      nutrition: 'No follow-up (Self-managed)'
    },
    {
      name: 'Chat support for questions',
      basic: true,
      elite: true,
      vip: true,
      nutrition: true
    },
    {
      name: 'Supplements guidance',
      basic: false,
      elite: true,
      vip: true,
      nutrition: false
    },
    {
      name: 'Priority communication',
      basic: false,
      elite: false,
      vip: true,
      nutrition: false
    },
    {
      name: 'Monthly 1-on-1 consulting session',
      basic: false,
      elite: false,
      vip: true,
      nutrition: false
    }
  ];

  const renderCell = (value) => {
    if (value === true) return <FaCheck className="check-icon" />;
    if (value === false) return <FaTimes className="times-icon" />;
    return <span className="feature-value">{value}</span>;
  };

  return (
    <section className="comparison-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Compare Training Plans</h2>
          <p>Each plan is designed to suit a different level of commitment and goal</p>
        </motion.div>

        <motion.div
          className="comparison-table"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th className="feature-column">Feature</th>

                  {/* ✅ ترتيب من الأقل للأعلى مثل الصورة */}
                  <th className="plan-column basic">Basic Plan</th>
                  <th className="plan-column nutrition">Nutrition Plan</th>
                  <th className="plan-column elite">Elite Plan</th>
                  <th className="plan-column vip">VIP Plan</th>
                </tr>
              </thead>

              <tbody>
                {allFeatures.map((feature, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="feature-name">{feature.name}</td>

                    <td className="basic">{renderCell(feature.basic)}</td>
                    <td className="nutrition">{renderCell(feature.nutrition)}</td>
                    <td className="elite">{renderCell(feature.elite)}</td>
                    <td className="vip">{renderCell(feature.vip)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesComparison;