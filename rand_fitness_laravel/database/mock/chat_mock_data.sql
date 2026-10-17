-- ════════════════════════════════════════════════════════════════════
-- Mock chat between a trainee and the coach (local testing only)
-- Adds a realistic conversation over the last 3 days + today.
-- Re-runnable: removes the previous mock messages (tagged by a marker) first.
-- ════════════════════════════════════════════════════════════════════

SET @trainee = 59;   -- ← trainee id (59 = Mohammed)
SET @coach   = 1;    -- ← coach / admin id (1 = Rand Jarrar)

START TRANSACTION;

-- Conversation (one per coach + trainee — unique key)
INSERT INTO conversations (admin_id, trainee_id, status, created_at, updated_at)
VALUES (@coach, @trainee, 'active', NOW(), NOW())
ON DUPLICATE KEY UPDATE deleted_at = NULL, status = 'active', is_archived = 0;

SET @conv = (SELECT id FROM conversations WHERE admin_id = @coach AND trainee_id = @trainee);

-- Remove earlier mock messages (they all carry file_type = 'mock')
DELETE FROM messages WHERE conversation_id = @conv AND file_type = 'mock';

-- (sender, minutes ago, text). Coach = admin, trainee = trainee.
INSERT INTO messages (conversation_id, sender_id, sender_type, message_type, content, file_type, is_read, read_at, status, created_at, updated_at)
WITH script (who, mins_ago, body) AS (
            SELECT 'admin',   4320 + 600, 'أهلاً محمد! 👋 أنا رند، كوتشك ببرنامج RanLogic. جهزتلك خطة التمارين والتغذية لهالشهر، شوفهم بالتابات.'
  UNION ALL SELECT 'trainee', 4320 + 560, 'أهلين كوتش، شكراً كتير! متحمس أبلّش 💪'
  UNION ALL SELECT 'admin',   4320 + 555, 'ممتاز! أهم إشي بأول أسبوعين الالتزام بالتمارين حتى لو بأوزان خفيفة، وسجّل وزنك كل 4 أيام.'
  UNION ALL SELECT 'admin',   2880 + 480, 'كيف كان تمرين الأرجل مبارح؟ حسّيت بأي ألم بالركبة بالسكوات؟'
  UNION ALL SELECT 'trainee', 2880 + 430, 'كان قوي 😅 الركبة تمام، بس الهيب ثرست تعبني كتير بآخر جولة.'
  UNION ALL SELECT 'admin',   2880 + 420, 'طبيعي بالبداية. خفّف الوزن 5 كيلو هالأسبوع وركّز إنك تشد الأرداف فوق ثانيتين بكل تكرار.'
  UNION ALL SELECT 'trainee', 2880 + 400, 'تمام، رح أجرّبها 👍'
  UNION ALL SELECT 'trainee', 1440 + 300, 'كوتش سؤال: بالخطة الغذائية مكتوب سلمون بالغدا، بقدر أبدّله بدجاج؟'
  UNION ALL SELECT 'admin',   1440 + 270, 'أكيد، 150 غرام صدر دجاج بدل السلمون، وزيد ملعقة زيت زيتون عالسلطة عشان الدهون الصحية.'
  UNION ALL SELECT 'trainee', 1440 + 265, 'تمام شكراً 🙏'
  UNION ALL SELECT 'admin',   1440 + 60,  'شفت وزنك نازل بشكل ممتاز هالأسبوع 👏 كمّل على نفس النظام.'
  UNION ALL SELECT 'admin',   90,         'اليوم عندك تمرين أرجل 🔥 لا تنسى الإحماء 10 دقايق قبل.'
  UNION ALL SELECT 'admin',   25,         'ولا تنسى تشرب 8 أكواب مي اليوم 💧'
)
SELECT @conv,
       IF(who = 'admin', @coach, @trainee),
       who, 'text', body, 'mock',
       -- everything is read except the coach's two messages from today (shows the unread badge)
       IF(who = 'admin' AND mins_ago < 120, 0, 1),
       IF(who = 'admin' AND mins_ago < 120, NULL, NOW() - INTERVAL (mins_ago - 2) MINUTE),
       IF(who = 'admin' AND mins_ago < 120, 'delivered', 'read'),
       NOW() - INTERVAL mins_ago MINUTE,
       NOW() - INTERVAL mins_ago MINUTE
FROM script;

-- Keep the conversation summary in sync (latest message + unread counters)
UPDATE conversations c
JOIN (
  SELECT conversation_id, content, sender_type, created_at
  FROM messages
  WHERE conversation_id = @conv AND deleted_at IS NULL
  ORDER BY created_at DESC, id DESC
  LIMIT 1
) last ON last.conversation_id = c.id
SET c.last_message = last.content,
    c.last_message_at = last.created_at,
    c.last_message_sender = last.sender_type,
    c.trainee_unread_count = (SELECT COUNT(*) FROM messages WHERE conversation_id = @conv AND sender_type = 'admin' AND is_read = 0 AND deleted_at IS NULL),
    c.admin_unread_count   = (SELECT COUNT(*) FROM messages WHERE conversation_id = @conv AND sender_type = 'trainee' AND is_read = 0 AND deleted_at IS NULL),
    c.updated_at = NOW()
WHERE c.id = @conv;

COMMIT;

SELECT c.id AS conversation_id, c.trainee_unread_count, c.admin_unread_count, c.last_message_at,
       (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND deleted_at IS NULL) AS visible_messages
FROM conversations c WHERE c.id = @conv;

-- Remove the mock messages only:
-- DELETE m FROM messages m JOIN conversations c ON c.id = m.conversation_id
--  WHERE c.admin_id = 1 AND c.trainee_id = 59 AND m.file_type = 'mock';
