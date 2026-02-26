# PatternLedger — ERD Specification (MVP)

## 1. Overview

PatternLedger는 그룹(부부/가족) 기반의 패턴 학습형 개인장부 시스템입니다.

핵심 목표:

- Naver OAuth 기반 로그인
- 그룹 단위 재무 통합
- 계좌/거래 관리
- Rule 기반 자동 분류
- 수동 분류 + 학습
- MariaDB 기반
- 향후 ML/LLM 확장 가능

## 2. Design Principles

1. 거래 원본 데이터는 절대 수정하지 않는다.
2. 자동 분류는 그룹 단위로 동작한다.
3. 모든 통계는 그룹 기준으로 계산 가능해야 한다.
4. 사용자는 여러 그룹에 속할 수 있다.
5. 계좌는 반드시 그룹에 속한다.
6. Rule은 우선순위 기반으로 결정된다.

## 3. Entities

### 3.1 USER

- id (bigint, PK)
- naver_id (varchar, unique)
- email (varchar)
- name (varchar)
- profile_image (varchar)
- created_at (datetime)
- updated_at (datetime)

### 3.2 GROUP

- id (bigint, PK)
- name (varchar)
- owner_user_id (bigint, FK → USER.id)
- created_at (datetime)
- updated_at (datetime)

### 3.3 GROUP_MEMBER

- id (bigint, PK)
- group_id (bigint, FK → GROUP.id)
- user_id (bigint, FK → USER.id)
- role (enum: OWNER, MEMBER)
- joined_at (datetime)

### 3.4 ACCOUNT

- id (bigint, PK)
- group_id (bigint, FK → GROUP.id)
- owner_user_id (bigint, FK → USER.id)
- bank_name (varchar)
- account_number (varchar)
- nickname (varchar)
- created_at (datetime)
- updated_at (datetime)

### 3.5 TRANSACTION

- id (bigint, PK)
- account_id (bigint, FK → ACCOUNT.id)
- transaction_date (date)
- amount (decimal 15,2)
- type (enum: IN, OUT)
- description (varchar) // 은행 원본
- normalized_description (varchar) // 전처리 문자열
- balance (decimal 15,2)
- category_id (bigint, FK → CATEGORY.id, nullable)
- auto_match_method (enum: RULE, ML, LLM, nullable)
- auto_match_confidence (decimal 3,2, nullable)
- created_at (datetime)
- updated_at (datetime)

### 3.6 CATEGORY

- id (bigint, PK)
- group_id (bigint, FK → GROUP.id)
- name (varchar)
- parent_id (bigint, FK → CATEGORY.id, nullable)
- type (enum: INCOME, EXPENSE)
- created_at (datetime)
- updated_at (datetime)

### 3.7 CATEGORY_RULE

- id (bigint, PK)
- group_id (bigint, FK → GROUP.id)
- keyword (varchar)
- match_type (enum: EXACT, CONTAINS, REGEX)
- category_id (bigint, FK → CATEGORY.id)
- priority (int)
- created_by_user_id (bigint, FK → USER.id)
- created_at (datetime)

### 3.8 INVITE

- id (bigint, PK)
- group_id (bigint, FK → GROUP.id)
- invited_email (varchar)
- token (varchar, unique)
- status (enum: PENDING, ACCEPTED, EXPIRED)
- expires_at (datetime)
- created_at (datetime)

### 3.9 TAG (Optional)

- id (bigint, PK)
- group_id (bigint, FK → GROUP.id)
- name (varchar)

### 3.10 TRANSACTION_TAG (Optional)

- transaction_id (bigint, FK → TRANSACTION.id)
- tag_id (bigint, FK → TAG.id)

Composite Primary Key:
(transaction_id, tag_id)

## 4. Relationships Summary

USER
└── GROUP (owner)
└── GROUP_MEMBER
└── ACCOUNT
└── TRANSACTION
└── CATEGORY
└── CATEGORY_RULE

## 5. Recommended Indexes (MariaDB)

CREATE INDEX idx_transaction_date ON transaction(transaction_date);
CREATE INDEX idx_transaction_account ON transaction(account_id);
CREATE INDEX idx_transaction_category ON transaction(category_id);
CREATE INDEX idx_transaction_normalized ON transaction(normalized_description);
CREATE INDEX idx_category_group ON category(group_id);
CREATE INDEX idx_rule_group ON category_rule(group_id);
CREATE INDEX idx_account_group ON account(group_id);

## 6. Normalization Strategy

Before rule matching:

1. Remove numbers
2. Remove special characters
3. Convert to lowercase
4. Trim whitespace

Result is stored in normalized_description.

## 7. Future Extension

- RECURRING_PATTERN table
- Asset / Debt tracking
- ML scoring
- LLM explanation layer
- Open Banking integration

END OF DOCUMENT
