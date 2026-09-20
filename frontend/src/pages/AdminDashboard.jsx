import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/orders");

      setOrders(response.data.orders);
    } catch (error) {
      console.error("Fetch Admin Orders Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load admin orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.role === "admin") {
      fetchOrders();
    }
  }, [authLoading, user]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      setError("");

      const response = await api.put(
        `/admin/orders/${orderId}/status`,
        {
          orderStatus: newStatus,
        }
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? response.data.order
            : order
        )
      );
    } catch (error) {
      console.error(
        "Update Order Status Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  if (authLoading) {
    return (
      <div className="nexbuy-dashboard-page" style={pageStyle}>
        <div style={stateCardStyle}>
          <div style={spinnerStyle} />
          <span style={eyebrowStyle}>NEXBUY ADMIN</span>
          <h2 style={stateTitleStyle}>Loading dashboard</h2>
          <p style={stateTextStyle}>
            Preparing your admin workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="nexbuy-dashboard-page" style={pageStyle}>
        <div style={stateCardStyle}>
          <div style={stateIconStyle}>🔐</div>
          <span style={eyebrowStyle}>SECURE AREA</span>
          <h2 style={stateTitleStyle}>Login required</h2>
          <p style={stateTextStyle}>
            Sign in to access the Nexbuy administration panel.
          </p>

          <button
            onClick={() => navigate("/login")}
            style={primaryButtonStyle}
          >
            Go to Login →
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="nexbuy-dashboard-page" style={pageStyle}>
        <div style={stateCardStyle}>
          <div style={stateIconStyle}>⛔</div>
          <span style={eyebrowStyle}>RESTRICTED AREA</span>
          <h1 style={stateTitleStyle}>Access Denied</h1>
          <p style={stateTextStyle}>
            You do not have permission to access the Admin Dashboard.
          </p>

          <button
            onClick={() => navigate("/products")}
            style={primaryButtonStyle}
          >
            Back to Products →
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="nexbuy-dashboard-page" style={pageStyle}>
        <div style={containerStyle}>
          <div style={heroStyle}>
            <div style={heroContentStyle}>
              <div>
                <div style={eyebrowPillStyle}>
                  <span style={liveDotStyle} />
                  NEXBUY ADMIN
                </div>
                <h1 style={heroTitleStyle}>
                  Command
                  <span style={gradientTextStyle}> Center</span>
                </h1>
                <p style={heroSubtitleStyle}>
                  Loading your store operations and order activity...
                </p>
              </div>
            </div>
          </div>

          <div style={statsContainerStyle}>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} style={skeletonStatStyle}>
                <div style={skeletonCircleStyle} />
                <div style={skeletonLinesStyle}>
                  <div style={skeletonShortLineStyle} />
                  <div style={skeletonLongLineStyle} />
                </div>
              </div>
            ))}
          </div>

          <div style={skeletonOrdersCardStyle}>
            <div style={skeletonHeaderStyle} />
            {[1, 2, 3, 4].map((item) => (
              <div key={item} style={skeletonRowStyle}>
                <div style={skeletonRowCell} />
                <div style={skeletonRowCell} />
                <div style={skeletonRowCell} />
                <div style={skeletonRowCell} />
                <div style={skeletonRowCell} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalOrders = orders.length;
  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "PAID"
  ).length;
  const pendingOrders = orders.filter(
    (order) => order.paymentStatus === "PENDING"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "DELIVERED"
  ).length;

  const processingOrders = orders.filter(
    (order) =>
      order.orderStatus === "PROCESSING" ||
      order.orderStatus === "SHIPPED"
  ).length;

  const totalRevenue = orders
    .filter((order) => order.paymentStatus === "PAID")
    .reduce(
      (total, order) =>
        total + Number(order.totalAmount || 0),
      0
    );

  return (
    <div className="nexbuy-dashboard-page" style={pageStyle}>
      <div style={ambientOrbOneStyle} />
      <div style={ambientOrbTwoStyle} />

      <main style={containerStyle}>
        <section style={heroStyle}>
          <div style={heroGlowStyle} />

          <div style={heroContentStyle}>
            <div>
              <div style={eyebrowPillStyle}>
                <span style={liveDotStyle} />
                NEXBUY ADMIN
              </div>

              <h1 style={heroTitleStyle}>
                Command
                <span style={gradientTextStyle}> Center</span>
              </h1>

              <p style={heroSubtitleStyle}>
                Welcome back, {user.name || "Admin"}. Monitor orders,
                payments and fulfillment from one powerful workspace.
              </p>
            </div>

            <div style={heroActionsStyle}>
              <button
                onClick={() => navigate("/admin/products")}
                style={ghostButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.14)";
                  e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.18)";
                }}
              >
                📦 Products
              </button>

              <button
                onClick={fetchOrders}
                style={heroPrimaryButtonStyle}
                disabled={loading}
              >
                ↻ Refresh
              </button>
            </div>
          </div>
        </section>

        <section style={statsContainerStyle}>
          <div style={statCardStyle}>
            <div
              style={{
                ...statIconStyle,
                background: "#eef2ff",
                color: "#4f46e5",
              }}
            >
              ◈
            </div>
            <div style={statContentStyle}>
              <span style={statLabelStyle}>Total Orders</span>
              <strong style={statNumberStyle}>{totalOrders}</strong>
              <span style={statHintStyle}>
                All customer orders
              </span>
            </div>
          </div>

          <div style={statCardStyle}>
            <div
              style={{
                ...statIconStyle,
                background: "#ecfdf5",
                color: "#059669",
              }}
            >
              ✓
            </div>
            <div style={statContentStyle}>
              <span style={statLabelStyle}>Paid Orders</span>
              <strong style={statNumberStyle}>{paidOrders}</strong>
              <span style={statHintStyle}>
                Confirmed payments
              </span>
            </div>
          </div>

          <div style={statCardStyle}>
            <div
              style={{
                ...statIconStyle,
                background: "#fff7ed",
                color: "#ea580c",
              }}
            >
              ◷
            </div>
            <div style={statContentStyle}>
              <span style={statLabelStyle}>Pending</span>
              <strong style={statNumberStyle}>{pendingOrders}</strong>
              <span style={statHintStyle}>
                Awaiting payment
              </span>
            </div>
          </div>

          <div style={statCardStyle}>
            <div
              style={{
                ...statIconStyle,
                background: "#f5f3ff",
                color: "#7c3aed",
              }}
            >
              ★
            </div>
            <div style={statContentStyle}>
              <span style={statLabelStyle}>Delivered</span>
              <strong style={statNumberStyle}>{deliveredOrders}</strong>
              <span style={statHintStyle}>
                Successfully completed
              </span>
            </div>
          </div>
        </section>

        <section style={overviewStripStyle}>
          <div style={overviewItemStyle}>
            <span style={overviewIconStyle}>₹</span>
            <div>
              <span style={overviewLabelStyle}>
                Paid Revenue
              </span>
              <strong style={overviewValueStyle}>
                ₹{totalRevenue.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          <div className="nexbuy-dashboard-overview-divider" style={overviewDividerStyle} />

          <div style={overviewItemStyle}>
            <span
              style={{
                ...overviewIconStyle,
                background: "#fff7ed",
                color: "#ea580c",
              }}
            >
              →
            </span>
            <div>
              <span style={overviewLabelStyle}>
                In Fulfillment
              </span>
              <strong style={overviewValueStyle}>
                {processingOrders}
              </strong>
            </div>
          </div>

          <div className="nexbuy-dashboard-overview-divider" style={overviewDividerStyle} />

          <div style={overviewItemStyle}>
            <span
              style={{
                ...overviewIconStyle,
                background: "#ecfdf5",
                color: "#059669",
              }}
            >
              ●
            </span>
            <div>
              <span style={overviewLabelStyle}>
                Store Status
              </span>
              <strong style={storeStatusStyle}>
                <span style={storeStatusDotStyle} />
                Operational
              </strong>
            </div>
          </div>
        </section>

        {error && (
          <div style={errorStyle}>
            <span style={errorIconStyle}>!</span>
            <div>
              <strong style={{ display: "block", marginBottom: "2px" }}>
                Dashboard update failed
              </strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        <section style={ordersCardStyle}>
          <div style={ordersHeaderStyle}>
            <div>
              <span style={sectionEyebrowStyle}>ORDER OPERATIONS</span>
              <h2 style={ordersTitleStyle}>All Orders</h2>
              <p style={ordersSubtitleStyle}>
                Review customer orders and update fulfillment status.
              </p>
            </div>

            <div style={ordersHeaderActionsStyle}>
              <span style={orderCountBadgeStyle}>
                {orders.length} {orders.length === 1 ? "Order" : "Orders"}
              </span>

              <button
                onClick={fetchOrders}
                style={refreshButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#eef2ff";
                  e.currentTarget.style.color = "#4f46e5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.color = "#475569";
                }}
              >
                ↻ Refresh
              </button>
            </div>
          </div>

          {orders.length === 0 ? (
            <div style={emptyOrdersStyle}>
              <div style={emptyIconStyle}>🛍️</div>
              <span style={sectionEyebrowStyle}>NO ACTIVITY</span>
              <h3 style={emptyTitleStyle}>No orders found</h3>
              <p style={emptyTextStyle}>
                Customer orders will appear here as soon as they are placed.
              </p>
            </div>
          ) : (
            <div style={tableWrapperStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>ORDER</th>
                    <th style={thStyle}>CUSTOMER</th>
                    <th style={thStyle}>AMOUNT</th>
                    <th style={thStyle}>PAYMENT</th>
                    <th style={thStyle}>STATUS</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>
                      ACTION
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => {
                    const isPaid =
                      order.paymentStatus === "PAID";
                    const isPending =
                      order.paymentStatus === "PENDING";

                    return (
                      <tr
                        key={order._id}
                        style={tableRowStyle}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "#fafbff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "#ffffff";
                        }}
                      >
                        <td style={tdStyle}>
                          <div style={orderIdWrapStyle}>
                            <span style={orderIconStyle}>#</span>
                            <div>
                              <strong style={orderIdStyle}>
                                {order._id.slice(-8).toUpperCase()}
                              </strong>
                              <span style={orderMetaStyle}>
                                Order ID
                              </span>
                            </div>
                          </div>
                        </td>

                        <td style={tdStyle}>
                          <div style={customerWrapStyle}>
                            <div style={avatarStyle}>
                              {(order.user?.name || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div style={{ minWidth: 0 }}>
                              <strong style={customerNameStyle}>
                                {order.user?.name || "Unknown"}
                              </strong>
                              <span style={customerEmailStyle}>
                                {order.user?.email || ""}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td style={tdStyle}>
                          <strong style={amountStyle}>
                            ₹
                            {Number(
                              order.totalAmount || 0
                            ).toLocaleString("en-IN")}
                          </strong>
                        </td>

                        <td style={tdStyle}>
                          <div>
                            <span style={paymentMethodStyle}>
                              {order.paymentMethod}
                            </span>
                            <span
                              style={{
                                ...paymentBadgeStyle,
                                ...(isPaid
                                  ? paidBadgeStyle
                                  : isPending
                                  ? pendingBadgeStyle
                                  : otherPaymentBadgeStyle),
                              }}
                            >
                              <span style={statusDotStyle} />
                              {order.paymentStatus}
                            </span>
                          </div>
                        </td>

                        <td style={tdStyle}>
                          <div style={statusControlWrapStyle}>
                            <span
                              style={{
                                ...orderStatusPillStyle,
                                ...(getStatusStyle(
                                  order.orderStatus
                                )),
                              }}
                            >
                              {formatStatus(
                                order.orderStatus
                              )}
                            </span>

                            <select
                              value={order.orderStatus}
                              onChange={(e) =>
                                handleStatusChange(
                                  order._id,
                                  e.target.value
                                )
                              }
                              disabled={
                                updatingOrder ===
                                order._id
                              }
                              style={{
                                ...selectStyle,
                                opacity:
                                  updatingOrder ===
                                  order._id
                                    ? 0.6
                                    : 1,
                              }}
                            >
                              <option value="PLACED">
                                PLACED
                              </option>
                              <option value="PROCESSING">
                                PROCESSING
                              </option>
                              <option value="SHIPPED">
                                SHIPPED
                              </option>
                              <option value="DELIVERED">
                                DELIVERED
                              </option>
                              <option value="CANCELLED">
                                CANCELLED
                              </option>
                            </select>
                          </div>
                        </td>

                        <td
                          style={{
                            ...tdStyle,
                            textAlign: "right",
                          }}
                        >
                          <button
                            onClick={() =>
                              navigate(
                                `/orders/${order._id}`
                              )
                            }
                            style={viewButtonStyle}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "#4f46e5";
                              e.currentTarget.style.color =
                                "#ffffff";
                              e.currentTarget.style.borderColor =
                                "#4f46e5";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "#ffffff";
                              e.currentTarget.style.color =
                                "#4f46e5";
                              e.currentTarget.style.borderColor =
                                "#c7d2fe";
                            }}
                          >
                            View →
                          </button>

                          {updatingOrder ===
                            order._id && (
                            <div style={updatingStyle}>
                              <span style={miniSpinnerStyle} />
                              Updating
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const formatStatus = (status = "") =>
  status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getStatusStyle = (status) => {
  switch (status) {
    case "DELIVERED":
      return {
        color: "#047857",
        background: "#ecfdf5",
        borderColor: "#bbf7d0",
      };
    case "SHIPPED":
      return {
        color: "#1d4ed8",
        background: "#eff6ff",
        borderColor: "#bfdbfe",
      };
    case "PROCESSING":
      return {
        color: "#7c3aed",
        background: "#f5f3ff",
        borderColor: "#ddd6fe",
      };
    case "CANCELLED":
      return {
        color: "#b91c1c",
        background: "#fef2f2",
        borderColor: "#fecaca",
      };
    default:
      return {
        color: "#c2410c",
        background: "#fff7ed",
        borderColor: "#fed7aa",
      };
  }
};

const pageStyle = {
  minHeight: "100vh",
  padding: "32px 20px 70px",
  boxSizing: "border-box",
  background:
    "radial-gradient(circle at 12% 0%, rgba(99,102,241,0.09), transparent 28%), radial-gradient(circle at 95% 25%, rgba(168,85,247,0.07), transparent 28%), #f7f8fc",
  color: "#0f172a",
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  position: "relative",
  overflow: "hidden",
};

const ambientOrbOneStyle = {
  position: "fixed",
  width: "280px",
  height: "280px",
  borderRadius: "50%",
  background: "rgba(99,102,241,0.07)",
  filter: "blur(75px)",
  top: "10%",
  left: "-160px",
  pointerEvents: "none",
};

const ambientOrbTwoStyle = {
  position: "fixed",
  width: "330px",
  height: "330px",
  borderRadius: "50%",
  background: "rgba(168,85,247,0.06)",
  filter: "blur(85px)",
  right: "-150px",
  bottom: "-130px",
  pointerEvents: "none",
};

const containerStyle = {
  maxWidth: "1250px",
  margin: "0 auto",
  position: "relative",
  zIndex: 1,
};

const heroStyle = {
  position: "relative",
  overflow: "hidden",
  borderRadius: "28px",
  marginBottom: "20px",
  background:
    "linear-gradient(135deg, #111827 0%, #1e1b4b 48%, #312e81 100%)",
  boxShadow: "0 22px 55px rgba(30,27,75,0.20)",
};

const heroGlowStyle = {
  position: "absolute",
  width: "380px",
  height: "380px",
  borderRadius: "50%",
  background: "rgba(129,140,248,0.18)",
  filter: "blur(10px)",
  top: "-255px",
  right: "7%",
};

const heroContentStyle = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "25px",
  flexWrap: "wrap",
  padding: "38px 40px",
};

const eyebrowPillStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "7px 12px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.09)",
  border: "1px solid rgba(255,255,255,0.13)",
  color: "#c7d2fe",
  fontSize: "10px",
  fontWeight: 850,
  letterSpacing: "1.6px",
};

const liveDotStyle = {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  background: "#a5b4fc",
  boxShadow: "0 0 0 5px rgba(165,180,252,0.10)",
};

const heroTitleStyle = {
  margin: "15px 0 8px",
  color: "#ffffff",
  fontSize: "clamp(32px, 5vw, 47px)",
  lineHeight: 1.05,
  letterSpacing: "-1.8px",
  fontWeight: 850,
};

const gradientTextStyle = {
  background:
    "linear-gradient(90deg, #c7d2fe, #ddd6fe, #e9d5ff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const heroSubtitleStyle = {
  maxWidth: "700px",
  margin: 0,
  color: "#cbd5e1",
  fontSize: "14px",
  lineHeight: 1.7,
};

const heroActionsStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const ghostButtonStyle = {
  padding: "12px 17px",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.08)",
  color: "#f8fafc",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 800,
  transition: "all 0.2s ease",
};

const heroPrimaryButtonStyle = {
  padding: "12px 17px",
  border: "1px solid rgba(199,210,254,0.35)",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #6366f1, #7c3aed)",
  color: "#ffffff",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 850,
  boxShadow: "0 8px 24px rgba(129,140,248,0.22)",
};

const statsContainerStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
  marginBottom: "16px",
};

const statCardStyle = {
  display: "flex",
  alignItems: "center",
  gap: "13px",
  minWidth: 0,
  padding: "17px",
  border: "1px solid #e7eaf1",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.92)",
  boxShadow: "0 8px 28px rgba(15,23,42,0.045)",
};

const statIconStyle = {
  width: "45px",
  height: "45px",
  flex: "0 0 45px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "14px",
  fontSize: "19px",
  fontWeight: 900,
};

const statContentStyle = {
  minWidth: 0,
};

const statLabelStyle = {
  display: "block",
  color: "#64748b",
  fontSize: "9px",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: "4px",
};

const statNumberStyle = {
  display: "block",
  fontSize: "26px",
  lineHeight: 1,
  letterSpacing: "-0.7px",
  color: "#0f172a",
};

const statHintStyle = {
  display: "block",
  marginTop: "5px",
  color: "#94a3b8",
  fontSize: "9px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const overviewStripStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  gap: "20px",
  flexWrap: "wrap",
  marginBottom: "25px",
  padding: "15px 18px",
  border: "1px solid #e7eaf1",
  borderRadius: "17px",
  background: "#ffffff",
  boxShadow: "0 7px 24px rgba(15,23,42,0.04)",
};

const overviewItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const overviewIconStyle = {
  width: "35px",
  height: "35px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  background: "#eef2ff",
  color: "#4f46e5",
  fontSize: "13px",
  fontWeight: 900,
};

const overviewLabelStyle = {
  display: "block",
  color: "#94a3b8",
  fontSize: "8px",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const overviewValueStyle = {
  display: "block",
  marginTop: "2px",
  color: "#0f172a",
  fontSize: "15px",
};

const storeStatusStyle = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  marginTop: "2px",
  color: "#047857",
  fontSize: "13px",
};

const storeStatusDotStyle = {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  background: "#10b981",
};

const overviewDividerStyle = {
  width: "1px",
  height: "31px",
  background: "#e2e8f0",
};

const errorStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  marginBottom: "18px",
  padding: "13px 15px",
  border: "1px solid #fecaca",
  borderRadius: "13px",
  background: "#fff7f7",
  color: "#991b1b",
  fontSize: "11px",
  lineHeight: 1.5,
};

const errorIconStyle = {
  width: "23px",
  height: "23px",
  flex: "0 0 23px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  background: "#fee2e2",
  color: "#dc2626",
  fontWeight: 900,
};

const ordersCardStyle = {
  overflow: "hidden",
  border: "1px solid #e7eaf1",
  borderRadius: "23px",
  background: "#ffffff",
  boxShadow: "0 12px 38px rgba(15,23,42,0.055)",
};

const ordersHeaderStyle = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  gap: "20px",
  flexWrap: "wrap",
  padding: "23px 23px 18px",
  borderBottom: "1px solid #eef2f7",
};

