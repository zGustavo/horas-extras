const search = document.querySelector("#search");

search.addEventListener("click", async (e) => {
  const matricula = document.querySelector("#mat");
  const feedback = document.querySelector(".feedback");
  const data = document.querySelector("#data");
  const secretPTag = document.querySelector(".secret");
  const name = document.querySelector("#name");

  if (!matricula.value) {
    feedback.classList.remove("text-success");
    feedback.classList.add("text-danger");
    feedback.innerHTML = "INFORME A MATRICULA";

    return setTimeout(() => {
      feedback.classList.remove("text-danger");
      feedback.innerHTML = "";
    }, 3000);
  }

  try {
    const res = await axios.get(
      `/sistema/horas-extras/reset/${matricula.value}`
    );

    if (res.status === 200) {
      data.classList.remove("d-none");
      data.classList.add("d-flex");
      secretPTag.innerHTML = res.data.message.pergunta;
      name.innerHTML = `NOME: ${res.data.message.nome}`;
    } else {
      return;
    }

    const togglePassButton = document.querySelector(".togglePass");
    const password = document.querySelector("#password");
    const ans = document.querySelector("#answer");

    togglePassButton.addEventListener("click", () => {
      if (password.getAttribute("type") === "password") {
        password.setAttribute("type", "text");
        togglePassButton.innerHTML = "Esconder senha";
      } else {
        password.setAttribute("type", "password");
        togglePassButton.innerHTML = "Mostrar senha";
      }
    });

    const changeButton = document.querySelector("#change");

    if (changeButton) {
      changeButton.addEventListener("click", async () => {
        const answer = res.data.message.resposta.toLowerCase();

        if (ans.value.toLowerCase() !== answer) {
          feedback.classList.remove("text-success");
          feedback.classList.add("text-danger");
          feedback.innerHTML = "RESPOSTA INCORRETA";

          return setTimeout(() => {
            feedback.classList.remove("text-danger");
            feedback.innerHTML = "";
          }, 3000);
        }

        try {
          changeButton.innerHTML = "AGUARDE...";

          const r = await axios.put(
            `/sistema/horas-extras/reset/change/${matricula.value}`,
            {
              password: password.value,
            }
          );

          swal({
            title: r.data.message,
            icon: "success",
            button: true,
          }).then(() => {
            window.location.href = "/sistema/horas-extras/login";
          });

          console.log(situation);
        } catch (error) {
          console.log(error);
          changeButton.innerHTML = "MUDAR";
          return swal({
            title: error.response.data.message,
            icon: "warning",
            button: true,
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
    feedback.classList.remove("text-success");
    feedback.classList.add("text-danger");
    feedback.innerHTML = error.response.data.message;

    return setTimeout(() => {
      feedback.classList.remove("text-danger");
      feedback.innerHTML = "";
    }, 3000);
  }
});
