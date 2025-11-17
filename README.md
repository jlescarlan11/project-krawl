# 🗺️ Krawl - The Living Map of Filipino Culture

**A community-driven Progressive Web App (PWA) that maps authentic Filipino culture through user-curated points of interest ("Gems") and guided trails ("Krawls").**

---

## 📋 Project Overview

Krawl is a Progressive Web App designed to help users discover and share authentic Filipino cultural experiences in Cebu City. The platform enables community members to:

- **Discover Gems** - Authentic cultural locations and experiences
- **Follow Krawls** - Guided cultural trails connecting multiple Gems
- **Share Culture** - Create and contribute to the living map of Filipino culture
- **Explore Offline** - Download Krawls for offline exploration

### Key Features

- 🧭 **Krawl Mode** - Interactive, location-aware guided experience
- 📴 **Offline-First** - Downloadable Krawls for areas with inconsistent connectivity
- 👥 **Community-Curated** - User-driven content with quality control mechanisms
- 🇵🇭 **Hyperlocal Focus** - Authentic, non-commercial Filipino cultural experiences

### Launch Area

**Cebu City, Philippines** - Initial launch focused exclusively on Cebu City boundaries.

---

## 📚 Documentation

This project includes comprehensive documentation organized in the `docs/` directory.

### Core Documentation

- **[PROJECT_BRIEF.md](./docs/PROJECT_BRIEF.md)** - High-level project overview, objectives, stakeholders, success metrics, and budget
- **[SCOPE_OF_WORK.md](./docs/SCOPE_OF_WORK.md)** - Detailed project specification including all pages, features, technology stack, and system integrations
- **[TIMELINE_AND_MILESTONES.md](./docs/TIMELINE_AND_MILESTONES.md)** - Comprehensive 15-week development timeline with detailed phase breakdowns and milestones
- **[SITEMAP.md](./docs/SITEMAP.md)** - Visual sitemap covering navigation hierarchy, user journeys, and routing structure
- **[DOCUMENTATION_TEMPLATE.md](./docs/DOCUMENTATION_TEMPLATE.md)** - Template for creating new project documentation

### Design System

- **[UI_UX_DESIGN_SYSTEM.md](./docs/design/UI_UX_DESIGN_SYSTEM.md)** - Comprehensive UI/UX design system with component library, spacing, typography, color usage, and interaction patterns
- **[WIREFRAMES.md](./docs/design/WIREFRAMES.md)** - Low-fidelity wireframes for all pages, including UI states, accessibility specifications, and micro-interaction patterns
- **[USER_PERSONA_PROFILES.md](./docs/user-research/USER_PERSONA_PROFILES.md)** - Comprehensive user persona profiles for design and development decisions
- **[USER_JOURNEY_MAP.md](./docs/user-research/USER_JOURNEY_MAP.md)** - Comprehensive user journey maps highlighting user actions, motivations, pain points, and touchpoints
- **[FEATURE_LIST_AND_USER_STORIES.md](./docs/user-research/FEATURE_LIST_AND_USER_STORIES.md)** - Comprehensive feature list with corresponding user stories

### Content Strategy

- **[CONTENT_SEEDING_STRATEGY.md](./docs/content/CONTENT_SEEDING_STRATEGY.md)** - Guidelines for creating and seeding initial content (100+ Gems, 10+ Krawls)
- **[CONTENT_INVENTORY_AND_PLAN.md](./docs/content/CONTENT_INVENTORY_AND_PLAN.md)** - Full content inventory covering text, imagery, and video needs for every page

### Logo & Branding

