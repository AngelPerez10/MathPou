// Función para iniciar sesión
function loginUser(email, password) {
    if (!email || !password) {
        swal("Por favor, completa todos los campos.", "", "warning");
        return;
    }

    // Simulando un inicio de sesión exitoso
    const user = { email: email }; // Objeto de usuario simulado
    console.log('Usuario ha iniciado sesión con éxito:', user);
    swal({
        title: "Inicio de Sesión Exitoso",
        text: "Has iniciado sesión con éxito.",
        icon: "success",
        button: "Aceptar",
    }).then(() => {
        window.location = 'index.html'; // Redirige al usuario a index.html
    });
}

// Añade un escuchador al botón de inicio de sesión
document.getElementById('loginbt').addEventListener('click', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional
    const email = document.getElementById('emailLogin').value;
    const password = document.getElementById('passwordLogin').value;
    loginUser(email, password);
});
