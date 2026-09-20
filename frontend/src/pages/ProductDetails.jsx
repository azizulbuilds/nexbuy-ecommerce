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
  backgroundColor: "#f7f7f7",
  fontFamily:
    "Inter, Arial, sans-serif",
};

const mainStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "35px 24px 60px",
};

const backButtonStyle = {
  padding: "10px 16px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "white",
  color: "#333",
  cursor: "pointer",
  fontSize: "14px",
  marginBottom: "25px",
};

const productContainerStyle = {
  display: "grid",
  gridTemplateColumns:
    "minmax(0, 1.05fr) minmax(0, 0.95fr)",
  gap: "55px",
  padding: "35px",
  backgroundColor: "white",
  borderRadius: "16px",
  boxShadow:
    "0 5px 25px rgba(0,0,0,0.07)",
};

const imageSectionStyle = {
  position: "relative",
  width: "100%",
  height: "500px",
  backgroundColor: "#f3f3f3",
  borderRadius: "12px",
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
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "#888",
  gap: "12px",
};

const noImageIconStyle = {
  fontSize: "50px",
};

const outOfStockBadgeStyle = {
  position: "absolute",
  top: "18px",
  left: "18px",
  padding: "8px 13px",
  backgroundColor: "#222",
  color: "white",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.5px",
};

const detailsSectionStyle = {
  padding: "5px 0",
};

const categoryBadgeStyle = {
  display: "inline-block",
  padding: "6px 11px",
  backgroundColor: "#f0f0f0",
  borderRadius: "20px",
  color: "#555",
  fontSize: "12px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const nameStyle = {
  fontSize: "40px",
  lineHeight: "1.15",
  margin: "15px 0 10px",
};

const ratingStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
};

const reviewStyle = {
  color: "#777",
};

const dividerStyle = {
  height: "1px",
  backgroundColor: "#eee",
  margin: "22px 0",
};

const descriptionStyle = {
  color: "#555",
  lineHeight: "1.75",
  fontSize: "16px",
  margin: 0,
};

const priceContainerStyle = {
  marginTop: "25px",
};

const priceStyle = {
  fontSize: "34px",
  fontWeight: "700",
};

const stockBoxStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "18px",
  padding: "12px 14px",
  borderRadius: "8px",
  backgroundColor: "#f3f3f3",
  color: "#333",
  fontSize: "13px",
  fontWeight: "600",
};

const outOfStockBoxStyle = {
  backgroundColor: "#eeeeee",
};

const quantitySectionStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  marginTop: "25px",
  flexWrap: "wrap",
};

const quantityLabelStyle = {
  fontWeight: "700",
  fontSize: "14px",
};

const quantityControlsStyle = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #ddd",
  borderRadius: "8px",
  overflow: "hidden",
};

const quantityButtonStyle = {
  width: "42px",
  height: "42px",
  border: "none",
  backgroundColor: "#f5f5f5",
  fontSize: "20px",
  cursor: "pointer",
};

const disabledQuantityButtonStyle = {
  color: "#aaa",
  cursor: "not-allowed",
};

const quantityStyle = {
  width: "48px",
  textAlign: "center",
  fontSize: "16px",
  fontWeight: "600",
};

const quantityHintStyle = {
  color: "#888",
  fontSize: "12px",
};

const addToCartButtonStyle = {
  width: "100%",
  padding: "15px",
  marginTop: "22px",
  border: "none",
  borderRadius: "9px",
  backgroundColor: "#222",
  color: "white",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
};

const loadingButtonStyle = {
  opacity: 0.7,
  cursor: "wait",
};

const outOfStockButtonStyle = {
  width: "100%",
  padding: "15px",
  marginTop: "22px",
  border: "none",
  borderRadius: "9px",
  backgroundColor: "#999",
  color: "white",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "not-allowed",
};

const successMessageStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  marginTop: "15px",
  padding: "12px 14px",
  backgroundColor: "#f0f7f2",
  color: "#287a43",
  borderRadius: "8px",
  fontSize: "13px",
  flexWrap: "wrap",
};

const viewCartButtonStyle = {
  border: "none",
  backgroundColor: "transparent",
  color: "#222",
  fontWeight: "700",
  cursor: "pointer",
};

const cartErrorStyle = {
  marginTop: "15px",
  padding: "12px 14px",
  backgroundColor: "#f5eeee",
  color: "#9b3030",
  borderRadius: "8px",
  fontSize: "13px",
};

const infoSectionStyle = {
  marginTop: "28px",
  borderTop: "1px solid #eee",
};

const infoRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  padding: "13px 0",
  borderBottom: "1px solid #eee",
  fontSize: "13px",
  color: "#666",
};

const productIdStyle = {
  maxWidth: "190px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: "#777",
};

const buttonStyle = {
  padding: "12px 20px",
  marginTop: "10px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#222",
  color: "white",
  cursor: "pointer",
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
  fontSize: "40px",
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
  fontSize: "40px",
};

const errorTextStyle = {
  color: "#666",
  lineHeight: "1.6",
};

export default ProductDetails;