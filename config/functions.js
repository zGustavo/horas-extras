const ExcelJS = require("exceljs");
const path = require("path");

exports.generateXlsx = async (data) => {
  if (!data.length) {
    return;
  }

  const wb = new ExcelJS.Workbook();
  const sheet = wb.addWorksheet(data[0].Funcionario.nome.split(" ")[0]);

  sheet.columns = [
    { header: "ID SOLICITAÇÃO", key: "id" },
    { header: "NOME", key: "nome" },
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

  sheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

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
