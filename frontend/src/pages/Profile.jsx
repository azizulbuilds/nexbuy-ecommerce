import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { user, setUser, loading } = useAuth();

  const [logoutLoading, setLogoutLoading] =
    useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // Logout
  // ==========================================
  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      setError("");

      await api.post("/auth/logout");

      setUser(null);

      navigate("/login");
    } catch (error) {
      console.error(
        "Logout Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Logout failed. Please try again."
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================
  if (loading) {
    return (
      <div style={centerStyle}>
        <div style={loadingCardStyle}>
          <div style={loadingIconStyle}>
            👤
          </div>

          <h2>
            Loading profile...
          </h2>

          <p style={mutedTextStyle}>
            Please wait while we load your
            account information.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Not Logged In
  // ==========================================
  if (!user) {
    return (
      <div style={centerStyle}>
        <div style={errorCardStyle}>
          <div style={largeIconStyle}>
            🔐
          </div>

          <h2>
            You're not logged in
          </h2>

          <p style={mutedTextStyle}>
            Please log in to view your
            profile.
          </p>

          <button
            onClick={() =>
              navigate("/login")
            }
            style={buttonStyle}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const initials =
    user.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div style={pageStyle}>
      {/* ==========================================
          Header
      ========================================== */}
      <header style={headerStyle}>
        <div style={headerInnerStyle}>
          <button
            onClick={() =>
              navigate("/products")
            }
            style={logoButtonStyle}
          >
            MERN E-Commerce
          </button>

          <div style={headerActionsStyle}>
            <button
              onClick={() =>
                navigate("/products")
              }
              style={headerButtonStyle}
            >
              Products
            </button>

            <button
              onClick={() =>
                navigate("/orders")
              }
              style={headerButtonStyle}
            >
              My Orders
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================
          Main
      ========================================== */}
      <main style={mainStyle}>
        <div style={pageHeaderStyle}>
          <div>
            <h1 style={pageTitleStyle}>
              My Profile
            </h1>

            <p style={pageSubtitleStyle}>
              Manage and view your account
              information
            </p>
          </div>
        </div>

        {/* ==========================================
            Profile Card
        ========================================== */}
        <section style={profileCardStyle}>
          {/* Profile Header */}
          <div style={profileHeaderStyle}>
            <div style={avatarStyle}>
              {initials}
            </div>

            <div
              style={
                profileHeaderDetailsStyle
              }
            >
              <h2
                style={
                  profileNameStyle
                }
              >
                {user.name}
              </h2>

              <p
                style={
                  profileEmailStyle
                }
              >
                {user.email}
              </p>

              <span
                style={
                  user.role === "admin"
                    ? adminBadgeStyle
                    : userBadgeStyle
                }
              >
                {user.role === "admin"
                  ? "Administrator"
                  : "Customer"}
              </span>
            </div>
          </div>

          {/* Account Information */}
          <div
            style={
              informationSectionStyle
            }
          >
            <h3
              style={
                informationTitleStyle
              }
            >
              Account Information
            </h3>

            <div
              style={
                informationGridStyle
              }
            >
              {/* Name */}
              <div
                style={
                  informationItemStyle
                }
              >
                <div
                  style={
                    informationIconStyle
                  }
                >
                  👤
                </div>

                <div
                  style={
                    informationTextStyle
                  }
                >
                  <span
                    style={
                      informationLabelStyle
                    }
                  >
                    Full Name
                  </span>

                  <strong>
                    {user.name}
                  </strong>
                </div>
              </div>

              {/* Email */}
              <div
                style={
                  informationItemStyle
                }
              >
                <div
                  style={
                    informationIconStyle
                  }
                >
                  ✉️
                </div>

                <div
                  style={
                    informationTextStyle
                  }
                >
                  <span
                    style={
                      informationLabelStyle
                    }
                  >
                    Email Address
                  </span>

                  <strong
                    style={
                      emailValueStyle
                    }
                  >
                    {user.email}
                  </strong>
                </div>
              </div>

              {/* Role */}
              <div
                style={
                  informationItemStyle
                }
              >
                <div
                  style={
                    informationIconStyle
                  }
                >
                  🛡️
                </div>

                <div
                  style={
                    informationTextStyle
                  }
                >
                  <span
                    style={
                      informationLabelStyle
                    }
                  >
                    Account Role
                  </span>

                  <strong
                    style={{
                      textTransform:
                        "capitalize",
                    }}
                  >
                    {user.role}
                  </strong>
                </div>
              </div>

              {/* Verification */}
              <div
                style={
                  informationItemStyle
                }
              >
                <div
                  style={
                    informationIconStyle
                  }
                >
                  {user.isVerified
                    ? "✓"
                    : "⚠️"}
                </div>

                <div
                  style={
                    informationTextStyle
                  }
                >
                  <span
                    style={
                      informationLabelStyle
                    }
                  >
                    Email Verification
                  </span>

                  <strong>
                    {user.isVerified
                      ? "Verified"
                      : "Not Verified"}
                  </strong>
                </div>

                <span
                  style={
                    user.isVerified
                      ? verifiedBadgeStyle
                      : unverifiedBadgeStyle
                  }
                >
                  {user.isVerified
                    ? "Verified"
                    : "Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Panel */}
          {user.role === "admin" && (
            <div
              style={
                adminPanelStyle
              }
            >
              <div>
                <strong>
                  Admin Account
                </strong>

                <p
                  style={
                    adminPanelTextStyle
                  }
                >
                  You have access to the
                  administration panel.
                </p>
              </div>

              <button
                onClick={() =>
                  navigate("/admin")
                }
                style={
                  adminButtonStyle
                }
              >
                Open Admin Panel →
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={logoutErrorStyle}>
              ⚠️ {error}
            </div>
          )}

          {/* Actions */}
          <div style={actionsStyle}>
            <button
              onClick={() =>
                navigate("/orders")
              }
              style={
                secondaryButtonStyle
              }
            >
              View My Orders
            </button>

            <button
              onClick={() =>
                navigate("/products")
              }
              style={
                secondaryButtonStyle
              }
            >
              Continue Shopping
            </button>

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
          </div>
        </section>
      </main>
    </div>
  );
}

// ==========================================
// Page
// ==========================================

const pageStyle = {
  minHeight: "100vh",
  backgroundColor: "#f7f7f7",
  fontFamily:
    "Inter, Arial, sans-serif",
};

const mainStyle = {
  maxWidth: "850px",
  margin: "0 auto",
  padding: "35px 20px 60px",
};

// ==========================================
// Header
// ==========================================

const headerStyle = {
  backgroundColor: "#222",
  color: "white",
};

const headerInnerStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "18px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
};

const logoButtonStyle = {
  border: "none",
  backgroundColor: "transparent",
  color: "white",
  fontSize: "20px",
  fontWeight: "700",
  cursor: "pointer",
  padding: 0,
};

const headerActionsStyle = {
  display: "flex",
  gap: "10px",
};

const headerButtonStyle = {
  padding: "9px 14px",
  border: "1px solid #777",
  borderRadius: "7px",
  backgroundColor: "transparent",
  color: "white",
  cursor: "pointer",
  fontSize: "13px",
};

// ==========================================
// Page Header
// ==========================================

const pageHeaderStyle = {
  marginBottom: "22px",
};

const pageTitleStyle = {
  margin: 0,
  fontSize: "30px",
};

const pageSubtitleStyle = {
  margin: "6px 0 0",
  color: "#777",
  fontSize: "14px",
};

// ==========================================
// Profile
// ==========================================

const profileCardStyle = {
  backgroundColor: "white",
  borderRadius: "15px",
  padding: "30px",
  boxShadow:
    "0 4px 20px rgba(0,0,0,0.06)",
};

const profileHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
  paddingBottom: "25px",
  borderBottom: "1px solid #eee",
};

const avatarStyle = {
  width: "75px",
  height: "75px",
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  backgroundColor: "#222",
  color: "white",
  fontSize: "25px",
  fontWeight: "700",
};

const profileHeaderDetailsStyle = {
  minWidth: 0,
};

const profileNameStyle = {
  margin: 0,
  fontSize: "23px",
};

const profileEmailStyle = {
  margin: "5px 0 9px",
  color: "#777",
  fontSize: "14px",
  wordBreak: "break-all",
};

const baseRoleBadgeStyle = {
  display: "inline-block",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "10px",
  fontWeight: "700",
};

const adminBadgeStyle = {
  ...baseRoleBadgeStyle,
  backgroundColor: "#eee",
  color: "#222",
};

const userBadgeStyle = {
  ...baseRoleBadgeStyle,
  backgroundColor: "#f1f1f1",
  color: "#666",
};

// ==========================================
// Information
// ==========================================

const informationSectionStyle = {
  paddingTop: "25px",
};

const informationTitleStyle = {
  margin: "0 0 17px",
  fontSize: "17px",
};

const informationGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "12px",
};

const informationItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  minWidth: 0,
  padding: "15px",
  border: "1px solid #eee",
  borderRadius: "9px",
};

