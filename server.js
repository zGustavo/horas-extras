const express = require("express");
const cookieParser = require("cookie-parser");
const sequelize = require("./db/db");
const path = require("path");
require("dotenv").config();

const app = express();

// configuração de recursos usados pelo servidor
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// porta 3000 ou qualquer porta no .env
const PORT = process.env.PORT || 3000;

// rota bundle
const bundle = require('./routes/bundle');

// rota PDI
const pdiLogin = require('./routes/sistemas-pdi/login');
const pdiMain = require('./routes/sistemas-pdi/main');

// rotas do sistema de horas extras
const horaLogin = require("./routes/sistemas-horas-extras/login");
const admin = require("./routes/sistemas-horas-extras/admin");
const main = require("./routes/sistemas-horas-extras/main");
const auth = require("./routes/sistemas-horas-extras/auth");
const reset = require("./routes/sistemas-horas-extras/reset");
const request = require("./routes/sistemas-horas-extras/request");

// ativa rotas sistema de horas
app.use(bundle);

app.use(pdiLogin);
app.use(pdiMain);

app.use(request);
app.use(reset);
app.use(auth);
app.use(main);
app.use(horaLogin);
app.use(admin);


app.use("*", (req, res) => {
  res
    .status(404)
    .sendFile(
      path.join(__dirname, "./views/sistemas-horas-extras", "404.html")
    );
});

sequelize.sync().then(() => {
  console.log("Banco de Dados conectado.");
  app.listen(PORT, () => {
    console.log("Server rodando na porta " + PORT);
  });
});
