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
const http = require('http');               // Agregado el 31-01-2026
const { Server } = require('socket.io');    // Agregado el 31-01-2026

// Importar el archivo de variables para las vistas EJS
//const variables = require('./config/variables');
let variablesPath = path.join(__dirname, 'config', 'variables.js');
delete require.cache[require.resolve(variablesPath)];
let variables = require(variablesPath);

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Importar el archivo de rutas
const apiRoutes = require('./routes/apiRoutes');
const webRoutes = require('./routes/webRoutes');
const panelRoutes = require('./routes/panelRoutes');

// Importar la conexión a la base de datos
const db = require('./db'); // Conexión a la base de datos

// Crear una instancia de la aplicación Express
const app = express();


// 👉 Crear server HTTP (por defecto) - 31-01-2026
let server;

// 👉 Socket.IO - 31-01-2026
let io;


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
app.use(compression()); // Habilitar compresión
app.use(express.json()); // Parsear JSON
app.use(express.urlencoded({ extended: true })); // Parsear datos de formularios
app.use(cors()); // Habilitar CORS

// Usar las rutas API
app.use('/api', apiRoutes); // Rutas para APIs
app.use('/', webRoutes); // Rutas para páginas web (index.html u otras)
app.use('/panel-control-rutas', panelRoutes); // Añadimos el panel para controlar rutas

// Rutas públicas (páginas web estáticas)
app.use(express.static(path.join(__dirname, 'public')));



// Ruta pública para acceder a las imágenes subidas
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));






