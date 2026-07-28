-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 23, 2026 at 09:43 PM
-- Server version: 11.8.8-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Rand_Fitness`
--
USE `Rand_Fitness`;

-- --------------------------------------------------------

--
-- Table structure for table `about_coach`
--

DROP TABLE IF EXISTS `about_coach`;
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
(1, 'images/coach/coach_20260719152746_vhQ068d9.jpeg', 'coach_20260719152746_vhQ068d9.jpeg', 'About Us', 'من نحن', 'RanLogic Team - certified trainers and nutrition specialist designing personalized fitness and nutrition programs tailored to your goals and lifestyle.', 'فريق RanLogic - مدربون معتمدون وأخصائية تغذية، نصمم برامج تدريبية وغذائية مخصصة تناسب أهدافك وأسلوب حياتك.', 'At RanLogic, we provide comprehensive support that combines fitness training with proper nutrition. Our programs are carefully designed to achieve sustainable results, with continuous support from a specialized team that accompanies you every step of the way toward a better version of yourself.', 'في RanLogic، نوفر لك متابعة شاملة تجمع بين التدريب الرياضي والتغذية السليمة. برامجنا مصممة بعناية لتحقيق نتائج مستدامة، مع دعم مستمر من فريق متخصص يرافقك في كل خطوة من رحلتك نحو نسخة أفضل منك.', 'With us, you don\'t just get a workout plan; you get a partner who supports you every step of the way.', 'معنا ، لن تحصل على مجرد جدول تمارين، بل على رفيق يدعمك في كل خطوة.', 1, 1, '2026-01-18 16:02:36', '2026-07-19 15:27:46', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `certifications`
--

DROP TABLE IF EXISTS `certifications`;
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
(1, '🏆', 'Certified by', 'موثق من قبل', 'ISSA - International Sports Sciences Association', 'ISSA - الجمعية الدولية لعلوم الرياضة', 1, 0, 1, 1, '2026-01-18 15:11:56', '2026-05-20 09:51:55', '2026-05-20 09:51:55'),
(3, '⚡', 'Certified by', 'موثق من قبل', 'NSCA - National Strength & Conditioning Association', 'NSCA - الجمعية الوطنية للقوة والتكييف', 1, 2, 1, 1, '2026-01-18 15:11:56', '2026-05-20 09:51:55', '2026-05-20 09:51:55'),
(4, '🎖️', 'Certified Personal Trainer', 'مدربة شخصية معتمدة', 'NASM - National Academy of Sports Medicine', 'NASM - الأكاديمية الوطنية للطب الرياضي', 1, 3, 1, 1, '2026-01-18 15:11:56', '2026-05-20 09:51:55', '2026-05-20 09:51:55'),
(5, '🥇', 'Nutrition Specialist', 'أخصائية تغذية', 'ISSN - International Society of Sports Nutrition', 'ISSN - الجمعية الدولية للتغذية الرياضية', 1, 4, 1, 1, '2026-01-18 15:11:56', '2026-05-20 09:51:55', '2026-05-20 09:51:55'),
(7, '🏆', 'Sports Training & Rehabilitation Certificate', 'شهادة تدريب وتأهيل رياضي', 'University of Petra', 'جامعة البتراء', 1, 0, 1, 76, '2026-05-20 09:51:55', '2026-05-20 09:51:55', NULL),
(8, '🍎', 'Certified Nutritionist Specialist', 'أخصائية تغذية معتمدة', 'Jump Academy', 'Jump Academy', 1, 1, 1, 76, '2026-05-20 09:51:55', '2026-05-20 09:51:55', NULL),
(9, '⚡', 'Certified Trainer', 'مدرّبة معتمدة', 'Resistance Training Program Design Course Jump Academy', 'دورة تصميم برامج المقاومة Jump Academy', 1, 2, 1, 76, '2026-05-20 10:00:07', '2026-05-20 10:00:07', NULL),
(10, '🥗', 'Nutrition Specialist', 'أخصائية تغذية', 'Nutrition Plans Development Course Jump Academy', 'دورة وضع أنظمة غذائية Jump Academy', 1, 3, 1, 76, '2026-05-20 10:00:07', '2026-05-20 10:00:07', NULL),
(11, '💉', 'Nutrition Specialist', 'أخصائية تغذية', 'Diabetic Nutrition Plans Course Jump Academy', 'دورة أنظمة غذائية لمرضى السكري Jump Academy', 1, 4, 1, 76, '2026-05-20 10:00:07', '2026-05-20 10:00:07', NULL),
(12, '💪', 'Nutrition Specialist', 'أخصائية تغذية', 'Sports Nutrition Course Jump Academy', 'دورة تغذية الرياضيين', 1, 5, 1, 76, '2026-05-20 10:00:07', '2026-05-20 10:00:07', NULL),
(13, '📱', 'Sports Marketing Course', 'دورة تسويق رياضي', 'Jump Academy', 'Jump Academy', 1, 6, 1, 76, '2026-05-20 10:02:06', '2026-05-20 10:02:06', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `chat_notifications`
--

DROP TABLE IF EXISTS `chat_notifications`;
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

-- --------------------------------------------------------

--
-- Table structure for table `coach_features`
--

DROP TABLE IF EXISTS `coach_features`;
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
(1, 1, '🍎', 'Specialized Medical Nutrition Programs', 'أنظمة غذائية وعلاجية مختصة', 'Nutrition plans designed especially for you', 'خطط تغذية مصممة خصيصاً لك', 0, 1, '2026-01-18 16:02:36', '2026-04-26 09:49:53'),
(2, 1, '👩‍🏫', 'Online Personal Training', 'تدريب شخصي أونلاين', 'Diverse daily training and follow-up sessions', 'جلسات تدريب متنوعة ومتابعة يومية', 1, 1, '2026-01-18 16:02:36', '2026-04-26 09:49:53'),
(3, 1, '📊', 'Continuous Follow-up', 'متابعة مستمرة', 'Support and follow-up throughout the week', 'دعم ومتابعة على مدار الأسبوع', 2, 1, '2026-01-18 16:02:36', '2026-04-26 09:49:53'),
(4, 1, '💪', 'Cutting, Sculpting, Muscle Gain', 'تنشيف، نحت، زيادة عضل', 'Comprehensive programs to achieve your goals', 'برامج شاملة لتحقيق أهدافك', 3, 1, '2026-01-18 16:02:36', '2026-04-26 09:49:53');

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
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
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_archived` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `conversations`
--

INSERT INTO `conversations` (`id`, `admin_id`, `trainee_id`, `last_message`, `last_message_at`, `last_message_sender`, `admin_unread_count`, `trainee_unread_count`, `status`, `deleted_at`, `created_at`, `updated_at`, `is_archived`) VALUES
(28, 1, 68, 'ان شاء الله', '2026-06-01 11:51:07', 'admin', 0, 1, 'active', '2026-06-27 21:56:58', '2026-05-18 19:49:04', '2026-06-27 21:56:58', 0),
(36, 1, 59, 'وعليكم السلام والرحمه والاكرام', '2026-05-22 21:45:17', 'trainee', 0, 0, 'active', NULL, '2026-05-22 21:38:23', '2026-06-30 21:47:43', 0),
(37, 1, 72, 'Good luck', '2026-06-22 15:06:25', 'admin', 0, 14, 'active', '2026-06-27 21:57:05', '2026-05-23 22:15:39', '2026-06-27 21:57:05', 0);

-- --------------------------------------------------------

--
-- Table structure for table `exercises`
--

DROP TABLE IF EXISTS `exercises`;
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

DROP TABLE IF EXISTS `failed_jobs`;
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

DROP TABLE IF EXISTS `faq_questions_ar`;
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
(9, 'تيست', 'تسيت', 'تيست', '❓', 8, 1, 1, '2026-01-23 20:17:29', '2026-03-13 02:15:38', '2026-03-13 02:15:38');

-- --------------------------------------------------------

--
-- Table structure for table `faq_questions_en`
--

DROP TABLE IF EXISTS `faq_questions_en`;
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

DROP TABLE IF EXISTS `faq_section`;
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

