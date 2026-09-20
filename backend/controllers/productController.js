const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");

// ==========================================
// Upload Image to Cloudinary
// ==========================================
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "mern-ecommerce/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
};

// ==========================================
// Validate Product Data
// ==========================================
const validateProductData = ({
  name,
  description,
  price,
  category,
  stock,
}) => {
  if (
    name === undefined ||
    description === undefined ||
    category === undefined ||
    price === undefined ||
    stock === undefined
  ) {
    return "Please provide name, description, price, category and stock";
  }

  if (
    typeof name !== "string" ||
    !name.trim()
  ) {
    return "Product name is required";
  }

  if (
    typeof description !== "string" ||
    !description.trim()
  ) {
    return "Product description is required";
  }

  if (
    typeof category !== "string" ||
    !category.trim()
  ) {
    return "Product category is required";
  }

  const numericPrice = Number(price);
  const numericStock = Number(stock);

  if (
    price === "" ||
    !Number.isFinite(numericPrice) ||
    numericPrice < 0
  ) {
    return "Price must be a valid non-negative number";
  }

  if (
    stock === "" ||
    !Number.isInteger(numericStock) ||
    numericStock < 0
  ) {
    return "Stock must be a valid non-negative integer";
  }

  return null;
};

// ==========================================
// Create Product
// ==========================================
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
    } = req.body;

    const validationError = validateProductData({
      name,
      description,
      price,
      category,
      stock,
    });

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    let imageUrl = null;

    // Upload image if provided
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer
      );

      imageUrl = result.secure_url;
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      stock: Number(stock),
      images: imageUrl ? [imageUrl] : [],
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(
      "Create Product Error:",
      error
    );

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid product data",
      });
    }

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Get All Products
// ==========================================
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(
      "Get Products Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Get Single Product
// ==========================================
const getProductById = async (req, res) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      product,
    });
  } catch (error) {
    console.error(
      "Get Product Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Update Product
// ==========================================
const updateProduct = async (req, res) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const {
      name,
      description,
      price,
      category,
      stock,
    } = req.body;

    // ==========================================
    // Validate only fields that are being updated
    // ==========================================
    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
        return res.status(400).json({
          message: "Product name is required",
        });
      }

      product.name = name.trim();
    }

    if (description !== undefined) {
      if (
        typeof description !== "string" ||
        !description.trim()
      ) {
        return res.status(400).json({
          message:
            "Product description is required",
        });
      }

      product.description =
        description.trim();
    }

    if (category !== undefined) {
      if (
        typeof category !== "string" ||
        !category.trim()
      ) {
        return res.status(400).json({
          message:
            "Product category is required",
        });
      }

      product.category = category.trim();
    }

    if (price !== undefined) {
      const numericPrice = Number(price);

      if (
        price === "" ||
        !Number.isFinite(numericPrice) ||
        numericPrice < 0
      ) {
        return res.status(400).json({
          message:
            "Price must be a valid non-negative number",
        });
      }

      product.price = numericPrice;
    }

    if (stock !== undefined) {
      const numericStock = Number(stock);

      if (
        stock === "" ||
        !Number.isInteger(numericStock) ||
        numericStock < 0
      ) {
        return res.status(400).json({
          message:
            "Stock must be a valid non-negative integer",
        });
      }

      product.stock = numericStock;
    }

    // ==========================================
    // Upload new image if provided
    // ==========================================
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer
      );

      product.images = [
        result.secure_url,
      ];
    }

    const updatedProduct =
      await product.save();

    res.status(200).json({
      message:
        "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(
      "Update Product Error:",
      error
    );

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid product data",
      });
    }

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Delete Product
// ==========================================
const deleteProduct = async (req, res) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Product Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Export Controllers
// ==========================================
module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};