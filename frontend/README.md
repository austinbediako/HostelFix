# HostelFix Frontend

Next.js 16 App Router frontend for the HostelFix maintenance reporting platform.

## Tech stack

- Next.js 16
- TypeScript (strict)
- Tailwind CSS v4
- shadcn/ui (base-nova)
- TanStack Query
- Zustand
- React Hook Form + Zod
- Axios
- date-fns
- Recharts

## Getting started

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Set `API_BASE_URL` to the backend base URL. The current local environment uses `http://localhost:5001/api/v1`. It is server-only — browser requests hit same-origin `/api/*` and Next.js rewrites proxy them to the backend.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |

## Project structure

```text
app/              — Next.js App Router pages
components/       — UI and feature components
  ui/             — shadcn primitives
  layout/         — App shell, sidebar, top bar
  issues/         — Issue-related components
  forms/          — Form wrappers and reusable fields
  auth/           — Auth forms and guards
  shared/         — Empty, loading, error states
hooks/            — TanStack Query hooks
lib/              — API client, auth helpers, navigation
providers/        — React context and query providers
stores/           — Zustand UI store
types/            — TypeScript types
constants/        — Issue categories, statuses, priorities
```

## Authentication

The frontend uses the backend's HTTP-only cookie authentication. Axios is configured with `withCredentials: true`. Tokens are never stored in `localStorage` or `sessionStorage`.

## Role-based dashboard

All authenticated roles use `/dashboard`. The authenticated role returned by the
backend selects the dashboard content, navigation, and API-scoped data. Legacy
role-specific URLs redirect to the shared dashboard namespace.

The operational issue flow is `submitted -> under_review -> assigned ->
in_progress -> resolved -> closed`, with rejection, clarification, reopening,
and automatic closure. Assignment and `in_progress` are real statuses but do
not gate resolution; staff can record resolved work directly from any active
status so informal coordination never blocks the record.

## Theming

All colors, spacing, and shape tokens are CSS custom properties in `app/globals.css`. Changing the institutional theme only requires updating these variables; component logic stays the same.
