const Sequelize = require('sequelize');

const sequelize = new Sequelize('issproject', 'root', '1423', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
