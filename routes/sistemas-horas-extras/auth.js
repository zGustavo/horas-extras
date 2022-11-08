const router = require("express").Router();

// SYS ROTAS POST CONTROLLER
const sysPostController = require("../../controller/horas-extras/sysPostRoutes");

router.post("/sistema/horas-extras/auth", sysPostController.authUser);

module.exports = router;
