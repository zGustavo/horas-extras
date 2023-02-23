const Sequelize = require("sequelize");

const sequelize = require("../db/db");

const Horas = require("./horas");

const Funcionario = sequelize.define(
  "Funcionario",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    nome: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    matricula: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    senha: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cpf: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cargoComissao: {
      type: Sequelize.STRING,
    },
    cargoOrigem: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    level: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    totalDeHorasMes: {
      type: Sequelize.DOUBLE,
      validate: { min: 0, max: 60 },
    },
    faltasAbonadas: {
      type: Sequelize.INTEGER,
      validate: { min: 0, max: 6 },
    },
    vinculo: {
      type: Sequelize.STRING,
      default: "EFETIVO - CLT",
    },
    dataAdmissao: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    salarioEfetivo: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    salarioComissionado: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    refSalarial: {
      type: Sequelize.STRING,
      default: "R5",
    },
    primeiroAcesso: {
      type: Sequelize.INTEGER,
      default: 0,
    },
    dataNascimento: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    telefone: {
      type: Sequelize.STRING,
    },
    perguntaSecreta: {
      type: Sequelize.STRING,
    },
    respostaSecreta: {
      type: Sequelize.STRING,
    },
    ativo: {
      type: Sequelize.STRING,
      default: "SIM",
    },
  },
  {
    freezeTableName: true,
  }
);

Funcionario.hasMany(Horas);
Horas.belongsTo(Funcionario);

Funcionario.hasMany(Funcionario, { as: "chefia", foreignKey: "chefiaId" });
Funcionario.hasMany(Funcionario, {
  as: "secretario",
  foreignKey: "secretarioId",
});

module.exports = Funcionario;
