const form = document.querySelector("form");
const feedback = document.querySelector("#feedback");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = document.querySelector("#user");
  const password = document.querySelector("#password");

  const submitBtn = document.getElementById("submit-btn");

  if (!user.value || !password.value)
    return form.classList.add("was-validated");

  try {
    submitBtn.innerHTML =
      "<span class='spinner-grow m-auto spinner-grow-sm' role='status' aria-hidden='true'></span>";

    const res = await axios.post("/sistema/horas-extras/auth", {
      matricula: user.value,
      password: password.value,
    });

    if (res.status === 200) {
      submitBtn.classList.remove("btn-primary");
      submitBtn.classList.add("btn-success");
      submitBtn.innerHTML = `${res.data.message}`;
    }

    // window.location.href = "/main";
    setTimeout(() => {
      user.value = "";
      password.value = "";
      submitBtn.classList.remove("btn-success");
      submitBtn.classList.add("btn-primary");
      submitBtn.innerHTML = "ENTRAR";
      window.location.href = "/sistema/horas-extras/main";
    }, 2000);
  } catch (error) {
    console.log(error);
    submitBtn.classList.remove("btn-success");
    submitBtn.classList.add("btn-danger");
    submitBtn.innerHTML = error.response.data.message;
    user.value = "";
    password.value = "";

    setTimeout(() => {
      submitBtn.classList.remove("btn-danger");
      submitBtn.classList.add("btn-primary");
      submitBtn.innerHTML = "ENTRAR";
    }, 2000);
  }
});

// Example starter JavaScript for disabling form submissions if there are invalid fields
