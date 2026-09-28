# HostelFix Design System

Single source of truth for the visual design and UI/UX of HostelFix, the
University of Ghana hall-maintenance issue reporting and tracking system.

**Rule:** Consult this file before implementing any UI. Do not introduce new
colors, fonts, spacing values, radii, or component behavior without updating
this document first.

**Scope:** HostelFix serves University-managed halls of residence. It is not a
campus-wide facilities system and not a generic admin dashboard. Accounts are
provisioned by administrators — there is no public registration.

---

## 1. Design Philosophy

### Visual direction

"University of Ghana institutional identity + modern service portal UX."

Deep institutional blue carries the brand and primary actions. Gold is a
reserved accent. White surfaces sit on neutral gray. Text is dark and
conservative. Hierarchy comes from typography, spacing, and borders — not
decoration. Red is reserved for genuinely important meanings: destructive
actions, errors, and emergency priority.

### Product personality

Institutional, trustworthy, calm, precise. The interface should feel like an
official university service a student can rely on, and a working tool a hall
manager can process a queue with quickly.

### Institutional vs modern balance

- Institutional: color palette, serif-free conservative typography, restrained
  radius/shadow, formal tone of voice, clear hierarchy.
- Modern: fast reporting flow, responsive reflow, skeleton loading, toasts,
  accessible focus management, role-aware single dashboard.

### UX priorities (in order)

1. Speed of reporting a problem.
2. Visibility of issue status — status is never hidden or ambiguous.
3. Queue throughput for staff (scannable lists, fast transitions).
4. Minimal cognitive load — progressive disclosure, one primary action.
5. Accessibility — WCAG 2.1 AA throughout.

### Information hierarchy

Every screen answers: where am I, what am I looking at, what can I do, what
happens next. Page title → context/metadata → primary action → content →
secondary actions.

### Intentionally avoided

- Gradients, glassmorphism, glow effects, decorative illustration.
- Border radii above 10px on structural surfaces.
- Heavy drop shadows as a layout mechanism.
- Marketing-style hero pages inside the authenticated app.
- Multi-color palettes beyond the documented tokens.
- Animation for decoration.
- Hidden or hard-to-find "Report Issue" action.
- Color alone as a status indicator.

---

## 2. Brand Colors

### Core palette

| Token | Hex | Usage | Hover | Active | Disabled |
|---|---|---|---|---|---|
| `--primary` | `#2F4A75` | UG Blue. Primary buttons, links of consequence, sidebar active accent, brand bar | `#243A5D` | `#1C2F4C` | 40% opacity |
| `--primary-dark` | `#243A5D` | Hover state, pressed emphasis, dark brand surfaces | — | — | — |
| `--primary-light` | `#49658F` | Subtle blue emphasis, selected states on light backgrounds | — | — | — |
| `--primary-tint` | `#E9EEF5` | Active nav background, tinted surfaces | — | — | — |
| `--gold` / `--accent` | `#B79A64` | UG Gold. Accent only: highlights, badges, icons, divider flourishes, unread indicators | `#D0BE95` | `#A08548` | 40% opacity |
| `--gold-light` | `#D0BE95` | Gold hover, highlighted rows | — | — | — |
| `--gold-tint` | `#F4F0E8` | Gold-tinted backgrounds, assigned status bg | — | — | — |
| `--foreground` | `#222222` | Primary text | — | — | — |
| `--text-secondary` | `#666666` | Secondary text, metadata | — | — | — |
| `--text-muted` | `#888888` | Captions, placeholders (never for essential info) | — | — | — |
| `--border` | `#E5E5E5` | Card/input/divider borders | — | — | — |
| `--card` / `--popover` | `#FFFFFF` | All raised surfaces | — | — | — |
| `--background` | `#F7F7F7` | Page background | — | — | — |

Contrast notes:

