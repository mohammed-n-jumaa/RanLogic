-- ════════════════════════════════════════════════════════════════════
-- Mock data for the trainee profile (local testing only)
-- Builds the CURRENT month for one user: workout plan (incl. "راحة" rows),
-- nutrition plan with meals + items, weight history and today's water.
-- Re-runnable: it first removes this month's plans for the same user.
-- ════════════════════════════════════════════════════════════════════

SET @uid = 59;                                             -- ← trainee id (59 = Mohammed)
SET @month_start = DATE_FORMAT(CURDATE(), '%Y-%m-01');
SET @month_end   = LAST_DAY(CURDATE());
SET @now = NOW();
-- optional: existing PDF so the "PDF" button shows next to the meals (set NULL to hide it)
SET @nutrition_pdf = 'nutrition_pdfs/nutrition-plan-30-days.pdf';

START TRANSACTION;

-- ─── 0) Clean this month's plans for this user (children cascade) ───
DELETE FROM workout_plans   WHERE user_id = @uid AND month_start_date = @month_start;
DELETE FROM nutrition_plans WHERE user_id = @uid AND month_start_date = @month_start;

-- ════════════════════════ 1) WORKOUT ════════════════════════
INSERT INTO workout_plans (user_id, month_start_date, month_end_date, created_by, updated_by, created_at, updated_at)
VALUES (@uid, @month_start, @month_end, 1, 1, @now, @now);
SET @wp = LAST_INSERT_ID();

-- Weekly template by DAYOFWEEK (1=Sun … 7=Sat).
-- Tue / Fri / Sat are rest days: a normal row named "راحة" (exactly like the Excel import).
-- Today is always a workout day (uses the Monday template) so you can see the "today" state.
-- The last 2 days of the month get no rows → shows the "not added yet" state.
INSERT INTO workout_exercises
  (workout_plan_id, exercise_date, name, sets, reps, notes, youtube_url, completed, completed_at, `order`, created_at, updated_at)
WITH RECURSIVE days AS (
  SELECT DATE(@month_start) AS d
  UNION ALL SELECT d + INTERVAL 1 DAY FROM days WHERE d < DATE(@month_end) - INTERVAL 2 DAY
),
tpl (dow, ord, name, sets, reps, notes, yt) AS (
            SELECT 1, 1, 'ضغط بالدمبل',       4, 12, NULL, 'https://www.youtube.com/watch?v=VmB1G1K7v94'
  UNION ALL SELECT 1, 2, 'سحب أمامي',          4, 12, NULL, NULL
  UNION ALL SELECT 1, 3, 'رفرفة جانبية',       3, 15, 'وزن خفيف وحركة بطيئة', NULL
  UNION ALL SELECT 1, 4, 'تراي بالحبل',        3, 12, NULL, NULL
  UNION ALL SELECT 2, 1, 'سكوات',              4, 10, 'انزل لتحت الموازي', 'https://www.youtube.com/watch?v=ultWZbUMPL8'
  UNION ALL SELECT 2, 2, 'هيب ثرست',           4, 12, NULL, NULL
  UNION ALL SELECT 2, 3, 'لنجز متحرك',         3, 12, '12 لكل رجل', NULL
  UNION ALL SELECT 2, 4, 'رفع سمانة',          3, 20, NULL, NULL
  UNION ALL SELECT 3, 1, 'راحة',               0, 0,  'مشي خفيف 20-30 دقيقة + تمارين إطالة', NULL
  UNION ALL SELECT 4, 1, 'جري متقطع',          1, 20, '20 دقيقة: دقيقة سريع / دقيقة مشي', NULL
  UNION ALL SELECT 4, 2, 'بلانك',              3, 45, '45 ثانية', NULL
  UNION ALL SELECT 4, 3, 'كرنش دراجة',         3, 20, NULL, NULL
  UNION ALL SELECT 4, 4, 'ماونتن كلايمر',      3, 30, '30 ثانية', NULL
  UNION ALL SELECT 5, 1, 'ديدلفت روماني',      4, 10, NULL, NULL
  UNION ALL SELECT 5, 2, 'تجديف بالدمبل',      4, 12, NULL, NULL
  UNION ALL SELECT 5, 3, 'ضغط كتف',            3, 10, NULL, NULL
  UNION ALL SELECT 5, 4, 'سكوات قفز',          3, 15, NULL, NULL
  UNION ALL SELECT 6, 1, 'راحة',               0, 0,  'راحة تامة — نوم 8 ساعات ومي كفاية', NULL
  UNION ALL SELECT 7, 1, 'راحة',               0, 0,  NULL, NULL
)
SELECT @wp, days.d, tpl.name, tpl.sets, tpl.reps, tpl.notes, tpl.yt,
       -- past workout days: mostly done (every 6th day left as "missed"); today: first exercise done
       (tpl.name <> 'راحة' AND ((days.d < CURDATE() AND DAY(days.d) % 6 <> 0) OR (days.d = CURDATE() AND tpl.ord = 1))) AS completed,
       IF(tpl.name <> 'راحة' AND ((days.d < CURDATE() AND DAY(days.d) % 6 <> 0) OR (days.d = CURDATE() AND tpl.ord = 1)),
          TIMESTAMP(days.d, '18:30:00'), NULL) AS completed_at,
       tpl.ord, @now, @now
