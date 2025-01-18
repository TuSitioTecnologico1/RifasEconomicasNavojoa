// statesApi.js

const logError = require('../utils/log_error');
const db = require('../db'); // Suponiendo que la base de datos está configurada en db.js




let arr_states = [];  // Arreglo para almacenar los estados

// Ruta para obtener los estados desde la base de datos
const saveUserInfo = (req, res) => {
    try {
        const { caused_in, description, geolocationData } = req.body;

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
        const query = 'INSERT INTO errores (causado_en, descripcion) VALUES (?, ?)';
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
};



module.exports = { catchErrors };