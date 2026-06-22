# BabboonsCART — Full-Stack Online Store (MERN)

A learning/portfolio e-commerce app: React (Vite) frontend, Node/Express API,
MongoDB database. Mock checkout (no real payments), JWT auth, admin dashboard,
and order tracking via polling.

## Stack
- **Frontend:** React 18, Vite, React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express, Mongoose (MongoDB), JWT auth, bcrypt
- **Database:** MongoDB (local or Atlas)

## Features
- Product catalog with search
- Cart (persisted in localStorage)
- Mock secure checkout: server re-prices items from the DB (never trusts
  client-submitted prices), simulates a payment gateway response, no real
  card data is ever stored
- JWT-based auth (register/login), roles: `customer` / `admin`
- Order tracking page that **polls** `GET /api/orders/:id` every 5s and shows
  a visual progress timeline + status history
- Admin dashboard: revenue/order stats, order status management, full
  product CRUD

## 1. Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI

## 2. Backend setup
```bash
cd server
cp .env.example .env
# edit .env if needed (MONGO_URI, JWT_SECRET)
npm install
npm run seed     # creates sample products + an admin user
npm run dev       # starts API on http://localhost:5000
```
Seeded admin login: **admin@babboonscart.com / admin1234**

## 3. Frontend setup
```bash
cd client
npm install
npm run dev       # starts app on http://localhost:5173
```

By default the frontend calls `http://localhost:5000/api`. To change this,
create `client/.env` with:
```
VITE_API_URL=http://localhost:5000/api
```

## 4. Using the app
1. Open http://localhost:5173, browse products, add to cart.
2. Register a customer account, go through checkout (any fake card digits
   work — it's a mock gateway).
3. After placing an order you land on the **order tracking** page, which
   polls for status updates automatically.
4. Log in as the seeded admin to access **/admin**: view stats, advance an
   order's status (placed → processing → shipped → out_for_delivery →
   delivered), and manage products.

## Notes on "secure checkout"
This is a portfolio-grade mock, not a PCI-compliant payment system:
- Card fields are never sent to a real processor or persisted.
- Server-side re-pricing prevents a tampered client from changing totals.
- Auth uses JWT + bcrypt-hashed passwords.

To go to real payments later, swap the mock gateway block in
`server/routes/orders.js` for a real provider's server-side SDK (e.g. Stripe)
and never handle raw card numbers directly in your own backend (use the
provider's hosted fields / Elements + webhooks instead).

## Project structure
```
babboonscart/
  server/        Express API + Mongoose models
  client/        React (Vite) frontend
```
