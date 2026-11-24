# SahkarSathi (सहकारसाथी)
> **Every Worker Matters. Every Home Counts.**  
> *Cooperative Home & Project Services Platform*

---

## 🌟 Overview

**SahkarSathi** is a modern cooperative technology platform that unites homeowners, verified craftspeople, and regional project supervisors into an aligned, self-governing ecosystem. 

Unlike predatory gig-economy platforms that extract high middleman commissions and leave workers unprotected, SahkarSathi provides:
- **For Homeowners**: Direct access to verified trade professionals, standardized transparent pricing, milestone sign-offs, and on-site supervisor oversight.
- **For Workers**: Dignified compensation, zero predatory platform fees, accident and tool safety pools, trade credential verification, and collective cooperative equity dividends.
- **For Supervisors**: Clear digital tooling to coordinate multi-trade projects, inspect site safety, and conduct quality audits.

---

## 🎨 Theme & Design System

The application features a **medium-theme design system** that avoids extreme glare while steering clear of pure dark mode:

| Role | Color Hex | CSS Variable | Purpose |
| :--- | :--- | :--- | :--- |
| **Main Background** | `#F4F3EF` | `--color-bg-main` | Warm, inviting paper-like surface |
| **Secondary Background** | `#E9ECE8` | `--color-bg-secondary` | Elevated cards and subtle controls |
| **Dark Section** | `#202B2B` | `--color-dark-section` | High-contrast contrast cards & footer |
| **Primary Text** | `#243332` | `--color-text-primary` | Deep charcoal for optimal readability |
| **Secondary Text** | `#697674` | `--color-text-secondary` | Accessible secondary typography |
| **Accent Teal** | `#4F9D92` | `--color-accent-teal` | Primary brand action color |
| **Accent Emerald** | `#5D9B78` | `--color-accent-emerald` | Verification badges and trust marks |
| **Highlight Gold** | `#D9B978` | `--color-highlight-gold` | Cooperative equity & keystone highlights |

---

## 🏗️ Interactive 3D Hero Ecosystem

Built with **Three.js**, the hero visual models the SahkarSathi cooperative habitat:
- **Architectural Residence**: Multi-level modern villa featuring cantilevered slate volumes, cedar solar louvers, panoramic reflective glass, living landscape base, and signature teal pavilion pitch with golden keystone spire.
- **Ecosystem Actors**:
  - *Customer Node* (Walkway, Soft Teal with pulsing radius)
  - *Worker Node* (Workshop flank, Emerald with orbital ring)
  - *Supervisor Node* (Elevated beacon, Warm Gold)
- **Cooperative Bezier Arcs**: Glowing quadratic bezier splines dynamically connecting each actor to the home and to one another.
- **Floating Tokens**: 3D hexagonal verification shield with checkmark, precision craftsman tool tokens, and ambient particle dust.
- **Performance**:
  - Automatically lazy-loaded in an independent chunk (`React.lazy` + `Suspense`).
  - Damped mouse parallax with smooth lerp tracking.
  - Interactive pointer drag rotation with inertia.
  - `IntersectionObserver` auto-pauses rendering when out of viewport to preserve GPU and battery.
  - Full high-fidelity 2.5D architectural fallback (`Hero3DFallback.jsx`) when WebGL is unavailable.

---

## 🛠️ Technology Stack

- **Core**: React 18, Vite 6, JavaScript (ESM)
- **Styling**: Tailwind CSS 3, PostCSS, Custom Glassmorphism Utilities
- **Animations**: Framer Motion 11 (with reduced-motion accessibility support)
- **3D Graphics**: Three.js (Procedural geometric PBR materials, soft PCF shadows, ACES tone mapping)
- **Icons**: Lucide React
- **Routing**: React Router DOM 6

---

## 📁 Project Structure

