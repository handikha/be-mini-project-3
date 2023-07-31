import Product from '../../models/products.js';
import Category from '../../models/categories.js';
import fs from 'fs';
import path from 'path';
import db from '../../models/index.js';
import { Op } from 'sequelize';
import { inputProductValidationSchema, updateProductValidationSchema } from './validation.js';
import { ValidationError } from 'yup';

const getProductsByRoleAndStatus = async (role, status, category_id, keywords, options) => {
  let total;
  let products;

  if (role === 1) {
    total = category_id
      ? await Product?.count({ where: { categoryId: category_id, status: status } })
      : await Product?.count({
          where: {
            name: {
              [Op.like]: `%${keywords}%`,
            },
            status: status,
          },
        });

    products = await Product.findAll({
      where: category_id
        ? {
            categoryId: category_id,
            name: {
              [Op.like]: `%${keywords}%`,
            },
            status: { [Op.not]: status },
          }
        : keywords
        ? {
            name: {
              [Op.like]: `%${keywords}%`,
            },
            status: { [Op.not]: status },
          }
        : { status: { [Op.not]: status } },
      ...options,
    });
  } else if (role === 2) {
    total = category_id
      ? await Product?.count({ where: { categoryId: category_id, status: 1 } })
      : await Product?.count({
          where: {
            name: {
              [Op.like]: `%${keywords}%`,
            },
            status: 1,
          },
        });

    products = await Product.findAll({
      where: category_id
        ? {
            categoryId: category_id,
            name: {
              [Op.like]: `%${keywords}%`,
            },
            status: 1,
          }
        : keywords
        ? {
            name: {
              [Op.like]: `%${keywords}%`,
            },
            status: 1,
          }
        : { status: 1 },
      ...options,
    });
  }

  return { total, products };
};

export const getAllProducts = async (req, res, next) => {
  try {
    const { page, limit, category_id, sort_name, sort_price, keywords } = req.query;
    const userRole = req.user.role;

    const options = {
      offset: page > 1 ? (page - 1) * limit : 0,
      limit: limit ? parseInt(limit) : 10,
    };

    let orderOptions = [];

    if (sort_name === 'ASC') {
      orderOptions.push(['name', 'ASC']);
    } else if (sort_name === 'DESC') {
      orderOptions.push(['name', 'DESC']);
    }

    if (sort_price === 'ASC') {
      orderOptions.push(['price', 'ASC']);
    } else if (sort_price === 'DESC') {
      orderOptions.push(['price', 'DESC']);
    }

    if (orderOptions.length === 0) {
      orderOptions.push(['name', 'ASC']);
    }

    const { total, products } = await getProductsByRoleAndStatus(userRole, 2, category_id, keywords, {
      order: orderOptions,
      ...options,
    });

    for (const product of products) {
      const category = await Category.findByPk(product.categoryId);
      product.setDataValue('category', category);
    }

    const pages = Math.ceil(total / options.limit);

    res.status(200).json({
      type: 'success',
      message: 'Products fetched',
      total_elements: total,
      blog_per_page: +limit,
      current_page: +page,
      next_page: page < pages ? parseInt(page) + 1 : null,
      total_pages: pages,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id } });
    if (!product) {
      throw new Error('Product not found');
    }
    res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();
  let thumbnail = null;

  try {
    const { data } = req.body;
    const body = JSON.parse(data);

    if (req?.files?.['file'] && Array.isArray(req?.files?.['file'])) {
      thumbnail = req.files['file'][0]?.filename;
    }

    const productData = {
      name: body?.name,
      price: +body?.price,
      description: body?.description,
      categoryId: +body?.categoryId,
      image: thumbnail ? 'public/images/thumbnails/' + thumbnail : null,
    };

    await inputProductValidationSchema.validate(productData);

    const productExists = await Product.findOne({
      where: { name: body.name, status: { [Op.not]: 2 } },
    });

    if (productExists) {
      throw new Error('Product already exists');
    }

    const product = await Product.create(productData);

    res.status(200).json({ message: 'Product Added Successfully', data: product });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    if (error instanceof ValidationError) {
      return next({ status: 400, message: error?.errors?.[0] });
    }

    if (thumbnail) {
      fs.unlink(path.join(process.cwd(), 'public', 'images', 'thumbnails', thumbnail), err => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully');
        }
      });
    }

    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;
    const { data } = req.body;
    const body = JSON.parse(data);

    const product = await Product.findOne({ where: { id } });

    if (!product) {
      throw new Error('Product not found');
    }

    const productExists = await Product.findOne({
      where: { name: body.name, status: { [Op.not]: 2 } },
    });

    if (productExists) {
      throw new Error('Product already exists');
    }

    if (req.files && req.files.file) {
      const oldThumbnailPath = path.join(process.cwd(), 'public', 'images', 'thumbnails', product.image);
      fs.unlink(oldThumbnailPath, error => {
        if (error) {
          console.error('Error deleting file:', error);
        } else {
          console.log('Old file deleted successfully');
        }
      });

      const thumbnail = req.files.file[0].filename;
      product.image = 'public/images/thumbnails/' + thumbnail;
    } else {
      product.image = product.image;
    }

    const productData = {
      name: body?.name,
      price: +body?.price,
      description: body?.description,
      categoryId: +body?.categoryId,
    };

    await updateProductValidationSchema.validate(productData);

    product.name = body.name || product.name;
    product.price = +body.price || product.price;
    product.description = body.description || product.description;
    product.categoryId = +body.categoryId || product.categoryId;
    product.status = body.status;

    await product.save();

    await transaction.commit();
    res.status(200).json({ message: 'Product updated successfully', data: product });
  } catch (error) {
    await transaction.rollback();
    if (error instanceof ValidationError) {
      return next({ status: 400, message: error?.errors?.[0] });
    }

    if (req.files && req.files.file) {
      fs.unlink(path.join(process.cwd(), 'public', 'images', 'thumbnails', req.files.file[0].filename), error => {
        if (error) {
          console.error('Error deleting file:', error);
        } else {
          console.log('File deleted successfully');
        }
      });
    }

    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const productExist = await Product.findOne({ where: { id } });

    if (!productExist) {
      throw new Error('Product not found');
    }

    const thumbnailFilename = productExist.image.split('/').pop();

    await productExist.update({ status: 2 });

    fs.unlink(path.join(process.cwd(), 'public', 'images', 'thumbnails', thumbnailFilename), error => {
      if (error) {
        console.error('Error deleting file:', error);
      } else {
        console.log('File deleted successfully');
      }
    });

    res.status(200).json({ message: 'Product deleted successfully' });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
