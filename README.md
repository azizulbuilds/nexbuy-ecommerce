# Nexbuy 🛍️

A full-stack MERN e-commerce platform built with **React, Node.js,
Express, MongoDB, Cloudinary, and Razorpay**.

## ✨ Features

-   User registration and login
-   JWT authentication with HTTP-only cookies
-   Email OTP verification
-   Resend OTP and password reset
-   Product browsing and product details
-   Admin product CRUD
-   Cloudinary image uploads
-   Shopping cart management
-   Stock validation
-   Cash on Delivery (COD)
-   Razorpay online payments
-   Server-side Razorpay signature and payment verification
-   Order history and order details
-   Admin order management
-   Role-based admin authorization
-   Postman API testing resources

## 🧰 Tech Stack

### Frontend

-   React
-   React Router
-   Axios
-   Vite
-   JavaScript
-   CSS

### Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JWT
-   bcrypt
-   Nodemailer
-   Razorpay
-   Cloudinary
-   Multer
-   CORS

### Services

-   MongoDB Atlas
-   Cloudinary
-   Razorpay
-   Gmail / Nodemailer

## 📁 Project Structure

``` text
nexbuy-ecommerce/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── package.json
│   └── index.html
│
├── postman/
├── .postman/
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Install:

-   Node.js
-   npm
-   MongoDB Atlas account
-   Cloudinary account
-   Razorpay account
-   Gmail account/app password for email functionality

### 1. Clone the repository

``` bash
git clone https://github.com/YOUR_USERNAME/nexbuy-ecommerce.git
cd nexbuy-ecommerce
```

### 2. Install backend dependencies

``` bash
cd backend
npm install
```

### 3. Install frontend dependencies

Open another terminal:

``` bash
cd frontend
npm install
```

## 🔐 Environment Variables

Create:

``` text
backend/.env
```

Example:

``` env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Never commit real credentials or secrets to GitHub.**

## ▶️ Running the Application

### Backend

From the `backend` directory:

``` bash
npm run dev
```

Backend:

``` text
http://localhost:5000
```

### Frontend

From the `frontend` directory:

``` bash
npm run dev
```

Frontend:

``` text
http://localhost:5173
```

Open:

``` text
http://localhost:5173
```

## 🧪 API Testing

Postman resources are included for testing the backend.

Main API groups:

``` text
/auth
/products
/cart
/orders
```

Protected endpoints require authentication, while admin endpoints
require an admin account.

## 💳 Razorpay Testing

Razorpay is configured for test-mode payments during development.

Use Razorpay test credentials/details when testing. Never expose the
Razorpay secret key in the frontend or GitHub.

## 🔒 Security

The project uses:

-   bcrypt password hashing
-   JWT authentication
-   HTTP-only cookies
-   Protected routes
-   Role-based admin authorization
-   Email OTP verification
-   Razorpay signature verification
-   Server-side payment validation
-   Stock validation
-   Environment variables for secrets

## 🌐 Application Routes

### Public

``` text
/
 /register
 /verify-otp
 /login
 /products
 /products/:id
```

### Authenticated Users

``` text
/profile
/cart
/checkout
/orders
/orders/:id
/orders/:id/payment
```

### Admin

``` text
/admin
/admin/products
/admin/products/new
/admin/products/edit/:id
```

## 🔮 Future Improvements

-   Search and filtering
-   Product reviews and ratings
-   Wishlist
-   Coupons and discounts
-   Pagination
-   Advanced admin analytics
-   Order cancellation and refunds
-   Improved mobile responsiveness
-   Production deployment
-   CI/CD pipeline

## 👨‍💻 Author

**Azizul Hasan**

B.Tech --- Computer Science & Engineering (Data Science)

## 📄 License

This project is created for learning, portfolio, and educational
purposes.
