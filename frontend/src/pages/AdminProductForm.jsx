import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function AdminProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [existingImages, setExistingImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(
    isEditMode
  );

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const fetchProduct = async () => {
      try {
        setFetchingProduct(true);
        setError("");

        const response = await api.get(
          `/products/${id}`
        );

        const product = response.data.product;

        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price ?? "",
          category: product.category || "",
          stock: product.stock ?? "",
        });

        setExistingImages(product.images || []);
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
        setFetchingProduct(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setImage(null);
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      setImage(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      setImage(null);
      return;
    }

    setError("");
    setImage(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (!formData.name.trim()) {
        throw new Error("Product name is required.");
      }

      if (!formData.description.trim()) {
        throw new Error(
          "Product description is required."
        );
      }

      if (!formData.category.trim()) {
        throw new Error("Product category is required.");
      }

      if (
        formData.price === "" ||
        Number(formData.price) < 0
      ) {
        throw new Error(
          "Please enter a valid product price."
        );
      }

      if (
        formData.stock === "" ||
        Number(formData.stock) < 0
      ) {
        throw new Error(
          "Please enter a valid stock quantity."
        );
      }

      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append(
        "description",
        formData.description.trim()
      );
      data.append("price", Number(formData.price));
      data.append(
        "category",
        formData.category.trim()
      );
      data.append("stock", Number(formData.stock));

      if (image) {
        data.append("image", image);
      }

      let response;

      if (isEditMode) {
        response = await api.put(
          `/products/${id}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await api.post(
          "/products",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setMessage(
        response.data.message ||
          (isEditMode
            ? "Product updated successfully."
            : "Product created successfully.")
      );

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (error) {
      console.error(
        "Save Product Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to save product."
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || fetchingProduct) {
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
      <div style={formCardStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={{ margin: 0 }}>
              {isEditMode
                ? "✏️ Edit Product"
                : "➕ Add Product"}
            </h1>

            <p style={subtitleStyle}>
              {isEditMode
                ? "Update product information."
                : "Add a new product to your store."}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/products")
            }
            style={secondaryButtonStyle}
          >
            ← Back
          </button>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        {message && (
          <div style={successStyle}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>
            Product Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            style={inputStyle}
            required
          />

          <label style={labelStyle}>
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows={5}
            style={textareaStyle}
            required
          />

          <div style={twoColumnStyle}>
            <div>
              <label style={labelStyle}>
                Price (₹)
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="2999"
                min="0"
                step="0.01"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>
                Stock
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="50"
                min="0"
                step="1"
                style={inputStyle}
                required
              />
            </div>
          </div>

          <label style={labelStyle}>
            Category
          </label>

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Electronics"
            style={inputStyle}
            required
          />

          {isEditMode &&
            existingImages.length > 0 && (
              <div style={existingImageSectionStyle}>
                <label style={labelStyle}>
                  Current Image
                </label>

                <img
                  src={existingImages[0]}
                  alt={formData.name}
                  style={existingImageStyle}
                />
              </div>
            )}

          <label style={labelStyle}>
            {isEditMode
              ? "Replace Image (Optional)"
              : "Product Image"}
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={fileInputStyle}
            required={!isEditMode}
          />

          {image && (
            <p style={fileNameStyle}>
              Selected: {image.name}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={submitButtonStyle}
          >
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Product"
              : "Create Product"}
          </button>
        </form>
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

const formCardStyle = {
  maxWidth: "750px",
  margin: "0 auto",
  padding: "30px",
  backgroundColor: "white",
  borderRadius: "10px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap",
  marginBottom: "25px",
};

const subtitleStyle = {
  color: "#666",
  marginTop: "8px",
};

const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginTop: "18px",
  marginBottom: "7px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "15px",
};

const textareaStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "15px",
  resize: "vertical",
  fontFamily: "Arial, sans-serif",
};

const twoColumnStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
};

const fileInputStyle = {
  width: "100%",
  padding: "12px 0",
};

const fileNameStyle = {
  color: "#555",
  fontSize: "14px",
};

const existingImageSectionStyle = {
  marginTop: "20px",
};

const existingImageStyle = {
  display: "block",
  width: "180px",
  height: "180px",
  objectFit: "contain",
  backgroundColor: "#f8f8f8",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const submitButtonStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "30px",
  border: "none",
  borderRadius: "7px",
  backgroundColor: "#222",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};

const buttonStyle = {
  padding: "11px 18px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#222",
  color: "white",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  padding: "10px 16px",
  border: "1px solid #222",
  borderRadius: "6px",
  backgroundColor: "white",
  color: "#222",
  cursor: "pointer",
};

const messageCardStyle = {
  backgroundColor: "white",
  padding: "40px",
  borderRadius: "10px",
  textAlign: "center",
};

const errorStyle = {
  backgroundColor: "#ffe6e6",
  color: "#b00020",
  padding: "12px",
  borderRadius: "6px",
  marginBottom: "20px",
};

const successStyle = {
  backgroundColor: "#e6f7ed",
  color: "#198754",
  padding: "12px",
  borderRadius: "6px",
  marginBottom: "20px",
};

export default AdminProductForm;