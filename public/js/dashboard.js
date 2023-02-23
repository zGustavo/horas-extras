window.addEventListener("DOMContentLoaded", () => {
  const today = new Date(Date.now());
  const fechamento = document.querySelector("#fechamento-btn");

  if (today.getDate() !== 16) {
    fechamento.href = "javascript:void(0)";
    fechamento.classList.add("unabled");
    fechamento.textContent = "NÃO LIBERADO";
  } else {
    fechamento.href = "/sistema/horas-extras/admin/fechamento";
    fechamento.classList.remove("unabled");
    fechamento.textContent = "IR PARA FECHAMENTO";
  }
});

$(document).ready(function () {
  $("#sel-func").select2();
});

$(document).ready(function () {
  $("#sel-setor").select2();
});

// alert
const alertPlaceholder = document.querySelector("#live-alert");
const alert = (message, type) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" id="close-alert" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");

  alertPlaceholder.append(wrapper);

  return setTimeout(() => {
    const closeAlert = document.querySelector("#close-alert");

    closeAlert.click();
  }, 3000);
};

const vSetor = document.querySelector("#v-setor");
const modal = document.querySelector("#rel-modal");

vSetor.addEventListener("click", async (e) => {
  try {
    const setor = document.querySelector("#sel-func");
    const formSetor = document.querySelector("#admin-setor");
    const inputs = formSetor.querySelectorAll('input[type="radio"]');

    const id = setor.options[setor.selectedIndex].value;
    const name = setor.options[setor.selectedIndex].innerText;
    let time;

    if (id === "null") {
      return swal({
        title: "NENHUM FUNCIONÁRIO SELECIONADO",
        icon: "error",
        button: true,
      });
    }

    inputs.forEach((el) => {
      if (el.checked) {
        time = el.value;
      }
    });

    const { data } = await axios.get(
      `/sistemas/horas-extras/admin/rel/${id}/${time}`
    );

    if (!data.message.length) {
      return swal({
        title: "NENHUMA SOLICITAÇÃO ENCONTRADA",
        icon: "error",
        button: true,
      });
    }

    const tableContent = createTable(data.message);
    const tableContainer = document.querySelector(".wrapper-body-func");
    const modalTitle = document.querySelector(".my-modal-title");
    const modalFilterInfo = document.querySelector(".modal-filter-info");
    const closeModal = document.querySelector("#close-modal");

    closeModal.addEventListener("click", () => {
      modal.classList.remove("d-block");
      tableContainer.innerHTML = "";
      modalFilterInfo.innerHTML = "";
      modalTitle.innerHTML = "";
      return modal.classList.add("d-none");
    });

    modalFilterInfo.textContent = `FILTRO: ${time.toUpperCase()}`;
    modalTitle.innerHTML = `<p style="color: #8a40b4;">${name}</p>`;
    tableContainer.appendChild(tableContent);

    if (modal.classList.contains("d-none")) {
      modal.classList.remove("d-none");
      return modal.classList.add("d-block");
    } else {
      return modal.classList.add("show");
    }
  } catch (error) {
    console.log(error);
    e.preventDefault();
    return alert(error.response.data.message, "danger");
  }
});
const openModalButton = document.querySelector("#v-setor-rel");
const modalSetor = document.querySelector("#rel-modal-setor");

openModalButton.addEventListener("click", async (e) => {
  try {
    const setor = document.querySelector("#sel-setor");
    const formSetor = document.querySelector("#admin-setor-rel");
    const inputs = formSetor.querySelectorAll('input[type="radio"]');

    const id = setor.options[setor.selectedIndex].value;
    const name = setor.options[setor.selectedIndex].innerText;
    let time;

    if (id === "null") {
      return swal({
        title: "NENHUM SETOR SELECIONADO",
        icon: "error",
        button: true,
      });
    }

    inputs.forEach((el) => {
      if (el.checked) {
        time = el.value;
      }
    });

    const { data } = await axios.get(
      `/sistemas/horas-extras/admin/rel/setor/${id}/${time}`
    );

    if (!data.message.length) {
      return swal({
        title: "NENHUMA SOLICITAÇÃO ENCONTRADA",
        icon: "error",
        button: true,
      });
    }

    const tableContent = createTableSetor(data.message);
    const tableContainer = document.querySelector(".wrapper-body-setor");
    const modalTitle = document.querySelector(".my-modal-title-setor");
    const modalFilterInfo = document.querySelector(".modal-filter-info-setor");
    const closeModal = document.querySelector("#close-modal-setor");

    closeModal.addEventListener("click", () => {
      modalSetor.classList.remove("d-block");
      tableContainer.innerHTML = "";
      modalFilterInfo.innerHTML = "";
      modalTitle.innerHTML = "";
      return modalSetor.classList.add("d-none");
    });

    modalFilterInfo.textContent = `FILTRO: ${time.toUpperCase()}`;
    modalTitle.innerHTML = `<p style="color: #8a40b4;">${name}</p>`;
    tableContainer.appendChild(tableContent);

    if (modalSetor.classList.contains("d-none")) {
      modalSetor.classList.remove("d-none");
      return modalSetor.classList.add("d-block");
    } else {
      return modalSetor.classList.add("show");
    }
  } catch (error) {
    console.log(error);
    e.preventDefault();
    return alert(error.response.data.message, "danger");
  }
});