const sectionEyebrowStyle = {
  color: "#6366f1",
  fontSize: "9px",
  fontWeight: 850,
  letterSpacing: "1.7px",
};

const ordersTitleStyle = {
  margin: "4px 0 3px",
  fontSize: "24px",
  letterSpacing: "-0.7px",
};

const ordersSubtitleStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "11px",
};

const ordersHeaderActionsStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const orderCountBadgeStyle = {
  padding: "7px 9px",
  borderRadius: "8px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#475569",
  fontSize: "9px",
  fontWeight: 800,
};

const refreshButtonStyle = {
  padding: "8px 11px",
  border: "1px solid #e2e8f0",
  borderRadius: "9px",
  background: "#ffffff",
  color: "#475569",
  cursor: "pointer",
  fontSize: "10px",
  fontWeight: 800,
  transition: "all 0.2s ease",
};

const tableWrapperStyle = {
  width: "100%",
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "980px",
};

const thStyle = {
  textAlign: "left",
  padding: "12px 15px",
  borderBottom: "1px solid #e8edf3",
  background: "#f8fafc",
  color: "#94a3b8",
  fontSize: "8px",
  fontWeight: 850,
  letterSpacing: "1.2px",
};

const tableRowStyle = {
  background: "#ffffff",
  transition: "background 0.18s ease",
};

