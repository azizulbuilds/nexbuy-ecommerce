import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
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

    fetchProducts();
  }, []);

  // ==========================================
  // Get Unique Categories
  // ==========================================
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [products]);

  // ==========================================
  // Search, Filter and Sort
  // ==========================================
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    const searchText = search.trim().toLowerCase();

    if (searchText) {
      result = result.filter((product) => {
        return (
          product.name
            ?.toLowerCase()
            .includes(searchText) ||
          product.description
            ?.toLowerCase()
            .includes(searchText) ||
          product.category
            ?.toLowerCase()
            .includes(searchText)
        );
      });
    }

    // Category
    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    if (sortBy === "name-az") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sortBy === "name-za") {
      result.sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    }

    return result;
  }, [products, search, category, sortBy]);

  // ==========================================
  // Clear Filters
  // ==========================================
  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSortBy("default");
  };

  if (loading) {
    return (
      <div style={centerStyle}>
        <div style={loadingSpinnerStyle}>
          Loading products...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={centerStyle}>
        <div style={errorCardStyle}>
          <h2 style={errorTitleStyle}>
            Unable to load products
          </h2>

          <p style={errorTextStyle}>
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            style={buttonStyle}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <main style={mainStyle}>
        {/* ==========================================
            Page Header
        ========================================== */}
        <div style={pageHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>
              OUR STORE
            </p>

            <h1 style={titleStyle}>
              Explore Products
            </h1>

            <p style={subtitleStyle}>
              Find the right products for you.
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/profile")
            }
            style={profileButtonStyle}
          >
            My Profile
          </button>
        </div>

        {/* ==========================================
            Filters
        ========================================== */}
        <section style={filterSectionStyle}>
          <div style={searchWrapperStyle}>
            <span style={searchIconStyle}>
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search products..."
              style={searchInputStyle}
            />
          </div>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            style={selectStyle}
          >
            {categories.map(
              (categoryName) => (
                <option
                  key={categoryName}
                  value={categoryName}
                >
                  {categoryName === "All"
                    ? "All Categories"
                    : categoryName}
                </option>
              )
            )}
          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
            style={selectStyle}
          >
            <option value="default">
              Sort By
            </option>
            <option value="price-low">
              Price: Low to High
            </option>
            <option value="price-high">
              Price: High to Low
            </option>
            <option value="name-az">
              Name: A to Z
            </option>
            <option value="name-za">
              Name: Z to A
            </option>
          </select>

          {(search ||
            category !== "All" ||
            sortBy !== "default") && (
            <button
              onClick={clearFilters}
              style={clearButtonStyle}
            >
              Clear
            </button>
          )}
        </section>

        {/* ==========================================
            Result Information
        ========================================== */}
        <div style={resultBarStyle}>
          <span>
            Showing{" "}
            <strong>
              {filteredProducts.length}
            </strong>{" "}
            of{" "}
            <strong>{products.length}</strong>{" "}
            products
          </span>
        </div>

        {/* ==========================================
            Products
        ========================================== */}
        {filteredProducts.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={emptyIconStyle}>
              🔍
            </div>

            <h2>No products found</h2>

            <p style={emptyTextStyle}>
              Try changing your search or
              filters.
            </p>

            <button
              onClick={clearFilters}
              style={buttonStyle}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div>
            <div style={collectionIntroStyle}>
              <div>
                <span style={collectionBadgeStyle}>
                  ✦ CURATED FOR YOU
                </span>
                <h2 style={collectionTitleStyle}>
                  Discover something you'll love
                </h2>
              </div>
              <span style={collectionHintStyle}>
                Tap any product to explore its details
              </span>
            </div>

            <div style={gridStyle}>
            {filteredProducts.map(
              (product) => (
                <div
                  key={product._id}
                  style={cardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 45px rgba(15,23,42,0.13)";
                    e.currentTarget.style.borderColor =
                      "#c7d2fe";

                    const image =
                      e.currentTarget.querySelector("img");

                    if (image) {
                      image.style.transform =
                        "scale(1.06)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(15,23,42,0.07)";
                    e.currentTarget.style.borderColor =
                      "rgba(226,232,240,0.90)";

                    const image =
                      e.currentTarget.querySelector("img");

                    if (image) {
                      image.style.transform =
                        "scale(1)";
                    }
                  }}
                >
                  {/* Product Image */}
                  <div
                    style={
                      imageContainerStyle
                    }
                  >
                    {product.images &&
                    product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        style={imageStyle}
                      />
                    ) : (
                      <div
                        style={noImageStyle}
                      >
                        <span
                          style={
                            noImageIconStyle
                          }
                        >
                          📦
                        </span>
                        No Image
                      </div>
                    )}

                    {product.stock === 0 && (
                      <div
                        style={
                          outOfStockBadgeStyle
                        }
                      >
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* Product Content */}
                  <div
                    style={
                      cardContentStyle
                    }
                  >
                    <div
                      style={
                        categoryBadgeStyle
                      }
                    >
                      {product.category}
                    </div>

                    <h3
                      style={
                        productNameStyle
                      }
                    >
                      {product.name}
                    </h3>

                    <p
                      style={
                        descriptionStyle
                      }
                    >
                      {product.description}
                    </p>

                    <div
                      style={
                        bottomRowStyle
                      }
                    >
                      <strong
                        style={
                          priceStyle
                        }
                      >
                        ₹
                        {Number(
                          product.price
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      <span
                        style={{
                          ...stockStyle,
                          ...(product.stock ===
                          0
                            ? outOfStockTextStyle
                            : product.stock <=
                              5
                            ? lowStockTextStyle
                            : {}),
                        }}
                      >
                        {product.stock === 0
                          ? "Unavailable"
                          : product.stock <= 5
                          ? `Only ${product.stock} left`
                          : `${product.stock} in stock`}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/products/${product._id}`
                        )
                      }
                      style={{
                        ...buttonStyle,
                        ...(product.stock ===
                        0
                          ? disabledButtonStyle
                          : {}),
                      }}
                      disabled={
                        product.stock === 0
                      }
                    >
                      {product.stock === 0
                        ? "Out of Stock"
                        : "View Details →"}
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
          </div>
        )}
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
    "linear-gradient(180deg, #f8fafc 0%, #eef2ff 45%, #f8fafc 100%)",
  fontFamily:
    "Inter, Arial, sans-serif",
  color: "#0f172a",
};

const mainStyle = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "54px 24px 80px",
};

const pageHeaderStyle = {
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "24px",
  marginBottom: "30px",
  padding: "38px 40px",
  borderRadius: "24px",
  overflow: "hidden",
  flexWrap: "wrap",
  background:
    "linear-gradient(135deg, #0f172a 0%, #312e81 58%, #4f46e5 100%)",
  color: "white",
  boxShadow: "0 20px 55px rgba(30, 41, 59, 0.18)",
};

const eyebrowStyle = {
  margin: 0,
  fontSize: "11px",
  fontWeight: "800",
  letterSpacing: "2.5px",
  color: "#c7d2fe",
};

const titleStyle = {
  margin: "8px 0 8px",
  fontSize: "clamp(34px, 5vw, 52px)",
  lineHeight: "1.05",
  letterSpacing: "-2px",
  fontWeight: "800",
};

const subtitleStyle = {
  margin: 0,
  maxWidth: "620px",
  color: "#dbeafe",
  fontSize: "15px",
  lineHeight: "1.7",
};

const profileButtonStyle = {
  padding: "12px 19px",
  border: "1px solid rgba(255,255,255,0.22)",
  borderRadius: "12px",
  backgroundColor: "rgba(255,255,255,0.10)",
  color: "white",
  cursor: "pointer",
  fontWeight: "700",
  backdropFilter: "blur(10px)",
};

const filterSectionStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  padding: "14px",
  backgroundColor: "rgba(255,255,255,0.86)",
  border: "1px solid rgba(148,163,184,0.20)",
  borderRadius: "18px",
  boxShadow: "0 12px 35px rgba(15,23,42,0.08)",
  marginBottom: "22px",
  flexWrap: "wrap",
  backdropFilter: "blur(14px)",
};

const searchWrapperStyle = {
  position: "relative",
  flex: "1 1 280px",
  minWidth: "220px",
};

const searchIconStyle = {
  position: "absolute",
  left: "13px",
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "15px",
};

const searchInputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 14px 13px 42px",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  backgroundColor: "#f8fafc",
  color: "#0f172a",
  fontSize: "14px",
  outline: "none",
};

const selectStyle = {
  padding: "13px 14px",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  backgroundColor: "#f8fafc",
  color: "#334155",
  fontSize: "14px",
  cursor: "pointer",
  minWidth: "170px",
  outline: "none",
};

const clearButtonStyle = {
  padding: "13px 17px",
  border: "1px solid #cbd5e1",
  borderRadius: "12px",
  backgroundColor: "white",
  color: "#334155",
  cursor: "pointer",
  fontWeight: "700",
};

const resultBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "18px",
  padding: "0 4px",
  color: "#64748b",
  fontSize: "13px",
};

const collectionIntroStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "20px",
  margin: "10px 0 20px",
  flexWrap: "wrap",
};

const collectionBadgeStyle = {
  display: "inline-block",
  marginBottom: "8px",
  color: "#6366f1",
  fontSize: "10px",
  fontWeight: "900",
  letterSpacing: "1.8px",
};

const collectionTitleStyle = {
  margin: 0,
  color: "#0f172a",
  fontSize: "clamp(22px, 3vw, 30px)",
  lineHeight: "1.15",
  letterSpacing: "-0.8px",
};

const collectionHintStyle = {
  color: "#64748b",
  fontSize: "12px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fill, minmax(270px, 1fr))",
  gap: "26px",
};

const cardStyle = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  backgroundColor: "rgba(255,255,255,0.96)",
  border: "1px solid rgba(226,232,240,0.90)",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 8px 25px rgba(15,23,42,0.07)",
  transition:
    "transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease",
};

const imageContainerStyle = {
  position: "relative",
  width: "100%",
  height: "260px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  background:
    "linear-gradient(145deg, #f8fafc 0%, #eef2ff 55%, #e0e7ff 100%)",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  padding: "20px",
  boxSizing: "border-box",
  objectFit: "contain",
  transition: "transform 0.4s ease",
};

const noImageStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "#64748b",
  gap: "8px",
};

const noImageIconStyle = {
  fontSize: "35px",
};

const outOfStockBadgeStyle = {
  position: "absolute",
  top: "14px",
  right: "14px",
  padding: "7px 11px",
  backgroundColor: "#0f172a",
  color: "white",
  borderRadius: "999px",
  fontSize: "10px",
  fontWeight: "800",
  boxShadow: "0 6px 15px rgba(15,23,42,0.18)",
};

const cardContentStyle = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 0,
  padding: "21px",
};

const categoryBadgeStyle = {
  display: "inline-block",
  padding: "6px 10px",
  backgroundColor: "#eef2ff",
  border: "1px solid #e0e7ff",
  borderRadius: "999px",
  fontSize: "10px",
  fontWeight: "800",
  color: "#4f46e5",
  marginBottom: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.7px",
};

const productNameStyle = {
  margin: "0 0 8px",
  color: "#0f172a",
  fontSize: "19px",
  lineHeight: "1.3",
  letterSpacing: "-0.3px",
};

const descriptionStyle = {
  color: "#64748b",
  fontSize: "13px",
  lineHeight: "1.6",
  minHeight: "63px",
  margin: "0",
};

const bottomRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  marginTop: "18px",
};

const priceStyle = {
  color: "#111827",
  fontSize: "22px",
  letterSpacing: "-0.5px",
};

const stockStyle = {
  padding: "5px 8px",
  borderRadius: "8px",
  backgroundColor: "#ecfdf5",
  color: "#059669",
  fontSize: "10px",
  fontWeight: "700",
  textAlign: "right",
};

const lowStockTextStyle = {
  fontWeight: "800",
  backgroundColor: "#fff7ed",
  color: "#ea580c",
};

const outOfStockTextStyle = {
  fontWeight: "800",
  backgroundColor: "#fef2f2",
  color: "#dc2626",
};

const buttonStyle = {
  width: "100%",
  padding: "13px",
  marginTop: "auto",
  border: "none",
  borderRadius: "11px",
  background:
    "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "white",
  fontSize: "13px",
  fontWeight: "800",
  cursor: "pointer",
  boxShadow: "0 8px 18px rgba(79,70,229,0.22)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const disabledButtonStyle = {
  backgroundColor: "#999",
  cursor: "not-allowed",
};

const centerStyle = {
  minHeight: "70vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily:
    "Inter, Arial, sans-serif",
};

const loadingSpinnerStyle = {
  fontSize: "18px",
  color: "#555",
};

const errorCardStyle = {
  textAlign: "center",
  padding: "40px",
  backgroundColor: "white",
  borderRadius: "12px",
  boxShadow:
    "0 4px 15px rgba(0,0,0,0.08)",
};

const errorTitleStyle = {
  marginTop: 0,
};

const errorTextStyle = {
  color: "#666",
  marginBottom: "20px",
};

const emptyStateStyle = {
  textAlign: "center",
  padding: "80px 20px",
  backgroundColor: "white",
  borderRadius: "12px",
};

const emptyIconStyle = {
  fontSize: "40px",
};

const emptyTextStyle = {
  color: "#666",
  marginBottom: "20px",
};

export default Products;