import React, { useEffect, useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import api from "../api/axios";

function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    location.state?.email || ""
  );

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const otpRefs = useRef([]);

  // ==========================================
  // Countdown
  // ==========================================

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((previous) =>
        previous - 1
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // ==========================================
  // OTP Change
  // ==========================================

  const handleOtpChange = (index, value) => {
    const numericValue = value.replace(
      /[^0-9]/g,
      ""
    );

    if (!numericValue) {
      const newOtp = otp.split("");
      newOtp[index] = "";
      setOtp(newOtp.join(""));
      return;
    }

    const newOtp = otp.split("");

    newOtp[index] = numericValue
      .slice(-1);

    setOtp(newOtp.join(""));

    if (
      index < 5 &&
      numericValue &&
      otpRefs.current[index + 1]
    ) {
      otpRefs.current[index + 1].focus();
    }
  };

  // ==========================================
  // OTP Keyboard
  // ==========================================

  const handleOtpKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      otpRefs.current[index - 1]?.focus();
    }

    if (
      e.key === "ArrowLeft" &&
      index > 0
    ) {
      otpRefs.current[index - 1]?.focus();
    }

    if (
      e.key === "ArrowRight" &&
      index < 5
    ) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // ==========================================
  // Paste OTP
  // ==========================================

  const handleOtpPaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) {
      return;
    }

    setOtp(pasted);

    const focusIndex = Math.min(
      pasted.length,
      5
    );

    otpRefs.current[focusIndex]?.focus();
  };

  // ==========================================
  // Verify OTP
  // ==========================================

  const handleVerify = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (otp.length !== 6) {
      setError(
        "Please enter the complete 6-digit OTP."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Resend OTP
  // ==========================================

  const handleResend = async () => {
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (countdown > 0) {
      return;
    }

    setMessage("");
    setError("");
    setResending(true);

    try {
      const response = await api.post(
        "/auth/resend-otp",
        {
          email,
        }
      );

      setMessage(response.data.message);
      setOtp("");
      setCountdown(30);

      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to resend OTP."
      );
    } finally {
      setResending(false);
    }
  };

  // ==========================================
  // OTP Boxes
  // ==========================================

  const otpDigits = Array.from(
    { length: 6 },
    (_, index) => otp[index] || ""
  );

  return (
    <div style={pageStyle}>
      {/* ==========================================
          Decorative Background
      ========================================== */}

      <div style={glowTopStyle} />
      <div style={glowBottomStyle} />

      {/* ==========================================
          Main Card
      ========================================== */}

      <main style={mainStyle}>
        <div style={cardStyle}>
          {/* Brand */}

          <button
            onClick={() => navigate("/")}
            style={logoStyle}
          >
            Nex<span>buy</span>
          </button>

          <p style={taglineStyle}>
            Shop Smarter. Live Better.
          </p>

          {/* Verification Icon */}

          <div style={verificationIconWrapperStyle}>
            <div
              style={verificationIconStyle}
            >
              ✉
            </div>

            <div
              style={verificationPulseStyle}
            />
          </div>

          {/* Heading */}

          <h1 style={titleStyle}>
            Verify Your Email
          </h1>

          <p style={subtitleStyle}>
            We've sent a 6-digit verification
            code to your email address.
          </p>

          {/* Email */}

          <div style={emailBoxStyle}>
            <div style={emailIconStyle}>
              ✉
            </div>

            <div style={emailContentStyle}>
              <span style={emailLabelStyle}>
                Verification email
              </span>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                required
                style={emailInputStyle}
              />
            </div>

            <span style={emailCheckStyle}>
              ✓
            </span>
          </div>

          {/* OTP Form */}

          <form onSubmit={handleVerify}>
            <label style={otpLabelStyle}>
              Enter verification code
            </label>

            <div
              style={otpContainerStyle}
              onPaste={handleOtpPaste}
            >
              {otpDigits.map(
                (digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      otpRefs.current[index] =
                        element;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(
                        index,
                        e.target.value
                      )
                    }
                    onKeyDown={(e) =>
                      handleOtpKeyDown(
                        index,
                        e
                      )
                    }
                    style={{
                      ...otpInputStyle,
                      ...(digit
                        ? otpFilledStyle
                        : {}),
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "#6366f1";

                      e.currentTarget.style.boxShadow =
                        "0 0 0 4px rgba(99,102,241,0.10)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        digit
                          ? "#818cf8"
                          : "#dbe2ea";

                      e.currentTarget.style.boxShadow =
                        "none";
                    }}
                    aria-label={`OTP digit ${
                      index + 1
                    }`}
                  />
                )
              )}
            </div>

            {/* Security Notice */}

            <div style={securityBoxStyle}>
              <div style={securityIconStyle}>
                ✓
              </div>

              <div>
                <strong
                  style={securityTitleStyle}
                >
                  Your verification is secure
                </strong>

                <p style={securityTextStyle}>
                  Never share your verification
                  code with anyone.
                </p>
              </div>
            </div>

            {/* Messages */}

            {message && (
              <div
                style={successMessageStyle}
              >
                <span>✓</span>
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div
                style={errorMessageStyle}
              >
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Verify */}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...verifyButtonStyle,
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
                  Verifying...
                </>
              ) : (
                <>
                  Verify Email
                  <span style={arrowStyle}>
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Resend */}

          <div style={resendSectionStyle}>
            <span style={resendTextStyle}>
              Didn't receive the code?
            </span>

            <button
              type="button"
              onClick={handleResend}
              disabled={
                resending || countdown > 0
              }
              style={{
                ...resendButtonStyle,
                ...(resending ||
                countdown > 0
                  ? disabledResendStyle
                  : {}),
              }}
            >
              {resending
                ? "Sending..."
                : countdown > 0
                ? `Resend in ${countdown}s`
                : "Resend OTP"}
            </button>
          </div>

          {/* Back to Login */}

          <button
            type="button"
            onClick={() => navigate("/login")}
            style={backLoginButtonStyle}
          >
            ← Back to Login
          </button>

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

        {/* Footer */}

        <p style={footerTextStyle}>
          © {new Date().getFullYear()} Nexbuy
          {" • "}
          Your shopping journey starts here.
        </p>
      </main>
    </div>
  );
}

