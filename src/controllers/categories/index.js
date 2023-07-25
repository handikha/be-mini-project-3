import Category from "../../models/categories.js";
import * as error from "../../midlewares/error.handler.js";

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findOne({ where: { id: req.params.id } });
    if (!category) {
      throw new Error("Category not found");
    }
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const categoryExist = await Category.findOne({ where: { name } });

    if (categoryExist)
      throw { status: 400, message: error.CATEGORY_ALREADY_EXISTS };

    const categories = await Category.create({ name });

    res
      .status(201)
      .json({ message: "Category created successfully", categories });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const category = await Category.findOne({ where: { id: req.params.id } });

    if (!category) {
      throw new Error("Category not found");
    }

    const categoryExist = await Category.findOne({
      where: { name: name },
    });

    if (categoryExist)
      throw { status: 400, message: error.CATEGORY_ALREADY_EXISTS };

    await category.update({ name });
    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ where: { id: req.params.id } });
    if (!category) {
      throw new Error("Category not found");
    }

    await category.destroy({ where: { id: req.params.id } });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};
