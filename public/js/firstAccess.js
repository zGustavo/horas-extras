/* 
- Se há valor no input de email
- Se sim, checar se é um email válido
*/

const userEmail = document.querySelector("#email");

userEmail.addEventListener("change", (e) => {
  if (validateEmail(e.target.value) && e.target.value) {
    e.target.classList.remove("border-danger");
    return e.target.classList.add("border-success");
  } else {
    e.target.classList.remove("border-success");
    return e.target.classList.add("border-danger");
  }
});

function validateEmail(target) {
  return String(target)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    );
}

// valida as senhas
function validatePassword() {
  const pass = document.querySelector("#password");

  if (pass.value.length > 8) {
    pass.classList.remove("border-danger");
    return;
  } else {
    pass.classList.add("border-danger");
    return;
  }
}

// toggle pass visibility
const togglePassVis = document.querySelector("#show-password");

togglePassVis.addEventListener("click", () => {
  const pass = document.querySelector("#password");

  if (togglePassVis.classList.contains("show-pass")) {
    togglePassVis.innerHTML = `
      <span><i class="bi bi-eye"></i></span>
      <span class="text-muted">Esconder senha</span>
    `;

    pass.setAttribute("type", "text");
    togglePassVis.classList.remove("show-pass");
  } else {
    togglePassVis.innerHTML = `
      <span><i class="bi bi-eye-slash"></i></span>
      <span class="text-muted">Mostrar senha</span>
    `;

    pass.setAttribute("type", "password");
    togglePassVis.classList.add("show-pass");
  }
});

// make the change
const confirmButton = document.querySelector("#yes");

confirmButton.addEventListener("click", async () => {
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");
  const secret = document.querySelector("#secret");
  const answer = document.querySelector("#secret-answer");
  const matricula = document.querySelector("#matricula");

  if (!password.value || !secret.value || !answer.value)
    return alert(
      "Preencha todos os campos obrigatórios (senha, pergunta secreta e resposta secreta)"
    );

  try {
    const res = await axios.post(
      "/sistemas/horas-extras/primeiro_acesso/update",
      {
        matricula: matricula.value,
        email: email.value ? email.value : undefined,
        password: password.value,
        secret: secret.value,
        secretAnswer: answer.value,
      }
    );

    if (res) {
      return swal({
        title: "DADOS ATUALIZADO COM SUCESSO",
        icon: "success",
        button: true,
      }).then((result) => {
        window.location.href = "/sistema/horas-extras/login";
      });
    }
  } catch (error) {
    console.log(error);
    return swal({
      title: "OPS! ACONTECEU UM ERRO INESPERADO.",
      icon: "error",
      button: true,
    });
  }
});
