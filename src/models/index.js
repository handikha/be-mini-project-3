import User from "./user.js";
import Product from "./product.js";
import Category from "./category.js";
import Order from "./order.js";
import OrderItem from "./orderItem.js";

// User has many Orders, Orders belongs to User
User.hasMany(Order, {foreignKey: "userId"});
Order.belongsTo(User, {foreignKey: "userId"});

// Products belongs to Category, Category has many Products
Product.belongsTo(Category, {foreignKey: "categoryId"});
Category.hasMany(Product, {foreignKey: "categoryId"});

// Orders has many OrderItems, OrderItems belongs to Orders
Order.hasMany(OrderItem, {foreignKey: "orderId"});
OrderItem.belongsTo(Order, {foreignKey: "orderId"});

// Products has many OrderItems, OrderItems belongs to Products
Product.hasMany(OrderItem, {foreignKey: "productId"});
OrderItem.belongsTo(Product, {foreignKey: "productId"});

export {
    User,
    Product,
    Category,
    Order,
    OrderItem,
};
