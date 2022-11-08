const Funcionario = require("../../model/funcionario");
const Horas = require("../../model/horas");
const SubSetor = require("../../model/subSetor");
const path = require("path");
const { Op } = require("sequelize");

exports.getHorasLoginPage = (req, res) => {
  return res
    .status(200)
    .render(
      path.join(__dirname, "../../views/sistemas-horas-extras/login", "login")
    );
};
exports.getAdminPage = async (req, res) => {
  try {
    const sub = await SubSetor.findAll();
    const func = await Funcionario.findAll();

    return res
      .status(200)
      .render(
        path.join(
          __dirname,
          "../../views/sistemas-horas-extras/admin",
          "dashboard"
        ),
        {
          user: req.user.user,
          setor: sub,
          func: func,
        }
      );
  } catch (error) {
    console.log(error);
  }
};

exports.getFilteredRel = async (req, res) => {
  const { id, time } = req.params;
  const filtered = [];

  try {
    if (id === "null")
      return res.status(400).json({ message: "NENHUM FUNCIONÁRIO INFORMADO." });

    const data = await Horas.findAll({
      where: {
        FuncionarioId: id,
      },
      include: [{ model: Funcionario, include: [SubSetor] }],
    });

    if (!data.length)
      return res
        .status(400)
        .json({ message: "NENHUMA HORA PARA ESSE USUÁRIO." });

    for (let i = 0; i < data.length; i++) {
      const dateNow = new Date(Date.now());
      const reqDate = new Date(data[i].diaSolicitado);

      if (time === "all") {
        filtered.push(data[i]);
      } else if (time === "mes") {
        if (
          dateNow.getMonth() === reqDate.getMonth() &&
          dateNow.getFullYear() === reqDate.getFullYear()
        ) {
          filtered.push(data[i]);
          if (filtered.length) {
            continue;
          } else {
            break;
          }
        }
      } else if (time === "ano") {
        if (dateNow.getFullYear() === reqDate.getFullYear()) {
          filtered.push(data[i]);
          if (filtered.length) {
            continue;
          } else {
            break;
          }
        }
      }
    }

    if (filtered.length) {
      return res.status(200).json({ message: filtered });
    } else {
      return res
        .status(400)
        .json({ message: "NENHUMA HORA FILTRADA PARA ESSES PERIODOS." });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: Error.name });
  }
};