// Ruta para cargar el formulario de configuración
app.get('/config', (req, res) => {
    try {
        //const envPath = path.join(__dirname, '.env');
        //delete require.cache[require.resolve(envPath)];

        // Recargar archivo .env
        //dotenv.config(); // <<--- AQUÍ recarga las variables de entorno

        /* Variables de entorno
        const envConfig = {
            DB_HOST: process.env.DB_HOST || '',
            DB_USER: process.env.DB_USER || '',
            DB_PASS: process.env.DB_PASS || '',
            DATABASE: process.env.DATABASE || '',
            PORT: process.env.PORT || '',
            HTTPS_ENABLED: process.env.HTTPS_ENABLED || '',
        };*/
        

        // Importar archivo de configuración
        //const config = require(path.join(__dirname, 'public', 'config.js'));
        const configPath = path.join(__dirname, 'public', 'config.js');
        delete require.cache[require.resolve(configPath)];
        const config = require(configPath);

        variablesPath = path.join(__dirname, 'config', 'variables.js');
        delete require.cache[require.resolve(variablesPath)];
        variables = require(variablesPath);

        // Asegúrate de incluir url_edicion
        const url_edicion = variables.url_edicion;

        // Verificar el contenido de config y envConfig
        //console.log('Configuración .env:', envConfig);
        console.log('Configuración config.js:', config);
        console.log('Configuración variables.js:', variables);

        if (variables.message == "1") {

            // Cambiar el valor de "message" en el archivo
            let variablesContent = fs.readFileSync(variablesPath, 'utf8');
            const updatedContent = variablesContent.replace(
                /message: ['"]\d+['"]/,
                `message: '0'`
            );

            // Sobrescribir el archivo con el nuevo contenido
            fs.writeFileSync(variablesPath, updatedContent, 'utf8');
            console.log('Archivo variables.js actualizado: message cambiado a 0');

            // Recargar el archivo actualizado
            delete require.cache[require.resolve(variablesPath)];
            variables = require(variablesPath);

            // Establecer un mensaje de éxito
            res.locals.message = {
                type: 'success',
                text: 'Configuración actualizada exitosamente.'
            };
        }else{
            res.locals.message = null;
        }

        

        // Pasar las configuraciones a la vista
        //res.render('config', { config, envConfig, variables, url_edicion, message: null });

        // Renderiza la vista con los datos actualizados
        res.render('config', {
            config,
            //envConfig,
            variables,
            url_edicion,
            //message: null, // Opcional: mensaje si es necesario
        });
    }catch(error){
        console.error('Error al cargar la configuración:', error);

        // Manejo de errores
        res.render('config', {
            config: {},
            variables: {},
            url_edicion: {},
            message: {
                type: 'error',
                text: 'Error al cargar la configuración.',
            },
        });
    }
});





// Ruta para manejar la actualización de la configuración
app.post('/update-config', (req, res) => {
    try {
        const {
            local_url, online_url, online_test_url, server_url, URL, STATES_URL, GET_STATES_URL,
            BUSCAR_URL, CAMBIAR_ESTADO_NUMEROS_URL, SAVE_PERSON_DATA_URL, ADQUIRIR_BOLETO_URL, 
            NUMEROS_PAGINACION_URL, GEOLOCALIZACION_URL, CAPTURAR_ERRORES_URL, OBTENER_NUMEROS_APARTADOS_URL, 
            BUSCAR_APARTADOS_URL, PAGAR_NUMEROS_APARTADOS_URL, ELIMINAR_PAGO_NUMEROS_APARTADOS_URL, 
            ELIMINAR_NUMEROS_APARTADOS_URL, OBTENER_CONTEO_NUMEROS_URL, VERIFY_PHONE_DATA_URL, CHATBOT_URL, 
            GET_CONFIG_PAGE_URL, CREAR_SORTEO_URL, OBTENER_SORTEOS_URL, message, appName, companyName, 
            currentYear, supportEmail, url_inicio, url_preguntasFrecuentes, url_contacto, url_metodosDePago, 
            url_verificador, url_facebookPage, url_whatsappPage
        } = req.body;


        // Lista de claves desestructuradas
        const expectedKeys = [
            "DB_HOST", "DB_USER", "DB_PASS", "DATABASE", "PORT", "HTTPS_ENABLED", 
            "local_url", "online_url", "online_test_url", "server_url", "URL", "STATES_URL", "GET_STATES_URL",
            "BUSCAR_URL", "CAMBIAR_ESTADO_NUMEROS_URL", "SAVE_PERSON_DATA_URL", "ADQUIRIR_BOLETO_URL", 
            "NUMEROS_PAGINACION_URL", "GEOLOCALIZACION_URL", "CAPTURAR_ERRORES_URL", "OBTENER_NUMEROS_APARTADOS_URL", 
            "BUSCAR_APARTADOS_URL", "PAGAR_NUMEROS_APARTADOS_URL", "ELIMINAR_PAGO_NUMEROS_APARTADOS_URL", 
            "ELIMINAR_NUMEROS_APARTADOS_URL", "OBTENER_CONTEO_NUMEROS_URL", "VERIFY_PHONE_DATA_URL", "CHATBOT_URL", 
            "GET_CONFIG_PAGE_URL", "CREAR_SORTEO_URL", "OBTENER_SORTEOS_URL", "message", "appName", "companyName", 
            "currentYear", "supportEmail", "url_inicio", "url_preguntasFrecuentes", "url_contacto", "url_metodosDePago", 
            "url_verificador", "url_facebookPage", "url_whatsappPage"
        ];

        // Actualizar .env
        //const envContent = `DB_HOST=${DB_HOST}\nDB_USER=${DB_USER}\nDB_PASS=${DB_PASS}\nDATABASE=${DATABASE}\nPORT=${PORT}\nHTTPS_ENABLED=${HTTPS_ENABLED}`;
        //const envPath = path.join(__dirname, '.env');
        //fs.writeFileSync(envPath, envContent, 'utf8');
        //console.log(`Archivo .env actualizado:\n${envContent}`);

        // Actualizar config.js
        const newConfigContent = `
const local_url = '${local_url}';
const online_url = '${online_url}';
const online_test_url = '${online_test_url}';
const server_url = '${server_url}';
const config = {
    local_url: '${local_url}',
    online_url: '${online_url}',
    online_test_url: '${online_test_url}',
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
    PAGAR_NUMEROS_APARTADOS_URL: '${PAGAR_NUMEROS_APARTADOS_URL}',
    ELIMINAR_PAGO_NUMEROS_APARTADOS_URL: '${ELIMINAR_PAGO_NUMEROS_APARTADOS_URL}',
    ELIMINAR_NUMEROS_APARTADOS_URL: '${ELIMINAR_NUMEROS_APARTADOS_URL}',
    OBTENER_CONTEO_NUMEROS_URL: '${OBTENER_CONTEO_NUMEROS_URL}',
    VERIFY_PHONE_DATA_URL: '${VERIFY_PHONE_DATA_URL}',
    CHATBOT_URL: '${CHATBOT_URL}',
    GET_CONFIG_PAGE_URL: '${GET_CONFIG_PAGE_URL}',
    CREAR_SORTEO_URL: '${CREAR_SORTEO_URL}',
    OBTENER_SORTEOS_URL: '${OBTENER_SORTEOS_URL}',
};
if (typeof module !== "undefined" && module.exports) {
    module.exports = config;
}`;

        const configPath = path.join(__dirname, 'public', 'config.js');
        fs.writeFileSync(configPath, newConfigContent, 'utf8');
        console.log(`Archivo config.js actualizado:\n${newConfigContent}`);
        

        // Claves reales en el body
        const actualKeys = Object.keys(req.body);
        console.log("actualKeys:");
        console.log(actualKeys);

        // Crear objeto JSON para almacenar las claves y valores adicionales
        const url_edicion = actualKeys
            .filter(key => !expectedKeys.includes(key)) // Filtra las claves adicionales
            .reduce((obj, key) => {
                obj[key] = req.body[key]; // Agrega clave y valor al objeto
                return obj;
            }, {}); // Inicializa el objeto vacío

        if (Object.keys(url_edicion).length > 0) {
            console.log("Contenido de url_edicion:", url_edicion);
        } else {
            console.log("No hay claves adicionales para agregar a url_edicion.");
        }

        // Convierte el objeto `url_edicion` a una cadena JSON válida para JavaScript
        const urlEdicionString = JSON.stringify(url_edicion, null, 4) // null para evitar un replacer y 4 para la indentación
        .replace(/"([^"]+)":/g, '$1:') // Elimina las comillas de las claves
        .replace(/"/g, "'"); // Cambia las comillas dobles por simples en los valores

        // Actualizar variables.js
        const newVarialesContent = `
const local_url = '${local_url}';
const online_url = '${online_url}';
const online_test_url= '${online_test_url}';
const server_url = '${server_url}';
const variables = {
    message: '${message}',
    appName: '${appName}',
    companyName: '${companyName}',
    currentYear: '${currentYear}',
    supportEmail: '${supportEmail}',
    
    url_inicio: '${url_inicio}',
    url_preguntasFrecuentes: '${url_preguntasFrecuentes}',
    url_contacto: '${url_contacto}',
    url_metodosDePago: '${url_metodosDePago}',
    url_verificador: '${url_verificador}',
    
    url_edicion: ${urlEdicionString},

    url_facebookPage: '${url_facebookPage}',
    url_whatsappPage: '${url_whatsappPage}',
};
if (typeof module !== "undefined" && module.exports) {
    module.exports = variables;
}
`;

        // Cargar variables.js
        const variablesPath = path.join(__dirname, 'config', 'variables.js');
        fs.writeFileSync(variablesPath, newVarialesContent, 'utf8');

        // Recargar variables y configuraciones actualizadas
        /*delete require.cache[require.resolve(variablesPath)];
        const updatedVariables = require(variablesPath);
        console.log(`Archivo variables.js actualizado:\n${newVarialesContent}`);
        */

        // Recargar archivos en memoria
        delete require.cache[require.resolve(variablesPath)];
        delete require.cache[require.resolve(configPath)];
        //delete require.cache[require.resolve(envPath)];

        // Recargar archivo .env
        //dotenv.config(); // <<--- AQUÍ recarga las variables de entorno

        // Cargar los nuevos valores
        const updatedVariables = require(variablesPath);
        const updatedConfig = require(configPath);

        // Actualizar las referencias en la aplicación
        res.locals.appName = updatedVariables.appName;
        res.locals.companyName = updatedVariables.companyName;
        res.locals.currentYear = updatedVariables.currentYear;
        res.locals.supportEmail = updatedVariables.supportEmail;

        res.locals.server_url = updatedVariables.server_url;

        res.locals.url_inicio = updatedVariables.url_inicio;
        res.locals.url_preguntasFrecuentes = updatedVariables.url_preguntasFrecuentes;
        res.locals.url_contacto = updatedVariables.url_contacto;
        res.locals.url_metodosDePago = updatedVariables.url_metodosDePago;
        res.locals.url_verificador = updatedVariables.url_verificador;

        res.locals.url_facebookPage = updatedVariables.url_facebookPage;
        res.locals.url_whatsappPage = updatedVariables.url_whatsappPage;

        /* Redirigir con los datos actualizados
        res.render('config', {
            config: req.body, 
            envConfig: req.body, 
            variables: updatedVariables, // Asegúrate de pasar 'variables' aquí
            message: { type: 'success', text: 'Configuración actualizada exitosamente.' }
        });*/

        // Almacena una variable en res.locals
        //res.locals.message = 'Configuración actualizada exitosamente';
        // Almacena un objeto en res.locals
        res.locals.message = {
            type: 'success',
            text: 'Configuración actualizada exitosamente.'
        };

        // Redirige a /config después de actualizar
        res.redirect('/config');

        /*res.render('config', {
            config: updatedConfig,
            envConfig: process.env,
            variables: updatedVariables,
            message: { type: 'success', text: 'Configuración actualizada exitosamente.' },
        });*/

    } catch (error) {
        console.error('Error al actualizar configuración:', error);
        res.render('config', { 
            config: {}, 
            envConfig: {}, 
            variables: {},  // Pasar 'variables' vacías en caso de error
            message: { type: 'error', text: 'Error al actualizar configuración.' }
        });
    }
});





app.post('/test-data', (req, res) => {
    console.log('Datos recibidos:', req.body);
    const {
        DB_HOST, DB_USER, DB_PASS, DATABASE, PORT, HTTPS_ENABLED,
        local_url, online_url, online_test_url, server_url, URL, STATES_URL, GET_STATES_URL,
        BUSCAR_URL, CAMBIAR_ESTADO_NUMEROS_URL, SAVE_PERSON_DATA_URL,
        ADQUIRIR_BOLETO_URL, NUMEROS_PAGINACION_URL, GEOLOCALIZACION_URL,
        CAPTURAR_ERRORES_URL, OBTENER_NUMEROS_APARTADOS_URL, BUSCAR_APARTADOS_URL,
        appName, companyName, currentYear, supportEmail, url_inicio, 
        url_preguntasFrecuentes, url_contacto, url_metodosDePago, url_verificador, 
        url_facebookPage, url_whatsappPage
    } = req.body;

    // Lista de claves desestructuradas
    const expectedKeys = [
        "DB_HOST", "DB_USER", "DB_PASS", "DATABASE", "PORT", "HTTPS_ENABLED",
        "local_url", "online_url", "online_test_url", "server_url", "URL", "STATES_URL", "GET_STATES_URL",
        "BUSCAR_URL", "CAMBIAR_ESTADO_NUMEROS_URL", "SAVE_PERSON_DATA_URL",
        "ADQUIRIR_BOLETO_URL", "NUMEROS_PAGINACION_URL", "GEOLOCALIZACION_URL",
        "CAPTURAR_ERRORES_URL", "OBTENER_NUMEROS_APARTADOS_URL", "BUSCAR_APARTADOS_URL",
        "appName", "companyName", "currentYear", "supportEmail", "url_inicio", 
        "url_preguntasFrecuentes", "url_contacto", "url_metodosDePago", "url_verificador", 
        "url_facebookPage", "url_whatsappPage"
    ];

    // Claves reales en el body
    const actualKeys = Object.keys(req.body);

    // Crear objeto JSON para almacenar las claves y valores adicionales
    const url_edicion = actualKeys
        .filter(key => !expectedKeys.includes(key)) // Filtra las claves adicionales
        .reduce((obj, key) => {
            obj[key] = req.body[key]; // Agrega clave y valor al objeto
            return obj;
        }, {}); // Inicializa el objeto vacío

    if (Object.keys(url_edicion).length > 0) {
        console.log("Contenido de url_edicion:", url_edicion);
    } else {
        console.log("No hay claves adicionales para agregar a url_edicion.");
    }


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
    const certPath = '/etc/letsencrypt/live/rifaseconomicasnavojoa.com/';
    if (fs.existsSync(`${certPath}privkey.pem`) && fs.existsSync(`${certPath}fullchain.pem`)) {
        const options = {
            key: fs.readFileSync(`${certPath}privkey.pem`),
            cert: fs.readFileSync(`${certPath}fullchain.pem`),
        };

        server = https.createServer(options, app);

    } else {
        console.error('Certificados HTTPS no encontrados.');
        process.exit(1);
    }
} else {
    server = http.createServer(app);
}



// 👉 Inicializar Socket.IO
io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});



