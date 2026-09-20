import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Fetch Order
  // ==========================================
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/orders/${id}`
        );

        setOrder(response.data.order);
      } catch (error) {
        console.error(
          "Fetch Order Error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load order."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

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
        month: "long",
        year: "numeric",
      }
    );
  };

  const getOrderMessage = () => {
    switch (order?.orderStatus) {
      case "DELIVERED":
        return {
          title: "Order Delivered 🎉",
          subtitle:
            "Your order has been delivered successfully.",
        };

      case "SHIPPED":
        return {
          title: "Order Shipped 🚚",
          subtitle:
            "Your order is on the way.",
        };

      case "PROCESSING":
        return {
          title: "Order Confirmed ✓",
          subtitle:
            "Your order is being processed.",
        };

      case "CANCELLED":
        return {
          title: "Order Cancelled",
          subtitle:
            "This order has been cancelled.",
        };

      default:
        return {
          title: "Order Placed Successfully! 🎉",
          subtitle:
            "Thank you for your order.",
        };
    }
  };

  const getStatusClass = (status) => {
    if (status === "DELIVERED") {
      return deliveredBadgeStyle;
    }

    if (status === "SHIPPED") {
      return shippedBadgeStyle;
    }

    if (status === "PROCESSING") {
      return processingBadgeStyle;
    }

    if (status === "CANCELLED") {
      return cancelledBadgeStyle;
    }

    return placedBadgeStyle;
  };

  const getPaymentClass = (status) => {
    if (status === "PAID") {
      return paidBadgeStyle;
    }

    if (status === "FAILED") {
      return failedBadgeStyle;
    }

    return pendingBadgeStyle;
  };

  const isStatusCompleted = (status) => {
    const orderStatuses = [
      "PLACED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
    ];

    const currentIndex =
      orderStatuses.indexOf(
        order?.orderStatus
      );

    const statusIndex =
      orderStatuses.indexOf(status);

    return (
      currentIndex >= statusIndex &&
      order?.orderStatus !== "CANCELLED"
    );
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

          <h2>Loading your order...</h2>

          <p style={mutedTextStyle}>
            Please wait while we retrieve
            your order details.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================
  if (error) {
    return (
      <div style={centerStyle}>
        <div style={errorCardStyle}>
          <div style={errorIconStyle}>
            ⚠️
          </div>

          <h2>
            Unable to load order
          </h2>

          <p style={mutedTextStyle}>
            {error}
          </p>

          <div style={errorButtonRowStyle}>
            <button
              onClick={() =>
                navigate("/orders")
              }
              style={buttonStyle}
            >
              My Orders
            </button>

            <button
              onClick={() =>
                navigate("/products")
              }
              style={secondaryButtonStyle}
            >
              Continue Shopping
            </button>
          </div>
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

          <h2>Order not found</h2>

          <p style={mutedTextStyle}>
            We couldn't find this order.
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

  const message = getOrderMessage();

  const itemCount = order.items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  return (
    <div style={pageStyle}>
      {/* ==========================================
          Header
      ========================================== */}
      <header style={headerStyle}>
        <div
          style={headerInnerStyle}
        >
          <button
            onClick={() =>
              navigate("/products")
            }
            style={logoButtonStyle}
          >
            MERN E-Commerce
          </button>

          <div
            style={headerButtonsStyle}
          >
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

      <main style={mainStyle}>
        {/* ==========================================
            Success / Status Banner
        ========================================== */}
        <section
          style={
            order.orderStatus ===
            "CANCELLED"
              ? cancelledBannerStyle
              : successBoxStyle
          }
        >
          <div style={successIconStyle}>
            {order.orderStatus ===
            "CANCELLED"
              ? "✕"
              : order.orderStatus ===
                "DELIVERED"
              ? "✓"
              : "✓"}
          </div>

          <div>
            <h1 style={successTitleStyle}>
              {message.title}
            </h1>

            <p
              style={
                successSubtitleStyle
              }
            >
              {message.subtitle}
            </p>
          </div>
        </section>

        {/* ==========================================
            Order Meta
        ========================================== */}
        <section style={metaCardStyle}>
          <div style={metaItemStyle}>
            <span style={metaLabelStyle}>
              Order ID
            </span>

            <strong
              style={metaValueStyle}
            >
              {order._id}
            </strong>
          </div>

          <div style={metaItemStyle}>
            <span style={metaLabelStyle}>
              Order Date
            </span>

            <strong
              style={metaValueStyle}
            >
              {formatDate(
                order.createdAt
              )}
            </strong>
          </div>

          <div style={metaItemStyle}>
            <span style={metaLabelStyle}>
              Items
            </span>

            <strong
              style={metaValueStyle}
            >
              {itemCount}
            </strong>
          </div>
        </section>

        {/* ==========================================
            Order Status Timeline
        ========================================== */}
        <section style={sectionStyle}>
          <div
            style={sectionHeaderStyle}
          >
            <div>
              <h2 style={sectionTitleStyle}>
                Order Status
              </h2>

              <p
                style={
                  sectionSubtitleStyle
                }
              >
                Track the progress of your
                order
              </p>
            </div>

            <span
              style={getStatusClass(
                order.orderStatus
              )}
            >
              {order.orderStatus}
            </span>
          </div>

          {order.orderStatus ===
          "CANCELLED" ? (
            <div
              style={cancelledMessageStyle}
            >
              This order has been
              cancelled.
            </div>
          ) : (
            <div
              style={timelineStyle}
            >
              {[
                {
                  status: "PLACED",
                  label: "Order Placed",
                  icon: "✓",
                },
                {
                  status: "PROCESSING",
                  label: "Processing",
                  icon: "⚙",
                },
                {
                  status: "SHIPPED",
                  label: "Shipped",
                  icon: "🚚",
                },
                {
                  status: "DELIVERED",
                  label: "Delivered",
                  icon: "✓",
                },
              ].map(
                (step, index) => (
                  <div
                    key={step.status}
                    style={
                      timelineItemStyle
                    }
                  >
                    <div
                      style={{
                        ...timelineCircleStyle,
                        ...(isStatusCompleted(
                          step.status
                        )
                          ? timelineCompletedStyle
                          : {}),
                      }}
                    >
                      {step.icon}
                    </div>

                    <div
                      style={
                        timelineTextStyle
                      }
                    >
                      <strong>
                        {step.label}
                      </strong>

                      <span>
                        {isStatusCompleted(
                          step.status
                        )
                          ? "Completed"
                          : "Pending"}
                      </span>
                    </div>

                    {index <
                      3 && (
                      <div
                        style={{
                          ...timelineLineStyle,
                          ...(isStatusCompleted(
                            [
                              "PROCESSING",
                              "SHIPPED",
                              "DELIVERED",
                            ][index]
                          )
                            ? timelineLineCompletedStyle
                            : {}),
                        }}
                      />
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* ==========================================
            Payment Information
        ========================================== */}
        <section style={sectionStyle}>
          <div
            style={sectionHeaderStyle}
          >
            <div>
              <h2 style={sectionTitleStyle}>
                Payment Information
              </h2>

              <p
                style={
                  sectionSubtitleStyle
                }
              >
                Payment details for this
                order
              </p>
            </div>
          </div>

          <div style={paymentGridStyle}>
            <div style={infoBoxStyle}>
              <span
                style={infoLabelStyle}
              >
                Payment Method
              </span>

              <strong>
                {order.paymentMethod ===
                "RAZORPAY"
                  ? "Razorpay"
                  : "Cash on Delivery"}
              </strong>
            </div>

            <div style={infoBoxStyle}>
              <span
                style={infoLabelStyle}
              >
                Payment Status
              </span>

              <span
                style={getPaymentClass(
                  order.paymentStatus
                )}
              >
                {order.paymentStatus}
              </span>
            </div>

            <div style={infoBoxStyle}>
              <span
                style={infoLabelStyle}
              >
                Total Amount
              </span>

              <strong
                style={
                  paymentAmountStyle
                }
              >
                ₹
                {formatPrice(
                  order.totalAmount
                )}
              </strong>
            </div>
          </div>

          {order.paymentMethod ===
            "RAZORPAY" &&
            order.paymentStatus !==
              "PAID" &&
            order.orderStatus !==
              "CANCELLED" && (
              <div
                style={
                  paymentActionStyle
                }
              >
                <div>
                  <strong>
                    Payment is still pending
                  </strong>

                  <p
                    style={
                      paymentActionTextStyle
                    }
                  >
                    Complete your payment
                    to continue processing
                    your order.
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/orders/${id}/payment`
                    )
                  }
                  style={
                    paymentButtonStyle
                  }
                >
                  Pay Now
                </button>
              </div>
            )}
        </section>

        {/* ==========================================
            Shipping Address
        ========================================== */}
        <section style={sectionStyle}>
          <div
            style={sectionHeaderStyle}
          >
            <div>
              <h2 style={sectionTitleStyle}>
                Shipping Address
              </h2>

              <p
                style={
                  sectionSubtitleStyle
                }
              >
                Delivery information
              </p>
            </div>

            <span style={addressIconStyle}>
              📍
            </span>
          </div>

          <div
            style={addressCardStyle}
          >
            <strong
              style={addressNameStyle}
            >
              {
                order.shippingAddress
                  .fullName
              }
            </strong>

            <p>
              {
                order.shippingAddress
                  .address
              }
            </p>

            <p>
              {
                order.shippingAddress
                  .city
              }
              ,{" "}
              {
                order.shippingAddress
                  .state
              }
            </p>

            <p>
              {
                order.shippingAddress
                  .postalCode
              }
              ,{" "}
              {
                order.shippingAddress
                  .country
              }
            </p>

            <p
              style={
                addressPhoneStyle
              }
            >
              📞{" "}
              {
                order.shippingAddress
                  .phone
              }
            </p>
          </div>
        </section>

        {/* ==========================================
            Order Items
        ========================================== */}
        <section style={sectionStyle}>
          <div
            style={sectionHeaderStyle}
          >
            <div>
              <h2 style={sectionTitleStyle}>
                Order Items
              </h2>

              <p
                style={
                  sectionSubtitleStyle
                }
              >
                {itemCount} item
                {itemCount !== 1
                  ? "s"
                  : ""}{" "}
                in this order
              </p>
            </div>
          </div>

          <div>
            {order.items.map(
              (item, index) => (
                <div
                  key={`${item.product?._id || "item"}-${index}`}
                  style={{
                    ...itemStyle,
                    ...(index ===
                    order.items.length - 1
                      ? noBorderStyle
                      : {}),
                  }}
                >
                  {/* Image */}
                  <div
                    style={
                      imageContainerStyle
                    }
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={imageStyle}
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

                  {/* Details */}
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
                      × {item.quantity}
                    </p>

                    <span
                      style={
                        quantityBadgeStyle
                      }
                    >
                      Qty: {item.quantity}
                    </span>
                  </div>

                  {/* Total */}
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
        </section>

        {/* ==========================================
            Order Summary
        ========================================== */}
        <section
          style={
            orderSummaryStyle
          }
        >
          <h2
            style={
              orderSummaryTitleStyle
            }
          >
            Order Summary
          </h2>

          <div
            style={
              summaryRowStyle
            }
          >
            <span>
              Items ({itemCount})
            </span>

            <span>
              ₹
              {formatPrice(
                order.totalAmount
              )}
            </span>
          </div>

          <div
            style={
              summaryRowStyle
            }
          >
            <span>Shipping</span>

            <span
              style={
                freeShippingStyle
              }
            >
              FREE
            </span>
          </div>

          <div
            style={
              summaryDividerStyle
            }
          />

          <div
            style={
              summaryTotalStyle
            }
          >
            <span>Total</span>

            <strong>
              ₹
              {formatPrice(
                order.totalAmount
              )}
            </strong>
          </div>
        </section>

        {/* ==========================================
            Actions
        ========================================== */}
        <div style={actionButtonsStyle}>
          <button
            onClick={() =>
              navigate("/orders")
            }
            style={secondaryLargeButtonStyle}
          >
            ← My Orders
          </button>

          <button
            onClick={() =>
              navigate("/products")
            }
            style={buttonStyle}
          >
            Continue Shopping
          </button>
        </div>
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

const headerButtonsStyle = {
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
// Main
// ==========================================

const mainStyle = {
  maxWidth: "1000px",
  margin: "0 auto",
  padding: "35px 20px 60px",
};

// ==========================================
// Success Banner
// ==========================================

const successBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
  padding: "25px",
  marginBottom: "18px",
  backgroundColor: "white",
  borderRadius: "14px",
  boxShadow:
    "0 4px 18px rgba(0,0,0,0.06)",
};

const cancelledBannerStyle = {
  ...successBoxStyle,
  backgroundColor: "#fff8f8",
};

const successIconStyle = {
  width: "55px",
  height: "55px",
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  backgroundColor: "#e9f7ee",
  color: "#26733f",
  fontSize: "25px",
  fontWeight: "700",
};

const successTitleStyle = {
  margin: 0,
  fontSize: "25px",
};

const successSubtitleStyle = {
  margin: "6px 0 0",
  color: "#777",
  fontSize: "14px",
};

// ==========================================
// Meta
// ==========================================

const metaCardStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "1px",
  marginBottom: "18px",
  backgroundColor: "#e5e5e5",
  borderRadius: "12px",
  overflow: "hidden",
};

const metaItemStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  padding: "18px",
  backgroundColor: "white",
};

const metaLabelStyle = {
  color: "#888",
  fontSize: "12px",
};

const metaValueStyle = {
  fontSize: "13px",
  wordBreak: "break-all",
};

// ==========================================
// Sections
// ==========================================

const sectionStyle = {
  padding: "25px",
  marginBottom: "18px",
  backgroundColor: "white",
  borderRadius: "14px",
  boxShadow:
    "0 4px 18px rgba(0,0,0,0.06)",
};

const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "15px",
  marginBottom: "22px",
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "20px",
};

