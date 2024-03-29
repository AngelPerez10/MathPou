import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

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


// Función para iniciar sesión
function loginUser(email, password) {
    // Verificar si los campos están vacíos
    if (!email || !password) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Usuario ha iniciado sesión
            const user = userCredential.user;
            console.log('Usuario ha iniciado sesión con éxito:', user);
            window.location = 'index.html'; // Redirige al usuario a home.html
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // Manejar errores específicos
            if (errorCode === 'auth/wrong-password') {
                alert('La contraseña es incorrecta.');
            } else if (errorCode === 'auth/user-not-found') {
                alert('No existe un usuario con este correo electrónico.');
            } else if (errorCode === 'auth/invalid-email') {
                alert('Correo electrónico es incorrecto.');
            } else {
                console.error('Error al iniciar sesión:', errorCode, errorMessage);
                alert('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
            }
        });
}

// Añade un escuchador al botón de inicio de sesión
document.getElementById('loginbt').addEventListener('click', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional
    const email = document.getElementById('emailLogin').value;
    const password = document.getElementById('passwordLogin').value;
    loginUser(email, password);
});
