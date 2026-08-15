# Nexora Rwanda 🇷🇼

> **Nexora** — Rwanda's premier multi-vendor e-commerce marketplace. Any individual or business can open a shop, list unlimited products, and sell directly to buyers across Rwanda. Pay with **MTN Mobile Money**, **Airtel Money**, Card, or Cash on Delivery.

[![Live Demo](https://img.shields.io/badge/demo-nexora.rw-0E8F5B?style=for-the-badge&logo=vercel)](https://nexora.rw)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://react.dev/)

---

## ✨ Features

- 🏪 **Multi-Vendor Marketplace** — 50+ Rwandan merchant shops, 2,050+ product listings (seed data)
- 💚 **MTN Mobile Money & Airtel Money** — `*182#` USSD push simulation with PIN confirmation
- 📍 **Rwanda 3-Tier Location** — District → Sector → Cell address selection
- 🔐 **Resend API Email Verification** — 6-digit OTP code sent to real email addresses
- 🤖 **Anti-Bot Captcha** — Human verification on login and registration
- 📋 **Terms & Conditions** — Mandatory Rwanda e-commerce compliance agreement
- 🌍 **Trilingual** — Kinyarwanda (`rw`), English (`en`), French (`fr`)
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
# Edit .env and add your VITE_RESEND_API_KEY (get yours at https://resend.com)

# Start the mock REST API + Swagger UI server
node server.js

# In a new terminal — start the frontend dev server
npm run dev
```

- **Frontend**: http://localhost:3000
- **Swagger UI API Docs**: http://localhost:3001/api/docs

> **Note:** This repository is the **frontend product build** with a lightweight Node.js mock API server (`server.js`) that serves seeded catalog data and proxies the Resend email API. No database is required to run it.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| State | Zustand |
| Mock API | Node.js (`server.js`) + OpenAPI 3.0 (Swagger UI) |
| Email | Resend API |
| Data Model | Prisma schema (`prisma/schema.prisma`) |
| Production Backend | NestJS module stubs (`backend/`) |
| Deployment | Docker + Docker Compose |

Planned production infrastructure (defined in `docker-compose.yml` & `.env.example`, not required for the demo): PostgreSQL, Redis, Meilisearch.

---

## 📡 REST API Endpoints (Mock Server)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register buyer or seller account |
| `POST` | `/api/v1/auth/login` | Login + JWT token issuance |
| `GET` | `/api/v1/users` | List all platform users (Admin) |
| `GET` | `/api/v1/products` | 2,050+ products with pagination & filters |
| `POST` | `/api/v1/products` | Add new product listing (Seller) |
| `GET` | `/api/v1/shops` | 50+ Rwandan merchant shops |
| `GET/POST` | `/api/v1/categories` | Category taxonomy (RW/EN/FR) |
| `GET/POST` | `/api/v1/orders` | List / create orders + MTN MoMo trigger |
| `GET/POST` | `/api/v1/payouts` | Vendor payout requests |
| `GET` | `/api/v1/disputes` | Customer disputes (Admin) |
| `GET` | `/api/v1/hero-slides` | Homepage hero slides |
| `POST` | `/api/send-otp` | Resend API OTP email dispatch |

---

## 📁 Project Structure

```
nexoria/
├── public/
│   ├── favicon.svg          # Geometric N app icon
│   └── logo.svg             # Full horizontal wordmark
├── prisma/
│   └── schema.prisma        # PostgreSQL Prisma schema (production model)
├── backend/
│   └── src/modules/auth/    # NestJS Auth design (bcrypt, JWT, DTOs)
├── server.js                # Mock REST API + Resend proxy + Swagger UI
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

## 🔐 Security Notes

- The Resend API key is read from `.env` (`VITE_RESEND_API_KEY`), with a fallback bundled in `server.js` for the demo. `.env` is gitignored.
- The demo's auth flow runs entirely in-browser against the mock API and does **not** persist credentials.
- The `backend/` folder documents the **production security architecture** (Bcrypt 12-round hashing, JWT + HttpOnly cookies, Cloudflare Turnstile, rate limiting) as a blueprint for the full-stack rollout — see [`backend/README.md`](backend/README.md).

---

## 📄 License

MIT © 2026 Nexora Rwanda Inc.
