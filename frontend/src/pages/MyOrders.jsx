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
  backgroundColor: "#f7f7f7",
  fontFamily:
    "Inter, Arial, sans-serif",
};

const mainStyle = {
  maxWidth: "1000px",
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
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "25px",
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

const shopButtonStyle = {
  padding: "11px 17px",
  border: "1px solid #222",
  borderRadius: "8px",
  backgroundColor: "white",
  color: "#222",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600",
};

const orderCountStyle = {
  marginBottom: "12px",
  color: "#777",
  fontSize: "13px",
};

// ==========================================
// Order Card
// ==========================================

const orderCardStyle = {
  backgroundColor: "white",
  borderRadius: "14px",
  marginBottom: "18px",
  padding: "22px",
  boxShadow:
    "0 4px 18px rgba(0,0,0,0.06)",
};

const orderHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  paddingBottom: "17px",
  borderBottom: "1px solid #eee",
};

const orderHeaderLeftStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  minWidth: 0,
};

const orderIconStyle = {
  width: "42px",
  height: "42px",
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  backgroundColor: "#f3f3f3",
  fontSize: "18px",
};

const orderTitleStyle = {
  margin: 0,
  fontSize: "16px",
  wordBreak: "break-all",
};

const dateStyle = {
  margin: "5px 0 0",
  color: "#888",
  fontSize: "12px",
};

// ==========================================
// Status
// ==========================================

const baseStatusStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 10px",
  borderRadius: "20px",
  fontSize: "10px",
  fontWeight: "700",
  whiteSpace: "nowrap",
};

const placedStatusStyle = {
  ...baseStatusStyle,
  backgroundColor: "#f0f0f0",
  color: "#555",
};

const processingStatusStyle = {
  ...baseStatusStyle,
  backgroundColor: "#edf4ff",
  color: "#315d9e",
};

const shippedStatusStyle = {
  ...baseStatusStyle,
  backgroundColor: "#f0efff",
  color: "#574a9b",
};

const deliveredStatusStyle = {
  ...baseStatusStyle,
  backgroundColor: "#e9f7ee",
  color: "#26733f",
};

const cancelledStatusStyle = {
  ...baseStatusStyle,
  backgroundColor: "#fff0f0",
  color: "#ad3030",
};

const paidStatusStyle = {
  ...baseStatusStyle,
  backgroundColor: "#e9f7ee",
  color: "#26733f",
};

const pendingStatusStyle = {
  ...baseStatusStyle,
  backgroundColor: "#fff4dc",
  color: "#966300",
};

const failedStatusStyle = {
  ...baseStatusStyle,
  backgroundColor: "#fff0f0",
  color: "#ad3030",
};

// ==========================================
// Quick Info
// ==========================================

const quickInfoStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "1px",
  margin: "17px 0",
  backgroundColor: "#eee",
  borderRadius: "8px",
  overflow: "hidden",
};

const quickInfoItemStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "7px",
  padding: "13px",
  backgroundColor: "#fafafa",
  fontSize: "12px",
};

const quickInfoLabelStyle = {
  color: "#888",
  fontSize: "10px",
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
  gap: "14px",
  padding: "13px 0",
  borderBottom: "1px solid #eee",
};

const imageContainerStyle = {
  width: "68px",
  height: "68px",
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  borderRadius: "8px",
  backgroundColor: "#f5f5f5",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
};

const noImageStyle = {
  fontSize: "22px",
  color: "#999",
};

const itemDetailsStyle = {
  flex: 1,
  minWidth: 0,
};

const itemNameStyle = {
  margin: "0 0 5px",
  fontSize: "14px",
};

const itemMetaStyle = {
  margin: 0,
  color: "#777",
  fontSize: "12px",
};

const itemTotalStyle = {
  fontSize: "14px",
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
  marginTop: "17px",
  paddingTop: "17px",
  borderTop: "1px solid #eee",
};

const totalLabelStyle = {
  display: "block",
  marginBottom: "4px",
  color: "#888",
  fontSize: "11px",
};

const totalAmountStyle = {
  fontSize: "20px",
};

const viewButtonStyle = {
  padding: "11px 17px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#222",
  color: "white",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600",
};

// ==========================================
// Empty / Error
// ==========================================

const emptyStyle = {
  padding: "60px 25px",
  textAlign: "center",
  backgroundColor: "white",
  borderRadius: "14px",
  boxShadow:
    "0 4px 18px rgba(0,0,0,0.06)",
};

const emptyIconStyle = {
  fontSize: "45px",
  marginBottom: "10px",
};

const errorBoxStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  padding: "15px",
  marginBottom: "20px",
  backgroundColor: "#fff0f0",
  borderRadius: "9px",
  color: "#a52d2d",
  fontSize: "13px",
};

const errorIconStyle = {
  fontSize: "20px",
};

const errorBoxParagraphStyle = {
  margin: "5px 0 0",
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

// ==========================================
// Loading
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

const mutedTextStyle = {
  color: "#777",
  lineHeight: "1.6",
  fontSize: "14px",
};

export default MyOrders;