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
                style={informationItemStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 28px rgba(15,23,42,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 5px 18px rgba(15,23,42,0.04)";
                }}
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
                style={informationItemStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 28px rgba(15,23,42,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 5px 18px rgba(15,23,42,0.04)";
                }}
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
                style={informationItemStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 28px rgba(15,23,42,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 5px 18px rgba(15,23,42,0.04)";
                }}
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
                style={informationItemStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 28px rgba(15,23,42,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 5px 18px rgba(15,23,42,0.04)";
                }}
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
  background:
    "radial-gradient(circle at top left, rgba(99,102,241,0.12), transparent 28%), linear-gradient(180deg, #f8faff 0%, #f7f8fc 55%, #ffffff 100%)",
  fontFamily: "Inter, Arial, sans-serif",
  color: "#0f172a",
};

const mainStyle = {
  maxWidth: "980px",
  margin: "0 auto",
  padding: "42px 24px 72px",
};

// ==========================================
// Header
// ==========================================

const headerStyle = {
  background:
    "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #312e81 100%)",
  color: "white",
  boxShadow: "0 12px 35px rgba(15,23,42,0.14)",
};

const headerInnerStyle = {
  maxWidth: "1160px",
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
  fontSize: "21px",
  fontWeight: "850",
  letterSpacing: "-0.5px",
  cursor: "pointer",
  padding: 0,
};

const headerActionsStyle = {
  display: "flex",
  gap: "9px",
};

const headerButtonStyle = {
  padding: "9px 14px",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: "10px",
  backgroundColor: "rgba(255,255,255,0.08)",
  color: "white",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "700",
};

// ==========================================
// Page Header
// ==========================================

const pageHeaderStyle = {
  marginBottom: "25px",
  padding: "28px 30px",
  borderRadius: "24px",
  background:
    "linear-gradient(135deg, #0f172a 0%, #1e293b 58%, #4338ca 100%)",
  boxShadow: "0 18px 50px rgba(15,23,42,0.15)",
  color: "white",
};

const pageTitleStyle = {
  margin: 0,
  fontSize: "clamp(34px, 5vw, 48px)",
  fontWeight: "850",
  letterSpacing: "-1.5px",
};

const pageSubtitleStyle = {
  margin: "9px 0 0",
  color: "#cbd5e1",
  fontSize: "14px",
};

// ==========================================
// Profile
// ==========================================

const profileCardStyle = {
  position: "relative",
  overflow: "hidden",
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,255,0.96))",
  border: "1px solid #e0e7ff",
  borderRadius: "24px",
  padding: "30px",
  boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
};

const profileHeaderStyle = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: "20px",
  padding: "24px",
  marginBottom: "25px",
  borderRadius: "20px",
  background:
    "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 55%, #ffffff 100%)",
  border: "1px solid #e0e7ff",
};

const avatarStyle = {
  width: "92px",
  height: "92px",
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
  color: "white",
  fontSize: "29px",
  fontWeight: "850",
  boxShadow:
    "0 12px 28px rgba(79,70,229,0.28), inset 0 0 0 4px rgba(255,255,255,0.18)",
};

const profileHeaderDetailsStyle = {
  minWidth: 0,
};

const profileNameStyle = {
  margin: 0,
  fontSize: "clamp(24px, 4vw, 31px)",
  fontWeight: "850",
  color: "#0f172a",
  letterSpacing: "-0.8px",
};

const profileEmailStyle = {
  margin: "6px 0 10px",
  color: "#64748b",
  fontSize: "14px",
  wordBreak: "break-all",
};

const baseRoleBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "10px",
  fontWeight: "800",
  letterSpacing: "0.4px",
  textTransform: "uppercase",
};

const adminBadgeStyle = {
  ...baseRoleBadgeStyle,
  backgroundColor: "#ede9fe",
  color: "#6d28d9",
  border: "1px solid #ddd6fe",
};

const userBadgeStyle = {
  ...baseRoleBadgeStyle,
  backgroundColor: "#e0e7ff",
  color: "#4338ca",
  border: "1px solid #c7d2fe",
};

// ==========================================
// Information
// ==========================================

const informationSectionStyle = {
  paddingTop: "3px",
};

