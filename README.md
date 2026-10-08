# Nexbuy 🛍️

> A full-stack MERN e-commerce platform with secure authentication, product management, shopping cart, order management, Razorpay payments, Cloudinary image uploads, and an admin dashboard.

---

🌐 Live Demo

Vercel Deployment: https://nexbuy-ecommerce-two.vercel.app

## 🚀 Overview

**Nexbuy** is a full-stack e-commerce application designed to provide a complete online shopping experience.

The project follows a client-server architecture:

- **Frontend:** React + Vite
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas + Mongoose
- **Authentication:** JWT + HTTP-only cookies
- **Image Storage:** Cloudinary
- **Payments:** Razorpay
- **Email:** Nodemailer / Gmail
- **API Testing:** Postman

---

# 🏗️ System Design Architecture

## High-Level Architecture

```text
                         ┌──────────────────────┐
                         │       Customer       │
                         │      Browser         │
                         └──────────┬───────────┘
                                    │
                                    │ HTTPS
                                    ▼
                         ┌──────────────────────┐
                         │   React + Vite       │
                         │      Frontend        │
                         └──────────┬───────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌──────────────────────┐
                         │  Node.js + Express   │
                         │       Backend        │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
      ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
      │ MongoDB Atlas │     │  Cloudinary   │     │   Razorpay    │
      │   Database    │     │    Images     │     │   Payments    │
      └───────────────┘     └───────────────┘     └───────────────┘
                                   
                         ┌──────────────────────┐
                         │   Nodemailer/Gmail   │
                         │   OTP & Reset Email  │
                         └──────────────────────┘
````

---

## 🔄 API Request Flow

```text
React UI
   │
   ▼
Axios
   │
   ▼
Express Route
   │
   ▼
Middleware
   │
   ├── Authentication
   ├── Authorization
   └── Upload Validation
   │
   ▼
Controller
   │
   ▼
Mongoose Model
   │
   ▼
MongoDB Atlas
   │
   ▼
JSON Response
   │
   ▼
React UI
```

---

# 🔐 Authentication Architecture

Nexbuy uses JWT-based authentication with HTTP-only cookies.

```text
User
 │
 ▼
Register
 │
 ▼
Password Hashed
 │
 ▼
OTP Generated
 │
 ▼
Nodemailer
 │
 ▼
OTP Verification
 │
 ▼
User Verified
 │
 ▼
Login
 │
 ▼
JWT Generated
 │
 ▼
HTTP-only Cookie
 │
 ▼
Protected API Requests
```

### Authentication Features

* User registration
* Password hashing using bcrypt
* Email OTP verification
* Resend OTP
* Login
* JWT authentication
* HTTP-only cookies
* Protected routes
* User profile
* Forgot password
* Password reset
* Admin role authorization

---

# 🛍️ Product Architecture

```text
Admin
 │
 ▼
Admin Dashboard
 │
 ▼
Product API
 │
 ├──────────────► Cloudinary
 │                    │
 │                    ▼
 │                Image URL
 │
 ▼
MongoDB
 │
 ▼
Product API
 │
 ▼
React Product Pages
```

### Product Features

* Create products
* View products
* View product details
* Update products
* Delete products
* Product stock management
* Product validation
* Cloudinary image upload

---

# 🛒 Shopping Cart Architecture

```text
Customer
   │
   ▼
Product Details
   │
   ▼
Add to Cart
   │
   ▼
Cart API
   │
   ▼
Validate Product
   │
   ▼
Validate Stock
   │
   ▼
MongoDB Cart
   │
   ▼
Updated Cart
   │
   ▼
React Cart UI
```

### Cart Features

* Add product
* Update quantity
* Remove product
* Clear cart
* Stock validation
* User-specific cart

---

# 📦 Order Architecture

```text
Customer
   │
   ▼
Cart
   │
   ▼
