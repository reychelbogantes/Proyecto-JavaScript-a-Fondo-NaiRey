import { postSolicitudes } from "../services/servicios.js";

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

button.addEventListener("click",async function() {
    if (!condiciones.checked) {
    mensaje.textContent = "Debes aceptar las condiciones antes de enviar.";   
    return;
        
    }
 const solicitudes={
        sede:sede.value,
        fechaSalida:fechaSalida.value,
        fechaEntrada:fechaEntrada.value,
        codigo:codigo.value,
        motivo:motivo.value,
        descripcion:descripcion.value,
        estado: "Pendiente"
    }
    console.log("solicitud");
    
    const datosAlmacenados = await postSolicitudes(solicitudes)
    console.log(datosAlmacenados);
    location.reload()
})


