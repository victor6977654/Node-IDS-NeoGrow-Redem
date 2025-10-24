const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;
const MAX_USERS = 200;

let currentUsers = 0;

// Configuración de sesión (listo para login Google/Facebook/etc.)
app.use(session({
    secret: 'supersecreto', // Cambiar en producción
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hora
}));

// Middleware para limitar conexiones simultáneas
app.use((req, res, next) => {
    if (currentUsers >= MAX_USERS) {
        return res.status(503).sendFile(path.join(__dirname, 'public', 'full.html'));
    }
    currentUsers++;
    res.on('finish', () => {
        currentUsers--;
    });
    next();
});

// Servir todos los archivos de public, incluyendo subcarpetas
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal (dashboard)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta 404 para cualquier otro archivo que no exista
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Arrancar el servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});