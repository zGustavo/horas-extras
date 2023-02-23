// expande as horas extras 
const btnWrapper = document.querySelectorAll(".wrapper-button");

btnWrapper.forEach((btn) => {
  btn.addEventListener("click", function () {
    const wrapper = document.querySelectorAll("[data-for]");
    
    wrapper.forEach((wr) => {
      if (wr.getAttribute("data-for") === btn.getAttribute("data-open")) {
        if (wr.classList.contains("d-none")) {
          wr.classList.remove("d-none");
          wr.classList.add("d-block");
                } else {
          wr.classList.remove("d-block");
          wr.classList.add("d-none");
                }
            }
    });
  });
});

// aprovar ou reprovar um por um
const aprovButton = document.querySelectorAll(".aprov");
const reprovButton = document.querySelectorAll(".reprov");

aprovButton.forEach((button) => {
  button.addEventListener("click", async function () {
    const id = Number(this.getAttribute("data-aprov"));

       try {
      const res = await axios.put(`/sistemas/horas-extras/hora/aprov/${id}`);

        swal({
            title: res.data.message,
        icon: "success",
        button: true,
      }).then((value) => {
            if (value === true) {
          return window.location.reload();
            }
      });
       } catch (error) {
      console.log(error);
        swal({
            title: error.response.data.message,
        icon: "warning",
        button: true,
      });
       }
  });
});

reprovButton.forEach((button) => {
  button.addEventListener("click", async function () {
    const id = Number(this.getAttribute("data-reprov"));

       try {
      const res = await axios.put(`/sistemas/horas-extras/hora/reprov/${id}`);

        swal({
            title: res.data.message,
        icon: "success",
        button: true,
      }).then((value) => {
            if (value === true) {
          return window.location.reload();
            }
      });
       } catch (error) {
      console.log(error);
        swal({
            title: error.response.data.message,
        icon: "warning",
        button: true,
      });
       }
  });
});

// aprovar, reprovar todos
const aprovAllButton = document.querySelector(".aprov-all");
const reprovAllButton = document.querySelector(".reprov-all");

if (aprovAllButton) {
  aprovAllButton.addEventListener("click", async () => {
    const ids = document.querySelectorAll("[data-id]");
    const idsArray = [];
    
    ids.forEach((id) => {
      idsArray.push(id.getAttribute("data-id"));
    });
    
        try {
      const res = idsArray.map(async (id) => {
        return await axios.put(
          `/sistemas/horas-extras/hora/aprov/${Number(id)}`
        );
      });
    
            swal({
        title: "SOLICITAÇÕES APROVADAS",
        icon: "warning",
        button: true,
      }).then((value) => {
                if (value === true) {
          return window.location.reload();
                }
      });
        } catch (error) {
      console.log(error);
            swal({
                title: error.response.data.message,
        icon: "warning",
        button: true,
      });
        }
  });
} 

if (reprovAllButton) {
  reprovAllButton.addEventListener("click", async () => {
    const ids = document.querySelectorAll("[data-id]");
    const idsArray = [];
    
    ids.forEach((id) => {
      idsArray.push(id.getAttribute("data-id"));
    });
    
        try {
      const res = idsArray.map(async (id) => {
        return await axios.put(
          `/sistemas/horas-extras/hora/reprov/${Number(id)}`
        );
      });
    
            swal({
        title: "SOLICITAÇÕES REPROVADAS",
        icon: "warning",
        button: true,
      }).then((value) => {
                if (value === true) {
          return window.location.reload();
                }
      });
        } catch (error) {
      console.log(error);
            swal({
                title: error.response.data.message,
        icon: "warning",
        button: true,
      });
        }
  });
} 

// aprovação nível 3
const aprovAllButton3 = document.querySelectorAll("[data-aprov-all-set]");
const reprovAllButton3 = document.querySelectorAll("[data-reprov-all-set]");

if (aprovAllButton3) {
  aprovAllButton3.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const ids = document.querySelectorAll("[data-id]");
      const arr = [];

      ids.forEach((id) => {
        if (
          id.getAttribute("data-setor") ===
          btn.getAttribute("data-aprov-all-set")
        ) {
          arr.push(id.getAttribute("data-id"));
                }
      });

            try {
        const res = arr.map(async (id) => {
          return await axios.put(
            `/sistemas/horas-extras/hora/aprov/${Number(id)}`
          );
        });
        
                swal({
          title: `SOLICITAÇÕES DE ${btn
            .getAttribute("data-aprov-all-set")
            .toUpperCase()} APROVADAS.`,
          icon: "success",
          button: true,
        }).then((value) => {
                    if (value === true) {
            return window.location.reload();
                    }
        });
            } catch (error) {
        console.log(error);
                swal({
                    title: error.response.data.message,
          icon: "warning",
          button: true,
        });
            }
    });
  });
}
if (reprovAllButton3) {
  reprovAllButton3.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const ids = document.querySelectorAll("[data-id]");
      const arr = [];

      ids.forEach((id) => {
        if (
          id.getAttribute("data-setor") ===
          btn.getAttribute("data-reprov-all-set")
        ) {
          arr.push(id.getAttribute("data-id"));
                }
      });

            try {
        const res = arr.map(async (id) => {
          return await axios.put(
            `/sistemas/horas-extras/hora/reprov/${Number(id)}`
          );
        });
        
                swal({
          title: `SOLICITAÇÕES DE ${btn
            .getAttribute("data-reprov-all-set")
            .toUpperCase()} REPROVADAS.`,
          icon: "warning",
          button: true,
        }).then((value) => {
                    if (value === true) {
            return window.location.reload();
                    }
        });
      } catch (error) {
        console.log(error);
        swal({
          title: error.response.data.message,
          icon: "warning",
          button: true,
        });
      }
    });
  });
}
                
// cancelar hora extra
const cancelBtn = document.querySelectorAll("#cancel-request");

if (cancelBtn) {
  cancelBtn.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-req-id");

      try {
        const r = await axios.post("/sistemas/horas-extras/hora/cancel", {
          id,
        });

        const message = r.data.message;

        swal({
          title: message,
          icon: "success",
          button: true,
        }).then((value) => {
          if (value === true) {
            return window.location.reload();
          }
        });
            } catch (error) {
                console.log(error)
                swal({
                    title: error.response.data.message,
          icon: "error",
          button: true,
        }).then((value) => {
          if (value === true) {
            return window.location.reload();
            }
        });
}
    });
  });
}
