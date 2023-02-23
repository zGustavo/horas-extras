const router = require("express").Router();

// sys GET routes controller
const sysGetController = require("../../controller/horas-extras/sysGetRoutes");

router.get("/sistema/horas-extras/reset", sysGetController.getSysResetPage);
router.get(
  "/sistema/horas-extras/reset/:mat",
  sysGetController.getMyAccountInfo
);
router.put(
  "/sistema/horas-extras/reset/change/:mat",
  sysGetController.resetPassword
);

module.exports = router;
