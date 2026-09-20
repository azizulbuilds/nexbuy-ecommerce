import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../api/axios";

function Home() {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response =
          await api.get("/products");

        setProducts(
          response.data.products.slice(
            0,
            4
          )
        );
      } catch (error) {
        console.error(
          "Fetch Featured Products Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={pageStyle}>
      {/* ==========================================
          HERO
      ========================================== */}

      <section className="nexbuy-home-hero" style={heroStyle}>
        <div style={heroGlowOne}></div>
        <div style={heroGlowTwo}></div>

        <div className="nexbuy-home-hero-content" style={heroContentStyle}>
          <div style={heroBadgeStyle}>
            <span style={badgeDotStyle}></span>
            Modern shopping, made simple
          </div>

          <h1 style={heroTitleStyle}>
            Shop Smarter.
            <br />

            <span style={gradientTextStyle}>
              Live Better.
            </span>
          </h1>

          <p style={heroTextStyle}>
            Discover quality products,
            secure payments, and a seamless
            shopping experience built with
            modern technology.
          </p>

          <div style={heroButtonsStyle}>
            <button
              onClick={() =>
                navigate("/products")
              }
              style={primaryButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 15px 35px rgba(99,102,241,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "none";
              }}
            >
              Explore Products
              <span>→</span>
            </button>

            <button
              onClick={() =>
                navigate("/orders")
              }
              style={secondaryButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "transparent";
              }}
            >
              View My Orders
            </button>
          </div>

          <div style={heroStatsStyle}>
            <div>
              <strong style={statNumberStyle}>
                100%
              </strong>

              <span style={statLabelStyle}>
                Secure
              </span>
            </div>

            <div style={statDividerStyle}></div>

            <div>
              <strong style={statNumberStyle}>
                24/7
              </strong>

              <span style={statLabelStyle}>
                Available
              </span>
            </div>

            <div style={statDividerStyle}></div>

            <div>
              <strong style={statNumberStyle}>
                Fast
              </strong>

              <span style={statLabelStyle}>
                Checkout
              </span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="nexbuy-home-hero-visual-wrapper" style={heroVisualWrapperStyle}>
          <div className="nexbuy-home-hero-visual" style={heroVisualStyle}>
            <div className="nexbuy-home-hero-ring nexbuy-home-hero-ring-one" style={visualRingOne}></div>
            <div className="nexbuy-home-hero-ring nexbuy-home-hero-ring-two" style={visualRingTwo}></div>

            <div className="nexbuy-home-hero-product-circle" style={heroProductCircleStyle}>
              <div style={shoppingBagStyle}>
                🛍️
              </div>
            </div>

            <div
              className="nexbuy-home-floating-card nexbuy-home-floating-card-top"
              style={{
                ...floatingCardStyle,
                ...floatingCardTopStyle,
              }}
            >
              <span style={floatingIconStyle}>
                ✨
              </span>

              <div>
                <strong
                  style={floatingTitleStyle}
                >
                  Premium
                </strong>

                <span
                  style={floatingSubtitleStyle}
                >
                  Shopping experience
                </span>
              </div>
            </div>

            <div
              className="nexbuy-home-floating-card nexbuy-home-floating-card-bottom"
              style={{
                ...floatingCardStyle,
                ...floatingCardBottomStyle,
              }}
            >
              <span style={floatingIconStyle}>
                🔒
              </span>

              <div>
                <strong
                  style={floatingTitleStyle}
                >
                  Secure Checkout
                </strong>

                <span
                  style={floatingSubtitleStyle}
                >
                  Protected payments
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          TRUST BAR
      ========================================== */}

      <section style={trustBarStyle}>
        <div style={trustItemStyle}>
          <span style={trustIconStyle}>
            🚚
          </span>

          <div>
            <strong>
              Fast Delivery
            </strong>

            <p>
              Quick & reliable shipping
            </p>
          </div>
        </div>

        <div style={trustItemStyle}>
          <span style={trustIconStyle}>
            🔐
          </span>

          <div>
            <strong>
              Secure Payments
            </strong>

            <p>
              Protected checkout
            </p>
          </div>
        </div>

        <div style={trustItemStyle}>
          <span style={trustIconStyle}>
            💎
          </span>

          <div>
            <strong>
              Quality Products
            </strong>

            <p>
              Carefully selected products
            </p>
          </div>
        </div>

        <div style={trustItemStyle}>
          <span style={trustIconStyle}>
            ⚡
          </span>

          <div>
            <strong>
              Easy Shopping
            </strong>

            <p>
              Simple & smooth experience
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          FEATURED PRODUCTS
      ========================================== */}

      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <span style={sectionEyebrowStyle}>
              HANDPICKED FOR YOU
            </span>

            <h2 style={sectionTitleStyle}>
              Featured Products
            </h2>

            <p style={sectionSubtitleStyle}>
              Explore some of our latest
              products.
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/products")
            }
            style={viewAllButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateX(0)";
            }}
          >
            View All
            <span>→</span>
          </button>
        </div>

        {loading ? (
          <div style={loadingGridStyle}>
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  style={skeletonCardStyle}
                >
                  <div
                    style={
                      skeletonImageStyle
                    }
                  ></div>

                  <div
                    style={
                      skeletonLineLargeStyle
                    }
                  ></div>

                  <div
                    style={
                      skeletonLineSmallStyle
                    }
                  ></div>

                  <div
                    style={
                      skeletonLinePriceStyle
                    }
                  ></div>
                </div>
              )
            )}
          </div>
        ) : products.length === 0 ? (
          <div style={emptyStyle}>
            <div style={emptyIconStyle}>
              📦
            </div>

            <h3>
              No products available
            </h3>

            <p>
              Check back soon for new
              products.
            </p>
          </div>
        ) : (
          <div style={productsGridStyle}>
            {products.map(
              (product) => (
                <div
                  key={product._id}
                  style={productCardStyle}
                  onClick={() =>
                    navigate(
                      `/products/${product._id}`
                    )
                  }
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 45px rgba(15,23,42,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(15,23,42,0.06)";
                  }}
                >
                  <div
                    style={
                      productImageWrapperStyle
                    }
                  >
                    {product.images &&
                    product.images.length >
                      0 ? (
                      <img
                        src={
                          product.images[0]
                        }
                        alt={
                          product.name
                        }
                        style={
                          productImageStyle
                        }
                      />
                    ) : (
                      <div
                        style={
                          productPlaceholderStyle
                        }
                      >
                        📦
                      </div>
                    )}

                    <span
                      style={
                        productCategoryBadgeStyle
                      }
                    >
                      {product.category ||
                        "Product"}
                    </span>
                  </div>

                  <div
                    style={
                      productInfoStyle
                    }
                  >
                    <div
                      style={
                        productRatingStyle
                      }
                    >
                      <span>
                        ⭐
                      </span>

                      <span>
                        {product.ratings ||
                          "New"}
                      </span>
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
                        productDescriptionStyle
                      }
                    >
                      {product.description}
                    </p>

                    <div
                      style={
                        productBottomStyle
                      }
                    >
                      <strong
                        style={
                          productPriceStyle
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
                          ...stockBadgeStyle,
                          ...(product.stock <=
                          0
                            ? outOfStockStyle
                            : {}),
                        }}
                      >
                        {product.stock >
                        0
                          ? "In Stock"
                          : "Sold Out"}
                      </span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* ==========================================
          PROMO SECTION
      ========================================== */}

      <section className="nexbuy-home-promo" style={promoSectionStyle}>
        <div style={promoGlowStyle}></div>

        <div style={promoContentStyle}>
          <span style={promoBadgeStyle}>
            🚀 SIMPLE. FAST. SECURE.
          </span>

          <h2 style={promoTitleStyle}>
            Everything you need.
            <br />
            One seamless experience.
          </h2>

          <p style={promoTextStyle}>
            From discovering products to
            secure checkout and order
            tracking, we've designed every
            step to be simple.
          </p>

          <button
            onClick={() =>
              navigate("/products")
            }
            style={promoButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0)";
            }}
          >
            Start Shopping
            <span>→</span>
          </button>
        </div>

        <div className="nexbuy-home-promo-visual" style={promoVisualStyle}>
          <div className="nexbuy-home-promo-circle-large" style={promoCircleLargeStyle}>
            <div
              style={promoCircleMediumStyle}
            >
              <div
                style={promoCircleSmallStyle}
              >
                🛒
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          WHY US
      ========================================== */}

      <section style={whySectionStyle}>
        <div style={whyHeaderStyle}>
          <span style={sectionEyebrowStyle}>
            WHY CHOOSE US
          </span>

          <h2 style={sectionTitleStyle}>
            Built for a better
            <span style={gradientTextDarkStyle}>
              {" "}
              shopping experience.
            </span>
          </h2>

          <p style={sectionSubtitleStyle}>
            Everything from browsing to
            payment is designed with
            simplicity and security in mind.
          </p>
        </div>

        <div style={whyGridStyle}>
          <div
            style={whyCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0)";
            }}
          >
            <div
              style={whyIconWrapperStyle}
            >
              ⚡
            </div>

            <h3>Lightning Fast</h3>

            <p>
              Smooth navigation and a
              responsive shopping experience.
            </p>
          </div>

          <div
            style={whyCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0)";
            }}
          >
            <div
              style={whyIconWrapperStyle}
            >
              🔒
            </div>

            <h3>Secure by Design</h3>

            <p>
              Authentication and payment
              verification keep your
              transactions protected.
            </p>
          </div>

          <div
            style={whyCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0)";
            }}
          >
            <div
              style={whyIconWrapperStyle}
            >
              📦
            </div>

            <h3>Track Your Orders</h3>

            <p>
              Follow your order from placement
              through delivery.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          FINAL CTA
      ========================================== */}

      <section style={finalCTAStyle}>
        <div style={finalCTAContentStyle}>
          <span style={finalCTABadgeStyle}>
            READY WHEN YOU ARE
          </span>

          <h2 style={finalCTATitleStyle}>
            Your next favorite
            <br />
            product is waiting.
          </h2>

          <p style={finalCTATextStyle}>
            Explore the collection and find
            something you'll love.
          </p>

          <button
            onClick={() =>
              navigate("/products")
            }
            style={finalCTAButtonStyle}
          >
            Explore Products →
          </button>
        </div>
      </section>

      {/* ==========================================
          FOOTER
      ========================================== */}

      <footer style={footerStyle}>
        <div style={footerInnerStyle}>
          <div>
            <h3 style={footerBrandStyle}>
              🛍️ Nexbuy
            </h3>

            <p style={footerDescriptionStyle}>
              A modern full-stack shopping
              experience built with the MERN
              stack.
            </p>
          </div>

          <div style={footerLinksStyle}>
            <Link
              to="/products"
              style={footerLinkStyle}
            >
              Products
            </Link>

            <Link
              to="/login"
              style={footerLinkStyle}
            >
              Login
            </Link>

            <Link
              to="/register"
              style={footerLinkStyle}
            >
              Register
            </Link>
          </div>
        </div>

        <div style={footerBottomStyle}>
          <span>
            © 2026 Nexbuy. All rights reserved.
          </span>

          <span>
            Built with React · Node.js ·
            Express · MongoDB
          </span>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// PAGE
