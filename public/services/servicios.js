// --- POST: Registrar usuario ---
async function postUsuario(usuario) {
   try {
      const response = await fetch("http://localhost:3001/usuarios", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify(usuario)
      });

      const nuevoUsuario = await response.json();
      return nuevoUsuario;

   } catch (error) {
      console.error("Hay un error al registrar el usuario", error);
      throw error;
   }
}

// --- GET: Obtener todos los usuarios ---
async function getUsuarios() {
   try {
      const response = await fetch("http://localhost:3001/usuarios");
      if (!response.ok) {
         throw new Error("Error al obtener usuarios");
      }
      const usuarios = await response.json();
      return usuarios;

   } catch (error) {
      console.error("Hay un error al obtener los usuarios", error);
      throw error;
   }
}

export { postUsuario, getUsuarios };

//post index
async function postSolicitudes(solicitudes) {
    try {
        const response = await fetch("http://localhost:3001/solicitudes",{

       method:"POST",
       headers:{
        "Content-Type": "application/json",
        
        },
       body:JSON.stringify(solicitudes)

     })
     const solicitud = await response.json()
     return solicitud
        
    } catch (error) {
     console.error("hay un error al crear las solicitudes", error)
     throw error
     
    }
}
export {postSolicitudes}
async function getSolicitudes() {
   try {
      const response = await fetch("http://localhost:3001/solicitudes");
      if (!response.ok) {
         throw new Error("Error al obtener solicitudes");
      }
      const solicitud = await response.json();
      return solicitud;

   } catch (error) {
      console.error("Hay un error al obtener las solicitudes", error);
      throw error;
   }
}
export {getSolicitudes}

// loginService.js
/**
 * Busca un usuario por su nombre de usuario o correo electrónico con coincidencia estricta.
 * @param {string} identifier - El nombre de usuario o correo electrónico del usuario.
 * @returns {Promise<Object>} El objeto del usuario si se encuentra, de lo contrario null.
 */
export const findUser = async (identifier) => {
    try {
        const response = await fetch('http://localhost:3001/usuarios');
        
        if (!response.ok) {
            throw new Error('La respuesta de la red no fue exitosa.');
        }

        const users = await response.json();
        
        // Búsqueda estricta en el cliente
        const foundUser = users.find(user => 
            user.nombre === identifier || user.correo === identifier
        );
        
        return foundUser || null;

    } catch (error) {
        console.error('Error en la solicitud de búsqueda de usuario:', error);
        throw new Error('Ocurrió un error al buscar el usuario.');
    }
};

/**
 * Actualiza la contraseña de un usuario existente.
 * @param {number} userId - El ID del usuario.
 * @param {string} newPassword - La nueva contraseña.
 * @returns {Promise<Object>} El objeto del usuario actualizado.
 */
export const updatePassword = async (userId, newPassword) => {
    try {
        const response = await fetch(`http://localhost:3001/usuarios/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            // Cambiamos 'password' por 'contraseña' para que coincida con tu db.json
            body: JSON.stringify({ "contraseña": newPassword }),
        });

        if (!response.ok) {
            throw new Error('La respuesta de la red no fue exitosa.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        throw new Error('Ocurrió un error al actualizar la contraseña.');
    }
};