DROP TABLE IF EXISTS `footers`;
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
(1, NULL, 'Experts in fitness and nutrition providing you with a comprehensive plan for a healthy, balanced body.', 'خبراء في اللياقة والتغذية يقدمون لك خطة متكاملة نحو جسم صحي ومتوازن.', '© 2026 RanLogic. All rights reserved.', '© 2026 RanLogic. جميع الحقوق محفوظة.', 'Quick Links', 'روابط سريعة', 'ran.logic1@gmail.com', NULL, NULL, NULL, '[{\"platform\":\"twitter\",\"url\":\"https:\\/\\/x.com\\/ranlogic?s=21\"},{\"platform\":\"youtube\",\"url\":\"https:\\/\\/youtube.com\\/@ranlogic?si=DIAY0LgycrlK11gV\"},{\"platform\":\"instagram\",\"url\":\"https:\\/\\/www.instagram.com\\/ranlogic?igsh=bGZla204cDN5bTY1\"},{\"platform\":\"alfan\",\"url\":\"https:\\/\\/alfan.link\\/ran.logic\"}]', 1, '2026-01-23 17:13:42', '2026-07-01 09:21:19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `footer_links`
--

DROP TABLE IF EXISTS `footer_links`;
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

DROP TABLE IF EXISTS `footer_social_links`;
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

DROP TABLE IF EXISTS `goals`;
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

DROP TABLE IF EXISTS `hero_sections`;
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
(1, 'videos/hero_video_20260413214054_Hq4WTHVf.mp4', 'cb3f6893-6d6f-42c1-86b6-245c22107d7b.mp4', 'video/mp4', 3617571, 'Personalized Training Program', 'برنامج تدريب شخصي', 'Invest in yourself, and build the best version of you today', '*  استثمر في نفسك، واصنع النسخة الأفضل من ذاتك اليوم.', 'Your journey toward a strong body and unshakable confidence starts here.', 'رحلتك نحو جسم قوي وثقة لا تهتز تبدأ من هنا.', 'Say goodbye to generic plans. Join a program scientifically tailored to your specific goals.', 'وداعاً للبرامج العشوائية، انضم إلى برنامج صُمم علمياً ليناسب أهدافك الخاصة.', 1, 1, '2026-01-18 14:27:27', '2026-04-13 21:40:54', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `hero_stats`
--

DROP TABLE IF EXISTS `hero_stats`;
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
-- Table structure for table `link_analytics`
--

DROP TABLE IF EXISTS `link_analytics`;
CREATE TABLE `link_analytics` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `link_id` bigint(20) UNSIGNED NOT NULL,
  `clicked_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `referer` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `link_analytics`
--

INSERT INTO `link_analytics` (`id`, `link_id`, `clicked_at`, `ip_address`, `user_agent`, `referer`) VALUES
(8, 3, '2026-04-11 08:31:51', '2a01:9700:4294:6200:c1b6:a6f9:6c36:bef1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(9, 3, '2026-04-11 08:39:09', '2a01:9700:4294:6200:c1b6:a6f9:6c36:bef1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(10, 3, '2026-04-11 08:39:34', '2a01:9700:4294:6200:c1b6:a6f9:6c36:bef1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(11, 3, '2026-04-11 15:54:43', '188.236.172.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'https://links.ranlogic.com/'),
(12, 3, '2026-04-19 15:35:30', '2a01:9700:42cf:8c00:3926:8c33:78cf:55ce', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(13, 3, '2026-04-26 13:02:06', '2a01:9700:420f:7400:fdb9:470:6cd3:4ac0', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(14, 3, '2026-04-26 13:02:57', '2a01:9700:420f:7400:fdb9:470:6cd3:4ac0', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(16, 3, '2026-04-26 13:10:39', '2a01:9700:420f:7400:fdb9:470:6cd3:4ac0', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(18, 3, '2026-05-12 23:46:42', '2a01:9700:424d:8800:5d86:36d1:d844:c154', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(24, 3, '2026-05-13 00:02:39', '2a01:9700:424d:8800:5d86:36d1:d844:c154', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(25, 3, '2026-05-13 00:15:34', '2a01:9700:424d:8800:5d86:36d1:d844:c154', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(29, 3, '2026-05-16 18:54:01', '2a01:9700:4297:2f00:d8ed:20de:9a57:8bdf', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23E261 Instagram 429.0.0.33.52 (iPhone12,5; iOS 26_4_2; en_US; en; scale=3.00; 1242x2688; IABMV/1; 966827582) Safari/604.1', 'https://links.ranlogic.com/'),
(36, 3, '2026-05-17 17:23:19', '37.40.143.249', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23E261 Instagram 426.0.0.36.74 (iPhone16,1; iOS 26_4_2; en_US; en; scale=3.00; 1179x2556; IABMV/1; 946530071) NW/3 Safari/604.1', 'https://links.ranlogic.com/'),
(37, 3, '2026-05-17 17:28:48', '154.181.148.112', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'https://links.ranlogic.com/'),
(38, 3, '2026-05-17 17:44:03', '24.40.128.6', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23F77 Instagram 429.0.0.33.52 (iPhone17,1; iOS 26_5; en_GB; en-GB; scale=3.00; 1206x2622; IABMV/1; 966827582) NW/3 Safari/604.1', 'https://links.ranlogic.com/'),
(39, 3, '2026-05-17 17:46:27', '24.40.128.6', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23F77 Instagram 429.0.0.33.52 (iPhone17,1; iOS 26_5; en_GB; en-GB; scale=3.00; 1206x2622; IABMV/1; 966827582) NW/3 Safari/604.1', 'https://links.ranlogic.com/'),
(41, 3, '2026-05-17 17:52:55', '94.109.38.104', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22C154 Instagram 429.0.0.33.52 (iPhone17,2; iOS 18_2; en_US; en; scale=3.00; 1320x2868; IABMV/1; 966827582) Safari/604.1', 'https://links.ranlogic.com/'),
(42, 3, '2026-05-17 21:02:37', '2a02:cb80:427b:1749:4187:9264:78b4:2be6', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23E261 Instagram 429.0.0.33.52 (iPhone18,2; iOS 26_4_2; en_US; en; scale=3.00; 1320x2868; IABMV/1; 966827582) Safari/604.1', 'https://links.ranlogic.com/'),
(46, 3, '2026-05-18 00:31:50', '176.28.195.238', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23E261 Instagram 429.0.0.33.52 (iPhone18,2; iOS 26_4_2; en_US; en; scale=3.00; 1320x2868; IABMV/1; 966827582) Safari/604.1', 'https://links.ranlogic.com/'),
(48, 3, '2026-05-18 04:31:34', '2a00:f28:ff4c:e54:c0f2:c11f:4dd:1de2', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/20C65 Instagram 346.0.7.32.89 (iPhone15,3; iOS 16_2; en_AE; en-AE; scale=3.00; 1290x2796; 635436977)', 'https://links.ranlogic.com/'),
(49, 3, '2026-05-18 08:04:35', '2a02:9b0:404b:26f2:88e4:cc64:b2ad:f74c', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36', 'https://links.ranlogic.com/'),
(50, 3, '2026-05-18 11:05:13', '213.244.107.153', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23F77 Instagram 429.0.0.33.52 (iPhone14,5; iOS 26_5; en_US; en; scale=3.00; 1170x2532; IABMV/1; 966827582) Safari/604.1', 'https://links.ranlogic.com/'),
(51, 3, '2026-05-18 14:50:52', '2a01:9700:4297:2f00:45c4:f803:cfcf:861a', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23E261 Instagram 429.0.0.33.52 (iPhone15,3; iOS 26_4_2; en_US; en; scale=3.00; 1290x2796; IABMV/1; 966827582) Safari/604.1', 'https://links.ranlogic.com/'),
(55, 3, '2026-05-18 23:22:09', '2a01:9700:4457:6201:7c0c:b015:e1ab:6f60', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23D8133 Instagram 429.0.0.33.52 (iPhone13,3; iOS 26_3_1; en_US; en; scale=3.00; 1170x2532; IABMV/1; 966827582) Safari/604.1', 'https://links.ranlogic.com/'),
(60, 3, '2026-05-25 16:32:50', '176.28.185.43', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23F77 Instagram 430.0.0.32.70 (iPhone18,2; iOS 26_5; en_US; en; scale=3.00; 1320x2868; IABMV/1; 972915403) Safari/604.1', 'https://links.ranlogic.com/'),
(61, 3, '2026-05-25 16:33:07', '176.28.185.43', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23F77 Instagram 430.0.0.32.70 (iPhone18,2; iOS 26_5; en_US; en; scale=3.00; 1320x2868; IABMV/1; 972915403) Safari/604.1', 'https://links.ranlogic.com/'),
(67, 3, '2026-05-25 17:49:37', '176.28.185.43', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(70, 3, '2026-06-06 20:58:50', '196.132.53.62', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23F77 Instagram 432.0.0.27.62 (iPhone12,1; iOS 26_5; en_US; en; scale=2.00; 828x1792; IABMV/1; 983743279) Safari/604.1', 'https://links.ranlogic.com/'),
(71, 3, '2026-06-06 20:59:31', '196.132.53.62', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23F77 Instagram 432.0.0.27.62 (iPhone12,1; iOS 26_5; en_US; en; scale=2.00; 828x1792; IABMV/1; 983743279) NW/3 Safari/604.1', 'https://links.ranlogic.com/'),
(77, 3, '2026-06-11 18:19:49', '106.219.212.10', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36', 'https://links.ranlogic.com/'),
(78, 3, '2026-06-11 18:21:01', '2401:4900:bdb8:d2cd::4bb:8963', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36', 'https://links.ranlogic.com/'),
(81, 3, '2026-06-13 18:43:35', '2001:16a2:f1b9:600:e9b8:c3e5:5499:b301', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(83, 3, '2026-06-15 21:35:09', '86.108.16.183', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23F77 Instagram 433.0.0.33.57 (iPhone14,3; iOS 26_5; en_US; en; scale=3.00; 1284x2778; IABMV/1; 989803374) Safari/604.1', 'https://links.ranlogic.com/'),
(84, 3, '2026-06-16 08:04:25', '176.28.143.205', 'Mozilla/5.0 (Linux; Android 16; SM-A266B Build/BP4A.251205.006; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/149.0.7827.87 Mobile Safari/537.36 Instagram 433.0.0.47.68 Android (36/16; 450dpi; 1080x2340; samsung; SM-A266B; a26x; s5e8835; ar_AE; 990700936; IABMV/1)', 'https://links.ranlogic.com/'),
(94, 3, '2026-06-29 15:50:35', '2a01:9700:4202:700:55bd:2948:9bd8:5ebb', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(95, 3, '2026-06-29 16:05:22', '2a01:9700:4202:700:55bd:2948:9bd8:5ebb', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(96, 10, '2026-06-29 16:05:32', '2a01:9700:4202:700:55bd:2948:9bd8:5ebb', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(97, 11, '2026-06-29 16:05:42', '2a01:9700:4202:700:55bd:2948:9bd8:5ebb', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(98, 12, '2026-06-29 16:05:48', '2a01:9700:4202:700:55bd:2948:9bd8:5ebb', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(99, 13, '2026-06-29 16:05:53', '2a01:9700:4202:700:55bd:2948:9bd8:5ebb', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(100, 14, '2026-06-29 16:05:57', '2a01:9700:4202:700:55bd:2948:9bd8:5ebb', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(101, 13, '2026-06-29 16:08:09', '2a01:9700:4202:700:55bd:2948:9bd8:5ebb', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(102, 11, '2026-06-30 01:03:03', '31.215.247.100', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22H352 Twitter for iPhone/12.3', 'https://links.ranlogic.com/'),
(103, 11, '2026-07-01 05:28:14', '2a02:9b0:4029:b1ca:b1b8:7ba6:3ae:ebe3', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', 'https://links.ranlogic.com/'),
(104, 11, '2026-07-01 09:29:10', '5.21.134.185', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(105, 12, '2026-07-01 09:33:40', '5.21.134.185', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(106, 11, '2026-07-04 14:18:05', '2600:382:aff8:29ae:d15a:9d03:75be:e673', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23F81 Twitter for iPhone/12.5', 'https://links.ranlogic.com/'),
(107, 11, '2026-07-06 17:44:33', '2001:1a40:1003:ed00:c5e9:a9c4:238:2c2c', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36', 'https://links.ranlogic.com/'),
(108, 12, '2026-07-06 18:44:31', '2a02:9b0:4000:e9a6:a3ca:af39:6fb3:f712', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', 'https://links.ranlogic.com/'),
(109, 14, '2026-07-06 18:46:56', '2a02:9b0:4000:e9a6:a3ca:af39:6fb3:f712', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', 'https://links.ranlogic.com/'),
(110, 3, '2026-07-06 18:48:03', '2a02:9b0:4000:e9a6:a3ca:af39:6fb3:f712', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', 'https://links.ranlogic.com/'),
(111, 14, '2026-07-06 18:48:08', '2a02:9b0:4000:e9a6:a3ca:af39:6fb3:f712', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', 'https://links.ranlogic.com/'),
(112, 14, '2026-07-09 11:34:46', '2a0a:ef40:1b0d:6a01:d0b2:8c72:b09:38f9', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23F81 Instagram 437.2.0.25.50 (iPhone18,1; iOS 26_5_1; en_GB; en-GB; scale=3.00; 1206x2622; IABMV/1; 1012573892) Safari/604.1', 'https://links.ranlogic.com/'),
(113, 10, '2026-07-09 11:35:08', '2a0a:ef40:1b0d:6a01:d0b2:8c72:b09:38f9', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23F81 Instagram 437.2.0.25.50 (iPhone18,1; iOS 26_5_1; en_GB; en-GB; scale=3.00; 1206x2622; IABMV/1; 1012573892) Safari/604.1', 'https://links.ranlogic.com/'),
(114, 13, '2026-07-09 11:36:11', '2a0a:ef40:1b0d:6a01:d0b2:8c72:b09:38f9', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23F81 Twitter for iPhone/12.6.1', 'https://links.ranlogic.com/'),
(115, 11, '2026-07-10 18:48:28', '176.29.222.27', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(116, 10, '2026-07-10 18:48:31', '176.29.222.27', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(117, 13, '2026-07-11 18:18:39', '176.29.78.244', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_5_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23F84 Twitter for iPhone/12.7', 'https://links.ranlogic.com/'),
(118, 12, '2026-07-11 18:22:36', '2a09:bac3:4246:1eb::31:1b7', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5.2 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(119, 3, '2026-07-11 18:22:54', '2a09:bac3:4246:1eb::31:1b7', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5.2 Mobile/15E148 Safari/604.1', 'https://links.ranlogic.com/'),
(120, 13, '2026-07-18 14:11:24', '109.107.228.223', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36', 'https://links.ranlogic.com/'),
(121, 11, '2026-07-18 14:12:32', '109.107.228.223', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36', 'https://links.ranlogic.com/'),
(122, 13, '2026-07-18 14:16:08', '196.128.141.213', 'Mozilla/5.0 (Linux; Android 16; V2529 Build/BP2A.250605.031.A3_V000L1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/150.0.7871.118 Mobile Safari/537.36 Instagram 438.0.0.28.88 Android (36/16; 484dpi; 1080x2392; vivo; V2529; V2529; mt6878; en_US; 1017398371; IABMV/1)', 'https://links.ranlogic.com/'),
(123, 12, '2026-07-18 14:17:20', '196.128.141.213', 'Mozilla/5.0 (Linux; Android 16; V2529 Build/BP2A.250605.031.A3_V000L1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/150.0.7871.118 Mobile Safari/537.36 Instagram 438.0.0.28.88 Android (36/16; 484dpi; 1080x2392; vivo; V2529; V2529; mt6878; en_US; 1017398371; IABMV/1)', 'https://links.ranlogic.com/'),
(124, 11, '2026-07-20 06:35:09', '188.236.180.101', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36', 'https://links.ranlogic.com/');

-- --------------------------------------------------------

--
-- Table structure for table `link_links`
--

DROP TABLE IF EXISTS `link_links`;
CREATE TABLE `link_links` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `url` varchar(2048) NOT NULL,
  `icon` varchar(100) NOT NULL DEFAULT 'globe',
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `clicks` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `title_font` varchar(100) NOT NULL DEFAULT 'DM Sans',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `link_links`
--

INSERT INTO `link_links` (`id`, `title`, `url`, `icon`, `active`, `order`, `clicks`, `title_font`, `created_at`, `updated_at`) VALUES
(3, 'RanLogic website', 'https://ranlogic.com/', 'globe', 1, 1, 38, 'DM Sans', '2026-04-10 23:51:57', '2026-07-11 18:22:54'),
(10, 'X', 'https://x.com/ranlogic?s=11', 'globe', 1, 2, 3, 'DM Sans', '2026-06-29 16:00:00', '2026-07-10 18:48:31'),
(11, 'Instagram', 'https://www.instagram.com/ranlogic?igsh=enV6ZXVpMTB2MzNl&utm_source=qr', 'globe', 1, 3, 9, 'DM Sans', '2026-06-29 16:01:00', '2026-07-20 06:35:09'),
(12, 'YouTube', 'https://youtube.com/@ranlogic?si=ikD0B3UimTYOix3d', 'globe', 1, 4, 5, 'DM Sans', '2026-06-29 16:02:41', '2026-07-18 14:17:20'),
(13, 'Linkedin', 'https://www.linkedin.com/in/rand-jarrar-294195407?utm_source=share_via&utm_content=profile&utm_medium=member_ios', 'globe', 1, 5, 6, 'DM Sans', '2026-06-29 16:04:19', '2026-07-18 14:16:08'),
(14, 'alfan', 'https://alfan.link/ran.logic', 'globe', 1, 6, 4, 'DM Sans', '2026-06-29 16:05:06', '2026-07-09 11:34:46');

-- --------------------------------------------------------

--
-- Table structure for table `link_profiles`
--

DROP TABLE IF EXISTS `link_profiles`;
CREATE TABLE `link_profiles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(60) NOT NULL DEFAULT '',
  `bio` varchar(160) NOT NULL DEFAULT '',
  `avatar` varchar(500) DEFAULT NULL,
  `name_font` varchar(100) NOT NULL DEFAULT 'Syne',
  `bio_font` varchar(100) NOT NULL DEFAULT 'DM Sans',
  `instagram` varchar(500) NOT NULL DEFAULT '',
  `tiktok` varchar(500) NOT NULL DEFAULT '',
  `youtube` varchar(500) NOT NULL DEFAULT '',
  `twitter` varchar(500) NOT NULL DEFAULT '',
  `linkedin` varchar(500) NOT NULL DEFAULT '',
  `facebook` varchar(500) NOT NULL DEFAULT '',
  `github` varchar(500) NOT NULL DEFAULT '',
  `twitch` varchar(500) NOT NULL DEFAULT '',
  `telegram` varchar(500) NOT NULL DEFAULT '',
  `whatsapp` varchar(500) NOT NULL DEFAULT '',
  `discord` varchar(500) NOT NULL DEFAULT '',
  `snapchat` varchar(500) NOT NULL DEFAULT '',
  `pinterest` varchar(500) NOT NULL DEFAULT '',
  `website` varchar(500) NOT NULL DEFAULT '',
  `podcast` varchar(500) NOT NULL DEFAULT '',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `theme_id` varchar(50) NOT NULL DEFAULT 'minimal'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `link_profiles`
--

INSERT INTO `link_profiles` (`id`, `name`, `bio`, `avatar`, `name_font`, `bio_font`, `instagram`, `tiktok`, `youtube`, `twitter`, `linkedin`, `facebook`, `github`, `twitch`, `telegram`, `whatsapp`, `discord`, `snapchat`, `pinterest`, `website`, `podcast`, `created_at`, `updated_at`, `theme_id`) VALUES
(1, 'RanLogic', 'RanLogic - منصة التحول البدني المتكاملة خُبراء في التدريب الشخصي والتغذية الصحية. برامج ذكية ومخصصة بإشراف فريقنا (مدرب، مدربة، وأخصائية تغذية)', 'https://api.ranlogic.com/storage/link_avatars/oHSGPk6RjFpVOxyDoI6aQfvaookX4YY2IbfNabvr.png', 'Exo 2', 'DM Serif Display', '', '', '', '', '', '', '', '', '', '', '', '', '', 'https://ranlogic.com/', '', '2026-04-10 13:56:31', '2026-06-29 15:49:20', 'minimal');

-- --------------------------------------------------------

--
-- Table structure for table `link_social_analytics`
--

DROP TABLE IF EXISTS `link_social_analytics`;
CREATE TABLE `link_social_analytics` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `platform` varchar(50) NOT NULL,
  `clicked_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `link_social_analytics`
--

INSERT INTO `link_social_analytics` (`id`, `platform`, `clicked_at`, `ip_address`, `user_agent`) VALUES
(5, 'twitter', '2026-04-11 15:53:37', '188.236.172.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36'),
(6, 'twitter', '2026-04-26 13:09:11', '2a01:9700:420f:7400:fdb9:470:6cd3:4ac0', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1'),
(7, 'twitter', '2026-06-29 15:32:13', '2a01:9700:4202:700:55bd:2948:9bd8:5ebb', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1'),
(8, 'website', '2026-06-29 15:49:52', '2a01:9700:4202:700:55bd:2948:9bd8:5ebb', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1'),
(9, 'website', '2026-07-01 22:04:28', '109.107.225.150', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1'),
(10, 'website', '2026-07-06 18:45:08', '2a02:9b0:4000:e9a6:a3ca:af39:6fb3:f712', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36'),
(11, 'website', '2026-07-13 12:39:16', '197.32.33.197', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36');

-- --------------------------------------------------------

--
-- Table structure for table `logos`
--

DROP TABLE IF EXISTS `logos`;
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

DROP TABLE IF EXISTS `messages`;
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
(105, 28, 1, 'admin', 'text', 'يسعد اوقاتك باسل', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-19 09:30:38', 'read', '2026-06-27 21:56:58', '2026-05-18 20:18:24', '2026-06-27 21:56:58'),
(106, 28, 1, 'admin', 'text', 'تم تفعيل اشتراكك', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-19 09:30:38', 'read', '2026-06-27 21:56:58', '2026-05-18 20:18:37', '2026-06-27 21:56:58'),
(107, 28, 1, 'admin', 'text', 'بدنا منك تتأكد من معلومة', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-19 09:30:38', 'read', '2026-06-27 21:56:58', '2026-05-18 20:19:37', '2026-06-27 21:56:58'),
(108, 28, 1, 'admin', 'text', 'محيط الخصر', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-19 09:30:38', 'read', '2026-06-27 21:56:58', '2026-05-18 20:19:43', '2026-06-27 21:56:58'),
(109, 28, 1, 'admin', 'text', 'والرجاء تبعتلنا قائمة الأطعمة اللي ما بتاكلها', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-19 09:30:38', 'read', '2026-06-27 21:56:58', '2026-05-18 20:20:32', '2026-06-27 21:56:58'),
(110, 28, 1, 'admin', 'text', 'وقت وجباتك المعتاد', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-19 09:30:38', 'read', '2026-06-27 21:56:58', '2026-05-18 20:21:31', '2026-06-27 21:56:58'),
(111, 28, 1, 'admin', 'text', 'كم ساعة بتنام', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-19 09:30:38', 'read', '2026-06-27 21:56:58', '2026-05-18 20:21:38', '2026-06-27 21:56:58'),
(112, 28, 1, 'admin', 'text', 'كم بتتمرن بالجيم', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-19 09:30:38', 'read', '2026-06-27 21:56:58', '2026-05-18 20:21:56', '2026-06-27 21:56:58'),
(113, 28, 1, 'admin', 'text', 'وبدنا تعطينا رنج السعرات اللي بتحرقها بالتمرين', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-19 09:30:38', 'read', '2026-06-27 21:56:58', '2026-05-18 20:28:03', '2026-06-27 21:56:58'),
(114, 28, 68, 'trainee', 'text', 'اهلا يعطيكم العافيه', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-19 10:52:25', 'read', '2026-06-27 21:56:58', '2026-05-19 09:31:16', '2026-06-27 21:56:58'),
(115, 28, 68, 'trainee', 'text', 'محيط خصري تقريبا 34', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-19 10:52:25', 'read', '2026-06-27 21:56:58', '2026-05-19 09:31:36', '2026-06-27 21:56:58'),
(116, 28, 68, 'trainee', 'text', 'الخضروات ما باكلها نهائي', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-19 10:52:25', 'read', '2026-06-27 21:56:58', '2026-05-19 09:31:53', '2026-06-27 21:56:58'),
(117, 28, 68, 'trainee', 'text', 'بالعاده باكل ساندويشه على ال 8 و وحده على ال 11 وبتغدا على 5:30 والعشا ما بين ال 10-11', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-19 10:52:25', 'read', '2026-06-27 21:56:58', '2026-05-19 09:32:42', '2026-06-27 21:56:58'),
(118, 28, 68, 'trainee', 'text', 'طبعا بايام الدوام هاد الحكي', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-19 10:52:25', 'read', '2026-06-27 21:56:58', '2026-05-19 09:33:51', '2026-06-27 21:56:58'),
(119, 28, 68, 'trainee', 'text', 'بتدرب 5 مرات بالاسبوع بالعاده المده من 30-45 دقيقه عضله وحده باليوم', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-19 10:52:25', 'read', '2026-06-27 21:56:58', '2026-05-19 09:34:41', '2026-06-27 21:56:58'),
(120, 28, 1, 'admin', 'text', 'تمام خلال 24 ساعة بتكون خطتك جاهزة', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-19 11:00:21', 'read', '2026-06-27 21:56:58', '2026-05-19 10:59:40', '2026-06-27 21:56:58'),
(121, 28, 1, 'admin', 'text', 'مساء الخير', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-20 18:42:46', 'read', '2026-06-27 21:56:58', '2026-05-20 16:27:29', '2026-06-27 21:56:58'),
(122, 28, 1, 'admin', 'text', 'النظام جاهز مستر باسل', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-20 18:42:46', 'read', '2026-06-27 21:56:58', '2026-05-20 16:27:43', '2026-06-27 21:56:58'),
(123, 28, 1, 'admin', 'text', 'رح نطبق اول اسبوع واذا ما ناسبك رح نستبدله', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-20 18:42:46', 'read', '2026-06-27 21:56:58', '2026-05-20 16:28:31', '2026-06-27 21:56:58'),
(124, 28, 1, 'admin', 'text', 'واذا عندك اي ملاحظات او استفسار تفضل', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-20 18:42:46', 'read', '2026-06-27 21:56:58', '2026-05-20 16:28:54', '2026-06-27 21:56:58'),
(125, 28, 68, 'trainee', 'text', 'شكراً كتير الكم', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-21 19:42:27', 'read', '2026-06-27 21:56:58', '2026-05-20 19:57:09', '2026-06-27 21:56:58'),
(133, 36, 1, 'admin', 'text', 'السلام عليكم', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-22 21:45:02', 'read', '2026-06-30 19:41:22', '2026-05-22 21:43:35', '2026-06-30 19:41:22'),
(134, 36, 1, 'admin', 'text', 'How r u', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-22 21:45:02', 'read', '2026-06-30 19:41:22', '2026-05-22 21:43:58', '2026-06-30 19:41:22'),
(135, 36, 59, 'trainee', 'text', 'وعليكم السلام والرحمه والاكرام', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-22 21:46:16', 'read', '2026-06-30 19:41:22', '2026-05-22 21:45:17', '2026-06-30 19:41:22'),
(136, 37, 1, 'admin', 'text', 'مرحبا مرح', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-25 08:58:23', 'read', '2026-06-27 21:57:05', '2026-05-24 22:45:41', '2026-06-27 21:57:05'),
(137, 37, 1, 'admin', 'text', 'خطتك جاهزة', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-25 08:58:23', 'read', '2026-06-27 21:57:05', '2026-05-24 22:45:48', '2026-06-27 21:57:05'),
(138, 37, 1, 'admin', 'text', 'إذا عندك اي استفسار', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-25 08:58:23', 'read', '2026-06-27 21:57:05', '2026-05-24 22:46:37', '2026-06-27 21:57:05'),
(139, 37, 1, 'admin', 'text', 'تواصلي معنا', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-25 08:58:23', 'read', '2026-06-27 21:57:05', '2026-05-24 22:47:28', '2026-06-27 21:57:05'),
(140, 37, 72, 'trainee', 'text', 'يسلمو دياتك ❤️', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-25 09:07:50', 'read', '2026-06-27 21:57:05', '2026-05-25 09:01:53', '2026-06-27 21:57:05'),
(141, 37, 72, 'trainee', 'text', 'ان شاءالله رح أبدأ فيه', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-25 09:07:50', 'read', '2026-06-27 21:57:05', '2026-05-25 09:02:09', '2026-06-27 21:57:05'),
(142, 37, 72, 'trainee', 'text', 'بس عادي لو السعرات كانت اقل من 1500', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-25 09:07:50', 'read', '2026-06-27 21:57:05', '2026-05-25 09:02:36', '2026-06-27 21:57:05'),
(143, 37, 1, 'admin', 'text', 'ان شاء الله', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-25 09:08:35', 'read', '2026-06-27 21:57:05', '2026-05-25 09:08:34', '2026-06-27 21:57:05'),
(144, 37, 1, 'admin', 'text', 'خلينا ماشين عليه 10 ايام', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-25 09:09:10', 'read', '2026-06-27 21:57:05', '2026-05-25 09:09:10', '2026-06-27 21:57:05'),
(145, 37, 1, 'admin', 'text', 'بعدين بس نشوف النتائج', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-25 18:23:02', 'read', '2026-06-27 21:57:05', '2026-05-25 09:09:42', '2026-06-27 21:57:05'),
(146, 37, 1, 'admin', 'text', 'بنعمل التعديلات', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-25 18:23:02', 'read', '2026-06-27 21:57:05', '2026-05-25 09:09:53', '2026-06-27 21:57:05'),
(147, 37, 1, 'admin', 'text', 'المهم الالتزام الكامل', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-25 18:23:02', 'read', '2026-06-27 21:57:05', '2026-05-25 09:10:09', '2026-06-27 21:57:05'),
(148, 37, 1, 'admin', 'text', 'لو صار في خربطه ابعتي مشان نخبرك شو تعملي ونحسب السعرات', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-25 18:23:02', 'read', '2026-06-27 21:57:05', '2026-05-25 09:10:46', '2026-06-27 21:57:05'),
(149, 37, 72, 'trainee', 'text', 'اوك ان شاءالله❤️', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-26 08:08:30', 'read', '2026-06-27 21:57:05', '2026-05-25 18:24:02', '2026-06-27 21:57:05'),
(150, 37, 72, 'trainee', 'text', 'هلا لو دخلت ضمن نظامي الصيام المتقطع بمعنى من ال6 المسا لل 10 الصبح مااكل شي غير المي', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-26 08:08:30', 'read', '2026-06-27 21:57:05', '2026-05-25 18:27:17', '2026-06-27 21:57:05'),
(151, 37, 72, 'trainee', 'text', 'يعني وجبة العشا تقريبا رح تلتغى منيح ؟', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-26 08:08:30', 'read', '2026-06-27 21:57:05', '2026-05-25 18:27:54', '2026-06-27 21:57:05'),
(152, 37, 1, 'admin', 'text', 'حضرتك متعودة تصومي صيام متقطع ؟', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-30 18:15:13', 'read', '2026-06-27 21:57:05', '2026-05-26 08:09:35', '2026-06-27 21:57:05'),
(153, 37, 1, 'admin', 'text', 'إذا آه  / خلينا نوقف وامشي على هذا النظام لمدة 10 ايام', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-30 18:15:13', 'read', '2026-06-27 21:57:05', '2026-05-26 08:10:27', '2026-06-27 21:57:05'),
(154, 37, 1, 'admin', 'text', 'عشان نكسر روتين الجسم', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-30 18:15:13', 'read', '2026-06-27 21:57:05', '2026-05-26 08:10:43', '2026-06-27 21:57:05'),
(155, 37, 1, 'admin', 'text', 'لانه الجسم إذا تعود على شي بعمل بلوك !', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-30 18:15:13', 'read', '2026-06-27 21:57:05', '2026-05-26 08:11:19', '2026-06-27 21:57:05'),
(156, 37, 1, 'admin', 'text', 'بعد النظام هاد رح نعمل  صيام متقطع ان شاء الله.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-30 18:15:13', 'read', '2026-06-27 21:57:05', '2026-05-26 08:12:24', '2026-06-27 21:57:05'),
(157, 37, 1, 'admin', 'text', 'كيف امورك بالتمرين ؟', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-30 18:15:13', 'read', '2026-06-27 21:57:05', '2026-05-26 08:13:53', '2026-06-27 21:57:05'),
(158, 37, 1, 'admin', 'text', 'طمنينا عنك مرح', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-30 18:15:13', 'read', '2026-06-27 21:57:05', '2026-05-27 08:17:24', '2026-06-27 21:57:05'),
(159, 37, 1, 'admin', 'text', 'كيف امورك', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-30 18:15:13', 'read', '2026-06-27 21:57:05', '2026-05-27 08:17:32', '2026-06-27 21:57:05'),
(160, 37, 1, 'admin', 'text', 'مرح ؟؟', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-30 18:15:13', 'read', '2026-06-27 21:57:05', '2026-05-28 19:49:50', '2026-06-27 21:57:05'),
(161, 37, 1, 'admin', 'text', 'ممكن تتواصلي معنا', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-30 18:15:13', 'read', '2026-06-27 21:57:05', '2026-05-28 19:49:58', '2026-06-27 21:57:05'),
(162, 38, 1, 'admin', 'text', 'test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 'sent', '2026-05-28 22:47:16', '2026-05-28 22:46:51', '2026-05-28 22:47:16'),
(163, 38, 1, 'admin', 'text', 'test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 'sent', '2026-05-28 22:58:45', '2026-05-28 22:58:20', '2026-05-28 22:58:45'),
(164, 39, 1, 'admin', 'text', 'test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 'sent', '2026-05-28 23:27:44', '2026-05-28 23:26:25', '2026-05-28 23:27:44'),
(165, 40, 1, 'admin', 'text', 'test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 'sent', '2026-05-29 01:47:11', '2026-05-29 01:46:35', '2026-05-29 01:47:11'),
(166, 37, 72, 'trainee', 'text', 'مساالخير🤦🏻‍♀️😂', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-30 20:37:55', 'read', '2026-06-27 21:57:05', '2026-05-30 18:15:55', '2026-06-27 21:57:05'),
(167, 37, 72, 'trainee', 'text', 'سوري والله بس ملتهية بشغل لازم سلمه', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-30 20:37:55', 'read', '2026-06-27 21:57:05', '2026-05-30 18:16:18', '2026-06-27 21:57:05'),
(168, 37, 72, 'trainee', 'text', 'اها الحمدلله ماشية ، الصيام المتقطع ماشيه عليه حاليا يعني كل مره بزيد شوي بالساعا', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-30 20:37:55', 'read', '2026-06-27 21:57:05', '2026-05-30 18:18:34', '2026-06-27 21:57:05'),
(169, 37, 72, 'trainee', 'text', 'بالساعات', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-30 20:37:55', 'read', '2026-06-27 21:57:05', '2026-05-30 18:18:46', '2026-06-27 21:57:05'),
(170, 37, 72, 'trainee', 'text', 'بس مشان يوم الاثنين نازله الجيم ان شاءالله', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-30 20:37:55', 'read', '2026-06-27 21:57:05', '2026-05-30 18:19:17', '2026-06-27 21:57:05'),
(171, 37, 72, 'trainee', 'text', 'اي افضل اللعب قبل ولا بعد الفطور', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-30 20:37:55', 'read', '2026-06-27 21:57:05', '2026-05-30 18:19:29', '2026-06-27 21:57:05'),
(172, 37, 72, 'trainee', 'text', '+ شو افضل تمارين ممكن العبها لتساعد بتخفيف وشد منطقة الأرداف والبطن', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-30 20:37:55', 'read', '2026-06-27 21:57:05', '2026-05-30 18:21:19', '2026-06-27 21:57:05'),
(173, 37, 1, 'admin', 'text', 'يعطيكي العافية', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-31 17:22:42', 'read', '2026-06-27 21:57:05', '2026-05-30 20:41:57', '2026-06-27 21:57:05'),
(174, 37, 1, 'admin', 'text', 'بس خبرينا انتي ماشية ب اي يوم', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-31 17:22:42', 'read', '2026-06-27 21:57:05', '2026-05-30 20:42:13', '2026-06-27 21:57:05'),
(175, 37, 1, 'admin', 'text', 'بالنسبة للتمرين لو رفع أوزان و تمارين مقاومة بعد الفطور بساعتين', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-31 17:22:42', 'read', '2026-06-27 21:57:05', '2026-05-30 20:42:49', '2026-06-27 21:57:05'),
(176, 37, 1, 'admin', 'text', 'لو كارديو او تمرين خفيف قبل الفطور', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-31 17:22:42', 'read', '2026-06-27 21:57:05', '2026-05-30 20:43:43', '2026-06-27 21:57:05'),
(177, 37, 1, 'admin', 'text', 'ما في تمرين يحرق الدهون من منطقة معينة بذاتها (خسارة الدهون الموضعية خرافة). حرق دهون البطن بكون عبر عجز السعرات الحرارية (النظام الغذائي)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-31 17:22:42', 'read', '2026-06-27 21:57:05', '2026-05-30 20:44:58', '2026-06-27 21:57:05'),
(178, 37, 1, 'admin', 'text', 'بس في تمارين بتقوي العضلة', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-31 17:22:42', 'read', '2026-06-27 21:57:05', '2026-05-30 20:45:41', '2026-06-27 21:57:05'),
(179, 37, 1, 'admin', 'text', 'Plank (البلانك) لتقوية العضلات الداخلية وجدار البطن.\n Hanging Knee Raises (رفع الركب أثناء التعلق) لأسفل البطن.\n Crunches (المطاحن) لعضلات البطن العلوية', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-31 17:22:42', 'read', '2026-06-27 21:57:05', '2026-05-30 20:46:04', '2026-06-27 21:57:05'),
(180, 37, 1, 'admin', 'text', 'Squats (السكوات) بجميع أنواعه', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-31 17:22:42', 'read', '2026-06-27 21:57:05', '2026-05-30 20:46:26', '2026-06-27 21:57:05'),
(181, 37, 1, 'admin', 'text', 'خبريني كيف الحرق عندك ؟', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-31 17:22:42', 'read', '2026-06-27 21:57:05', '2026-05-30 20:47:03', '2026-06-27 21:57:05'),
(182, 37, 1, 'admin', 'text', 'بتشربي كمية المي المطلوبة منك؟', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-31 17:22:42', 'read', '2026-06-27 21:57:05', '2026-05-30 20:47:57', '2026-06-27 21:57:05'),
(183, 37, 72, 'trainee', 'text', 'نزلت شي كيلو خلال خمس أيام وشرب المي بشرب افضل من اول بس مو بكميات كبيره يعني شي لتر باليوم', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-31 19:31:27', 'read', '2026-06-27 21:57:05', '2026-05-31 17:25:40', '2026-06-27 21:57:05'),
(184, 37, 72, 'trainee', 'text', 'التزامي صراحه مو بشكل كامل ع الخطه يلي انتي معطياني إيها يعني', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-31 19:31:27', 'read', '2026-06-27 21:57:05', '2026-05-31 17:26:40', '2026-06-27 21:57:05'),
(185, 37, 72, 'trainee', 'text', 'بشوف السعرات وشو المسموح وبحاول امشي عليه ولو تغلبت بغير بس بالمسموح', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-31 19:31:27', 'read', '2026-06-27 21:57:05', '2026-05-31 17:27:41', '2026-06-27 21:57:05'),
(186, 37, 72, 'trainee', 'text', 'مشان الجيم الأفضل العب قبل ولا بعد الفطور مابقدر قسم التمارين لانه هاد بالروح قبل او بعد', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-31 19:31:27', 'read', '2026-06-27 21:57:05', '2026-05-31 17:28:42', '2026-06-27 21:57:05'),
(187, 37, 72, 'trainee', 'text', 'بالجيم*', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-31 19:31:27', 'read', '2026-06-27 21:57:05', '2026-05-31 17:29:01', '2026-06-27 21:57:05'),
(188, 37, 1, 'admin', 'text', 'كمية المي كتير قليلة', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 19:56:00', 'read', '2026-06-27 21:57:05', '2026-05-31 19:32:42', '2026-06-27 21:57:05'),
(189, 37, 1, 'admin', 'text', 'لازم اقل شي من لترين ل ٣', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 19:56:00', 'read', '2026-06-27 21:57:05', '2026-05-31 19:33:35', '2026-06-27 21:57:05'),
(190, 37, 1, 'admin', 'text', 'ضروري التنفس العميق مع شرب الماء اثناء التمرين اكتر شي بحرق دهون', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 19:56:00', 'read', '2026-06-27 21:57:05', '2026-05-31 19:34:44', '2026-06-27 21:57:05'),
(191, 37, 1, 'admin', 'text', 'خبريني كم يوم باقي وتخلصي الدايت مشان اعطيكي نظام الصيام المتقطع', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 19:56:00', 'read', '2026-06-27 21:57:05', '2026-05-31 19:35:38', '2026-06-27 21:57:05'),
(192, 37, 1, 'admin', 'text', 'بتعرفي لو ملتزمة بالدايت كان نزلتي اكتر بس اتوقع نازلة قياسات', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 19:56:00', 'read', '2026-06-27 21:57:05', '2026-05-31 19:36:46', '2026-06-27 21:57:05'),
(193, 37, 1, 'admin', 'text', 'بس بالمجمل استمري و حاولي تلتزمي اكتر وانتي قدها أنا متأكدة رح تاخدي نتائج ممتازة', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 19:56:00', 'read', '2026-06-27 21:57:05', '2026-05-31 19:38:00', '2026-06-27 21:57:05'),
(194, 28, 1, 'admin', 'text', 'مرحبا باسل', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-01 09:00:39', 'read', '2026-06-27 21:56:58', '2026-05-31 19:38:59', '2026-06-27 21:56:58'),
(195, 28, 1, 'admin', 'text', 'شو صار معك بالنظام', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-01 09:00:39', 'read', '2026-06-27 21:56:58', '2026-05-31 19:39:12', '2026-06-27 21:56:58'),
(196, 28, 1, 'admin', 'text', 'بديت فيه ؟ ولا لسه', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-01 09:00:39', 'read', '2026-06-27 21:56:58', '2026-05-31 19:39:41', '2026-06-27 21:56:58'),
(197, 28, 68, 'trainee', 'text', 'اهلا كوتش والله للاسف ما بلشت فيه بس ان شاء الله اول ما ابلش فيه بخبركم', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-01 11:50:53', 'read', '2026-06-27 21:56:58', '2026-06-01 09:01:58', '2026-06-27 21:56:58'),
(198, 28, 1, 'admin', 'text', 'ان شاء الله', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 'sent', '2026-06-27 21:56:58', '2026-06-01 11:51:07', '2026-06-27 21:56:58'),
(199, 37, 1, 'admin', 'text', 'كيفك مرح', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 19:56:00', 'read', '2026-06-27 21:57:05', '2026-06-02 09:23:44', '2026-06-27 21:57:05'),
(200, 37, 1, 'admin', 'text', 'طمنينا عنك', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 19:56:00', 'read', '2026-06-27 21:57:05', '2026-06-02 09:23:53', '2026-06-27 21:57:05'),
(201, 37, 72, 'trainee', 'text', 'اهلين ياعيني الحمدلله أنا بخير ، النظام ماشيه عليه', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 19:58:07', 'read', '2026-06-27 21:57:05', '2026-06-02 19:57:57', '2026-06-27 21:57:05'),
(202, 37, 72, 'trainee', 'text', 'باقي شي 22 يوم', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 19:58:20', 'read', '2026-06-27 21:57:05', '2026-06-02 19:58:20', '2026-06-27 21:57:05'),
(203, 37, 1, 'admin', 'text', 'دوم تضلي بخير', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 19:58:43', 'read', '2026-06-27 21:57:05', '2026-06-02 19:58:43', '2026-06-27 21:57:05'),
(204, 37, 1, 'admin', 'text', 'خلصتي النظام', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 19:59:00', 'read', '2026-06-27 21:57:05', '2026-06-02 19:59:00', '2026-06-27 21:57:05'),
(205, 37, 1, 'admin', 'text', 'كم يوم باقي', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 19:59:07', 'read', '2026-06-27 21:57:05', '2026-06-02 19:59:07', '2026-06-27 21:57:05'),
(206, 37, 1, 'admin', 'text', 'عشان انزلك نظام غذائي جديد', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 19:59:22', 'read', '2026-06-27 21:57:05', '2026-06-02 19:59:22', '2026-06-27 21:57:05'),
(207, 37, 72, 'trainee', 'text', 'بعتذر ع ردي المتأخر بس مضغوطه بشغلي لهيك', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 19:59:33', 'read', '2026-06-27 21:57:05', '2026-06-02 19:59:32', '2026-06-27 21:57:05'),
(208, 37, 1, 'admin', 'text', 'ولا يهمك حبيبتي', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 20:01:56', 'read', '2026-06-27 21:57:05', '2026-06-02 20:00:05', '2026-06-27 21:57:05'),
(209, 37, 1, 'admin', 'text', 'المهم تكوني مرتاحه وامورك تمام', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 20:01:56', 'read', '2026-06-27 21:57:05', '2026-06-02 20:00:34', '2026-06-27 21:57:05'),
(210, 37, 1, 'admin', 'text', 'إذا عندك ملاحظات حابه نعملها بالدايت الجديد خبرينا', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 20:01:56', 'read', '2026-06-27 21:57:05', '2026-06-02 20:01:00', '2026-06-27 21:57:05'),
(211, 37, 72, 'trainee', 'text', 'باقي يومين وأخلص النظام', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 20:02:18', 'read', '2026-06-27 21:57:05', '2026-06-02 20:02:17', '2026-06-27 21:57:05'),
(212, 37, 72, 'trainee', 'text', 'ياريت 🙃', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 20:02:24', 'read', '2026-06-27 21:57:05', '2026-06-02 20:02:24', '2026-06-27 21:57:05'),
(213, 37, 72, 'trainee', 'text', 'الكابتشينو او النسكافيه ضروري', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 20:03:01', 'read', '2026-06-27 21:57:05', '2026-06-02 20:03:00', '2026-06-27 21:57:05'),
(214, 37, 72, 'trainee', 'text', 'يعني لو كاستين بالأسبوع أنا راضيه', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 20:03:11', 'read', '2026-06-27 21:57:05', '2026-06-02 20:03:11', '2026-06-27 21:57:05'),
(215, 37, 1, 'admin', 'text', 'ابعتيلي ملاحظاتك وشو حابه يكون بنظامك الجديد', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 20:03:26', 'read', '2026-06-27 21:57:05', '2026-06-02 20:03:26', '2026-06-27 21:57:05'),
(216, 37, 72, 'trainee', 'text', 'اعتماد الفطور افوكادو وبيض وخيار', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 20:04:04', 'read', '2026-06-27 21:57:05', '2026-06-02 20:04:04', '2026-06-27 21:57:05'),
(217, 37, 1, 'admin', 'text', 'بدي منك كمان وزنك و قياساتك بعد يومين ضروري', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 20:04:20', 'read', '2026-06-27 21:57:05', '2026-06-02 20:04:20', '2026-06-27 21:57:05'),
(218, 37, 72, 'trainee', 'text', 'ان شاءالله', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 20:04:31', 'read', '2026-06-27 21:57:05', '2026-06-02 20:04:30', '2026-06-27 21:57:05'),
(219, 37, 72, 'trainee', 'text', 'خليني بكرا لنا اقعد ببعتلك شو بدي أغير بنظام', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 20:05:20', 'read', '2026-06-27 21:57:05', '2026-06-02 20:05:19', '2026-06-27 21:57:05'),
(220, 37, 1, 'admin', 'text', 'تمام🌹', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 20:06:28', 'read', '2026-06-27 21:57:05', '2026-06-02 20:06:01', '2026-06-27 21:57:05'),
(221, 37, 72, 'trainee', 'text', 'هلا لازم نام لأني صراحة كتير تعبانه', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 20:06:07', 'read', '2026-06-27 21:57:05', '2026-06-02 20:06:07', '2026-06-27 21:57:05'),
(222, 37, 72, 'trainee', 'text', 'ع تواصل ان شاءالله❤️', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 20:06:16', 'read', '2026-06-27 21:57:05', '2026-06-02 20:06:16', '2026-06-27 21:57:05'),
(223, 37, 1, 'admin', 'text', 'ان شاء الله 🫶🏼', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 20:06:28', 'read', '2026-06-27 21:57:05', '2026-06-02 20:06:27', '2026-06-27 21:57:05'),
(224, 37, 72, 'trainee', 'text', '❤️❤️❤️', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-02 20:06:35', 'read', '2026-06-27 21:57:05', '2026-06-02 20:06:34', '2026-06-27 21:57:05'),
(225, 37, 72, 'trainee', 'text', 'مرحبا ، هلا بخصوص الأكل بدي وجبتين باليوم فطور وغدا لأنه الغدا بكون بعد مايروحو الاولاد من المدرسه يعني شي ساعه 4 ونص . الفطور يكون مابين 9 و 11 . الفطور دائما بيض وخيار وأفوكادو وشريحه خبز قمح . الغدا حاولي قدر الإمكان يكون طبايخ لانه صراحة أنا بعمل 90‎%‎ طبايخ لانه هيك أولادي بحبه مايحبوا الأكل الناشف ونظراً اني بشتغل ووووو فبعمل الأكل يكفي يومين وممكن كمان 3 حسب وقتي . رز اسمر مافيه قلبت الدنيا عليه عندي مالقيته🤦🏻‍♀️ ضروري لو بالإسبوع كاستين نسكافيه .', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-04 19:32:43', 'read', '2026-06-27 21:57:05', '2026-06-04 13:22:11', '2026-06-27 21:57:05'),
(226, 37, 72, 'trainee', 'text', 'هاي ملاحظاتي🤦🏻‍♀️', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-04 19:32:43', 'read', '2026-06-27 21:57:05', '2026-06-04 13:22:32', '2026-06-27 21:57:05'),
(227, 37, 1, 'admin', 'text', 'تمام', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-05 14:50:27', 'read', '2026-06-27 21:57:05', '2026-06-04 19:34:02', '2026-06-27 21:57:05'),
(228, 37, 1, 'admin', 'text', 'كيفك مرح', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-05 14:50:27', 'read', '2026-06-27 21:57:05', '2026-06-04 20:32:33', '2026-06-27 21:57:05'),
(229, 37, 1, 'admin', 'text', 'تم تجهيز النظام الغذائي والتدريبي', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-05 14:50:27', 'read', '2026-06-27 21:57:05', '2026-06-04 20:32:54', '2026-06-27 21:57:05'),
(230, 37, 1, 'admin', 'text', 'إذا عندك اي ملاحظات او تعديلات يا ريت تشوفيه و تخبرينا', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-05 14:50:27', 'read', '2026-06-27 21:57:05', '2026-06-04 20:33:53', '2026-06-27 21:57:05'),
(231, 37, 1, 'admin', 'text', 'بتمنى منك الالتزام الكامل عشان ناخد النتائج المطلوبة💪🏻', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-05 14:50:27', 'read', '2026-06-27 21:57:05', '2026-06-04 20:34:53', '2026-06-27 21:57:05'),
(232, 37, 1, 'admin', 'text', 'لا تنسي شرب الماء 📌', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-05 14:50:27', 'read', '2026-06-27 21:57:05', '2026-06-04 20:35:19', '2026-06-27 21:57:05'),
(233, 37, 1, 'admin', 'text', 'لو كان الالتزام موجود رح تشوفي بعد  10 ايام اختلاف كبير ب قياساتك و وزنك', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-05 14:50:27', 'read', '2026-06-27 21:57:05', '2026-06-04 20:36:45', '2026-06-27 21:57:05'),
(234, 37, 1, 'admin', 'text', 'Keep going 💪🏻✨', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-05 14:50:27', 'read', '2026-06-27 21:57:05', '2026-06-04 20:37:01', '2026-06-27 21:57:05'),
(235, 37, 72, 'trainee', 'text', 'صرت اشرب 3 لتر💪😂😂', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-05 20:12:49', 'read', '2026-06-27 21:57:05', '2026-06-05 14:51:11', '2026-06-27 21:57:05'),
(236, 37, 72, 'trainee', 'text', 'ان شاءالله المسا رح اقرأ النظام واخبرك لو في اي ملاحظه', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-05 20:12:49', 'read', '2026-06-27 21:57:05', '2026-06-05 14:53:58', '2026-06-27 21:57:05'),
(237, 37, 72, 'trainee', 'text', 'الأرداف 64', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-05 20:12:49', 'read', '2026-06-27 21:57:05', '2026-06-05 17:44:52', '2026-06-27 21:57:05'),
(238, 37, 72, 'trainee', 'text', 'الخصر 90', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-05 20:12:49', 'read', '2026-06-27 21:57:05', '2026-06-05 17:44:57', '2026-06-27 21:57:05'),
(239, 37, 72, 'trainee', 'text', '🤦🏻‍♀️🤦🏻‍♀️🤦🏻‍♀️🤦🏻‍♀️🤦🏻‍♀️', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-05 20:12:49', 'read', '2026-06-27 21:57:05', '2026-06-05 17:45:09', '2026-06-27 21:57:05'),
(240, 37, 1, 'admin', 'text', 'تمام', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-06 19:22:51', 'read', '2026-06-27 21:57:05', '2026-06-05 20:13:49', '2026-06-27 21:57:05'),
(241, 37, 1, 'admin', 'text', 'بطلة 🫶🏼', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-06 19:22:51', 'read', '2026-06-27 21:57:05', '2026-06-05 20:14:07', '2026-06-27 21:57:05'),
(242, 37, 1, 'admin', 'text', 'اللي بهمنا بعد ال 10 ايام تكوني نازلة وزن و دهون كمان', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-06 19:22:51', 'read', '2026-06-27 21:57:05', '2026-06-05 20:14:57', '2026-06-27 21:57:05'),
(243, 37, 1, 'admin', 'text', 'خلينا على تواصل', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-06 19:22:51', 'read', '2026-06-27 21:57:05', '2026-06-05 20:15:12', '2026-06-27 21:57:05'),
(244, 37, 72, 'trainee', 'text', 'ان شاءالله❤️❤️', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-06 22:08:20', 'read', '2026-06-27 21:57:05', '2026-06-06 19:23:13', '2026-06-27 21:57:05'),
(245, 37, 1, 'admin', 'text', 'كيفك مرح 🫶🏼', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-21 06:25:25', 'read', '2026-06-27 21:57:05', '2026-06-10 10:57:50', '2026-06-27 21:57:05'),
(246, 37, 1, 'admin', 'text', 'شو الاخبار ؟ طمنينا عنك', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-21 06:25:25', 'read', '2026-06-27 21:57:05', '2026-06-10 10:58:22', '2026-06-27 21:57:05'),
(247, 37, 1, 'admin', 'text', 'مرح', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-21 06:25:25', 'read', '2026-06-27 21:57:05', '2026-06-13 15:33:29', '2026-06-27 21:57:05'),
(248, 37, 1, 'admin', 'text', 'كيف امورك ؟', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-21 06:25:25', 'read', '2026-06-27 21:57:05', '2026-06-13 15:33:52', '2026-06-27 21:57:05'),
(249, 37, 1, 'admin', 'text', 'حابين نعرف التزامك', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-21 06:25:25', 'read', '2026-06-27 21:57:05', '2026-06-13 15:34:06', '2026-06-27 21:57:05'),
(250, 37, 1, 'admin', 'text', 'مرح؟؟؟', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-21 06:25:25', 'read', '2026-06-27 21:57:05', '2026-06-18 14:39:51', '2026-06-27 21:57:05'),
(251, 37, 1, 'admin', 'text', 'ممكن تتواصلي معنا !', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-21 06:25:25', 'read', '2026-06-27 21:57:05', '2026-06-18 14:40:17', '2026-06-27 21:57:05'),
(252, 37, 72, 'trainee', 'text', 'اهلين حبيبتي', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-22 07:59:18', 'read', '2026-06-27 21:57:05', '2026-06-21 06:25:48', '2026-06-27 21:57:05'),
(253, 37, 72, 'trainee', 'text', 'الحمدلله تمام بس التهيت كتير بقصة رسالتي والمناقشه لهيك بعتذر', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-22 07:59:18', 'read', '2026-06-27 21:57:05', '2026-06-21 06:26:22', '2026-06-27 21:57:05'),
(254, 37, 72, 'trainee', 'text', 'ملتزمه اي', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-22 07:59:18', 'read', '2026-06-27 21:57:05', '2026-06-21 06:26:54', '2026-06-27 21:57:05'),
(255, 37, 72, 'trainee', 'text', 'وزني هلا 71', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-22 07:59:18', 'read', '2026-06-27 21:57:05', '2026-06-21 06:27:04', '2026-06-27 21:57:05'),
(256, 37, 1, 'admin', 'text', 'اول شي موفقه يا رب', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 'sent', '2026-06-27 21:57:05', '2026-06-22 08:02:09', '2026-06-27 21:57:05'),
(257, 37, 1, 'admin', 'text', 'نازلة 3 k', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 'sent', '2026-06-27 21:57:05', '2026-06-22 08:02:40', '2026-06-27 21:57:05'),
(258, 37, 1, 'admin', 'text', 'لو ما كنتي مشغولة و في ستريس كان اخدتي نتيجة احسن من هيك', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 'sent', '2026-06-27 21:57:05', '2026-06-22 08:03:36', '2026-06-27 21:57:05'),
(259, 37, 1, 'admin', 'text', 'الله يوفقك حبيبتي 🤍❤️', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 'sent', '2026-06-27 21:57:05', '2026-06-22 08:04:23', '2026-06-27 21:57:05'),
(260, 37, 1, 'admin', 'text', 'مرحبا مرح', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 'sent', '2026-06-27 21:57:05', '2026-06-22 14:59:08', '2026-06-27 21:57:05'),
(261, 37, 1, 'admin', 'text', 'كيفك', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 'sent', '2026-06-27 21:57:05', '2026-06-22 14:59:12', '2026-06-27 21:57:05'),
(262, 37, 1, 'admin', 'text', 'المفروض كمان يومين يخلص الاشتراك', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 'sent', '2026-06-27 21:57:05', '2026-06-22 15:00:23', '2026-06-27 21:57:05'),
(263, 37, 1, 'admin', 'text', 'بعرف كنتي معجوقة', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 'sent', '2026-06-27 21:57:05', '2026-06-22 15:01:23', '2026-06-27 21:57:05'),
(264, 37, 1, 'admin', 'text', 'مشان هيك اليوم نزلت الك نظام high protein', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 'sent', '2026-06-27 21:57:05', '2026-06-22 15:02:21', '2026-06-27 21:57:05'),
(265, 37, 1, 'admin', 'text', 'والنظام الرياضي', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 'sent', '2026-06-27 21:57:05', '2026-06-22 15:04:15', '2026-06-27 21:57:05'),
(266, 37, 1, 'admin', 'text', 'بتعيدي الأسبوع الاول بهاد الشهر', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 'sent', '2026-06-27 21:57:05', '2026-06-22 15:05:18', '2026-06-27 21:57:05'),
(267, 37, 1, 'admin', 'text', 'ان شاء الله تستفيدي', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 'sent', '2026-06-27 21:57:05', '2026-06-22 15:05:31', '2026-06-27 21:57:05'),
(268, 37, 1, 'admin', 'text', 'و ما نكون قصّرنا معك بشي', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 'sent', '2026-06-27 21:57:05', '2026-06-22 15:06:17', '2026-06-27 21:57:05'),
(269, 37, 1, 'admin', 'text', 'Good luck', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 'sent', '2026-06-27 21:57:05', '2026-06-22 15:06:25', '2026-06-27 21:57:05');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
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

DROP TABLE IF EXISTS `nutrition_items`;
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

-- --------------------------------------------------------

--
-- Table structure for table `nutrition_meals`
--

DROP TABLE IF EXISTS `nutrition_meals`;
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

-- --------------------------------------------------------

--
-- Table structure for table `nutrition_plans`
--

DROP TABLE IF EXISTS `nutrition_plans`;
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
(13, 59, '2026-03-01', '2026-03-31', 'nutrition_pdfs/bDJYXvwJGIiE08FYxi5043O3YQbnQYTfCh2QInRM.pdf', 1, 1, '2026-03-27 20:54:31', '2026-03-27 20:54:31', NULL),
(14, 59, '2026-04-01', '2026-04-30', 'workout_pdfs/S30enYtkHgJTwavGxBpY9ktolMPi1lfWWRAqFnlN.pdf', 1, 1, '2026-04-05 00:37:19', '2026-04-15 22:08:09', NULL),
(15, 68, '2026-05-01', '2026-05-31', 'workout_pdfs/7CJJLnhdiEbyNAa6b4kfvatKywTL21Aa49OwuE29.pdf', 1, 1, '2026-05-20 16:26:33', '2026-05-20 16:26:33', NULL),
(16, 72, '2026-05-01', '2026-05-31', 'workout_pdfs/vskxYxDAJ3fAwigcX7t4pSmPO9MAW5Db2JfSB9Oj.pdf', 1, 1, '2026-05-24 22:12:27', '2026-05-24 22:12:27', NULL),
(17, 72, '2026-06-01', '2026-06-30', 'workout_pdfs/MnSSJKbpMzthlCtlA08Xuf6LY1baoXsXnHdsj6A3.pdf', 1, 1, '2026-06-04 20:14:14', '2026-06-22 14:56:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
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
(195, 'App\\Models\\User', 1, 'auth_token', '36effaa617ade33fe1af5b04e834941797234e9fcae2c38bc71449d9cd657d72', '[\"*\"]', '2026-05-20 09:26:36', NULL, '2026-02-26 22:24:16', '2026-05-20 09:26:36'),
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
(236, 'App\\Models\\User', 1, 'auth_token', '91f9edc39fe5de8aa5ed40d8c29a8b887115ce6226e52c8e73d7bab5144c0752', '[\"*\"]', '2026-03-13 02:19:56', NULL, '2026-03-13 02:12:43', '2026-03-13 02:19:56'),
(237, 'App\\Models\\User', 1, 'auth_token', 'c173c45376f3618f99d2cd850dad10d7dbfc46bd2490c0cee0d580137f113490', '[\"*\"]', '2026-03-16 21:02:15', NULL, '2026-03-13 23:36:38', '2026-03-16 21:02:15'),
(240, 'App\\Models\\User', 1, 'auth_token', 'fef5a56ae6a105d78f4ac610b6aa14ddf7d819410db73d09cd836cc4ee83de68', '[\"*\"]', '2026-04-07 09:15:07', NULL, '2026-03-16 21:13:37', '2026-04-07 09:15:07'),
(241, 'App\\Models\\User', 1, 'auth_token', '4afa8634f5744502c7cc323791e0b293f65af0602b67a59d43405b4e1df65c29', '[\"*\"]', '2026-03-16 21:16:01', NULL, '2026-03-16 21:13:58', '2026-03-16 21:16:01'),
(242, 'App\\Models\\User', 1, 'auth_token', 'e2f5033a51b48b57676a997f47b374895d1a85838d966896769bc8b205d1c80a', '[\"*\"]', '2026-03-16 21:20:40', NULL, '2026-03-16 21:20:26', '2026-03-16 21:20:40'),
(243, 'App\\Models\\User', 59, 'auth_token', 'ff49400601de073ba865617f3da3129d122b6e338bcf2d2f596a72fefcd31b6c', '[\"*\"]', '2026-03-18 19:09:23', NULL, '2026-03-18 19:08:55', '2026-03-18 19:09:23'),
(245, 'App\\Models\\User', 60, 'auth_token', '5bd3f81914bca21eff6c19344ce4589a6b688feca106d758adf6453fcd0765aa', '[\"*\"]', '2026-03-24 05:13:31', NULL, '2026-03-24 05:10:39', '2026-03-24 05:13:31'),
(248, 'App\\Models\\User', 59, 'auth_token', 'e7d64e54347ba8c0c8b97310465a3c925ca48d5b053fb9eaa612819026fa8368', '[\"*\"]', '2026-03-24 20:45:52', NULL, '2026-03-24 20:42:00', '2026-03-24 20:45:52'),
(250, 'App\\Models\\User', 59, 'auth_token', '113535c1b34f3a2407afdbf7f78d1792810ddec59645d021516f9bd0e7837ef8', '[\"*\"]', '2026-03-24 22:05:01', NULL, '2026-03-24 22:03:08', '2026-03-24 22:05:01'),
(251, 'App\\Models\\User', 59, 'auth_token', 'ae05832c7457d24871db111e3d7c409fe3ad3be2dc3afde5c66b5135cac54976', '[\"*\"]', '2026-03-24 22:22:18', NULL, '2026-03-24 22:06:37', '2026-03-24 22:22:18'),
(253, 'App\\Models\\User', 59, 'auth_token', 'b773821d6c797f3b290dc535cf3611ae720f76fd4e8d4e0d595d9b069156db9b', '[\"*\"]', '2026-03-24 22:37:29', NULL, '2026-03-24 22:31:22', '2026-03-24 22:37:29'),
(254, 'App\\Models\\User', 59, 'auth_token', 'a0b001dcd784f0b776db43435f9e5f12eb2976b1753b564de9c5d6d5f39d3ed5', '[\"*\"]', '2026-03-24 22:48:09', NULL, '2026-03-24 22:37:58', '2026-03-24 22:48:09'),
(255, 'App\\Models\\User', 59, 'auth_token', 'dee37d8de91bac7c254841f19897bad6a32014ac367ddb48687ca81e4a88224a', '[\"*\"]', '2026-03-24 23:10:20', NULL, '2026-03-24 23:04:08', '2026-03-24 23:10:20'),
(256, 'App\\Models\\User', 59, 'auth_token', 'f67c9dff4591789eba219e632336feb94a03945fb336a2699e4bcdaaf2071c23', '[\"*\"]', '2026-03-27 21:22:42', NULL, '2026-03-24 23:15:44', '2026-03-27 21:22:42'),
(264, 'App\\Models\\User', 59, 'auth_token', 'a57bc0f3a99bf960ba57521b723c9e88f7bf94354802d90930be181b12e1e0e9', '[\"*\"]', '2026-03-27 22:22:48', NULL, '2026-03-27 22:09:44', '2026-03-27 22:22:48'),
(266, 'App\\Models\\User', 59, 'auth_token', '8f66e6df7b4fd0cdb209a98caede927a481a63e844156bc64af0225884090299', '[\"*\"]', '2026-03-27 22:24:39', NULL, '2026-03-27 22:24:28', '2026-03-27 22:24:39'),
(267, 'App\\Models\\User', 59, 'auth_token', '90dd0bc9440f63f36375f375472bf034be7f8bf86476504e3c70007678c6158e', '[\"*\"]', '2026-03-31 02:47:27', NULL, '2026-03-27 22:28:39', '2026-03-31 02:47:27'),
(268, 'App\\Models\\User', 59, 'auth_token', '924a7baf243a40db9d540b504714e3aa06d17d4748f17a73ed3b6317c79fcb8c', '[\"*\"]', '2026-03-31 14:26:53', NULL, '2026-03-31 14:26:38', '2026-03-31 14:26:53'),
(269, 'App\\Models\\User', 59, 'auth_token', 'cf96622c1cc51cd6ac3dc04c4c7a123caa9bacc50644871a5ebb5874d71aace6', '[\"*\"]', '2026-03-31 14:31:06', NULL, '2026-03-31 14:30:55', '2026-03-31 14:31:06'),
(270, 'App\\Models\\User', 59, 'auth_token', 'b6d2589958d05abaa1c2b8bdce90cf9d2c65e49fbb81e40b865b6a8bca0068e8', '[\"*\"]', '2026-03-31 14:37:50', NULL, '2026-03-31 14:37:39', '2026-03-31 14:37:50'),
(271, 'App\\Models\\User', 59, 'auth_token', '376c63bca6a2099d2085db5c4bd1654117d0c614163dfbd996e450e46b46fca4', '[\"*\"]', '2026-03-31 14:42:19', NULL, '2026-03-31 14:42:08', '2026-03-31 14:42:19'),
(272, 'App\\Models\\User', 59, 'auth_token', '6698d4feaf65f734ca3385bff65c489e082a9714582720606955979b7ae9ca07', '[\"*\"]', '2026-03-31 17:07:41', NULL, '2026-03-31 17:07:31', '2026-03-31 17:07:41'),
(273, 'App\\Models\\User', 59, 'auth_token', 'e47e1acc2f8a5cb491fd11c265d5c8db4123747857ffdd8b58719faef679279d', '[\"*\"]', '2026-04-07 00:08:56', NULL, '2026-03-31 17:08:39', '2026-04-07 00:08:56'),
(274, 'App\\Models\\User', 59, 'auth_token', '901e3de5f9e1cdd73b0faf5abad825e614c81bd145a3b9514fa9b1a09546295f', '[\"*\"]', '2026-04-08 09:55:34', NULL, '2026-04-05 00:32:08', '2026-04-08 09:55:34'),
(275, 'App\\Models\\User', 1, 'auth_token', '2a757a93266c652a28812de08de6d2a852b9f32b5d06c0e02996eb818e1c84a6', '[\"*\"]', '2026-04-06 21:56:08', NULL, '2026-04-06 21:49:13', '2026-04-06 21:56:08'),
(276, 'App\\Models\\User', 1, 'auth_token', 'c0ff51a9e4d089275c3002f1cbdbf5217f631b4f484cf21967d479cc9fd35d16', '[\"*\"]', '2026-04-06 22:16:37', NULL, '2026-04-06 21:57:33', '2026-04-06 22:16:37'),
(278, 'App\\Models\\User', 1, 'auth_token', '932da92690bdf93b1747d91a0d544ba370afa54689f61a73589c7b06d4d905e4', '[\"*\"]', NULL, NULL, '2026-04-06 22:20:28', '2026-04-06 22:20:28'),
(279, 'App\\Models\\User', 1, 'auth_token', '27f6e28ea3bcca2abd0b562a5718a436316002409a321daceb1bf78290c533ea', '[\"*\"]', '2026-04-06 22:30:57', NULL, '2026-04-06 22:20:50', '2026-04-06 22:30:57'),
(281, 'App\\Models\\User', 1, 'auth_token', '99c23d4a46eba10beabeb465d466dcdc506a67cedd7f7ccfbed1c7c4232efc9a', '[\"*\"]', '2026-04-06 22:48:20', NULL, '2026-04-06 22:40:48', '2026-04-06 22:48:20'),
(286, 'App\\Models\\User', 1, 'auth_token', '2540ae7fed9f924cffabf54df2b0a865ef5e00b446fab98ddcfa8efe68b7c91e', '[\"*\"]', '2026-04-06 23:14:06', NULL, '2026-04-06 22:59:13', '2026-04-06 23:14:06'),
(289, 'App\\Models\\User', 1, 'auth_token', '63971df95fa43860bc437dae2952b28288178b4b1b19a2a631bc189a87bb52fb', '[\"*\"]', '2026-07-22 05:09:49', NULL, '2026-04-07 09:17:46', '2026-07-22 05:09:49'),
(290, 'App\\Models\\User', 1, 'auth_token', '4127594f90fc9452955d875f01b8ae1f2e8b289b7740bc43a336e919ce2d7c90', '[\"*\"]', '2026-04-08 01:45:51', NULL, '2026-04-07 20:26:59', '2026-04-08 01:45:51'),
(291, 'App\\Models\\User', 59, 'auth_token', '7d57c5bbb6ca045fe500500408372b5cd9e9bb68f246b2328e6aa95af7ec9e6c', '[\"*\"]', '2026-04-07 20:44:19', NULL, '2026-04-07 20:43:05', '2026-04-07 20:44:19'),
(292, 'App\\Models\\User', 1, 'auth_token', '74c1793e4ae1bc57e084c8a99453532a4fb94bb3482617ccb53a3c28200f775d', '[\"*\"]', '2026-04-07 21:25:45', NULL, '2026-04-07 20:45:08', '2026-04-07 21:25:46'),
(295, 'App\\Models\\User', 1, 'auth_token', 'd6ac26ee26d714d339a5fd3eb01d7b840db82ce832b68f0196d2b4316edcd1d4', '[\"*\"]', '2026-04-08 02:17:35', NULL, '2026-04-08 01:38:20', '2026-04-08 02:17:35'),
(296, 'App\\Models\\User', 1, 'auth_token', 'c6540e3b09436b25183217a9de8bd0e65ae8b5a29f85e614cf7b708c7156e8e6', '[\"*\"]', '2026-04-08 02:04:11', NULL, '2026-04-08 01:46:30', '2026-04-08 02:04:11'),
(301, 'App\\Models\\User', 63, 'auth_token', '665d73b6f218de290e7be26717bb6fe3d78547ed52dc7d48ead409ffe923d452', '[\"*\"]', '2026-04-08 20:27:53', NULL, '2026-04-08 20:27:47', '2026-04-08 20:27:53'),
(302, 'App\\Models\\User', 59, 'auth_token', '12d41c207bd467037dfe212a598f0539a65745daf36cc14ffc3984c0e253b579', '[\"*\"]', '2026-04-08 23:20:53', NULL, '2026-04-08 21:57:59', '2026-04-08 23:20:53'),
(304, 'App\\Models\\User', 1, 'auth_token', '44bbd87a8462cd60094605a8f7feeb8c8ce51d6d130746e3ea880be68a1cf014', '[\"*\"]', '2026-04-10 23:52:53', NULL, '2026-04-10 23:21:00', '2026-04-10 23:52:53'),
(305, 'App\\Models\\User', 1, 'auth_token', 'fd0dedaf3a9d3888f30742c0274671f3936b1e666804bdff8424b6531cd87d99', '[\"*\"]', '2026-07-23 14:08:51', NULL, '2026-04-10 23:49:10', '2026-07-23 14:08:51'),
(306, 'App\\Models\\User', 1, 'auth_token', '345c12334f8013f98445684f7cfdafb7643e47df00543f04ae3e7595eb4cc376', '[\"*\"]', '2026-04-11 00:17:14', NULL, '2026-04-11 00:05:16', '2026-04-11 00:17:14'),
(307, 'App\\Models\\User', 1, 'auth_token', 'feafdeeb284948631dbce28764ae8f4e9ca51beb7c6fba28cd7d0950cc709576', '[\"*\"]', '2026-04-11 00:17:12', NULL, '2026-04-11 00:06:47', '2026-04-11 00:17:12'),
(308, 'App\\Models\\User', 1, 'auth_token', 'a51c00b68d434b734ef177d5afa3cb7d05a5473b2fe954f073c5b6104613870b', '[\"*\"]', '2026-04-11 00:29:49', NULL, '2026-04-11 00:20:48', '2026-04-11 00:29:49'),
(309, 'App\\Models\\User', 1, 'auth_token', 'b45b3d19fa6565c1ab96027a44d5ad99c164a31126c6dee27bf81e9fa36d350e', '[\"*\"]', '2026-04-11 00:35:19', NULL, '2026-04-11 00:30:32', '2026-04-11 00:35:19'),
(310, 'App\\Models\\User', 1, 'auth_token', '890ed6a3b13b9e1ce51e5319114d4b3c8c99934f61889daeef00a3b795d11021', '[\"*\"]', '2026-04-11 00:38:58', NULL, '2026-04-11 00:38:54', '2026-04-11 00:38:58'),
(311, 'App\\Models\\User', 1, 'auth_token', 'fbe7a995bfa8ede729bcd8843f5e0b7796340518deb1e0967d93fbb044fbfefe', '[\"*\"]', '2026-04-11 00:45:23', NULL, '2026-04-11 00:43:36', '2026-04-11 00:45:23'),
(312, 'App\\Models\\User', 1, 'auth_token', '1118348ee3ee8ea3b39b185b161db25629a1e7e1f85963f03f0ef230095b1ab5', '[\"*\"]', '2026-04-11 00:54:42', NULL, '2026-04-11 00:54:23', '2026-04-11 00:54:42'),
(313, 'App\\Models\\User', 1, 'auth_token', '2e540b48c4e40065950612bcc4fc7b5d7beba8073d527a482ffd9a94edfe1bca', '[\"*\"]', '2026-04-11 00:58:06', NULL, '2026-04-11 00:58:02', '2026-04-11 00:58:06'),
(314, 'App\\Models\\User', 1, 'auth_token', 'd8083edcf89fd8479d317011b0432a382780dbd73baaf73b8f83cb25cef6c8ea', '[\"*\"]', '2026-04-11 01:06:57', NULL, '2026-04-11 01:02:36', '2026-04-11 01:06:57'),
(315, 'App\\Models\\User', 1, 'auth_token', 'b87b9ad121e599bc8703c1380ee914997bf1d7e4f17756698597126545113e9d', '[\"*\"]', '2026-06-06 13:39:36', NULL, '2026-04-11 01:08:50', '2026-06-06 13:39:36'),
(317, 'App\\Models\\User', 1, 'auth_token', 'a7509532eda6186c3f806742a923e17820caa6af5bb4237161e7d438ec8fb690', '[\"*\"]', '2026-04-11 01:50:40', NULL, '2026-04-11 01:37:33', '2026-04-11 01:50:40'),
(318, 'App\\Models\\User', 1, 'auth_token', '6229d1b75851e236ef99c4fed3c94dc8dc8dd9e59c7cd314c5eaf6d8e1bfb86b', '[\"*\"]', '2026-05-16 18:52:27', NULL, '2026-04-11 08:35:57', '2026-05-16 18:52:27'),
(319, 'App\\Models\\User', 59, 'auth_token', 'c5c602ee810001fa589850acf7537cb4138472a0db347279e357452bdc43eb78', '[\"*\"]', '2026-04-28 05:05:08', NULL, '2026-04-11 16:47:46', '2026-04-28 05:05:08'),
(320, 'App\\Models\\User', 1, 'auth_token', 'e4e2c36521a1529c92a2bde82978e944bd603a0dbdd5fdc4536ecf88d7539e88', '[\"*\"]', '2026-05-30 21:25:27', NULL, '2026-04-13 20:46:26', '2026-05-30 21:25:27'),
(321, 'App\\Models\\User', 1, 'auth_token', '31349016865c0561c6acac5c1ae2381d927c64d55fea7a41a67310aec20cdb0e', '[\"*\"]', '2026-04-13 21:42:02', NULL, '2026-04-13 20:53:58', '2026-04-13 21:42:02'),
(322, 'App\\Models\\User', 1, 'auth_token', 'c1edcb925ec73007390de4bf1ad7501d7803d045aa6b0ed1ca2c8c052e85bba3', '[\"*\"]', '2026-05-26 15:14:46', NULL, '2026-04-19 15:51:29', '2026-05-26 15:14:46'),
(323, 'App\\Models\\User', 59, 'auth_token', '7c903e383fd8e6dbab54b3ac6273f0a789ff40e2afc5fe027c66ee2756085a33', '[\"*\"]', NULL, NULL, '2026-04-28 08:13:47', '2026-04-28 08:13:47'),
(324, 'App\\Models\\User', 59, 'auth_token', '3dd058bfdda04efaaf73b4d23551a5714d06c788136f291115725c3e90584edf', '[\"*\"]', '2026-04-28 08:22:22', NULL, '2026-04-28 08:13:48', '2026-04-28 08:22:22'),
(325, 'App\\Models\\User', 59, 'auth_token', '652d450758fc0fbf1236c0f6476ae6ba54936b25421199d6e826f4707bc9b296', '[\"*\"]', '2026-05-05 00:15:59', NULL, '2026-05-03 00:39:34', '2026-05-05 00:15:59'),
(326, 'App\\Models\\User', 59, 'auth_token', 'ec77da84bda7b8739b951cdad8ca15c858d4073bb4280c8d353215cd0fb8c164', '[\"*\"]', '2026-05-03 20:12:06', NULL, '2026-05-03 20:12:02', '2026-05-03 20:12:06'),
(328, 'App\\Models\\User', 64, 'auth_token', '156bf0ebedeb3e07c4b6ab85fb2961db852f1f31be50fa9447e6e9c38d80b349', '[\"*\"]', '2026-05-09 18:27:09', NULL, '2026-05-09 18:25:13', '2026-05-09 18:27:09'),
(331, 'App\\Models\\User', 59, 'auth_token', '4971dc8988b5227a2fdfd9734ed25c120573605ff147c60e7c0a59bb59c98df8', '[\"*\"]', NULL, NULL, '2026-05-09 21:21:47', '2026-05-09 21:21:47'),
(337, 'App\\Models\\User', 59, 'auth_token', 'c9180455210c32a9390ba6c3fd24e9b3dbc4c9426b1037ab4348d72682f1a56b', '[\"*\"]', '2026-05-14 01:24:25', NULL, '2026-05-14 01:24:18', '2026-05-14 01:24:25'),
(339, 'App\\Models\\User', 65, 'auth_token', '4a4911a9ec01685ca4b909f2aec530b99e2bdd674287c661e7a54b5750a577a5', '[\"*\"]', '2026-05-17 17:25:34', NULL, '2026-05-17 17:25:25', '2026-05-17 17:25:34'),
(340, 'App\\Models\\User', 66, 'auth_token', 'ac275ceb517d46af457c540a8be8114f1bd4b38759d25ad691a6c801f3b15c78', '[\"*\"]', '2026-05-17 17:28:30', NULL, '2026-05-17 17:26:57', '2026-05-17 17:28:30'),
(341, 'App\\Models\\User', 67, 'auth_token', 'beb206c062320056930811699bf932868981d9d4636db74f517408cbe5dd3664', '[\"*\"]', '2026-06-16 15:08:43', NULL, '2026-05-17 22:31:29', '2026-06-16 15:08:43'),
(342, 'App\\Models\\User', 68, 'auth_token', '94a94bdd31b163277dcc841fc2b3a3c271e2a1db12b40ceace63cf88d59fd8ed', '[\"*\"]', '2026-05-18 15:49:53', NULL, '2026-05-18 15:46:20', '2026-05-18 15:49:53'),
(344, 'App\\Models\\User', 68, 'auth_token', 'f4f27e73d440d7d9ca169710bd7f00cfb7f6ec9284ad9aec38792f1259ead333', '[\"*\"]', '2026-05-18 19:49:08', NULL, '2026-05-18 19:47:23', '2026-05-18 19:49:08'),
(345, 'App\\Models\\User', 69, 'auth_token', '28f5cb5b671ce630da0286330621d4787a342d0c69d2f6aeb50056b30816cf80', '[\"*\"]', '2026-05-18 21:54:41', NULL, '2026-05-18 21:54:38', '2026-05-18 21:54:41'),
(346, 'App\\Models\\User', 70, 'auth_token', '7b8bf8bfc013bf89566d084eb2fdcacfd4356dda60deef4350c963a63e994065', '[\"*\"]', '2026-05-18 22:41:03', NULL, '2026-05-18 22:41:01', '2026-05-18 22:41:03'),
(347, 'App\\Models\\User', 70, 'auth_token', 'cfdc2dee7ff3e316ed6fb6f1643e5c03edfdba0d1492ce1cd867225c87f1bf4f', '[\"*\"]', '2026-05-18 22:55:04', NULL, '2026-05-18 22:45:10', '2026-05-18 22:55:04'),
(353, 'App\\Models\\User', 59, 'auth_token', '8d0adef3d59e563cbea2a7ce3133208d58b60f1decd50edab908fe9ba0564fe7', '[\"*\"]', '2026-05-18 23:15:36', NULL, '2026-05-18 23:10:49', '2026-05-18 23:15:36'),
(354, 'App\\Models\\User', 59, 'auth_token', 'cd7cb89a4a9ddd387515f02310e373308824937ab46898fbe4bba54f0f357b3e', '[\"*\"]', '2026-05-18 23:16:20', NULL, '2026-05-18 23:16:07', '2026-05-18 23:16:20'),
(355, 'App\\Models\\User', 59, 'auth_token', 'f72280f9abd26133b0651f2ecccb83acc21a272d7e704e04b21483be480f081b', '[\"*\"]', '2026-05-18 23:19:35', NULL, '2026-05-18 23:19:27', '2026-05-18 23:19:35'),
(356, 'App\\Models\\User', 59, 'auth_token', '69fb60ce8c4881cf9b3261938c28ab63085e274ec15cb085b344d50f18ce4c27', '[\"*\"]', '2026-05-18 23:22:53', NULL, '2026-05-18 23:22:46', '2026-05-18 23:22:53'),
(358, 'App\\Models\\User', 59, 'auth_token', '1bd31e7afd7d96b7c52c7dba02244b0c205b1795d8066a7646ba839e640e4b79', '[\"*\"]', '2026-05-18 23:25:50', NULL, '2026-05-18 23:25:42', '2026-05-18 23:25:50'),
(360, 'App\\Models\\User', 59, 'auth_token', 'a2f52a33bb1969650c60a4b346e917513858a66d22407aa63e16a18627427aca', '[\"*\"]', '2026-05-18 23:33:43', NULL, '2026-05-18 23:33:41', '2026-05-18 23:33:43'),
(364, 'App\\Models\\User', 59, 'auth_token', '8c3150c546ecc147d97c29890b7d0d036f3497ce937872c6813967617044c4d5', '[\"*\"]', '2026-05-19 00:30:59', NULL, '2026-05-19 00:30:51', '2026-05-19 00:30:59'),
(365, 'App\\Models\\User', 59, 'auth_token', 'eeed02faebc42825f965c1445d251f5fae6052c5469346b5a729366218017ebd', '[\"*\"]', '2026-05-19 19:31:24', NULL, '2026-05-19 00:51:12', '2026-05-19 19:31:24'),
(367, 'App\\Models\\User', 72, 'auth_token', '43a24e23af81f26692803eceba9630322e735673254c3aafeebe30427e3d3aa8', '[\"*\"]', '2026-05-19 11:37:50', NULL, '2026-05-19 09:18:05', '2026-05-19 11:37:50'),
(368, 'App\\Models\\User', 68, 'auth_token', '3cf426df5159b9137e80baf3e60587ff1c983b775cd9247e94a1d10faff5b782', '[\"*\"]', '2026-05-19 11:01:52', NULL, '2026-05-19 10:59:07', '2026-05-19 11:01:52'),
(369, 'App\\Models\\User', 68, 'auth_token', 'a9c3dee6bdc003cc4e8ec8329d506e7312ff531ed947dc142451a04496dcf200', '[\"*\"]', '2026-05-20 07:08:56', NULL, '2026-05-19 14:09:52', '2026-05-20 07:08:56'),
(370, 'App\\Models\\User', 73, 'auth_token', '2c00033ec9a2cee11165c4a2d32e9bc0ffc7f1ef6f307a84e04df4c971008efd', '[\"*\"]', '2026-05-19 20:07:32', NULL, '2026-05-19 20:07:30', '2026-05-19 20:07:32'),
(371, 'App\\Models\\User', 73, 'auth_token', '53a4f3ac04911e9b1ed1452ccda8da51b4d1932061b5f99f77973e3b66317967', '[\"*\"]', '2026-05-19 20:32:29', NULL, '2026-05-19 20:08:12', '2026-05-19 20:32:29'),
(373, 'App\\Models\\User', 74, 'auth_token', '9f8f5458666a63efc5b1a5a2fd961d01f05e9e17513277ee034071902370ac5b', '[\"*\"]', '2026-05-19 20:47:05', NULL, '2026-05-19 20:46:24', '2026-05-19 20:47:05'),
(377, 'App\\Models\\User', 75, 'auth_token', '9ec5f4a0fc1deef0dc1eeecbeae202631b62bcb368dc23401c8270d77eea1f72', '[\"*\"]', '2026-05-19 22:38:45', NULL, '2026-05-19 22:27:42', '2026-05-19 22:38:45'),
(378, 'App\\Models\\User', 75, 'auth_token', 'a3fddc01dc47a893ace22b2b492190ad051ab4a183c3ad26843acee9db9e16c0', '[\"*\"]', '2026-05-19 22:40:51', NULL, '2026-05-19 22:32:13', '2026-05-19 22:40:51'),
(379, 'App\\Models\\User', 75, 'auth_token', 'f2f6de06c82a081fe575d04a944bb533eb5de2d047eed97c1affd5ce75b51b56', '[\"*\"]', '2026-05-19 22:49:02', NULL, '2026-05-19 22:39:55', '2026-05-19 22:49:02'),
(380, 'App\\Models\\User', 75, 'auth_token', '168420fe8950c8291732f5f017aa3b2ea83cd9e0127225a1ad97ed1864dec0e0', '[\"*\"]', '2026-05-19 22:50:33', NULL, '2026-05-19 22:41:15', '2026-05-19 22:50:33'),
(382, 'App\\Models\\User', 75, 'auth_token', '2ceab6457fa446d3c22e43a4c08a8757d4efe957c89f249acd46f09400b88897', '[\"*\"]', '2026-05-19 22:49:53', NULL, '2026-05-19 22:49:39', '2026-05-19 22:49:53'),
(383, 'App\\Models\\User', 75, 'auth_token', '3c2320156c3278343412fe62fa4c49576095328afdfc91c3a251e04ae11e09b4', '[\"*\"]', '2026-05-19 22:55:36', NULL, '2026-05-19 22:50:18', '2026-05-19 22:55:36'),
(384, 'App\\Models\\User', 75, 'auth_token', '33105917b49bbe60989aee25c443cd0f6edcf933153315eff4b160ff16b433f5', '[\"*\"]', '2026-05-19 22:59:31', NULL, '2026-05-19 22:56:51', '2026-05-19 22:59:31'),
(391, 'App\\Models\\User', 68, 'auth_token', '9f18c9616c02190a211f02690d94dfb5935b422a74bd647589f63eb32b72f148', '[\"*\"]', '2026-05-20 13:58:06', NULL, '2026-05-20 13:57:54', '2026-05-20 13:58:06'),
(393, 'App\\Models\\User', 77, 'auth_token', 'e75390804d2ba08b5a1d1d70ab1f2e5daf96409139a8088b251cb9f220f06b36', '[\"*\"]', '2026-05-20 16:36:26', NULL, '2026-05-20 16:36:22', '2026-05-20 16:36:26'),
(395, 'App\\Models\\User', 78, 'auth_token', 'ee92f88da5b3d3858f19ef689bd0072ed95e001bc11a284b2261d3f56c4aae76', '[\"*\"]', '2026-05-20 18:27:20', NULL, '2026-05-20 18:26:59', '2026-05-20 18:27:20'),
(396, 'App\\Models\\User', 78, 'auth_token', 'cf6c80d4b23874819c6d9cd09d8cf677f55117c58b6cef357402174d6e7ad32b', '[\"*\"]', '2026-05-20 19:36:38', NULL, '2026-05-20 18:28:25', '2026-05-20 19:36:38'),
(397, 'App\\Models\\User', 78, 'auth_token', 'c1b0b3ba0263bca061c0b0cfc553c654a346689d75d9f075d8cc292402892f1c', '[\"*\"]', '2026-05-20 18:37:27', NULL, '2026-05-20 18:37:01', '2026-05-20 18:37:27'),
(398, 'App\\Models\\User', 68, 'auth_token', '170ab24c5038f8208536cac45cacb8a9c81ae2d76d50f9694809ff111c841f90', '[\"*\"]', '2026-05-27 19:03:33', NULL, '2026-05-20 18:42:37', '2026-05-27 19:03:33'),
(399, 'App\\Models\\User', 78, 'auth_token', '096dd8562898d9f22bed9d1fc7862d18cf5c245ed5e64be1cd097c73637715c5', '[\"*\"]', '2026-05-20 19:46:25', NULL, '2026-05-20 19:38:36', '2026-05-20 19:46:25'),
(400, 'App\\Models\\User', 78, 'auth_token', 'e68df391e449bd47b4239dda5f8617cfcdb91b861cbb9c5466bd215e06d77ee4', '[\"*\"]', '2026-05-20 19:43:57', NULL, '2026-05-20 19:42:02', '2026-05-20 19:43:57'),
(401, 'App\\Models\\User', 78, 'auth_token', 'b0289f58ff4221926231ebf0c119984a3ecc9be4488cf551f835776de959bc49', '[\"*\"]', '2026-05-20 20:36:23', NULL, '2026-05-20 19:47:25', '2026-05-20 20:36:23'),
(402, 'App\\Models\\User', 78, 'auth_token', '513367cbbf6afd1c0f7dcf95cd9291e5fa5410b409ddd81506bc1a8e1dca44af', '[\"*\"]', '2026-05-20 19:59:25', NULL, '2026-05-20 19:48:19', '2026-05-20 19:59:25'),
(404, 'App\\Models\\User', 59, 'auth_token', '8a48ace436a0cb6f779aded29f690fd8530fc5c4c56b0b3e46eeb201f2083eea', '[\"*\"]', '2026-05-20 23:06:00', NULL, '2026-05-20 23:05:54', '2026-05-20 23:06:00'),
(406, 'App\\Models\\User', 59, 'auth_token', '3ba02f24a73d4ee4ef498bd2078ed8fe6c1be3900349f603de9b1a69ba67ad18', '[\"*\"]', NULL, NULL, '2026-05-21 16:39:26', '2026-05-21 16:39:26'),
(407, 'App\\Models\\User', 59, 'auth_token', '6c534ce6d13b5819c4634f275284be44613c133f39dfbc01e6773a9a316be4f1', '[\"*\"]', NULL, NULL, '2026-05-21 16:39:26', '2026-05-21 16:39:26'),
(408, 'App\\Models\\User', 59, 'auth_token', '7eb4f1f5253d8c3fe3294bf9de016c024b0ced51816e003f4286366eb2c8a7c3', '[\"*\"]', '2026-05-22 21:37:22', NULL, '2026-05-21 16:39:33', '2026-05-22 21:37:22'),
(409, 'App\\Models\\User', 79, 'auth_token', '401f51b5a9afd09bb27b50250ceb74f8cfac8c643295d81817bb9505bded57e7', '[\"*\"]', '2026-05-21 19:33:04', NULL, '2026-05-21 19:32:43', '2026-05-21 19:33:04'),
(410, 'App\\Models\\User', 80, 'auth_token', '0ecc42fdf268c8dfa88929ad63bb869b6d51440dd6a14ed55c4ab27df7595fa5', '[\"*\"]', '2026-05-22 13:04:45', NULL, '2026-05-22 13:03:01', '2026-05-22 13:04:45'),
(411, 'App\\Models\\User', 80, 'auth_token', '7095bf2c8b1e511a1e3686a67ac7a2eded0aa79f5a261ab71d98e15d802e836d', '[\"*\"]', '2026-05-22 13:05:34', NULL, '2026-05-22 13:05:31', '2026-05-22 13:05:34'),
(412, 'App\\Models\\User', 81, 'auth_token', 'a2c771c4e927acbe2ff42fc5e28218043fd1eed6694fedfa3e30b762b9aa88d1', '[\"*\"]', '2026-05-22 17:07:54', NULL, '2026-05-22 17:05:13', '2026-05-22 17:07:54'),
(413, 'App\\Models\\User', 81, 'auth_token', '3f57bf3441e3488204d1245d4cb46ea8f10f26bfa52337cb4fb1595bde2a8211', '[\"*\"]', '2026-05-22 17:07:51', NULL, '2026-05-22 17:06:04', '2026-05-22 17:07:51'),
(414, 'App\\Models\\User', 82, 'auth_token', '64d8e7709fe9912e86493ad980341717f1c0af4d3fd809dcd9e888cd183ec872', '[\"*\"]', '2026-05-22 17:12:55', NULL, '2026-05-22 17:08:46', '2026-05-22 17:12:55'),
(418, 'App\\Models\\User', 83, 'auth_token', '1ee00dae4b1d6bfaff89564ae9322753d8eb278c0bea356acaee1af963f7e4d7', '[\"*\"]', '2026-05-22 19:29:05', NULL, '2026-05-22 19:27:41', '2026-05-22 19:29:05'),
(419, 'App\\Models\\User', 83, 'auth_token', 'e3f9208f3c694a70a8556b2f22d2c47e58c11a92ef58475f82021518efa28bcc', '[\"*\"]', '2026-05-22 19:53:06', NULL, '2026-05-22 19:30:13', '2026-05-22 19:53:06'),
(422, 'App\\Models\\User', 83, 'auth_token', '2522e81a7fdb4aee8f6f4c6cfaec03905a5c119a640421139fc76318a910e4df', '[\"*\"]', '2026-05-22 19:59:54', NULL, '2026-05-22 19:58:42', '2026-05-22 19:59:54'),
(423, 'App\\Models\\User', 83, 'auth_token', '8a62bed2db1c64e17284e2eaa9aedf1bfbc77576db3b3921d664f5e6f63d6b93', '[\"*\"]', '2026-05-22 20:00:44', NULL, '2026-05-22 20:00:41', '2026-05-22 20:00:44'),
(425, 'App\\Models\\User', 59, 'auth_token', '38b4b365fd9a9b883429d7a7f74aa8317ab3f1c918fa33a3b4aade76efdf0015', '[\"*\"]', '2026-05-22 21:04:33', NULL, '2026-05-22 20:46:00', '2026-05-22 21:04:33'),
(426, 'App\\Models\\User', 59, 'auth_token', '36112a564f5d053c68cd50fabe09f81f1076f9b1e231a7babdbbbf4bc4c57dee', '[\"*\"]', '2026-05-22 21:16:24', NULL, '2026-05-22 21:13:41', '2026-05-22 21:16:24'),
(430, 'App\\Models\\User', 59, 'auth_token', 'aa6685e0464c4eead5c7390819646fa49eb99f8ecbd5bdc56409cad34765dc8b', '[\"*\"]', '2026-05-22 21:29:56', NULL, '2026-05-22 21:26:02', '2026-05-22 21:29:56'),
(433, 'App\\Models\\User', 59, 'auth_token', 'fd894772e17512b0715106bf1629e6a69f39f99583970c107344bed5f6dfe0bc', '[\"*\"]', '2026-05-22 21:38:35', NULL, '2026-05-22 21:36:59', '2026-05-22 21:38:35'),
(434, 'App\\Models\\User', 59, 'auth_token', '1b43969a933166025e6955145fa34c82671b219b66387e904043de0e7e030721', '[\"*\"]', '2026-05-22 21:38:47', NULL, '2026-05-22 21:38:45', '2026-05-22 21:38:47'),
(436, 'App\\Models\\User', 59, 'auth_token', '0fae211123286b2884626b88ffdc6dfa0dbf93bc3ffcdc031995f3ddd724ef9d', '[\"*\"]', '2026-05-22 21:45:28', NULL, '2026-05-22 21:44:24', '2026-05-22 21:45:28'),
(438, 'App\\Models\\User', 59, 'auth_token', '3f4ac568685dd3a434aec070a80ca6704364f5e232f78794d5300ffd4447a4b0', '[\"*\"]', '2026-05-23 17:46:33', NULL, '2026-05-23 00:21:16', '2026-05-23 17:46:33'),
(439, 'App\\Models\\User', 72, 'auth_token', 'daca73799284c7e751a81f37dc33fd4a863ce6f645353c5acafd074fe44ba0e9', '[\"*\"]', '2026-05-23 22:15:39', NULL, '2026-05-23 22:15:35', '2026-05-23 22:15:39'),
(440, 'App\\Models\\User', 59, 'auth_token', '383f52688fb25ec4052f7d208e8301ba9aba21d9a7b7d452027192cfa9b4e8ce', '[\"*\"]', '2026-05-24 16:17:57', NULL, '2026-05-23 22:53:13', '2026-05-24 16:17:57'),
(441, 'App\\Models\\User', 72, 'auth_token', '55f7a8390a581b470b32e8558053faf2eae5b15ffdf66fabdfd68c068295aba4', '[\"*\"]', '2026-05-24 13:49:03', NULL, '2026-05-24 13:38:42', '2026-05-24 13:49:03'),
(442, 'App\\Models\\User', 84, 'auth_token', 'b6084d91131afad8f1323841ae8a4ec7961576bb944f3cd5122477048b8385f2', '[\"*\"]', '2026-05-24 17:49:16', NULL, '2026-05-24 17:49:11', '2026-05-24 17:49:16'),
(444, 'App\\Models\\User', 72, 'auth_token', 'ec996f0aa3fcb57a57f406a57fe871e0140740cd5efdd4d3baef09a9a51bce54', '[\"*\"]', '2026-05-25 09:09:10', NULL, '2026-05-25 08:58:08', '2026-05-25 09:09:10'),
(445, 'App\\Models\\User', 85, 'auth_token', 'd5cdac30a6ed04ceb670e7ca185ed61efdb268b531a21abefff473fca1b6ee4a', '[\"*\"]', '2026-05-25 14:59:10', NULL, '2026-05-25 14:59:06', '2026-05-25 14:59:10'),
(446, 'App\\Models\\User', 86, 'auth_token', '2b1142af42e6d3b157cceba0a5bdcf2de75caec8cd9fb8d78a9165f8a3ccf50f', '[\"*\"]', '2026-05-25 15:47:51', NULL, '2026-05-25 15:47:47', '2026-05-25 15:47:51'),
(447, 'App\\Models\\User', 86, 'auth_token', '540a8f68153d5c88b33742d6302180cdf0b5423df1ea9a789d0d69589e461a98', '[\"*\"]', '2026-05-25 15:48:05', NULL, '2026-05-25 15:48:03', '2026-05-25 15:48:05'),
(448, 'App\\Models\\User', 72, 'auth_token', 'd12277a0d774ce9433f257403fdc328d62a1846083de1d3563f7aad73249b6a7', '[\"*\"]', '2026-05-25 18:27:54', NULL, '2026-05-25 18:22:55', '2026-05-25 18:27:54'),
(449, 'App\\Models\\User', 87, 'auth_token', '8a471aa76661379ba3a2fed41311f66e2d7a41c938cbbbf2e39cb1566b738c98', '[\"*\"]', '2026-05-25 21:12:28', NULL, '2026-05-25 21:12:21', '2026-05-25 21:12:28'),
(451, 'App\\Models\\User', 59, 'auth_token', '0af6245f782646eae6c0e2e63633209f77b67449025e5ab6e9a8696844ea72cd', '[\"*\"]', '2026-05-25 23:53:16', NULL, '2026-05-25 23:52:39', '2026-05-25 23:53:16'),
(452, 'App\\Models\\User', 59, 'auth_token', 'daf421de154928254b198c5059250f74747cd7880dda80be4dc848e4a3474a91', '[\"*\"]', '2026-05-28 13:02:40', NULL, '2026-05-27 07:37:13', '2026-05-28 13:02:40'),
(454, 'App\\Models\\User', 88, 'auth_token', '3190ee4e4d639f410afd913074df8fba1c2c4fb89e06f826ca11495fd8f90dae', '[\"*\"]', '2026-05-28 16:47:07', NULL, '2026-05-28 16:47:02', '2026-05-28 16:47:07'),
(455, 'App\\Models\\User', 59, 'auth_token', '4908db792a5e60d0edb973814a480c50d04a4b86aee14229d6890db644b272fe', '[\"*\"]', '2026-05-28 22:01:34', NULL, '2026-05-28 21:59:02', '2026-05-28 22:01:34'),
(456, 'App\\Models\\User', 59, 'auth_token', 'eeddb49febe88ce0e606e617927403816ba2acfbecf5c30dd570bcffaad4d45c', '[\"*\"]', '2026-05-28 21:59:34', NULL, '2026-05-28 21:59:32', '2026-05-28 21:59:34'),
(457, 'App\\Models\\User', 59, 'auth_token', 'e354a950940b1963d936c46496e94f575321d3d9354276c82b33b1d0006899bb', '[\"*\"]', '2026-05-28 22:00:58', NULL, '2026-05-28 22:00:45', '2026-05-28 22:00:58'),
(459, 'App\\Models\\User', 59, 'auth_token', 'fc4f0abe766729b708c2748f68ea44259601a293f2e0c2f6e485683b58841d00', '[\"*\"]', '2026-05-28 22:26:01', NULL, '2026-05-28 22:25:45', '2026-05-28 22:26:01'),
(460, 'App\\Models\\User', 59, 'auth_token', '1915830dcbc84236501565d2cbdfa317e2eec82eececddbd42bfe42717b2fc7e', '[\"*\"]', '2026-05-28 22:34:07', NULL, '2026-05-28 22:26:28', '2026-05-28 22:34:07'),
(463, 'App\\Models\\User', 89, 'auth_token', 'c0833287f1c60e685b7f3175f61177709171847d566d969f824b645194ec0ae0', '[\"*\"]', '2026-05-28 22:49:10', NULL, '2026-05-28 22:49:05', '2026-05-28 22:49:10'),
(464, 'App\\Models\\User', 89, 'auth_token', 'd3b4e82cbc9130bbf846df1a256bfb50699aa09633c9860e495079dd1a121926', '[\"*\"]', '2026-05-29 02:03:11', NULL, '2026-05-28 22:50:33', '2026-05-29 02:03:11'),
(467, 'App\\Models\\User', 89, 'auth_token', 'aa7aa86f0fc6362b98f2500c1d6603f60a9f0941b126133fe8f6e8adeeebedc6', '[\"*\"]', '2026-05-28 22:57:23', NULL, '2026-05-28 22:57:12', '2026-05-28 22:57:23'),
(468, 'App\\Models\\User', 89, 'auth_token', 'bca37ae2e33902fa0a6b14150da9d28c79644c8ef65c23638f4caefca27a7c57', '[\"*\"]', '2026-05-28 22:58:06', NULL, '2026-05-28 22:57:57', '2026-05-28 22:58:06'),
(469, 'App\\Models\\User', 89, 'auth_token', 'f59a8b56ca6434a65bd791b0fb9e4826730d55c20a779a9f126b8a2822d49391', '[\"*\"]', '2026-05-28 23:02:29', NULL, '2026-05-28 23:02:27', '2026-05-28 23:02:29'),
(470, 'App\\Models\\User', 89, 'auth_token', '96c3d3e3363e1145a5a0279e38f5dd2a812ab879022cf664851ec3d45b8bb6ce', '[\"*\"]', '2026-05-28 23:12:42', NULL, '2026-05-28 23:05:09', '2026-05-28 23:12:42'),
(471, 'App\\Models\\User', 89, 'auth_token', 'f137646f148e37dc422f38daefcef1e9f2ed88a793f64ccaddeecfad94c43027', '[\"*\"]', '2026-05-28 23:21:33', NULL, '2026-05-28 23:21:06', '2026-05-28 23:21:33'),
(472, 'App\\Models\\User', 89, 'auth_token', '97247af0060cdbae6bf8245501512273ea80436c0de0069a822633ff1ec3afa8', '[\"*\"]', '2026-05-28 23:25:48', NULL, '2026-05-28 23:24:35', '2026-05-28 23:25:48'),
(473, 'App\\Models\\User', 89, 'auth_token', '220dadbc3b13e76a08473cd62d0e3f34f2c00100d610d09e7f93408436fd0382', '[\"*\"]', '2026-05-28 23:35:22', NULL, '2026-05-28 23:32:51', '2026-05-28 23:35:22'),
(474, 'App\\Models\\User', 89, 'auth_token', 'c60e1fc0be06c95256a0f283f196e4d2249ae54d712ea3f573fcc181b249e02c', '[\"*\"]', '2026-05-28 23:37:28', NULL, '2026-05-28 23:37:25', '2026-05-28 23:37:28'),
(475, 'App\\Models\\User', 89, 'auth_token', '3336e729b23917647da8e6883189d84a5a3c13dc7bcfad2b82c9ff11f686b131', '[\"*\"]', '2026-05-28 23:38:27', NULL, '2026-05-28 23:38:18', '2026-05-28 23:38:27'),
(476, 'App\\Models\\User', 89, 'auth_token', '50d2c16b95ade2d0cedd84a5a3c7c568c2e5043c3d93e85ef4b536ef9a414017', '[\"*\"]', '2026-05-28 23:47:01', NULL, '2026-05-28 23:46:37', '2026-05-28 23:47:01'),
(477, 'App\\Models\\User', 89, 'auth_token', '042a9427bb39a688c73d03bdffc6377f662400dff9e65f77215216925d798873', '[\"*\"]', '2026-05-28 23:56:12', NULL, '2026-05-28 23:55:19', '2026-05-28 23:56:12'),
(478, 'App\\Models\\User', 89, 'auth_token', 'f953dc84a774df6cd11a3eed5151b73d613b351d66de39cd29b2dfa604a77ad9', '[\"*\"]', '2026-05-28 23:59:30', NULL, '2026-05-28 23:59:20', '2026-05-28 23:59:30'),
(479, 'App\\Models\\User', 89, 'auth_token', '3d06a6ecfbcffcc87c419489ebe8c20dc9f1a6865518ff674b5349178606b176', '[\"*\"]', '2026-05-29 00:04:57', NULL, '2026-05-29 00:04:44', '2026-05-29 00:04:57'),
(480, 'App\\Models\\User', 89, 'auth_token', '8073e09d13af748cb7c31208d9fadd9b6a0e2f93f832b1f8c663428e8302f464', '[\"*\"]', '2026-05-29 00:11:03', NULL, '2026-05-29 00:10:57', '2026-05-29 00:11:03'),
(481, 'App\\Models\\User', 89, 'auth_token', 'bd4d16b6133d6bf60a737145924b898fcffa18217dc5938ab5c78b10288b9819', '[\"*\"]', '2026-05-29 00:11:48', NULL, '2026-05-29 00:11:41', '2026-05-29 00:11:48'),
(483, 'App\\Models\\User', 89, 'auth_token', '044ba57589ed1fa55997cc555d07f7e90f6ab4557df5fefbd4f1b6d09a6b5a10', '[\"*\"]', '2026-05-29 00:20:59', NULL, '2026-05-29 00:20:53', '2026-05-29 00:20:59'),
(484, 'App\\Models\\User', 89, 'auth_token', 'f2959b15ab3537e6b63b3e2a4d5607cc52da1c10eb40d1878c837e4f208fe8ac', '[\"*\"]', '2026-05-29 00:39:56', NULL, '2026-05-29 00:39:53', '2026-05-29 00:39:56'),
(485, 'App\\Models\\User', 89, 'auth_token', '41be1fb2c3f2813360edf5da48c15bb080bd80792ef8e1c12a6a10484bfc6e53', '[\"*\"]', '2026-05-29 00:48:28', NULL, '2026-05-29 00:40:21', '2026-05-29 00:48:28'),
(486, 'App\\Models\\User', 89, 'auth_token', '594b75f544439db35d507abd4b2eccb21a2558eadb951b13f45f3df071573e01', '[\"*\"]', '2026-05-29 00:51:43', NULL, '2026-05-29 00:50:09', '2026-05-29 00:51:43'),
(487, 'App\\Models\\User', 89, 'auth_token', '8120fbe6b9c3a8806e95e2d373fe30ee3d612b5c6a6b994217c85819eb3f61df', '[\"*\"]', '2026-05-29 00:55:09', NULL, '2026-05-29 00:55:03', '2026-05-29 00:55:09'),
(488, 'App\\Models\\User', 59, 'auth_token', '6f3f9a8dd8ac1cfa7846ba407ed3b339b98e74f4196235abd96833d992062829', '[\"*\"]', '2026-05-29 01:29:09', NULL, '2026-05-29 01:29:06', '2026-05-29 01:29:09'),
(489, 'App\\Models\\User', 59, 'auth_token', 'd55b17845fd36d0f41a0fe5c95b8b7896a747dedd8520ef790cf359969f8dee8', '[\"*\"]', '2026-05-29 01:30:23', NULL, '2026-05-29 01:30:20', '2026-05-29 01:30:23'),
(490, 'App\\Models\\User', 59, 'auth_token', '86e26b4b9443ca0ef2ee9341d5ba140638498ef6591fad91be8bd724ac50ae76', '[\"*\"]', '2026-05-29 01:30:49', NULL, '2026-05-29 01:30:47', '2026-05-29 01:30:49'),
(492, 'App\\Models\\User', 59, 'auth_token', '67c414315f63a5c1dbed272758bb4c866563301243475afd56a1589cc9ca29ea', '[\"*\"]', '2026-05-29 01:54:23', NULL, '2026-05-29 01:54:15', '2026-05-29 01:54:23'),
(494, 'App\\Models\\User', 59, 'auth_token', 'ac8a555e9a6cee5e1a2ee987c3fb34cbc3c1d7d0f246827e5518f90125a890c0', '[\"*\"]', '2026-05-30 15:28:38', NULL, '2026-05-29 02:00:50', '2026-05-30 15:28:38'),
(495, 'App\\Models\\User', 89, 'auth_token', '91ee0438e43883e2e0a528a357ec2e801b81eaf44bb7f0e1c64749b31738f7de', '[\"*\"]', '2026-05-29 02:12:55', NULL, '2026-05-29 02:12:52', '2026-05-29 02:12:55'),
(496, 'App\\Models\\User', 89, 'auth_token', 'e14a32b40dda9157ca8f3c28c434c302c4e06cf322e400b5bbbd77b3d2b90a19', '[\"*\"]', '2026-05-29 02:15:21', NULL, '2026-05-29 02:14:52', '2026-05-29 02:15:21'),
(497, 'App\\Models\\User', 89, 'auth_token', 'dcfa735337a1d9884ec6e1437b8a77d1efa7ff93a5a0142be5246952e6b028ed', '[\"*\"]', '2026-05-29 02:16:45', NULL, '2026-05-29 02:16:40', '2026-05-29 02:16:45'),
(498, 'App\\Models\\User', 89, 'auth_token', '64d67bd88bc5a96b6874c2fbfeb322a16b5edfdc02232bb62e25b02eafebf240', '[\"*\"]', '2026-05-29 02:20:01', NULL, '2026-05-29 02:19:02', '2026-05-29 02:20:01'),
(499, 'App\\Models\\User', 59, 'auth_token', '11b6af94fa8220546c33ed4534b4c68178d886cededf538d1ae9e47d78f2b4bb', '[\"*\"]', '2026-05-29 02:55:02', NULL, '2026-05-29 02:54:55', '2026-05-29 02:55:02');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(503, 'App\\Models\\User', 59, 'auth_token', 'ff456e3c9dd8044a71357d7e86fbd695adcb5840559168643a0a8feacbb6e7f3', '[\"*\"]', '2026-06-08 12:23:34', NULL, '2026-05-29 16:53:46', '2026-06-08 12:23:34'),
(504, 'App\\Models\\User', 72, 'auth_token', '262e1ce28fbcb738e11f8a6797b7c0f91df3e53362009610e9336ce9c44929d2', '[\"*\"]', '2026-05-30 18:19:30', NULL, '2026-05-30 18:15:02', '2026-05-30 18:19:30'),
(505, 'App\\Models\\User', 72, 'auth_token', '522796c5a75722030f6beb560ab35013c4d5bb8ee65f84f6106e9d3680f708c0', '[\"*\"]', '2026-05-30 18:21:37', NULL, '2026-05-30 18:20:00', '2026-05-30 18:21:37'),
(507, 'App\\Models\\User', 90, 'auth_token', 'a797d799494d8fac14f11a42b47b203036d6f65b94e331321b4e130f6d2ec332', '[\"*\"]', '2026-05-30 21:31:38', NULL, '2026-05-30 21:26:46', '2026-05-30 21:31:38'),
(512, 'App\\Models\\User', 1, 'auth_token', 'd0d195f408849f022a3c2a6d44fd892e2a0f5f904156ad7bb27b0a0fc5123436', '[\"*\"]', '2026-05-31 10:02:25', NULL, '2026-05-31 09:26:39', '2026-05-31 10:02:25'),
(513, 'App\\Models\\User', 91, 'auth_token', '679f46ddf11fc9e8e4c38608f574adff695720cdcd0f40af38844b43c3c62a8f', '[\"*\"]', '2026-05-31 10:04:01', NULL, '2026-05-31 10:01:14', '2026-05-31 10:04:01'),
(514, 'App\\Models\\User', 92, 'auth_token', 'dc2d39bc7ab6a821d89a72f1af51f9822b6a8281f7e26efd8f4b8fd829ac406b', '[\"*\"]', '2026-05-31 10:54:38', NULL, '2026-05-31 10:54:31', '2026-05-31 10:54:38'),
(515, 'App\\Models\\User', 92, 'auth_token', '96d0f110a5954803641163883e861a3872652457e2b9c1c638914f9aba110a83', '[\"*\"]', '2026-05-31 10:56:12', NULL, '2026-05-31 10:55:52', '2026-05-31 10:56:12'),
(517, 'App\\Models\\User', 72, 'auth_token', '337a36df684d47f65137b9789f1c6fdaab82a6f5c9699dd3f7b1631d87581d69', '[\"*\"]', '2026-05-31 17:29:15', NULL, '2026-05-31 17:22:36', '2026-05-31 17:29:15'),
(521, 'App\\Models\\User', 72, 'auth_token', '64ee07ef8a2d2ffdbe0b2dd22573481942114bd6182165c77c1eec7e7f30ab53', '[\"*\"]', '2026-06-02 20:06:44', NULL, '2026-06-02 19:55:52', '2026-06-02 20:06:44'),
(524, 'App\\Models\\User', 72, 'auth_token', '2f7118353982d607cc53d987e8ea88e1e4c6a59e9ab2cdb091a5c7a2ec49e9f9', '[\"*\"]', '2026-06-04 13:23:13', NULL, '2026-06-04 13:21:43', '2026-06-04 13:23:13'),
(526, 'App\\Models\\User', 72, 'auth_token', '11822a6942b189d632ffff5d427202e01e5e5789a743fc6f4210fab55ed03d42', '[\"*\"]', '2026-06-04 18:42:05', NULL, '2026-06-04 18:41:56', '2026-06-04 18:42:05'),
(527, 'App\\Models\\User', 72, 'auth_token', '8235fa87630ef5ab25562641c4535c21d4248df8dfcaaf101799824e41bf74f2', '[\"*\"]', '2026-06-05 14:54:07', NULL, '2026-06-05 14:50:22', '2026-06-05 14:54:07'),
(528, 'App\\Models\\User', 72, 'auth_token', '7820f59127371f58e69a316196902df397fbd39734aafd3eed12a6125f25f4af', '[\"*\"]', '2026-06-05 17:47:03', NULL, '2026-06-05 17:40:58', '2026-06-05 17:47:03'),
(529, 'App\\Models\\User', 72, 'auth_token', '2dd752c1b5d6b8e6ab1be3931d0d3af191720fb0c37cdd480c4e86062706440c', '[\"*\"]', '2026-06-06 19:23:30', NULL, '2026-06-06 19:22:47', '2026-06-06 19:23:30'),
(530, 'App\\Models\\User', 93, 'auth_token', 'ad2a0fe4189e21ecfa13355ff5fda55bf9666689c48aaa3db9a475de08690074', '[\"*\"]', '2026-06-06 20:54:21', NULL, '2026-06-06 20:53:08', '2026-06-06 20:54:21'),
(531, 'App\\Models\\User', 93, 'auth_token', '9ec6d9d32f0c77dec51cb63f5359bad0336a6f0e3cbfa04b5ec8fbdcf5335258', '[\"*\"]', '2026-06-06 20:55:27', NULL, '2026-06-06 20:55:24', '2026-06-06 20:55:27'),
(535, 'App\\Models\\User', 94, 'auth_token', '8c5d8b65ce2ffaa469053d121935f9d6361035d67ea5b1e84ee49fc93b92eeee', '[\"*\"]', '2026-06-11 08:40:14', NULL, '2026-06-11 08:40:10', '2026-06-11 08:40:14'),
(537, 'App\\Models\\User', 95, 'auth_token', 'b0558c914998a908103feafe518a70879e41fe90f520322a82ec2c8fb91a0faa', '[\"*\"]', '2026-06-13 15:49:45', NULL, '2026-06-13 15:49:35', '2026-06-13 15:49:45'),
(538, 'App\\Models\\User', 60, 'auth_token', '08a488e2af326891dbc3a35a1f0e782c9577078fc2c11b1b736ced8ae9929b5e', '[\"*\"]', '2026-06-13 17:26:31', NULL, '2026-06-13 17:23:07', '2026-06-13 17:26:31'),
(539, 'App\\Models\\User', 59, 'auth_token', 'a1a261fcb496cddbca444a4d4114333167c12c017da039e7908d1e9ad0a2fd89', '[\"*\"]', NULL, NULL, '2026-06-15 16:05:00', '2026-06-15 16:05:00'),
(541, 'App\\Models\\User', 96, 'auth_token', '4f13fa6fa0440af5791c12566c2dbf5cc67d154fe5d20f76bd53f1cd60b85b89', '[\"*\"]', '2026-06-15 17:36:00', NULL, '2026-06-15 17:34:58', '2026-06-15 17:36:00'),
(542, 'App\\Models\\User', 97, 'auth_token', '2ef2d1c5e3145eb8a4b529d4aded3d6993c9bb78a9f3f2be60c6d032af8744e1', '[\"*\"]', '2026-06-15 20:19:20', NULL, '2026-06-15 20:17:39', '2026-06-15 20:19:20'),
(543, 'App\\Models\\User', 59, 'auth_token', '38aef66a23e3f694690fc4fc5a9463fafedb8ed5080beae5e5acdb59f10340fa', '[\"*\"]', '2026-06-24 15:23:06', NULL, '2026-06-16 09:39:15', '2026-06-24 15:23:06'),
(544, 'App\\Models\\User', 98, 'auth_token', 'dbb4d52c1b5298da0a2ce1909750958c6ac8a37e32d4f3467eb659f6b7c2ffdd', '[\"*\"]', '2026-06-16 17:36:40', NULL, '2026-06-16 17:36:35', '2026-06-16 17:36:40'),
(547, 'App\\Models\\User', 72, 'auth_token', '8359248ee7e58ec6acea6f8665763655d3722223f4ee955bfde942ad053bee0c', '[\"*\"]', '2026-06-21 06:27:04', NULL, '2026-06-21 06:25:17', '2026-06-21 06:27:04'),
(551, 'App\\Models\\User', 72, 'auth_token', 'c108f613e3c99e8e2399169e03bab4e907b87ba4044557c31c2d26a5fadb7ba0', '[\"*\"]', '2026-06-28 13:57:43', NULL, '2026-06-28 13:57:30', '2026-06-28 13:57:43'),
(555, 'App\\Models\\User', 1, 'auth_token', '96b894a58b0530beb04a9845c0078e5f1f0e576860beedf5668e0ce3576518d6', '[\"*\"]', '2026-06-29 16:13:36', NULL, '2026-06-29 15:58:00', '2026-06-29 16:13:36'),
(560, 'App\\Models\\User', 59, 'auth_token', 'd5be4fa7487775a15dcb3beee2be2098f4777e8a3590a46f0e162972efef2d6e', '[\"*\"]', '2026-07-23 16:17:28', NULL, '2026-07-23 16:17:23', '2026-07-23 16:17:28');

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

DROP TABLE IF EXISTS `plans`;
CREATE TABLE `plans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `plan_key` varchar(20) NOT NULL COMMENT 'basic | nutrition | elite | vip',
  `name_ar` varchar(100) NOT NULL,
  `name_en` varchar(100) NOT NULL,
  `subtitle_ar` varchar(200) NOT NULL DEFAULT '',
  `subtitle_en` varchar(200) NOT NULL DEFAULT '',
  `price_1m` decimal(10,2) NOT NULL DEFAULT 0.00,
  `original_price_1m` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_1m` tinyint(3) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'percentage 0-100',
  `price_3m` decimal(10,2) NOT NULL DEFAULT 0.00,
  `original_price_3m` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_3m` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `price_6m` decimal(10,2) NOT NULL DEFAULT 0.00,
  `original_price_6m` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_6m` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `features_ar` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`features_ar`)),
  `features_en` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`features_en`)),
  `is_popular` tinyint(1) NOT NULL DEFAULT 0,
  `badge_ar` varchar(100) DEFAULT '',
  `badge_en` varchar(100) DEFAULT '',
  `color` varchar(30) NOT NULL DEFAULT 'blue',
  `icon` varchar(10) NOT NULL DEFAULT '?',
  `sort_order` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `plan_key`, `name_ar`, `name_en`, `subtitle_ar`, `subtitle_en`, `price_1m`, `original_price_1m`, `discount_1m`, `price_3m`, `original_price_3m`, `discount_3m`, `price_6m`, `original_price_6m`, `discount_6m`, `features_ar`, `features_en`, `is_popular`, `badge_ar`, `badge_en`, `color`, `icon`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'basic', 'الخطة الأساسية', 'Basic Plan', 'مثالي للبداية المستقلة', 'Perfect for Independent Start', 39.00, 39.00, 0, 111.15, 117.00, 5, 210.60, 234.00, 10, '[\"مثالي للبداية المستقلة\",\"خريطة طريق واضحة لمن يحتاج هيكلة\",\"برنامج تدريب مخصص (نادي أو منزل)\",\"برنامج تغذية محسوب (ماكرو/سعرات)\",\"تحديثات شهرية للخطة\"]', '[\"Ideal choice for independent beginning\",\"Clear roadmap for those who need structure\",\"Customized workout plan (Gym or Home)\",\"Calculated nutrition plan (Macros/Calories)\",\"Monthly plan updates\"]', 0, NULL, NULL, 'blue', '💪', 1, 1, '2026-05-22 16:54:32', '2026-05-30 21:33:39'),
(2, 'nutrition', 'خطة التغذية', 'Nutrition Plan', 'حميتك تحت السيطرة', 'Your Diet Under Control', 49.00, 49.00, 0, 139.00, 147.00, 5, 264.00, 294.00, 10, '[\"حميتك تحت السيطرة\",\"حسابات دقيقة للسعرات والماكرو\",\"قائمة تبديل أطعمة لمنع الملل\",\"تحديثات شهرية للتغذية\"]', '[\"Your diet under control\",\"Accurate calorie and macro calculations\",\"Food exchange list to prevent boredom\",\"Monthly nutrition updates\"]', 0, '', '', 'green', '🥗', 2, 1, '2026-05-22 16:54:32', '2026-05-22 16:54:32'),
(3, 'elite', 'الخطة المتميزة', 'Elite Plan', 'التزام ومتابعة', 'Commitment & Follow-up', 79.00, 79.00, 0, 225.00, 237.00, 5, 426.00, 474.00, 10, '[\"كل ما في الخطة الأساسية\",\"نتائج مضمونة مع الالتزام والمتابعة\",\"تعديلات دورية للتقدم الأمثل\",\"متابعة أسبوعية للتقدم\",\"دردشة لدعم استفساراتك\",\"إرشادات المكملات\"]', '[\"Everything in Basic Plan\",\"Guaranteed results with commitment and follow-up\",\"Regular adjustments for optimal progress\",\"Weekly progress check-ins\",\"Chat support for your questions\",\"Supplements guidance\"]', 1, 'الأكثر شعبية', 'Most Popular', 'pink', '🔥', 3, 1, '2026-05-22 16:54:32', '2026-05-22 16:54:32'),
(4, 'vip', 'الخطة VIP', 'VIP Plan', 'تجربة تدريب شخصي كاملة', 'Complete Personal Training Experience', 149.00, 149.00, 0, 424.00, 447.00, 5, 804.00, 894.00, 10, '[\"كل ما في الخطة المتميزة\",\"دعم مباشر يومي\",\"أولوية في التواصل\",\"جلسة استشارية شهرية فردية\"]', '[\"Everything in Elite Plan\",\"Direct daily support\",\"Priority communication\",\"One-on-one monthly consulting session\"]', 0, '', '', 'gold', '👑', 4, 1, '2026-05-22 16:54:32', '2026-05-22 16:54:32');

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
CREATE TABLE `site_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(100) NOT NULL,
  `value` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES
(1, 'active_link_theme', 'ground-line', '2026-04-10 12:10:45', '2026-06-29 16:13:06');

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
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
(176, 59, 'elite', '3months', 225.00, 237.00, 5, 'paypal', 'approved', '1HX792512R832150P', '34RTTN6SGMPRG', NULL, NULL, 'USD', NULL, '2026-03-28 00:00:00', '2026-06-28 00:00:00', '2026-03-16 21:05:32', '2026-06-30 19:40:23', '2026-06-30 19:40:23'),
(180, 68, 'nutrition', '1month', 49.00, 49.00, 0, 'bank_transfer', 'approved', NULL, NULL, '00000', 'receipts/Be9OSYWVNLABFpim1dvKvqS2FCRv01jVnGeagK1C.png', 'USD', 'تحويل بنكي', '2026-05-18 00:00:00', '2026-06-18 00:00:00', '2026-05-18 15:49:44', '2026-06-30 19:40:54', '2026-06-30 19:40:54'),
(199, 72, 'elite', '1month', 79.00, 56.00, 0, 'paypal', 'approved', NULL, NULL, NULL, NULL, 'USD', NULL, '2026-05-24 00:00:00', '2026-06-24 00:00:00', '2026-05-23 21:00:25', '2026-06-30 19:40:30', '2026-06-30 19:40:30'),
(201, 60, 'basic', '1month', 39.00, 39.00, 0, 'paypal', 'pending', '4X699757KN218631S', NULL, NULL, NULL, 'USD', NULL, NULL, NULL, '2026-06-13 17:25:10', '2026-06-30 19:40:36', '2026-06-30 19:40:36'),
(202, 60, 'basic', '1month', 39.00, 39.00, 0, 'paypal', 'pending', '1Y0651951F562221E', NULL, NULL, NULL, 'USD', NULL, NULL, NULL, '2026-06-13 17:26:31', '2026-06-30 19:40:42', '2026-06-30 19:40:42'),
(203, 67, 'basic', '1month', 39.00, 39.00, 0, 'paypal', 'pending', '5SN42654PC7078304', NULL, NULL, NULL, 'USD', NULL, NULL, NULL, '2026-06-16 14:46:26', '2026-06-16 23:43:04', '2026-06-16 23:43:04'),
(204, 67, 'basic', '1month', 39.00, 39.00, 0, 'paypal', 'pending', '53S805487P6157836', NULL, NULL, NULL, 'USD', NULL, NULL, NULL, '2026-06-16 15:04:51', '2026-06-16 23:43:18', '2026-06-16 23:43:18'),
(205, 67, 'basic', '1month', 39.00, 39.00, 0, 'paypal', 'pending', '9YT63813SL686681E', NULL, NULL, NULL, 'USD', NULL, NULL, NULL, '2026-06-16 15:08:43', '2026-06-16 23:43:11', '2026-06-16 23:43:11');

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
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
(9, 'images/testimonials/testimonial_1772063879_B9hULd17Sz.jpeg', 'testimonial_1772063879_B9hULd17Sz.jpeg', 'Mohammed Juma', 'محمد جمعة', 'Student', 'طالب جامعي', 'Honestly, my experience was excellent from start to finish. From the moment I subscribed, I felt real support and genuine follow-up. The plan was clear and perfectly tailored to my goals, and I started seeing noticeable results in a short time. I highly recommend it to anyone who wants real progress and meaningful results.', 'بصراحة تجربتي كانت ممتازة جداً، من أول ما اشتركت حسّيت بالاهتمام والمتابعة الحقيقية. الخطة كانت واضحة ومناسبة لهدفي، والنتائج بدأت تظهر بشكل ملحوظ خلال فترة قصيرة. أنصح أي شخص حاب يطور من نفسه ويشوف نتائج فعلية إنه يجرب بدون تردد.', 5, 0, 1, 1, '2026-02-25 23:57:33', '2026-04-26 10:23:49', NULL),
(11, 'images/testimonials/testimonial_1777198748_JZs2x0AojV.jpeg', 'testimonial_1777198748_JZs2x0AojV.jpeg', 'Layla Hameed', 'ليلى حميد', 'Mom of two', 'ام لطفلين', 'After my second pregnancy, I felt like I’d never get back to my normal weight. Rand designed a plan that fits my limited time as a mom, and in 4 months I came back better than before! The continuous follow-up and emotional support were the most important thing. I recommend every mom struggling after pregnancy to try RanLogic.', 'بعد الولادة الثانية، حسيت إني ما رح أرجع لوزني الطبيعي أبداً. راند صممتلي خطة تناسب وقتي المحدود كأم، وبـ 4 شهور رجعت أحسن من قبل! المتابعة المستمرة والدعم النفسي كانوا أهم شي. أنصح كل أم بتعاني بعد الحمل تجرب RanLogic.', 5, 1, 1, 1, '2026-04-26 10:14:20', '2026-04-26 10:23:49', NULL),
(12, 'images/testimonials/testimonial_1777198686_6aUFdcO3r2.jpeg', 'testimonial_1777198686_6aUFdcO3r2.jpeg', 'Layan Nasser', 'ليان ناصر', 'Admin Staff', 'موظفة ادارية', 'Honestly, the coach completely changed my life. I used to always start a diet and stop after two weeks, but with the continuous follow-up and personalized plan, I was able to lose 12 kg in 3 months. The most important thing is that I learned to live a healthy life, not just a temporary diet. The results are still with me today and the energy I have now is indescribable!', 'بصراحة، الكوتش غيرت حياتي كلياً. كنت دايماً أبدأ دايت وأوقف بعد أسبوعين، بس مع المتابعة المستمرة والخطة المخصصة إلي، قدرت أخسر 12 كيلو بـ 3 شهور. الشي الأهم إني تعلمت أعيش حياة صحية مش بس دايت مؤقت. النتائج باقية معي لليوم والطاقة يلي صرت فيها ما بتنوصف!', 5, 2, 1, 1, '2026-04-26 10:14:20', '2026-04-26 10:23:49', NULL),
(13, 'images/testimonials/testimonial_1777199023_t7uqNeNfrw.jpeg', 'testimonial_1777199023_t7uqNeNfrw.jpeg', 'Khaled', 'خالد', 'Sales Employee', 'موظف مبيعات', 'I always used to say “I don’t have time for exercise,” but Rand proved to me that it’s not about time, it’s about organization and willpower. Just 30-minute workouts 4 times a week, and a simple and realistic eating plan. The result? I lost 10 kg, my energy increased, and I’m now accomplishing twice as much at work!', 'كنت دايماً أقول “ما عندي وقت للرياضة”، لكن راند أثبتتلي إنه الموضوع مش بالوقت، بالتنظيم والإرادة. تمارين 30 دقيقة بس 4 مرات بالأسبوع، ونظام أكل بسيط وواقعي. النتيجة؟ خسرت 10 كيلو، زادت طاقتي، وصرت أنجز بشغلي ضعف!', 5, 3, 1, 1, '2026-04-26 10:23:01', '2026-04-26 10:23:49', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `testimonials_section`
--

DROP TABLE IF EXISTS `testimonials_section`;
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

DROP TABLE IF EXISTS `users`;
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
  `fcm_token` text DEFAULT NULL,
  `onesignal_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `language`, `email_verified_at`, `password`, `role`, `is_active`, `avatar`, `phone`, `height`, `weight`, `waist`, `hips`, `age`, `gender`, `goal`, `workout_place`, `program`, `health_notes`, `has_active_subscription`, `subscription_start_date`, `subscription_end_date`, `remember_token`, `fcm_token`, `onesignal_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Rand Jarrar', 'admin@ranlogic.com', 'ar', '2026-01-17 23:12:26', '$2y$12$YLFRqcmiS8diGbkh7lqIvOKstcl0E9eKHuGUkwZlFxo8asZp1g7yW', 'admin', 1, 'avatars/avatar_1_1772134322.jpeg', NULL, NULL, NULL, NULL, NULL, 28, 'female', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-01-17 23:12:26', '2026-04-19 15:45:47', NULL),
(59, 'Mohammed', 'mohammed.n.jumaa@gmail.com', 'ar', NULL, '$2y$12$wXEm0Au6a.k/pRsaGszZnODXp1lBTx4q530D5604YTVWTSdWuwFP.', 'user', 1, 'avatars/avatar_59_1774392011.jpeg', NULL, 180.00, 99.00, 100.00, NULL, 26, 'male', 'weight-loss', 'gym', 'خسارة وزن', 'مقاومة انسولين', 0, '2026-03-28', '2026-06-28', NULL, '{\"endpoint\":\"https://web.push.apple.com/QMfmnQRhnEWSH_z-pYIzWGdOlp1kA0cWPxOqoUN2W2MjgCIK3AuJnpxXnl1HU7UpFJVR1t1YDC3lgDV6dXjxnhUdKt-r8jLYLnGW53otIOp80pcsfyl_YnhtbGDAawiymd45HC6t2J6L951ZW9btbAmPLwrvxd0tzjQU1qKHSGw\",\"keys\":{\"p256dh\":\"BE3kNnWp8ZpDPPjVqQg8FB9Asix-RRnVFrul4Jz9QpMJwIXzidsk309xCBBlRu83jPthxFdCke7QyE-0niufuik\",\"auth\":\"LiPSzHY1-HnA8ZCdfHjwxA\"}}', '4dcba3eb-16fe-474a-96be-d7435ff50df6', '2026-03-16 20:59:08', '2026-07-23 16:17:28', NULL),
(60, 'سيف سعد', 'alhrbyahmd846@gmail.com', 'ar', NULL, '$2y$12$XhtBA7CrOGyuyu8PpyELo.MNeM8V26U/Sm9EXYcBPkpF/2IrchkSC', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-03-24 05:10:39', '2026-04-05 18:40:28', NULL),
(61, 'محمد عارف', 'm7mdaref00@gmail.com', 'ar', NULL, '$2y$12$1KSYqcveFGy2iW1fHegqO.zdEfgMr/j0XNKJ5dN936LF4bKbD.LnW', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-03-24 12:50:15', '2026-04-05 18:40:21', NULL),
(66, 'omar', 'mujahedomar14@gmail.com', 'ar', NULL, '$2y$12$LheqeqOgsjQk1BSc9H99mugdIUiJ2Jg2rJc4LhOVU/Jv/L2YIjVoG', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-05-17 17:26:57', '2026-05-17 17:26:57', NULL),
(67, 'سوان', 'swan.mysong@gimal.com', 'ar', NULL, '$2y$12$cFkxstwrzx7Xjj8UGqo2EepQwdSOWQ5e6WllwnFb9aIq.ivlSFd7y', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'female', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-05-17 22:31:29', '2026-05-17 22:31:29', NULL),
(68, 'Basel Wazani', 'basel.wazani@hotmail.com', 'ar', NULL, '$2y$12$KauuMaULOBdHTkrsLTGrS.Z/aYBqzNzjG4pk2.1fkqfoW.MAuyZOS', 'user', 1, NULL, NULL, 175.00, 75.00, 50.00, NULL, 30, 'male', 'muscle-gain', 'gym', 'بناء عضلات', 'ديسك L5-S1', 0, '2026-05-18', '2026-05-18', NULL, NULL, NULL, '2026-05-18 15:46:20', '2026-06-18 01:00:06', NULL),
(69, 'Dana Ahmad', 'majdydana@gmail.com', 'ar', NULL, '$2y$12$rkiqUbdYQb1Uha.7NwUdfePObFDA/tOj5RqZ.nKdQ7W.y/uNHqH0a', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'female', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-05-18 21:54:38', '2026-05-18 21:54:38', NULL),
(71, 'Farah Al Theeb', 'farah.fareed2000@gmail.com', 'ar', NULL, '$2y$12$9Qivq0rNvmVqZmxj8Qp5OOyfpvUT0B5aWt50CHwIbNTQvFsofbsFq', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'female', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-05-18 23:23:41', '2026-05-18 23:23:41', NULL),
(72, 'Marah Azzam', 'marahazzam83@gmail.com', 'ar', NULL, '$2y$12$Ck25fHl1RmhjtudL/wk6C.jxv62f.73ZUhwuteVLS5WGjbIa8HCNm', 'user', 1, NULL, NULL, 163.00, 74.00, 94.00, 67.00, 28, 'female', 'weight-loss', 'gym', NULL, 'انخفاض شديد في فيتامين دال والحديد', 0, '2026-05-24', '2026-06-24', NULL, NULL, NULL, '2026-05-19 09:18:05', '2026-06-24 01:00:06', NULL),
(77, 'Anas ayman', 'anasqasrawi565@gmail.com', 'ar', NULL, '$2y$12$Lwd5mx.0C0hhV9wLPpdohui2GZydmWaMjtO3bvQQ3bHRqw2ug6v12', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-05-20 16:36:22', '2026-05-20 16:36:22', NULL),
(79, 'Adham', 'adhamrefat010@gmail.com', 'ar', NULL, '$2y$12$nwM7XJVtlUWv9KYsdCNQyepFfFQNavV0u.zzANjf21Pd3XOBjyTz2', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-05-21 19:32:43', '2026-05-21 19:32:43', NULL),
(84, 'Shaheen Abuashour', 'shaheenabuashoor@gmail.com', 'ar', NULL, '$2y$12$vNGD1lEazYWNJB3PU4/ShuIR2/c7n1fvXn.qwh4FPP.1cCVlIZDJC', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-05-24 17:49:11', '2026-05-24 17:49:11', NULL),
(85, 'Ammar Masmoum', 'ammarmasmoum@yahoo.com', 'ar', NULL, '$2y$12$F2f1TTcFt8n0nJQG/xbEmucI8StShMEOpk4agaiwAvLL4Td4Q0Gpq', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-05-25 14:59:06', '2026-05-25 14:59:06', NULL),
(86, 'Adham Al Asad', 'adhamalasad2021@gmail.com', 'ar', NULL, '$2y$12$mOTSpRsE.VGuapoNyG7KIu9BwJMSPAM19TpPPEc/R5TbjbFeyXh8i', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-05-25 15:47:47', '2026-05-25 15:47:47', NULL),
(87, 'ليث ابو صلاح', 'alarabylayth3@gmail.com', 'ar', NULL, '$2y$12$sXogWdaTCFIuIYFy3o1LWuQN58LTnTFBBz304C8Gz132krq0ogEUW', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-05-25 21:12:21', '2026-05-25 21:12:21', NULL),
(88, 'Yousef Jaber', 'yousefjaber1999@gmail.com', 'ar', NULL, '$2y$12$FpcaV9bJ3.mncDCpdSxhguXGg8nRC51Ru1xhgnPSNY6DpEX8DuXdy', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-05-28 16:47:02', '2026-05-28 16:47:02', NULL),
(91, 'يوسف صافي', 'jos799608@gmail.com', 'ar', NULL, '$2y$12$qxlbEORECr4UGotmqQQ25OVIWBDERMwAJZ6hgqOFyhpZFXLEcXlwW', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-05-31 10:01:14', '2026-05-31 10:01:14', NULL),
(92, 'Yousif', 'yousifucj@gmail.com', 'ar', NULL, '$2y$12$ckjlngs7.AVD2h35Nq26BOWOeQgUAKIw/WNH405odW0.vCPI70yrG', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-05-31 10:54:31', '2026-05-31 10:54:31', NULL),
(93, 'عبد الرحمن', 'vartolu00000@gmail.com', 'ar', NULL, '$2y$12$Jbn6GD74HmKsu06HZlztaeMZ722ZPhtSuUO2MzTuEm44zw2vJ3292', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-06-06 20:53:08', '2026-06-06 20:53:08', NULL),
(94, 'Ammar Tello', 'ammartello97@gmail.com', 'ar', NULL, '$2y$12$4yEPGGeO6pSw9WFmug7Ws./p60GMyaRm27wUCbWWDuVb9BwapYe5G', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-06-11 08:40:10', '2026-06-11 08:40:10', NULL),
(95, 'Omar Altali', 'oaltali.e@gmail.com', 'ar', NULL, '$2y$12$3AW4pvpaE4bulvMFEmLSvuRw/zWLnxpubQE1LrXc6cYpg0H/zU2Jy', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-06-13 15:49:35', '2026-06-13 15:49:35', NULL),
(96, 'مريم حمدي غيث', 'maryamhamdyghaith@outlook.com', 'ar', NULL, '$2y$12$LRRVQmH0e//erXeRWZQcBeXWSkyVwMSOVla7cDG0NlWdfUMONLtOK', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'female', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-06-15 17:34:58', '2026-06-15 17:34:58', NULL),
(97, 'Dana Mohammad Falah Obeidat', 'dana.obaidat@yahoo.com', 'ar', NULL, '$2y$12$WnptQl9jq6Bc6pr/MMQy5eVALscEzegk1i/j/WNnCvop2IDKddWpS', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'female', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-06-15 20:17:39', '2026-06-15 20:17:39', NULL),
(98, 'مصعب نجمات', 'mnjmat16@gmail.com', 'ar', NULL, '$2y$12$rBUlYyOl96rj5LNzNJGWm.qYoVj1BrXc97Agjh1mMQ5mpS2GKyTH2', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-06-16 17:36:35', '2026-06-16 17:36:35', NULL),
(99, 'نوف ابو رجيع', 'noufaburjai25@gmail.com', 'ar', NULL, '$2y$12$GC0nEg/2kXJ5N5HanWe/f.zKFcJmelmeZtHcInbCYHHs93vVopdXC', 'user', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'female', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-06-17 04:48:24', '2026-06-17 04:48:24', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_goals`
--

DROP TABLE IF EXISTS `user_goals`;
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

DROP TABLE IF EXISTS `user_questions`;
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

-- --------------------------------------------------------

--
-- Table structure for table `workout_exercises`
--

DROP TABLE IF EXISTS `workout_exercises`;
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
(33, 18, '2026-03-28', 'Chest', 3, 20, 'ملاحظات: Progressive overload، اشرب ماي كافي، اتبع نظام غذائي متوازن، الراحة بين التمارين 60-90 ثانية.​​​​​​​​​​​​​​​​', 'https://youtu.be/zD266B2jk0s', NULL, 1, '2026-03-28 20:21:38', 0, '2026-03-27 20:23:33', '2026-03-28 20:21:38'),
(34, 18, '2026-03-28', 'Cardio', 3, 12, '20 min ', 'https://youtu.be/fqCeYdMCnFs', NULL, 1, '2026-03-28 21:01:05', 1, '2026-03-27 20:23:33', '2026-03-28 21:01:05'),
(35, 18, '2026-03-29', 'Back', 3, 20, 'اختار 3 تمارين \nكل تمرين 3 مجموعات \nوكل مجموعة 20 تكرار', 'https://youtube.com/shorts/Xp6I7gsGxE0?si=oNuK-54G2JHG4trA', NULL, 1, '2026-03-29 23:19:27', 2, '2026-03-27 20:23:33', '2026-03-29 23:19:27'),
(36, 18, '2026-03-29', 'Abs', 3, 20, 'اختار 3 تمارين \nكل تمرين 3 مجموعات \nوكل مجموعة 20 تكرار', 'https://youtu.be/i27K2ry9jEo', NULL, 1, '2026-03-29 23:19:31', 3, '2026-03-27 20:23:33', '2026-03-29 23:19:31'),
(37, 18, '2026-03-29', ' Cardio', 3, 12, '20 min', 'https://youtu.be/9lVBk1gS6qc', NULL, 1, '2026-03-29 23:19:34', 4, '2026-03-27 20:23:33', '2026-03-29 23:19:34'),
(38, 18, '2026-03-30', 'Legs', 3, 15, 'اختيار 3 تمارين ', 'https://youtu.be/hRZ5MM6gmlE', NULL, 1, '2026-03-30 19:53:16', 5, '2026-03-27 20:23:33', '2026-03-30 19:53:16'),
(39, 18, '2026-03-30', 'Abs', 3, 12, 'عمل كل التمارين \n7 min', 'https://youtu.be/95hX_OMuIpg', NULL, 1, '2026-03-30 20:45:35', 6, '2026-03-27 20:23:33', '2026-03-30 20:45:35'),
(40, 18, '2026-03-31', 'Shoulders', 3, 15, 'عمل جميع التمارين ', 'https://youtu.be/928aRhhPP8I', NULL, 1, '2026-03-31 20:21:59', 7, '2026-03-27 20:23:33', '2026-03-31 20:21:59'),
(41, 18, '2026-03-31', 'Cardio', 3, 12, '20 min', 'https://youtu.be/79cx5vmf3Qg', NULL, 1, '2026-03-31 20:22:03', 8, '2026-03-27 20:23:33', '2026-03-31 20:22:03'),
(42, 19, '2026-04-03', 'Bench Press ', 4, 10, 'Push — صدر + أكتاف + ترايسبس\n⏱ 60 دقيقة\n🔥 10 دقائق إحماء\n💤 راحة 60-90 ثانية بين السيتات', 'https://youtube.com/shorts/gQ3afio08V8?si=YLL7lAeowVf4XKIO', NULL, 1, '2026-04-03 19:36:23', 0, '2026-04-03 00:45:36', '2026-04-06 23:00:21'),
(43, 19, '2026-04-03', 'Incline Dumbbell Press ', 3, 12, '', 'https://youtu.be/DbFgADa2PL8', NULL, 1, '2026-04-03 19:43:39', 1, '2026-04-03 00:45:36', '2026-04-06 23:00:21'),
(44, 19, '2026-04-03', 'Overhead Press ', 4, 10, '', 'https://youtu.be/2yjwXTZQDDI', NULL, 1, '2026-04-03 19:49:20', 2, '2026-04-03 00:48:01', '2026-04-06 23:00:21'),
(45, 19, '2026-04-03', 'Lateral Raise ', 3, 15, '', 'https://youtu.be/3VcKaXpzqRo', NULL, 1, '2026-04-03 20:04:32', 3, '2026-04-03 00:48:01', '2026-04-06 23:00:21'),
(46, 19, '2026-04-03', 'Skull Crusher ', 3, 10, '', 'https://youtube.com/shorts/K3mFeNz4e3w?si=eqevgAMnjmDdIjTJ', NULL, 1, '2026-04-03 20:17:21', 4, '2026-04-03 00:52:27', '2026-04-06 23:00:21'),
(47, 19, '2026-04-03', 'Tricep Pushdown ', 3, 15, '', 'https://youtu.be/2-LAMcpzODU', NULL, 1, '2026-04-03 20:40:27', 5, '2026-04-03 00:54:35', '2026-04-06 23:00:21'),
(48, 19, '2026-04-04', 'Deadlift — ديدليفت', 4, 8, 'Pull — ظهر + بايسبس\n⏱ 60 دقيقة\n🔥 10 دقائق إحماء\n💤 راحة 60-90 ثانية', 'https://youtu.be/op9kVnSso6Q', NULL, 1, '2026-04-05 23:29:30', 6, '2026-04-03 23:26:35', '2026-04-06 23:00:21'),
(49, 19, '2026-04-04', 'Lat Pulldown — سحب علوي للظهر', 4, 12, '', 'https://youtu.be/CAwf7n6Luuc', NULL, 1, '2026-04-05 23:29:33', 7, '2026-04-03 23:28:30', '2026-04-06 23:00:21'),
(50, 19, '2026-04-04', 'Seated Cable Row — سحب أفقي بكابل', 3, 10, '', 'https://youtu.be/GZbfZ033f74', NULL, 1, '2026-04-05 23:29:37', 8, '2026-04-03 23:29:54', '2026-04-06 23:00:21'),
(51, 19, '2026-04-04', 'Face Pull — فيس بول', 3, 15, '', 'https://youtu.be/eIq5CB9JfKE', NULL, 1, '2026-04-05 23:29:41', 9, '2026-04-03 23:33:18', '2026-04-06 23:00:21'),
(52, 19, '2026-04-04', 'Barbell Curl — كيرل بارز للبايسبس', 3, 12, '', 'https://youtu.be/kwG2ipFRgfo', NULL, 1, '2026-04-05 23:37:20', 10, '2026-04-03 23:35:48', '2026-04-06 23:00:21'),
(53, 19, '2026-04-04', 'Hammer Curl — هامر كيرل', 3, 12, '', 'https://youtu.be/zC3nLlEvin4', NULL, 1, '2026-04-05 23:52:14', 11, '2026-04-03 23:37:30', '2026-04-06 23:00:21'),
(54, 19, '2026-04-05', 'Squat — سكوات بارز', 4, 10, 'Legs — أرجل كاملة\nLEGS\n▾\n⏱ 65 دقيقة\n🔥 10 دقائق إحماء\n💤 راحة 90 ثانية\n', 'https://youtu.be/ultWZbUMPL8', NULL, 1, '2026-04-06 23:24:58', 12, '2026-04-05 00:43:38', '2026-04-06 23:24:58'),
(55, 19, '2026-04-05', 'Romanian Deadlift — ديدليفت روماني', 4, 12, '', 'https://youtu.be/JCXUYuzwNrM', NULL, 1, '2026-04-06 23:41:57', 13, '2026-04-05 00:45:12', '2026-04-06 23:41:57'),
(56, 19, '2026-04-05', 'Leg Press — ليغ برس', 3, 15, '', 'https://youtu.be/IZxyjW7MPJQ', NULL, 1, '2026-04-06 23:50:47', 14, '2026-04-05 00:46:46', '2026-04-06 23:50:47'),
(57, 19, '2026-04-05', 'Leg Curl — كيرل أرجل خلفي', 3, 12, '', 'https://youtu.be/1Tq3QdYUuHs', NULL, 1, '2026-04-06 23:55:43', 15, '2026-04-05 00:48:10', '2026-04-06 23:55:43'),
(58, 19, '2026-04-05', 'Walking Lunges — لانجز متحرك', 3, 12, '12 تكرار لكل رجل ', 'https://youtu.be/L8fvypPrzzs', NULL, 1, '2026-04-07 00:00:47', 16, '2026-04-05 00:50:01', '2026-04-07 00:00:47'),
(59, 19, '2026-04-05', 'Calf Raise — رفع أصابع القدم', 3, 15, 'من 15 - 20', 'https://youtube.com/shorts/ADITZCcUyVo?si=Ixr-iVUOzQcNi227', NULL, 1, '2026-04-07 00:08:56', 17, '2026-04-05 00:53:48', '2026-04-07 00:08:56'),
(60, 19, '2026-04-06', 'HIIT على التريدميل ', 3, 12, '(30 ثانية سريع / 90 ثانية هادئ)\n20 دقيقة', '', NULL, 1, '2026-04-08 22:20:55', 18, '2026-04-05 18:46:51', '2026-04-08 22:20:55'),
(61, 19, '2026-04-06', 'Plank — بلانك', 4, 12, '4\n45-60 ثانية\n', 'https://youtu.be/ASdvN_XEl_c', NULL, 1, '2026-04-08 22:36:17', 19, '2026-04-05 18:49:31', '2026-04-08 22:36:17'),
(62, 19, '2026-04-06', 'Cable Crunch — كرانش بكابل للبطن', 3, 15, '', 'https://youtu.be/2fbujeH3F0E', NULL, 1, '2026-04-08 22:55:31', 20, '2026-04-05 18:51:07', '2026-04-08 22:55:31'),
(63, 19, '2026-04-06', 'Leg Raises — رفع أرجل معلق', 3, 15, '', 'https://youtu.be/JB2oyawG9KI', NULL, 1, '2026-04-08 23:13:28', 21, '2026-04-05 18:53:50', '2026-04-08 23:13:28'),
(64, 19, '2026-04-06', 'Russian Twist — تويست روسي', 3, 20, '3\n20 (10 لكل جهة)', 'https://youtu.be/wkD8rjkodUI', NULL, 1, '2026-04-08 23:20:52', 22, '2026-04-05 18:56:18', '2026-04-08 23:20:52'),
(65, 19, '2026-04-07', 'Off ', 3, 12, '', '', NULL, 1, '2026-04-08 21:59:36', 23, '2026-04-05 18:57:37', '2026-04-08 21:59:36'),
(436, 19, '2026-04-10', 'Power Clean - باور كلين', 3, 6, 'تمرين متفجر - احترس من الشكل', 'https://youtu.be/e8TpDdMYq4Y?si=SOpTmYpyCv6_BWuJ', NULL, 1, '2026-04-10 19:58:06', 24, '2026-04-09 21:21:00', '2026-04-10 19:58:06'),
(437, 19, '2026-04-10', 'Dumbbell inRow - سحب بدمبل أحادي', 4, 10, 'ظهر موازي للأرض', 'https://www.youtube.com/watch?v=pYcpY20QaE8', NULL, 1, '2026-04-10 20:15:28', 25, '2026-04-09 21:21:00', '2026-04-10 20:15:28'),
(438, 19, '2026-04-10', 'Goblet Squat - سكوات بكيتلبل', 4, 12, 'عمق كامل', 'https://www.youtube.com/watch?v=MeIiIdhvXT4', NULL, 1, '2026-04-10 20:27:23', 26, '2026-04-09 21:21:00', '2026-04-10 20:27:23'),
(439, 19, '2026-04-10', 'Arnold Press - أرنولد برس', 3, 10, 'دوران الأكتاف الكامل', 'https://www.youtube.com/watch?v=6Z15_WdXmVw', NULL, 1, '2026-04-10 20:31:37', 27, '2026-04-09 21:21:00', '2026-04-10 20:31:37'),
(440, 19, '2026-04-10', 'Bulgarian Split Squat - بلغاري سكوات', 3, 10, 'تحدي التوازن والقوة', 'https://www.youtube.com/watch?v=2C-uNgKwPLE', NULL, 1, '2026-04-10 20:42:27', 28, '2026-04-09 21:21:00', '2026-04-10 20:42:27'),
(441, 19, '2026-04-10', 'Battle Ropes - باتل روبس', 5, 30, 'راحة 60 ث - كارديو نهاية التمرين', 'https://youtube.com/shorts/ZEAqK0lXnb0?si=2vvegqfhri3W8XeL', NULL, 1, '2026-04-10 20:47:34', 29, '2026-04-09 21:21:00', '2026-04-10 20:47:34'),
(442, 19, '2026-04-11', 'Bench Press - بنش برس باربل', 4, 8, 'ركز على الشكل الصحيح - صدر كامل', 'https://youtube.com/shorts/XjrsqShr-Ic?si=NQSKzxvcNz2eGeje', NULL, 1, '2026-04-11 23:12:43', 30, '2026-04-09 21:21:00', '2026-04-11 23:12:43'),
(443, 19, '2026-04-11', 'Incline Dumbbell Press - بنش مائل بدمبل', 3, 10, 'زاوية 45 درجة', 'https://www.youtube.com/watch?v=DbFgADa2PL8', NULL, 1, '2026-04-11 23:19:40', 31, '2026-04-09 21:21:00', '2026-04-11 23:19:40'),
(444, 19, '2026-04-11', 'Overhead Press - ضغط أكتاف باربل', 4, 8, 'أكتاف وقفة مستقيمة', 'https://www.youtube.com/watch?v=2yjwXTZQDDI', NULL, 1, '2026-04-11 23:33:36', 32, '2026-04-09 21:21:00', '2026-04-11 23:33:36'),
(445, 19, '2026-04-11', 'Lateral Raise - رفع جانبي بدمبل', 3, 12, 'حركة بطيئة ومتحكم', 'https://www.youtube.com/watch?v=3VcKaXpzqRo', NULL, 1, '2026-04-11 23:45:23', 33, '2026-04-09 21:21:00', '2026-04-11 23:45:23'),
(446, 19, '2026-04-11', 'Tricep Pushdown - ضغط ترايسبس بكابل', 3, 12, 'اضغط حتى النهاية', 'https://www.youtube.com/watch?v=2-LAMcpzODU', NULL, 1, '2026-04-11 23:53:29', 34, '2026-04-09 21:21:00', '2026-04-11 23:53:29'),
(447, 19, '2026-04-11', 'Skull Crusher - سكال كراشر', 3, 10, 'راحة 60-90 ث بين السيتات', 'https://youtube.com/shorts/K3mFeNz4e3w?si=2XRwktZWHp9eIqIT', NULL, 1, '2026-04-12 00:07:46', 35, '2026-04-09 21:21:00', '2026-04-12 00:07:46'),
(448, 19, '2026-04-12', 'Deadlift - ديدليفت', 4, 6, 'أهم تمرين مركب - ظهر مستقيم', 'https://www.youtube.com/watch?v=op9kVnSso6Q', NULL, 1, '2026-04-12 23:09:06', 36, '2026-04-09 21:21:00', '2026-04-12 23:09:06'),
(449, 19, '2026-04-12', 'Lat Pulldown - سحب علوي للظهر', 4, 10, 'اسحب للصدر وليس للرقبة', 'https://www.youtube.com/watch?v=CAwf7n6Luuc', NULL, 1, '2026-04-12 23:09:14', 37, '2026-04-09 21:21:00', '2026-04-12 23:09:14'),
(450, 19, '2026-04-12', 'Seated Cable Row - سحب أفقي بكابل', 3, 10, 'اشحن الكتف للخلف', 'https://www.youtube.com/watch?v=GZbfZ033f74', NULL, 1, '2026-04-12 23:26:02', 38, '2026-04-09 21:21:00', '2026-04-12 23:26:02'),
(451, 19, '2026-04-12', 'Face Pull - فيس بول', 3, 15, 'مهم لصحة الكتف', 'https://www.youtube.com/watch?v=eIq5CB9JfKE', NULL, 1, '2026-04-12 23:32:29', 39, '2026-04-09 21:21:00', '2026-04-12 23:32:29'),
(452, 19, '2026-04-12', 'Barbell Curl - كيرل باربل للبايسبس', 3, 10, 'لا تتأرجح بالجسم', 'https://www.youtube.com/watch?v=kwG2ipFRgfo', NULL, 1, '2026-04-12 23:42:06', 40, '2026-04-09 21:21:00', '2026-04-12 23:42:06'),
(453, 19, '2026-04-12', 'Hammer Curl - هامر كيرل', 3, 12, 'راحة 60-90 ث بين السيتات', 'https://www.youtube.com/watch?v=zC3nLlEvin4', NULL, 1, '2026-04-12 23:53:14', 41, '2026-04-09 21:21:00', '2026-04-12 23:53:14'),
(454, 19, '2026-04-13', 'Squat - سكوات باربل', 4, 8, 'الملك! - ركبتين على الأصابع', 'https://www.youtube.com/watch?v=ultWZbUMPL8', NULL, 1, '2026-04-13 22:46:00', 42, '2026-04-09 21:21:00', '2026-04-13 22:46:00'),
(455, 19, '2026-04-13', 'Romanian Deadlift - ديدليفت روماني', 4, 10, 'يستهدف الهامستر والأرداف', 'https://www.youtube.com/watch?v=JCXUYuzwNrM', NULL, 1, '2026-04-13 22:53:31', 43, '2026-04-09 21:21:00', '2026-04-13 22:53:31'),
(456, 19, '2026-04-13', 'Leg Press - ليغ برس', 3, 12, 'ضغط على الكعب', 'https://www.youtube.com/watch?v=IZxyjW7MPJQ', NULL, 1, '2026-04-13 23:04:04', 44, '2026-04-09 21:21:00', '2026-04-13 23:04:04'),
(457, 19, '2026-04-13', 'Leg Curl - كيرل أرجل خلفي', 3, 12, 'حركة بطيئة ومتحكم', 'https://www.youtube.com/watch?v=1Tq3QdYUuHs', NULL, 1, '2026-04-13 23:22:19', 45, '2026-04-09 21:21:00', '2026-04-13 23:22:19'),
(458, 19, '2026-04-13', 'Walking Lunges - لانجز متحرك', 3, 12, 'خطوات واسعة', 'https://www.youtube.com/watch?v=L8fvypPrzzs', NULL, 1, '2026-04-13 23:22:23', 46, '2026-04-09 21:21:00', '2026-04-13 23:22:23'),
(459, 19, '2026-04-13', 'Calf Raise - رفع أصابع القدم', 4, 15, 'راحة 60-90 ث بين السيتات', 'https://youtube.com/shorts/ADITZCcUyVo?si=ND-CleeowSnlGt5m', NULL, 1, '2026-04-13 23:25:16', 47, '2026-04-09 21:21:00', '2026-04-13 23:25:16'),
(460, 19, '2026-04-14', 'يوم راحة - Rest Day', 3, 12, 'تعافي نشط - إطالة خفيفة أو مشي 20 دقيقة', '', NULL, 1, '2026-04-13 23:26:36', 48, '2026-04-09 21:21:00', '2026-04-13 23:26:36'),
(461, 19, '2026-04-15', 'HIIT Treadmill - هيت تريدميل (30ث سريع/90ث هادئ)', 8, 20, 'مثالي لمقاومة الأنسولين', 'https://www.youtube.com/watch?v=oNkDA2F7CjM', NULL, 1, '2026-04-28 05:02:07', 49, '2026-04-09 21:21:00', '2026-04-28 05:02:07'),
(462, 19, '2026-04-15', 'Plank - بلانك', 4, 45, 'جسم مستقيم كالخشبة', 'https://www.youtube.com/watch?v=ASdvN_XEl_c', NULL, 1, '2026-04-28 05:02:09', 50, '2026-04-09 21:21:00', '2026-04-28 05:02:09'),
(463, 19, '2026-04-15', 'Cable Crunch - كرانش بكابل للبطن', 3, 15, 'انثنِ من الخصر فقط', 'https://www.youtube.com/watch?v=2fbujeH3F0E', NULL, 1, '2026-04-28 05:02:11', 51, '2026-04-09 21:21:00', '2026-04-28 05:02:11'),
(464, 19, '2026-04-15', 'Hanging Leg Raises - رفع أرجل معلق', 3, 12, 'تحكم بالحركة', 'https://www.youtube.com/watch?v=JB2oyawG9KI', NULL, 1, '2026-04-28 05:02:13', 52, '2026-04-09 21:21:00', '2026-04-28 05:02:13'),
(465, 19, '2026-04-15', 'Russian Twist - تويست روسي', 3, 20, 'راحة 45-60 ث بين السيتات', 'https://www.youtube.com/watch?v=wkD8rjkodUI', NULL, 1, '2026-04-28 05:02:15', 53, '2026-04-09 21:21:00', '2026-04-28 05:02:15'),
(466, 19, '2026-04-16', 'يوم راحة - Rest Day', 3, 12, 'تعافي نشط - إطالة خفيفة أو مشي 20 دقيقة', '', NULL, 1, '2026-04-28 05:02:18', 54, '2026-04-09 21:21:00', '2026-04-28 05:02:18'),
(467, 19, '2026-04-17', 'Power Clean - باور كلين', 4, 6, 'تمرين متفجر - احترس من الشكل', 'https://youtube.com/shorts/HFKsnymM_R4?si=iRCjfm3sd9Lkdj_6', NULL, 1, '2026-04-28 05:02:22', 55, '2026-04-09 21:21:00', '2026-04-28 05:02:22'),
(468, 19, '2026-04-17', 'Dumbbell Row - سحب بدمبل أحادي', 4, 10, 'ظهر موازي للأرض', 'https://www.youtube.com/watch?v=pYcpY20QaE8', NULL, 1, '2026-04-28 05:02:24', 56, '2026-04-09 21:21:00', '2026-04-28 05:02:24'),
(469, 19, '2026-04-17', 'Goblet Squat - سكوات بكيتلبل', 4, 12, 'عمق كامل', 'https://www.youtube.com/watch?v=MeIiIdhvXT4', NULL, 1, '2026-04-28 05:02:26', 57, '2026-04-09 21:21:00', '2026-04-28 05:02:26'),
(470, 19, '2026-04-17', 'Arnold Press - أرنولد برس', 3, 10, 'دوران الأكتاف الكامل', 'https://www.youtube.com/watch?v=6Z15_WdXmVw', NULL, 1, '2026-04-28 05:02:29', 58, '2026-04-09 21:21:00', '2026-04-28 05:02:29'),
(471, 19, '2026-04-17', 'Bulgarian Split Squat - بلغاري سكوات', 3, 10, 'تحدي التوازن والقوة', 'https://www.youtube.com/watch?v=2C-uNgKwPLE', NULL, 1, '2026-04-28 05:02:31', 59, '2026-04-09 21:21:00', '2026-04-28 05:02:31'),
(472, 19, '2026-04-17', 'Battle Ropes - باتل روبس', 5, 30, 'راحة 60 ث - كارديو نهاية التمرين', 'https://youtube.com/shorts/JwepS5QiAzs?si=9LDyfc4LMpnZnyku', NULL, 1, '2026-04-28 05:02:33', 60, '2026-04-09 21:21:00', '2026-04-28 05:02:33'),
(473, 19, '2026-04-18', 'Bench Press - بنش برس باربل', 4, 8, 'ركز على الشكل الصحيح - صدر كامل', 'https://youtube.com/shorts/XjrsqShr-Ic?si=Clr34ZYQEBrA5bYt', NULL, 1, '2026-04-28 05:02:38', 61, '2026-04-09 21:21:00', '2026-04-28 05:02:38'),
(474, 19, '2026-04-18', 'Incline Dumbbell Press - بنش مائل بدمبل', 3, 10, 'زاوية 45 درجة', 'https://www.youtube.com/watch?v=DbFgADa2PL8', NULL, 1, '2026-04-28 05:02:41', 62, '2026-04-09 21:21:00', '2026-04-28 05:02:41'),
(475, 19, '2026-04-18', 'Overhead Press - ضغط أكتاف باربل', 4, 8, 'أكتاف وقفة مستقيمة', 'https://www.youtube.com/watch?v=2yjwXTZQDDI', NULL, 1, '2026-04-28 05:02:43', 63, '2026-04-09 21:21:00', '2026-04-28 05:02:43'),
(476, 19, '2026-04-18', 'Lateral Raise - رفع جانبي بدمبل', 3, 12, 'حركة بطيئة ومتحكم', 'https://www.youtube.com/watch?v=3VcKaXpzqRo', NULL, 1, '2026-04-28 05:02:45', 64, '2026-04-09 21:21:00', '2026-04-28 05:02:45'),
(477, 19, '2026-04-18', 'Tricep Pushdown - ضغط ترايسبس بكابل', 3, 12, 'اضغط حتى النهاية', 'https://www.youtube.com/watch?v=2-LAMcpzODU', NULL, 1, '2026-04-28 05:02:47', 65, '2026-04-09 21:21:00', '2026-04-28 05:02:47'),
(478, 19, '2026-04-18', 'Skull Crusher - سكال كراشر', 3, 10, 'راحة 60-90 ث بين السيتات', 'https://youtube.com/shorts/K3mFeNz4e3w?si=DZ15UMRjSv2eKKTL', NULL, 1, '2026-04-28 05:02:49', 66, '2026-04-09 21:21:00', '2026-04-28 05:02:49'),
(479, 19, '2026-04-19', 'Deadlift - ديدليفت', 4, 6, 'أهم تمرين مركب - ظهر مستقيم', 'https://www.youtube.com/watch?v=op9kVnSso6Q', NULL, 1, '2026-04-28 05:02:53', 67, '2026-04-09 21:21:00', '2026-04-28 05:02:53'),
(480, 19, '2026-04-19', 'Lat Pulldown - سحب علوي للظهر', 4, 10, 'اسحب للصدر وليس للرقبة', 'https://www.youtube.com/watch?v=CAwf7n6Luuc', NULL, 1, '2026-04-28 05:02:57', 68, '2026-04-09 21:21:00', '2026-04-28 05:02:57'),
(481, 19, '2026-04-19', 'Seated Cable Row - سحب أفقي بكابل', 3, 10, 'اشحن الكتف للخلف', 'https://www.youtube.com/watch?v=GZbfZ033f74', NULL, 1, '2026-04-28 05:03:00', 69, '2026-04-09 21:21:00', '2026-04-28 05:03:00'),
(482, 19, '2026-04-19', 'Face Pull - فيس بول', 3, 15, 'مهم لصحة الكتف', 'https://www.youtube.com/watch?v=eIq5CB9JfKE', NULL, 1, '2026-04-28 05:03:03', 70, '2026-04-09 21:21:00', '2026-04-28 05:03:03'),
(483, 19, '2026-04-19', 'Barbell Curl - كيرل باربل للبايسبس', 3, 10, 'لا تتأرجح بالجسم', 'https://www.youtube.com/watch?v=kwG2ipFRgfo', NULL, 1, '2026-04-28 05:03:05', 71, '2026-04-09 21:21:00', '2026-04-28 05:03:05'),
(484, 19, '2026-04-19', 'Hammer Curl - هامر كيرل', 3, 12, 'راحة 60-90 ث بين السيتات', 'https://www.youtube.com/watch?v=zC3nLlEvin4', NULL, 1, '2026-04-28 05:03:07', 72, '2026-04-09 21:21:00', '2026-04-28 05:03:07'),
(485, 19, '2026-04-20', 'Squat - سكوات باربل', 4, 8, 'الملك! - ركبتين على الأصابع', 'https://www.youtube.com/watch?v=ultWZbUMPL8', NULL, 1, '2026-04-28 05:03:12', 73, '2026-04-09 21:21:00', '2026-04-28 05:03:12'),
(486, 19, '2026-04-20', 'Romanian Deadlift - ديدليفت روماني', 4, 10, 'يستهدف الهامستر والأرداف', 'https://www.youtube.com/watch?v=JCXUYuzwNrM', NULL, 1, '2026-04-28 05:03:15', 74, '2026-04-09 21:21:00', '2026-04-28 05:03:15'),
(487, 19, '2026-04-20', 'Leg Press - ليغ برس', 3, 12, 'ضغط على الكعب', 'https://www.youtube.com/watch?v=IZxyjW7MPJQ', NULL, 1, '2026-04-28 05:03:17', 75, '2026-04-09 21:21:00', '2026-04-28 05:03:17'),
(488, 19, '2026-04-20', 'Leg Curl - كيرل أرجل خلفي', 3, 12, 'حركة بطيئة ومتحكم', 'https://www.youtube.com/watch?v=1Tq3QdYUuHs', NULL, 1, '2026-04-28 05:03:20', 76, '2026-04-09 21:21:00', '2026-04-28 05:03:20'),
(489, 19, '2026-04-20', 'Walking Lunges - لانجز متحرك', 3, 12, 'خطوات واسعة', 'https://www.youtube.com/watch?v=L8fvypPrzzs', NULL, 1, '2026-04-28 05:03:23', 77, '2026-04-09 21:21:00', '2026-04-28 05:03:23'),
(490, 19, '2026-04-20', 'Calf Raise - رفع أصابع القدم', 4, 15, 'راحة 60-90 ث بين السيتات', 'https://youtube.com/shorts/ADITZCcUyVo?si=osjgcDymeixb3FB5', NULL, 1, '2026-04-28 05:03:25', 78, '2026-04-09 21:21:00', '2026-04-28 05:03:25'),
(491, 19, '2026-04-21', 'يوم راحة - Rest Day', 3, 12, 'تعافي نشط - إطالة خفيفة أو مشي 20 دقيقة', '', NULL, 1, '2026-04-28 05:03:29', 79, '2026-04-09 21:21:00', '2026-04-28 05:03:29'),
(492, 19, '2026-04-22', 'HIIT Treadmill - هيت تريدميل (30ث سريع/90ث هادئ)', 8, 20, 'مثالي لمقاومة الأنسولين', 'https://www.youtube.com/watch?v=oNkDA2F7CjM', NULL, 1, '2026-04-28 05:03:32', 80, '2026-04-09 21:21:00', '2026-04-28 05:03:32'),
(493, 19, '2026-04-22', 'Plank - بلانك', 4, 45, 'جسم مستقيم كالخشبة', 'https://www.youtube.com/watch?v=ASdvN_XEl_c', NULL, 1, '2026-04-28 05:03:34', 81, '2026-04-09 21:21:00', '2026-04-28 05:03:34'),
(494, 19, '2026-04-22', 'Cable Crunch - كرانش بكابل للبطن', 3, 15, 'انثنِ من الخصر فقط', 'https://www.youtube.com/watch?v=2fbujeH3F0E', NULL, 1, '2026-04-28 05:03:39', 82, '2026-04-09 21:21:00', '2026-04-28 05:03:39'),
(495, 19, '2026-04-22', 'Hanging Leg Raises - رفع أرجل معلق', 3, 12, 'تحكم بالحركة', 'https://www.youtube.com/watch?v=JB2oyawG9KI', NULL, 1, '2026-04-28 05:03:37', 83, '2026-04-09 21:21:00', '2026-04-28 05:03:37'),
(496, 19, '2026-04-22', 'Russian Twist - تويست روسي', 3, 20, 'راحة 45-60 ث بين السيتات', 'https://www.youtube.com/watch?v=wkD8rjkodUI', NULL, 1, '2026-04-28 05:03:41', 84, '2026-04-09 21:21:00', '2026-04-28 05:03:41'),
(497, 19, '2026-04-23', 'يوم راحة - Rest Day', 3, 12, 'تعافي نشط - إطالة خفيفة أو مشي 20 دقيقة', '', NULL, 1, '2026-04-28 05:03:45', 85, '2026-04-09 21:21:00', '2026-04-28 05:03:45'),
(498, 19, '2026-04-24', 'Power Clean - باور كلين', 4, 6, 'تمرين متفجر - احترس من الشكل', 'https://youtube.com/shorts/kGUx6-pXU-k?si=NocJiYl7bOj1PQtB', NULL, 1, '2026-04-28 05:03:48', 86, '2026-04-09 21:21:00', '2026-04-28 05:03:48'),
(499, 19, '2026-04-24', 'Dumbbell Row - سحب بدمبل أحادي', 4, 10, 'ظهر موازي للأرض', 'https://www.youtube.com/watch?v=pYcpY20QaE8', NULL, 1, '2026-04-28 05:03:50', 87, '2026-04-09 21:21:00', '2026-04-28 05:03:50'),
(500, 19, '2026-04-24', 'Goblet Squat - سكوات بكيتلبل', 4, 12, 'عمق كامل', 'https://www.youtube.com/watch?v=MeIiIdhvXT4', NULL, 1, '2026-04-28 05:03:53', 88, '2026-04-09 21:21:00', '2026-04-28 05:03:53'),
(501, 19, '2026-04-24', 'Arnold Press - أرنولد برس', 3, 10, 'دوران الأكتاف الكامل', 'https://www.youtube.com/watch?v=6Z15_WdXmVw', NULL, 1, '2026-04-28 05:03:57', 89, '2026-04-09 21:21:00', '2026-04-28 05:03:57'),
(502, 19, '2026-04-24', 'Bulgarian Split Squat - بلغاري سكوات', 3, 10, 'تحدي التوازن والقوة', 'https://www.youtube.com/watch?v=2C-uNgKwPLE', NULL, 1, '2026-04-28 05:03:59', 90, '2026-04-09 21:21:00', '2026-04-28 05:03:59'),
(503, 19, '2026-04-24', 'Battle Ropes - باتل روبس', 5, 30, 'راحة 60 ث - كارديو نهاية التمرين', 'https://youtube.com/shorts/JwepS5QiAzs?si=2pbyj2F4eMlSinqj', NULL, 1, '2026-04-28 05:04:01', 91, '2026-04-09 21:21:00', '2026-04-28 05:04:01'),
(504, 19, '2026-04-25', 'Bench Press - بنش برس باربل', 4, 8, 'ركز على الشكل الصحيح - صدر كامل', 'https://youtube.com/shorts/XjrsqShr-Ic?si=Clr34ZYQEBrA5bYt', NULL, 1, '2026-04-28 05:04:05', 92, '2026-04-09 21:21:00', '2026-04-28 05:04:05'),
(505, 19, '2026-04-25', 'Incline Dumbbell Press - بنش مائل بدمبل', 3, 10, 'زاوية 45 درجة', 'https://www.youtube.com/watch?v=DbFgADa2PL8', NULL, 1, '2026-04-28 05:04:07', 93, '2026-04-09 21:21:00', '2026-04-28 05:04:07'),
(506, 19, '2026-04-25', 'Overhead Press - ضغط أكتاف باربل', 4, 8, 'أكتاف وقفة مستقيمة', 'https://www.youtube.com/watch?v=2yjwXTZQDDI', NULL, 1, '2026-04-28 05:04:09', 94, '2026-04-09 21:21:00', '2026-04-28 05:04:09'),
(507, 19, '2026-04-25', 'Lateral Raise - رفع جانبي بدمبل', 3, 12, 'حركة بطيئة ومتحكم', 'https://www.youtube.com/watch?v=3VcKaXpzqRo', NULL, 1, '2026-04-28 05:04:11', 95, '2026-04-09 21:21:00', '2026-04-28 05:04:11'),
(508, 19, '2026-04-25', 'Tricep Pushdown - ضغط ترايسبس بكابل', 3, 12, 'اضغط حتى النهاية', 'https://www.youtube.com/watch?v=2-LAMcpzODU', NULL, 1, '2026-04-28 05:04:13', 96, '2026-04-09 21:21:00', '2026-04-28 05:04:13'),
(509, 19, '2026-04-25', 'Skull Crusher - سكال كراشر', 3, 10, 'راحة 60-90 ث بين السيتات', 'https://youtube.com/shorts/K3mFeNz4e3w?si=DZ15UMRjSv2eKKTL', NULL, 1, '2026-04-28 05:04:15', 97, '2026-04-09 21:21:00', '2026-04-28 05:04:15'),
(510, 19, '2026-04-26', 'Deadlift - ديدليفت', 4, 6, 'أهم تمرين مركب - ظهر مستقيم', 'https://www.youtube.com/watch?v=op9kVnSso6Q', NULL, 1, '2026-04-28 05:04:20', 98, '2026-04-09 21:21:00', '2026-04-28 05:04:20'),
(511, 19, '2026-04-26', 'Lat Pulldown - سحب علوي للظهر', 4, 10, 'اسحب للصدر وليس للرقبة', 'https://www.youtube.com/watch?v=CAwf7n6Luuc', NULL, 1, '2026-04-28 05:04:22', 99, '2026-04-09 21:21:00', '2026-04-28 05:04:22'),
(512, 19, '2026-04-26', 'Seated Cable Row - سحب أفقي بكابل', 3, 10, 'اشحن الكتف للخلف', 'https://www.youtube.com/watch?v=GZbfZ033f74', NULL, 1, '2026-04-28 05:04:25', 100, '2026-04-09 21:21:00', '2026-04-28 05:04:25'),
(513, 19, '2026-04-26', 'Face Pull - فيس بول', 3, 15, 'مهم لصحة الكتف', 'https://www.youtube.com/watch?v=eIq5CB9JfKE', NULL, 1, '2026-04-28 05:04:27', 101, '2026-04-09 21:21:00', '2026-04-28 05:04:27'),
(514, 19, '2026-04-26', 'Barbell Curl - كيرل باربل للبايسبس', 3, 10, 'لا تتأرجح بالجسم', 'https://www.youtube.com/watch?v=kwG2ipFRgfo', NULL, 1, '2026-04-28 05:04:29', 102, '2026-04-09 21:21:00', '2026-04-28 05:04:29'),
(515, 19, '2026-04-26', 'Hammer Curl - هامر كيرل', 3, 12, 'راحة 60-90 ث بين السيتات', 'https://www.youtube.com/watch?v=zC3nLlEvin4', NULL, 1, '2026-04-28 05:04:18', 103, '2026-04-09 21:21:00', '2026-04-28 05:04:18'),
(516, 19, '2026-04-27', 'Squat - سكوات باربل', 4, 8, 'الملك! - ركبتين على الأصابع', 'https://www.youtube.com/watch?v=ultWZbUMPL8', NULL, 1, '2026-04-28 05:04:34', 104, '2026-04-09 21:21:00', '2026-04-28 05:04:34'),
(517, 19, '2026-04-27', 'Romanian Deadlift - ديدليفت روماني', 4, 10, 'يستهدف الهامستر والأرداف', 'https://www.youtube.com/watch?v=JCXUYuzwNrM', NULL, 1, '2026-04-28 05:04:37', 105, '2026-04-09 21:21:00', '2026-04-28 05:04:37'),
(518, 19, '2026-04-27', 'Leg Press - ليغ برس', 3, 12, 'ضغط على الكعب', 'https://www.youtube.com/watch?v=IZxyjW7MPJQ', NULL, 1, '2026-04-28 05:04:41', 106, '2026-04-09 21:21:00', '2026-04-28 05:04:41'),
(519, 19, '2026-04-27', 'Leg Curl - كيرل أرجل خلفي', 3, 12, 'حركة بطيئة ومتحكم', 'https://www.youtube.com/watch?v=1Tq3QdYUuHs', NULL, 1, '2026-04-28 05:04:43', 107, '2026-04-09 21:21:00', '2026-04-28 05:04:43'),
(520, 19, '2026-04-27', 'Walking Lunges - لانجز متحرك', 3, 12, 'خطوات واسعة', 'https://www.youtube.com/watch?v=L8fvypPrzzs', NULL, 1, '2026-04-28 05:04:44', 108, '2026-04-09 21:21:00', '2026-04-28 05:04:44'),
(521, 19, '2026-04-27', 'Calf Raise - رفع أصابع القدم', 4, 15, 'راحة 60-90 ث بين السيتات', 'https://youtube.com/shorts/ADITZCcUyVo?si=osjgcDymeixb3FB5', NULL, 1, '2026-04-28 05:04:46', 109, '2026-04-09 21:21:00', '2026-04-28 05:04:46'),
(522, 19, '2026-04-28', 'يوم راحة - Rest Day', 3, 12, 'تعافي نشط - إطالة خفيفة أو مشي 20 دقيقة', '', NULL, 1, '2026-04-28 05:04:50', 110, '2026-04-09 21:21:00', '2026-04-28 05:04:50'),
(523, 19, '2026-04-29', 'HIIT Treadmill - هيت تريدميل (30ث سريع/90ث هادئ)', 8, 20, 'مثالي لمقاومة الأنسولين', 'https://www.youtube.com/watch?v=oNkDA2F7CjM', NULL, 1, '2026-04-28 05:04:53', 111, '2026-04-09 21:21:00', '2026-04-28 05:04:53'),
(524, 19, '2026-04-29', 'Plank - بلانك', 4, 45, 'جسم مستقيم كالخشبة', 'https://www.youtube.com/watch?v=ASdvN_XEl_c', NULL, 1, '2026-04-28 05:04:56', 112, '2026-04-09 21:21:00', '2026-04-28 05:04:56'),
(525, 19, '2026-04-29', 'Cable Crunch - كرانش بكابل للبطن', 3, 15, 'انثنِ من الخصر فقط', 'https://www.youtube.com/watch?v=2fbujeH3F0E', NULL, 1, '2026-04-28 05:04:58', 113, '2026-04-09 21:21:00', '2026-04-28 05:04:58'),
(526, 19, '2026-04-29', 'Hanging Leg Raises - رفع أرجل معلق', 3, 12, 'تحكم بالحركة', 'https://www.youtube.com/watch?v=JB2oyawG9KI', NULL, 1, '2026-04-28 05:05:00', 114, '2026-04-09 21:21:00', '2026-04-28 05:05:00'),
(527, 19, '2026-04-29', 'Russian Twist - تويست روسي', 3, 20, 'راحة 45-60 ث بين السيتات', 'https://www.youtube.com/watch?v=wkD8rjkodUI', NULL, 1, '2026-04-28 05:05:04', 115, '2026-04-09 21:21:00', '2026-04-28 05:05:04'),
(528, 19, '2026-04-30', 'يوم راحة - Rest Day', 3, 12, 'تعافي نشط - إطالة خفيفة أو مشي 20 دقيقة', '', NULL, 1, '2026-04-28 05:05:08', 116, '2026-04-09 21:21:00', '2026-04-28 05:05:08'),
(529, 23, '2026-05-10', 'Wall Sit', 3, 45, 'الثبات على الحائط', 'https://www.youtube.com/watch?v=05M4N--J3Zg', NULL, 1, '2026-05-12 08:49:20', 0, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(530, 23, '2026-05-10', 'Bird Dog', 3, 12, 'توازن الظهر والبطن', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 1, '2026-05-12 08:49:22', 1, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(531, 23, '2026-05-10', 'Mountain Climbers', 3, 30, 'سرعة متوسطة للمبتدئين', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 1, '2026-05-12 08:49:25', 2, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(532, 23, '2026-05-10', 'High Knees', 3, 45, 'رفع الركبتين للصدر', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 1, '2026-05-12 08:49:27', 3, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(533, 23, '2026-05-10', 'Shadow Boxing', 3, 1, 'حركة مستمرة لليدين', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 1, '2026-05-12 08:49:30', 4, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(534, 23, '2026-05-11', 'Jumping Jacks', 4, 1, 'قفز بانتظام', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 1, '2026-05-12 08:52:45', 5, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(535, 23, '2026-05-11', 'Burpees', 3, 8, 'بربيز بدون قفز للمبتدئين', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 1, '2026-05-12 08:52:47', 6, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(536, 23, '2026-05-11', 'Mountain Climbers', 3, 45, 'تحدي السرعة', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 1, '2026-05-12 08:52:51', 7, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(537, 23, '2026-05-11', 'Plank', 3, 45, 'ثبات تام للجسم', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 1, '2026-05-12 08:52:53', 8, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(538, 23, '2026-05-11', 'High Knees', 3, 1, 'كارديو مكثف', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 1, '2026-05-12 08:52:55', 9, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(539, 23, '2026-05-12', 'تعافي نشط', 1, 1, 'إطالة خفيفة أو مشي 20 دقيقة يوم راحة', '', NULL, 1, '2026-05-12 08:53:17', 10, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(540, 23, '2026-05-13', 'Squats', 3, 12, 'تركيز على النزول ببطء', 'https://www.youtube.com/watch?v=RocudKlpQeI', NULL, 0, NULL, 11, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(541, 23, '2026-05-13', 'Push-ups', 3, 8, 'مبتدئين على الركبة', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 12, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(542, 23, '2026-05-13', 'Lunges', 3, 10, 'توازن جيد للجسم', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 13, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(543, 23, '2026-05-13', 'Plank', 3, 30, 'شد عضلات البطن', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 14, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(544, 23, '2026-05-13', 'Glute Bridges', 3, 15, 'رفع الحوض لأعلى', 'https://www.youtube.com/watch?v=RocudKlpQeI', NULL, 0, NULL, 15, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(545, 23, '2026-05-14', 'Wall Sit', 3, 45, 'الثبات على الحائط', 'https://www.youtube.com/watch?v=05M4N--J3Zg', NULL, 0, NULL, 16, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(546, 23, '2026-05-14', 'Bird Dog', 3, 12, 'توازن الظهر والبطن', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 17, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(547, 23, '2026-05-14', 'Mountain Climbers', 3, 30, 'سرعة متوسطة للمبتدئين', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 18, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(548, 23, '2026-05-14', 'High Knees', 3, 45, 'رفع الركبتين للصدر', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 19, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(549, 23, '2026-05-14', 'Shadow Boxing', 3, 1, 'حركة مستمرة لليدين', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 20, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(550, 23, '2026-05-15', 'تعافي نشط', 1, 1, 'إطالة خفيفة أو مشي 20 دقيقة يوم راحة', '', NULL, 0, NULL, 21, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(551, 23, '2026-05-16', 'Squats', 3, 12, 'تركيز على النزول ببطء', 'https://www.youtube.com/watch?v=RocudKlpQeI', NULL, 0, NULL, 22, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(552, 23, '2026-05-16', 'Push-ups', 3, 8, 'مبتدئين على الركبة', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 23, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(553, 23, '2026-05-16', 'Lunges', 3, 10, 'توازن جيد للجسم', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 24, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(554, 23, '2026-05-16', 'Plank', 3, 30, 'شد عضلات البطن', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 25, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(555, 23, '2026-05-16', 'Glute Bridges', 3, 15, 'رفع الحوض لأعلى', 'https://www.youtube.com/watch?v=RocudKlpQeI', NULL, 0, NULL, 26, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(556, 23, '2026-05-17', 'Wall Sit', 3, 45, 'الثبات على الحائط', 'https://www.youtube.com/watch?v=05M4N--J3Zg', NULL, 0, NULL, 27, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(557, 23, '2026-05-17', 'Bird Dog', 3, 12, 'توازن الظهر والبطن', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 28, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(558, 23, '2026-05-17', 'Mountain Climbers', 3, 30, 'سرعة متوسطة للمبتدئين', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 29, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(559, 23, '2026-05-17', 'High Knees', 3, 45, 'رفع الركبتين للصدر', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 30, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(560, 23, '2026-05-17', 'Shadow Boxing', 3, 1, 'حركة مستمرة لليدين', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 31, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(561, 23, '2026-05-18', 'Jumping Jacks', 4, 1, 'قفز بانتظام', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 32, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(562, 23, '2026-05-18', 'Burpees', 3, 8, 'بربيز بدون قفز للمبتدئين', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 33, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(563, 23, '2026-05-18', 'Mountain Climbers', 3, 45, 'تحدي السرعة', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 34, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(564, 23, '2026-05-18', 'Plank', 3, 45, 'ثبات تام للجسم', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 35, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(565, 23, '2026-05-18', 'High Knees', 3, 1, 'كارديو مكثف', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 36, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(566, 23, '2026-05-19', 'تعافي نشط', 1, 1, 'إطالة خفيفة أو مشي 20 دقيقة يوم راحة', '', NULL, 0, NULL, 37, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(567, 23, '2026-05-20', 'Squats', 3, 12, 'تركيز على النزول ببطء', 'https://www.youtube.com/watch?v=RocudKlpQeI', NULL, 0, NULL, 38, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(568, 23, '2026-05-20', 'Push-ups', 3, 8, 'مبتدئين على الركبة', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 39, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(569, 23, '2026-05-20', 'Lunges', 3, 10, 'توازن جيد للجسم', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 40, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(570, 23, '2026-05-20', 'Plank', 3, 30, 'شد عضلات البطن', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 41, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(571, 23, '2026-05-20', 'Glute Bridges', 3, 15, 'رفع الحوض لأعلى', 'https://www.youtube.com/watch?v=RocudKlpQeI', NULL, 0, NULL, 42, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(572, 23, '2026-05-21', 'Wall Sit', 3, 45, 'الثبات على الحائط', 'https://www.youtube.com/watch?v=05M4N--J3Zg', NULL, 0, NULL, 43, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(573, 23, '2026-05-21', 'Bird Dog', 3, 12, 'توازن الظهر والبطن', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 44, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(574, 23, '2026-05-21', 'Mountain Climbers', 3, 30, 'سرعة متوسطة للمبتدئين', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 45, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(575, 23, '2026-05-21', 'High Knees', 3, 45, 'رفع الركبتين للصدر', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 46, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(576, 23, '2026-05-21', 'Shadow Boxing', 3, 1, 'حركة مستمرة لليدين', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 47, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(577, 23, '2026-05-22', 'تعافي نشط', 1, 1, 'إطالة خفيفة أو مشي 20 دقيقة يوم راحة', '', NULL, 0, NULL, 48, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(578, 23, '2026-05-23', 'Squats', 3, 12, 'تركيز على النزول ببطء', 'https://www.youtube.com/watch?v=RocudKlpQeI', NULL, 0, NULL, 49, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(579, 23, '2026-05-23', 'Push-ups', 3, 8, 'مبتدئين على الركبة', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 50, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(580, 23, '2026-05-23', 'Lunges', 3, 10, 'توازن جيد للجسم', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 51, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(581, 23, '2026-05-23', 'Plank', 3, 30, 'شد عضلات البطن', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 52, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(582, 23, '2026-05-23', 'Glute Bridges', 3, 15, 'رفع الحوض لأعلى', 'https://www.youtube.com/watch?v=RocudKlpQeI', NULL, 0, NULL, 53, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(583, 23, '2026-05-24', 'Wall Sit', 3, 45, 'الثبات على الحائط', 'https://www.youtube.com/watch?v=05M4N--J3Zg', NULL, 0, NULL, 54, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(584, 23, '2026-05-24', 'Bird Dog', 3, 12, 'توازن الظهر والبطن', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 55, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(585, 23, '2026-05-24', 'Mountain Climbers', 3, 30, 'سرعة متوسطة للمبتدئين', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 56, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(586, 23, '2026-05-24', 'High Knees', 3, 45, 'رفع الركبتين للصدر', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 57, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(587, 23, '2026-05-24', 'Shadow Boxing', 3, 1, 'حركة مستمرة لليدين', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 58, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(588, 23, '2026-05-25', 'Jumping Jacks', 4, 1, 'قفز بانتظام', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 59, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(589, 23, '2026-05-25', 'Burpees', 3, 8, 'بربيز بدون قفز للمبتدئين', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 60, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(590, 23, '2026-05-25', 'Mountain Climbers', 3, 45, 'تحدي السرعة', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 61, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(591, 23, '2026-05-25', 'Plank', 3, 45, 'ثبات تام للجسم', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 62, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(592, 23, '2026-05-25', 'High Knees', 3, 1, 'كارديو مكثف', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 63, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(593, 23, '2026-05-26', 'تعافي نشط', 1, 1, 'إطالة خفيفة أو مشي 20 دقيقة يوم راحة', '', NULL, 0, NULL, 64, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(594, 23, '2026-05-27', 'Squats', 3, 12, 'تركيز على النزول ببطء', 'https://www.youtube.com/watch?v=RocudKlpQeI', NULL, 0, NULL, 65, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(595, 23, '2026-05-27', 'Push-ups', 3, 8, 'مبتدئين على الركبة', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 66, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(596, 23, '2026-05-27', 'Lunges', 3, 10, 'توازن جيد للجسم', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 67, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(597, 23, '2026-05-27', 'Plank', 3, 30, 'شد عضلات البطن', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 68, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(598, 23, '2026-05-27', 'Glute Bridges', 3, 15, 'رفع الحوض لأعلى', 'https://www.youtube.com/watch?v=RocudKlpQeI', NULL, 0, NULL, 69, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(599, 23, '2026-05-28', 'Wall Sit', 3, 45, 'الثبات على الحائط', 'https://www.youtube.com/watch?v=05M4N--J3Zg', NULL, 0, NULL, 70, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(600, 23, '2026-05-28', 'Bird Dog', 3, 12, 'توازن الظهر والبطن', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 71, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(601, 23, '2026-05-28', 'Mountain Climbers', 3, 30, 'سرعة متوسطة للمبتدئين', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 72, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(602, 23, '2026-05-28', 'High Knees', 3, 45, 'رفع الركبتين للصدر', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 73, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(603, 23, '2026-05-28', 'Shadow Boxing', 3, 1, 'حركة مستمرة لليدين', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 74, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(604, 23, '2026-05-29', 'تعافي نشط', 1, 1, 'إطالة خفيفة أو مشي 20 دقيقة يوم راحة', '', NULL, 0, NULL, 75, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(605, 23, '2026-05-30', 'Squats', 3, 12, 'تركيز على النزول ببطء', 'https://www.youtube.com/watch?v=RocudKlpQeI', NULL, 0, NULL, 76, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(606, 23, '2026-05-30', 'Push-ups', 3, 8, 'مبتدئين على الركبة', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 77, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(607, 23, '2026-05-30', 'Lunges', 3, 10, 'توازن جيد للجسم', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 78, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(608, 23, '2026-05-30', 'Plank', 3, 30, 'شد عضلات البطن', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 79, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(609, 23, '2026-05-30', 'Glute Bridges', 3, 15, 'رفع الحوض لأعلى', 'https://www.youtube.com/watch?v=RocudKlpQeI', NULL, 0, NULL, 80, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(610, 23, '2026-05-31', 'Wall Sit', 3, 45, 'الثبات على الحائط', 'https://www.youtube.com/watch?v=05M4N--J3Zg', NULL, 0, NULL, 81, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(611, 23, '2026-05-31', 'Bird Dog', 3, 12, 'توازن الظهر والبطن', 'https://www.youtube.com/watch?v=blU-wygtcTc', NULL, 0, NULL, 82, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(612, 23, '2026-05-31', 'Mountain Climbers', 3, 30, 'سرعة متوسطة للمبتدئين', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 83, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(613, 23, '2026-05-31', 'High Knees', 3, 45, 'رفع الركبتين للصدر', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 84, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(614, 23, '2026-05-31', 'Shadow Boxing', 3, 1, 'حركة مستمرة لليدين', 'https://www.youtube.com/watch?v=IT94xC35u6k', NULL, 0, NULL, 85, '2026-05-10 17:41:05', '2026-05-19 11:03:10'),
(615, 25, '2026-05-25', 'Goblet Squat (سكوات)', 3, 12, 'التركيز على استقامة الظهر', 'https://youtube.com/shorts/lRYBbchqxtI?si=Zdbx4lmb9jk94VzR', NULL, 0, NULL, 0, '2026-05-24 22:21:17', '2026-05-24 22:24:23'),
(616, 25, '2026-05-25', 'Lunges (طعن)', 3, 12, 'خطوة واسعة لشد الأرداف', 'https://www.youtube.com/watch?v=D7KaRcUTQeE', NULL, 0, NULL, 1, '2026-05-24 22:21:17', '2026-05-24 22:23:50'),
(617, 25, '2026-05-25', 'Hip Thrust (جسر الحوض)', 4, 15, 'عصر العضلات في الأعلى', 'https://www.youtube.com/watch?v=SEdqd1n0cvg', NULL, 0, NULL, 2, '2026-05-24 22:21:17', '2026-05-24 22:23:50'),
(618, 25, '2026-05-25', 'Leg Press (دفع أرجل)', 3, 12, 'دفع ببطء وتحكم', 'https://www.youtube.com/watch?v=IZxyjW7MPJQ', NULL, 0, NULL, 3, '2026-05-24 22:21:17', '2026-05-24 22:23:50'),
(619, 25, '2026-05-25', 'Calf Raises (سمانة)', 3, 15, 'الوقوف على أطراف الأصابع', 'https://www.youtube.com/watch?v=-M4-G8p8fmc', NULL, 0, NULL, 4, '2026-05-24 22:21:17', '2026-05-24 22:23:50'),
(620, 25, '2026-05-25', 'Walking (مشي سريع)', 1, 20, 'الحفاظ على نبض قلب مرتفع', 'https://www.youtube.com/watch?v=Z6jUPvbOviQ', NULL, 0, NULL, 5, '2026-05-24 22:21:17', '2026-05-24 22:23:50'),
(621, 25, '2026-05-26', 'Lat Pulldown (سحب ظهر)', 3, 12, 'سحب البار للصدر وليس الرقبة', 'https://www.youtube.com/watch?v=fhy-oKeWBeU', NULL, 0, NULL, 6, '2026-05-24 22:21:17', '2026-05-24 22:23:50'),
(622, 25, '2026-05-26', 'Dumbbell Chest Press (دفع صدر)', 3, 12, 'عدم قفل الكوع في الأعلى', 'https://youtube.com/shorts/Cj96ZZlmJRU?si=C4aklvZs4wzzssy8', NULL, 0, NULL, 7, '2026-05-24 22:21:17', '2026-05-24 22:26:20'),
(623, 25, '2026-05-26', 'Shoulder Press (دفع كتف)', 3, 12, 'الجلوس باستقامة', 'https://www.youtube.com/watch?v=qEwKCR5JCog', NULL, 0, NULL, 8, '2026-05-24 22:21:17', '2026-05-24 22:23:50'),
(624, 25, '2026-05-26', 'Bicep Curls (بايسبس)', 3, 12, 'عدم أرجحة الجسم', 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo', NULL, 0, NULL, 9, '2026-05-24 22:21:17', '2026-05-24 22:23:50'),
(625, 25, '2026-05-26', 'Tricep Pushdown (ترايسبس)', 3, 12, 'تثبيت الكوع بجانب الجسم', 'https://youtube.com/shorts/1FjkhpZsaxc?si=ofDSAxKPzA7ZpQVG', NULL, 0, NULL, 10, '2026-05-24 22:21:17', '2026-05-24 22:28:12'),
(626, 25, '2026-05-26', 'Elliptical (إليبتيكال)', 1, 20, 'مستوى مقاومة متوسط', 'https://youtube.com/shorts/7ExhDKD0Hlo?si=FMByY88kpUGGg3x0', NULL, 0, NULL, 11, '2026-05-24 22:21:17', '2026-05-24 22:33:31'),
(627, 25, '2026-05-27', '- تعافي نشط -', 1, 1, 'إطالة خفيفة أو مشي هادئ 30 دقيقة', 'https://www.youtube.com/watch?v=v2r0zYnFmxo', NULL, 0, NULL, 12, '2026-05-24 22:21:17', '2026-05-24 22:23:50'),
(628, 25, '2026-05-28', 'Romanian Deadlift (رفعة رومانية)', 3, 12, 'نزول ببطء مع شد خلفيات الفخذ', 'https://youtube.com/shorts/Wou9zVQrAfs?si=zgtwZ9EagV_SLuAm', NULL, 0, NULL, 13, '2026-05-24 22:21:17', '2026-05-24 22:34:55'),
(629, 25, '2026-05-28', 'Bulgarian Split Squat (سكوات بلغاري)', 3, 10, 'توازن الجسم والتركيز', 'https://www.youtube.com/watch?v=2C-uNgKwPLE', NULL, 0, NULL, 14, '2026-05-24 22:21:17', '2026-05-24 22:23:50'),
(630, 25, '2026-05-28', 'Leg Extension (تمديد أرجل)', 3, 12, 'فرد الأرجل بالكامل', 'https://www.youtube.com/watch?v=m0FOpMEgero', NULL, 0, NULL, 15, '2026-05-24 22:21:17', '2026-05-24 22:23:50'),
(631, 25, '2026-05-28', 'Leg Curl (ثني أرجل)', 3, 12, 'ثني الأرجل لأقصى حد', 'https://youtube.com/shorts/_lgE0gPvbik?si=yZTvPSUsJ3aK1EQ2', NULL, 0, NULL, 16, '2026-05-24 22:21:17', '2026-05-24 22:36:08'),
(632, 25, '2026-05-28', 'Glute Kickbacks (ركلة خلفية)', 3, 15, 'شد الأرداف بقوة', 'https://youtube.com/shorts/1u0CGdZfjJE?si=u_ORXIer4Jtko3NM', NULL, 0, NULL, 17, '2026-05-24 22:21:17', '2026-05-24 22:37:59'),
(633, 25, '2026-05-28', 'Incline Walking (مشي منحدر)', 1, 20, 'سرعة 5-6 وميل 3-5', 'https://www.youtube.com/watch?v=v2r0zYnFmxo', NULL, 0, NULL, 18, '2026-05-24 22:21:17', '2026-05-24 22:23:50'),
(634, 25, '2026-05-29', 'Seated Row (تجديف جالس)', 3, 12, 'سحب المقبض للبطن', 'https://www.youtube.com/watch?v=GZbfZ033f74', NULL, 0, NULL, 19, '2026-05-24 22:21:17', '2026-05-24 22:23:50'),
(635, 25, '2026-05-29', 'Push-ups (ضغط - ركب)', 3, 10, 'يمكن عمله على الركب للمبتدئين', 'https://youtube.com/shorts/zxAjYtfwhGg?si=exjvtnC1NYlW8beF', NULL, 0, NULL, 20, '2026-05-24 22:21:17', '2026-05-24 22:39:23'),
(636, 25, '2026-05-29', 'Lateral Raises (رفرفة جانبية)', 3, 12, 'رفع الوزن لمستوى الكتف فقط', 'https://youtube.com/shorts/UFcaodmbXd8?si=CKbORco01cqLwS2x', NULL, 0, NULL, 21, '2026-05-24 22:21:17', '2026-05-24 22:40:45'),
(637, 25, '2026-05-29', 'Hammer Curls (هامر بايسبس)', 3, 12, 'قبضة اليد مواجهة للجسم', 'https://youtube.com/shorts/IEuVnX7nZN8?si=KfSe-i-KZqAzX6SB', NULL, 0, NULL, 22, '2026-05-24 22:21:17', '2026-05-24 22:42:43'),
(638, 25, '2026-05-29', 'Plank (بلانك)', 3, 45, 'شد البطن والجسم بالكامل', 'https://www.youtube.com/watch?v=TvxNkmjdhMM', NULL, 0, NULL, 23, '2026-05-24 22:21:17', '2026-05-24 22:23:50'),
(639, 25, '2026-05-29', 'Stair Climber (درج)', 1, 15, 'مستوى متوسط', 'https://www.youtube.com/watch?v=PMh2pyX7OJU', NULL, 0, NULL, 24, '2026-05-24 22:21:17', '2026-05-24 22:23:50'),
(640, 25, '2026-05-30', '- تعافي نشط -', 1, 1, 'إطالة خفيفة أو مشي هادئ 30 دقيقة', 'https://www.youtube.com/watch?v=v2r0zYnFmxo', NULL, 0, NULL, 25, '2026-05-24 22:21:17', '2026-05-24 22:23:50'),
(641, 25, '2026-05-31', '- تعافي نشط -', 1, 1, 'إطالة خفيفة أو مشي هادئ 30 دقيقة', 'https://www.youtube.com/watch?v=v2r0zYnFmxo', NULL, 0, NULL, 26, '2026-05-24 22:21:17', '2026-05-24 22:23:50'),
(642, 28, '2026-06-01', 'Goblet Squat (سكوات)', 3, 12, 'التركيز على استقامة الظهر', 'https://www.youtube.com/watch?v=JO7D6GJ98wY', NULL, 0, NULL, 0, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(643, 28, '2026-06-01', 'Lunges (طعن)', 3, 12, 'خطوة واسعة لشد الأرداف', 'https://www.youtube.com/watch?v=D7KaRcUTQeE', NULL, 0, NULL, 1, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(644, 28, '2026-06-01', 'Hip Thrust (جسر الحوض)', 4, 15, 'عصر العضلات في الأعلى', 'https://www.youtube.com/watch?v=SEdqd1n0cvg', NULL, 0, NULL, 2, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(645, 28, '2026-06-01', 'Leg Press (دفع أرجل)', 3, 12, 'دفع ببطء وتحكم', 'https://www.youtube.com/watch?v=IZxyjW7MPJQ', NULL, 0, NULL, 3, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(646, 28, '2026-06-01', 'Calf Raises (سمانة)', 3, 15, 'الوقوف على أطراف الأصابع', 'https://www.youtube.com/watch?v=-M4-G8p8fmc', NULL, 0, NULL, 4, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(647, 28, '2026-06-01', 'Walking (مشي سريع)', 1, 20, 'الحفاظ على نبض قلب مرتفع', 'https://www.youtube.com/watch?v=Z6jUPvbOviQ', NULL, 0, NULL, 5, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(648, 28, '2026-06-02', 'Lat Pulldown (سحب ظهر)', 3, 12, 'سحب البار للصدر وليس الرقبة', 'https://www.youtube.com/watch?v=fhy-oKeWBeU', NULL, 0, NULL, 6, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(649, 28, '2026-06-02', 'Dumbbell Chest Press (دفع صدر)', 3, 12, 'عدم قفل الكوع في الأعلى', 'https://www.youtube.com/watch?v=vj2uS8L6G3I', NULL, 0, NULL, 7, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(650, 28, '2026-06-02', 'Shoulder Press (دفع كتف)', 3, 12, 'الجلوس باستقامة', 'https://www.youtube.com/watch?v=qEwKCR5JCog', NULL, 0, NULL, 8, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(651, 28, '2026-06-02', 'Bicep Curls (بايسبس)', 3, 12, 'عدم أرجحة الجسم', 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo', NULL, 0, NULL, 9, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(652, 28, '2026-06-02', 'Tricep Pushdown (ترايسبس)', 3, 12, 'تثبيت الكوع بجانب الجسم', 'https://www.youtube.com/watch?v=2-LAMcpzHLU', NULL, 0, NULL, 10, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(653, 28, '2026-06-02', 'Elliptical (إليبتيكال)', 1, 20, 'مستوى مقاومة متوسط', 'https://www.youtube.com/watch?v=8m9_mZ7O-yY', NULL, 0, NULL, 11, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(654, 28, '2026-06-03', '- تعافي نشط -', 1, 1, 'إطالة خفيفة أو مشي هادئ 30 دقيقة', 'https://www.youtube.com/watch?v=v2r0zYnFmxo', NULL, 0, NULL, 12, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(655, 28, '2026-06-04', 'Romanian Deadlift (رفعة رومانية)', 3, 12, 'نزول ببطء مع شد خلفيات الفخذ', 'https://youtube.com/shorts/CBOhr6H7BEY?si=KKhqvGCwxUxZZxKE', NULL, 0, NULL, 13, '2026-06-04 19:38:22', '2026-06-04 20:17:08'),
(656, 28, '2026-06-04', 'Bulgarian Split Squat (سكوات بلغاري)', 3, 10, 'توازن الجسم والتركيز', 'https://www.youtube.com/watch?v=2C-uNgKwPLE', NULL, 0, NULL, 14, '2026-06-04 19:38:22', '2026-06-04 20:16:46');
INSERT INTO `workout_exercises` (`id`, `workout_plan_id`, `exercise_date`, `name`, `sets`, `reps`, `notes`, `youtube_url`, `video_file`, `completed`, `completed_at`, `order`, `created_at`, `updated_at`) VALUES
(657, 28, '2026-06-04', 'Leg Extension (تمديد أرجل)', 3, 12, 'فرد الأرجل بالكامل', 'https://www.youtube.com/watch?v=m0FOpMEgero', NULL, 0, NULL, 15, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(658, 28, '2026-06-04', 'Leg Curl (ثني أرجل)', 3, 12, 'ثني الأرجل لأقصى حد', 'https://youtube.com/shorts/_lgE0gPvbik?si=gutdMQF0iFa-JT5N', NULL, 0, NULL, 16, '2026-06-04 19:38:22', '2026-06-04 20:18:54'),
(659, 28, '2026-06-04', 'Glute Kickbacks (ركلة خلفية)', 3, 15, 'شد الأرداف بقوة', 'https://youtube.com/shorts/n-cgsNePyFo?si=b_Vuj6czU7YoQVM5', NULL, 0, NULL, 17, '2026-06-04 19:38:22', '2026-06-04 20:20:21'),
(660, 28, '2026-06-04', 'Incline Walking (مشي منحدر)', 1, 20, 'سرعة 5-6 وميل 3-5', 'https://www.youtube.com/watch?v=v2r0zYnFmxo', NULL, 0, NULL, 18, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(661, 28, '2026-06-05', 'Seated Row (تجديف جالس)', 3, 12, 'سحب المقبض للبطن', 'https://www.youtube.com/watch?v=GZbfZ033f74', NULL, 0, NULL, 19, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(662, 28, '2026-06-05', 'Push-ups (ضغط - ركب)', 3, 10, 'يمكن عمله على الركب للمبتدئين', 'https://youtube.com/shorts/zxAjYtfwhGg?si=2VEYUxbRT66PAohT', NULL, 0, NULL, 20, '2026-06-04 19:38:22', '2026-06-04 20:22:11'),
(663, 28, '2026-06-05', 'Lateral Raises (رفرفة جانبية)', 3, 12, 'رفع الوزن لمستوى الكتف فقط', 'https://youtube.com/shorts/UFcaodmbXd8?si=vP3AxTRdOmMDhwEZ', NULL, 0, NULL, 21, '2026-06-04 19:38:22', '2026-06-04 20:23:20'),
(664, 28, '2026-06-05', 'Hammer Curls (هامر بايسبس)', 3, 12, 'قبضة اليد مواجهة للجسم', 'https://youtube.com/shorts/IEuVnX7nZN8?si=Z7nTvvIgJbiKVN0A', NULL, 0, NULL, 22, '2026-06-04 19:38:22', '2026-06-04 20:24:55'),
(665, 28, '2026-06-05', 'Plank (بلانك)', 3, 45, 'شد البطن والجسم بالكامل', 'https://www.youtube.com/watch?v=TvxNkmjdhMM', NULL, 0, NULL, 23, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(666, 28, '2026-06-05', 'Stair Climber (درج)', 1, 15, 'مستوى متوسط', 'https://www.youtube.com/watch?v=PMh2pyX7OJU', NULL, 0, NULL, 24, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(667, 28, '2026-06-06', '- تعافي نشط -', 1, 1, 'إطالة خفيفة أو مشي هادئ 30 دقيقة', 'https://www.youtube.com/watch?v=v2r0zYnFmxo', NULL, 0, NULL, 25, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(668, 28, '2026-06-07', '- تعافي نشط -', 1, 1, 'إطالة خفيفة أو مشي هادئ 30 دقيقة', 'https://www.youtube.com/watch?v=v2r0zYnFmxo', NULL, 0, NULL, 26, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(669, 28, '2026-06-08', 'Goblet Squat (سكوات)', 3, 12, 'التركيز على استقامة الظهر', 'https://youtube.com/shorts/lRYBbchqxtI?si=yC1LfMlkXYuyIEqw', NULL, 0, NULL, 27, '2026-06-04 19:38:22', '2026-06-04 20:26:27'),
(670, 28, '2026-06-08', 'Lunges (طعن)', 3, 12, 'خطوة واسعة لشد الأرداف', 'https://www.youtube.com/watch?v=D7KaRcUTQeE', NULL, 0, NULL, 28, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(671, 28, '2026-06-08', 'Hip Thrust (جسر الحوض)', 4, 15, 'عصر العضلات في الأعلى', 'https://www.youtube.com/watch?v=SEdqd1n0cvg', NULL, 0, NULL, 29, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(672, 28, '2026-06-08', 'Leg Press (دفع أرجل)', 3, 12, 'دفع ببطء وتحكم', 'https://www.youtube.com/watch?v=IZxyjW7MPJQ', NULL, 0, NULL, 30, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(673, 28, '2026-06-08', 'Calf Raises (سمانة)', 3, 15, 'الوقوف على أطراف الأصابع', 'https://www.youtube.com/watch?v=-M4-G8p8fmc', NULL, 0, NULL, 31, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(674, 28, '2026-06-08', 'Walking (مشي سريع)', 1, 20, 'الحفاظ على نبض قلب مرتفع', 'https://www.youtube.com/watch?v=Z6jUPvbOviQ', NULL, 0, NULL, 32, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(675, 28, '2026-06-09', 'Lat Pulldown (سحب ظهر)', 3, 12, 'سحب البار للصدر وليس الرقبة', 'https://www.youtube.com/watch?v=fhy-oKeWBeU', NULL, 0, NULL, 33, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(676, 28, '2026-06-09', 'Dumbbell Chest Press (دفع صدر)', 3, 12, 'عدم قفل الكوع في الأعلى', 'https://youtube.com/shorts/Cj96ZZlmJRU?si=8Fh3VZJOFDHaUgSY', NULL, 0, NULL, 34, '2026-06-04 19:38:22', '2026-06-04 20:28:30'),
(677, 28, '2026-06-09', 'Shoulder Press (دفع كتف)', 3, 12, 'الجلوس باستقامة', 'https://www.youtube.com/watch?v=qEwKCR5JCog', NULL, 0, NULL, 35, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(678, 28, '2026-06-09', 'Bicep Curls (بايسبس)', 3, 12, 'عدم أرجحة الجسم', 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo', NULL, 0, NULL, 36, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(679, 28, '2026-06-09', 'Tricep Pushdown (ترايسبس)', 3, 12, 'تثبيت الكوع بجانب الجسم', 'https://youtube.com/shorts/4NWWB0f0vzQ?si=X-WZ1UkAD3yLPYPH', NULL, 0, NULL, 37, '2026-06-04 19:38:22', '2026-06-04 20:30:08'),
(680, 28, '2026-06-09', 'Elliptical (إليبتيكال)', 1, 20, 'مستوى مقاومة متوسط', 'https://youtube.com/shorts/vgcs8CtngAk?si=lqGR3mDqwIPgu_9i', NULL, 0, NULL, 38, '2026-06-04 19:38:22', '2026-06-04 20:31:36'),
(681, 28, '2026-06-10', '- تعافي نشط -', 1, 1, 'إطالة خفيفة أو مشي هادئ 30 دقيقة', 'https://www.youtube.com/watch?v=v2r0zYnFmxo', NULL, 0, NULL, 39, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(682, 28, '2026-06-11', 'Romanian Deadlift (رفعة رومانية)', 3, 12, 'نزول ببطء مع شد خلفيات الفخذ', 'https://youtube.com/shorts/RYV6Zq_8Z0w?si=y7mhpFVlRZUl6Hur', NULL, 0, NULL, 40, '2026-06-04 19:38:22', '2026-06-10 23:31:31'),
(683, 28, '2026-06-11', 'Bulgarian Split Squat (سكوات بلغاري)', 3, 10, 'توازن الجسم والتركيز', 'https://www.youtube.com/watch?v=2C-uNgKwPLE', NULL, 0, NULL, 41, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(684, 28, '2026-06-11', 'Leg Extension (تمديد أرجل)', 3, 12, 'فرد الأرجل بالكامل', 'https://www.youtube.com/watch?v=m0FOpMEgero', NULL, 0, NULL, 42, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(685, 28, '2026-06-11', 'Leg Curl (ثني أرجل)', 3, 12, 'ثني الأرجل لأقصى حد', 'https://youtube.com/shorts/_lgE0gPvbik?si=xS0dxYGITZoUWOy-', NULL, 0, NULL, 43, '2026-06-04 19:38:22', '2026-06-10 23:32:47'),
(686, 28, '2026-06-11', 'Glute Kickbacks (ركلة خلفية)', 3, 15, 'شد الأرداف بقوة', 'https://youtube.com/shorts/1u0CGdZfjJE?si=Z1Hco-jufUQJH8N7', NULL, 0, NULL, 44, '2026-06-04 19:38:22', '2026-06-10 23:33:50'),
(687, 28, '2026-06-11', 'Incline Walking (مشي منحدر)', 1, 20, 'سرعة 5-6 وميل 3-5', 'https://www.youtube.com/watch?v=v2r0zYnFmxo', NULL, 0, NULL, 45, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(688, 28, '2026-06-12', 'Seated Row (تجديف جالس)', 3, 12, 'سحب المقبض للبطن', 'https://www.youtube.com/watch?v=GZbfZ033f74', NULL, 0, NULL, 46, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(689, 28, '2026-06-12', 'Push-ups (ضغط - ركب)', 3, 10, 'يمكن عمله على الركب للمبتدئين', 'https://youtube.com/shorts/W0GFFzyYUWI?si=F88bW9VnS9obC2Hs', NULL, 0, NULL, 47, '2026-06-04 19:38:22', '2026-06-10 23:35:19'),
(690, 28, '2026-06-12', 'Lateral Raises (رفرفة جانبية)', 3, 12, 'رفع الوزن لمستوى الكتف فقط', 'https://youtube.com/shorts/Kl3LEzQ5Zqs?si=w9V7VbFEHVtMv9Jz', NULL, 0, NULL, 48, '2026-06-04 19:38:22', '2026-06-10 23:36:20'),
(691, 28, '2026-06-12', 'Hammer Curls (هامر بايسبس)', 3, 12, 'قبضة اليد مواجهة للجسم', 'https://youtube.com/shorts/kl_jpIYbKo4?si=dlL5FAKGE8M1GnFa', NULL, 0, NULL, 49, '2026-06-04 19:38:22', '2026-06-10 23:37:21'),
(692, 28, '2026-06-12', 'Plank (بلانك)', 3, 45, 'شد البطن والجسم بالكامل', 'https://www.youtube.com/watch?v=TvxNkmjdhMM', NULL, 0, NULL, 50, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(693, 28, '2026-06-12', 'Stair Climber (درج)', 1, 15, 'مستوى متوسط', 'https://www.youtube.com/watch?v=PMh2pyX7OJU', NULL, 0, NULL, 51, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(694, 28, '2026-06-13', '- تعافي نشط -', 1, 1, 'إطالة خفيفة أو مشي هادئ 30 دقيقة', 'https://www.youtube.com/watch?v=v2r0zYnFmxo', NULL, 0, NULL, 52, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(695, 28, '2026-06-14', '- تعافي نشط -', 1, 1, 'إطالة خفيفة أو مشي هادئ 30 دقيقة', 'https://www.youtube.com/watch?v=v2r0zYnFmxo', NULL, 0, NULL, 53, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(696, 28, '2026-06-15', 'Goblet Squat (سكوات)', 3, 12, 'التركيز على استقامة الظهر', 'https://youtube.com/shorts/7-80HiXX1K8?si=QPStUbCvv2YqtgVn', NULL, 0, NULL, 54, '2026-06-04 19:38:22', '2026-06-10 23:39:01'),
(697, 28, '2026-06-15', 'Lunges (طعن)', 3, 12, 'خطوة واسعة لشد الأرداف', 'https://www.youtube.com/watch?v=D7KaRcUTQeE', NULL, 0, NULL, 55, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(698, 28, '2026-06-15', 'Hip Thrust (جسر الحوض)', 4, 15, 'عصر العضلات في الأعلى', 'https://www.youtube.com/watch?v=SEdqd1n0cvg', NULL, 0, NULL, 56, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(699, 28, '2026-06-15', 'Leg Press (دفع أرجل)', 3, 12, 'دفع ببطء وتحكم', 'https://www.youtube.com/watch?v=IZxyjW7MPJQ', NULL, 0, NULL, 57, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(700, 28, '2026-06-15', 'Calf Raises (سمانة)', 3, 15, 'الوقوف على أطراف الأصابع', 'https://www.youtube.com/watch?v=-M4-G8p8fmc', NULL, 0, NULL, 58, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(701, 28, '2026-06-15', 'Walking (مشي سريع)', 1, 20, 'الحفاظ على نبض قلب مرتفع', 'https://www.youtube.com/watch?v=Z6jUPvbOviQ', NULL, 0, NULL, 59, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(702, 28, '2026-06-16', 'Lat Pulldown (سحب ظهر)', 3, 12, 'سحب البار للصدر وليس الرقبة', 'https://www.youtube.com/watch?v=fhy-oKeWBeU', NULL, 0, NULL, 60, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(703, 28, '2026-06-16', 'Dumbbell Chest Press (دفع صدر)', 3, 12, 'عدم قفل الكوع في الأعلى', 'https://www.youtube.com/watch?v=vj2uS8L6G3I', NULL, 0, NULL, 61, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(704, 28, '2026-06-16', 'Shoulder Press (دفع كتف)', 3, 12, 'الجلوس باستقامة', 'https://www.youtube.com/watch?v=qEwKCR5JCog', NULL, 0, NULL, 62, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(705, 28, '2026-06-16', 'Bicep Curls (بايسبس)', 3, 12, 'عدم أرجحة الجسم', 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo', NULL, 0, NULL, 63, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(706, 28, '2026-06-16', 'Tricep Pushdown (ترايسبس)', 3, 12, 'تثبيت الكوع بجانب الجسم', 'https://www.youtube.com/watch?v=2-LAMcpzHLU', NULL, 0, NULL, 64, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(707, 28, '2026-06-16', 'Elliptical (إليبتيكال)', 1, 20, 'مستوى مقاومة متوسط', 'https://www.youtube.com/watch?v=8m9_mZ7O-yY', NULL, 0, NULL, 65, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(708, 28, '2026-06-17', '- تعافي نشط -', 1, 1, 'إطالة خفيفة أو مشي هادئ 30 دقيقة', 'https://www.youtube.com/watch?v=v2r0zYnFmxo', NULL, 0, NULL, 66, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(709, 28, '2026-06-18', 'Romanian Deadlift (رفعة رومانية)', 3, 12, 'نزول ببطء مع شد خلفيات الفخذ', 'https://www.youtube.com/watch?v=JCXUYuzwftM', NULL, 0, NULL, 67, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(710, 28, '2026-06-18', 'Bulgarian Split Squat (سكوات بلغاري)', 3, 10, 'توازن الجسم والتركيز', 'https://www.youtube.com/watch?v=2C-uNgKwPLE', NULL, 0, NULL, 68, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(711, 28, '2026-06-18', 'Leg Extension (تمديد أرجل)', 3, 12, 'فرد الأرجل بالكامل', 'https://www.youtube.com/watch?v=m0FOpMEgero', NULL, 0, NULL, 69, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(712, 28, '2026-06-18', 'Leg Curl (ثني أرجل)', 3, 12, 'ثني الأرجل لأقصى حد', 'https://www.youtube.com/watch?v=1Tq3Qd1nwS8', NULL, 0, NULL, 70, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(713, 28, '2026-06-18', 'Glute Kickbacks (ركلة خلفية)', 3, 15, 'شد الأرداف بقوة', 'https://www.youtube.com/watch?v=AK0baCupSIs', NULL, 0, NULL, 71, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(714, 28, '2026-06-18', 'Incline Walking (مشي منحدر)', 1, 20, 'سرعة 5-6 وميل 3-5', 'https://www.youtube.com/watch?v=v2r0zYnFmxo', NULL, 0, NULL, 72, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(715, 28, '2026-06-19', 'Seated Row (تجديف جالس)', 3, 12, 'سحب المقبض للبطن', 'https://www.youtube.com/watch?v=GZbfZ033f74', NULL, 0, NULL, 73, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(716, 28, '2026-06-19', 'Push-ups (ضغط - ركب)', 3, 10, 'يمكن عمله على الركب للمبتدئين', 'https://www.youtube.com/watch?v=jWxvtyvm_Xw', NULL, 0, NULL, 74, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(717, 28, '2026-06-19', 'Lateral Raises (رفرفة جانبية)', 3, 12, 'رفع الوزن لمستوى الكتف فقط', 'https://www.youtube.com/watch?v=PPrzBWZqc_k', NULL, 0, NULL, 75, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(718, 28, '2026-06-19', 'Hammer Curls (هامر بايسبس)', 3, 12, 'قبضة اليد مواجهة للجسم', 'https://www.youtube.com/watch?v=7jqi2qWAUzQ', NULL, 0, NULL, 76, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(719, 28, '2026-06-19', 'Plank (بلانك)', 3, 45, 'شد البطن والجسم بالكامل', 'https://www.youtube.com/watch?v=TvxNkmjdhMM', NULL, 0, NULL, 77, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(720, 28, '2026-06-19', 'Stair Climber (درج)', 1, 15, 'مستوى متوسط', 'https://www.youtube.com/watch?v=PMh2pyX7OJU', NULL, 0, NULL, 78, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(721, 28, '2026-06-20', '- تعافي نشط -', 1, 1, 'إطالة خفيفة أو مشي هادئ 30 دقيقة', 'https://www.youtube.com/watch?v=v2r0zYnFmxo', NULL, 0, NULL, 79, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(722, 28, '2026-06-21', '- تعافي نشط -', 1, 1, 'إطالة خفيفة أو مشي هادئ 30 دقيقة', 'https://www.youtube.com/watch?v=v2r0zYnFmxo', NULL, 0, NULL, 80, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(723, 28, '2026-06-22', 'Goblet Squat (سكوات)', 3, 12, 'التركيز على استقامة الظهر', 'https://www.youtube.com/watch?v=JO7D6GJ98wY', NULL, 0, NULL, 81, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(724, 28, '2026-06-22', 'Lunges (طعن)', 3, 12, 'خطوة واسعة لشد الأرداف', 'https://www.youtube.com/watch?v=D7KaRcUTQeE', NULL, 0, NULL, 82, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(725, 28, '2026-06-22', 'Hip Thrust (جسر الحوض)', 4, 15, 'عصر العضلات في الأعلى', 'https://www.youtube.com/watch?v=SEdqd1n0cvg', NULL, 0, NULL, 83, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(726, 28, '2026-06-22', 'Leg Press (دفع أرجل)', 3, 12, 'دفع ببطء وتحكم', 'https://www.youtube.com/watch?v=IZxyjW7MPJQ', NULL, 0, NULL, 84, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(727, 28, '2026-06-22', 'Calf Raises (سمانة)', 3, 15, 'الوقوف على أطراف الأصابع', 'https://www.youtube.com/watch?v=-M4-G8p8fmc', NULL, 0, NULL, 85, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(728, 28, '2026-06-22', 'Walking (مشي سريع)', 1, 20, 'الحفاظ على نبض قلب مرتفع', 'https://www.youtube.com/watch?v=Z6jUPvbOviQ', NULL, 0, NULL, 86, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(729, 28, '2026-06-23', 'Lat Pulldown (سحب ظهر)', 3, 12, 'سحب البار للصدر وليس الرقبة', 'https://www.youtube.com/watch?v=fhy-oKeWBeU', NULL, 0, NULL, 87, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(730, 28, '2026-06-23', 'Dumbbell Chest Press (دفع صدر)', 3, 12, 'عدم قفل الكوع في الأعلى', 'https://www.youtube.com/watch?v=vj2uS8L6G3I', NULL, 0, NULL, 88, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(731, 28, '2026-06-23', 'Shoulder Press (دفع كتف)', 3, 12, 'الجلوس باستقامة', 'https://www.youtube.com/watch?v=qEwKCR5JCog', NULL, 0, NULL, 89, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(732, 28, '2026-06-23', 'Bicep Curls (بايسبس)', 3, 12, 'عدم أرجحة الجسم', 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo', NULL, 0, NULL, 90, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(733, 28, '2026-06-23', 'Tricep Pushdown (ترايسبس)', 3, 12, 'تثبيت الكوع بجانب الجسم', 'https://www.youtube.com/watch?v=2-LAMcpzHLU', NULL, 0, NULL, 91, '2026-06-04 19:38:22', '2026-06-04 20:16:46'),
(734, 28, '2026-06-23', 'Elliptical (إليبتيكال)', 1, 20, 'مستوى مقاومة متوسط', 'https://www.youtube.com/watch?v=8m9_mZ7O-yY', NULL, 0, NULL, 92, '2026-06-04 19:38:22', '2026-06-04 20:16:46');

-- --------------------------------------------------------

--
-- Table structure for table `workout_plans`
--

DROP TABLE IF EXISTS `workout_plans`;
CREATE TABLE `workout_plans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `month_start_date` date NOT NULL,
  `month_end_date` date NOT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `pdf_file` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `workout_plans`
--

INSERT INTO `workout_plans` (`id`, `user_id`, `month_start_date`, `month_end_date`, `created_by`, `updated_by`, `pdf_file`, `created_at`, `updated_at`, `deleted_at`) VALUES
(18, 59, '2026-03-01', '2026-03-31', 1, 1, NULL, '2026-03-27 20:23:33', '2026-03-27 20:23:33', NULL),
(19, 59, '2026-04-01', '2026-04-30', 1, 1, 'workout_pdfs/BP1J4eVDABCWLxAzRs9Y9YgSTaElPdCfUFCpacgU.pdf', '2026-04-03 00:45:36', '2026-04-08 10:07:30', NULL),
(21, 62, '2026-04-01', '2026-04-30', 1, 1, NULL, '2026-04-08 02:01:29', '2026-04-08 02:01:29', NULL),
(23, 59, '2026-05-01', '2026-05-31', 1, 1, 'workout_pdfs/3bG28Sii8CvwQcE6unyerBBDb1LrvJ2Dbw9mI1cb.pdf', '2026-05-05 09:00:14', '2026-05-10 17:27:09', NULL),
(24, 68, '2026-05-01', '2026-05-31', 1, 1, NULL, '2026-05-18 23:58:28', '2026-05-18 23:58:28', NULL),
(25, 72, '2026-05-01', '2026-05-31', 1, 1, NULL, '2026-05-24 18:17:15', '2026-05-24 18:17:15', NULL),
(28, 72, '2026-06-01', '2026-06-30', 1, 1, NULL, '2026-06-04 19:38:22', '2026-06-04 19:38:22', NULL),
(29, 59, '2026-06-01', '2026-06-30', 1, 1, NULL, '2026-06-04 19:41:38', '2026-06-04 19:41:38', NULL),
(30, 59, '2026-07-01', '2026-07-31', 1, 1, NULL, '2026-07-08 16:55:38', '2026-07-08 16:55:38', NULL);

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
-- Indexes for table `link_analytics`
--
ALTER TABLE `link_analytics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_link_analytics_link_id` (`link_id`),
  ADD KEY `idx_link_analytics_clicked_at` (`clicked_at`);

--
-- Indexes for table `link_links`
--
ALTER TABLE `link_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `link_links_order_index` (`order`);

--
-- Indexes for table `link_profiles`
--
ALTER TABLE `link_profiles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `link_social_analytics`
--
ALTER TABLE `link_social_analytics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_social_analytics_platform` (`platform`),
  ADD KEY `idx_social_analytics_clicked_at` (`clicked_at`);

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
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `plan_key` (`plan_key`),
  ADD KEY `idx_plan_key` (`plan_key`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_sort_order` (`sort_order`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `site_settings_key_unique` (`key`);

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `chat_notifications`
--
ALTER TABLE `chat_notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=242;

--
-- AUTO_INCREMENT for table `coach_features`
--
ALTER TABLE `coach_features`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

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
-- AUTO_INCREMENT for table `link_analytics`
--
ALTER TABLE `link_analytics`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT for table `link_links`
--
ALTER TABLE `link_links`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `link_profiles`
--
ALTER TABLE `link_profiles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `link_social_analytics`
--
ALTER TABLE `link_social_analytics`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `logos`
--
ALTER TABLE `logos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=270;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=561;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=206;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `testimonials_section`
--
ALTER TABLE `testimonials_section`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=735;

--
-- AUTO_INCREMENT for table `workout_plans`
--
ALTER TABLE `workout_plans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `link_analytics`
--
ALTER TABLE `link_analytics`
  ADD CONSTRAINT `fk_link_analytics_link_id` FOREIGN KEY (`link_id`) REFERENCES `link_links` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
