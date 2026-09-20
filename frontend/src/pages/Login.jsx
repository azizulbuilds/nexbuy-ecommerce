import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await login(
        formData.email,
        formData.password
      );

      setMessage(response.message);

      console.log("Logged in user:", response.user);

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      console.error("Login Error:", error);

      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={backgroundGlowOne} />
      <div style={backgroundGlowTwo} />

      <main style={containerStyle}>
        {/* Brand / Welcome Panel */}
        <section style={welcomePanelStyle}>
          <div style={brandBadgeStyle}>
            <span style={brandIconStyle}>N</span>
            <span>Nexbuy</span>
          </div>

          <div style={welcomeContentStyle}>
            <div style={welcomePillStyle}>
              ✦ Welcome back
            </div>

            <h1 style={heroTitleStyle}>
              Your shopping journey
              <span style={gradientTextStyle}>
                {" "}starts here.
              </span>
            </h1>

            <p style={heroTextStyle}>
              Sign in to access your orders, wishlist,
              personalized shopping experience and more.
            </p>

            <div style={benefitsStyle}>
              <div style={benefitItemStyle}>
                <div style={benefitIconStyle}>✓</div>
                <div>
                  <strong style={benefitTitleStyle}>
                    Secure account
                  </strong>
                  <span style={benefitTextStyle}>
                    Your account stays protected
                  </span>
                </div>
              </div>

              <div style={benefitItemStyle}>
                <div style={benefitIconStyle}>⚡</div>
                <div>
                  <strong style={benefitTitleStyle}>
                    Fast checkout
                  </strong>
                  <span style={benefitTextStyle}>
                    Pick up right where you left off
                  </span>
                </div>
              </div>

              <div style={benefitItemStyle}>
                <div style={benefitIconStyle}>📦</div>
                <div>
                  <strong style={benefitTitleStyle}>
                    Track your orders
                  </strong>
                  <span style={benefitTextStyle}>
                    Stay updated from purchase to delivery
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={panelFooterStyle}>
            <span>Shop smarter.</span>
            <span>Shop Nexbuy.</span>
          </div>
        </section>

        {/* Login Card */}
        <section style={cardWrapperStyle}>
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={mobileBrandStyle}>
              <span style={brandIconStyle}>N</span>
              <span>Nexbuy</span>
            </div>

            <div style={formHeaderStyle}>
              <div style={formIconStyle}>👋</div>

              <div>
                <p style={eyebrowStyle}>ACCOUNT ACCESS</p>
                <h2 style={titleStyle}>Welcome back</h2>
                <p style={subtitleStyle}>
                  Enter your details to continue.
                </p>
              </div>
            </div>

            <div style={fieldGroupStyle}>
              <label htmlFor="email" style={labelStyle}>
                Email address
              </label>

              <div style={inputWrapperStyle}>
                <span style={inputIconStyle}>✉</span>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={fieldGroupStyle}>
              <div style={passwordLabelRowStyle}>
                <label
                  htmlFor="password"
                  style={labelStyle}
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={showPasswordButtonStyle}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div style={inputWrapperStyle}>
                <span style={inputIconStyle}>🔒</span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  style={inputStyle}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  style={eyeButtonStyle}
                >
                  {showPassword ? "◉" : "◌"}
                </button>
              </div>
            </div>

            {message && (
              <div style={successMessageStyle}>
                <span style={messageIconStyle}>✓</span>
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div style={errorMessageStyle}>
                <span style={messageIconStyle}>!</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...buttonStyle,
                ...(loading ? buttonDisabledStyle : {}),
              }}
            >
              <span>
                {loading ? "Signing you in..." : "Sign in to Nexbuy"}
              </span>
              {!loading && <span style={buttonArrowStyle}>→</span>}
            </button>

            <div style={dividerStyle}>
              <span style={dividerLineStyle} />
              <span style={dividerTextStyle}>OR</span>
              <span style={dividerLineStyle} />
            </div>

            <p style={registerTextStyle}>
              New to Nexbuy?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                style={registerButtonStyle}
              >
                Create an account
                <span style={registerArrowStyle}>↗</span>
              </button>
            </p>

            <div style={secureNoteStyle}>
              <span>🛡️</span>
              <span>
                Your login information is securely protected.
              </span>
            </div>
          </form>
        </section>
      </main>

      <style>{`
        @keyframes nexFadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes nexFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @media (max-width: 850px) {
          .nexbuy-login-container {
            grid-template-columns: 1fr !important;
            max-width: 520px !important;
          }

          .nexbuy-welcome-panel {
            display: none !important;
          }

          .nexbuy-card-wrapper {
            width: 100% !important;
          }

          .nexbuy-mobile-brand {
            display: flex !important;
          }
        }

        @media (max-width: 520px) {
          .nexbuy-login-page {
            padding: 20px 14px !important;
          }

          .nexbuy-login-form {
            padding: 28px 21px !important;
          }

          .nexbuy-login-title {
            font-size: 28px !important;
          }

          .nexbuy-login-container {
            border-radius: 22px !important;
          }
        }
      `}</style>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "35px 20px",
  boxSizing: "border-box",
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  background:
    "radial-gradient(circle at 10% 10%, rgba(99,102,241,0.14), transparent 28%), radial-gradient(circle at 90% 90%, rgba(139,92,246,0.13), transparent 30%), #f7f8fc",
};

