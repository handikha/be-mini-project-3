import { Product } from "../../models/index.js";

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).send(product);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
