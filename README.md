# Task Manager — Upgraded

This is a security-hardened, feature-extended rewrite of the original repo.

## ⚠️ Before you do anything else
Your old repo has live MongoDB + JWT credentials committed to git history.
Rotate them in MongoDB Atlas and generate a new Firebase project/service
account for this version — do not reuse the leaked ones. See the note
Claude gave you in chat for the full list of what was exposed.

## What changed

**Backend** — rewritten in TypeScript:
- Auth now uses Firebase ID tokens (verified server-side with `firebase-admin`)
  instead of a hand-rolled JWT secret — one less secret to leak, and it reuses
  the auth you already have on the frontend.
- Every task/category route checks `req.user.email` against the resource's
  owner, so one user can no longer read/edit/delete another user's data.
- Request bodies are validated with `zod` (`src/schemas/`) instead of trusting
  whatever the client sends.
- Centralized error handling (`src/middleware/errorHandler.ts`) + `asyncHandler`
  wrapper — no more repeated try/catch in every controller.
- `helmet`, rate limiting, and a configurable CORS allow-list.
- New `Category` model, and a `/api/tasks/notifications` endpoint that
  returns overdue + due-within-24h tasks.
- Config loaded from `.env` and validated at startup (`src/config/env.ts`)
  instead of hardcoded strings.

**Frontend** — targeted fixes + new features on the existing React/Vite app:
- Fixed two case-sensitive import bugs (`layout/Root` vs `Layout/Root`,
  `Shared/Navbar` vs `Shared/NavBar`) that work on Windows/Mac but silently
  break the build on Linux/Vercel/Netlify.
- New `useAxiosSecure` hook attaches the Firebase ID token to every API call.
- API base URL now comes from `VITE_API_URL` instead of being hardcoded to
  `localhost:5000`.
- `TaskManager` now supports categories (create + assign) and a notification
  bell showing overdue/due-soon tasks.
- Removed the empty, unused `App.jsx` boilerplate (routing goes through
  `main.jsx` → `Routes.jsx` directly).

## Setup

### Backend
```bash
cd backend
cp .env.example .env   # fill in MONGO_URI + Firebase Admin service account
npm install
npm run dev
```

Get the Firebase Admin values from Firebase Console → Project Settings →
Service Accounts → Generate new private key.

### Frontend
```bash
cd frontend
cp .env.example .env   # fill in VITE_API_URL + your Firebase web config
npm install
npm run dev
```

## Not done yet (good next steps)
- Frontend isn't converted to TypeScript — the backend's schemas would map
  cleanly to shared types if you want to add that later.
- No automated tests yet (Vitest for frontend, Jest/Supertest for backend
  would be the natural additions).
- No CI pipeline (GitHub Actions running lint + build on PRs).
- Email/browser push notifications aren't wired up — the notifications
  endpoint currently only powers the in-app bell.
