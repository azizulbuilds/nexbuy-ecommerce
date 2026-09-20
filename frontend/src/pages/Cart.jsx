import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  // ==========================================
  // Fetch Cart
  // ==========================================
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cart");

      setCart(response.data.cart);
    } catch (error) {
      console.error("Fetch Cart Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load cart."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ==========================================
  // Update Quantity
  // ==========================================
  const updateQuantity = async (
    productId,
    quantity
  ) => {
    if (quantity < 1) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const response = await api.put(
        "/cart/update",
        {
          productId,
          quantity,
        }
      );

      setCart(response.data.cart);
    } catch (error) {
      console.error(
        "Update Cart Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update cart."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // Remove Item
  // ==========================================
  const removeItem = async (productId) => {
    try {
      setUpdating(true);
      setError("");

      const response = await api.delete(
        `/cart/remove/${productId}`
      );

      setCart(response.data.cart);
    } catch (error) {
      console.error(
        "Remove Cart Item Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to remove item."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // Clear Cart
  // ==========================================
  const clearCart = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your cart?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const response = await api.delete(
        "/cart/clear"
      );

      setCart(response.data.cart);
    } catch (error) {
      console.error(
        "Clear Cart Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to clear cart."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // Calculate Total
  // ==========================================
  const getTotal = () => {
    if (!cart || !cart.items) {
      return 0;
    }

    return cart.items.reduce(
      (total, item) => {
        if (!item.product) {
          return total;
        }

        return (
          total +
          item.product.price *
            item.quantity
        );
      },
      0
    );
  };

  // ==========================================
  // Calculate Total Quantity
  // ==========================================
  const getTotalQuantity = () => {
    if (!cart || !cart.items) {
      return 0;
    }

    return cart.items.reduce(
      (total, item) =>
        total + item.quantity,
      0
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
            🛒
          </div>

          <h2>Loading your cart...</h2>

          <p style={loadingTextStyle}>
            Please wait a moment.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Error Without Cart
  // ==========================================
  if (error && !cart) {
    return (
      <div style={centerStyle}>
        <div style={errorCardStyle}>
          <div style={errorIconStyle}>
            ⚠️
          </div>

          <h2>Unable to load cart</h2>

          <p style={errorTextStyle}>
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/products")
            }
            style={buttonStyle}
          >
            ← Back to Products
          </button>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const total = getTotal();
  const totalQuantity =
    getTotalQuantity();

  return (
    <div style={pageStyle}>
      <main style={mainStyle}>
        {/* ==========================================
            Page Header
        ========================================== */}
        <div style={pageHeaderStyle}>
          <div>
            <button
              onClick={() =>
                navigate("/products")
              }
              style={backButtonStyle}
            >
              ← Continue Shopping
            </button>

            <h1 style={titleStyle}>
              Shopping Cart
            </h1>

            {items.length > 0 && (
              <p style={subtitleStyle}>
                {totalQuantity}{" "}
                {totalQuantity === 1
                  ? "item"
                  : "items"}{" "}
                in your cart
              </p>
            )}
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              disabled={updating}
              style={clearButtonStyle}
            >
              🗑 Clear Cart
            </button>
          )}
        </div>

        {/* ==========================================
            Error Message
        ========================================== */}
        {error && (
          <div style={errorBannerStyle}>
            ⚠️ {error}
          </div>
        )}

        {/* ==========================================
            Empty Cart
        ========================================== */}
        {items.length === 0 ? (
          <div style={emptyCartStyle}>
            <div style={emptyIconStyle}>
              🛒
            </div>

            <h2 style={emptyTitleStyle}>
              Your cart is empty
            </h2>

            <p style={emptyTextStyle}>
              Looks like you haven't added
              anything to your cart yet.
            </p>

            <button
              onClick={() =>
                navigate("/products")
              }
              style={buttonStyle}
            >
              Start Shopping →
            </button>
          </div>
        ) : (
          <div style={cartLayoutStyle}>
            {/* ==========================================
                Cart Items
            ========================================== */}
            <div style={itemsContainerStyle}>
              <div style={itemsHeaderStyle}>
                <h2 style={itemsTitleStyle}>
                  Cart Items
                </h2>

                <span style={itemsCountStyle}>
                  {items.length}{" "}
                  {items.length === 1
                    ? "product"
                    : "products"}
                </span>
              </div>

              {items.map((item) => {
                const product =
                  item.product;

                if (!product) {
                  return null;
                }

                const itemTotal =
                  product.price *
                  item.quantity;

                const image =
                  product.images &&
                  product.images.length > 0
                    ? product.images[0]
                    : null;

                return (
                  <div
                    key={product._id}
                    style={itemStyle}
                  >
                    {/* Product Image */}
                    <div
                      style={
                        imageContainerStyle
                      }
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
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

                    {/* Product Details */}
                    <div
                      style={itemDetailsStyle}
                    >
                      <button
                        onClick={() =>
                          navigate(
                            `/products/${product._id}`
                          )
                        }
                        style={
                          productNameButtonStyle
                        }
                      >
                        {product.name}
                      </button>

                      <p
                        style={
                          categoryStyle
                        }
                      >
                        {product.category}
                      </p>

                      <p
                        style={
                          unitPriceStyle
                        }
                      >
                        ₹
                        {Number(
                          product.price
                        ).toLocaleString(
                          "en-IN"
                        )}{" "}
                        each
                      </p>

                      <div
                        style={
                          itemControlsStyle
                        }
                      >
                        {/* Quantity */}
                        <div
                          style={
                            quantityContainerStyle
                          }
                        >
                          <button
                            onClick={() =>
                              updateQuantity(
                                product._id,
                                item.quantity -
                                  1
                              )
                            }
                            disabled={
                              updating ||
                              item.quantity <=
                                1
                            }
                            style={{
                              ...quantityButtonStyle,
                              ...(item.quantity <=
                              1
                                ? disabledButtonStyle
                                : {}),
                            }}
                          >
                            −
                          </button>

                          <span
                            style={
                              quantityStyle
                            }
                          >
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                product._id,
                                item.quantity +
                                  1
                              )
                            }
                            disabled={
                              updating ||
                              item.quantity >=
                                product.stock
                            }
                            style={{
                              ...quantityButtonStyle,
                              ...(item.quantity >=
                              product.stock
                                ? disabledButtonStyle
                                : {}),
                            }}
                          >
                            +
                          </button>
                        </div>

                        <span
                          style={
                            availableStyle
                          }
                        >
                          {product.stock}{" "}
                          available
                        </span>

                        {/* Remove */}
                        <button
                          onClick={() =>
                            removeItem(
                              product._id
                            )
                          }
                          disabled={updating}
                          style={
                            removeButtonStyle
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div
                      style={
                        itemTotalContainerStyle
                      }
                    >
                      <span
                        style={
                          itemTotalLabelStyle
                        }
                      >
                        Item Total
                      </span>

                      <strong
                        style={
                          itemTotalStyle
                        }
                      >
                        ₹
                        {Number(
                          itemTotal
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ==========================================
                Order Summary
            ========================================== */}
            <aside style={summaryStyle}>
              <h2
                style={
                  summaryTitleStyle
                }
              >
                Order Summary
              </h2>

              <div
                style={summaryDividerStyle}
              />

              <div
                style={summaryRowStyle}
              >
                <span>
                  Products
                </span>

                <span>
                  {items.length}
                </span>
              </div>

              <div
                style={summaryRowStyle}
              >
                <span>
                  Quantity
                </span>

                <span>
                  {totalQuantity}
                </span>
              </div>

              <div
                style={summaryRowStyle}
              >
                <span>
                  Subtotal
                </span>

                <span>
                  ₹
                  {Number(
                    total
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div
                style={summaryRowStyle}
              >
                <span>
                  Shipping
                </span>

                <span
                  style={
                    freeShippingStyle
                  }
                >
                  FREE
                </span>
              </div>

              <div
                style={totalRowStyle}
              >
                <strong>
                  Total
                </strong>

                <strong
                  style={
                    totalPriceStyle
                  }
                >
                  ₹
                  {Number(
                    total
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <button
                onClick={() =>
                  navigate("/checkout")
                }
                disabled={updating}
                style={
                  checkoutButtonStyle
                }
              >
                Proceed to Checkout →
              </button>

              <button
                onClick={() =>
                  navigate("/products")
                }
                style={
                  continueShoppingButtonStyle
                }
              >
                Continue Shopping
              </button>

              <div
                style={
                  secureCheckoutStyle
                }
              >
                🔒 Secure Checkout
              </div>
            </aside>
          </div>
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
    "radial-gradient(circle at top left, rgba(99,102,241,0.10), transparent 28%), linear-gradient(180deg, #f8faff 0%, #f6f7fb 48%, #ffffff 100%)",
  fontFamily: "Inter, Arial, sans-serif",
  color: "#0f172a",
};

const mainStyle = {
  maxWidth: "1240px",
  margin: "0 auto",
  padding: "42px 24px 72px",
};

const pageHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "24px",
  marginBottom: "28px",
  padding: "28px 30px",
  borderRadius: "24px",
  background:
    "linear-gradient(135deg, #0f172a 0%, #1e293b 52%, #312e81 100%)",
  boxShadow: "0 18px 50px rgba(15,23,42,0.16)",
  color: "white",
};

const backButtonStyle = {
  border: "1px solid rgba(255,255,255,0.16)",
  backgroundColor: "rgba(255,255,255,0.08)",
  padding: "9px 13px",
  borderRadius: "999px",
  color: "#e2e8f0",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "700",
  marginBottom: "16px",
};

const titleStyle = {
  margin: 0,
  fontSize: "clamp(32px, 4vw, 46px)",
  lineHeight: "1.05",
  letterSpacing: "-1.5px",
  fontWeight: "800",
};

const subtitleStyle = {
  margin: "10px 0 0",
  color: "#cbd5e1",
  fontSize: "14px",
};

const clearButtonStyle = {
  padding: "11px 16px",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: "12px",
  backgroundColor: "rgba(255,255,255,0.10)",
  color: "#fecaca",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "700",
  backdropFilter: "blur(10px)",
};

const errorBannerStyle = {
  marginBottom: "22px",
  padding: "14px 17px",
  borderRadius: "14px",
  backgroundColor: "#fff1f2",
  border: "1px solid #fecdd3",
  color: "#be123c",
  fontSize: "14px",
  boxShadow: "0 8px 22px rgba(190,24,93,0.06)",
};

const cartLayoutStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 360px",
  gap: "28px",
  alignItems: "start",
};

const itemsContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const itemsHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "4px 6px 2px",
};

const itemsTitleStyle = {
  margin: 0,
  fontSize: "22px",
  letterSpacing: "-0.4px",
  color: "#0f172a",
};

const itemsCountStyle = {
  color: "#6366f1",
  fontSize: "12px",
  fontWeight: "800",
  backgroundColor: "#eef2ff",
  border: "1px solid #e0e7ff",
  borderRadius: "999px",
  padding: "7px 11px",
};

const itemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "22px",
  padding: "20px",
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.94))",
  border: "1px solid rgba(226,232,240,0.95)",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(15,23,42,0.07)",
};

const imageContainerStyle = {
  width: "132px",
  height: "132px",
  flexShrink: 0,
  background:
    "linear-gradient(145deg, #f8fafc 0%, #eef2ff 100%)",
  border: "1px solid #e2e8f0",
  borderRadius: "17px",
  overflow: "hidden",
  padding: "8px",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
  borderRadius: "12px",
};

const noImageStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "38px",
  color: "#94a3b8",
};

const itemDetailsStyle = {
  flex: 1,
  minWidth: 0,
};

const productNameButtonStyle = {
  border: "none",
  backgroundColor: "transparent",
  padding: 0,
  color: "#0f172a",
  cursor: "pointer",
  fontSize: "19px",
  fontWeight: "800",
  textAlign: "left",
  lineHeight: "1.3",
};

const categoryStyle = {
  display: "inline-block",
  margin: "8px 0 0",
  color: "#4f46e5",
  backgroundColor: "#eef2ff",
  border: "1px solid #e0e7ff",
  borderRadius: "999px",
  padding: "5px 9px",
  fontSize: "10px",
  fontWeight: "800",
  textTransform: "uppercase",
  letterSpacing: "0.7px",
};

const unitPriceStyle = {
  margin: "11px 0 0",
  color: "#334155",
  fontSize: "15px",
  fontWeight: "800",
};

const itemControlsStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginTop: "15px",
  flexWrap: "wrap",
};

const quantityContainerStyle = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #dbe2ea",
  borderRadius: "11px",
  overflow: "hidden",
  backgroundColor: "white",
  boxShadow: "0 3px 10px rgba(15,23,42,0.04)",
};

const quantityButtonStyle = {
  width: "38px",
  height: "36px",
  border: "none",
  backgroundColor: "#f8fafc",
  color: "#0f172a",
  fontSize: "19px",
  fontWeight: "700",
  cursor: "pointer",
};

const disabledButtonStyle = {
  color: "#cbd5e1",
  cursor: "not-allowed",
  backgroundColor: "#f8fafc",
};

const quantityStyle = {
  width: "40px",
  textAlign: "center",
  fontSize: "14px",
  fontWeight: "800",
  color: "#0f172a",
};

const availableStyle = {
  color: "#15803d",
  fontSize: "11px",
  fontWeight: "700",
  backgroundColor: "#f0fdf4",
  border: "1px solid #dcfce7",
  borderRadius: "999px",
  padding: "6px 9px",
};

const removeButtonStyle = {
  border: "none",
  backgroundColor: "#fff1f2",
  color: "#e11d48",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "800",
  padding: "7px 10px",
  borderRadius: "9px",
};

const itemTotalContainerStyle = {
  minWidth: "118px",
  textAlign: "right",
  paddingLeft: "8px",
};

const itemTotalLabelStyle = {
  display: "block",
  marginBottom: "6px",
  color: "#94a3b8",
  fontSize: "10px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.6px",
};

const itemTotalStyle = {
  fontSize: "20px",
  color: "#0f172a",
  letterSpacing: "-0.4px",
};

const summaryStyle = {
  background:
    "linear-gradient(180deg, #ffffff 0%, #f8faff 100%)",
  padding: "26px",
  borderRadius: "22px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 18px 45px rgba(15,23,42,0.10)",
  position: "sticky",
  top: "20px",
};

const summaryTitleStyle = {
  margin: 0,
  fontSize: "22px",
  color: "#0f172a",
  letterSpacing: "-0.5px",
};

const summaryDividerStyle = {
  height: "1px",
  background:
    "linear-gradient(90deg, #e2e8f0, #c7d2fe, #e2e8f0)",
  margin: "19px 0",
};

const summaryRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  color: "#64748b",
  fontSize: "14px",
};

const freeShippingStyle = {
  color: "#15803d",
  backgroundColor: "#dcfce7",
  borderRadius: "999px",
  padding: "4px 8px",
  fontWeight: "800",
  fontSize: "10px",
  letterSpacing: "0.4px",
};

const totalRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "12px",
  paddingTop: "20px",
  borderTop: "1px solid #e2e8f0",
  fontSize: "17px",
  color: "#0f172a",
};

const totalPriceStyle = {
  fontSize: "25px",
  color: "#4f46e5",
  letterSpacing: "-0.7px",
};

const checkoutButtonStyle = {
  width: "100%",
  padding: "15px",
  marginTop: "24px",
  border: "none",
  borderRadius: "13px",
  background:
    "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
  color: "white",
  fontSize: "14px",
  fontWeight: "800",
  cursor: "pointer",
  boxShadow: "0 12px 25px rgba(79,70,229,0.25)",
};

const continueShoppingButtonStyle = {
  width: "100%",
  padding: "13px",
  marginTop: "11px",
  border: "1px solid #dbe2ea",
  borderRadius: "13px",
  backgroundColor: "white",
  color: "#334155",
  fontSize: "13px",
  fontWeight: "700",
  cursor: "pointer",
};

const secureCheckoutStyle = {
  marginTop: "20px",
  paddingTop: "17px",
  borderTop: "1px solid #e2e8f0",
  textAlign: "center",
  color: "#64748b",
  fontSize: "11px",
  fontWeight: "700",
};

const emptyCartStyle = {
  textAlign: "center",
  padding: "88px 24px",
  background:
    "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)",
  border: "1px solid #e2e8f0",
  borderRadius: "24px",
  boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
};

const emptyIconStyle = {
  fontSize: "68px",
  marginBottom: "18px",
};

const emptyTitleStyle = {
  margin: 0,
  fontSize: "28px",
  color: "#0f172a",
  letterSpacing: "-0.6px",
};

const emptyTextStyle = {
  color: "#64748b",
  lineHeight: "1.7",
  margin: "11px auto 23px",
  maxWidth: "420px",
};

const buttonStyle = {
  padding: "13px 23px",
  border: "none",
  borderRadius: "12px",
  background:
    "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "800",
  boxShadow: "0 10px 22px rgba(79,70,229,0.22)",
};

const centerStyle = {
  minHeight: "80vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  background:
    "radial-gradient(circle at top, rgba(99,102,241,0.10), transparent 35%), #f8fafc",
  fontFamily: "Inter, Arial, sans-serif",
};

const loadingCardStyle = {
  minWidth: "280px",
  textAlign: "center",
  padding: "42px 34px",
  backgroundColor: "white",
  border: "1px solid #e2e8f0",
  borderRadius: "22px",
  boxShadow: "0 18px 45px rgba(15,23,42,0.09)",
};

const loadingIconStyle = {
  fontSize: "48px",
};

const loadingTextStyle = {
  color: "#64748b",
};

const errorCardStyle = {
  maxWidth: "450px",
  textAlign: "center",
  padding: "48px",
  backgroundColor: "white",
  border: "1px solid #e2e8f0",
  borderRadius: "22px",
  boxShadow: "0 18px 45px rgba(15,23,42,0.10)",
};

const errorIconStyle = {
  fontSize: "44px",
};

const errorTextStyle = {
  color: "#64748b",
  lineHeight: "1.65",
};

export default Cart;
