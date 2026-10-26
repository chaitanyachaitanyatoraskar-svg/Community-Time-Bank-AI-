User Experience Specification

Defines pages navigation user flows and interface behaviour

Community Time Bank AI  |  College Project Documentation


# 1  Information Architecture


# 2  Primary Navigation

Authenticated members see Dashboard, Find Help, Offer Help, My Bookings, Wallet and Profile. A notification icon surfaces match and booking updates. Administrators receive an additional Admin link. On mobile, the main actions use a bottom navigation bar or compact menu.

# 3  Key Screen Specifications


# 4  Interaction Rules

Show one clear primary action per page: publish, request booking, accept, confirm completion, or submit rating.

Display booking status consistently using text and accessible color contrast; never rely on color alone.

Do not reveal phone numbers or email addresses until a booking is accepted, unless both members choose to share them.

When completion is confirmed, clearly explain the credit amount before final confirmation.

Provide meaningful empty states, such as no offers yet or no matches found, with a next action.

# 5  Accessibility and Responsive Design

Use readable labels, keyboard-reachable controls, visible focus states and text alternatives for icons.

Use responsive cards and single-column layouts on small screens.

Validate forms inline with plain-language errors and preserve entered values after an error.

# 6  Primary Flow

A member selects Request Help, completes the request form and publishes it. The system displays recommended helpers. The member views a helper profile and sends a booking request. The helper accepts, both see the booking in My Bookings, and each confirms completion after the service. The wallet updates and the rating form becomes available.

# 5  User Experience: Credit Perks & Community Pool

5.1 Perks & Redemption Interface (/redeem)
• Catalog View: Displays modern glassmorphism cards with category badges (Event Pass, Partner Discount, Voucher, Donated Goods, Local Service), credit cost in green, inventory stock counter, partner name, and description.
• Affordability Awareness: If a member lacks sufficient credits, the action button dynamically displays "Needs X More Credits" and disables redemption.
• Confirmation Modal: Clarifies the non-fiat community principle and details before deducting hours.
• Success Modal & Voucher Code: Displays generated voucher code in bold monospace (TB-RED-XXXX-YYYY) with a 1-click copy action.
• History Tab: Dedicated "My Vouchers & History" tab showing past redemptions, active/used status, spent credits, and timestamps.

5.2 Community Credit Pool Interface (/community-pool)
• Hero Banner: Visually striking emerald-to-indigo gradient explaining the solidarity mission.
• Metric Cards: Available Pool Fund (credits), Cumulative Donated (hours), and Assistance Distributed (hours).
• Donation Modal: Quick preset selectors (0.5, 1.0, 2.0, 5.0 hrs), custom input, dedication note, and balance validation.
• Live Feeds: Dual column layout presenting Recent Solidarity Donations and the Traceable Allocation Audit Log.
• Accessibility & Themes: Fully optimized for both light mode and dark mode with high-contrast text and responsive layouts.


### Table 1

| Area | Pages | Purpose |
| --- | --- | --- |
| Public | Landing page, Register, Login, Forgot password | Introduce the platform and onboard members |
| Member workspace | Dashboard, Profile, Skills and availability, Offers, Requests, Matches, Bookings, Wallet, Ratings | Manage exchanges and participation |
| Administration | Admin dashboard, Users, Categories, Listings, Reports and disputes | Maintain platform safety and quality |


### Table 2

| Screen | Essential content and actions |
| --- | --- |
| Dashboard | Credit balance, active bookings, suggested matches, pending actions and quick buttons for Request Help and Offer Help. |
| Profile | Personal details, location area, bio, verified skills, availability, rating summary and edit controls. |
| Create request or offer | Category, title, description, estimated duration, preferred dates, location mode and publish action. |
| Match results | Ranked helper cards with skill fit, rating, availability and explanation of match; user can view profile or request booking. |
| Booking detail | Participants, date/time, duration, notes, status timeline, contact option, cancellation and completion confirmation. |
| Wallet | Available balance, earnings, spending and chronological credit transactions linked to bookings. |
| Admin workspace | Counts, alerts, search/filter tools, account status controls and dispute resolution actions. |


### 4.4 Fair Credit Multiplier User Experience
• Listing Creation: Providers select from standardized complexity chips: Standard (1.0×), Intermediate (1.25×), or Advanced (1.5×). A live calculation box immediately previews: "Duration (X hrs) × Multiplier (Y×) = Total Credits (Z cr)". When choosing a multiplier > 1.0×, an explanation of tools/skills and a materials checkbox are presented.
• Service Discovery & Find Help: Service offer cards prominently display color-coded complexity badges (1.5× Advanced in purple, 1.25× Intermediate in blue, 1.0× Standard in slate) along with materials tags and rate breakdowns.
• Booking Modal: Live rate breakdown demonstrates Base Hours × Multiplier = Total Credits Required, accompanied by a Fair Rate Guarantee notice.
• Bookings Management: Cards display the locked agreed_multiplier, full formula (e.g. 2.0 hrs × 1.5× = 3.0 Credits), and double-confirmation status.
• Wallet Ledger: Transaction rows show credit badges, multiplier rates (e.g. 1.5× Rate), base duration, and audit reason text.
• Admin Governance Console: A dedicated Multiplier Governance & Audit tab provides category eligibility toggles, max multiplier cap selectors, and an immutable administrator audit trail.
