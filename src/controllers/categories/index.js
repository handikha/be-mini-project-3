import Category from '../../models/categories.js';
import * as error from '../../midlewares/error.handler.js';
import { Op } from 'sequelize';
import Product from '../../models/products.js';

export const getAllCategories = async (req, res, next) => {
  try {
    const { sort, page, limit } = req.query;

    const options = {
      offset: page > 1 ? (page - 1) * +limit : 0,
      limit: limit ? +limit : 10,
    };
    const total = await Category?.count({ where: { status: { [Op.not]: 2 } } });
    const pages = Math.ceil(total / +limit);

    let categories;

    if (sort) {
      categories = await Category.findAll({
        where: { status: { [Op.not]: 2 } },
        order: [['name', sort]],
        ...options,
      });
    } else {
      categories = await Category.findAll({
        where: { status: { [Op.not]: 2 } },
        ...options,
      });
    }

    res.status(200).json({
      type: 'success',
      message: 'Categories fetched',
      total_elements: total,
      categories_per_page: +limit,
      current_page: +page,
      next_page: page < pages ? +page + 1 : null,
      total_pages: pages,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findOne({ where: { id: req.params.id } });
    if (!category) {
      throw new Error('Category not found');
    }
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const categoryExist = await Category.findOne({ where: { name, status: { [Op.not]: 2 } } });

    if (categoryExist) throw { status: 400, message: error.CATEGORY_ALREADY_EXISTS };

    const categories = await Category.create({ name });

    res.status(201).json({ message: 'Category created successfully', categories });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const category = await Category.findOne({ where: { id: req.params.id } });

    if (!category) {
      throw new Error('Category not found');
    }

    const categoryExist = await Category.findOne({
      where: { name: name },
    });

    if (categoryExist) throw { status: 400, message: error.CATEGORY_ALREADY_EXISTS };

    await category.update({ name });
    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ where: { id: req.params.id } });
    const products = await Product.findAll({ where: { categoryId: req.params.id, status: { [Op.not]: 2 } } });
    console.log(products);
    if (!category) {
      throw new Error('Category not found');
    }

    if (products.length > 0) {
      throw new Error('There are still products in the related category');
    }

    await category.update({ status: 2 });

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
