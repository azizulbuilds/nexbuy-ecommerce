import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] =
    useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // Fetch Cart
  // ==========================================
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cart");

      const fetchedCart = response.data.cart;

      setCart(fetchedCart);

      if (
        !fetchedCart ||
        !fetchedCart.items ||
        fetchedCart.items.length === 0
      ) {
        setError("Your cart is empty.");
      }
    } catch (error) {
      console.error(
        "Fetch Cart Error:",
        error
      );

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
  // Handle Input
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
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
  // Total Quantity
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
  // Place Order
  // ==========================================
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setError("");
    setPlacingOrder(true);

    try {
      const response = await api.post(
        "/orders",
        {
          shippingAddress: formData,
          paymentMethod,
        }
      );

      console.log(
        "Created order:",
        response.data.order
      );

      const createdOrder =
        response.data.order;

      if (paymentMethod === "COD") {
        navigate(
          `/orders/${createdOrder._id}`
        );
      } else {
        navigate(
          `/orders/${createdOrder._id}/payment`
        );
      }
    } catch (error) {
      console.error(
        "Create Order Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to place order."
      );
    } finally {
      setPlacingOrder(false);
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
            🛍️
          </div>

          <h2>Preparing Checkout...</h2>

          <p style={loadingTextStyle}>
            Loading your cart.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Empty Cart
  // ==========================================
  if (
    error === "Your cart is empty." ||
    !cart ||
    !cart.items ||
    cart.items.length === 0
  ) {
    return (
      <div style={centerStyle}>
        <div style={emptyCardStyle}>
          <div style={emptyIconStyle}>
            🛒
          </div>

          <h2>Your cart is empty</h2>

          <p style={emptyTextStyle}>
            Add products to your cart before
            proceeding to checkout.
          </p>

          <button
            onClick={() =>
              navigate("/products")
            }
            style={buttonStyle}
          >
            Continue Shopping →
          </button>
        </div>
      </div>
    );
  }

  const total = getTotal();
  const totalQuantity =
    getTotalQuantity();

  return (
    <div style={pageStyle}>
      <main style={mainStyle}>
        {/* ==========================================
            Checkout Header
        ========================================== */}
        <div style={pageHeaderStyle}>
          <button
            onClick={() =>
              navigate("/cart")
            }
            style={backButtonStyle}
          >
            ← Back to Cart
          </button>

          <h1 style={titleStyle}>
            Checkout
          </h1>

          <div style={secureBadgeStyle}>
            🔒 Secure Checkout
          </div>
        </div>

        {/* ==========================================
            Error
        ========================================== */}
        {error && (
          <div style={errorBoxStyle}>
            ⚠️ {error}
          </div>
        )}

        <div style={checkoutLayoutStyle}>
          {/* ==========================================
              Checkout Form
          ========================================== */}
          <form
            onSubmit={handlePlaceOrder}
            style={formStyle}
          >
            {/* Shipping */}
            <div style={sectionHeaderStyle}>
              <div
                style={sectionNumberStyle}
              >
                1
              </div>

              <div>
                <h2
                  style={
                    sectionTitleStyle
                  }
                >
                  Shipping Address
                </h2>

                <p
                  style={
                    sectionSubtitleStyle
                  }
                >
                  Where should we deliver
                  your order?
                </p>
              </div>
            </div>

            {/* Full Name */}
            <label style={labelStyle}>
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              autoComplete="name"
              style={inputStyle}
            />

            {/* Address */}
            <label style={labelStyle}>
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="House number, street, area"
              required
              rows="4"
              autoComplete="street-address"
              style={textareaStyle}
            />

            {/* City + State */}
            <div style={twoColumnStyle}>
              <div>
                <label style={labelStyle}>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                  autoComplete="address-level2"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  required
                  autoComplete="address-level1"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Postal + Country */}
            <div style={twoColumnStyle}>
              <div>
                <label style={labelStyle}>
                  Postal Code
                </label>

                <input
                  type="text"
                  name="postalCode"
                  value={
                    formData.postalCode
                  }
                  onChange={handleChange}
                  placeholder="Enter postal code"
                  required
                  inputMode="numeric"
                  autoComplete="postal-code"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Country
                </label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  autoComplete="country-name"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Phone */}
            <label style={labelStyle}>
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
              autoComplete="tel"
              inputMode="tel"
              style={inputStyle}
            />

            {/* ==========================================
                Payment
            ========================================== */}
            <div
              style={{
                ...sectionHeaderStyle,
                marginTop: "35px",
              }}
            >
              <div
                style={sectionNumberStyle}
              >
                2
              </div>

              <div>
                <h2
                  style={
                    sectionTitleStyle
                  }
                >
                  Payment Method
                </h2>

                <p
                  style={
                    sectionSubtitleStyle
                  }
                >
                  Choose how you want to pay.
                </p>
              </div>
            </div>

            {/* COD */}
            <label
              style={{
                ...paymentOptionStyle,
                ...(paymentMethod === "COD"
                  ? selectedPaymentStyle
                  : {}),
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={
                  paymentMethod === "COD"
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />

              <div
                style={
                  paymentContentStyle
                }
              >
                <div
                  style={
                    paymentTitleRowStyle
                  }
                >
                  <strong>
                    Cash on Delivery
                  </strong>

                  <span
                    style={
                      paymentIconStyle
                    }
                  >
                    💵
                  </span>
                </div>

                <span
                  style={
                    paymentDescriptionStyle
                  }
                >
                  Pay when your order
                  arrives at your doorstep.
                </span>
              </div>
            </label>

            {/* Razorpay */}
            <label
              style={{
                ...paymentOptionStyle,
                ...(paymentMethod ===
                "RAZORPAY"
                  ? selectedPaymentStyle
                  : {}),
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="RAZORPAY"
                checked={
                  paymentMethod ===
                  "RAZORPAY"
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />

              <div
                style={
                  paymentContentStyle
                }
              >
                <div
                  style={
                    paymentTitleRowStyle
                  }
                >
                  <strong>
                    Razorpay
                  </strong>

                  <span
                    style={
                      paymentIconStyle
                    }
                  >
                    💳
                  </span>
                </div>

                <span
                  style={
                    paymentDescriptionStyle
                  }
                >
                  Pay securely online using
                  supported payment methods.
                </span>
              </div>
            </label>

            {/* Place Order */}
            <button
              type="submit"
              disabled={placingOrder}
              style={{
                ...placeOrderButtonStyle,
                ...(placingOrder
                  ? disabledOrderButtonStyle
                  : {}),
              }}
            >
              {placingOrder
                ? "Processing..."
                : paymentMethod === "COD"
                ? "Place Order"
                : "Continue to Payment →"}
            </button>

            <p style={formSecurityStyle}>
              🔒 Your order information is
              securely processed.
            </p>
          </form>

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

            {/* Products */}
            <div
              style={summaryItemsStyle}
            >
              {cart.items.map((item) => {
                if (!item.product) {
                  return null;
                }

                const itemTotal =
                  item.product.price *
                  item.quantity;

                const image =
                  item.product.images &&
                  item.product.images.length >
                    0
                    ? item.product.images[0]
                    : null;

                return (
                  <div
                    key={item.product._id}
                    style={summaryItemStyle}
                  >
                    <div
                      style={
                        summaryImageContainerStyle
                      }
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={
                            item.product.name
                          }
                          style={
                            summaryImageStyle
                          }
                        />
                      ) : (
                        <span>
                          📦
                        </span>
                      )}

                      <span
                        style={
                          quantityBadgeStyle
                        }
                      >
                        {item.quantity}
                      </span>
                    </div>

                    <div
                      style={
                        summaryProductStyle
                      }
                    >
                      <strong>
                        {item.product.name}
                      </strong>

                      <span
                        style={
                          summaryQuantityStyle
                        }
                      >
                        ₹
                        {Number(
                          item.product.price
                        ).toLocaleString(
                          "en-IN"
                        )}{" "}
                        ×{" "}
                        {item.quantity}
                      </span>
                    </div>

                    <strong
                      style={
                        summaryItemPriceStyle
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
                );
              })}
            </div>

            {/* Summary Rows */}
            <div
              style={summaryRowsStyle}
            >
              <div
                style={summaryRowStyle}
              >
                <span>
                  Items
                </span>

                <span>
                  {cart.items.length}
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
            </div>

            {/* Total */}
            <div style={totalRowStyle}>
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

            {/* Payment Information */}
            <div
              style={
                paymentSummaryStyle
              }
            >
              <span>
                Payment
              </span>

              <strong>
                {paymentMethod ===
                "COD"
                  ? "Cash on Delivery"
                  : "Razorpay"}
              </strong>
            </div>
          </aside>
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

const mainStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "35px 24px 60px",
};

const pageHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "30px",
  flexWrap: "wrap",
};

const backButtonStyle = {
  border: "none",
  backgroundColor: "transparent",
  padding: 0,
  color: "#555",
  cursor: "pointer",
  fontSize: "14px",
};

const titleStyle = {
  margin: 0,
  fontSize: "34px",
  fontWeight: "700",
};

const secureBadgeStyle = {
  padding: "8px 12px",
  backgroundColor: "#f0f7f2",
  color: "#287a43",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
};

const errorBoxStyle = {
  marginBottom: "20px",
  padding: "13px 16px",
  backgroundColor: "#fff0f0",
  color: "#a52828",
  borderRadius: "8px",
  fontSize: "14px",
};

const checkoutLayoutStyle = {
  display: "grid",
  gridTemplateColumns:
    "minmax(0, 1fr) 360px",
  gap: "25px",
  alignItems: "start",
};

const formStyle = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "14px",
  boxShadow:
    "0 3px 15px rgba(0,0,0,0.06)",
};

const sectionHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  marginBottom: "20px",
};

const sectionNumberStyle = {
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  borderRadius: "50%",
  backgroundColor: "#222",
  color: "white",
  fontWeight: "700",
  fontSize: "14px",
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "20px",
};

const sectionSubtitleStyle = {
  margin: "4px 0 0",
  color: "#777",
  fontSize: "13px",
};

const labelStyle = {
  display: "block",
  marginTop: "17px",
  marginBottom: "7px",
  color: "#333",
  fontSize: "13px",
  fontWeight: "700",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 13px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  outline: "none",
  fontSize: "14px",
  backgroundColor: "white",
};

const textareaStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 13px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  outline: "none",
  fontSize: "14px",
  resize: "vertical",
  fontFamily:
    "Inter, Arial, sans-serif",
};

const twoColumnStyle = {
  display: "grid",
  gridTemplateColumns:
    "1fr 1fr",
  gap: "15px",
};

const paymentOptionStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  padding: "16px",
  marginTop: "12px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  cursor: "pointer",
};

