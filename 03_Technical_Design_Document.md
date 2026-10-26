Technical Design Document

Records the chosen technology stack and architecture for implementation

Community Time Bank AI  |  College Project Documentation


# 1  Recommended Stack


# 2  Architecture

The React client calls the Express REST API over HTTPS. The API authenticates each request, applies role and ownership checks, executes matching and booking rules, and reads/writes PostgreSQL through Prisma. The AI matching component ranks eligible offers or members; it does not directly modify balances or bookings. Credit transfers occur only within a server-side database transaction after completion verification.

# 3  Component Responsibilities


# 4  Matching Strategy

Start with a transparent weighted score: category/skill match 40%, availability overlap 25%, location-area compatibility 15%, rating 10%, and past completion reliability 10%. Only include active members with suitable availability and no account restriction. Display a brief explanation such as Matches your gardening request and is available Saturday. Optional semantic similarity can enhance title and description matching later.

# 5  Security and Data Rules

Hash passwords with bcrypt; never store plaintext passwords.

Validate request bodies on the server and authorize every resource action by role and ownership.

Store time-credit movement as append-only transactions; calculate balances from valid ledger entries or maintain a controlled balance with transaction history.

Use database transactions for paired booking completion and credit transfer.

Keep personal contact data private until booking acceptance and limit administrator access to its stated purpose.

# 6  Delivery Milestones


# 6  Technical Design: Redemption Engine & Pool Architecture

6.1 Backend API Architecture
• Redemptions Router (/api/redemptions):
  - GET /options: Retrieves active perks with optional category and status filtering.
  - POST /redeem/:optionId: Atomic credit deduction, inventory decrement, voucher creation, and transaction ledger logging.
  - GET /my-history: Retrieves member's active and past redemptions.
  - POST /options, PUT /options/:id, DELETE /options/:id: Admin catalog management.
  - PATCH /verify/:voucherCode: Admin/Partner voucher validation.
• Community Pool Router (/api/community-pool):
  - GET /: Retrieves pool singleton metrics, recent donations, and allocation records.
  - POST /donate: Deducts user balance and increments pool balance with optional note.
  - POST /allocate: Admin transfer from pool to recipient with mandatory audit reason.

6.2 Atomic Concurrency & Financial Integrity
All credit transactions execute inside Prisma interactive database transactions (prisma.$transaction). If balance is insufficient or inventory is exhausted during the operation, the transaction immediately rolls back, guaranteeing double-spend protection and zero balance corruption.


### Table 1

| Layer | Choice | Reason |
| --- | --- | --- |
| Frontend | React with Vite and Tailwind CSS | Fast development, reusable components and responsive UI. |
| Backend | Node.js with Express | Simple REST API suitable for a college project. |
| Database | PostgreSQL with Prisma ORM | Strong relational integrity for bookings and credit transactions. |
| Authentication | JWT with bcrypt password hashing | Straightforward role-aware sessions and secure password storage. |
| AI matching | Rule-based ranking with optional OpenAI embedding enhancement | Explainable baseline that works without an AI dependency. |
| Deployment | Vercel for frontend and Render or Railway for API/database | Simple student-friendly deployment path. |


### Table 2

| Component | Responsibility |
| --- | --- |
| Client application | Forms, dashboard, match display, booking workflow and member-facing validation. |
| API and service layer | Authentication, authorization, business rules, notifications and REST endpoints. |
| Matching service | Filters candidates and generates an explainable ranking score. |
| Database | Persists members, skills, listings, bookings, reviews, reports and immutable credit transactions. |
| Admin module | Moderation, category management, dispute actions and audit visibility. |


### Table 3

| Milestone | Outcome |
| --- | --- |
| MVP foundation | Authentication, profiles, categories and database. |
| Exchange workflow | Offers, requests, matches and bookings. |
| Trust and rewards | Completion confirmation, credit ledger and ratings. |
| Administration and quality | Moderation, reporting, testing and deployment. |


### 5.4 Fair Credit Multiplier Architecture & Ledger Settlement
• Allowed Rates: Strictly validated on server against ALLOWED_MULTIPLIERS = [1.0, 1.25, 1.5]. Arbitrary client-provided rates are rejected with HTTP 400.
• Category Policy Enforcement: When creating a listing, the category's multiplierEligible flag and maxMultiplier cap are verified.
• Server-Calculated Final Credits: When a booking is requested, the server computes finalCreditAmount = durationHours * agreedMultiplier. Clients cannot dictate transfer totals.
• Double Confirmation & Ledger Settlement: Upon mutual completion confirmation, ledgerService.transferCredits uses booking.finalCreditAmount, transferring the calculated credits and recording baseCreditAmount, multiplier, finalCreditAmount, and transactionReason in CreditTransaction.
• Admin Governance & Audit Logging: Category caps are managed via PATCH /api/admin/categories/:id/multiplier-config. Administrative overrides and policy notes are logged to AdminAuditLog via POST /api/admin/audit-logs/multiplier-decision.
