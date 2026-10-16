# Thalavina Project — Official Website

> **Connecting Vietnam & Indonesia Through Ocean Protection, Sustainable Blue Economy, and Youth Leadership.**

Established: 19 June 2026  
Founder: Tan Hoang Dinh (Brandon)  
Geographic Identity: Vietnam & Indonesia (Shared Ocean)  
Official Instagram: [instagram.com/thalavinaproject](https://www.instagram.com/thalavinaproject/)  
Founder Profile: [World Ocean Day Youth Council](https://worldoceanday.org/youth-council/tan-hoang-dinh/)  
Contact Inquiries: `dinhtanhoang2309@gmail.com`

---

## 🌊 Overview

Thalavina Project is a youth-led initiative that connects emerging leaders across Vietnam and Indonesia to address marine challenges through education, conservation, sustainable livelihoods, and evidence-based advocacy.

### The Meaning of Thalavina
- **Thala**: The sea, inspired by *thalassophile* (one who loves the ocean).
- **Vi**: Vietnam.
- **Na**: Nusantara, celebrating Indonesia’s archipelagic heritage and shared marine waters.

### Core Thematic Pillars
1. **01. Ocean Climate Protection**: Ocean warming, acidification, sea-level rise, coastal resilience, and marine heatwaves.
2. **02. Sustainable Blue Economy**: Coastal livelihoods, responsible fishery stewardship, just transition, and marine conservation economics.
3. **03. Sea Turtle Conservation**: Life cycles, nesting beaches, hatchling survival, and coastal habitat protection, inspired by founder field experience at Hon Bay Canh in Con Dao National Park.

---

## 🚀 Key Features

- **Buttery-Smooth Synchronized Scroll Animation**: The 240-frame 3D sea turtle animation glides continuously behind the site content, synchronized with page scrolling using frame-rate independent exponential smoothing.
- **Adaptive Viewport Framing**: Full-bleed `cover` presentation on desktop/landscape monitors, and smart `contain` framing on mobile/portrait devices so the turtle is always 100% visible across its entire swimming trajectory.
- **Pixel-Perfect Vector Artwork**: High-definition, responsive SVG illustrations for Ocean Climate (Wave & Thermometer), Blue Economy (Fishing Boat & Coastal Market), and Turtle Conservation (Emperor Angelfish).
- **CountUpNumber Component**: Verified Instagram analytics metrics snapshot (Views: 2,681, Viewers: 206, Interactions: 606, Accounts engaged: 26, Profile visits: 330, Followers: 387) animated smoothly via `IntersectionObserver`. Respects `prefers-reduced-motion`.
- **Accessible Detail Modals**: Fast, accessible dialog overlays for About Us, Guiding Principles, Founder Profile, Pillar Deep Dives, and Privacy Notice.
- **Zero-Dependency Architecture**: Built purely with HTML5, Vanilla CSS, and modern JavaScript for maximum speed, longevity, zero bundle overhead, and instant loading.

---

## 💻 How to Run Locally

You can run the website in any modern browser without installing any package managers:

### Option 1: Direct File Opening
Double-click `index.html` in your file explorer to open it directly in Chrome, Edge, Safari, or Firefox.

### Option 2: Local Python Server (Recommended)
Run the built-in HTTP server:
```powershell
python -m http.server 5500
```
Then visit **`http://localhost:5500`** in your browser.

---

## 📬 Contact Form Setup (Formspree & Gmail)

The contact form is pre-wired to deliver messages directly to `dinhtanhoang2309@gmail.com`. To activate Formspree delivery:

1. **Create an account** at [formspree.io](https://formspree.io).
2. **Create a new form** and name it `Thalavina Website Inquiries`.
3. **Set the recipient email** to `dinhtanhoang2309@gmail.com`.
4. **Copy your Form ID** (e.g., `xpznkvoq`).
5. In `script.js` (around line 300), replace the endpoint:
   ```javascript
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
   ```
6. Submit a test message on the site, then check the inbox at `dinhtanhoang2309@gmail.com` to confirm receipt!

---

## 📁 Project Structure

```
├── index.html                 # Main entry point with synchronized scroll scenes & modals
├── style.css                  # Ocean design system, glassmorphism tokens, and responsive layout
├── script.js                  # Canvas scroll sync, CountUpNumber, contact form, modal engine
├── README.md                  # Complete documentation and setup guide
├── ezgif-frame-001.jpg .. 240 # 240 high-resolution frames of swimming sea turtle
└── assets/
    ├── logo.svg               # Thalavina Project official brand logo
    ├── illustration-wave.svg  # Section 01 Ocean Climate Protection vector artwork
    ├── illustration-boat.svg  # Section 02 Sustainable Blue Economy vector artwork
    └── illustration-fish.svg  # Section 03 Sea Turtle Conservation vector artwork
```

---

## 🌐 Deployment Instructions

### Deploying to Netlify
1. Drag and drop the project folder directly onto [Netlify Drop](https://app.netlify.com/drop).
2. Or connect the repository on Netlify and set the publish directory to `./`.
3. No build command required.

### Deploying to Vercel
1. Run `npx vercel` in this folder, or import the GitHub repository into Vercel.
2. Select "Other" as the Framework Preset and deploy with zero configuration.

---

## 📋 Content & Verification Status

- **Established Date**: 19 June 2026 (Verified)
- **Founder**: Tan Hoang Dinh (Brandon), Development Economics student (Verified)
- **Con Dao Experience**: 12 nights at Hon Bay Canh in 2025 alongside IUCN Vietnam and Con Dao National Park team (Verified earlier personal experience)
- **Historical Instagram Analytics**: 16 October 2026 snapshot reporting 30-day window (Verified historical data)
- **Contact Recipient**: `dinhtanhoang2309@gmail.com` (Verified)
