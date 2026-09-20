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
    <div className="nexbuy-checkout-page" style={pageStyle}>

      <style>{`
        @keyframes nexCheckoutUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .nexbuy-checkout-page {
          animation: nexCheckoutUp .45s ease both;
        }

        .nexbuy-checkout-form input:focus,
        .nexbuy-checkout-form textarea:focus {
          border-color: #818cf8 !important;
          background: #ffffff !important;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.09) !important;
        }

        .nexbuy-checkout-form button:not(:disabled):hover {
          transform: translateY(-1px);
        }

        .nexbuy-checkout-summary {
          animation: nexCheckoutUp .55s ease both;
        }

        @media (max-width: 900px) {
          .nexbuy-checkout-layout {
            grid-template-columns: 1fr !important;
          }

          .nexbuy-checkout-summary {
            position: relative !important;
            top: auto !important;
          }
        }

        @media (max-width: 650px) {
          .nexbuy-checkout-main {
            padding: 20px 13px 45px !important;
          }

          .nexbuy-checkout-header {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 12px !important;
          }

          .nexbuy-checkout-header button,
          .nexbuy-checkout-header > div {
            justify-self: center !important;
          }

          .nexbuy-checkout-form {
            padding: 21px !important;
            border-radius: 19px !important;
          }

          .nexbuy-checkout-summary {
            padding: 21px !important;
            border-radius: 19px !important;
          }

          .nexbuy-checkout-form .nexbuy-two-column {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <main className="nexbuy-checkout-main" style={mainStyle}>
        {/* ==========================================
            Checkout Header
        ========================================== */}
        <div className="nexbuy-checkout-header" style={pageHeaderStyle}>
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

        <div className="nexbuy-checkout-layout" style={checkoutLayoutStyle}>
          {/* ==========================================
              Checkout Form
          ========================================== */}
          <form
            onSubmit={handlePlaceOrder}
            className="nexbuy-checkout-form"
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
            <div className="nexbuy-two-column" style={twoColumnStyle}>
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
            <div className="nexbuy-two-column" style={twoColumnStyle}>
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
          <aside className="nexbuy-checkout-summary" style={summaryStyle}>
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
// Premium Nexbuy Checkout Design System
// ==========================================

const pageStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 4% 2%, rgba(99,102,241,0.12), transparent 28%), radial-gradient(circle at 96% 20%, rgba(168,85,247,0.10), transparent 27%), #f6f7fb",
  color: "#172033",
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const mainStyle = {
  maxWidth: "1180px",
  margin: "0 auto",
  padding: "32px 22px 70px",
};

const pageHeaderStyle = {
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  alignItems: "center",
  gap: "20px",
  marginBottom: "27px",
};

const backButtonStyle = {
  justifySelf: "start",
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  border: "1px solid #e1e4ed",
  background: "rgba(255,255,255,0.78)",
  padding: "10px 14px",
  borderRadius: "12px",
  color: "#566075",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "800",
  boxShadow: "0 6px 18px rgba(31,41,55,0.045)",
  transition: "all .2s ease",
};

const titleStyle = {
  margin: 0,
  textAlign: "center",
  color: "#182033",
  fontSize: "clamp(27px, 4vw, 36px)",
  fontWeight: "900",
  letterSpacing: "-1.2px",
};

const secureBadgeStyle = {
  justifySelf: "end",
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  padding: "9px 13px",
  background: "#ecfdf3",
  color: "#207346",
  border: "1px solid #ccefd9",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: "900",
  boxShadow: "0 7px 18px rgba(32,115,70,0.07)",
};

const errorBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  marginBottom: "18px",
  padding: "13px 16px",
  background: "#fff1f2",
  border: "1px solid #ffd3d9",
  color: "#ad2738",
  borderRadius: "13px",
  fontSize: "13px",
  fontWeight: "700",
  boxShadow: "0 8px 22px rgba(173,39,56,0.05)",
};

const checkoutLayoutStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 390px",
  gap: "22px",
  alignItems: "start",
};

const formStyle = {
  background: "rgba(255,255,255,0.94)",
  padding: "29px",
  border: "1px solid #e5e7ef",
  borderRadius: "23px",
  boxShadow: "0 18px 45px rgba(31,41,55,0.065)",
};

const sectionHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "13px",
  marginBottom: "18px",
};

const sectionNumberStyle = {
  width: "36px",
  height: "36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  borderRadius: "12px",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  color: "white",
  fontWeight: "900",
  fontSize: "13px",
  boxShadow: "0 9px 20px rgba(99,102,241,0.22)",
};

const sectionTitleStyle = {
  margin: 0,
  color: "#20283a",
  fontSize: "19px",
  letterSpacing: "-0.35px",
};

const sectionSubtitleStyle = {
  margin: "4px 0 0",
  color: "#8991a3",
  fontSize: "12px",
  lineHeight: 1.5,
};

const labelStyle = {
  display: "block",
  marginTop: "17px",
  marginBottom: "7px",
  color: "#30384b",
  fontSize: "12px",
  fontWeight: "800",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 14px",
  border: "1px solid #dfe3ec",
  borderRadius: "12px",
  outline: "none",
  fontSize: "13px",
  background: "#fbfcfe",
  color: "#20283a",
  transition: "all .2s ease",
};

const textareaStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 14px",
  border: "1px solid #dfe3ec",
  borderRadius: "12px",
  outline: "none",
  fontSize: "13px",
  resize: "vertical",
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  background: "#fbfcfe",
  color: "#20283a",
};

const twoColumnStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px",
};

const paymentOptionStyle = {
  position: "relative",
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  padding: "16px",
  marginTop: "11px",
  border: "1px solid #e1e4ec",
  borderRadius: "15px",
  background: "#fbfcfe",
  cursor: "pointer",
  transition: "all .2s ease",
};

const selectedPaymentStyle = {
  border: "1.5px solid #6366f1",
  background: "linear-gradient(135deg, #f5f3ff, #f8f7ff)",
  boxShadow: "0 9px 22px rgba(99,102,241,0.09)",
};

const paymentContentStyle = {
  flex: 1,
  minWidth: 0,
};

const paymentTitleRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  color: "#20283a",
  fontSize: "14px",
};

const paymentIconStyle = {
  width: "34px",
  height: "34px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  background: "white",
  border: "1px solid #e5e7ef",
  fontSize: "17px",
  boxShadow: "0 5px 12px rgba(31,41,55,0.05)",
};

const paymentDescriptionStyle = {
  display: "block",
  marginTop: "5px",
  color: "#7e8799",
  fontSize: "11px",
  lineHeight: "1.55",
};

const placeOrderButtonStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "15px",
  marginTop: "25px",
  border: "none",
  borderRadius: "13px",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  color: "white",
  fontSize: "14px",
  fontWeight: "900",
  cursor: "pointer",
  boxShadow: "0 13px 28px rgba(99,102,241,0.24)",
  transition: "all .2s ease",
};

const disabledOrderButtonStyle = {
  opacity: 0.62,
  cursor: "wait",
  boxShadow: "none",
};

const formSecurityStyle = {
  margin: "15px 0 0",
  textAlign: "center",
  color: "#949bab",
  fontSize: "10px",
  fontWeight: "600",
};

const summaryStyle = {
  background:
    "linear-gradient(150deg, #151b31 0%, #202747 62%, #31245e 100%)",
  color: "white",
  padding: "25px",
  borderRadius: "23px",
  border: "1px solid rgba(255,255,255,0.09)",
  boxShadow: "0 22px 48px rgba(15,23,42,0.18)",
  position: "sticky",
  top: "20px",
};

const summaryTitleStyle = {
  margin: 0,
  fontSize: "20px",
  letterSpacing: "-0.4px",
};

const summaryDividerStyle = {
  height: "1px",
  background: "rgba(255,255,255,0.12)",
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
  width: "59px",
  height: "59px",
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "rgba(255,255,255,0.09)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: "13px",
  overflow: "visible",
};

const summaryImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
  borderRadius: "12px",
};

const quantityBadgeStyle = {
  position: "absolute",
  top: "-7px",
  right: "-7px",
  minWidth: "21px",
  height: "21px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "0 4px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #818cf8, #a78bfa)",
  color: "white",
  fontSize: "9px",
  fontWeight: "900",
  border: "2px solid #202747",
};

const summaryProductStyle = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minWidth: 0,
  gap: "4px",
  fontSize: "12px",
};

const summaryQuantityStyle = {
  color: "rgba(255,255,255,0.55)",
  fontSize: "10px",
};

const summaryItemPriceStyle = {
  color: "white",
  fontSize: "13px",
  whiteSpace: "nowrap",
};

const summaryRowsStyle = {
  marginTop: "20px",
  paddingTop: "11px",
  borderTop: "1px solid rgba(255,255,255,0.10)",
};

const summaryRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  color: "rgba(255,255,255,0.62)",
  fontSize: "12px",
};

const freeShippingStyle = {
  color: "#86efac",
  fontWeight: "900",
};

const totalRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "12px",
  paddingTop: "18px",
  borderTop: "1px solid rgba(255,255,255,0.16)",
  fontSize: "16px",
};

const totalPriceStyle = {
  fontSize: "25px",
  color: "#c4b5fd",
  letterSpacing: "-0.5px",
};

const paymentSummaryStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  marginTop: "18px",
  padding: "13px",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  color: "rgba(255,255,255,0.58)",
  fontSize: "11px",
};

const emptyCardStyle = {
  width: "100%",
  maxWidth: "460px",
  padding: "48px 32px",
  textAlign: "center",
  background: "rgba(255,255,255,0.95)",
  border: "1px solid #e6e8ef",
  borderRadius: "24px",
  boxShadow: "0 22px 55px rgba(31,41,55,0.10)",
};

const emptyIconStyle = {
  width: "78px",
  height: "78px",
  margin: "0 auto 18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "25px",
  background: "linear-gradient(135deg, #eef2ff, #f3e8ff)",
  fontSize: "38px",
};

const emptyTextStyle = {
  color: "#7a8294",
  lineHeight: "1.65",
  fontSize: "13px",
};

const buttonStyle = {
  padding: "13px 23px",
  marginTop: "15px",
  border: "none",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  color: "white",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "800",
  boxShadow: "0 10px 22px rgba(99,102,241,0.20)",
};

const centerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  background:
    "radial-gradient(circle at 20% 10%, rgba(99,102,241,0.11), transparent 30%), #f6f7fb",
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const loadingCardStyle = {
  width: "100%",
  maxWidth: "430px",
  padding: "43px 30px",
  textAlign: "center",
  background: "rgba(255,255,255,0.95)",
  border: "1px solid #e6e8ef",
  borderRadius: "24px",
  boxShadow: "0 22px 55px rgba(31,41,55,0.09)",
};

const loadingIconStyle = {
  width: "72px",
  height: "72px",
  margin: "0 auto 18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "23px",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  fontSize: "34px",
  boxShadow: "0 14px 28px rgba(99,102,241,0.22)",
};

const loadingTextStyle = {
  color: "#7b8395",
  fontSize: "13px",
};

export default Checkout;
