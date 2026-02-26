# AGENTS.md

# Pattern Ledger — AI Agent Development Guidelines

---

## 1. Project Overview

**Pattern Ledger** is a personal finance web application built as a pnpm-based monorepo.

Primary goals:

- Import bank transaction records
- Automatically classify transactions
- Allow user-defined categorization
- Provide statistical dashboards
- Support group-based shared ledgers
- Enable OAuth-based authentication (e.g., Naver, Google)
- Maintain extensibility for admin and analytics modules

This project is designed to be:

- Type-safe
- Domain-driven
- Extensible
- Agent-friendly
- Cleanly modularized

---

## 2. Monorepo Structure

```
pattern-ledger/
  apps/
    web/          # React 19 + TanStack Router (FSD required)
    server/       # NestJS backend
    web-admin/    # (optional future)
  packages/
    types/        # Shared domain types / Zod schemas
    ui/           # Shared UI components / theme
    config/       # ESLint, TSConfig, shared tooling
  tsconfig.base.json
  pnpm-workspace.yaml
```

---

## 3. Architectural Philosophy

### 3.1 Frontend (Web)

- Framework: React 19
- Routing: TanStack Router
- Data Fetching: TanStack Query
- Forms: React Hook Form
- UI: MUI
- HTTP: Axios

### 🚨 Mandatory: Feature-Sliced Design (FSD)

The `apps/web` project **must follow Feature-Sliced Design (FSD)** principles.

Core layers (strict order):

```
app
pages
widgets
features
entities
shared
```

Rules:

1. Lower layers must not depend on upper layers.
2. `entities` must not import from `features`, `widgets`, or `pages`.
3. `features` may depend on `entities` and `shared` only.
4. `widgets` may compose `features` and `entities`.
5. `pages` assemble widgets and features.
6. `app` contains routing, providers, global setup.

Do NOT:

- Create arbitrary folder structures.
- Place business logic inside pages.
- Mix domain logic into shared layer.
- Break layer isolation.

All new frontend code must respect FSD boundaries.

FSD reference documentation will be provided externally and must be followed.

---

### 3.2 Backend

- Framework: NestJS
- Auth: JWT-based
- OAuth: Naver and Google login planned
- Validation: class-validator OR shared Zod
- DB: (TBD — likely relational)
- Storage: S3/MinIO possible future

Principles:

- Clear module boundaries
- DTO layer separate from domain logic
- No business logic inside controllers
- Service layer must be testable
- Avoid circular dependencies
- API request/response contracts that web consumes must be defined in `packages/types`
- Server-only external provider response shapes (e.g., raw OAuth provider payloads) may remain server-local

---

## 4. Domain Model (Core Concepts)

Main domain entities:

- User
- Group
- Membership
- Ledger
- Transaction
- Category
- ClassificationRule

Key design goals:

- A transaction belongs to a ledger
- A ledger belongs to a group
- Users belong to groups
- Classification rules evolve over time
- Unknown patterns require manual classification

---

## 5. Shared Types Strategy

All cross-boundary types must live in:

```
packages/types
```

Preferred approach:

- Define Zod schemas
- Infer TypeScript types from schemas
- Reuse on both frontend and backend
- For server API implementation, if an endpoint contract can be referenced by web, add it to `packages/types` first
- Import shared API contracts from `@ledger/types` in both `apps/server` and `apps/web`

Never duplicate DTO definitions.

---

## 6. Dependency Rules

### 6.1 Installation

- Always use `pnpm`
- Use `--filter` when installing app-specific packages

Example:

```
pnpm add axios --filter web
```

Never install app-specific dependencies at root.

---

### 6.2 Cross-Package Imports

Allowed:

```
@ledger/types
@ledger/ui
```

Not allowed:

- Relative imports crossing app boundaries
- Direct imports from server into web

---

## 7. Code Style Rules

- Strict TypeScript
- No `any`
- Avoid type assertions when possible
- Prefer functional composition
- Avoid over-abstraction early
- Write readable code before clever code
- Prefer explicit over implicit logic

---

## 8. Agent Behavior Guidelines

When generating code:

1. Respect monorepo boundaries.
2. Respect FSD layer boundaries (mandatory for web).
3. Do not duplicate types.
4. Do not introduce hidden global state.
5. Do not bypass validation.
6. Always consider scalability.
7. Keep file structure consistent.
8. Do not introduce heavy frameworks without justification.
9. Do not refactor unrelated modules.
10. Ask before introducing breaking changes.

---

## 9. Future Expansion Awareness

This project may later include:

- Admin panel
- Role-based access
- Statistical forecasting
- AI-based classification improvements
- Multi-currency support
- Import pipelines
- Background job processing

All new design decisions should keep extensibility in mind.

---

## 10. Golden Rules

- Type safety first.
- Domain clarity over quick hacks.
- FSD boundaries are mandatory for web.
- Shared contracts must remain consistent.
- Simplicity > Premature optimization.
- The system must remain understandable by humans and agents.

---

End of AGENTS.md
