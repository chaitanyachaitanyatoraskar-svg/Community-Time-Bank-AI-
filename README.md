# Community Time Bank AI 🤝⏰

> **Third Year Software Engineering Capstone Project**  
> An AI-powered civic skill and mutual aid exchange platform where community members trade verified time credits (1 verified hour = 1 base credit) rather than fiat currency.

---

## 📌 Project Overview & Description

**Community Time Bank AI** is a decentralized mutual-assistance and civic reciprocity platform designed to empower neighborhoods, universities, and localized communities. In traditional market economies, access to vital services—such as tutoring, technical support, home repairs, elder care, and language coaching—is constrained by financial wealth. 

Community Time Bank AI replaces commercial currency with an **audited, non-monetary time-credit ledger**. Every member’s time is fundamentally valued equally: **one hour of verified community assistance earns one base time credit**, which can then be spent to request help from any other member.

To support real-world skill complexities without encouraging predatory price inflation, the platform introduces a bounded **Fair Credit Multiplier System (capped at 1.5×)**, an explainable **5-Factor AI Matching Engine**, an **Immutable Double-Confirmation Ledger**, a **Community Solidarity Credit Pool**, and a **Local Partner Perks Redemption Desk**.

---

## 🌟 Key Features & Architectural Capabilities

### 1. ⚖️ 1:1 Base Credit Parity & Fair Multipliers
- **Core Principle**: 1 hour of verified service equals 1.0 base time credit. Direct cash conversion or monetary payouts are strictly prohibited.
- **Audited Multiplier Tiers**:
  - **Standard (1.0×)**: Peer tutoring, conversational practice, general neighborhood errands.
  - **Intermediate (1.25×)**: Certified instruction, complex troubleshooting, moderate physical effort/tools.
  - **Advanced Cap (1.5×)**: Component repair, hazardous tools, accredited translation, certified life-safety support.
- **Formula**: $\text{Final Credits} = \text{Duration (Hours)} \times \text{Agreed Multiplier}$
- **Immutable Consent**: Multipliers are explicitly previewed and permanently locked upon mutual booking acceptance.

### 2. 🧠 5-Factor Explainable AI Matching Engine
When a member posts a request, the engine evaluates available providers using a weighted multi-criteria algorithm:
- **Category & Skill Fit (40%)**: Semantic skill similarity and verified member competencies.
- **Schedule Overlap (25%)**: Real-time calendar availability alignment (weekdays/weekends/evenings).
- **Geographic Proximity (15%)**: Neighborhood and campus proximity scoring.
- **Reputation & Ratings (10%)**: Historical peer 5-star review average.
- **Reliability & Completion Rate (10%)**: Historical ratio of accepted to fulfilled bookings.
- **Explainable Rationale**: Generates transparent, human-readable match explanations (e.g., *"Matches Python request • Available Saturday • Highly rated (5.0★)"*).

### 3. 🔐 Double-Confirmation Ledger Protocol
- **Zero Exploitation**: Credits are never transferred automatically or unilaterally.
- **Mutual Sign-off**: Both the Requester and Helper must independently click **"Confirm Completion"** after a session.
- **Atomic Database Transaction**: Once both confirmations are registered, Prisma executes an atomic transaction transferring credits, updating balances, and creating an immutable `CreditTransaction` audit record.
- **Celebratory Feedback**: Integrated `canvas-confetti` celebration upon final verified completion.

### 4. 🌱 Community Credit Pool (Solidarity Fund)
- A collective time reserve where members can donate surplus credits.
- Provides emergency relief credits to seniors, students, and newcomers facing temporary credit deficits.
- Features transparent allocation metrics, traceable audit logs, and an administrator grant interface.

### 5. 🎁 Local Partner Perks & Voucher Redemption (`/redeem`)
- Members with surplus hours can redeem credits for campus event passes, local cafe vouchers, book discounts, and donated goods.
- Generates secure, 1-click copyable redemption codes (`TB-RED-XXXX-YYYY`) with real-time stock inventory tracking.

### 6. 🛡️ Administrative Multiplier Governance & Audit Desk
- Category eligibility toggles and ceiling adjustments (`maxMultiplier`).
- Complete administrative dispute desk and immutable audit trail (`AdminAuditLog`).

### 7. 🎨 Warm Editorial & Neo-Brutalist Design System
- Built with a publication-grade aesthetic: **Warm Ivory (`#F7F4EC`)**, **Charcoal Print (`#111111`)**, **Canary Highlighter (`#FFD21C`)**, and **Forest Green (`#123D32`)**.
- Typographic harmony: **Instrument Serif** (Headings), **DM Sans** (Body/UI), and **Caveat** (Handwritten human notes).
- Strict **0px border-radius** and tactile neo-brutalist offset drop shadows (`shadow-[8px_8px_0px_0px_#111111]`).

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **Backend API** | Node.js, Express.js REST API, TypeScript, JSON Web Tokens (JWT), Bcrypt.js |
| **Database & ORM** | Prisma ORM, SQLite (local zero-config) / PostgreSQL (production-ready) |
| **Architecture** | Monorepo structure, Concurrent dev scripts, Atomic ACID transactions |

