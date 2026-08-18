# Traders In Loop

**Traders In Loop** is a UK trades marketplace frontend built with React 19, Vite, and Tailwind CSS v4. The app covers three audiences — **customers**, **tradesmen**, and **platform admins** — plus public marketing pages.

This README is written for developers joining the project: how to run it, how the codebase is organised, and how to discover and reuse shared UI through the built-in **Developer route**.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| UI | React 19, React Router 7 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Charts | Recharts |
| Icons | Lucide React, React Icons |
| Animation | GSAP (scroll animations on large screens) |
| Lint | ESLint 9 |

Path alias: `@/` → `src/` (configured in `vite.config.js`).

---

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build    # production build
npm run preview  # preview the production build locally
npm run lint     # ESLint
```

The dev server runs on Vite’s default port (usually `5173`).

---

## Demo authentication (local only)

Auth is demo-mode for now. Login at `/auth/login` with any of these accounts (password for all: `demo123`):

| Role | Email |
| --- | --- |
| Customer | `user@tradetrust.uk` |
| Tradesman | `tradesman@tradetrust.uk` |
| Admin | `admin@tradetrust.uk` |

Credentials and role resolution live in `src/auth/demoAuth.js`. After login, users are redirected to their dashboard home (`/` for customers, `/tradesman/dashboard`, `/admin/dashboard`).

Session state is provided by `AuthProvider` (`src/auth/AuthProvider.jsx`) and persisted via `src/auth/authService.js` / `src/auth/authStorage.js`.

---

## Application structure

```
src/
├── app/router/          # Route tree, guards (Auth, Role, Guest, User)
├── auth/                # Demo auth, session, AuthProvider
├── components/          # Shared UI (see below)
├── context/             # App-wide React context (e.g. trade categories)
├── data/                # Demo / static payloads per feature area
├── developer/           # Component catalog + live previews for /developer
├── helpers/             # Small utilities (cn, scroll helpers)
├── hooks/               # Shared hooks (e.g. usePagination)
├── layouts/             # Public, Auth, Tradesman, Admin shells + nav config
├── lib/                 # GSAP, scroll animations, trade icon helpers
├── pages/               # Route-level pages, grouped by audience
│   ├── public/          # Marketing + browse jobs
│   ├── auth/
│   ├── user/            # Customer flows (post job, bookings, profile)
│   ├── tradesman/       # Tradesman dashboard pages
│   ├── admin/           # Admin dashboard pages
│   ├── shared/          # Cross-role pages (messages, coming soon)
│   └── public_page/     # DeveloperPage (/developer)
├── styles/              # Tailwind entry + CSS variables
└── main.jsx             # App bootstrap
```

### Routing overview

Routes are defined in `src/app/router/index.jsx`.

| Area | Base path | Guard |
| --- | --- | --- |
| Public | `/`, `/jobs`, `/about`, … | — |
| Customer (logged-in) | `/post-job`, `/my-jobs`, `/messages`, … | `UserGuard` |
| Auth | `/auth/login`, `/auth/signup`, … | `GuestGuard` |
| Tradesman | `/tradesman/*` | `AuthGuard` + `RoleGuard` |
| Admin | `/admin/*` | `AuthGuard` + `RoleGuard` |
| Developer docs | `/developer`, `/developer/:componentId` | None (public) |

Sidebar links for dashboards are in `src/layouts/dashboard/navConfig.js`.

---

## Architecture conventions

### Pages compose; components present

Shared components are **UI-only**. They do not navigate, call APIs, or own business logic. Parent pages pass data and wire callbacks (`onViewLead`, `onUpdateProfile`, `onBuyTokens`, etc.).

```jsx
// Good — page owns navigation
<JobCard {...job} onViewLead={() => navigate(`/jobs/${job.id}`)} />

// Avoid — navigation inside the shared component
```

Demo data for previews and pages lives in `src/data/demoData.js` and feature-specific files (`adminTokenData.js`, `categoriesData.js`, …).

### Folder layout for components

```
src/components/
├── common/          # Pagination, Messenger, TradeIcon, Skeleton, …
├── data-display/    # JobCard, DataTable, QuoteCard, modals, …
├── forms/           # ProfileSettings, PostJobForm, …
├── dashboard/       # DashboardPageHeader, DashboardChartCard, …
└── animations/      # ScrollAnimationProvider
```

Each component usually has its own folder with an optional `index.js` barrel export.

### Styling

- Tailwind utility classes throughout.
- Design tokens in `src/styles/index.css` (`@theme`) and `src/styles/variables.css` (`--primary-text`, `--active`, etc.).
- Merge classes with `cn()` from `src/helpers/cn.js` (`clsx` + `tailwind-merge`).

### Data and state

- **Demo payloads**: `src/data/*` — swap for API calls when backend is ready.
- **Trade categories**: `TradeCategoriesProvider` persists admin-defined categories to `localStorage` and feeds the public “Browse by Trade” section and admin categories page.

---

## Developer route — component catalog

The fastest way to find reusable UI is the **Developer page**, a local component documentation site built into the app.

### Open it

Start the dev server, then visit:

```
/developer
```

You can also jump straight to a component:

```
/developer/job-card
/developer/data-table
/developer/profile-settings
```

### What you get per component

For each entry in the sidebar, the page shows:

1. **Summary** and source path under `src/components/`
2. **Import snippet** — copy-paste ready
3. **Required props** — table + minimal JSX example
4. **Optional props** — table + fuller JSX example
5. **Callbacks** — which `on*` handlers the parent must provide
6. **Live preview** — renders the component with demo data at public-page container width

Use the search box to filter by name, prop, or description.

### How it works (three files)

| File | Purpose |
| --- | --- |
| `src/developer/catalog.js` | `COMPONENT_DOCS` array — metadata, props, code examples |
| `src/developer/ComponentPreview.jsx` | Maps `previewId` → live preview renderers |
| `src/pages/public_page/DeveloperPage.jsx` | UI shell: sidebar, search, docs panel |

Demo payloads for previews are imported from `@/data/demoData` (and related data files) inside `ComponentPreview.jsx`.

### Add a new component to the catalog

When you build a shared component others should reuse, register it in three steps:

**1. Add a doc entry** in `src/developer/catalog.js`:

```js
{
  id: 'my-component',           // URL slug: /developer/my-component
  name: 'MyComponent',
  category: 'data-display',     // data-display | forms | common
  summary: 'One-line description.',
  path: 'src/components/data-display/MyComponent/MyComponent.jsx',
  importExample: "import MyComponent from '@/components/...'",
  props: [
    { name: 'title', type: 'string', required: true, description: '…' },
    { name: 'onAction', type: '() => void', required: false, description: '…' },
  ],
  requiredExample: `<MyComponent title="Hello" />`,
  optionalExample: `<MyComponent title="Hello" onAction={() => {}} />`,
  previewId: 'my-component',
}
```

**2. Add a preview** in `src/developer/ComponentPreview.jsx`:

```jsx
function MyComponentPreview() {
  return <MyComponent title="Preview" onAction={() => {}} />
}

// In the switch:
case 'my-component':
  return <MyComponentPreview />
```

**3. Verify** at `/developer/my-component`.

Categories are defined in `DOC_CATEGORIES` at the top of `catalog.js`. Add a new category there if needed.

### Currently documented components

| ID | Component | Category |
| --- | --- | --- |
| `job-details` | JobDetails | data-display |
| `job-card` | JobCard | data-display |
| `quote-card` | QuoteCard | data-display |
| `wallet-stat-card` | WalletStatCard | data-display |
| `token-pricing-card` | TokenPricingCard | data-display |
| `data-table` | DataTable (+ StatusBadge) | data-display |
| `profile-settings` | ProfileSettings | forms |
| `pagination` | Pagination | common |
| `messenger` | Messenger (+ useMessages) | common |

Components not yet in the catalog (e.g. `QuoteDetailsModal`, `SendQuoteModal`, `PostJobForm`, `TradeIcon`) still exist under `src/components/` — check usages in `src/pages/` or add them to the catalog following the steps above.

---

## Role-specific pages

### Public

Home, About, Contact, Browse Jobs, Job Details, Categories, How It Works, Pricing.

### Customer (`user@tradetrust.uk`)

Post Job, My Jobs, Job Quotes, My Bookings, Messages, Profile (`/user/profile`).

Profile uses `ProfileSettings` with `role="user"` (`src/pages/user/profile/UserProfilePage.jsx`).

### Tradesman (`tradesman@tradetrust.uk`)

Dashboard, Browse Jobs, Quotes, Jobs, Messages, Wallet, Earnings, Reviews, Profile.

Uses shared components heavily: `JobCard`, `QuoteCard`, `DataTable`, `WalletStatCard`, `TokenPricingCard`, `Messenger`.

### Admin (`admin@tradetrust.uk`)

Dashboard (charts + stats), Customers, Tradesmen (+ detail), Jobs (+ detail + quotes), Categories (with Lucide icon picker), Token Management (packages + rules), Profile.

Admin pages follow the pattern: page header + section components under `src/pages/admin/<feature>/sections/`.

---

## Utilities and scripts

### Trade icon list generator

Admin category icons use a curated Lucide icon set. Regenerate the list after changing keywords:

```bash
node scripts/generateTradeIcons.mjs
```

Writes `src/data/tradeIconNames.js`. Icons render via `TradeIcon` (`src/components/common/TradeIcon/TradeIcon.jsx`) using Lucide dynamic imports.

### Pagination hook

`src/hooks/usePagination.js` — slice arrays for table/grid pagination. Used alongside `DataTable`’s built-in footer or standalone `Pagination`.

### Messenger

`src/components/common/messenger/useMessages.js` holds inbox state. Pages pass the hook result into `<Messenger {...state} />`. See the `/developer/messenger` docs for the full prop list.

---

## Guards and layouts

| Guard | File | Behaviour |
| --- | --- | --- |
| `AuthGuard` | `src/app/router/AuthGuard.jsx` | Requires any logged-in session |
| `RoleGuard` | `src/app/router/RoleGuard.jsx` | Restricts to allowed roles |
| `GuestGuard` | `src/app/router/GuestGuard.jsx` | Redirects authenticated users away from login |
| `UserGuard` | `src/app/router/UserGuard.jsx` | Customer-only public routes |

Layouts wrap page content and sidebar:

- `PublicLayout` — marketing navbar + footer
- `AuthLayout` — login/register split hero
- `TradesmanLayout` / `AdminLayout` — dashboard sidebar from `navConfig.js`

---

## Working on new features

1. **Find existing UI** — search `/developer` or grep `src/components/` and `src/pages/` for similar screens.
2. **Reuse shared components** — prefer composing documented components over duplicating markup.
3. **Keep demo data separate** — add payloads to `src/data/` until APIs exist.
4. **Wire callbacks in the page** — navigation, saves, and API calls stay in route-level files.
5. **Document reusable UI** — if you add a component others will import, add it to `catalog.js` and `ComponentPreview.jsx`.

---

## Environment notes

- No backend is required for local development; all data is static/demo.
- `TradeCategoriesProvider` writes to `localStorage` — clear site data in DevTools if category state gets stale.
- Scroll animations (`src/lib/scrollAnimations.js`) are gated to large breakpoints to avoid layout shift on mobile.

---

## Contributing

Keep pull requests focused. Match existing patterns: `@/` imports, Tailwind utilities, prop-drilled callbacks, and demo data in `src/data/`. When adding shared UI, update the Developer catalog so the next developer can find it at `/developer`.
