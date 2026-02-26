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
- Enable OAuth-based authentication (e.g., Naver)
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
    web/          # React 19 + TanStack Router
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

### 3.1 Frontend

- Framework: React 19
- Routing: TanStack Router
- Data Fetching: TanStack Query
- Forms: React Hook Form
- UI: MUI
- HTTP: Axios

Principles:

- No global mutable state unless necessary
- Server state managed only via React Query
- Validation centralized (prefer Zod)
- Loader-based or controlled prefetch strategies
- Avoid unnecessary re-renders

---

### 3.2 Backend

- Framework: NestJS
- Auth: JWT-based
- OAuth: Naver login planned
- Validation: class-validator OR shared Zod
- DB: (TBD — likely relational)
- Storage: S3/MinIO possible future

Principles:

- Clear module boundaries
- DTO layer separate from domain logic
- No business logic inside controllers
- Service layer must be testable
- Avoid circular dependencies

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
2. Do not duplicate types.
3. Do not introduce hidden global state.
4. Do not bypass validation.
5. Always consider scalability.
6. Assume this project will grow into a production system.
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
- Shared contracts must remain consistent.
- Simplicity > Premature optimization.
- The system must remain understandable by humans and agents.

---

End of AGENTS.md