const sectionSubtitleStyle = {
  margin: "5px 0 0",
  color: "#888",
  fontSize: "13px",
};

// ==========================================
// Status Badges
// ==========================================

const baseBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 11px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: "700",
  whiteSpace: "nowrap",
};

const placedBadgeStyle = {
  ...baseBadgeStyle,
  backgroundColor: "#f1f1f1",
  color: "#555",
};

const processingBadgeStyle = {
  ...baseBadgeStyle,
  backgroundColor: "#eef4ff",
  color: "#315d9e",
};

const shippedBadgeStyle = {
  ...baseBadgeStyle,
  backgroundColor: "#f0efff",
  color: "#574a9b",
};

const deliveredBadgeStyle = {
  ...baseBadgeStyle,
  backgroundColor: "#eaf7ee",
  color: "#26733f",
};

const cancelledBadgeStyle = {
  ...baseBadgeStyle,
  backgroundColor: "#fff0f0",
  color: "#b33131",
};

const paidBadgeStyle = {
  ...baseBadgeStyle,
  backgroundColor: "#eaf7ee",
  color: "#26733f",
};

const pendingBadgeStyle = {
  ...baseBadgeStyle,
  backgroundColor: "#fff5df",
  color: "#9a6800",
};

const failedBadgeStyle = {
  ...baseBadgeStyle,
  backgroundColor: "#fff0f0",
  color: "#b33131",
};

