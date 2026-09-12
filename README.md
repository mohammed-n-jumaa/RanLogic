<p align="center">
  <img src="https://ranlogic.com/logo.png" alt="RanLogic" width="80" />
</p>

<h1 align="center">RanLogic — Fitness & Nutrition Platform</h1>

<p align="center">
  <strong>منصة تدريب رياضي وتغذية متكاملة — مبنية لمدربة رياضية محترفة</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-10-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/PHP-8.1+-777BB4?style=for-the-badge&logo=php&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
</p>

<p align="center">
  <a href="https://ranlogic.com">🌐 Live Site</a> •
  <a href="https://admin.ranlogic.com">🔐 Admin Panel</a>
</p>

---

## 📌 Overview

RanLogic is a full-stack fitness coaching platform that connects a certified personal trainer with her clients. The system handles everything from subscription management and payment processing to personalized workout plans, nutrition tracking, and real-time chat.

The platform consists of **three independent applications** sharing a single backend API:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   🌐 Client App          🔐 Admin Panel        🛠 API       │
│   (React + Vite)         (React + Vite)      (Laravel 10)   │
│   ranlogic.com           admin.ranlogic.com   api.ranlogic   │
│                                                             │
│   • Landing page         • Dashboard          • Auth/JWT     │
│   • Plans & payments     • Content CMS        • REST API     │
│   • Workout tracker      • Training mgmt      • PayPal       │
│   • Nutrition tracker    • Chat system         • Sanctum      │
│   • Client dashboard     • Subscriptions       • Services     │
│   • Real-time chat       • Coupons system      • Geo pricing  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🌐 Client Application

| Feature | Description |
|---|---|
| **Landing Page** | Animated hero section, coach bio, certifications, testimonials, FAQ — all CMS-driven |
| **Subscription Plans** | 4 plans (Basic, Nutrition, Elite, VIP) × 3 durations (1/3/6 months) with geo-based pricing |
| **Payment Gateway** | PayPal integration + bank transfer with admin approval workflow |
| **Coupon System** | Discount codes (percentage or fixed) with plan/duration restrictions and usage limits |
| **Workout Dashboard** | Daily workout plans with exercise videos, sets/reps tracking, completion progress |
| **Nutrition Tracker** | Personalized meal plans, calorie tracking, water intake logging |
| **Body Measurements** | Weight logging, progress photos, body measurement history with charts |
| **Real-time Chat** | Direct messaging with the coach, push notifications via FCM |
| **Multi-language** | Full Arabic/English support with RTL layout |
| **Geo Pricing** | Automatic currency conversion based on user location (USD, JOD, SAR, etc.) |

### 🔐 Admin Panel

| Feature | Description |
|---|---|
| **Analytics Dashboard** | Revenue charts, subscription growth, plan distribution, alerts — all real-time data |
| **Content Management** | Logo, hero section, coach bio, certifications, testimonials, FAQ, footer — full CMS |
| **Training Management** | Client list with detailed profiles, workout plan builder, exercise library |
| **Chat System** | Real-time messaging with all trainees, message notifications |
| **Subscription Management** | Bank transfer approvals, PayPal transactions, plan pricing editor |
| **Coupon Management** | Create/edit discount codes with plan restrictions, duration limits, usage caps, expiry dates |
| **User Management** | View all registered users, filter by status, manage profiles |
| **Dark/Light Theme** | Full theme support across all pages |

### 🛠 Backend API

| Feature | Description |
|---|---|
| **Authentication** | Laravel Sanctum token-based auth with role-based access (admin/user) |
| **Payment Processing** | PayPal SDK integration with order creation, capture, and webhook handling |
| **Geo Pricing Service** | IP-based currency detection with configurable exchange rates |
| **Image Optimization** | Auto-resize and compress uploads via Intervention Image |
| **Coupon Engine** | Validation service with plan/duration/amount/usage/date checks |
| **Push Notifications** | Firebase Cloud Messaging (FCM) for chat and subscription alerts |
| **Caching** | Redis/file caching on dashboard metrics and frequently accessed data |
| **Service Layer** | Clean architecture with dedicated service classes for business logic |

---

## 🏗 Tech Stack

