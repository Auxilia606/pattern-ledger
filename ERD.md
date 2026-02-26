# PatternLedger — Database ERD Specification (MVP)

## 1. Overview

PatternLedger is a group-based, pattern-learning personal ledger system.

Core Objectives:

- Naver OAuth-based authentication
- Group-based financial aggregation (e.g., couple / family)
- Account & transaction management
- Rule-based automatic categorization
- Manual override with rule learning
- MariaDB compatible
- Future ML / LLM integration ready

---

2. Design Principles

---

1. Raw transaction data must never be modified.
2. Categorization rules are scoped per group.
3. All statistics must be computed at group level.
4. A user can belong to multiple groups.
5. An account must belong to exactly one group.
6. Rule matching is deterministic and priority-based.
7. The schema must allow future AI-based classification.

---

3. Entities

---

3.1 USER

Description:
Represents an authenticated user via Naver OAuth.

Fields:

- id (bigint, PK, auto_increment)
- naver_id (varchar(100), unique, not null)
- email (varchar(255))
- name (varchar(100))
- profile_image (varchar(500))
- created_at (datetime)
- updated_at (datetime)

---

3.2 GROUP

Description:
Represents a financial aggregation unit (e.g., couple, family).

Fields:

- id (bigint, PK, auto_increment)
- name (varchar(100), not null)
- owner_user_id (bigint, FK -> USER.id)
- created_at (datetime)
- updated_at (datetime)

---

3.3 GROUP_MEMBER

Description:
Many-to-many relationship between USER and GROUP.

Fields:

- id (bigint, PK, auto_increment)
- group_id (bigint, FK -> GROUP.id)
- user_id (bigint, FK -> USER.id)
- role (enum: OWNER, MEMBER)
- joined_at (datetime)

Constraints:

- (group_id, user_id) should be unique.

---

3.4 ACCOUNT

Description:
Bank account belonging to a group.

Fields:

- id (bigint, PK, auto_increment)
- group_id (bigint, FK -> GROUP.id)
- owner_user_id (bigint, FK -> USER.id)
- bank_name (varchar(100))
- account_number (varchar(100))
- nickname (varchar(100))
- created_at (datetime)
- updated_at (datetime)

Notes:

- Account must belong to exactly one group.

---

3.5 TRANSACTION

Description:
Core financial transaction data imported from bank statements.

Fields:

- id (bigint, PK, auto_increment)
- account_id (bigint, FK -> ACCOUNT.id)
- transaction_date (date, not null)
- amount (decimal(15,2), not null)
- type (enum: IN, OUT)
- description (varchar(255)) // raw bank data (immutable)
- normalized_description (varchar(255)) // preprocessed for rule matching
- balance (decimal(15,2))
- category_id (bigint, FK -> CATEGORY.id, nullable)
- auto_match_method (enum: RULE, ML, LLM, nullable)
- auto_match_confidence (decimal(3,2), nullable)
- created_at (datetime)
- updated_at (datetime)

Important:

- description must never be modified.
- normalized_description is generated during import.

---

3.6 CATEGORY

Description:
Group-scoped categorization tree.

Fields:

- id (bigint, PK, auto_increment)
- group_id (bigint, FK -> GROUP.id)
- name (varchar(100), not null)
- parent_id (bigint, FK -> CATEGORY.id, nullable)
- type (enum: INCOME, EXPENSE)
- created_at (datetime)
- updated_at (datetime)

Notes:

- Supports hierarchical categories.

---

3.7 CATEGORY_RULE

Description:
Rule engine table for automatic categorization.

Fields:

- id (bigint, PK, auto_increment)
- group_id (bigint, FK -> GROUP.id)
- keyword (varchar(255), not null)
- match_type (enum: EXACT, CONTAINS, REGEX)
- category_id (bigint, FK -> CATEGORY.id)
- priority (int, default 0)
- created_by_user_id (bigint, FK -> USER.id)
- created_at (datetime)

Rule Engine Logic:

1. Rules are evaluated in descending priority order.
2. Matching is performed against normalized_description.
3. First matching rule wins.

---

3.8 INVITE

Description:
Group invitation mechanism.

Fields:

- id (bigint, PK, auto_increment)
- group_id (bigint, FK -> GROUP.id)
- invited_email (varchar(255))
- token (varchar(255), unique)
- status (enum: PENDING, ACCEPTED, EXPIRED)
- expires_at (datetime)
- created_at (datetime)

---

3.9 TAG (Optional Extension)

Fields:

- id (bigint, PK, auto_increment)
- group_id (bigint, FK -> GROUP.id)
- name (varchar(100))

  3.10 TRANSACTION_TAG (Optional)

Fields:

- transaction_id (bigint, FK -> TRANSACTION.id)
- tag_id (bigint, FK -> TAG.id)

Composite Primary Key:
(transaction_id, tag_id)

---

4. Relationship Summary

---

USER
└── GROUP (owner)
└── GROUP_MEMBER
└── ACCOUNT
└── TRANSACTION
└── CATEGORY
└── CATEGORY_RULE

---

5. Recommended Index Strategy (MariaDB)

---

- INDEX(transaction_date)
- INDEX(account_id)
- INDEX(category_id)
- INDEX(normalized_description)
- INDEX(group_id) on ACCOUNT
- INDEX(group_id) on CATEGORY
- INDEX(group_id) on CATEGORY_RULE

---

6. Normalization Strategy

---

Before rule matching, apply:

1. Remove numbers
2. Remove special characters
3. Convert to lowercase
4. Trim whitespace

Store result in normalized_description.

---

7. Future Extensions

---

- RECURRING_PATTERN table
- Asset / Debt tracking
- ML classification scoring
- LLM explanation layer
- Open Banking API integration

END OF DOCUMENT
