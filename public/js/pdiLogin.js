const form = document.querySelector("form");
const feedback = document.querySelector("#feedback");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById("submit-btn");

    if (!e.target[0].value || !e.target[1].value)
        return form.classList.add("was-validated");

    try {
        submitBtn.innerHTML =
            "<span class='spinner-grow m-auto spinner-grow-sm' role='status' aria-hidden='true'></span>";

        const res = await axios.post("/auth", {
            user: e.target[0].value,
            password: e.target[1].value,
        });

        if (res.status === 200) {
            submitBtn.classList.remove("btn-primary");
            submitBtn.classList.add("btn-success");
            submitBtn.innerHTML = `${res.data.message}`;
        }

        // window.location.href = "/main";
        setTimeout(() => {
            submitBtn.classList.remove("btn-success");
            submitBtn.classList.add("btn-primary");
            submitBtn.innerHTML = "ENTRAR";
            window.location.href = "/pdi/main";
        }, 2000);
    } catch (error) {
        console.log(error);
        submitBtn.classList.remove("btn-success");
        submitBtn.classList.add("btn-danger");
        submitBtn.innerHTML = error.response.data.message;

        setTimeout(() => {
            submitBtn.classList.remove("btn-danger");
            submitBtn.classList.add("btn-primary");
            submitBtn.innerHTML = "ENTRAR";
        }, 4000);
    }
});