const informationIconStyle = {
  width: "36px",
  height: "36px",
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "8px",
  backgroundColor: "#f4f4f4",
  fontSize: "16px",
};

const informationTextStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  flex: 1,
  minWidth: 0,
};

const informationLabelStyle = {
  color: "#888",
  fontSize: "10px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const emailValueStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const verifiedBadgeStyle = {
  padding: "5px 8px",
  borderRadius: "15px",
  backgroundColor: "#e9f7ee",
  color: "#26733f",
  fontSize: "9px",
  fontWeight: "700",
  whiteSpace: "nowrap",
};

const unverifiedBadgeStyle = {
  padding: "5px 8px",
  borderRadius: "15px",
  backgroundColor: "#fff4dc",
  color: "#956300",
  fontSize: "9px",
  fontWeight: "700",
  whiteSpace: "nowrap",
};

// ==========================================
// Admin
// ==========================================

const adminPanelStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  marginTop: "22px",
  padding: "17px",
  borderRadius: "9px",
  backgroundColor: "#f5f5f5",
};

const adminPanelTextStyle = {
  margin: "5px 0 0",
  color: "#777",
  fontSize: "12px",
};

const adminButtonStyle = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "7px",
  backgroundColor: "#222",
  color: "white",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
  whiteSpace: "nowrap",
};

