import { STORAGE_URL, normalizeDate } from '../profile/shell/profileShared';

export const MEAL_TYPES = {
  breakfast: { ar: 'فطور', en: 'Breakfast', emoji: '🥣' },
  snack1:    { ar: 'وجبة خفيفة 1', en: 'Snack 1', emoji: '🍎' },
  lunch:     { ar: 'غداء', en: 'Lunch', emoji: '🍗' },
  snack2:    { ar: 'وجبة خفيفة 2', en: 'Snack 2', emoji: '🥜' },
  dinner:    { ar: 'عشاء', en: 'Dinner', emoji: '🥗' },
};

export const mealTypeOf = type => MEAL_TYPES[type] || { ar: type, en: type, emoji: '🍽️' };

export const mealsOnDate = (meals = [], dateKey) =>
  meals.filter(m => normalizeDate(m.meal_date) === dateKey);

const sum = (items, key) => items.reduce((total, item) => total + (parseFloat(item[key]) || 0), 0);

export const mealTotals = meal => ({
  kcal: Math.round(sum(meal.items || [], 'calories')),
  p: Math.round(sum(meal.items || [], 'protein')),
  c: Math.round(sum(meal.items || [], 'carbs')),
  f: Math.round(sum(meal.items || [], 'fats')),
});

export const isMealDone = meal => (meal.items?.length ?? 0) > 0 && meal.items.every(i => i.completed);

/** Planned vs eaten (completed items) for a list of meals */
export const dayTotals = (meals) => {
  const items = meals.flatMap(m => m.items || []);
  const eaten = items.filter(i => i.completed);
  return {
    goal: { kcal: Math.round(sum(items, 'calories')), p: Math.round(sum(items, 'protein')), c: Math.round(sum(items, 'carbs')), f: Math.round(sum(items, 'fats')) },
    eaten: { kcal: Math.round(sum(eaten, 'calories')), p: Math.round(sum(eaten, 'protein')), c: Math.round(sum(eaten, 'carbs')), f: Math.round(sum(eaten, 'fats')) },
    mealsDone: meals.filter(isMealDone).length,
  };
};

export const pdfUrlOf = plan => (plan?.pdf_file ? `${STORAGE_URL}/${plan.pdf_file}` : null);
export const mealImageUrl = meal => (meal.meal_image ? `${STORAGE_URL}/${meal.meal_image}` : null);