Checkout
   │
   ├────────────────┐
   │                │
   ▼                ▼
  COD            Razorpay
   │                │
   ▼                ▼
Order Created    Payment
   │                │
   │                ▼
   │        Payment Verification
   │                │
   └────────┬───────┘
            ▼
       Stock Update
            │
            ▼
       Order Status
            │
            ▼
       Order History
```

### Order Features

* Create order
* Cash on Delivery
* Razorpay payments
* Shipping address
* Order history
* Order details
* Order status
* Payment status
* Stock management

---

# 💳 Razorpay Payment Architecture

Sensitive payment operations are handled by the backend.

```text
Frontend
   │
   │ Create Order Request
   ▼
Express Backend
   │
   ▼
Create Database Order
   │
   ▼
Razorpay API
   │
   ▼
Razorpay Order ID
   │
   ▼
Frontend Razorpay Checkout
   │
   ▼
Customer Payment
   │
   ▼
Razorpay
   │
   ▼
Payment ID + Signature
   │
   ▼
Backend Verification
   │
   ├── Signature Verification
   ├── Order Verification
   ├── Amount Verification
   └── Payment Status Verification
   │
   ▼
Order Marked PAID
   │
   ▼
Stock Updated
   │
   ▼
Cart Updated
```

### Payment Security

The backend verifies:

* Razorpay order ID
* Razorpay payment ID
* Razorpay signature
* Payment amount
* Payment status
* User ownership of the order

The Razorpay secret key is never exposed to the frontend.

---

# 🖼️ Cloudinary Architecture

Product images are uploaded through the backend.

```text
Admin
 │
 ▼
Product Form
 │
 ▼
Multipart Upload
 │
 ▼
Upload Middleware
 │
 ▼
Cloudinary
 │
 ▼
Image URL
 │
 ▼
MongoDB Product
 │
 ▼
Frontend
```

MongoDB stores the image URL rather than the image binary.

---

# 👨‍💼 Admin Architecture

Nexbuy uses role-based authorization.

```text
User Login
    │
    ▼
JWT Authentication
    │
    ▼
User Role
    │
    ├──────── user ────────► Customer Features
    │
    └──────── admin ───────► Admin Dashboard
                                  │
                                  ├── Product Management
                                  │
                                  └── Order Management
```

### Admin Features

* Admin dashboard
* Product creation
* Product editing
* Product deletion
* Product image uploads
* Order management
* Order status management

---

# 🗄️ Database Design

## Users

Stores:

* Authentication information
* Password hash
* Email verification information
* User role

## Products

Stores:

* Product name
* Description
* Price
* Category
* Stock
* Image URLs
* Product information

## Carts

Stores:

* User
* Products
* Quantities

## Orders

Stores:

* User
* Order items
* Product name
* Product price
* Quantity
* Product image
* Shipping address
* Total amount
* Payment method
* Payment status
* Razorpay information
* Order status

---

## Entity Relationships

```text
                    ┌──────────────┐
                    │     User     │
                    └──────┬───────┘
                           │
                  ┌────────┴────────┐
                  │                 │
                  ▼                 ▼
           ┌─────────────┐   ┌─────────────┐
           │    Cart     │   │   Orders    │
           └──────┬──────┘   └──────┬──────┘
                  │                 │
                  │                 │
                  ▼                 ▼
           ┌─────────────┐   ┌─────────────┐
           │   Product   │   │   Product   │
           └─────────────┘   └─────────────┘
