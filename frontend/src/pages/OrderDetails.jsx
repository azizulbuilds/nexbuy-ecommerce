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

      <style>{`
        @media (max-width: 680px) {
          .nexbuy-order-main { padding: 22px 14px 50px !important; }
          .nexbuy-order-header-inner { padding: 13px 14px !important; }
          .nexbuy-order-section { padding: 19px !important; border-radius: 18px !important; }
          .nexbuy-order-success { padding: 21px !important; border-radius: 20px !important; }
          .nexbuy-order-item { align-items: flex-start !important; }
          .nexbuy-order-image { width: 70px !important; height: 70px !important; }
          .nexbuy-order-item-total { font-size: 14px !important; }
          .nexbuy-order-payment-action { flex-direction: column !important; align-items: stretch !important; }
          .nexbuy-order-pay-button { width: 100% !important; }
          .nexbuy-order-summary { padding: 21px !important; }
        }
      `}</style>
      {/* ==========================================
          Header
      ========================================== */}
      <header style={headerStyle}>
        <div
          className="nexbuy-order-header-inner"
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

      <main className="nexbuy-order-main" style={mainStyle}>
        {/* ==========================================
            Success / Status Banner
        ========================================== */}
        <section
          className="nexbuy-order-success"
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
        <section className="nexbuy-order-section" style={sectionStyle}>
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
        <section className="nexbuy-order-section" style={sectionStyle}>
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
                className="nexbuy-order-payment-action"
                style={paymentActionStyle}
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
                  className="nexbuy-order-pay-button"
                  onClick={() =>
                    navigate(
                      `/orders/${id}/payment`
                    )
                  }
                  style={paymentButtonStyle}
                >
                  Pay Now
                </button>
              </div>
            )}
        </section>

        {/* ==========================================
            Shipping Address
        ========================================== */}
        <section className="nexbuy-order-section" style={sectionStyle}>
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
        <section className="nexbuy-order-section" style={sectionStyle}>
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
                  className="nexbuy-order-item"
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
                    className="nexbuy-order-image"
                    style={imageContainerStyle}
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
                    className="nexbuy-order-item-total"
                    style={itemTotalStyle}
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
          className="nexbuy-order-summary"
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
// Premium Nexbuy Design System
// ==========================================

const pageStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 0% 0%, rgba(99,102,241,0.10), transparent 30%), radial-gradient(circle at 100% 10%, rgba(168,85,247,0.09), transparent 28%), #f6f7fb",
  color: "#172033",
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const headerStyle = {
  position: "sticky",
  top: 0,
  zIndex: 20,
  background: "rgba(15, 23, 42, 0.92)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  color: "white",
  borderBottom: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 8px 30px rgba(15,23,42,0.16)",
};

const headerInnerStyle = {
  maxWidth: "1120px",
  margin: "0 auto",
  padding: "16px 22px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
};

const logoButtonStyle = {
  border: "none",
  background: "transparent",
  color: "white",
  fontSize: "21px",
  fontWeight: "900",
  letterSpacing: "-0.6px",
  cursor: "pointer",
  padding: 0,
};

const headerButtonsStyle = {
  display: "flex",
  gap: "9px",
  flexWrap: "wrap",
};

const headerButtonStyle = {
  padding: "9px 14px",
  border: "1px solid rgba(255,255,255,0.16)",
  borderRadius: "11px",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.92)",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "700",
  transition: "all .2s ease",
};

const mainStyle = {
  maxWidth: "1040px",
  margin: "0 auto",
  padding: "34px 20px 70px",
};

const successBoxStyle = {
  position: "relative",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  gap: "18px",
  padding: "28px",
  marginBottom: "18px",
  background: "linear-gradient(135deg, #ffffff 0%, #f8f7ff 100%)",
  border: "1px solid #e7e7f2",
  borderRadius: "24px",
  boxShadow: "0 18px 45px rgba(31,41,55,0.08)",
};

const cancelledBannerStyle = {
  ...successBoxStyle,
  background: "linear-gradient(135deg, #fff 0%, #fff5f5 100%)",
  borderColor: "#ffd9d9",
};

const successIconStyle = {
  width: "62px",
  height: "62px",
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  color: "white",
  fontSize: "27px",
  fontWeight: "900",
  boxShadow: "0 12px 25px rgba(99,102,241,0.25)",
};

const successTitleStyle = {
  margin: 0,
  fontSize: "clamp(22px, 4vw, 30px)",
  lineHeight: 1.15,
  letterSpacing: "-0.7px",
};

const successSubtitleStyle = {
  margin: "7px 0 0",
  color: "#687086",
  fontSize: "14px",
  lineHeight: 1.6,
};

const metaCardStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "12px",
  marginBottom: "18px",
};

const metaItemStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "7px",
  padding: "18px",
  background: "rgba(255,255,255,0.86)",
  border: "1px solid #e7e9f2",
  borderRadius: "18px",
  boxShadow: "0 10px 28px rgba(31,41,55,0.055)",
};

const metaLabelStyle = {
  color: "#8a92a6",
  fontSize: "11px",
  fontWeight: "800",
  textTransform: "uppercase",
  letterSpacing: ".08em",
};

const metaValueStyle = {
  fontSize: "13px",
  color: "#20283a",
  wordBreak: "break-all",
};

const sectionStyle = {
  padding: "25px",
  marginBottom: "18px",
  background: "rgba(255,255,255,0.94)",
  border: "1px solid #e7e9f2",
  borderRadius: "22px",
  boxShadow: "0 14px 38px rgba(31,41,55,0.065)",
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
  letterSpacing: "-0.35px",
};

const sectionSubtitleStyle = {
  margin: "6px 0 0",
  color: "#8a92a6",
  fontSize: "13px",
  lineHeight: 1.5,
};

const baseBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "7px 11px",
  borderRadius: "999px",
  fontSize: "10px",
  fontWeight: "900",
  letterSpacing: ".06em",
  whiteSpace: "nowrap",
};

const placedBadgeStyle = {
  ...baseBadgeStyle,
  background: "#eef0f4",
  color: "#5d6678",
};

const processingBadgeStyle = {
  ...baseBadgeStyle,
  background: "#eaf0ff",
  color: "#3f5eb7",
};

const shippedBadgeStyle = {
  ...baseBadgeStyle,
  background: "#eeeaff",
  color: "#6648b5",
};

const deliveredBadgeStyle = {
  ...baseBadgeStyle,
  background: "#e7f8ef",
  color: "#21734a",
};

const cancelledBadgeStyle = {
  ...baseBadgeStyle,
  background: "#ffebeb",
  color: "#b42323",
};

const paidBadgeStyle = {
  ...baseBadgeStyle,
  background: "#e7f8ef",
  color: "#21734a",
};

const pendingBadgeStyle = {
  ...baseBadgeStyle,
  background: "#fff4dc",
  color: "#956400",
};

const failedBadgeStyle = {
  ...baseBadgeStyle,
  background: "#ffebeb",
  color: "#b42323",
};

const timelineStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "6px",
  overflowX: "auto",
  padding: "8px 2px 4px",
};

const timelineItemStyle = {
  position: "relative",
  flex: 1,
  minWidth: "125px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
};

const timelineCircleStyle = {
  width: "42px",
  height: "42px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  background: "#f0f1f5",
  border: "4px solid white",
  color: "#a3a9b7",
  fontSize: "13px",
  fontWeight: "900",
  zIndex: 2,
  boxShadow: "0 0 0 1px #e3e5ec",
};

const timelineCompletedStyle = {
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  color: "white",
  boxShadow: "0 8px 18px rgba(99,102,241,0.22)",
};

const timelineTextStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  marginTop: "10px",
  fontSize: "12px",
};

const timelineLineStyle = {
  position: "absolute",
  top: "20px",
  left: "calc(50% + 21px)",
  width: "calc(100% - 42px)",
  height: "3px",
  background: "#e6e8ef",
  borderRadius: "999px",
  zIndex: 1,
};

const timelineLineCompletedStyle = {
  background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
};

const cancelledMessageStyle = {
  padding: "16px",
  background: "#fff4f4",
  border: "1px solid #ffdede",
  borderRadius: "14px",
  color: "#a52c2c",
  fontSize: "13px",
  fontWeight: "700",
};

const paymentGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
};

const infoBoxStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "9px",
  padding: "17px",
  background: "#fafbfe",
  border: "1px solid #e8eaf1",
  borderRadius: "15px",
};

const infoLabelStyle = {
  color: "#8a92a6",
  fontSize: "11px",
  fontWeight: "800",
  textTransform: "uppercase",
  letterSpacing: ".06em",
};

const paymentAmountStyle = {
  fontSize: "20px",
  color: "#4338ca",
  letterSpacing: "-.3px",
};

const paymentActionStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  marginTop: "18px",
  padding: "18px",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #f4f2ff, #faf8ff)",
  border: "1px solid #e6e0ff",
};

const paymentActionTextStyle = {
  margin: "5px 0 0",
  color: "#70788c",
  fontSize: "12px",
  lineHeight: 1.5,
};

const paymentButtonStyle = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  color: "white",
  fontSize: "13px",
  fontWeight: "800",
  cursor: "pointer",
  boxShadow: "0 10px 22px rgba(99,102,241,0.23)",
  whiteSpace: "nowrap",
};