// cria tabela modal
function createTable(data) {
  if (!data.length) return;

  const table = document.createElement("table");
  const tableContent = document.createElement("tbody");
  let rows = [];

  table.classList.add("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th scope="col">ID SOLICITAÇÃO</th>
        <th scope="col">NOME</th>
        <th scope="col">MATRICULA</th>
        <th scope="col">SETOR</th>
        <th scope="col">HORA PREVISTA</th>
        <th scope="col">DIA PREVISTO</th>
        <th scope="col">ENTRADA/SAÍDA</th>
        <th scope="col">JUSTIFICATIVA</th>
        <th scope="col">STATUS</th>
      </tr>
    </thead>
  `;

  for (let i = 0; i < data.length; i++) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <th scope="row">${data[i].id}</th>
      <td>${data[i].Funcionario.nome}</td>
      <td>${data[i].Funcionario.matricula}</td>
      <td>${data[i].Funcionario.SubSetor.nomeSubSetor}</td>
      <td>${data[i].totalDeHorasPedido} horas/minutos</td>
      <td>${new Date(data[i].diaSolicitado).toLocaleDateString()}</td>
      <td>${data[i].horarioEntrada}h - ${data[i].horarioSaida}h</td>
      <td class="text-wrap text-break ${
        data[i].justificativa.length > 100 ? "text-primary" : ""
      }">${data[i].justificativa}</td>
      <td>${
        data[i].status > 3
          ? `<strong style='color:blue'>APROVADO</strong>`
          : data[i].status < 1
          ? `<strong style='color:red'>NEGADO</strong>`
          : `<strong style='color:orange'>PENDENTE</strong>`
      }</td>
    `;

    rows.push(tr);
  }

  for (let x = 0; x < rows.length; x++) {
    tableContent.appendChild(rows[x]);
  }
  table.appendChild(tableContent);

  return table;
}

