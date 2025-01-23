// numerosApi.js

const logActivity = require('../utils/log_activity_USANDO_ua_parser_js'); // Importar el módulo de logs para la ACTIVIDAD de la pagina
const logError = require('../utils/log_error'); // Importar el módulo de logs para los ERRORES de la pagina
const db = require('../db'); // Suponiendo que la base de datos está configurada en db.js
const moment = require('moment');




// Función para verificar y reconectar
async function checkAndReconnect() {
    return new Promise((resolve, reject) => {
        if (db.state === 'disconnected') {
            console.log("La conexión está cerrada. Reabriendo...");
            db.connect(err => {
                if (err) {
                    console.error("Error al reconectar a la base de datos:", err);
                    return reject(err);
                } else {
                    console.log("Conexión reabierta exitosamente.");
                    return resolve();
                }
            });
        } else {
            console.log("La conexión está activa.");
            resolve();
        }
    });
}




let arr_numeros = [];

// Obtener todos los números
const getNumbersBD = async (req, res) => {
    try {
        await checkAndReconnect();

        const log_activity = logActivity(req, 'Visita a la API - /api/numeros'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);

        const query = "SELECT * FROM numeros WHERE visible = 1";
        const [results] = await db.query(query); // Cambiado para usar await
        res.json(results);
        arr_numeros = results;
        /*db.query(query, (err, results) => {
            if (err) {
                console.error("Error en la consulta:", err);
                const log_error = logError(req, 'Error en la API "/api/numeros": ' + err.message); // Registrar acción
                console.log("LOG ERROR:");
                console.log(log_error);
                return res.status(500).json({ error: "Error al obtener los números" });
            }
            res.json(results);
            arr_numeros = results;
        });
        */
    } catch (error) {
        console.error("Error general en la API:", error);
        const log_error = logError(req, 'Error en la API "/api/numeros": ' + error.message); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        res.status(500).json({ error: "Error interno del servidor" });
        console.log("");
    }
};



