const jwt = require("jsonwebtoken");

// autoriza o acesso as rotas
exports.authRoutes = async (req, res, next) => {
  const token = req.cookies.fauth;

  if (!token) return res.status(401).redirect("/sistema/horas-extras/login");

  try {
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifiedToken)
      return res.status(401).redirect("/sistema/horas-extras/login");

    req.user = verifiedToken.payload;

    return next();
  } catch (error) {
    console.log(error);
  }
};
