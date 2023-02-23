const Funcionario = require("../../model/funcionario");
const SubSetor = require("../../model/subSetor");
const Horas = require("../../model/horas");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const util = require("../../config/functions");
require("dotenv").config();

// autenticação
exports.authUser = async (req, res) => {
  const { matricula, password } = req.body;

  try {
    let funcionario = await Funcionario.findOne({
      where: { matricula },
      include: [{ model: SubSetor }, { model: Horas }],
    });

    if (!funcionario)
      return res.status(400).json({ message: "FUNCIONÁRIO NÃO ENCONTRADO." });

    if (!(await bcrypt.compare(password, funcionario.senha)))
      return res.status(400).json({ message: "DADOS INCORRETOS." });

    const payload = {
      user: {
        id: funcionario.id,
        matricula: funcionario.matricula,
        name: funcionario.nome,
        level: funcionario.level,
        setor: funcionario.SubSetor.id,
        primeiroAcesso: funcionario.primeiroAcesso,
        chefia: funcionario.chefiaId,
        secretario: funcionario.secretarioId,
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

    
 /*    if (req.user.user.setor !== func.SubSetorId)
      return res.status(400).json({
        message:
          "NÃO AUTORIZADO SOLICITAR HORAS PARA FUNCIONÁRIOS DE OUTROS SETORES.",
      }); */

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

    if (new Date(dia).getFullYear() !== new Date(Date.now()).getFullYear())
      return res
        .status(400)
        .json({ message: "PERMITIDO APENAS SOLICITAÇÕES PRO ANO ATUAL" });

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
        ativo: "SIM",
      });

      const chefe = await Funcionario.findOne({
        where: {
          id: func.chefiaId,
        },
      });

      if (newHoras) {
        await util.emailSender(chefe.email, chefe.nome);
        return res.status(200).redirect("/sistemas/horas-extras/solicitar");
      }
    } else if (req.user.user.level === 1) {
      if (req.user.user.id !== func.chefiaId)
        return res.status(403).json({
          message: "NÃO PERMITIDO SOLICITAR HORAS PARA ESTE FUNCIONÁRIO",
        });

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
        ativo: "SIM",
      });

      const secretario = await Funcionario.findOne({
        where: {
          id: func.secretarioId,
        },
      });

      if (newHoras) {
        await util.emailSender(secretario.email, secretario.nome);
        return res.status(200).redirect("/sistemas/horas-extras/procurar");
      }
    } else if (req.user.user.level === 2) {
      if (req.user.user.id !== func.secretarioId)
        return res.status(403).json({
          message: "NÃO PERMITIDO SOLICITAR HORAS PARA ESTE FUNCIONÁRIO",
        });
        
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
        ativo: "SIM",
      });

      if (newHoras) {
        util.emailSender("sec.adm.salto@gmail.com", "Michel Hulmann");
        return res.status(200).redirect("/sistemas/horas-extras/procurar");
      }
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
        ativo: "NAO",
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

// cancela solicitação
exports.cancelRequest = async (req, res) => {
  const { id } = req.body;

  try {
    const hour = await Horas.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!hour) return res.status(400).json({ message: "HORA NÃO ENCONTRADA" });

    await hour.destroy();

    await hour.save();

    res.status(200).json({ message: "SOLICITAÇÃO CANCELADA" });
  } catch (error) {
    console.log(error);
  }
};
