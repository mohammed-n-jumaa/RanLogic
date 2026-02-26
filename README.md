🟡 RanLogic – منصة تدريب شخصي متكاملة

RanLogic هو نظام متكامل لإدارة منصة مدربة لياقة بدنية شخصية، مبني باستخدام:

🔹 Frontend: React + Vite

🔹 Backend: Laravel 10 (REST API)

🔹 Database: MySQL

🔹 Authentication: JWT / Sanctum Token-based

🔹 Payments: PayPal + Bank Transfer

🔹 Admin Panel: Dynamic Content Management

📌 نظرة عامة على النظام

RanLogic عبارة عن منصة ديناميكية بالكامل لإدارة:

الصفحة الرئيسية التعريفية

نظام الأسئلة الشائعة

نظام تسجيل المستخدمين

نظام الاشتراكات (PayPal / تحويل بنكي)

لوحة تحكم للمدربة

بروفايل المتدرب

نظام غذائي شهري

نظام تدريبي شهري

شات مباشر مع المدربة

إدارة كاملة للمحتوى من خلال لوحة الإدارة

🏗️ البنية التقنية
🔹 Frontend (React + Vite)
التقنيات المستخدمة:

React

Vite

Axios

React Router

Context API (Language + Inactivity)

Framer Motion

SCSS

أهم الأنظمة في الفرونت:
1️⃣ الصفحة الرئيسية

Hero Section (فيديو + إحصائيات)

About Coach

Certifications

Testimonials

FAQ

Footer

Logo ديناميكي

جميع هذه الأقسام يتم جلبها من API وقابلة للتعديل من لوحة الإدارة.

2️⃣ نظام المصادقة

تسجيل مستخدم

تسجيل دخول

تسجيل خروج

Refresh Token

Logout All Devices

حفظ اللغة

Session Timeout

Protected Routes

3️⃣ نظام الاشتراكات

عرض الخطط

إنشاء عملية PayPal

Capture الدفع

إنشاء اشتراك تحويل بنكي

رفع إيصال التحويل

عرض الاشتراكات

عرض الاشتراك النشط

تجديد الاشتراك

4️⃣ بروفايل المتدرب

تعديل المعلومات الشخصية

تغيير كلمة المرور

رفع صورة

حذف صورة

عرض تفاصيل الاشتراك

عرض النظام الغذائي الشهري

عرض النظام التدريبي الشهري

تتبع الإنجاز اليومي

إكمال تمارين

إكمال عناصر الوجبات

شات مباشر مع المدربة

5️⃣ نظام اللغة

عربي / إنجليزي

RTL / LTR

تخزين اللغة في localStorage

تمرير اللغة في Header (Accept-Language)

🔹 Backend (Laravel 10)
أهم الأنظمة في الباك:
🔐 Authentication

Login

Register

Logout

Refresh

Me

🧑‍💻 إدارة المحتوى (Admin Panel)

لوحة الإدارة تتحكم بالكامل في:

Hero Section

About Coach

Certifications

Testimonials

FAQ

Footer

Logos

Plans

Workout Plans

Nutrition Plans

Users

Subscriptions

Chat Messages

الموقع بالكامل ديناميكي ويتغير مباشرة من لوحة التحكم.

💳 نظام الدفع
PayPal:

Create Order

Capture Payment

ربط الاشتراك بالمستخدم

تحديث حالة الاشتراك

Bank Transfer:

إنشاء طلب اشتراك

رفع إيصال

مراجعة من الإدارة

تفعيل يدوي

🥗 النظام الغذائي

خطة شهرية

وجبات

عناصر داخل كل وجبة

إمكانية تحديد الإنجاز

تخزين الحالة

🏋️ النظام التدريبي

خطة شهرية

تمارين

تحديد إكمال التمرين

تتبع التقدم

💬 الشات

محادثة بين المتدرب والمدربة

إرسال رسالة نص

إرسال صورة

عرض المحادثة كاملة

🔁 نظام ديناميكي بالكامل

جميع الأقسام التالية يتم إدارتها من لوحة التحكم:

النصوص

الصور

الفيديو

الإحصائيات

الشهادات

الآراء

الأسئلة

روابط السوشيال

الخطط والأسعار

الأنظمة الغذائية

الأنظمة التدريبية

لا يوجد أي محتوى ثابت Hardcoded.

⚙️ تشغيل المشروع
Backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
Frontend
npm install
npm run dev
🌍 البيئة الإنتاجية

تفعيل Analytics فقط في الإنتاج

مراقبة الأداء (Core Web Vitals)

Timeout session

حماية Routes

🔐 الأمان

Token-based Authentication

Role-based access (Admin / Trainee)

Validation لكل الطلبات

حماية API من 401 / 403

Session timeout

🏷️ اسم المشروع

RanLogic

منصة تدريب شخصي احترافية متكاملة لإدارة الاشتراكات، التدريب، التغذية، والتواصل المباشر.

................................................................................................
................................................................................................
................................................................................................
🟡 RanLogic – Complete Personal Training Platform

RanLogic is a fully dynamic personal training platform built with:

🔹 Frontend: React + Vite

🔹 Backend: Laravel 10 (REST API)

🔹 Database: MySQL

🔹 Authentication: Token-based

🔹 Payments: PayPal + Bank Transfer

🔹 Admin Panel: Full Dynamic Control

📌 System Overview

RanLogic includes:

Marketing Homepage

FAQ Section

User Authentication

Subscription System

Admin Dashboard

Trainee Profile

Monthly Workout Plan

Monthly Nutrition Plan

Live Chat with Coach

Subscription Renewal

Fully Dynamic Content Management

🏗️ Technical Architecture
🔹 Frontend (React + Vite)
Technologies:

React

Vite

Axios

React Router

Context API

Framer Motion

SCSS

Main Frontend Modules
Homepage

Hero Section

About Coach

Certifications

Testimonials

FAQ

Footer

Dynamic Logo

All controlled by backend.

Authentication

Login

Register

Logout

Refresh Token

Session Timeout

Role-based access

Protected Routes

Subscription System

View plans

PayPal integration

Capture payment

Bank transfer upload

View subscriptions

Active subscription status

Renewal system

Trainee Profile

Edit profile

Change password

Upload avatar

Nutrition plan

Workout plan

Toggle completion

Chat with coach

Progress tracking

Admin Panel Controls

Admin fully controls:

Hero section

About coach

Certifications

Testimonials

FAQ

Footer

Logos

Plans

Workout plans

Nutrition plans

Users

Subscriptions

Chat system

Everything is dynamic.

🥗 Nutrition System

Monthly plan

Meals

Meal items

Toggle completion

Progress tracking

🏋️ Workout System

Monthly workout plan

Exercises

Toggle completion

Progress tracking

💬 Chat System

Conversation between trainee and coach

Text messages

Image upload

Full history

💳 Payment System
PayPal:

Create order

Capture payment

Activate subscription

Bank Transfer:

Upload receipt

Admin review

Manual activation

⚙️ Installation
Backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
Frontend
npm install
npm run dev
🔐 Security

Token-based authentication

Role-based access

Session timeout

API validation

Error handling

Protected routes

🚀 Production Features

Performance monitoring

Analytics

Secure API handling

Optimized builds

🏷️ Project Name

RanLogic

A complete dynamic personal training management system including subscriptions, workouts, nutrition, and real-time communication.