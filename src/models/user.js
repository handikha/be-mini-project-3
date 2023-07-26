import db from './index.js';

//@define user models
const User = db.sequelize.define('users', {
  id: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  fullName: {
    type: db.Sequelize.STRING,
    allowNull: false,
  },
  username: {
    type: db.Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: db.Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: db.Sequelize.STRING,
    allowNull: false,
  },
  phone: {
    type: db.Sequelize.STRING,
    allowNull: false,
  },
  role: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 2,
  },
  status: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  profileImg: {
    type: db.Sequelize.STRING,
  },
});

export default User;
