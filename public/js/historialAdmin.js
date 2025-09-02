import { getSolicitudes, getUsuarios } from "../services/servicios.js";

const contenedor = document.getElementById("listaSolicitudes");

// Obtener parámetro 'tipo' de la URL (true → aceptadas, false → denegadas)
const params = new URLSearchParams(window.location.search);
const tipo = params.get("tipo"); // null si no existe

// Obtener el tipo de solicitudes a mostrar (true = aceptadas, false = denegadas, null = todas)
const filtrado = localStorage.getItem("filtrar"); 

cargarSolicitudes();

async function cargarSolicitudes() {
    try {
        const solicitudes = await getSolicitudes();
        const usuarios = await getUsuarios();

        let solicitudesFiltradas = [...solicitudes];

        // Filtrar según el parámetro filtrado
        if (filtrado === "true") {
            solicitudesFiltradas = solicitudesFiltradas.filter(s => s.estado === "Aceptada");
        } else if (filtrado === "false") {
            solicitudesFiltradas = solicitudesFiltradas.filter(s => s.estado === "Denegada");
        }

        renderizarSolicitudes(solicitudesFiltradas, usuarios);

    } catch (error) {
        console.error("Error al cargar solicitudes:", error);
        contenedor.textContent = "Error al cargar las solicitudes.";
    }
}

function renderizarSolicitudes(solicitudes, usuarios) {
    contenedor.innerHTML = ""; // Limpiar contenedor

    if (solicitudes.length === 0) {
        contenedor.textContent = "No hay solicitudes para mostrar.";
        return;
    }

    solicitudes.forEach(s => {
        const divSolicitud = document.createElement("div");
        divSolicitud.classList.add("solicitud-card"); // Para estilos CSS

        // Buscar usuario para mostrar nombre
        const usuario = usuarios.find(u => Number(u.id) === Number(s.usuarioId));
        const nombreUsuario = usuario ? usuario.nombre : "Desconocido";

        const campos = [
            { label: "Usuario", value: nombreUsuario },
            { label: "Sede", value: s.sede },
            { label: "Fecha Salida", value: s.fechaSalida },
            { label: "Fecha Entrada", value: s.fechaEntrada },
            { label: "Código", value: s.codigo },
            { label: "Motivo", value: s.motivo },
            { label: "Descripción", value: s.descripcion },
            { label: "Estado", value: s.estado }
        ];

        campos.forEach(c => {
            const p = document.createElement("p");
            p.textContent = `${c.label}: ${c.value || "Sin dato"}`;
            divSolicitud.appendChild(p);
        });

        // Agregar la firma si existe
        if (s.firma) {
            const img = document.createElement("img");
            img.src = s.firma;
            img.alt = "Firma";
            img.width = 200;
            img.style.marginTop = "10px";
            divSolicitud.appendChild(img);
        }

        contenedor.appendChild(divSolicitud);
    });
}







