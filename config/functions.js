const ExcelJS = require("exceljs");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

exports.generateXlsx = async (data) => {
  if (!data.length) {
    return;
  }

  const wb = new ExcelJS.Workbook();
  const sheet = wb.addWorksheet(data[0].Funcionario.nome.split(" ")[0], {
    properties: { outlineLevelCol: 2, outlineLevelRow: 2 },
  });

  sheet.columns = [
    { header: "ID SOLICITAÇÃO", key: "id" },
    { header: "NOME", key: "nome" },
    { header: "MATRICULA", key: "matricula" },
    { header: "SETOR", key: "setor" },
    { header: "HORA PREVISTA", key: "hora" },
    { header: "DIA PREVISTO", key: "dia" },
    { header: "ENTRADA/SAÍDA", key: "entrada" },
    { header: "JUSTIFICATIVA", key: "justi" },
    { header: "STATUS", key: "status" },
  ];

  for (let i = 0; i < data.length; i++) {
    sheet.addRow({
      id: data[i].id,
      nome: data[i].Funcionario.nome,
      matricula: data[i].Funcionario.matricula,
      setor: data[i].Funcionario.SubSetor.nomeSubSetor,
      hora: `${data[i].totalDeHorasPedido}h`,
      dia: `${new Date(data[i].diaSolicitado).toLocaleDateString()}`,
      entrada: `${data[i].horarioEntrada}h - ${data[i].horarioSaida}h`,
      justi: data[i].justificativa,
      status:
        data[i].status < 1
          ? "REPROVADO"
          : data[i].status > 3
          ? "APROVADO"
          : "PENDENTE",
    });
  }

  sheet.getRow(1).font = {
    bold: true,
  };

  sheet.getRows(1).alignment = { vertical: "middle", horizontal: "center" };

  sheet.eachRow(function (row, _rowNumber) {
    row.eachCell(function (cell, _colNumber) {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  await sheet.workbook.xlsx.writeFile(
    path.join(
      __dirname,
      "../public/files",
      `${data[0].Funcionario.nome}${new Date(Date.now()).toDateString()}.xlsx`
    )
  );

  return path.join(
    __dirname,
    "./public/files",
    `${data[0].Funcionario.nome}${new Date(Date.now()).toDateString()}.xlsx`
  );
};

exports.temHoras = (set) => {
  if (typeof set !== undefined) return set;
  if (set === null) return [];

  const horas = [];

  for (let i = 0; i < set.length; i++) {
    if (set[i].Horas.length) {
      horas.push(set[i]);
    }
  }

  return horas;
};

exports.sumHours = (data) => {
  if (!data) return;
  let setor = {};
  const dataArray = [];

  data.map((dt) => {
    setor.secretaria = dt.Secretarium.nomeSecretaria;
    setor.totalHoras = 0;

    for (let i = 0; i < dt.SubSetors.length; i++) {
      for (let f = 0; f < dt.SubSetors[i].Funcionarios.length; f++) {
        for (let h = 0; h < dt.SubSetors[i].Funcionarios[f].Horas.length; h++) {
          setor.totalHoras += Number(
            dt.SubSetors[i].Funcionarios[f].Horas[h].totalDeHorasPedido
          );
        }
      }
    }

    dataArray.push(setor);
  });
  return dataArray;
};

exports.formatData = (date) => {
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10
      ? date.getMonth() === 0
        ? "0" + (date.getMonth() + 1).toString()
        : "0" + (date.getMonth() + 1).toString()
      : date.getMonth() + 1;
  const day =
    date.getDate() < 10
      ? date.getDate() === 11
        ? "0" + (date.getDate() - 2).toString()
        : "0" + (date.getDate() - 2).toString()
      : date.getDate() - 2;

  const formatted = `${year}-${month}-${day}T00:00`;

  console.log(formatted);

  return formatted;
};

exports.emailSender = async (email, name) => {
  const transport = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: "nao-responda@salto.sp.gov.br",
      pass: process.env.PASS,
    },
  });

  transport
    .sendMail({
      from: "Sistemas Prefeitura da Estância Turística de Salto<nao-responda@salto.sp.gov.br>",
      to: email,
      subject: "Solicitação de hora extraordinária - Prefeitura de Salto",
      html: `
      
      <p style='font-weight: bold; text-decoration: italic; color: red; font-size: 10px;'>
        ISSO É UM EMAIL AUTOMÁTICO, FAVOR NÃO RESPONDER.
      </p>
      
      <p>Olá ${name},</p>
      <p>Gostaria de lembrá-lo de que existe uma solicitação de horas extras pendente de sua aprovação no nosso sistema.</p>
      <p>Por favor, acesse o sistema <b><a href='https://sistemas.salto.sp.gov.br'>Sistemas Salto</a></b> para visualizar a solicitação.</p>
      <p>Obrigado pelo seu tempo.</p>
      
      <p>Atenciosamente,</p>
      
      <p>Processamento de Dados - Prefeitura de Salto</p>
      <p>Paço Municipal – Abadia de São Norberto
      <br/>Av. Tranquillo Giannini, 861 – Dist. Ind. Santos Dumont
      <br/>Salto/SP  - CEP: 13.329-600
      <br/>(11)4602-8530 ou (11)4602-8520
      <br/>http://www.salto.sp.gov.br/<br />
      <img  src='https://i.imgur.com/mWU8NX8.png' style='width: 137px; height: 56px; margin-right: 10px;'/>
      <img  src='https://i.imgur.com/dUm7eO4.png' style='width: 90px; height: 66px;'/>
      </p>`,
      text: `Olá ${name},
      Gostaria de lembrá-lo de que existe uma solicitação de horas extras pendente de sua aprovação no nosso sistema.
      Por favor, acesse o sistema Sistemas Salto para visualizar a solicitação e tomar uma decisão.
      Obrigado pelo seu tempo.
      Atenciosamente,
      Processamento de Dados - Prefeitura de Salto
      Paço Municipal – Abadia de São Norberto 
      Av. Tranquillo Giannini, 861 – Dist. Ind. Santos Dumont 
      Salto/SP - CEP: 13.329-600 
      (11)4602-8530 ou (11)4602-8520 http://www.salto.sp.gov.br/
      `,
    })
    .then(() => console.log("Email enviado com sucesso!"))
    .catch((err) => console.log("Erro ao enviar email: ", err));
};

exports.statusMail = async(email, name) => {
  const transport = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: "nao-responda@salto.sp.gov.br",
      pass: process.env.PASS,
    },
  });

  transport
  .sendMail({
    from: "Sistemas Prefeitura da Estância Turística de Salto<nao-responda@salto.sp.gov.br>",
    to: email,
    subject: "Atualização da solicitação de hora extraordinária - Prefeitura de Salto",
    html: `
    
    <p style='font-weight: bold; text-decoration: italic; color: red; font-size: 10px;'>
      ISSO É UM EMAIL AUTOMÁTICO, FAVOR NÃO RESPONDER.
    </p>
    
    <p>Prezado(a) ${name},</p>
    <p>Espero que esteja tudo bem.</p>
    <p>Gostaríamos de informar que o status do seu pedido de horas extras foi atualizado, por favor verifique no painel solicitações no sistema. Se você tiver alguma dúvida ou precisar de mais informações, por favor, não hesite em entrar em contato conosco.</p>

    <p>Agradecemos sua paciência e compreensão.


    <p>Processamento de Dados - Prefeitura de Salto</p>
    <p>Paço Municipal – Abadia de São Norberto
    <br/>Av. Tranquillo Giannini, 861 – Dist. Ind. Santos Dumont
    <br/>Salto/SP  - CEP: 13.329-600
    <br/>(11)4602-8530 ou (11)4602-8520
    <br/>http://www.salto.sp.gov.br/<br />
    <img  src='https://i.imgur.com/mWU8NX8.png' style='width: 137px; height: 56px; margin-right: 10px;'/>
    <img  src='https://i.imgur.com/dUm7eO4.png' style='width: 90px; height: 66px;'/>
    </p>`,

  })
  .then(() => console.log("Email enviado com sucesso!"))
  .catch((err) => console.log("Erro ao enviar email: ", err));

}

