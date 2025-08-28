import { postUsuario, getUsuarios } from "../services/servicios.js";

const container = document.querySelector(".container");
const btnIncioS = document.getElementById("btnIncioS");
const btnRegistro = document.getElementById("btnRegistro");

// contenedores separados
const mensajeLogin = document.getElementById("mensajeLogin");
const mensajeRegistro = document.getElementById("mensajeRegistro");

btnRegistro.addEventListener("click", () => {
  container.classList.remove("toggle");
  mensajeLogin.textContent = "";
  mensajeLogin.className = "";
});

btnIncioS.addEventListener("click", () => {
   container.classList.add("toggle");
   mensajeRegistro.textContent = "";
   mensajeRegistro.className = "";
});

// -------- Función para mostrar mensajes --------
function mostrarMensaje(contenedor, texto, tipo = "error") {
    contenedor.textContent = texto;
    contenedor.className = ""; // limpiar clases
    contenedor.classList.add("show", tipo);

    setTimeout(() => {
     contenedor.classList.remove("show", "error", "success");
    }, 4000);
}

// -------- Registro --------
const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const rol = document.getElementById("rol");
const contraseña = document.getElementById("contraseña");
const btnRegistrar = document.getElementById("btnRegistrar");

// PIN hardcodeado para administradores
const ADMIN_PIN = "12345"; // Puedes cambiar este valor
const pinAdminInput = document.getElementById("pin-admin");
const pinContainer = document.getElementById("pin-container");

// Oculta/muestra el campo de PIN basado en la selección del rol
rol.addEventListener('change', () => {
    if (rol.value === 'Administrador') {
        pinContainer.classList.add('show');
    } else {
        pinContainer.classList.remove('show');
        pinAdminInput.value = ''; // Limpia el valor si se cambia de rol
    }
});

btnRegistrar.addEventListener("click", async function () {
     try {
       const usuarios = await getUsuarios();

      const nombreExiste = usuarios.some(user => user.nombre === nombre.value);
      const correoExiste = usuarios.some(user => user.correo === correo.value);

      if (nombre.value === "" || correo.value === "" || rol.value === "" || contraseña.value === "") {
     mostrarMensaje(mensajeRegistro, "⚠️ Por favor, complete todos los campos.", "error");
     return;
     }

// Validación del PIN para administradores
        if (rol.value === 'Administrador') {
            if (pinAdminInput.value === "") {
                mostrarMensaje(mensajeRegistro, "⚠️ Ingrese el PIN de administrador.", "error");
                return;
            }
            if (pinAdminInput.value !== ADMIN_PIN) {
                mostrarMensaje(mensajeRegistro, "❌ PIN de administrador incorrecto.", "error");
                return;
            }
        }

     if (nombreExiste) {
     mostrarMensaje(mensajeRegistro, "⚠️ Este nombre de usuario ya está en uso.", "error");
     return;
     }
        
     if (correoExiste) {
     mostrarMensaje(mensajeRegistro, "⚠️ Este correo ya está registrado.", "error");
     return;
     }

     const nuevoUsuario = {
      id: Date.now(),
      nombre: nombre.value,
      correo: correo.value,
      rol: rol.value,
      contraseña: contraseña.value
      };

     await postUsuario(nuevoUsuario);

    mostrarMensaje(mensajeRegistro, "✅ Registro exitoso, ahora puede iniciar sesión.", "success");

     nombre.value = "";
     correo.value = "";
     rol.value = "";
     contraseña.value = "";
     pinAdminInput.value = "";
     pinContainer.classList.remove('show'); // Oculta el campo de PIN después del registro

    } catch (error) {
      console.error("Error al registrar usuario:", error);
      mostrarMensaje(mensajeRegistro, "❌ Error al registrar usuario.", "error");
    }
});

// -------- Inicio de Sesión --------
const nombreI = document.getElementById("nombreI");
const rolI = document.getElementById("rolI");
const contraseñaI = document.getElementById("contrasenaI");
const btnI = document.getElementById("btnI");

btnI.addEventListener("click", async function () {
    try {
     const usuarios = await getUsuarios();
  
     if (nombreI.value === "" || rolI.value === "" || contraseñaI.value === "") {
      mostrarMensaje(mensajeLogin, "⚠️ Por favor, complete todos los campos.", "error");
      return;
     }

    const usuarioEncontrado = usuarios.find(user =>
    user.nombre === nombreI.value && user.contraseña === contraseñaI.value && user.rol === rolI.value
    );

    if (usuarioEncontrado) {
    mostrarMensaje(mensajeLogin, "✅ Bienvenido " + usuarioEncontrado.nombre, "success");
    sessionStorage.setItem("loggedInUser", JSON.stringify(usuarioEncontrado));

      // Redirigir según el rol del usuario
    setTimeout(() => {
    if (usuarioEncontrado.rol === "Estudiante") {
     window.location.href = "../pages/Index.html";
    } else if (usuarioEncontrado.rol === "Administrador") {
     window.location.href = "../pages/admin.html";
    }
    }, 1000);

    } else {
       mostrarMensaje(mensajeLogin, "❌ Nombre de usuario, rol o contraseña incorrectos.", "error");
    }

    } catch (error) {
     console.error("Error al iniciar sesión:", error);
     mostrarMensaje(mensajeLogin, "❌ Error al intentar iniciar sesión.", "error");
    }
});