```

---

# 📁 Project Structure

```text
nexbuy-ecommerce/
│
├── backend/
│   │
│   ├── config/
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   └── razorpay.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── sendEmail.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   │
│   ├── index.html
│   └── package.json
│
├── postman/
├── .postman/
├── .gitignore
└── README.md
```

---

# 🧰 Technology Stack

| Layer             | Technology         |
| ----------------- | ------------------ |
| Frontend          | React              |
| Build Tool        | Vite               |
| Routing           | React Router       |
| HTTP Client       | Axios              |
| Backend           | Node.js            |
| API Framework     | Express.js         |
| Database          | MongoDB Atlas      |
| ODM               | Mongoose           |
| Authentication    | JWT                |
| Password Security | bcrypt             |
| Email             | Nodemailer / Gmail |
| Image Storage     | Cloudinary         |
| Payments          | Razorpay           |
| API Testing       | Postman            |

---

# 🔒 Security Architecture

Nexbuy implements multiple security mechanisms:

* Password hashing using bcrypt
* JWT authentication
* HTTP-only cookies
* Protected API routes
* Role-based admin authorization
* Email OTP verification
* OTP expiration
* Server-side Razorpay verification
* Payment signature verification
* Payment amount verification
* Stock validation
* Environment variables for secrets
* CORS configuration
* Backend input validation

### Environment Variables

Sensitive credentials should never be committed to GitHub.

```text
MONGO_URI
JWT_SECRET
EMAIL_USER
EMAIL_PASS
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
```

---

# ⚙️ Installation

## Prerequisites

Install the following:

* Node.js
* npm
* MongoDB Atlas account
* Cloudinary account
* Razorpay account
* Gmail/App Password

---

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/nexbuy-ecommerce.git

cd nexbuy-ecommerce
```

---

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

## Frontend Setup

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 🔐 Environment Configuration

Create:

```text
backend/.env
```

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razORPAY_key_secret
```

> Replace all placeholder values with your actual credentials.

---

# 🧪 API Testing

The project can be tested using **Postman**.

Main API groups:

```text
/auth
/products
/cart
/orders
```

Protected APIs require authentication.

Admin APIs additionally require an account with the `admin` role.

---

# 🌐 Application Routes

## Public Routes

```text
/
 /register
 /verify-otp
 /login
 /products
 /products/:id
```

## Authenticated Routes

```text
/profile
/cart
/checkout
/orders
/orders/:id
/orders/:id/payment
```

## Admin Routes

```text
/admin
/admin/products
/admin/products/new
/admin/products/edit/:id
```

---

# 🚀 Deployment Architecture

The application can be deployed using separate frontend and backend services.

```text
                         Internet
                            │
                            ▼
                  ┌────────────────────┐
                  │       Vercel       │
                  │   React Frontend   │
                  └─────────┬──────────┘
                            │
                            │ HTTPS API
                            ▼
                  ┌────────────────────┐
                  │   Backend Server   │
                  │   Node + Express   │
                  └─────────┬──────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
       ┌────────────┐ ┌───────────┐ ┌───────────┐
       │  MongoDB   │ │ Cloudinary│ │  Razorpay │
       │   Atlas    │ │           │ │           │
       └────────────┘ └───────────┘ └───────────┘
                            │
                            ▼
                     Nodemailer/Gmail
```

For production:

* Replace the localhost API URL with the deployed backend URL.
* Configure production CORS.
* Configure production environment variables.
* Keep payment secrets only on the backend.
* Configure MongoDB Atlas network access for the deployed backend.

---

# 📈 Scalability & Future Improvements

Possible improvements for production-scale workloads:

* Redis caching
* Database indexing
* Pagination
* Advanced product search
* Rate limiting
* Background job processing
* Message queues
* CDN optimization
* Centralized logging
* Monitoring and alerting
* Docker containerization
* CI/CD pipelines
* Horizontal scaling
* Load balancing
* Payment webhooks

---

# 🔮 Future Features

* Product reviews and ratings
* Wishlist
* Advanced product search
* Product filtering
* Coupons and discounts
* Pagination
* Order cancellation
* Refund handling
* Admin analytics
* Notifications
* Improved mobile UI

---

# 👨‍💻 Author

**Azizul Hasan**

B.Tech — Computer Science & Engineering (Data Science)

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project is created for learning, portfolio, and educational purposes.

```
```
