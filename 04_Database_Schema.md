Database Schema

Defines the relational data model and integrity rules

Community Time Bank AI  |  College Project Documentation


# 1  Entity Overview

The model separates user identity, profiles, skills, listings, bookings and credit ledger activity. This supports transparent exchanges and prevents a credit balance from being altered without a recorded reason.

# 2  Core Tables


# 3  Relationship Rules

A user has exactly one profile and may have many skills, listings, availability entries, bookings and transactions.

A listing belongs to one owner and is either an offer or a request.

A booking links one requester and one helper and may reference one listing.

A completed booking can create exactly one normal credit transfer transaction.

Reviews require a completed booking and must not allow a member to review themselves.

# 4  Status Rules


# 5  Integrity and Indexes

Use foreign keys for all ownership and relationship fields.

Use unique constraints for users.email, profiles.user_id, and review author plus booking pairs.

Index active listings by category and type; index bookings by requester_id, helper_id and status.

The credit transaction amount must be positive, linked to a completed booking, and created once only.

# 5  Database Schema Expansion: Redemptions & Community Pool

5.1 Schema Models
1. RedemptionOption: id, title, description, category, creditCost, quantityRemaining, status, partnerName, expiryDate, imageUrl, createdAt, updatedAt.
2. Redemption: id, userId, redemptionOptionId, creditsSpent, voucherCode (unique), status (ACTIVE/USED/EXPIRED/CANCELLED), createdAt, usedAt.
3. CommunityPool: id, name, description, currentBalance, totalDonated, totalAllocated, createdAt, updatedAt.
4. CommunityPoolDonation: id, poolId, donorId, amount, note, createdAt.
5. CommunityPoolAllocation: id, poolId, recipientId, adminId, amount, reason, createdAt.
6. CreditTransaction modifications: Added types REDEEMED, DONATED_TO_POOL, ALLOCATED_FROM_POOL; toUserId made optional (null for pool donations and redemptions).


### Table 1

| Table | Key fields | Relationship and purpose |
| --- | --- | --- |
| users | id, email, password_hash, role, status, created_at | One account per member or administrator. |
| profiles | user_id, full_name, bio, area, contact_preference, average_rating | One-to-one with users; public-facing member details. |
| skills | id, name, category_id | Reusable skill or service tags. |
| user_skills | user_id, skill_id, proficiency | Many-to-many user skills. |
| listings | id, owner_id, type, category_id, title, description, duration_hours, status | An offer or request created by a member. |
| availability | id, user_id, weekday, start_time, end_time | Recurring availability used in matching. |
| bookings | id, listing_id, requester_id, helper_id, start_at, duration_hours, status | Agreement between two members. |
| completion_confirmations | id, booking_id, user_id, confirmed_at | Stores each party confirmation before transfer. |
| credit_transactions | id, booking_id, from_user_id, to_user_id, amount, type, created_at | Immutable ledger entry for earned/spent time credits. |
| reviews | id, booking_id, author_id, subject_id, rating, comment | One review per author per completed booking. |
| reports | id, reporter_id, target_user_id, booking_id, reason, status | Safety and dispute workflow. |
| categories | id, name, description, active | Administrator-controlled service categories. |


### Table 2

| Entity | Allowed values | Rule |
| --- | --- | --- |
| User | active, suspended, pending | Suspended users cannot create listings or bookings. |
| Listing | draft, active, paused, closed | Only active listings appear in match results. |
| Booking | requested, accepted, completed, cancelled, disputed | Completed is final except through a recorded administrative reversal process. |
| Report | open, reviewing, resolved, dismissed | Only administrators change report status. |


### 4. Credit Multiplier & Audit Log Schema Extensions

#### Category Model Extensions
• multiplierEligible: Boolean @default(true) - Indicates whether listings in this category can apply complexity multipliers.
• maxMultiplier: Float @default(1.5) - Upper limit cap for multipliers in this category (1.0, 1.25, or 1.5).

#### Listing Model Extensions
• complexityLevel: String @default("STANDARD") - "STANDARD", "INTERMEDIATE", or "ADVANCED".
• multiplier: Float @default(1.0) - Multiplier applied to base hours (1.0, 1.25, or 1.5).
• complexityExplanation: String? - Justification detailing tools, certifications, or responsibility.
• materialsRequired: Boolean @default(false) - Whether specialized materials or equipment are provided.
• urgencyLevel: String @default("STANDARD") - "STANDARD" or "URGENT".

#### Booking Model Extensions
• agreedMultiplier: Float @default(1.0) - Immutable rate agreed upon by both requester and helper upon booking.
• finalCreditAmount: Float @default(1.0) - Server-calculated total credits (durationHours × agreedMultiplier).

#### CreditTransaction Model Extensions
• baseCreditAmount: Float? - The underlying service duration in base hours.
• multiplier: Float @default(1.0) - Multiplier applied.
• finalCreditAmount: Float? - Total credits transferred.
• transactionReason: String? - Explanatory note or formula for audit transparency.

#### AdminAuditLog Model [NEW]
• id: String @id @default(cuid())
• adminId: String - References User.id of the acting administrator.
• action: String - Action performed (e.g., UPDATE_CATEGORY_MULTIPLIER, OVERRIDE_LISTING_MULTIPLIER, AUDIT_POLICY_REVIEW).
• targetType: String - Target entity type (CATEGORY, LISTING, BOOKING, USER).
• targetId: String - Target entity identifier.
• reason: String - Mandatory justification recorded by administrator.
• oldValue: String? - Previous state/multiplier.
• newValue: String? - Updated state/multiplier.
• createdAt: DateTime @default(now())
