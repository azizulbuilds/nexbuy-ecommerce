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
      <div style={pageStyle}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h2>Login required</h2>

          <button
            onClick={() => navigate("/login")}
            style={buttonStyle}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1>Access Denied</h1>

          <p>
            You do not have permission to access the
            Admin Dashboard.
          </p>

          <button
            onClick={() => navigate("/products")}
            style={buttonStyle}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={pageStyle}>
        <h2>Loading Admin Dashboard...</h2>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={{ margin: 0 }}>
              👑 Admin Dashboard
            </h1>

            <p style={{ color: "#666" }}>
              Manage customer orders
            </p>
          </div>

          <button
            onClick={fetchOrders}
            style={secondaryButtonStyle}
          >
            Refresh Orders
          </button>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <div style={statsContainerStyle}>
          <div style={statCardStyle}>
            <h3>Total Orders</h3>
            <p style={statNumberStyle}>
              {orders.length}
            </p>
          </div>

          <div style={statCardStyle}>
            <h3>Paid Orders</h3>
            <p style={statNumberStyle}>
              {
                orders.filter(
                  (order) =>
                    order.paymentStatus === "PAID"
                ).length
              }
            </p>
          </div>

          <div style={statCardStyle}>
            <h3>Pending Orders</h3>
            <p style={statNumberStyle}>
              {
                orders.filter(
                  (order) =>
                    order.paymentStatus ===
                    "PENDING"
                ).length
              }
            </p>
          </div>

          <div style={statCardStyle}>
            <h3>Delivered</h3>
            <p style={statNumberStyle}>
              {
                orders.filter(
                  (order) =>
                    order.orderStatus ===
                    "DELIVERED"
                ).length
              }
            </p>
          </div>
        </div>

        <div style={ordersCardStyle}>
          <h2>All Orders</h2>

          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div style={tableWrapperStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>
                      Order ID
                    </th>

                    <th style={thStyle}>
                      Customer
                    </th>

                    <th style={thStyle}>
                      Amount
                    </th>

                    <th style={thStyle}>
                      Payment
                    </th>

                    <th style={thStyle}>
                      Order Status
                    </th>

                    <th style={thStyle}>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td style={tdStyle}>
                        <strong>
                          #{order._id.slice(-8)}
                        </strong>
                      </td>

                      <td style={tdStyle}>
                        {order.user?.name || "Unknown"}
                        <br />
                        <small
                          style={{
                            color: "#666",
                          }}
                        >
                          {order.user?.email ||
                            ""}
                        </small>
                      </td>

                      <td style={tdStyle}>
                        ₹{order.totalAmount}
                      </td>

                      <td style={tdStyle}>
                        <strong>
                          {order.paymentMethod}
                        </strong>

                        <br />

                        <span
                          style={{
                            color:
                              order.paymentStatus ===
                              "PAID"
                                ? "green"
                                : "#856404",
                          }}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      <td style={tdStyle}>
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
                          style={selectStyle}
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
                      </td>

                      <td style={tdStyle}>
                        <button
                          onClick={() =>
                            navigate(
                              `/orders/${order._id}`
                            )
                          }
                          style={buttonStyle}
                        >
                          View
                        </button>

                        {updatingOrder ===
                          order._id && (
                          <span
                            style={{
                              marginLeft: "8px",
                              fontSize: "12px",
                            }}
                          >
                            Updating...
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: "40px 20px",
  boxSizing: "border-box",
  backgroundColor: "#f5f5f5",
  fontFamily: "Arial, sans-serif",
};

const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
  gap: "15px",
  flexWrap: "wrap",
};

const statsContainerStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  marginBottom: "25px",
};

const statCardStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
};

const statNumberStyle = {
  fontSize: "30px",
  fontWeight: "bold",
  margin: "10px 0 0",
};

const ordersCardStyle = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "10px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
};

const tableWrapperStyle = {
  width: "100%",
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "800px",
};

const thStyle = {
  textAlign: "left",
  padding: "14px 10px",
  borderBottom: "2px solid #ddd",
  backgroundColor: "#f8f8f8",
};

const tdStyle = {
  padding: "14px 10px",
  borderBottom: "1px solid #eee",
  verticalAlign: "middle",
};

const selectStyle = {
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  backgroundColor: "white",
};

const buttonStyle = {
  padding: "9px 14px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#222",
  color: "white",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  padding: "10px 16px",
  border: "1px solid #222",
  borderRadius: "6px",
  backgroundColor: "white",
  color: "#222",
  cursor: "pointer",
};

const cardStyle = {
  backgroundColor: "white",
  padding: "40px",
  borderRadius: "10px",
  textAlign: "center",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
};

const errorStyle = {
  backgroundColor: "#ffe6e6",
  color: "#b00020",
  padding: "12px",
  borderRadius: "6px",
  marginBottom: "20px",
};

export default AdminDashboard;