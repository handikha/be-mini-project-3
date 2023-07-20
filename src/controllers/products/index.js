import Product from "../../models/products.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const products = await Product.findById(req.params.id);
    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const products = await Product.create(req.body);
    res.status(201).json({ products });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const products = await Product.findById(req.params.id);
    if (!products) {
      throw new Error("Product not found");
    }
    Object.assign(products, req.body);
    await products.save();
    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const products = await Product.findById(req.params.id);
    if (!products) {
      throw new Error("Product not found");
    }
    await products.remove();
    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};
