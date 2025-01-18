// server.js

const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const compression = require('compression');
const UAParser = require('ua-parser-js');
const logActivity = require('./utils/log_activity_USANDO_ua_parser_js');

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Importar el archivo de rutas
const apiRoutes = require('./routes/apiRoutes');
const webRoutes = require('./routes/webRoutes');

// Importar la conexión a la base de datos
const db = require('./db'); // Conexión a la base de datos

// Crear una instancia de la aplicación Express
const app = express();

// Habilitar confianza en el proxy
app.set('trust proxy', true);

// Configurar EJS como motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Carpeta donde estarán las vistas EJS


// Middleware
app.use(compression()); // Habilitar compresión
app.use(express.json()); // Parsear JSON
app.use(cors()); // Habilitar CORS

/* Rutas públicas (páginas web estáticas)
app.use(express.static(path.join(__dirname, 'public')));
*/

// Usar las rutas API
app.use('/api', apiRoutes); // Rutas para APIs
app.use('/', webRoutes); // Rutas para páginas web (index.html u otras)

// Rutas públicas (páginas web estáticas)
app.use(express.static(path.join(__dirname, 'public')));

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
    console.log(`Ruta no encontrada: ${req.originalUrl}`); // Opcional: log para depuración
    const log_activity = logActivity(req, `Ruta no encontrada: ${req.originalUrl}`); // Registrar acción
    console.log("LOG ACTIVITY:");
    console.log(log_activity);
    console.log("");
    res.redirect('/'); // Redirige a la página de inicio
});

// Configuración de HTTPS si es necesario
if (process.env.HTTPS_ENABLED === 'true') {
    const options = {
        key: fs.readFileSync('/etc/letsencrypt/live/rifaseconomicasnavojoa.site/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/rifaseconomicasnavojoa.site/fullchain.pem'),
    };

    // Crear un servidor HTTPS
    https.createServer(options, app).listen(process.env.PORT, () => {
        console.log(`Servidor HTTPS corriendo en puerto ${process.env.PORT}`);
    });
} else {
    // Si no usamos HTTPS, usar HTTP normal
    app.listen(process.env.PORT, '0.0.0.0', () => {
        console.log(`Servidor HTTP corriendo en puerto ${process.env.PORT}`);
    });
}



/*
const express = require('express');
const app = express();
const apiRoutes = require('./routes/apiRoutes');  // Ruta que maneja las API

// Usar las rutas de las API
app.use('/api', apiRoutes);

// Aquí irían las otras configuraciones de tu servidor, como el puerto y middleware
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
*/

