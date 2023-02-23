const Funcionario = require("../../model/funcionario");
const Horas = require("../../model/horas");
const SubSetor = require("../../model/subSetor");
const path = require("path");
const { Op } = require("sequelize");
const moment = require("moment");

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

exports.getDepartmentFilteredRel = async (req, res) => {
  const { setor, time } = req.params;
  const filtered = [];

  try {
    const set = await SubSetor.findOne({
      where: {
        id: Number(setor),
      },
      include: [{ model: Funcionario, include: [Horas] }],
    });

    if (!set) return res.status(400).json({ message: "SETOR NÃO ENCONTRADO" });

    for (let f = 0; f < set.Funcionarios.length; f++) {
      if (set.Funcionarios[f].Horas.length) {
        filtered.push(set.Funcionarios[f]);
      }
    }

    filtered.forEach((fl) => {
      console.log(fl.Horas);
    });

    const monthFiltered = filtered.map((func) => {
      for (let i = 0; i < func.Horas.length; i++) {
        const date = new Date(func.Horas[i].diaSolicitado);
        const dateNow = new Date(Date.now());

        if (date.getMonth() === dateNow.getMonth()) {
          return func;
        }
      }
    });

    const allFiltered = filtered.map((func) => {
      for (let i = 0; i < func.Horas.length; i++) {
        return func;
      }
    });

    const yearFiltered = filtered.map((func) => {
      for (let i = 0; i < func.Horas.length; i++) {
        const date = new Date(func.Horas[i].diaSolicitado);
        const dateNow = new Date(Date.now());

        if (date.getFullYear() === dateNow.getFullYear()) {
          return func;
        }
      }
    });

    if (time === "all") {
      return res.status(200).json({ message: allFiltered });
    } else if (time === "mes") {
      return res.status(200).json({ message: monthFiltered });
    } else if (time === "ano") {
      return res.status(200).json({ message: yearFiltered });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: Error.name });
  }
};

exports.getMonthlyHours = async (req, res) => {
  try {
    const monthly = await Horas.findAll({
      where: {
        diaSolicitado: { [Op.gte]: moment().subtract(30, "days").toDate() },
      },
      include: [
        { model: Funcionario, where: { ativo: "SIM" }, include: [SubSetor] },
      ],
    });

    if (!monthly)
      return res
        .status(400)
        .json({ message: "NENHUMA DATA ENCONTRADA PARA O PERÍODO" });

    monthly.forEach((data) => {
      data.Funcionario.senha = "";
    });

    const monthlyDataJson = JSON.parse(JSON.stringify(monthly, null, 2));
    console.log(monthlyDataJson);

    res
      .status(200)
      .render(
        path.join(
          __dirname,
          "../../views/sistemas-horas-extras/admin",
          "fechamento"
        ),
        {
          data: monthlyDataJson,
          user: req.user.user,
        }
      );
  } catch (error) {
    console.log(error);
    res.status(400).json(error.name);
  }
};

exports.getFechamentoRel = (req, res) => {
  try {
    const { rel } = req.params;

    const filePath = path.join(__dirname, "../../public/files", rel);

    res.status(200).download(filePath);
  } catch (error) {
    console.log(error);
  }
};
