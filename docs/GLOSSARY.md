# Glossary: Krawl Project

## Summary / Overview

This document provides a centralized glossary of all terms, concepts, and technical terminology used throughout the Krawl project documentation. This glossary serves as a single source of truth for terminology, ensuring consistency across all project documents.

**Purpose:** To provide clear definitions for all project-specific terms, technical concepts, and domain-specific language used in Krawl documentation.

**Current Date:** November 14, 2025

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-14 | Development Team | Initial comprehensive glossary |

**Current Version:** 1.0.0  
**Last Updated:** 2025-11-15  
**Status:** Draft

---

## Table of Contents

1. [Summary / Overview](#summary--overview)
2. [Version History](#version-history)
3. [Table of Contents](#table-of-contents)
4. [Core Product Terms](#core-product-terms)
5. [Technical Terms](#technical-terms)
6. [Business Terms](#business-terms)
7. [Design and UX Terms](#design-and-ux-terms)
8. [Content Terms](#content-terms)
9. [References](#references)

---

## Core Product Terms

### Gem
**Definition:** A point of interest representing an authentic Filipino cultural location or experience, created by users.

**Usage:** Users can create, discover, vouch for, rate, and comment on Gems. Gems are the fundamental building blocks of the Krawl platform.

**Related Terms:** Krawl, Vouching, Rating, Category

**Example:** "Basilica del Santo Niño" is a Gem representing a historic Catholic basilica in Cebu City.

---

### Krawl
**Definition:** A guided trail connecting multiple Gems in a specific sequence, created by users.

**Usage:** Users can create Krawls by selecting and ordering Gems, then follow them using Krawl Mode. Krawls provide structured cultural exploration experiences.

**Related Terms:** Gem, Krawl Mode, Trail, Route

**Example:** "Historic Cebu City Walk" is a Krawl connecting 8 historical Gems in chronological order.

---

### Krawl Mode
**Definition:** Location-aware guided experience that helps users follow a Krawl in real-time with turn-by-turn directions, arrival detection, and progress tracking.

**Usage:** Krawl Mode is an interactive feature that provides navigation guidance, geofencing-based arrival detection, and real-time progress updates as users follow a Krawl.

**Related Terms:** Krawl, Geofencing, Location Tracking, Offline Mode

**Features:**
- Real-time location tracking
- Turn-by-turn directions
- Geofencing for arrival detection (50m radius)
- Progress tracking
- Offline support for downloaded Krawls

---

### Vouching
**Definition:** Community quality control mechanism where users can vouch for the authenticity and quality of Gems or Krawls.

**Usage:** Users can vouch for content they have personally verified or experienced. Each user can vouch for a specific Gem or Krawl only once. Vouching helps establish content credibility.

**Related Terms:** Gem, Krawl, Community Quality Control, Rating

**Mechanics:**
- One vouch per user per item (Gem or Krawl)
- Vouch count displayed on content
- Voucher list visible to other users
- Helps identify authentic, community-verified content

---

### Rating
**Definition:** User-provided rating (1-5 stars) for Gems or Krawls, contributing to average rating calculations.

**Usage:** Users can rate Gems and Krawls based on their experience. Ratings contribute to average rating displays and help other users assess content quality.

**Related Terms:** Gem, Krawl, Vouching, Average Rating

**Mechanics:**
- 1-5 star rating system
- Users can update their ratings
- Average rating calculated from all user ratings
- Rating breakdown displayed (e.g., 5 stars: 10, 4 stars: 5, etc.)

---

## Technical Terms

### PWA (Progressive Web App)
**Definition:** A web application that provides an app-like experience with offline capabilities, installability, and native-like features.

**Usage:** Krawl is built as a PWA, enabling offline functionality, home screen installation, and app-like user experience on mobile devices.

**Key Features:**
- Service Workers for offline functionality
- Web App Manifest for installation
- Responsive design for all devices
- Fast loading and performance

**Related Terms:** Service Worker, Offline Mode, Web App Manifest

---

### Service Worker
**Definition:** A script that runs in the background of a web application, enabling offline functionality, background sync, and push notifications.

**Usage:** Krawl uses Service Workers to enable offline Krawl downloads, cache map tiles, and provide background synchronization.

**Related Terms:** PWA, Offline Mode, Cache Strategy

---

### OAuth 2.0
**Definition:** Authorization framework that enables applications to obtain limited access to user accounts on external services (e.g., Google).

**Usage:** Krawl uses Google OAuth 2.0 for social login authentication. Users authenticate with Google, and Krawl receives authorization to access basic profile information.

**Related Terms:** Authentication, Social Login, Google OAuth, NextAuth.js v5 (Auth.js)

---

### Geofencing
**Definition:** Technology that uses GPS or RFID to define geographic boundaries and trigger actions when users enter or exit those boundaries.

**Usage:** Krawl Mode uses geofencing to detect when users arrive at Gem locations (50-meter radius). When a user enters the geofence, the app detects arrival and provides feedback.

**Related Terms:** Krawl Mode, Location Tracking, GPS, Arrival Detection

**Technical Details:**
- 50-meter radius geofence around each Gem
- Real-time location tracking during Krawl Mode
- Haptic feedback on arrival detection

---

### Geocoding
**Definition:** Process of converting addresses or place names into geographic coordinates (latitude and longitude).

**Usage:** Krawl uses geocoding to convert user-entered addresses into coordinates for Gem creation and location validation.

**Related Terms:** Reverse Geocoding, Coordinates, Location Validation

---

### Reverse Geocoding
**Definition:** Process of converting geographic coordinates (latitude and longitude) into addresses or place names.

**Usage:** Krawl uses reverse geocoding to display human-readable addresses for Gem locations and provide location context to users.

**Related Terms:** Geocoding, Coordinates, Address

---

### API (Application Programming Interface)
**Definition:** A set of protocols and tools for building software applications, defining how different software components should interact.

**Usage:** Krawl uses RESTful APIs for communication between the frontend (Next.js) and backend (Spring Boot). All data operations go through API endpoints.

**Related Terms:** RESTful, Endpoint, HTTP Methods

---

### RESTful
**Definition:** Architectural style for designing networked applications using HTTP methods (GET, POST, PUT, DELETE) and standard status codes.

**Usage:** Krawl's backend API follows RESTful principles, using standard HTTP methods for different operations (GET for retrieval, POST for creation, etc.).

**Related Terms:** API, Endpoint, HTTP Methods

---

### CDN (Content Delivery Network)
**Definition:** A network of servers distributed across geographic locations that deliver content based on user location for improved performance.

**Usage:** Krawl uses Cloudinary as a CDN for image delivery, ensuring fast image loading regardless of user location.

**Related Terms:** Cloudinary, Image Optimization, Performance

---

### SSL/HTTPS
**Definition:** Secure Sockets Layer / Hypertext Transfer Protocol Secure - encrypted communication protocol for secure data transmission over the internet.

**Usage:** All Krawl communications use HTTPS to ensure data security and user privacy. Vercel provides automatic SSL certificates for the frontend.

**Related Terms:** Security, Encryption, TLS

---

### CORS (Cross-Origin Resource Sharing)
**Definition:** Mechanism that allows web pages to make requests to different domains, controlled by server-side headers.

**Usage:** Krawl's backend API includes CORS configuration to allow the frontend (hosted on Vercel) to make API requests to the backend (hosted on Oracle Cloud).

**Related Terms:** API, Security, Cross-Origin

---

### XSS (Cross-Site Scripting)
**Definition:** A security vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users.

**Usage:** Krawl implements XSS protection through input sanitization, Content Security Policy (CSP), and framework-level protections (Next.js, Spring Boot).

**Related Terms:** Security, SQL Injection, Input Validation

---

### SQL Injection
**Definition:** A code injection technique used to attack data-driven applications by inserting malicious SQL code into queries.

**Usage:** Krawl prevents SQL injection through parameterized queries, ORM usage (JPA/Hibernate), and input validation in Spring Boot.

**Related Terms:** Security, XSS, Input Validation, Database

---

### WCAG (Web Content Accessibility Guidelines)
**Definition:** International standards for web accessibility, ensuring web content is accessible to people with disabilities.

**Usage:** Krawl follows WCAG 2.1 Level AA standards for accessibility, including proper contrast ratios, keyboard navigation, screen reader support, and semantic HTML.

**Related Terms:** Accessibility, A11y, Screen Reader, Keyboard Navigation

**Compliance Level:** WCAG 2.1 Level AA (minimum)

---

### MVP (Minimum Viable Product)
**Definition:** The most basic version of a product with core features sufficient to validate the product concept and gather user feedback.

**Usage:** The Krawl MVP includes core features (authentication, Gem creation, Krawl creation, Krawl Mode, offline capability) to validate the product concept in Cebu City.

**Related Terms:** Product Development, Feature Set, Launch

---

## Business Terms

### Claim Your Gem
**Definition:** Freemium business model feature where local businesses can claim ownership of Gems representing their establishments, enabling business verification and potential revenue opportunities.

**Usage:** Post-MVP feature allowing businesses to claim Gems, verify ownership, and potentially access premium features. Part of revenue model validation (5-10 businesses in MVP phase).

**Related Terms:** Business Model, Freemium, Revenue, Gem

**Status:** Post-MVP feature (validation phase in MVP)

---

### Freemium Model
**Definition:** Business model offering basic features for free while charging for premium features or enhanced functionality.

**Usage:** Krawl uses a freemium model where core features (discovery, creation, Krawl Mode) are free, with potential premium features for businesses (Claim Your Gem) in the future.

**Related Terms:** Business Model, Revenue, Claim Your Gem

---

## Design and UX Terms

### Design System
**Definition:** Comprehensive collection of reusable components, design tokens, and guidelines that ensure visual and functional consistency across an application.

**Usage:** Krawl has a comprehensive design system defined in UI_UX_DESIGN_SYSTEM.md, including colors, typography, spacing, components, and interaction patterns.

**Related Terms:** Component Library, Design Tokens, UI/UX

---

### Design Tokens
**Definition:** Named values (colors, spacing, typography) that define design decisions and can be used consistently across the application.

**Usage:** Krawl uses design tokens (CSS variables, Tailwind CSS v4 @theme) for colors, spacing, typography, and other design values.

**Related Terms:** Design System, CSS Variables, Tailwind CSS v4

---

### Component Library
**Definition:** Collection of reusable UI components (buttons, cards, forms, etc.) built according to design system specifications.

**Usage:** Krawl's component library includes buttons, cards, forms, navigation, modals, and feedback components, all following the design system.

**Related Terms:** Design System, UI Components, Reusable Components

---

### Responsive Design
**Definition:** Design approach that ensures web applications work well on various screen sizes and devices (mobile, tablet, desktop).

**Usage:** Krawl uses mobile-first responsive design, prioritizing mobile experience while ensuring desktop usability.

**Related Terms:** Mobile-First, Breakpoints, Adaptive Design

---

### Mobile-First
**Definition:** Design and development approach that prioritizes mobile experience, then enhances for larger screens.

**Usage:** Krawl is designed mobile-first, as it's a PWA primarily used on mobile devices for location-based exploration.

**Related Terms:** Responsive Design, PWA, Mobile Experience

---

### Touch Target
**Definition:** Interactive element (button, link) that must meet minimum size requirements (44px × 44px) for accessibility and usability on touch devices.

**Usage:** All interactive elements in Krawl meet the 44px × 44px minimum touch target size for accessibility compliance.

**Related Terms:** Accessibility, Mobile UX, WCAG

---

## Content Terms

### Content Seeding
**Definition:** Process of creating initial content (Gems and Krawls) before public launch to ensure the platform has valuable content for early users.

**Usage:** Krawl's content seeding strategy aims to create 100+ Gems and 10+ Krawls across Cebu City districts before launch.

**Related Terms:** Gem, Krawl, Launch Preparation, Content Creation

---

### Content Lifecycle Management
**Definition:** Process of managing content throughout its lifecycle, including flagging outdated or closed locations, content review, and content updates.

**Usage:** Krawl implements content lifecycle management through community reporting, automated checks, and content review processes to maintain content freshness and accuracy.

**Related Terms:** Content Freshness, Reporting, Content Review, Flagging

---

### Cultural Significance
**Definition:** The importance and meaning of a location or experience within Filipino cultural context, including historical, social, or traditional value.

**Usage:** All Gems must have clear cultural significance, explained in descriptions. This ensures content aligns with Krawl's mission of mapping authentic Filipino culture.

**Related Terms:** Gem, Authenticity, Cultural Preservation

---

### Authenticity
**Definition:** Quality of being genuine, real, and true to Filipino cultural heritage, avoiding commercial or tourist-trap content.

**Usage:** Krawl prioritizes authentic Filipino cultural experiences over commercial attractions. All content must represent genuine cultural value.

**Related Terms:** Cultural Significance, Community-Driven, Non-Commercial

---

### Community-Driven
**Definition:** Approach where content and quality control are managed by community members rather than corporate entities or algorithms.

**Usage:** Krawl is community-driven, with all content created by users and quality controlled through vouching, rating, and reporting systems.

**Related Terms:** Vouching, User-Generated Content, Community Quality Control

---

## Geographic Terms

### Cebu City Boundaries
**Definition:** Geographic boundaries defining the Cebu City area, enforced in Krawl to limit content creation and map views to the launch area.

**Usage:** All Gem and Krawl creation is restricted to locations within Cebu City boundaries. Map views are limited to Cebu City area only.

**Related Terms:** Launch Area, Geographic Restriction, Location Validation

**Boundary Definition:**
- **North:** Consolacion boundary
- **South:** Talisay City boundary
- **East:** Mactan Channel
- **West:** Mountain ranges
- **Coordinate System:** WGS84 (EPSG:4326)

---

### Launch Area
**Definition:** Geographic area where Krawl is initially launched and available. For MVP, this is Cebu City, Philippines.

**Usage:** Krawl's MVP launch is limited to Cebu City. Future expansion to other Philippine cities is planned post-MVP.

**Related Terms:** Cebu City Boundaries, MVP, Geographic Restriction

---

## Technology Stack Terms

### Next.js 14.x
**Definition:** React framework for production with server-side rendering, static site generation, and built-in optimizations.

**Usage:** Krawl's frontend is built with Next.js 14.x, providing PWA support, SEO optimization, and excellent performance.

**Related Terms:** React, TypeScript, Frontend Framework, PWA

---

### Spring Boot 3.5.7
**Definition:** Java framework for building production-ready applications with minimal configuration.

**Usage:** Krawl's backend is built with Spring Boot 3.5.7, providing RESTful API, security, and database integration.

**Related Terms:** Java 25, Backend Framework, RESTful API

---

### NextAuth.js v5 (Auth.js)
**Definition:** Authentication library for Next.js applications, supporting multiple OAuth providers. Version 5 is also known as Auth.js.

**Usage:** Krawl uses NextAuth.js v5 (Auth.js) for frontend authentication with Google OAuth 2.0.

**Note:** NextAuth.js v5 is also known as Auth.js. Both names refer to the same library.

**Related Terms:** Authentication, OAuth 2.0, Social Login, Google OAuth

---

### Tailwind CSS v4
**Definition:** Utility-first CSS framework for rapid UI development. Version 4 uses CSS-based configuration with the @theme directive.

**Usage:** Krawl uses Tailwind CSS v4 for styling, with design tokens defined in the @theme directive.

**Related Terms:** CSS Framework, Design Tokens, @theme Directive

---

### Zustand
**Definition:** Lightweight state management library for React applications.

**Usage:** Krawl uses Zustand 4.4.x for frontend state management, including authentication state, map state, and search state.

**Related Terms:** State Management, React, Frontend

---

### Mapbox GL JS
**Definition:** JavaScript library for interactive, customizable vector maps on the web.

**Usage:** Krawl uses Mapbox GL JS 3.x for map display, location selection, route visualization, and Krawl Mode navigation.

**Related Terms:** Maps, Location Services, Navigation, Geocoding

---

## Service and Infrastructure Terms

### Aiven PostgreSQL
**Definition:** Managed PostgreSQL database service offering free tier with 5 GB storage, 1 CPU, and 1 GB RAM.

**Usage:** Krawl uses Aiven PostgreSQL (free tier) for data storage, providing reliable database infrastructure without cost.

**Related Terms:** Database, PostgreSQL, Free Tier, Data Storage

---

### Cloudinary
**Definition:** Cloud-based image and video management service offering optimization, transformation, and CDN delivery.

**Usage:** Krawl uses Cloudinary (free tier: 7,500 images/month, 2 GB storage) for image upload, optimization, and delivery.

**Related Terms:** Image Management, CDN, Image Optimization

---

### Brevo
**Definition:** Email service provider (formerly Sendinblue) offering transactional email services.

**Usage:** Krawl uses Brevo (free tier: 300 emails/day) for sending transactional emails, notifications, and welcome emails.

**Related Terms:** Email Service, Transactional Email, Notifications

---

### Vercel
**Definition:** Platform for deploying Next.js applications with automatic optimizations and global CDN.

**Usage:** Krawl's frontend is hosted on Vercel (free tier: 100 GB bandwidth/month), providing fast global deployment.

**Related Terms:** Frontend Hosting, Deployment, CDN, Next.js

---

### Oracle Cloud Infrastructure (OCI)
**Definition:** Cloud computing service offering Always Free Tier with compute instances, storage, and databases.

**Usage:** Krawl's backend is hosted on Oracle Cloud Infrastructure (Always Free Tier), providing free backend hosting.

**Related Terms:** Backend Hosting, Cloud Infrastructure, Free Tier

---

### Sentry
**Definition:** Error tracking and performance monitoring service for applications.

**Usage:** Krawl uses Sentry (free tier: 5,000 events/month) for error tracking and monitoring in both frontend and backend.

**Related Terms:** Error Tracking, Monitoring, Performance

---

### GitHub Actions
**Definition:** CI/CD platform integrated with GitHub for automated testing, building, and deployment.

**Usage:** Krawl uses GitHub Actions (free tier: 2,000 minutes/month for private repos) for automated testing and deployment.

**Related Terms:** CI/CD, Continuous Integration, Automated Testing, Deployment

---

## References

### Related Documents
- [README.md](../README.md) - Project overview
- [SCOPE_OF_WORK.md](./SCOPE_OF_WORK.md) - Detailed project specifications (includes glossary section)
- [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) - Project overview with key terms
- SYSTEM_DESIGN.md [Internal] - Technical architecture and system design

---

## Document Metadata

**Document Type:** Reference Documentation / Glossary  
**Target Audience:** Development Team, Project Stakeholders, Content Creators, New Team Members  
**Related Documents:**
- [README.md](../README.md) - Project overview
- SCOPE_OF_WORK.md
- PROJECT_BRIEF.md
- SYSTEM_DESIGN.md [Internal]

**Contact:** [To be filled in by project team]

---

## Notes

### Important Considerations

1. **Consistency:** This glossary serves as the single source of truth for terminology. All project documents should reference this glossary or use consistent terminology.

2. **Updates:** As the project evolves, new terms may be added to this glossary. All documents should be updated to reflect glossary changes.

3. **Cross-References:** Terms in this glossary are cross-referenced with related terms to help users understand relationships.

4. **Current as of 2025-11-14:** All definitions reflect the current state of the Krawl project as of November 14, 2025.

---

*This glossary serves as the definitive reference for all terminology used in the Krawl project documentation. It should be consulted when creating new documentation or when terminology questions arise.*