// ==================================================
// 🔽 INICIO CÓDIGO AGREGADO
// SOCKET.IO – SOPORTE HUMANO EN TIEMPO REAL
// ==================================================

// Manejo de conexiones Socket.IO
// Cada cliente que entra al modo soporte se conecta aquí
/*
io.on('connection', (socket) => {

    console.log("==================================================================");
    console.log('🔌 Nuevo socket conectado:', socket.id);
    console.log("==================================================================");

    // El cliente solicita entrar a soporte humano
    socket.on('soporte:join', (data) => {
        console.log('📞 Cliente en espera de soporte humano');
        console.log('📄 Datos del cliente:', data);
        console.log('📄 Página:', data.pagina);
        console.log('📅 Fecha:', data.fecha);

        // Todos los clientes de soporte entran a la misma sala por ahora. Guardamos el socket en una sala de soporte
        socket.join('cola-soporte');
    });

    // Mensajes enviados desde el cliente o el agente
    socket.on('soporte:mensaje', (data) => {
        console.log('💬 Mensaje de soporte:', data.mensaje);

        // Reenviamos el mensaje a todos en la sala de soporte
        
        //io.to('cola-soporte').emit('soporte:mensaje', {
            //mensaje: data.mensaje
        //});
        
        // Envía a TODOS EXCEPTO el socket que emitió
        socket.to('cola-soporte').emit('soporte:mensaje', {
            mensaje: data.mensaje
        });

    });

    // Detectar desconexión. Evento cuando el cliente se desconecta
    socket.on('disconnect', () => {
        console.log("******************************************************************");
        console.log('❌ Socket desconectado:', socket.id);
        console.log("******************************************************************");
    });
});
*/
// ==================================================
// 🔼 FIN CÓDIGO AGREGADO
// ==================================================





