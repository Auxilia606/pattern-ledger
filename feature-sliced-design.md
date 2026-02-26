# Feature-Sliced Design Guide (Pattern Ledger)

This document defines the FSD standard for `apps/web`, based on [FSD Overview](https://fsd.how/docs/get-started/overview/).

## 1) Goals

- Build a frontend architecture that is resilient to changing business requirements.
- Organize code around domain concepts for better navigation and maintainability.
- Enforce layer/slice boundaries to reduce coupling.

## 2) Scope

- Target: `apps/web/src`
- Principle: FSD is applied inside the `web` app.
- Shared monorepo assets are treated as external shared contracts.
- Allowed shared packages: `@ledger/types`, `@ledger/ui`

## 3) Layer Rules

Use standard FSD layers in this order:

1. `app`: app bootstrap, global providers, routing setup, global styles
2. `pages`: route-level screens
3. `widgets`: large UI blocks composed on pages
4. `features`: user-facing behavior units
5. `entities`: domain entities (`transaction`, `ledger`, `category`, etc.)
6. `shared`: generic UI, utilities, config, API client

Do not use `processes` (deprecated in FSD).

## 4) Base Directory Structure

```txt
apps/web/src/
  app/
    providers/
    router/
    styles/
    index.tsx
  pages/
    ledger-list/
      ui/
      model/
      index.ts
  widgets/
    transaction-table/
      ui/
      model/
      index.ts
  features/
    classify-transaction/
      ui/
      model/
      api/
      index.ts
  entities/
    transaction/
      ui/
      model/
      api/
      lib/
      index.ts
  shared/
    api/
    ui/
    lib/
    config/
    model/
```

## 5) Slice and Segment Rules

- `app` and `shared` are organized by segments directly (no slices).
- `pages/widgets/features/entities` must follow `slice -> segment`.
- Recommended segments:
  - `ui`: components, styles, presentation logic
  - `model`: schemas, hooks, state, business rules
  - `api`: request functions, DTO mapping
  - `lib`: local helper utilities
  - `config`: local configuration

## 6) Import Direction (Core Rule)

- Higher layers may import only lower layers.
- Do not directly import internals of another slice in the same layer.
- All external slice access must go through `index.ts` (Public API).

Allowed example:

```ts
import { TransactionCard } from "@/entities/transaction";
import { useClassifyTransaction } from "@/features/classify-transaction";
```

Forbidden example:

```ts
// Direct internal imports across slices in the same layer
import { x } from "@/features/a/model/internal";
import { y } from "@/features/b/model/usecase";
```

## 7) Public API Rules

- Every slice root must have an `index.ts`.
- Re-export only the minimum required surface for external use.
- Never expose internal modules such as `model/internal` or `api/private`.

## 8) Pattern Ledger Domain Mapping

- `entities`
  - `user`, `group`, `membership`, `ledger`, `transaction`, `category`, `classification-rule`
- `features`
  - `import-transactions`, `classify-transaction`, `edit-category`, `join-group`
- `widgets`
  - `transaction-table`, `ledger-summary`, `category-distribution-chart`
- `pages`
  - `dashboard`, `ledger-detail`, `group-settings`, `login`

## 9) Stack Integration Rules (Web)

- Server state: encapsulate TanStack Query usage in `shared/api` or per-slice `api/model`.
- Routing: keep TanStack Router files as composition points for `pages`.
- Forms: place React Hook Form + Zod validation in slice `model` when possible.
- HTTP: create Axios instances only in `shared/api`.
- Types: avoid duplicated API contracts; prefer `@ledger/types`.

## 10) Naming Rules

- Use business terms for slice names (`transaction`, `ledger`).
- Use lowercase kebab-case for files/directories.
- Use semantic UI component names (`TransactionRow`, `LedgerSummaryCard`).

## 11) Adoption Plan (Current Project)

1. Stabilize `app` and `shared` first.
2. Split existing screens into `pages` and `widgets`.
3. Extract high-coupling logic into `entities` and `features`.
4. Remove direct cross-slice imports and replace them with Public APIs.

## 12) Prohibited Patterns

- Relative imports that cross layer boundaries
- Direct `server` implementation imports from `web`
- Duplicated DTO/type definitions
- Reverting to giant buckets like `components` or `utils`

## 13) PR Checklist

- Is each new file placed in the correct layer?
- Is external slice access limited to `index.ts`?
- Are there no direct cross-slice internal imports within the same layer?
- Are shared contracts reused via `@ledger/types`?
- Is route/page composition responsibility kept at the `app/pages` boundary?
