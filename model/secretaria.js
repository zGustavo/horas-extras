const Sequelize = require("sequelize");

const sequelize = require("../db/db");

const Setor = require("../model/setor");

const Secretaria = sequelize.define(
  "Secretaria",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    nomeSecretaria: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

Secretaria.hasMany(Setor);
Setor.belongsTo(Secretaria);

module.exports = Secretaria;
