const router = require("express").Router();
const path = require("path");

// admin controller rotas POST
const adminControllerPost = require("../../controller/horas-extras/adminPostRoutes");
const sysGetRoutesController = require("../../controller/horas-extras/adminGetRoutes");
const utilFunctions = require("../../config/functions");
// auth
const auth = require("../../middleware/horaExtraAuth");
const Horas = require("../../model/horas");
const Funcionario = require("../../model/funcionario");
const SubSetor = require("../../model/subSetor");

// rotas criação/atualização/deletar secretaria
router.post("/secretaria/create", adminControllerPost.createSec);
router.post("/setor/create", adminControllerPost.createSetor);
router.post("/sub-setor/create", adminControllerPost.subSetorCreate);
router.post(
  "/sistemas/horas-extras/admin/funcionario/create",
  auth.authRoutes,
  adminControllerPost.criaFuncionario
);
router.get(
  "/sistemas/horas-extras/admin/dashboard",
  auth.authRoutes,
  sysGetRoutesController.getAdminPage
);

router.get(
  "/sistemas/horas-extras/admin/rel/:id/:time",
  auth.authRoutes,
  sysGetRoutesController.getFilteredRel
);

// gera relatório
router.get(
  "/sistemas/horas-extras/gen-rel/:id",
  auth.authRoutes,
  async (req, res) => {
    const { id } = req.params;

    try {
      const idArr = id.split(",");
      const hours = await Horas.findAll({
        where: {
          id: idArr,
        },
        include: [{ model: Funcionario, include: [SubSetor] }],
      });

      if (!hours.length)
        return res.status(400).json({ message: "NENHUM DADO ENCONTRADO." });

      const file = String(await utilFunctions.generateXlsx(hours)).split("\\");
      const fileName = file[file.length - 1];

      res
        .status(200)
        .download(
          path.join(__dirname, "../../public/files", `${fileName}`),
          fileName
        );
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Erro no download do arquivo." });
    }
  }
);

module.exports = router;
