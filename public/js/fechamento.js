const button = document.querySelector("#efetuar-fechamento");
const modal = document.querySelector("[data-inform-show]");

button.addEventListener("click", async () => {
  const dataId = document.querySelectorAll("[data-id]");
  const ids = [];

  try {
    Swal.fire({
      title: "TEM CERTEZA?",
      text: "Não será possível reverter essa ação, caso exista solicitações pendentes, entre em contato com a chefia",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8a40b4",
      cancelButtonColor: "#d33",
      confirmButtonText: "SIM, CONTINUAR!",
    }).then((result) => {
      if (result.isConfirmed) {
        setModalActive(true);

        dataId.forEach((data) => {
          ids.push(Number(data.getAttribute("data-id")));
        });

        const res = axios
          .post(`/sistema/horas-extras/admin/fechamento/${ids}`)
          .then((result) => {
            const svgContainer = document.querySelector(".svg-container");
            const bodyText = document.querySelector(".body-text");
            const aTag = document.querySelector("#link-rel");

            if (result.status === 200) {
              svgContainer.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
            </svg>
        `;

              bodyText.innerHTML = result.data.message;
              aTag.href = result.data.link;
              aTag.classList.add("p-2", "rounded", "fw-bold", "cad-func-btn");
              aTag.innerText = "BAIXAR RELATÓRIO";
            }

            aTag.addEventListener("click", () => {
              aTag.innerHTML = "";
              aTag.classList.remove(
                "p-2",
                "rounded",
                "fw-bold",
                "cad-func-btn"
              );
              bodyText.innerHTML = "EFETUANDO O FECHAMENTO...";
              svgContainer.innerHTML = `
          
          <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="bi bi-gear"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"
          />
          <path
            d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"
          />
        </svg>
          `;

              setModalActive(false);
            });
          })
          .catch((err) => console.log(err));
      }
    });
  } catch (error) {
    console.log(error);
  }
});

function setModalActive(bool) {
  if (bool) {
    modal.classList.add("able");
  } else {
    modal.classList.remove("able");
  }
}
