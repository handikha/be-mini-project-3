import db from './index.js';

const Category = db.sequelize.define('categories', {
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
  status: {
    type: db.Sequelize.STRING,
    allowNull: false,
    defaultValue: 1,
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

export default Category;
