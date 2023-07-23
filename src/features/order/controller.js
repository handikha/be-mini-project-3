import {Order} from "../../models/index.js";

const getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.status(200).send(orders);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
}

const getOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        res.status(200).send(order);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
}

const createOrder = async (req, res) => {
    try {
        const order = await Order.create(req.body);
        res.status(201).send(order);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
}

const updateOrder = async (req, res) => {
    try {
        const order = await Order.update(req.body, {
            where: {
                id: req.params.id,
            },
        });
        res.status(200).send(order);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
}

const deleteOrder = async (req, res) => {
    try {
        let order = await Order.findByPk(req.params.id);
        order.isDeleted = true;
        order = await order.save();
        res.status(200).send(order);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
}

export {
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder
}