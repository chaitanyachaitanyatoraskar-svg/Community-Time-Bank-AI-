Feature Delivery Checklist

Tracks the high priority implementation work for the first usable release

Community Time Bank AI  |  College Project Documentation


# 1  MVP Checklist


# 2  Development Sequence


# 3  Demonstration Scenario

Prepare two member accounts. Member A requests one hour of basic computer help; Member B has the matching skill and availability. Demonstrate the recommendation, booking request, acceptance, both completion confirmations, transfer of one time credit, and mutual ratings. This scenario proves the central value of the project in one short walkthrough.

# 4  Definition of Done

The feature has a working interface, server-side validation and ownership/role checks.

Relevant success and failure cases have been tested.

The feature does not break the booking or credit transaction rules.

The task status and any known limitation are recorded before the demo.

# 6  Delivery Checklist: Credit Redemption & Community Pool

Verification & Delivery Status:
✓ [COMPLETE] Prisma schema migration for RedemptionOption, Redemption, CommunityPool, CommunityPoolDonation, CommunityPoolAllocation.
✓ [COMPLETE] Database seeding with initial pool, sample donations, sample allocations, 6 realistic perk catalog items, and sample voucher.
✓ [COMPLETE] Backend routes: /api/redemptions (catalog, redeem, history, admin CRUD, verify) and /api/community-pool (metrics, donate, allocate).
✓ [COMPLETE] Atomic database transactions with balance validation and double-spend protection.
✓ [COMPLETE] Frontend page /redeem with category filters, live affordability checks, confirmation modal, voucher generator, and history tab.
✓ [COMPLETE] Frontend page /community-pool with hero section, live metrics, donation modal, recent donations feed, and allocation audit log.
✓ [COMPLETE] Wallet page updates with quick links and enhanced transaction ledger badges for redemptions and pool donations.
✓ [COMPLETE] Admin console updates with Redemption Catalog CRUD, voucher validation tool, and Community Pool allocation modal.
✓ [COMPLETE] Strict preservation of non-monetary principle (no cash/fiat withdrawal).
✓ [COMPLETE] Full dark mode and light mode visual verification across all new interfaces.


### Table 1

| Area | Feature | Acceptance condition | Status |
| --- | --- | --- | --- |
| Foundation | Project setup and environment configuration | Client, API and database run locally with documented variables. | Planned |
| Authentication | Register, login, logout and member/admin roles | Protected routes reject unauthenticated or unauthorized users. | Planned |
| Profiles | Profile, skills, area and availability editing | Members can save and view their public profile. | Planned |
| Listings | Create, edit, pause and close offers/requests | Only the owner can change their listing. | Planned |
| Matching | Rank and show eligible recommended helpers | Results show fit information and exclude inactive users. | Planned |
| Bookings | Request, accept, cancel and view bookings | Only participants can change valid booking states. | Planned |
| Time credits | Confirm completion and create ledger transfer | A transfer occurs once after the required confirmations. | Planned |
| Ratings | Submit post-completion ratings | Ratings are limited to completed booking participants. | Planned |
| Administration | Manage categories and resolve reports | Admin actions are restricted and auditable. | Planned |
| Quality | Responsive layout and essential end-to-end tests | Core journey works on desktop and mobile widths. | Planned |


### Table 2

| Phase | Deliverables |
| --- | --- |
| 1  Plan and data | Requirements, schema, wireframes, stack setup. |
| 2  Member foundation | Authentication, profile, skills and availability. |
| 3  Community exchange | Offers, requests, matching and booking states. |
| 4  Trust loop | Completion, credit ledger, ratings and reporting. |
| 5  Finish | Admin controls, test pass, deployment and demonstration data. |


## Phase 7: Fair Credit Multiplier System
- [x] Prisma Schema updated with Category, Listing, Booking, CreditTransaction multiplier fields and AdminAuditLog model
- [x] Database migration synced and seed populated with realistic multi-level listings, bookings, and audit records
- [x] Backend validation for multipliers strictly in [1.0, 1.25, 1.5] and within category max caps
- [x] Server-side credit calculation: finalCreditAmount = durationHours * agreedMultiplier
- [x] Atomic ledger transfers with base hours, multiplier rate, and reason persistence in ledgerService
- [x] Listing creation UI with complexity chips (1.0×, 1.25×, 1.5×), live calculation preview, and materials toggle
- [x] Service discovery and Find Help with color-coded multiplier badges and rate previews
- [x] Booking modal with live Credit Rate Breakdown box and Fair Rate policy agreement
- [x] Bookings management with agreed rate agreement formula banner and immutable status
- [x] Wallet ledger transaction rows with multiplier badges, hours × rate breakdown, and reason details
- [x] Admin Governance console with Category Multiplier Rules & Caps table, manual audit decision form, and immutable audit trail
- [x] Full test pass: client & server TypeScript build with 0 errors
- [x] Documentation updated across all 5 .docx and .md specification files