// ==========================================
// Timeline
// ==========================================

const timelineStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "5px",
  overflowX: "auto",
  padding: "5px 0",
};

const timelineItemStyle = {
  position: "relative",
  flex: 1,
  minWidth: "120px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
};

const timelineCircleStyle = {
  width: "35px",
  height: "35px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  backgroundColor: "#eee",
  color: "#999",
  fontSize: "13px",
  fontWeight: "700",
  zIndex: 2,
};

const timelineCompletedStyle = {
  backgroundColor: "#222",
  color: "white",
};

const timelineTextStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  marginTop: "9px",
  fontSize: "12px",
};

const timelineLineStyle = {
  position: "absolute",
  top: "17px",
  left: "calc(50% + 17px)",
  width: "calc(100% - 34px)",
  height: "2px",
  backgroundColor: "#e5e5e5",
  zIndex: 1,
};

const timelineLineCompletedStyle = {
  backgroundColor: "#222",
};

const cancelledMessageStyle = {
  padding: "14px",
  backgroundColor: "#fff5f5",
  borderRadius: "8px",
  color: "#a52c2c",
  fontSize: "13px",
};

// ==========================================
// Payment
// ==========================================

const paymentGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
};

const infoBoxStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "16px",
  border: "1px solid #eee",
  borderRadius: "9px",
};

