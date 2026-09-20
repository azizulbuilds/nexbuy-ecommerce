import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/orders");

        setOrders(response.data.orders || []);
      } catch (error) {
        console.error(
          "Fetch Orders Error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ==========================================
  // Helpers
  // ==========================================

  const formatPrice = (price) => {
    return Number(price).toLocaleString(
      "en-IN"
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getOrderStatusStyle = (status) => {
    switch (status) {
      case "DELIVERED":
        return deliveredStatusStyle;

      case "SHIPPED":
        return shippedStatusStyle;

      case "PROCESSING":
        return processingStatusStyle;

      case "CANCELLED":
        return cancelledStatusStyle;

      default:
        return placedStatusStyle;
    }
  };

  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case "PAID":
        return paidStatusStyle;

      case "FAILED":
        return failedStatusStyle;

      default:
        return pendingStatusStyle;
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case "DELIVERED":
        return "✓";

      case "SHIPPED":
        return "🚚";

      case "PROCESSING":
        return "⚙";

      case "CANCELLED":
        return "✕";

      default:
        return "📦";
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
            📦
          </div>

          <h2>
            Loading your orders...
          </h2>

          <p style={mutedTextStyle}>
            Please wait while we retrieve
            your order history.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Page
  // ==========================================

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
                navigate("/cart")
              }
              style={headerButtonStyle}
            >
              Cart
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
              My Orders
            </h1>

            <p style={pageSubtitleStyle}>
              View and track all your orders
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/products")
            }
            style={shopButtonStyle}
          >
            Continue Shopping
          </button>
        </div>

        {/* ==========================================
            Error
        ========================================== */}
        {error && (
          <div style={errorBoxStyle}>
            <span style={errorIconStyle}>
              ⚠️
            </span>

            <div>
              <strong>
                Unable to load orders
              </strong>

              <p>
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ==========================================
            Empty State
        ========================================== */}
        {!error &&
          orders.length === 0 && (
            <div style={emptyStyle}>
              <div style={emptyIconStyle}>
                🛍️
              </div>

              <h2>
                No orders yet
              </h2>

              <p style={mutedTextStyle}>
                You haven't placed any orders
                yet. Start shopping to see your
                orders here.
              </p>

              <button
                onClick={() =>
                  navigate("/products")
                }
                style={buttonStyle}
              >
                Start Shopping
              </button>
            </div>
          )}

        {/* ==========================================
            Orders
        ========================================== */}
        {!error &&
          orders.length > 0 && (
            <>
              <div style={orderCountStyle}>
                {orders.length} order
                {orders.length !== 1
                  ? "s"
                  : ""}
              </div>

              {orders.map((order) => {
                const itemCount =
                  order.items.reduce(
                    (total, item) =>
                      total +
                      item.quantity,
                    0
                  );

                return (
                  <div
                    key={order._id}
                    style={orderCardStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 20px 48px rgba(15,23,42,0.11)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 38px rgba(15,23,42,0.07)";
                    }}
                  >
                    {/* ==========================================
                        Order Header
                    ========================================== */}
                    <div
                      style={
                        orderHeaderStyle
                      }
                    >
                      <div
                        style={
                          orderHeaderLeftStyle
                        }
                      >
                        <div
                          style={
                            orderIconStyle
                          }
                        >
                          {getOrderStatusIcon(
                            order.orderStatus
                          )}
                        </div>

                        <div>
                          <h2
                            style={
                              orderTitleStyle
                            }
                          >
                            Order #
                            {order._id.slice(
                              -8
                            )}
                          </h2>

                          <p
                            style={
                              dateStyle
                            }
                          >
                            Placed on{" "}
                            {formatDate(
                              order.createdAt
                            )}
                          </p>
                        </div>
                      </div>

                      <span
                        style={
                          getOrderStatusStyle(
                            order.orderStatus
                          )
                        }
                      >
                        {
                          order.orderStatus
                        }
                      </span>
                    </div>

                    {/* ==========================================
                        Payment Summary
                    ========================================== */}
                    <div
                      style={
                        quickInfoStyle
                      }
                    >
                      <div
                        style={
                          quickInfoItemStyle
                        }
                      >
                        <span
                          style={
                            quickInfoLabelStyle
                          }
                        >
                          Payment
                        </span>

                        <strong>
                          {order.paymentMethod ===
                          "RAZORPAY"
                            ? "Razorpay"
                            : "Cash on Delivery"}
                        </strong>
                      </div>

                      <div
                        style={
                          quickInfoItemStyle
                        }
                      >
                        <span
                          style={
                            quickInfoLabelStyle
                          }
                        >
                          Payment Status
                        </span>

                        <span
                          style={
                            getPaymentStatusStyle(
                              order.paymentStatus
                            )
                          }
                        >
                          {
                            order.paymentStatus
                          }
                        </span>
                      </div>

                      <div
                        style={
                          quickInfoItemStyle
                        }
                      >
                        <span
                          style={
                            quickInfoLabelStyle
                          }
                        >
                          Items
                        </span>

                        <strong>
                          {itemCount}
                        </strong>
                      </div>
                    </div>

                    {/* ==========================================
                        Items
                    ========================================== */}
                    <div
                      style={
                        itemsContainerStyle
                      }
                    >
                      {order.items.map(
                        (item, index) => (
                          <div
                            key={`${order._id}-${index}`}
                            style={
                              itemStyle
                            }
                          >
                            <div
                              style={
                                imageContainerStyle
                              }
                            >
                              {item.image ? (
                                <img
                                  src={
                                    item.image
                                  }
                                  alt={
                                    item.name
                                  }
                                  style={
                                    imageStyle
                                  }
                                />
                              ) : (
                                <div
                                  style={
                                    noImageStyle
                                  }
                                >
                                  📦
                                </div>
                              )}
                            </div>

                            <div
                              style={
                                itemDetailsStyle
                              }
                            >
                              <h3
                                style={
                                  itemNameStyle
                                }
                              >
                                {item.name}
                              </h3>

                              <p
                                style={
                                  itemMetaStyle
                                }
                              >
                                ₹
                                {formatPrice(
                                  item.price
                                )}{" "}
                                ×{" "}
                                {
                                  item.quantity
                                }
                              </p>
                            </div>

                            <strong
                              style={
                                itemTotalStyle
                              }
                            >
                              ₹
                              {formatPrice(
                                item.price *
                                  item.quantity
                              )}
                            </strong>
                          </div>
                        )
                      )}
                    </div>

                    {/* ==========================================
                        Footer
                    ========================================== */}
                    <div
                      style={
                        orderFooterStyle
                      }
                    >
                      <div>
                        <span
                          style={
                            totalLabelStyle
                          }
                        >
                          Total Amount
                        </span>

                        <strong
                          style={
                            totalAmountStyle
                          }
                        >
                          ₹
                          {formatPrice(
                            order.totalAmount
                          )}
                        </strong>
                      </div>

                      <button
                        onClick={() =>
                          navigate(
                            `/orders/${order._id}`
                          )
                        }
                        style={
                          viewButtonStyle
                        }
                      >
                        View Order →
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
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
  maxWidth: "1120px",
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
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "20px",
  marginBottom: "28px",
  padding: "30px",
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

const shopButtonStyle = {
  padding: "12px 17px",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: "12px",
  backgroundColor: "rgba(255,255,255,0.10)",
  color: "white",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "750",
  backdropFilter: "blur(10px)",
};

const orderCountStyle = {
  display: "inline-flex",
  alignItems: "center",
  marginBottom: "14px",
  padding: "7px 11px",
  borderRadius: "999px",
  backgroundColor: "#eef2ff",
  border: "1px solid #e0e7ff",
  color: "#4f46e5",
  fontSize: "12px",
  fontWeight: "800",
};

// ==========================================
// Order Card
// ==========================================

const orderCardStyle = {
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,255,0.96))",
  border: "1px solid #e2e8f0",
  borderRadius: "22px",
  marginBottom: "20px",
  padding: "22px",
  boxShadow: "0 12px 38px rgba(15,23,42,0.07)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const orderHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  paddingBottom: "18px",
  borderBottom: "1px solid #e2e8f0",
};

const orderHeaderLeftStyle = {
  display: "flex",
  alignItems: "center",
  gap: "13px",
  minWidth: 0,
};

const orderIconStyle = {
  width: "48px",
  height: "48px",
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "15px",
  background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
  color: "#4f46e5",
  fontSize: "20px",
  boxShadow: "inset 0 0 0 1px rgba(99,102,241,0.08)",
};

const orderTitleStyle = {
  margin: 0,
  fontSize: "17px",
  fontWeight: "800",
  wordBreak: "break-all",
  letterSpacing: "-0.2px",
};

const dateStyle = {
  margin: "5px 0 0",
  color: "#64748b",
  fontSize: "12px",
};

const baseStatusStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "7px 11px",
  borderRadius: "999px",
  fontSize: "10px",
  fontWeight: "800",
  letterSpacing: "0.4px",
  whiteSpace: "nowrap",
  border: "1px solid transparent",
};

const placedStatusStyle = {
  ...baseStatusStyle,
  backgroundColor: "#f1f5f9",
  color: "#475569",
  borderColor: "#e2e8f0",
};

const processingStatusStyle = {
  ...baseStatusStyle,
  backgroundColor: "#eff6ff",
  color: "#2563eb",
  borderColor: "#dbeafe",
};

const shippedStatusStyle = {
  ...baseStatusStyle,
  backgroundColor: "#eef2ff",
  color: "#4f46e5",
  borderColor: "#e0e7ff",
};

const deliveredStatusStyle = {
  ...baseStatusStyle,
  backgroundColor: "#ecfdf5",
  color: "#15803d",
  borderColor: "#bbf7d0",
};

const cancelledStatusStyle = {
  ...baseStatusStyle,
  backgroundColor: "#fff1f2",
  color: "#be123c",
  borderColor: "#fecdd3",
};

const paidStatusStyle = {
  ...baseStatusStyle,
  backgroundColor: "#ecfdf5",
  color: "#15803d",
  borderColor: "#bbf7d0",
};

const pendingStatusStyle = {
  ...baseStatusStyle,
  backgroundColor: "#fffbeb",
  color: "#a16207",
  borderColor: "#fde68a",
};

const failedStatusStyle = {
  ...baseStatusStyle,
  backgroundColor: "#fff1f2",
  color: "#be123c",
  borderColor: "#fecdd3",
};

// ==========================================
// Quick Info
// ==========================================

const quickInfoStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "10px",
  margin: "18px 0",
};

const quickInfoItemStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "7px",
  padding: "13px 14px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "13px",
  fontSize: "12px",
};

const quickInfoLabelStyle = {
  color: "#94a3b8",
  fontSize: "10px",
  fontWeight: "800",
  textTransform: "uppercase",
  letterSpacing: "0.6px",
};

// ==========================================
// Items
// ==========================================

const itemsContainerStyle = {
  display: "flex",
  flexDirection: "column",
};

const itemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  padding: "14px 0",
  borderBottom: "1px solid #e2e8f0",
};

const imageContainerStyle = {
  width: "76px",
  height: "76px",
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  borderRadius: "14px",
  background: "linear-gradient(145deg, #f8fafc, #eef2ff)",
  border: "1px solid #e2e8f0",
  padding: "5px",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
  borderRadius: "10px",
};

const noImageStyle = {
  fontSize: "25px",
  color: "#94a3b8",
};

const itemDetailsStyle = {
  flex: 1,
  minWidth: 0,
};

const itemNameStyle = {
  margin: "0 0 6px",
  fontSize: "14px",
  fontWeight: "750",
  color: "#0f172a",
};

const itemMetaStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "12px",
};

const itemTotalStyle = {
  fontSize: "15px",
  fontWeight: "800",
  color: "#111827",
  whiteSpace: "nowrap",
};

// ==========================================
// Footer
// ==========================================

const orderFooterStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  marginTop: "18px",
  paddingTop: "18px",
  borderTop: "1px solid #e2e8f0",
};

