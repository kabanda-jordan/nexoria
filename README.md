# Nexora Rwanda 🇷🇼

> **Nexora** — Rwanda's premier multi-vendor e-commerce marketplace. Any individual or business can open a shop, list unlimited products, and sell directly to buyers across Rwanda. Pay with **MTN Mobile Money**, **Airtel Money**, Card, or Cash on Delivery.

[![Live Demo](https://img.shields.io/badge/demo-nexora.rw-0E8F5B?style=for-the-badge&logo=vercel)](https://nexora.rw)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev/)

---

## ✨ Features

- 🏪 **Multi-Vendor Marketplace** — 50+ Rwandan merchant shops, 2,000+ product listings
- 💚 **MTN Mobile Money & Airtel Money** — *182# USSD push simulation with PIN confirmation
- 📍 **Rwanda 3-Tier Location** — District → Sector → Cell address selection
- 🔐 **Resend API Email Verification** — 6-digit OTP code sent to real email addresses
- 🤖 **Anti-Bot Captcha** — Human verification on login and registration
- 📋 **Terms & Conditions** — Mandatory Rwanda e-commerce compliance agreement
- 🌍 **Trilingual** — Kinyarwanda (`rw`), English (`en`), French (`fr`)
- 🛡️ **Bcrypt 12-Round Hashing** — Zero plain-text password storage
- 🔑 **JWT + HttpOnly Cookies** — Access Token (15 min) + Refresh Token (7 days) anti-XSS/CSRF
- 📊 **Swagger UI API Docs** — Interactive REST API testing at `/api/docs`
- 👤 Buyer, Seller, and Admin dashboards

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/kabanda-jordan/nexoria.git
cd nexoria

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env and add your VITE_RESEND_API_KEY

# Start the backend API + Swagger UI server
node server.js

# In a new terminal — start the frontend dev server
npm run dev
```

- **Frontend**: http://localhost:3000
- **Swagger UI API Docs**: http://localhost:3001/api/docs

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| State | Zustand |
| Database | PostgreSQL + Prisma ORM |
| Search | Meilisearch |
| Cache / Queue | Redis + BullMQ |
| Email | Resend API |
| Backend | Node.js (server.js) → NestJS (production) |
| API Docs | Swagger UI + OpenAPI 3.0 |
| Deployment | Docker + Docker Compose |

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register buyer or seller account |
| `POST` | `/api/v1/auth/login` | Login + JWT token issuance |
| `GET` | `/api/v1/users` | List all platform users (Admin) |
| `GET` | `/api/v1/products` | 2,050+ products with pagination & filters |
| `POST` | `/api/v1/products` | Add new product listing (Seller) |
| `GET` | `/api/v1/shops` | 50+ Rwandan merchant shops |
| `GET` | `/api/v1/categories` | Category taxonomy (RW/EN/FR) |
| `GET` | `/api/v1/orders` | List orders |
| `POST` | `/api/v1/orders` | Create order + MTN MoMo trigger |
| `GET/POST` | `/api/v1/payouts` | Vendor payout requests |
| `GET` | `/api/v1/disputes` | Customer disputes (Admin) |
| `POST` | `/api/send-otp` | Resend API OTP email dispatch |

---

## 📁 Project Structure

```
nexoria/
├── public/
│   ├── favicon.svg          # Geometric N app icon
│   └── logo.svg             # Full horizontal wordmark
├── prisma/
│   └── schema.prisma        # PostgreSQL Prisma schema
├── backend/
│   └── src/modules/auth/    # NestJS Auth (bcrypt, JWT, DTOs)
├── server.js                # Node.js REST API + Swagger UI proxy
├── src/
│   ├── components/
│   │   ├── auth/            # AuthModal, CaptchaBox, TermsModal
│   │   ├── layout/          # Header, HeroCarousel, Footer
│   │   ├── buyer/           # ProductGrid, CartDrawer, Checkout, MoMo
│   │   ├── seller/          # SellerDashboard, ShopStorefront
│   │   └── admin/           # AdminDashboard
│   ├── store/               # Zustand state stores
│   ├── services/            # Resend API email service
│   ├── data/                # Seed engine + Rwanda locations
│   └── i18n/                # RW / EN / FR translations
├── docker-compose.yml
└── Dockerfile
```

---

## 🔐 Security Architecture

- **Bcrypt 12-Round** password hashing — zero plain-text storage
- **JWT Access Token** (15 min) + **HttpOnly SameSite=Strict Refresh Token** (7 days)
- **Rate limiting** — 5 login attempts per 60 seconds per IP
- **Cloudflare Turnstile** anti-bot captcha on all auth endpoints
- **Prisma prepared statements** — SQL Injection prevention
- **Class-Validator DTOs** — Rwanda phone regex, password complexity enforcement

---

## 📄 License

MIT © 2026 Nexora Rwanda Inc.
