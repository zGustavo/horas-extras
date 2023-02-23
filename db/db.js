const Sequelize = require("sequelize");
require("dotenv").config();

const dbPassword = process.env.PASSWORD;

const sequelize = new Sequelize("sistemassalto_prefeitura", "root", `${dbPassword}`, {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
