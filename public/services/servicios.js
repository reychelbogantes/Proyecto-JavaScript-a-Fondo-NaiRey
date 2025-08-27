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