// ==========================================

const pageStyle = {
  minHeight: "100vh",
  backgroundColor: "#f8fafc",
  color: "#0f172a",
  fontFamily:
    "Inter, Arial, sans-serif",
  overflow: "hidden",
};

// ==========================================
// HERO
// ==========================================

const heroStyle = {
  position: "relative",
  minHeight: "680px",
  padding:
    "90px max(24px, 7vw)",
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "60px",
  background:
    "linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%)",
  color: "white",
  overflow: "hidden",
};

const heroGlowOne = {
  position: "absolute",
  width: "500px",
  height: "500px",
  borderRadius: "50%",
  background:
    "rgba(99,102,241,0.18)",
  filter: "blur(80px)",
  top: "-200px",
  right: "5%",
};

const heroGlowTwo = {
  position: "absolute",
  width: "400px",
  height: "400px",
  borderRadius: "50%",
  background:
    "rgba(168,85,247,0.12)",
  filter: "blur(80px)",
  bottom: "-180px",
  left: "10%",
};

const heroContentStyle = {
  position: "relative",
  zIndex: 2,
  maxWidth: "650px",
};

const heroBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "9px",
  padding: "8px 14px",
  borderRadius: "999px",
  background:
    "rgba(255,255,255,0.08)",
  border:
    "1px solid rgba(255,255,255,0.14)",
  color: "#c7d2fe",
  fontSize: "13px",
  fontWeight: "600",
  marginBottom: "24px",
  backdropFilter: "blur(10px)",
};

