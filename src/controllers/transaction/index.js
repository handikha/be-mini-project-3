import { body, validationResult } from 'express-validator';
import db from '../../models/index.js';
import Order from '../../models/orders.js';
import OrderItem from '../../models/orderItems.js';
import Product from '../../models/products.js';

export const validate = method => {
  switch (method) {
    case 'createTransaction': {
      return [
        body('customerName', 'customerName is required').isString(),
        body('table', 'table is required').isInt(),
        body('userId', 'userId is required').isInt(),
        body('orderItems', 'orderItems is required').isArray(),
        body('orderItems.*.productId', 'productId is required').isInt(),
        body('orderItems.*.quantity', 'quantity is required').isInt(),
      ];
    }
    case 'updateTransaction': {
      return [
        body('orderId', 'orderId is required').isInt(),
        body('customerName', 'customerName is required').isString(),
        body('table', 'table is required').isInt(),
        body('userId', 'userId is required').isInt(),
        body('orderItems', 'orderItems is required').isArray(),
        body('orderItems.*.productId', 'productId is required').isInt(),
        body('orderItems.*.quantity', 'quantity is required').isInt(),
      ];
    }
    case 'payTransaction': {
      return [body('orderId', 'orderId is required').isInt(), body('payAmount', 'payAmount is required').isInt()];
    }
  }
};

export const createTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const transaction = await db.sequelize.transaction();
  try {
    const { userId, customerName, table, payAmount, orderItems } = req.body;

    let order = await Order.create(
      {
        userId: userId,
        customerName: customerName,
        table: table,
        totalAmount: 0,
        isPaid: false,
        payAmount: payAmount,
        changeAmount: 0,
      },
      { transaction }
    );
    await transaction.commit();

    const orderItemsWithOrderId = [];
    for (const orderItem of orderItems) {
      const product = await Product.findByPk(orderItem.productId);
      const orderItemPrice = product.price * orderItem.quantity;
      const orderItemWithOrderId = {
        orderId: order.id,
        productId: orderItem.productId,
        quantity: orderItem.quantity,
        price: orderItemPrice,
      };
      orderItemsWithOrderId.push(orderItemWithOrderId);
    }

    const savedOrderItems = await OrderItem.bulkCreate(orderItemsWithOrderId, {
      transaction,
    });
    await transaction.commit();
    res.status(200).json({ order: order, orderItems: savedOrderItems });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const result = [];
    const orders = await Order.findAll();
    for (const order of orders) {
      const orderItems = await OrderItem.findAll({
        where: { orderId: order.id },
      });
      result.push({ order: order, orderItems: orderItems });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransaction = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'order not found' });
    }
    const orderItems = await OrderItem.findAll({
      where: { orderId: order.id },
    });
    res.status(200).json({ order: order, orderItems: orderItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  const { userId, customerName, table, payAmount, orderItems } = req.body;

  const orderId = req.params.id;

  const transaction = await db.sequelize.transaction();

  try {
    let order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'order not found' });
    }

    await OrderItem.destroy({ where: { orderId: orderId } }, { transaction });
    const orderItemsWithOrderId = [];

    for (const orderItem of orderItems) {
      const product = await Product.findByPk(orderItem.productId);

      if (!product) {
        throw new Error('Product not found');
      }

      const orderItemPrice = product.price * orderItem.quantity;
      const orderItemWithOrderId = {
        orderId: order.id,
        productId: orderItem.productId,
        quantity: orderItem.quantity,
        price: orderItemPrice,
      };
      orderItemsWithOrderId.push(orderItemWithOrderId);
    }

    const savedOrderItems = await OrderItem.bulkCreate(orderItemsWithOrderId, {
      transaction,
    });

    let totalAmount = 0;
    for (const savedOrderItem of savedOrderItems) {
      totalAmount += savedOrderItem.price;
    }

    await Order.update(
      {
        userId: userId,
        customerName: customerName,
        table: table,
        totalAmount: totalAmount,
        changeAmount: payAmount - totalAmount,
        isPaid: true,
      },
      { where: { id: order.id }, transaction }
    );

    await transaction.commit();

    res.status(200).json({ order: order, orderItems: savedOrderItems });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ message: error.message });
  }
};

export const payTransaction = async (req, res) => {
  const { payAmount, orderId } = req.body;

  const transaction = await db.sequelize.transaction();

  const order = await Order.findByPk(orderId);

  if (!order) {
    return res.status(404).json({ message: 'order not found' });
  }

  try {
    const orderItems = await OrderItem.findAll({
      where: { orderId: order.id },
    });
    let totalAmount = 0;
    for (const orderItem of orderItems) {
      totalAmount += orderItem.price;
    }

    await Order.update(
      {
        isPaid: true,
        payAmount: payAmount,
        totalAmount: totalAmount,
        changeAmount: payAmount - totalAmount,
      },
      { where: { id: order.id }, transaction }
    );

    await transaction.commit();
    res.status(200).json({ order: order, orderItems: orderItems });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};
