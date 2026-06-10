const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Base de Datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'proyectoDB'
});

// ¡IMPORTANTE! Debes definir esta variable antes de usarla
const intentosFallidos = {};

// Ruta GET para cargar el login
app.get("/", (req, res) => res.sendFile(path.join(__dirname, 'pages', 'login.html')));

app.post("/login", (req, res) => {
    const { correo, contrasena } = req.body;

    // Verificar si el usuario está bloqueado
    if (intentosFallidos[correo] >= 3) {
        return res.status(429).send("Cuenta bloqueada por 3 intentos fallidos.");
    }

    db.query("SELECT * FROM usuarios WHERE correo = ?", [correo], async (err, results) => {
        if (err) return res.status(500).send("Error en el servidor");

        if (results.length > 0) {
            const usuario = results[0];
            // Comparar contraseña
            const match = await bcrypt.compare(contrasena, usuario.contrasena);

            if (match) {
                intentosFallidos[correo] = 0; // Resetear intentos
                return res.send("¡Login exitoso!");
            }
        }

        // Incrementar intentos si falla
        intentosFallidos[correo] = (intentosFallidos[correo] || 0) + 1;
        const restantes = 3 - intentosFallidos[correo];
        
        if (restantes > 0) {
            res.status(401).send(`Credenciales incorrectas. Te quedan ${restantes} intentos.`);
        } else {
            res.status(429).send("Ya superaste los 3 intentos. Cuenta bloqueada.");
        }
    });
});

// Recuperar contraseña
app.get("/recuperar", (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'recuperar.html'));
});

app.post("/recuperar", (req, res) => {
    const { correo } = req.body;
    console.log("Recuperación solicitada para:", correo);
    res.send("Se han enviado las instrucciones a tu correo.");
});

app.listen(4000, () => console.log("Servidor en http://localhost:4000"));