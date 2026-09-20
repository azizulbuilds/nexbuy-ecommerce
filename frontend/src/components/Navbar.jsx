import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, setUser, loading } = useAuth();

  const [logoutLoading, setLogoutLoading] =
    useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);

      await api.post("/auth/logout");

      setUser(null);
      setMenuOpen(false);

      navigate("/login", { replace: true });
    } catch (error) {
      console.error(
        "Logout Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Logout failed. Please try again."
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  const isActive = (path) => {
    if (path === "/products") {
      return (
        location.pathname === "/products" ||
        location.pathname.startsWith(
          "/products/"
        )
      );
    }

    return location.pathname === path;
  };

  return (
    <nav style={navStyle}>
      <div style={navInnerStyle}>
        {/* Logo */}
        <button
          onClick={() =>
            handleNavigate("/")
          }
          style={logoStyle}
        >
          Nexbuy
        </button>

        {/* Desktop Navigation */}
        <div className="navbar-desktop-links" style={desktopLinksStyle}>
          <button
            onClick={() =>
              handleNavigate("/products")
            }
            style={{
              ...linkStyle,
              ...(isActive("/products")
                ? activeLinkStyle
                : {}),
            }}
          >
            Products
          </button>

          {user && (
            <>
              <button
                onClick={() =>
                  handleNavigate("/cart")
                }
                style={{
                  ...linkStyle,
                  ...(isActive("/cart")
                    ? activeLinkStyle
                    : {}),
                }}
              >
                Cart
              </button>

              <button
                onClick={() =>
                  handleNavigate("/orders")
                }
                style={{
                  ...linkStyle,
                  ...(isActive("/orders")
                    ? activeLinkStyle
                    : {}),
                }}
              >
                My Orders
              </button>

              <button
                onClick={() =>
                  handleNavigate("/profile")
                }
                style={{
                  ...linkStyle,
                  ...(isActive("/profile")
                    ? activeLinkStyle
                    : {}),
                }}
              >
                Profile
              </button>

              {user.role === "admin" && (
                <button
                  onClick={() =>
                    handleNavigate("/admin")
                  }
                  style={{
                    ...adminButtonStyle,
                    ...(location.pathname.startsWith(
                      "/admin"
                    )
                      ? activeAdminButtonStyle
                      : {}),
                  }}
                >
                  👑 Admin
                </button>
              )}

              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                style={{
                  ...logoutButtonStyle,
                  ...(logoutLoading
                    ? disabledButtonStyle
                    : {}),
                }}
              >
                {logoutLoading
                  ? "Logging out..."
                  : "Logout"}
              </button>
            </>
          )}

          {!loading && !user && (
            <>
              <button
                onClick={() =>
                  handleNavigate("/login")
                }
                style={{
                  ...linkStyle,
                  ...(isActive("/login")
                    ? activeLinkStyle
                    : {}),
                }}
              >
                Login
              </button>

              <button
                onClick={() =>
                  handleNavigate("/register")
                }
                style={registerButtonStyle}
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          className="navbar-mobile-menu-button"
          style={mobileMenuButtonStyle}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="navbar-mobile-menu" style={mobileMenuStyle}>
          <button
            onClick={() =>
              handleNavigate("/products")
            }
            style={mobileLinkStyle}
          >
            🛍️ Products
          </button>

          {user ? (
            <>
              <button
                onClick={() =>
                  handleNavigate("/cart")
                }
                style={mobileLinkStyle}
              >
                🛒 Cart
              </button>

              <button
                onClick={() =>
                  handleNavigate("/orders")
                }
                style={mobileLinkStyle}
              >
                📦 My Orders
              </button>

              <button
                onClick={() =>
                  handleNavigate("/profile")
                }
                style={mobileLinkStyle}
              >
                👤 Profile
              </button>

              {user.role === "admin" && (
                <button
                  onClick={() =>
                    handleNavigate("/admin")
                  }
                  style={
                    mobileAdminLinkStyle
                  }
                >
                  👑 Admin Panel
                </button>
              )}

              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                style={mobileLogoutStyle}
              >
                {logoutLoading
                  ? "Logging out..."
                  : "Logout"}
              </button>
            </>
          ) : (
            !loading && (
              <>
                <button
                  onClick={() =>
                    handleNavigate("/login")
                  }
                  style={mobileLinkStyle}
                >
                  🔐 Login
                </button>

                <button
                  onClick={() =>
                    handleNavigate("/register")
                  }
                  style={
                    mobileRegisterStyle
                  }
                >
                  Register
                </button>
              </>
            )
          )}
        </div>
      )}
    </nav>
  );
}

// ==========================================
// Navbar Styles
// ==========================================

const navStyle = {
  position: "sticky",
  top: 0,
  zIndex: 1000,
  width: "100%",
  backgroundColor: "#222",
  color: "white",
  boxShadow:
    "0 2px 10px rgba(0,0,0,0.15)",
  fontFamily:
    "Inter, Arial, sans-serif",
};

const navInnerStyle = {
  minHeight: "65px",
  maxWidth: "1150px",
  margin: "0 auto",
  padding: "0 20px",
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const logoStyle = {
  border: "none",
  backgroundColor: "transparent",
  color: "white",
  fontSize: "24px",
  fontWeight: "800",
  cursor: "pointer",
  padding: 0,
  whiteSpace: "nowrap",
  letterSpacing: "-0.5px",
};

const desktopLinksStyle = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
};

const linkStyle = {
  border: "none",
  borderRadius: "7px",
  backgroundColor: "transparent",
  color: "#ddd",
  padding: "9px 12px",
  fontSize: "13px",
  cursor: "pointer",
};

const activeLinkStyle = {
  backgroundColor: "#333",
  color: "white",
};

const adminButtonStyle = {
  border: "none",
  borderRadius: "7px",
  backgroundColor: "#f0ad00",
  color: "#222",
  padding: "9px 13px",
  fontSize: "13px",
  fontWeight: "700",
  cursor: "pointer",
};

const activeAdminButtonStyle = {
  backgroundColor: "#ffc107",
};

const logoutButtonStyle = {
  border: "none",
  borderRadius: "7px",
  backgroundColor: "#dc3545",
  color: "white",
  padding: "9px 13px",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
};

const disabledButtonStyle = {
  opacity: 0.6,
  cursor: "wait",
};

const registerButtonStyle = {
  border: "none",
  borderRadius: "7px",
  backgroundColor: "white",
  color: "#222",
  padding: "9px 14px",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
};

const mobileMenuButtonStyle = {
  display: "none",
  border: "1px solid #666",
  borderRadius: "7px",
  backgroundColor: "transparent",
  color: "white",
  padding: "7px 10px",
  fontSize: "20px",
  cursor: "pointer",
};

const mobileMenuStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  padding: "10px 20px 15px",
  borderTop: "1px solid #444",
  backgroundColor: "#222",
};

const mobileLinkStyle = {
  width: "100%",
  padding: "12px",
  border: "none",
  borderRadius: "7px",
  backgroundColor: "#2d2d2d",
  color: "white",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "14px",
};

const mobileAdminLinkStyle = {
  ...mobileLinkStyle,
  backgroundColor: "#f0ad00",
  color: "#222",
  fontWeight: "700",
};

const mobileLogoutStyle = {
  ...mobileLinkStyle,
  backgroundColor: "#dc3545",
  textAlign: "center",
};

const mobileRegisterStyle = {
  ...mobileLinkStyle,
  backgroundColor: "white",
  color: "#222",
  textAlign: "center",
  fontWeight: "600",
};

export default Navbar;