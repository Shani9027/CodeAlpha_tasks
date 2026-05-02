# Amazon-like E-commerce App

A production-style full-stack application built with React, Tailwind CSS, Node.js, Express, and MongoDB.

## Features
- React frontend with advanced UI and responsive layout
- Sticky navbar with search suggestions
- Product filters, sorting, pagination, and categories
- Product detail pages with image gallery and reviews
- JWT authentication and profile management
- Cart functionality with localStorage plus backend sync
- Order checkout and order history
- Admin dashboard for stats and order/user management
- Stripe-compatible payment intent endpoint
- Modular backend architecture with controllers, routes, models, and middleware

## Setup

### Backend

1. Open terminal in `backend/`
2. Install dependencies:
```bash
cd backend
npm install
```
3. Copy environment file:
```bash
copy .env.example .env
```
4. Update `.env` values if needed.
5. Start MongoDB locally.
6. Seed initial data:
```bash
npm run seed
```
7. Start the backend:
```bash
npm run dev
```

### Frontend

1. Open a second terminal in `frontend/`
2. Install dependencies:
```bash
cd frontend
npm install
```
3. Copy environment file:
```bash
copy .env.example .env
```
4. Start the frontend:
```bash
npm run dev
```

### Default Admin Credentials
- Email: `admin@shani.com`
- Password: `Admin123!`

## Notes
- If `STRIPE_SECRET_KEY` is not set, payment intent endpoint will return a mocked client secret.
- The frontend reads API base from `VITE_API_BASE` and defaults to `http://localhost:5000/api`.
- UPI payment is available with ID `ojha63344-3@okicici` and can be scanned from the checkout page QR code.
- Seed script creates sample products and an admin user.

## Folder Structure

- `backend/` — Express API, MongoDB models, auth, products, orders, cart, reviews, admin routes
- `frontend/` — Vite React app, Tailwind UI, pages, and services