// ==========================================
// Actions
// ==========================================

const actionsStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "25px",
  paddingTop: "22px",
  borderTop: "1px solid #eee",
};

const secondaryButtonStyle = {
  flex: "1 1 150px",
  padding: "12px 15px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "white",
  color: "#222",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600",
};

const logoutButtonStyle = {
  flex: "1 1 120px",
  padding: "12px 15px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#222",
  color: "white",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600",
};

const disabledButtonStyle = {
  opacity: 0.6,
  cursor: "wait",
};

const logoutErrorStyle = {
  marginTop: "18px",
  padding: "12px",
  borderRadius: "8px",
  backgroundColor: "#fff0f0",
  color: "#a52d2d",
  fontSize: "13px",
};

// ==========================================
// Loading / Error
// ==========================================

const centerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  fontFamily:
    "Inter, Arial, sans-serif",
};

const loadingCardStyle = {
  textAlign: "center",
};

const loadingIconStyle = {
  fontSize: "45px",
};

const errorCardStyle = {
  width: "100%",
  maxWidth: "420px",
  padding: "40px",
  textAlign: "center",
  backgroundColor: "white",
  borderRadius: "14px",
  boxShadow:
    "0 4px 20px rgba(0,0,0,0.08)",
};

const largeIconStyle = {
  fontSize: "45px",
  marginBottom: "10px",
};

const mutedTextStyle = {
  color: "#777",
  fontSize: "14px",
  lineHeight: "1.6",
};

const buttonStyle = {
  padding: "12px 22px",
  marginTop: "12px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#222",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
};

export default Profile;