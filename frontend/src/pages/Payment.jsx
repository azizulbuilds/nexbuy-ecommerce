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
  backgroundColor: "#f7f7f7",
  fontFamily:
    "Inter, Arial, sans-serif",
};

const mainStyle = {
  maxWidth: "650px",
  margin: "0 auto",
  padding: "45px 24px 60px",
};

const backButtonStyle = {
  border: "none",
  backgroundColor: "transparent",
  padding: 0,
  color: "#555",
  cursor: "pointer",
  fontSize: "14px",
  marginBottom: "20px",
};

const paymentCardStyle = {
  backgroundColor: "white",
  padding: "40px",
  borderRadius: "16px",
  boxShadow:
    "0 5px 25px rgba(0,0,0,0.07)",
  textAlign: "center",
};

const paymentIconContainerStyle = {
  width: "65px",
  height: "65px",
  margin: "0 auto 15px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  backgroundColor: "#f2f2f2",
  fontSize: "30px",
};

const secureTextStyle = {
  margin: "0 0 8px",
  color: "#287a43",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "1px",
};

const titleStyle = {
  margin: 0,
  fontSize: "30px",
  lineHeight: "1.2",
};

const subtitleStyle = {
  margin: "10px auto 25px",
  maxWidth: "430px",
  color: "#777",
  fontSize: "14px",
  lineHeight: "1.6",
};

const amountBoxStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px",
  marginTop: "10px",
  borderRadius: "10px",
  backgroundColor: "#f5f5f5",
};

const amountLabelStyle = {
  color: "#666",
  fontSize: "14px",
};

const amountStyle = {
  fontSize: "27px",
};

const orderInfoStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  padding: "15px 0",
  marginTop: "12px",
  borderBottom: "1px solid #eee",
  color: "#666",
  fontSize: "13px",
};

const orderIdStyle = {
  maxWidth: "280px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: "#333",
};

const statusRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 0",
  color: "#666",
  fontSize: "13px",
};

const pendingBadgeStyle = {
  padding: "5px 10px",
  borderRadius: "20px",
  backgroundColor: "#fff4dc",
  color: "#9a6500",
  fontSize: "11px",
  fontWeight: "700",
};

const errorBoxStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  marginTop: "10px",
  padding: "13px",
  textAlign: "left",
  backgroundColor: "#fff0f0",
  color: "#a52828",
  borderRadius: "8px",
  fontSize: "13px",
  lineHeight: "1.5",
};

const payButtonStyle = {
  width: "100%",
  padding: "15px",
  marginTop: "20px",
  border: "none",
  borderRadius: "9px",
  backgroundColor: "#222",
  color: "white",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
};

const disabledPayButtonStyle = {
  opacity: 0.65,
  cursor: "wait",
};

const secondaryButtonStyle = {
  width: "100%",
  padding: "13px",
  marginTop: "10px",
  border: "1px solid #ddd",
  borderRadius: "9px",
  backgroundColor: "white",
  color: "#333",
  fontSize: "14px",
  cursor: "pointer",
};

const trustSectionStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  flexWrap: "wrap",
  marginTop: "25px",
  paddingTop: "20px",
  borderTop: "1px solid #eee",
};

const trustItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  color: "#777",
  fontSize: "11px",
};

const buttonStyle = {
  padding: "12px 22px",
  marginTop: "15px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#222",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
};

const centerStyle = {
  minHeight: "80vh",
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
  maxWidth: "450px",
  padding: "45px",
  textAlign: "center",
  backgroundColor: "white",
  borderRadius: "14px",
  boxShadow:
    "0 4px 20px rgba(0,0,0,0.08)",
};

const errorIconStyle = {
  fontSize: "42px",
};

const mutedTextStyle = {
  color: "#777",
  lineHeight: "1.6",
};

export default Payment;