- `#2F4A75` on `#FFFFFF`: ~8.9:1 — AAA for text and UI.
- `#FFFFFF` on `#2F4A75`: AA/AAA for button labels.
- `#222222` on `#F7F7F7`: ~15:1 — AAA.
- `#666666` on `#FFFFFF`: ~5.7:1 — AA for normal text.
- `#888888` on `#FFFFFF`: ~3.5:1 — large text / non-essential only.
- `#B79A64` on white is ~2.6:1 — **never use gold for text or small icons on
  white**; use it for fills, accents, and on dark surfaces. Gold text is only
  permitted on `#2F4A75`/`#243A5D` backgrounds or at ≥18px bold on white.

### Semantic colors

| Token | Hex | Background | Usage |
|---|---|---|---|
| `--success` | `#1E7B34` | `#E7F4EB` | Resolved/closed confirmations, success toasts |
| `--warning` | `#9A6B00` | `#FBF1D7` | Overdue, reopened, caution alerts (gold-adjacent but darker for AA) |
| `--danger` / `--destructive` | `#B42318` | `#FBE9E7` | Errors, rejections, emergency priority |
| `--info` | `#2563EB` | `#E4EEF7` | Informational alerts, submitted status |

Semantic text uses the foreground hex on its `-bg` background, or white on the
solid hex for badges/buttons. Hover = 8–10% darker; disabled = 40% opacity.

Gold is **not** a CTA color. Primary actions are always UG Blue. Red is never
a brand color — it only appears as `--danger` for destructive actions, errors,
rejections, and emergency priority.

### Charts

`--chart-1` `#2F4A75`, `--chart-2` `#B79A64`, `--chart-3` `#1E7B34`,
`--chart-4` `#2563EB`, `--chart-5` `#666666`. No other chart colors.

---

## 3. Typography

Font stack: `Arial, Helvetica, sans-serif`. No other font family. Monospace
(`ui-monospace, Menlo, monospace`) only for reference numbers/IDs.

| Style | Size | Weight | Line height | Letter spacing | Usage |
|---|---|---|---|---|---|
| Display | 48px | 700 | 1.1 | -0.01em | Public landing headline only |
| H1 | 40px | 700 | 1.15 | -0.01em | Public page titles |
| H2 | 32px | 700 | 1.2 | 0 | Page titles in app |
| H3 | 26px | 700 | 1.25 | 0 | Section headers |
| H4 | 22px | 700 | 1.3 | 0 | Card/group headers |
| Body Large | 18px | 400 | 1.6 | 0 | Issue descriptions, lead text |
| Body | 16px | 400 | 1.55 | 0 | Default text |
| Body Small | 14px | 400 | 1.5 | 0 | Metadata, table cells, secondary |
| Caption | 12px | 400 | 1.4 | 0.01em | Timestamps, hints |
| Label | 14px | 600 | 1.4 | 0 | Form labels |
| Button | 14px | 600 | 1 | 0.01em | All buttons |
| Nav | 14px | 500 | 1.4 | 0 | Sidebar/topbar links |

Mobile scaling (<768px): Display→36px, H1→32px, H2→26px, H3→22px, H4→20px.
Body sizes unchanged — never shrink body text below 14px for readability.

---

## 4. Spacing System

8px base. Tokens: `4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96`.

| Token | Usage |
|---|---|
| 4 | Icon gaps, badge padding |
| 8 | Inline element gaps, tight list spacing |
| 12 | Input padding-y offsets, badge gaps |
| 16 | Card internal padding (mobile), form field gaps |
| 24 | Card padding (desktop), page gutters (desktop) |
| 32 | Between form sections, card grids |
| 40 | Mobile section spacing |
| 48 | Between major blocks |
| 64 | Desktop section spacing |
| 80/96 | Public-page hero/section breaks only |

No arbitrary values. If a layout needs a non-token value, prefer restructuring
the layout.

---

## 5. Layout System

- Content max width: **1200px**, centered.
- Page gutters: 16px mobile, 24px tablet/desktop.
- Section spacing: 40px mobile, 64px desktop (48px inside the dense
  authenticated app).
- Sidebar: 256px fixed on desktop, hidden below 1024px.
- Header: 64px, fixed, white with bottom border.
- Authenticated shell: fixed sidebar + fixed header + scrollable content
  column with max-width container.
