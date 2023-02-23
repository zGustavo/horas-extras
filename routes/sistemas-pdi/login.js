const router = require("express").Router();
const path = require("path");

router.get("/sistemas/pdi/login", (req, res) => {
    res
        .status(200)
        .render(path.join(__dirname, "../../views/sistemas-pdi/login", "index"));
});

module.exports = router;