---

## 📁 Repository Structure

```
TY-PROJECT-2/
├── client/                     # React 18 Frontend Application (Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components (Sidebar, TopHeader, BookingModal, etc.)
│   │   ├── context/            # Global state (AuthContext, ThemeContext)
│   │   ├── pages/              # Application views (Dashboard, FindHelp, Bookings, Wallet, etc.)
│   │   ├── services/           # Axios API client bindings
│   │   ├── types/              # TypeScript models & interfaces
│   │   ├── App.tsx             # Route definitions
│   │   └── index.css           # Editorial typography & Tailwind base styles
│   ├── tailwind.config.js      # Design tokens (Ivory, Charcoal, Editorial Yellow, Forest)
│   └── package.json
├── server/                     # Express.js REST API Backend
│   ├── prisma/
│   │   ├── schema.prisma       # Complete relational database models
│   │   ├── seed.ts             # Deterministic seed data with demo accounts
│   │   └── migrations/         # Database migration history
│   ├── src/
│   │   ├── routes/             # API routes (auth, listings, bookings, wallet, pool, etc.)
│   │   ├── services/           # Matching algorithm & ledger services
│   │   ├── middleware/         # JWT authentication & role-based access control
│   │   └── server.ts           # Express server entry point
│   └── package.json
├── design.md                   # Complete Design System & 10-Slide PPT Blueprint
├── walkthrough.md              # Technical verification & feature walkthrough
├── package.json                # Root concurrently script runner
└── README.md                   # Project documentation
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone & Install Dependencies
```bash
# In the repository root directory:
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 2. Database Migration & Seeding
```bash
# Push database schema and populate sample demo accounts:
npm run seed
```

### 3. Launch Development Environment
```bash
# Starts both the backend API and frontend client concurrently:
npm run dev
```

* **Frontend Client**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5001](http://localhost:5001)

---

## 🧪 Interactive Live Demonstration Walkthrough

Use the persistent **Demo Switcher Bar** at the top of the interface for instant, 1-click role transitions:

| Step | Persona | Action & Screen | Expected System Behavior |
| :---: | :--- | :--- | :--- |
| **1** | **Alice (Member A)** | Click **Member A** → Open **Find Help** | Alice has 4.0 credits. Searches for computer help. |
| **2** | **Alice (Member A)** | Inspect AI Match Cards | **Bob Smith** is ranked with a **95% AI Match** badge and an explainable fit breakdown. |
| **3** | **Alice (Member A)** | Click **Request Help & Schedule** | The live calculation box previews: `2.0 hrs × 1.0× = 2.0 credits`. Submit request. |
| **4** | **Bob (Member B)** | Click **Member B** → Open **My Bookings** | Bob sees Alice’s pending booking. Bob clicks **Accept Booking**. |
| **5** | **Both Members** | Double-Confirmation Sign-off | Alice and Bob independently click **Confirm Completion**. |
| **6** | **Ledger Engine** | Automatic Balance Transfer | Confetti fires! 2.0 credits transfer atomically from Alice to Bob. Transaction logged in **Wallet**. |
| **7** | **Alice (Member A)** | **Redeem Perks** (`/redeem`) | Alice browses campus cafe vouchers and redeems credits for a partner code. |
| **8** | **Bob (Member B)** | **Community Pool** (`/community-pool`) | Bob donates 1.0 surplus credit to the solidarity mutual aid fund. |
| **9** | **Admin** | Click **Admin** → Multiplier Governance | Inspect platform metrics, category multiplier caps, and the immutable audit trail. |

---

## 👥 Demo Credentials

| Role | Name | Email | Password | Starting Credits |
| :--- | :--- | :--- | :--- | :--- |
| **Requester (Member A)** | Alice Johnson | `alice@example.com` | `password123` | 4.0 Credits |
| **Helper (Member B)** | Bob Smith | `bob@example.com` | `password123` | 5.0 Credits |
| **Administrator** | Admin User | `admin@example.com` | `password123` | N/A (Admin Role) |

---

## 📄 Documentation Links

- [Technical Design Document](file:///Users/chaitanya/ANITIGRAVITY/TY-PROJECT-2/03_Technical_Design_Document.md)
- [Product Requirements Document](file:///Users/chaitanya/ANITIGRAVITY/TY-PROJECT-2/01_Product_Requirements_Document.md)
- [User Experience Specification](file:///Users/chaitanya/ANITIGRAVITY/TY-PROJECT-2/02_User_Experience_Specification.md)
- [Design System & 10-Slide PPT Guide](file:///Users/chaitanya/ANITIGRAVITY/TY-PROJECT-2/design.md)
- [Feature Walkthrough & Verification](file:///Users/chaitanya/ANITIGRAVITY/TY-PROJECT-2/walkthrough.md)