const backgroundGlowOne = {
  position: "absolute",
  width: "280px",
  height: "280px",
  borderRadius: "50%",
  background:
    "radial-gradient(circle, rgba(99,102,241,0.14), transparent 70%)",
  top: "-100px",
  left: "-80px",
  pointerEvents: "none",
};

const backgroundGlowTwo = {
  position: "absolute",
  width: "330px",
  height: "330px",
  borderRadius: "50%",
  background:
    "radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)",
  bottom: "-130px",
  right: "-90px",
  pointerEvents: "none",
};

const containerStyle = {
  width: "100%",
  maxWidth: "1050px",
  minHeight: "650px",
  display: "grid",
  gridTemplateColumns: "0.95fr 1.05fr",
  position: "relative",
  zIndex: 1,
  borderRadius: "30px",
  overflow: "hidden",
  background: "rgba(255,255,255,0.84)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 30px 80px rgba(31,41,55,0.13)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  animation: "nexFadeUp .55s ease both",
};

const welcomePanelStyle = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "44px 42px",
  color: "white",
  overflow: "hidden",
  background:
    "linear-gradient(145deg, #11182f 0%, #25204d 52%, #4c1d95 100%)",
};

const brandBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  width: "fit-content",
  fontSize: "22px",
  fontWeight: "900",
  letterSpacing: "-0.6px",
};

const brandIconStyle = {
  width: "37px",
  height: "37px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "11px",
  background: "linear-gradient(135deg, #818cf8, #c084fc)",
  color: "white",
  fontSize: "18px",
  fontWeight: "900",
  boxShadow: "0 8px 20px rgba(129,140,248,0.28)",
};

const welcomeContentStyle = {
  position: "relative",
  zIndex: 2,
  marginTop: "45px",
};

const welcomePillStyle = {
  display: "inline-flex",
  padding: "7px 11px",
  marginBottom: "18px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.09)",
  border: "1px solid rgba(255,255,255,0.13)",
  color: "#ddd6fe",
  fontSize: "11px",
  fontWeight: "800",
  letterSpacing: ".07em",
  textTransform: "uppercase",
};

const heroTitleStyle = {
  maxWidth: "430px",
  margin: 0,
  fontSize: "clamp(34px, 4vw, 48px)",
  lineHeight: 1.05,
  letterSpacing: "-1.8px",
};

const gradientTextStyle = {
  color: "#c4b5fd",
};

const heroTextStyle = {
  maxWidth: "430px",
  margin: "20px 0 0",
  color: "rgba(255,255,255,0.68)",
  fontSize: "14px",
  lineHeight: 1.75,
};

const benefitsStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "17px",
  marginTop: "34px",
};

const benefitItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "13px",
};

const benefitIconStyle = {
  width: "35px",
  height: "35px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "11px",
  background: "rgba(255,255,255,0.09)",
  border: "1px solid rgba(255,255,255,0.11)",
  fontSize: "14px",
};

const benefitTitleStyle = {
  display: "block",
  marginBottom: "3px",
  fontSize: "12px",
};

const benefitTextStyle = {
  display: "block",
  color: "rgba(255,255,255,0.55)",
  fontSize: "11px",
};