const addressCardStyle = {
  padding: "19px",
  background: "linear-gradient(135deg, #f8f9fd, #f5f3ff)",
  border: "1px solid #e6e7f0",
  borderRadius: "16px",
  lineHeight: "1.65",
  fontSize: "13px",
  color: "#5d6678",
};

const addressNameStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "16px",
  color: "#20283a",
};

const addressPhoneStyle = {
  marginTop: "11px",
  fontWeight: "800",
  color: "#4338ca",
};

const addressIconStyle = {
  width: "38px",
  height: "38px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "12px",
  background: "#eeebff",
  fontSize: "18px",
};

const itemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
  padding: "17px 0",
  borderBottom: "1px solid #eceef3",
};

const noBorderStyle = {
  borderBottom: "none",
};

const imageContainerStyle = {
  width: "88px",
  height: "88px",
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  borderRadius: "16px",
  background: "linear-gradient(145deg, #f3f4f8, #eceef5)",
  border: "1px solid #e4e6ed",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
  transition: "transform .25s ease",
};

const noImageStyle = {
  color: "#9aa1b1",
  fontSize: "25px",
};

const itemDetailsStyle = {
  flex: 1,
  minWidth: 0,
};

const itemNameStyle = {
  margin: "0 0 7px",
  fontSize: "15px",
  color: "#20283a",
  lineHeight: 1.35,
};

const itemMetaStyle = {
  margin: "0 0 8px",
  color: "#727b8f",
  fontSize: "13px",
};

const quantityBadgeStyle = {
  display: "inline-block",
  padding: "5px 9px",
  borderRadius: "999px",
  background: "#f0efff",
  color: "#5a48a9",
  fontSize: "10px",
  fontWeight: "800",
};

const itemTotalStyle = {
  fontSize: "16px",
  color: "#20283a",
  whiteSpace: "nowrap",
};

const orderSummaryStyle = {
  padding: "26px",
  marginBottom: "18px",
  background: "linear-gradient(145deg, #151b31, #222a4b)",
  color: "white",
  borderRadius: "22px",
  boxShadow: "0 20px 42px rgba(15,23,42,0.18)",
};

const orderSummaryTitleStyle = {
  margin: "0 0 20px",
  fontSize: "19px",
};

const summaryRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "13px",
  color: "rgba(255,255,255,0.70)",
  fontSize: "14px",
};

const freeShippingStyle = {
  color: "#86efac",
  fontWeight: "900",
};

const summaryDividerStyle = {
  height: "1px",
  margin: "19px 0",
  background: "rgba(255,255,255,0.12)",
};

const summaryTotalStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "21px",
};

const actionButtonsStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  flexWrap: "wrap",
  paddingTop: "3px",
};

const buttonStyle = {
  padding: "13px 23px",
  border: "none",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  color: "white",
  fontSize: "14px",
  fontWeight: "800",
  cursor: "pointer",
  boxShadow: "0 10px 24px rgba(99,102,241,0.20)",
};

const secondaryLargeButtonStyle = {
  ...buttonStyle,
  background: "white",
  color: "#30384c",
  border: "1px solid #dfe2eb",
  boxShadow: "0 8px 18px rgba(31,41,55,0.05)",
};

const centerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  background:
    "radial-gradient(circle at 20% 10%, rgba(99,102,241,0.12), transparent 30%), #f6f7fb",
  fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
};

const loadingCardStyle = {
  width: "100%",
  maxWidth: "430px",
  padding: "42px 30px",
  textAlign: "center",
  background: "rgba(255,255,255,0.94)",
  border: "1px solid #e7e9f2",
  borderRadius: "24px",
  boxShadow: "0 20px 50px rgba(31,41,55,0.09)",
};

const loadingIconStyle = {
  width: "70px",
  height: "70px",
  margin: "0 auto 18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "22px",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  fontSize: "34px",
  boxShadow: "0 14px 28px rgba(99,102,241,0.22)",
};

const mutedTextStyle = {
  color: "#737c90",
  lineHeight: "1.65",
  fontSize: "14px",
};

const errorCardStyle = {
  width: "100%",
  maxWidth: "480px",
  padding: "42px 32px",
  textAlign: "center",
  background: "rgba(255,255,255,0.96)",
  border: "1px solid #e7e9f2",
  borderRadius: "24px",
  boxShadow: "0 20px 50px rgba(31,41,55,0.10)",
};

const errorIconStyle = {
  width: "68px",
  height: "68px",
  margin: "0 auto 18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "22px",
  background: "#fff0f0",
  fontSize: "31px",
};

const errorButtonRowStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "22px",
};

const secondaryButtonStyle = {
  padding: "12px 20px",
  border: "1px solid #dfe2eb",
  borderRadius: "12px",
  background: "white",
  color: "#30384c",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "700",
};

export default OrderDetails;
