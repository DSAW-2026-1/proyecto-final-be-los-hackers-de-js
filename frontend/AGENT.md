# Unisabana Marketplace - Project Snapshot

**Date:** 2026-04-25
**Language:** Spanish (Colombia)
**Context:** Institutional marketplace for Universidad de La Sabana.

## 🎯 New Objective
Move the repository from a high-fidelity frontend prototype to a production-ready frontend that implements the requirements in `TRD.txt`. This pivot changes priorities from purely visual prototypes to a delivery-focused implementation: replace mock data with real APIs, add end-to-end data flows, secure authentication, automated tests, and CI/CD for builds and deployments.

## 🚀 Current State (prototype)
The codebase contains a complete design-focused prototype built with React, Vite, and Tailwind CSS. Components demonstrate full user flows and the intended UX, but many parts still rely on `MOCK_DATA` and local client-side logic rather than real backend integrations.

### 🎨 Branding & Design Choices
- **Official Logos:** Integrated from `/res/images/`:
  - `unisabana_logo_blue.png` (Navigation/Main)
  - `unisabana_logo_white.png` (Footer)
  - `unisabana_logo_with_text_blue.png` (Auth Screens)
- **Institutional Context:**
  - **Career Name:** "Ingeniería Informática" (Exclusively used instead of Sistemas).
  - **Terminology:** "Rechazar" is used instead of "Desestimar" for administrative moderation.
  - **Prices:** Formatted using `toLocaleString('es-CO')` with COP currency context.
- **UI Architecture:**
  - Built with **shadcn/ui** components (Radix primitives).
  - **Icons:** All icons from `lucide-react`.
  - **Animations:** `motion` (from `motion/react`) for page transitions and interactive elements.
  - **Containers:** Consistent use of `max-w-7xl mx-auto px-4` for desktop layouts.
  - **Search Grid:** 12 results per page, responsive pagination with `h-10` buttons and adaptive labels.

## 📁 Key Components & System Boundaries
- **Auth:** `Login.tsx`, `Register.tsx` (Supports institutional faculty/program selection).
- **Listing & Search:** 
  - `ProductSearch.tsx`: Refined filtering sidebar (categories, price range, condition, rating).
  - `ProductsGrid.tsx`: Displays featured items on the home page.
  - `ProductDetail.tsx`: Comprehensive view with "Reportar publicación" and "Chat with seller".
- **Management:**
  - `SellerDashboard.tsx`: Sales overview, active orders, and rating summary.
  - `AdminDashboard.tsx`: User management, product moderation, and global stats.
  - `EditProduct.tsx` / `CreateProduct.tsx`: Form-heavy views for managing listings.
  - `AdminReportView.tsx`: Verbose moderation interface ("Retirar Publicación" vs "Rechazar Reporte").
- **User Flow:**
  - `UserProfile.tsx`: Reputation and history.
  - `EditProfile.tsx`: Comprehensive settings (Avatar, Academic Info, Notification preferences).
  - `ShoppingCart.tsx`: Checkout flow prototype.
  - `Notifications.tsx`: Category-based system notifications.
  - `ChatInterface.tsx`: Internal messaging prototype.
- **Utilities:**
  - `NotFound.tsx`: Strategic 404 page re-routing back to home/categories.
  - `Navigation.tsx`: Centralized search bar and member navigation.

## 🛠️ Technical Implementation Notes
- **Linter Fixes:** `setState` in `useEffect` in `carousel.tsx` and some refresh warnings are known (minor).
- **Icons & Color Patterns:**
  - Primary: `#004b87` (Unisabana Blue)
  - Accent: Gold/Yellow markers.
  - Status: Green (Success/Safe), Red (Danger/Removal), Orange (Warning).
- **Environment:** Runs on port 3000. `npm run dev` is the main command.

## 🔁 Migration Checklist (Prototype → Production frontend)
- Replace `MOCK_DATA` with API clients and real backend endpoints. Create a small `src/services/apiClient.ts` to centralize requests and error handling.
- Define API contracts (openapi/spec or simple JSON fixtures) and wire data-loading hooks (e.g., `useProducts`, `useAuth`).
- Add authentication integration (institutional login/SSO or token-based auth) and persist session state securely.
- Introduce application state management for cross-cutting concerns (React Context, Zustand, or Redux toolkit) where needed.
- Implement form validation & submit flows for create/edit product, checkout, and profile edits using `react-hook-form` + schema validation (zod/yup).
- Replace prototype chat with a production-ready messaging integration (WebSocket or backend polling) or keep as deferred MVP with clear contract.
- Add automated tests: unit tests for core helpers, component tests for critical flows, and at least a couple of end-to-end tests for ProductSearch → Checkout.
- Accessibility & i18n: Ensure components meet WCAG basics, and make strings translatable (Spanish primary, `es-CO` locale).
- Performance & CI: Add build checks, linting, tests, and a CI pipeline that runs `npm run build`, `npm run test`, and `npm run lint`.
- Add environment handling and secrets via `.env` files and document required variables in `README.md`.
- Prepare production build and deployment guidelines (Dockerfile or static host instructions).

## 📍 Priority Areas (First Implementation Sprint)
1. `ProductSearch.tsx` — implement real filtering/pagination backed by API and server-side pagination where possible.
2. Authentication flows — institutional login, session handling, role-based UI (admin/seller/buyer).
3. Checkout & Orders — ensure end-to-end order creation, cart persistence, and basic payment/webhook placeholders.
4. Admin moderation workflows — wire `AdminReportView.tsx` to real moderation endpoints and audit logs.
5. Data migration plan — list of mock data that must be seeded or transformed when backend is available.

## 📍 Where to Inspect First (Implementation)
1. `TRD.txt` — confirm functional and non-functional requirements.
2. `ProductSearch.tsx` — complex UI logic to convert to API-backed flows.
3. `src/app` and `App.tsx` — understand routing, global providers, and where to plug services.
4. `Navigation.tsx` and `Footer.tsx` — branding and global UX elements.
5. `src/services` (create this folder) — planned home for API clients and data hooks.

## 🚧 Known Gaps & Next Steps
- **Search Branding**: Integrate institutional "safety tips" into the search sidebar or footer.
- **Help Center**: A dedicated "Guía de Seguridad en Campus" (Safety Guide) prototype is still pending.
- **Real Data Migration**: Components currently consume `MOCK_DATA` constants — plan and implement a migration strategy.

---
If you want, I can now open `ProductSearch.tsx` and outline the concrete changes needed to make it API-driven.

## 📍 Where to Look First (Resume Task)
1. **TRD Review:** Most functional gaps from `TRD.txt` are now converted to prototypes.
2. **Branding:** Verify `Navigation.tsx` and `Footer.tsx` for logo placements.
3. **Product Search:** `ProductSearch.tsx` contains the most complex UI logic (filtering + pagination).
4. **App Sequence:** `App.tsx` contains the visual flow of all prototypes for easy demonstration.

## 🚧 Known Gaps & Next Steps
- **Search Branding**: Integrate institutional "safety tips" into the search sidebar or footer.
- **Help Center**: A dedicated "Guía de Seguridad en Campus" (Safety Guide) prototype is still pending.
- **Real Data Migration**: Components currently consume `MOCK_DATA` constants.