```text
sahkarsathi/
├── public/
│   └── logo.svg                 # Scalable cooperative vector emblem
├── src/
│   ├── assets/                  # Brand and visual assets
│   ├── components/
│   │   ├── common/              # Atomic UI components
│   │   │   ├── Badge.jsx        # Status tags and co-op indicators
│   │   │   ├── BackendNotice.jsx# Phase 1 prototype transparency banner
│   │   │   ├── Button.jsx       # Standardized button variants with micro-interactions
│   │   │   ├── Logo.jsx         # Custom geometric roof + connected hands logo
│   │   │   └── SectionHeading.jsx
│   │   ├── home/                # Homepage section modules
│   │   │   ├── HeroSection.jsx  # Hero layout with metrics strip
│   │   │   ├── Hero3DScene.jsx  # Three.js architectural & actor scene
│   │   │   ├── Hero3DFallback.jsx # 2.5D isometric fallback component
│   │   │   ├── ServicesSection.jsx # 8-card interactive trade catalog
│   │   │   ├── HowItWorksSection.jsx # 3-step interactive milestone flow
│   │   │   ├── CooperativeEcosystemSection.jsx # 4-pillar interaction model
│   │   │   ├── TrustVerificationSection.jsx # 4-step verification standards
│   │   │   └── JoinCTASection.jsx # Dual customer & worker cards
│   │   └── layout/
│   │       ├── Navbar.jsx       # Sticky glass navbar with mobile drawer
│   │       └── Footer.jsx       # Full footer with co-op governance links
│   ├── config/
│   │   └── brand.js             # Centralized brand identity and metadata
│   ├── pages/
│   │   ├── Home.jsx             # Complete homepage
│   │   ├── Services.jsx         # Service catalog with category search & filter
│   │   ├── SignIn.jsx           # Role-based portal login (Customer/Worker/Lead)
│   │   ├── BookService.jsx      # 3-step interactive service scheduler
│   │   ├── WorkerJoin.jsx       # Cooperative worker enrollment application
│   │   ├── Projects.jsx         # Multi-room renovation & project scoping
│   │   ├── Verify.jsx           # Public digital badge lookup demonstrator
│   │   ├── Contractors.jsx      # Regional supervisor accreditation requirements
│   │   ├── About.jsx            # Cooperative history, model, and ethics
│   │   └── Contact.jsx          # Regional hubs directory & inquiry form
│   ├── routes/
│   │   └── AppRoutes.jsx        # Client-side router with scroll restoration & 404
│   ├── styles/
│   │   └── globals.css          # CSS variables, glassmorphic utilities, fonts
│   ├── App.jsx                  # Application shell
│   └── main.jsx                 # Entrypoint
├── index.html                   # HTML template with Google Fonts
├── tailwind.config.js           # Extended design tokens
├── vite.config.js               # Vite build configuration
├── vercel.json                  # SPA routing rules for production deployment
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js 18+** installed:
```bash
node -v
npm -v
```

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized bundle will be compiled into the `dist/` folder with separate lazy chunks for the 3D scene.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🌐 Deployment Guide

### Deploying to Vercel
1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. The framework preset is automatically detected as **Vite**.
4. Deploy! `vercel.json` already contains rewrite rules to support client-side routing on all deep URLs (`/services`, `/book`, `/verify`).

### Deploying to Netlify
Create a `public/_redirects` file with:
```text
/*    /index.html   200
```
Then run `netlify deploy --prod --dir=dist`.

---

## 🧭 Project Roadmap

- [x] **Phase 1**: Project foundation, branding, medium-theme design system, 3D hero scene, homepage sections, and placeholder routes.
- [x] **Phase 2**: Homepage refinements, advanced 3D ecosystem, interaction polish, git repository setup, and deployment readiness.
- [ ] **Phase 3**: User authentication (Customer, Worker, Supervisor) with OTP and DigiLocker ID verification.
- [ ] **Phase 4**: Real-time project management dashboards, Gantt milestone tracking, and supervisor audit photo uploads.
- [ ] **Phase 5**: Cooperative escrow payment gateway and annual member dividend ledger.

---

## 📄 License & Governance

Copyright © 2025 SahkarSathi Cooperative Platform. All rights reserved.  
Distributed under the cooperative principles of fair labor and open community governance.
