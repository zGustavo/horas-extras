const express = require("express");
const cookieParser = require("cookie-parser");
const sequelize = require("./db/db");
require("dotenv").config();

const app = express();

// configuração de recursos usados pelo servidor
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// porta 3000 ou qualquer porta no .env
const PORT = 3000 || process.env.PORT;

// rotas do sistema de horas extras
const horaLogin = require("./routes/sistemas-horas-extras/login");
const admin = require("./routes/sistemas-horas-extras/admin");
const main = require("./routes/sistemas-horas-extras/main");
const auth = require("./routes/sistemas-horas-extras/auth");
const reset = require("./routes/sistemas-horas-extras/reset");
const request = require("./routes/sistemas-horas-extras/request");

// ativa rotas sistema de horas
app.use(request);
app.use(reset);
app.use(auth);
app.use(main);
app.use(horaLogin);
app.use(admin);

sequelize.sync().then(() => {
  console.log("Banco de Dados conectado.");
  app.listen(PORT, () => {
    console.log("Server rodando na porta " + PORT);
  });
});
