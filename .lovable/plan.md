

# CalcHub — Universal Calculator Platform

## Overview
A modern, fintech-inspired calculator platform with a blue/teal color palette. Clean, card-based design with dynamic charts, smart search, and PDF export. All calculations client-side, no backend needed.

---

## 1. Design System & Layout Shell
- **Blue/teal fintech palette** — deep navy backgrounds for hero, teal accents, white cards
- Sticky top navigation: **Home | About Us | Our Calculators (mega dropdown) | Contact Us**
- Responsive hamburger menu on mobile
- Mega menu for "Our Calculators" organized by category with icons
- Global smart search bar in the header

## 2. Homepage
- **Hero section** with bold headline, subtitle, and a prominent search bar with auto-suggest
- **Calculator category cards** displayed in a grid (Finance, Tax, Education, Property, Cost of Living) with icons and brief descriptions
- Clean footer with links

## 3. Smart Search
- Search bar with predictive suggestions as user types
- Searches across all calculator names and keywords (e.g., "mortgage", "GPA", "salary")
- Clicking a suggestion navigates directly to that calculator

## 4. Calculator Categories & Full Set

### 💰 Finance
- Mortgage Calculator
- Loan Repayment Calculator
- Savings/Compound Interest Calculator
- Investment Return Calculator

### 🏛️ Tax
- Income Tax Calculator
- VAT Calculator
- Capital Gains Tax Calculator

### 🎓 Education
- GPA Calculator
- Student Loan Calculator

### 🏠 Property
- Stamp Duty Calculator
- Rent vs Buy Calculator

### 💸 Cost & Salary
- Salary Calculator (gross to net)
- Cost of Living Comparison
- Tip Calculator

## 5. Calculator Page Layout
- **Split layout**: inputs on the left in a clean card, results + charts on the right
- All inputs grouped logically with clear labels
- Instant client-side calculation — no submit button needed, results update on input change
- Currency selector (€, $, £) where applicable

## 6. Visual Results & Charts
- **Recharts** (already installed) for pie charts, bar charts, and line graphs
- Charts update dynamically as inputs change
- Key result numbers highlighted with large, bold typography

## 7. "What-If" Interactive Sliders
- Shown only on calculators that have charts (mortgage, loan, investment, etc.)
- Sliders for key variables (interest rate, loan term, amount)
- Real-time chart + result updates as sliders move

## 8. PDF Download & Email
- **"Download as PDF"** button on every calculator using client-side PDF generation (jsPDF)
- Professional report layout: inputs, results, date
- **"Email Results"** opens the user's mail client with a pre-filled summary via `mailto:` link

## 9. Mobile-First Responsive Design
- Touch-friendly inputs, numeric keypads for number fields (`inputMode="numeric"`)
- Sticky bottom action bar on mobile (Calculate / Download)
- Charts stack below inputs on small screens
- Smooth scroll transitions

## 10. Static Pages
- **About Us** — mission, purpose of the platform
- **Contact Us** — simple contact form (mailto-based) with name, email, message fields

