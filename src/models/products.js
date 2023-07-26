import db from './index.js';

const Product = db.sequelize.define('products', {
  id: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: db.Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
  },
  description: {
    type: db.Sequelize.STRING,
    allowNull: false,
  },
  image: {
    type: db.Sequelize.STRING,
  },
  status: {
    type: db.Sequelize.STRING,
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
  categoryId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
  },
});

export default Product;
