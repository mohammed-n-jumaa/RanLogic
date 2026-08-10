import React, {
  useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import foodDatabase from '../../data/foodDatabase.json';
import './MealCalculator.scss';
import { UtensilsCrossed, Search, Plus, Trash2, Flame, Drumstick, Sandwich, Droplets, Leaf, CheckCircle, ChevronDown, X, AlertCircle, Loader2 } from 'lucide-react';

/* ================================================================
   CONSTANTS
   ================================================================ */
const ACTIVITY_MULTIPLIERS = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725, veryActive:1.9 };
const DROPDOWN_MAX_H = 360;

/* ================================================================
   searchLocal — pure function, no side effects
   ================================================================ */
function searchLocal(query) {
  if (!query || query.trim().length < 1) return foodDatabase.foods;
  const q = query.trim().toLowerCase();
  return foodDatabase.foods.filter(
    f => f.name_ar.includes(query) || f.name_en.toLowerCase().includes(q)
  );
}

/* ================================================================
   groupByCategory
   ================================================================ */
function groupByCategory(items) {
  return items.reduce((acc, item) => {
    const cat = item.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});
}

/* ================================================================
   useDropdownPosition — calculates fixed position for portal
   ================================================================ */
function useDropdownPosition(anchorRef, isOpen) {
  const [pos, setPos] = useState(null);

  const calc = useCallback(() => {
    if (!anchorRef.current) return;
    const r          = anchorRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const goUp       = spaceBelow < DROPDOWN_MAX_H && r.top > spaceBelow;

    setPos({
      left  : r.left,
      width : r.width,
      goUp,
      top   : goUp ? undefined   : r.bottom,
      bottom: goUp ? window.innerHeight - r.top : undefined,
    });
  }, [anchorRef]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    calc();
    window.addEventListener('resize',  calc);
    window.addEventListener('scroll',  calc, true);
    return () => {
      window.removeEventListener('resize',  calc);
      window.removeEventListener('scroll',  calc, true);
    };
  }, [isOpen, calc]);

  return { pos, calc };
}

/* ================================================================
   useFoodSearch — handles local + API search with debounce
   ================================================================ */
