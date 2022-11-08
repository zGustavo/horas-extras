// pattern para input de arquivo/anexo.
const pattern = /\.(gif|pdf|jpe?g|tiff?|png|webp|bmp)$/i;
let isEverythingOkay = false;

const form = document.querySelector("#hora-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let date = new Date(e.target[1].value).getDay();

  const semana = [
    "Domingo",
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado",
  ];

  const matricula = e.target[0];
  const dia = e.target[1];
  const horaPedido = e.target[2];
  const file = e.target[3];
  const justificativa = e.target[4];

  // checa se valor é vazio
  if (
    !matricula.value ||
    !dia.value ||
    !horaPedido.value ||
    !justificativa.value
  ) {
    matricula.classList.add("border", "border-danger");
    dia.classList.add("border", "border-danger");
    horaPedido.classList.add("border", "border-danger");
    justificativa.classList.add("border", "border-danger");

    return setInterval(() => {
      matricula.classList.remove("border", "border-danger");
      dia.classList.remove("border", "border-danger");
      horaPedido.classList.remove("border", "border-danger");
      justificativa.classList.remove("border", "border-danger");
    }, 5000);
  }

  // checa se o valor dps do . é maior q 59 ou menor q 0
  const valorDepoisDoPonto =
    horaPedido.value === NaN ? null : Number(horaPedido.value.split(".")[1]);

  if (valorDepoisDoPonto > 59 || valorDepoisDoPonto < 0) {
    horaPedido.classList.add("border", "border-danger");
    return setInterval(() => {
      horaPedido.classList.remove("border", "border-danger");
    }, 5000);
  }

  // checa se o formato do arquivo corresponde ao permitido
  if (file.value) {
    if (!file.value.match(pattern)) {
      file.classList.add("border", "border-danger");
      return setInterval(() => {
        file.classList.remove("border", "border-danger");
      }, 5000);
    }
  }

  // checa se o valor de horas é maior q 2h pra dias semana ou 10h para finais de semana
  if (semana[date] === "Sábado" || semana[date] === "Domingo") {
    if (Number(horaPedido.value) > 10) {
      horaPedido.classList.add("border", "border-danger");
      return setInterval(() => {
        horaPedido.classList.remove("border", "border-danger");
      }, 5000);
    }
  } else {
    if (Number(horaPedido.value) > 2) {
      horaPedido.classList.add("border", "border-danger");
      return setInterval(() => {
        horaPedido.classList.remove("border", "border-danger");
      }, 5000);
    }
  }

  isEverythingOkay = true;

  if (isEverythingOkay) {
    form.submit();
  }
});
