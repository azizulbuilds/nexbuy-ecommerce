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
    <div className="nexbuy-register-page" style={pageStyle}>

      <style>{`
        .nexbuy-register-page,
        .nexbuy-register-page * {
          box-sizing: border-box;
        }

        .nexbuy-register-page input,
        .nexbuy-register-page button {
          max-width: 100%;
        }

        @media (max-width: 1050px) {
          .nexbuy-register-page { grid-template-columns: minmax(320px, .85fr) minmax(420px, 1.15fr) !important; }
          .nexbuy-register-hero { padding: 42px 38px 0 !important; }
          .nexbuy-register-form-section { padding: 30px !important; }
          .nexbuy-register-form-card { padding: 38px 32px !important; }
        }

        @media (max-width: 820px) {
          .nexbuy-register-page { display: block !important; min-height: 100vh !important; }
          .nexbuy-register-hero { min-height: auto !important; padding: 34px 24px 38px !important; display: block !important; }
          .nexbuy-register-hero-content { max-width: 100% !important; }
          .nexbuy-register-logo { font-size: 34px !important; }
          .nexbuy-register-community { margin-top: 34px !important; }
          .nexbuy-register-hero-title { font-size: clamp(38px, 9vw, 54px) !important; letter-spacing: -2px !important; }
          .nexbuy-register-hero-description { font-size: 15px !important; line-height: 1.6 !important; max-width: 600px !important; }
          .nexbuy-register-benefits { margin-top: 28px !important; gap: 16px !important; }
          .nexbuy-register-shopping { height: 150px !important; margin-top: 26px !important; }
          .nexbuy-register-shopping-glow { left: 50% !important; transform: translateX(-50%) !important; bottom: -105px !important; width: 330px !important; }
          .nexbuy-register-bag { left: 50% !important; transform: translateX(-50%) perspective(500px) rotateX(3deg) !important; width: 185px !important; height: 125px !important; }
          .nexbuy-register-bag-handle { width: 72px !important; height: 52px !important; top: -43px !important; left: 56px !important; border-width: 5px !important; }
          .nexbuy-register-bag-logo { font-size: 24px !important; }
          .nexbuy-register-floating-card { left: 50% !important; bottom: 4px !important; transform: translateX(-50%) !important; width: min(190px, 62vw) !important; padding: 10px !important; }
          .nexbuy-register-form-section { min-height: auto !important; padding: 28px 18px 44px !important; align-items: flex-start !important; }
          .nexbuy-register-form-card { max-width: 620px !important; padding: 32px 24px !important; border-radius: 20px !important; }
          .nexbuy-register-form-title { font-size: clamp(27px, 7vw, 34px) !important; }
        }

        @media (max-width: 520px) {
          .nexbuy-register-hero { padding: 27px 17px 30px !important; }
          .nexbuy-register-logo { font-size: 31px !important; }
          .nexbuy-register-tagline { font-size: 13px !important; }
          .nexbuy-register-community { margin-top: 27px !important; padding: 8px 12px !important; font-size: 11px !important; }
          .nexbuy-register-hero-title { margin-top: 20px !important; font-size: clamp(35px, 11vw, 46px) !important; line-height: 1.04 !important; }
          .nexbuy-register-hero-description { margin-top: 18px !important; font-size: 14px !important; }
          .nexbuy-register-benefits { margin-top: 23px !important; gap: 13px !important; }
          .nexbuy-register-benefit { gap: 11px !important; }
          .nexbuy-register-benefit-icon { width: 41px !important; height: 41px !important; font-size: 16px !important; }
          .nexbuy-register-benefit-title { font-size: 12px !important; }
          .nexbuy-register-benefit-description { font-size: 10px !important; }
          .nexbuy-register-shopping { height: 125px !important; margin-top: 22px !important; }
          .nexbuy-register-bag { width: 150px !important; height: 102px !important; bottom: 0 !important; }
          .nexbuy-register-bag-handle { width: 62px !important; height: 46px !important; top: -38px !important; left: 44px !important; border-width: 4px !important; }
          .nexbuy-register-bag-logo { font-size: 20px !important; }
          .nexbuy-register-floating-card { display: none !important; }
          .nexbuy-register-form-section { padding: 18px 12px 32px !important; }
          .nexbuy-register-form-card { width: 100% !important; padding: 27px 18px !important; border-radius: 18px !important; box-shadow: 0 16px 45px rgba(15,23,42,.08) !important; }
          .nexbuy-register-form-header { margin-bottom: 25px !important; }
          .nexbuy-register-form-title { font-size: 27px !important; letter-spacing: -.8px !important; line-height: 1.15 !important; }
          .nexbuy-register-form-subtitle { font-size: 12px !important; line-height: 1.5 !important; }
          .nexbuy-register-field { margin-bottom: 16px !important; }
          .nexbuy-register-password-row { gap: 8px !important; align-items: flex-start !important; }
          .nexbuy-register-password-hint { text-align: right !important; line-height: 1.2 !important; }
          .nexbuy-register-input-wrapper { min-height: 50px !important; }
          .nexbuy-register-input-icon { width: 43px !important; font-size: 16px !important; }
          .nexbuy-register-input, .nexbuy-register-password-input { min-width: 0 !important; font-size: 14px !important; }
          .nexbuy-register-password-toggle { width: 43px !important; height: 46px !important; }
          .nexbuy-register-security { align-items: flex-start !important; gap: 10px !important; padding: 12px !important; margin-top: 4px !important; }
          .nexbuy-register-security-icon { width: 36px !important; height: 36px !important; }
          .nexbuy-register-security-title { font-size: 11px !important; }
          .nexbuy-register-security-text { font-size: 9px !important; }
          .nexbuy-register-button { min-height: 50px !important; padding: 13px !important; font-size: 14px !important; }
          .nexbuy-register-or { margin: 22px 0 15px !important; }
          .nexbuy-register-login-text { font-size: 12px !important; line-height: 1.5 !important; }
          .nexbuy-register-trust { gap: 15px !important; margin-top: 24px !important; }
          .nexbuy-register-trust-divider { height: 30px !important; }
        }

        @media (max-width: 360px) {
          .nexbuy-register-hero { padding-left: 13px !important; padding-right: 13px !important; }
          .nexbuy-register-form-section { padding-left: 8px !important; padding-right: 8px !important; }
          .nexbuy-register-form-card { padding-left: 14px !important; padding-right: 14px !important; }
          .nexbuy-register-form-title { font-size: 25px !important; }
          .nexbuy-register-password-hint { font-size: 8px !important; }
          .nexbuy-register-trust { gap: 10px !important; }
        }
      `}</style>
      {/* ==========================================
          LEFT — BRAND / HERO SECTION
      ========================================== */}

      <section className="nexbuy-register-hero" style={heroSectionStyle}>
        <div style={heroGlowTopStyle} />
        <div style={heroGlowBottomStyle} />

        <div className="nexbuy-register-hero-content" style={heroContentStyle}>
          {/* Logo */}

          <button
            onClick={() => navigate("/")}
            className="nexbuy-register-logo"
            style={logoStyle}
          >
            Nex<span>buy</span>
          </button>

          <p className="nexbuy-register-tagline" style={taglineStyle}>
            Shop Smarter. Live Better.
          </p>

          {/* Community Badge */}

          <div className="nexbuy-register-community" style={communityBadgeStyle}>
            <span>✦</span>
            Join Our Community
          </div>

          {/* Hero Heading */}

          <h1 className="nexbuy-register-hero-title" style={heroTitleStyle}>
            Start Your
            <br />
            <span>Nexbuy</span> Journey
          </h1>

          <p className="nexbuy-register-hero-description" style={heroDescriptionStyle}>
            Create an account and get access to
            exclusive products, fast checkout,
            order tracking and more.
          </p>

          {/* Benefits */}

          <div className="nexbuy-register-benefits" style={benefitsStyle}>
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

        <div className="nexbuy-register-shopping" style={shoppingDecorationStyle}>
          <div className="nexbuy-register-shopping-glow" style={shoppingGlowStyle} />

          <div className="nexbuy-register-bag" style={shoppingBagStyle}>
            <div className="nexbuy-register-bag-handle" style={bagHandleStyle} />

            <div className="nexbuy-register-bag-logo" style={bagLogoStyle}>
              Nex<span>buy</span>
            </div>
          </div>

          <div className="nexbuy-register-floating-card" style={floatingCardStyle}>
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

      <section className="nexbuy-register-form-section" style={formSectionStyle}>
        <div className="nexbuy-register-form-card" style={formCardStyle}>
          {/* Heading */}

          <div className="nexbuy-register-form-header" style={formHeaderStyle}>
            <div className="nexbuy-register-form-badge" style={formBadgeStyle}>
              ✦ Join Nexbuy
            </div>

            <h2 className="nexbuy-register-form-title" style={formTitleStyle}>
              Create Your Account
            </h2>

            <p className="nexbuy-register-form-subtitle" style={formSubtitleStyle}>
              Join Nexbuy and start your shopping
              journey today!
            </p>
          </div>

          {/* Form */}

          <form onSubmit={handleSubmit}>
            {/* Name */}

            <div className="nexbuy-register-field" style={fieldGroupStyle}>
              <label style={labelStyle}>
                Full Name
              </label>

              <div className="nexbuy-register-input-wrapper" style={inputWrapperStyle}>
                <span className="nexbuy-register-input-icon" style={inputIconStyle}>
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
                  className="nexbuy-register-input"
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

            <div className="nexbuy-register-field" style={fieldGroupStyle}>
              <label style={labelStyle}>
                Email Address
              </label>

              <div className="nexbuy-register-input-wrapper" style={inputWrapperStyle}>
                <span className="nexbuy-register-input-icon" style={inputIconStyle}>
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
                  className="nexbuy-register-input"
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

            <div className="nexbuy-register-field" style={fieldGroupStyle}>
              <div
                className="nexbuy-register-password-row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <label style={labelStyle}>
                  Password
                </label>

                <span className="nexbuy-register-password-hint" style={passwordHintStyle}>
                  8+ characters recommended
                </span>
              </div>

              <div className="nexbuy-register-input-wrapper" style={inputWrapperStyle}>
                <span className="nexbuy-register-input-icon" style={inputIconStyle}>
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
                  className="nexbuy-register-password-input"
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
                  className="nexbuy-register-password-toggle"
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

            <div className="nexbuy-register-security" style={securityBoxStyle}>
              <div className="nexbuy-register-security-icon" style={securityIconStyle}>
                ✓
              </div>

              <div>
                <strong className="nexbuy-register-security-title" style={securityTitleStyle}>
                  Your account is protected
                </strong>

                <p className="nexbuy-register-security-text" style={securityTextStyle}>
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
              className="nexbuy-register-button"
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

          <div className="nexbuy-register-or" style={orContainerStyle}>
            <span style={lineStyle} />
            <span style={orTextStyle}>OR</span>
            <span style={lineStyle} />
          </div>

          <p className="nexbuy-register-login-text" style={loginTextStyle}>
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

          <div className="nexbuy-register-trust" style={trustFeaturesStyle}>
            <TrustFeature
              icon="✓"
              label="Secure"
            />

            <div className="nexbuy-register-trust-divider" style={trustDividerStyle} />

            <TrustFeature
              icon="ϟ"
              label="Fast"
            />

            <div className="nexbuy-register-trust-divider" style={trustDividerStyle} />

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
    <div className="nexbuy-register-benefit" style={benefitStyle}>
      <div className="nexbuy-register-benefit-icon" style={benefitIconStyle}>
        {icon}
      </div>

      <div>
        <strong className="nexbuy-register-benefit-title" style={benefitTitleStyle}>
          {title}
        </strong>

        <p className="nexbuy-register-benefit-description" style={benefitDescriptionStyle}>
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