- Grids: dashboard stat cards 4→2→1 columns (desktop→tablet→mobile); issue
  cards single column list; detail pages 2-column (content + sidebar rail)
  collapsing to single column below 1024px.

Density: tables and queues are compact (44px rows); forms are comfortable
(16px gaps); dashboards balance both.

---

## 6. Responsive Breakpoints

| Name | Range | Behavior |
|---|---|---|
| Mobile | <768px | Sidebar hidden → drawer; tables → cards; forms stack; stat grid 1–2 col |
| Tablet | 768–1023px | Sidebar hidden → drawer; stat grid 2 col; detail rail stacks below content |
| Desktop | 1024–1279px | Full sidebar; stat grid 4 col; 2-col detail layout |
| Large | ≥1280px | Same as desktop; content capped at 1200px |

Components must reflow, not just shrink. Minimum supported width: 375px.

---

## 7. Border Radius

| Token | Value | Usage |
|---|---|---|
| `sm` | 4px | Inputs, badges, small buttons, table cells |
| `md` | 6px | Buttons, cards, dropdowns |
| `lg` | 10px | Modals, drawers, large cards |
| pill | 9999px | Status/priority badges, tags, filter chips only |

Never 16px+ on structural surfaces.

---

## 8. Shadows

| Token | Value | Usage |
|---|---|---|
| none | — | Default for all surfaces |
| `sm` | `0 1px 2px rgba(0,0,0,0.05)` | Cards, dropdown triggers |
| `md` | `0 4px 12px rgba(0,0,0,0.08)` | Popovers, dropdowns, sticky header on scroll |
| `lg` | `0 8px 24px rgba(0,0,0,0.12)` | Modals, drawers only |

Borders + background contrast do the structural work.

---

## 9. Buttons

Height 40px default (36px compact, 44px on touch-critical mobile actions).
Padding `0 16px`, radius `md` (6px), font Button (14px/600).

| Variant | Fill | Text | Border | Hover | Active | Disabled |
|---|---|---|---|---|---|---|
| Primary | `#2F4A75` | white | none | `#243A5D` | `#1C2F4C` | 40% opacity, no pointer |
| Secondary | `#F7F7F7` | `#222222` | `#E5E5E5` | `#EFEFEF` | `#E5E5E5` | 40% opacity |
| Outline | transparent | `#2F4A75` | `#2F4A75` | `#E9EEF5` bg | `#DDE5EF` | 40% opacity |
| Ghost | transparent | `#222222` | none | `#F7F7F7` bg | `#EFEFEF` | 40% opacity |
| Danger | `#B42318` | white | none | `#962014` | `#7A1B11` | 40% opacity |
| Icon | transparent | `#666666` | none | `#F7F7F7` | `#EFEFEF` | 40% opacity; 40×40px min |

Loading: spinner replaces label icon, button disabled, `aria-busy="true"`,
width preserved.

Focus: 2px `--ring` (`#2F4A75`) outline with 2px offset — always visible.

---

## 10. Form Components

All inputs: height 44px, radius `sm`, border `#E5E5E5`, background white,
text 16px (prevents iOS zoom), label above input (14px/600), hint in caption
below label, error in danger caption below input with `aria-describedby`.

- **Text input / textarea / select:** focus = 2px ring `#2F4A75`, error =
  `#B42318` border + icon + message.
- **Checkbox / radio / toggle:** 20px control, label clickable, group with
  `<fieldset>`/`<legend>`.
- **Search input:** leading icon, clear button, `type="search"`.
- **File/image upload:** dashed-border dropzone, file picker, thumbnail
  previews, per-file progress, remove/retry, camera capture on mobile via
  `accept="image/*"`.
- **Location selector:** hall select + room text input (matches current API:
  `hallId` + `room`).
- **Priority selector:** segmented radio group with per-priority icon and
  plain-language hint (e.g. Emergency — "immediate safety risk").
- **Validation:** inline on blur/submit; summary banner on submit failure;
  never toast-only errors.

Forms are single-column on mobile, may use 2 columns for short fields on
desktop. Required fields marked with `*` and `aria-required`.

---

## 11. Issue Status System

Canonical workflow (adopted product decision):

