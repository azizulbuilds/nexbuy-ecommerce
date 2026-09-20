const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");

// ==========================================
// Create Order from Cart
// ==========================================
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode ||
      !shippingAddress.phone
    ) {
      return res.status(400).json({
        message: "Complete shipping address is required",
      });
    }

    const selectedPaymentMethod = paymentMethod || "COD";

    if (!["COD", "RAZORPAY"].includes(selectedPaymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty",
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        return res.status(404).json({
          message: `Product ${item.product.name} no longer exists`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Only ${product.stock} item(s) of ${product.name} are available`,
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image:
          product.images && product.images.length > 0
            ? product.images[0]
            : null,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || "India",
        phone: shippingAddress.phone,
      },
      totalAmount,
      paymentMethod: selectedPaymentMethod,
      paymentStatus: "PENDING",
      orderStatus: "PLACED",
    });

    // ==========================================
    // COD
    // Reduce stock and clear cart immediately
    // ==========================================
    if (selectedPaymentMethod === "COD") {
      for (const item of cart.items) {
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: item.product._id,
            stock: { $gte: item.quantity },
          },
          {
            $inc: {
              stock: -item.quantity,
            },
          },
          {
            new: true,
          }
        );

        if (!updatedProduct) {
          return res.status(400).json({
            message: `Insufficient stock for ${item.product.name}`,
          });
        }
      }

      cart.items = [];
      await cart.save();
    }

    // ==========================================
    // RAZORPAY
    // Stock and cart remain unchanged until
    // successful payment verification.
    // ==========================================

    const populatedOrder = await Order.findById(
      order._id
    ).populate("user", "name email");

    res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Create Razorpay Order
// ==========================================
const createRazorpayOrder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.paymentMethod !== "RAZORPAY") {
      return res.status(400).json({
        message: "This order is not configured for Razorpay payment",
      });
    }

    if (order.paymentStatus === "PAID") {
      return res.status(400).json({
        message: "Order has already been paid",
      });
    }

    if (order.razorpayOrderId) {
      return res.status(400).json({
        message: "Razorpay order already exists",
        razorpayOrderId: order.razorpayOrderId,
      });
    }

    const amountInPaise = Math.round(order.totalAmount * 100);

    if (amountInPaise <= 0) {
      return res.status(400).json({
        message: "Invalid order amount",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: order._id.toString(),
    });

    order.razorpayOrderId = razorpayOrder.id;

    await order.save();

    res.status(200).json({
      message: "Razorpay order created successfully",
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(
      "Create Razorpay Order Error:",
      error
    );

    res.status(500).json({
      message: "Unable to create Razorpay order",
    });
  }
};

// ==========================================
// Verify Razorpay Payment
// ==========================================
const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    // ==========================================
    // Validate required payment information
    // ==========================================
    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: "Payment verification details are required",
      });
    }

    // ==========================================
    // Find order belonging to logged-in user
    // ==========================================
    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // ==========================================
    // Ensure this is a Razorpay order
    // ==========================================
    if (order.paymentMethod !== "RAZORPAY") {
      return res.status(400).json({
        message: "Invalid payment method for this order",
      });
    }

    // ==========================================
    // Prevent duplicate payment processing
    // ==========================================
    if (order.paymentStatus === "PAID") {
      return res.status(400).json({
        message: "Order has already been paid",
      });
    }

    // ==========================================
    // Verify Razorpay signature
    // ==========================================
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${order.razorpayOrderId}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }

    // ==========================================
    // Verify payment belongs to this Razorpay order
    // ==========================================
    let razorpayPayment;

    try {
      razorpayPayment =
        await razorpay.payments.fetch(
          razorpay_payment_id
        );
    } catch (paymentError) {
      console.error(
        "Razorpay Payment Fetch Error:",
        paymentError
      );

      return res.status(400).json({
        message: "Unable to verify Razorpay payment",
      });
    }

    if (
      !razorpayPayment ||
      razorpayPayment.order_id !==
        order.razorpayOrderId
    ) {
      return res.status(400).json({
        message:
          "Payment does not belong to this order",
      });
    }

    // ==========================================
    // Verify payment amount
    // ==========================================
    const expectedAmount = Math.round(
      order.totalAmount * 100
    );

    if (
      Number(razorpayPayment.amount) !==
      expectedAmount
    ) {
      return res.status(400).json({
        message: "Payment amount does not match order amount",
      });
    }

    // ==========================================
    // Verify payment status
    // ==========================================
    if (
      !["authorized", "captured"].includes(
        razorpayPayment.status
      )
    ) {
      return res.status(400).json({
        message:
          `Payment is not successful. Current status: ${razorpayPayment.status}`,
      });
    }

    // ==========================================
    // Payment verified successfully
    // Now reduce stock
    // ==========================================
    for (const item of order.items) {
      const updatedProduct =
        await Product.findOneAndUpdate(
          {
            _id: item.product,
            stock: { $gte: item.quantity },
          },
          {
            $inc: {
              stock: -item.quantity,
            },
          },
          {
            new: true,
          }
        );

      if (!updatedProduct) {
        return res.status(400).json({
          message:
            `Insufficient stock for ${item.name}. ` +
            `Payment was verified, but the order could not be fulfilled.`,
        });
      }
    }

    // ==========================================
    // Remove purchased items from cart
    // ==========================================
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (cart) {
      for (const item of order.items) {
        const cartItem = cart.items.find(
          (cartItem) =>
            cartItem.product.toString() ===
            item.product.toString()
        );

        if (cartItem) {
          cartItem.quantity -= item.quantity;

          if (cartItem.quantity <= 0) {
            cart.items = cart.items.filter(
              (cartItem) =>
                cartItem.product.toString() !==
                item.product.toString()
            );
          }
        }
      }

      await cart.save();
    }

    // ==========================================
    // Mark payment/order as successful
    // ==========================================
    order.razorpayPaymentId =
      razorpay_payment_id;

    order.razorpaySignature =
      razorpay_signature;

    order.paymentStatus = "PAID";
    order.orderStatus = "PROCESSING";

    await order.save();

    res.status(200).json({
      message: "Payment verified successfully",
      order: {
        _id: order._id,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        razorpayOrderId:
          order.razorpayOrderId,
        razorpayPaymentId:
          order.razorpayPaymentId,
      },
    });
  } catch (error) {
    console.error(
      "Verify Razorpay Payment Error:",
      error
    );

    res.status(500).json({
      message: "Payment verification failed",
    });
  }
};

// ==========================================
// Get My Orders
// ==========================================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get My Orders Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Get Single My Order
// ==========================================
const getMyOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      order,
    });
  } catch (error) {
    console.error(
      "Get Order Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getMyOrders,
  getMyOrderById,
};