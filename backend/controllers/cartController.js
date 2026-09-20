const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// ==========================================
// Validate Product ID
// ==========================================
const isValidProductId = (productId) => {
  return mongoose.Types.ObjectId.isValid(productId);
};

// ==========================================
// Validate Quantity
// ==========================================
const isValidQuantity = (quantity) => {
  return (
    typeof quantity === "number" &&
    Number.isInteger(quantity) &&
    quantity >= 1
  );
};

// ==========================================
// Get User Cart
// ==========================================
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    // Create an empty cart if user doesn't have one
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    res.status(200).json({
      cart,
    });
  } catch (error) {
    console.error("Get Cart Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Add Product to Cart
// ==========================================
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // ==========================================
    // Validate Product ID
    // ==========================================
    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    if (!isValidProductId(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    // ==========================================
    // Default quantity only when not provided
    // ==========================================
    const requestedQuantity =
      quantity === undefined ? 1 : quantity;

    // ==========================================
    // Validate Quantity
    // ==========================================
    if (!isValidQuantity(requestedQuantity)) {
      return res.status(400).json({
        message:
          "Quantity must be a positive integer",
      });
    }

    // ==========================================
    // Find Product
    // ==========================================
    const product = await Product.findById(
      productId
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // ==========================================
    // Check Stock
    // ==========================================
    if (product.stock < requestedQuantity) {
      return res.status(400).json({
        message:
          `Only ${product.stock} item(s) ` +
          `available in stock`,
      });
    }

    // ==========================================
    // Find User Cart
    // ==========================================
    let cart = await Cart.findOne({
      user: req.user._id,
    });

    // ==========================================
    // Create Cart if it doesn't exist
    // ==========================================
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [
          {
            product: productId,
            quantity: requestedQuantity,
          },
        ],
      });
    } else {
      // ==========================================
      // Check whether product already exists
      // ==========================================
      const existingItem = cart.items.find(
        (item) =>
          item.product.toString() === productId
      );

      if (existingItem) {
        const newQuantity =
          existingItem.quantity +
          requestedQuantity;

        // Check stock for total quantity
        if (newQuantity > product.stock) {
          return res.status(400).json({
            message:
              `Only ${product.stock} item(s) ` +
              `available in stock`,
          });
        }

        existingItem.quantity = newQuantity;
      } else {
        cart.items.push({
          product: productId,
          quantity: requestedQuantity,
        });
      }

      await cart.save();
    }

    // ==========================================
    // Get Updated Cart
    // ==========================================
    cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    res.status(200).json({
      message:
        "Product added to cart successfully",
      cart,
    });
  } catch (error) {
    console.error(
      "Add to Cart Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Update Cart Item Quantity
// ==========================================
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // ==========================================
    // Validate Product ID
    // ==========================================
    if (!productId || quantity === undefined) {
      return res.status(400).json({
        message:
          "Product ID and quantity are required",
      });
    }

    if (!isValidProductId(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    // ==========================================
    // Validate Quantity
    // ==========================================
    if (!isValidQuantity(quantity)) {
      return res.status(400).json({
        message:
          "Quantity must be a positive integer",
      });
    }

    // ==========================================
    // Find Product
    // ==========================================
    const product = await Product.findById(
      productId
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // ==========================================
    // Check Stock
    // ==========================================
    if (quantity > product.stock) {
      return res.status(400).json({
        message:
          `Only ${product.stock} item(s) ` +
          `available in stock`,
      });
    }

    // ==========================================
    // Find User Cart
    // ==========================================
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    // ==========================================
    // Find Cart Item
    // ==========================================
    const cartItem = cart.items.find(
      (item) =>
        item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        message: "Product is not in cart",
      });
    }

    // ==========================================
    // Update Quantity
    // ==========================================
    cartItem.quantity = quantity;

    await cart.save();

    const updatedCart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    res.status(200).json({
      message: "Cart updated successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error(
      "Update Cart Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Remove Product from Cart
// ==========================================
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // ==========================================
    // Validate Product ID
    // ==========================================
    if (!isValidProductId(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const itemExists = cart.items.some(
      (item) =>
        item.product.toString() === productId
    );

    if (!itemExists) {
      return res.status(404).json({
        message: "Product is not in cart",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    res.status(200).json({
      message:
        "Product removed from cart successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error(
      "Remove From Cart Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Clear Cart
// ==========================================
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error(
      "Clear Cart Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};