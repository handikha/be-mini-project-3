import db from "./index.js";

const OrderItem = db.sequelize.define("orderItems", {
    id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    orderId: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
    },
    productId: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
    },
    price: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
    },
    createdAt: {
        type: db.Sequelize.DATE,
        allowNull: false,
        defaultValue: db.Sequelize.NOW,
    },
    updatedAt: {
        type: db.Sequelize.DATE,
        defaultValue: db.Sequelize.NOW,
    },
});

export default OrderItem;