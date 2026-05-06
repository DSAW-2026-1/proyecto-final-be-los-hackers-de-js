# Marketplace Backend — Agent Notes

This file captures the current state, architecture decisions, key files, and next steps for the backend of the Marketplace project (implementation described in `TRD.txt`). It is intended to help future agent and developer conversations about design, running, and extension of the backend.

## 1. Summary
- Purpose: REST backend for a university marketplace (University of La Sabana). Implements user auth, product CRUD, sales flow, basic order handling, reviews, and simple in-app notifications.
- Tech: Node.js + Express, MongoDB (mongodb driver), JWT auth, optional WebSocket upgrade later.

## 2. Current repository state (observed)
- Entry point: `bin/www` (script `start` runs it via `node ./bin/www`).
- App definition: `app.js` wires Express middleware, routes, and error handlers. Seller-related routes are now mounted under `/api/seller` via `routes/seller/seller.js`.
- Auth: JWT-based (`jsonwebtoken`) and password hashing (`bcrypt`).
- DB: `mongodb` driver is present; there is a `dbManager.js` file in root (used to centralize DB connection logic). The `dbManager` maintains `saleData` and `orders` associations used by the new seller endpoint.
- Packages: `express`, `cors`, `dotenv`, `morgan`, `express-validator`, `cookie-parser`, `jsonwebtoken`, `mongodb`, `bcrypt`, `cors` (see `package.json`).

## 3. Design choices & rationale
- API style: REST endpoints exposed under `/api/*`. This aligns with the TRD requirement for a separated frontend/backend.
- Authentication: JWT tokens (stateless), used with middleware validators in `middleware/auth/` (user/seller/admin/token validators). This supports role checks without server-side sessions.
- Roles model: Users, Sellers, Admins — implemented as middleware separate validators. The TRD suggests role inheritance (seller extends user); code treats roles via validators and route protection.
- Data store: MongoDB (driver present). Quick development choice; scalable to replica sets, and compatible with the flexible product schema (images, metadata).
- Chat/Realtime: Not implemented yet. TRD suggests WebSockets/Socket.io—this repo currently focuses on REST; add WebSockets later as a separate service or server-side addition.

## 4. Important files and folders
- `app.js` — Express app and route mounting. The seller routes are mounted at `/api/seller` via `routes/seller/seller.js`.
- `bin/www` — server bootstrap (start script target).
- `dbManager.js` — DB connection management (centralized place to handle MongoDB client and collections). Handles `orders` collection and user `saleData`/`orders` arrays.
- `routes/` — Routes grouped by domain: `auth/`, `products/`, `sales/`, `orders/`, `users/`, `seller/`, `test.js`.
- `routes/seller/seller.js` — consolidates seller subroutes (`/register`, `/shipping/status`) and applies token + seller middleware to protected subpaths.
- `routes/seller/shipping/status.js` — new endpoint to return paginated shipping/order status for a seller.
- `middleware/auth/` — `tokenValidator.js`, `userValidator.js`, `sellerValidator.js`, `adminValidator.js` (enforce JWT and role checks).
- `errorHandlers/jsonParseFailure.js` — JSON parse error handling middleware.

## 5. API surface (high level)
Note: these are the mounted route prefixes and expected responsibilities found in `app.js`.
- `POST /api/auth/login` — login (JWT issuance).
- `POST /api/auth/register` — user registration.
- `POST /api/admin/login` — admin login.
- `POST /api/seller/register` — register as seller (mounted under `/api/seller/register`).
- `GET /api/seller/shipping/status?page=X` — (new) seller-only endpoint that returns paginated shipping/order status for the seller's sales (12 items per page).
- `GET/POST/PUT/DELETE /api/products` — product CRUD and search endpoints (see `routes/products/*`).
- `POST /api/sales` — checkout/sale creation.
- `POST /api/shipping` — order/shipping handling under `orders` routes.
- `GET/POST/PUT /api/users` — user profile, find and edit operations.

For exact route details, inspect route files under `routes/` (they follow a simple Express router pattern).

## 6. Security considerations
- JWT secrets should be provided via environment variables (`.env` + `dotenv` is present). Do not commit secrets.
- Passwords hashed with `bcrypt` — ensure salt rounds are acceptable for production.
- Validate all user inputs with `express-validator` (already included). Ensure each route validates and sanitizes incoming data.
- CORS: default is permissive (`*`) unless `CORS_ORIGIN` env var is set; tighten in staging/production.

## 7. Running locally
1. Copy example env or create `.env` with at minimum:
   - `PORT` — port for server (optional, default in `bin/www`).
   - `MONGODB_URI` — connection string to MongoDB.
   - `JWT_SECRET` — secret for signing tokens.
   - `CORS_ORIGIN` — optional, recommended for local frontend.
2. Install dependencies: `npm install`.
3. Start server: `npm start` (runs `node ./bin/www`).

## 8. Testing and dev notes
- There are no automated tests present in the repo root. Add unit tests for route handlers and integration tests for the DB flows.
- Consider adding `npm run dev` (with `nodemon`) for faster local iteration.

## 9. Short-term tasks (recommended MVP scope)
1. Confirm and centralize DB connection in `dbManager.js` and ensure it is used by all repositories.
2. Add integration tests for auth flows (register/login/token validation).
3. Add tests for the new seller shipping status endpoint (`GET /api/seller/shipping/status`) including pagination and error cases.
4. Implement basic in-app notifications (DB-backed) and simple polling endpoints.
5. Harden input validation across routes using `express-validator`.
6. Add README with run instructions and environment examples.

## 10. Long-term / optional
- Add WebSocket service (Socket.io) for realtime chat and notifications. Prefer a separate process or careful integration into the `bin/www` server.
- Add file/image storage (S3 or similar) and CDN for product images; keep thumbnails and optimized serving in mind.
- Add analytics and admin dashboard metrics (simple aggregation endpoints or a small admin UI).

## 11. Where to look next
- `app.js` — to see currently wired routes and middleware (seller mounted at `/api/seller`).
- `routes/seller/seller.js` — to inspect how seller subroutes are consolidated and middleware applied.
- `routes/seller/shipping/status.js` — to review the implementation of the new seller shipping/status endpoint.
- `routes/` — to inspect route-level validations and DB usage for other domains.
- `dbManager.js` — to review connection lifetime and client usage; `getOrders` and `addOrder` are important for order/sale flows.

---
If you want, I can now:
- run `npm install` and start the server locally, or
- add a `README.md` with run instructions, or
- open and summarize specific route files (e.g., product endpoints) in detail.
