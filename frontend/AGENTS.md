<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Branding

- Render the app identity through `components/shared/brand-logo.tsx`; reusable SVG/PNG exports are in `public/brand/`. Wordmark SVG lettering is outlined and does not require a font download.
- `public/brand/hostelfix-mark.svg` is the master H/checkmark artwork. Keep `app/icon.svg`, the ICO/Apple touch icon, and the 192/512px PNG exports synchronized when changing it.
- Next.js file conventions register the favicon, SVG icon, Apple icon, and manifest. Do not duplicate those links in root metadata; browser theme color belongs in the separate `viewport` export.

## Verification

Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm build`. Check logo contrast on light/dark surfaces and favicon legibility at 16/32/48px when changing branding.