const badgeDotStyle = {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  backgroundColor: "#818cf8",
  boxShadow:
    "0 0 12px rgba(129,140,248,0.8)",
};

const heroTitleStyle = {
  margin: 0,
  fontSize:
    "clamp(44px, 6vw, 76px)",
  lineHeight: "1.02",
  letterSpacing: "-3px",
  fontWeight: "800",
};

const gradientTextStyle = {
  background:
    "linear-gradient(90deg, #a5b4fc, #e9d5ff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const heroTextStyle = {
  maxWidth: "600px",
  margin:
    "28px 0 0",
  color: "#cbd5e1",
  fontSize: "18px",
  lineHeight: "1.75",
};

const heroButtonsStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "34px",
};

const primaryButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding:
    "14px 22px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "white",
  color: "#312e81",
  fontSize: "15px",
  fontWeight: "700",
  cursor: "pointer",
  transition:
    "all 0.25s ease",
};

const secondaryButtonStyle = {
  padding:
    "13px 21px",
  border:
    "1px solid rgba(255,255,255,0.25)",
  borderRadius: "10px",
  backgroundColor: "transparent",
  color: "white",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  transition:
    "all 0.25s ease",
};

const heroStatsStyle = {
  display: "flex",
  alignItems: "center",
  gap: "22px",
  marginTop: "48px",
};

