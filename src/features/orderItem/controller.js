import {OrderItem} from "../../models/index.js";

const getOrderItems = async (req, res) => {
    try {
        const orderItems = await OrderItem.findAll();
        res.status(200).send(orderItems);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
}

const getOrderItem = async (req, res) => {
    try {
        const orderItem = await OrderItem.findByPk(req.params.id);
        res.status(200).send(orderItem);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
}

const createOrderItem = async (req, res) => {
    try {
        const orderItem = await OrderItem.create(req.body);
        res.status(201).send(orderItem);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
}

const updateOrderItem = async (req, res) => {
    try {
        const orderItem = await OrderItem.update(req.body, {
            where: {
                id: req.params.id,
            },
        });
        res.status(200).send(orderItem);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
}

const deleteOrderItem = async (req, res) => {
    try {
        let orderItem = await OrderItem.findByPk(req.params.id);
        orderItem.isDeleted = true;
        orderItem = await orderItem.save();
        res.status(200).send(orderItem);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
}

export {
    getOrderItems,
    getOrderItem,
    createOrderItem,
    updateOrderItem,
    deleteOrderItem
}