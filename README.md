MERN Stack E-commerce website with an admin panel, Stripe payment integration, and Cash on Delivery (COD) support.

Live preview links integrated for the client, admin panel, and server:

---

## 🌐 Live Preview Links

| Component        | Description                      | Live URL                                                                 |
|------------------|----------------------------------|--------------------------------------------------------------------------|
| 🛍️ E-commerce Frontend | Customer-facing storefront       | [Shoppy E-commerce](https://shoppy-ecommerce-by-thalir.onrender.com) |
| 🛠️ Admin Panel         | Product and order management     | [Shoppy Admin Panel](https://shoppy-adminpanel-by-thalir.onrender.com) |
| 🔙 Backend API         | RESTful server endpoints         | [Shoppy Server](https://shoppy-server-by-thalir.onrender.com)            |

---

# 🛒 MERN Stack E-commerce Platform Documentation

## 📌 Overview

This is a full-featured E-commerce web application built using the MERN stack (MongoDB, Express.js, React, Node.js). It includes:

- A customer-facing storefront with categorized products
- A secure authentication system using JWT
- Shopping cart and order management
- Stripe payment integration and Cash on Delivery (COD)
- A dedicated admin panel for managing products and orders

---

## 🧱 Tech Stack

| Layer        | Technology Used                          |
|--------------|-------------------------------------------|
| Frontend     | React (CRA for client, Vite for admin), React Router |
| Backend      | Node.js, Express.js                      |
| Database     | MongoDB                                  |
| Authentication | JWT (JSON Web Tokens)                  |
| File Upload  | Multer                                   |
| Payment      | Stripe                                   |
| Styling      | CSS                                       |
| Deployment   | Platform-agnostic (e.g., Vercel, Heroku, Render) |

---

## 🧭 Project Structure

```
MERN-Stack-E-commerce/
├── admin/        → Admin panel (Vite + React)
├── client/       → Customer-facing frontend (CRA)
├── server/       → Backend (Node.js + Express + MongoDB)
```

---

## 🛍️ E-commerce Frontend (client/)

### 🔧 Features

- Built with Create React App (CRA)
- Routing with `react-router-dom`
- Product categories: Men, Women, Kids
- Cart functionality: Add, Remove, View
- Order management: Place, Cancel, View My Orders
- Authentication: Login, Logout with JWT
- Payment: Stripe and COD options

### 📁 Key Components

- `Navbar`, `Hero`, `Footer`, `Offers`, `Popular`, `NewCollections`
- `ProductDisplay`, `RelatedProducts`, `CartItems`, `StripeCheckoutForm`
- Pages: `Shop`, `ShopCategory`, `Product`, `Cart`, `Orders`, `LoginSignup`

---

## 🛠️ Admin Panel (admin/)

### 🔧 Features

- Built with Vite + React
- Routing with `react-router-dom`
- Admin capabilities:
  - Add new products
  - List all products
  - View all customer orders

### 📁 Key Components

- `Sidebar`, `Navbar`, `AddProduct`, `ListProduct`, `Orders`
- Page: `Admin.jsx`

---

## 🔙 Backend (server/)

### 🔧 Features

- Node.js + Express.js REST API
- MongoDB for data storage
- JWT-based authentication
- Multer for image uploads
- CORS enabled for cross-origin requests
- Stripe integration for payments

### 📁 Key Files

- `index.js`: Main server entry point
- `upload/images/`: Stores uploaded product images

### 📦 Dependencies

- `express`, `mongoose`, `cors`, `dotenv`, `multer`, `jsonwebtoken`, `stripe`

---

## 🔐 Authentication

- JWT tokens are issued upon login and stored in local storage
- Protected routes for user orders and admin actions
- Middleware to verify tokens on the backend

---

## 💳 Payment Integration

- Stripe Checkout for online payments
- Cash on Delivery (COD) as an alternative option
- Payment method selected during checkout

---

## 📦 API Endpoints (Sample)

| Method | Endpoint                  | Description                     |
|--------|---------------------------|---------------------------------|
| POST   | `/api/auth/login`         | User login                      |
| POST   | `/api/auth/register`      | User registration               |
| GET    | `/api/products`           | Get all products                |
| POST   | `/api/cart`               | Add item to cart                |
| DELETE | `/api/cart/:id`           | Remove item from cart           |
| GET    | `/api/cart`               | Get all cart items              |
| POST   | `/api/order`              | Place an order                  |
| GET    | `/api/order/myorders`     | List my orders                  |
| DELETE | `/api/order/:id`          | Cancel an order                 |
| POST   | `/api/admin/product`      | Add new product (admin only)    |
| GET    | `/api/admin/products`     | List all products (admin only)  |
| GET    | `/api/admin/orders`       | View all orders (admin only)    |

---

## 🗂️ Folder Structure Highlights

### client/

- `src/Components/`: UI components like Navbar, Hero, ProductDisplay
- `src/Context/ShopContext.js`: Global state management
- `src/Pages/`: Route-based pages (Shop, Cart, Orders, etc.)

### admin/

- `src/Components/`: Admin UI components (Sidebar, AddProduct, Orders)
- `src/Pages/Admin.jsx`: Main admin dashboard

### server/

- `index.js`: Express server setup
- `upload/images/`: Uploaded product images

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/MERN-Stack-E-commerce.git
cd MERN-Stack-E-commerce
```

### 2. Install Dependencies

```bash
# Client
cd client
npm install

# Admin
cd ../admin
npm install

# Server
cd ../server
npm install
```

### 3. Environment Variables

Create a `.env` file in the `server/` directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 4. Run the App

```bash
# Start backend
cd server
npm start

# Start client
cd ../client
npm start

# Start admin panel
cd ../admin
npm run dev
```

---

## ✅ Future Enhancements

- Product search and filters
- Admin authentication
- Inventory management
- Order status tracking
- User profile management

---

Let me know if you'd like this turned into a README or want help deploying it to platforms like Vercel or Render!
