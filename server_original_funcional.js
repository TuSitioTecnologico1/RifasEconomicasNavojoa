require('dotenv').config(); // Importar dotenv

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const https = require("https");
const fs = require('fs');
const compression = require('compression');
const UAParser = require('ua-parser-js');
const logActivity = require('./utils/log_activity_USANDO_ua_parser_js'); // Importar el módulo de logs para la ACTIVIDAD de la pagina
const logError = require('./utils/log_error'); // Importar el módulo de logs para los ERRORES de la pagina
const logGeolocation = require('./utils/log_geolocation'); // Importar el módulo de logs para los ERRORES de la pagina

// Cargar los certificados SSL
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/rifaseconomicasnavojoa.site/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/rifaseconomicasnavojoa.site/fullchain.pem')
};

// Cargar las configuraciones de la BD y el PUERTO
const HOST = process.env.HOST;
const USER_BD = process.env.USER_BD;
const PASS = process.env.PASS;
const DATABASE = process.env.DATABASE;
const PORT = process.env.PORT;
console.log('HOST:', HOST);
console.log('USER_BD:', USER_BD);
console.log('PASS:', PASS);
console.log('DATABASE:', DATABASE);
console.log("PORT:", PORT);

const app = express();
app.use(compression()); // Habilitar compresión