```
Submitted → Under Review → Assigned → In Progress → Resolved → Closed
```

| Status | Value | Color role | Text | Background | Border | Icon (Lucide) |
|---|---|---|---|---|---|---|
| Submitted | `submitted` | info | `#17558F` | `#E4EEF7` | `#17558F`30 | `FilePlus` |
| Under Review | `under_review` | primary | `#243A5D` | `#E9EEF5` | `#2F4A75`30 | `Search` |
| Assigned | `assigned` | accent | `#7A5C00` | `#F4F0E8` | `#B79A64` | `UserCheck` |
| In Progress | `in_progress` | warning | `#9A6B00` | `#FBF1D7` | `#9A6B00`40 | `Wrench` |
| Resolved | `resolved` | success | `#1E7B34` | `#E7F4EB` | `#1E7B34`40 | `CheckCircle2` |
| Closed | `closed` | neutral | `#666666` | `#F0F0F0` | `#E5E5E5` | `Archive` |

Terminal side states (kept for operational reality):

| Status | Value | Color | Icon |
|---|---|---|---|
| Rejected | `rejected` | danger `#B42318` | `XCircle` |
| Reopened | `reopened` | warning `#9A6B00` | `RotateCcw` |

Rejected issues render as danger badges and appear under closed/terminal
filters. Reopened returns the issue to active queues.

Rules: every status rendering includes **text label + icon** — never color
alone. Badges are pill-shaped (the only pill elements besides tags). Status
colors are identical across cards, tables, timelines, and detail pages.

## 12. Priority System

| Priority | Value | Indicator | Color usage |
|---|---|---|---|
| Critical | `emergency` | `AlertTriangle` icon + bold label | danger `#B42318` left-bar on cards, never badge-fill identical to status |
| High | `high` | `ArrowUp` icon | warning text `#9A6B00` |
| Normal | `normal` | `Minus` icon | secondary text `#666666` |
| Low | `low` | `ArrowDown` icon | muted text `#888888` |

Priority uses inline icon+text, **not** a filled badge — visually distinct
from status. Critical issues also show a 3px danger left border on
cards/rows.

---

## 13. Issue Card

Standard list card (white, border `#E5E5E5`, radius `md`, padding 16/24):

- Top row: Issue title (Body/600) + StatusBadge right-aligned.
- Second row: reference ID (mono caption), category, priority (icon+text).
- Meta row: location (hall + room), reporter, created date, last updated.
- Optional thumbnail (80×80, radius `sm`, object-cover) left-aligned.
- Action: chevron / "View" ghost button.
- Critical: 3px danger left border.

Mobile: stack rows, thumbnail full-width-top or hidden, all metadata wraps.

## 14. Issue Details Page

Layout: 2-column (content 2/3 + rail 1/3) on desktop, stacked on <1024px.

- Header: title, reference ID, StatusBadge + priority indicator, "Report
  Issue"–equivalent contextual action (Reopen / Mark Resolved per role).
- Content column: description, photo gallery (grid 2–3 col, object-cover,
  click → lightbox), timeline (below).
- Rail: location, category, reporter, assignee, department, dates, dispute
  window countdown when resolved.
- **IssueTimeline**: vertical timeline, icon per event, status-colored dots,
  timestamps, actor names. Strongest visual element on the page. Rendered
  accessibly as an ordered list.
- Comments/updates section with input where permitted.

## 15. Reporting Workflow

Single-page form with clear sections (not a wizard — fewer steps is lower
friction):

1. Category (select, required)
2. Location: hall (select) + room (text), required
3. Description (textarea, required, min length)
4. Photos (optional, up to 5)
5. Priority (radio group with plain-language hints, default Normal)
6. Review block: collapsible summary shown above submit on the same page
7. Submit → Confirmation page

Confirmation shows: reference number (mono, copyable), status Submitted,
what-happens-next text, links to "View Issue" and "My Reports".

Flow: `Report → Review → Submit → Confirmation → Track`.

---

## 16. Student/User Dashboard

- Page header: title + one-line description.
- **Report an Issue** FeatureCard (§33) directly below the header — the page's
  primary action, with `report-issue.svg` and a secondary "View my reports" link.
  The header's persistent Report Issue button remains.
