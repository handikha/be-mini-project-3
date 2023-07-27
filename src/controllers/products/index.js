import Product from '../../models/products.js';
import Category from '../../models/categories.js';
import fs from 'fs';
import path from 'path';
import db from '../../models/index.js';

export const getAllProducts = async (req, res, next) => {
  try {
    const { page, limit, category_id, sort } = req.query;

    const options = {
      offset: page > 1 ? (page - 1) * limit : 0,
      limit: limit ? parseInt(limit) : 10,
    };

    const total = category_id ? await Product?.count({ where: { categoryId: category_id } }) : await Product?.count();

    const pages = Math.ceil(total / options.limit);
    const products = await Product.findAll({
      where: category_id ? { categoryId: category_id } : {},
      order: [['name', sort ? sort : 'ASC']],
      ...options,
    });
    for (const product of products) {
      const category = await Category.findByPk(product.categoryId);
      product.setDataValue('category', category);
    }
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
  const thumbnail = req?.files?.['file'][0]?.filename;
  try {
    const { data } = req.body;
    const body = JSON.parse(data);
    console.log(data);
    const productExists = await Product?.findOne({
      where: { name: body.name },
    });

    if (productExists) {
      throw new Error('Product already exists');
    }
    const product = await Product?.create({
      name: body?.name,
      price: body?.price,
      description: body?.description,
      categoryId: +body?.categoryId,
      image: 'public/images/thumbnails/' + thumbnail,
    });

    res.status(200).json({ message: 'Product Added Successfully', data: product });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    fs.unlink(path.join(process.cwd(), 'public', 'images', 'thumbnails', thumbnail), error => {
      if (error) {
        console.error('Error deleting file:', error);
        return;
      }
      console.log('File deleted successfully');
    });
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

    if (req.files && req.files.file) {
      fs.unlink(path.join(product.image), error => {
        if (error) {
          console.error('Error deleting file:', error);
        } else {
          console.log('Old file deleted successfully');
        }
      });

      const thumbnail = req.files.file[0].filename;
      product.image = 'public/images/thumbnails/' + thumbnail;
    }

    product.name = body.name || product.name;
    product.price = body.price || product.price;
    product.description = body.description || product.description;
    product.categoryId = +body.categoryId || product.categoryId;
    product.status = body.status || product.status;

    await product.save();

    res.status(200).json({ message: 'Product updated successfully', data: product });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    // Jika terjadi kesalahan, hapus gambar yang mungkin sudah terunggah
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

    await Product.destroy({ where: { id } });

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