- **[BRAND_BRIEF.md](./docs/design/BRAND_BRIEF.md)** - Comprehensive brand strategy including mission, vision, target audience, tone of voice, brand story, and unique selling points
- **[BRAND_GUIDELINES.md](./docs/design/BRAND_GUIDELINES.md)** - Complete visual identity standards including color palette, typography, logo usage, buttons, iconography, spacing, and imagery
- **[logo/README.md](./docs/design/logo/README.md)** - Logo assets overview and quick start guide
- **[logo/LOGO_GUIDELINES.md](./docs/design/logo/LOGO_GUIDELINES.md)** - Complete logo usage guidelines and brand standards
- **[logo/LOGO_REVIEW.md](./docs/design/logo/LOGO_REVIEW.md)** - Logo quality assessment and recommendations
- **[logo/PNG_EXPORT_GUIDE.md](./docs/design/logo/PNG_EXPORT_GUIDE.md)** - Instructions for exporting PNG versions of logos

---

## 🏗️ Project Structure

```
project-krawl/
├── README.md                          # This file - project overview
├── CHANGELOG.md                       # Project changelog
│
└── docs/                              # Documentation directory
    ├── PROJECT_BRIEF.md               # Project brief and objectives
    ├── SCOPE_OF_WORK.md               # Detailed scope of work
    ├── TIMELINE_AND_MILESTONES.md     # Development timeline
    ├── SITEMAP.md                     # Visual sitemap and IA reference
    ├── DOCUMENTATION_TEMPLATE.md      # Documentation template
    ├── GLOSSARY.md                    # Project terminology
    │
    ├── design/                        # Design system and branding
    │   ├── UI_UX_DESIGN_SYSTEM.md     # UI/UX design system
    │   ├── WIREFRAMES.md              # Page wireframes
    │   ├── BRAND_BRIEF.md             # Brand strategy
    │   ├── BRAND_GUIDELINES.md        # Visual identity
    │   ├── DESIGN_DELIVERABLES.md     # Design deliverables
    │   └── logo/                      # Logo assets
    │       ├── README.md
    │       ├── LOGO_GUIDELINES.md
    │       └── *.svg
    │
    ├── user-research/                 # User research documentation
    │   ├── USER_PERSONA_PROFILES.md   # User personas
    │   ├── USER_JOURNEY_MAP.md        # User journey maps
    │   └── FEATURE_LIST_AND_USER_STORIES.md # Features and user stories
    │
    ├── content/                       # Content strategy
    │   ├── CONTENT_SEEDING_STRATEGY.md # Content creation guidelines
    │   └── CONTENT_INVENTORY_AND_PLAN.md # Content inventory
    │
    └── private-docs/                  # Internal documentation [Internal]
        ├── technical/                 # Technical documentation
        ├── tasks/                     # Task management
        ├── operations/                # Operations and planning
        └── GIT_WORKFLOW.md            # Git workflow guide
```

---

## 🛠️ Technology Stack

### Backend
- **Language:** Java 25 LTS
- **Framework:** Spring Boot 3.2.x
- **Build Tool:** Maven 3.9.x
- **Database:** Aiven PostgreSQL (free tier)

### Frontend
- **Framework:** Next.js 16.0.3
- **Language:** TypeScript 5.x
- **React:** React 19.2.0
- **Styling:** Tailwind CSS v4 (CSS-based configuration)
- **State Management:** Zustand 4.4.x (planned)
- **Maps:** Mapbox GL JS 3.x (planned)

### Services & Infrastructure
- **Backend Hosting:** Oracle Cloud Infrastructure (Always Free Tier)
- **Frontend Hosting:** Vercel (free tier)
- **Authentication:** Google OAuth 2.0 via NextAuth.js v5 (Auth.js) on the frontend and Spring Security OAuth on the backend
- **Image Management:** Cloudinary (free tier)
- **Email:** Brevo (free tier: 300 emails/day)
- **Maps & Location:** Mapbox (free tier: 50,000 map loads/month)
- **CI/CD:** GitHub Actions (free tier)
- **Monitoring:** Spring Boot Actuator + Sentry (free tier)

---

## 📅 Project Timeline

**Duration:** 15 weeks (14 weeks development + 1 week launch)

### Phases

