# AMAI Chocolatiers | Artisan E-Commerce Platform 🍫

**Live Production Frontend:** [https://ecom-lab-3.vercel.app](https://ecom-lab-3.vercel.app)  
**Live Production API:** [https://ecom-lab-3.onrender.com/api/v1](https://ecom-lab-3.onrender.com/api/v1)  

---

## 📖 Project Abstract
The **AMAI E-Commerce Platform** is a full-stack, enterprise-grade digital storefront engineered to deliver a premium shopping experience for artisan Japanese chocolates. Embracing a minimalist "Wabi-Sabi" design philosophy through its presentation, the application contrasts its frontend simplicity with a highly rigorous Backend Architecture. 

Built on the foundation of **Headless E-Commerce**, AMAI cleanly separates its React/Vite storefront from its heavy Node/PostgreSQL business logic. This decoupled design natively protects core inventory databases from heavy frontend promotional traffic while ensuring exceptional continuous availability.

Going significantly beyond a basic shopping cart, the AMAI system is a unified ecosystem integrating **Enterprise Resource Planning (ERP)** for dynamic supply chain analytics and **Customer Relationship Management (CRM)** algorithms to automate user personalization and retention.

---

## ✨ Core E-Commerce Architectures

### 1. Advanced CRM (Customer Relationship Management)
Built around the 4 pillars of the customer lifecycle (Select, Acquire, Extend, Retain):
* **Select (Targeting):** Users take a dynamic 'Flavor Profiling Quiz' upon entering the site. This identifies their precise palate while acting as an engaging lead magnet.
* **Retain (Loyalty Economics):** For every ₹100 spent, the system securely grants 1 Loyalty Point natively tracked during checkout webhooks. Users manipulate these points for sliding-scale fiat discounts on future orders.
* **Extend (Algorithmic Cross-Selling):** Utilizing the logged user `flavor_profile`, the React frontend algorithmically re-sorts catalog grids to prioritize matched products, subliminally driving higher conversion metrics.
* **Acquire (Abandoned Cart Harvesting):** Background SQL analytics sweep for orphaned carts exceeding 24 hours, actively generating retargeting matrices for email campaigns.

### 2. Predictive ERP (Logistics & Operations)
* **30-Day Velocity Analytics:** Using complex SQL aggregation (`WITH sales_velocity`), the backend mathematically projects 'Estimated Days to Stockout' based on rolling trailing performance.
* **Atomic Restock Triggers:** Managers possess one-click physical restock capabilities directly linked to the central SQL vault, allowing instant, gapless supply chain replenishment without overselling risks.
* **Kanban Order Pipelines:** Visual workflow management tracking customer intent from 'Assembly' to final 'Dispatch'.

### 3. Tier-1 User Experience (UX)
* **Micro-physics & Skeletons:** Eschewing bulky JS libraries, the app utilizes `Framer Motion` for magnetic button interactions, grid skeleton loaders masking network latency, and glass-morphic toast notifications.
* **Payment Security:** Full Sandbox Razorpay integration that abstracts sensitive credit card logic into encrypted webhooks, concluding in automated itemized invoice generation.

---

## 🛠 Technology Stack

### **Frontend (Presentation Tier)**
* **Core:** React 19, Vite (Lightning-fast HMR)
* **Styling:** Tailwind CSS (Utility-first framework)
* **Routing:** React Router v7
* **Data Fetching:** Axios

### **Backend (Application Tier)**
* **Runtime & Framework:** Node.js, Express.js
* **Security & Middlewares:** Helmet.js, Express Rate Limit, CORS
* **Payment Gateway:** Razorpay API Integration

### **Database (Persistence Tier)**
* **Primary SQL Engine:** PostgreSQL (`pg` pool) - strictly ACID compliant.
* **In-Memory Caching:** Redis - for rapid operational caching and session state.

### **Cloud Infrastructure & DevOps**
* **Frontend CDN:** Vercel (Edge Network)
* **Backend Runtime:** Render (Web Services)
* **Database Hosting:** Render Managed PostgreSQL & Redis

---

## 🏗 Architecture & Security Overview
The AMAI pipeline handles incoming traffic securely and efficiently:
1. **Edge Delivery:** Users load the static React application instantly from Vercel's global CDN.
2. **Reverse Proxy Load Balancing:** API requests are forwarded securely to the Render backend, passing through distributed load balancers.
3. **Firewall & Rate Limiting:** The Express backend trusts proxy headers to intelligently restrict abusive IPs (100 requests per 15 minutes) ensuring protection against brute-force DDoS.
4. **CORS Hardening:** Cross-Origin Resource Sharing is rigorously defined, automatically rejecting API attempts not originating from the verified Vercel URI.

---

## 💻 Local Development Setup

If you wish to spin up the AMAI ecosystem locally:

**1. Clone the repository:**
```bash
git clone https://github.com/SiddharthVESIT/ecom-lab-3.git
cd ecom-lab-3
```

**2. Boot local databases (requires Docker):**
```bash
docker-compose up -d
```

**3. Start the Backend API:**
```bash
cd backend
npm install
npm run dev
# The API will boot on http://localhost:4000
```

**4. Start the Frontend Client:**
```bash
cd ../frontend
npm install
npm run dev
# The UI will boot on http://localhost:5173
```
