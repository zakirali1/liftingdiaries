# Data Mutation Standards

These standards apply to all data mutations (insert, update, delete) throughout this project. For reads, see `docs/data-fetching.md`. For identifying the user, see `docs/auth.md`.

## The two layers (CRITICAL)

Every mutation has exactly two parts:

1. A **helper function** in `src/data/` that wraps the Drizzle ORM call.
2. A **server action** in a colocated `actions.ts` file that validates input and calls the helper.

Data must **NOT** be mutated via:

- Route handlers (`app/api/**/route.ts`)
- Client components calling the database or `fetch` directly
- Server actions or components that call `db` directly, bypassing a `/data` helper

## Mutation helpers: `src/data` ONLY

All database writes MUST live in helper functions inside `src/data/` (via the `@/data/*` alias), organized by domain (e.g. `src/data/workouts.ts`).

- Helpers MUST use **Drizzle ORM** (`db` from `@/db`).
- **DO NOT USE RAW SQL.** Use Drizzle's query builder (`db.insert`, `db.update`, `db.delete`).
- Helpers get the user ID from `await auth()` (`@clerk/nextjs/server`) **inside the helper** and throw if there is none. Do not accept a `userId` argument.
- Updates and deletes MUST filter by BOTH the record ID and the current user's ID, so one user can never modify another user's data. Inserts MUST set `userId` from `auth()`.
- Nested records (exercises, sets, etc.) may only be written through a parent that the current user owns. Verify ownership before inserting.
- Helper params must be typed. Helpers trust their already-validated input; validation happens in the server action.

```ts
// src/data/workouts.ts
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { workouts } from '@/db/schema';

export async function createWorkout(data: { name: string; startedAt: Date }) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const [workout] = await db
    .insert(workouts)
    .values({ ...data, userId })
    .returning();

  return workout;
}

export async function deleteWorkout(workoutId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // Constrain by BOTH the record ID and the current user's ID
  await db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

## Server actions: colocated `actions.ts` ONLY

ALL mutations MUST be triggered through **server actions**, defined in a file named **`actions.ts`** colocated with the route that uses them (e.g. `src/app/dashboard/workouts/new/actions.ts`).

- The file MUST start with `'use server'`.
- The file MUST be named exactly `actions.ts`. No `server-actions.ts`, no actions inside component files, no shared global actions file.
- Server actions call `/data` helpers. They never touch `db` directly.
- Client components import and call the action (e.g. from an event handler or `useTransition`); they do not mutate anything themselves.
- After a successful mutation, refresh affected UI with `revalidatePath` (from `next/cache`).
- **Do NOT call `redirect()` (from `next/navigation`) inside server actions.** Redirects MUST be done client side: `await` the action in the client component, then navigate with `router.push` (from `useRouter`) once it resolves.

```tsx
// client component
startTransition(async () => {
  await createWorkoutAction({ name, startedAt });
  router.push('/dashboard');
});
```

## Typed parameters, NO `FormData` (CRITICAL)

- Every server action parameter MUST have an explicit TypeScript type.
- Server action parameters MUST **NOT** be typed as `FormData`. Call actions with plain typed objects/values instead (e.g. `createWorkoutAction({ name, startedAt })`).
- Prefer a single typed object parameter for actions with more than one field.
- `Date` values are fine as typed params; do not pass dates as hand-formatted strings (see date-fns rules in `docs/ui.md`).

## Zod validation (CRITICAL)

**ALL server actions MUST validate their arguments with [zod](https://zod.dev/)**, even though the parameters are typed. TypeScript types are erased at runtime and server actions are public endpoints; anyone can call them with arbitrary data.

- Define a zod schema in the `actions.ts` file and derive the param type from it with `z.infer`.
- Parse the arguments at the very top of the action, before calling any helper.
- Use `schema.parse` (throws) or `schema.safeParse` (returns an error result for the UI). Never pass unvalidated input to a helper.
- Never accept or validate a `userId` from the client. Identity comes only from `auth()` inside the helper.

```ts
// src/app/dashboard/workouts/new/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createWorkout } from '@/data/workouts';

const createWorkoutSchema = z.object({
  name: z.string().trim().min(1).max(100),
  startedAt: z.coerce.date(),
});

type CreateWorkoutParams = z.infer<typeof createWorkoutSchema>;

export async function createWorkoutAction(params: CreateWorkoutParams) {
  const data = createWorkoutSchema.parse(params);

  const workout = await createWorkout(data);

  revalidatePath('/dashboard');
  return workout;
}
```

## Checklist for any new mutation

1. Drizzle-backed helper in `src/data/`, scoped by `auth()` user ID, no raw SQL.
2. Server action in a colocated `actions.ts` with `'use server'`.
3. Action params are explicitly typed and are **not** `FormData`.
4. Action validates its params with zod before doing anything else.
5. Action calls the helper (never `db`) and revalidates as needed. It never calls `redirect()`; the client navigates after the action resolves.
6. No mutation happens in route handlers or client-side code.