exports.createFechamentoRel = async (data) => {
  const date = new Date(Date.now());

  if (!data.length) {
    return;
  }

  const wb = new ExcelJS.Workbook();
  const sheet = wb.addWorksheet(data[0].Funcionario.nome.split(" ")[0], {
    properties: { outlineLevelCol: 2, outlineLevelRow: 2 },
  });

  sheet.columns = [
    { header: "ID REQUISIÇÃO", key: "id" },
    { header: "DIA SOLICITADO", key: "dia" },
    { header: "STATUS", key: "status" },
    { header: "NOME FUNCIONÁRIO", key: "func" },
    { header: "MATRICULA", key: "mat" },
    { header: "SETOR", key: "setor" },
    { header: "TOTAL DE HORAS MÊS", key: "total" },
  ];

  for (let i = 0; i < data.length; i++) {
    sheet.addRow({
      id: data[i].id,
      dia: data[i].diaSolicitado,
      status:
        data[i].status < 1
          ? "REPROVADO"
          : data[i].status > 3
          ? "APROVADO"
          : "PENDENTE",
      func: data[i].Funcionario.nome,
      mat: data[i].Funcionario.matricula,
      setor: data[i].Funcionario.SubSetor.nomeSubSetor,
      total: data[i].Funcionario.totalDeHorasMes,
    });
  }

  sheet.getRow(1).font = {
    bold: true,
  };

  sheet.getRows(1).alignment = { vertical: "middle", horizontal: "center" };

  sheet.eachRow(function (row, _rowNumber) {
    row.eachCell(function (cell, _colNumber) {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  await sheet.workbook.xlsx.writeFile(
    path.join(
      __dirname,
      "../public/files",
      `fechamento_${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}.xlsx`
    )
  );

  return path.join(
    __dirname,
    "./public/files",
    `fechamento_${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}.xlsx`
  );
};
