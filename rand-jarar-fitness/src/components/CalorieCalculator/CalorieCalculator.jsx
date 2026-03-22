import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaFire,
  FaCalculator,
  FaWeight,
  FaRulerVertical,
  FaBirthdayCake,
  FaRunning,
  FaBullseye,
  FaCheckCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import './CalorieCalculator.scss';

const CalorieCalculator = () => {
  const { currentLang, isArabic } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    weight: '',
    height: '',
    activityLevel: '',
    goal: ''
  });

  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const text = {
    ar: {
      title: 'حاسبة السعرات اليومية',
      subtitle: 'احسب احتياجك اليومي من السعرات الحرارية بطريقة عالمية دقيقة، وابدأ رحلتك الغذائية بشكل صحيح 🤍',
      formTitle: 'أدخل بياناتك',
      resultTitle: 'نتيجتك اليومية',
      gender: 'الجنس',
      male: 'ذكر',
      female: 'أنثى',
      age: 'العمر',
      agePlaceholder: 'أدخل عمرك',
      weight: 'الوزن (كغ)',
      weightPlaceholder: 'أدخل وزنك',
      height: 'الطول (سم)',
      heightPlaceholder: 'أدخل طولك',
      activityLevel: 'مستوى النشاط',
      goal: 'الهدف',
      calculate: 'احسب السعرات',
      caloriesPerDay: 'سعرة حرارية يومياً',
      bmi: 'مؤشر كتلة الجسم',
      maintain: 'للمحافظة على الوزن',
      lose: 'لخسارة الوزن',
      gain: 'لزيادة الوزن',
      subscribe: ' احصل على خطة غذائية مخصصة حسب نتيجتك',
      note: 'هذه النتيجة تقديرية وتعتمد على معادلة Mifflin-St Jeor العالمية.',
      activityOptions: {
        sedentary: 'خامل جداً (بدون نشاط أو نشاط قليل)',
        light: 'نشاط خفيف (1-3 أيام أسبوعياً)',
        moderate: 'نشاط متوسط (3-5 أيام أسبوعياً)',
        active: 'نشاط عالي (6-7 أيام أسبوعياً)',
        veryActive: 'نشاط عالي جداً (تمارين قوية أو عمل بدني)'
      },
      goalOptions: {
        maintain: 'المحافظة على الوزن',
        lose: 'خسارة الوزن',
        gain: 'زيادة الوزن'
      },
      resultLabels: {
        bmr: 'معدل الأيض الأساسي',
        maintenance: 'سعرات الثبات',
        target: 'السعرات المقترحة لهدفك'
      },
      validation: {
        gender: 'يرجى اختيار الجنس',
        age: 'يرجى إدخال عمر صحيح',
        weight: 'يرجى إدخال وزن صحيح',
        height: 'يرجى إدخال طول صحيح',
        activityLevel: 'يرجى اختيار مستوى النشاط',
        goal: 'يرجى اختيار الهدف'
      }
    },
    en: {
      title: 'Daily Calorie Calculator',
      subtitle: 'Calculate your daily calorie needs using a globally trusted method and start your nutrition journey the right way 🤍',
      formTitle: 'Enter Your Details',
      resultTitle: 'Your Daily Result',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      age: 'Age',
      agePlaceholder: 'Enter your age',
      weight: 'Weight (kg)',
      weightPlaceholder: 'Enter your weight',
      height: 'Height (cm)',
      heightPlaceholder: 'Enter your height',
      activityLevel: 'Activity Level',
      goal: 'Goal',
      calculate: 'Calculate Calories',
      caloriesPerDay: 'calories per day',
      bmi: 'BMI',
      maintain: 'To maintain weight',
      lose: 'To lose weight',
      gain: 'To gain weight',
      subscribe: 'Subscribe to a plan and let us help organize your nutrition',
      note: 'This result is an estimate based on the globally trusted Mifflin-St Jeor equation.',
      activityOptions: {
        sedentary: 'Sedentary (little or no exercise)',
        light: 'Lightly active (1-3 days/week)',
        moderate: 'Moderately active (3-5 days/week)',
        active: 'Very active (6-7 days/week)',
        veryActive: 'Extra active (hard exercise or physical job)'
      },
      goalOptions: {
        maintain: 'Maintain weight',
        lose: 'Lose weight',
        gain: 'Gain weight'
      },
      resultLabels: {
        bmr: 'Basal Metabolic Rate',
        maintenance: 'Maintenance Calories',
        target: 'Suggested Calories for Your Goal'
      },
      validation: {
        gender: 'Please select gender',
        age: 'Please enter a valid age',
        weight: 'Please enter a valid weight',
        height: 'Please enter a valid height',
        activityLevel: 'Please select an activity level',
        goal: 'Please select a goal'
      }
    }
  };

  const t = text[currentLang] || text.en;

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.gender) newErrors.gender = t.validation.gender;
    if (!formData.age || Number(formData.age) <= 0) newErrors.age = t.validation.age;
    if (!formData.weight || Number(formData.weight) <= 0) newErrors.weight = t.validation.weight;
    if (!formData.height || Number(formData.height) <= 0) newErrors.height = t.validation.height;
    if (!formData.activityLevel) newErrors.activityLevel = t.validation.activityLevel;
    if (!formData.goal) newErrors.goal = t.validation.goal;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateCalories = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const age = Number(formData.age);
    const weight = Number(formData.weight);
    const height = Number(formData.height);

    let bmr = 0;

    // Mifflin-St Jeor Equation
    if (formData.gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    const maintenanceCalories = bmr * activityMultipliers[formData.activityLevel];

    let targetCalories = maintenanceCalories;

    if (formData.goal === 'lose') {
      targetCalories = maintenanceCalories - 500;
    } else if (formData.goal === 'gain') {
      targetCalories = maintenanceCalories + 300;
    }

    const bmi = weight / Math.pow(height / 100, 2);

    setResult({
      bmr: Math.round(bmr),
      maintenanceCalories: Math.round(maintenanceCalories),
      targetCalories: Math.round(targetCalories),
      bmi: bmi.toFixed(1)
    });
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="calorie-calculator-container" dir={isArabic ? 'rtl' : 'ltr'}>
      <motion.div
        className="calculator-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="hero-icon"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.08, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <FaFire />
        </motion.div>

        <h1 className="calculator-title">{t.title}</h1>
        <p className="calculator-subtitle">{t.subtitle}</p>
      </motion.div>

      <div className="calculator-content">
        <motion.div
          className="calculator-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-header">
            <FaCalculator />
            <h2>{t.formTitle}</h2>
          </div>

          <form onSubmit={calculateCalories} className="calculator-form">
            <div className="form-row two-columns">
              <div className="form-group">
                <label>{t.gender}</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                >
                  <option value="">{isArabic ? 'اختر الجنس' : 'Select gender'}</option>
                  <option value="male">{t.male}</option>
                  <option value="female">{t.female}</option>
                </select>
                {errors.gender && <span className="error-text">{errors.gender}</span>}
              </div>

              <div className="form-group">
                <label>{t.age}</label>
                <div className="input-with-icon">
                  <FaBirthdayCake className="input-icon" />
                  <input
                    type="number"
                    min="1"
                    value={formData.age}
                    placeholder={t.agePlaceholder}
                    onChange={(e) => handleChange('age', e.target.value)}
                  />
                </div>
                {errors.age && <span className="error-text">{errors.age}</span>}
              </div>
            </div>

            <div className="form-row two-columns">
              <div className="form-group">
                <label>{t.weight}</label>
                <div className="input-with-icon">
                  <FaWeight className="input-icon" />
                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    value={formData.weight}
                    placeholder={t.weightPlaceholder}
                    onChange={(e) => handleChange('weight', e.target.value)}
                  />
                </div>
                {errors.weight && <span className="error-text">{errors.weight}</span>}
              </div>

              <div className="form-group">
                <label>{t.height}</label>
                <div className="input-with-icon">
                  <FaRulerVertical className="input-icon" />
                  <input
                    type="number"
                    min="1"
                    value={formData.height}
                    placeholder={t.heightPlaceholder}
                    onChange={(e) => handleChange('height', e.target.value)}
                  />
                </div>
                {errors.height && <span className="error-text">{errors.height}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>{t.activityLevel}</label>
              <div className="input-with-icon">
                <FaRunning className="input-icon" />
                <select
                  value={formData.activityLevel}
                  onChange={(e) => handleChange('activityLevel', e.target.value)}
                >
                  <option value="">{isArabic ? 'اختر مستوى النشاط' : 'Select activity level'}</option>
                  <option value="sedentary">{t.activityOptions.sedentary}</option>
                  <option value="light">{t.activityOptions.light}</option>
                  <option value="moderate">{t.activityOptions.moderate}</option>
                  <option value="active">{t.activityOptions.active}</option>
                  <option value="veryActive">{t.activityOptions.veryActive}</option>
                </select>
              </div>
              {errors.activityLevel && <span className="error-text">{errors.activityLevel}</span>}
            </div>

            <div className="form-group">
              <label>{t.goal}</label>
              <div className="goal-options">
                {['maintain', 'lose', 'gain'].map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    className={`goal-option ${formData.goal === goal ? 'active' : ''}`}
                    onClick={() => handleChange('goal', goal)}
                  >
                    <FaBullseye />
                    <span>{t.goalOptions[goal]}</span>
                  </button>
                ))}
              </div>
              {errors.goal && <span className="error-text">{errors.goal}</span>}
            </div>

            <motion.button
              type="submit"
              className="calculate-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaCalculator />
              {t.calculate}
            </motion.button>
          </form>
        </motion.div>

        {result && (
          <motion.div
            className="result-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card-header">
              <FaCheckCircle />
              <h2>{t.resultTitle}</h2>
            </div>

            <div className="main-result">
              <div className="main-result-number">{result.targetCalories}</div>
              <div className="main-result-label">{t.caloriesPerDay}</div>
            </div>

            <div className="result-grid">
              <div className="result-item">
                <span className="result-item-label">{t.resultLabels.bmr}</span>
                <strong>{result.bmr}</strong>
              </div>

              <div className="result-item">
                <span className="result-item-label">{t.resultLabels.maintenance}</span>
                <strong>{result.maintenanceCalories}</strong>
              </div>

              <div className="result-item">
                <span className="result-item-label">{t.resultLabels.target}</span>
                <strong>{result.targetCalories}</strong>
              </div>

              <div className="result-item">
                <span className="result-item-label">{t.bmi}</span>
                <strong>{result.bmi}</strong>
              </div>
            </div>

            <p className="result-note">{t.note}</p>

            <motion.button
              className="subscribe-plan-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/plans')}
            >
              {t.subscribe}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CalorieCalculator;