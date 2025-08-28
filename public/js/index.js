import { postSolicitudes, getUsuarios } from "../services/servicios.js";

const sede = document.getElementById("sede")
const fechaSalida = document.getElementById("fechaSalida")
const fechaEntrada = document.getElementById("fechaEntrada")
const codigo = document.getElementById("codigo")
const motivo = document.getElementById("motivo")
const descripcion = document.getElementById("descripcion")
const guardarInfo = document.getElementById("guardarinfo")
const button = document.getElementById("button")
const condiciones = document.getElementById("condiciones")
const mensaje = document.getElementById("mensaje")
const botonFirma = document.getElementById("botonFirma")
const canvas = document.getElementById("firma");

const espacio = canvas.getContext("2d")//crea un espacio para dibujar
let dibujando = false;

const firmaBase64 = canvas.toDataURL(); //para que se vea en el deb.json
//funcion para que se vea el id en el db.json
async function inicializar() {
    const usuarioLogueadoStorage = JSON.parse(localStorage.getItem("usuarioLogueado"));

    if (!usuarioLogueadoStorage) {
        mensaje.textContent = "No se ha encontrado usuario logueado.";
        return;
    }

    const usuarios = await getUsuarios();
    const usuarioFiltrado = usuarios.filter(u => u.correo === usuarioLogueadoStorage.correo)[0];

    if (!usuarioFiltrado) {
        mensaje.textContent = "Usuario no encontrado en el sistema.";
        return;
    }

    const usuarioId = usuarioFiltrado.id;

    // Guardar el usuarioId en una variable global o en window para usarlo después
    window.usuarioIdActual = usuarioId;
}

// Ejecutar la función al cargar
inicializar();



function validarMaximo10Dias(fechaSalida, fechaEntrada) {
    const salida = new Date(fechaSalida);
    const entrada = new Date(fechaEntrada);

    if (isNaN(salida) || isNaN(entrada)) return false; // Si no son válidas

    const diferenciaMs = entrada - salida;
    const diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24);

    return diferenciaDias <= 10; // true si son 10 días o menos
}




button.addEventListener("click",async function() {
    if (!condiciones.checked) {
        mensaje.textContent = "Debes aceptar las condiciones antes de enviar."
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
    //No se envie ningun campo vacio
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

    // Validar que la firma no esté vacía
    if (esFirmaVacia(canvas)) {
        mensaje.textContent = "Debes firmar antes de enviar.";
        return;
    }
    const solicitudes={
        usuarioId: window.usuarioIdActual,
        sede:sede.value,
        fechaSalida:fechaActual(),
        fechaEntrada:fechaEntrada.value,
        codigo:codigo.value,
        motivo:motivo.value,
        descripcion:descripcion.value,
        firma:firmaBase64,//base64 hace que se vea en el db.json
        estado : "Pendiente"
    }

    const datosAlmacenados = await postSolicitudes(solicitudes)
    console.log(datosAlmacenados);
    location.reload()
})
function esFirmaVacia(canvas) {
    const espacio = canvas.getContext("2d");
    const imgData = espacio.getImageData(0, 0, canvas.width, canvas.height);
    // Recorremos los pixeles para ver si todos están vacíos (alpha = 0)
    for (let i = 3; i < imgData.data.length; i += 4) {
        if (imgData.data[i] !== 0) {
            return false; // hay algo dibujado
        }
    }
    return true; // canvas vacío
}


// Función para obtener la fecha y hora actual en formato 
function fechaParaInput() {
    const ahora = new Date();
    const yyyy = ahora.getFullYear();
    const mm = String(ahora.getMonth() + 1).padStart(2, "0");
    const dd = String(ahora.getDate()).padStart(2, "0");
    const hh = String(ahora.getHours()).padStart(2, "0");
    const min = String(ahora.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`; 
}

//  Función para guardar en db.json con segundos

function fechaActual() {
    const ahora = new Date();
    const yyyy = ahora.getFullYear();
    const mm = String(ahora.getMonth() + 1).padStart(2, "0"); // Mes empieza en 0
    const dd = String(ahora.getDate()).padStart(2, "0");
    const hh = String(ahora.getHours()).padStart(2, "0");
    const min = String(ahora.getMinutes()).padStart(2, "0");
    const ss = String(ahora.getSeconds()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
}
fechaSalida.value = fechaParaInput();

// Comenzar a dibujar
canvas.addEventListener("mousedown", (e) => {
  dibujando = true;
  espacio.beginPath()
  espacio.moveTo(e.offsetX, e.offsetY)
});

// Dibujar mientras se mueve el mouse
canvas.addEventListener("mousemove", (e) => {
  if (dibujando) {
    espacio.lineTo(e.offsetX, e.offsetY)
    espacio.stroke()
  }
})

// Terminar de dibujar
canvas.addEventListener("mouseup", () => {
  dibujando = false;
})

//Botón para eliminar firma por si quiere volverla a hacer 
 botonFirma.addEventListener("click", () => {
  espacio.clearRect(0, 0, canvas.width, canvas.height)
})

    





