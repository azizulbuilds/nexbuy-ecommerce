import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ==========================================
  // Handle Input
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // Register
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/register",
        formData
      );

      setMessage(response.data.message);

      navigate("/verify-otp", {
        state: {
          email: response.data.email,
        },
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      {/* ==========================================
          LEFT — BRAND / HERO SECTION
      ========================================== */}

      <section style={heroSectionStyle}>
        <div style={heroGlowTopStyle} />
        <div style={heroGlowBottomStyle} />

        <div style={heroContentStyle}>
          {/* Logo */}

          <button
            onClick={() => navigate("/")}
            style={logoStyle}
          >
            Nex<span>buy</span>
          </button>

          <p style={taglineStyle}>
            Shop Smarter. Live Better.
          </p>

          {/* Community Badge */}

          <div style={communityBadgeStyle}>
            <span>✦</span>
            Join Our Community
          </div>

          {/* Hero Heading */}

          <h1 style={heroTitleStyle}>
            Start Your
            <br />
            <span>Nexbuy</span> Journey
          </h1>

          <p style={heroDescriptionStyle}>
            Create an account and get access to
            exclusive products, fast checkout,
            order tracking and more.
          </p>

          {/* Benefits */}

          <div style={benefitsStyle}>
            <Benefit
              icon="🚚"
              title="Fast & Secure Shopping"
              description="Safe payments and quick delivery"
            />

            <Benefit
              icon="🏷️"
              title="Exclusive Deals"
              description="Get notified about special offers"
            />

            <Benefit
              icon="📦"
              title="Track Your Orders"
              description="Stay updated in real time"
            />

            <Benefit
              icon="♥"
              title="Personalized Experience"
              description="A better shopping experience for you"
            />
          </div>
        </div>

        {/* Decorative Shopping Area */}

        <div style={shoppingDecorationStyle}>
          <div style={shoppingGlowStyle} />

          <div style={shoppingBagStyle}>
            <div style={bagHandleStyle} />

            <div style={bagLogoStyle}>
              Nex<span>buy</span>
            </div>
          </div>

          <div style={floatingCardStyle}>
            <div style={floatingHeartStyle}>
              ♥
            </div>

            <div>
              <strong style={floatingTitleStyle}>
                More than a store
              </strong>

              <p style={floatingTextStyle}>
                A better shopping experience
                awaits you!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          RIGHT — REGISTER FORM
      ========================================== */}

      <section style={formSectionStyle}>
        <div style={formCardStyle}>
          {/* Heading */}

          <div style={formHeaderStyle}>
            <div style={formBadgeStyle}>
              ✦ Join Nexbuy
            </div>

            <h2 style={formTitleStyle}>
              Create Your Account
            </h2>

            <p style={formSubtitleStyle}>
              Join Nexbuy and start your shopping
              journey today!
            </p>
          </div>

          {/* Form */}

          <form onSubmit={handleSubmit}>
            {/* Name */}

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                Full Name
              </label>

              <div style={inputWrapperStyle}>
                <span style={inputIconStyle}>
                  ♙
                </span>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.parentElement.style.borderColor =
                      "#6366f1";

                    e.currentTarget.parentElement.style.boxShadow =
                      "0 0 0 4px rgba(99,102,241,0.10)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.parentElement.style.borderColor =
                      "#dbe2ea";

                    e.currentTarget.parentElement.style.boxShadow =
                      "none";
                  }}
                />
              </div>
            </div>

            {/* Email */}

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                Email Address
              </label>

              <div style={inputWrapperStyle}>
                <span style={inputIconStyle}>
                  ✉
                </span>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.parentElement.style.borderColor =
                      "#6366f1";

                    e.currentTarget.parentElement.style.boxShadow =
                      "0 0 0 4px rgba(99,102,241,0.10)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.parentElement.style.borderColor =
                      "#dbe2ea";

                    e.currentTarget.parentElement.style.boxShadow =
                      "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}

            <div style={fieldGroupStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <label style={labelStyle}>
                  Password
                </label>

                <span style={passwordHintStyle}>
                  8+ characters recommended
                </span>
              </div>

              <div style={inputWrapperStyle}>
                <span style={inputIconStyle}>
                  🔒
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  style={passwordInputStyle}
                  onFocus={(e) => {
                    e.currentTarget.parentElement.style.borderColor =
                      "#6366f1";

                    e.currentTarget.parentElement.style.boxShadow =
                      "0 0 0 4px rgba(99,102,241,0.10)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.parentElement.style.borderColor =
                      "#dbe2ea";

                    e.currentTarget.parentElement.style.boxShadow =
                      "none";
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  style={passwordToggleStyle}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "◉" : "◌"}
                </button>
              </div>
            </div>

            {/* Security Notice */}

            <div style={securityBoxStyle}>
              <div style={securityIconStyle}>
                ✓
              </div>

              <div>
                <strong style={securityTitleStyle}>
                  Your account is protected
                </strong>

                <p style={securityTextStyle}>
                  Your account information is handled
                  securely throughout registration.
                </p>
              </div>
            </div>

            {/* Messages */}

            {message && (
              <div style={successMessageStyle}>
                ✓ {message}
              </div>
            )}

            {error && (
              <div style={errorMessageStyle}>
                ⚠ {error}
              </div>
            )}

            {/* Register Button */}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...registerButtonStyle,
                ...(loading
                  ? disabledButtonStyle
                  : {}),
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform =
                    "translateY(-2px)";

                  e.currentTarget.style.boxShadow =
                    "0 14px 30px rgba(79,70,229,0.30)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0)";

                e.currentTarget.style.boxShadow =
                  "0 8px 22px rgba(79,70,229,0.22)";
              }}
            >
              {loading ? (
                <>
                  <span style={spinnerStyle}>
                    ◌
                  </span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <span style={arrowStyle}>
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Login */}

          <div style={orContainerStyle}>
            <span style={lineStyle} />
            <span style={orTextStyle}>OR</span>
            <span style={lineStyle} />
          </div>

          <p style={loginTextStyle}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={loginButtonStyle}
            >
              Login here
            </button>
          </p>

          {/* Trust Features */}

          <div style={trustFeaturesStyle}>
            <TrustFeature
              icon="✓"
              label="Secure"
            />

            <div style={trustDividerStyle} />

            <TrustFeature
              icon="ϟ"
              label="Fast"
            />

            <div style={trustDividerStyle} />

            <TrustFeature
              icon="♡"
              label="Reliable"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// ==========================================
// Small Components
// ==========================================

function Benefit({
  icon,
  title,
  description,
}) {
  return (
    <div style={benefitStyle}>
      <div style={benefitIconStyle}>
        {icon}
      </div>

      <div>
        <strong style={benefitTitleStyle}>
          {title}
        </strong>

        <p style={benefitDescriptionStyle}>
          {description}
        </p>
      </div>
    </div>
  );
}

function TrustFeature({ icon, label }) {
  return (
    <div style={trustFeatureStyle}>
      <div style={trustIconStyle}>
        {icon}
      </div>

      <span style={trustLabelStyle}>
        {label}
      </span>
    </div>
  );
}

// ==========================================
// Page
// ==========================================

const pageStyle = {
  minHeight: "100vh",
  display: "grid",
  gridTemplateColumns: "minmax(420px, 0.9fr) minmax(520px, 1.1fr)",
  background:
    "linear-gradient(135deg, #f8faff 0%, #ffffff 100%)",
  fontFamily:
    "Inter, Arial, sans-serif",
};

// ==========================================
// Hero Section
// ==========================================

const heroSectionStyle = {
  position: "relative",
  minHeight: "100vh",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "55px 65px 0",
  background:
    "linear-gradient(145deg, #111936 0%, #172554 48%, #312e81 100%)",
  color: "white",
};

const heroContentStyle = {
  position: "relative",
  zIndex: 2,
  maxWidth: "520px",
};

const heroGlowTopStyle = {
  position: "absolute",
  width: "420px",
  height: "420px",
  borderRadius: "50%",
  top: "-250px",
  right: "-130px",
  background:
    "radial-gradient(circle, rgba(99,102,241,0.45), transparent 68%)",
};

const heroGlowBottomStyle = {
  position: "absolute",
  width: "520px",
  height: "520px",
  borderRadius: "50%",
  bottom: "-320px",
  right: "-140px",
  background:
    "radial-gradient(circle, rgba(124,58,237,0.55), transparent 68%)",
};

const logoStyle = {
  padding: 0,
  border: "none",
  background: "transparent",
  color: "white",
  fontSize: "40px",
  fontWeight: "900",
  letterSpacing: "-2px",
  cursor: "pointer",
};

const taglineStyle = {
  margin: "2px 0 0",
  color: "#a5b4fc",
  fontSize: "15px",
  fontWeight: "600",
};

const communityBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  marginTop: "70px",
  padding: "9px 15px",
  borderRadius: "999px",
  border: "1px solid rgba(165,180,252,0.28)",
  backgroundColor: "rgba(255,255,255,0.07)",
  color: "#dbeafe",
  fontSize: "13px",
  fontWeight: "650",
  backdropFilter: "blur(12px)",
};

