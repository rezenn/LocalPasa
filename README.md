# LocalPasa

**A mobile cultural tourism platform for Nepal** — connecting foreign and domestic travellers with heritage sites, local artisans, cultural events, and authentic experiences, all in one location-aware, bilingual-friendly app.

> "Pasa" means *friend* in Newari — LocalPasa is designed to be a traveller's local friend: someone who knows the history behind a temple, can point you to a real artisan workshop instead of a tourist trap, and tells you what's happening this weekend.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Key Features](#2-key-features)
3. [Tech Stack](#3-tech-stack)
4. [Monorepo Structure](#4-monorepo-structure)
5. [Architecture](#5-architecture)
6. [Getting Started](#6-getting-started)
7. [Environment Variables](#7-environment-variables)
8. [Backend: API Reference](#8-backend-api-reference)
9. [Backend: Data Models](#9-backend-data-models)
10. [Frontend: Screens & Navigation](#10-frontend-screens--navigation)
11. [Frontend: Design System](#11-frontend-design-system)
12. [Frontend: State Management](#12-frontend-state-management)
13. [Database Seeding](#13-database-seeding)
14. [Development Workflow & Scripts](#14-development-workflow--scripts)
15. [Security](#15-security)
16. [Known Limitations & Roadmap](#16-known-limitations--roadmap)
17. [Contributing](#17-contributing)

---

## 1. Overview

Nepal's tourism ecosystem is rich in heritage — UNESCO World Heritage monument zones, living Newar craft traditions, temple architecture, and a packed festival calendar — but that richness is scattered across brochure websites, tour-operator marketing pages, and generic global travel apps that treat Nepal as just another set of pins on a map. LocalPasa exists to fix that: a single mobile app where a user can **discover** a heritage site or artisan near them, **understand** its history and cultural significance in context, and **book** an authentic guided or hands-on experience — without wading through fragmented, marketing-first content.

The project targets **two audiences at once**:
- **Foreign tourists**, who need orientation, cultural-etiquette context, and trustworthy curation.
- **Domestic (Nepali) tourists**, who want to rediscover heritage sites, festivals, and artisans closer to home.

LocalPasa is a full-stack monorepo: a **React Native / Expo** mobile client and a **Node.js / Express / MongoDB** backend API, built with TypeScript end-to-end.

**Repository:** [github.com/rezenn/LocalPasa](https://github.com/rezenn/LocalPasa)

---

## 2. Key Features

### Authentication & Onboarding
- Full auth flow: register, login, logout, refresh, forgot password, reset password, change password.
- Dual-token JWT strategy — short-lived access tokens paired with rotating, SHA-256-hashed refresh tokens.
- Enumeration-safe responses (the API never reveals whether an email address exists in the system).
- Three-screen onboarding sequence for new users, capturing interests, preferred locations, and language — these preferences pre-populate the user's profile so nothing is asked twice.

### Discovery
- **Explore** screen with live, grouped search and category/type filtering.
- **Map** screen using Stadia Maps tiles rendered via WebView/Leaflet, with emoji-coded category pins, an animated slide-up filter panel, and a tappable site-detail card.
- Shared filter panel (used by both Explore and Map) with a custom `PanResponder`-based slider for distance and price, star-rating filters, and type chips.
- Distance calculations use the **Haversine formula** against a Kathmandu reference point — no third-party places/geocoding API is required for filtering.
- "Must-visit" and "hidden gem" badges surfaced on site cards to highlight curated recommendations.

### Content Depth
- Site detail pages present **History**, **Myth**, **Archaeology**, and **"Did You Know"** content per site, plus optional interactive quizzes.
- Multilingual translations per site (Nepali, Chinese, Japanese, Korean, Spanish) stored in the data model, plus a dedicated **Translate** screen using the free MyMemory translation API for freeform text.

### Experiences & Booking
- Browse screen with category tabs for bookable cultural experiences (e.g. artisan workshops).
- Detail/booking screen with date and time pickers.
- Booking-confirmation screen with a generated reference number.
- Bookings are currently persisted client-side via a `BookingsContext` backed by AsyncStorage (see [Known Limitations](#16-known-limitations--roadmap)).

### Saved Collections
- Instagram-style folder collections on the **Saved** screen, with a name/emoji/colour picker, mosaic-style cover images, and a select-to-add flow for organising favourite sites, artisans, and experiences.

### Artisans, Events & Chat
- Dedicated artisan listing and detail pages (craft type, products, workshops, reviews).
- Event listing (all, upcoming, current month, by type) and event detail pages for the cultural calendar.
- A lightweight chat surface between users and artisans.

### Profile & Settings
- Editable profile, change-password flow, notification and privacy settings, saved-locations management, interests management, and a help screen — all reachable from a central Settings hub.

### Reviews
- Users can leave and read reviews on both sites and artisans.

---

## 3. Tech Stack

### Client (`/client`)
| Category | Technology |
|---|---|
| Framework | React Native `0.81`, React `19.1` |
| Tooling | Expo SDK `~54`, Expo Router (file-based routing) |
| Language | TypeScript `~5.9` |
| Styling | NativeWind `2.x` (Tailwind CSS for React Native) |
| Navigation | `@react-navigation/native`, `@react-navigation/bottom-tabs` |
| Maps | `react-native-webview` + Stadia Maps (Leaflet) tiles |
| Storage | `@react-native-async-storage/async-storage` |
| Animation/Gesture | `react-native-reanimated`, `react-native-gesture-handler`, custom `PanResponder` sliders |
| Icons | `@expo/vector-icons`, `react-native-heroicons` |
| Notifications | `react-native-toast-message`, `@backpackapp-io/react-native-toast` |
| Other | `react-native-svg`, `react-native-country-picker-modal`, `react-native-phone-number-input` |

### Server (`/server`)
| Category | Technology |
|---|---|
| Runtime | Node.js, TypeScript `~5.9` |
| Framework | Express `5.x` |
| Database | MongoDB via Mongoose `9.x` |
| Auth | `jsonwebtoken` (dual-token strategy), `bcryptjs`/`bcrypt` |
| Validation | `express-validator`, `zod` |
| Security | `helmet`, `express-rate-limit`, `express-mongo-sanitize`, `hpp`, `xss-clean`, `cookie-parser` |
| Logging | `winston`, `morgan` (dev only) |
| Email | `nodemailer` |
| Other | `passport` + `passport-google-oauth20` (Google OAuth scaffolding), `qrcode`, `otplib`, `multer` (file uploads), `compression` |
| Dev/Test | `ts-node-dev`, `jest`, `supertest`, ESLint + `@typescript-eslint` |

---

## 4. Monorepo Structure

```
LocalPasa/
├── client/                      # React Native / Expo app
│   ├── app/                     # Expo Router file-based routes
│   │   ├── (auth)/              # Login, Signup, Forgot/Reset Password
│   │   ├── (onboarding)/        # Welcome + 3-step onboarding
│   │   ├── (dashboard)/         # Bottom-tab screens: explore, map, calendar, saved, profile
│   │   ├── artisan/[id].tsx     # Artisan detail
│   │   ├── artisans-list/       # Artisan listing
│   │   ├── chat/[artisanId].tsx # Chat screen
│   │   ├── event/[id].tsx       # Event detail
│   │   ├── events-list/         # Event listing
│   │   ├── experience/[id].tsx  # Experience detail/booking
│   │   ├── experience/booking-confirmed.tsx
│   │   ├── experiences-list/    # Experience browse
│   │   ├── product/[id].tsx     # Artisan product detail
│   │   ├── products-list/       # Product listing
│   │   ├── profile/             # Settings hub sub-screens
│   │   ├── site/[id].tsx        # Site detail
│   │   ├── sites-list/          # Site listing
│   │   ├── translate/           # Translation utility
│   │   └── _layout.tsx          # Root layout: fonts, providers, auth guard
│   ├── api/                     # Typed API client (auth, sites, artisans, events)
│   ├── components/
│   │   ├── cards/                # SiteCard, ArtisansCard, HiddenGemBanner, ...
│   │   ├── common/                # FilterPanel, Header, ...
│   │   ├── layout/
│   │   ├── navigation/
│   │   └── ui/
│   ├── constants/                # colors.ts, theme.ts, static data
│   ├── context/                  # AuthContext, PreferencesContext, BookingsContext
│   ├── hooks/
│   ├── utils/
│   ├── assets/                   # fonts, images
│   └── app.json                  # Expo config
│
├── server/                      # Node.js / Express API
│   └── src/
│       ├── configs/              # env.ts, database.ts
│       ├── controllers/          # Route handler logic
│       ├── dtos/                 # Request validation DTOs
│       ├── middleware/           # auth, validate, error, security
│       ├── models/               # Mongoose schemas
│       ├── repositories/         # Data-access layer
│       ├── routes/                # Express routers
│       ├── scripts/              # seed.ts
│       ├── types/
│       ├── utils/                # logger, response helpers
│       ├── app.ts                # Express app + middleware wiring
│       └── index.ts              # Entry point (connects DB, starts server)
│
└── .gitignore
```

---

## 5. Architecture

```
┌─────────────────────────────┐          ┌──────────────────────────────┐
│   React Native / Expo App    │  HTTPS   │      Express REST API        │
│                              │ ───────► │                              │
│  Expo Router (file routing)  │          │  Routes → Controllers →      │
│  Context: Auth / Prefs /     │          │  Repositories → Mongoose     │
│    Bookings (AsyncStorage)   │ ◄─────── │  Models → MongoDB            │
│  Typed API client (/api)     │  JSON    │                              │
└─────────────────────────────┘          └──────────────────────────────┘
        │                                          │
        │  Stadia Maps tiles (WebView/Leaflet)     │  JWT access + refresh
        │  MyMemory translation API                │  tokens, cookie-based
        ▼                                          ▼
   Device-local: fonts, images,             MongoDB: sites, artisans,
   saved folders, booking cache             events, users, reviews, chats
```

**Request flow example — loading the Explore screen:**
1. Client calls `GET /api/v1/sites` (optionally with query filters) via the typed API client in `client/api/sites.api.ts`.
2. Express routes the request through `site.routes.ts` → `site.controller.ts`.
3. The controller delegates to the site repository, which queries the `Site` Mongoose model.
4. Results are shaped and returned as a standard `ApiResponse<T>` envelope (`{ success, message, data, errors }`).
4. The client's shared `FilterPanel` component applies client-side Haversine distance filtering and renders results as `SiteCard`s.

**Auth flow:**
1. `POST /api/v1/auth/login` returns a short-lived **access token** and a rotating **refresh token**.
2. Tokens are stored via `tokenStorage` (AsyncStorage) on the client.
3. `AuthContext` exposes `user`, `initializing`, and auth actions app-wide; `RootLayoutInner`'s `AuthGuard` redirects unauthenticated users to `(auth)/LoginScreen` and authenticated users away from the auth group into `(dashboard)/explore`.
4. `POST /api/v1/auth/refresh` rotates the refresh token and issues a new access token when the access token expires.

---

## 6. Getting Started

### Prerequisites
- Node.js 18+ and npm
- A MongoDB instance (local or Atlas)
- Expo CLI tooling (installed automatically via `npx expo`)
- Expo Go app (for quick device testing) or an Android/iOS simulator

### Clone the repository
```bash
git clone https://github.com/rezenn/LocalPasa.git
cd LocalPasa
```

### Backend setup
```bash
cd server
npm install
cp .env.example .env   # create this file — see Environment Variables below
npm run dev             # starts the API with ts-node-dev on http://0.0.0.0:5000
```

Seed the database with demo content (sites, artisans, events, translations, quizzes):
```bash
npm run seed:all
```

### Frontend setup
```bash
cd client
npm install
# Point the client at your running API — see Environment Variables below
npx expo start -c       # -c clears the Metro cache; use after any route/env change
```

From the Expo CLI output you can launch the app in Expo Go, an iOS simulator, an Android emulator, or a web browser.

> **Metro cache note:** always run `expo start -c` after changing route files or environment variables. A stale Metro cache is a common cause of "my fix isn't showing up" confusion during development.

### Running client and server together on a physical device
The server binds to `0.0.0.0` (not just `127.0.0.1`), so it's reachable from a phone on the same Wi-Fi network. Set `EXPO_PUBLIC_API_BASE_URL` in the client's environment to your machine's LAN IP (e.g. `http://192.168.1.42:5000/api/v1`) rather than `localhost`.

---

## 7. Environment Variables

### Server (`server/.env`)
The server fails fast on startup if any of the four **required** variables below are missing.

| Variable | Required | Description | Example |
|---|:---:|---|---|
| `MONGODB_URI` | ✅ | MongoDB connection string | `mongodb://localhost:27017/localpasa` |
| `JWT_ACCESS_SECRET` | ✅ | Secret for signing access tokens | long random string |
| `JWT_REFRESH_SECRET` | ✅ | Secret for signing refresh tokens | long random string |
| `COOKIE_SECRET` | ✅ | Secret for signed cookies | long random string |
| `NODE_ENV` | | `development` \| `production` | `development` |
| `PORT` | | API port | `5000` |
| `API_VERSION` | | URL version segment | `v1` |
| `JWT_ACCESS_EXPIRE` | | Access token lifetime | `15m` |
| `JWT_REFRESH_EXPIRE` | | Refresh token lifetime | `7d` |
| `CLIENT_URL` | | Allowed web origin for CORS | `http://localhost:3000` |
| `CLIENT_DEEP_LINK` | | Mobile deep-link scheme | `localpasa://` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_CALLBACK_URL` | | Google OAuth (scaffolded, optional) | — |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `EMAIL_FROM` | | Outbound email (password reset, etc.) | `smtp.gmail.com` / `587` |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` / `AUTH_RATE_LIMIT_MAX` | | Rate-limiting tuning | `900000` / `100` / `10` |
| `BCRYPT_ROUNDS` | | Password hashing cost factor | `12` |

### Client (`client/.env`)
| Variable | Description | Example |
|---|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | Base URL the app calls for all API requests | `http://192.168.1.42:5000/api/v1` |

> Expo only exposes environment variables prefixed with `EXPO_PUBLIC_` to client code — this is an Expo convention, not a LocalPasa-specific setting.

---

## 8. Backend: API Reference

All endpoints are mounted under `/api/{API_VERSION}` (default `/api/v1`). Responses use a consistent envelope: `{ success: boolean, message: string, data?: T, errors?: [] }`.

### Auth — `/auth`
| Method | Path | Auth | Description |
|---|---|:---:|---|
| POST | `/register` | – | Create a new account |
| POST | `/login` | – | Log in, returns access + refresh tokens |
| GET | `/me` | ✅ | Get the current authenticated user |
| POST | `/refresh` | – | Rotate refresh token, issue new access token |
| POST | `/logout` | – | Invalidate the current refresh token |
| POST | `/forgot-password` | – | Request a password-reset email (enumeration-safe) |
| POST | `/reset-password` | – | Reset password using a reset token |

### Sites — `/sites`
| Method | Path | Auth | Description |
|---|---|:---:|---|
| GET | `/` | – | List all sites |
| GET | `/hidden-gem` | – | List sites flagged as hidden gems |
| GET | `/must-visit` | – | List sites flagged as must-visit |
| GET | `/type/:type` | – | Filter sites by type |
| GET | `/:id` | – | Get a single site |
| GET | `/:id/quizzes` | – | Get a site's quiz questions |
| GET | `/:id/reviews` | – | List reviews for a site |
| POST | `/:id/reviews` | ✅ | Add a review to a site |

### Artisans — `/artisans`
| Method | Path | Auth | Description |
|---|---|:---:|---|
| GET | `/` | – | List all artisans |
| GET | `/craft/:craft` | – | Filter artisans by craft type |
| GET | `/:id` | – | Get a single artisan |
| GET | `/:id/products` | – | List an artisan's products |
| GET | `/:id/workshops` | – | List an artisan's workshops |
| GET | `/:id/reviews` | – | List reviews for an artisan |
| POST | `/:id/reviews` | ✅ | Add a review to an artisan |

### Events — `/events`
| Method | Path | Auth | Description |
|---|---|:---:|---|
| GET | `/` | – | List all events |
| GET | `/upcoming` | – | List upcoming events |
| GET | `/current-month` | – | List events in the current month |
| GET | `/type/:type` | – | Filter events by type |
| GET | `/:id` | – | Get a single event |

### Saved — `/saved`
| Method | Path | Auth | Description |
|---|---|:---:|---|
| GET | `/` | – | List the user's saved items/folders |
| POST | `/` | – | Save an item |
| DELETE | `/:itemId` | – | Remove a saved item |

### Search — `/search`
| Method | Path | Auth | Description |
|---|---|:---:|---|
| GET | `/` | – | Global search across sites/artisans/events |
| GET | `/suggestions` | – | Search-as-you-type suggestions |

### Profile — `/profile`
| Method | Path | Auth | Description |
|---|---|:---:|---|
| GET | `/me` | – | Get profile details |
| GET | `/saved/stats` | – | Get saved-item statistics |
| PATCH | `/update` | – | Update profile fields |
| POST | `/change-password` | – | Change the current password |

### Dashboard — `/dashboard`
| Method | Path | Auth | Description |
|---|---|:---:|---|
| GET | `/stats` | – | Aggregate dashboard statistics |
| GET | `/top-rated` | – | Top-rated sites/artisans |

### Chat — `/chat`
| Method | Path | Auth | Description |
|---|---|:---:|---|
| POST | `/send` | – | Send a chat message (rate-limited) |
| GET | `/:artisanId` | – | Get message history with an artisan (rate-limited) |

### Translate — `/translate`
| Method | Path | Auth | Description |
|---|---|:---:|---|
| POST | `/` | – | Translate freeform text (rate-limited, proxies MyMemory API) |

### Utility endpoints
| Method | Path | Description |
|---|---|---|
| GET | `/` | API info + endpoint index |
| GET | `/health` | Health check (uptime) |

---

## 9. Backend: Data Models

All models live in `server/src/models/` as Mongoose schemas.

- **`User`** — account credentials, profile fields, onboarding preferences, password-reset token fields (hashed, with expiry).
- **`Site`** — heritage site record: name, type, location/city, coordinates, distance, price, `mustVisit` / `isHiddenGem` flags, rating, images, `summary`, `longDescription`, `history`, `myth`, `archeology`, `didYouKnow`, `quizzes[]` (question/options/correct answer), `translations` (Nepali, Chinese, Japanese, Korean, Spanish), opening hours, `isActive`.
- **`Artisan`** — artisan/craftsperson profile: craft type, location, products, workshops, ratings.
- **`SiteArtisan`** — join/relationship model linking sites and artisans (e.g. an artisan whose workshop is located at or near a given site).
- **`Event`** — cultural event/festival record: type, date range, location, description.
- **`Review`** — polymorphic review record attached to either a site or an artisan.
- **`Saved`** — a user's saved items/collections.
- **`Chat`** — message records between a user and an artisan.

All Mongoose queries that accept a raw string ID (from route params) wrap it with `new mongoose.Types.ObjectId(id)` before querying, to avoid cast errors.

---

## 10. Frontend: Screens & Navigation

LocalPasa uses **Expo Router**'s file-based routing with route groups:

- **`(auth)`** — `LoginScreen`, `SignupScreen`, `ForgotPasswordScreen`, `ResetPasswordScreen`.
- **`(onboarding)`** — `welcome`, `OnboardingScreen1/2/3`.
- **`(dashboard)`** — the authenticated bottom-tab shell: `explore`, `map`, `calendar`, `saved`, `profile`.
- **Stack routes outside the tab groups** — `site/[id]`, `artisan/[id]`, `event/[id]`, `experience/[id]`, `experience/booking-confirmed`, `product/[id]`, `sites-list`, `artisans-list`, `events-list`, `experiences-list`, `products-list`, `chat/[artisanId]`, `translate`, and the `profile/*` settings sub-screens (`edit`, `settings`, `change-password`, `notifications`, `privacy`, `locations`, `interests`, `language`, `my-experiences`, `saved`, `help`).

**Navigation guarding** happens in `app/_layout.tsx`: an `AuthGuard` component watches the current route segment against auth state and redirects — unauthenticated users are pushed to `(auth)/LoginScreen`, and authenticated users who land in the auth group are pushed to `(dashboard)/explore`.

**Fonts** are loaded once at the root via `expo-font`'s `useFonts` hook before rendering the rest of the tree, covering the `Gagalin` display face and the `CrimsonText` family (Regular, SemiBold, Bold).

---

## 11. Frontend: Design System

LocalPasa deliberately avoids a generic "travel app blue" palette in favour of a warm, Nepal-appropriate identity, defined in `client/constants/theme.ts` and `client/constants/colors.ts`:

| Token | Value | Usage |
|---|---|---|
| Primary (brown) | `#6B4F3A` | Buttons, headings, primary actions |
| Background | `#F7F4EF` / `#F7F1EA` | Screen backgrounds |
| Secondary accent (gold) | `#F5A623` | Ratings, stars, highlights |
| "Must-visit" / free-entry (green) | `#2C7A3A` | Positive badges |
| Onboarding background | `#EFCEB5` | Onboarding screens |
| Border | `#E8E2D9` | Card/divider borders |

**Typography:** `Gagalin` for hero/display headings, `CrimsonText` (Regular/SemiBold/Bold) for body and card content, giving the app an editorial, storybook-like tone appropriate for cultural storytelling while staying legible at small sizes.

**Spacing & radius tokens** run from `xs` (4dp) to `xxxl` (32dp) for spacing, and `sm` (6dp) to `full` (999dp, for pill shapes) for corner radius, shared across every screen via the `Spacing` and `Radius` exports.

Styling is applied with **NativeWind** (Tailwind utility classes for React Native) layered on top of these shared tokens, so visual changes to the design system propagate consistently across the whole app rather than needing per-screen edits.

---

## 12. Frontend: State Management

State is split between server data (fetched on demand via the typed API client) and local/persistent state held in React Context:

- **`AuthContext`** — current user, `initializing` flag, login/register/logout actions; backed by the JWT tokens in `tokenStorage` (AsyncStorage).
- **`PreferencesContext`** — language, interests, and preferred-locations preferences, seeded from onboarding and editable later from Settings; persisted to AsyncStorage.
- **`BookingsContext`** — experience booking records. **This is currently a client-only, AsyncStorage-backed store** (there is no `POST /experiences/:id/bookings` endpoint yet); the booking record shape is deliberately kept close to what a real API response would look like, so migrating to a backend-backed store is intended to be a small, contained change rather than a rewrite.

Screens consume these via `useAuth()`, `usePreferences()`, and `useBookings()` hooks rather than prop-drilling.

---

## 13. Database Seeding

`server/src/scripts/seed.ts` populates MongoDB with realistic demo data so the app is fully browsable without manual data entry:

```bash
cd server
npm run seed:all
```

The seed script covers sites, artisans, and events, including per-site translations (Nepali, Chinese, Japanese, Korean, Spanish), quiz questions, and workshop details — so discovery, detail, and quiz screens all have authentic-looking content rather than placeholder text.

---

## 14. Development Workflow & Scripts

### Server (`server/package.json`)
| Script | Purpose |
|---|---|
| `npm run dev` | Start the API with hot-reload (`ts-node-dev`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build (`node dist/index.js`) |
| `npm run typecheck` | `tsc --noEmit` — verify types with no output |
| `npm test` | Currently aliases to `typecheck` |
| `npm run seed:all` | Run the database seed script |

### Client (`client/package.json`)
| Script | Purpose |
|---|---|
| `npm start` | `expo start` |
| `npm run android` / `ios` / `web` | Start targeting a specific platform |
| `npm run lint` | `expo lint` |
| `npm run reset-project` | Move starter code aside and start from a blank `app/` directory |

### Recommended local workflow
1. Run `npx tsc --noEmit` in both `client` and `server` before committing — the project maintains a zero-TypeScript-error baseline.
2. After changing any route file, provider, or environment variable on the client, restart with `npx expo start -c` to avoid stale Metro cache masking your change.
3. Use `grep -rn` to audit all references before renaming shared tokens, hooks, or context values, to avoid missing a call site.

---

## 15. Security

- **Passwords** are hashed with `bcrypt`/`bcryptjs` (configurable cost factor via `BCRYPT_ROUNDS`).
- **JWTs**: short-lived access tokens plus rotating refresh tokens; refresh tokens are stored hashed (SHA-256) server-side so a database leak doesn't expose usable tokens directly.
- **Enumeration-safe auth responses** — login/forgot-password endpoints never reveal whether a given email is registered.
- **Rate limiting** — global rate limiting via `express-rate-limit`, plus a stricter limiter dedicated to `/auth` routes and to the `/chat` and `/translate` endpoints.
- **Hardening middleware** — `helmet` (secure headers), `hpp` (HTTP parameter pollution protection), `express-mongo-sanitize` and a custom `sanitizeBody` middleware (NoSQL injection / XSS mitigation), `xss-clean`, disabled `x-powered-by` header.
- **CORS** — explicit allow-list for known web origins, with mobile clients (which send no `Origin` header) explicitly accommodated.
- **Cookies** — signed with `COOKIE_SECRET`, `httpOnly`, `sameSite: strict`, and marked `secure` automatically in production.
- **Input validation** — `express-validator`/`zod`-backed DTOs validate every mutating request before it reaches a controller.

> Note: the current CORS configuration allows all origins in non-production environments for developer convenience (`callback(null, true)` fallback) — tighten this before any public/production deployment.

---

## 16. Known Limitations & Roadmap

- **Bookings and saved folders are client-only.** Both currently persist via AsyncStorage rather than the backend's `Saved` model and a (not-yet-built) bookings endpoint. The data shapes were deliberately designed to mirror what the eventual API responses would look like, to make the migration additive rather than a rewrite.
- **Some detail screens still fall back to seed/mock data** for content not yet fully wired to live API calls (e.g. deeper calendar/event-list integration).
- **Google OAuth is scaffolded but not fully wired end-to-end** (`passport-google-oauth20` is installed and configured in `env.ts`, but the corresponding route/controller flow is not complete).
- **CORS is permissive in development** — see the [Security](#15-security) note above; this should be locked down before production deployment.
- **Figma-to-code workflow** for the design system currently relies on manual export/screenshots rather than the Figma MCP integration, due to rate limits on the connected plan's tier.

**Planned next steps:**
- Wire `BookingsContext` and the Saved folder flow to real backend endpoints.
- Complete Google OAuth login end-to-end.
- Expand automated test coverage beyond `tsc --noEmit` (Jest/Supertest scaffolding is already present on the server).
- Tighten production CORS and secrets management.

---

## 17. Contributing

1. Fork the repository and create a feature branch from `main`.
2. Keep client and server changes in separate, focused commits where possible.
3. Run `npx tsc --noEmit` in whichever package(s) you touched — the project maintains a zero-error TypeScript baseline.
4. For any bulk mechanical change across many files (e.g. an import rename), prefer a small script (Python/Node) over hand-editing each file, and verify with `grep -rn` afterward.
5. Open a pull request describing the change and, for UI changes, include a before/after screenshot.

---
