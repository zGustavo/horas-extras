// informa caso um pedido foi solicitado
window.addEventListener("DOMContentLoaded", (e) => {
  const didHappen = window.localStorage.getItem("requestHappened");

  if (didHappen) {
    swal({
      title: "PEDIDO REGISTRADO!",
      text: "Agora só aguardar a aprovação das chefias necessárias.",
      icon: "success",
      button: true,
    });

    setTimeout(() => {
      window.localStorage.clear();
    }, 2000);
  } else {
    return;
  }
});

// atualiza formulário
async function getUserFromMat() {
  const searchInputMatricula = document.querySelector("#matricula");
  const feedback = document.querySelector("#feedback");
  const foundUserForm = document.querySelector("#found-user");
  const foundUserFormInputs = document.querySelectorAll("#found-user input");
  const modalMatricula = document.querySelector("#matricula-modal");

  try {
    const res = await axios.get(
      `/sistemas/horas-extras/func/${searchInputMatricula.value}`
    );


    if (res) {
      foundUserFormInputs.forEach((inp) => {
        if (inp.getAttribute("id") === "matricula-func") {
          inp.value = res.data.parsedData.matricula.toUpperCase();
          modalMatricula.value = inp.value;
        } else if (inp.getAttribute("id") === "nome") {
          inp.value = res.data.parsedData.nome.toUpperCase();
        } else if (inp.getAttribute("id") === "funcao") {
          inp.value = res.data.parsedData.cargoOrigem.toUpperCase();
        } else if (inp.getAttribute("id") === "sub-setor") {
          inp.value = `${res.data.parsedData.SubSetor.Setor.nomeSetor.toUpperCase()} / ${res.data.parsedData.SubSetor.nomeSubSetor.toUpperCase()}`;
        } else if (inp.getAttribute("id") === "secretaria") {
          inp.value =
            res.data.parsedData.SubSetor.Setor.Secretarium.nomeSecretaria.toUpperCase();
        } else if (inp.getAttribute("id") === "cpf") {
          inp.value = res.data.parsedData.cpf;
        } else if (inp.getAttribute("id") === "data-nascimento") {
          inp.value = new Date(
            res.data.parsedData.dataNascimento
          ).toLocaleDateString();
        } else if (inp.getAttribute("id") === "email") {
          inp.value = res.data.parsedData.email ? res.data.parsedData.email.toUpperCase() : '-';
        } else if (inp.getAttribute("id") === "telefone") {
          inp.value = res.data.parsedData.telefone;
        } else if (inp.getAttribute("id") === "vinculo") {
          inp.value = res.data.parsedData.vinculo.toUpperCase();
        } else if (inp.getAttribute("id") === "faltas-abonadas") {
          inp.value = res.data.parsedData.faltsAbonadas
            ? res.data.parsedData.faltsAbonadas
            : "0";
        } else if (inp.getAttribute("id") === "total-horas") {
          inp.value = res.data.parsedData.totalDeHorasMes
            ? res.data.parsedData.totalDeHorasMes
            : "0";
        } else if (inp.getAttribute("id") === "data-admissao") {
          inp.value = new Date(
            res.data.parsedData.dataAdmissao
          ).toLocaleDateString();
        } else if (inp.getAttribute("id") === "tempo-servico") {
          const dAdmissao = new Date(res.data.parsedData.dataAdmissao);
          const hoje = new Date(Date.now());

          inp.value = `${hoje.getFullYear() - dAdmissao.getFullYear()} anos`;
        }
      });

      foundUserForm.classList.remove("d-none");
      foundUserForm.classList.add("d-block");

      const interval = setInterval(() => {
        if (!searchInputMatricula.value) {
          foundUserFormInputs.forEach((val) => {
            val.value = "";
          });
          foundUserForm.classList.remove("d-block");
          foundUserForm.classList.add("d-none");
          return clearInterval(interval);
        }
      }, 8000);
    }
  } catch (error) {
    console.log(error);
    if (searchInputMatricula.value) {
      feedback.classList.add("text-danger");
      feedback.innerHTML = "FUNCIONÁRIO NÃO ENCONTRADO.";
      searchInputMatricula.value = "";

      return setTimeout(() => {
        feedback.classList.remove("text-danger");
        feedback.innerHTML = "";
      }, 8000);
    }
  }
}

const submitButton = document.getElementById("btn-modal-submit");