const informationTitleStyle = {
  margin: "0 0 16px",
  fontSize: "18px",
  fontWeight: "850",
  letterSpacing: "-0.3px",
};

const informationGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "13px",
};

const informationItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  minWidth: 0,
  padding: "16px",
  border: "1px solid #e2e8f0",
  borderRadius: "15px",
  backgroundColor: "rgba(255,255,255,0.86)",
  boxShadow: "0 5px 18px rgba(15,23,42,0.04)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const informationIconStyle = {
  width: "40px",
  height: "40px",
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "12px",
  background:
    "linear-gradient(135deg, #eef2ff, #ede9fe)",
  color: "#4f46e5",
  fontSize: "17px",
};

const informationTextStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  flex: 1,
  minWidth: 0,
};

const informationLabelStyle = {
  color: "#94a3b8",
  fontSize: "10px",
  fontWeight: "800",
  textTransform: "uppercase",
  letterSpacing: "0.6px",
};

const emailValueStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: "#1e293b",
  fontSize: "13px",
};

const verifiedBadgeStyle = {
  padding: "6px 9px",
  borderRadius: "999px",
  backgroundColor: "#dcfce7",
  border: "1px solid #bbf7d0",
  color: "#15803d",
  fontSize: "9px",
  fontWeight: "800",
  whiteSpace: "nowrap",
};

const unverifiedBadgeStyle = {
  padding: "6px 9px",
  borderRadius: "999px",
  backgroundColor: "#fef3c7",
  border: "1px solid #fde68a",
  color: "#a16207",
  fontSize: "9px",
  fontWeight: "800",
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
  padding: "18px",
  borderRadius: "15px",
  background:
    "linear-gradient(135deg, #f5f3ff, #eef2ff)",
  border: "1px solid #ddd6fe",
};

const adminPanelTextStyle = {
  margin: "5px 0 0",
  color: "#64748b",
  fontSize: "12px",
};

const adminButtonStyle = {
  padding: "11px 16px",
  border: "none",
  borderRadius: "11px",
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "white",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "800",
  whiteSpace: "nowrap",
  boxShadow: "0 8px 20px rgba(79,70,229,0.20)",
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
  borderTop: "1px solid #e2e8f0",
};

const secondaryButtonStyle = {
  flex: "1 1 150px",
  padding: "13px 15px",
  border: "1px solid #dbe2ea",
  borderRadius: "11px",
  backgroundColor: "white",
  color: "#334155",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "750",
};

const logoutButtonStyle = {
  flex: "1 1 120px",
  padding: "13px 15px",
  border: "none",
  borderRadius: "11px",
  background:
    "linear-gradient(135deg, #0f172a, #1e293b)",
  color: "white",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "750",
};

const disabledButtonStyle = {
  opacity: 0.6,
  cursor: "wait",
};

const logoutErrorStyle = {
  marginTop: "18px",
  padding: "13px",
  borderRadius: "12px",
  backgroundColor: "#fff1f2",
  border: "1px solid #fecdd3",
  color: "#be123c",
  fontSize: "13px",
  fontWeight: "600",
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
  fontFamily: "Inter, Arial, sans-serif",
  background:
    "radial-gradient(circle at top, rgba(99,102,241,0.10), transparent 35%), #f8fafc",
};

const loadingCardStyle = {
  textAlign: "center",
  padding: "45px",
  backgroundColor: "white",
  borderRadius: "22px",
  border: "1px solid #e0e7ff",
  boxShadow: "0 15px 45px rgba(15,23,42,0.08)",
};

const loadingIconStyle = {
  fontSize: "48px",
};

const errorCardStyle = {
  width: "100%",
  maxWidth: "420px",
  padding: "42px",
  textAlign: "center",
  backgroundColor: "white",
  border: "1px solid #e0e7ff",
  borderRadius: "22px",
  boxShadow: "0 15px 45px rgba(15,23,42,0.08)",
};

const largeIconStyle = {
  fontSize: "48px",
  marginBottom: "10px",
};

const mutedTextStyle = {
  color: "#64748b",
  fontSize: "14px",
  lineHeight: "1.6",
};

const buttonStyle = {
  padding: "13px 23px",
  marginTop: "12px",
  border: "none",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "750",
  boxShadow: "0 9px 22px rgba(79,70,229,0.22)",
};
export default Profile;