// ==========================================
// Trust Feature
// ==========================================

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
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "30px 20px",
  position: "relative",
  overflow: "hidden",
  background:
    "linear-gradient(135deg, #0f172a 0%, #172554 45%, #312e81 100%)",
  fontFamily:
    "Inter, Arial, sans-serif",
};

const glowTopStyle = {
  position: "absolute",
  width: "600px",
  height: "600px",
  top: "-350px",
  right: "-220px",
  borderRadius: "50%",
  background:
    "radial-gradient(circle, rgba(99,102,241,0.45), transparent 68%)",
  pointerEvents: "none",
};

const glowBottomStyle = {
  position: "absolute",
  width: "650px",
  height: "650px",
  bottom: "-430px",
  left: "-250px",
  borderRadius: "50%",
  background:
    "radial-gradient(circle, rgba(124,58,237,0.42), transparent 68%)",
  pointerEvents: "none",
};

// ==========================================
// Main
// ==========================================

const mainStyle = {
  width: "100%",
  maxWidth: "540px",
  position: "relative",
  zIndex: 2,
};

// ==========================================
// Card
// ==========================================

const cardStyle = {
  padding: "42px 42px 34px",
  borderRadius: "26px",
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,255,0.96))",
  border: "1px solid rgba(255,255,255,0.65)",
  boxShadow:
    "0 30px 80px rgba(0,0,0,0.28)",
  backdropFilter: "blur(20px)",
};

// ==========================================
// Brand
// ==========================================

const logoStyle = {
  display: "block",
  margin: "0 auto",
  padding: 0,
  border: "none",
  background: "transparent",
  color: "#172554",
  fontSize: "32px",
  fontWeight: "900",
  letterSpacing: "-1.5px",
  cursor: "pointer",
};

const taglineStyle = {
  margin: "3px 0 28px",
  textAlign: "center",
  color: "#6366f1",
  fontSize: "11px",
  fontWeight: "750",
  letterSpacing: "0.4px",
};

// ==========================================
// Verification Icon
// ==========================================

const verificationIconWrapperStyle = {
  position: "relative",
  width: "82px",
  height: "82px",
  margin: "0 auto 20px",
};

const verificationIconStyle = {
  position: "relative",
  zIndex: 2,
  width: "82px",
  height: "82px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  background:
    "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "white",
  fontSize: "31px",
  boxShadow:
    "0 15px 35px rgba(79,70,229,0.28)",
};

const verificationPulseStyle = {
  position: "absolute",
  inset: "-8px",
  borderRadius: "50%",
  border: "1px solid rgba(99,102,241,0.22)",
};

// ==========================================
// Heading
// ==========================================

const titleStyle = {
  margin: 0,
  textAlign: "center",
  color: "#0f172a",
  fontSize: "32px",
  fontWeight: "900",
  letterSpacing: "-1.2px",
};

const subtitleStyle = {
  maxWidth: "390px",
  margin: "10px auto 25px",
  textAlign: "center",
  color: "#64748b",
  fontSize: "13px",
  lineHeight: "1.65",
};

// ==========================================
// Email
// ==========================================

const emailBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "13px",
  marginBottom: "25px",
  borderRadius: "14px",
  background:
    "linear-gradient(135deg, #eef2ff, #f5f3ff)",
  border: "1px solid #e0e7ff",
};