submitButton.addEventListener("click", (e) => {
  e.preventDefault();

  const matModal = document.querySelector("#matricula-modal");
  const formModal = document.querySelector("#modal-form");
  const dia = document.querySelector("#dia");
  const hora = document.querySelector("#horas");
  const anexo = document.querySelector("#anexo");
  const justif = document.querySelector("#justificativa");
  const modalFeedback = document.querySelector(".modal-feedback");
  const pattern = /\.(gif|pdf|jpe?g|tiff?|png|webp|bmp)$/i;
  let isDiaDone = false;
  let isHoraDone = false;
  let isAnexoDone = true;
  let isAllDone = false;

  // checa se existe input sem valor
  if (!matModal.value || !dia.value || !hora.value || !justif.value) {
    matModal.classList.add("border", "border-danger");
    dia.classList.add("border", "border-danger");
    hora.classList.add("border", "border-danger");
    justif.classList.add("border", "border-danger");
    modalFeedback.classList.add("text-danger");
    modalFeedback.innerHTML = "PREENCHA TODOS OS CAMPOS.";

    return setTimeout(() => {
      matModal.classList.remove("border-danger");
      dia.classList.remove("border-danger");
      hora.classList.remove("border-danger");
      justif.classList.remove("border-danger");
      modalFeedback.classList.remove("text-danger");
      modalFeedback.innerHTML = "";
    }, 8000);
  } else {
    isAllDone = true;
  }

  // checa dia retroativo
  if (dia.value) {
    const date = new Date(dia.value);
    const today = new Date(Date.now());

    if (date.getDate() < today.getDate() - 2 && date.getMonth() === today.getMonth()) {
      dia.classList.add("border", "border-danger");
      modalFeedback.classList.add("text-danger");
      modalFeedback.innerHTML = "NÃO PERMITIDO DIAS RETROATIVOS.";

      setTimeout(() => {
        dia.classList.remove("border-danger");
        modalFeedback.classList.remove("text-danger");
        modalFeedback.innerHTML = "";
      }, 8000);
    } else {
      isDiaDone = true;
    }
  }

  // checa total de horas
  if (hora.value) {
    const date = new Date(dia.value);
    const semana = [
      "Domingo",
      "Segunda-Feira",
      "Terça-Feira",
      "Quarta-Feira",
      "Quinta-Feira",
      "Sexta-Feira",
      "Sábado",
    ];

    if (Number(hora.value) === NaN) {
      console.log("sit 1");
      hora.classList.add("border", "border-danger");
      modalFeedback.classList.add("text-danger");
      modalFeedback.innerHTML = "É PERMITIDO APENAS NÚMEROS.";

      setTimeout(() => {
        hora.classList.remove("border-danger");
        modalFeedback.classList.remove("text-danger");
        modalFeedback.innerHTML = "";
      }, 8000);
    } else if (!hora.value.split(".")) {
      hora.classList.add("border", "border-danger");
      modalFeedback.classList.add("text-danger");
      modalFeedback.innerHTML = "FAVOR TROCAR A ',' POR PONTO.";

      setTimeout(() => {
        hora.classList.remove("border-danger");
        modalFeedback.classList.remove("text-danger");
        modalFeedback.innerHTML = "";
      }, 8000);
    } else if (
      Number(hora.value.split(".")[1]) > 50 ||
      Number(hora.value.split(".")[1]) < 0
    ) {
      hora.classList.add("border", "border-danger");
      modalFeedback.classList.add("text-danger");
      modalFeedback.innerHTML = "SEGUIR EXEMPLO DESCRITO NO CAMPO DE HORAS.";

      setTimeout(() => {
        hora.classList.remove("border-danger");
        modalFeedback.classList.remove("text-danger");
        modalFeedback.innerHTML = "";
      }, 8000);
    } else if (
      semana[date.getDay()] === "Sábado" ||
      semana[date.getDay()] === "Domingo"
    ) {
      if (Number(hora.value) > 10) {
        hora.classList.add("border", "border-danger");
        modalFeedback.classList.add("text-danger");
        modalFeedback.innerHTML =
          "VALOR TOTAL ULTRAPASSADO OU O VALOR TOTAL É NEGATIVO.";

        setTimeout(() => {
          hora.classList.remove("border-danger");
          modalFeedback.classList.remove("text-danger");
          modalFeedback.innerHTML = "";
        }, 8000);
      } else {
        isHoraDone = true;
      }
    } else if (
      semana[date.getDay()] !== "Sábado" ||
      semana[date.getDay()] !== "Domingo"
    ) {
      if (Number(hora.value) > 2) {
        console.log("assist2");
        hora.classList.add("border", "border-danger");
        modalFeedback.classList.add("text-danger");
        modalFeedback.innerHTML =
          "VALOR TOTAL ULTRAPASSADO OU O VALOR TOTAL É NEGATIVO.";

        setTimeout(() => {
          hora.classList.remove("border-danger");
          modalFeedback.classList.remove("text-danger");
          modalFeedback.innerHTML = "";
        }, 8000);
      } else {
        isHoraDone = true;
      }
    }
  }

  if (anexo.value) {
    if (!anexo.value.match(pattern)) {
      anexo.classList.add("border", "border-danger");
      modalFeedback.classList.add("text-danger");
      modalFeedback.innerHTML = "APENAS ARQUIVOS PDF, PNG, JPG E JPEG.";
      isAnexoDone = false;

      setTimeout(() => {
        anexo.classList.remove("border-danger");
        modalFeedback.classList.remove("text-danger");
        modalFeedback.innerHTML = "";
      }, 8000);
    } else {
      isAnexoDone = true;
    }
  }

  console.log(isAllDone, isAnexoDone, isDiaDone, isHoraDone);

  if (isAllDone && isAnexoDone && isDiaDone && isHoraDone) {
    window.localStorage.setItem("requestHappened", true);
    return formModal.submit();
  }
});

// limpar todos os vazlores do input
const clearBtn = document
  .querySelector(".btn-secondary")
  .addEventListener("click", (e) => {
    e.preventDefault();
    const inputs = document.querySelectorAll("#modal-form input");
    const textarea = document.querySelector("#modal-form textarea");

    inputs.forEach((inp) => {
      if (inp.getAttribute("id") !== "matricula-modal") {
        inp.value = "";
      }
    });

    textarea.value = "";
  });
