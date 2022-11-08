const yesBtn = document.getElementById("yes");

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const email = document.getElementById("email");
const matricula = document.getElementById("matricula");

// checa se o tamanho da senha encaixa nos requisitos
password.addEventListener("input", () => {
  const feedback = document.querySelector(".feedback");

  if (password.value.length < 8) {
    feedback.classList.remove("valid");
    feedback.innerHTML = "Senha deve conter mais que 8 caracteres.";
    feedback.classList.add("invalid");
  } else if (password.value.length > 8) {
    feedback.classList.remove("invalid");
    feedback.classList.add("valid");
    feedback.innerHTML = "Parece bom!";
  }

  setInterval(() => {
    if (!password.value) {
      feedback.classList.remove("invalid");
      feedback.classList.remove("valid");
      feedback.innerHTML = "";
    }
  }, 5000);
});

// valida o input do email
email.addEventListener("input", () => {
  const feedbackEmail = document.querySelector(".feedback-email");
  if (validateEmail(email.value)) {
    feedbackEmail.classList.remove("invalid");
    feedbackEmail.classList.add("valid");
    feedbackEmail.innerHTML = "Parece bom!";
  } else {
    feedbackEmail.classList.remove("valid");
    feedbackEmail.classList.add("invalid");
    feedbackEmail.innerHTML = "Insira um email valido!";
    yesBtn.setAttribute("disabled", true);
  }

  setInterval(() => {
    if (!email.value) {
      feedbackEmail.classList.remove("invalid");
      feedbackEmail.classList.remove("valid");
      feedbackEmail.innerHTML = "";
    }
  }, 5000);
});

// valida a confirmação de senha
confirmPassword.addEventListener("input", () => {
  const feedbackConfirm = document.querySelector(".feedback-confirm");

  if (confirmPassword.value !== password.value) {
    feedbackConfirm.classList.remove("valid");
    feedbackConfirm.classList.add("invalid");
    feedbackConfirm.innerHTML = "A senhas devem ser iguais!";
  } else {
    feedbackConfirm.classList.remove("invalid");
    feedbackConfirm.classList.add("valid");
    feedbackConfirm.innerHTML = "Parece bom!";
    yesBtn.removeAttribute("disabled");
  }

  setInterval(() => {
    if (!confirmPassword.value) {
      feedbackConfirm.classList.remove("invalid");
      feedbackConfirm.classList.remove("valid");
      feedbackConfirm.innerHTML = "";
    }
  }, 5000);
});

// função valida o email
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return String(email).toLowerCase().match(re);
}

// submit troca de senha e att email

yesBtn.addEventListener("click", async () => {
  if (!email.value || !confirmPassword.value || !password.value) {
    yesBtn.classList.remove("valid");
    yesBtn.classList.add("invalid");
    return;
  } else {
    yesBtn.classList.remove("valid");
    yesBtn.classList.remove("invalid");
  }

  try {
    yesBtn.innerHTML = "Atualizando...";
    const res = await axios.post(
      "/sistemas/horas-extras/primeiro_acesso/update",
      {
        matricula: matricula.value,
        password: password.value,
        email: email.value,
      }
    );

    if (res.status === 200) {
      yesBtn.classList.remove("invalid");
      yesBtn.classList.add("active");
      yesBtn.innerHTML = res.data.message.toUpperCase();
    }

    setTimeout(() => {
      yesBtn.classList.remove("valid");
      yesBtn.innerHTML = "Confirmar.";
      window.location.href = "/sistema/horas-extras/login";
    }, 5000);
  } catch (error) {
    console.log(error);

    yesBtn.classList.remove("valid");
    yesBtn.classList.add("invalid");
    yesBtn.innerHTML = error.response.data.message
      ? error.response.data.message
      : "ALGO DEU ERRADO.";
  }

  setTimeout(() => {
    yesBtn.classList.remove("invalid");
    yesBtn.innerHTML = "Confirmar.";
  }, 5000);
});
