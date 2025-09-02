import { postSolicitudes, getUsuarios } from "../services/servicios.js";

const sede = document.getElementById("sede");
const fechaSalida = document.getElementById("fechaSalida");
const fechaEntrada = document.getElementById("fechaEntrada");
const codigo = document.getElementById("codigo");
const motivo = document.getElementById("motivo");
const descripcion = document.getElementById("descripcion");
const guardarInfo = document.getElementById("guardarinfo");
const button = document.getElementById("button");
const condiciones = document.getElementById("condiciones");
const mensaje = document.getElementById("mensaje");
const mensajeFecha = document.getElementById("mensajeFecha");
const mensajeCondiciones = document.getElementById("mensajeCondiciones");
const botonFirma = document.getElementById("botonFirma");
const canvas = document.getElementById("firma");
const aprobadas = document.getElementById("aprobadas")
const denegadas = document.getElementById("denegadas")
const todas = document.getElementById("todas")

const espacio = canvas.getContext("2d");
let dibujando = false;

// Funcion para que se ejecute la firma
function esFirmaVacia(canvas) {
    const imgData = espacio.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 3; i < imgData.data.length; i += 4) {
        if (imgData.data[i] !== 0) return false;
    }
    return true;
}
//muestra los mensajes
function mostrarMensaje(contenedor, texto, tipo = "error") {
    contenedor.textContent = texto;
    contenedor.className = ""; // limpiar clases
    contenedor.classList.add("show", tipo);

    setTimeout(() => {
     contenedor.classList.remove("show", "error", "success");
    }, 10000);
}
//
function fechaParaInput() {
    const ahora = new Date();
    const yyyy = ahora.getFullYear();
    const mm = String(ahora.getMonth() + 1).padStart(2, "0");
    const dd = String(ahora.getDate()).padStart(2, "0");
    const hh = String(ahora.getHours()).padStart(2, "0");
    const min = String(ahora.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}
//se vea la fecha de ahora
function fechaActual() {
    const ahora = new Date();
    const yyyy = ahora.getFullYear();
    const mm = String(ahora.getMonth() + 1).padStart(2, "0");
    const dd = String(ahora.getDate()).padStart(2, "0");
    const hh = String(ahora.getHours()).padStart(2, "0");
    const min = String(ahora.getMinutes()).padStart(2, "0");
    const ss = String(ahora.getSeconds()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}
//funcion para que no se pueda llevar la computadora mas de diez dias
function validarMaximo10Dias(fechaSalida, fechaEntrada) {
    const salida = new Date(fechaSalida);
    const entrada = new Date(fechaEntrada);
    if (isNaN(salida) || isNaN(entrada)) return false;
    const diferenciaMs = entrada - salida;
    const diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24);
    return diferenciaDias <= 10;
}

// Inicializa el usuario
async function inicializar() {
    const usuarioLogueadoStorage = JSON.parse(localStorage.getItem("usuarioLogueado"));
    if (!usuarioLogueadoStorage) {
        mostrarMensaje(mensaje,"No se ha encontrado usuario logueado.", "error");
        return;
    }
    const usuarios = await getUsuarios();
    const usuarioFiltrado = usuarios.find(u => u.correo === usuarioLogueadoStorage.correo);
    if (!usuarioFiltrado) {
        mostrarMensaje(mensaje, "Usuario no encontrado en el sistema.", "error");
        return;
    }
    window.usuarioIdActual = usuarioFiltrado.id;
}
inicializar();

// Asigna fecha actual
fechaSalida.value = fechaParaInput();

fechaSalida.readOnly = true;

// Valida fecha de entrada y salida
fechaEntrada.addEventListener("change", () => {
    const salida = new Date(fechaSalida.value);
    const entrada = new Date(fechaEntrada.value);

    if (entrada < salida) {
        mostrarMensaje(mensaje,"La fecha de entrada no puede ser menor a la fecha de salida.", "error");

        fechaEntrada.value = "";
    }
});


// evento de las firmas
canvas.addEventListener("mousedown", (e) => {
    dibujando = true;
    espacio.beginPath();
    espacio.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousemove", (e) => {
    if (dibujando) {
        espacio.lineTo(e.offsetX, e.offsetY);
        espacio.stroke();
        espacio.beginPath();
        espacio.moveTo(e.offsetX, e.offsetY);
    }
});

canvas.addEventListener("mouseup", () => dibujando = false);
canvas.addEventListener("mouseout", () => dibujando = false);

// Boton para borrae la firma
botonFirma.addEventListener("click", () => {
    espacio.clearRect(0, 0, canvas.width, canvas.height);
});

// Evento boton enviar y validaciones para que llene todos los campos
button.addEventListener("click", async () => {
    
    if (!condiciones.checked) {
        mostrarMensaje(mensajeCondiciones,"Debes aceptar las condiciones antes de enviar.", "error");
        return;
    }
    if (!validarMaximo10Dias(fechaSalida.value, fechaEntrada.value)) {
        mostrarMensaje(mensajeFecha, "No puedes llevar la computadora por más de 10 días.", "error");
        return;
    }
    if (esFirmaVacia(canvas)) {
        mostrarMensaje(mensaje, "Debes firmar antes de enviar.", "error");
        return;
    }
    if (
        sede.value.trim() === "" ||
        fechaSalida.value.trim() === "" ||
        fechaEntrada.value.trim() === "" ||
        codigo.value.trim() === "" ||
        motivo.value.trim() === "" ||
        descripcion.value.trim() === ""
    ) {
        mostrarMensaje(mensaje,"Todos los campos son obligatorios.", "error");
        return;
    }

    // Capturar la firma en el momento de enviar
    const firmaBase64 = canvas.toDataURL("image/png");

    const solicitud = {
        usuarioId: window.usuarioIdActual,
        sede: sede.value,
        fechaSalida: fechaActual(),
        fechaEntrada: fechaEntrada.value,
        codigo: codigo.value,
        motivo: motivo.value,
        descripcion: descripcion.value,
        firma: firmaBase64,
        estado: "Pendiente"
    };

    const datosAlmacenados = await postSolicitudes(solicitud);
    console.log(datosAlmacenados);
    location.reload();
});
//Al hacer click redirije a otra pagina donde estan solo las aceptadas
aprobadas.addEventListener("click", () =>{
    localStorage.setItem("filtrar", true)
    window.location.href = "../pages/historial.html"
})
//Al hacer click redirije a otra pagina donde estan solo las denegadas
denegadas.addEventListener("click", () =>{
    localStorage.setItem("filtrar", false)
    window.location.href = "../pages/historial.html"
})
//Al hacer click redirije a otra pagina donde estan todas, las tres se redirijen a la misma pagina
todas.addEventListener("click", () =>{
    localStorage.setItem("filtrar", "todas")
    window.location.href = "../pages/historial.html"
})

