# Authentication Standards

These standards apply to everything related to authentication and authorization in this project.

## Clerk ONLY (CRITICAL)

**This app uses [Clerk](https://clerk.com/) for ALL authentication.** Use the `@clerk/nextjs` package.

Do **NOT**:

- Build custom auth (custom login forms, password handling, session cookies, JWT handling)
- Add other auth libraries (NextAuth/Auth.js, Lucia, Neon Auth, Supabase Auth, etc.)
- Store passwords, tokens, or session data in our own database

Clerk owns identity. Our database only stores the Clerk user ID (`userId`, a string like `user_2abc...`) as a foreign-key-style column on user-owned records.

## Setup (already in place)

- `ClerkProvider` wraps the app in `src/app/layout.tsx`. Do not add a second provider.
- `src/proxy.ts` runs `clerkMiddleware()` (Next.js 16 uses `proxy.ts` in place of `middleware.ts`). Keep Clerk's middleware in this file.
- Keys live in `.env.local` (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`). Never commit them or hard-code them.

## Getting the current user (server side)

Use `auth()` from `@clerk/nextjs/server` — it is async and MUST be awaited.

```ts
import { auth } from '@clerk/nextjs/server';

const { userId } = await auth();
if (!userId) throw new Error('Unauthorized');
```

- Only the **server** may decide who the user is. Never trust a user ID from props, URL params, search params, form fields, or request bodies.
- Call `auth()` inside `/data` helpers (see `docs/data-fetching.md`) so every query is scoped to the current user. Do not accept a `userId` argument.
- Use `currentUser()` (`@clerk/nextjs/server`) only when you need profile details (name, email, image). Prefer `auth()` when the ID is enough.
- Do NOT use client-side hooks (`useAuth`, `useUser`) to gate data or make access decisions. The client is for display only.

## Protecting pages and routes

- Pages under `/dashboard` (and any other user-specific route) MUST require a signed-in user.
- Protect routes on the server: either in `src/proxy.ts` with `createRouteMatcher` and `auth.protect()`, or by checking `userId` from `auth()` in the server component and calling `redirect('/')` when it is missing.
- Protecting a page is not a substitute for scoping data. `/data` helpers MUST still check `userId` themselves.

```ts
// src/proxy.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});
```

## Sign-in / sign-up UI

- Use Clerk's prebuilt components: `SignInButton`, `SignUpButton`, `UserButton`, and `Show` (all from `@clerk/nextjs`). Do not build custom auth forms.
- Conditionally render by auth state with `<Show when="signed-in">` / `<Show when="signed-out">`, as in `src/app/layout.tsx`.
- Sign-in and sign-up open as **modals** (`mode="modal"`) rather than separate pages.
- Auth UI still follows `docs/ui.md` wherever shadcn/ui offers a matching component (e.g. a `Button` wrapped by `SignUpButton`).

## Redirects

- A signed-in user visiting `/` SHOULD be redirected to `/dashboard`.
- Signed-out users hitting a protected route are sent to sign-in by Clerk; do not hand-roll this.

## Checklist for any new feature touching user data

1. Page is a server component and is protected (proxy or `auth()` check).
2. Data comes from a `/data` helper that calls `await auth()` and scopes by `userId`.
3. No user ID is accepted from client input.
4. No custom auth logic or extra auth libraries introduced.
