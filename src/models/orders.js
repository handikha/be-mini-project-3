import db from './index.js';

const Order = db.sequelize.define('orders', {
  id: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
  },
  customerName: {
    type: db.Sequelize.STRING,
    allowNull: false,
  },
  table: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
  },
  totalAmount: {
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
  payAmount: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
  },
  changeAmount: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
  },
  isPaid: {
    type: db.Sequelize.BOOLEAN,
    allowNull: false,
  },
});

export default Order;