function createTableSetor(data) {
  if (!data.length) return;

  const table = document.createElement("table");
  const tableContent = document.createElement("tbody");
  let rows = [];

  table.classList.add("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th scope="col">ID SOLICITAÇÃO</th>
        <th scope="col">NOME</th>
        <th scope="col">MATRICULA</th>
        <th scope="col">HORA PREVISTA</th>
        <th scope="col">DIA PREVISTO</th>
        <th scope="col">ENTRADA/SAÍDA</th>
        <th scope="col">JUSTIFICATIVA</th>
        <th scope="col">STATUS</th>
      </tr>
    </thead>
  `;

  for (let i = 0; i < data.length; i++) {
    for (let x = 0; x < data[i].Horas.length; x++) {
      const tr = document.createElement("tr");

      tr.innerHTML = `
      <th scope="row">${data[i].Horas[x].id}</th>
      <td>${data[i].nome}</td>
      <td>${data[i].matricula}</td>
      <td>${data[i].Horas[x].totalDeHorasPedido} horas/minutos</td>
      <td>${new Date(data[i].Horas[x].diaSolicitado).toLocaleDateString()}</td>
      <td>${data[i].Horas[x].horarioEntrada}h - ${
        data[i].Horas[x].horarioSaida
      }h</td>
      <td class="text-wrap text-break ${
        data[i].Horas[x].justificativa.length > 100 ? "text-primary" : ""
      }">${data[i].Horas[x].justificativa}</td>
      <td>${
        data[i].Horas[x].status > 3
          ? `<strong style='color:blue'>APROVADO</strong>`
          : data[i].Horas[x].status < 1
          ? `<strong style='color:red'>NEGADO</strong>`
          : "PENDENTE"
      }</td>
    `;

      rows.push(tr);
    }
  }

  for (let x = 0; x < rows.length; x++) {
    tableContent.appendChild(rows[x]);
  }
  table.appendChild(tableContent);

  return table;
}

// gera relatorio
const generateXlsxButton = document.querySelector("#generate_xlsx");

generateXlsxButton.addEventListener("click", async () => {
  try {
    const ids = [];
    const tableContainer = document.querySelector(".wrapper-body-func");
    const table = tableContainer.querySelector("table");
    const id = table.querySelectorAll("th[scope='row']");

    for (let i in id) {
      if (id[i].textContent) {
        ids.push(Number(id[i].textContent));
      }
    }

    console.log(ids);

    url = `/sistemas/horas-extras/gen-rel/${ids}`;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("target", "__blank");
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.log(error);
  }
});

const generateXlsxButtonSetor = document.querySelector("#generate_xlsx_setor");

generateXlsxButtonSetor.addEventListener("click", async () => {
  try {
    const ids = [];
    const tableContainer = document.querySelector(".wrapper-body-setor");
    const table = tableContainer.querySelector("table");
    const id = table.querySelectorAll("th[scope='row']");

    for (let i in id) {
      if (id[i].textContent) {
        ids.push(Number(id[i].textContent));
      }
    }

    console.log(ids);

    url = `/sistemas/horas-extras/gen-rel/${ids}`;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("target", "__blank");
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.log(error);
  }
});

// formata o input do cpf
function formatCpf() {
  const cpfInput = document.querySelector("#cpf");
  let cpf = cpfInput.value;
  const validCpf = /^(([0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}))$/;

  if (validCpf.test(cpf) === false) {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length === 11) {
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

      return (cpfInput.value = cpf);
    }
  }
}

// ajax para rota de criação
const cadButton = document.querySelector(".btn-cad");

cadButton.addEventListener("click", async () => {
  const inputs = document.querySelectorAll("#cad-func-form input");
  const feedback = document.querySelector("#func-cad-modal__feedback");
  let allFine = false;
  const failedInputs = [];
  let data;

  inputs.forEach((input) => {
    if (input.hasAttribute("required") && !input.value) {
      input.classList.add("border", "border-danger");
      failedInputs.push(input);
    } else {
      input.classList.remove("border", "border-danger");
    }
    return;
  });

  if (!failedInputs.length) {
    allFine = true;
  }

  console.log(inputs);

  if (allFine) {
    try {
      data = await axios.post(
        "/sistemas/horas-extras/admin/funcionario/create",
        {
          mat: inputs[0].value,
          name: inputs[1].value.toUpperCase(),
          cpf: inputs[2].value,
          nascimento: new Date(inputs[3].value.split(" ")[0]),
          senha: inputs[4].value,
          admissao: new Date(inputs[5].value.split(" ")[0]),
          cargoC: inputs[6].value.toUpperCase(),
          cargoO: inputs[7].value.toUpperCase(),
          vinculo: inputs[8].value.toUpperCase(),
          setID: Number(inputs[9].value),
          salEf: Number(inputs[12].value),
          salCom: Number(inputs[13].value),
          tel: inputs[14].value,
          level: Number(inputs[15].value),
          chefiaId: Number(inputs[10].value),
          secretarioId: Number(inputs[11].value),
        }
      );

      feedback.classList.remove("text-danger");
      feedback.classList.add("text-success");
      feedback.innerHTML = data.data.message;

      inputs.forEach((inp) => {
        inp.value = "";
      });

      return setTimeout(() => {
        feedback.classList.remove("text-success");
        feedback.innerHTML = "";
      }, 3000);
    } catch (error) {
      console.log(error);

      feedback.classList.remove("text-success");
      feedback.classList.add("text-danger");
      feedback.innerHTML = error.response.data.message;

      inputs.forEach((inp) => {
        inp.value = "";
      });

      return setTimeout(() => {
        feedback.classList.remove("text-danger");
        feedback.innerHTML = "";
      }, 3000);
    }
  }
});

// valida todos os inputs que precisam ser números
const numInputs = document.querySelectorAll(".num");

numInputs.forEach((inp) => {
  inp.addEventListener("input", (e) => {
    const reg = /^\d+$/;

    if (!reg.test(e.target.value)) {
      inp.classList.add("border", "border-danger");
      return;
    } else {
      if (inp.classList.contains("border-danger")) {
        inp.classList.remove("border", "border-danger");
      } else {
        return;
      }
    }
  });
});
