import { postUsuario, getUsuarios,findUser, updatePassword  } from "../services/servicios.js";

const container = document.querySelector(".container");
const btnIncioS = document.getElementById("btnIncioS");
const btnRegistro = document.getElementById("btnRegistro");

// contenedores separados
const mensajeLogin = document.getElementById("mensajeLogin");
const mensajeRegistro = document.getElementById("mensajeRegistro");


// Alternar entre formularios
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
const contraseñaI = document.getElementById("contrasenaI");
const btnI = document.getElementById("btnI");

btnI.addEventListener("click", async function () {
    try {
      const usuarios = await getUsuarios();
  
      if (nombreI.value === "" || contraseñaI.value === "") {
        mostrarMensaje(mensajeLogin, "⚠️ Por favor, complete todos los campos.", "error");
        return;
      }

      // Buscar al usuario solo por nombre y contraseña
      const usuarioEncontrado = usuarios.find(user =>
        user.nombre === nombreI.value && user.contraseña === contraseñaI.value
      );

      if (usuarioEncontrado) {
        // Guardar el usuario logueado en localStorage
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioEncontrado));
        mostrarMensaje(mensajeLogin, "✅ Bienvenido " + usuarioEncontrado.nombre, "success");
        sessionStorage.setItem("loggedInUser", JSON.stringify(usuarioEncontrado));

        // Redirigir según el rol del usuario encontrado en los datos
        setTimeout(() => {
          if (usuarioEncontrado.rol === "Estudiante") {
            window.location.href = "../pages/Index.html";
          } else if (usuarioEncontrado.rol === "Administrador") {
            window.location.href = "../pages/admin.html";
          }
        }, 1000);

      } else {
        mostrarMensaje(mensajeLogin, "❌ Nombre de usuario o contraseña incorrectos.", "error");
      }

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      mostrarMensaje(mensajeLogin, "❌ Error al intentar iniciar sesión.", "error");
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const forgotPasswordLink = document.getElementById('forgot-password');
    const findUserModal = document.getElementById('forgot-password-modal');
    const changePasswordModal = document.getElementById('change-password-modal');
    const closeFindUserBtn = document.querySelector('#forgot-password-modal .close-btn');
    const closeChangePasswordBtn = document.querySelector('#change-password-modal .close-btn');
    const submitFindUserBtn = document.getElementById('submit-recovery');
    const usernameEmailInput = document.getElementById('username-email');
    const messageElement = document.getElementById('message');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const submitChangePasswordBtn = document.getElementById('submit-change-password');
    const changePasswordMessageElement = document.getElementById('change-password-message');

    let userToUpdate = null; // Variable para almacenar el usuario encontrado

    // Evento para abrir el modal de búsqueda de usuario
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        findUserModal.style.display = 'flex';
        messageElement.textContent = '';
        usernameEmailInput.value = '';
    });

    // Evento para cerrar el modal de búsqueda de usuario
    closeFindUserBtn.addEventListener('click', () => {
        findUserModal.style.display = 'none';
    });

    // Evento para cerrar el modal de cambio de contraseña
    closeChangePasswordBtn.addEventListener('click', () => {
        changePasswordModal.style.display = 'none';
    });

    // Evento para buscar al usuario
    submitFindUserBtn.addEventListener('click', async () => {
        const input = usernameEmailInput.value;
        
        if (!input) {
            messageElement.textContent = 'Por favor, ingresa un valor.';
            return;
        }

        try {
            const user = await findUser(input);
            if (user) {
                userToUpdate = user; // Guarda el usuario encontrado
                messageElement.textContent = 'Usuario encontrado. Por favor, ingresa tu nueva contraseña.';
                // Esconde el modal de búsqueda y muestra el de cambio de contraseña
                findUserModal.style.display = 'none';
                changePasswordModal.style.display = 'flex';
                newPasswordInput.value = '';
                confirmPasswordInput.value = '';
                changePasswordMessageElement.textContent = '';
            } else {
                messageElement.textContent = 'No se encontró un usuario con ese nombre o correo electrónico.';
            }
        } catch (error) {
            messageElement.textContent = error.message;
        }
    });

    // Evento para cambiar la contraseña
    submitChangePasswordBtn.addEventListener('click', async () => {
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!newPassword || !confirmPassword) {
            changePasswordMessageElement.textContent = 'Por favor, completa ambos campos.';
            return;
        }

        if (newPassword !== confirmPassword) {
            changePasswordMessageElement.textContent = 'Las contraseñas no coinciden.';
            return;
        }

        try {
            // Llama al servicio para actualizar la contraseña
            await updatePassword(userToUpdate.id, { password: newPassword });
            changePasswordMessageElement.textContent = 'Contraseña actualizada con éxito.';
            setTimeout(() => {
                changePasswordModal.style.display = 'none';
            }, 2000); // Cierra el modal después de 2 segundos
        } catch (error) {
            changePasswordMessageElement.textContent = error.message;
        }
    });// Evento para cambiar la contraseña
submitChangePasswordBtn.addEventListener('click', async () => {
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    try {
        // Llama al servicio para actualizar la contraseña, pasando solo la nueva contraseña
        await updatePassword(userToUpdate.id, newPassword); 
        changePasswordMessageElement.textContent = 'Contraseña actualizada con éxito.';
        setTimeout(() => {
            changePasswordModal.style.display = 'none';
        }, 2000);
    } catch (error) {
        changePasswordMessageElement.textContent = error.message;
    }
});
});
