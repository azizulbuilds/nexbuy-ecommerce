import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] =
    useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // Load Order + Initialize Razorpay
  // ==========================================
  useEffect(() => {
    const loadPayment = async () => {
      try {
        setLoading(true);
        setError("");

        // Get order details
        const orderResponse = await api.get(
          `/orders/${id}`
        );

        const currentOrder =
          orderResponse.data.order;

        setOrder(currentOrder);

        // Verify payment method
        if (
          currentOrder.paymentMethod !==
          "RAZORPAY"
        ) {
          setError(
            "This order is not configured for Razorpay payment."
          );
          return;
        }

        // Already paid
        if (
          currentOrder.paymentStatus ===
          "PAID"
        ) {
          navigate(`/orders/${id}`);
          return;
        }

        // Create Razorpay order
        const paymentResponse =
          await api.post(
            `/orders/${id}/payment`
          );

        setPaymentData(
          paymentResponse.data
        );
      } catch (error) {
        console.error(
          "Load Payment Error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to initialize payment."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [id, navigate]);

  // ==========================================
  // Load Razorpay Script
  // ==========================================
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script =
        document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  // ==========================================
  // Start Payment
  // ==========================================
  const handlePayment = async () => {
    try {
      setPaymentLoading(true);
      setError("");

      const scriptLoaded =
        await loadRazorpayScript();

      if (!scriptLoaded) {
        setError(
          "Unable to load Razorpay checkout. Please check your internet connection and try again."
        );
        setPaymentLoading(false);
        return;
      }

      if (!paymentData) {
        setError(
          "Payment information is not available."
        );
        setPaymentLoading(false);
        return;
      }

      if (!paymentData.keyId) {
        setError(
          "Razorpay configuration is missing."
        );
        setPaymentLoading(false);
        return;
      }

      const options = {
        key: paymentData.keyId,

        amount: paymentData.amount,

        currency: paymentData.currency,

        name: "Nexbuy",

        description:
          `Payment for Order #${id}`,

        order_id:
          paymentData.razorpayOrderId,

        prefill: {
          name:
            order?.shippingAddress
              ?.fullName || "",

          contact:
            order?.shippingAddress?.phone ||
            "",
        },

        notes: {
          orderId: id,
        },

        theme: {
          color: "#222222",
        },

        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          },
        },

        handler: async function (
          response
        ) {
          try {
            setPaymentLoading(true);
            setError("");

            const verifyResponse =
              await api.post(
                "/orders/payment/verify",
                {
                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_signature:
                    response.razorpay_signature,
                }
              );

            console.log(
              "Payment verification:",
              verifyResponse.data
            );

            navigate(`/orders/${id}`);
          } catch (error) {
            console.error(
              "Payment Verification Error:",
              error
            );

            setError(
              error.response?.data
                ?.message ||
                "Payment verification failed. Please contact support if money was deducted."
            );
          } finally {
            setPaymentLoading(false);
          }
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay Payment Failed:",
            response
          );

          setError(
            response.error?.description ||
              "Payment failed. Please try again."
          );

          setPaymentLoading(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Razorpay Payment Error:",
        error
      );

      setError(
        "Unable to start payment. Please try again."
      );

      setPaymentLoading(false);
    }
  };

  // ==========================================
  // Loading Screen
  // ==========================================
  if (loading) {
    return (
      <div style={centerStyle}>
        <div style={loadingCardStyle}>
          <div style={loadingIconStyle}>
            💳
          </div>

          <h2>
            Preparing secure payment...
          </h2>

          <p style={mutedTextStyle}>
            Please wait while we prepare
            your payment.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Error Without Order
  // ==========================================
  if (error && !order) {
    return (
      <div style={centerStyle}>
        <div style={errorCardStyle}>
          <div style={errorIconStyle}>
            ⚠️
          </div>

          <h2>
            Unable to process payment
          </h2>

          <p style={mutedTextStyle}>
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/orders")
            }
            style={buttonStyle}
          >
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // Order Not Found
  // ==========================================
  if (!order) {
    return (
      <div style={centerStyle}>
        <div style={errorCardStyle}>
          <div style={errorIconStyle}>
            📦
          </div>

          <h2>
            Order not found
          </h2>

          <button
            onClick={() =>
              navigate("/orders")
            }
            style={buttonStyle}
          >
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  const formattedAmount =
    Number(
      order.totalAmount
    ).toLocaleString("en-IN");

  return (
    <div style={pageStyle}>
      <main style={mainStyle}>
        {/* ==========================================
            Back
        ========================================== */}
        <button
          onClick={() =>
            navigate(`/orders/${id}`)
          }
          style={backButtonStyle}
        >
          ← Back to Order
        </button>

        {/* ==========================================
            Payment Card
        ========================================== */}
        <div style={paymentCardStyle}>
          <div style={paymentIconContainerStyle}>
            💳
          </div>

          <p style={secureTextStyle}>
            🔒 SECURE PAYMENT
          </p>

          <h1 style={titleStyle}>
            Complete Your Payment
          </h1>

          <p style={subtitleStyle}>
            Your payment will be securely
            processed by Razorpay.
          </p>

          {/* Amount */}
          <div style={amountBoxStyle}>
            <span
              style={amountLabelStyle}
            >
              Amount to Pay
            </span>

            <strong
              style={amountStyle}
            >
              ₹{formattedAmount}
            </strong>
          </div>

          {/* Order ID */}
          <div style={orderInfoStyle}>
            <span>
              Order ID
            </span>

            <strong
              style={orderIdStyle}
            >
              {order._id}
            </strong>
          </div>

          {/* Payment Status */}
          <div style={statusRowStyle}>
            <span>
              Payment Status
            </span>

            <span
              style={pendingBadgeStyle}
            >
              {order.paymentStatus}
            </span>
          </div>

          {/* Error */}
          {error && (
            <div style={errorBoxStyle}>
              <strong>
                Payment Error
              </strong>

              <span>
                {error}
              </span>
            </div>
          )}

          {/* Pay */}
          <button
            onClick={handlePayment}
            disabled={
              paymentLoading ||
              order.paymentStatus ===
                "PAID"
            }
            style={{
              ...payButtonStyle,
              ...(paymentLoading
                ? disabledPayButtonStyle
                : {}),
            }}
            onMouseEnter={(e) => {
              if (!paymentLoading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 16px 34px rgba(79,70,229,0.30)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 11px 28px rgba(79,70,229,0.24)";
            }}
          >
            {paymentLoading
              ? "Opening Secure Checkout..."
              : `Pay ₹${formattedAmount}`}
          </button>

          {/* Back */}
          <button
            onClick={() =>
              navigate(`/orders/${id}`)
            }
            style={
              secondaryButtonStyle
            }
          >
            Cancel / Back to Order
          </button>

          {/* Trust */}
          <div style={trustSectionStyle}>
            <div style={trustItemStyle}>
              🔐
              <span>
                Secure payment
              </span>
            </div>

            <div style={trustItemStyle}>
              🛡️
              <span>
                Payment verification
              </span>
            </div>

            <div style={trustItemStyle}>
              💳
              <span>
                Razorpay Checkout
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// Styles
// ==========================================

const pageStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 15% 0%, rgba(99,102,241,0.14), transparent 28%), radial-gradient(circle at 90% 100%, rgba(124,58,237,0.12), transparent 30%), linear-gradient(180deg, #f8faff 0%, #f6f7fb 100%)",
  fontFamily: "Inter, Arial, sans-serif",
  color: "#0f172a",
};

const mainStyle = {
  maxWidth: "700px",
  margin: "0 auto",
  padding: "34px 20px 65px",
};

const backButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  padding: "10px 15px",
  border: "1px solid #e2e8f0",
  borderRadius: "999px",
  backgroundColor: "rgba(255,255,255,0.9)",
  color: "#475569",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "750",
  marginBottom: "20px",
  boxShadow: "0 5px 18px rgba(15,23,42,0.05)",
};

const paymentCardStyle = {
  position: "relative",
  overflow: "hidden",
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.99), rgba(248,250,255,0.97))",
  padding: "42px 42px 34px",
  border: "1px solid #e2e8f0",
  borderRadius: "26px",
  boxShadow: "0 25px 70px rgba(15,23,42,0.10)",
  textAlign: "center",
};

const paymentIconContainerStyle = {
  position: "relative",
  width: "78px",
  height: "78px",
  margin: "0 auto 18px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  background:
    "linear-gradient(135deg, #2563eb, #4f46e5 50%, #7c3aed)",
  color: "white",
  fontSize: "34px",
  boxShadow: "0 16px 35px rgba(79,70,229,0.25)",
};

const secureTextStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  margin: "0 0 9px",
  padding: "6px 10px",
  borderRadius: "999px",
  backgroundColor: "#ecfdf5",
  border: "1px solid #bbf7d0",
  color: "#15803d",
  fontSize: "9px",
  fontWeight: "850",
  letterSpacing: "0.8px",
};

const titleStyle = {
  margin: 0,
  color: "#0f172a",
  fontSize: "clamp(30px, 5vw, 38px)",
  lineHeight: "1.1",
  fontWeight: "900",
  letterSpacing: "-1.4px",
};

const subtitleStyle = {
  margin: "11px auto 26px",
  maxWidth: "460px",
  color: "#64748b",
  fontSize: "13px",
  lineHeight: "1.65",
};

const amountBoxStyle = {
  position: "relative",
  overflow: "hidden",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  padding: "20px 21px",
  marginTop: "8px",
  borderRadius: "16px",
  background:
    "linear-gradient(135deg, #eef2ff, #f5f3ff)",
  border: "1px solid #e0e7ff",
  textAlign: "left",
};

const amountLabelStyle = {
  color: "#64748b",
  fontSize: "11px",
  fontWeight: "750",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const amountStyle = {
  fontSize: "30px",
  color: "#4f46e5",
  fontWeight: "900",
  letterSpacing: "-0.7px",
};

const orderInfoStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  padding: "15px 0",
  marginTop: "13px",
  borderBottom: "1px solid #e2e8f0",
  color: "#64748b",
  fontSize: "12px",
  textAlign: "left",
};

const orderIdStyle = {
  maxWidth: "310px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: "#334155",
  fontSize: "11px",
  fontWeight: "750",
};

const statusRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  padding: "15px 0",
  color: "#64748b",
  fontSize: "12px",
  textAlign: "left",
};

const pendingBadgeStyle = {
  padding: "6px 11px",
  borderRadius: "999px",
  backgroundColor: "#fff7ed",
  border: "1px solid #fed7aa",
  color: "#c2410c",
  fontSize: "10px",
  fontWeight: "850",
  letterSpacing: "0.3px",
};

const errorBoxStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  marginTop: "10px",
  padding: "13px 14px",
  textAlign: "left",
  backgroundColor: "#fff1f2",
  border: "1px solid #fecdd3",
  color: "#be123c",
  borderRadius: "12px",
  fontSize: "12px",
  lineHeight: "1.5",
};

const payButtonStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "9px",
  padding: "16px",
  marginTop: "20px",
  border: "none",
  borderRadius: "13px",
  background:
    "linear-gradient(135deg, #2563eb 0%, #4f46e5 48%, #7c3aed 100%)",
  color: "white",
  fontSize: "15px",
  fontWeight: "850",
  cursor: "pointer",
  boxShadow: "0 11px 28px rgba(79,70,229,0.24)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const disabledPayButtonStyle = {
  opacity: 0.65,
  cursor: "wait",
};

const secondaryButtonStyle = {
  width: "100%",
  padding: "13px",
  marginTop: "10px",
  border: "1px solid #dbe2ea",
  borderRadius: "12px",
  backgroundColor: "white",
  color: "#475569",
  fontSize: "13px",
  fontWeight: "700",
  cursor: "pointer",
};

const trustSectionStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "10px",
  marginTop: "27px",
  paddingTop: "22px",
  borderTop: "1px solid #e2e8f0",
};

const trustItemStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
  minHeight: "65px",
  padding: "8px",
  borderRadius: "12px",
  backgroundColor: "#f8fafc",
  color: "#64748b",
  fontSize: "10px",
  fontWeight: "700",
};

const buttonStyle = {
  padding: "12px 22px",
  marginTop: "15px",
  border: "none",
  borderRadius: "11px",
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "white",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "750",
  boxShadow: "0 8px 20px rgba(79,70,229,0.20)",
};

const centerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  fontFamily: "Inter, Arial, sans-serif",
  background:
    "radial-gradient(circle at top, rgba(99,102,241,0.12), transparent 35%), #f8fafc",
};

const loadingCardStyle = {
  textAlign: "center",
  padding: "45px",
  backgroundColor: "white",
  border: "1px solid #e0e7ff",
  borderRadius: "22px",
  boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
};

const loadingIconStyle = {
  fontSize: "48px",
};

const errorCardStyle = {
  maxWidth: "450px",
  padding: "45px",
  textAlign: "center",
  background:
    "linear-gradient(145deg, #ffffff, #f8faff)",
  border: "1px solid #e0e7ff",
  borderRadius: "22px",
  boxShadow: "0 18px 50px rgba(15,23,42,0.09)",
};

const errorIconStyle = {
  fontSize: "44px",
};

const mutedTextStyle = {
  color: "#64748b",
  lineHeight: "1.65",
  fontSize: "13px",
};
export default Payment;
