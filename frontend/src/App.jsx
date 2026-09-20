import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import Payment from "./pages/Payment";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminProductForm from "./pages/AdminProductForm";

import Navbar from "./components/Navbar";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

// ==========================================
// Loading Screen
// ==========================================

function LoadingScreen() {
  return (
    <div style={loadingStyle}>
      <div style={loadingCardStyle}>
        <div style={loadingIconStyle}>
          🛍️
        </div>

        <h2>
          Loading MERN E-Commerce...
        </h2>

        <p style={loadingTextStyle}>
          Checking your account
          session.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// Protected Route
// ==========================================

function ProtectedRoute({
  children,
}) {
  const { user, loading } =
    useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

// ==========================================
// Admin Route
// ==========================================

function AdminRoute({
  children,
}) {
  const { user, loading } =
    useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user.role !== "admin") {
    return (
      <Navigate
        to="/products"
        replace
      />
    );
  }

  return children;
}

// ==========================================
// Public Route
// Redirect logged-in users away from
// authentication pages
// ==========================================

function GuestRoute({
  children,
}) {
  const { user, loading } =
    useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return (
      <Navigate
        to="/products"
        replace
      />
    );
  }

  return children;
}

// ==========================================
// App Content
// ==========================================

function AppContent() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* ==========================================
            Home
        ========================================== */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* ==========================================
            Guest Routes
        ========================================== */}
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        {/* ==========================================
            Public Product Routes
        ========================================== */}
        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={
            <ProductDetails />
          }
        />

        {/* ==========================================
            Protected User Routes
        ========================================== */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:id/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        {/* ==========================================
            Admin Routes
        ========================================== */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products/new"
          element={
            <AdminRoute>
              <AdminProductForm />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products/edit/:id"
          element={
            <AdminRoute>
              <AdminProductForm />
            </AdminRoute>
          }
        />

        {/* ==========================================
            Unknown Route
        ========================================== */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </>
  );
}

// ==========================================
// App
// ==========================================

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

// ==========================================
// Styles
// ==========================================

const loadingStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  backgroundColor: "#f7f7f7",
  fontFamily:
    "Inter, Arial, sans-serif",
};

const loadingCardStyle = {
  padding: "40px",
  textAlign: "center",
  backgroundColor: "white",
  borderRadius: "14px",
  boxShadow:
    "0 4px 20px rgba(0,0,0,0.07)",
};

const loadingIconStyle = {
  fontSize: "45px",
  marginBottom: "10px",
};

const loadingTextStyle = {
  margin: "5px 0 0",
  color: "#777",
  fontSize: "14px",
};

export default App;