1. **Foundation** (Weeks 1-2) - Architecture, Design System, Project Setup
2. **Core Development** (Weeks 3-7) - Authentication, Maps, Gem/Krawl Creation, Search
3. **Community Features** (Weeks 8-9) - Vouching, Rating, Comments, Reporting
4. **Krawl Mode & Offline** (Weeks 10-12) - Location Tracking, Offline Downloads
5. **Testing & Polish** (Weeks 13-14) - QA, Optimization, Accessibility
6. **Launch Preparation** (Week 15) - Content Seeding, Deployment, Go-Live

For detailed timeline, see [TIMELINE_AND_MILESTONES.md](./docs/TIMELINE_AND_MILESTONES.md).

---

## 🎯 Key Objectives

1. **Develop & Launch MVP** - Deploy functional PWA with core features
2. **Seed Initial Content** - Populate Cebu City with 100+ Gems and 10+ Krawls
3. **Validate Core Loop** - Achieve 100-500 active users in Cebu City
4. **Gather User Feedback** - Collect qualitative and quantitative data
5. **Test Revenue Model** - Onboard 5-10 local Cebu businesses

---

## 💰 Budget

**Total MVP Budget (15 weeks):**
- **MVP Development:** ₱0 (solo development using free tools)
- **Post-Launch Monthly:** ₱0 (all services within free tiers)
- **Post-Launch Annual:** ₱1,200 (domain renewal only)

**Key Costs:**
- Domain Registration: ₱1,200/year (approximately ₱230 prorated for 15-week MVP period)
- All Other Services: ₱0 (free tiers sufficient)
- **Note:** Budget assumes solo development (sweat equity). If hiring freelancers, costs would increase significantly.

For detailed budget breakdown, see BUDGET_AND_RESOURCE_PLAN.md [Internal].

---

## 📖 Document Relationships

```
PROJECT_BRIEF.md (High-level overview)
    ↓
SCOPE_OF_WORK.md (Detailed specifications)
    ↓
TIMELINE_AND_MILESTONES.md (Implementation plan)
    ↓
CONTENT_SEEDING_STRATEGY.md (Content guidelines)
    ↓
CONTENT_INVENTORY_AND_PLAN.md (Detailed page-by-page content needs)

BRAND_BRIEF.md (Brand strategy & positioning)
    ↕ (informs all documents)
BRAND_GUIDELINES.md (Visual identity & design system)
    ↕ (visual identity tokens)
UI_UX_DESIGN_SYSTEM.md (UI components & implementation)
    ↕ (implements BRAND_GUIDELINES and informs frontend)

USER_PERSONA_PROFILES.md (User personas)
    ↕ (informs)
USER_JOURNEY_MAP.md (User journey maps)
    ↕ (informs)
UI_UX_DESIGN_SYSTEM.md (UI components & implementation)
```

**How to Use:**
1. Start with **PROJECT_BRIEF.md** for project overview
2. Review **SCOPE_OF_WORK.md** for detailed feature specifications
3. Follow **TIMELINE_AND_MILESTONES.md** for development schedule
4. Reference **CONTENT_SEEDING_STRATEGY.md** when sourcing or validating cultural submissions
5. Use **CONTENT_INVENTORY_AND_PLAN.md** to confirm every page’s content requirements
6. Reference **BRAND_BRIEF.md** for brand strategy, tone of voice, and messaging guidelines

---

## 🚀 Getting Started

### For Developers

1. Review [SCOPE_OF_WORK.md](./docs/SCOPE_OF_WORK.md) for technical specifications
2. Follow [TIMELINE_AND_MILESTONES.md](./docs/TIMELINE_AND_MILESTONES.md) for development phases
3. Set up development environment
4. Configure service accounts

### For Project Managers

1. Review [PROJECT_BRIEF.md](./docs/PROJECT_BRIEF.md) for objectives and metrics
2. Track progress using [TIMELINE_AND_MILESTONES.md](./docs/TIMELINE_AND_MILESTONES.md) milestones
3. Monitor free tier usage (see appendices in SCOPE_OF_WORK.md)

### For Content Creators

1. Review [CONTENT_SEEDING_STRATEGY.md](./docs/content/CONTENT_SEEDING_STRATEGY.md) for guidelines
2. Follow quality standards for Gems and Krawls
3. Ensure all content is within Cebu City boundaries

