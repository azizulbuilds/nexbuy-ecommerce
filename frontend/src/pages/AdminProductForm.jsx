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

        const response = await api.get(`/products/${id}`);

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
        console.error("Fetch Product Error:", error);

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
        throw new Error("Product description is required.");
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
      console.error("Save Product Error:", error);

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
      <div className="nexbuy-product-form-page" style={pageStyle}>
        <div style={stateCardStyle}>
          <div style={spinnerStyle} />
          <span style={eyebrowStyle}>NEXBUY ADMIN</span>
          <h2 style={stateTitleStyle}>
            {fetchingProduct
              ? "Loading product"
              : "Checking access"}
          </h2>
          <p style={stateTextStyle}>
            Please wait while we prepare your workspace.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="nexbuy-product-form-page" style={pageStyle}>
        <div style={stateCardStyle}>
          <div style={stateIconStyle}>🔐</div>
          <span style={eyebrowStyle}>SECURE AREA</span>
          <h2 style={stateTitleStyle}>Login required</h2>
          <p style={stateTextStyle}>
            Please sign in to manage your Nexbuy products.
          </p>

          <button
            onClick={() => navigate("/login")}
            style={primaryButtonStyle}
          >
            Go to Login →
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="nexbuy-product-form-page" style={pageStyle}>
        <div style={stateCardStyle}>
          <div style={stateIconStyle}>⛔</div>
          <span style={eyebrowStyle}>RESTRICTED AREA</span>
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

  return (
    <div className="nexbuy-product-form-page" style={pageStyle}>
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
                {isEditMode ? (
                  <>
                    Refine your
                    <span style={gradientTextStyle}>
                      {" "}Product
                    </span>
                  </>
                ) : (
                  <>
                    Create a
                    <span style={gradientTextStyle}>
                      {" "}Product
                    </span>
                  </>
                )}
              </h1>

              <p style={heroSubtitleStyle}>
                {isEditMode
                  ? "Update your catalog listing, inventory and product presentation."
                  : "Add a polished new listing to your Nexbuy storefront."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              style={ghostButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.14)";
                e.currentTarget.style.borderColor =
                  "rgba(255,255,255,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.08)";
                e.currentTarget.style.borderColor =
                  "rgba(255,255,255,0.18)";
              }}
            >
              ← Product Catalog
            </button>
          </div>
        </section>

        <div className="nexbuy-product-form-layout" style={layoutStyle}>
          <section className="nexbuy-product-form-card" style={formCardStyle}>
            <div style={cardHeaderStyle}>
              <div>
                <span style={sectionEyebrowStyle}>
                  PRODUCT DETAILS
                </span>
                <h2 style={sectionTitleStyle}>
                  {isEditMode
                    ? "Edit listing"
                    : "New listing"}
                </h2>
                <p style={sectionSubtitleStyle}>
                  Keep your product information clear and customer-friendly.
                </p>
              </div>

              <div style={modeBadgeStyle}>
                {isEditMode ? "EDIT MODE" : "NEW PRODUCT"}
              </div>
            </div>

            {error && (
              <div style={errorStyle}>
                <span style={alertIconStyle}>!</span>
                <div>
                  <strong style={{ display: "block", marginBottom: "2px" }}>
                    Please check this
                  </strong>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {message && (
              <div style={successStyle}>
                <span style={successIconStyle}>✓</span>
                <div>
                  <strong style={{ display: "block", marginBottom: "2px" }}>
                    Saved successfully
                  </strong>
                  <span>{message}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>
                  Product Name
                  <span style={requiredStyle}>*</span>
                </label>

                <div style={inputShellStyle}>
                  <span style={fieldIconStyle}>✦</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Wireless Headphones Pro"
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div style={fieldGroupStyle}>
                <label style={labelStyle}>
                  Description
                  <span style={requiredStyle}>*</span>
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell customers what makes this product worth choosing..."
                  rows={6}
                  style={textareaStyle}
                  required
                />

                <span style={helperTextStyle}>
                  A clear description helps customers understand the product quickly.
                </span>
              </div>

              <div className="nexbuy-product-form-two-column" style={twoColumnStyle}>
                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>
                    Price
                    <span style={requiredStyle}>*</span>
                  </label>

                  <div style={inputShellStyle}>
                    <span style={currencyIconStyle}>₹</span>
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
                </div>

                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>
                    Stock
                    <span style={requiredStyle}>*</span>
                  </label>

                  <div style={inputShellStyle}>
                    <span style={fieldIconStyle}>#</span>
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
              </div>

              <div style={fieldGroupStyle}>
                <label style={labelStyle}>
                  Category
                  <span style={requiredStyle}>*</span>
                </label>

                <div style={inputShellStyle}>
                  <span style={fieldIconStyle}>◇</span>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Electronics"
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              {isEditMode &&
                existingImages.length > 0 && (
                  <div style={imageSectionStyle}>
                    <div style={imageSectionHeaderStyle}>
                      <div>
                        <label style={labelStyle}>
                          Current Image
                        </label>
                        <span style={helperTextStyle}>
                          This image is currently displayed for the product.
                        </span>
                      </div>

                      <span style={imageStatusStyle}>
                        CURRENT
                      </span>
                    </div>

                    <div style={currentImageFrameStyle}>
                      <img
                        src={existingImages[0]}
                        alt={formData.name}
                        style={existingImageStyle}
                      />
                    </div>
                  </div>
                )}

              <div style={imageSectionStyle}>
                <label style={labelStyle}>
                  {isEditMode
                    ? "Replace Image"
                    : "Product Image"}
                  {!isEditMode && (
                    <span style={requiredStyle}>*</span>
                  )}
                </label>

                <label style={uploadZoneStyle}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={hiddenFileInputStyle}
                    required={!isEditMode}
                  />

                  <div style={uploadIconStyle}>
                    {image ? "✓" : "↑"}
                  </div>

                  <div>
                    <strong style={uploadTitleStyle}>
                      {image
                        ? "Image selected"
                        : "Upload product image"}
                    </strong>

                    <span style={uploadTextStyle}>
                      {image
                        ? image.name
                        : "PNG, JPG, WEBP • Maximum 5MB"}
                    </span>
                  </div>

                  <span style={browseButtonStyle}>
                    {image ? "Change" : "Browse"}
                  </span>
                </label>

                {image && (
                  <div style={selectedFileStyle}>
                    <span>✓</span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                      {image.name}
                    </span>
                  </div>
                )}
              </div>

              <div style={formFooterStyle}>
                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  style={cancelButtonStyle}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...submitButtonStyle,
                    opacity: loading ? 0.72 : 1,
                    cursor: loading
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  {loading ? (
                    <>
                      <span style={buttonSpinnerStyle} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <span>
                        {isEditMode ? "✓" : "+"}
                      </span>
                      {isEditMode
                        ? "Update Product"
                        : "Create Product"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          <aside className="nexbuy-product-preview" style={previewCardStyle}>
            <div style={previewHeaderStyle}>
              <div>
                <span style={sectionEyebrowStyle}>
                  LIVE PREVIEW
                </span>
                <h3 style={previewTitleStyle}>
                  Storefront Card
                </h3>
              </div>
              <span style={previewDotStyle} />
            </div>

            <div style={previewProductStyle}>
              <div style={previewImageFrameStyle}>
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Product preview"
                    style={previewImageStyle}
                  />
                ) : existingImages.length > 0 ? (
                  <img
                    src={existingImages[0]}
                    alt={formData.name || "Product"}
                    style={previewImageStyle}
                  />
                ) : (
                  <div style={previewPlaceholderStyle}>
                    <span>📦</span>
                    <small>Product image</small>
                  </div>
                )}
              </div>

              <span style={previewCategoryStyle}>
                {formData.category || "CATEGORY"}
              </span>

              <h4 style={previewNameStyle}>
                {formData.name || "Your Product Name"}
              </h4>

              <p style={previewDescriptionStyle}>
                {formData.description ||
                  "Your product description will appear here in a clean, customer-friendly format."}
              </p>

              <div style={previewBottomStyle}>
                <strong style={previewPriceStyle}>
                  ₹
                  {formData.price !== ""
                    ? Number(formData.price).toLocaleString("en-IN")
                    : "0"}
                </strong>

                <span
                  style={{
                    ...previewStockStyle,
                    color:
                      Number(formData.stock) <= 0
                        ? "#dc2626"
                        : Number(formData.stock) <= 5
                        ? "#ea580c"
                        : "#047857",
                    background:
                      Number(formData.stock) <= 0
                        ? "#fef2f2"
                        : Number(formData.stock) <= 5
                        ? "#fff7ed"
                        : "#ecfdf5",
                  }}
                >
                  {Number(formData.stock) <= 0
                    ? "Out of stock"
                    : `${formData.stock || 0} in stock`}
                </span>
              </div>
            </div>

            <div style={tipBoxStyle}>
              <span style={tipIconStyle}>💡</span>
              <div>
                <strong style={tipTitleStyle}>
                  Quick tip
                </strong>
                <p style={tipTextStyle}>
                  Use a concise name, accurate price and a strong product image for a cleaner storefront.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: "32px 20px 70px",
  boxSizing: "border-box",
  background:
    "radial-gradient(circle at 10% 0%, rgba(99,102,241,0.09), transparent 27%), radial-gradient(circle at 95% 25%, rgba(168,85,247,0.07), transparent 28%), #f7f8fc",
  color: "#0f172a",
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  position: "relative",
  overflow: "hidden",
};

const ambientOrbOneStyle = {
  position: "fixed",
  width: "270px",
  height: "270px",
  borderRadius: "50%",
  background: "rgba(99,102,241,0.07)",
  filter: "blur(75px)",
  top: "12%",
  left: "-150px",
  pointerEvents: "none",
};

const ambientOrbTwoStyle = {
  position: "fixed",
  width: "320px",
  height: "320px",
  borderRadius: "50%",
  background: "rgba(168,85,247,0.06)",
  filter: "blur(85px)",
  right: "-150px",
  bottom: "-130px",
  pointerEvents: "none",
};

const containerStyle = {
  maxWidth: "1180px",
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
  boxShadow: "0 22px 55px rgba(30,27,75,0.20)",
};

const heroGlowStyle = {
  position: "absolute",
  width: "360px",
  height: "360px",
  borderRadius: "50%",
  background: "rgba(129,140,248,0.18)",
  filter: "blur(10px)",
  top: "-240px",
  right: "8%",
};

const heroContentStyle = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "25px",
  flexWrap: "wrap",
  padding: "36px 40px",
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
  fontSize: "10px",
  fontWeight: 850,
  letterSpacing: "1.6px",
};

const liveDotStyle = {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  background: "#a5b4fc",
  boxShadow: "0 0 0 5px rgba(165,180,252,0.10)",
};

const heroTitleStyle = {
  margin: "15px 0 8px",
  color: "#ffffff",
  fontSize: "clamp(31px, 5vw, 45px)",
  lineHeight: 1.05,
  letterSpacing: "-1.7px",
  fontWeight: 850,
};

const gradientTextStyle = {
  background:
    "linear-gradient(90deg, #c7d2fe, #ddd6fe, #e9d5ff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const heroSubtitleStyle = {
  maxWidth: "650px",
  margin: 0,
  color: "#cbd5e1",
  fontSize: "14px",
  lineHeight: 1.7,
};

const ghostButtonStyle = {
  padding: "12px 17px",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.08)",
  color: "#f8fafc",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 800,
  transition: "all 0.2s ease",
};

const layoutStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.65fr) minmax(290px, 0.75fr)",
  gap: "20px",
  alignItems: "start",
};