FROM days
JOIN tpl ON tpl.dow = IF(days.d = CURDATE(), 2, DAYOFWEEK(days.d));

-- ════════════════════════ 2) NUTRITION ════════════════════════
INSERT INTO nutrition_plans (user_id, month_start_date, month_end_date, pdf_file, created_by, updated_by, created_at, updated_at)
VALUES (@uid, @month_start, @month_end, @nutrition_pdf, 1, 1, @now, @now);
SET @np = LAST_INSERT_ID();

-- 5 meals every day of the month
INSERT INTO nutrition_meals (nutrition_plan_id, meal_date, meal_type, meal_time, meal_image, `order`, created_at, updated_at)
WITH RECURSIVE days AS (
  SELECT DATE(@month_start) AS d
  UNION ALL SELECT d + INTERVAL 1 DAY FROM days WHERE d < DATE(@month_end)
),
types (meal_type, meal_time, ord) AS (
            SELECT 'breakfast', '08:00:00', 1
  UNION ALL SELECT 'snack1',    '11:00:00', 2
  UNION ALL SELECT 'lunch',     '14:00:00', 3
  UNION ALL SELECT 'snack2',    '17:00:00', 4
  UNION ALL SELECT 'dinner',    '20:00:00', 5
)
SELECT @np, days.d, types.meal_type, types.meal_time, NULL, types.ord, @now, @now
FROM days CROSS JOIN types;

-- Items: two menus that alternate by day (odd / even)
INSERT INTO nutrition_items
  (nutrition_meal_id, name, calories, protein, carbs, fats, completed, completed_at, `order`, created_at, updated_at)
WITH menu (variant, meal_type, ord, name, calories, protein, carbs, fats) AS (
            SELECT 1, 'breakfast', 1, 'شوفان 50غ',               190,  7, 33,  3
  UNION ALL SELECT 1, 'breakfast', 2, 'حليب قليل الدسم 200مل',   90,  7, 10,  2
  UNION ALL SELECT 1, 'breakfast', 3, 'توت حفنة',                40,  0, 10,  0
  UNION ALL SELECT 1, 'breakfast', 4, 'ملعقة عسل',               60,  0, 17,  0
  UNION ALL SELECT 1, 'snack1',    1, 'تفاحة متوسطة',            95,  0, 25,  0
  UNION ALL SELECT 1, 'snack1',    2, 'زبدة لوز ملعقة',          100, 3,  3,  9
  UNION ALL SELECT 1, 'lunch',     1, 'صدر دجاج مشوي 150غ',      250, 46, 0,  5
  UNION ALL SELECT 1, 'lunch',     2, 'أرز بني 120غ',            140, 3, 29,  1
  UNION ALL SELECT 1, 'lunch',     3, 'سلطة خضراء',              40,  2,  8,  0
  UNION ALL SELECT 1, 'lunch',     4, 'زيت زيتون ملعقة',         120, 0,  0, 14
  UNION ALL SELECT 1, 'snack2',    1, 'زبادي يوناني 170غ',       100, 17, 6,  0
  UNION ALL SELECT 1, 'snack2',    2, 'مكسرات 15غ',              90,  3,  3,  8
  UNION ALL SELECT 1, 'dinner',    1, 'تونة بالماء علبة',        120, 26, 0,  1
  UNION ALL SELECT 1, 'dinner',    2, 'بيضتين مسلوقتين',         140, 12, 1, 10
  UNION ALL SELECT 1, 'dinner',    3, 'خيار وطماطم',             30,  1,  6,  0
  UNION ALL SELECT 0, 'breakfast', 1, '3 بيضات أومليت',          210, 18, 2, 15
  UNION ALL SELECT 0, 'breakfast', 2, 'خبز أسمر شريحتين',        160, 8, 28,  2
  UNION ALL SELECT 0, 'breakfast', 3, 'خيار وطماطم',             30,  1,  6,  0
  UNION ALL SELECT 0, 'snack1',    1, 'موزة',                    105, 1, 27,  0
  UNION ALL SELECT 0, 'snack1',    2, 'لبنة قليلة الدسم 2 ملعقة', 70, 5,  3,  4
  UNION ALL SELECT 0, 'lunch',     1, 'سلمون 150غ',              310, 33, 0, 19
  UNION ALL SELECT 0, 'lunch',     2, 'بطاطا حلوة 150غ',         130, 2, 30,  0
  UNION ALL SELECT 0, 'lunch',     3, 'خضار سوتيه',              60,  2, 10,  2
  UNION ALL SELECT 0, 'snack2',    1, 'شيك بروتين',              120, 24, 3,  1
  UNION ALL SELECT 0, 'snack2',    2, 'تمرتين',                  130, 1, 34,  0
  UNION ALL SELECT 0, 'dinner',    1, 'جبنة قريش 150غ',          120, 18, 5,  3
  UNION ALL SELECT 0, 'dinner',    2, 'سلطة فتوش بدون خبز',      80,  2, 10,  4
)
SELECT m.id, menu.name, menu.calories, menu.protein, menu.carbs, menu.fats,
       -- past days: most meals eaten; today: breakfast + snack 1 eaten, and one lunch item
       (
         (m.meal_date < CURDATE() AND NOT (DAY(m.meal_date) % 4 = 0 AND m.meal_type = 'dinner'))
         OR (m.meal_date = CURDATE() AND (m.meal_type IN ('breakfast', 'snack1') OR (m.meal_type = 'lunch' AND menu.ord = 1)))
       ) AS completed,
       IF(
         (m.meal_date < CURDATE() AND NOT (DAY(m.meal_date) % 4 = 0 AND m.meal_type = 'dinner'))
         OR (m.meal_date = CURDATE() AND (m.meal_type IN ('breakfast', 'snack1') OR (m.meal_type = 'lunch' AND menu.ord = 1))),
         TIMESTAMP(m.meal_date, m.meal_time), NULL
       ) AS completed_at,
       menu.ord, @now, @now