const infoLabelStyle = {
  color: "#888",
  fontSize: "12px",
};

const paymentAmountStyle = {
  fontSize: "18px",
};

const paymentActionStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  marginTop: "18px",
  padding: "16px",
  borderRadius: "9px",
  backgroundColor: "#f8f8f8",
};

const paymentActionTextStyle = {
  margin: "4px 0 0",
  color: "#777",
  fontSize: "12px",
};

const paymentButtonStyle = {
  padding: "11px 20px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#222",
  color: "white",
  fontSize: "13px",
  fontWeight: "700",
  cursor: "pointer",
};

// ==========================================
// Address
// ==========================================

const addressCardStyle = {
  padding: "18px",
  backgroundColor: "#f8f8f8",
  borderRadius: "9px",
  lineHeight: "1.5",
  fontSize: "13px",
};

const addressNameStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "15px",
};

const addressPhoneStyle = {
  marginTop: "10px",
  fontWeight: "600",
};

const addressIconStyle = {
  fontSize: "20px",
};

// ==========================================
// Items
// ==========================================

const itemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
  padding: "16px 0",
  borderBottom: "1px solid #eee",
};

const noBorderStyle = {
  borderBottom: "none",
};

const imageContainerStyle = {
  width: "85px",
  height: "85px",
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  borderRadius: "9px",
  backgroundColor: "#f2f2f2",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
};

