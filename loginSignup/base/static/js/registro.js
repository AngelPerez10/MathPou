import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithPopup,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js"; // Aquí cambiamos firebase-app.js a firebase-auth.js para las importaciones de auth.

const firebaseConfig = {
    apiKey: "AIzaSyC4Gje4nsjZt_Kt49aRc7Hbs9pSO78_4bo",
    authDomain: "mathpou-bd-d5e06.firebaseapp.com",
    projectId: "mathpou-bd-d5e06",
    storageBucket: "mathpou-bd-d5e06.appspot.com",
    messagingSenderId: "724724958779",
    appId: "1:724724958779:web:1047b6ef2e7fc698723e1e",
    measurementId: "G-XX775D1CTJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Usuario registrado
            const user = userCredential.user;
            console.log('Usuario registrado con éxito:', user);
            swal({
                title: "Inicio de Sesión Exitoso",
                text: "Has iniciado sesión con éxito.",
                icon: "success",
                button: "Aceptar",
            }).then(() => {
                window.location = 'index.html'; // Redirige al usuario a index.html
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error en el registro:', errorCode, errorMessage);
            // Manejar errores específicos
            if (errorCode === 'auth/email-already-in-use') {
                swal("El correo electrónico ya fue registrado.", "", "error");
            } else {
                // Mostrar un mensaje de error genérico
                swal("Error al registrar el usuario: " + errorMessage, "", "error");
            }
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