const tdStyle = {
  padding: "14px 15px",
  borderBottom: "1px solid #f1f5f9",
  verticalAlign: "middle",
};

const orderIdWrapStyle = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
};

const orderIconStyle = {
  width: "31px",
  height: "31px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "9px",
  background: "#eef2ff",
  color: "#4f46e5",
  fontSize: "11px",
  fontWeight: 900,
};

const orderIdStyle = {
  display: "block",
  color: "#1e293b",
  fontSize: "11px",
  letterSpacing: "0.3px",
};

const orderMetaStyle = {
  display: "block",
  marginTop: "2px",
  color: "#94a3b8",
  fontSize: "8px",
};

const customerWrapStyle = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  minWidth: "180px",
};

const avatarStyle = {
  width: "32px",
  height: "32px",
  flex: "0 0 32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #e0e7ff, #ede9fe)",
  color: "#4f46e5",
  fontSize: "11px",
  fontWeight: 900,
};

const customerNameStyle = {
  display: "block",
  maxWidth: "170px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: "#1e293b",
  fontSize: "11px",
};

const customerEmailStyle = {
  display: "block",
  maxWidth: "170px",
  marginTop: "2px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: "#94a3b8",
  fontSize: "8px",
};

const amountStyle = {
  color: "#0f172a",
  fontSize: "13px",
  whiteSpace: "nowrap",
};

