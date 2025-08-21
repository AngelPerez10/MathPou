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
    body.classList.remove("red");

    if (body.classList.contains("dark")) {
        localStorage.setItem("mode", "dark");
    } else {
        localStorage.setItem("mode", "light");
    }
});

modeToggle2.addEventListener("click", () => {
    body.classList.toggle("red");
    body.classList.remove("dark");

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
});

const sizeToggleSwitch = document.querySelector(".size-toggle-switch");

sizeToggleSwitch.addEventListener("click", () => {
    sizeToggleSwitch.classList.toggle("active");
    document.body.style.fontSize = sizeToggleSwitch.classList.contains("active") ? "20px" : "";
});