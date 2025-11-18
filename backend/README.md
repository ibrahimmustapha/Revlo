# B2B Backend

Express + Prisma starter aligned with the provided trading schema.

## Setup
1. Install deps: `npm install`
2. Configure `.env` (copy from template values inside the repo).
3. Generate Prisma client & migrate: `npx prisma generate` then `npx prisma migrate dev --name init`
4. Run dev server: `npm run dev` (defaults to port 4000).

## Endpoints (high level)
- `GET /health` – readiness check.
- Auth: `POST /auth/register`, `POST /auth/login`
- Users: `GET /users/me`, `PATCH /users/me`
- KYC: `GET /kyc/me`, `POST /kyc/me`
- Payment Methods: `GET /payment-methods`, `POST /payment-methods`, `DELETE /payment-methods/:id`, `POST /payment-methods/:id/default`
- Offers: `GET /offers`, `GET /offers/status/:status`, `GET /offers/me`, `POST /offers`
- Trades: `GET /trades/me`, `POST /trades`, `POST /trades/:id/paid`, `POST /trades/:id/confirm`, `POST /trades/:id/release`, `POST /trades/:id/cancel`
- Disputes: `GET /disputes/me`, `POST /disputes`, `POST /disputes/:disputeId/evidence`
- Ratings: `GET /ratings/me`, `POST /ratings`

Auth endpoints return a JWT; pass it as `Authorization: Bearer <token>` on protected routes.

## Notes
- Schema uses PostgreSQL decimals for monetary amounts; adjust precision as needed.
- Routes are deliberately minimal; add validation/authorization rules per your business logic before production use.