FROM nutrition_meals m
JOIN menu ON menu.meal_type = m.meal_type AND menu.variant = DAY(m.meal_date) % 2
WHERE m.nutrition_plan_id = @np;

-- ════════════════════════ 3) WEIGHT + WATER ════════════════════════
-- Weight every 4 days for ~6 weeks, trending down (overwrites same-day logs)
INSERT INTO weight_logs (user_id, weight, logged_at, created_at, updated_at)
WITH RECURSIVE w AS (
  SELECT 0 AS n
  UNION ALL SELECT n + 1 FROM w WHERE n < 10
)
SELECT @uid, ROUND(96.0 - n * 0.45 + IF(n % 3 = 1, 0.3, 0), 1), CURDATE() - INTERVAL (40 - n * 4) DAY, @now, @now
FROM w
ON DUPLICATE KEY UPDATE weight = VALUES(weight), updated_at = VALUES(updated_at);

UPDATE users SET weight = (SELECT weight FROM weight_logs WHERE user_id = @uid ORDER BY logged_at DESC LIMIT 1)
WHERE id = @uid;

-- Today's water: 5 of 8 cups
INSERT INTO water_logs (user_id, cups, goal, logged_at, created_at, updated_at)
VALUES (@uid, 5, 8, CURDATE(), @now, @now)
ON DUPLICATE KEY UPDATE cups = 5, goal = 8, updated_at = @now;

COMMIT;

-- ─── Quick check ───
SELECT
  (SELECT COUNT(*) FROM workout_exercises WHERE workout_plan_id = @wp)          AS workout_rows,
  (SELECT COUNT(*) FROM workout_exercises WHERE workout_plan_id = @wp AND name = 'راحة') AS rest_rows,
  (SELECT COUNT(*) FROM nutrition_meals  WHERE nutrition_plan_id = @np)          AS meals,
  (SELECT COUNT(*) FROM nutrition_items i JOIN nutrition_meals m ON m.id = i.nutrition_meal_id WHERE m.nutrition_plan_id = @np) AS meal_items,
  (SELECT COUNT(*) FROM weight_logs WHERE user_id = @uid)                        AS weight_logs;


-- ════════════════════════════════════════════════════════════════════
-- Preview the other Nutrition states (run ONE of these after the script)
-- ════════════════════════════════════════════════════════════════════

-- (a) PDF only — keep the plan, remove its meals:
-- DELETE m FROM nutrition_meals m JOIN nutrition_plans p ON p.id = m.nutrition_plan_id
--  WHERE p.user_id = 59 AND p.month_start_date = DATE_FORMAT(CURDATE(), '%Y-%m-01');

-- (b) Empty — no nutrition plan at all:
-- DELETE FROM nutrition_plans WHERE user_id = 59 AND month_start_date = DATE_FORMAT(CURDATE(), '%Y-%m-01');

-- (c) Today as a REST day instead of a workout:
-- DELETE e FROM workout_exercises e JOIN workout_plans p ON p.id = e.workout_plan_id
--  WHERE p.user_id = 59 AND e.exercise_date = CURDATE();
-- INSERT INTO workout_exercises (workout_plan_id, exercise_date, name, sets, reps, notes, `order`, created_at, updated_at)
-- SELECT id, CURDATE(), 'راحة', 0, 0, 'مشي خفيف 20 دقيقة', 1, NOW(), NOW()
--   FROM workout_plans WHERE user_id = 59 AND month_start_date = DATE_FORMAT(CURDATE(), '%Y-%m-01');

-- ════════════════════════════════════════════════════════════════════
-- Remove all of this month's mock plans for the user
-- ════════════════════════════════════════════════════════════════════
-- DELETE FROM workout_plans   WHERE user_id = 59 AND month_start_date = DATE_FORMAT(CURDATE(), '%Y-%m-01');
-- DELETE FROM nutrition_plans WHERE user_id = 59 AND month_start_date = DATE_FORMAT(CURDATE(), '%Y-%m-01');