- Stat cards (4): Total Reports, Open, In Progress, Resolved.
- Recent issues list (IssueCard ×6).
- Recent-issues empty state is icon-only — the FeatureCard already carries the
  illustration, and a page never shows two illustrations.

## 17. Admin / Staff Dashboard

- Stat cards: Total, New (submitted), Under Review, Assigned, In Progress,
  Resolved (30d), Critical open.
- Charts (Recharts, documented palette only): issues by category (bar),
  issues by hall (bar), status distribution (donut), resolution trend (line).
- Queue table: recent submissions with quick actions.
- Workload panel: assignee → open count.
- Charts only where they inform decisions; no decorative analytics.

## 18. Navigation

- Public: header links — About, How It Works, Help, Contact, Login.
- Authenticated (sidebar, role-filtered):
  - Student: Dashboard, Report Issue, My Reports, Help.
  - Hall manager: Dashboard, Issues Queue, Help.
  - Maintenance: Dashboard, Work Orders, Help.
  - University admin: Dashboard, All Issues, Analytics, Audit Logs, Users.
  - System admin: the above + Settings.
  - Notifications is added to every role once the notification center ships.
- Exactly one nav item is active: the most specific href matching the path
  (`getActiveHref` in `lib/navigation.tsx`).
- **Report Issue** is also a persistent primary button in the header for
  students.
