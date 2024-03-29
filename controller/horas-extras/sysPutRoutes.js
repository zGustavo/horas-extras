const Funcionario = require("../../model/funcionario");
const bcrypt = require("bcryptjs");
const Horas = require("../../model/horas");
const util = require("../../config/functions");
require("dotenv").config();

exports.updateFuncionarioPass = async (req, res) => {
  const { password, matricula, email, secret, secretAnswer } = req.body;

  try {
    const func = await Funcionario.findOne({ where: { matricula } });
    if (!func)
      return res
        .status(400)
        .json({ message: "Algo deu errado, não encontramos o funcionário." });

    const newEncrptedPassword = await bcrypt.hash(password, 16);

    await func.update({
      senha: newEncrptedPassword,
      email: email ? email : null,
      primeiroAcesso: 1,
      perguntaSecreta: secret,
      respostaSecreta: secretAnswer,
    });

    await func.save();

    return res
      .status(200)
      .clearCookie("fauth")
      .json({ message: "Dados atualizados com sucesso." });
  } catch (error) {
    console.log(error);
  }
};

// aprova single hora extra
exports.singleAprovOvertime = async (req, res) => {
  const { id } = req.params;
  const { user } = req.user;

  try {
    const solicit = await Horas.findOne({ where: { id: Number(id) } });
    const func = await Funcionario.findOne({
      where: { id: solicit.FuncionarioId },
    });

    if (!solicit)
      return res.status(400).json({ message: "SOLICITAÇÃO NÃO ENCONTRADA." });

    if (user.level === 1) {
      const secretario = await Funcionario.findOne({
        where: {
          id: func.secretarioId,
        },
      });

      await solicit.update({
        status: 2,
      });

      await util.emailSender(secretario.email, secretario.nome);
    } else if (user.level === 2) {
      await solicit.update({
        status: 3,
      });

      const email = "sec.adm.salto@gmail.com";
      const secName = "Michel Hulmann";

      //await util.emailSender(email, secName);
    } else if (user.level === 3) {
      await solicit.update({
        status: 4,
        ativo: "NAO",
      });

      await func.update({
        totalDeHorasMes: func.totalDeHorasMes + solicit.totalDeHorasPedido,
      });

      await func.save();
    } else {
      res.status(400).json({ message: "USUÁRIO SEM PERMISSÃO." });
    }

    await solicit.save();

    res.status(200).json({ message: "SOLICITAÇÃO APROVADA!" });
  } catch (error) {
    console.log(error);
  }
};

// reprovar solicitação
exports.singleReprovOvertime = async (req, res) => {
  const { id } = req.params;

  try {
    const solicit = await Horas.findOne({ where: { id: Number(id) } });
    const funcionario = await Funcionario.findOne({
      where: { id: solicit.FuncionarioId },
    });

    if (!solicit)
      return res.status(400).json({ message: "SOLICITAÇÃO NÃO ENCONTRADA." });

    await solicit.update({
      status: 0,
      ativo: "NAO",
    });

    await solicit.save();
    await util.statusMail(funcionario.email, funcionario.nome);

    res.status(200).json({ message: "SOLICITAÇÃO REPROVADA!" });
  } catch (error) {
    console.log(error);
  }
};