const noImageStyle = {
  color: "#999",
  fontSize: "25px",
};

const itemDetailsStyle = {
  flex: 1,
  minWidth: 0,
};

const itemNameStyle = {
  margin: "0 0 7px",
  fontSize: "15px",
};

const itemMetaStyle = {
  margin: "0 0 8px",
  color: "#777",
  fontSize: "13px",
};

const quantityBadgeStyle = {
  display: "inline-block",
  padding: "4px 8px",
  borderRadius: "5px",
  backgroundColor: "#f2f2f2",
  color: "#666",
  fontSize: "10px",
};

const itemTotalStyle = {
  fontSize: "16px",
  whiteSpace: "nowrap",
};

// ==========================================
// Summary
// ==========================================

const orderSummaryStyle = {
  padding: "25px",
  marginBottom: "18px",
  backgroundColor: "white",
  borderRadius: "14px",
  boxShadow:
    "0 4px 18px rgba(0,0,0,0.06)",
};

const orderSummaryTitleStyle = {
  margin: "0 0 18px",
  fontSize: "19px",
};

const summaryRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "12px",
  color: "#666",
  fontSize: "14px",
};

const freeShippingStyle = {
  color: "#26733f",
  fontWeight: "700",
};

const summaryDividerStyle = {
  height: "1px",
  margin: "18px 0",
  backgroundColor: "#eee",
};

const summaryTotalStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "20px",
};

const actionButtonsStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const buttonStyle = {
  padding: "13px 24px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#222",
  color: "white",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
};

const secondaryLargeButtonStyle = {
  ...buttonStyle,
  backgroundColor: "white",
  color: "#222",
  border: "1px solid #ddd",
};

// ==========================================
// Error / Loading
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

const errorCardStyle = {
  width: "100%",
  maxWidth: "450px",
  padding: "40px",
  textAlign: "center",
  backgroundColor: "white",
  borderRadius: "14px",
  boxShadow:
    "0 4px 20px rgba(0,0,0,0.08)",
};

const errorIconStyle = {
  fontSize: "42px",
};

const errorButtonRowStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "20px",
};

const secondaryButtonStyle = {
  padding: "12px 20px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "white",
  color: "#222",
  cursor: "pointer",
  fontSize: "14px",
};

export default OrderDetails;