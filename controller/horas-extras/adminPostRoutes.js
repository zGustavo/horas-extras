const Secretaria = require("../../model/secretaria");
const Setor = require("../../model/setor");
const SubSetor = require("../../model/subSetor");
const Funcionario = require("../../model/funcionario");
const bcrypt = require("bcryptjs");
const Horas = require("../../model/horas");
const util = require("../../config/functions");

// criação secretaria
exports.createSec = async (req, res) => {
  const { name } = req.body;

  try {
    const oldSec = await Secretaria.findOne({
      where: { nomeSecretaria: name },
    });

    if (oldSec)
      return res.status(400).json({ message: "Secretaria existente." });

    const newSec = await Secretaria.create({
      nomeSecretaria: name,
    });

    return res.status(200).json({ message: newSec });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
};

// criação setor
exports.createSetor = async (req, res) => {
  const { secId, setorName } = req.body;

  try {
    let counter = 5;
    const oldSetor = await Setor.findOne({
      where: {
        nomeSetor: setorName,
      },
    });

    if (oldSetor) return res.status(400).json({ message: "Setor existente." });

    const sec = await Secretaria.findOne({ where: { id: secId } });

    if (!sec)
      return res.status(400).json({
        message: "Secretaria não existente. Verifique as informações.",
      });

    const newSetor = sec.createSetor({
      nomeSetor: setorName,
    });
    counter++;

    return res
      .status(200)
      .json({ message: "Setor criado com sucess.", id: counter });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
};

// criação sub-setor
exports.subSetorCreate = async (req, res) => {
  const { setId, subSetorName } = req.body;

  try {
    const oldSubSetor = await SubSetor.findOne({
      where: { nomeSubSetor: subSetorName },
    });

    if (oldSubSetor)
      return res.status(400).json({ message: "Sub-Setor existente." });

    const set = await Setor.findOne({ where: { id: setId } });

    if (!set)
      return res
        .status(400)
        .json({ message: "Setor inexistente. Verifique as informações." });

    const newSubSetor = await set.createSubSetor({
      nomeSubSetor: subSetorName,
    });

    return res.status(200).json({ message: "Sub-Setor criado com sucesso." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
};

// criação funcionario
exports.criaFuncionario = async (req, res) => {
  try {
    let {
      mat,
      name,
      cpf,
      nascimento,
      senha,
      cargoC,
      cargoO,
      vinculo,
      salEf,
      salCom,
      tel,
      level,
      admissao,
      setID,
      chefiaId,
      secretarioId,
    } = req.body;

    let chefia;
    let secretario;

    if (senha === "") {
      senha = cpf.replace(/\D/g, "");
    }

    const encryptedSenha = await bcrypt.hash(senha, 16);

    const oldFunc = await Funcionario.findOne({
      where: {
        matricula: mat,
      },
    });

    if (oldFunc)
      return res.status(400).json({ message: "FUNCIONÁRIO JÁ EXISTE." });

    if (chefiaId) {

       chefia = await Funcionario.findOne({
        where: {
          id: chefiaId,
        },
      });
    }

    if (secretarioId) {

       secretario = await Funcionario.findOne({
        where: {
          id: secretarioId,
        },
      });
    }

    const newFunc = await Funcionario.create({
      matricula: mat,
      nome: name,
      senha: encryptedSenha,
      cpf: cpf,
      cargoComissao: cargoC,
      cargoOrigem: cargoO,
      level: Number(level),
      vinculo: vinculo ? vinculo : "EFETIVO - CLT",
      salarioEfetivo: salEf,
      salarioComissionado: salCom,
      dataNascimento: new Date(nascimento),
      telefone: tel ? tel : null,
      dataAdmissao: new Date(admissao),
      SubSetorId: setID,
      chefiaId: chefia ? chefia.id : null,
      secretarioId: secretario ? secretario.id : null,
    });

    return res
      .status(200)
      .json({ message: "FUNCIONÁRIO CADASTRADO COM SUCESSO." });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "ERRO AO CADASTRAR FUNCIONÁRIO. " + error.name });
  }
};

exports.fechamentoGeraLinkRel = async (req, res) => {
  const { array } = req.params;

  try {
    const ids = array.split(",");

    const numberedIds = ids.map((id) => Number(id));

    const hours = await Horas.findAll({
      where: { id: numberedIds },
      include: [{ model: Funcionario, include: [SubSetor] }],
    });

    const file = await util.createFechamentoRel(hours);
    const splitFile = file.split("\\");
    const fileName = splitFile[splitFile.length - 1];

    const funcs = await Funcionario.findAll();

    funcs.forEach(async (func) => {
      await func.update({
        totalDeHorasMes: 0,
      });

      await func.save();
    });

    hours.forEach(async (hour) => {
      await hour.update({
        ativo: "NAO",
      });

      await hour.save();
    });

    let link = `/sistema/hora-extra/admin/fechamento/get/${fileName}`;

    res.status(200).json({ message: "FECHAMENTO EFETUADO", link: link });
  } catch (error) {
    console.log(error);
  }
};
