 # Marketplace Backend — Agent Notes

 This file captures the current state, architecture decisions, key files, and next steps for the backend of the Marketplace project (implementation described in `TRD.txt`). It is intended to help future agent and developer conversations about design, running, and extension of the backend.

 ## 1. Summary
 - Purpose: REST backend for a university marketplace (University of La Sabana). Implements user auth, product CRUD, sales flow, order handling, reviews, in-app notifications, and seller management.
 - Tech: Node.js + Express, MongoDB (mongodb driver), JWT auth, optional WebSocket upgrade later.

 ## 2. Current repository state (observed)
 - Entry point: `bin/www` (script `start` runs it via `node ./bin/www`).
 - App definition: `app.js` wires Express middleware, routes, and error handlers. Seller-related routes are consolidated under `/api/seller` via `routes/seller/seller.js`.
 - Auth: JWT-based (`jsonwebtoken`) and password hashing (`bcrypt`).
 - DB: `mongodb` driver is present; `dbManager.js` centralizes DB access. It manages `orders` and user `saleData`/`orders` arrays and now exposes `findOrderByID(ID)` and `updateOrder(ID, newData)` helpers.
 - Packages: `express`, `cors`, `dotenv`, `morgan`, `express-validator`, `cookie-parser`, `jsonwebtoken`, `mongodb`, `bcrypt` (see `package.json`).

 ## 3. Design choices & rationale
 - API style: REST endpoints exposed under `/api/*` to keep frontend/backend separated.
 - Authentication: JWT tokens (stateless), enforced via middleware in `middleware/auth/`.
 - Roles model: Users, Sellers, Admins — role checks are enforced with middleware validators (`userValidator`, `sellerValidator`, etc.).
 - Data store: MongoDB (flexible schemas for products, orders, messages).
 - Realtime: Not implemented; Socket.io or a dedicated realtime service is a future addition.

 ## 4. Important files and folders
 - `app.js` — Express app and route mounting. Seller routes mounted at `/api/seller`.
 - `bin/www` — server bootstrap (start script target).
 - `dbManager.js` — DB connection and helpers (now includes `getOrders`, `findOrderByID`, `updateOrder`, `addOrder`).
 - `routes/` — Routes grouped by domain: `auth/`, `products/`, `sales/`, `orders/`, `users/`, `seller/`, `test.js`.
 - `routes/seller/seller.js` — consolidates seller subroutes (`/register`, `/shipping/*`) and applies token + seller middleware.
 - `routes/seller/shipping/status.js` — seller endpoint: paginated shipping/order status.
 - `routes/seller/shipping/update.js` — seller endpoint: PATCH to update a sale's shipping status (validates ownership and allowed statuses).
 - `routes/orders/getById.js` — returns an individual sale when requester is buyer or seller (mounted at `/api/shipping/:saleID`).
 - `routes/orders/getOwn.js` — returns buyer's own orders (paginated).
 - `middleware/auth/` — `tokenValidator.js`, `userValidator.js`, `sellerValidator.js`, `adminValidator.js`.
 - `errorHandlers/jsonParseFailure.js` — JSON parse error handling middleware.

 ## 5. API surface (high level)
 - `POST /api/auth/login` — login (JWT issuance).
 - `POST /api/auth/register` — user registration.
 - `POST /api/admin/login` — admin login.
 - `PATCH /api/seller/register` — promote user to seller (mounted under `/api/seller/register`).
 - `GET /api/seller/shipping/status?page=X` — seller-only: paginated list of seller's sales (12 items per page).
 - `PATCH /api/seller/shipping/:saleID` — seller-only: update a sale's shipping status. Valid statuses: `Pending`, `Confirmed`, `In transit`, `Delivered`, `Cancelled`.
 - `GET /api/shipping/:saleID` — authenticated user (buyer or seller): fetch single sale details.
 - `GET/POST/PUT/DELETE /api/products` — product CRUD and search endpoints.
 - `POST /api/sales` — checkout / create orders (adds orders and updates user `saleData`/`orders`).
 - `GET /api/shipping/status` (under `orders/getOwn.js`) — buyer's own orders listing.
 - `GET/POST/PUT /api/users` — user profile, find and edit operations.

 For exact route details, inspect route files under `routes/`.

 ## 6. Security considerations
 - JWT secret via environment variables. Do not commit secrets.
 - Passwords hashed with `bcrypt` — review salt rounds for production.
 - Apply `express-validator` on all inputs where missing.
 - CORS defaults to permissive; restrict `CORS_ORIGIN` in staging/production.

 ## 7. Running locally
 1. Create `.env` with at minimum: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN` (optional).
 2. Install: `npm install`.
 3. Start: `npm start`.

 ## 8. Testing and dev notes
 - No test framework yet; add unit and integration tests.
 - Add `npm run dev` (nodemon) to speed local iteration.

 ## 9. Short-term tasks (recommended MVP scope)
 1. Confirm `dbManager.js` helpers and centralize access patterns.
 2. Add integration tests for auth flows.
 3. Add tests for seller shipping endpoints (`GET /api/seller/shipping/status`, `PATCH /api/seller/shipping/:saleID`) covering pagination, validation, ownership (403), and error conditions.
 4. Add tests for `GET /api/shipping/:saleID` covering buyer/seller access, 404 and 403 cases.
 5. Harden input validation across routes using `express-validator`.
 6. Add README with run instructions and env examples.

 ## 10. Long-term / optional
 - Add WebSocket service (Socket.io) for realtime chat and notifications.
 - Add file/image storage (S3 or similar) and CDN for product images.
 - Add analytics and admin dashboard metrics.

 ## 11. Where to look next
 - `app.js` — wired routes and middleware.
 - `routes/seller/seller.js` — seller subroute consolidation.
 - `routes/seller/shipping/status.js` and `routes/seller/shipping/update.js` — seller endpoints.
 - `routes/orders/getById.js` and `routes/orders/getOwn.js` — order/sale lookup and listings.
 - `dbManager.js` — `getOrders`, `findOrderByID`, `addOrder`, `updateOrder`.

 ---
 If you want, I can now:
 - run the server and exercise the new endpoints, or
 - add automated tests for the new endpoints, or
 - add a concise `README.md` with run/test instructions.
