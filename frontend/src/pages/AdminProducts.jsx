import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function AdminProducts() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products");

      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Fetch Products Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.role === "admin") {
      fetchProducts();
    }
  }, [authLoading, user]);

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(productId);
      setError("");

      await api.delete(`/products/${productId}`);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product._id !== productId
        )
      );
    } catch (error) {
      console.error("Delete Product Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading) {
    return (
      <div style={pageStyle}>
        <div style={stateCardStyle}>
          <div style={spinnerStyle} />
          <h2 style={stateTitleStyle}>Loading admin panel</h2>
          <p style={stateTextStyle}>
            Checking your administrator access...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={pageStyle}>
        <div style={stateCardStyle}>
          <div style={stateIconStyle}>🔐</div>
          <span style={eyebrowStyle}>SECURE AREA</span>
          <h2 style={stateTitleStyle}>Login required</h2>
          <p style={stateTextStyle}>
            Please sign in to access product management.
          </p>

          <button
            onClick={() => navigate("/login")}
            style={primaryButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 14px 30px rgba(99, 102, 241, 0.28)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 22px rgba(99, 102, 241, 0.18)";
            }}
          >
            Go to Login →
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div style={pageStyle}>
        <div style={stateCardStyle}>
          <div style={stateIconStyle}>⛔</div>
          <span style={eyebrowStyle}>RESTRICTED</span>
          <h1 style={stateTitleStyle}>Access Denied</h1>
          <p style={stateTextStyle}>
            Only administrators can manage products.
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

  const totalProducts = products.length;
  const lowStockProducts = products.filter(
    (product) => Number(product.stock) > 0 && Number(product.stock) <= 5
  ).length;
  const outOfStockProducts = products.filter(
    (product) => Number(product.stock) <= 0
  ).length;

  return (
    <div style={pageStyle}>
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
                Product
                <span style={gradientTextStyle}> Management</span>
              </h1>

              <p style={heroSubtitleStyle}>
                Manage your catalog, inventory and product listings
                from one polished workspace.
              </p>
            </div>

            <div style={heroActionsStyle}>
              <button
                onClick={() => navigate("/admin")}
                style={ghostButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.14)";
                  e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.18)";
                }}
              >
                ← Dashboard
              </button>

              <button
                onClick={() => navigate("/admin/products/new")}
                style={heroPrimaryButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 14px 32px rgba(129, 140, 248, 0.32)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(129, 140, 248, 0.22)";
                }}
              >
                <span style={plusIconStyle}>+</span>
                Add Product
              </button>
            </div>
          </div>
        </section>

        <section style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={{ ...statIconStyle, background: "#eef2ff", color: "#4f46e5" }}>
              ◈
            </div>
            <div>
              <span style={statLabelStyle}>Total Products</span>
              <strong style={statValueStyle}>{totalProducts}</strong>
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={{ ...statIconStyle, background: "#fff7ed", color: "#ea580c" }}>
              ⚠
            </div>
            <div>
              <span style={statLabelStyle}>Low Stock</span>
              <strong style={statValueStyle}>{lowStockProducts}</strong>
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={{ ...statIconStyle, background: "#fef2f2", color: "#dc2626" }}>
              !
            </div>
            <div>
              <span style={statLabelStyle}>Out of Stock</span>
              <strong style={statValueStyle}>{outOfStockProducts}</strong>
            </div>
          </div>
        </section>

        {error && (
          <div style={errorStyle}>
            <span style={errorIconStyle}>!</span>
            <div>
              <strong style={{ display: "block", marginBottom: "3px" }}>
                Something went wrong
              </strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        <section style={catalogHeaderStyle}>
          <div>
            <span style={sectionEyebrowStyle}>CATALOG</span>
            <h2 style={sectionTitleStyle}>Your Products</h2>
            <p style={sectionSubtitleStyle}>
              {products.length > 0
                ? `${products.length} product${products.length === 1 ? "" : "s"} in your store`
                : "Your product catalog is waiting for its first item"}
            </p>
          </div>

          {products.length > 0 && (
            <button
              onClick={fetchProducts}
              style={refreshButtonStyle}
              title="Refresh products"
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
          )}
        </section>

        {loading ? (
          <div style={loadingGridStyle}>
            {[1, 2, 3].map((item) => (
              <div key={item} style={skeletonCardStyle}>
                <div style={skeletonImageStyle} />
                <div style={skeletonLineWideStyle} />
                <div style={skeletonLineStyle} />
                <div style={skeletonLineShortStyle} />
                <div style={skeletonButtonsStyle} />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={emptyCardStyle}>
            <div style={emptyIllustrationStyle}>
              <span>📦</span>
            </div>
            <span style={eyebrowStyle}>EMPTY CATALOG</span>
            <h2 style={emptyTitleStyle}>No products found</h2>
            <p style={stateTextStyle}>
              Add your first product and start building your Nexbuy catalog.
            </p>

            <button
              onClick={() => navigate("/admin/products/new")}
              style={primaryButtonStyle}
            >
              + Add Your First Product
            </button>
          </div>
        ) : (
          <div style={gridStyle}>
            {products.map((product) => {
              const stock = Number(product.stock) || 0;
              const isOutOfStock = stock <= 0;
              const isLowStock = stock > 0 && stock <= 5;

              return (
                <article
                  key={product._id}
                  style={productCardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-7px)";
                    e.currentTarget.style.boxShadow =
                      "0 22px 55px rgba(15, 23, 42, 0.13)";
                    const image = e.currentTarget.querySelector(
                      "[data-product-image]"
                    );
                    if (image) {
                      image.style.transform = "scale(1.06)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 32px rgba(15, 23, 42, 0.07)";
                    const image = e.currentTarget.querySelector(
                      "[data-product-image]"
                    );
                    if (image) {
                      image.style.transform = "scale(1)";
                    }
                  }}
                >
                  <div style={imageWrapperStyle}>
                    {product.images && product.images.length > 0 ? (
                      <img
                        data-product-image
                        src={product.images[0]}
                        alt={product.name}
                        style={imageStyle}
                      />
                    ) : (
                      <div style={placeholderStyle}>
                        <span style={{ fontSize: "64px" }}>📦</span>
                        <span style={placeholderTextStyle}>
                          No image
                        </span>
                      </div>
                    )}

                    <div style={imageOverlayStyle} />

                    <span
                      style={{
                        ...stockBadgeStyle,
                        ...(isOutOfStock
                          ? outOfStockBadgeStyle
                          : isLowStock
                          ? lowStockBadgeStyle
                          : inStockBadgeStyle),
                      }}
                    >
                      <span style={stockDotStyle} />
                      {isOutOfStock
                        ? "Out of stock"
                        : isLowStock
                        ? "Low stock"
                        : "In stock"}
                    </span>

                    <span style={categoryBadgeStyle}>
                      {product.category || "General"}
                    </span>
                  </div>

                  <div style={productInfoStyle}>
                    <div style={productTopRowStyle}>
                      <span style={productLabelStyle}>PRODUCT</span>
                      <span style={stockCountStyle}>
                        {stock} units
                      </span>
                    </div>

                    <h2 style={productNameStyle}>
                      {product.name}
                    </h2>

                    <p style={descriptionStyle}>
                      {product.description || "No description available."}
                    </p>

                    <div style={detailsStyle}>
                      <div>
                        <span style={priceLabelStyle}>PRICE</span>
                        <strong style={priceStyle}>
                          ₹{Number(product.price || 0).toLocaleString("en-IN")}
                        </strong>
                      </div>

                      <div style={inventoryMiniStyle}>
                        <span style={priceLabelStyle}>INVENTORY</span>
                        <strong
                          style={{
                            ...inventoryValueStyle,
                            color: isOutOfStock
                              ? "#dc2626"
                              : isLowStock
                              ? "#ea580c"
                              : "#0f766e",
                          }}
                        >
                          {stock}
                        </strong>
                      </div>
                    </div>

                    <div style={actionsStyle}>
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/products/edit/${product._id}`
                          )
                        }
                        style={editButtonStyle}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#eef2ff";
                          e.currentTarget.style.borderColor = "#c7d2fe";
                          e.currentTarget.style.color = "#4338ca";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#f8fafc";
                          e.currentTarget.style.borderColor = "#e2e8f0";
                          e.currentTarget.style.color = "#334155";
                        }}
                      >
                        <span>✏️</span>
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={deletingId === product._id}
                        style={{
                          ...deleteButtonStyle,
                          opacity:
                            deletingId === product._id ? 0.65 : 1,
                          cursor:
                            deletingId === product._id
                              ? "not-allowed"
                              : "pointer",
                        }}
                        onMouseEnter={(e) => {
                          if (deletingId !== product._id) {
                            e.currentTarget.style.background = "#fee2e2";
                            e.currentTarget.style.borderColor = "#fecaca";
                            e.currentTarget.style.color = "#b91c1c";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#fff7f7";
                          e.currentTarget.style.borderColor = "#fee2e2";
                          e.currentTarget.style.color = "#dc2626";
                        }}
                      >
                        <span>🗑️</span>
                        {deletingId === product._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: "34px 20px 70px",
  boxSizing: "border-box",
  background:
    "radial-gradient(circle at 15% 0%, rgba(99, 102, 241, 0.08), transparent 28%), radial-gradient(circle at 90% 20%, rgba(168, 85, 247, 0.07), transparent 26%), #f7f8fc",
  color: "#0f172a",
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  position: "relative",
  overflow: "hidden",
};

const ambientOrbOneStyle = {
  position: "fixed",
  width: "260px",
  height: "260px",
  borderRadius: "50%",
  background: "rgba(99, 102, 241, 0.07)",
  filter: "blur(70px)",
  top: "10%",
  left: "-150px",
  pointerEvents: "none",
};

const ambientOrbTwoStyle = {
  position: "fixed",
  width: "300px",
  height: "300px",
  borderRadius: "50%",
  background: "rgba(168, 85, 247, 0.06)",
  filter: "blur(80px)",
  bottom: "-160px",
  right: "-100px",
  pointerEvents: "none",
};

const containerStyle = {
  maxWidth: "1240px",
  margin: "0 auto",
  position: "relative",
  zIndex: 1,
};

const heroStyle = {
  position: "relative",
  overflow: "hidden",
  borderRadius: "28px",
  marginBottom: "22px",
  background:
    "linear-gradient(135deg, #111827 0%, #1e1b4b 48%, #312e81 100%)",
  boxShadow: "0 22px 55px rgba(30, 27, 75, 0.22)",
};

const heroGlowStyle = {
  position: "absolute",
  width: "330px",
  height: "330px",
  borderRadius: "50%",
  background: "rgba(129, 140, 248, 0.18)",
  filter: "blur(8px)",
  top: "-210px",
  right: "8%",
};

const heroContentStyle = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "30px",
  padding: "38px 40px",
  flexWrap: "wrap",
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
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "1.5px",
};

const liveDotStyle = {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  background: "#a5b4fc",
  boxShadow: "0 0 0 5px rgba(165,180,252,0.10)",
};

const heroTitleStyle = {
  margin: "16px 0 8px",
  color: "#ffffff",
  fontSize: "clamp(32px, 5vw, 48px)",
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
  maxWidth: "660px",
  margin: 0,
  color: "#cbd5e1",
  fontSize: "15px",
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
  fontSize: "13px",
  fontWeight: 750,
  transition: "all 0.2s ease",
};

const heroPrimaryButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 18px",
  border: "1px solid rgba(199,210,254,0.35)",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #6366f1, #7c3aed)",
  color: "#ffffff",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 800,
  boxShadow: "0 8px 24px rgba(129, 140, 248, 0.22)",
  transition: "all 0.2s ease",
};

const plusIconStyle = {
  fontSize: "19px",
  lineHeight: 1,
  fontWeight: 400,
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
  marginBottom: "28px",
};

const statCardStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "17px",
  border: "1px solid #e8eaf1",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.88)",
  boxShadow: "0 8px 28px rgba(15,23,42,0.045)",
  backdropFilter: "blur(10px)",
};

const statIconStyle = {
  width: "44px",
  height: "44px",
  borderRadius: "13px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  fontWeight: 900,
};

const statLabelStyle = {
  display: "block",
  color: "#64748b",
  fontSize: "11px",
  fontWeight: 750,
  textTransform: "uppercase",
  letterSpacing: "0.8px",
  marginBottom: "3px",
};

const statValueStyle = {
  fontSize: "25px",
  lineHeight: 1,
  color: "#0f172a",
};

const errorStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "25px",
  padding: "14px 16px",
  border: "1px solid #fecaca",
  borderRadius: "15px",
  background: "#fff7f7",
  color: "#991b1b",
  fontSize: "13px",
  lineHeight: 1.5,
};

const errorIconStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "23px",
  height: "23px",
  flex: "0 0 23px",
  borderRadius: "50%",
  background: "#fee2e2",
  color: "#dc2626",
  fontWeight: 900,
};

const catalogHeaderStyle = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  gap: "20px",
  marginBottom: "17px",
};

const sectionEyebrowStyle = {
  color: "#6366f1",
  fontSize: "10px",
  fontWeight: 850,
  letterSpacing: "1.8px",
};

const sectionTitleStyle = {
  margin: "4px 0 3px",
  fontSize: "27px",
  letterSpacing: "-0.8px",
};

const sectionSubtitleStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "13px",
};

const refreshButtonStyle = {
  padding: "9px 13px",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  background: "#ffffff",
  color: "#475569",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 750,
  transition: "all 0.2s ease",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "20px",
};

const productCardStyle = {
  overflow: "hidden",
  border: "1px solid #e8eaf1",
  borderRadius: "22px",
  background: "#ffffff",
  boxShadow: "0 10px 32px rgba(15, 23, 42, 0.07)",
  transition:
    "transform 0.25s ease, box-shadow 0.25s ease",
};

const imageWrapperStyle = {
  height: "235px",
  position: "relative",
  overflow: "hidden",
  background:
    "linear-gradient(145deg, #f8fafc, #eef2ff)",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
  display: "block",
  padding: "15px",
  boxSizing: "border-box",
  transition: "transform 0.35s ease",
};

const imageOverlayStyle = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  background:
    "linear-gradient(180deg, rgba(15,23,42,0.04), transparent 48%, rgba(15,23,42,0.10))",
};

const stockBadgeStyle = {
  position: "absolute",
  top: "13px",
  left: "13px",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 9px",
  borderRadius: "999px",
  fontSize: "10px",
  fontWeight: 800,
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.7)",
};

const stockDotStyle = {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  background: "currentColor",
};

const inStockBadgeStyle = {
  color: "#047857",
  background: "rgba(236,253,245,0.92)",
};

const lowStockBadgeStyle = {
  color: "#c2410c",
  background: "rgba(255,247,237,0.94)",
};

const outOfStockBadgeStyle = {
  color: "#b91c1c",
  background: "rgba(254,242,242,0.94)",
};

const categoryBadgeStyle = {
  position: "absolute",
  right: "13px",
  bottom: "13px",
  maxWidth: "55%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  padding: "6px 9px",
  borderRadius: "8px",
  background: "rgba(15,23,42,0.78)",
  color: "#ffffff",
  fontSize: "10px",
  fontWeight: 750,
  backdropFilter: "blur(8px)",
};

const placeholderStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
  color: "#94a3b8",
};

const placeholderTextStyle = {
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const productInfoStyle = {
  padding: "19px",
};

const productTopRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
};

const productLabelStyle = {
  color: "#94a3b8",
  fontSize: "9px",
  fontWeight: 850,
  letterSpacing: "1.5px",
};

const stockCountStyle = {
  color: "#64748b",
  fontSize: "11px",
  fontWeight: 650,
};

const productNameStyle = {
  margin: "7px 0 7px",
  fontSize: "20px",
  lineHeight: 1.2,
  letterSpacing: "-0.45px",
  color: "#0f172a",
};

const descriptionStyle = {
  color: "#64748b",
  fontSize: "12px",
  lineHeight: 1.6,
  minHeight: "39px",
  margin: 0,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const detailsStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "12px",
  marginTop: "17px",
  paddingTop: "15px",
  borderTop: "1px solid #f1f5f9",
};

const priceLabelStyle = {
  display: "block",
  color: "#94a3b8",
  fontSize: "8px",
  fontWeight: 850,
  letterSpacing: "1.3px",
  marginBottom: "3px",
};

const priceStyle = {
  display: "block",
  color: "#111827",
  fontSize: "23px",
  letterSpacing: "-0.7px",
};

const inventoryMiniStyle = {
  textAlign: "right",
};

const inventoryValueStyle = {
  display: "block",
  fontSize: "17px",
};

const actionsStyle = {
  display: "flex",
  gap: "9px",
  marginTop: "16px",
};

const editButtonStyle = {
  flex: 1,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
  padding: "10px",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  background: "#f8fafc",
  color: "#334155",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 800,
  transition: "all 0.2s ease",
};

const deleteButtonStyle = {
  flex: 1,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
  padding: "10px",
  border: "1px solid #fee2e2",
  borderRadius: "10px",
  background: "#fff7f7",
  color: "#dc2626",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 800,
  transition: "all 0.2s ease",
};

const primaryButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "12px 18px",
  border: "none",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "#ffffff",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 800,
  boxShadow: "0 8px 22px rgba(99, 102, 241, 0.18)",
  transition: "all 0.2s ease",
};

const stateCardStyle = {
  width: "min(100%, 520px)",
  margin: "10vh auto 0",
  boxSizing: "border-box",
  padding: "45px 30px",
  border: "1px solid #e8eaf1",
  borderRadius: "26px",
  background: "rgba(255,255,255,0.92)",
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
  margin: "8px 0 8px",
  fontSize: "25px",
  letterSpacing: "-0.6px",
};

const stateTextStyle = {
  maxWidth: "450px",
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
  animation: "nexbuySpin 0.8s linear infinite",
};

const loadingGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "20px",
};

const skeletonCardStyle = {
  overflow: "hidden",
  paddingBottom: "18px",
  border: "1px solid #e8eaf1",
  borderRadius: "22px",
  background: "#ffffff",
  boxShadow: "0 8px 25px rgba(15,23,42,0.04)",
};

const skeletonImageStyle = {
  height: "235px",
  background:
    "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
  backgroundSize: "200% 100%",
  animation: "nexbuyShimmer 1.4s infinite",
};

const skeletonLineWideStyle = {
  height: "18px",
  width: "62%",
  margin: "19px 19px 10px",
  borderRadius: "7px",
  background: "#eef2f7",
};

const skeletonLineStyle = {
  height: "10px",
  width: "86%",
  margin: "0 19px 8px",
  borderRadius: "7px",
  background: "#f1f5f9",
};

const skeletonLineShortStyle = {
  height: "10px",
  width: "48%",
  margin: "0 19px 16px",
  borderRadius: "7px",
  background: "#f1f5f9",
};

const skeletonButtonsStyle = {
  height: "36px",
  margin: "0 19px",
  borderRadius: "9px",
  background: "#f1f5f9",
};

const emptyCardStyle = {
  padding: "55px 25px",
  border: "1px solid #e8eaf1",
  borderRadius: "24px",
  background: "#ffffff",
  textAlign: "center",
  boxShadow: "0 10px 32px rgba(15,23,42,0.05)",
};

const emptyIllustrationStyle = {
  width: "92px",
  height: "92px",
  margin: "0 auto 17px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "28px",
  background:
    "linear-gradient(135deg, #eef2ff, #f5f3ff)",
  fontSize: "42px",
};

const emptyTitleStyle = {
  margin: "8px 0 7px",
  fontSize: "25px",
  letterSpacing: "-0.6px",
};

if (typeof document !== "undefined" && !document.getElementById("nexbuy-admin-products-styles")) {
  const style = document.createElement("style");
  style.id = "nexbuy-admin-products-styles";
  style.textContent = `
    @keyframes nexbuySpin {
      to { transform: rotate(360deg); }
    }

    @keyframes nexbuyShimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @media (max-width: 720px) {
      .nexbuy-admin-products-mobile {
        padding-left: 14px !important;
        padding-right: 14px !important;
      }
    }
  `;
  document.head.appendChild(style);
}

export default AdminProducts;
