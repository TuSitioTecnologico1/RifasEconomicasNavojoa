// userApi.js

const logActivity = require('../utils/log_activity_USANDO_ua_parser_js'); // Importar el módulo de logs para la ACTIVIDAD de la pagina
const logError = require('../utils/log_error'); // Importar el módulo de logs para los ERRORES de la pagina
const db = require('../db'); // Suponiendo que la base de datos está configurada en db.js
const UAParser = require('ua-parser-js');




// Ruta para recibir y guardar la info del formulario en la BD
const saveUserInfo = async (req, res) => {
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

        const latitude = geolocationData.latitude;
        const longitude = geolocationData.longitude;
        const accuracy = geolocationData.accuracy;
        
        const dataPerson = {
            phone,
            name,
            lastname,
            option,
            ip,
            browser,
            device,
            latitude,
            longitude,
            accuracy,
        };

        console.log("dataPerson:");
        console.log(dataPerson);

        // Insertar datos en la base de datos
        const query = 'INSERT INTO users (name, lastname, state, phone, ip, browser, device, latitude, longitude, accuracy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [name, lastname, option, phone, ip, browser, device, latitude, longitude, accuracy]);

        const insertedId = result.insertId;

        const insertedDataPerson = {
            userId: insertedId,
            phone,
            name,
            lastname,
            option,
        };

        const log_activity = logActivity(req, `Visita a la API "/api/submit" - Información guardada: [ID: ${insertedId}, Nombre: ${name}, Apellidos: ${lastname}, Teléfono: ${phone}, Estado: ${option}, IP: ${ip}, Browser: ${browser}, Dispositivo: ${device}, Latitud: ${latitude}, Longitud: ${longitude}, Precisión: ${accuracy} metros.]`);
        console.log("LOG ACTIVITY:", log_activity);

        res.json({
            message: 'Datos del usuario guardados correctamente.',
            userData: insertedDataPerson,
        });

        /*db.query(query, [name, lastname, option, phone, ip, browser, device, latitud, longitud, accuracy], (err, result) => {
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
                //ip: ip,
                //browser: browser,
                //device: device,
                //latitude: latitude,
                //longitude: longitude,
                //accuracy: accuracy,
            };
            //console.log("insertedDataPerson - /api/submit:");
            //console.log(insertedDataPerson);
            //console.log("");

            const log_activity = logActivity(req, 'Visita a la API "/api/submit" - Sa ha guardado la informacion de la persona que desea apartar numeros con exito. [ID: '+insertedId+', Nombre - '+name+', Apellidos - '+lastname+', Celular - '+phone+' - Estado - '+option+' - IP - '+ip+' - BROWSER - '+browser+' - DEVICE - '+device+' - LATITUDE - '+latitud+' - LONGITUDE - '+longitud+' - ACCURACY - '+accuracy+' metros.]'); // Registrar acción
            console.log("LOG ACTIVITY:");
            console.log(log_activity);
            console.log("");

            // Enviar la respuesta con los datos insertados
            const res_json = res.json({
                message: 'Datos del usuario guardados correctamente.',
                userData: insertedDataPerson // Enviar los datos completos
            });
        });*/

    } catch (error) {
        console.error("Error general en la API:", error);
        const log_error = logError(req, 'Error en la API "/api/submit": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        res.status(500).json({ error: "Error interno del servidor" });
        console.log("");
    }
};



// Ruta para recibir la info del usuario y los boletos que adquirio para guardarlos en la BD
const savePurchasedTicketsUser = async (req, res) => {
    try {
        //console.log("Haz entrado a: /api/adquirir_boleto");
        const { arr_reservedTickets_ID_and_NUMBER, userId, name, phone, option } = req.body;
        
        const log_activity = logActivity(req, 'Visita a la API "/api/adquirir_boleto" - La persona ha apartado la cantidad de '+arr_reservedTickets_ID_and_NUMBER.length+' numero(s).'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        
        // Insertar datos en la base de datos
        const query = 'INSERT INTO boletos_adquiridos (id_boleto, boleto, id_usuario, usuario, telefono, estado) VALUES (?, ?, ?, ?, ?, ?)';
        
        const values = arr_reservedTickets_ID_and_NUMBER.map(item => {
            const [id_boleto, boleto] = item.split("_");
            return [id_boleto, boleto, userId, name, phone, option];
        });

        // Insertar todos los boletos adquiridos en una sola consulta
        await Promise.all(values.map(value => db.query(query, value)));

        const insertedData = {
            ticket_Id_Number: arr_reservedTickets_ID_and_NUMBER,
            userId,
            userName: name,
            userPhone: phone,
            select_state_option: option,
        };

        res.status(200).json({
            status: "success",
            message: "Números apartados con éxito.",
            data_server: insertedData,
        });
        /*for (let x = 0; x < arr_reservedTickets_ID_and_NUMBER.length; x++) {
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
        });*/
    } catch (error) {
        console.error("Error general en la API:", error);
        const log_error = logError(req, `Error en la API "/api/submit": ${error}`); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        res.status(500).json({ error: "Error interno del servidor" });
        console.log("");
    }
};



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



module.exports = { saveUserInfo, savePurchasedTicketsUser };