### Backend
```
Laravel 10  •  PHP 8.1+  •  MySQL 8  •  Laravel Sanctum
PayPal SDK  •  Intervention Image  •  Firebase Admin SDK
```

### Frontend (Client + Admin)
```
React 19  •  Vite 7  •  Framer Motion  •  Recharts
Axios  •  React Router 6  •  SCSS Modules  •  SweetAlert2
```

### Infrastructure
```
Hostinger VPS  •  Apache  •  SSL/TLS  •  Vercel (frontend)
```

---

## 📁 Project Structure

```
ranlogic/
│
├── 🛠  backend/                    # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/   # 25+ REST controllers
│   │   ├── Models/                 # 38 Eloquent models
│   │   ├── Services/               # 20 service classes
│   │   └── Http/Requests/          # Form request validation
│   ├── routes/api.php              # API routes
│   └── database/migrations/        # Database schema
│
├── 🌐  frontend/                   # Client React app
│   └── src/
│       ├── features/               # Auth, Plans, Workout, Nutrition,
│       │                           # Chat, Dashboard, Profile, Payment
│       ├── pages/                  # Landing, Legal, Privacy, Terms
│       ├── api/                    # API service layer
│       └── components/             # Shared UI components
│
└── 🔐  admin/                      # Admin React app
    └── src/
        ├── pages/
        │   ├── Dashboard/          # Analytics dashboard
        │   ├── Content/            # CMS (7 sections)
        │   ├── Training/           # Client & exercise management
        │   ├── Subscriptions/      # Payments, plans, coupons
        │   ├── Chat/               # Messaging system
        │   └── Profile/            # Admin profile settings
        ├── components/
        │   ├── Layout/             # Sidebar, Header
        │   └── Dashboard/          # Charts, metrics, alerts
        └── api/                    # API service layer
```

---

## 🚀 Getting Started

### Prerequisites

```
PHP >= 8.1    •    Composer    •    Node.js >= 18    •    MySQL 8
```

### Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configure .env with database, PayPal, and FCM credentials

php artisan migrate
php artisan serve
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env    # Set VITE_API_URL
npm run dev
```

### Admin Setup

```bash
cd admin
npm install
cp .env.example .env    # Set VITE_API_URL
npm run dev
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
DB_DATABASE=ranlogic
DB_USERNAME=root
DB_PASSWORD=

PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_secret
PAYPAL_MODE=sandbox

FCM_SERVER_KEY=your_fcm_key
```

### Frontend & Admin (.env)
```env
VITE_API_URL=https://api.ranlogic.com/api
```

---

## 📊 Database Schema

The platform uses **38 models** with the following core tables:

```
users ──────────┐
                │
subscriptions ──┤──── coupons
                │
workout_plans ──┤──── workout_exercises ──── exercises
                │
nutrition_plans ┤──── nutrition_meals ──── nutrition_items
                │
conversations ──┤──── messages
                │
plans ──────────┘

about_coach  •  certifications  •  testimonials  •  faq_sections
hero_sections  •  logos  •  footers  •  footer_links
```

---

## 🎨 Design System

The admin panel follows a custom dark-first design system:

| Token | Dark | Light |
|---|---|---|
| `--bg-primary` | `#0a0e27` | `#f5f7fa` |
| `--bg-card` | `#1a1f3a` | `#ffffff` |
| `--text-primary` | `#ffffff` | `#1a1f3a` |
| `--border-color` | `#2d3454` | `#e2e8f0` |
| **Accent** | `#e91e63` | `#e91e63` |

The client app uses a warm gold (`#FDB813`) and deep navy (`#1a1a2e`) palette with full RTL Arabic support.

---

## 📱 Responsive Design

Both applications are fully responsive across all breakpoints:

| Breakpoint | Width | Target |
|---|---|---|
| Mobile | < 576px | Phones |
| Tablet | 576px – 992px | Tablets |
| Desktop | > 992px | Laptops & monitors |

---

## 👤 Author

**Mohammed** — Full Stack Developer at K-Apps, Kuwait

Built with Laravel, React, and dedication for **Rand Jarar** — Certified Fitness Coach.

---

<p align="center">
  <sub>© 2025 RanLogic. All rights reserved.</sub>
</p>