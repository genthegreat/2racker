# 2racker Agent Guide

## Purpose

2racker is a payment-plan tracker. Users create accounts (the organisation being paid), group work under projects, define project amenities, and record transactions against those amenities. The dashboard aggregates account totals so a user can see amounts due, paid, and remaining.

## Stack and commands

- Next.js 14 App Router, React 18, TypeScript (strict mode), and Tailwind CSS.
- Supabase provides authentication, PostgreSQL data, and profile storage.
- React Hook Form with Zod handles client-side form validation; server actions validate again before writes.
- SendGrid handles the contact form and Cloudflare Turnstile protects auth/contact flows.

```bash
npm run dev
npm run lint
npm run build
npm run start
```

There is currently no automated test suite. At a minimum, run `npm run lint`; run `npm run build` for changes that affect routes, types, or server/client boundaries.

## Repository map

```text
src/app/                 App Router pages, route handlers, and server actions
src/app/<resource>/      Account, project, amenity, and history CRUD flows
src/components/          Shared UI components
src/context/             Browser auth/profile contexts
src/utils/db/            Zod schemas, TypeScript models, and Supabase queries
src/utils/supabase/      Browser, server, and middleware Supabase clients
src/middleware.ts        Session refresh and protected-route redirect logic
public/                  Static images and favicon assets
```

The `@/` import alias maps to `src/`.

## Domain model

```text
Account (belongs to user)
  `-- Project
       `-- Amenity
            `-- Transaction
```

- `accounts` holds totals (`amount_due`, `amount_paid`, `balance`), status, start date, and `user_id`.
- `projects` belong to accounts; `amenities` belong to projects.
- `transactions` reference both an `account_id` and an `amenity_id`.
- `profiles` is keyed by the Supabase user ID.
- The generated database shape is in `src/utils/db/database.types.ts`; application-facing interfaces and shared `FormState` are in `src/utils/db/types.ts`.

When the Supabase schema changes, update the generated database type definitions, the matching Zod schemas in `src/utils/db/schema.ts`, and any dependent forms/queries together.

## Data and auth conventions

- Use `createClient` from `src/utils/supabase/server.ts` in server actions and route handlers. It reads/writes the request cookie store.
- Use `createClient` from `src/utils/supabase/client.ts` only in client components, hooks, or contexts.
- Keep `src/middleware.ts` aligned with protected app prefixes (`protectedPrefixes`). New authenticated areas must be added there; public pages/APIs are open by default. Middleware still runs broadly so Supabase can refresh session cookies via `getUser()`.
- UI query helpers currently live in `src/utils/db/dbFunctions.ts` and are called by client components. Preserve user scoping for account data and rely on Supabase RLS for database enforcement.
- Never expose service-role credentials. Client-side code may only use public Supabase environment variables.

Required environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SENDGRID_API_KEY
```

`SENDGRID_API_KEY` is read when the SendGrid route module loads; do not import that route from client code.

## Forms and mutations

Each resource normally has:

- a client form under its route (for example `projects/add/addprojectform.tsx`),
- an `actions.ts` file containing `"use server"` mutations, and
- a Zod schema in `src/utils/db/schema.ts`.

For new or changed fields:

1. Update the shared Zod schema and its database/application types.
2. Register the field in the React Hook Form using the right conversion, such as `valueAsNumber` for numeric inputs.
3. Build `FormData` explicitly in the client form.
4. Re-parse/validate it in the server action before calling Supabase.
5. Return the existing `FormState` shape and show the result through the modal/error pattern used by the surrounding form.

Do not trust IDs supplied by the browser for authorization. Server mutations should verify the authenticated user; database RLS policies must enforce ownership across accounts and their related resources.

## UI and code style

- Prefer the App Router's server components by default; add `"use client"` only for browser state, effects, forms, or Supabase browser access.
- Use Tailwind utility classes for most styling. Keep existing component-specific CSS files where a component already uses them.
- Reuse shared UI components (`Modal`, `Spinner`, `PaidTotal`, icons) rather than duplicating their behavior.
- Preserve the project's TypeScript and semicolon style in files you edit. Use `@/` imports for modules under `src`.
- Keep page loading states in the route-level `loading.tsx` files when appropriate.

## API routes and safety

- Validate all JSON/form input with a Zod schema before external calls or database writes.
- Apply `rateLimitMiddleware` to public API routes that can be abused. It is an in-memory per-instance limiter, so do not treat it as a distributed production control.
- Treat SendGrid content as untrusted input; avoid adding raw user HTML to outgoing messages without escaping or sanitising it.
- Do not log passwords, auth tokens, or sensitive form data. Remove temporary debugging logs introduced during development.

## Current implementation details to preserve or revisit deliberately

- Browser auth state is owned by `AuthContext` / `AuthProvider`. Prefer `useAuth()` for session checks on login, forgot-password, and navigation. `ProfileContext` is legacy and not mounted; remaining `useProfileContext` callers on CRUD pages still need migration or a re-enabled profile provider.
- Middleware uses a short protected-prefix allowlist for redirects; `/auth/confirm`, `/api/reset-password`, and other public routes do not need an exclusion list. Password updates must validate the server session with `getUser()`, not a client-supplied auth event. Login/signup actions return `FormState` errors to the form instead of redirecting to `/error`.
- Transaction status options include `rejected`, while the declared Supabase/Zod enum lists `failure`. Align both layers before relying on the status value.
- Multiple account/project/amenity/transaction queries assume Supabase RLS for ownership filtering. Any new cross-resource query needs explicit ownership review.
- Route handlers in `src/app/api/` are public by default; protect sensitive APIs in the handler (e.g. `getUser()`) rather than relying on middleware path lists.

## Before handing off a change

- Run `npm run lint`.
- Run `npm run build` when practical for app, type, routing, Supabase, or configuration changes.
- Check `git diff --check` and ensure generated artifacts, `.env*.local`, and secrets are not included.