const statNumberStyle = {
  display: "block",
  fontSize: "18px",
};

const statLabelStyle = {
  display: "block",
  marginTop: "3px",
  color: "#94a3b8",
  fontSize: "11px",
};

const statDividerStyle = {
  width: "1px",
  height: "32px",
  backgroundColor:
    "rgba(255,255,255,0.16)",
};

const heroVisualWrapperStyle = {
  position: "relative",
  zIndex: 2,
  flex: "0 0 430px",
  display: "flex",
  justifyContent: "center",
};

const heroVisualStyle = {
  position: "relative",
  width: "410px",
  height: "410px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const visualRingOne = {
  position: "absolute",
  width: "390px",
  height: "390px",
  borderRadius: "50%",
  border:
    "1px solid rgba(255,255,255,0.1)",
};

const visualRingTwo = {
  position: "absolute",
  width: "310px",
  height: "310px",
  borderRadius: "50%",
  border:
    "1px solid rgba(255,255,255,0.08)",
};

const heroProductCircleStyle = {
  position: "relative",
  width: "245px",
  height: "245px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))",
  border:
    "1px solid rgba(255,255,255,0.18)",
  boxShadow:
    "0 30px 80px rgba(0,0,0,0.3)",
  backdropFilter: "blur(20px)",
};