const emailIconStyle = {
  width: "40px",
  height: "40px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "11px",
  backgroundColor: "white",
  color: "#4f46e5",
  fontSize: "17px",
};

const emailContentStyle = {
  flex: 1,
  minWidth: 0,
};

const emailLabelStyle = {
  display: "block",
  marginBottom: "3px",
  color: "#94a3b8",
  fontSize: "9px",
  fontWeight: "800",
  textTransform: "uppercase",
  letterSpacing: "0.6px",
};

const emailInputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "none",
  outline: "none",
  background: "transparent",
  color: "#334155",
  fontSize: "13px",
  fontWeight: "700",
};

// ==========================================
// OTP
// ==========================================

const otpLabelStyle = {
  display: "block",
  marginBottom: "12px",
  textAlign: "center",
  color: "#0f172a",
  fontSize: "13px",
  fontWeight: "800",
};

const otpContainerStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
};

const otpInputStyle = {
  width: "56px",
  height: "62px",
  boxSizing: "border-box",
  border: "1px solid #dbe2ea",
  borderRadius: "13px",
  outline: "none",
  backgroundColor: "white",
  color: "#0f172a",
  textAlign: "center",
  fontSize: "24px",
  fontWeight: "850",
  transition:
    "border-color 0.2s ease, box-shadow 0.2s ease",
};

const otpFilledStyle = {
  borderColor: "#818cf8",
  background:
    "linear-gradient(145deg, #eef2ff, #ffffff)",
};

// ==========================================
// Security
// ==========================================

const securityBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginTop: "22px",
  padding: "13px",
  borderRadius: "13px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const securityIconStyle = {
  width: "38px",
  height: "38px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  backgroundColor: "#dcfce7",
  color: "#16a34a",
  fontSize: "17px",
  fontWeight: "900",
};

const securityTitleStyle = {
  display: "block",
  color: "#1e293b",
  fontSize: "11px",
};

const securityTextStyle = {
  margin: "4px 0 0",
  color: "#64748b",
  fontSize: "10px",
  lineHeight: "1.45",
};

// ==========================================
// Messages
// ==========================================

const successMessageStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginTop: "15px",
  padding: "11px 13px",
  borderRadius: "10px",
  backgroundColor: "#ecfdf5",
  border: "1px solid #bbf7d0",
  color: "#15803d",
  fontSize: "12px",
  fontWeight: "650",
};

const errorMessageStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginTop: "15px",
  padding: "11px 13px",
  borderRadius: "10px",
  backgroundColor: "#fff1f2",
  border: "1px solid #fecdd3",
  color: "#be123c",
  fontSize: "12px",
  fontWeight: "650",
};

// ==========================================
// Buttons
// ==========================================

const verifyButtonStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  padding: "15px",
  marginTop: "18px",
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
  fontSize: "20px",
};

const spinnerStyle = {
  fontSize: "20px",
};

const disabledButtonStyle = {
  opacity: 0.65,
  cursor: "wait",
};

const resendSectionStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "6px",
  flexWrap: "wrap",
  marginTop: "21px",
};

const resendTextStyle = {
  color: "#64748b",
  fontSize: "12px",
};

const resendButtonStyle = {
  border: "none",
  background: "transparent",
  padding: 0,
  color: "#4f46e5",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "850",
};

const disabledResendStyle = {
  color: "#94a3b8",
  cursor: "not-allowed",
};

const backLoginButtonStyle = {
  display: "block",
  margin: "18px auto 0",
  border: "none",
  background: "transparent",
  color: "#64748b",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "700",
};

// ==========================================
// Trust
// ==========================================

const trustFeaturesStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "23px",
  marginTop: "28px",
  paddingTop: "22px",
  borderTop: "1px solid #e2e8f0",
};

const trustFeatureStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "6px",
  minWidth: "55px",
};

const trustIconStyle = {
  width: "34px",
  height: "34px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  backgroundColor: "#eef2ff",
  color: "#4f46e5",
  fontSize: "16px",
  fontWeight: "850",
};

const trustLabelStyle = {
  color: "#475569",
  fontSize: "10px",
  fontWeight: "700",
};

const trustDividerStyle = {
  width: "1px",
  height: "30px",
  backgroundColor: "#e2e8f0",
};

const emailCheckStyle = {
  width: "25px",
  height: "25px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  backgroundColor: "#dcfce7",
  color: "#16a34a",
  fontSize: "12px",
  fontWeight: "900",
};

const footerTextStyle = {
  margin: "18px 0 0",
  textAlign: "center",
  color: "rgba(255,255,255,0.58)",
  fontSize: "10px",
};

export default VerifyOTP;