const selectedPaymentStyle = {
  border: "2px solid #222",
  backgroundColor: "#fafafa",
};

const paymentContentStyle = {
  flex: 1,
};

const paymentTitleRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "15px",
};

const paymentIconStyle = {
  fontSize: "20px",
};

const paymentDescriptionStyle = {
  display: "block",
  marginTop: "5px",
  color: "#777",
  fontSize: "12px",
  lineHeight: "1.5",
};

const placeOrderButtonStyle = {
  width: "100%",
  padding: "15px",
  marginTop: "25px",
  border: "none",
  borderRadius: "9px",
  backgroundColor: "#222",
  color: "white",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
};

const disabledOrderButtonStyle = {
  opacity: 0.65,
  cursor: "wait",
};

const formSecurityStyle = {
  margin: "15px 0 0",
  textAlign: "center",
  color: "#888",
  fontSize: "11px",
};

const summaryStyle = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "14px",
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

const summaryItemsStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const summaryItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const summaryImageContainerStyle = {
  position: "relative",
  width: "55px",
  height: "55px",
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f3f3f3",
  borderRadius: "8px",
  overflow: "visible",
};

const summaryImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
  borderRadius: "8px",
};

const quantityBadgeStyle = {
  position: "absolute",
  top: "-7px",
  right: "-7px",
  minWidth: "20px",
  height: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "0 4px",
  borderRadius: "50%",
  backgroundColor: "#222",
  color: "white",
  fontSize: "10px",
  fontWeight: "700",
};