const shoppingBagStyle = {
  width: "135px",
  height: "135px",
  borderRadius: "35px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "70px",
  background:
    "linear-gradient(145deg, #6366f1, #8b5cf6)",
  boxShadow:
    "0 25px 50px rgba(99,102,241,0.35)",
  transform:
    "rotate(-7deg)",
};

const floatingCardStyle = {
  position: "absolute",
  display: "flex",
  alignItems: "center",
  gap: "11px",
  padding: "12px 15px",
  borderRadius: "13px",
  background:
    "rgba(15,23,42,0.75)",
  border:
    "1px solid rgba(255,255,255,0.12)",
  backdropFilter: "blur(15px)",
  boxShadow:
    "0 15px 35px rgba(0,0,0,0.25)",
};

const floatingCardTopStyle = {
  top: "45px",
  right: "-20px",
};

const floatingCardBottomStyle = {
  bottom: "35px",
  left: "-30px",
};

const floatingIconStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "rgba(99,102,241,0.2)",
  fontSize: "17px",
};

const floatingTitleStyle = {
  display: "block",
  fontSize: "12px",
};

const floatingSubtitleStyle = {
  display: "block",
  marginTop: "3px",
  color: "#94a3b8",
  fontSize: "9px",
};

// ==========================================
// TRUST BAR
// ==========================================

const trustBarStyle = {
  maxWidth: "1180px",
  margin:
    "-35px auto 0",
  position: "relative",
  zIndex: 5,
  padding:
    "22px 25px",
  display: "grid",
  gridTemplateColumns:
    "repeat(4, 1fr)",
  gap: "20px",
  backgroundColor: "white",
  borderRadius: "16px",
  boxShadow:
    "0 15px 45px rgba(15,23,42,0.08)",
};

const trustItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const trustIconStyle = {
  width: "42px",
  height: "42px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "11px",
  backgroundColor: "#eef2ff",
  fontSize: "19px",
};

const trustItemTextStyle = {
  fontSize: "13px",
};

const sectionStyle = {
  maxWidth: "1180px",
  margin: "0 auto",
  padding:
    "90px 24px 70px",
};

const sectionHeaderStyle = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  gap: "30px",
  flexWrap: "wrap",
};

const sectionEyebrowStyle = {
  display: "block",
  marginBottom: "10px",
  color: "#6366f1",
  fontSize: "11px",
  fontWeight: "800",
  letterSpacing: "2px",
};

const sectionTitleStyle = {
  margin: 0,
  color: "#0f172a",
  fontSize: "34px",
  lineHeight: "1.15",
  letterSpacing: "-1px",
};

const sectionSubtitleStyle = {
  margin:
    "10px 0 0",
  color: "#64748b",
  fontSize: "15px",
  lineHeight: "1.6",
};

const viewAllButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  border: "none",
  backgroundColor: "transparent",
  color: "#4f46e5",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
  transition:
    "transform 0.2s ease",
};

// ==========================================
// PRODUCTS
// ==========================================

const productsGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, 1fr)",
  gap: "22px",
  marginTop: "35px",
};

const productCardStyle = {
  overflow: "hidden",
  backgroundColor: "white",
  border:
    "1px solid #eef2f7",
  borderRadius: "16px",
  boxShadow:
    "0 8px 25px rgba(15,23,42,0.06)",
  cursor: "pointer",
  transition:
    "all 0.3s ease",
};

const productImageWrapperStyle = {
  position: "relative",
  height: "230px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  background:
    "linear-gradient(145deg, #f8fafc, #eef2ff)",
};

const productImageStyle = {
  width: "100%",
  height: "100%",
  padding: "22px",
  objectFit: "contain",
  transition:
    "transform 0.35s ease",
};

const productPlaceholderStyle = {
  fontSize: "70px",
};

