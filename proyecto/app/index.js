const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
app.set("port", 4000);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'proyectoDB'
});

// Rutas para páginas
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/pages/login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "/pages/register.html")));

// Ruta para registrar usuario
app.post("/register", async (req, res) => {
  const { correo, nombre, telefono, contrasena } = req.body;
  const hashedPassword = await bcrypt.hash(contrasena, 10);

  const sql = "INSERT INTO usuarios (correo, nombre, telefono, contrasena) VALUES (?, ?, ?, ?)";
  db.query(sql, [correo, nombre, telefono, hashedPassword], (err, result) => {
    if (err) {
      console.error(err);
      res.send("Error al registrar usuario");
    } else {
      res.send("Usuario registrado con éxito");
    }
  });
});

// Iniciar servidor
app.listen(app.get("port"), () => {
  console.log("Servidor corriendo en el puerto", app.get("port"));
});
