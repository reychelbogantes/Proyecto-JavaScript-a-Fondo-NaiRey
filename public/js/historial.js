import { getSolicitudes, getUsuarios } from "../services/servicios.js";

const contenedor = document.getElementById("listaSolicitudes");


// Obtener parámetro 'tipo' de la URL (true → aceptadas, false → denegadas)
const params = new URLSearchParams(window.location.search);
const tipo = params.get("tipo"); // null si no existe

const mostrarAceptadas = tipo === null || tipo === "true"; // true → aceptadas, false → denegadas

// Obtentiene usuario logueado desde localStorage
const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

// Obtentiene el tipo de solicitudes a mostrar true = aceptadas, false = denegadas
const filtrado = localStorage.getItem("filtrar"); // por defecto true

if (!usuarioLogueado) {
    contenedor.textContent = "No hay sesión activa.";
} else {
    cargarSolicitudesDelUsuario();
}

async function cargarSolicitudesDelUsuario() {
    try {
        const solicitudes = await getSolicitudes();
        const usuarios = await getUsuarios();

        // Filtrar por usuario y estado según 'tipo'
        const solicitudesUsuario = solicitudes.filter(s =>
            Number(s.usuarioId) === Number(usuarioLogueado.id) &&
            (mostrarAceptadas ? s.estado === "Aceptada" : s.estado === "Denegada")
        );

        if (filtrado === "true") {
            imprimirDatos("Aceptada");
        } else if (filtrado === "false") {
            imprimirDatos("Denegada");
        } else {
            imprimirDatosTodos();
        }
    } catch (error) {
        console.error("Error al cargar solicitudes del usuario:", error);
        contenedor.textContent = "Error al cargar las solicitudes.";
    }
} // Aquí se cierra la función cargarSolicitudesDelUsuario

async function imprimirDatos(filtracion) {
    try {
        console.log(filtracion);
        
        const solicitudes = await getSolicitudes();
        const usuarios = await getUsuarios();

        // Filtrar solicitudes del usuario según el estado
        const solicitudesUsuario = solicitudes.filter(s =>
            Number(s.usuarioId) === Number(usuarioLogueado.id) &&
            s.estado === filtracion
        );

        console.log(solicitudesUsuario);
        
        if (solicitudesUsuario.length === 0) {
            contenedor.textContent = mostrarAceptadas
                ? "No tienes solicitudes aceptadas."
                : "No tienes solicitudes denegadas.";
            return;
        }

        solicitudesUsuario.forEach(s => {
            const divSolicitud = document.createElement("div");

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

    } catch (error) {
        console.error("Error al cargar solicitudes:", error);
        contenedor.textContent = "Error al cargar solicitudes.";
    }
} // Aquí se cierra la función imprimirDatos

async function imprimirDatosTodos() {
    try {
        const solicitudes = await getSolicitudes();
        const usuarios = await getUsuarios();

        // Filtrar solicitudes del usuario según el estado
        const solicitudesUsuario = solicitudes.filter(s =>
            Number(s.usuarioId) === Number(usuarioLogueado.id)
        );

        console.log(solicitudesUsuario);
        

        if (solicitudesUsuario.length === 0) {
            contenedor.textContent = mostrarAceptadas
                ? "No tienes solicitudes aceptadas."
                : "No tienes solicitudes denegadas.";
            return;
        }

        solicitudesUsuario.forEach(s => {
            const divSolicitud = document.createElement("div");

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

    } catch (error) {
        console.error("Error al cargar solicitudes:", error);
        contenedor.textContent = "Error al cargar solicitudes.";
    } 

}