---

## ⚡ Quick Start

### Prerequisites Checklist

- [ ] Node.js 20.x LTS installed
- [ ] Java 25 LTS installed
- [ ] Maven 3.9.x installed
- [ ] Git installed and configured
- [ ] IDE configured (VS Code, IntelliJ IDEA, or preferred IDE)
- [ ] PostgreSQL client (for database access)

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hackaton
   ```

2. **Verify project structure**
   - Check that all documentation files are present in the `docs/` directory
   - Review this README for documentation overview

3. **Set up service accounts**
   - Create Aiven PostgreSQL database
   - Set up Google OAuth credentials
   - Create Cloudinary account
   - Create Brevo account
   - [x] Create Mapbox account ✅ (see [MAPBOX_SETUP.md](./docs/private-docs/operations/MAPBOX_SETUP.md))
   - [x] Create Sentry account ✅ (see [SENTRY_SETUP.md](./docs/private-docs/operations/SENTRY_SETUP.md))
   - [x] Set up Oracle Cloud Infrastructure account ✅ (see [OCI_SETUP.md](./docs/private-docs/operations/OCI_SETUP.md))

4. **Initialize projects**
   - Initialize backend project
   - Initialize frontend project
   - Configure development environment

---

## 🔧 Troubleshooting

### Broken Cross-References

**Issue:** Broken links in documentation

**Solution:**
1. Check that referenced files exist in the correct location
2. Verify markdown link syntax: `[text](./docs/filename.md)` or `[text](./docs/path/filename.md)`
3. For anchor links, verify the target header exists in the referenced file
4. Update broken links or create missing files

### Documentation Inconsistencies

**Issue:** Dates, versions, or references don't match across files

**Solution:**
1. Review [CHANGELOG.md](./CHANGELOG.md) for recent changes
2. Check individual document version history sections
3. Update all affected files to maintain consistency

---

## 📝 Key Terms

- **Gem** - A point of interest representing authentic Filipino cultural location or experience
- **Krawl** - A guided trail connecting multiple Gems in a specific sequence
- **Krawl Mode** - Location-aware guided experience that helps users follow a Krawl in real-time
- **Vouching** - Community quality control mechanism where users vouch for authenticity/quality
- **PWA** - Progressive Web App - provides app-like experience with offline capabilities

For complete glossary, see [GLOSSARY.md](./docs/GLOSSARY.md).

---

## 🔗 Related Resources

- **Glossary:** See [GLOSSARY.md](./docs/GLOSSARY.md) for all project terminology
- **Changelog:** See [CHANGELOG.md](./CHANGELOG.md) for project changes and version history
- **Logo Assets:** See [logo/README.md](./docs/design/logo/README.md)
- **API Documentation:** API_DOCUMENTATION.md [Internal]
- **Database Schema:** DATABASE_SCHEMA.md [Internal]
- **System Design:** SYSTEM_DESIGN.md [Internal]
- **Deployment Guide:** DEPLOYMENT_GUIDE.md [Internal]
- **Testing Strategy:** TESTING_STRATEGY.md [Internal]
- **Comprehensive Testing Plan:** COMPREHENSIVE_TESTING_PLAN.md [Internal]

---

## 📝 Documentation Versioning

**Version Numbering Strategy:**
- Version numbers (e.g., 1.0.0, 2.0.0) indicate significant updates to each document
- Documents are versioned independently based on their update frequency
- Major version increments indicate substantial changes (e.g., new sections, major feature additions)
- Minor version increments indicate moderate updates (e.g., feature enhancements, clarifications)
- Patch version increments indicate minor fixes or corrections

---

## 📞 Contact

**Project Team:** Solo Developer – contact `hello@krawl.app` (update with full roster before Week 3)  
**Last Updated:** November 15, 2025  
**Status:** Planning Phase

---

## 📄 License

MIT License (to be confirmed with stakeholders prior to MVP launch)

---

*This README provides an overview of the Krawl MVP project. For detailed information, refer to the specific documentation files listed above.*

