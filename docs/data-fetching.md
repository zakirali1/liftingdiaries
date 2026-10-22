# Data Fetching Standards

These standards apply to all data fetching and database access throughout this project.

## Server components ONLY (CRITICAL)

**ALL data fetching in this app MUST be done via server components.** This is incredibly important.

Data must **NOT** be fetched via:

- Route handlers (`app/api/**/route.ts`)
- Client components (`'use client'`), including `useEffect`, SWR, React Query, or `fetch` calls from the browser
- Any other mechanism

The ONLY permitted way to fetch data is to call a helper function from a server component (page, layout, or other server component) and pass the result down as props where needed.

## Database queries: `/data` helper functions ONLY

All database queries MUST live in helper functions inside the `/data` directory (`src/data/`, via the `@/data/*` alias). Server components call these helpers; they must never query the database directly.

- Helpers MUST use **Drizzle ORM** to query the database (using `db` from `@/db`).
- **DO NOT USE RAW SQL.** No `sql` template literals for whole queries, no raw query strings, no `db.execute` with hand-written SQL. Use Drizzle's query builder / relational query API.
- Organize helpers by domain (e.g. `src/data/workouts.ts`).

## User data isolation (CRITICAL)

**A logged-in user can ONLY access their own data.** They MUST NOT be able to access any data belonging to any other user. This is incredibly important.

- Every `/data` helper that reads or writes user-owned data MUST scope the query to the current user's ID (e.g. `where: { userId }` / `eq(table.userId, userId)`).
- Get the user ID from Clerk's `auth()` (`@clerk/nextjs/server`) **inside the helper**. If there is no authenticated user, throw or return nothing — never fall back to unscoped queries.
- Do NOT accept a `userId` argument from callers, URL params, search params, or any client-supplied input as the source of truth for who the user is.
- When fetching by a record ID (e.g. a workout ID from the URL), the query MUST also filter by the current user's ID, so another user's record can never be returned by guessing an ID.
- Applies to nested/related data too: queries through relations (workout exercises, sets, etc.) must be reachable only through a parent record owned by the current user.
- Mutations (insert/update/delete) follow the same rule: always constrain by the current user's ID.

### Example

```ts
// src/data/workouts.ts
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';

export async function getWorkouts() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  return db.query.workouts.findMany({
    where: { userId },
    orderBy: { startedAt: 'desc' },
  });
}

export async function getWorkout(workoutId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // Filter by BOTH the record ID and the current user's ID
  return db.query.workouts.findFirst({
    where: { id: workoutId, userId },
  });
}
```

```tsx
// src/app/dashboard/page.tsx (server component)
import { getWorkouts } from '@/data/workouts';

export default async function DashboardPage() {
  const workouts = await getWorkouts();
  // render with shadcn/ui components (see docs/ui.md)
}
```
