const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const SharedPass = sequelize.define("sharedPass", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  value: {
    type: Sequelize.STRING(4096),
    allowNull: false,
  },
  sednerId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  senderPublicKey: {
    type: Sequelize.STRING(4096),
    allowNull: false,
  },
  signature: {
    type: Sequelize.STRING(4096),
    allowNull: false,
  },
});

module.exports = SharedPass;
