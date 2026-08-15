# Nexora Production Backend & Security Architecture Guide

This document explains the production security safeguards, authentication pipeline, and backend modular monolith architecture implemented for **Nexora**.

---

## 1. Security Architecture Overview

```
 ┌────────────────┐         HTTPS / WAF         ┌────────────────┐
 │ Client Browser │ ──────────────────────────> │ Cloudflare WAF │
 └────────────────┘                             └───────┬────────┘
                                                        │
                                                        ▼
                                                ┌────────────────┐
                                                │ Rate-Limiter   │ (NestJS Throttler + Redis)
                                                │ 5 req / 60 sec │
                                                └───────┬────────┘
                                                        │
                                                        ▼
                                                ┌────────────────┐
                                                │ Helmet + CORS  │ (Strict Headers & Origins)
                                                └───────┬────────┘
                                                        │
                                                        ▼
                                                ┌────────────────┐
                                                │ AuthController │ (Zod / Class-Validator DTOs)
                                                └───────┬────────┘
                                                        │
                                                        ▼
                                                ┌────────────────┐
                                                │  AuthService   │
                                                │ (Bcrypt 12-rnd)│
                                                └───────┬────────┘
                                                        │
                                   ┌────────────────────┴────────────────────┐
                                   ▼                                         ▼
                        ┌────────────────────┐                    ┌────────────────────┐
                        │ PostgreSQL Database│                    │ Redis Cache Store  │
                        │ (Prisma Schema)    │                    │ (Session & Escrow) │
                        └────────────────────┘                    └────────────────────┘
```

---

## 2. Key Security Safeguards

### A. Password Security (Bcrypt Hashing)
- **Zero Plain-Text Storage**: Passwords are never stored in plain text or simple MD5/SHA256 hashes.
- **Salt Rounds**: Uses `bcrypt` with **12 salt rounds**, rendering offline GPU dictionary attacks computationally infeasible.
- **Constant-Time Verification**: Password verification uses `bcrypt.compare()` to prevent timing side-channel attacks.

### B. Two-Factor / Email OTP Verification (Resend API)
- **Resend API Integration**: Registration generates a 6-digit random code (`Math.floor(100000 + Math.random() * 900000)`) sent via Resend (`https://api.resend.com/emails`).
- **Code Expiry**: OTP verification codes automatically expire after 10 minutes in PostgreSQL/Redis.

### C. JWT Token Security & HttpOnly Cookies
- **Dual Token Strategy**:
  - **Short-Lived Access Token**: Signed JWT valid for 15 minutes, stored in memory.
  - **Long-Lived Refresh Token**: Signed JWT valid for 7 days, stored exclusively in an **`HttpOnly`**, **`Secure`**, **`SameSite=Strict`** cookie.
- **Anti-XSS Protection**: JavaScript running in the browser cannot read the `nexora_refresh_token` cookie, neutralizing Cross-Site Scripting token theft.
- **Anti-CSRF Protection**: `SameSite=Strict` prevents Cross-Site Request Forgery attacks.

### D. Bot Protection & Human Verification
- **Cloudflare Turnstile Captcha**: Both Login and Registration endpoints require a `captchaToken` verified against Cloudflare's anti-bot API before processing credentials.
- **Rate Limiting (NestJS Throttler + Redis)**: Limits login attempts to a maximum of **5 failed requests per 60 seconds** per IP address. Exceeding the threshold triggers a 15-minute IP lock.

### E. Input Sanitization & SQL Injection Defense
- **Class-Validator DTOs**: Strict type checking and validation rules (e.g. valid email syntax, mandatory password complexity, Rwanda phone number format `+250 7...`).
- **Prisma ORM Parameterization**: All SQL queries use prepared statements, eliminating SQL Injection vulnerabilities.

---

## 3. Directory Layout

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts    # API endpoints & cookie setters
│   │   │   ├── auth.service.ts       # Bcrypt hashing & JWT signing
│   │   │   └── dtos/
│   │   │       ├── login.dto.ts      # Login payload validation
│   │   │       └── register.dto.ts   # Registration validation
│   └── services/
│       └── resendService.ts          # Resend API email verification
└── README.md
```
