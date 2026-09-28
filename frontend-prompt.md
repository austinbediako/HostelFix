# Frontend Build Prompt: HostelFix UI

> **Use this prompt as-is with any coding agent.** It tells the agent exactly what to build, where the backend lives, and how the UI should look and behave.

## Project context

Build the **HostelFix** frontend: a maintenance reporting and tracking web application for University of Ghana Legon students and staff.

- The backend is already implemented at `/Users/kaeytee/Desktop/Joenick/HostelFix/backend`.
- Current local backend API base URL: `http://localhost:5001/api/v1`.
- The backend exposes OpenAPI docs at `http://localhost:5001/api/v1/docs` in the current local environment.
- Reference docs are in `/Users/kaeytee/Desktop/Joenick/HostelFix/hostelfix-backend-docs/`.
- The system only supports these nine University-managed halls:
  - Akuafo Hall
  - Legon Hall
  - Volta Hall
  - Commonwealth Hall
  - Mensah Sarbah Hall
  - Hilla Limann Hall
  - Alexander Adum Kwapong Hall
  - Elizabeth Frances Sey Hall
  - Jean Nelson Aka Hall
- Private hostels and off-campus accommodation are out of scope.

## Tech stack

Use the following. Do not deviate unless you justify it explicitly.

- **Framework:** Next.js 15+ with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI components:** shadcn/ui
- **Forms:** React Hook Form + Zod
- **Data fetching:** TanStack Query (React Query)
- **HTTP client:** Axios configured with `withCredentials: true`
- **Date utilities:** date-fns
- **Icons:** Lucide React
- **Notifications:** Sonner toasts
- **Charts (analytics):** Recharts

## Design system and UX principles

The UI must feel clean, professional, and trustworthy — like a University operations tool, not a startup dashboard.

- **Visual style:** clean, spacious, card-based layouts, subtle shadows, rounded-lg corners.
- **Color palette:** University blue primary (`#003366` or similar), gold/amber accent for priority badges, green for resolved, red for rejected/overdue, slate neutrals.
- **Typography:** sans-serif, clear hierarchy, readable line-height.
- **Accessibility:** WCAG 2.1 AA — proper labels, focus rings, keyboard navigation, semantic HTML.
- **Responsiveness:** mobile-first; sidebar becomes drawer on mobile, tables stack or scroll horizontally.
- **Feedback:** loading skeletons, spinners, empty states, error messages, and success toasts for every mutation.
- **Empty states:** friendly illustrations or icons with explanatory copy, never blank screens.
- **Date/time:** human-readable relative dates (e.g., "2 hours ago") with absolute tooltip on hover.

## Authentication and session rules

- Login form: University ID or email plus PIN/password. Seeded users sign in with student/staff ID and PIN.
- The backend uses **HTTP-only cookies** for JWT access and refresh tokens. The frontend must **never** store tokens in `localStorage` or `sessionStorage`.
- Every API call must include credentials:

  ```ts
  axios.defaults.withCredentials = true;
  ```

- After login, redirect every role to the canonical `/dashboard` route. The dashboard content adapts to the logged-in role using the same MongoDB-backed data; the URL stays `/dashboard` regardless of role.
  - `student` → Student dashboard
  - `hall_manager` → Hall Manager dashboard
  - `maintenance` → Maintenance dashboard
  - `university_admin` or `system_admin` → Admin dashboard
- Implement logout and a global 401 handler that redirects to `/login`.
- Add forgot-password and reset-password pages.

## Core pages and role-based views

Build every page below. Each page should be type-safe and include loading, error, and empty states.

### Public

- `/login` — Login page
- `/forgot-password` — Forgot password form
- `/reset-password` — Reset password form (token from URL)

### Student portal

- `/dashboard` — Summary: my open issues, recent updates, quick "Report Issue" button.
- `/dashboard/issues` — List of my issues with filters (status, category, priority).
- `/dashboard/issues/new` — Create issue form:
  1. Select hall (dropdown from `GET /halls`).
  2. Enter/select the room identifier expected by the current API.
  3. Select category.
  4. Select reported priority.
  5. Description textarea.
  6. Image upload via Cloudinary signed upload.
  7. Submit `hallId` and `room`; the backend resolves the controlled location.
- `/dashboard/issues/[id]` — Issue detail:
  - Status timeline
  - Comments section
  - Reopen button if status is `resolved`
  - Image gallery

### Hall Manager portal

