const router = require("express").Router();
const path = require("path");

router.get("/sistemas/pdi/main", (req, res) => {
    res.status(200).render(path.join(__dirname, "../../views/sistemas-pdi/", "main"));
});

router.get("/sistemas/pdi/termos", (req, res) => {
    res
        .status(200)
        .render(path.join(__dirname, "../../views/sistemas-pdi/termos/", "termos"));
});

module.exports = router;


