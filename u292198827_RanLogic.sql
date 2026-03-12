-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 12, 2026 at 09:11 PM
-- Server version: 11.8.3-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u292198827_RanLogic`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_coach`
--

CREATE TABLE `about_coach` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `image_path` varchar(191) DEFAULT NULL,
  `image_name` varchar(191) DEFAULT NULL,
  `badge_en` varchar(191) DEFAULT NULL,
  `badge_ar` varchar(191) DEFAULT NULL,
  `title_en` varchar(191) NOT NULL,
  `title_ar` varchar(191) NOT NULL,
  `main_description_en` text NOT NULL,
  `main_description_ar` text NOT NULL,
  `highlight_text_en` text DEFAULT NULL,
  `highlight_text_ar` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `about_coach`
--

INSERT INTO `about_coach` (`id`, `image_path`, `image_name`, `badge_en`, `badge_ar`, `title_en`, `title_ar`, `main_description_en`, `main_description_ar`, `highlight_text_en`, `highlight_text_ar`, `is_active`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'images/coach/coach_1769190640_1YLUNP2rK3.png', 'coach_1769190640_1YLUNP2rK3.png', 'Who Am I', 'من أنا', 'About the Coach', 'عن المدربة', 'I am Rand Jarrar,  an internationally certified fitness coach. For over four years, my mission has been to empower individuals to unlock their full physical and mental potential. I believe that every body requires a unique approach; therefore, I have dedicated my expertise to designing comprehensive programs that integrate science-based training, precise nutrition, and continuous support. I am proud to have been part of the life-changing journeys of more than 200 clients, and I aspire to be your partner in achieving your next goal.', '\"أنا رند جرار، مدربة لياقة بدنية معتمدة دولياً. على مدار أكثر من 4 سنوات، كانت مهمتي هي تمكين الأفراد من اكتشاف أقصى إمكانياتهم البدنية والذهنية. أؤمن أن كل جسم يحتاج إلى نهج مختلف، لذا كرّست خبرتي لتصميم برامج متكاملة تجمع بين العلم، التغذية الدقيقة، والدعم المستمر. فخورة بكوني جزءاً من رحلة تغيير حياة أكثر من 200 متدرب ومتدربة، وأطمح أن أكون شريكتك في الوصول لهدفك القادم.', 'With me, you don\'t just get a workout plan; you get a partner who supports you every step of the way.', 'معي، لن تحصل على مجرد جدول تمارين، بل على رفيق يدعمك في كل خطوة.', 1, 1, '2026-01-18 16:02:36', '2026-02-26 19:46:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `certifications`
--

CREATE TABLE `certifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `icon` varchar(10) NOT NULL DEFAULT '?️',
  `title_en` varchar(191) NOT NULL,
  `title_ar` varchar(191) NOT NULL,
  `organization_en` varchar(191) NOT NULL,
  `organization_ar` varchar(191) NOT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `certifications`
--

INSERT INTO `certifications` (`id`, `icon`, `title_en`, `title_ar`, `organization_en`, `organization_ar`, `is_verified`, `order`, `is_active`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '🏆', 'Certified by', 'موثق من قبل', 'ISSA - International Sports Sciences Association', 'ISSA - الجمعية الدولية لعلوم الرياضة', 1, 0, 1, 1, '2026-01-18 15:11:56', '2026-01-18 15:22:34', NULL),
(3, '⚡', 'Certified by', 'موثق من قبل', 'NSCA - National Strength & Conditioning Association', 'NSCA - الجمعية الوطنية للقوة والتكييف', 1, 2, 1, 1, '2026-01-18 15:11:56', '2026-01-18 15:20:28', NULL),
(4, '🎖️', 'Certified Personal Trainer', 'مدربة شخصية معتمدة', 'NASM - National Academy of Sports Medicine', 'NASM - الأكاديمية الوطنية للطب الرياضي', 1, 3, 1, 1, '2026-01-18 15:11:56', '2026-01-18 15:20:28', NULL),
(5, '🥇', 'Nutrition Specialist', 'أخصائية تغذية', 'ISSN - International Society of Sports Nutrition', 'ISSN - الجمعية الدولية للتغذية الرياضية', 1, 4, 1, 1, '2026-01-18 15:11:56', '2026-01-18 15:20:28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `chat_notifications`
--

CREATE TABLE `chat_notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `conversation_id` bigint(20) UNSIGNED NOT NULL,
  `message_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type` enum('new_message','file_received','message_read') NOT NULL DEFAULT 'new_message',
  `title` varchar(191) NOT NULL,
  `body` text DEFAULT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chat_notifications`
--

INSERT INTO `chat_notifications` (`id`, `user_id`, `conversation_id`, `message_id`, `type`, `title`, `body`, `data`, `is_read`, `read_at`, `created_at`, `updated_at`) VALUES
(62, 1, 19, 90, 'new_message', 'رسالة جديدة', 'أرسل المتدرب رسالة', '{\"sender_id\":43,\"sender_name\":\"\\u0631\\u0646\\u062f\",\"message_type\":\"text\",\"trainee_id\":43}', 1, '2026-02-26 22:05:37', '2026-02-26 22:05:36', '2026-02-26 22:05:37'),
(63, 1, 19, 91, 'file_received', 'رسالة جديدة', 'أرسل المتدرب رسالة', '{\"sender_id\":43,\"sender_name\":\"\\u0631\\u0646\\u062f\",\"message_type\":\"image\",\"trainee_id\":43}', 1, '2026-02-26 22:06:02', '2026-02-26 22:06:02', '2026-02-26 22:06:02'),
(64, 1, 19, 92, 'new_message', 'رسالة جديدة', 'أرسل المتدرب رسالة', '{\"sender_id\":43,\"sender_name\":\"\\u0631\\u0646\\u062f\",\"message_type\":\"text\",\"trainee_id\":43}', 1, '2026-02-26 22:06:12', '2026-02-26 22:06:11', '2026-02-26 22:06:12'),
(65, 1, 19, 93, 'new_message', 'رسالة جديدة', 'أرسل المتدرب رسالة', '{\"sender_id\":43,\"sender_name\":\"\\u0631\\u0646\\u062f\",\"message_type\":\"text\",\"trainee_id\":43}', 1, '2026-02-26 22:06:23', '2026-02-26 22:06:23', '2026-02-26 22:06:23');

-- --------------------------------------------------------

--
-- Table structure for table `coach_features`
--

CREATE TABLE `coach_features` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `about_coach_id` bigint(20) UNSIGNED NOT NULL,
  `icon` varchar(10) NOT NULL DEFAULT '✨',
  `title_en` varchar(191) NOT NULL,
  `title_ar` varchar(191) NOT NULL,
  `description_en` varchar(191) NOT NULL,
  `description_ar` varchar(191) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coach_features`
--

INSERT INTO `coach_features` (`id`, `about_coach_id`, `icon`, `title_en`, `title_ar`, `description_en`, `description_ar`, `order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, '🍎', 'Personalized Nutrition Plans', 'أنظمة غذائية مخصصة', 'Nutrition plans designed especially for you', 'خطط تغذية مصممة خصيصاً لك', 0, 1, '2026-01-18 16:02:36', '2026-02-26 19:46:26'),
(2, 1, '👩‍🏫', 'Online Personal Training', 'تدريب شخصي أونلاين', 'Diverse daily training and follow-up sessions', 'جلسات تدريب متنوعة ومتابعة يومية', 1, 1, '2026-01-18 16:02:36', '2026-02-26 19:46:26'),
(3, 1, '📊', 'Continuous Follow-up', 'متابعة مستمرة', 'Support and follow-up throughout the week', 'دعم ومتابعة على مدار الأسبوع', 2, 1, '2026-01-18 16:02:36', '2026-02-26 19:46:26'),
(4, 1, '💪', 'Cutting, Sculpting, Muscle Gain', 'تنشيف، نحت، زيادة عضل', 'Comprehensive programs to achieve your goals', 'برامج شاملة لتحقيق أهدافك', 3, 1, '2026-01-18 16:02:36', '2026-02-26 19:46:26');

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `admin_id` bigint(20) UNSIGNED NOT NULL,
  `trainee_id` bigint(20) UNSIGNED NOT NULL,
  `last_message` text DEFAULT NULL,
  `last_message_at` timestamp NULL DEFAULT NULL,
  `last_message_sender` enum('admin','trainee') DEFAULT NULL,
  `admin_unread_count` int(11) NOT NULL DEFAULT 0,
  `trainee_unread_count` int(11) NOT NULL DEFAULT 0,
  `status` enum('active','archived','blocked') NOT NULL DEFAULT 'active',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `conversations`
--

INSERT INTO `conversations` (`id`, `admin_id`, `trainee_id`, `last_message`, `last_message_at`, `last_message_sender`, `admin_unread_count`, `trainee_unread_count`, `status`, `deleted_at`, `created_at`, `updated_at`) VALUES
(16, 1, 39, 'Hello', '2026-02-25 15:20:17', 'trainee', 0, 0, 'active', '2026-02-26 14:57:52', '2026-02-25 03:02:18', '2026-02-26 14:57:52'),
(17, 1, 40, NULL, NULL, NULL, 0, 0, 'active', '2026-02-26 14:57:48', '2026-02-25 17:33:43', '2026-02-26 14:57:48'),
(18, 1, 41, NULL, NULL, NULL, 0, 0, 'active', '2026-02-26 14:57:43', '2026-02-25 18:53:07', '2026-02-26 14:57:43'),
(19, 1, 43, 'Hey', '2026-02-26 22:06:23', 'trainee', 0, 0, 'active', NULL, '2026-02-25 21:08:57', '2026-02-26 22:06:23'),
(20, 1, 44, 'ggh', '2026-02-26 14:56:11', 'trainee', 0, 0, 'active', '2026-02-26 14:57:56', '2026-02-26 14:51:20', '2026-02-26 14:57:56'),
(23, 1, 45, NULL, NULL, NULL, 0, 0, 'active', '2026-02-26 15:06:57', '2026-02-26 15:00:34', '2026-02-26 15:06:57'),
(24, 1, 46, NULL, NULL, NULL, 0, 0, 'active', '2026-02-26 15:15:50', '2026-02-26 15:12:12', '2026-02-26 15:15:50'),
(25, 1, 50, NULL, NULL, NULL, 0, 0, 'active', '2026-02-28 23:47:33', '2026-02-27 09:01:49', '2026-02-28 23:47:33');

-- --------------------------------------------------------

--
-- Table structure for table `exercises`
--

CREATE TABLE `exercises` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `workout_day_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `sets` int(11) NOT NULL DEFAULT 3,
  `reps` int(11) NOT NULL DEFAULT 12,
  `notes` text DEFAULT NULL,
  `video_type` varchar(191) DEFAULT NULL,
  `video_url` text DEFAULT NULL,
  `video_path` varchar(191) DEFAULT NULL,
  `image_path` varchar(191) DEFAULT NULL,
  `is_completed` tinyint(1) NOT NULL DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(191) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faq_questions_ar`
--

CREATE TABLE `faq_questions_ar` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category` varchar(191) NOT NULL,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `icon` varchar(10) NOT NULL DEFAULT '❓',
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `faq_questions_ar`
--

INSERT INTO `faq_questions_ar` (`id`, `category`, `question`, `answer`, `icon`, `order`, `is_active`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'البداية', 'من أين أبدأ؟', 'البداية ليست قوتك، إنما قرارك.', '🚀', 0, 1, 1, '2026-01-19 14:22:11', '2026-01-23 20:17:28', NULL),
(2, 'التحفيز', 'أخاف أنني لن أكمل...', 'أغلب المتدربات بدأن بنفس الشعور.', '💪', 1, 1, 1, '2026-01-19 14:22:11', '2026-01-23 20:17:28', NULL),
(3, 'الخصوصية والأمان', 'ماذا عن خصوصيتي؟', 'خصوصيتك خط أحمر.', '🔒', 2, 1, 1, '2026-01-19 14:22:11', '2026-01-23 20:17:28', NULL),
(4, 'إدارة الوقت', 'لدي وقت محدود', '30 دقيقة كافية عندما تكون صحيحة.', '⏱️', 3, 1, 1, '2026-01-19 14:22:11', '2026-01-23 20:17:28', NULL),
(5, 'النتائج', 'متى سأرى النتائج؟', 'الفرق يبدأ قبل أن يظهر.', '📈', 4, 1, 1, '2026-01-19 14:22:11', '2026-01-23 20:17:29', NULL),
(6, 'شكل التدريب', 'هل التدريب أونلاين؟', 'نعم! من بيتك وفي وقتك.', '🌐', 5, 1, 1, '2026-01-19 14:22:11', '2026-01-23 20:17:29', NULL),
(7, 'المعدات', 'هل أحتاج معدات؟', 'لا، جسمك وحافزك كافيان.', '🏋️', 6, 1, 1, '2026-01-19 14:22:11', '2026-01-23 20:17:29', NULL),
(8, 'التغذية', 'ماذا عن النظام الغذائي؟', 'مرن بدون حرمان.', '🥗', 7, 1, 1, '2026-01-19 14:22:11', '2026-01-23 20:17:29', NULL),
(9, 'تيست', 'تسيت', 'تيست', '❓', 8, 1, 1, '2026-01-23 20:17:29', '2026-01-23 20:17:29', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `faq_questions_en`
--

CREATE TABLE `faq_questions_en` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category` varchar(191) NOT NULL,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `icon` varchar(10) NOT NULL DEFAULT '❓',
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `faq_questions_en`
--

INSERT INTO `faq_questions_en` (`id`, `category`, `question`, `answer`, `icon`, `order`, `is_active`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Getting Started', 'Where do I start?', 'The beginning is not your strength, it\'s your decision.', '🚀', 0, 1, 1, '2026-01-19 14:22:11', '2026-01-23 20:17:29', NULL),
(2, 'Motivation', 'I\'m afraid I won\'t continue...', 'Most trainees started with the same feeling.', '💪', 1, 1, 1, '2026-01-19 14:22:11', '2026-01-23 20:17:29', NULL),
(3, 'Privacy & Security', 'What about my privacy?', 'Your privacy is a red line.', '🔒', 2, 1, 1, '2026-01-19 14:22:11', '2026-01-23 20:17:29', NULL),
(4, 'Time Management', 'I have limited time', '30 minutes is enough when done right.', '⏱️', 3, 1, 1, '2026-01-19 14:22:11', '2026-01-23 20:17:29', NULL),
(5, 'Results', 'When will I see results?', 'The difference starts before it shows.', '📈', 4, 1, 1, '2026-01-19 14:22:11', '2026-01-23 20:17:29', NULL),
(6, 'Training Format', 'Is it online training?', 'Yes! From your home and at your time.', '🌐', 5, 1, 1, '2026-01-19 14:22:11', '2026-01-23 20:17:29', NULL),
(7, 'Equipment', 'Do I need equipment?', 'No, your body and motivation are enough.', '🏋️', 6, 1, 1, '2026-01-19 14:22:11', '2026-01-23 20:17:29', NULL),
(8, 'Nutrition', 'What about diet?', 'Flexible with no deprivation.', '🥗', 7, 1, 1, '2026-01-19 14:22:11', '2026-01-23 20:17:29', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `faq_section`
--

CREATE TABLE `faq_section` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title_en` varchar(191) NOT NULL,
  `title_ar` varchar(191) NOT NULL,
  `subtitle_en` varchar(191) DEFAULT NULL,
  `subtitle_ar` varchar(191) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `faq_section`
--

INSERT INTO `faq_section` (`id`, `title_en`, `title_ar`, `subtitle_en`, `subtitle_ar`, `is_active`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(4, 'Frequently Asked Questions', 'الأسئلة الشائعة', 'Everything you need to know about your fitness journey 🤍', 'كل ما تحتاج معرفته عن رحلتك الرياضية 🤍', 1, 1, '2026-01-19 14:22:11', '2026-01-23 20:17:28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `footers`
--

CREATE TABLE `footers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `logo_id` bigint(20) UNSIGNED DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `description_ar` text DEFAULT NULL,
  `copyright_en` varchar(191) DEFAULT NULL,
  `copyright_ar` varchar(191) DEFAULT NULL,
  `quick_links_title_en` varchar(191) NOT NULL DEFAULT 'Quick Links',
  `quick_links_title_ar` varchar(191) NOT NULL DEFAULT 'روابط سريعة',
  `email` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `address_en` text DEFAULT NULL,
  `address_ar` text DEFAULT NULL,
  `social_links` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`social_links`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `footers`
--

INSERT INTO `footers` (`id`, `logo_id`, `description_en`, `description_ar`, `copyright_en`, `copyright_ar`, `quick_links_title_en`, `quick_links_title_ar`, `email`, `phone`, `address_en`, `address_ar`, `social_links`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, NULL, 'Internationally Certified Fitness Coach\nHelping you achieve your goals in a healthy and sustainable way', 'مدربة لياقة بدنية معتمدة دوليًا\nأساعدك على تحقيق أهدافك بطريقة صحية ومستدامة', '© 2026 RAND JARAR. جميع الحقوق محفوظة.\n\n\n', '© 2026 Rand Jarar. All rights reserved.', 'Quick Links', 'روابط سريعة', NULL, NULL, NULL, NULL, '[{\"platform\":\"instagram\",\"url\":\"https:\\/\\/ranlogic.com\\/\"},{\"platform\":\"tiktok\",\"url\":\"https:\\/\\/ranlogic.com\\/\"},{\"platform\":\"youtube\",\"url\":\"https:\\/\\/ranlogic.com\\/\"},{\"platform\":\"twitter\",\"url\":\"https:\\/\\/ranlogic.com\\/\"}]', 1, '2026-01-23 17:13:42', '2026-02-25 03:38:35', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `footer_links`
--

CREATE TABLE `footer_links` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `footer_id` bigint(20) UNSIGNED NOT NULL,
  `text_en` varchar(191) NOT NULL,
  `text_ar` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `type` enum('quick_link','legal_link') NOT NULL DEFAULT 'quick_link',
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `footer_social_links`
--

CREATE TABLE `footer_social_links` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `footer_id` bigint(20) UNSIGNED NOT NULL,
  `platform` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `icon` varchar(191) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `goals`
--

CREATE TABLE `goals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name_ar` varchar(191) NOT NULL,
  `name_en` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_sections`
--

CREATE TABLE `hero_sections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `video_path` varchar(191) DEFAULT NULL,
  `video_name` varchar(191) DEFAULT NULL,
  `video_type` varchar(191) DEFAULT NULL,
  `video_size` int(11) DEFAULT NULL,
  `badge_en` varchar(191) DEFAULT NULL,
  `badge_ar` varchar(191) DEFAULT NULL,
  `main_title_en` varchar(191) DEFAULT NULL,
  `main_title_ar` varchar(191) DEFAULT NULL,
  `sub_title_en` varchar(191) DEFAULT NULL,
  `sub_title_ar` varchar(191) DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `description_ar` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hero_sections`
--

INSERT INTO `hero_sections` (`id`, `video_path`, `video_name`, `video_type`, `video_size`, `badge_en`, `badge_ar`, `main_title_en`, `main_title_ar`, `sub_title_en`, `sub_title_ar`, `description_en`, `description_ar`, `is_active`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'videos/hero_video_20260311230456_rGM0AvMb.mov', '48d7a62b9629415cb8e60c3fa2eff98f.mov', 'video/mp4', 1070900, 'Personalized Training Program', 'برنامج تدريب شخصي', 'Invest in yourself, and build the best version of you today', '*  استثمر في نفسك، واصنع النسخة الأفضل من ذاتك اليوم.', 'Your journey toward a strong body and unshakable confidence starts here.', 'رحلتك نحو جسم قوي وثقة لا تهتز تبدأ من هنا.', 'Say goodbye to generic plans. Join a program scientifically tailored to your specific goals.', 'وداعاً للبرامج العشوائية، انضم إلى برنامج صُمم علمياً ليناسب أهدافك الخاصة.', 1, 1, '2026-01-18 14:27:27', '2026-03-11 23:04:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `hero_stats`
--

CREATE TABLE `hero_stats` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hero_section_id` bigint(20) UNSIGNED NOT NULL,
  `value` varchar(50) NOT NULL,
  `label_en` varchar(191) NOT NULL,
  `label_ar` varchar(191) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hero_stats`
--

INSERT INTO `hero_stats` (`id`, `hero_section_id`, `value`, `label_en`, `label_ar`, `order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, '200+', 'Happy Trainees', 'متدرب سعيد', 0, 1, '2026-01-18 14:27:27', '2026-02-25 17:50:08'),
(2, 1, '4+', 'Years of Experience', 'سنوات خبرة', 1, 1, '2026-01-18 14:27:27', '2026-02-25 17:49:23'),
(3, 1, '98%', 'Success Rate', 'نسبة النجاح', 2, 1, '2026-01-18 14:27:27', '2026-01-18 14:27:27');

-- --------------------------------------------------------

--
-- Table structure for table `logos`
--

CREATE TABLE `logos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `file_name` varchar(191) DEFAULT NULL,
  `file_name_ar` varchar(191) DEFAULT NULL,
  `file_name_en` varchar(191) DEFAULT NULL,
  `file_path` varchar(191) DEFAULT NULL,
  `file_path_ar` varchar(191) DEFAULT NULL,
  `file_path_en` varchar(191) DEFAULT NULL,
  `file_type` varchar(191) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `uploaded_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `logos`
--

INSERT INTO `logos` (`id`, `file_name`, `file_name_ar`, `file_name_en`, `file_path`, `file_path_ar`, `file_path_en`, `file_type`, `file_size`, `width`, `height`, `is_active`, `is_default`, `uploaded_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(33, 'logoo1-removebg-preview.png', NULL, NULL, 'logos/logo_20260225020442_zVcSF8gS.png', NULL, NULL, 'image/png', 161986, 834, 264, 0, 0, 1, '2026-02-25 02:04:42', '2026-02-25 02:18:29', NULL),
(34, 'logoo1-removebg-preview.png', NULL, NULL, 'logos/logo_20260225021829_VZVg9yKl.png', NULL, NULL, 'image/png', 161986, 834, 264, 1, 0, 1, '2026-02-25 02:18:29', '2026-02-25 02:18:29', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `conversation_id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` bigint(20) UNSIGNED NOT NULL,
  `sender_type` enum('admin','trainee') NOT NULL,
  `message_type` enum('text','image','video','file','pdf','doc') NOT NULL DEFAULT 'text',
  `content` text DEFAULT NULL,
  `file_path` varchar(191) DEFAULT NULL,
  `file_name` varchar(191) DEFAULT NULL,
  `file_type` varchar(191) DEFAULT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `file_mime_type` varchar(191) DEFAULT NULL,
  `media_width` int(11) DEFAULT NULL,
  `media_height` int(11) DEFAULT NULL,
  `media_duration` int(11) DEFAULT NULL,
  `thumbnail_path` varchar(191) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `status` enum('sending','sent','delivered','read','failed') NOT NULL DEFAULT 'sent',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `conversation_id`, `sender_id`, `sender_type`, `message_type`, `content`, `file_path`, `file_name`, `file_type`, `file_size`, `file_mime_type`, `media_width`, `media_height`, `media_duration`, `thumbnail_path`, `is_read`, `read_at`, `status`, `deleted_at`, `created_at`, `updated_at`) VALUES
(90, 19, 43, 'trainee', 'text', 'مرحبا', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-02-26 22:05:37', 'sent', NULL, '2026-02-26 22:05:36', '2026-02-26 22:05:37'),
(91, 19, 43, 'trainee', 'image', NULL, 'chat/images/1772143562_77f6OvWuZS.jpeg', 'IMG_9819.jpeg', 'jpeg', 449903, 'image/jpeg', NULL, NULL, NULL, NULL, 1, '2026-02-26 22:06:02', 'sent', NULL, '2026-02-26 22:06:02', '2026-02-26 22:06:02'),
(92, 19, 43, 'trainee', 'text', 'وصلت ؟؟', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-02-26 22:06:12', 'sent', NULL, '2026-02-26 22:06:11', '2026-02-26 22:06:12'),
(93, 19, 43, 'trainee', 'text', 'Hey', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-02-26 22:06:23', 'sent', NULL, '2026-02-26 22:06:23', '2026-02-26 22:06:23');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(191) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2026_01_15_152421_create_logos_table', 1),
(6, '2026_01_15_160639_create_goals_and_user_goals_tables', 1),
(7, '2026_01_15_160717_create_subscriptions_table', 1),
(8, '2026_01_18_171916_create_hero_sections_table', 2),
(9, '2026_01_18_171953_create_hero_stats_table', 2),
(10, '2026_01_18_175759_create_certifications_table', 3),
(11, '2026_01_18_185459_create_about_coach_and_coach_features_tables', 4),
(12, '2026_01_18_221343_create_testimonials_and_testimonials_section_tables', 5),
(13, '2026_01_19_170308_create_faq_tables', 6),
(14, '2026_01_19_212058_create_nutrition_and_workout_tables', 7),
(15, '2026_01_20_141245_create_workout_plans_workout_days_exercises_tables', 8),
(16, '2026_01_20_141651_create_nutrition_plans_nutrition_days_meals_meal_items_tables', 8),
(17, '2026_01_20_193917_create_nutrition_and_workout_plans_tables', 9),
(18, '2026_01_21_225832_create_conversations_table', 10),
(19, '2026_01_21_225911_create_messages_table', 10),
(20, '2026_01_21_225935_create_chat_notifications_table', 10),
(21, '2026_01_23_133928_add_language_fields_to_logos_table', 11),
(22, '2026_01_23_142916_update_logos_table', 12),
(23, '2026_01_23_193359_create_footers_and_related_tables', 13),
(24, '2026_01_23_200943_create_footers_and_footer_links_tables', 14),
(25, '2026_01_24_152625_create_plans_table', 15),
(26, '2026_01_24_152940_create_subscriptions_table', 16),
(27, '2026_01_24_153046_create_subscriptions_table', 17),
(28, '2026_01_25_033754_create_subscriptions_table', 18),
(29, '2026_01_25_033832_add_language_to_users_table', 18),
(30, '2026_02_05_234405_add_read_at_to_messages_table', 19);

-- --------------------------------------------------------

--
-- Table structure for table `nutrition_items`
--

CREATE TABLE `nutrition_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nutrition_meal_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `calories` int(11) NOT NULL DEFAULT 0,
  `protein` decimal(8,2) NOT NULL DEFAULT 0.00,
  `carbs` decimal(8,2) NOT NULL DEFAULT 0.00,
  `fats` decimal(8,2) NOT NULL DEFAULT 0.00,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `nutrition_items`
--

INSERT INTO `nutrition_items` (`id`, `nutrition_meal_id`, `name`, `calories`, `protein`, `carbs`, `fats`, `completed`, `completed_at`, `order`, `created_at`, `updated_at`) VALUES
(21, 12, 'Test', 60, 80.00, 90.00, 50.00, 1, '2026-02-25 03:50:12', 0, '2026-02-25 03:47:36', '2026-02-25 03:50:12'),
(26, 13, 'صدر دجاج مشوي (150 غرام', 240, 45.00, 0.00, 5.00, 0, NULL, 0, '2026-02-26 23:42:50', '2026-02-26 23:42:50'),
(27, 13, 'رز أبيض مطبوخ (1 كوب ~ 150غ)', 200, 4.00, 45.00, 0.50, 0, NULL, 1, '2026-02-26 23:42:50', '2026-02-26 23:42:50'),
(28, 14, 'زبادي بالمانجا والتوت البري ', 1000, 1200.00, 400.00, 0.00, 0, NULL, 0, '2026-02-26 23:42:50', '2026-02-26 23:42:50');

-- --------------------------------------------------------

--
-- Table structure for table `nutrition_meals`
--

CREATE TABLE `nutrition_meals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nutrition_plan_id` bigint(20) UNSIGNED NOT NULL,
  `meal_date` date NOT NULL,
  `meal_type` varchar(191) NOT NULL,
  `meal_time` time DEFAULT NULL,
  `meal_image` varchar(191) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `nutrition_meals`
--

INSERT INTO `nutrition_meals` (`id`, `nutrition_plan_id`, `meal_date`, `meal_type`, `meal_time`, `meal_image`, `order`, `created_at`, `updated_at`) VALUES
(13, 12, '2026-02-26', 'صدر دجاج مع رز أبيض ', '12:00:00', 'meal_images/faE2zgBE2cL8Ez2vhIjZn3eGLQHuYulWz7gKc4NE.jpg', 0, '2026-02-26 22:08:05', '2026-02-26 22:08:05'),
(14, 12, '2026-02-01', 'وجبة جديدة', '12:00:00', 'meal_images/GGXJKqcWWqn0XBhX675u0hJwVmugrJHNXLNDGlWi.jpg', 1, '2026-02-26 23:42:50', '2026-02-26 23:42:50');

-- --------------------------------------------------------

--
-- Table structure for table `nutrition_plans`
--

CREATE TABLE `nutrition_plans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `month_start_date` date NOT NULL,
  `month_end_date` date NOT NULL,
  `pdf_file` varchar(191) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `nutrition_plans`
--

INSERT INTO `nutrition_plans` (`id`, `user_id`, `month_start_date`, `month_end_date`, `pdf_file`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(10, 31, '2026-02-01', '2026-02-28', NULL, 1, 1, '2026-02-05 09:13:56', '2026-02-05 09:13:56', NULL),
(11, 39, '2026-02-01', '2026-02-28', 'nutrition_pdfs/7Bsq7lT2ZfVxfdiLEsQ45LdmNIh2bbGC3JKBqE5k.pdf', 1, 1, '2026-02-25 03:47:36', '2026-02-25 03:47:36', NULL),
(12, 43, '2026-02-01', '2026-02-28', NULL, 1, 1, '2026-02-26 22:08:05', '2026-02-26 22:08:05', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(191) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(9, 'App\\Models\\User', 1, 'auth_token', '4abde294c381b468eb9025a3a2605cb732b9c29e9eb063660cf734fff4a9dffc', '[\"*\"]', NULL, NULL, '2026-01-22 23:11:47', '2026-01-22 23:11:47'),
(11, 'App\\Models\\User', 1, 'auth_token', 'b53a8067d7b55208fbe8640292d77c09d32192edddfc789843d760019d1cfcfd', '[\"*\"]', '2026-01-23 21:15:45', NULL, '2026-01-23 21:08:32', '2026-01-23 21:15:45'),
(16, 'App\\Models\\User', 1, 'auth_token', 'a67d7c27591319baea6742e42816c67dc419379e4dbfcf13278658b0c0555022', '[\"*\"]', NULL, NULL, '2026-01-24 11:00:13', '2026-01-24 11:00:13'),
(17, 'App\\Models\\User', 1, 'auth_token', 'fb6729a06d3653e824784ebf1cec4dbf82f7398e65d3bb7d154bffd2850d9393', '[\"*\"]', NULL, NULL, '2026-01-24 11:00:16', '2026-01-24 11:00:16'),
(18, 'App\\Models\\User', 1, 'auth_token', '4f35b853bdbf36d641dff0dc92a929df3b3dc28cdb75b90c27fa6b439f66ddef', '[\"*\"]', NULL, NULL, '2026-01-24 11:00:18', '2026-01-24 11:00:18'),
(22, 'App\\Models\\User', 19, 'auth_token', '5b867323b11f041f3b389699124be935b3fcbb06ed1e2290e69b77f6b24867ea', '[\"*\"]', '2026-01-24 11:16:36', NULL, '2026-01-24 11:15:06', '2026-01-24 11:16:36'),
(24, 'App\\Models\\User', 19, 'auth_token', 'bd72ae02477d41dc413e143218daac6eb7cba37b2d771390c8c7b61d98da8c63', '[\"*\"]', NULL, NULL, '2026-01-24 11:23:48', '2026-01-24 11:23:48'),
(26, 'App\\Models\\User', 18, 'auth_token', '649d361583b31c5cdbaa8d21728d2590ae19cc51154f459963b81b107a70597f', '[\"*\"]', NULL, NULL, '2026-01-24 11:25:01', '2026-01-24 11:25:01'),
(27, 'App\\Models\\User', 18, 'auth_token', '0ed91be13ea67903413d558032885f62cf958cc0239e3dd2de96dc1c3e7c9cd9', '[\"*\"]', NULL, NULL, '2026-01-24 11:25:45', '2026-01-24 11:25:45'),
(29, 'App\\Models\\User', 1, 'auth_token', 'b2bd5d84caaa0d77d947d91ec9eb375bf8bf5d6fc20fed02a975b4a6f108472f', '[\"*\"]', NULL, NULL, '2026-01-24 11:34:25', '2026-01-24 11:34:25'),
(30, 'App\\Models\\User', 1, 'auth_token', '6639acf0d1c362e6ed8e69b60b5c90f6f2c87669e992b873dca7e7f7d102e61b', '[\"*\"]', NULL, NULL, '2026-01-24 11:34:50', '2026-01-24 11:34:50'),
(31, 'App\\Models\\User', 1, 'auth_token', '533fcf16cd8589b230ac7b9c2c77b7d993d4876f7264b4125c907975d91e6a7e', '[\"*\"]', NULL, NULL, '2026-01-24 11:39:25', '2026-01-24 11:39:25'),
(32, 'App\\Models\\User', 1, 'auth_token', '38f4690cff102b2d2c89ecd0a089db00a294dfb959f78d9324cf22f4821a46e8', '[\"*\"]', NULL, NULL, '2026-01-24 11:39:42', '2026-01-24 11:39:42'),
(33, 'App\\Models\\User', 1, 'auth_token', '33cd35fe1cc249a1e45ecc62822222b235d5f20fa4eca48779d48196e521f310', '[\"*\"]', NULL, NULL, '2026-01-24 11:42:59', '2026-01-24 11:42:59'),
(34, 'App\\Models\\User', 18, 'auth_token', '5df9dec20a881e9eb3ff210687da9ff00e79dc4101279013ebe267972558879b', '[\"*\"]', NULL, NULL, '2026-01-24 11:43:19', '2026-01-24 11:43:19'),
(41, 'App\\Models\\User', 1, 'auth_token', 'ca28b88762913b287121c08dc5344409a59782ad8f9c4786c5c3323137a7b165', '[\"*\"]', NULL, NULL, '2026-01-25 21:03:10', '2026-01-25 21:03:10'),
(43, 'App\\Models\\User', 1, 'auth_token', 'f5596d24554f2ef0073b4c282dd8a8547882419f9208c94847be436927620dd1', '[\"*\"]', '2026-01-26 16:10:56', NULL, '2026-01-26 16:01:45', '2026-01-26 16:10:56'),
(44, 'App\\Models\\User', 19, 'auth_token', '06e99cd35d095bfc4885ca9658d6c4c05a127ebd863968b4cb231169664d7556', '[\"*\"]', '2026-01-27 16:43:18', NULL, '2026-01-26 17:31:16', '2026-01-27 16:43:18'),
(48, 'App\\Models\\User', 19, 'auth_token', 'e248f6f28df06c408dde9e6b48f06849f2210a93ddd3549ef96201c15cd359d4', '[\"*\"]', NULL, NULL, '2026-01-28 19:07:21', '2026-01-28 19:07:21'),
(49, 'App\\Models\\User', 20, 'auth_token', 'fde77b5c507b708f9ce995ce0b6e39fd756400a7dcb964db0732126ab2bc3aa4', '[\"*\"]', '2026-01-28 19:20:10', NULL, '2026-01-28 19:11:17', '2026-01-28 19:20:10'),
(55, 'App\\Models\\User', 21, 'auth_token', '9f746b64f9fa9260af5907a584db5cf30ab2109cad6201fc9a817713caaef0f9', '[\"*\"]', '2026-01-29 09:00:43', NULL, '2026-01-29 08:59:57', '2026-01-29 09:00:43'),
(56, 'App\\Models\\User', 22, 'auth_token', '2fd2386d5e259faed72fea1f9ca65aa685a77474002214a95b63afaedd24377d', '[\"*\"]', '2026-01-29 09:06:07', NULL, '2026-01-29 09:05:00', '2026-01-29 09:06:07'),
(59, 'App\\Models\\User', 24, 'auth_token', '906ca4241f1a8e59c0c28714669aca62e24d6f0352b9256789b3f87fa8b470a9', '[\"*\"]', '2026-01-29 09:25:55', NULL, '2026-01-29 09:24:55', '2026-01-29 09:25:55'),
(63, 'App\\Models\\User', 1, 'auth_token', '106361279c35e16d86312cc7e0be930c436abb2dd9f3be18b89976b00fff3b21', '[\"*\"]', '2026-01-29 17:47:25', NULL, '2026-01-29 17:38:48', '2026-01-29 17:47:25'),
(69, 'App\\Models\\User', 19, 'auth_token', '3970132074e5d60601ff214d8fc77b9798cf2794576812fd09bff8fb245a1d29', '[\"*\"]', NULL, NULL, '2026-01-31 15:58:46', '2026-01-31 15:58:46'),
(74, 'App\\Models\\User', 19, 'auth_token', '359a9ef27ed7229fe0a8c6bcbfad254bd5ed076b3ec8d7f9a8ddbab0c75d7946', '[\"*\"]', NULL, NULL, '2026-01-31 21:58:49', '2026-01-31 21:58:49'),
(75, 'App\\Models\\User', 19, 'auth_token', 'dcae786bc9c119c9a4a690a0693bf6b1f94f4c3c4a5f67f89b26d562abf908e4', '[\"*\"]', NULL, NULL, '2026-01-31 21:59:07', '2026-01-31 21:59:07'),
(76, 'App\\Models\\User', 19, 'auth_token', '1208439e664bfb0442d8ccd1beb014e67e165ea75411ae4d6bb0b29000fc7f2d', '[\"*\"]', NULL, NULL, '2026-01-31 22:00:13', '2026-01-31 22:00:13'),
(77, 'App\\Models\\User', 19, 'auth_token', '7c1d1229e2ec35675256be56f5c7cf7a9f8b4ee3e10958179a72b240aec8ccea', '[\"*\"]', NULL, NULL, '2026-01-31 22:01:10', '2026-01-31 22:01:10'),
(79, 'App\\Models\\User', 1, 'auth_token', '3a81576cb8a0ec4d245c1c3dfab26a2cfae29caa5134fc91185a23383cb6fefe', '[\"*\"]', NULL, NULL, '2026-02-01 09:25:14', '2026-02-01 09:25:14'),
(87, 'App\\Models\\User', 19, 'auth_token', '8227c9ca36b57857c88f0f34c5b6291dd726bfd8ec118b88475434060a3abb85', '[\"*\"]', '2026-02-03 03:41:17', NULL, '2026-02-01 15:51:25', '2026-02-03 03:41:17'),
(89, 'App\\Models\\User', 28, 'auth_token', '202c4bbbab34909faa3aa2374fff38e315ad075717fe9ffbb66c545f50418bec', '[\"*\"]', '2026-02-03 17:08:26', NULL, '2026-02-03 17:07:22', '2026-02-03 17:08:26'),
(93, 'App\\Models\\User', 19, 'auth_token', '0bf540bba16f31f95b2145d7c4dfc63ed78fbf5ca2f5ffa3965dc63bf08b8258', '[\"*\"]', '2026-02-03 17:46:26', NULL, '2026-02-03 17:43:37', '2026-02-03 17:46:26'),
(95, 'App\\Models\\User', 1, 'auth_token', '3fb404094afaf5c9ca05515db49531be0347185c85cdfc23015cf561d0b8244f', '[\"*\"]', '2026-02-05 06:42:43', NULL, '2026-02-05 05:16:55', '2026-02-05 06:42:43'),
(96, 'App\\Models\\User', 1, 'auth_token', '78cbff28a62febbbb9d23542044e4bef516249bb4e2035bc27bf33ce973f88be', '[\"*\"]', NULL, NULL, '2026-02-05 06:42:47', '2026-02-05 06:42:47'),
(97, 'App\\Models\\User', 1, 'auth_token', 'f9845503f080087a4ff60fb0414e81cd96b9bc12f2af7379097e8d4d98450ad4', '[\"*\"]', NULL, NULL, '2026-02-05 06:43:07', '2026-02-05 06:43:07'),
(99, 'App\\Models\\User', 1, 'auth_token', 'b1e21cd5d8f760e6cc8102f48c40a14157f67d995c128982f3b1795956a28a22', '[\"*\"]', NULL, NULL, '2026-02-05 06:49:45', '2026-02-05 06:49:45'),
(106, 'App\\Models\\User', 1, 'auth_token', '56898ee71afa2bdd442bbb2a95ea3bf5dc086e6c512a961900c072e2c58dda25', '[\"*\"]', NULL, NULL, '2026-02-05 16:15:30', '2026-02-05 16:15:30'),
(109, 'App\\Models\\User', 31, 'auth_token', 'bf769910fb4b6aa01fd0d906b07a9cb01046baf5a8d556bece4a8390b50807af', '[\"*\"]', '2026-02-05 18:54:03', NULL, '2026-02-05 18:31:02', '2026-02-05 18:54:03'),
(111, 'App\\Models\\User', 31, 'auth_token', 'f1e704a30f3dae5db8370f568d97ef880daa855ef6fc3baea4eded50264c7eb4', '[\"*\"]', '2026-02-05 18:59:35', NULL, '2026-02-05 18:59:04', '2026-02-05 18:59:35'),
(113, 'App\\Models\\User', 31, 'auth_token', '6df09aa81b2ccc4a8f59b46100add9770c0ae25cd793ef26dc797e0fb3729325', '[\"*\"]', '2026-02-05 19:01:49', NULL, '2026-02-05 19:00:48', '2026-02-05 19:01:49'),
(117, 'App\\Models\\User', 31, 'auth_token', '4f5bd759262c0d0e3e8ab096753cd57a750648c102d8fc24559787aaf8f5ad22', '[\"*\"]', '2026-02-05 19:45:32', NULL, '2026-02-05 19:44:59', '2026-02-05 19:45:32'),
(120, 'App\\Models\\User', 1, 'auth_token', 'f65a6f4d42ad9669fcba9ab86ef09af08fc08e94ad4fc0757c628363e336cbf2', '[\"*\"]', '2026-02-05 20:03:32', NULL, '2026-02-05 19:57:53', '2026-02-05 20:03:32'),
(122, 'App\\Models\\User', 31, 'auth_token', 'edc165a46b33259f9e37f8a727d60b69fa6de8e2caa76b0a46e8d101e2a124dc', '[\"*\"]', '2026-02-05 20:09:22', NULL, '2026-02-05 20:08:46', '2026-02-05 20:09:22'),
(127, 'App\\Models\\User', 31, 'auth_token', 'bf616d7d3a98c3d6e79f6fc6dab9cb41f7d64034d208af35dd857832da597eba', '[\"*\"]', '2026-02-05 21:04:58', NULL, '2026-02-05 21:03:39', '2026-02-05 21:04:58'),
(131, 'App\\Models\\User', 31, 'auth_token', '47db21c852e79114ebc8bba9df0ce40a851a8fa983a991c1e30e51ac349ef2b2', '[\"*\"]', '2026-02-05 21:50:02', NULL, '2026-02-05 21:49:05', '2026-02-05 21:50:02'),
(148, 'App\\Models\\User', 1, 'auth_token', '3ae0816816f212d698f4c523eb2976dca1a60ed89cbc99cce0958d5d0d3a1e65', '[\"*\"]', NULL, NULL, '2026-02-12 22:29:46', '2026-02-12 22:29:46'),
(151, 'App\\Models\\User', 1, 'auth_token', 'fff6b9164d75d739a36939767cf69282d9aa02981d968aef0144d0b4971c576a', '[\"*\"]', '2026-02-24 10:06:55', NULL, '2026-02-24 10:04:21', '2026-02-24 10:06:55'),
(162, 'App\\Models\\User', 40, 'auth_token', '91296eb6731a38dc8f1d7b58522909f710ff375e433f56a116f6bc7407bc9652', '[\"*\"]', '2026-02-25 17:19:27', NULL, '2026-02-25 17:19:21', '2026-02-25 17:19:27'),
(167, 'App\\Models\\User', 41, 'auth_token', 'bf442c8931b80186cbb1d9c94627a1f0ce41a7475aa3a36ea695155eafa3053e', '[\"*\"]', '2026-02-25 18:26:58', NULL, '2026-02-25 18:04:18', '2026-02-25 18:26:58'),
(168, 'App\\Models\\User', 41, 'auth_token', '96a09f4c5b06d6d4284cf9ac409ed45f68d3d465132bc3ca9b229a8f812abe31', '[\"*\"]', '2026-02-25 18:31:20', NULL, '2026-02-25 18:27:34', '2026-02-25 18:31:20'),
(169, 'App\\Models\\User', 41, 'auth_token', '78508923fef3495ac1c9451e3232ee096a5a46307eda466ab913821337488d3b', '[\"*\"]', '2026-02-25 18:37:28', NULL, '2026-02-25 18:31:59', '2026-02-25 18:37:28'),
(170, 'App\\Models\\User', 41, 'auth_token', '773659106d802f1deeaeb5788f95b6c3cd1c5b86b00b5678c331f993a3fc9191', '[\"*\"]', '2026-02-25 18:41:03', NULL, '2026-02-25 18:38:12', '2026-02-25 18:41:03'),
(171, 'App\\Models\\User', 41, 'auth_token', '78cf789ffb21a6ff9f400c1f7b04316d6ba9608e416145232c8b56565bfb87d6', '[\"*\"]', '2026-02-25 18:42:14', NULL, '2026-02-25 18:42:03', '2026-02-25 18:42:14'),
(172, 'App\\Models\\User', 41, 'auth_token', 'a9c3bcd31b6da3f9c0731a97e2cafcaa9828fe4afac364d77af8dbe65d3d4ff9', '[\"*\"]', '2026-02-25 18:50:11', NULL, '2026-02-25 18:47:59', '2026-02-25 18:50:11'),
(177, 'App\\Models\\User', 43, 'auth_token', '3248fcf22610d56989a3ef35eaebea2461673d61acc24d323bacc76888132d6d', '[\"*\"]', '2026-02-26 22:20:22', NULL, '2026-02-25 22:55:48', '2026-02-26 22:20:22'),
(178, 'App\\Models\\User', 44, 'auth_token', '39d38e63a948e88acde17b6bd96f80e5ea277c10cbfe484fc99eb89252d6890d', '[\"*\"]', '2026-02-26 14:58:08', NULL, '2026-02-26 14:49:26', '2026-02-26 14:58:08'),
(179, 'App\\Models\\User', 42, 'auth_token', 'df6c41b3618d4224535c25c5461782b202cc5d1222b02af271d03aaca0c371f0', '[\"*\"]', '2026-02-26 14:55:41', NULL, '2026-02-26 14:52:15', '2026-02-26 14:55:41'),
(180, 'App\\Models\\User', 45, 'auth_token', '87d42e5ea7f0da952a43b78c883441cad84c42854d05ba3d54387d360e7a88a4', '[\"*\"]', '2026-02-26 15:06:16', NULL, '2026-02-26 14:59:06', '2026-02-26 15:06:16'),
(183, 'App\\Models\\User', 46, 'auth_token', 'b12f756a1773920ac2047d513dd5c0907a9910cffbea5dcdb9682ce1179782fb', '[\"*\"]', '2026-02-26 15:18:11', NULL, '2026-02-26 15:13:38', '2026-02-26 15:18:11'),
(184, 'App\\Models\\User', 47, 'auth_token', 'f21369d8fca934304ede6c7a9b3de53f16fc96182c1a38d5fa76522001b51be0', '[\"*\"]', '2026-02-26 15:15:17', NULL, '2026-02-26 15:14:18', '2026-02-26 15:15:17'),
(185, 'App\\Models\\User', 1, 'auth_token', 'c54e4908e3711762501aa32b51dd351bb1686145935348c3c715e7db4332c55c', '[\"*\"]', '2026-02-26 15:19:43', NULL, '2026-02-26 15:19:40', '2026-02-26 15:19:43'),
(187, 'App\\Models\\User', 48, 'auth_token', '291f088d4feeafe1b536d8381ab5714d7688370288e3ef51d6f44ddd5c788dd1', '[\"*\"]', '2026-02-26 18:50:49', NULL, '2026-02-26 16:12:42', '2026-02-26 18:50:49'),
(188, 'App\\Models\\User', 48, 'auth_token', '6a716763e7db82c1e2e4874a30c5048be5e9ea6ebee7eda1a6dad591cfccc1e0', '[\"*\"]', NULL, NULL, '2026-02-26 16:13:02', '2026-02-26 16:13:02'),
(194, 'App\\Models\\User', 1, 'auth_token', 'c21afab6ce61d9fafac14cbcefd0e90dff4732b3898963a779350c34b7192f5e', '[\"*\"]', NULL, NULL, '2026-02-26 22:21:28', '2026-02-26 22:21:28'),
(195, 'App\\Models\\User', 1, 'auth_token', '36effaa617ade33fe1af5b04e834941797234e9fcae2c38bc71449d9cd657d72', '[\"*\"]', '2026-02-26 23:50:24', NULL, '2026-02-26 22:24:16', '2026-02-26 23:50:24'),
(198, 'App\\Models\\User', 1, 'auth_token', 'c939cc6bbad4659fc192e0162a56ec9d03c4595ff7364bc8e702d29124fdc106', '[\"*\"]', '2026-02-28 00:08:29', NULL, '2026-02-27 16:36:57', '2026-02-28 00:08:29'),
(201, 'App\\Models\\User', 50, 'auth_token', 'eb96714174c112761b2214502a1a345fb647996b01c8d0184ad31c0dc54bd961', '[\"*\"]', '2026-02-27 16:57:34', NULL, '2026-02-27 16:57:22', '2026-02-27 16:57:34'),
(203, 'App\\Models\\User', 50, 'auth_token', '6b43db9be398f3d4fadaa5c79f7c7796ab119069695a09c2059fa4ceb398df7b', '[\"*\"]', '2026-02-27 23:40:44', NULL, '2026-02-27 23:12:13', '2026-02-27 23:40:44'),
(205, 'App\\Models\\User', 50, 'auth_token', '470853bb93b98470c6a2bce4d8d1064011a5125baaab59ccb74c0275cc1b2c1a', '[\"*\"]', '2026-02-27 23:52:58', NULL, '2026-02-27 23:52:44', '2026-02-27 23:52:58'),
(206, 'App\\Models\\User', 1, 'auth_token', 'b04f7a90ec1b6fb28d1bea2c39f95d6e1a8a227e4141b7b481f3ac1dc7b04d1a', '[\"*\"]', NULL, NULL, '2026-02-28 00:10:26', '2026-02-28 00:10:26'),
(207, 'App\\Models\\User', 1, 'auth_token', '973d2f4cd31f8743af58a882892e29158f935c030e1375bbcab2e61e968fb57c', '[\"*\"]', '2026-02-28 00:53:08', NULL, '2026-02-28 00:10:47', '2026-02-28 00:53:08'),
(209, 'App\\Models\\User', 1, 'auth_token', '1bfc3c1ddb4e511b53182d90e8013aaf47f2dab5533c9bc9c676b68f0af57625', '[\"*\"]', '2026-02-28 00:27:03', NULL, '2026-02-28 00:24:55', '2026-02-28 00:27:03'),
(210, 'App\\Models\\User', 1, 'auth_token', '972efdc7794ad11ed79ad756a338bbdf4d8eb1a62f1d8543a7bcf1a847523869', '[\"*\"]', '2026-02-28 00:27:40', NULL, '2026-02-28 00:25:59', '2026-02-28 00:27:40'),
(212, 'App\\Models\\User', 51, 'auth_token', '1065f9c326e0d63e9a99e7f4a22540a48203e2995ba5533ad79b4526f58c9cde', '[\"*\"]', '2026-02-28 00:36:08', NULL, '2026-02-28 00:30:48', '2026-02-28 00:36:08'),
(213, 'App\\Models\\User', 1, 'auth_token', 'c3c3c26e841cc0f60081437969dd83213b794a9804b70358949732df3328b8b6', '[\"*\"]', NULL, NULL, '2026-02-28 00:34:46', '2026-02-28 00:34:46'),
(215, 'App\\Models\\User', 1, 'auth_token', '44f96f5f32b5a747b5a840867b1c72e3903bf82dabe387f58a6be603332ed570', '[\"*\"]', '2026-02-28 02:21:18', NULL, '2026-02-28 01:06:44', '2026-02-28 02:21:18'),
(218, 'App\\Models\\User', 55, 'auth_token', '0b290258611be66b1b2ba4ae296ab25fb6952250881397adbb0e34000b10b073', '[\"*\"]', '2026-03-09 18:31:41', NULL, '2026-03-09 17:53:23', '2026-03-09 18:31:41'),
(219, 'App\\Models\\User', 56, 'auth_token', '8b85a6d83791762be56b965127441ab8b459d998d9dcb83ed54e94abcb31a462', '[\"*\"]', '2026-03-09 19:54:52', NULL, '2026-03-09 19:45:33', '2026-03-09 19:54:52'),
(223, 'App\\Models\\User', 57, 'auth_token', '8219ae7027cd404113643b63000f8db163e2e42cfb1fddfda09d71429656dfa3', '[\"*\"]', '2026-03-11 18:00:14', NULL, '2026-03-11 17:59:05', '2026-03-11 18:00:14'),
(224, 'App\\Models\\User', 57, 'auth_token', '9742ef1099d372bc7ab762c1dcbf25250ca2d893c3cada52f9778122887e1fbe', '[\"*\"]', '2026-03-11 18:24:01', NULL, '2026-03-11 18:23:50', '2026-03-11 18:24:01'),
(225, 'App\\Models\\User', 57, 'auth_token', '2ed25b46207824cd88554fc59bb8c852dc702079a83c84b02485f5f9bd4783d6', '[\"*\"]', '2026-03-11 18:31:43', NULL, '2026-03-11 18:29:29', '2026-03-11 18:31:43'),
(226, 'App\\Models\\User', 57, 'auth_token', 'e2740ca3a581601bdcd4a98667c6b536740651666fc6239090a5d25aaea54c73', '[\"*\"]', '2026-03-11 18:37:13', NULL, '2026-03-11 18:36:33', '2026-03-11 18:37:13'),
(233, 'App\\Models\\User', 58, 'auth_token', 'b0a0f254f1dbfffa63c7e90d2a1a790d29a7635e75036fde3f2c9fc03d9e40f6', '[\"*\"]', '2026-03-11 19:34:20', NULL, '2026-03-11 19:22:32', '2026-03-11 19:34:20');

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `plan_type` enum('basic','nutrition','elite','vip') NOT NULL,
  `duration` enum('1month','3months','6months') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `original_amount` decimal(10,2) DEFAULT NULL,
  `discount_percentage` int(11) NOT NULL DEFAULT 0,
  `payment_method` enum('paypal','bank_transfer') NOT NULL,
  `status` enum('pending','approved','rejected','cancelled') NOT NULL DEFAULT 'pending',
  `paypal_order_id` varchar(191) DEFAULT NULL,
  `paypal_payer_id` varchar(191) DEFAULT NULL,
  `bank_transfer_number` varchar(191) DEFAULT NULL,
  `bank_receipt_path` varchar(191) DEFAULT NULL,
  `currency` varchar(191) NOT NULL DEFAULT 'USD',
  `notes` text DEFAULT NULL,
  `starts_at` timestamp NULL DEFAULT NULL,
  `ends_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `user_id`, `plan_type`, `duration`, `amount`, `original_amount`, `discount_percentage`, `payment_method`, `status`, `paypal_order_id`, `paypal_payer_id`, `bank_transfer_number`, `bank_receipt_path`, `currency`, `notes`, `starts_at`, `ends_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(122, 43, 'basic', '1month', 39.00, 39.00, 0, 'paypal', 'pending', '7D615276WC761974E', NULL, NULL, NULL, 'USD', NULL, NULL, NULL, '2026-02-25 21:05:02', '2026-02-25 21:05:03', NULL),
(123, 43, 'basic', '1month', 39.00, 39.00, 0, 'paypal', 'approved', '2NU72920WH406135M', '5RC9SQ5TSDA3S', NULL, NULL, 'USD', NULL, '2026-02-25 21:07:53', '2026-03-25 21:07:53', '2026-02-25 21:06:42', '2026-02-25 21:07:53', NULL),
(168, 58, 'basic', '1month', 39.00, 39.00, 0, 'paypal', 'pending', '6UH5245211412101M', NULL, NULL, NULL, 'USD', NULL, NULL, NULL, '2026-03-11 19:20:49', '2026-03-11 19:20:49', NULL),
(169, 58, 'elite', '1month', 79.00, 79.00, 0, 'paypal', 'pending', '9PR38883EA159651N', NULL, NULL, NULL, 'USD', NULL, NULL, NULL, '2026-03-11 19:22:50', '2026-03-11 19:22:50', NULL),
(170, 58, 'vip', '1month', 149.00, 149.00, 0, 'paypal', 'pending', '9VE830727N952301K', NULL, NULL, NULL, 'USD', NULL, NULL, NULL, '2026-03-11 19:30:44', '2026-03-11 19:30:44', NULL),
(171, 58, 'vip', '1month', 149.00, 149.00, 0, 'paypal', 'pending', '0XE03108JL930403C', NULL, NULL, NULL, 'USD', NULL, NULL, NULL, '2026-03-11 19:31:58', '2026-03-11 19:31:58', NULL),
(172, 58, 'basic', '1month', 39.00, 39.00, 0, 'paypal', 'pending', '2DU30487XM948993K', NULL, NULL, NULL, 'USD', NULL, NULL, NULL, '2026-03-11 19:46:15', '2026-03-11 19:46:15', NULL),
(173, 58, 'elite', '3months', 225.00, 237.00, 5, 'paypal', 'pending', '0CN53718U83402255', NULL, NULL, NULL, 'USD', NULL, NULL, NULL, '2026-03-11 19:47:22', '2026-03-11 19:47:23', NULL),
(174, 58, 'basic', '1month', 39.00, 39.00, 0, 'paypal', 'pending', '3CL02523Y72945057', NULL, NULL, NULL, 'USD', NULL, NULL, NULL, '2026-03-11 22:54:13', '2026-03-11 22:54:13', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `image_path` varchar(191) DEFAULT NULL,
  `image_name` varchar(191) DEFAULT NULL,
  `name_en` varchar(191) NOT NULL,
  `name_ar` varchar(191) NOT NULL,
  `title_en` varchar(191) NOT NULL,
  `title_ar` varchar(191) NOT NULL,
  `text_en` text NOT NULL,
  `text_ar` text NOT NULL,
  `rating` tinyint(4) NOT NULL DEFAULT 5,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `image_path`, `image_name`, `name_en`, `name_ar`, `title_en`, `title_ar`, `text_en`, `text_ar`, `rating`, `order`, `is_active`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(9, 'images/testimonials/testimonial_1772063879_B9hULd17Sz.jpeg', 'testimonial_1772063879_B9hULd17Sz.jpeg', 'Ahmad', 'احمد', 'Student', 'طالب جامعي', 'Honestly, my experience was excellent from start to finish. From the moment I subscribed, I felt real support and genuine follow-up. The plan was clear and perfectly tailored to my goals, and I started seeing noticeable results in a short time. I highly recommend it to anyone who wants real progress and meaningful results.', 'بصراحة تجربتي كانت ممتازة جداً، من أول ما اشتركت حسّيت بالاهتمام والمتابعة الحقيقية. الخطة كانت واضحة ومناسبة لهدفي، والنتائج بدأت تظهر بشكل ملحوظ خلال فترة قصيرة. أنصح أي شخص حاب يطور من نفسه ويشوف نتائج فعلية إنه يجرب بدون تردد.', 5, 0, 1, 1, '2026-02-25 23:57:33', '2026-02-28 01:10:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `testimonials_section`
--

CREATE TABLE `testimonials_section` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `badge_en` varchar(191) DEFAULT NULL,
  `badge_ar` varchar(191) DEFAULT NULL,
  `title_en` varchar(191) NOT NULL,
  `title_ar` varchar(191) NOT NULL,
  `description_en` text DEFAULT NULL,
  `description_ar` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `testimonials_section`
--

INSERT INTO `testimonials_section` (`id`, `badge_en`, `badge_ar`, `title_en`, `title_ar`, `description_en`, `description_ar`, `is_active`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(4, 'Client Testemonials', 'آراء المتدربين', 'Inspiring Sucess Stories', 'قصص نجاح ملهمة', 'Listen To Our Clients Experinse', 'استمع لتجارب متدربينا', 1, 1, '2026-02-25 17:44:34', '2026-02-28 01:10:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `language` varchar(2) NOT NULL DEFAULT 'ar',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `avatar` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL COMMENT 'Height in cm',
  `weight` decimal(5,2) DEFAULT NULL COMMENT 'Current weight in kg',
  `waist` decimal(5,2) DEFAULT NULL COMMENT 'Waist measurement in cm',
  `hips` decimal(5,2) DEFAULT NULL COMMENT 'Hips measurement in cm (for females)',
  `age` int(11) DEFAULT NULL,
  `gender` enum('male','female') DEFAULT NULL,
  `goal` enum('weight-loss','muscle-gain','toning','fitness') DEFAULT NULL,
  `workout_place` enum('home','gym') DEFAULT NULL,
  `program` varchar(191) DEFAULT NULL COMMENT 'Selected training program',
  `health_notes` text DEFAULT NULL COMMENT 'Injuries, allergies, medications, etc.',
  `has_active_subscription` tinyint(1) NOT NULL DEFAULT 0,
  `subscription_start_date` date DEFAULT NULL,
  `subscription_end_date` date DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--


-- --------------------------------------------------------

--
-- Table structure for table `user_goals`
--

CREATE TABLE `user_goals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `goal_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_questions`
--

CREATE TABLE `user_questions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `question` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `read_by` bigint(20) UNSIGNED DEFAULT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_questions`
--

INSERT INTO `user_questions` (`id`, `name`, `email`, `question`, `is_read`, `read_by`, `read_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(7, 'محمد', 'mohammed@gmail.com', 'مرحبا', 0, NULL, NULL, '2026-02-25 13:05:14', '2026-02-25 13:05:14', NULL),
(8, 'Test', 'test@test.com', 'Test', 1, 1, '2026-02-28 01:12:22', '2026-02-28 01:12:05', '2026-02-28 01:12:22', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `workout_exercises`
--

CREATE TABLE `workout_exercises` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `workout_plan_id` bigint(20) UNSIGNED NOT NULL,
  `exercise_date` date NOT NULL,
  `name` varchar(191) NOT NULL,
  `sets` int(11) NOT NULL DEFAULT 3,
  `reps` int(11) NOT NULL DEFAULT 12,
  `notes` text DEFAULT NULL,
  `youtube_url` varchar(191) DEFAULT NULL,
  `video_file` varchar(191) DEFAULT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `workout_exercises`
--

INSERT INTO `workout_exercises` (`id`, `workout_plan_id`, `exercise_date`, `name`, `sets`, `reps`, `notes`, `youtube_url`, `video_file`, `completed`, `completed_at`, `order`, `created_at`, `updated_at`) VALUES
(20, 13, '2026-02-26', 'سكوات وزن جسم', 3, 12, 'حافظ على استقامة الظهر، انزل ببطء واطلع بدفع من الكعبين', ' https://www.youtube.com/watch?v=aclHkVaku9U رفع فيديو  إضافة تمرين الجمعة  2026-02-27 0 تمرين 0%  السبت  2026-02-28 0 تمرين 0%', NULL, 1, '2026-02-26 22:11:27', 0, '2026-02-26 22:04:35', '2026-02-26 23:13:55'),
(21, 13, '2026-02-26', 'ضغط صدر (Push-Ups)', 3, 12, 'الجسم مستقيم، شد البطن، النزول ببطء والصعود بتحكم', ' https://www.youtube.com/watch?v=_l3ySVKYVJ8 رفع فيديو  إضافة تمرين الجمعة  2026-02-27 0 تمرين 0%  السبت  2026-02-28 0 تمرين 0%', NULL, 0, NULL, 1, '2026-02-26 22:04:35', '2026-02-26 23:13:55'),
(27, 13, '2026-02-01', 'احماء ', 5, 15, 'تمرين بسيط ', 'https://youtu.be/A2vcSgLOals?si=qrxUMQf9rBUK9Tw2', NULL, 0, NULL, 2, '2026-02-26 23:36:43', '2026-02-26 23:36:43'),
(29, 17, '2026-02-27', 'test', 3, 12, 'testtt tsesgv', 'https://www.youtube.com/watch?v=R3ehmkjffU0&list=RDR3ehmkjffU0&start_radio=1', NULL, 1, '2026-02-27 23:39:21', 2, '2026-02-27 16:46:39', '2026-02-28 00:14:51'),
(30, 17, '2026-02-01', 'Test', 3, 12, 'Test', 'https://youtu.be/wRR8HUMdh00', NULL, 0, NULL, 0, '2026-02-28 00:11:22', '2026-02-28 00:12:49'),
(31, 17, '2026-02-01', 'Tesssttt', 3, 12, 'Testtt\nTgbxhd\nTeshts\nGsgshs', 'https://youtu.be/A2vcSgLOals', NULL, 0, NULL, 1, '2026-02-28 00:12:49', '2026-02-28 00:14:51'),
(32, 17, '2026-02-01', 'Testtt', 3, 12, 'Tetss \nT free rhb\nShehehzgvs\nHdhsh', 'https://youtu.be/A2vcSgLOals?si=4MIBAIAMCT4fN9ma', NULL, 0, NULL, 3, '2026-02-28 00:14:51', '2026-02-28 00:14:51');

-- --------------------------------------------------------

--
-- Table structure for table `workout_plans`
--

CREATE TABLE `workout_plans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `month_start_date` date NOT NULL,
  `month_end_date` date NOT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `workout_plans`
--

INSERT INTO `workout_plans` (`id`, `user_id`, `month_start_date`, `month_end_date`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(11, 31, '2026-02-01', '2026-02-28', 1, 1, '2026-02-05 09:01:07', '2026-02-05 09:01:07', NULL),
(12, 39, '2026-02-01', '2026-02-28', 1, 1, '2026-02-25 03:44:14', '2026-02-25 03:44:14', NULL),
(13, 43, '2026-02-01', '2026-02-28', 1, 1, '2026-02-26 22:04:35', '2026-02-26 22:04:35', NULL),
(17, 50, '2026-02-01', '2026-02-28', 1, 1, '2026-02-27 09:30:54', '2026-02-27 09:30:54', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about_coach`
--
ALTER TABLE `about_coach`
  ADD PRIMARY KEY (`id`),
  ADD KEY `about_coach_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `certifications`
--
ALTER TABLE `certifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `certifications_updated_by_foreign` (`updated_by`),
  ADD KEY `certifications_order_index` (`order`),
  ADD KEY `certifications_is_active_index` (`is_active`),
  ADD KEY `certifications_is_verified_index` (`is_verified`);

--
-- Indexes for table `chat_notifications`
--
ALTER TABLE `chat_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_notifications_message_id_foreign` (`message_id`),
  ADD KEY `chat_notifications_user_id_is_read_created_at_index` (`user_id`,`is_read`,`created_at`),
  ADD KEY `chat_notifications_conversation_id_index` (`conversation_id`);

--
-- Indexes for table `coach_features`
--
ALTER TABLE `coach_features`
  ADD PRIMARY KEY (`id`),
  ADD KEY `coach_features_about_coach_id_foreign` (`about_coach_id`),
  ADD KEY `coach_features_order_index` (`order`),
  ADD KEY `coach_features_is_active_index` (`is_active`);

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `conversations_admin_id_trainee_id_unique` (`admin_id`,`trainee_id`),
  ADD KEY `conversations_admin_id_last_message_at_index` (`admin_id`,`last_message_at`),
  ADD KEY `conversations_trainee_id_last_message_at_index` (`trainee_id`,`last_message_at`);

--
-- Indexes for table `exercises`
--
ALTER TABLE `exercises`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exercises_workout_day_id_order_index` (`workout_day_id`,`order`),
  ADD KEY `exercises_is_completed_index` (`is_completed`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `faq_questions_ar`
--
ALTER TABLE `faq_questions_ar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `faq_questions_ar_updated_by_foreign` (`updated_by`),
  ADD KEY `faq_questions_ar_order_index` (`order`),
  ADD KEY `faq_questions_ar_is_active_index` (`is_active`),
  ADD KEY `faq_questions_ar_category_index` (`category`);

--
-- Indexes for table `faq_questions_en`
--
ALTER TABLE `faq_questions_en`
  ADD PRIMARY KEY (`id`),
  ADD KEY `faq_questions_en_updated_by_foreign` (`updated_by`),
  ADD KEY `faq_questions_en_order_index` (`order`),
  ADD KEY `faq_questions_en_is_active_index` (`is_active`),
  ADD KEY `faq_questions_en_category_index` (`category`);

--
-- Indexes for table `faq_section`
--
ALTER TABLE `faq_section`
  ADD PRIMARY KEY (`id`),
  ADD KEY `faq_section_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `footers`
--
ALTER TABLE `footers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `footers_logo_id_foreign` (`logo_id`);

--
-- Indexes for table `footer_links`
--
ALTER TABLE `footer_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `footer_links_footer_id_foreign` (`footer_id`);

--
-- Indexes for table `footer_social_links`
--
ALTER TABLE `footer_social_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `footer_social_links_footer_id_foreign` (`footer_id`);

--
-- Indexes for table `goals`
--
ALTER TABLE `goals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `goals_slug_unique` (`slug`),
  ADD KEY `goals_slug_index` (`slug`),
  ADD KEY `goals_is_active_index` (`is_active`);

--
-- Indexes for table `hero_sections`
--
ALTER TABLE `hero_sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hero_sections_updated_by_foreign` (`updated_by`),
  ADD KEY `hero_sections_is_active_index` (`is_active`);

--
-- Indexes for table `hero_stats`
--
ALTER TABLE `hero_stats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hero_stats_hero_section_id_index` (`hero_section_id`),
  ADD KEY `hero_stats_order_index` (`order`),
  ADD KEY `hero_stats_is_active_index` (`is_active`);

--
-- Indexes for table `logos`
--
ALTER TABLE `logos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `logos_is_active_index` (`is_active`),
  ADD KEY `logos_created_at_index` (`created_at`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_conversation_id_created_at_index` (`conversation_id`,`created_at`),
  ADD KEY `messages_sender_id_sender_type_index` (`sender_id`,`sender_type`),
  ADD KEY `messages_is_read_conversation_id_index` (`is_read`,`conversation_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nutrition_items`
--
ALTER TABLE `nutrition_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nutrition_items_nutrition_meal_id_foreign` (`nutrition_meal_id`);

--
-- Indexes for table `nutrition_meals`
--
ALTER TABLE `nutrition_meals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nutrition_meals_nutrition_plan_id_meal_date_index` (`nutrition_plan_id`,`meal_date`);

--
-- Indexes for table `nutrition_plans`
--
ALTER TABLE `nutrition_plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nutrition_plans_created_by_foreign` (`created_by`),
  ADD KEY `nutrition_plans_updated_by_foreign` (`updated_by`),
  ADD KEY `nutrition_plans_user_id_month_start_date_index` (`user_id`,`month_start_date`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subscriptions_user_id_status_index` (`user_id`,`status`),
  ADD KEY `subscriptions_plan_type_duration_index` (`plan_type`,`duration`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `testimonials_updated_by_foreign` (`updated_by`),
  ADD KEY `testimonials_order_index` (`order`),
  ADD KEY `testimonials_is_active_index` (`is_active`),
  ADD KEY `testimonials_rating_index` (`rating`);

--
-- Indexes for table `testimonials_section`
--
ALTER TABLE `testimonials_section`
  ADD PRIMARY KEY (`id`),
  ADD KEY `testimonials_section_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_role_index` (`role`),
  ADD KEY `users_is_active_index` (`is_active`),
  ADD KEY `users_gender_index` (`gender`),
  ADD KEY `users_goal_index` (`goal`),
  ADD KEY `users_has_active_subscription_index` (`has_active_subscription`),
  ADD KEY `users_email_index` (`email`);

--
-- Indexes for table `user_goals`
--
ALTER TABLE `user_goals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_goals_user_id_goal_id_unique` (`user_id`,`goal_id`),
  ADD KEY `user_goals_user_id_index` (`user_id`),
  ADD KEY `user_goals_goal_id_index` (`goal_id`);

--
-- Indexes for table `user_questions`
--
ALTER TABLE `user_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_questions_read_by_foreign` (`read_by`),
  ADD KEY `user_questions_is_read_index` (`is_read`),
  ADD KEY `user_questions_email_index` (`email`),
  ADD KEY `user_questions_created_at_index` (`created_at`);

--
-- Indexes for table `workout_exercises`
--
ALTER TABLE `workout_exercises`
  ADD PRIMARY KEY (`id`),
  ADD KEY `workout_exercises_workout_plan_id_exercise_date_index` (`workout_plan_id`,`exercise_date`);

--
-- Indexes for table `workout_plans`
--
ALTER TABLE `workout_plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `workout_plans_created_by_foreign` (`created_by`),
  ADD KEY `workout_plans_updated_by_foreign` (`updated_by`),
  ADD KEY `workout_plans_user_id_month_start_date_index` (`user_id`,`month_start_date`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about_coach`
--
ALTER TABLE `about_coach`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `certifications`
--
ALTER TABLE `certifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `chat_notifications`
--
ALTER TABLE `chat_notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `coach_features`
--
ALTER TABLE `coach_features`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `exercises`
--
ALTER TABLE `exercises`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faq_questions_ar`
--
ALTER TABLE `faq_questions_ar`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `faq_questions_en`
--
ALTER TABLE `faq_questions_en`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `faq_section`
--
ALTER TABLE `faq_section`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `footers`
--
ALTER TABLE `footers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `footer_links`
--
ALTER TABLE `footer_links`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `footer_social_links`
--
ALTER TABLE `footer_social_links`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `goals`
--
ALTER TABLE `goals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hero_sections`
--
ALTER TABLE `hero_sections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `hero_stats`
--
ALTER TABLE `hero_stats`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `logos`
--
ALTER TABLE `logos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `nutrition_items`
--
ALTER TABLE `nutrition_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `nutrition_meals`
--
ALTER TABLE `nutrition_meals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `nutrition_plans`
--
ALTER TABLE `nutrition_plans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=236;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=175;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `testimonials_section`
--
ALTER TABLE `testimonials_section`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `user_goals`
--
ALTER TABLE `user_goals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_questions`
--
ALTER TABLE `user_questions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `workout_exercises`
--
ALTER TABLE `workout_exercises`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `workout_plans`
--
ALTER TABLE `workout_plans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
