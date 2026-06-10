document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = {
        correo: document.getElementById("correo").value,
        contrasena: document.getElementById("password").value
    };

    const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });

    // Leemos el mensaje del servidor (puede ser éxito o error)
    const mensaje = await response.text();
    
    // Mostramos el mensaje en una alerta para el usuario
    alert(mensaje); 
});