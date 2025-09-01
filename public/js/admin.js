import { getSolicitudes, getUsuarios, patchEstado } from "../services/servicios.js";

const contenedor = document.getElementById("listaSolicitudes");

const data = {
    firma: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAACWCAYAAADwkd5lAAAG7klEQVR4AezVi2rbShQF0ND//+gSSiE4sa1IozmvdaG3jS3NObN2YP/58B8BAgQIEDghoEBOoHmFAAECBD4+FIjfAgJRAuYSKC6gQIoHaH0CBAhECSiQKHlzCRAgUFygcIEUl7c+AQIEigsokOIBWp8AAQJRAgokSt5cAoUFrE7gU0CBfCr4Q4AAAQK/FlAgvybzAgECBAh8CiiQT4Xdf8wjQIBAAwEF0iBEVyBAgECEgAKJUDeTAIEoAXMXCiiQhZiOIkCAwCQBBTIpbXclQIDAQgEFshBzwlHuSIAAgf8CCuS/hL8JECBA4FcCCuRXXB4mQIBAlEC+uQokXyY2IkCAQAkBBVIiJksSIEAgn4ACyZeJje4RcCoBAosFFMhiUMcRIEBgioACmZK0exIgQGCxwOECWTzXcQQIECBQXECBFA/Q+gQIEIgSUCBR8uYSOCzgQQI5BRRIzlxsRYAAgfQCCiR9RBYkQIBAToEJBZJT3lYECBAoLqBAigdofQIECEQJKJAoeXMJTBBwx9YCCqR1vC5HgACB+wQUyH22TiZAgEBrAQWSOl7LESBAIK+AAsmbjc0IECCQWkCBpI7HcgQIRAmY+15Agbw38gQBAgQI/CCgQH5A8REBAgQIvBdQIO+NPHFGwDsECLQXUCDtI3ZBAgQI3COgQO5xdSoBAgSiBLbNVSDbqA0iQIBALwEF0itPtyFAgMA2AQWyjdqgKgL2JEDgmIACOebkKQIECBB4EFAgDyB+JECAAIFjAusL5NhcTxEgQIBAcQEFUjxA6xMgQCBKQIFEyZtLYL2AEwlsFVAgW7kNI0CAQB8BBdInSzchQIDAVgEF8oXbPwkQIEDguIACOW7lSQIECBD4IqBAvmD4JwECUQLmVhRQIBVTszMBAgQSCCiQBCFYgQABAhUFFEjF1L7v7BMCBAhsF1Ag28kNJECAQA8BBdIjR7cgQCBKYPBcBTI4fFcnQIDAFQEFckXPuwQIEBgsoEAGh5/j6rYgQKCqgAKpmpy9CRAgECygQIIDMJ4AAQJRAlfnKpCrgt4nQIDAUAEFMjR41yZAgMBVAQVyVdD7cwXcnMBwAQUy/BfA9QkQIHBWQIGclfMeAQIEhgsEFshwedcnQIBAcQEFUjxA6xMgQCBKQIFEyZtLIFDAaAIrBBTICkVnECBAYKCAAhkYuisTIEBghYACOaPoHQIECBD4UCB+CQgQIEDglIACOcXmJQIEggSMTSSgQBKFYRUCBAhUElAgldKyKwECBBIJKJBEYexYxQwCBAisElAgqySdQ4AAgWECCmRY4K5LgECUQL+5CqRfpm5EgACBLQIKZAuzIQQIEOgnoED6Zdr1Ru5FgEAyAQWSLBDrECBAoIqAAqmSlD0JECAQJfBkrgJ5AuNjAgQIEHgtoEBe+/iWAAECBJ4IKJAnMD4msE7ASQR6CiiQnrm6FQECBG4XUCC3ExtAgACBngIVCqSnvFsRIECguIACKR6g9QkQIBAloECi5M0lUEHAjgReCCiQFzi+IkCAAIHnAgrkuY1vCBAgQOCFgAJ5gXP9KycQIECgr4AC6ZutmxEgQOBWAQVyK6/DCRCIEjD3fgEFcr+xCQQIEGgpoEBaxupSBAgQuF9AgdxvXHOCrQkQIPBGQIG8AfI1AQIECPwsoEB+dvEpAQIEogTKzFUgZaKyKAECBHIJKJBcediGAAECZQQUSJmoLHpUwHMECOwRUCB7nE0hQIBAOwEF0i5SFyJAgMAege8FsmeuKQQIECBQXECBFA/Q+gQIEIgSUCBR8uYS+C7gEwKlBBRIqbgsS4AAgTwCCiRPFjYhQIBAKYFWBVJK3rIECBAoLqBAigdofQIECEQJKJAoeXMJtBJwmYkCCmRi6u5MgACBBQIKZAGiIwgQIDBRQIHkSN0WBAgQKCegQMpFZmECBAjkEFAgOXKwBQECUQLmnhZQIKfpvEiAAIHZAgpkdv5uT4AAgdMCCuQ0nRf/Cfg/AQJTBRTI1OTdmwABAhcFFMhFQK8TIEAgSiB6rgKJTsB8AgQIFBVQIEWDszYBAgSiBRRIdALmxwmYTIDAJQEFconPywQIEJgroEDmZu/mBAgQuCRwoUAuzfUyAQIECBQXUCDFA7Q+AQIEogQUSJS8uQQuCHiVQAYBBZIhBTsQIECgoIACKRialQkQIJBBYGaBZJC3AwECBIoLKJDiAVqfAAECUQIKJEreXAIzBdy6kYACaRSmqxAgQGCngALZqW0WAQIEGgkokGJhWpcAAQJZBBRIliTsQYAAgWICCqRYYNYlQCBKwNxHAQXyKOJnAgQIEDgkoEAOMXmIAAECBB4FFMijiJ/vEnAuAQLNBBRIs0BdhwABArsE/gIAAP//d2NO3AAAAAZJREFUAwAdswEtj83JUQAAAABJRU5ErkJggg==",
    // tu base64 completo
  };

