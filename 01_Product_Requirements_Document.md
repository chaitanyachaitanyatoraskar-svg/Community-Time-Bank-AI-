Product Requirements Document

Defines the scope and requirements for the Community Time Bank AI system

Community Time Bank AI  |  College Project Documentation


# 1  Project Overview

Community Time Bank AI is a web application where community members exchange skills and help using time credits rather than money. A member earns one time credit for each verified hour of help delivered and can spend credits to request help from others.

# 2  Problem and Goal

Many people can offer useful help but lack a simple, trusted way to find nearby requests, coordinate appointments, and recognize contributions. The goal is to make community support visible, fair, and easy to manage through structured requests, AI-assisted matching, and a transparent time-credit ledger.

# 3  Users and Roles


# 4  Core User Journey

Register or log in → build a profile with skills and availability → offer help or request help → receive ranked matches → choose a helper → confirm a booking → complete the service → both parties confirm → time credits transfer → both parties rate the experience.

# 5  Functional Requirements


# 6  Non Functional Requirements

Responsive interface usable on mobile and desktop browsers.

Role-based access control so members cannot access administrative actions or other members private data.

Input validation, password hashing, secure sessions and audit records for credit transactions.

Core pages should load within a few seconds on a normal college-project deployment.

The system should preserve a traceable history of booking and credit changes.

# 7  Scope

The minimum viable product includes member and admin roles, profile and skill management, offers and requests, AI-assisted recommendations, bookings, completion confirmation, time credits, ratings and basic reporting. Payment processing, live chat, exact GPS tracking and native mobile apps are outside the initial scope.

# 8  Success Criteria

A member can complete the end-to-end exchange journey without administrator intervention.

The credit balance changes only after both parties confirm a completed service or an administrator resolves a dispute.

AI recommendations present relevant eligible helpers for a typical request.

An administrator can identify the history of any booking and associated credit transaction.

# 6  Credit Redemption & Community Credit Pool (New MVP Expansion)

6.1 Purpose & Non-Negotiable Principle
To provide active participants who accumulate surplus time credits with meaningful community utility while strictly preserving the core non-monetary principle: 1 verified hour of community assistance = 1 time credit. Direct cash withdrawals, fiat currency conversion, or commercial payouts are strictly forbidden in this MVP.

6.2 Feature 1: Credit Redemption Catalog
• Approved Redemption Categories: Community event passes, partner discounts, vouchers & cafe cards, donated goods, and certified local community services.
• Catalog Browsing: Members can filter by category, view credit cost, available inventory stock, partner name, and expiration dates.
• Balance Verification: Redemptions require sufficient available credits (creditBalance >= option.creditCost).
• Atomic Ledger Deductions: On confirmation, an immutable CreditTransaction record is written (direction: OUTGOING, type: REDEEMED), reducing the member balance and decrementing perk inventory atomically.
• Voucher Verification: Each redemption generates a cryptographically unique alphanumeric voucher code (format: TB-RED-XXXX-YYYY) with a 1-click copy function. Members can view active vouchers in "My Vouchers & History" until redeemed with partners.

6.3 Feature 2: Community Credit Pool
• Altruistic Surplus Donations: Members can donate surplus credits with an optional dedication message. Donations are immediately deducted from the donor's balance and credited to the shared pool balance.
• Public Transparency: All community members can view the total pool balance, cumulative hours donated, and total aid distributed.
• Audited Admin Allocations: Platform administrators can allocate credits from the pool to members in need (e.g., newcomers, elderly neighbors, students facing sudden hardship) accompanied by a mandatory, immutable audit reason.



6.4 Feature 3: Fair Credit Multiplier System
• Core Principle: Every completed hour of community service earns one base time credit.
• Approved Multipliers: Strictly limited to 1.0× (Standard), 1.25× (Intermediate / Certified / Moderate Resources), and 1.5× (Advanced / High Responsibility / Urgent / Specialized Materials). Maximum multiplier in MVP is 1.5×.
• Calculation Formula: final_credit_amount = service_duration_in_hours × approved_multiplier. (e.g. 2 hours of advanced laptop repair @ 1.5× = 3.0 credits; 2 hours of standard physics tutoring @ 1.0× = 2.0 credits).
• Fairness Rules: Multipliers cannot be assigned arbitrarily or based solely on job title. Multipliers must be substantiated by task complexity, required equipment, physical risk, or emergency response.
• Two-Party Transparent Agreement: Both requester and helper see the exact duration, multiplier, and total credits before booking acceptance. The rate (agreed_multiplier) is permanently locked upon acceptance.
• Governance & Category Caps: Admins configure multiplier eligibility and caps per category. All multiplier overrides and policy updates are written to an immutable AdminAuditLog with mandatory justification.


### Table 1

| Role | Primary needs | Permissions |
| --- | --- | --- |
| Member | Create a profile, offer or request help, manage bookings and credits | Own profile, listings, bookings, ratings and wallet |
| Administrator | Maintain trust and handle misuse | Manage users, categories, listings, disputes and reports |


### Table 2

| ID | Requirement | Priority |
| --- | --- | --- |
| FR 01 | Users can register, sign in, sign out, and recover access using secure authentication. | Must |
| FR 02 | Users can create profiles with name, location area, bio, skills, availability and preferred contact method. | Must |
| FR 03 | Users can create, edit, pause and close help offers and help requests. | Must |
| FR 04 | The system recommends suitable matches based on skill/category, availability, location area, rating and relevance. | Must |
| FR 05 | Users can send and accept a booking request with date, time, duration and notes. | Must |
| FR 06 | Bookings progress through requested, accepted, completed, cancelled or disputed states. | Must |
| FR 07 | A confirmed completed hour transfers the agreed time credits to the helper through an immutable transaction record. | Must |
| FR 08 | Users can rate and review each other after a completed booking. | Must |
| FR 09 | Administrators can manage categories, review reports, suspend accounts and resolve disputes. | Should |
| FR 10 | Users receive in-app notifications for matches, booking changes and credit activity. | Should |
| FR 11 | Fair Credit Multiplier System supports approved 1.0x, 1.25x, and 1.5x complexity rates with live breakdown, immutable agreement, and admin audit logging. | Must |
