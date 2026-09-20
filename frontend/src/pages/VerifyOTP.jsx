import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

  const handleVerify = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

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

  const handleResend = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setMessage("");
    setError("");
    setResending(true);

    try {
      const response = await api.post("/auth/resend-otp", {
        email,
      });

      setMessage(response.data.message);
      setOtp("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to resend OTP."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "30px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>
          Verify Email
        </h1>

        <p style={{ textAlign: "center" }}>
          Enter the 6-digit OTP sent to your email.
        </p>

        <form onSubmit={handleVerify}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={resending}
          style={secondaryButtonStyle}
        >
          {resending ? "Sending..." : "Resend OTP"}
        </button>

        {message && (
          <p style={{ color: "green", marginTop: "15px" }}>
            {message}
          </p>
        )}

        {error && (
          <p style={{ color: "red", marginTop: "15px" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  marginTop: "12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "15px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "20px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#222",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  border: "1px solid #222",
  borderRadius: "6px",
  backgroundColor: "white",
  color: "#222",
  fontSize: "16px",
  cursor: "pointer",
};

export default VerifyOTP;