const formCardStyle = {
  padding: "28px",
  border: "1px solid #e7eaf1",
  borderRadius: "24px",
  background: "rgba(255,255,255,0.94)",
  boxShadow: "0 15px 45px rgba(15,23,42,0.065)",
  backdropFilter: "blur(12px)",
};

const cardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "15px",
  marginBottom: "24px",
};

const sectionEyebrowStyle = {
  color: "#6366f1",
  fontSize: "9px",
  fontWeight: 850,
  letterSpacing: "1.7px",
};

const sectionTitleStyle = {
  margin: "5px 0 4px",
  fontSize: "24px",
  letterSpacing: "-0.7px",
};

const sectionSubtitleStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "12px",
  lineHeight: 1.55,
};

const modeBadgeStyle = {
  padding: "7px 9px",
  borderRadius: "8px",
  background: "#eef2ff",
  color: "#4f46e5",
  fontSize: "9px",
  fontWeight: 850,
  letterSpacing: "0.8px",
  whiteSpace: "nowrap",
};

const fieldGroupStyle = {
  marginBottom: "18px",
};

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  color: "#334155",
  fontSize: "12px",
  fontWeight: 800,
};

const requiredStyle = {
  color: "#ef4444",
  marginLeft: "3px",
};

const inputShellStyle = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #dfe4ec",
  borderRadius: "12px",
  background: "#ffffff",
  transition: "all 0.2s ease",
  overflow: "hidden",
};

