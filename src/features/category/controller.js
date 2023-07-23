import { Category } from "../../models/index.js";

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).send(categories);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    res.status(200).send(category);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).send(category);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).send(category);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).send(category);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
