const body = document.querySelector("body"),
      modeToggle = body.querySelector(".mode-toggle"),
      modeToggle2 = body.querySelector(".mode-toggle2"),
      sidebar = body.querySelector("nav"),
      sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
    body.classList.toggle("dark");
} else if (getMode && getMode === "red") {
    body.classList.toggle("red");
}

modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    body.classList.remove("red"); // Asegurarse de que no esté en modo rojo

    if (body.classList.contains("dark")) {
        localStorage.setItem("mode", "dark");
    } else {
        localStorage.setItem("mode", "light");
    }
});

modeToggle2.addEventListener("click", () => {
    body.classList.toggle("red");
    body.classList.remove("dark"); // Asegurarse de que no esté en modo oscuro

    if (body.classList.contains("red")) {
        localStorage.setItem("mode", "red");
    } else {
        localStorage.setItem("mode", "light");
    }
});


sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if(sidebar.classList.contains("close")){
        localStorage.setItem("status", "close");
    }else{
        localStorage.setItem("status", "open");
    }
})

const sizeToggleSwitch = document.querySelector(".size-toggle-switch");

// Manejar el evento click en el interruptor de aumento de tamaño
sizeToggleSwitch.addEventListener("click", () => {
    // Toggle class 'active' para el switch
    sizeToggleSwitch.classList.toggle("active");

    // Obtener el cuerpo del documento
    const body = document.querySelector("body");

    // Verificar si el interruptor está activo
    if (sizeToggleSwitch.classList.contains("active")) {
        // Aumentar el tamaño de la fuente
        body.style.fontSize = "20px"; // Puedes ajustar el tamaño de la fuente según tus necesidades
    } else {
        // Restaurar el tamaño de la fuente a su valor original
        body.style.fontSize = ""; // Esto eliminará cualquier tamaño de fuente establecido previamente
    }
});
