# Lifting Diaries

A web app for logging and reviewing gym workouts. Users sign in, record workouts made up of exercises and sets (reps and weight), and browse what they logged on any given day.

## What's built so far

- **Authentication** — sign in / sign up via Clerk (modal buttons in the shared header, user menu when signed in). Route protection runs through `src/proxy.ts`.
- **Shared layout** — header with the Lifting Diaries logo (top left) and auth controls (top right), used by every page.
- **Dashboard** (`/dashboard`) — a calendar next to a card listing the signed-in user's workouts for the selected date, showing each workout's name, duration, exercise count and set count. If nothing is logged for that day, an "Add a new log" button is shown. The selected date lives in the URL (`?date=yyyy-MM-dd`).
- **Database schema** — Drizzle schema and relations for `exercises` (shared catalog plus user-created), `workouts`, `workout_exercises` and `sets`. Weights are stored in kg.
- **Data layer** — query helpers in `src/data/`, which only ever return the current user's data.

Not built yet: the "add a log" flow (the button links to `/workouts/new`, which doesn't exist yet).

## Technologies

- [Next.js 16](https://nextjs.org) (App Router), React 19, TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) with [shadcn/ui](https://ui.shadcn.com) components (built on Base UI) and lucide icons
- [Clerk](https://clerk.com) for authentication
- [Neon](https://neon.tech) serverless Postgres with [Drizzle ORM](https://orm.drizzle.team) and drizzle-kit migrations
- [date-fns](https://date-fns.org) for date handling and formatting, [react-day-picker](https://daypicker.dev) for the calendar

## Project conventions

Coding standards live in `docs/` and are mandatory:

- `docs/data-fetching.md` — all data fetching happens in server components, through Drizzle helpers in `src/data/` (no raw SQL, no route handlers or client-side fetching). Every query is scoped to the logged-in user.
- `docs/ui.md` — UI is composed from shadcn/ui components only; dates are formatted with date-fns (`do MMM yyyy`).

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file with your credentials:

   ```
   DATABASE_URL=<Neon Postgres connection string>
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<Clerk publishable key>
   CLERK_SECRET_KEY=<Clerk secret key>
   ```

3. Apply the database migrations in `drizzle/` (e.g. `npx drizzle-kit migrate`).

4. Start the dev server at http://localhost:3000:

   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` — development server
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — ESLint
