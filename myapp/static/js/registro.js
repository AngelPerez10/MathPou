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
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Verificar la longitud de la contraseña
    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Usuario registrado
            const user = userCredential.user;
            console.log('Usuario registrado con éxito:', user);
            alert('Usuario agregado con éxito.');
            // Redirigir al usuario a la página home.html
            window.location.href = 'index.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error en el registro:', errorCode, errorMessage);
            // Manejar errores específicos
            if (errorCode === 'auth/email-already-in-use') {
                alert('El correo electrónico ya fue registrado.');
            } else {
                // Mostrar un mensaje de error genérico
                alert('Error al registrar el usuario: ' + errorMessage);
            }
        });
}

// Añade un escuchador al botón de registro
document.getElementById('registro').addEventListener('click', function(event) {
    event.preventDefault(); // Previene la recarga de la página
    const email = document.getElementById('emailInp').value;
    const password = document.getElementById('passwordInp').value;
    registerNewUser(email, password);
});