const paymentMethodStyle = {
  display: "block",
  marginBottom: "5px",
  color: "#475569",
  fontSize: "10px",
  fontWeight: 750,
};

const paymentBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  padding: "4px 7px",
  borderRadius: "999px",
  fontSize: "8px",
  fontWeight: 850,
  border: "1px solid transparent",
};

const paidBadgeStyle = {
  color: "#047857",
  background: "#ecfdf5",
  borderColor: "#bbf7d0",
};

const pendingBadgeStyle = {
  color: "#c2410c",
  background: "#fff7ed",
  borderColor: "#fed7aa",
};

const otherPaymentBadgeStyle = {
  color: "#64748b",
  background: "#f8fafc",
  borderColor: "#e2e8f0",
};

const statusDotStyle = {
  width: "5px",
  height: "5px",
  borderRadius: "50%",
  background: "currentColor",
};

const statusControlWrapStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "6px",
};

const orderStatusPillStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "5px 8px",
  border: "1px solid transparent",
  borderRadius: "999px",
  fontSize: "8px",
  fontWeight: 850,
};

const selectStyle = {
  padding: "7px 28px 7px 8px",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  background: "#ffffff",
  color: "#475569",
  outline: "none",
  cursor: "pointer",
  fontSize: "9px",
  fontWeight: 700,
};