const fieldIconStyle = {
  width: "42px",
  flex: "0 0 42px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#6366f1",
  fontWeight: 850,
  fontSize: "15px",
};

const currencyIconStyle = {
  width: "42px",
  flex: "0 0 42px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#6366f1",
  fontWeight: 850,
  fontSize: "16px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 13px 12px 0",
  border: "none",
  outline: "none",
  background: "transparent",
  color: "#0f172a",
  fontSize: "13px",
  fontFamily: "inherit",
};

const textareaStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  border: "1px solid #dfe4ec",
  borderRadius: "12px",
  outline: "none",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: "13px",
  lineHeight: 1.6,
  resize: "vertical",
  minHeight: "135px",
  fontFamily: "inherit",
};

const helperTextStyle = {
  display: "block",
  marginTop: "6px",
  color: "#94a3b8",
  fontSize: "10px",
  lineHeight: 1.45,
};

const twoColumnStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "14px",
};

const imageSectionStyle = {
  marginTop: "22px",
};

const imageSectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "12px",
  marginBottom: "8px",
};

const imageStatusStyle = {
  padding: "5px 8px",
  borderRadius: "7px",
  background: "#ecfdf5",
  color: "#047857",
  fontSize: "8px",
  fontWeight: 850,
  letterSpacing: "1px",
};