const panelFooterStyle = {
  position: "relative",
  zIndex: 2,
  display: "flex",
  justifyContent: "space-between",
  gap: "15px",
  color: "rgba(255,255,255,0.42)",
  fontSize: "11px",
  fontWeight: "700",
};

const cardWrapperStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(248,249,253,0.92))",
};

const formStyle = {
  width: "100%",
  maxWidth: "420px",
  padding: "48px 46px",
  boxSizing: "border-box",
};

const mobileBrandStyle = {
  display: "none",
  alignItems: "center",
  gap: "9px",
  marginBottom: "28px",
  fontSize: "20px",
  fontWeight: "900",
  color: "#20283a",
};

const formHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  marginBottom: "30px",
};

const formIconStyle = {
  width: "52px",
  height: "52px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #eef2ff, #f3e8ff)",
  fontSize: "24px",
};

const eyebrowStyle = {
  margin: "0 0 4px",
  color: "#777f93",
  fontSize: "10px",
  fontWeight: "900",
  letterSpacing: ".11em",
};

const titleStyle = {
  margin: 0,
  color: "#182033",
  fontSize: "30px",
  lineHeight: 1.1,
  letterSpacing: "-1px",
};

const subtitleStyle = {
  margin: "6px 0 0",
  color: "#7a8294",
  fontSize: "12px",
};

const fieldGroupStyle = {
  marginBottom: "19px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#30384b",
  fontSize: "12px",
  fontWeight: "800",
};

const passwordLabelRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const showPasswordButtonStyle = {
  border: "none",
  padding: 0,
  background: "transparent",
  color: "#5b5bd6",
  cursor: "pointer",
  fontSize: "11px",
  fontWeight: "800",
};

const inputWrapperStyle = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  border: "1px solid #e1e4ec",
  borderRadius: "13px",
  background: "#fbfcfe",
  transition: "all .2s ease",
};

const inputIconStyle = {
  width: "42px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#8a91a3",
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  padding: "13px 13px 13px 0",
  border: "none",
  outline: "none",
  background: "transparent",
  color: "#20283a",
  fontSize: "13px",
};

const eyeButtonStyle = {
  border: "none",
  background: "transparent",
  color: "#8a91a3",
  cursor: "pointer",
  padding: "8px 12px 8px 5px",
  fontSize: "15px",
};

const successMessageStyle = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  padding: "11px 12px",
  marginBottom: "14px",
  borderRadius: "11px",
  background: "#ecfdf3",
  border: "1px solid #c8f0d8",
  color: "#21734a",
  fontSize: "12px",
  fontWeight: "700",
};

const errorMessageStyle = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  padding: "11px 12px",
  marginBottom: "14px",
  borderRadius: "11px",
  background: "#fff1f2",
  border: "1px solid #ffd4d9",
  color: "#b42335",
  fontSize: "12px",
  fontWeight: "700",
};

const messageIconStyle = {
  width: "21px",
  height: "21px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.75)",
  fontSize: "11px",
  fontWeight: "900",
};

const buttonStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  padding: "14px 18px",
  marginTop: "4px",
  border: "none",
  borderRadius: "13px",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  color: "white",
  fontSize: "13px",
  fontWeight: "900",
  letterSpacing: ".01em",
  cursor: "pointer",
  boxShadow: "0 12px 24px rgba(99,102,241,0.24)",
  transition: "all .2s ease",
};

const buttonDisabledStyle = {
  opacity: 0.68,
  cursor: "not-allowed",
  boxShadow: "none",
};

const buttonArrowStyle = {
  fontSize: "19px",
  lineHeight: 1,
};

const dividerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  margin: "24px 0 20px",
};

const dividerLineStyle = {
  flex: 1,
  height: "1px",
  background: "#e7e9ef",
};

const dividerTextStyle = {
  color: "#a0a6b4",
  fontSize: "9px",
  fontWeight: "900",
  letterSpacing: ".1em",
};

const registerTextStyle = {
  margin: 0,
  textAlign: "center",
  color: "#7c8496",
  fontSize: "12px",
};

const registerButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  padding: 0,
  border: "none",
  background: "transparent",
  color: "#5b5bd6",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "900",
};

const registerArrowStyle = {
  fontSize: "14px",
};

const secureNoteStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "7px",
  marginTop: "24px",
  color: "#9aa1b0",
  fontSize: "10px",
};

export default Login;
