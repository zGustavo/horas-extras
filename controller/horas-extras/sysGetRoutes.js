const path = require("path");
const Funcionario = require("../../model/funcionario");
const Horas = require("../../model/horas");
const Secretaria = require("../../model/secretaria");
const Setor = require("../../model/setor");
const SubSetor = require("../../model/subSetor");

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

  const formattedData = `${date.getFullYear()}-${
    date.getMonth() + 1 < 10 ? "0" + date.getMonth() : date.getMonth() + 1
  }-${
    date.getDate() < 9 ? "0" + date.getDate() - 2 : date.getDate() - 2
  }T00:00`;

  req.user.user.today = formattedData;
  console.log(req.user.user);
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

  function temHoras(set) {
    const arrayDeHoras = [];
    const obj = JSON.parse(JSON.stringify(set, null, 2));

    if (req.user.user.level === 1 || req.user.user.level === 2) {
      if (!obj.length) {
        const createObjArr = [obj];
        for (let i = 0; i < createObjArr.length; i++) {
          if (createObjArr[i].Funcionarios.length) {
            for (let x = 0; x < createObjArr[i].Funcionarios.length; x++) {
              if (createObjArr[i].Funcionarios[x].Horas.length) {
                arrayDeHoras.push(createObjArr[i]);
                if (arrayDeHoras.indexOf(createObjArr[i]) !== -1) {
                  break;
                }
              }
            }
          }
        }
      } else {
        console.log("aqui");
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].Funcionarios.length) {
            for (let x = 0; x < obj[i].Funcionarios.length; x++) {
              if (obj[i].Funcionarios[x].Horas.length) {
                arrayDeHoras.push(obj[i]);
              }
            }
          }
        }
      }
    } else if (req.user.user.level === 3) {
      console.log("aqui");
      for (let m = 0; m < obj.length; m++) {
        if (obj[m].Funcionarios.length) {
          arrayDeHoras.push(obj[m]);
        }
      }
    } else {
      const arr = [obj];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].Horas.length) {
          for (let x = 0; x < arr[i].Horas.length; x++) {
            arrayDeHoras.push(arr[i]);
            if (arrayDeHoras.indexOf(arr[i]) !== -1) {
              break;
            }
          }
        }
      }
    }

    return arrayDeHoras;
  }

  let setor;

  try {
    if (user.level === 0) {
      setor = await Funcionario.findOne({
        where: { matricula: user.matricula },
        include: [{ model: SubSetor }, { model: Horas }],
      });
    } else if (user.level === 1 || user.level === 2) {
      setor = await SubSetor.findOne({
        where: { id: user.setor },
        include: [
          {
            model: Funcionario,
            include: [{ model: Horas, where: { status: user.level } }],
          },
        ],
      });
    } else if (user.level === 3) {
      setor = await SubSetor.findAll({
        include: [
          {
            model: Funcionario,
            include: [{ model: Horas, where: { status: 3 } }],
          },
        ],
      });
    }

    if (!setor)
      return res.status(400).json({ message: "ERRO EM PUXAR DADOS DO BANCO." });

    const dados = temHoras(setor);

    res
      .status(200)
      .render(
        path.join(
          __dirname,
          "../../views/sistemas-horas-extras/solicitacoes",
          "solicitacoes"
        ),
        { data: dados, user }
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
        path.join(__dirname, "../../upload/sistemas-horas-extras", imgName)
      );
  } catch (error) {
    console.log(error);
  }
};

// get PROCURAR route
exports.searchUserRoute = (req, res) => {
  const date = new Date(Date.now());

  const formattedData = `${date.getFullYear()}-${
    date.getMonth() + 1 < 10 ? "0" + date.getMonth() : date.getMonth() + 1
  }-${
    date.getDate() < 9 ? "0" + date.getDate() - 2 : date.getDate() - 2
  }T00:00`;

  req.user.user.today = formattedData;
  console.log(req.user.user);
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
