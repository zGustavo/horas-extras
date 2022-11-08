const Sequelize = require("sequelize");
require("dotenv").config();

const dbPassword = process.env.PASSWORD;

const sequelize = new Sequelize("pref-horas_extras", "root", `${dbPassword}`, {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
