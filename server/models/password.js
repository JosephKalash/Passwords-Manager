const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Password = sequelize.define("password", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  value: {
    type: Sequelize.STRING(2048),
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  filepath: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Password;