// ==================================================
// SOCKET.IO – SOPORTE HUMANO EN TIEMPO REAL (CORRECTO)
// ==================================================

const clientesSoporte = new Map();
// socket.id → { pagina, fecha }

let socketSoporte = null;

io.on('connection', (socket) => {
    console.log("==================================================================");
    console.log('🔌 Nuevo socket conectado:', socket.id);
    console.log("==================================================================");

    /**
     * CLIENTE solicita soporte humano
     */
    socket.on('soporte:join', (data) => {
        clientesSoporte.set(socket.id, {
            pagina: data.pagina,
            fecha: data.fecha
        });

        console.log('📞 Cliente en espera de soporte humano:', socket.id);
        console.log('📄 Datos del cliente:', data);
        console.log(' ');

        // Cada cliente usa SU PROPIA SALA (su socket.id)
        socket.join(socket.id);

        // Avisamos al panel que llegó un nuevo cliente
        io.emit('soporte:nuevo-cliente', {
            socketId: socket.id,
            pagina: data.pagina,
            fecha: data.fecha
        });
    });

    /**
     * MENSAJES (cliente ↔ soporte)
     */
    socket.on('soporte:mensaje', (data) => {

        // 👉 MENSAJE DESDE SOPORTE HACIA CLIENTE
        if (data.socketId) {

            console.log('🎧 Soporte → Cliente:', data.socketId);
            console.log('Mensaje: ', data.mensaje);
            console.log(' ');

            io.to(data.socketId).emit('soporte:mensaje', {
                mensaje: data.mensaje,
                messageId: data.messageId
            });

        } 
        // 👉 MENSAJE DESDE CLIENTE HACIA SOPORTE
        else {

            console.log('👤 Cliente → Soporte:', socket.id);
            console.log('Mensaje: ', data.mensaje);
            console.log(' ');

            io.emit('soporte:mensaje-cliente', {
                socketId: socket.id,
                mensaje: data.mensaje
            });
        }
    });

    /** 
     * CLIENTE está escribiendo → SOPORTE
     */ 
    socket.on('soporte:typing', () => {
        io.emit('soporte:cliente-escribiendo', {
            socketId: socket.id
        });
    });

    socket.on('soporte:stop-typing', () => {
        io.emit('soporte:cliente-dejo-escribir', {
            socketId: socket.id
        });
    });

    /** 
     * SOPORTE está escribiendo → CLIENTE
     */ 
    socket.on('soporte:soporte-typing', (data) => {
        // data.socketId = cliente al que se le está escribiendo
        io.to(data.socketId).emit('soporte:soporte-escribiendo');
    });

    socket.on('soporte:soporte-stop-typing', (data) => {
        io.to(data.socketId).emit('soporte:soporte-dejo-escribir');
    });

    /**
     * MENSAJE ENTREGADO
     */
    socket.on('soporte:mensaje-entregado', (data) => {
        if (!socketSoporte) return;

        io.to(socketSoporte).emit('soporte:mensaje-entregado', {
            clienteId: socket.id,
            messageId: data.messageId
        });
    });
    /*
    socket.on('soporte:mensaje-entregado', () => {
        const socketSoporte = clientesSoporte[socket.id];
        if (socketSoporte) {
            socketSoporte.emit('soporte:mensaje-entregado', {
                clienteId: socket.id
            });
        }
    });
    */

    /**
     * MENSAJE VISTO (WhatsApp style)
     */
    socket.on('soporte:mensaje-visto', (data) => {
        console.log("soporte:mensaje-visto - data: ", data);
        console.log("socketSoporte: ", socketSoporte);
        console.log(" ");

        if (!socketSoporte) return;

        io.to(socketSoporte).emit('soporte:mensaje-visto', {
            messageId: data.messageId,
            clienteId: socket.id
        });
    });

    socket.on('soporte:register', () => {
        socketSoporte = socket.id;
        console.log('🎧 Soporte conectado:', socketSoporte);
    });


    socket.on('disconnect', () => {
        if (clientesSoporte.has(socket.id)) {
            console.log("******************************************************************");
            console.log('❌ Socket desconectado - Cliente salió:', socket.id);
            console.log("******************************************************************");

            // Quitamos del mapa
            clientesSoporte.delete(socket.id);

            // Avisamos al panel
            io.emit('soporte:cliente-desconectado', {
                socketId: socket.id
            });
        }
    });

    /*
    socket.on('disconnect', () => {
        console.log("******************************************************************");
        console.log('❌ Socket desconectado:', socket.id);
        console.log("******************************************************************");
    });
    */
});





// 👉 Arrancar servidor
server.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});



/*
if (process.env.HTTPS_ENABLED === '1') {
    const certPath = '/etc/letsencrypt/live/rifaseconomicasnavojoa.com/';
    if (fs.existsSync(`${certPath}privkey.pem`) && fs.existsSync(`${certPath}fullchain.pem`)) {
        const options = {
            key: fs.readFileSync(`${certPath}privkey.pem`),
            cert: fs.readFileSync(`${certPath}fullchain.pem`),
        };
        https.createServer(options, app).listen(process.env.PORT, () => {
            console.log(`Servidor HTTPS corriendo en puerto ${process.env.PORT}`);
        });
    } else {
        console.error('Certificados HTTPS no encontrados. Servidor no puede iniciar en modo HTTPS.');
        process.exit(1);
    }
} else {
    // Si no usamos HTTPS, usar HTTP normal
    app.listen(process.env.PORT, '0.0.0.0', () => {
        console.log(`Servidor HTTP corriendo en puerto ${process.env.PORT}`);
    });
}
*/






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