- `/dashboard` — Hall metrics, issue queue, overdue alerts.
- `/dashboard/issues` — Issues in assigned halls with filters and sorting.
- `/dashboard/issues/[id]` — Issue detail with actions:
  - Acknowledge / Reject / Request clarification
  - Change priority
  - Close issue if resolved (or let it auto-close after the dispute window)
  - View event history and comments

### Maintenance portal

- `/dashboard` — Acknowledged issues count, resolved today, open issues.
- `/dashboard/work-orders` — Issues in assigned halls.
- `/dashboard/work-orders/[id]` — Issue detail with actions:
  - Mark `resolved`
  - View location and existing report images
  - Do not claim resolution notes or completion photos are saved until the backend persists the status message and supports resolution evidence

### University / System Admin portal

- `/dashboard` — Cross-hall analytics from `GET /analytics/overview` with charts.
- `/dashboard/analytics` — Cross-hall analytics.
- `/dashboard/audit-logs` — Audit log viewer with filters.
- `/dashboard/users` — User list with role filter.
- `/dashboard/settings` — System configuration (system-admin only).

## Image upload flow

The backend does **not** accept image binaries. Implement this exact flow:

1. Call `POST /api/v1/uploads/signature`.
2. Use the returned `signature`, `timestamp`, `apiKey`, `folder`, and `cloudName` to upload directly to Cloudinary from the browser.
3. Send the returned Cloudinary URL in `imageUrls` when creating the issue.
4. Validate the URL is HTTPS and from the allowed Cloudinary domain before submission.
5. Show upload progress, previews, and remove buttons.

## Issue status workflow UI

Visually represent the issue lifecycle. Use a stepper or timeline that shows:

```text
Submitted → Acknowledged → Resolved → Closed
```

Allow only the backend-permitted transitions. Disable or hide buttons the current user cannot perform.

- Hall Manager: Acknowledge, Reject, Request clarification, Change priority, Mark resolved, Close resolved.
- Maintenance: Mark submitted, acknowledged, or reopened issues resolved when assigned to the issue's hall; no individual assignment is required.
- Student: Reopen their own resolved issue within the dispute window.
- Acknowledgement records awareness and is not a prerequisite for physical work.
- Assignment is optional metadata and must never gate resolution.

## API integration patterns

- Use a typed API client layer in `lib/api.ts`.
- Wrap queries/mutations with TanStack Query:
  - Queries use `queryKey` arrays and proper caching.
  - Mutations invalidate related queries on success.
- Centralize error handling: show user-friendly messages and log `requestId` from backend errors to the console.
- Use Zod schemas that mirror the backend request shapes.

## State management

- Server state → TanStack Query.
- UI state → React `useState` or `useReducer`.
- Form state → React Hook Form + Zod.
- No Redux unless you can prove it is necessary.

## File and folder structure

```text
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── dashboard/       # shared namespace; content and access vary by role
│   └── layout.tsx
├── components/
│   ├── ui/              # shadcn components
│   ├── layout/          # sidebar, header, mobile nav
│   ├── issues/          # issue cards, timeline, filters
│   ├── forms/           # reusable form fields
│   └── analytics/       # charts
├── hooks/
│   ├── use-auth.ts
│   ├── use-halls.ts
│   ├── use-issues.ts
│   └── use-analytics.ts
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   ├── cloudinary-upload.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── .env.example
└── README.md
```

## Required environment variables

Create `.env.example` with:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api/v1
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## Quality checklist

Before declaring the frontend complete, ensure:

- [ ] TypeScript compiles with `next build`.
- [ ] ESLint passes with no errors.
- [ ] All pages have loading, error, and empty states.
- [ ] Forms validate client-side and display server errors clearly.
- [ ] The app is fully responsive down to 375px width.
- [ ] Every authenticated API call includes `withCredentials: true`.
- [ ] Login/logout and role-based redirects work correctly.
- [ ] Image uploads follow the Cloudinary signed-upload flow.
- [ ] The issue status timeline correctly reflects backend state transitions.

## Deliverables

1. A working Next.js frontend in `/Users/kaeytee/Desktop/Joenick/HostelFix/frontend/`.
2. `README.md` with setup instructions, environment variables, and available scripts.
3. `.env.example` with all required variables.
4. A brief summary of any design decisions or assumptions made.

## Important reminders

- Do not create a signup page. Accounts are seeded or provisioned by administrators.
- Students can report issues in **any** approved University-managed hall location, not just their allocated hall.
- The current backend accepts `hallId` and `room`, then resolves the controlled location server-side.
- Never store JWTs in `localStorage`.
- Read the backend `README.md` and `hostelfix-backend-docs/handoff-next-steps.md` before starting.