// Obtener todos los números con paginación
const getNumbersPagination = async (req, res) => {
    try {
        //logActivity(req, 'Se ha utilizado la API - /api/numeros_paginacion'); // Registrar acción

        const page = parseInt(req.query.page) || 1;   // Página actual (por defecto 1)
        const limit = parseInt(req.query.limit) || 1000;  // Número de boletos por página (por defecto 1000)
        const offset = (page - 1) * limit;  // Cálculo del desplazamiento (OFFSET)

        // Consulta para obtener los boletos de la página actual
        const query = `SELECT id, numero, disponible FROM numeros WHERE visible = 1 LIMIT ${limit} OFFSET ${offset}`;
        const [results] = await db.query(query, [limit, offset]);

        const countQuery = "SELECT COUNT(*) AS total FROM numeros WHERE visible = 1";
        const [countResults] = await db.query(countQuery);

        const totalTickets = countResults[0].total;
        const totalPages = Math.ceil(totalTickets / limit);

        res.json({
            numbers: results,
            totalPages: totalPages,
            currentPage: page,
        });
        /*db.query(query, (err, results) => {
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
        });*/
    } catch (error) {
        console.error("Error general en la API:", error);
        const log_error = logError(req, 'Error en la API "/api/numeros_paginacion": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        res.status(500).json({ error: "Error interno del servidor" });
        console.log("");
    }
};



// Cambiar estado de un número a vendido
const changeStatusNumber = async (req, res) => {
    try {
        /*logActivity(req, 'Se ha utilziado la API - Camabio de estado de un número a vendido');*/ // Registrar acción
        const { id } = req.params;

        const log_activity = logActivity(req, 'Visita a la API - /api/numeros/:id - El ID del numero a cambiar es: '+id); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");

        const query = "UPDATE numeros SET disponible = 0 WHERE id = ?";
        await db.query(query, [id]);
        res.json({ success: true, message: "Número vendido actualizado." });
        /*db.query(query, [id], (err, results) => {
            if (err) throw err;
            res.json({ success: true, message: "Número vendido actualizado." });
        });*/
    } catch (error) {
        console.error("Error general en la API:", error);
        const log_error = logError(req, 'Error en la API "/api/numeros/:id": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        res.status(500).json({ error: "Error interno del servidor" });
        console.log("");
    }
};



// Generar varios números al azar
const getNumersRandom = async (req, res) => {
    try {
        const count = parseInt(req.query.count) || 1;

        const log_activity = logActivity(req, 'Visita a la API "/api/numeros/random" - Se ha utilizado la Maquinita de la Suerte para gernerar la cantidad de '+count+' numeros al azar.'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");

        const querySelect = "SELECT * FROM numeros WHERE disponible = 1 ORDER BY RAND() LIMIT ?";
        const [results] = await db.query(querySelect, [count]);

        if (results.length > 0) {
            const ids = results.map(row => row.id);

            const updateQuery = `UPDATE numeros SET disponible = 0 WHERE id IN (?)`;
            await db.query(updateQuery, [ids]);

            res.json({ success: true, numbers: results });
        } else {
            res.json({ success: false, message: "No hay suficientes números disponibles." });
        }
        
        /*const queryUpdate = "UPDATE numeros SET disponible = 0 WHERE id = ?";
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
        });*/
    } catch (error) {
        console.error("Error general en la API:", error);
        const log_error = logError(req, 'Error en la API "/api/numeros/random": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        res.status(500).json({ error: "Error interno del servidor" });
        console.log("");
    }
};



// Ruta para buscar un número
const searchNumber = (req, res) => {
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
        console.error("Error general en la API:", error);
        const log_error = logError(req, 'Error en la API "/api/buscar": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        res.status(500).json({ error: "Error interno del servidor" });
        console.log("");
    }
};



// Cambiar estado de varios números a vendido
const changeStatusMultipleNumbers = async (req, res) => {
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
        await db.query(query, [receivedArray]);
        res.status(200).json({
            status: "success",
            message: "Números apartados con éxito.",
            receivedArray,
        });
        /*for (let z = 0; z < receivedArray.length; z++) {
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
        });*/

    } catch (error) {
        console.error("Error general en la API:", error);
        const log_error = logError(req, 'Error en la API "/api/numeros/cambiar_estado_numeros": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        res.status(500).json({ error: "Error interno del servidor" });
        console.log("");
    }
    
};



let arr_numeros_apartados = [];

// Obtener todos los números apartados
const getReservedNumbersBD = async (req, res) => {
    try {
        await checkAndReconnect();

        const log_activity = logActivity(req, 'Visita a la API - /api/numeros_apartados'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);

        const query = "SELECT id_boleto, boleto, id_usuario, usuario, telefono, estado, pagado, fecha_creacion, fecha_modificacion FROM boletos_adquiridos";
        const [results] = await db.query(query); // Cambiado para usar await


        arr_numeros_apartados = results;
        //console.log(arr_numeros_apartados);

        // Usar moment para formatear la fecha
        const nuevo_arr_numeros_apartados = arr_numeros_apartados.map(obj => ({
            ...obj,
            fecha_creacion: moment(obj.fecha_creacion).format('YYYY-MM-DD HH:mm:ss'),
            fecha_modificacion: moment(obj.fecha_modificacion).format('YYYY-MM-DD HH:mm:ss')
        }));

        //console.log(nuevo_arr_numeros_apartados);


        //res.json(results);
        res.json(nuevo_arr_numeros_apartados);
        
        /*db.query(query, (err, results) => {
            if (err) {
                console.error("Error en la consulta:", err);
                const log_error = logError(req, 'Error en la API "/api/numeros_apartados": ' + err.message); // Registrar acción
                console.log("LOG ERROR:");
                console.log(log_error);
                return res.status(500).json({ error: "Error al obtener los números" });
            }
            res.json(results);
            arr_numeros = results;
        });
        */
    } catch (error) {
        console.error("Error general en la API:", error);
        const log_error = logError(req, 'Error en la API "/api/numeros_apartados": ' + error.message); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        res.status(500).json({ error: "Error interno del servidor" });
        console.log("");
    }
};



// Ruta para buscar numero(s) apartado(s)
const searchReservedTicket = async (req, res) => {
    try {
        //console.log("Haz entrado a: /api/buscar_apartdos");
        const { reserved_number_search } = req.body;

        let reserved_number_found = 0;
        for (let j = 0; j < arr_numeros_apartados.length; j++) {
            const data_reserved_numbers = arr_numeros_apartados[j];
            //console.log("data_reserved_numbers:");
            //console.log(data_reserved_numbers)
            
            const reservedNumberData = data_reserved_numbers.numero;
            //console.log("reservedNumberData: " + reservedNumberData);
            if (reservedNumberData.includes(reserved_number_search)) {    
                //console.log("Se encontro el numero: " + reserved_number_search);
                //console.log(data_reserved_numbers.includes(reserved_number_search));
                reserved_number_found = 1;
                
                //let arr_to_JSON = JSON.stringify(data_reserved_numbers);
                let dataReservedNumber_available = data_reserved_numbers.disponible;
                //console.log("dataNumber_available: "+dataNumber_available);
                
                let data_json = {
                    found: true, 
                    reserved_number_search, 
                    available: dataNumber_available
                }
                console.log("response de: /api/buscar_apartdos");
                console.log(data_json);
                
                return res.json(data_json);
            }
        }
        if (reserved_number_found == 0) {
            console.log("response de: /api/buscar_apartdos");
            console.log("NO see encontro el numero: " + reserved_number_search);
            return res.json({ found: false });
        }

    } catch (error) {
        console.error("Error general en la API:", error);
        const log_error = logError(req, 'Error en la API "/api/buscar_apartdos": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        res.status(500).json({ error: "Error interno del servidor" });
        console.log("");
    }
}



module.exports = { getNumbersBD, getNumbersPagination, changeStatusNumber, getNumersRandom, 
                    searchNumber, changeStatusMultipleNumbers, getReservedNumbersBD, searchReservedTicket };