// Obtener usuario logueado desde localStorage
const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

    if (!usuarioLogueado) {
        contenedor.textContent = "No hay sesión activa.";
    } else {
        cargarSolicitudesDelUsuario();
    }

async function cargarSolicitudesDelUsuario() {
    try {
        // Traer solicitudes y usuarios
        const solicitudes = await getSolicitudes();
        const usuarios = await getUsuarios();

        // Filtrar solicitudes del usuario logueado
        const solicitudesUsuario = solicitudes; (
            s => Number(s.usuarioId) === Number(usuarioLogueado.id)
        );

        if (solicitudesUsuario.length === 0) {
            contenedor.textContent = "No tienes solicitudes registradas.";
            return;
        }

        // Crear tarjeta para cada solicitud
        solicitudesUsuario.forEach(s => {
            const divSolicitud = document.createElement("div");
            

            // Buscar usuario para mostrar nombre
            const usuario = usuarios.find(u => Number(u.id) === Number(s.usuarioId));
            const nombreUsuario = usuario ? usuario.nombre : "Desconocido";

            // Campos a mostrar
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
                /* const imagen = document.createElement("img");

                imagen.src = s.firma
                imagen.alt = "Firma del Usuario" */
                


                p.textContent = `${c.label}: ${c.value || "Sin dato"}`
                

                divSolicitud.appendChild(p);
                /* divSolicitud.appendChild(imagen); */
              
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
            //agrega los checkbox y el boton
            const divChecks = document.createElement("div");

            const label1 = document.createElement("label");
            const checkbox1 = document.createElement("input");
            const label2 = document.createElement("label");
            const checkbox2 = document.createElement("input");

            checkbox1.type = "radio";
            checkbox1.name = `estado-${s.id}`;
            checkbox1.value = "Aceptada"; 
            checkbox2.type = "radio";
            checkbox2.value = "Denegada";
            checkbox2.name = `estado-${s.id}`;
           
            const boton = document.createElement("button");
            boton.textContent = "Enviar";
            //boton.classList = ()
            label2.appendChild(checkbox2);
            label2.append(" Denegada");
            label1.appendChild(checkbox1);
            label1.append(" Aceptada");
            divChecks.appendChild(label1);
            divChecks.appendChild(label2);
            divChecks.appendChild(boton);
            
           // ✅ Función del botón con PATCH integrado
            boton.addEventListener("click", async () => {
                let seleccion = "Ninguna";
                if (checkbox1.checked) seleccion = checkbox1.value;
                else if (checkbox2.checked) seleccion = checkbox2.value;

                if (seleccion === "Ninguna") {
                    alert(`Selecciona una opción para la solicitud ${s.codigo}.`);
                    return;
                }

                try {
                    const actualizado = await patchEstado(s.id, seleccion);
                    alert(`Solicitud ${s.codigo}: Estado actualizado a ${actualizado.estado}`);

                    // Actualizar texto en pantalla
                    const estadoParrafo = divSolicitud.querySelector("p:last-child");
                    if (estadoParrafo) estadoParrafo.textContent = `Estado: ${actualizado.estado}`;

                    // Bloquear controles
                    checkbox1.disabled = true;
                    checkbox2.disabled = true;
                    boton.disabled = true;

                } catch (error) {
                    console.log("Error al actualizar el estado.");
                }
            });

            divSolicitud.appendChild(divChecks);
            contenedor.appendChild(divSolicitud);
        });

    } catch (error) {
        console.error("Error al cargar solicitudes:", error);
        contenedor.textContent = "Error al cargar solicitudes.";
    }
}


