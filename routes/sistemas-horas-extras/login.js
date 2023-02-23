const router = require("express").Router();

// controller de rotas tipo GET

const getRoutesController = require("../../controller/horas-extras/adminGetRoutes");

router.get(
  "/sistema/horas-extras/login",
  getRoutesController.getHorasLoginPage
);

module.exports = router;