const currentImageFrameStyle = {
  width: "100%",
  minHeight: "210px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  border: "1px solid #e2e8f0",
  borderRadius: "15px",
  background:
    "linear-gradient(145deg, #f8fafc, #eef2ff)",
};

const existingImageStyle = {
  display: "block",
  width: "100%",
  height: "210px",
  objectFit: "contain",
  padding: "15px",
  boxSizing: "border-box",
};

const uploadZoneStyle = {
  minHeight: "105px",
  display: "flex",
  alignItems: "center",
  gap: "13px",
  padding: "15px",
  boxSizing: "border-box",
  border: "1.5px dashed #c7d2fe",
  borderRadius: "15px",
  background:
    "linear-gradient(135deg, #fafaff, #f8f7ff)",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const hiddenFileInputStyle = {
  display: "none",
};

const uploadIconStyle = {
  width: "45px",
  height: "45px",
  flex: "0 0 45px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "13px",
  background: "#eef2ff",
  color: "#4f46e5",
  fontSize: "21px",
  fontWeight: 800,
};

const uploadTitleStyle = {
  display: "block",
  color: "#334155",
  fontSize: "12px",
  marginBottom: "4px",
};

const uploadTextStyle = {
  display: "block",
  maxWidth: "280px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: "#94a3b8",
  fontSize: "10px",
};

const browseButtonStyle = {
  marginLeft: "auto",
  padding: "8px 11px",
  borderRadius: "9px",
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  color: "#4f46e5",
  fontSize: "10px",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const selectedFileStyle = {
  display: "flex",
  alignItems: "center",
  gap: "7px",
  marginTop: "8px",
  padding: "8px 10px",
  borderRadius: "9px",
  background: "#ecfdf5",
  color: "#047857",
  fontSize: "10px",
};

const formFooterStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "28px",
  paddingTop: "20px",
  borderTop: "1px solid #eef2f7",
};

const cancelButtonStyle = {
  padding: "12px 17px",
  border: "1px solid #e2e8f0",
  borderRadius: "11px",
  background: "#ffffff",
  color: "#475569",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 800,
};

const submitButtonStyle = {
  minWidth: "155px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "12px 18px",
  border: "none",
  borderRadius: "11px",
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: 850,
  boxShadow: "0 9px 22px rgba(99,102,241,0.22)",
  transition: "all 0.2s ease",
};

const buttonSpinnerStyle = {
  width: "13px",
  height: "13px",
  borderRadius: "50%",
  border: "2px solid rgba(255,255,255,0.4)",
  borderTopColor: "#ffffff",
  animation: "nexbuyAdminFormSpin 0.75s linear infinite",
};

const errorStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  marginBottom: "20px",
  padding: "12px 14px",
  border: "1px solid #fecaca",
  borderRadius: "12px",
  background: "#fff7f7",
  color: "#991b1b",
  fontSize: "11px",
  lineHeight: 1.45,
};

const successStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  marginBottom: "20px",
  padding: "12px 14px",
  border: "1px solid #bbf7d0",
  borderRadius: "12px",
  background: "#f0fdf4",
  color: "#166534",
  fontSize: "11px",
  lineHeight: 1.45,
};

