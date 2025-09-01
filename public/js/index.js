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
const botonFirma = document.getElementById("botonFirma");
const canvas = document.getElementById("firma");
const aprobadas = document.getElementById("aprobadas")
const denegadas = document.getElementById("denegadas")
const todas = document.getElementById("todas")

const espacio = canvas.getContext("2d");
let dibujando = false;

// FUNCIONES AUXILIARES
function esFirmaVacia(canvas) {
    const imgData = espacio.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 3; i < imgData.data.length; i += 4) {
        if (imgData.data[i] !== 0) return false;
    }
    return true;
}

function fechaParaInput() {
    const ahora = new Date();
    const yyyy = ahora.getFullYear();
    const mm = String(ahora.getMonth() + 1).padStart(2, "0");
    const dd = String(ahora.getDate()).padStart(2, "0");
    const hh = String(ahora.getHours()).padStart(2, "0");
    const min = String(ahora.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

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

function validarMaximo10Dias(fechaSalida, fechaEntrada) {
    const salida = new Date(fechaSalida);
    const entrada = new Date(fechaEntrada);
    if (isNaN(salida) || isNaN(entrada)) return false;
    const diferenciaMs = entrada - salida;
    const diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24);
    return diferenciaDias <= 10;
}

// INICIALIZAR USUARIO
async function inicializar() {
    const usuarioLogueadoStorage = JSON.parse(localStorage.getItem("usuarioLogueado"));
    if (!usuarioLogueadoStorage) {
        mensaje.textContent = "No se ha encontrado usuario logueado.";
        return;
    }
    const usuarios = await getUsuarios();
    const usuarioFiltrado = usuarios.find(u => u.correo === usuarioLogueadoStorage.correo);
    if (!usuarioFiltrado) {
        mensaje.textContent = "Usuario no encontrado en el sistema.";
        return;
    }
    window.usuarioIdActual = usuarioFiltrado.id;
}
inicializar();

// ASIGNAR FECHA ACTUAL
fechaSalida.value = fechaParaInput();

fechaSalida.readOnly = true;

// VALIDAR FECHA DE ENTRADA >= FECHA DE SALIDA
fechaEntrada.addEventListener("change", () => {
    const salida = new Date(fechaSalida.value);
    const entrada = new Date(fechaEntrada.value);

    if (entrada < salida) {
        mensaje.textContent ="La fecha de entrada no puede ser menor a la fecha de salida."
        fechaEntrada.value = "";
    }
});


// EVENTOS DEL CANVAS
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

// BOTÓN BORRAR FIRMA
botonFirma.addEventListener("click", () => {
    espacio.clearRect(0, 0, canvas.width, canvas.height);
});

// EVENTO BOTÓN ENVIAR
button.addEventListener("click", async () => {
    mensaje.textContent = "";

    if (!condiciones.checked) {
        mensaje.textContent = "Debes aceptar las condiciones antes de enviar.";
        return;
    }
    if (!validarMaximo10Dias(fechaSalida.value, fechaEntrada.value)) {
        mensaje.textContent = "No puedes llevar la computadora por más de 10 días.";
        return;
    }
    if (esFirmaVacia(canvas)) {
        mensaje.textContent = "Debes firmar antes de enviar.";
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
        mensaje.textContent = "Todos los campos son obligatorios.";
        return;
    }

    // Capturar la firma **en el momento de enviar**
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

aprobadas.addEventListener("click", () =>{
    localStorage.setItem("filtrar", true)
    window.location.href = "../pages/historial.html"
})

denegadas.addEventListener("click", () =>{
    localStorage.setItem("filtrar", false)
    window.location.href = "../pages/historial.html"
})

todas.addEventListener("click", () =>{
    localStorage.setItem("filtrar", "todas")
    window.location.href = "../pages/historial.html"
})

