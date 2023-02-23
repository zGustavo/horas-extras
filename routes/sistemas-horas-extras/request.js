const router = require("express").Router();
const path = require("path");
const crypto = require("crypto");

// upload middleware
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../upload/sistemas-horas-extras")); 
  },
  filename: (req, file, cb) => {
    cb(null, "anexo" + Date.now() + file.originalname);
  },
});

const upload = multer({
  storage,
});

// routes GET controller
const sysGetRoutesController = require("../../controller/horas-extras/sysGetRoutes");

// routes POST controller
const sysPostRoutesController = require("../../controller/horas-extras/sysPostRoutes");

// routes PUT controller
const sysPutRoutesController = require("../../controller/horas-extras/sysPutRoutes");

// auth routes
const authUser = require("../../middleware/horaExtraAuth");

router.get(
  "/sistemas/horas-extras/solicitar",
  authUser.authRoutes,
  sysGetRoutesController.getRequestPage
);

// get ANEXO route
router.get(
  "/sistemas/horas-extras/hora/attachment/:id",
  authUser.authRoutes,
  sysGetRoutesController.getAttachment
);

router.post(
  "/sistemas/hora-extra/solicitar/hora",
  authUser.authRoutes,
  upload.single("file"),
  sysPostRoutesController.reHoras
);

// solicitacoes
router.get(
  "/sistemas/horas-extras/solicitacoes",
  authUser.authRoutes,
  sysGetRoutesController.getRequestsPage
);

// aprovar e reprovar solicitações
router.put(
  "/sistemas/horas-extras/hora/aprov/:id",
  authUser.authRoutes,
  sysPutRoutesController.singleAprovOvertime
);
router.put(
  "/sistemas/horas-extras/hora/reprov/:id",
  authUser.authRoutes,
  sysPutRoutesController.singleReprovOvertime
);

// cancelar solicitação
router.post(
  "/sistemas/horas-extras/hora/cancel",
  sysPostRoutesController.cancelRequest
);

module.exports = router;