function useFoodSearch(query) {
  const [apiItems,  setApiItems]  = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [apiError,  setApiError]  = useState('');

  const localItems = useMemo(() => searchLocal(query), [query]);

  useEffect(() => {
    setApiError('');
    if (!query || query.trim().length < 2 || localItems.length >= 4) {
      setApiItems([]);
      return;
    }

    setLoading(true);
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const url  = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&fields=product_name,product_name_ar,nutriments&page_size=8`;
        const res  = await fetch(url, { signal: controller.signal });
        const data = await res.json();

        const parsed = (data.products || [])
          .filter(p => p.product_name && p.nutriments?.['energy-kcal_100g'])
          .map((p, i) => ({
            id      : `api_${i}_${Date.now()}`,
            name_ar : p.product_name_ar || p.product_name,
            name_en : p.product_name,
            category: 'api',
            source  : 'api',
            calories: Math.round(p.nutriments['energy-kcal_100g']   ?? 0),
            protein : +((p.nutriments['proteins_100g']      ?? 0).toFixed(1)),
            carbs   : +((p.nutriments['carbohydrates_100g'] ?? 0).toFixed(1)),
            fat     : +((p.nutriments['fat_100g']           ?? 0).toFixed(1)),
            fiber   : +((p.nutriments['fiber_100g']         ?? 0).toFixed(1)),
          }));

        // merge — avoid duplicates by english name
        const localNames = new Set(localItems.map(i => i.name_en.toLowerCase()));
        const fresh = parsed.filter(p => !localNames.has(p.name_en.toLowerCase()));

        setApiItems(fresh);
        if (parsed.length === 0 && localItems.length === 0) setApiError('noResults');
      } catch (e) {
        if (e.name !== 'AbortError') setApiError('apiError');
      } finally {
        setLoading(false);
      }
    }, 450);

    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, localItems.length]);

  const allItems = useMemo(() => [
    ...localItems.map(f => ({ ...f, source: 'local' })),
    ...apiItems,
  ], [localItems, apiItems]);

  const grouped = useMemo(() => groupByCategory(allItems), [allItems]);

  return { grouped, loading, apiError, totalCount: allItems.length };
}

/* ================================================================
   FoodSelect — the searchable dropdown
   ================================================================ */
function FoodSelect({ value, onChange, placeholder, isArabic, categoryLabels, errorMsg }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query,  setQuery]  = useState('');

  const anchorRef  = useRef(null);
  const searchRef  = useRef(null);
  const dropdownId = useRef(`fs-${Math.random().toString(36).slice(2)}`);

  const { pos, calc }                        = useDropdownPosition(anchorRef, isOpen);
  const { grouped, loading, apiError, totalCount } = useFoodSearch(query);

  /* open / close */
  const close = useCallback(() => { setIsOpen(false); setQuery(''); }, []);

  /* outside click */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      const anchor   = anchorRef.current;
      const dropdown = document.getElementById(dropdownId.current);
      if (
        anchor && !anchor.contains(e.target) &&
        dropdown && !dropdown.contains(e.target)
      ) close();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, close]);

  /* focus search input when opens */
  useEffect(() => {
    if (isOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [isOpen]);

  const select = useCallback((food) => {
    onChange(food);
    close();
  }, [onChange, close]);

  const clear = useCallback((e) => {
    e.stopPropagation();
    onChange(null);
    setQuery('');
  }, [onChange]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      calc();          // sync calc before state update
      setIsOpen(true);
    }
  }, [isOpen, close, calc]);

  const displayName = value ? (isArabic ? value.name_ar : value.name_en) : '';

  /* ── dropdown markup — rendered via Portal ── */
  const dropdownEl = pos ? (
    <motion.div
      id={dropdownId.current}
      className={`fs-dropdown ${pos.goUp ? 'fs-dropdown--up' : 'fs-dropdown--down'}`}
      style={{
        position       : 'fixed',
        left           : pos.left,
        width          : pos.width,
        transformOrigin: pos.goUp ? 'bottom center' : 'top center',
        ...(pos.goUp
          ? { bottom: pos.bottom, top: 'auto' }
          : { top: pos.top,       bottom: 'auto' }
        ),
      }}
      initial={{ opacity: 0, scaleY: 0.96 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{   opacity: 0, scaleY: 0.96 }}
      transition={{ duration: 0.13, ease: 'easeOut' }}
    >
      {/* search bar */}
      <div className="fs-search">
        <Search className="fs-search__icon" aria-hidden />
        <input
          ref={searchRef}
          type="text"
          className="fs-search__input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={isArabic ? 'ابحث...' : 'Search...'}
        />
        {loading && <Loader2 className="fs-search__spinner" aria-hidden />}
        {query && !loading && (
          <button className="fs-search__clear" onMouseDown={() => setQuery('')} type="button" aria-label="clear search">
            <X />
          </button>
        )}
      </div>

      {/* result count */}
      {query && (
        <p className="fs-count">
          {totalCount} {isArabic ? 'نتيجة' : 'results'}
        </p>
      )}

      {/* error */}
      {apiError && totalCount === 0 && (
        <div className="fs-empty">
          <AlertCircle />
          <span>{isArabic ? 'لا توجد نتائج' : 'No results found'}</span>
        </div>
      )}

      {/* options list */}
      <div className="fs-list" role="listbox">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="fs-group" role="group" aria-label={categoryLabels[cat] || cat}>
            <div className="fs-group__label" aria-hidden>
              <span>{categoryLabels[cat] || cat}</span>
              <span className="fs-group__count">{items.length}</span>
            </div>
            {items.map(food => {
              const isSelected = value?.id === food.id;
              const primary    = isArabic ? food.name_ar : food.name_en;
              const secondary  = isArabic ? food.name_en : food.name_ar;
              return (
                <div
                  key={food.id}
                  className={`fs-option ${isSelected ? 'fs-option--selected' : ''}`}
                  onMouseDown={() => select(food)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="fs-option__text">
                    <span className="fs-option__primary">{primary}</span>
                    <span className="fs-option__secondary">{secondary}</span>
                  </div>
                  <div className="fs-option__meta">
                    <span className="fs-option__cal">{food.calories} kcal</span>
                    {food.source === 'api' && <span className="fs-badge">API</span>}
                    {isSelected && <CheckCircle className="fs-option__check" />}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  ) : null;

  return (
    <>
      {/* anchor / trigger */}
      <div
        ref={anchorRef}
        className={[
          'fs-trigger',
          isOpen     ? 'fs-trigger--open'     : '',
          pos?.goUp  ? 'fs-trigger--upward'   : '',
          value      ? 'fs-trigger--has-value' : '',
          errorMsg   ? 'fs-trigger--error'     : '',
        ].filter(Boolean).join(' ')}
        onClick={toggle}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
      >
        <Search className="fs-trigger__icon" aria-hidden />
        <span className={`fs-trigger__text ${!value ? 'fs-trigger__text--placeholder' : ''}`}>
          {value ? displayName : placeholder}
        </span>
        <div className="fs-trigger__end">
          {value && (
            <button
              className="fs-trigger__clear"
              onMouseDown={clear}
              type="button"
              aria-label={isArabic ? 'مسح' : 'Clear'}
              onClick={e => e.stopPropagation()}
            >
              <X />
            </button>
          )}
          <ChevronDown className={`fs-trigger__chevron ${isOpen ? 'fs-trigger__chevron--open' : ''}`} aria-hidden />
        </div>
      </div>

      {/* portal */}
      {isOpen && pos && createPortal(
        <AnimatePresence>
          {dropdownEl}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

/* ================================================================
   MealCalculator — main page
   ================================================================ */
const TEXTS = {
  ar: {
    title          : 'حاسبة سعرات الوجبة',
    subtitle       : 'أضف أصناف وجبتك واحسب سعراتها الحرارية والقيم الغذائية بدقة 🍽️',
    selectLabel    : 'اختر صنفاً',
    selectPH       : 'مثال: أرز، دجاج، تفاح...',
    weightLabel    : 'الوزن (غرام)',
    weightPH       : 'أدخل الوزن',
    addBtn         : 'أضف للوجبة',
    mealTitle      : 'أصناف الوجبة',
    totalTitle     : 'إجمالي الوجبة',
    emptyTitle     : 'لم تضف أي صنف بعد',
    emptySub       : 'اختر صنفاً وأضفه لوجبتك',
    per100g        : 'لكل 100غ',
    caloriesUnit   : 'سعرة حرارية',
    gram           : 'غ',
    subscribe      : 'احصل على خطة غذائية مخصصة',
    note           : 'القيم الغذائية تقديرية لكل 100 غرام من الصنف.',
    labels: { protein:'بروتين', carbs:'كارب', fat:'دهون', fiber:'ألياف' },
    err: { food:'يرجى اختيار صنف', weight:'يرجى إدخال وزن صحيح' },
    cats: {
      poultry:'دواجن', meat:'لحوم', seafood:'مأكولات بحرية',
      grains:'حبوب وخبز', eggs_dairy:'بيض وألبان', fruits:'فواكه',
      vegetables:'خضروات', legumes:'بقوليات', nuts_seeds:'مكسرات وبذور',
      oils_fats:'زيوت ودهون', sauces:'صلصات', supplements:'مكملات',
      sweeteners:'محليات', sweets:'حلويات', snacks:'سناكس',
      fast_food:'وجبات سريعة', arabic_food:'أكل عربي',
      international:'عالمي', salads:'سلطات', beverages:'مشروبات',
      spices:'بهارات', api:'نتائج البحث',
    },
  },
  en: {
    title          : 'Meal Calorie Calculator',
    subtitle       : 'Add your meal items and calculate their calories and nutritional values precisely 🍽️',
    selectLabel    : 'Select a food item',
    selectPH       : 'e.g. Rice, Chicken, Apple...',
    weightLabel    : 'Weight (grams)',
    weightPH       : 'Enter weight in grams',
    addBtn         : 'Add to Meal',
    mealTitle      : 'Meal Items',
    totalTitle     : 'Meal Total',
    emptyTitle     : 'No items added yet',
    emptySub       : 'Select a food item and add it to your meal',
    per100g        : 'per 100g',
    caloriesUnit   : 'calories',
    gram           : 'g',
    subscribe      : 'Get a personalized nutrition plan',
    note           : 'Nutritional values are approximate per 100 grams.',
    labels: { protein:'Protein', carbs:'Carbs', fat:'Fat', fiber:'Fiber' },
    err: { food:'Please select a food item', weight:'Please enter a valid weight' },
    cats: {
      poultry:'Poultry', meat:'Meat', seafood:'Seafood',
      grains:'Grains & Bread', eggs_dairy:'Eggs & Dairy', fruits:'Fruits',
      vegetables:'Vegetables', legumes:'Legumes', nuts_seeds:'Nuts & Seeds',
      oils_fats:'Oils & Fats', sauces:'Sauces', supplements:'Supplements',
      sweeteners:'Sweeteners', sweets:'Sweets', snacks:'Snacks',
      fast_food:'Fast Food', arabic_food:'Arabic Food',
      international:'International', salads:'Salads', beverages:'Beverages',
      spices:'Spices', api:'Search Results',
    },
  },
};

function calcNutrients(food, weight) {
  const r = weight / 100;
  return {
    calories: Math.round(food.calories * r),
    protein : +((food.protein * r).toFixed(1)),
    carbs   : +((food.carbs   * r).toFixed(1)),
    fat     : +((food.fat     * r).toFixed(1)),
    fiber   : +((food.fiber   * r).toFixed(1)),
  };
}

function sumNutrients(items) {
  return items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.nutrients.calories,
      protein : +((acc.protein + item.nutrients.protein).toFixed(1)),
      carbs   : +((acc.carbs   + item.nutrients.carbs).toFixed(1)),
      fat     : +((acc.fat     + item.nutrients.fat).toFixed(1)),
      fiber   : +((acc.fiber   + item.nutrients.fiber).toFixed(1)),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
}

const MACRO_CONFIG = [
  { key: 'protein', icon: Drumstick, color: '#e74c3c' },
  { key: 'carbs',   icon: Sandwich,    color: '#f39c12' },
  { key: 'fat',     icon: Droplets,           color: '#3498db' },
  { key: 'fiber',   icon: Leaf,           color: '#27ae60' },
];

export default function MealCalculator() {
  const { currentLang, isArabic } = useLanguage();
  const navigate = useNavigate();
  const t = TEXTS[currentLang] ?? TEXTS.en;

  const [selectedFood, setSelectedFood] = useState(null);
  const [weight,       setWeight]       = useState('');
  const [mealItems,    setMealItems]    = useState([]);
  const [errors,       setErrors]       = useState({});

  const addItem = () => {
    const errs = {};
    if (!selectedFood)                    errs.food   = t.err.food;
    if (!weight || Number(weight) <= 0)   errs.weight = t.err.weight;
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setMealItems(prev => [...prev, {
      id      : Date.now(),
      food    : selectedFood,
      weight  : Number(weight),
      nutrients: calcNutrients(selectedFood, Number(weight)),
    }]);
    setSelectedFood(null);
    setWeight('');
    setErrors({});
  };

  const removeItem = useCallback(id => {
    setMealItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const totals = useMemo(() => sumNutrients(mealItems), [mealItems]);

  return (
    <div className="mc" dir={isArabic ? 'rtl' : 'ltr'}>

      {/* ── Hero ── */}
      <motion.header
        className="mc__hero"
        initial={{ opacity:0, y:30 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.7 }}
      >
        <motion.div
          className="mc__hero-icon"
          animate={{ rotate:[0,8,-8,0], scale:[1,1.07,1] }}
          transition={{ duration:3, repeat:Infinity }}
          aria-hidden
        >
          <UtensilsCrossed />
        </motion.div>
        <h1 className="mc__title">{t.title}</h1>
        <p  className="mc__subtitle">{t.subtitle}</p>
      </motion.header>

      <div className="mc__body">

        {/* ── Input card ── */}
        <motion.section
          className="mc__card"
          initial={{ opacity:0, y:24 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.15 }}
          aria-label={t.selectLabel}
        >
          <div className="mc__card-head">
            <Search aria-hidden />
            <h2>{t.selectLabel}</h2>
          </div>

          {/* Food select */}
          <div className="mc__field">
            <FoodSelect
              value={selectedFood}
              onChange={food => { setSelectedFood(food); setErrors(p => ({ ...p, food:'' })); }}
              placeholder={t.selectPH}
              isArabic={isArabic}
              categoryLabels={t.cats}
              errorMsg={errors.food}
            />
            {errors.food && <span className="mc__error" role="alert">{errors.food}</span>}
          </div>

          {/* Selected preview */}
          <AnimatePresence>
            {selectedFood && (
              <motion.div
                className="mc__preview"
                initial={{ opacity:0, y:-6 }}
                animate={{ opacity:1, y:0 }}
                exit={{   opacity:0, y:-6 }}
              >
                <CheckCircle className="mc__preview-icon" aria-hidden />
                <div>
                  <strong>{isArabic ? selectedFood.name_ar : selectedFood.name_en}</strong>
                  <span>
                    {t.per100g}: {selectedFood.calories} kcal ·
                    {selectedFood.protein}g P · {selectedFood.carbs}g C · {selectedFood.fat}g F
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Weight + Add */}
          <div className="mc__field">
            <label className="mc__label" htmlFor="mc-weight">{t.weightLabel}</label>
            <div className="mc__row">
              <input
                id="mc-weight"
                type="number"
                min="1"
                className={`mc__input ${errors.weight ? 'mc__input--error' : ''}`}
                value={weight}
                placeholder={t.weightPH}
                onChange={e => { setWeight(e.target.value); setErrors(p => ({ ...p, weight:'' })); }}
                onKeyDown={e => e.key === 'Enter' && addItem()}
              />
              <motion.button
                className="mc__add-btn"
                onClick={addItem}
                whileHover={{ scale:1.03 }}
                whileTap={{  scale:0.97 }}
                type="button"
              >
                <Plus aria-hidden />
                {t.addBtn}
              </motion.button>
            </div>
            {errors.weight && <span className="mc__error" role="alert">{errors.weight}</span>}
          </div>

          <p className="mc__note">{t.note}</p>
        </motion.section>

        {/* ── Meal items card ── */}
        <motion.section
          className="mc__card"
          initial={{ opacity:0, y:24 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.25 }}
          aria-label={t.mealTitle}
        >
          <div className="mc__card-head">
            <UtensilsCrossed aria-hidden />
            <h2>{t.mealTitle}</h2>
            {mealItems.length > 0 && (
              <span className="mc__badge" aria-label={`${mealItems.length} items`}>
                {mealItems.length}
              </span>
            )}
          </div>

          {mealItems.length === 0 ? (
            <div className="mc__empty">
              <span className="mc__empty-icon" aria-hidden>🍽️</span>
              <p className="mc__empty-title">{t.emptyTitle}</p>
              <p className="mc__empty-sub">{t.emptySub}</p>
            </div>
          ) : (
            <ul className="mc__list" role="list">
              <AnimatePresence initial={false}>
                {mealItems.map(item => (
                  <motion.li
                    key={item.id}
                    className="mc__item"
                    initial={{ opacity:0, x: isArabic ? 16 : -16 }}
                    animate={{ opacity:1, x:0 }}
                    exit={{   opacity:0, height:0, marginBottom:0, paddingTop:0, paddingBottom:0 }}
                    transition={{ duration:0.2 }}
                    layout
                  >
                    <div className="mc__item-top">
                      <div className="mc__item-info">
                        <span className="mc__item-name">
                          {isArabic ? item.food.name_ar : item.food.name_en}
                        </span>
                        <span className="mc__item-weight">{item.weight}{t.gram}</span>
                      </div>
                      <div className="mc__item-actions">
                        <span className="mc__item-cal">
                          <Flame fill="currentColor" aria-hidden />{item.nutrients.calories}
                        </span>
                        <button
                          className="mc__remove"
                          onClick={() => removeItem(item.id)}
                          aria-label={isArabic ? 'حذف' : 'Remove item'}
                          type="button"
                        >
                          <Trash2 aria-hidden />
                        </button>
                      </div>
                    </div>
                    <div className="mc__macros">
                      <span className="mc__macro mc__macro--p">P {item.nutrients.protein}{t.gram}</span>
                      <span className="mc__macro mc__macro--c">C {item.nutrients.carbs}{t.gram}</span>
                      <span className="mc__macro mc__macro--f">F {item.nutrients.fat}{t.gram}</span>
                      <span className="mc__macro mc__macro--fi">Fi {item.nutrients.fiber}{t.gram}</span>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </motion.section>

        {/* ── Totals card ── */}
        <AnimatePresence>
          {mealItems.length > 0 && (
            <motion.section
              className="mc__card mc__card--totals"
              initial={{ opacity:0, y:24 }}
              animate={{ opacity:1, y:0 }}
              exit={{   opacity:0, y:16 }}
              aria-label={t.totalTitle}
            >
              <div className="mc__card-head">
                <CheckCircle aria-hidden />
                <h2>{t.totalTitle}</h2>
              </div>

              <div className="mc__total-cal">
                <span className="mc__total-num">{totals.calories}</span>
                <span className="mc__total-unit">{t.caloriesUnit}</span>
              </div>

              <div className="mc__macro-grid">
                {MACRO_CONFIG.map(({ key, icon: Icon, color }) => (
                  <div key={key} className="mc__macro-tile" style={{ '--mc': color }}>
                    <Icon className="mc__macro-tile-icon" aria-hidden />
                    <span className="mc__macro-tile-val">
                      {totals[key]}<em>{t.gram}</em>
                    </span>
                    <span className="mc__macro-tile-lbl">{t.labels[key]}</span>
                  </div>
                ))}
              </div>

              <motion.button
                className="mc__cta"
                onClick={() => navigate('/plans')}
                whileHover={{ scale:1.02 }}
                whileTap={{  scale:0.98 }}
                type="button"
              >
                {t.subscribe}
              </motion.button>
            </motion.section>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}