- Breadcrumbs on nested pages (Issues → #HF-1234).
- Active nav: UG Blue left bar + `#E9EEF5` tint background + bold label.
- Mobile: hamburger → left drawer with same nav; bottom-of-drawer user
  section.

## 19. Header

64px, fixed, white, `1px` bottom border `#E5E5E5`. Left: mobile menu trigger
+ HostelFix wordmark (blue square + "HostelFix" bold). Right: notifications
bell (with unread count badge in gold on blue), user menu (name, role,
logout). No oversized institutional crest inside the app.

## 20. Sidebar

256px fixed, white, right border. Brand block at top (60px). Nav groups:
Main / Manage / Account. Icons Lucide 20px + labels 14px/500. Hover:
`#F7F7F7`. Active: `#E9EEF5` bg + `#2F4A75` text + 3px left bar. Collapse:
drawer on <1024px; no icon-only collapse (labels preserve clarity).

## 21. Notifications

- Toast (Sonner): top-right desktop / bottom mobile, 4s, status-colored icon.
- Inline alert: bordered `sm` radius bar with icon, role="alert" for errors.
- Notification item: icon, text, timestamp, unread dot (gold), click →
  related issue.
- Notification center: dropdown list from bell + full page.

## 22. Empty States

`EmptyState` component: illustration (§33) **or** Lucide icon (32px, muted),
title (Body/600), one-sentence explanation, and an action where there is a
meaningful next step. Use an illustration for full-page empty states; use the
icon variant for secondary/embedded lists (e.g. dashboard "Recent Issues").

| Empty state | Where | Visual | Action |
|---|---|---|---|
| No reports yet | Student My Reports | `empty-reports` | Report an Issue |
| Your queue is clear | Hall manager Issues Queue | `resolved` | — |
| No work orders right now | Maintenance Work Orders | `maintenance` | — |
| No issues found | Admin All Issues | `no-results` | — |
| No reports yet (recent) | Student dashboard | icon | — |
| No notifications | Notification center (future) | `no-notifications` | — |

## 23. Loading States

- Page: skeleton layout matching final structure (never blank spinner pages).
- Cards/tables: skeleton rows with shimmer (respect `prefers-reduced-motion`).
- Buttons: inline spinner, label preserved where space allows.
- Initial route loads: centered LoadingState with message.

## 24. Error States

- Form: field-level danger message + icon; submit failure summary banner.
- Network: inline error card with Retry button.
- Permission (403): "You don't have access" page + back-to-dashboard.
- 404: "Page not found" + link home.
- 500/server: "Something went wrong" + Retry + support contact.
- Upload: per-file error with retry/remove.

Every error states what happened and what the user can do next.

## 25. Tables

Header: `sm` bg `#F7F7F7`, caption-weight 600 labels, bottom border. Rows
44px, hover `#FAFAFA`, clickable to detail. Status/priority use their
standard renderings. Pagination: prev/next + page numbers, caption text.
Sorting on date/priority/status headers. Mobile: transform rows to IssueCard
list or horizontal scroll with sticky first column — never shrink to
unreadable.

## 26. Filters

FilterBar: horizontal wrap of select chips (status, category, priority,
hall, date range, assignee). Active filters shown as removable pills.
"Clear all" ghost button. Filters reflect in URL query params.

## 27. Search

Header search (desktop) + contextual search on list pages. Searches issue
ID, title, category, location, reporter. Debounced, shows loading, results
dropdown, "No results" state, ESC clears.

## 28. File Upload

Dropzone: dashed `#E5E5E5` border, `#F7F7F7` bg, icon + "Drop photos or
browse". Max 5 images, 5MB each, JPEG/PNG/WebP. Previews 80×80 thumbs with
remove ×. Per-file progress bar (primary blue fill). Errors inline. Mobile opens
camera/library natively.

## 29. Accessibility

- Target: WCAG 2.1 AA.
- All interactive elements ≥44×44px touch target on mobile.
- Visible 2px focus ring on every focusable element.
- Full keyboard operability: nav, dialogs, drawers, dropdowns, forms.
- Semantic HTML: `nav`, `main`, `header`, `button`, `fieldset/legend`,
  `table` with `th scope`.
- Status always icon + text; priority icon + text.
- Form errors wired with `aria-describedby`/`aria-invalid`.
- `prefers-reduced-motion`: disable shimmer/transitions.
- Images: alt text; issue photos get meaningful alt or `alt=""` if decorative
  adjacent to description.
- Loading/error regions announced via `aria-live` where appropriate.
- Dialogs/drawers: focus trap, ESC close, return focus.

## 30. Icons

Lucide React only. Stroke width 2, sizes 16/20/24. Icons accompany labels;
icon-only buttons require `aria-label` and tooltips where meaning isn't
obvious.

## 31. Images

- Issue photos: `object-cover`, card thumb 80×80, detail grid 4:3, lightbox
  full view.
- Avatars: 32px circle, initials fallback on UG Blue bg.
- Empty image state: bordered placeholder with `ImageOff` icon.
- No stock photos inside the authenticated app. Illustrations follow §33.
- Exception: the login panel uses one real photograph of the Legon campus
  (`public/ug.jpeg`, 520×590, supplied by the project owner), framed at ≤448px
  wide with `sm`–`md` radius and a border, meaningful `alt` text, and
  `loading="eager"`. Do not stretch it full-bleed — the source resolution
  would blur. Replace with a ≥1440px-wide original before any full-bleed use.

## 32. Footer

Public pages only: dark blue `#243A5D` band, white/gold text, columns for
University identity, Help, Contact, Privacy, Terms, Accessibility. The
authenticated app has no footer — workflow space only.

---

## 33. Illustration System

### Style

**Editorial geometric vector.** Flat shapes, no outlines on figures, faceless
people with natural proportions, one soft backdrop shape in `#E9EEF5`, a light
ground shadow, generous negative space, no gradients, no drop shadows. Gold is
an accent (lanyards, pins, badges, sparkles), never the dominant fill. The
illustrations follow the design system; the palette never changes to suit an
illustration.

### Palette (illustrations only)

| Role | Hex |
|---|---|
| Primary / dark / light blue | `#2F4A75` / `#243A5D` / `#49658F` |
| Backdrop tint / soft blue | `#E9EEF5` / `#DDE5EF` / `#CFD6E0` |
| Gold / light gold / gold tint | `#B79A64` / `#D0BE95` / `#F4F0E8` |
| Neutrals | `#FFFFFF` `#F7F7F7` `#E5E5E5` `#666666` `#2A2A2A` (hair, shoes) |
| Skin tones | `#8D5A3B` `#6B4226` `#C68B59` |

Skin tones are the only colors outside the UI token set and are restricted to
illustrations. Characters use a range of darker skin tones, reflecting the
University of Ghana community.

### Source and license

| Item | Detail |
|---|---|
| Primary source | Original artwork authored for HostelFix (project-owned SVG) |
| License | Owned by the project; no third-party terms, no attribution required |
| Secondary sources | None in use |

Research findings (checked 2026-09-23). These determined the approach:

| Library | License summary | Why not used now |
|---|---|---|
| unDraw | Free commercial use, no attribution; prohibits automated download/scraping without consent, and redistribution in packs | Assets must be downloaded manually through undraw.co; closest style fit → recommended swap source |
| DrawKit | Free tier: commercial use, no attribution; no redistribution/templates | Downloaded via site account flow; good fit for maintenance scenes |
| Storyset (Freepik) | Free use requires attribution; automated access prohibited | Attribution requirement + Freepik terms |
| Humaaans / Open Peeps | CC0 public domain | Playful / hand-drawn sketch styles conflict with editorial direction |
| Icons8 Ouch, Blush | Free tiers require attribution/link | Attribution requirement |

**Swapping in library assets:** a designer may replace any file below with a
manually downloaded unDraw or DrawKit illustration (set the unDraw accent to
`#2F4A75`, then hand-adjust secondary fills to the palette above). Keep the
same filename and aspect ratio, record the source/license in the catalog
table, and do not mix libraries — replace the whole set or none of it.

### Catalog

Files live in `frontend/public/illustrations/`. Render only through the
`Illustration` component (`components/shared/illustration.tsx`), which uses
`next/image` (SVGs are auto-unoptimized), sets decorative `alt=""` +
`aria-hidden`, and `loading="eager"` via the `eager` prop for above-the-fold use.

| File | Ratio | Concept | Used on | Swap search term (unDraw / DrawKit) |
|---|---|---|---|---|
| `report-issue.svg` | 4:3 | Student reporting via phone form, location pin | Student dashboard FeatureCard | "mobile app", "form" |
| `issue-tracking.svg` | 4:3 | Student viewing a 4-stage progress tracker | Report Issue "What happens next" aside (≥1024px) | "progress", "tracking" |
| `maintenance.svg` | 4:3 | Staff in gold vest and hard hat at a wall panel | Maintenance Work Orders empty state | "maintenance", "repair" (DrawKit) |
| `resolved.svg` | 4:3 | Repaired sink with verified check seal | Hall manager "queue is clear" empty state | "completed", "done" |
| `campus.svg` | 4:3 | Legon-inspired hall: white walls, tiered roofs, clock tower, palms | Reserved (login now uses the campus photo) | keep original (library campus scenes are not Legon-appropriate) |
| `support.svg` | 4:3 | Student at a hall help desk with staff member | Help page aside (≥1024px) | "help", "support" |
| `empty-reports.svg` | 4:3 | Empty tray, blank form, pen | Student My Reports empty state | "empty", "no data" |
| `no-results.svg` | 4:3 | Magnifier over empty list rows | Admin All Issues empty; future search/filter no-results | "search", "not found" |
| `submission-success.svg` | 4:3 | Paper plane sent, check badge | Submission confirmation SuccessState | "sent", "confirmation" |
| `no-notifications.svg` | 4:3 | Quiet bell | Reserved: notification center (not yet built) | "notifications" |
| `audit-trail.svg` | 4:3 | Ledger page with sealed check mark | Audit Logs empty state | "records", "audit log" |
| `users-directory.svg` | 4:3 | Roster card with two member rows and an add-person seal | Admin Users page overview + empty state | "team", "directory" |

All assets are 0.9–2.7 KB hand-written SVG, with no raster data and no scripts.

### Components

- `Illustration`: the only way to render catalog assets.
- `EmptyState`: accepts `illustration`; falls back to an icon.
- `FeatureCard`: asymmetric card, text left + illustration right, gold left
  rule, one primary action + optional text link. Illustration hidden <640px
  so the action stays above the fold. Maximum one per page.
- `SuccessState`: `role="status"` confirmation block with illustration.

### Usage rules

- Use illustrations only for empty states, success states,
  help/onboarding, and one dashboard feature card. Never decorate forms,
  tables, detail pages, analytics, audit logs, or error states.
- Max one illustration per page. Secondary lists use the icon empty state.
- Admin interfaces: illustrations only in full-page empty states.
- Sizing: 160–192px wide in empty states, 208–240px in FeatureCard,
  144–176px in SuccessState.
- Supporting asides (Report Issue, Help) and the login photo panel hide below 1024px; on mobile
  the content comes first.
- Every illustrated screen must still work and read well with the
  illustration removed.

---

## Page Inventory

Status: **[live]** implemented route · **[design]** specified, not yet built ·
**[n/a]** excluded by product decision.

### Public
| Page | Status | Notes |
|---|---|---|
| Landing | [n/a] | Product decision: no landing page. `/login` is the entry point and carries the campus photo panel |
| About | [design] | Institutional text page |
| How it works | [design] | 3-step: report → hall acts → resolved/tracked |
| Help | [live] | Authenticated `/dashboard/help`: emergency notice, status glossary, report tips, account info, `support.svg` |
| Contact | [design] | Hall/works contact info |
| Login | [live] | ID + PIN card; ≥1024px adds a left `#E9EEF5` panel with the Legon aerial photo (`public/ug.jpeg`), gold rule, and one-line purpose statement; Forgot password link |
| Registration | [n/a] | No public registration — accounts provisioned by administrators |
| Forgot/Reset password | [live] | PIN reset flow |

### User
| Page | Status | Notes |
|---|---|---|
| Dashboard | [live] | §16 spec |
| Report Issue | [live] | §15 single-page form |
| Review Report | [live] | Inline review block on form page |
| Submission Confirmation | [live] | SuccessState on issue details (`?submitted=1`): `submission-success.svg`, reference number, next steps, links |
| My Reports | [live] | IssueCard list + filters |
| Issue Details | [live] | §14 spec incl. timeline |
| Notifications | [design] | Notification center |
| Profile | [design] | Read-only account + hall info |
| Settings | [design] | Notification preferences where supported |

### Administration
| Page | Status | Notes |
|---|---|---|
| Admin Dashboard | [live] | §17 spec |
| All Issues | [live] | Table + FilterBar + search |
| Issue Details | [live] | Shared with user view, adds staff actions |
| Assign Issue | [live] | Action on detail page (optional, non-blocking) |
| Manage Categories | [design] | Only if backend endpoints exist — else omitted |
| Manage Locations | [design] | Hall/room administration where supported |
| Manage Departments | [design] | Where supported |
| Users | [live] | Admin user management |
| Analytics | [live] | Charts per §17 |
| Audit Logs | [live] | Table view |
| Settings | [live] | System admin only |

**Honesty rule:** pages marked [design] must not be linked in navigation until
implemented. No fake functionality, no lorem ipsum, no dummy data where real
API data exists.

---

## UX Rules

- Every screen has one clear primary action.
- Issue status is visible wherever an issue appears.
- Reporting an issue is never more than one click away for students.
- Progressive disclosure: details on demand, queues scannable.
- Emergency copy reminds users that urgent safety issues should also be
  reported to hall staff directly — the app never delays emergency response.

## Design Audit Checklist

Before shipping any screen:

- [ ] Colors match tokens; no off-palette values
- [ ] Arial/Helvetica only; correct scale sizes
- [ ] Spacing uses 8px tokens
- [ ] Radius ≤10px; pills only on badges/chips
- [ ] Shadows per §8
- [ ] Status = icon + text, consistent colors everywhere
- [ ] Priority visually distinct from status
- [ ] Primary action obvious; Report Issue reachable
- [ ] Forms labeled, errors inline, keyboard accessible
- [ ] Focus ring visible on all interactives
- [ ] Touch targets ≥44px on mobile
- [ ] Reflows correctly at 375px / 768px / 1280px
- [ ] Loading, empty, error states implemented per §§22–24
- [ ] No lorem ipsum, no fake data, no dead nav links
- [ ] Reduced-motion respected
- [ ] Illustrations: purposeful, one per page max, from §33 catalog, decorative `alt=""`, page still works without them