const viewButtonStyle = {
  padding: "8px 11px",
  border: "1px solid #c7d2fe",
  borderRadius: "9px",
  background: "#ffffff",
  color: "#4f46e5",
  cursor: "pointer",
  fontSize: "10px",
  fontWeight: 850,
  transition: "all 0.2s ease",
};

const updatingStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "5px",
  marginTop: "6px",
  color: "#64748b",
  fontSize: "8px",
};

const miniSpinnerStyle = {
  width: "9px",
  height: "9px",
  borderRadius: "50%",
  border: "1.5px solid #cbd5e1",
  borderTopColor: "#6366f1",
  animation: "nexbuyDashboardSpin 0.7s linear infinite",
};

const emptyOrdersStyle = {
  padding: "55px 25px",
  textAlign: "center",
};

const emptyIconStyle = {
  width: "70px",
  height: "70px",
  margin: "0 auto 15px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "22px",
  background: "linear-gradient(135deg, #eef2ff, #f5f3ff)",
  fontSize: "30px",
};

const emptyTitleStyle = {
  margin: "7px 0",
  fontSize: "20px",
  letterSpacing: "-0.4px",
};

const emptyTextStyle = {
  maxWidth: "390px",
  margin: "0 auto",
  color: "#64748b",
  fontSize: "11px",
  lineHeight: 1.6,
};

const primaryButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
  padding: "12px 18px",
  border: "none",
  borderRadius: "11px",
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "#ffffff",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 850,
  boxShadow: "0 9px 22px rgba(99,102,241,0.20)",
};

const stateCardStyle = {
  width: "min(100%, 520px)",
  margin: "10vh auto 0",
  padding: "44px 30px",
  boxSizing: "border-box",
  border: "1px solid #e7eaf1",
  borderRadius: "26px",
  background: "rgba(255,255,255,0.94)",
  boxShadow: "0 22px 60px rgba(15,23,42,0.10)",
  textAlign: "center",
  position: "relative",
  zIndex: 1,
};

const stateIconStyle = {
  width: "66px",
  height: "66px",
  margin: "0 auto 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #eef2ff, #f5f3ff)",
  fontSize: "29px",
};

const eyebrowStyle = {
  display: "inline-block",
  color: "#6366f1",
  fontSize: "10px",
  fontWeight: 850,
  letterSpacing: "1.7px",
};

const stateTitleStyle = {
  margin: "8px 0",
  fontSize: "25px",
  letterSpacing: "-0.6px",
};

const stateTextStyle = {
  maxWidth: "440px",
  margin: "0 auto 22px",
  color: "#64748b",
  fontSize: "13px",
  lineHeight: 1.65,
};