const productCategoryBadgeStyle = {
  position: "absolute",
  top: "13px",
  left: "13px",
  padding:
    "5px 9px",
  borderRadius: "999px",
  backgroundColor:
    "rgba(255,255,255,0.9)",
  color: "#475569",
  fontSize: "10px",
  fontWeight: "700",
  boxShadow:
    "0 3px 10px rgba(15,23,42,0.06)",
};

const productInfoStyle = {
  padding: "18px",
};

const productRatingStyle = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  color: "#64748b",
  fontSize: "11px",
};

const productNameStyle = {
  margin:
    "7px 0 6px",
  color: "#0f172a",
  fontSize: "16px",
  fontWeight: "700",
};

const productDescriptionStyle = {
  height: "40px",
  margin: 0,
  overflow: "hidden",
  color: "#64748b",
  fontSize: "12px",
  lineHeight: "1.6",
};

const productBottomStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  marginTop: "17px",
};

const productPriceStyle = {
  color: "#0f172a",
  fontSize: "20px",
};

const stockBadgeStyle = {
  padding:
    "5px 8px",
  borderRadius: "6px",
  backgroundColor: "#ecfdf5",
  color: "#059669",
  fontSize: "9px",
  fontWeight: "800",
};

const outOfStockStyle = {
  backgroundColor: "#fef2f2",
  color: "#dc2626",
};

const loadingGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, 1fr)",
  gap: "22px",
  marginTop: "35px",
};

const skeletonCardStyle = {
  padding: "0 0 20px",
  overflow: "hidden",
  backgroundColor: "white",
  borderRadius: "16px",
};

const skeletonImageStyle = {
  height: "230px",
  backgroundColor: "#e2e8f0",
};

const skeletonLineLargeStyle = {
  width: "70%",
  height: "16px",
  margin:
    "18px 18px 10px",
  borderRadius: "5px",
  backgroundColor: "#e2e8f0",
};

const skeletonLineSmallStyle = {
  width: "45%",
  height: "10px",
  margin:
    "0 18px 18px",
  borderRadius: "5px",
  backgroundColor: "#e2e8f0",
};

const skeletonLinePriceStyle = {
  width: "30%",
  height: "15px",
  margin:
    "0 18px",
  borderRadius: "5px",
  backgroundColor: "#e2e8f0",
};

const emptyStyle = {
  marginTop: "35px",
  padding: "55px 20px",
  textAlign: "center",
  backgroundColor: "white",
  borderRadius: "16px",
};

const emptyIconStyle = {
  fontSize: "50px",
  marginBottom: "10px",
};

// ==========================================
// PROMO
// ==========================================

const promoSectionStyle = {
  position: "relative",
  maxWidth: "1180px",
  minHeight: "370px",
  margin:
    "20px auto 80px",
  padding:
    "55px 70px",
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "40px",
  overflow: "hidden",
  borderRadius: "22px",
  background:
    "linear-gradient(120deg, #4338ca, #6d28d9)",
  color: "white",
};

const promoGlowStyle = {
  position: "absolute",
  width: "350px",
  height: "350px",
  borderRadius: "50%",
  right: "-100px",
  top: "-100px",
  background:
    "rgba(255,255,255,0.1)",
  filter: "blur(20px)",
};

const promoContentStyle = {
  position: "relative",
  zIndex: 2,
  maxWidth: "650px",
};

const promoBadgeStyle = {
  fontSize: "10px",
  fontWeight: "800",
  letterSpacing: "1.5px",
  color: "#c7d2fe",
};

const promoTitleStyle = {
  margin:
    "14px 0",
  fontSize: "38px",
  lineHeight: "1.15",
  letterSpacing: "-1px",
};

const promoTextStyle = {
  maxWidth: "550px",
  margin: 0,
  color: "#ddd6fe",
  fontSize: "14px",
  lineHeight: "1.7",
};

const promoButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginTop: "25px",
  padding:
    "12px 18px",
  border: "none",
  borderRadius: "9px",
  backgroundColor: "white",
  color: "#4338ca",
  fontSize: "13px",
  fontWeight: "700",
  cursor: "pointer",
  transition:
    "transform 0.2s ease",
};

