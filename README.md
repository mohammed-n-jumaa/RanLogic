# RanLogic 🟡  
**Dynamic Personal Training Platform (Laravel 10 + React Vite)**

A full-featured, fully dynamic platform for a personal fitness coach:
- Public marketing website (Home + FAQ)
- Authentication (Register/Login)
- Subscription system (PayPal + Bank Transfer)
- Trainee profile with training & nutrition plans
- Coach ↔ Trainee chat
- Admin panel controls all website content and user/training management

---

## ✨ Key Highlights
- **Backend:** Laravel 10 REST API  
- **Frontend:** React 18 + Vite  
- **Admin Panel:** Full CMS-style dynamic control  
- **Payments:** PayPal (Create/Capture) + Bank Transfer (Receipt upload + Admin approval)  
- **Dynamic Content:** Hero / About Coach / Certifications / Testimonials / FAQ / Footer / Logo (all managed from Admin)  
- **Trainee Features:** Profile, subscription, workout plan, nutrition plan, progress toggles, chat  
- **Multi-language:** Arabic / English with RTL/LTR handling  

---

## 🧭 Table of Contents
- [Architecture](#-architecture)
- [Modules Overview](#-modules-overview)
- [Frontend Apps](#-frontend-apps)
- [Backend API](#-backend-api-laravel-10)
- [Authentication & Sessions](#-authentication--sessions)
- [Subscriptions & Payments](#-subscriptions--payments)
- [Training & Nutrition](#-training--nutrition)
- [Chat System](#-chat-system)
- [Dynamic CMS (Admin Panel)](#-dynamic-cms-admin-panel)
- [Environment Variables](#-environment-variables)
- [Local Development](#-local-development)
- [Build & Deployment](#-build--deployment-hostinger--ranlogiccom)
- [Troubleshooting](#-troubleshooting)

---

## 🏗 Architecture
RanLogic is split into:
- **Laravel 10 Backend** providing RESTful API endpoints
- **React (Vite) Frontends**
  - Admin Panel (protected, admin-only)
  - Trainee Website (public pages + protected profile)

Typical folder structure:
```txt
RanLogic/
  backend/        # Laravel 10 API
  frontend/       # React Vite (Admin Panel)
  trainee/        # React Vite (Trainee Website)

If your repository uses different names (e.g. admin/ and client/), simply adjust commands accordingly.

🧩 Modules Overview
🌐 Public Website (Trainee App - Public Pages)

Dynamic sections served via API:

Hero Section (video/stats/badge/titles)

About Coach (badge/title/descriptions/features + image)

Certifications (ordered list)

Testimonials (section settings + testimonials list)

FAQ (section + questions)

Footer (social links, quick links, legal links, copyright)

Logo (active logo)

Multi-language supported using:

locale query parameter on public endpoints

Accept-Language header from frontend

Local storage language switch + RTL/LTR

🔐 Authentication (Trainee App)

API-driven authentication:

Register

Login

Logout

Logout from all devices

Refresh token

Get current user (/auth/me)

Local storage keys used by the frontend:

auth_token

user (JSON)

is_authenticated

language

last_activity (for inactivity/session timeout)

💳 Subscriptions & Payments

The platform supports two payment methods:

✅ PayPal

Flow:

Create payment / subscription order

Redirect user

Capture payment with token

Activate subscription & unlock trainee profile

Used endpoints (front examples):

/subscriptions/paypal/create

/subscriptions/paypal/capture

🏦 Bank Transfer

Flow:

Create a bank transfer subscription request

User uploads receipt + transfer number

Admin reviews and approves/rejects

Used endpoints (front examples):

/subscriptions/bank-transfer

/subscriptions/{subscriptionId}/upload-receipt

User capabilities:

View plans

Subscribe

View active subscription

View subscription history

Renew subscription

👤 Trainee Profile (Unlocked After Subscription)

Once subscription is active, the trainee gains access to:

Full profile info (name/email/phone/avatar)

Update profile

Update password (separate endpoint)

Training plan (monthly)

Nutrition plan (monthly)

Completion toggles

Progress stats

Chat with coach

🏋️ Training Plan

Monthly workout plan fetched by year/month

Exercises list + completion toggles

Admin fully manages plans from admin panel

Used endpoints (trainee examples):

/trainee/workout-plan?year=YYYY&month=MM

/trainee/workout/exercises/{exerciseId}/toggle

🥗 Nutrition Plan

Monthly nutrition plan fetched by year/month

Meals + items + completion toggles

Admin fully manages meals/items from admin panel

Used endpoints (trainee examples):

/trainee/nutrition-plan?year=YYYY&month=MM

/trainee/nutrition/items/{itemId}/toggle

💬 Chat System

Coach ↔ Trainee conversation with:

Text messages

File upload (image supported from trainee side)

Conversation history

Trainee endpoints (examples):

/trainee/chat/conversation

/trainee/chat/messages

/trainee/chat/files

Admin endpoints (examples):

/admin/chat/conversations

/admin/chat/conversations/{traineeId}

/admin/chat/conversations/{traineeId}/messages

/admin/chat/conversations/{traineeId}/files

Notifications:

/admin/chat/notifications

/admin/chat/notifications/unread-count

/admin/chat/notifications/read

🖥 Frontend Apps
1) Admin Panel (React + Vite)

Admin routes (example):

Dashboard

Content Management:

Logo

Hero Section

Certifications

About Coach

Testimonials

FAQ

Footer

Training (trainees list + details)

Chat (conversations + room)

Subscriptions management (PayPal + Bank transfer)

Settings/Profile

Admin requests use an Axios client with:

baseURL from VITE_API_URL

Authorization: Bearer <token>

centralized error handling (401 redirect to /auth, etc.)

file upload support (multipart/form-data)

2) Trainee Website (React + Vite)

Routes include:

/ Home

/faq

/auth Authentication (login/register)

/profile Protected

/plans Protected

/payment/success

/payment/cancel

Trainee Axios client:

Sends Authorization if token exists

Sends Accept-Language header

Redirects on 401 to /auth

Also includes:

session inactivity handling using last_activity

production-only analytics and performance monitoring initialization

🔌 Backend API (Laravel 10)

Laravel serves:

Authentication endpoints

Public content endpoints

Admin content management endpoints

Subscription and payment flows

Training/nutrition plan endpoints

Chat endpoints

API style:

JSON responses with { success, message, data } pattern

File uploads via multipart/form-data

Admin-only routes under /admin/*

🛡 Authentication & Sessions

Token stored in localStorage (auth_token)

Auto attach token via Axios interceptor

On 401:

Clear auth storage

redirect to /auth

Trainee app includes session timeout logic based on last_activity

⚙ Environment Variables
✅ Production URLs (RanLogic.com)

Website: https://ranlogic.com

API (recommended): https://ranlogic.com/api

If your API is hosted on a separate subdomain, set:
VITE_API_URL=https://api.ranlogic.com/api

Frontend (Admin Panel) — .env

Create frontend/.env:

VITE_API_URL=https://ranlogic.com/api
Frontend (Trainee Website) — .env

Create trainee/.env:

VITE_API_URL=https://ranlogic.com/api

✅ Important: in your Axios config you should not hardcode localhost in production.
Change:

baseURL: 'http://localhost:8000/api'

To:

baseURL: import.meta.env.VITE_API_URL
Backend (Laravel) — .env

Create backend/.env:

APP_NAME=RanLogic
APP_ENV=production
APP_DEBUG=false
APP_URL=https://ranlogic.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ranlogic
DB_USERNAME=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASSWORD

# PayPal
PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID
PAYPAL_SECRET=YOUR_PAYPAL_SECRET
PAYPAL_MODE=sandbox
# Use "live" in production once you switch to real payments
🧪 Local Development
1) Backend (Laravel)
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
2) Admin Panel (React + Vite)
cd frontend
npm install
npm run dev
3) Trainee Website (React + Vite)
cd trainee
npm install
npm run dev
📦 Build & Deployment (Hostinger + RanLogic.com)
Frontend Build
npm run build
Deployment Notes (recommended)

Ensure both frontends are built with correct VITE_API_URL

Ensure Laravel storage is writable (uploads, receipts, images)

Configure CORS to allow:

https://ranlogic.com

(admin domain if separate)

If you use HTTPS (recommended), ensure both site + API use HTTPS too

🧯 Troubleshooting
✅ 1) 401 Unauthorized Redirect Loop

Ensure auth_token exists

Confirm token is attached in Axios interceptor

Confirm backend accepts Bearer token

✅ 2) CORS Issues

Check Laravel CORS config:

allowed origins include your domains

allow required headers

If using cookies/credentials:

set supports_credentials=true and match frontend withCredentials

✅ 3) File Upload Failures

Confirm request uses multipart/form-data

Confirm backend validation rules accept correct key:

logo: logo

image: image

chat file: file

receipt: receipt

✅ 4) Production baseURL still points to localhost

Update axios baseURL to use import.meta.env.VITE_API_URL

Verify .env was applied before building

🏷 Project Name

RanLogic — A dynamic and scalable personal training platform.

<br/> <br/> <br/>
# ==============================
# 🇸🇦 RanLogic (النسخة العربية)
# ==============================

# RanLogic 🟡  
**منصة تدريب شخصي ديناميكية بالكامل (Laravel 10 + React Vite)**

RanLogic هو نظام متكامل لمدربة شخصية يحتوي على:
- موقع تعريفي (الصفحة الرئيسية + الأسئلة الشائعة)
- تسجيل مستخدم + تسجيل دخول
- نظام اشتراكات لفتح البروفايل
- الدفع عبر **PayPal** أو **تحويل بنكي**
- بروفايل متدرب كامل + تعديل البيانات
- نظام تدريب شهري + نظام غذائي شهري
- تتبع الإنجاز (تأشير التمارين/الوجبات كمكتملة)
- شات بين المتدرب والمدربة
- تجديد اشتراك + عرض تفاصيل الاشتراك وسجل الاشتراكات
- لوحة إدارة تتحكم بكل شيء (CMS)

---

## ✨ أهم المميزات
- **Back-End:** Laravel 10 REST API  
- **Front-End:** React 18 + Vite  
- **لوحة الإدارة:** تحكم كامل بالمحتوى والمستخدمين والخطط  
- **المدفوعات:** PayPal (Create/Capture) + تحويل بنكي (رفع إيصال + موافقة الإدارة)  
- **المحتوى ديناميكي بالكامل:** Hero / About / Certifications / Testimonials / FAQ / Footer / Logo  
- **المتدرب:** بروفايل + اشتراك + خطط تدريب/غذاء + تتبع الإنجاز + شات  
- **لغتين:** عربي / إنجليزي + دعم RTL/LTR  

---

## 🧭 فهرس المحتويات
- [هيكل المشروع](#-هيكل-المشروع)
- [الموقع العام (Public)](#-الموقع-العام-public)
- [المصادقة وتسجيل الدخول](#-المصادقة-وتسجيل-الدخول)
- [الاشتراكات والدفع](#-الاشتراكات-والدفع)
- [بروفايل المتدرب](#-بروفايل-المتدرب)
- [النظام التدريبي](#-النظام-التدريبي)
- [النظام الغذائي](#-النظام-الغذائي)
- [الشات](#-الشات)
- [لوحة الإدارة (CMS)](#-لوحة-الإدارة-cms)
- [⚙️ متغيرات البيئة](#️-متغيرات-البيئة)
- [التشغيل محلياً](#-التشغيل-محلياً)
- [النشر على Hostinger (ranlogiccom)](#-النشر-على-hostinger-ranlogiccom)
- [مشاكل شائعة](#-مشاكل-شائعة)

---

## 🏗 هيكل المشروع
المشروع مقسوم إلى:
- **Laravel 10 API (Back-End)**
- **واجهتين React (Vite)**
  1) لوحة الإدارة (Admin Panel)
  2) واجهة المتدرب (Trainee Website)

شكل المجلدات المقترح:
```txt
RanLogic/
  backend/        # Laravel 10 API
  frontend/       # Admin Panel (React Vite)
  trainee/        # Trainee Website (React Vite)
  🌐 الموقع العام (Public)

المحتوى ديناميكي ويتم جلبه عبر API (كل شيء قابل للتعديل من لوحة الإدارة):

Hero Section (فيديو + نصوص + إحصائيات)

About Coach (تعريف + مميزات + صورة)

Certifications (شهادات مع ترتيب)

Testimonials (آراء + إعدادات القسم)

FAQ (قسم + أسئلة)

Footer (سوشيال + روابط سريعة + روابط قانونية)

Logo (الشعار النشط)

دعم اللغات يتم عبر:

locale في Query String

أو Accept-Language في Headers

تخزين اللغة بـ localStorage والتحويل RTL/LTR

🔐 المصادقة وتسجيل الدخول

يدعم:

تسجيل مستخدم جديد

تسجيل دخول

تسجيل خروج

تسجيل خروج من جميع الأجهزة

Refresh Token

جلب بيانات المستخدم الحالي (/auth/me)

مفاتيح localStorage المستخدمة:

auth_token

user (JSON)

is_authenticated

language

last_activity (لانتهاء الجلسة بسبب عدم النشاط)

💳 الاشتراكات والدفع
✅ PayPal

التدفق:

إنشاء عملية دفع/اشتراك

تحويل المستخدم إلى PayPal

Capture بعد الرجوع بـ token

تفعيل الاشتراك وفتح البروفايل

Endpoints (أمثلة):

/subscriptions/paypal/create

/subscriptions/paypal/capture

🏦 التحويل البنكي

التدفق:

إنشاء طلب اشتراك تحويل بنكي

رفع رقم التحويل + إيصال التحويل

الإدارة تراجع وتوافق/ترفض

Endpoints (أمثلة):

/subscriptions/bank-transfer

/subscriptions/{id}/upload-receipt

👤 بروفايل المتدرب

يفتح فقط بعد وجود اشتراك نشط، ويشمل:

بيانات المستخدم (اسم/إيميل/هاتف/صورة)

تعديل البيانات

تغيير كلمة المرور (Endpoint منفصل)

عرض تفاصيل الاشتراك النشط + تجديد الاشتراك + سجل الاشتراكات

خطة تدريب شهرية

خطة غذائية شهرية

تأشير الإنجاز للوجبات/التمارين

إحصائيات التقدم

شات مع المدربة

🏋️ النظام التدريبي

خطة تدريب شهرية حسب (سنة/شهر)

قائمة تمارين + زر تأشير مكتمل

الإدارة تتحكم بالكامل بالخطط

Endpoints (أمثلة):

/trainee/workout-plan?year=YYYY&month=MM

/trainee/workout/exercises/{id}/toggle

🥗 النظام الغذائي

خطة غذائية شهرية حسب (سنة/شهر)

وجبات + عناصر وجبة + تأشير مكتمل

الإدارة تتحكم بالكامل

Endpoints (أمثلة):

/trainee/nutrition-plan?year=YYYY&month=MM

/trainee/nutrition/items/{id}/toggle

💬 الشات

محادثة بين المتدرب والمدربة تشمل:

رسائل نصية

رفع صور/ملفات (حسب الواجهة)

سجل كامل للمحادثة

Trainee Endpoints (أمثلة):

/trainee/chat/conversation

/trainee/chat/messages

/trainee/chat/files

Admin Endpoints (أمثلة):

/admin/chat/conversations

/admin/chat/conversations/{traineeId}

إشعارات الشات:

/admin/chat/notifications

/admin/chat/notifications/unread-count

/admin/chat/notifications/read

🧑‍💻 لوحة الإدارة (CMS)

الإدارة تتحكم بـ:

Logo / Branding

Hero Section

About Coach

Certifications

Testimonials

FAQ

Footer & Social Links

المستخدمين

الاشتراكات (PayPal/Bank Transfer)

خطط التدريب والغذاء

الشات والإشعارات

كل الموقع قابل للتعديل من لوحة الإدارة بدون تعديل أي نص داخل الكود.

⚙️ متغيرات البيئة
✅ روابط البرودكشن (RanLogic.com)

الموقع: https://ranlogic.com

الـ API (الموصى به): https://ranlogic.com/api

إذا كان الـ API على subdomain:
استخدم https://api.ranlogic.com/api بدل https://ranlogic.com/api

✅ Frontend (لوحة الإدارة + المتدرب)

أنشئ ملف .env داخل:

frontend/.env

trainee/.env

واكتب:

VITE_API_URL=https://ranlogic.com/api

✅ مهم جداً: لا تترك Axios يشير إلى localhost في الإنتاج.
بدّل في ملف api/index.js:

baseURL: 'http://localhost:8000/api'

إلى:

baseURL: import.meta.env.VITE_API_URL
✅ Backend (Laravel) — backend/.env
APP_NAME=RanLogic
APP_ENV=production
APP_DEBUG=false
APP_URL=https://ranlogic.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ranlogic
DB_USERNAME=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASSWORD

# PayPal
PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID
PAYPAL_SECRET=YOUR_PAYPAL_SECRET
PAYPAL_MODE=sandbox
# عند التحويل للدفع الحقيقي:
# PAYPAL_MODE=live
🧪 التشغيل محلياً
1) Backend (Laravel)
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
2) Admin Panel
cd frontend
npm install
npm run dev
3) Trainee Website
cd trainee
npm install
npm run dev
📦 النشر على Hostinger (ranlogic.com)

اعمل build للواجهات قبل الرفع

تأكد أن VITE_API_URL صحيح وقت build

تأكد صلاحيات Laravel:

storage/ قابل للكتابة

مجلدات الرفع (صور/إيصالات/ملفات)

اضبط CORS على دومين ranlogic.com (وأي دومين خاص بلوحة الإدارة لو منفصل)

🧯 مشاكل شائعة
1) مشكلة CORS

تأكد من إضافة الدومينات في إعدادات CORS داخل Laravel.

2) رفع الملفات لا يعمل

تأكد من multipart/form-data وأسماء المفاتيح:

logo

image

file

receipt

3) الواجهة ما زالت تشير إلى localhost في الإنتاج

بدّل baseURL إلى import.meta.env.VITE_API_URL

تأكد أن .env موجود قبل تنفيذ build

أعد build بعد تعديل .env

🏷️ اسم المشروع

RanLogic — منصة تدريب شخصي ديناميكية وقابلة للتوسع.