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

## 🐳 Docker (Containerized Demo)

The Docker image builds the frontend and serves **everything from one container** — the SPA, the mock REST API, and the Swagger UI — on a single port.

```bash
# Build the image
docker compose build

# Start the container (or `docker compose up --build` to build & run in one go)
docker compose up -d
```

- **App + Swagger UI**: http://localhost:8080 (host port `8080` → container port `3001`; change the left-hand number if you prefer another port)
- The Resend API key is injected at runtime from your local `.env` via `env_file:` — it is **not** baked into the image.
- `docker compose down` stops the container; `docker compose down -v` also removes it.

Run the raw image without Compose:

```bash
docker build -t nexora-rwanda-marketplace .
docker run -p 8080:3001 nexora-rwanda-marketplace
```

> Note: the default host port is `8080` so it doesn't collide with the Vite dev server on port `3000`. Change it freely, e.g. `-p 3000:3001` when the dev server is stopped.

---

## ☁️ Cloudflare Pages Deployment (Live Backend)

The production deployment runs on **Cloudflare Pages** with a real backend: catalog, shops, orders, payouts and disputes are stored in **Cloudflare D1** (SQLite at the edge) and exposed through **Pages Functions** (`functions/api/v1/*`). The frontend hydrate from `/api/v1/*` at boot and falls back to the bundled client-side seed data if the API is unreachable.

**Live at: https://nexorarwanda.pages.dev**

```bash
# One-command deploy (builds then uploads, promotes to the `main` branch)
npm run deploy:pages

# First time only: set the Resend key (used by the OTP function)
npx wrangler pages secret put RESEND_API_KEY --project-name nexorarwanda

# Re-seed the remote D1 database (generates seed.sql, then executes it)
npm run db:seed
# or step by step:
npm run seed:d1            # writes ./seed.sql
npx wrangler d1 execute nexora-db --remote --file=seed.sql
```

- The D1 binding (`DB`) is wired in `wrangler.toml` (`nexora-db` database). Schema + seed SQL is generated from `src/data/seed.ts` by `scripts/seed-d1.ts`.
- SPA fallback is handled by `public/_redirects` (`/* → /index.html`), so any route serves the app while `/api/*` runs the Functions.
- Set `RESEND_API_KEY` as a project secret in the dashboard (Settings → Environment variables) or via `wrangler pages secret put`.
- Requires `npx wrangler login` once (or `CLOUDFLARE_API_TOKEN`). Deploys must pass `--branch main` so the `*.pages.dev` alias updates (the project's production branch is `main`).

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| State | Zustand |
| Mock API | Node.js (`server.js`) + OpenAPI 3.0 (Swagger UI) |
| Production Backend | Cloudflare Pages Functions (`functions/api/v1/*`) |
| Production Database | Cloudflare D1 (SQLite at the edge, `nexora-db`) |
| Email | Resend API |
| Data Model | Prisma schema (`prisma/schema.prisma`) |
| NestJS blueprint | `backend/` (bcrypt, JWT, DTOs — production architecture) |
| Deployment | Cloudflare Pages + Docker Compose (demo container) |

Planned production infrastructure (defined in `docker-compose.yml` & `.env.example`, not required for the demo): PostgreSQL, Redis, Meilisearch.

---

## 📡 REST API Endpoints

Implemented twice with identical shapes — the lightweight mock (`server.js`, local dev) and the **live Pages Functions backed by D1** (`https://nexorarwanda.pages.dev/api/v1/*`).

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register buyer or seller account |
| `POST` | `/api/v1/auth/login` | Login + JWT token issuance |
| `GET` | `/api/v1/users` | List all platform users (Admin) |
| `GET` | `/api/v1/products` | 2,050+ products with pagination & filters |
| `POST` | `/api/v1/products` | Add new product listing (Seller) |
| `GET/PATCH/DELETE` | `/api/v1/products/:id` | Detail / edit / remove a product |
| `GET` | `/api/v1/shops` | 50+ Rwandan merchant shops |
| `GET/PATCH` | `/api/v1/shops/:id` | Shop detail / admin approval & suspension |
| `GET/POST` | `/api/v1/categories` | Category taxonomy (RW/EN/FR) |
| `GET/POST` | `/api/v1/orders` | List / create orders + MTN MoMo trigger |
| `GET/PATCH` | `/api/v1/orders/:id` | Order detail / status & payment updates |
| `GET/POST` | `/api/v1/payouts` | Vendor payout requests |
| `GET` | `/api/v1/disputes` | Customer disputes (Admin) |
| `PATCH` | `/api/v1/disputes/:id` | Resolve a dispute |
| `GET/POST` | `/api/v1/hero-slides` | Homepage hero slides |
| `PATCH` | `/api/v1/hero-slides/:id` | Edit a hero slide (CMS) |
| `POST` | `/api/send-otp` | Resend API OTP email dispatch |

---

## 📁 Project Structure

```
nexoria/
├── public/
│   ├── favicon.svg          # Geometric N app icon
│   ├── logo.svg             # Full horizontal wordmark
│   └── _redirects           # SPA fallback (/* → /index.html)
├── functions/
│   └── api/
│       ├── v1/              # Live D1-backed API (categories, hero-slides, shops, products, orders, payouts, disputes)
│       └── send-otp.ts      # Resend OTP email function
├── shared/
│   └── db.ts                # Shared Env types, JSON helpers, row → DTO mappers
├── scripts/
│   └── seed-d1.ts           # Generates ./seed.sql from src/data/seed.ts
├── wrangler.toml            # Pages + D1 (`nexora-db`) binding
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
│   ├── store/               # Zustand state stores (hydrate from /api/v1/*)
│   ├── services/
│   │   └── api.ts           # Typed API client for /api/v1/*
│   ├── data/                # Seed engine + Rwanda locations
│   └── i18n/                # RW / EN / FR translations
├── docker-compose.yml
└── Dockerfile
```

---

## 🔐 Security Notes

- The Resend API key is read from `.env` (`VITE_RESEND_API_KEY`), with a fallback bundled in `server.js` for the demo. `.env` is gitignored. On Cloudflare Pages the key lives only as the `RESEND_API_KEY` project secret, never in the client bundle.
- The demo's auth flow runs entirely in-browser against the mock API and does **not** persist credentials.
- The `backend/` folder documents the **production security architecture** (Bcrypt 12-round hashing, JWT + HttpOnly cookies, Cloudflare Turnstile, rate limiting) as a blueprint for the full-stack rollout — see [`backend/README.md`](backend/README.md).

---

## 📄 License

MIT © 2026 Nexora Rwanda Inc.
