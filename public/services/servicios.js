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