const totalLabelStyle = {
  display: "block",
  marginBottom: "5px",
  color: "#94a3b8",
  fontSize: "10px",
  fontWeight: "800",
  textTransform: "uppercase",
  letterSpacing: "0.6px",
};

const totalAmountStyle = {
  fontSize: "23px",
  fontWeight: "850",
  color: "#4f46e5",
  letterSpacing: "-0.5px",
};

const viewButtonStyle = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
  color: "white",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "800",
  boxShadow: "0 9px 22px rgba(79,70,229,0.22)",
};

// ==========================================
// Empty / Error
// ==========================================

const emptyStyle = {
  padding: "80px 25px",
  textAlign: "center",
  background: "linear-gradient(145deg, #ffffff, #f8faff)",
  border: "1px solid #e0e7ff",
  borderRadius: "24px",
  boxShadow: "0 16px 45px rgba(15,23,42,0.07)",
};

const emptyIconStyle = {
  fontSize: "58px",
  marginBottom: "14px",
  filter: "drop-shadow(0 8px 14px rgba(79,70,229,0.14))",
};

const errorBoxStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  padding: "15px",
  marginBottom: "20px",
  backgroundColor: "#fff1f2",
  border: "1px solid #fecdd3",
  borderRadius: "13px",
  color: "#be123c",
  fontSize: "13px",
};

const errorIconStyle = {
  fontSize: "20px",
};

const errorBoxParagraphStyle = {
  margin: "5px 0 0",
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

// ==========================================
// Loading
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

const mutedTextStyle = {
  color: "#64748b",
  lineHeight: "1.6",
  fontSize: "14px",
};
export default MyOrders;
