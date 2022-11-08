const expandButton = document.querySelectorAll("[data-setor-nome]");
const hourWrapper = document.querySelectorAll("[data-func-set-nome]");
const aprovAllButtons = document.querySelectorAll("[data-aprov-all-set-name]");
const singleAprovButton = document.querySelectorAll("[data-aprov-id]");
const singleReprovButton = document.querySelectorAll("[data-reprov-id]");
const hours = document.querySelectorAll("[data-id]");

// expandir as horas do setor
expandButton.forEach((expand) => {
  expand.addEventListener("click", function () {
    hourWrapper.forEach((hour) => {
      if (
        hour.getAttribute("data-func-set-nome") ===
        expand.getAttribute("data-setor-nome")
      ) {
        if (hour.classList.contains("d-none")) {
          hour.classList.remove("d-none");
          hour.classList.add("d-block");
          expand.classList.add("active");
          aprovAllButtons.forEach((btn) => {
            if (
              btn.getAttribute("data-aprov-all-set-name") ===
              expand.getAttribute("data-setor-nome")
            ) {
              btn.classList.remove("d-none");
              btn.classList.add("d-block");
            }
          });
        } else {
          hour.classList.remove("d-block");
          hour.classList.add("d-none");
          expand.classList.remove("active");
          aprovAllButtons.forEach((btn) => {
            if (
              btn.getAttribute("data-aprov-all-set-name") ===
              expand.getAttribute("data-setor-nome")
            ) {
              btn.classList.remove("d-block");
              btn.classList.add("d-none");
            }
          });
        }
      } else {
        expand.classList.remove("active");
      }
    });
  });
});

// aprova unica solicitação
singleAprovButton.forEach((id) => {
  id.addEventListener("click", () => {
    hours.forEach(async (hour) => {
      if (hour.getAttribute("data-id") === id.getAttribute("data-aprov-id")) {
        hour.innerHTML = `
                <div class="spinner-border text-light" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                `;

        const res = await axios.put(
          `/sistemas/horas-extras/hora/aprov/${hour.getAttribute("data-id")}`
        );

        if (!res) {
          id.innerHTML = res.data.message;
          id.classList.remove("btn-success");
          id.classList.add("btn-danger");

          return setInterval(() => {
            id.classList.remove("btn-danger");
            id.classList.add("btn-success");
            id.innerHTML = "APROVAR";
          }, 5000);
        } else {
          console.log(res);
          id.innerHTML = res.data.message;
          return setInterval(() => {
            id.classList.remove("btn-danger");
            id.classList.add("btn-success");
            id.innerHTML = "APROVAR";
            hour.parentNode.removeChild(hour);
            window.location.reload();
          }, 1000);
        }
      }
    });
  });
});

// reprovar single solicitação
singleReprovButton.forEach((id) => {
  id.addEventListener("click", () => {
    hours.forEach(async (hour) => {
      if (hour.getAttribute("data-id") === id.getAttribute("data-reprov-id")) {
        hour.innerHTML = `
                <div class="spinner-border text-light" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                `;

        const res = await axios.put(
          `/sistemas/horas-extras/hora/reprov/${hour.getAttribute("data-id")}`
        );

        if (!res) {
          id.innerHTML = res.data.message;
          id.classList.remove("btn-success");
          id.classList.add("btn-danger");

          return setInterval(() => {
            id.classList.remove("btn-danger");
            id.classList.add("btn-success");
            id.innerHTML = "APROVAR";
          }, 5000);
        } else {
          console.log(res);
          id.innerHTML = res.data.message;
          return setInterval(() => {
            id.classList.remove("btn-danger");
            id.classList.add("btn-success");
            id.innerHTML = "APROVAR";
            hour.parentNode.removeChild(hour);
            window.location.reload();
          }, 1000);
        }
      }
    });
  });
});

const aprovAllHoursButton = document.querySelectorAll(
  "[data-aprov-all-set-name] button"
);
const hoursWrapper = document.querySelector("[data-func-set-nome]");

aprovAllHoursButton.forEach((button) => {
  button.addEventListener("click", async () => {
    const setor = document.querySelector("[data-aprov-all-set-name]");
    const dataAttr = setor.getAttribute("data-aprov-all-set-name");
    const hoursAttr = hoursWrapper.getAttribute("data-func-set-nome");

    if (dataAttr === hoursAttr) {
      const hoursId = hoursWrapper.querySelectorAll("[data-id]");

      if (button.getAttribute("id") === "aprov-all") {
        hoursId.forEach(async (id) => {
          try {
            const res = await axios.put(
              `/sistemas/horas-extras/hora/aprov/${id.getAttribute("data-id")}`
            );
          } catch (error) {
            console.log(error);
          }
        });

        setInterval(() => {
          return window.location.reload();
        }, 2000);
      } else {
        hoursId.forEach(async (id) => {
          try {
            const res = await axios.put(
              `/sistemas/horas-extras/hora/reprov/${id.getAttribute("data-id")}`
            );
          } catch (error) {
            console.log(error);
          }
        });

        setInterval(() => {
          return window.location.reload();
        }, 2000);
      }
    }
  });
});
