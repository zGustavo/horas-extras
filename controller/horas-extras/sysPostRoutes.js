const Funcionario = require("../../model/funcionario");
const SubSetor = require("../../model/subSetor");
const Horas = require("../../model/horas");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// autenticação
exports.authUser = async (req, res) => {
  const { matricula, password } = req.body;

  try {
    const funcionario = await Funcionario.findOne({
      where: { matricula },
      include: [{ model: SubSetor }, { model: Horas }],
    });

    if (!funcionario)
      return res.status(400).json({ message: "FUNCIONÁRIO NÃO ENCONTRADO." });

    if (!(await bcrypt.compare(password, funcionario.senha)))
      return res.status(400).json({ message: "DADOS INCORRETOS." });

    const payload = {
      user: {
        matricula: funcionario.matricula,
        name: funcionario.nome,
        level: funcionario.level,
        setor: funcionario.SubSetor.id,
        primeiroAcesso: funcionario.primeiroAcesso,
      },
    };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res
      .status(200)
      .cookie("fauth", token, { expires: new Date(Date.now() + 86400000) })
      .json({ message: "AUTENTICADO COM SUCESSO." });
  } catch (error) {
    console.log(error);
  }
};

// solicitação hora

exports.reHoras = async (req, res) => {
  const { matricula, dia, horas, justificativa } = req.body;

  try {
    console.log(req.file);
    const func = await Funcionario.findOne({ where: { matricula } });
    let newHoras;

    console.log(req.user);

    if (!func)
      return res.status(400).json({ message: "FUNCIONÁRIO NÃO ENCONTRADO." });

    if (func.level > 0) {
      return res.status(400).json({
        message:
          "NÃO É POSSÍVEL SOLICITAR AS HORAS PARA PESSOA COM CARGO ACIMA DE FUNCIONÁRIO",
      });
    }

    if (req.user.user.setor !== func.SubSetorId)
      return res.status(400).json({
        message:
          "NÃO AUTORIZADO SOLICITAR HORAS PARA FUNCIONÁRIOS DE OUTROS SETORES.",
      });

    const entrada = new Date(dia).getHours();
    const totalHoras = Number(horas);
    const saida =
      entrada + totalHoras > 24
        ? 0 + (entrada + totalHoras - 24)
        : entrada + totalHoras;

    if (func.totalDeHorasMes + totalHoras > 60)
      return res
        .status(400)
        .json({ message: "LIMITE DE 60h MENSAIS EXCEDIDO." });

    if (req.user.user.level === 0) {
      newHoras = await Horas.create({
        diaSolicitado: new Date(dia),
        dataDoPedido: new Date(Date.now()),
        horarioEntrada: entrada,
        horarioSaida: saida,
        totalDeHorasPedido: totalHoras,
        justificativa: justificativa,
        status: 1,
        FuncionarioId: func.id,
        anexoPedido: req.file ? req.file.path : null,
      });

      if (newHoras)
        return res.status(200).redirect("/sistemas/horas-extras/solicitar");
    } else if (req.user.user.level === 1) {
      newHoras = await Horas.create({
        diaSolicitado: new Date(dia),
        dataDoPedido: new Date(Date.now()),
        horarioEntrada: entrada,
        horarioSaida: saida,
        totalDeHorasPedido: totalHoras,
        justificativa: `${justificativa} SOLICITADO POR: ${req.user.user.name}`,
        status: 2,
        FuncionarioId: func.id,
        anexoPedido: req.file ? req.file.path : null,
      });

      if (newHoras)
        return res.status(200).redirect("/sistemas/horas-extras/procurar");
    } else if (req.user.user.level === 2) {
      newHoras = await Horas.create({
        diaSolicitado: new Date(dia),
        dataDoPedido: new Date(Date.now()),
        horarioEntrada: entrada,
        horarioSaida: saida,
        totalDeHorasPedido: totalHoras,
        justificativa: `${justificativa} SOLICITADO POR: ${req.user.user.name}`,
        status: 3,
        FuncionarioId: func.id,
        anexoPedido: req.file ? req.file.path : null,
      });

      if (newHoras)
        return res.status(200).redirect("/sistemas/horas-extras/procurar");
    } else if (req.user.user.level === 3) {
      newHoras = await Horas.create({
        diaSolicitado: new Date(dia),
        dataDoPedido: new Date(Date.now()),
        horarioEntrada: entrada,
        horarioSaida: saida,
        totalDeHorasPedido: totalHoras,
        justificativa: `${justificativa} SOLICITADO POR: ${req.user.user.name}`,
        status: 4,
        FuncionarioId: func.id,
        anexoPedido: req.file ? req.file.path : null,
      });

      await func.update({
        totalDeHorasMes: func.totalDeHorasMes + newHoras.totalDeHorasPedido,
      });

      await func.save();

      if (newHoras)
        return res.status(200).redirect("/sistemas/horas-extras/procurar");
    }

    if (!newHoras)
      return res.status(400).json({ message: "ERRO AO REGISTRAR PEDIDO." });
  } catch (error) {
    console.log(error);
  }
};

// logout
exports.logout = (req, res) => {
  res.clearCookie("fauth").status(200).redirect("/sistemas/horas-extras/login");
};
