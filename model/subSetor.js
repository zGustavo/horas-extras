const Sequelize = require("sequelize");

const sequelize = require("../db/db");

const Funcionario = require("../model/funcionario");

const SubSetor = sequelize.define("SubSetor", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: true,
  },
  nomeSubSetor: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  totalSubSetorHorasMes: {
    type: Sequelize.DOUBLE,
  },
  totalPedidosSubSetorMes: {
    type: Sequelize.INTEGER,
  },
});

SubSetor.hasMany(Funcionario);
Funcionario.belongsTo(SubSetor);

module.exports = SubSetor;
