const router = require("express").Router();

// sys GET routes controller
const sysGetController = require("../../controller/horas-extras/sysGetRoutes");

router.get("/sistema/horas-extras/reset", sysGetController.getSysResetPage);

module.exports = router;
