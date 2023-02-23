const path = require("path");
const Funcionario = require("../../model/funcionario");
const Horas = require("../../model/horas");
const Secretaria = require("../../model/secretaria");
const Setor = require("../../model/setor");
const SubSetor = require("../../model/subSetor");
const bcrypt = require("bcryptjs");
const util = require("../../config/functions");
const { Op } = require("sequelize");
const moment = require("moment");

// get main pág
exports.getSysMainPage = async (req, res) => {
  const user = req.user.user;

  return res
    .status(200)
    .render(
      path.join(__dirname, "../../views/sistemas-horas-extras/", "main"),
      {
        user,
      }
    );
};

// get reset pág
exports.getSysResetPage = async (req, res) => {
  return res
    .status(200)
    .render(
      path.join(__dirname, "../../views/sistemas-horas-extras/reset/", "reset")
    );
};

// get data info
exports.getMyAccountInfo = async (req, res) => {
  const { mat } = req.params;

  try {
    const func = await Funcionario.findOne({
      where: {
        matricula: mat,
      },
      attributes: ["perguntaSecreta", "respostaSecreta", "senha", "nome"],
    });

    if (!func)
      return res.status(400).json({
        message:
          "NENHUM FUNCIONÁRIO ENCONTRADO, POR FAVOR VERIFIQUE A MATRICULA.",
      });

    res.status(200).json({
      message: {
        pergunta: func.perguntaSecreta,
        resposta: func.respostaSecreta,
        nome: func.nome,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// get primeiro acesso pág
exports.getFirstAccessPage = async (req, res) => {
  const { matricula } = req.params;

  try {
    const funcionario = await Funcionario.findOne({ where: { matricula } });

    return res
      .status(200)
      .render(
        path.join(
          __dirname,
          "../../views/sistemas-horas-extras/firstAcess/",
          "first"
        ),
        { name: funcionario.nome, matricula: funcionario.matricula }
      );
  } catch (error) {
    console.log(error);
  }
};

// rota minha conta controller

exports.getMyAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const func = await Funcionario.findOne({
      where: { matricula: id },
      include: [
        { model: SubSetor, include: [{ model: Setor, include: [Secretaria] }] },
      ],
    });

    if (!func) return res.status(400).redirect("/sistema/horas-extras/main");

    console.log(JSON.stringify(func, null, 2));
    console.log(req.user.user);

    res
      .status(200)
      .render(
        path.join(
          __dirname,
          "../../views/sistemas-horas-extras/myaccount",
          "myAccount"
        ),
        {
          user: req.user.user,
          func: func,
        }
      );
  } catch (error) {
    console.log(error);
  }
};

// solicitar get route
exports.getRequestPage = (req, res) => {
  const date = new Date(Date.now());

  const formattedData = util.formatData(date);

  req.user.user.today = formattedData;

  res
    .status(200)
    .render(
      path.join(
        __dirname,
        "../../views/sistemas-horas-extras/solicitar",
        "solicitar"
      ),
      { user: req.user.user }
    );
};

// solicitacoes get route
exports.getRequestsPage = async (req, res) => {
  const { user } = req.user;

  let setor;
  let sec;
  let totalHorasFunc = 0;
  let noData = false;

  try {
    if (user.level === 0) {
      setor = await Funcionario.findOne({
        where: { matricula: user.matricula },
        include: [
          { model: SubSetor },
          {
            model: Horas,
            where: {
              diaSolicitado: {
                [Op.gte]: moment().subtract(30, "days").toDate(),
              },
            },
          },
        ],
      });

      if (setor) {
        setor.Horas.forEach((hora) => {
          if (hora.status === 4 && hora.ativo === "SIM") {
            totalHorasFunc += Math.round(hora.totalDeHorasPedido);
          } else if (!hora) {
            return;
          }
        });
      }
    } else if (user.level === 1) {
      setor = await Funcionario.findAll({
        where: {
          chefiaId: user.id,
        },
        include: [
          { model: SubSetor },
          {
            model: Horas,
            where: {
              status: user.level,
              diaSolicitado: {
                [Op.gte]: moment().subtract(30, "days").toDate(),
              },
              ativo: "SIM",
            },
          },
        ],
      });
    } else if (user.level === 2) {
      setor = await Funcionario.findAll({
        where: {
          secretarioId: user.id,
        },
        include: [
          { model: SubSetor },
          {
            model: Horas,
            where: {
              status: user.level,
              diaSolicitado: {
                [Op.gte]: moment().subtract(30, "days").toDate(),
              },
              ativo: "SIM",
            },
          },
        ],
      });
    } else if (user.level === 3) {
      setor = await SubSetor.findAll({
        include: {
          model: Funcionario,
          include: {
            model: Horas,
            where: {
              status: user.level,
              diaSolicitado: {
                [Op.gte]: moment().subtract(30, "days").toDate(),
              },
              ativo: "SIM",
            },
          },
        },
      });

      sec = await Setor.findAll({
        include: [
          { model: Secretaria },
          {
            model: SubSetor,
            include: {
              model: Funcionario,
              include: {
                model: Horas,
                where: {
                  status: 4,
                  diaSolicitado: {
                    [Op.gte]: moment().subtract(30, "days").toDate(),
                    ativo: "SIM",
                  },
                },
              },
            },
          },
        ],
      });

      setor.forEach((set) => {
        if (set.Funcionarios.length > 0) {
          noData = true;
          return;
        }
      });
    }

    const secData = util.sumHours(sec);

    const dados = user.level === 3 ? setor : util.temHoras(setor);

    res
      .status(200)
      .render(
        path.join(
          __dirname,
          "../../views/sistemas-horas-extras/solicitacoes",
          "solicitacoes"
        ),
        {
          data: typeof dados === undefined ? [] : dados,
          user,
          secData,
          totalHoraFunc: totalHorasFunc ? totalHorasFunc : 0,
          dataLevel3: noData,
        }
      );
  } catch (error) {
    console.log(error);
  }
};

// get route ANEXO
exports.getAttachment = async (req, res) => {
  const { id } = req.params;

  try {
    const pedido = await Horas.findOne({
      where: {
        id,
      },
    });

    if (!pedido)
      return res
        .status(400)
        .json({ message: "PEDIDO DE HORA NÃO ENCONTRADO." });
    if (!pedido.anexoPedido)
      return res
        .status(400)
        .json({ message: "PEDIDO DE HORA NÃO POSSUI ANEXO." });

    const paths = pedido.anexoPedido.split("\\");
    const imgName = paths[paths.length - 1];

    return res
      .status(200)
      .sendFile(
        path.join(imgName)
          /* __dirname, "../../upload/sistemas-horas-extras",  */
      );
  } catch (error) {
    console.log(error);
  }
};

// get PROCURAR route
exports.searchUserRoute = (req, res) => {
  const date = new Date(Date.now());

  const formattedData = util.formatData(date);

  req.user.user.today = formattedData;

  res
    .status(200)
    .render(
      path.join(
        __dirname,
        "../../views/sistemas-horas-extras/procurar",
        "procurar"
      ),
      { user: req.user.user }
    );
};

// pág procurar, get funcionario

exports.getFuncionario = async (req, res) => {
  const { matricula } = req.params;

  try {
    const func = await Funcionario.findOne({
      where: {
        matricula,
      },
      include: [
        {
          model: SubSetor,
          include: [
            {
              model: Setor,
              include: [Secretaria],
            },
          ],
        },
      ],
    });

    if (!func)
      return res.status(400).json({ message: "FUNCIONÁRIO NÃO ENCONTRADO." });

    func.senha = "";

    const parsedData = JSON.parse(JSON.stringify(func, null, 2));

    res.status(200).json({ parsedData });
  } catch (error) {
    console.log(error);
  }
};

// logout
exports.logout = (req, res) => {
  res.clearCookie("fauth").status(200).redirect("/sistema/horas-extras/login");
};

// change password

exports.resetPassword = async (req, res) => {
  const { mat } = req.params;
  const { password } = req.body;

  try {
    const func = await Funcionario.findOne({
      where: {
        matricula: mat,
      },
    });

    const newPassword = await bcrypt.hash(password, 16);

    await func.update({
      senha: newPassword,
    });

    await func.save();

    res.status(200).json({ message: "SENHA ATUALIZADA COM SUCESSO." });
  } catch (error) {
    console.log(error);
  }
};

exports.getTutorialFile = (req, res) => {
  const filePath = path.join(
    __dirname,
    "../../public/assets/tutorial",
    "tutorial.pdf"
  );

  res.status(200).sendFile(filePath);
};
