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
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={pageStyle}>
        <div style={messageCardStyle}>
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
        <div style={messageCardStyle}>
          <h1>Access Denied</h1>

          <p>
            Only administrators can manage products.
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

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={{ margin: 0 }}>
              📦 Product Management
            </h1>

            <p style={subtitleStyle}>
              Add, edit and delete products.
            </p>
          </div>

          <div style={headerButtonsStyle}>
            <button
              onClick={() => navigate("/admin")}
              style={secondaryButtonStyle}
            >
              Admin Dashboard
            </button>

            <button
              onClick={() =>
                navigate("/admin/products/new")
              }
              style={buttonStyle}
            >
              + Add Product
            </button>
          </div>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={messageCardStyle}>
            <h2>Loading products...</h2>
          </div>
        ) : products.length === 0 ? (
          <div style={messageCardStyle}>
            <h2>No products found</h2>

            <p>
              Add your first product to the store.
            </p>

            <button
              onClick={() =>
                navigate("/admin/products/new")
              }
              style={buttonStyle}
            >
              + Add Product
            </button>
          </div>
        ) : (
          <div style={gridStyle}>
            {products.map((product) => (
              <div
                key={product._id}
                style={productCardStyle}
              >
                {product.images &&
                product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={imageStyle}
                  />
                ) : (
                  <div style={placeholderStyle}>
                    📦
                  </div>
                )}

                <div style={productInfoStyle}>
                  <p style={categoryStyle}>
                    {product.category}
                  </p>

                  <h2 style={productNameStyle}>
                    {product.name}
                  </h2>

                  <p style={descriptionStyle}>
                    {product.description}
                  </p>

                  <div style={detailsStyle}>
                    <strong>
                      ₹{product.price}
                    </strong>

                    <span>
                      Stock: {product.stock}
                    </span>
                  </div>

                  <div style={actionsStyle}>
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/products/edit/${product._id}`
                        )
                      }
                      style={editButtonStyle}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(product._id)
                      }
                      disabled={
                        deletingId === product._id
                      }
                      style={deleteButtonStyle}
                    >
                      {deletingId === product._id
                        ? "Deleting..."
                        : "🗑️ Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
  gap: "20px",
  flexWrap: "wrap",
  marginBottom: "30px",
};

const headerButtonsStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const subtitleStyle = {
  color: "#666",
  marginTop: "8px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "25px",
};

const productCardStyle = {
  backgroundColor: "white",
  borderRadius: "10px",
  overflow: "hidden",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
};

const imageStyle = {
  width: "100%",
  height: "230px",
  objectFit: "contain",
  backgroundColor: "#f8f8f8",
};

const placeholderStyle = {
  width: "100%",
  height: "230px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "70px",
  backgroundColor: "#f8f8f8",
};

const productInfoStyle = {
  padding: "20px",
};

const categoryStyle = {
  color: "#777",
  fontSize: "13px",
  margin: 0,
};

const productNameStyle = {
  margin: "8px 0",
  fontSize: "21px",
};

const descriptionStyle = {
  color: "#666",
  lineHeight: "1.5",
  minHeight: "45px",
};

const detailsStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "15px",
  fontSize: "16px",
};

const actionsStyle = {
  display: "flex",
  gap: "10px",
  marginTop: "20px",
};

const buttonStyle = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#222",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
};

const secondaryButtonStyle = {
  padding: "10px 16px",
  border: "1px solid #222",
  borderRadius: "6px",
  backgroundColor: "white",
  color: "#222",
  cursor: "pointer",
  fontSize: "14px",
};

const editButtonStyle = {
  flex: 1,
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#222",
  color: "white",
  cursor: "pointer",
};

const deleteButtonStyle = {
  flex: 1,
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#dc3545",
  color: "white",
  cursor: "pointer",
};

const messageCardStyle = {
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

export default AdminProducts;