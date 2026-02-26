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
- [Backend API](#-backend-api)
- [Authentication & Sessions](#-authentication--sessions)
- [Subscriptions & Payments](#-subscriptions--payments)
- [Training & Nutrition](#-training--nutrition)
- [Chat System](#-chat-system)
- [Dynamic CMS (Admin Panel)](#-dynamic-cms-admin-panel)
- [Environment Variables](#-environment-variables)
- [Local Development](#-local-development)
- [Build & Deployment](#-build--deployment)
- [Troubleshooting](#-troubleshooting)

---

## 🏗 Architecture
RanLogic is split into:
- **Laravel 10 Backend** providing RESTful API endpoints
- **React (Vite) Frontends**
  - Admin Panel (protected, admin-only)
  - Trainee Website (public pages + protected profile)

Typical folder structure:
RanLogic/
backend/ # Laravel 10 API
frontend/ # React Vite (Admin Panel)
trainee/ # React Vite (Trainee Website)

> If your repository uses different names (e.g. `admin/` and `client/`), simply adjust commands accordingly.

---

## 🧩 Modules Overview

### 🌐 Public Website (Trainee App - Public Pages)
Dynamic sections served via API:
- **Hero Section** (video/stats/badge/titles)
- **About Coach** (badge/title/descriptions/features + image)
- **Certifications** (ordered list)
- **Testimonials** (section settings + testimonials list)
- **FAQ** (section + questions)
- **Footer** (social links, quick links, legal links, copyright)
- **Logo** (active logo)

Multi-language supported using:
- `locale` query parameter on public endpoints  
- `Accept-Language` header from frontend  
- Local storage language switch + RTL/LTR

---

### 🔐 Authentication (Trainee App)
API-driven authentication:
- Register
- Login
- Logout
- Logout from all devices
- Refresh token
- Get current user (`/auth/me`)

Local storage keys used by the frontend:
- `auth_token`
- `user` (JSON)
- `is_authenticated`
- `language`
- `last_activity` (for inactivity/session timeout)

---

### 💳 Subscription & Payments
The platform supports two payment methods:

#### ✅ PayPal
Flow:
1. Create payment / subscription order  
2. Redirect user  
3. Capture payment with token  
4. Activate subscription & unlock trainee profile

Used endpoints (front examples):
- `/subscriptions/paypal/create`
- `/subscriptions/paypal/capture`

#### 🏦 Bank Transfer
Flow:
1. Create a bank transfer subscription request
2. User uploads receipt + transfer number
3. Admin reviews and approves/rejects

Used endpoints (front examples):
- `/subscriptions/bank-transfer`
- `/subscriptions/{subscriptionId}/upload-receipt`

User capabilities:
- View plans
- Subscribe
- View active subscription
- View subscription history
- Renew subscription

---

### 👤 Trainee Profile (Unlocked After Subscription)
Once subscription is active, the trainee gains access to:
- Full profile info (name/email/phone/avatar)
- Update profile
- Update password (separate endpoint)
- Training plan (monthly)
- Nutrition plan (monthly)
- Completion toggles
- Progress stats
- Chat with coach

---

### 🏋️ Training Plan
- Monthly workout plan fetched by year/month
- Exercises list + completion toggles
- Admin fully manages plans from admin panel

Used endpoints (trainee examples):
- `/trainee/workout-plan?year=YYYY&month=MM`
- `/trainee/workout/exercises/{exerciseId}/toggle`

---

### 🥗 Nutrition Plan
- Monthly nutrition plan fetched by year/month
- Meals + items + completion toggles
- Admin fully manages meals/items from admin panel

Used endpoints (trainee examples):
- `/trainee/nutrition-plan?year=YYYY&month=MM`
- `/trainee/nutrition/items/{itemId}/toggle`

---

### 💬 Chat System
Coach ↔ Trainee conversation with:
- Text messages
- File upload (image supported from trainee side)
- Conversation history

Trainee endpoints (examples):
- `/trainee/chat/conversation`
- `/trainee/chat/messages`
- `/trainee/chat/files`

Admin endpoints (examples):
- `/admin/chat/conversations`
- `/admin/chat/conversations/{traineeId}`
- `/admin/chat/conversations/{traineeId}/messages`
- `/admin/chat/conversations/{traineeId}/files`
- Notifications:
  - `/admin/chat/notifications`
  - `/admin/chat/notifications/unread-count`
  - `/admin/chat/notifications/read`

---

## 🖥 Frontend Apps

### 1) Admin Panel (React + Vite)
Admin routes (example):
- Dashboard
- Content Management:
  - Logo
  - Hero Section
  - Certifications
  - About Coach
  - Testimonials
  - FAQ
  - Footer
- Training (trainees list + details)
- Chat (conversations + room)
- Subscriptions management (PayPal + Bank transfer)
- Settings/Profile

Admin requests use an Axios client with:
- `baseURL` from `VITE_API_URL`
- `Authorization: Bearer <token>`
- centralized error handling (401 redirect to /login, etc.)
- file upload support (multipart/form-data)

---

### 2) Trainee Website (React + Vite)
Routes include:
- `/` Home
- `/faq`
- `/auth` Authentication (login/register)
- `/profile` Protected
- `/plans` Protected
- `/payment/success`
- `/payment/cancel`

Trainee Axios client:
- Sends `Authorization` if token exists
- Sends `Accept-Language` header
- Redirects on 401 to `/auth`

Also includes:
- session inactivity handling using `last_activity`
- production-only analytics and performance monitoring initialization

---

## 🔌 Backend API (Laravel 10)
Laravel serves:
- Authentication endpoints
- Public content endpoints
- Admin content management endpoints
- Subscription and payment flows
- Training/nutrition plan endpoints
- Chat endpoints

API style:
- JSON responses with `{ success, message, data }` pattern
- File uploads via `multipart/form-data`
- Admin-only routes under `/admin/*`

---

## 🛡 Authentication & Sessions
- Token stored in localStorage (`auth_token`)
- Auto attach token via Axios interceptor
- On 401:
  - Clear auth storage
  - redirect to login/auth page
- Trainee app includes session timeout logic based on `last_activity`

---

## ⚙ Environment Variables

### Frontend (Admin Panel)
Create `.env`:
```bash
VITE_API_URL=https://your-domain.com/api


Trainee App

If you use separate baseURL, make sure to switch from localhost:

baseURL: 'http://localhost:8000/api' should become:
baseURL: import.meta.env.VITE_API_URL

Recommended .env:

VITE_API_URL=https://your-domain.com/api

Backend (Laravel)

Create .env:

APP_NAME=RanLogic
APP_ENV=local
APP_KEY=base64:...
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ranlogic
DB_USERNAME=root
DB_PASSWORD=

# PayPal
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=
PAYPAL_MODE=sandbox

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
📦 Build & Deployment
Frontend Build
npm run build
Typical Deployment Notes

Serve React builds via Nginx/Apache

Point both frontends to the production API using VITE_API_URL

Ensure Laravel storage permissions (uploads, receipts, images)

Configure CORS properly for:

Public website domain

Admin panel domain

🧯 Troubleshooting
✅ 1) 401 Unauthorized Redirect Loop

Ensure auth_token exists

Confirm token is attached in Axios interceptor

Confirm backend accepts Bearer token

✅ 2) CORS Issues

Check Laravel CORS config:

allowed origins include both frontend domains

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

Update trainee axios.create({ baseURL }) to use VITE_API_URL

Verify .env is available at build time

🏷 Project Name

RanLogic — A dynamic and scalable personal training platform.

<br/> <br/>
==============================
 RanLogic  RanLogic  RanLogic
==============================
RanLogic 🟡

منصة تدريب شخصي ديناميكية بالكامل (Laravel 10 + React Vite)

RanLogic هو نظام متكامل لمدربة شخصية يحتوي على:

موقع تعريفي (الصفحة الرئيسية + الأسئلة الشائعة)

تسجيل مستخدم + تسجيل دخول

نظام اشتراكات لفتح البروفايل

الدفع عبر PayPal أو تحويل بنكي

بروفايل متدرب كامل + تعديل البيانات

نظام تدريب شهري + نظام غذائي شهري

تتبع الإنجاز (تأشير التمارين/الوجبات كمكتملة)

شات بين المتدرب والمدربة

لوحة إدارة تتحكم بكل شيء (CMS)

✨ أهم النقاط

Back-End: Laravel 10 API

Front-End: React + Vite

لوحة الإدارة: إدارة محتوى كاملة وديناميكية

المدفوعات: PayPal + تحويل بنكي (رفع إيصال + موافقة الإدارة)

المحتوى يتغير بالكامل من لوحة الإدارة بدون تعديل الكود

لغتين: عربي / إنجليزي + RTL/LTR

🏗️ هيكل المشروع

المشروع مقسوم إلى:

Laravel API

واجهتين React (Vite):

لوحة الإدارة (Admin Panel)

واجهة المتدرب (Trainee Website)

شكل المجلدات المقترح:

RanLogic/
  backend/        # Laravel 10 API
  frontend/       # Admin Panel (React Vite)
  trainee/        # Trainee Website (React Vite)
🌐 الموقع العام (الواجهة العامة للمتدرب)

المحتوى ديناميكي ويتم جلبه عبر API:

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

🔐 نظام تسجيل الدخول والمستخدمين

يدعم:

تسجيل مستخدم جديد

تسجيل دخول

تسجيل خروج

تسجيل خروج من جميع الأجهزة

Refresh Token

جلب بيانات المستخدم الحالي (/auth/me)

مفاتيح التخزين localStorage المستخدمة:

auth_token

user

is_authenticated

language

last_activity (لانتهاء الجلسة بسبب عدم النشاط)

💳 نظام الاشتراكات والدفع
✅ PayPal

التدفق:

إنشاء عملية دفع

تحويل المستخدم

Capture بعد الرجوع بـ token

تفعيل الاشتراك وفتح البروفايل

Endpoints (أمثلة):

/subscriptions/paypal/create

/subscriptions/paypal/capture

🏦 التحويل البنكي

التدفق:

إنشاء طلب اشتراك تحويل بنكي

رفع رقم التحويل + إيصال

الإدارة توافق/ترفض

Endpoints (أمثلة):

/subscriptions/bank-transfer

/subscriptions/{id}/upload-receipt

👤 بروفايل المتدرب (يفتح بعد الاشتراك)

يشمل:

بيانات المستخدم (اسم/إيميل/هاتف/صورة)

تعديل البيانات

تغيير كلمة المرور (Endpoint منفصل)

عرض تفاصيل الاشتراك النشط

عرض سجل الاشتراكات وتجديد الاشتراك

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

محادثة بين المتدرب والمدربة

رسائل نصية

رفع صور/ملفات (حسب الواجهة)

سجل كامل

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

🧑‍💻 لوحة الإدارة (CMS ديناميكي بالكامل)

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
Frontend

أنشئ .env:

VITE_API_URL=https://your-domain.com/api
Backend (Laravel)

أنشئ .env:

APP_NAME=RanLogic
APP_URL=http://localhost:8000

DB_DATABASE=ranlogic
DB_USERNAME=root
DB_PASSWORD=

PAYPAL_CLIENT_ID=
PAYPAL_SECRET=
PAYPAL_MODE=sandbox
🧪 التشغيل محلياً
Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
Admin Panel
cd frontend
npm install
npm run dev
Trainee Website
cd trainee
npm install
npm run dev
🧯 مشاكل شائعة
1) مشكلة CORS

تأكد من إضافة دومينات الواجهات في إعدادات CORS داخل Laravel

2) رفع الملفات لا يعمل

تأكد من multipart/form-data

تأكد من اسم المفتاح:

logo

image

file

receipt

3) الواجهة ما زالت تشير إلى localhost في الإنتاج

عدّل baseURL لاستخدام VITE_API_URL

تأكد أن .env تم قراءته وقت build

🏷️ اسم المشروع

RanLogic — منصة تدريب شخصي ديناميكية وقابلة للتوسع.


---