import {DataTypes} from "sequelize";
import sequelize from "../config/database.js";

const Order = sequelize.define("orders", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    userId: DataTypes.INTEGER,
    customerName: DataTypes.STRING,
    table: DataTypes.INTEGER,
    totalAmount: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});

export default Order;
