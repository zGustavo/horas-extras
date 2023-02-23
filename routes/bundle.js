const router = require("express").Router();
const path = require("path");

router.get("/", (req, res) => {
    res.status(200).render(path.join(__dirname, "../views", "bundle"));
});

module.exports = router;
