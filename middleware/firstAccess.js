// middleware para consultar se é o primeiro acesso do funcionario, solicita email e mudança de senha
const Funcionario = require("../model/funcionario");

exports.firstAcess = async (req, res, next) => {
  const { primeiroAcesso, matricula } = req.user.user;

  try {
    if (primeiroAcesso === 1) {
      return next();
    } else {
      res.redirect(`/sistemas/horas-extras/primeiro_acesso/${matricula}`);
    }

    next();
  } catch (error) {
    console.log(error);
  }
};
