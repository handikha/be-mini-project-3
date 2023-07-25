import { Order, OrderItem } from "../../models/index.js";

const finalizeTransaction = async (req, res) => {
  try {
    let order = await Order.findByPk(req.params.id);
    const orderItems = await OrderItem.findAll({
      where: {
        orderId: req.body.orderId,
      },
    });
    let totalAmount = 0;
    orderItems.forEach((orderItem) => {
      totalAmount += orderItem.price * orderItem.quantity;
    });
    order.totalAmount = totalAmount;
    order.updatedAt = new Date();
    order.isPaid = true;
    order.payAmount = req.body.payAmount;
    order.payBackAmount = req.body.payBackAmount;
    order = await order.save();
    res.status(200).send(order);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    const orderItems = await OrderItem.findAll({
      where: {
        orderId: order.id,
      },
    });

    let totalAmount = 0;
    orderItems.forEach((orderItem) => {
      totalAmount += orderItem.price * orderItem.quantity;
    });
    order.totalAmount = totalAmount;

    const result = {
      order,
      orderItems,
    };
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export { finalizeTransaction, getTransactions };