const promoVisualStyle = {
  position: "relative",
  width: "280px",
  height: "280px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const promoCircleLargeStyle = {
  width: "250px",
  height: "250px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  background:
    "rgba(255,255,255,0.07)",
  border:
    "1px solid rgba(255,255,255,0.12)",
};

const promoCircleMediumStyle = {
  width: "175px",
  height: "175px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  background:
    "rgba(255,255,255,0.08)",
};

const promoCircleSmallStyle = {
  width: "105px",
  height: "105px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "28px",
  background:
    "linear-gradient(145deg, #818cf8, #a78bfa)",
  fontSize: "48px",
  boxShadow:
    "0 20px 45px rgba(0,0,0,0.2)",
};

// ==========================================
// WHY US
// ==========================================

const whySectionStyle = {
  maxWidth: "1000px",
  margin: "0 auto",
  padding:
    "10px 24px 100px",
};

const whyHeaderStyle = {
  maxWidth: "650px",
  margin: "0 auto",
  textAlign: "center",
};

const gradientTextDarkStyle = {
  color: "#6366f1",
};

const whyGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(3, 1fr)",
  gap: "20px",
  marginTop: "40px",
};

const whyCardStyle = {
  padding: "27px",
  border:
    "1px solid #e2e8f0",
  borderRadius: "16px",
  backgroundColor: "white",
  boxShadow:
    "0 7px 20px rgba(15,23,42,0.04)",
  transition:
    "transform 0.25s ease",
};

const whyIconWrapperStyle = {
  width: "46px",
  height: "46px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "18px",
  borderRadius: "12px",
  backgroundColor: "#eef2ff",
  fontSize: "21px",
};

const whyCardTextStyle = {
  color: "#64748b",
  fontSize: "13px",
  lineHeight: "1.7",
};

// ==========================================
// FINAL CTA
// ==========================================

const finalCTAStyle = {
  padding:
    "100px 24px",
  textAlign: "center",
  background:
    "linear-gradient(180deg, #f8fafc, #eef2ff)",
};

const finalCTAContentStyle = {
  maxWidth: "650px",
  margin: "0 auto",
};

const finalCTABadgeStyle = {
  color: "#6366f1",
  fontSize: "10px",
  fontWeight: "800",
  letterSpacing: "2px",
};

const finalCTATitleStyle = {
  margin:
    "15px 0",
  fontSize:
    "clamp(34px, 5vw, 52px)",
  lineHeight: "1.1",
  letterSpacing: "-2px",
};

const finalCTATextStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "15px",
};

const finalCTAButtonStyle = {
  marginTop: "28px",
  padding:
    "14px 24px",
  border: "none",
  borderRadius: "10px",
  background:
    "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "white",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow:
    "0 10px 25px rgba(79,70,229,0.25)",
};

// ==========================================
// FOOTER
// ==========================================

const footerStyle = {
  padding:
    "45px 24px 20px",
  backgroundColor: "#0f172a",
  color: "white",
};

const footerInnerStyle = {
  maxWidth: "1180px",
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  gap: "40px",
};

const footerBrandStyle = {
  margin: 0,
  fontSize: "18px",
};

const footerDescriptionStyle = {
  maxWidth: "400px",
  margin:
    "10px 0 0",
  color: "#94a3b8",
  fontSize: "12px",
  lineHeight: "1.6",
};

const footerLinksStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "20px",
};

const footerLinkStyle = {
  color: "#cbd5e1",
  fontSize: "12px",
  textDecoration: "none",
  cursor: "pointer",
};

const footerBottomStyle = {
  maxWidth: "1180px",
  margin:
    "35px auto 0",
  paddingTop: "18px",
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  borderTop:
    "1px solid #1e293b",
  color: "#64748b",
  fontSize: "10px",
};

export default Home;