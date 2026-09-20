import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/products/${id}`
        );

        setProduct(response.data.product);
      } catch (error) {
        console.error(
          "Fetch Product Error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ==========================================
  // Increase Quantity
  // ==========================================
  const increaseQuantity = () => {
    if (
      product &&
      quantity < product.stock
    ) {
      setQuantity((current) => current + 1);
    }
  };

  // ==========================================
  // Decrease Quantity
  // ==========================================
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((current) => current - 1);
    }
  };

  // ==========================================
  // Add Product to Cart
  // ==========================================
  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) {
      return;
    }

    if (quantity < 1) {
      setCartError(
        "Quantity must be at least 1."
      );
      return;
    }

    if (quantity > product.stock) {
      setCartError(
        "Selected quantity exceeds available stock."
      );
      return;
    }

    try {
      setAddingToCart(true);
      setCartMessage("");
      setCartError("");

      const response = await api.post(
        "/cart/add",
        {
          productId: product._id,
          quantity,
        }
      );

      setCartMessage(
        response.data.message ||
          "Product added to cart successfully."
      );
    } catch (error) {
      console.error(
        "Add To Cart Error:",
        error
      );

      setCartError(
        error.response?.data?.message ||
          "Unable to add product to cart."
      );
    } finally {
      setAddingToCart(false);
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

          <h2>Loading product...</h2>
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

          <h2>Unable to load product</h2>

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

  // ==========================================
  // Product Not Found
  // ==========================================
  if (!product) {
    return (
      <div style={centerStyle}>
        <div style={errorCardStyle}>
          <div style={errorIconStyle}>
            📦
          </div>

          <h2>Product not found</h2>

          <p style={errorTextStyle}>
            This product may have been removed.
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

  const isOutOfStock = product.stock === 0;

  return (
    <div style={pageStyle}>
      <main style={mainStyle}>
        {/* ==========================================
            Back Button
        ========================================== */}
        <button
          onClick={() =>
            navigate("/products")
          }
          style={backButtonStyle}
        >
          ← Back to Products
        </button>

        {/* ==========================================
            Product
        ========================================== */}
        <div style={productContainerStyle}>
          {/* ==========================================
              Image Section
          ========================================== */}
          <div style={imageSectionStyle}>
            {product.images &&
            product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                style={imageStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.055)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            ) : (
              <div style={noImageStyle}>
                <span
                  style={noImageIconStyle}
                >
                  📦
                </span>

                <span>
                  No Image Available
                </span>
              </div>
            )}

            {isOutOfStock && (
              <div
                style={outOfStockBadgeStyle}
              >
                OUT OF STOCK
              </div>
            )}
          </div>

          {/* ==========================================
              Details Section
          ========================================== */}
          <div style={detailsSectionStyle}>
            <span style={categoryBadgeStyle}>
              {product.category}
            </span>

            <h1 style={nameStyle}>
              {product.name}
            </h1>

            <div style={ratingStyle}>
              <span>
                ⭐ {product.ratings || 0}
              </span>

              <span style={reviewStyle}>
                ({product.numReviews || 0} reviews)
              </span>
            </div>

            <div style={dividerStyle} />

            <p style={descriptionStyle}>
              {product.description}
            </p>

            <div style={priceContainerStyle}>
              <span style={priceStyle}>
                ₹
                {Number(
                  product.price
                ).toLocaleString("en-IN")}
              </span>
            </div>

            <div
              style={{
                ...stockBoxStyle,
                ...(isOutOfStock
                  ? outOfStockBoxStyle
                  : {}),
              }}
            >
              <span>
                {isOutOfStock
                  ? "Currently unavailable"
                  : "✓ In Stock"}
              </span>

              {!isOutOfStock && (
                <span>
                  {product.stock} available
                </span>
              )}
            </div>

            {!isOutOfStock && (
              <>
                {/* ==========================================
                    Quantity
                ========================================== */}
                <div
                  style={
                    quantitySectionStyle
                  }
                >
                  <span
                    style={quantityLabelStyle}
                  >
                    Quantity
                  </span>

                  <div
                    style={
                      quantityControlsStyle
                    }
                  >
                    <button
                      onClick={
                        decreaseQuantity
                      }
                      disabled={quantity <= 1}
                      style={{
                        ...quantityButtonStyle,
                        ...(quantity <= 1
                          ? disabledQuantityButtonStyle
                          : {}),
                      }}
                    >
                      −
                    </button>

                    <span
                      style={quantityStyle}
                    >
                      {quantity}
                    </span>

                    <button
                      onClick={
                        increaseQuantity
                      }
                      disabled={
                        quantity >=
                        product.stock
                      }
                      style={{
                        ...quantityButtonStyle,
                        ...(quantity >=
                        product.stock
                          ? disabledQuantityButtonStyle
                          : {}),
                      }}
                    >
                      +
                    </button>
                  </div>

                  <span
                    style={quantityHintStyle}
                  >
                    Max {product.stock}
                  </span>
                </div>

                {/* ==========================================
                    Add to Cart
                ========================================== */}
                <button
                  onClick={
                    handleAddToCart
                  }
                  disabled={addingToCart}
                  style={{
                    ...addToCartButtonStyle,
                    ...(addingToCart
                      ? loadingButtonStyle
                      : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (!addingToCart) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 15px 32px rgba(79,70,229,0.30)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 11px 26px rgba(79,70,229,0.23)";
                  }}
                >
                  {addingToCart
                    ? "Adding to Cart..."
                    : "🛒 Add to Cart"}
                </button>

                {cartMessage && (
                  <div
                    style={
                      successMessageStyle
                    }
                  >
                    ✓ {cartMessage}

                    <button
                      onClick={() =>
                        navigate("/cart")
                      }
                      style={
                        viewCartButtonStyle
                      }
                    >
                      View Cart →
                    </button>
                  </div>
                )}

                {cartError && (
                  <div
                    style={cartErrorStyle}
                  >
                    ⚠️ {cartError}
                  </div>
                )}
              </>
            )}

            {isOutOfStock && (
              <button
                disabled
                style={
                  outOfStockButtonStyle
                }
              >
                Out of Stock
              </button>
            )}

            {/* ==========================================
                Product Information
            ========================================== */}
            <div style={infoSectionStyle}>
              <div style={infoRowStyle}>
                <span>Category</span>
                <strong>
                  {product.category}
                </strong>
              </div>

              <div style={infoRowStyle}>
                <span>Availability</span>
                <strong>
                  {isOutOfStock
                    ? "Out of Stock"
                    : "In Stock"}
                </strong>
              </div>

              <div style={infoRowStyle}>
                <span>Product ID</span>
                <span
                  style={
                    productIdStyle
                  }
                >
                  {product._id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// Styles
// ==========================================

const pageStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, rgba(99,102,241,0.11), transparent 28%), linear-gradient(180deg, #f8faff 0%, #f7f8fc 55%, #ffffff 100%)",
  fontFamily: "Inter, Arial, sans-serif",
  color: "#0f172a",
};

const mainStyle = {
  maxWidth: "1240px",
  margin: "0 auto",
  padding: "34px 24px 70px",
};

const backButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  padding: "10px 15px",
  border: "1px solid #e2e8f0",
  borderRadius: "999px",
  backgroundColor: "rgba(255,255,255,0.88)",
  color: "#475569",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "750",
  marginBottom: "20px",
  boxShadow: "0 5px 18px rgba(15,23,42,0.05)",
};

const productContainerStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.05fr) minmax(390px, 0.95fr)",
  gap: "46px",
  padding: "28px",
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,255,0.97))",
  border: "1px solid #e2e8f0",
  borderRadius: "26px",
  boxShadow: "0 20px 60px rgba(15,23,42,0.09)",
};

const imageSectionStyle = {
  position: "relative",
  width: "100%",
  height: "560px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "radial-gradient(circle at center, #ffffff 0%, #eef2ff 72%, #e0e7ff 100%)",
  border: "1px solid #e0e7ff",
  borderRadius: "22px",
  overflow: "hidden",
  boxShadow: "inset 0 0 45px rgba(99,102,241,0.06)",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
  padding: "24px",
  boxSizing: "border-box",
  transition: "transform 0.35s ease",
};

const noImageStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "#94a3b8",
  gap: "12px",
  fontSize: "13px",
};

const noImageIconStyle = {
  fontSize: "58px",
};

const outOfStockBadgeStyle = {
  position: "absolute",
  top: "18px",
  left: "18px",
  zIndex: 2,
  padding: "8px 12px",
  backgroundColor: "#0f172a",
  color: "white",
  borderRadius: "999px",
  fontSize: "10px",
  fontWeight: "850",
  letterSpacing: "0.6px",
  boxShadow: "0 8px 20px rgba(15,23,42,0.18)",
};

const detailsSectionStyle = {
  padding: "8px 4px",
};

const categoryBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "7px 11px",
  backgroundColor: "#eef2ff",
  border: "1px solid #e0e7ff",
  borderRadius: "999px",
  color: "#4f46e5",
  fontSize: "10px",
  fontWeight: "850",
  textTransform: "uppercase",
  letterSpacing: "0.7px",
};

const nameStyle = {
  fontSize: "clamp(32px, 4vw, 46px)",
  lineHeight: "1.08",
  margin: "17px 0 11px",
  color: "#0f172a",
  fontWeight: "900",
  letterSpacing: "-1.5px",
};

const ratingStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "7px 10px",
  borderRadius: "999px",
  backgroundColor: "#fffbeb",
  border: "1px solid #fde68a",
  color: "#a16207",
  fontSize: "12px",
  fontWeight: "750",
};

const reviewStyle = {
  color: "#64748b",
  fontWeight: "600",
};

const dividerStyle = {
  height: "1px",
  background:
    "linear-gradient(90deg, #e2e8f0, #c7d2fe, transparent)",
  margin: "23px 0",
};

const descriptionStyle = {
  color: "#64748b",
  lineHeight: "1.8",
  fontSize: "15px",
  margin: 0,
};

const priceContainerStyle = {
  marginTop: "25px",
  display: "flex",
  alignItems: "baseline",
  gap: "8px",
};

const priceStyle = {
  fontSize: "38px",
  fontWeight: "900",
  color: "#4f46e5",
  letterSpacing: "-1px",
};

const stockBoxStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  marginTop: "18px",
  padding: "13px 15px",
  borderRadius: "13px",
  backgroundColor: "#ecfdf5",
  border: "1px solid #bbf7d0",
  color: "#15803d",
  fontSize: "12px",
  fontWeight: "750",
};

const outOfStockBoxStyle = {
  backgroundColor: "#fff1f2",
  borderColor: "#fecdd3",
  color: "#be123c",
};

const quantitySectionStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  marginTop: "24px",
  flexWrap: "wrap",
};

const quantityLabelStyle = {
  fontWeight: "800",
  fontSize: "13px",
  color: "#334155",
};

const quantityControlsStyle = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #dbe2ea",
  borderRadius: "12px",
  overflow: "hidden",
  backgroundColor: "white",
  boxShadow: "0 4px 12px rgba(15,23,42,0.05)",
};

const quantityButtonStyle = {
  width: "43px",
  height: "43px",
  border: "none",
  backgroundColor: "#f8fafc",
  color: "#334155",
  fontSize: "20px",
  fontWeight: "700",
  cursor: "pointer",
};

const disabledQuantityButtonStyle = {
  color: "#cbd5e1",
  cursor: "not-allowed",
};

const quantityStyle = {
  width: "48px",
  textAlign: "center",
  fontSize: "15px",
  fontWeight: "850",
  color: "#0f172a",
};

const quantityHintStyle = {
  color: "#94a3b8",
  fontSize: "11px",
  fontWeight: "650",
};

const addToCartButtonStyle = {
  width: "100%",
  padding: "16px",
  marginTop: "21px",
  border: "none",
  borderRadius: "13px",
  background:
    "linear-gradient(135deg, #2563eb 0%, #4f46e5 48%, #7c3aed 100%)",
  color: "white",
  fontSize: "15px",
  fontWeight: "850",
  cursor: "pointer",
  boxShadow: "0 11px 26px rgba(79,70,229,0.23)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const loadingButtonStyle = {
  opacity: 0.7,
  cursor: "wait",
};

const outOfStockButtonStyle = {
  width: "100%",
  padding: "16px",
  marginTop: "21px",
  border: "none",
  borderRadius: "13px",
  backgroundColor: "#94a3b8",
  color: "white",
  fontSize: "15px",
  fontWeight: "800",
  cursor: "not-allowed",
};

const successMessageStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  marginTop: "14px",
  padding: "13px 14px",
  backgroundColor: "#ecfdf5",
  color: "#15803d",
  border: "1px solid #bbf7d0",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "700",
  flexWrap: "wrap",
};

const viewCartButtonStyle = {
  border: "none",
  backgroundColor: "transparent",
  color: "#4f46e5",
  fontWeight: "850",
  cursor: "pointer",
  fontSize: "12px",
};

const cartErrorStyle = {
  marginTop: "14px",
  padding: "13px 14px",
  backgroundColor: "#fff1f2",
  color: "#be123c",
  border: "1px solid #fecdd3",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "650",
};

const infoSectionStyle = {
  marginTop: "25px",
  padding: "18px 0 0",
  borderTop: "1px solid #e2e8f0",
};

const infoRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  padding: "13px 0",
  borderBottom: "1px solid #eef2f7",
  fontSize: "12px",
  color: "#94a3b8",
};

const productIdStyle = {
  maxWidth: "190px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: "#64748b",
  fontSize: "11px",
};

const buttonStyle = {
  padding: "12px 20px",
  marginTop: "10px",
  border: "none",
  borderRadius: "11px",
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "white",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "750",
  boxShadow: "0 8px 20px rgba(79,70,229,0.20)",
};

const centerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  fontFamily: "Inter, Arial, sans-serif",
  background:
    "radial-gradient(circle at top, rgba(99,102,241,0.12), transparent 35%), #f8fafc",
};

const loadingCardStyle = {
  textAlign: "center",
  padding: "45px",
  backgroundColor: "white",
  border: "1px solid #e0e7ff",
  borderRadius: "22px",
  boxShadow: "0 15px 45px rgba(15,23,42,0.08)",
};

const loadingIconStyle = {
  fontSize: "48px",
};

const errorCardStyle = {
  maxWidth: "450px",
  textAlign: "center",
  padding: "45px",
  background:
    "linear-gradient(145deg, #ffffff, #f8faff)",
  border: "1px solid #e0e7ff",
  borderRadius: "22px",
  boxShadow: "0 18px 50px rgba(15,23,42,0.09)",
};

const errorIconStyle = {
  fontSize: "44px",
};

const errorTextStyle = {
  color: "#64748b",
  lineHeight: "1.65",
  fontSize: "13px",
};
export default ProductDetails;