const spinnerStyle = {
  width: "34px",
  height: "34px",
  margin: "0 auto 18px",
  borderRadius: "50%",
  border: "3px solid #e0e7ff",
  borderTopColor: "#6366f1",
  animation: "nexbuyDashboardSpin 0.8s linear infinite",
};

const skeletonStatStyle = {
  display: "flex",
  alignItems: "center",
  gap: "13px",
  padding: "17px",
  border: "1px solid #e7eaf1",
  borderRadius: "18px",
  background: "#ffffff",
};

const skeletonCircleStyle = {
  width: "45px",
  height: "45px",
  borderRadius: "14px",
  background:
    "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
  backgroundSize: "200% 100%",
  animation: "nexbuyDashboardShimmer 1.3s infinite",
};

const skeletonLinesStyle = {
  flex: 1,
};

const skeletonShortLineStyle = {
  width: "42%",
  height: "8px",
  marginBottom: "8px",
  borderRadius: "6px",
  background: "#eef2f7",
};

const skeletonLongLineStyle = {
  width: "60%",
  height: "20px",
  borderRadius: "6px",
  background: "#f1f5f9",
};

const skeletonOrdersCardStyle = {
  overflow: "hidden",
  padding: "23px",
  border: "1px solid #e7eaf1",
  borderRadius: "23px",
  background: "#ffffff",
};

const skeletonHeaderStyle = {
  width: "220px",
  height: "28px",
  marginBottom: "22px",
  borderRadius: "7px",
  background: "#eef2f7",
};

const skeletonRowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1.5fr 0.7fr 1fr 1fr",
  gap: "20px",
  padding: "18px 0",
  borderTop: "1px solid #f1f5f9",
};

const skeletonRowCellStyle = {
  height: "25px",
  borderRadius: "7px",
  background: "#f1f5f9",
};

if (
  typeof document !== "undefined" &&
  !document.getElementById("nexbuy-admin-dashboard-styles")
) {
  const style = document.createElement("style");
  style.id = "nexbuy-admin-dashboard-styles";
  style.textContent = `
    @keyframes nexbuyDashboardSpin {
      to { transform: rotate(360deg); }
    }

    @keyframes nexbuyDashboardShimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @media (max-width: 700px) {
      .nexbuy-dashboard-page {
        padding-left: 13px !important;
        padding-right: 13px !important;
      }

      .nexbuy-dashboard-overview-divider {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}

// Apply the skeleton cell style through CSS so the loading state stays lightweight.
const skeletonRowCell = skeletonRowCellStyle;

export default AdminDashboard;
