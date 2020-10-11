const Sequelize = require("sequelize");

const connection = new Sequelize('login', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = connection;