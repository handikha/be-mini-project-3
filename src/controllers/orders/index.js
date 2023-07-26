import { body, validationResult } from 'express-validator';
import db from '../../models/index.js';
import Order from '../../models/orders.js';
import OrderItem from '../../models/orderItems.js';

export const validate = method => {
  switch (method) {
    case 'createOrder': {
      return [
        body('userId', 'userId is required').isInt(),
        body('customerName', 'customerName is required').isString(),
        body('table', 'table is required').isInt(),
      ];
    }
    case 'updateOrder': {
      return [
        body('orderId', 'orderId is required').isInt(),
        body('customerName', 'customerName is required').isString(),
        body('table', 'table is required').isInt(),
      ];
    }
    case 'payOrder': {
      return [body('orderId', 'orderId is required').isInt(), body('payAmount', 'payAmount is required').isInt()];
    }
  }
};

export const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const transaction = await db.sequelize.transaction();
  console.log(req.body);
  try {
    const { userId, customerName, table } = req.body;
    const order = await Order.create(
      {
        userId: userId,
        customerName: customerName,
        table: table,
        totalAmount: 0,
        isPaid: false,
        payAmount: 0,
        changeAmount: 0,
      },
      { transaction }
    );
    console.log(order);
    await transaction.commit();
    res.status(200).json({ order });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  const { page, limit, sort } = req.query;

  const options = {
    offset: page > 1 ? (page - 1) * limit : 0,
    limit: limit ? parseInt(limit) : 10,
  };

  const total = await Order?.count();
  const pages = Math.ceil(total / options.limit);
  const orders = await Order.findAll({
    order: [['id', sort ? sort : 'ASC']],
    ...options,
  });

  res.status(200).json({
    type: 'success',
    message: 'Orders fetched',
    total_elements: total,
    blog_per_page: +limit,
    current_page: +page,
    next_page: page < pages ? parseInt(page) + 1 : null,
    total_pages: pages,
    data: orders,
  });
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id } });
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
    }
    const orderItems = await OrderItem.findAll({
      where: { orderId: req.params.id },
    });
    res.status(200).json({
      order: order,
      orderItems: orderItems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const transaction = await db.sequelize.transaction();
  try {
    const { customerName, table, orderId } = req.body;

    const order = await Order.findOne({ where: { id: orderId } });
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
    }

    order.customerName = customerName;
    order.table = table;
    await order.save({ transaction });
    await transaction.commit();

    res.status(200).json({ order });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

export const payOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const transaction = await db.sequelize.transaction();

  try {
    const { orderId, payAmount } = req.body;

    const order = await Order.findOne({ where: { id: orderId } });
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
    }

    let totalAmount = 0;
    OrderItem.findAll({ where: { orderId: orderId } }).then(orderItems => {
      totalAmount = orderItems.reduce((total, orderItem) => {
        return total + orderItem.price * orderItem.quantity;
      }, 0);
    });

    order.payAmount = payAmount;
    order.status = 'paid';
    order.totalAmount = totalAmount;
    order.changeAmount = order.totalAmount - payAmount;

    await order.save({ transaction });
    await transaction.commit();

    res.status(200).json({ order });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id } });
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
    }
    await order.destroy();
    res.status(200).json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