const alertIconStyle = {
  width: "22px",
  height: "22px",
  flex: "0 0 22px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  background: "#fee2e2",
  color: "#dc2626",
  fontWeight: 900,
};

const successIconStyle = {
  width: "22px",
  height: "22px",
  flex: "0 0 22px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  background: "#dcfce7",
  color: "#16a34a",
  fontWeight: 900,
};

const previewCardStyle = {
  position: "sticky",
  top: "20px",
  padding: "20px",
  border: "1px solid #e7eaf1",
  borderRadius: "24px",
  background: "rgba(255,255,255,0.94)",
  boxShadow: "0 15px 45px rgba(15,23,42,0.065)",
};

const previewHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "15px",
};

const previewTitleStyle = {
  margin: "4px 0 0",
  fontSize: "18px",
  letterSpacing: "-0.4px",
};

const previewDotStyle = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "#22c55e",
  boxShadow: "0 0 0 5px rgba(34,197,94,0.10)",
};

const previewProductStyle = {
  overflow: "hidden",
  border: "1px solid #e8eaf1",
  borderRadius: "18px",
  background: "#ffffff",
};

const previewImageFrameStyle = {
  height: "210px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  background:
    "linear-gradient(145deg, #f8fafc, #eef2ff)",
};

const previewImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
  padding: "12px",
  boxSizing: "border-box",
};

const previewPlaceholderStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "7px",
  color: "#94a3b8",
};

const previewCategoryStyle = {
  display: "inline-block",
  margin: "14px 15px 0",
  padding: "5px 8px",
  borderRadius: "7px",
  background: "#eef2ff",
  color: "#4f46e5",
  fontSize: "8px",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: "0.9px",
};

const previewNameStyle = {
  margin: "9px 15px 6px",
  fontSize: "18px",
  lineHeight: 1.2,
  letterSpacing: "-0.4px",
};

const previewDescriptionStyle = {
  margin: "0 15px",
  color: "#64748b",
  fontSize: "10px",
  lineHeight: 1.55,
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  minHeight: "47px",
};

const previewBottomStyle = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  gap: "10px",
  margin: "15px",
  paddingTop: "13px",
  borderTop: "1px solid #f1f5f9",
};

const previewPriceStyle = {
  fontSize: "21px",
  letterSpacing: "-0.5px",
};

const previewStockStyle = {
  padding: "6px 8px",
  borderRadius: "8px",
  fontSize: "8px",
  fontWeight: 800,
};

const tipBoxStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  marginTop: "15px",
  padding: "12px",
  borderRadius: "13px",
  background: "#f8fafc",
  border: "1px solid #eef2f7",
};

const tipIconStyle = {
  fontSize: "16px",
};

const tipTitleStyle = {
  display: "block",
  marginBottom: "3px",
  fontSize: "10px",
  color: "#334155",
};

const tipTextStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "9px",
  lineHeight: 1.5,
};

const primaryButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
  padding: "12px 18px",
  border: "none",
  borderRadius: "11px",
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "#ffffff",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 850,
  boxShadow: "0 9px 22px rgba(99,102,241,0.20)",
};

const stateCardStyle = {
  width: "min(100%, 520px)",
  margin: "10vh auto 0",
  padding: "44px 30px",
  boxSizing: "border-box",
  border: "1px solid #e7eaf1",
  borderRadius: "26px",
  background: "rgba(255,255,255,0.94)",
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
  margin: "8px 0",
  fontSize: "25px",
  letterSpacing: "-0.6px",
};

const stateTextStyle = {
  maxWidth: "440px",
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
  animation: "nexbuyAdminFormSpin 0.8s linear infinite",
};

if (
  typeof document !== "undefined" &&
  !document.getElementById("nexbuy-admin-product-form-styles")
) {
  const style = document.createElement("style");
  style.id = "nexbuy-admin-product-form-styles";
  style.textContent = `
    @keyframes nexbuyAdminFormSpin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 900px) {
      .nexbuy-product-form-layout {
        grid-template-columns: 1fr !important;
      }

      .nexbuy-product-preview {
        position: static !important;
      }
    }

    @media (max-width: 600px) {
      .nexbuy-product-form-page {
        padding-left: 13px !important;
        padding-right: 13px !important;
      }

      .nexbuy-product-form-card {
        padding: 20px !important;
      }

      .nexbuy-product-form-two-column {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  document.head.appendChild(style);
}

export default AdminProductForm;