const heroTitleStyle = {
  margin: "27px 0 0",
  fontSize: "clamp(42px, 5vw, 68px)",
  lineHeight: "1.02",
  letterSpacing: "-2.8px",
  fontWeight: "900",
};

const heroDescriptionStyle = {
  maxWidth: "500px",
  margin: "25px 0 0",
  color: "#c7d2fe",
  fontSize: "17px",
  lineHeight: "1.7",
};

const benefitsStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "21px",
  marginTop: "38px",
};

const benefitStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const benefitIconStyle = {
  width: "47px",
  height: "47px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  border: "1px solid rgba(129,140,248,0.35)",
  background:
    "linear-gradient(145deg, rgba(99,102,241,0.22), rgba(255,255,255,0.06))",
  color: "#c7d2fe",
  fontSize: "19px",
  boxShadow:
    "inset 0 0 20px rgba(99,102,241,0.08)",
};

const benefitTitleStyle = {
  display: "block",
  color: "white",
  fontSize: "14px",
  fontWeight: "800",
};

const benefitDescriptionStyle = {
  margin: "4px 0 0",
  color: "#a5b4fc",
  fontSize: "12px",
};

// ==========================================
// Shopping Decoration
// ==========================================

const shoppingDecorationStyle = {
  position: "relative",
  zIndex: 2,
  height: "215px",
  marginTop: "35px",
};

