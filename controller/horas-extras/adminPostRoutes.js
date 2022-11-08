const Secretaria = require("../../model/secretaria");
const Setor = require("../../model/setor");
const SubSetor = require("../../model/subSetor");
const Funcionario = require("../../model/funcionario");
const bcrypt = require("bcryptjs");

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
      setID,
      salEf,
      salCom,
      tel,
      level,
      admissao,
    } = req.body;

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
