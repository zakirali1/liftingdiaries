# Server Component Standards

These standards apply to all server components (pages, layouts, and other non-`'use client'` components) throughout this project. For data access see `docs/data-fetching.md`, for auth see `docs/auth.md`, and for UI see `docs/ui.md`.

## `params` MUST be awaited (CRITICAL)

**This is a Next.js 15+ project. In pages and layouts, `params` is a `Promise` and MUST be awaited.** Never read properties directly off `params`, and never treat it as a plain object.

- Type `params` as `Promise<{ ... }>`.
- Make the component `async` and `await params` before using any value from it.
- Route params are always strings. Parse and validate them (e.g. `Number(workoutId)` + `Number.isInteger`) before using them, and call `notFound()` when they are invalid.

```tsx
// src/app/dashboard/workout/[workoutId]/page.tsx
import { notFound } from 'next/navigation';
import { getWorkout } from '@/data/workouts';

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  const id = Number(workoutId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const workout = await getWorkout(id);
  if (!workout) notFound();

  // render with shadcn/ui components (see docs/ui.md)
}
```

Do **NOT**:

```tsx
// WRONG: params is a Promise, so this is undefined / a type error
export default async function Page({ params }: { params: { workoutId: string } }) {
  const id = params.workoutId;
}
```

## `searchParams` MUST be awaited too

`searchParams` is also a `Promise` in pages. Type it as `Promise<{ ... }>` and `await` it. Its values are optional strings (or string arrays), so validate them and fall back to a default when they are missing or invalid, as in `src/app/dashboard/page.tsx`.

```tsx
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
}
```

## Other rules

- Server components are `async` functions and fetch data directly by calling `/data` helpers. No route handlers, no client-side fetching (see `docs/data-fetching.md`).
- Never trust `params` or `searchParams` for identity. A record ID from the URL must always be queried together with the current user's ID, inside the `/data` helper.
- Pages under `/dashboard` are server components. Do not add `'use client'` to a page that fetches data. If interactivity is needed, fetch in the server page and pass the result as props to a client component colocated with the route.
- Client components never receive `params` as a Promise from a page. Await it in the server page and pass plain values down as props. If a client component truly needs route params, use `useParams` from `next/navigation`.
- Use `notFound()` (from `next/navigation`) when a requested record does not exist or does not belong to the current user.
- Before writing server component code, check `node_modules/next/dist/docs/` for the current API, as this Next.js version has breaking changes (see `AGENTS.md`).

## Checklist for any new server component page

1. `params` / `searchParams` are typed as `Promise<...>` and awaited.
2. Route params are parsed and validated; invalid values call `notFound()`.
3. Data comes from a `/data` helper scoped to the current user.
4. Missing or non-owned records call `notFound()`.
5. Interactivity lives in a colocated client component that receives plain props.
