# Marketplace Backend — Agent Notes

This file documents the backend project context, design decisions, architecture, APIs, development conventions, and information the agent will need to continue work later. It is derived from the product TRD: [TRD.txt](TRD.txt#L1-L400).

**Project**: Marketplace Universidad de La Sabana (backend)

**Purpose**: Provide a robust, maintainable Node.js + Express backend powering an institutional marketplace for students to publish, buy, and manage products.

----

**High-Level Goals**
- **Facilitate P2P marketplace**: simple CRUD for products, purchase flow, messaging, reviews, notifications.
- **Institutional trust**: email-domain registration (institutional), roles and moderation by admins.
- **MVP focus**: prioritize auth, products, orders, reviews, basic chat, in-app notifications.

----

**Roles (domain)**
- **Buyer**: browse, purchase, message sellers, leave reviews.
- **Seller**: all buyer capabilities + publish/manage inventory.
- **Administrator**: moderate content, suspend users, view basic metrics.

----

**Functional Scope (backend responsibilities)**
- User management: registration, login, profile, role flags (seller/admin).
- Product management: create/read/update/delete, images reference (storage off-server or local uploads), filters, pagination, text search.
- Orders: cart simulation, create order, statuses (pending, confirmed, delivered), order history.
- Reviews: rating (1-5) + comment; only after purchase constraint enforced by API.
- Chat/Conversations: conversations bound to product + messages; WebSocket optional fallback to polling.
- Notifications: in-app notifications (stored in DB), optional email integration.
- Admin endpoints: moderation actions and reports management.

----

**Suggested Tech Stack & Rationale**
- Runtime: Node.js (current repo uses Express) — fast onboarding, matches frontend stack.
- Web framework: Express — existing project skeleton uses `app.js` and routes (see [app.js](app.js)).
- Auth: JWT + refresh tokens (stateless API) or session-based if simpler for MVP. Use HTTPS in deployment.
- DB: PostgreSQL (relational) recommended for structured data (orders, reviews) and transactions; MongoDB acceptable for faster iteration. Choose based on team familiarity.
- Realtime: Socket.io (WebSocket fallback) for chat + notifications; fall back to polling if hosting restrictions exist.
- File storage: S3 or similar for images. For MVP local uploads + static serving are acceptable.

----

**Data Model (high level entities)**
- User { id, email, name, career, avatar_url, role_flags, reputation, created_at }
- Product { id, owner_id, title, description, price_cents, currency, category, images[], condition, status, created_at }
- Order { id, buyer_id, total_cents, status, created_at }
- OrderItem { id, order_id, product_id, qty, unit_price_cents }
- Review { id, order_id, product_id, reviewer_id, rating, comment, created_at }
- Conversation { id, product_id, participant_ids[], last_message_at }
- Message { id, conversation_id, sender_id, body, created_at }
- Notification { id, user_id, type, payload, read, created_at }
- Report { id, reporter_id, target_type, target_id, reason, status }

Notes: use integer PKs or UUIDs; use indexes on product title, category, owner_id, and conversations last_message_at for queries.

----

**API Design (recommended endpoints)**
All endpoints return JSON and use standard HTTP codes.

- Auth
  - POST /api/auth/register — register (institutional email check)
  - POST /api/auth/login — login, returns access + refresh tokens
  - POST /api/auth/refresh — exchange refresh token
  - POST /api/auth/logout — revoke refresh token

- Users
  - GET /api/users/:id — public profile (include average rating)
  - PUT /api/users/:id — update profile (auth required)

- Products
  - GET /api/products — list + filters + pagination
  - GET /api/products/:id — product detail
  - POST /api/products — create product (auth seller)
  - PUT /api/products/:id — update product (owner or admin)
  - DELETE /api/products/:id — delete (owner or admin)

- Orders
  # Marketplace Backend — Agent Notes

  Last updated: 2026-05-07

  This document is the single-source agent-facing summary of the backend: goals, constraints, architecture, data models, APIs, operational notes, and short-term priorities. Keep this file updated as decisions change.

  **Project**: Marketplace (University) — backend
  **Purpose**: Provide a maintainable, testable Node.js + Express API that supports product listing, buying, messaging, reviews, and admin moderation for an institutional marketplace.

  ----

  ## 1. Quick facts
  - Language / runtime: Node.js (Express)
  - Repo entry: [app.js](app.js#L1)
  - DB (recommended): PostgreSQL; alternative: MongoDB for faster prototyping
  - Auth: JWT (access + refresh tokens)
  - Realtime: Socket.io (WebSocket with fallback to polling)
  - Image storage: Local for MVP, migrate to S3 for production

  ----

  ## 2. Goals & constraints
  - Primary goals: security (institutional registration), simple UX for students, reliable order/review lifecycle, in-app communication.
  - MVP scope: auth, product CRUD, order creation, reviews, conversations/messages, notifications, admin moderation endpoints.
  - Non-goals (MVP): payments integration, advanced recommendation engine, full analytics stack.

  ----

  ## 3. Folder & file map (important locations)
  - [app.js](app.js#L1) — main Express app
  - [bin/www](bin/www#L1) — server start
  - [dbManager.js](dbManager.js#L1) — DB connection helpers
  - [routes/](routes/README.md) — resource routes (see files inside `routes/`)
  - [auth/](auth/) — auth handlers (`login.js`, `register.js`)
  - [middleware/](middleware/) — auth & validation middleware
  - [public/](public/) — static assets and local image uploads

  ----

  ## 4. Environment variables (required / recommended)
  - `PORT` — server port (default 3000)
  - `NODE_ENV` — development|production
  - `DATABASE_URL` — Postgres connection string (or Mongo URI)
  - `JWT_SECRET` — access token signing secret
  - `JWT_REFRESH_SECRET` — refresh token signing secret
  - `IMAGE_UPLOAD_PATH` — local path for uploaded images
  - `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` — optional email

  ----

  ## 5. Data model (concise)
  - User: id, email, name, password_hash, roles (buyer|seller|admin), avatar_url, created_at
  - Product: id, seller_id, title, description, price_cents, currency, category, images[], condition, status, created_at
  - Order: id, buyer_id, total_cents, status (pending/confirmed/shipped/delivered), created_at
  - OrderItem: id, order_id, product_id, qty, unit_price_cents
  - Review: id, product_id, reviewer_id, rating, comment, created_at
  - Conversation: id, product_id, participants[], last_message_at
  - Message: id, conversation_id, sender_id, body, created_at
  - Notification: id, user_id, type, payload, read, created_at

  Use integer PKs or UUIDs consistently. Add indexes on `products(title)`, `products(category)`, `products(seller_id)`, and `conversations(last_message_at)`.

  ----

  ## 6. API surface (summary)
  All endpoints return JSON; protect with auth middleware where noted.

  - Auth
    - POST /auth/register — register (institutional email check)
    - POST /auth/login — login (returns access + refresh tokens)
    - POST /auth/refresh — refresh access token
    - POST /auth/logout — revoke refresh token

  - Users
    - GET /users/:id — public profile
    - PUT /users/:id — update profile (auth)

  - Products
    - GET /products — list + filters + pagination
    - GET /products/:id — detail
    - POST /products — create (seller)
    - PUT /products/:id — update (owner/admin)
    - DELETE /products/:id — delete (owner/admin)
    - GET /products/search?q=... — text search

  - Orders
    - POST /orders — create order (simulate payment)
    - GET /orders/:id — detail (buyer/seller)
    - GET /orders — user's orders
    - PATCH /orders/:id/status — update status (seller/admin)

  - Reviews
    - POST /products/:id/reviews — create (validate purchase)
    - GET /products/:id/reviews — list

  - Conversations / Messages
    - GET /conversations — user's conversations
    - POST /conversations — open conversation
    - GET /conversations/:id/messages — fetch messages
    - POST /conversations/:id/messages — send message

  - Notifications
    - GET /notifications — list
    - POST /notifications/mark-read — mark read

  - Admin
    - GET /admin/stats — metrics
    - POST /admin/reports/:id/action — moderate content

  ----

  ## 7. Auth & security recommendations
  - JWT short-lived access tokens (eg. 15m) + refresh tokens stored hashed server-side.
  - Validate institutional email domain(s) during registration (decide canonical domain).
  - Hash passwords with bcrypt (salted). Rate-limit auth endpoints. Validate inputs with `Joi` or `express-validator`.
  - Sanitize and validate file uploads (type, size). Use signed URLs for S3 in prod.

  ----

  ## 8. Realtime & notifications
  - Socket.io rooms: `user:<id>` and `conversation:<id>`. Emit `new_message`, `order_updated`, `new_review` events.
  - Provide REST fallbacks (polling) for environments without WebSocket support.

  ----

  ## 9. Storage & backups
  - Images: local `public/images/` during development. Plan migration to S3 with environment config.
  - DB backups: schedule daily backups for production DB. Use managed DB snapshots where possible.

  ----

  ## 10. Development & testing
  - Install: `npm install`
  - Run dev: `npm run dev` or `node ./bin/www`
  - Lint: add `eslint` and `prettier`; consider `husky` + `lint-staged` hooks.
  - Tests: unit tests (Jest/Mocha) + integration tests (Supertest) for auth, products, orders.

  ----

  ## 11. Deployment notes
  - Containerize with Docker; keep app stateless. Use `DATABASE_URL` and secrets from environment.
  - In production use HTTPS and rotate JWT secrets periodically. Use a managed Postgres + S3.

  ----

  ## 12. Short-term roadmap (next tasks)
  1. Confirm DB choice and add migration tool (knex/TypeORM/Sequelize).
  2. Implement auth: registration + login + refresh flow + tests.
  3. Implement products CRUD with pagination and basic image upload.
  4. Implement orders + review constraints (only buyers who purchased can review).
  5. Add notifications model + REST endpoints and basic Socket.io integration.

  ----

  ## 13. Decisions to make / Questions
  - Which DB to use for the project (Postgres recommended)?
  - Institutional email domain(s) to enforce at register?
  - Image storage: keep local or provide S3 credentials now?

  ----

  If you want, I can:
  - scaffold route handlers and services,
  - produce a minimal DB schema + migration file,
  - or generate an OpenAPI spec for the routes above.

  Keep this file current; reference it when making architectural decisions.
- Notifications