// Middleware
app.use(bodyParser.json());
//app.use(cors());
app.use(cors({
    origin: 'https://rifaseconomicasnavojoa.site', // O permitir todos los dominios con '*'
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para servir archivos estáticos y parsear JSON
app.use(express.static('public'));
app.use(express.json());


// Tu clave API de ipinfo
const apiKey = '3bd8612d14d207';

app.get('/', (req, res) => {
    try {
        const log_activity = logActivity(req, 'Visita a la Pagina de Inicio'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");

        res.sendFile(__dirname + '/public/index.html');
    } catch (error) {
        const log_error = logError(req, 'Error en la ruta "/": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
    }
    
});

// Conexión a la base de datos
/*
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "numeros_suerte",
});
*/

// POOL DE CONEXIONES - Permite que las conexiones se gestionen automáticamente y evita problemas con conexiones cerradas o inactivas
const db = mysql.createConnection({
    host: HOST,
    user: USER_BD,
    password: PASS,
    database: DATABASE,
    timezone: '-07:00', // Desplazamiento de Hermosillo (UTC-7)
    waitForConnections: true,
    connectionLimit: 10, // Número máximo de conexiones simultáneas
    queueLimit: 0 // Sin límite para solicitudes en cola
});

db.query('SELECT NOW() AS fecha_actual', (err, results) => {
    if (err) throw err;
    console.log('Fecha actual:', results[0].fecha_actual);
});





// Función para obtener la geolocalización
function getGeolocation(ip, apiKey, callback) {
    const url = `https://ipinfo.io/${ip}?token=${apiKey}`;

    https.get(url, (res) => {
        let data = '';

        // Acumular los datos de la respuesta
        res.on('data', (chunk) => {
            data += chunk;
        });

        // Cuando se recibe toda la respuesta
        res.on('end', () => {
            if (res.statusCode === 200) {
                // Parsea el JSON y llama al callback con los datos
                callback(null, JSON.parse(data));
            } else {
                // Si hubo un error, llama al callback con el error
                callback(new Error('No se pudo obtener la geolocalización'));
            }
        });
    }).on('error', (e) => {
        callback(e);
    });
}





// ---------------------------------------> APIs <------------------------------------------

app.post('/api/obtener_geolocalizacion', (req, res) => {
    try {
        //console.log("Haz entrado a: /api/obtener_geolocalizacion");
        
        const log_activity = logActivity(req, 'Visita a la API - /api/obtener_geolocalizacion'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");

        const { latitude, longitude, exactitud } = req.body;

        let data_json = {
            latitude,
            longitude,
            exactitud
        }

        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        
        // Obtener la geolocalización
        getGeolocation(clientIp, apiKey, (error, geoData) => {
            //console.log("Haz entrado a: getGeolocation(clientIp, apiKey, (error, geoData)");
            if (error) {
                //console.error('Error al obtener la geolocalización:', error);
                const log_error = logError(req, 'Error al obtener la geolocalización: '+error+''); // Registrar acción
                console.log("LOG ERROR:");
                console.log(log_error);
                return res.status(500).json({ error: 'No se pudo obtener la geolocalización' });
            }
            
            // Crear un objeto con los datos obtenidos
            const showGeolocation = {
                ip: geoData.ip,
                city: geoData.city,
                region: geoData.region,
                country: geoData.country,
                latitude_longitude: geoData.loc, // Coordenadas de latitud y longitud
                exactitud,
            };
            
            const objString_showGeolocation = JSON.stringify(showGeolocation);
            const objString_data_json = JSON.stringify(data_json);

            const log_geolocation_ipinfo = logGeolocation(req, 'GEOLOCATION - IPINFO.IO: '+objString_showGeolocation); // Registrar acción
            console.log("LOG GEOLOCATION DE IPINFO.IO:");
            console.log(log_geolocation_ipinfo);
            console.log("");

            const log_geolocation_browser = logGeolocation(req, 'GEOLOCATION - BROWSER: '+objString_data_json); // Registrar acción
            console.log("LOG GEOLOCATION - BROWSER:");
            console.log(log_geolocation_browser);
            console.log("");
        });

        return res.json(data_json);
    } catch (error) {
        const log_error = logError(req, 'Error en la API "/api/obtener_geolocalizacion": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
    }
});



let arr_numeros = [];
// Obtener todos los números
app.get("/api/numeros", (req, res) => {
    try {
        //console.log("Haz entrado a: /api/numeros");
        const log_activity = logActivity(req, 'Visita a la API - /api/numeros'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");
        
        //const query = "SELECT * FROM numeros WHERE visible = 1 LIMIT 100";
        const query = "SELECT * FROM numeros WHERE visible = 1";
        db.query(query, (err, results) => {
            if (err) {
                console.error("Error en la consulta:", err);
                return res.status(500).json({ error: "Error al obtener los números" });
            }
            res.json(results);
            arr_numeros = results;
        });
    // console.log(arr_numeros);
    } catch (error) {
        const log_error = logError(req, 'Error en la API "/api/numeros": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
    }
    
});



// Obtener todos los números con paginación
app.get("/api/numeros_paginacion", (req, res) => {
    try {
        //logActivity(req, 'Se ha utilizado la API - /api/numeros_paginacion'); // Registrar acción

        const page = parseInt(req.query.page) || 1;   // Página actual (por defecto 1)
        const limit = parseInt(req.query.limit) || 1000;  // Número de boletos por página (por defecto 1000)
        const offset = (page - 1) * limit;  // Cálculo del desplazamiento (OFFSET)

        // Consulta para obtener los boletos de la página actual
        const query = `SELECT id, numero, disponible FROM numeros WHERE visible = 1 LIMIT ${limit} OFFSET ${offset}`;

        db.query(query, (err, results) => {
            if (err) {
                console.error("Error en la consulta:", err);
                return res.status(500).json({ error: "Error al obtener los números" });
            }

            // Consulta para obtener el total de boletos
            const countQuery = "SELECT COUNT(*) AS total FROM numeros WHERE visible = 1";
            db.query(countQuery, (countErr, countResults) => {
                if (countErr) {
                    console.error("Error al contar los boletos:", countErr);
                    return res.status(500).json({ error: "Error al contar los boletos" });
                }

                const totalTickets = countResults[0].total;
                const totalPages = Math.ceil(totalTickets / limit);  // Calcular el número total de páginas

                // Enviar los resultados junto con el número total de páginas
                res.json({
                    numbers: results,
                    totalPages: totalPages,
                    currentPage: page
                });
            });
        });
    } catch (error) {
        const log_error = logError(req, 'Error en la API "/api/numeros_paginacion": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
    }
});



// Cambiar estado de un número a vendido
app.put("/api/numeros/:id", (req, res) => {
    try {
        /*logActivity(req, 'Se ha utilziado la API - Camabio de estado de un número a vendido');*/ // Registrar acción
        const { id } = req.params;

        const log_activity = logActivity(req, 'Visita a la API - /api/numeros/:id - El ID del numero a cambiar es: '+id); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");

        const query = "UPDATE numeros SET disponible = 0 WHERE id = ?";
        db.query(query, [id], (err, results) => {
            if (err) throw err;
            res.json({ success: true, message: "Número vendido actualizado." });
        });
    } catch (error) {
        const log_error = logError(req, 'Error en la API "/api/numeros/:id": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
    }
});



// Generar varios números al azar
app.get("/api/numeros/random", (req, res) => {
    try {
        const count = parseInt(req.query.count) || 1;

        const log_activity = logActivity(req, 'Visita a la API "/api/numeros/random" - Se ha utilizado la Maquinita de la Suerte para gernerar la cantidad de '+count+' numeros al azar.'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");

        const querySelect = "SELECT * FROM numeros WHERE disponible = 1 ORDER BY RAND() LIMIT ?";
        const queryUpdate = "UPDATE numeros SET disponible = 0 WHERE id = ?";

        db.query(querySelect, [count], (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                const ids = results.map(row => row.id);
                const numbers = results.map(row => row.numero);

                const updateQuery = `UPDATE numeros SET disponible = 0 WHERE id IN (${ids.join(",")})`;
                const selectQuery = `SELECT * FROM numeros WHERE id IN (${ids.join(",")})`;
                db.query(selectQuery, (err) => {
                    if (err) throw err;
                    res.json({ success: true, numbers: results });
                });
            } else {
                res.json({ success: false, message: "No hay suficientes números disponibles." });
            }
        });
    } catch (error) {
        const log_error = logError(req, 'Error en la API "/api/numeros/random": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
    }
});



// Ruta para buscar un número
app.post('/api/buscar', (req, res) => {
    try {
        //console.log("Haz entrado a: /api/buscar");
        const { number_search } = req.body;

        let number_found = 0;
        for (let j = 0; j < arr_numeros.length; j++) {
            const data_numbers = arr_numeros[j];
            //console.log("data_numbers:");
            //console.log(data_numbers)
            
            const numberData = data_numbers.numero;
            //console.log("numberData: " + numberData);
            if (numberData.includes(number_search)) {    
                //console.log("Se encontro el numero: " + number_search);
                //console.log(data_numbers.includes(number_search));
                number_found = 1;
                
                //let arr_to_JSON = JSON.stringify(data_numbers);
                let dataNumber_available = data_numbers.disponible;
                //console.log("dataNumber_available: "+dataNumber_available);
                
                let data_json = {
                    found: true, 
                    number_search, 
                    available: dataNumber_available
                }
                console.log("response de: /api/buscar");
                console.log(data_json);
                
                return res.json(data_json);
            }
        }
        if (number_found == 0) {
            console.log("response de: /api/buscar");
            console.log("NO see encontro el numero: " + number_search);
            return res.json({ found: false });
        }

    } catch (error) {
        const log_error = logError(req, 'Error en la API "/api/buscar": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
    }
});



// Cambiar estado de varios números a vendido
app.post("/api/numeros/cambiar_estado_numeros", (req, res) => {
    try {
        //console.log("Haz entrado a: /api/numeros/cambiar_estado_numeros");
        const receivedArray = req.body; // Aquí se obtiene el array enviado

        const log_activity = logActivity(req, 'Visita a la API "/api/numeros/cambiar_estado_numeros" - Sa ha cambiado el estado de multiples numeros a vendidos. Cantidad - '+receivedArray.length); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");

        // Validar que es un array
        if (!Array.isArray(receivedArray)) {
            return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un array." });
        }
        
        const query = "UPDATE numeros SET disponible = 0 WHERE id = ?";
        for (let z = 0; z < receivedArray.length; z++) {
            const id_ticketApartado = receivedArray[z];
            db.query(query, [id_ticketApartado], (err, results) => {
                if (err) throw err;
            });
        }

        // Responder al cliente
        res.status(200).json({
            status: "success",
            message: "Números apartados con éxito.",
            receivedArray
        });

    } catch (error) {
        const log_error = logError(req, 'Error en la API "/api/numeros/cambiar_estado_numeros": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
    }
    
});



// Ruta para manejar la solicitud POST y recibir la info del formulario
app.post('/api/submit', (req, res) => {
    try {
        const { phone, name, lastname, option, geolocationData } = req.body;

        let get_activityPage = page_activity(req);
        const ip = get_activityPage.ip;
        const browser = JSON.stringify(get_activityPage.browser);
        const device = JSON.stringify(get_activityPage.device);
        
        if (browser == undefined) {
            browser = "No identificado";
        }
        if (device == undefined) {
            device = "No identificado";
        }

        const latitud = geolocationData.latitude;
        const longitud = geolocationData.longitude;
        const accuracy = geolocationData.accuracy;
        
        // Insertar datos en la base de datos
        const query = 'INSERT INTO users (name, lastname, state, phone, ip, browser, device, latitud, longitud, accuracy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [name, lastname, option, phone, ip, browser, device, latitud, longitud, accuracy], (err, result) => {
            if (err) throw err;
            
            console.log("Datos del usuario guardados correctamente.");
            
            // Obtener el ID del registro insertado
            const insertedId = result.insertId;

            // Crear un objeto con los datos insertados y el ID
            const insertedDataPerson = {
                userId: insertedId,
                phone: phone,
                name: name,
                lastname: lastname,
                option: option,
                /*ip: ip,
                browser: browser,
                device: device,
                latitude: latitude,
                longitude: longitude,
                accuracy: accuracy,*/
            };
            console.log("insertedDataPerson - /api/submit:");
            console.log(insertedDataPerson);
            console.log("");

            const log_activity = logActivity(req, 'Visita a la API "/api/submit" - Sa ha guardado la informacion de la persona que desea apartar numeros con exito. [Nombre - '+name+', Apellidos - '+lastname+', Celular - '+phone+' - Estado - '+option+' - IP - '+ip+' - BROWSER - '+browser+' - DEVICE - '+device+' - LATITUDE - '+latitud+' - LONGITUDE - '+longitud+' - ACCURACY - '+accuracy+' metros.]'); // Registrar acción
            console.log("LOG ACTIVITY:");
            console.log(log_activity);
            console.log("");

            // Enviar la respuesta con los datos insertados
            const res_json = res.json({
                message: 'Datos del usuario guardados correctamente.',
                userData: insertedDataPerson // Enviar los datos completos
            });
        });

    } catch (error) {
        const log_error = logError(req, 'Error en la API "/api/submit": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
    }
});



let arr_states = [];

// Ruta para obtener los estados desde la base de datos
app.get('/api/getStates', (req, res) => {
    try {
        const query = 'SELECT id, name FROM states';
        db.query(query, (err, results) => {
            if (err) throw err;
            res.json(results);  // Enviar los resultados como JSON
            arr_states = results;
        });
    } catch (error) {
        const log_error = logError(req, 'Error en la API "/api/getStates": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
    }
    
});



// Ruta para obtener los estados desde la base de datos
app.get('/api/states', (req, res) => {
    try {
        res.json(arr_states);  // Enviar los resultados como JSON
    } catch (error) {
        const log_error = logError(req, 'Error en la API "/api/states": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
    }
});



// Ruta para manejar la solicitud POST y recibir la info del formulario
app.post('/api/adquirir_boleto', (req, res) => {
    try {
        //console.log("Haz entrado a: /api/adquirir_boleto");
        const { arr_reservedTickets_ID_and_NUMBER, userId, name, option } = req.body;
        
        const log_activity = logActivity(req, 'Visita a la API "/api/adquirir_boleto" - La persona ha apartado la cantidad de '+arr_reservedTickets_ID_and_NUMBER.length+' numero(s).'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        
        // Insertar datos en la base de datos
        const query = 'INSERT INTO boletos_adquiridos (id_boleto, boleto, id_usuario, usuario, estado) VALUES (?, ?, ?, ?, ?)';
        for (let x = 0; x < arr_reservedTickets_ID_and_NUMBER.length; x++) {
            const id_ticketApartado = arr_reservedTickets_ID_and_NUMBER[x].split("_")[0];
            const numero_ticketApartado = arr_reservedTickets_ID_and_NUMBER[x].split("_")[1];
            db.query(query, [id_ticketApartado, numero_ticketApartado, userId, name, option], (err, results) => {
                if (err) throw err;
            });
        }

        // Crear un objeto con los datos insertados y el ID
        const insertedData = {
            ticket_Id_Number: arr_reservedTickets_ID_and_NUMBER,
            userId: userId,
            userName: name,
            select_state_option: option
        };

        // Responder al cliente
        res.status(200).json({
            status: "success",
            message: "Números apartados con éxito.",
            data_server: insertedData // Enviar los datos completos
        });
    } catch (error) {
        const log_error = logError(req, 'Error en la API "/api/adquirir_boleto": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
    }
});



// Funcion para registrar actividad
function page_activity(req) {
    //const timestamp = new Date().toISOString();
    const timestamp = new Date().toLocaleString('es-ES', {
        timeZone: 'America/Hermosillo'  // Reemplaza con la zona horaria que necesites
    });

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';
    const userAgent = req.headers['user-agent'];
    
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    //const os = parser.getOS().name || 'Unknown OS';
    //const browser = parser.getBrowser().name || 'Unknown Browser';
    
    const browser = result.browser || 'Unknown BROWSER';
    const cpu = result.cpu || 'Unknown CPU';
    const device = result.device || 'Unknown DEVICE';
    const engine = result.engine || 'Unknown ENGINE';
    const os = result.os || 'Unknown OS';
    const ua = result.ua || 'Unknown UA';

    const logEntry = {
        ip,
        browser,
        device,
    }

    console.log("logEntry:");
    console.log(logEntry);

    return logEntry;
}








// Iniciar servidor
/*
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
*/
https.createServer(options, app).listen(PORT, '127.0.0.1', () => {
    console.log(`Servidor HTTPS escuchando en el puerto: ${PORT}`);
});
