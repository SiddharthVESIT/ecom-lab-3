# AMAI Chocolatiers | Artisan E-Commerce Platform 🍫

**Live Production Frontend:** [https://ecom-lab-3.vercel.app](https://ecom-lab-3.vercel.app)  
**Live Production API:** [https://ecom-lab-3.onrender.com/api/v1](https://ecom-lab-3.onrender.com/api/v1)  

---

## 📖 Project Abstract
The **AMAI E-Commerce Platform** is a full-stack, enterprise-grade web application engineered to deliver a premium shopping experience for artisan chocolates. Embracing a minimalist "Wabi-Sabi" design philosophy through its UI, the application contrasts its frontend simplicity with a highly robust and scalable backend infrastructure. It utilizes a Decoupled (Headless) Architecture, cleanly separating presentation modules from rigorous backend business logic, ensuring exceptional maintainability, high availability, and rapid performance.

From secure JWT/Firebase authentication down to asynchronous relational sorting through PostgreSQL, AMAI is built not just as a storefront, but as a complete system featuring CRM (Customer Relationship Management), Inventory Analytics, and Payment integrations.

---

## ✨ Core Features
* **Authentication & Authorization:** Secure, dual-layered user authentication utilizing JSON Web Tokens (JWT) for stateless session handling, alongside native Firebase Google OAuth.
* **Streamlined Cart & Checkout:** Real-time state management integrating Razorpay for mocked seamless end-to-end payment transactions and dynamic invoice generation (PDFKit).
* **Enterprise Admin CRM:** Dedicated administrative portals capable of deep-diving into order fulfillment tracking, customer segmentation analytics, and holistic revenue metrics.
* **Highly Optimized UI Flow:** Developed utilizing React 19 and Tailwind CSS, featuring rapid route-transitions via `react-router-dom` and meticulously curated earth-toned aesthetics.
* **Digital Marketing Integration:** Architected to support direct promotional tie-ins, leveraging generated marketing assets, cohesive branding, and targeted digital campaign tracking.

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
