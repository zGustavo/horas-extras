const router = require("express").Router();
const Funcionario = require("../../model/funcionario");
const SubSetor = require("../../model/subSetor");
const bcrypt = require("bcryptjs");

// controller sistema, rotas GET
const sysGetController = require("../../controller/horas-extras/sysGetRoutes");

// controller sistema, rotas PUT
const sysPutController = require("../../controller/horas-extras/sysPutRoutes");

// controller sistema, rotas POST
const sysPostController = require("../../controller/horas-extras/sysPostRoutes");

// middleware autorização de rotas e primeiro acesso
const authRoutes = require("../../middleware/horaExtraAuth");
const acess = require("../../middleware/firstAccess");
const { authUser } = require("../../controller/horas-extras/sysPostRoutes");

// primeiro acesso?
router.get(
  "/sistemas/horas-extras/primeiro_acesso/:matricula",
  sysGetController.getFirstAccessPage
);

// rota minha conta

router.get(
  "/sistemas/horas-extras/:id/minha-conta",
  authRoutes.authRoutes,
  sysGetController.getMyAccount
);

// get funcionario pag PROCURAR
router.get(
  "/sistemas/horas-extras/func/:matricula",
  authRoutes.authRoutes,
  sysGetController.getFuncionario
);

// rota procurar funcionário
router.get(
  "/sistemas/horas-extras/procurar",
  authRoutes.authRoutes,
  sysGetController.searchUserRoute
);

// troca senha do primeiro acesso e cadastro do email
router.post(
  "/sistemas/horas-extras/primeiro_acesso/update",
  sysPutController.updateFuncionarioPass
);

router.get(
  "/sistema/horas-extras/main",
  authRoutes.authRoutes,
  acess.firstAcess,
  sysGetController.getSysMainPage
);

router.get("/senha", (req, res) => {
  res.render("../views/sistemas-horas-extras/senha");
});

// logout
router.get(
  "/sistemas/horas-extras/logout",
  authRoutes.authRoutes,
  sysGetController.logout
);

router.post("/senha", async (req, res) => {
  const { id, senha } = req.body;

  try {
    const func = await Funcionario.findOne({ where: { id } });

    if (!func)
      return res.status(400).json({ message: "FUNCIONARIO NÃO ENCONTRADO" });

    const subSetor = await SubSetor.findOne({ where: { nomeSubSetor: senha } });

    if (!subSetor)
      return res.status(400).json({ message: "SUBSETOR NÃO ENCONTRADO" });

    await func.update({
      SubSetorId: subSetor.id,
    });

    await func.save();

    res.status(200).json({
      message: "SUBSETOR FUNCIONARIO ATUALIZADO",
      id: func.SubSetorId,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
