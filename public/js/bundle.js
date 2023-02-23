const footer = document.querySelector("footer");

const links = {
    gustavo: {
        name: "Gustavo",
        link: "https://www.linkedin.com/in/gustavo-web/",
    },
    rodolfo: {
        name: "Rodolfo",
        link: "https://www.linkedin.com/in/RDO4/",
    },
    vinicius: {
        name: "Vinicius",
        link: "https://www.linkedin.com/in/vinicius-palmieri-serafim-lossavero-6a2029225/",
    },
    marcos: {
        name: "Marcos",
        link: "https://www.linkedin.com/in/marcos-padovani-882a98188/",
    },
    rogerio: {
        name: "Rogério",
    },
};

function pulseAnimation() {
    const target = document.querySelector("[data-animation-pulse]");
    const defaultText = "Desenvolvimento: Secretaria de Administração";

    if (target.classList.contains("active")) {
        setTimeout(() => {
            target.classList.remove("active");
        }, 1000);
    }

    setInterval(() => {
        if (target.innerText !== defaultText) {
            target.classList.add("active");
            target.innerHTML = defaultText;
            return;
        } else {
            target.innerHTML = `
    <div class='w-100 d-flex align-items-center justify-content-center flex-column' id='drop'>
        <div class='w-100 d-flex align-items-center justify-content-center'> 
            Desenvolvedores:
        </div>
        <div class='d-flex align-items-center justify-content-center flex-row'>
            <a href="${links.gustavo.link
                }" class="me-1 text-decoration-none text-dark">${links.gustavo.name.toUpperCase()}</a>
            <a href="${links.rodolfo.link
                }" class="me-1 text-decoration-none text-dark">${links.rodolfo.name.toUpperCase()}</a>
            <a href="${links.vinicius.link
                }" class="me-1 text-decoration-none text-dark">${links.vinicius.name.toUpperCase()}</a>
            <a href="${links.marcos.link
                }" class="me-1 text-decoration-none text-dark">${links.marcos.name.toUpperCase()}</a>
            <a href="${links.gustavo.link
                }" class="me-1 text-decoration-none text-dark">${links.rogerio.name.toUpperCase()}</a>
        </div>
    </div>
  
  `;

            target.classList.add("active");
            return;
        }
    }, 10000);
}

pulseAnimation();

// redirecionamento

const cards = document.querySelectorAll(".max-w");

cards.forEach((card) => {
    card.addEventListener("click", function () {
        if (card.getAttribute("id") === "horas") {
            window.location.href = "/sistema/horas-extras/login";
        } else if (card.getAttribute("id") === "pdi") {
            window.location.href = "/sistemas/pdi/login";
        } // ... more soon
    });
});
