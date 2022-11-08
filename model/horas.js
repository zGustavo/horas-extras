const Sequelize = require("sequelize");

const sequelize = require("../db/db");
const Funcionario = require("./funcionario");

const Horas = sequelize.define(
  "Horas",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    diaSolicitado: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    dataDoPedido: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    horarioEntrada: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    horarioSaida: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    totalDeHorasPedido: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    justificativa: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      default: 1,
    },
    anexoPedido: {
      type: Sequelize.STRING,
    },
  },
  { freezeTableName: true }
);

module.exports = Horas;
