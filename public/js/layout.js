// ativa/desativa navbar
const menuToggler = document.querySelector(".menu-toggler");

menuToggler.addEventListener("click", () => {
  const menu = document.querySelector("aside");
  const logo = document.querySelector(".logo-menu img");
  const col = document.querySelector("#menu-col");

  if (col.classList.contains("col-sm-0")) {
    col.classList.remove("col-sm-0");
  } else {
    col.classList.add("col-sm-0");
  }
  menu.classList.toggle("active");
  logo.classList.toggle("active");
});

const goBack = document.getElementById("goback");

goBack.addEventListener("click", () => {
  return window.history.back();
});
