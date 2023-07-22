import {DataTypes} from "sequelize";
import sequelize from "../config/database.js";

const Product = sequelize.define(
    "products",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: DataTypes.STRING,
        price: DataTypes.INTEGER,
        description: DataTypes.STRING,
        image: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        categoryId: DataTypes.INTEGER,
    },
    {
        indexes: [
            {
                name: "categoryId",
                fields: ["categoryId"],
            },
        ],
    }
);

export default Product;