const shoppingGlowStyle = {
  position: "absolute",
  bottom: "-120px",
  left: "40px",
  width: "400px",
  height: "180px",
  borderRadius: "50%",
  background:
    "radial-gradient(ellipse, rgba(99,102,241,0.50), transparent 70%)",
  filter: "blur(8px)",
};

const shoppingBagStyle = {
  position: "absolute",
  left: "45px",
  bottom: "-4px",
  width: "230px",
  height: "160px",
  borderRadius: "8px 8px 18px 18px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background:
    "linear-gradient(145deg, #1d4ed8, #312e81)",
  boxShadow:
    "0 25px 45px rgba(0,0,0,0.35)",
  transform: "perspective(500px) rotateX(3deg)",
};

const bagHandleStyle = {
  position: "absolute",
  width: "90px",
  height: "65px",
  top: "-52px",
  left: "70px",
  border: "6px solid #111827",
  borderBottom: "none",
  borderRadius: "60px 60px 0 0",
};

const bagLogoStyle = {
  fontSize: "29px",
  fontWeight: "900",
  color: "white",
  letterSpacing: "-1px",
};

const floatingCardStyle = {
  position: "absolute",
  left: "245px",
  bottom: "35px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "190px",
  padding: "13px",
  borderRadius: "15px",
  backgroundColor: "rgba(255,255,255,0.11)",
  border: "1px solid rgba(255,255,255,0.18)",
  backdropFilter: "blur(15px)",
  boxShadow: "0 15px 35px rgba(0,0,0,0.18)",
};

const floatingHeartStyle = {
  width: "30px",
  height: "30px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  backgroundColor: "rgba(99,102,241,0.35)",
  color: "#c4b5fd",
};

const floatingTitleStyle = {
  display: "block",
  color: "white",
  fontSize: "10px",
};

const floatingTextStyle = {
  margin: "4px 0 0",
  color: "#c7d2fe",
  fontSize: "9px",
  lineHeight: "1.4",
};

// ==========================================
// Form Section
// ==========================================

const formSectionStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "45px",
  background:
    "radial-gradient(circle at top right, rgba(99,102,241,0.08), transparent 35%), #f8fafc",
};

const formCardStyle = {
  width: "100%",
  maxWidth: "570px",
  padding: "48px 42px",
  borderRadius: "24px",
  backgroundColor: "rgba(255,255,255,0.94)",
  border: "1px solid #e2e8f0",
  boxShadow:
    "0 25px 70px rgba(15,23,42,0.10)",
};

const formHeaderStyle = {
  textAlign: "center",
  marginBottom: "31px",
};

const formBadgeStyle = {
  display: "inline-flex",
  padding: "6px 11px",
  marginBottom: "14px",
  borderRadius: "999px",
  backgroundColor: "#eef2ff",
  border: "1px solid #e0e7ff",
  color: "#4f46e5",
  fontSize: "10px",
  fontWeight: "800",
  textTransform: "uppercase",
  letterSpacing: "0.6px",
};

const formTitleStyle = {
  margin: 0,
  color: "#0f172a",
  fontSize: "34px",
  fontWeight: "900",
  letterSpacing: "-1.3px",
};