const summaryProductStyle = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minWidth: 0,
  gap: "4px",
  fontSize: "13px",
};

const summaryQuantityStyle = {
  color: "#777",
  fontSize: "11px",
};

const summaryItemPriceStyle = {
  fontSize: "13px",
  whiteSpace: "nowrap",
};

const summaryRowsStyle = {
  marginTop: "20px",
  paddingTop: "10px",
  borderTop: "1px solid #eee",
};

const summaryRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "9px 0",
  color: "#666",
  fontSize: "13px",
};

const freeShippingStyle = {
  color: "#287a43",
  fontWeight: "700",
};

const totalRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "12px",
  paddingTop: "18px",
  borderTop: "2px solid #222",
  fontSize: "17px",
};

const totalPriceStyle = {
  fontSize: "23px",
};

const paymentSummaryStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "18px",
  padding: "12px",
  backgroundColor: "#f7f7f7",
  borderRadius: "8px",
  color: "#666",
  fontSize: "12px",
};

const emptyCardStyle = {
  maxWidth: "450px",
  padding: "50px 35px",
  textAlign: "center",
  backgroundColor: "white",
  borderRadius: "14px",
  boxShadow:
    "0 4px 20px rgba(0,0,0,0.07)",
};

const emptyIconStyle = {
  fontSize: "60px",
};

const emptyTextStyle = {
  color: "#777",
  lineHeight: "1.6",
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

const loadingTextStyle = {
  color: "#777",
};

export default Checkout;