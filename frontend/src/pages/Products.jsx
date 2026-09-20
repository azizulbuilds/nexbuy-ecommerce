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
          <div style={gridStyle}>
            {filteredProducts.map(
              (product) => (
                <div
                  key={product._id}
                  style={cardStyle}
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
  backgroundColor: "#f7f7f7",
  fontFamily:
    "Inter, Arial, sans-serif",
};

const mainStyle = {
  maxWidth: "1250px",
  margin: "0 auto",
  padding: "40px 24px 60px",
};

const pageHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "35px",
  flexWrap: "wrap",
};

const eyebrowStyle = {
  margin: 0,
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "2px",
  color: "#777",
};

const titleStyle = {
  margin: "8px 0 5px",
  fontSize: "36px",
  lineHeight: "1.15",
};

const subtitleStyle = {
  margin: 0,
  color: "#666",
  fontSize: "16px",
};

const profileButtonStyle = {
  padding: "11px 18px",
  border: "1px solid #222",
  borderRadius: "8px",
  backgroundColor: "#222",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
};

const filterSectionStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  padding: "18px",
  backgroundColor: "white",
  borderRadius: "12px",
  boxShadow:
    "0 3px 15px rgba(0,0,0,0.06)",
  marginBottom: "20px",
  flexWrap: "wrap",
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
  padding: "12px 14px 12px 40px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
};

const selectStyle = {
  padding: "12px 14px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "white",
  fontSize: "14px",
  cursor: "pointer",
  minWidth: "160px",
};

const clearButtonStyle = {
  padding: "12px 16px",
  border: "1px solid #222",
  borderRadius: "8px",
  backgroundColor: "white",
  color: "#222",
  cursor: "pointer",
  fontWeight: "600",
};

const resultBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "20px",
  color: "#666",
  fontSize: "14px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fill, minmax(260px, 1fr))",
  gap: "24px",
};

const cardStyle = {
  backgroundColor: "white",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow:
    "0 3px 15px rgba(0,0,0,0.07)",
  transition: "transform 0.2s ease",
};

const imageContainerStyle = {
  position: "relative",
  width: "100%",
  height: "240px",
  backgroundColor: "#eeeeee",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const noImageStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "#888",
  gap: "8px",
};

const noImageIconStyle = {
  fontSize: "35px",
};

const outOfStockBadgeStyle = {
  position: "absolute",
  top: "12px",
  right: "12px",
  padding: "6px 10px",
  backgroundColor: "#222",
  color: "white",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: "700",
};

const cardContentStyle = {
  padding: "20px",
};

const categoryBadgeStyle = {
  display: "inline-block",
  padding: "5px 9px",
  backgroundColor: "#f0f0f0",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: "600",
  color: "#555",
  marginBottom: "10px",
};

const productNameStyle = {
  margin: "0 0 8px",
  fontSize: "20px",
  lineHeight: "1.3",
};

const descriptionStyle = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "1.5",
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
  fontSize: "22px",
};

const stockStyle = {
  fontSize: "12px",
  color: "#555",
  textAlign: "right",
};

const lowStockTextStyle = {
  fontWeight: "700",
};

const outOfStockTextStyle = {
  fontWeight: "700",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "18px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#222",
  color: "white",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
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