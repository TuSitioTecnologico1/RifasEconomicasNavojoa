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

// Importar el archivo de variables para las vistas EJS
const variables = require('./config/variables');

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

// Middleware para cargar variables globales del archivo config/variables.ejs
app.use((req, res, next) => {
    res.locals.appName = variables.appName;
    res.locals.companyName = variables.companyName;
    res.locals.currentYear = variables.currentYear;
    res.locals.supportEmail = variables.supportEmail;
    
    res.locals.server_url = variables.server_url,

    // views/partials/navbar.ejs
    res.locals.url_inicio = variables.url_inicio,
    res.locals.url_preguntasFrecuentes = variables.url_preguntasFrecuentes,
    res.locals.url_contacto = variables.url_contacto,
    res.locals.url_metodosDePago = variables.url_metodosDePago,
    res.locals.url_verificador = variables.url_verificador,
    res.locals.url_edicion = variables.url_edicion,

    // views/pages/pronto_iniciaremos.ejs - views/pages/cerrado.ejs
    res.locals.url_facebookPage = variables.url_facebookPage,
    res.locals.url_whatsappPage = variables.url_whatsappPage,
    next();
});


// Middleware
// Middleware
app.use(compression()); // Habilitar compresión
app.use(express.json()); // Parsear JSON
app.use(express.urlencoded({ extended: true })); // Parsear datos de formularios
app.use(cors()); // Habilitar CORS


// Usar las rutas API
app.use('/api', apiRoutes); // Rutas para APIs
app.use('/', webRoutes); // Rutas para páginas web (index.html u otras)

// Rutas públicas (páginas web estáticas)
app.use(express.static(path.join(__dirname, 'public')));


// Ruta para cargar el formulario de configuración
app.get('/config', (req, res) => {

    // Variables de entorno
    const envConfig = {
        DB_HOST: process.env.DB_HOST || '',
        DB_USER: process.env.DB_USER || '',
        DB_PASS: process.env.DB_PASS || '',
        DATABASE: process.env.DATABASE || '',
        PORT: process.env.PORT || '',
        HTTPS_ENABLED: process.env.HTTPS_ENABLED || '',
    };

    // Importar archivo de configuración
    //const config = require(path.join(__dirname, 'public', 'config.js'));
    const configPath = path.join(__dirname, 'public', 'config.js');
    delete require.cache[require.resolve(configPath)];
    const config = require(configPath);

    // Importar archivo de variables para las vistas EJS
    const variablesPath = path.join(__dirname, 'config', 'variables.js');
    delete require.cache[require.resolve(variablesPath)];
    const variables = require(variablesPath);

    // Asegúrate de incluir url_edicion
    const url_edicion = variables.url_edicion;

    // Verificar el contenido de config y envConfig
    console.log('Configuración .env:', envConfig);
    console.log('Configuración config.js:', config);
    console.log('Configuración variables.js:', variables);

    // Pasar las configuraciones a la vista
    res.render('config', { config, envConfig, variables, url_edicion, message: null });
});


// Ruta para manejar la actualización de la configuración
app.post('/update-config', (req, res) => {
    try {
        const {
            DB_HOST, DB_USER, DB_PASS, DATABASE, PORT, HTTPS_ENABLED,
            local_url, online_url, server_url, URL, STATES_URL, GET_STATES_URL,
            BUSCAR_URL, CAMBIAR_ESTADO_NUMEROS_URL, SAVE_PERSON_DATA_URL,
            ADQUIRIR_BOLETO_URL, NUMEROS_PAGINACION_URL, GEOLOCALIZACION_URL,
            CAPTURAR_ERRORES_URL, OBTENER_NUMEROS_APARTADOS_URL, BUSCAR_APARTADOS_URL,
            appName, companyName, currentYear, supportEmail, url_inicio, 
            url_preguntasFrecuentes, url_contacto, url_metodosDePago, url_verificador, 
            url_edicion, url_facebookPage, url_whatsappPage
        } = req.body;

        // Actualizar .env
        const envContent = `
        DB_HOST=${DB_HOST}
        DB_USER=${DB_USER}
        DB_PASS=${DB_PASS}
        DATABASE=${DATABASE}
        PORT=${PORT}
        HTTPS_ENABLED=${HTTPS_ENABLED}
        `.trim();

        const envPath = path.join(__dirname, '.env');
        fs.writeFileSync(envPath, envContent, 'utf8');
        console.log(`Archivo .env actualizado:\n${envContent}`);

        // Actualizar config.js
        const newConfigContent = `
        const local_url = '${local_url}';
        const online_url = '${online_url}';
        const server_url = '${server_url}';
        
        const config = {
            local_url: '${local_url}',
            online_url: '${online_url}',
            server_url: '${server_url}',
            URL: '${URL}',
            STATES_URL: '${STATES_URL}',
            GET_STATES_URL: '${GET_STATES_URL}',
            BUSCAR_URL: '${BUSCAR_URL}',
            CAMBIAR_ESTADO_NUMEROS_URL: '${CAMBIAR_ESTADO_NUMEROS_URL}',
            SAVE_PERSON_DATA_URL: '${SAVE_PERSON_DATA_URL}',
            ADQUIRIR_BOLETO_URL: '${ADQUIRIR_BOLETO_URL}',
            NUMEROS_PAGINACION_URL: '${NUMEROS_PAGINACION_URL}',
            GEOLOCALIZACION_URL: '${GEOLOCALIZACION_URL}',
            CAPTURAR_ERRORES_URL: '${CAPTURAR_ERRORES_URL}',
            OBTENER_NUMEROS_APARTADOS_URL: '${OBTENER_NUMEROS_APARTADOS_URL}',
            BUSCAR_APARTADOS_URL: '${BUSCAR_APARTADOS_URL}',
        };
        
        // Exportar el objeto config
        if (typeof module !== "undefined" && module.exports) {
            module.exports = config; // Para entornos que soportan CommonJS
        }
        `.trim();

        const configPath = path.join(__dirname, 'public', 'config.js');
        fs.writeFileSync(configPath, newConfigContent, 'utf8');
        console.log(`Archivo config.js actualizado:\n${newConfigContent}`);

        // Redirigir de nuevo a la vista de configuración
        //res.redirect('/config');
        res.render('config', { config: req.body, envConfig: req.body, message: { type: 'success', text: 'Configuración actualizada exitosamente.' } });
    } catch (error) {
        console.error('Error al actualizar configuración:', error);
        res.render('config', { config: {}, envConfig: {}, message: { type: 'error', text: 'Error al actualizar configuración.' } });
    }
});



app.post('/test-data', (req, res) => {
    console.log('Datos recibidos:', req.body);
    const {
        DB_HOST, DB_USER, DB_PASS, DATABASE, PORT, HTTPS_ENABLED,
        local_url, online_url, server_url, URL, STATES_URL, GET_STATES_URL,
        BUSCAR_URL, CAMBIAR_ESTADO_NUMEROS_URL, SAVE_PERSON_DATA_URL,
        ADQUIRIR_BOLETO_URL, NUMEROS_PAGINACION_URL, GEOLOCALIZACION_URL,
        CAPTURAR_ERRORES_URL, OBTENER_NUMEROS_APARTADOS, BUSCAR_APARTADOS_URL
    } = req.body;

    console.log("DB_HOST: "+DB_HOST);
    res.json({ message: 'Datos recibidos', data: req.body });
});




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
if (process.env.HTTPS_ENABLED === '1') {
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

