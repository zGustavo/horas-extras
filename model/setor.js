const Sequelize = require("sequelize");

const sequelize = require("../db/db");

const SubSetor = require("../model/subSetor");

const Setor = sequelize.define(
  "Setor",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      allowNull: false,
    },
    nomeSetor: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    totalDeHorasSetorMes: {
      type: Sequelize.DOUBLE,
    },
    totalDePedidosHorasSetorMes: {
      type: Sequelize.INTEGER,
    },
  },
  { freezeTableName: true }
);

Setor.hasMany(SubSetor);
SubSetor.belongsTo(Setor);

module.exports = Setor;
