# Amai E-Commerce Agent Guidelines

## 1. Focus & Scope
- **DO NOT hallucinate functionality or design styles.** Stick strictly to the requirements and existing aesthetics.
- The primary tasks are: 
  1. Migrating `all-in-one.html` (and other related HTML files) into a React-based architecture.
  2. Modifying the top Navbar to ensure all necessary e-commerce functional buttons (Home, Shop, About, Cart, Profile/Auth, Orders) are clearly visible and accessible.
  3. Connecting the React frontend to the existing backend for Inventory, Orders, and Authentication.

## 2. Design Integrity
- **Preserve the Wabi-Sabi minimalist design.** The website is a premium artisan chocolate brand.
- Keep the existing CSS classes, structural markup, animations, and color schemes.
- Only modify HTML to turn it into proper JSX, change `class` to `className`, `for` to `htmlFor`, and self-close tags.

## 3. Architecture Transition
- Use **Vite** with React as the build tool to replace the static HTML approach.
- Organize components logically:
  - `components/` (Navbar, Footer, ProductCard, etc.)
  - `pages/` (Home, Auth, Checkout, Collections, ProductDetails)
  - `services/` (API integration for Auth, Inventory, Orders)
- Avoid redundant state. Use React Router for navigation.

## 4. Backend Integration Focus
- Pay close attention to the backend's `ARCHITECTURE.md` or existing `index.js` routes.
- The order management and basic inventory tracking system MUST work flawlessly with user authentication.
- Capture user tokens correctly and attach them to protected route requests (Cart, Checkout, Orders).

## 5. Development Strategy
- Read and understand first. Do not blindly overwrite.
- Check previous tool outputs (especially `all-in-one.html` and backend endpoints).
- Test systematically before concluding.
