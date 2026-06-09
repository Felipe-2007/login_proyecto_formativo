-- Active: 1780338044807@@127.0.0.1@3306@mysql
CREATE DATABASE proyectoDB;

USE proyectoDB;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  correo VARCHAR(100) NOT NULL UNIQUE,
  nombre VARCHAR(50) NOT NULL,
  telefono VARCHAR(20),
  contrasena VARCHAR(255) NOT NULL
);



select * from usuarios;


SHOW DATABASES;
USE restauranteDB;
SHOW TABLES;
