// Función para registrar un nuevo usuario
function registerNewUser(email, password) {
    // Verificar si los campos están vacíos
    if (!email || !password) {
        swal("Por favor, completa todos los campos.", "", "warning");
        return;
    }

    // Verificar la longitud de la contraseña
    if (password.length < 6) {
        swal("La contraseña debe tener al menos 6 caracteres.", "", "warning");
        return;
    }

    // Simulando un registro exitoso
    const user = { email: email }; // Objeto de usuario simulado
    console.log('Usuario registrado con éxito:', user);
    swal({
        title: "Inicio de Sesión Exitoso",
        text: "Has iniciado sesión con éxito.",
        icon: "success",
        button: "Aceptar",
    }).then(() => {
        window.location = 'index.html'; // Redirige al usuario a index.html
    });

}

document.getElementById('termCon').addEventListener('change', function() {
    // Verifica si el checkbox está marcado
    if (this.checked) {
        // Habilita el botón de registro
        document.getElementById('registro').disabled = false;
    } else {
        // Deshabilita el botón de registro
        document.getElementById('registro').disabled = true;
    }
});

// Añade un escuchador al botón de registro
document.getElementById('registro').addEventListener('click', function(event) {
    event.preventDefault(); // Previene la recarga de la página
    const email = document.getElementById('emailInp').value;
    const password = document.getElementById('passwordInp').value;
    registerNewUser(email, password);
});
