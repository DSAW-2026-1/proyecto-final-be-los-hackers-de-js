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
  - POST /api/admin/dashboard — site activity summary (admin-only)
  - DELETE /api/admin/products/:productID — soft-delete product (admin-only)
  - PATCH /api/admin/users/:UID/suspend — suspend a user and soft-delete their products (admin-only)
  - GET /admin/stats — metrics (future)
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
2. Implement orders + review constraints (only buyers who purchased can review).
3. Add notifications model + REST endpoints and basic Socket.io integration.

----

## 13. Changelog (recent changes)
 - 2026-05-07: Implemented `POST /api/admin/dashboard` endpoint (admin-only). See `routes/admin/dashboard.js`.
 - 2026-05-07: Added `DbManager` helpers: `countUsers()`, `countActiveSellers()`, `countProducts()`, `countOrders()` in `dbManager.js`.
 - 2026-05-07: Registered `/api/admin/dashboard` in `app.js` and protected it with `tokenValidator` + `adminValidator` middleware.
 - 2026-05-07: Implemented `DELETE /api/admin/products/:productID` to soft-delete products; added `findProductRawByID()` helper and mounted admin products router under `/api/admin/products`.
 - 2026-05-07: Implemented `PATCH /api/admin/users/:UID/suspend` to suspend users, store suspension reason, and soft-delete their products. Added `suspendUser()` helper in `dbManager.js`.

----

## 14. Decisions to make / Questions
- Which DB to use for the project (Postgres recommended)?
- Institutional email domain(s) to enforce at register?
- Image storage: keep local or provide S3 credentials now?

----

If you want, I can:
- scaffold route handlers and services,
- produce a minimal DB schema + migration file,
- or generate an OpenAPI spec for the routes above.

Keep this file current; reference it when making architectural decisions.


