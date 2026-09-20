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
  backgroundColor: "#f7f7f7",
  fontFamily:
    "Inter, Arial, sans-serif",
};

const mainStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "35px 24px 60px",
};

const pageHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "20px",
  marginBottom: "30px",
};

const backButtonStyle = {
  border: "none",
  backgroundColor: "transparent",
  padding: 0,
  color: "#555",
  cursor: "pointer",
  fontSize: "14px",
  marginBottom: "15px",
};

const titleStyle = {
  margin: 0,
  fontSize: "34px",
  fontWeight: "700",
};

const subtitleStyle = {
  margin: "8px 0 0",
  color: "#777",
  fontSize: "14px",
};

const clearButtonStyle = {
  padding: "10px 15px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "white",
  color: "#c62828",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600",
};

const errorBannerStyle = {
  marginBottom: "20px",
  padding: "13px 16px",
  borderRadius: "8px",
  backgroundColor: "#fff0f0",
  color: "#a52828",
  fontSize: "14px",
};

const cartLayoutStyle = {
  display: "grid",
  gridTemplateColumns:
    "minmax(0, 1fr) 340px",
  gap: "25px",
  alignItems: "start",
};

const itemsContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const itemsHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 5px",
};

const itemsTitleStyle = {
  margin: 0,
  fontSize: "20px",
};

const itemsCountStyle = {
  color: "#777",
  fontSize: "13px",
};

const itemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  padding: "20px",
  backgroundColor: "white",
  borderRadius: "12px",
  boxShadow:
    "0 3px 15px rgba(0,0,0,0.06)",
};

const imageContainerStyle = {
  width: "125px",
  height: "125px",
  flexShrink: 0,
  backgroundColor: "#f3f3f3",
  borderRadius: "10px",
  overflow: "hidden",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
};

const noImageStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "35px",
  color: "#999",
};

const itemDetailsStyle = {
  flex: 1,
  minWidth: 0,
};

const productNameButtonStyle = {
  border: "none",
  backgroundColor: "transparent",
  padding: 0,
  color: "#222",
  cursor: "pointer",
  fontSize: "19px",
  fontWeight: "700",
  textAlign: "left",
};

const categoryStyle = {
  margin: "6px 0",
  color: "#777",
  fontSize: "13px",
};

const unitPriceStyle = {
  margin: "10px 0 0",
  color: "#444",
  fontSize: "14px",
  fontWeight: "600",
};

const itemControlsStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  marginTop: "15px",
  flexWrap: "wrap",
};

const quantityContainerStyle = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #ddd",
  borderRadius: "8px",
  overflow: "hidden",
};

const quantityButtonStyle = {
  width: "36px",
  height: "34px",
  border: "none",
  backgroundColor: "#f5f5f5",
  fontSize: "18px",
  cursor: "pointer",
};

const disabledButtonStyle = {
  color: "#aaa",
  cursor: "not-allowed",
};

const quantityStyle = {
  width: "38px",
  textAlign: "center",
  fontSize: "14px",
  fontWeight: "600",
};

const availableStyle = {
  color: "#777",
  fontSize: "12px",
};

const removeButtonStyle = {
  border: "none",
  backgroundColor: "transparent",
  color: "#c62828",
  cursor: "pointer",
  fontSize: "13px",
  padding: "5px",
};

const itemTotalContainerStyle = {
  minWidth: "105px",
  textAlign: "right",
};

const itemTotalLabelStyle = {
  display: "block",
  marginBottom: "5px",
  color: "#888",
  fontSize: "11px",
};

const itemTotalStyle = {
  fontSize: "18px",
};

const summaryStyle = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "12px",
  boxShadow:
    "0 3px 15px rgba(0,0,0,0.06)",
  position: "sticky",
  top: "20px",
};

const summaryTitleStyle = {
  margin: 0,
  fontSize: "21px",
};

const summaryDividerStyle = {
  height: "1px",
  backgroundColor: "#eee",
  margin: "18px 0",
};

const summaryRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  color: "#666",
  fontSize: "14px",
};

const freeShippingStyle = {
  color: "#287a43",
  fontWeight: "700",
  fontSize: "12px",
};

const totalRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "12px",
  paddingTop: "18px",
  borderTop: "1px solid #ddd",
  fontSize: "17px",
};

const totalPriceStyle = {
  fontSize: "23px",
};

const checkoutButtonStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "22px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#222",
  color: "white",
  fontSize: "15px",
  fontWeight: "700",
  cursor: "pointer",
};

const continueShoppingButtonStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "white",
  color: "#333",
  fontSize: "14px",
  cursor: "pointer",
};

const secureCheckoutStyle = {
  marginTop: "18px",
  paddingTop: "15px",
  borderTop: "1px solid #eee",
  textAlign: "center",
  color: "#777",
  fontSize: "12px",
};

const emptyCartStyle = {
  textAlign: "center",
  padding: "80px 20px",
  backgroundColor: "white",
  borderRadius: "14px",
  boxShadow:
    "0 3px 15px rgba(0,0,0,0.05)",
};

const emptyIconStyle = {
  fontSize: "65px",
  marginBottom: "15px",
};

const emptyTitleStyle = {
  margin: 0,
  fontSize: "25px",
};

const emptyTextStyle = {
  color: "#777",
  lineHeight: "1.6",
  margin: "10px auto 20px",
  maxWidth: "400px",
};

const buttonStyle = {
  padding: "12px 22px",
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

const loadingTextStyle = {
  color: "#777",
};

const errorCardStyle = {
  maxWidth: "450px",
  textAlign: "center",
  padding: "45px",
  backgroundColor: "white",
  borderRadius: "14px",
  boxShadow:
    "0 4px 20px rgba(0,0,0,0.08)",
};

const errorIconStyle = {
  fontSize: "42px",
};

const errorTextStyle = {
  color: "#666",
  lineHeight: "1.6",
};

export default Cart;