const formSubtitleStyle = {
  margin: "10px auto 0",
  maxWidth: "400px",
  color: "#64748b",
  fontSize: "14px",
  lineHeight: "1.5",
};

const fieldGroupStyle = {
  marginBottom: "19px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#0f172a",
  fontSize: "13px",
  fontWeight: "800",
};

const passwordHintStyle = {
  color: "#94a3b8",
  fontSize: "10px",
};

const inputWrapperStyle = {
  display: "flex",
  alignItems: "center",
  minHeight: "52px",
  border: "1px solid #dbe2ea",
  borderRadius: "12px",
  backgroundColor: "#fff",
  overflow: "hidden",
  transition:
    "border-color 0.2s ease, box-shadow 0.2s ease",
};

const inputIconStyle = {
  width: "48px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748b",
  fontSize: "18px",
};

const inputStyle = {
  flex: 1,
  width: "100%",
  minWidth: 0,
  padding: "15px 14px 15px 0",
  border: "none",
  outline: "none",
  backgroundColor: "transparent",
  color: "#0f172a",
  fontSize: "14px",
  fontFamily: "inherit",
};

const passwordInputStyle = {
  ...inputStyle,
  paddingRight: "8px",
};

const passwordToggleStyle = {
  width: "48px",
  height: "48px",
  border: "none",
  background: "transparent",
  color: "#64748b",
  cursor: "pointer",
  fontSize: "18px",
};

const securityBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: "13px",
  margin: "7px 0 18px",
  padding: "14px",
  borderRadius: "13px",
  background:
    "linear-gradient(135deg, #f8fafc, #eef2ff)",
  border: "1px solid #e2e8f0",
};

const securityIconStyle = {
  width: "40px",
  height: "40px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  backgroundColor: "#dcfce7",
  color: "#16a34a",
  fontSize: "18px",
  fontWeight: "900",
};

const securityTitleStyle = {
  display: "block",
  color: "#1e293b",
  fontSize: "12px",
};

const securityTextStyle = {
  margin: "4px 0 0",
  color: "#64748b",
  fontSize: "10px",
  lineHeight: "1.5",
};

const registerButtonStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  padding: "15px",
  border: "none",
  borderRadius: "12px",
  background:
    "linear-gradient(135deg, #2563eb 0%, #4f46e5 48%, #7c3aed 100%)",
  color: "white",
  fontSize: "15px",
  fontWeight: "850",
  cursor: "pointer",
  boxShadow:
    "0 8px 22px rgba(79,70,229,0.22)",
  transition:
    "transform 0.2s ease, box-shadow 0.2s ease",
};

const arrowStyle = {
  fontSize: "21px",
  lineHeight: 1,
};

const spinnerStyle = {
  fontSize: "20px",
};

const disabledButtonStyle = {
  opacity: 0.65,
  cursor: "wait",
};

const successMessageStyle = {
  marginBottom: "15px",
  padding: "11px 13px",
  borderRadius: "10px",
  backgroundColor: "#ecfdf5",
  border: "1px solid #bbf7d0",
  color: "#15803d",
  fontSize: "12px",
  fontWeight: "650",
};

const errorMessageStyle = {
  marginBottom: "15px",
  padding: "11px 13px",
  borderRadius: "10px",
  backgroundColor: "#fff1f2",
  border: "1px solid #fecdd3",
  color: "#be123c",
  fontSize: "12px",
  fontWeight: "650",
};

const orContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  margin: "27px 0 18px",
};

const lineStyle = {
  flex: 1,
  height: "1px",
  backgroundColor: "#e2e8f0",
};

const orTextStyle = {
  color: "#94a3b8",
  fontSize: "11px",
  fontWeight: "700",
};

const loginTextStyle = {
  margin: 0,
  textAlign: "center",
  color: "#64748b",
  fontSize: "13px",
};

const loginButtonStyle = {
  border: "none",
  background: "transparent",
  padding: 0,
  color: "#4f46e5",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "850",
};

const trustFeaturesStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "24px",
  marginTop: "30px",
};

const trustFeatureStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "7px",
  minWidth: "55px",
};

const trustIconStyle = {
  width: "38px",
  height: "38px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  backgroundColor: "#eef2ff",
  color: "#4f46e5",
  fontSize: "18px",
  fontWeight: "850",
};

const trustLabelStyle = {
  color: "#475569",
  fontSize: "11px",
  fontWeight: "700",
};

const trustDividerStyle = {
  width: "1px",
  height: "35px",
  backgroundColor: "#e2e8f0",
};

export default Register;