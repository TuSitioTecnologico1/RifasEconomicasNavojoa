// numerosApi.js

const logActivity = require('../utils/log_activity_USANDO_ua_parser_js'); // Importar el módulo de logs para la ACTIVIDAD de la pagina
const logError = require('../utils/log_error'); // Importar el módulo de logs para los ERRORES de la pagina
const db = require('../db'); // Suponiendo que la base de datos está configurada en db.js
const moment = require('moment');
const { json } = require('body-parser');




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

        // Validar que es un array
        if (!Array.isArray(receivedArray) || receivedArray.length === 0) {
            return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un array no vacío." });
        }

        // Crear la lista de marcadores de posición (?, ?, ?) basada en la longitud del array
        const placeholders = receivedArray.map(() => "?").join(", ");
        const query = `UPDATE numeros SET disponible = 0 WHERE id IN (${placeholders})`

        // Ejecutar la consulta con los valores del array
        await db.query(query, receivedArray);

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



// Pagar numeros apartados
const paidReservedNumbersBD = async (req, res) => {
    try {
        //console.log("Haz entrado a: /api/numeros/pagar_numeros_reservados");
        //const receivedArray_ticketsPagados = req.body; // Aquí se obtiene el array enviado
        const { received_array_ticketsPagados_ID, received_array_ticketsPagados_NUMERO } = req.body;
        //console.log("received_array_ticketsPagados_ID:");
        //console.log(received_array_ticketsPagados_ID);
        //console.log("received_array_ticketsPagados_NUMERO:");
        //console.log(received_array_ticketsPagados_NUMERO);

        const log_activity = logActivity(req, 'Visita a la API "/api/numeros/pagar_numeros_apartados" - Se pagaran a la cantidad de '+received_array_ticketsPagados_NUMERO.length+' numero(s). Numeros: '+JSON.stringify(received_array_ticketsPagados_NUMERO)+''); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);

        // Validar que es un array
        if (!Array.isArray(received_array_ticketsPagados_ID) || received_array_ticketsPagados_ID.length === 0) {
            return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un array no vacío." });
        }

        // Crear la lista de marcadores de posición (?, ?, ?) basada en la longitud del array
        const placeholders = received_array_ticketsPagados_ID.map(() => "?").join(", ");
        const query = `UPDATE boletos_adquiridos SET pagado = 1 WHERE id_boleto IN (${placeholders})`;

        // Ejecutar la consulta con los valores del array
        await db.query(query, received_array_ticketsPagados_ID);

        res.status(200).json({
            status: "success",
            message: "Números pagados con éxito.",
            received_array_ticketsPagados_ID,
            received_array_ticketsPagados_NUMERO,
        });

    } catch (error) {
        console.error("Error general en la API:", error);
        const log_error = logError(req, 'Error en la API "/api/numeros/pagar_numeros_apartados": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        res.status(500).json({ error: "Error interno del servidor" });
        console.log("");
    }
};



// Eliminar pago numeros apartados
const deletePaidReservedNumbersBD = async (req, res) => {
    try {
        //const receivedArray_ticketsEliminarPago = req.body; // Aquí se obtiene el array enviado
        const { received_arr_eliminar_pago_boletos_ID, received_arr_eliminar_pago_boletos_NUMERO } = req.body;
        //console.log("received_arr_eliminar_pago_boletos_ID:");
        //console.log(received_arr_eliminar_pago_boletos_ID);
        //console.log("received_arr_eliminar_pago_boletos_NUMERO:");
        //console.log(received_arr_eliminar_pago_boletos_NUMERO);

        const log_activity = logActivity(req, 'Visita a la API "/api/numeros/eliminar_pago_numeros_apartados" - Se le eliminara el pago a la cantidad de '+received_arr_eliminar_pago_boletos_NUMERO.length+' numero(s). Numeros: '+JSON.stringify(received_arr_eliminar_pago_boletos_NUMERO)+''); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);

        // Validar que es un array
        if (!Array.isArray(received_arr_eliminar_pago_boletos_ID) || received_arr_eliminar_pago_boletos_ID.length === 0) {
            return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un array no vacío." });
        }

        // Crear la lista de marcadores de posición (?, ?, ?) basada en la longitud del array
        const placeholders = received_arr_eliminar_pago_boletos_ID.map(() => "?").join(", ");
        const query = `UPDATE boletos_adquiridos SET pagado = 0 WHERE id_boleto IN (${placeholders})`;

        // Ejecutar la consulta con los valores del array
        await db.query(query, received_arr_eliminar_pago_boletos_ID);

        res.status(200).json({
            status: "success",
            message: "Se ha borrado el pago de los numeros seleccionados con éxito.",
            received_arr_eliminar_pago_boletos_ID,
            received_arr_eliminar_pago_boletos_NUMERO,
        });

    } catch (error) {
        console.error("Error general en la API:", error);
        const log_error = logError(req, 'Error en la API "/api/numeros/eliminar_pago_numeros_apartados": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        res.status(500).json({ error: "Error interno del servidor" });
        console.log("");
    }
};



// Eliminar numeros apartados 
const deleteReservedNumbersBD = async (req, res) => {
    try {
        //const receivedArray_ticketsEliminarPago = req.body; // Aquí se obtiene el array enviado
        const { received_arr_eliminar_boletos_ID, received_arr_eliminar_boletos_NUMERO } = req.body;
        //console.log("received_arr_eliminar_boletos_ID:");
        //console.log(received_arr_eliminar_boletos_ID);
        //console.log("received_arr_eliminar_boletos_NUMERO:");
        //console.log(received_arr_eliminar_boletos_NUMERO);

        const log_activity = logActivity(req, 'Visita a la API "/api/numeros/eliminar_numeros_apartados" - Se le eliminara el pago a la cantidad de '+received_arr_eliminar_boletos_NUMERO.length+' numero(s). Numeros: '+JSON.stringify(received_arr_eliminar_boletos_NUMERO)+''); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);

        // Validar que es un array
        if (!Array.isArray(received_arr_eliminar_boletos_ID) || received_arr_eliminar_boletos_ID.length === 0) {
            return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un array no vacío." });
        }

        // Crear la lista de marcadores de posición (?, ?, ?) basada en la longitud del array
        const placeholders_1 = received_arr_eliminar_boletos_ID.map(() => "?").join(", ");
        const query_delete = `DELETE FROM boletos_adquiridos WHERE id_boleto IN (${placeholders_1})`; // Borra los boletos que estaba apartados

        // Ejecutar la consulta con los valores del array
        await db.query(query_delete, received_arr_eliminar_boletos_ID);


        // Crear la lista de marcadores de posición (?, ?, ?) basada en la longitud del array
        const placeholders_2 = received_arr_eliminar_boletos_ID.map(() => "?").join(", ");
        const query_update = `UPDATE numeros SET disponible = 1 WHERE id IN (${placeholders_2})`; // Pone disponibles los numeros que estaban apartados

        // Ejecutar la consulta con los valores del array
        await db.query(query_update, received_arr_eliminar_boletos_ID);
        

        res.status(200).json({
            status: "success",
            message: "Se ha borrado el pago de los numeros seleccionados con éxito.",
            received_arr_eliminar_boletos_ID,
            received_arr_eliminar_boletos_NUMERO,
        });

    } catch (error) {
        console.error("Error general en la API:", error);
        const log_error = logError(req, 'Error en la API "/api/numeros/eliminar_numeros_apartados": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        res.status(500).json({ error: "Error interno del servidor" });
        console.log("");
    }
};



let arr_conteo_numeros = [];
// Obtener el conteo de numeros reservados, pagados y libres
const getCountingNumbersBD = async (req, res) => {
    try {
        await checkAndReconnect();

        const log_activity = logActivity(req, 'Visita a la API - "/api/numeros/obtener_conteo_numeros'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);

        const query = "SELECT * FROM boletos_conteo";
        const [results] = await db.query(query); // Cambiado para usar await
        res.json(results);
        arr_conteo_numeros = results;
    } catch (error) {
        console.error("Error general en la API:", error);
        const log_error = logError(req, 'Error en la API "/api/numeros/obtener_conteo_numeros": ' + error.message); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        res.status(500).json({ error: "Error interno del servidor" });
        console.log("");
    }
};



// Actualizar el conteo de numeros reservados, pagados y libres
const updateCountingNumbersBD = async (req, res) => {
    try {
        //console.log("Haz entrado a: /api/numeros/actualizar_conteo_numeros");
        let log_activity = logActivity(req, 'Visita a la API - "/api/numeros/actualizar_conteo_numeros"'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);

        const received_array_tickets_NUMERO = req.body; // Aquí se obtiene el array enviado
        //console.log("received_array_tickets_NUMERO:");
        //console.log(received_array_tickets_NUMERO);

        const cantidad_numeros_apartados = received_array_tickets_NUMERO.length;
        //console.log("cantidad_numeros_apartados: " + cantidad_numeros_apartados);
        //console.log("cantidad_numeros_apartados: " + cantidad_numeros_apartados.toString());

        let data_received_array_tickets_NUMERO_obj = {
            tickets_numeros_apartados: received_array_tickets_NUMERO,
            cantidad: cantidad_numeros_apartados,
        };

        console.log(" ------------------------------------------------ ");
        console.log("|     data_received_array_tickets_NUMERO_obj:    |");
        console.log(" ------------------------------------------------ ");
        console.log(data_received_array_tickets_NUMERO_obj);

        log_activity = logActivity(req, 'API - "/api/numeros/actualizar_conteo_numeros" - NUMEROS_APARTADOS: '+JSON.stringify(data_received_array_tickets_NUMERO_obj)); // Registrar acción

        if (received_array_tickets_NUMERO.length > 0) {
            const query = "SELECT reservados, pagados, libres FROM boletos_conteo";
            const [results_select_boletosConteo] = await db.query(query); // Cambiado para usar await

            //console.log("results - SELECT - TABLA - boletos_conteo:");
            //console.log(results)

            let data_boletosConteo_obj = {
                status: "waiting_info",
                message: "Datos vacios",
                received_array_tickets_NUMERO,
                reserved_numbers: "",
                paid_numbers: "",
                free_numbers: "",
            };


            let reserved_numbers = "";
            let paid_numbers = "";
            let free_numbers = "";
            
            let data_boletosConteo_obj_anterior = {};
            let data_boletosConteo_obj_actualizado = {};
            let tipo_accion = [];
            let data_boletosConteo_actualizado_obj = {};
            for (let z = 0; z < results_select_boletosConteo.length; z++) {
                const data_boletosConteo = results_select_boletosConteo[z];
                //console.log("data_boletosConteo:");
                //console.log(data_boletosConteo)

                const query_select_sorteos = "SELECT id, edicion, emisiones, premio, descripcion, fecha, activo FROM sorteos";
                const [results_select_sorteos] = await db.query(query_select_sorteos); // Cambiado para usar await

                let data_sorteos_obj = {};
                for (let y = 0; y < results_select_sorteos.length; y++) {
                    const data_sorteos = results_select_sorteos[y];
                    //console.log("data_sorteos:");
                    //console.log(data_sorteos)
                    data_sorteos_obj = {
                        tabla_BD: "sorteos",
                        message: "Datos del sorteo",
                        id: data_sorteos.id,
                        edicion: data_sorteos.edicion,
                        emisiones: data_sorteos.emisiones,
                        premio: data_sorteos.premio,
                        descripcion: data_sorteos.descripcion,
                        fecha: data_sorteos.fecha,
                        activo: data_sorteos.activo,
                    };
                }

                console.log(" -------------------------------- ");
                console.log("|     data_tabla_sorteos_obj:    |");
                console.log(" -------------------------------- ");
                console.log(data_sorteos_obj);

                
                const query_select_boletosAdquiridos = "SELECT id_boleto, boleto, pagado FROM boletos_adquiridos";
                const [results_select_boletosAdquiridos] = await db.query(query_select_boletosAdquiridos); // Cambiado para usar await

                let boletos_pagados = 0;
                let boletos_NoPagados = 0;
                let data_boletosAdquiridos_obj = {};
                for (let x = 0; x < results_select_boletosAdquiridos.length; x++) {
                    const data_boletosAdquiridos = results_select_boletosAdquiridos[x];
                    //console.log("data_boletosAdquiridos:");
                    //console.log(data_boletosAdquiridos)
                    if (data_boletosAdquiridos.pagado == "1") {
                        boletos_pagados += 1;
                    }
                    if (data_boletosAdquiridos.pagado == "0") {
                        boletos_NoPagados += 1;
                    }
                }
                
                const total_boletos_pagados_noPagados = boletos_pagados + boletos_NoPagados;
                const total_boletos = data_sorteos_obj.emisiones - total_boletos_pagados_noPagados;


                data_boletosAdquiridos_obj = {
                    tabla_BD: "boletos_adquiridos",
                    message: "Datos actuales de los boletos pagados y no pagados.",
                    pagados: boletos_pagados.toString(),
                    no_pagados: boletos_NoPagados.toString(),
                    total: total_boletos.toString()
                };

                /*console.log(" ------------------------------------------ ");
                console.log("|     data_tabla_boletosAdquiridos_obj:    |");
                console.log(" ------------------------------------------ ");
                console.log(data_boletosAdquiridos_obj);*/


                data_boletosConteo_obj_anterior = {
                    status: "success",
                    message: "Datos obtenidos de: boletos_conteo",
                    received_array_tickets_NUMERO,
                    reserved_numbers: data_boletosConteo.reservados,
                    paid_numbers: data_boletosConteo.pagados,
                    free_numbers: data_boletosConteo.libres
                }
                
                /*console.log(" -------------------------------------- ");
                console.log("|     data_tabla_boletosConteo_obj:    |");
                console.log(" -------------------------------------- ");
                console.log(data_boletosConteo_obj_anterior);*/


                Object.assign(data_boletosConteo_obj, data_boletosAdquiridos_obj); // Actualizar el objeto "data_boletosConteo_obj" con la informacion del objeto "data_boletosConteo_obj_anterior"

                log_activity = logActivity(req, 'API - "/api/numeros/actualizar_conteo_numeros" - CONTEO_NUMEROS_ANTERIOR: '+JSON.stringify(data_boletosConteo_obj)); // Registrar acción

                tipo_accion = received_array_tickets_NUMERO[0].split("_"); // Puede ser un array de 1, 2 o 3 posiciones. Ej: tipo_accion:  [ '00005', 'pagado' ]
                console.log("tipo_accion: ", tipo_accion);

                if (tipo_accion.length > 1) {
                    if (tipo_accion.length == 2) {
                        console.log("if (tipo_accion.length == 2)");
                        const verificar_estructura_arr_ticketsPagados = verificarEstructuraPagado(received_array_tickets_NUMERO);
                        const verificar_estructura_arr_ticketsPagoBorrado = verificarEstructuraPagoBorrado(received_array_tickets_NUMERO);
                        console.log("verificar_estructura_arr_ticketsPagados: " + verificar_estructura_arr_ticketsPagados);
                        console.log("verificar_estructura_arr_ticketsPagoBorrado: " + verificar_estructura_arr_ticketsPagoBorrado);
                        if (verificar_estructura_arr_ticketsPagados) {
                            //reserved_numbers = data_boletosConteo.reservados;
                            reserved_numbers = data_boletosAdquiridos_obj.no_pagados;
                            reserved_numbers = parseInt(reserved_numbers) - parseInt(cantidad_numeros_apartados);
                            reserved_numbers = reserved_numbers.toString();
                            //console.log("reserved_numbers: " + reserved_numbers);

                            //paid_numbers = data_boletosConteo.pagados;
                            paid_numbers = data_boletosAdquiridos_obj.pagados;
                            paid_numbers = parseInt(paid_numbers) + parseInt(cantidad_numeros_apartados);
                            paid_numbers = paid_numbers.toString();
                            //console.log("paid_numbers: " + paid_numbers);

                            free_numbers = data_boletosConteo.libres;
                            free_numbers = free_numbers.toString();
                            //console.log("free_numbers: " + free_numbers);
                        }
                        if (verificar_estructura_arr_ticketsPagoBorrado) {
                            //reserved_numbers = data_boletosConteo.reservados;
                            reserved_numbers = data_boletosAdquiridos_obj.no_pagados;
                            reserved_numbers = parseInt(reserved_numbers) + parseInt(cantidad_numeros_apartados);
                            reserved_numbers = reserved_numbers.toString();
                            //console.log("reserved_numbers: " + reserved_numbers);

                            //paid_numbers = data_boletosConteo.pagados;
                            paid_numbers = data_boletosAdquiridos_obj.pagados;
                            paid_numbers = parseInt(paid_numbers) - parseInt(cantidad_numeros_apartados);
                            paid_numbers = paid_numbers.toString();
                            //console.log("paid_numbers: " + paid_numbers);

                            free_numbers = data_boletosConteo.libres;
                            free_numbers = free_numbers.toString();
                            //console.log("free_numbers: " + free_numbers);
                        }
                        if (!verificar_estructura_arr_ticketsPagados && !verificar_estructura_arr_ticketsPagoBorrado) {
                            console.log("if (!verificar_estructura_arr_ticketsPagados && !verificar_estructura_arr_ticketsPagoBorrado)");
                            
                        }
                    }
                    if (tipo_accion.length == 3) {
                        console.log("if (tipo_accion.length == 3)");
                        let estado_boletos_liberados_obj = verificar_estadoa_boleto_liberado(received_array_tickets_NUMERO);
                        console.log("estado_boletos_liberados_obj: ", estado_boletos_liberados_obj);
                        
                        reserved_numbers = data_boletosAdquiridos_obj.no_pagados;
                        reserved_numbers = parseInt(reserved_numbers) - parseInt(estado_boletos_liberados_obj.tickets_noPagados);
                        reserved_numbers = reserved_numbers.toString();
                        //console.log("reserved_numbers: " + reserved_numbers);

                        //paid_numbers = data_boletosConteo.pagados;
                        paid_numbers = data_boletosAdquiridos_obj.pagados;
                        //paid_numbers = parseInt(paid_numbers) - parseInt(cantidad_numeros_apartados);
                        paid_numbers = parseInt(paid_numbers) - parseInt(estado_boletos_liberados_obj.tickets_pagados);
                        paid_numbers = paid_numbers.toString();
                        //console.log("paid_numbers: " + paid_numbers);
                            
                        
                        //free_numbers = data_boletosConteo.libres;
                        free_numbers = data_boletosAdquiridos_obj.total;
                        free_numbers = parseInt(free_numbers) + parseInt(cantidad_numeros_apartados);
                        free_numbers = free_numbers.toString();
                        //console.log("free_numbers: " + free_numbers);
                    }

                    data_boletosConteo_obj_actualizado = {
                        status: "success",
                        message: "Datos actualizados de: boletos_conteo",
                        received_array_tickets_NUMERO,
                        reserved_numbers,
                        paid_numbers,
                        free_numbers
                    }

                    Object.assign(data_boletosConteo_obj, data_boletosConteo_obj_actualizado); // Actualizar el objeto "data_boletosConteo_obj" con la informacion del objeto "data_boletosConteo_obj_actualizado"

                    const query = `UPDATE boletos_conteo SET reservados = "${reserved_numbers}", pagados = "${paid_numbers}", libres = "${free_numbers}" WHERE id = 1`;
                    const [results_query_update] = await db.query(query); // Cambiado para usar await
                    //console.log("results - UPDATE - TABLA - boletos_conteo:");
                    //console.log(JSON.stringify(results));
                    //console.log(results_query_update);

                    //log_activity = logActivity(req, 'API - "/api/numeros/actualizar_conteo_numeros" - CONTEO_NUMEROS_ACTUALIZADO: ' + JSON.stringify(data_boletosConteo_obj)); // Registrar acción

                    
                }else{
                    // ----------------------------------------------------------------------------------------------------------------- //
                    // -------------------------------> ESTE CODIGO ES PARA ACTUALIZAR EL CONTEO DE BOLETOS <----------------------------//
                    // ----------------------------------> CUANDO EL USUARIO APARTA BOLETOS DE LA PAGINA <-------------------------------//
                    // ----------------------------------------------------------------------------------------------------------------- //
                    //reserved_numbers = data_boletosConteo.reservados;
                    reserved_numbers = data_boletosAdquiridos_obj.no_pagados;
                    reserved_numbers = parseInt(reserved_numbers) + parseInt(cantidad_numeros_apartados);
                    reserved_numbers = reserved_numbers.toString();
                    //console.log("reserved_numbers: " + reserved_numbers);

                    //free_numbers = data_boletosConteo.libres;
                    free_numbers = data_boletosAdquiridos_obj.total;
                    free_numbers = parseInt(free_numbers) - parseInt(cantidad_numeros_apartados);
                    free_numbers = free_numbers.toString();
                    //console.log("free_numbers: " + free_numbers);

                    //paid_numbers = data_boletosConteo.pagados;
                    paid_numbers = data_boletosAdquiridos_obj.pagados;
                    //console.log("paid_numbers: " + paid_numbers);

                    data_boletosConteo_obj_actualizado = {
                        status: "success",
                        message: "Datos actualizados de: boletos_conteo",
                        received_array_tickets_NUMERO,
                        reserved_numbers,
                        paid_numbers,
                        free_numbers
                    }

                    Object.assign(data_boletosConteo_obj, data_boletosConteo_obj_actualizado); // Actualizar el objeto "data_boletosConteo_obj" con la informacion del objeto "data_boletosConteo_obj_actualizado"
                    
                    if (reserved_numbers != "" && reserved_numbers != undefined && paid_numbers != "" && paid_numbers != undefined && free_numbers != "" && free_numbers != undefined) {
                        const query = `UPDATE boletos_conteo SET reservados = "${reserved_numbers}", pagados = "${paid_numbers}", libres = "${free_numbers}" WHERE id = 1`;
                        const [results_query_update] = await db.query(query); // Cambiado para usar await
                        //console.log("results - UPDATE - TABLA - boletos_conteo:");
                        //console.log(JSON.stringify(results));
                        //console.log(results_query_update);
        
                        //log_activity = logActivity(req, 'API - "/api/numeros/actualizar_conteo_numeros" - CONTEO_NUMEROS_ACTUALIZADO: '+JSON.stringify(data_boletosConteo_obj)); // Registrar acción
                    } else {
                        console.log("HAY UN ERROR. ALGUNO DE LOS SIGUIENTES DATOS VIENE VACIO O ES 'undefined':");
                        console.log("reserved_numbers: " + reserved_numbers);
                        console.log("paid_numbers: " + paid_numbers);
                        console.log("free_numbers: " + free_numbers);
                    }
                }
                    

                
            }


            /*console.log(" --------------------------------------- ");
            console.log("|  data_boletosConteo_obj_actualizado:  |");
            console.log(" --------------------------------------- ");
            console.log(data_boletosConteo_obj_actualizado);*/
            

            
            data_boletosConteo_actualizado_obj = {
                status: data_boletosConteo_obj.status,
                message: data_boletosConteo_obj.message,
                
                received_array_tickets_NUMERO: data_boletosConteo_obj.received_array_tickets_NUMERO,
                reserved_numbers_anterior: data_boletosConteo_obj.no_pagados,
                paid_numbers_anterior: data_boletosConteo_obj.pagados,
                free_numbers_anterior: data_boletosConteo_obj.total,
                
                tabla_BD: data_boletosConteo_obj.tabla_BD,

                reserved_numbers_actualizado: data_boletosConteo_obj.reserved_numbers,
                paid_numbers_actualizado: data_boletosConteo_obj.paid_numbers,
                free_numbers_actualizado: data_boletosConteo_obj.free_numbers,
            }

            console.log(" --------------------------------------- ");
            console.log("|  data_boletosConteo_actualizado_obj:  |");
            console.log(" --------------------------------------- ");
            console.log(data_boletosConteo_actualizado_obj);

            log_activity = logActivity(req, 'API - "/api/numeros/actualizar_conteo_numeros" - CONTEO_NUMEROS_ACTUALIZADO: '+JSON.stringify(data_boletosConteo_actualizado_obj)); // Registrar acción
            


            /*
            for (let z = 0; z < results.length; z++) {
                const data_counting_numbers = results[z];
                console.log("data_counting_numbers:");
                console.log(data_counting_numbers)

                data_countingNumber_obj_anterior = {
                    status: "success",
                    message: "Datos obtenidos de: boletos_conteo",
                    received_array_tickets_NUMERO,
                    reserved_numbers: data_counting_numbers.reservados,
                    paid_numbers: data_counting_numbers.pagados,
                    free_numbers: data_counting_numbers.libres
                }

                Object.assign(data_countingNumber_obj, data_countingNumber_obj_anterior); // Actualizar el objeto "data_countingNumber_obj" con la informacion del objeto "data_countingNumber_obj_anterior"

                
                const verificar_estructura_arr_ticketsPagados = verificarEstructuraPagado(received_array_tickets_NUMERO);
                const verificar_estructura_arr_ticketsPagoBorrado = verificarEstructuraPagoBorrado(received_array_tickets_NUMERO);
                const verificar_estructura_arr_ticketsLiberados = verificarEstructuraBoletoLiberado(received_array_tickets_NUMERO);

                console.log(" ------------------------------------- ");
                console.log("|  data_countingNumber_obj_anterior:  |");
                console.log(" ------------------------------------- ");
                //console.log(data_countingNumber_obj_anterior);
                if (verificar_estructura_arr_ticketsPagados == true) {
                    console.log(" ------------------------------------------------------------------------------------------------------------------------------------------ ");
                    console.log("|  " + JSON.stringify(data_countingNumber_obj_anterior) + "  |");
                    console.log(" ------------------------------------------------------------------------------------------------------------------------------------------ ");
                }
                if (verificar_estructura_arr_ticketsPagoBorrado == true) {
                    console.log(" ----------------------------------------------------------------------------------------------------------------------------------------------- ");
                    console.log("|  " + JSON.stringify(data_countingNumber_obj_anterior) + "  |");
                    console.log(" ----------------------------------------------------------------------------------------------------------------------------------------------- ");
                }
                if (verificar_estructura_arr_ticketsLiberados.data == true) {
                    console.log(" ----------------------------------------------------------------------------------------------------------------------------------------------- ");
                    console.log("|  " + JSON.stringify(data_countingNumber_obj_anterior) + "  |");
                    console.log(" ----------------------------------------------------------------------------------------------------------------------------------------------- ");
                }
                if (verificar_estructura_arr_ticketsPagados == false && verificar_estructura_arr_ticketsPagoBorrado == false && verificar_estructura_arr_ticketsLiberados.data == false) {
                    console.log(" ----------------------------------------------------------------------------------------------------------------------------------------------- ");
                    console.log("|  " + JSON.stringify(data_countingNumber_obj_anterior) + "  |");
                    console.log(" ----------------------------------------------------------------------------------------------------------------------------------------------- ");
                }

                log_activity = logActivity(req, 'API - "/api/numeros/actualizar_conteo_numeros" - CONTEO_NUMEROS_ANTERIOR: '+JSON.stringify(data_countingNumber_obj_anterior)); // Registrar acción


                let query_boletosAdquiridos; // Declarar la variable antes de los bloques if
                let values_boletosAdquiridos = []; // Array para almacenar los valores de los boletos
                let values_boletosAdquiridos_estado = []; // Array para almacenar el estado en el que vienen los boletos
                let received_array_tickets_NUMERO_split = "";
                let boletoAquirido_pagado_o_pagoBorrado = "";
                let boletos_apartados = 0;
                if (!verificar_estructura_arr_ticketsPagados && !verificar_estructura_arr_ticketsPagoBorrado && !verificar_estructura_arr_ticketsLiberados.data) {
                    console.log("IF - if (!verificar_estructura_arr_ticketsPagados && !verificar_estructura_arr_ticketsPagoBorrado && !verificar_estructura_arr_ticketsLiberados.data)");
                    boletos_apartados = 1;
                    values_boletosAdquiridos = received_array_tickets_NUMERO; // Usar el array completo de boletos
                    const placeholders = received_array_tickets_NUMERO.map(() => "?").join(", ");
                    query_boletosAdquiridos = `SELECT id_boleto, boleto, pagado FROM boletos_adquiridos WHERE boleto IN (${placeholders})`;
                }

                if (verificar_estructura_arr_ticketsPagados || verificar_estructura_arr_ticketsPagoBorrado) {
                    console.log("IF - if (verificar_estructura_arr_ticketsPagados || verificar_estructura_arr_ticketsPagoBorrado)");
                    received_array_tickets_NUMERO_split = received_array_tickets_NUMERO.map(ticket => ticket.split("_")[0]); // Extraer los números de los boletos de cada elemento del array (sin la parte "_pagado" o "_pagoBorrado")
                    console.log("received_array_tickets_NUMERO_split:", received_array_tickets_NUMERO_split);
                    values_boletosAdquiridos = received_array_tickets_NUMERO_split; // Usar el array con los números de boletos
                    const placeholders = received_array_tickets_NUMERO_split.map(() => "?").join(", ");
                    query_boletosAdquiridos = `SELECT id_boleto, boleto, pagado FROM boletos_adquiridos WHERE boleto IN (${placeholders})`;
                    boletoAquirido_pagado_o_pagoBorrado = received_array_tickets_NUMERO.map(ticket => ticket.split("_")[1]); // Extraer la parte de "_pagado" o "_pagoBorrado". Ej: ["pagado"] o ["pagoBorrado"]
                    values_boletosAdquiridos_estado = boletoAquirido_pagado_o_pagoBorrado;
                }

                if (verificar_estructura_arr_ticketsLiberados.data) {
                    console.log("IF - if (verificar_estructura_arr_ticketsLiberados.data)");
                    received_array_tickets_NUMERO_split = received_array_tickets_NUMERO.map(ticket => ticket.split("_")[0]); // Extraer los números de los boletos de cada elemento del array (sin la parte "_boletoLiberado_pagado" o "_boletoLiberado_noPagado")
                    console.log("received_array_tickets_NUMERO_split:", received_array_tickets_NUMERO_split);
                    values_boletosAdquiridos = received_array_tickets_NUMERO_split; // Usar el array con los números de boletos
                    const placeholders = received_array_tickets_NUMERO_split.map(() => "?").join(", ");
                    query_boletosAdquiridos = `SELECT id_boleto, boleto, pagado FROM boletos_adquiridos WHERE boleto IN (${placeholders})`;
                    boletoAquirido_pagado_o_pagoBorrado = received_array_tickets_NUMERO.map(ticket => ticket.split("_")[1]); // Extraer la parte de "_pagado" o "_pagoBorrado". Ej: ["pagado"] o ["pagoBorrado"]
                    values_boletosAdquiridos_estado = boletoAquirido_pagado_o_pagoBorrado;
                }

                // Verificar si la consulta está definida antes de ejecutarla
                if (!query_boletosAdquiridos) {
                    console.log("IF - if (!query_boletosAdquiridos)");
                    throw new Error("Error: query_boletosAdquiridos no se definió correctamente.");
                }

                // Ejecutar la consulta pasando los valores para los placeholders
                const [results_boletosAquiridos] = await db.query(query_boletosAdquiridos, values_boletosAdquiridos);
                
                // Obtener todos los campos como un array de objetos
                const boletos_info_completa = results_boletosAquiridos.map(row => ({
                    id_boleto: row.id_boleto,
                    boleto: row.boleto,
                    pagado: row.pagado
                }));

                console.log("Boletos encontrados:", boletos_info_completa);

                
                // Crear un objeto para verificar si cada boleto está pagado
                const boletos_estado = {};

                boletos_info_completa.forEach(boletoInfo => {
                    // Almacenamos el estado de cada boleto, si está pagado o no
                    boletos_estado[boletoInfo.boleto] = boletoInfo.pagado == "1"; // O puedes usar `boletoInfo.pagado === 'true'` dependiendo de cómo esté almacenado el valor
                });

                // Mostrar el estado de cada boleto
                boletos_info_completa.forEach(boletoInfo => {
                    const numero_boleto = boletoInfo.boleto; // Extraer el número del boleto
                    if (boletos_estado[numero_boleto] !== undefined) {
                        console.log(`El boleto ${numero_boleto} está ${boletos_estado[numero_boleto] ? 'pagado' : 'no pagado'}`);
                    } else {
                        console.log(`El boleto ${numero_boleto} no fue encontrado en la base de datos.`);
                    }
                });


                console.log("values_boletosAdquiridos_estado:");
                console.log(values_boletosAdquiridos_estado); // Ej: [ 'pagado', 'pagado' ] o [ 'pagoBorrado', 'pagoBorrado' ]
                console.log(values_boletosAdquiridos_estado.length);

                let obj_boleto_pagado_noPagado = [];
                received_array_tickets_NUMERO.forEach(element => {
                    obj_boleto_pagado_noPagado.push({
                        boleto: element.split("_")[0],
                        estado: element.split("_")[1],
                    });
                });

                console.log("obj_boleto_pagado_noPagado:");
                console.log(obj_boleto_pagado_noPagado);

                let pagado_noPagado_boleto = 2;
                let pagado_o_noPagado = 2;
                if (values_boletosAdquiridos_estado.length > 0) {
                    if (values_boletosAdquiridos_estado[0] == "pagado") {
                        console.log('IF - if (values_boletosAdquiridos_estado[0] == "pagado")');
                        pagado_noPagado_boleto = 1;
                    }
                    if (values_boletosAdquiridos_estado[0] == "pagoBorrado") {
                        console.log('IF - if (values_boletosAdquiridos_estado[0] == "pagoBorrado")');
                        pagado_noPagado_boleto = 0;
                    }
                    boletos_info_completa.forEach(boletoInfo => {
                        if (pagado_noPagado_boleto == "1" && boletoInfo.pagado == "1") {
                            console.log('IF - if (pagado_noPagado_boleto == "1" && boletoInfo.pagado == "1")');
                            pagado_o_noPagado = 1;
                        }
                        if (pagado_noPagado_boleto == "0" && boletoInfo.pagado == "0") {
                            console.log('IF - if (pagado_noPagado_boleto == "0" && boletoInfo.pagado == "0")');
                            pagado_o_noPagado = 0;
                        }
                    });
                    console.log("pagado_noPagado_boleto: ", pagado_noPagado_boleto);
                    console.log("pagado_o_noPagado: ", pagado_o_noPagado);
                }else{
                    if (boletos_apartados == 0) {
                        console.log("ELSE - if (values_boletosAdquiridos_estado.length > 0)");
                        pagado_o_noPagado = 3;
                    }
                }
                
                if (pagado_o_noPagado == 3 && boletos_apartados == 0) {
                    console.log("IF - if (pagado_o_noPagado == 3 && boletos_apartados == 0)");
                    console.log("EL 'values_boletosAdquiridos_estado' ESTA VACIO.");
                }
                if (pagado_o_noPagado == 2 || boletos_apartados == 1) {
                    console.log("IF - if (pagado_o_noPagado == 2 || boletos_apartados == 1)");
                    if (verificar_estructura_arr_ticketsPagados) { // Si es true
                        btn_accion = "PAGADO";
                        console.log("IF - if (verificar_estructura_arr_ticketsPagados): " + verificar_estructura_arr_ticketsPagados);
                        reserved_numbers = data_counting_numbers.reservados;
                        console.log("reserved_numbers: " + reserved_numbers);
                        if (reserved_numbers != "0" || reserved_numbers != 0) {
                            reserved_numbers = parseInt(reserved_numbers) - parseInt(cantidad_numeros_apartados); // Se disminuye la cantidad de reservados
                            reserved_numbers = reserved_numbers.toString();
                            console.log("reserved_numbers_actualizado: " + reserved_numbers);
                        }

                        paid_numbers = data_counting_numbers.pagados
                        console.log("paid_numbers: " + paid_numbers);
                        paid_numbers = parseInt(paid_numbers) + parseInt(cantidad_numeros_apartados); // Se aumenta la cantidad de pagados
                        paid_numbers = paid_numbers.toString();
                        console.log("paid_numbers_actualizado: " + paid_numbers);

                        free_numbers = data_counting_numbers.libres;
                        console.log("free_numbers: " + free_numbers);

                    } 
                    if (verificar_estructura_arr_ticketsPagoBorrado) { // Si es true
                        btn_accion = "PAGO_LIBERADO";
                        console.log("IF - if (verificar_estructura_arr_ticketsPagoBorrado): " + verificar_estructura_arr_ticketsPagoBorrado);
                        reserved_numbers = data_counting_numbers.reservados;
                        console.log("reserved_numbers: " + reserved_numbers);
                        reserved_numbers = parseInt(reserved_numbers) + parseInt(cantidad_numeros_apartados); // Se aumenta la cantidad de reservados
                        reserved_numbers = reserved_numbers.toString();
                        console.log("reserved_numbers_actualizado: " + reserved_numbers);
                        
                        paid_numbers = data_counting_numbers.pagados
                        if (paid_numbers != "0" || paid_numbers != 0) {
                            paid_numbers = data_counting_numbers.pagados
                            console.log("paid_numbers: " + paid_numbers);
                            paid_numbers = parseInt(paid_numbers) - parseInt(cantidad_numeros_apartados); // Se disminuye la cantidad de pagados
                            paid_numbers = paid_numbers.toString();
                            console.log("paid_numbers_actualizado: " + paid_numbers);
                        }

                        free_numbers = data_counting_numbers.libres;
                        console.log("free_numbers: " + free_numbers);

                    }
                    if (verificar_estructura_arr_ticketsLiberados.data) { // Si es true
                        btn_accion = "BOLETO_LIBERADO";
                        console.log("IF - if (verificar_estructura_arr_ticketsLiberados.data): " + verificar_estructura_arr_ticketsLiberados.data);
                        
                        reserved_numbers = data_counting_numbers.reservados;
                        if (verificar_estructura_arr_ticketsLiberados.message == "liberado_noPagado") {
                            console.log("IF - reserved_numbers - if (verificar_estructura_arr_ticketsLiberados.message == 'liberado_noPagado'): " + verificar_estructura_arr_ticketsLiberados.message);
                            console.log("reserved_numbers: " + reserved_numbers);
                            reserved_numbers = parseInt(reserved_numbers) - parseInt(cantidad_numeros_apartados); // Se aumenta la cantidad de reservados
                            reserved_numbers = reserved_numbers.toString();
                            console.log("reserved_numbers_actualizado: " + reserved_numbers);
                        } 
                        if(verificar_estructura_arr_ticketsLiberados.message == "liberado_pagado") {
                            console.log("IF - reserved_numbers - if (verificar_estructura_arr_ticketsLiberados.message == 'liberado_pagado'): " + verificar_estructura_arr_ticketsLiberados.message);
                            console.log("reserved_numbers: " + reserved_numbers);
                        }
                        
                        paid_numbers = data_counting_numbers.pagados
                        if(verificar_estructura_arr_ticketsLiberados.message == "liberado_pagado") {
                            console.log("IF - paid_numbers - if (verificar_estructura_arr_ticketsLiberados.message == 'liberado_pagado'): " + verificar_estructura_arr_ticketsLiberados.message);
                            if (paid_numbers != "0" || paid_numbers != 0) {
                                console.log("IF - paid_numbers -  if (paid_numbers != '0' || paid_numbers != 0): ");
                                console.log("paid_numbers: " + paid_numbers);
                                paid_numbers = parseInt(paid_numbers) - parseInt(cantidad_numeros_apartados); // Se disminuye la cantidad de pagados
                                paid_numbers = paid_numbers.toString();
                                console.log("paid_numbers_actualizado: " + paid_numbers);
                            }else{
                                console.log("ELSE - paid_numbers -  if (paid_numbers != '0' || paid_numbers != 0): ");
                                console.log("paid_numbers: " + paid_numbers);
                            }
                        }
                        if(verificar_estructura_arr_ticketsLiberados.message == "liberado_noPagado") {
                            console.log("IF - paid_numbers - if (verificar_estructura_arr_ticketsLiberados.message == 'liberado_noPagado'): " + verificar_estructura_arr_ticketsLiberados.message);
                            console.log("paid_numbers: " + paid_numbers);
                        }

                        free_numbers = data_counting_numbers.libres;
                        if (verificar_estructura_arr_ticketsLiberados.message == "liberado_pagado" || verificar_estructura_arr_ticketsLiberados.message == "liberado_noPagado") {
                            console.log("IF - free_numbers - if (verificar_estructura_arr_ticketsLiberados.message == 'liberado_pagado') || if (verificar_estructura_arr_ticketsLiberados.message == 'liberado_noPagado'): " + verificar_estructura_arr_ticketsLiberados.message);
                            console.log("free_numbers: " + free_numbers);
                            free_numbers = parseInt(free_numbers) + parseInt(cantidad_numeros_apartados); // Se disminuye la cantidad de pagados
                            free_numbers = free_numbers.toString();
                            console.log("free_numbers_actualizado: " + free_numbers);
                        }else{
                            console.log("ELSE - free_numbers - if (verificar_estructura_arr_ticketsLiberados.message == 'liberado_pagado') || if (verificar_estructura_arr_ticketsLiberados.message == 'liberado_noPagado'): " + verificar_estructura_arr_ticketsLiberados.message);
                            console.log("free_numbers: " + free_numbers);
                        }
                        

                    }
                    if (!verificar_estructura_arr_ticketsPagados && !verificar_estructura_arr_ticketsPagoBorrado && !verificar_estructura_arr_ticketsLiberados.data) {
                        console.log("IF - if (!verificar_estructura_arr_ticketsPagados && !verificar_estructura_arr_ticketsPagoBorrado && !verificar_estructura_arr_ticketsLiberados.data): ");
                        console.log("verificar_estructura_arr_ticketsPagados: " + verificar_estructura_arr_ticketsPagados);
                        console.log("verificar_estructura_arr_ticketsPagoBorrado: " + verificar_estructura_arr_ticketsPagoBorrado);
                        console.log("verificar_estructura_arr_ticketsLiberados.data: " + verificar_estructura_arr_ticketsLiberados.data);
                        console.log("verificar_estructura_arr_ticketsLiberados.message: " + verificar_estructura_arr_ticketsLiberados.message);
                        reserved_numbers = data_counting_numbers.reservados;
                        reserved_numbers = parseInt(reserved_numbers) + parseInt(cantidad_numeros_apartados);
                        reserved_numbers = reserved_numbers.toString();
                        console.log("reserved_numbers: " + reserved_numbers);

                        free_numbers = data_counting_numbers.libres;
                        free_numbers = parseInt(free_numbers) - parseInt(cantidad_numeros_apartados);
                        free_numbers = free_numbers.toString();
                        console.log("free_numbers: " + free_numbers);

                        paid_numbers = data_counting_numbers.pagados;
                        console.log("paid_numbers: " + paid_numbers);
                    }

                    data_countingNumber_obj_actualizado = {
                        status: "success",
                        message: "Datos actualizados de: boletos_conteo",
                        received_array_tickets_NUMERO,
                        reserved_numbers,
                        paid_numbers,
                        free_numbers
                    }

                    Object.assign(data_countingNumber_obj, data_countingNumber_obj_actualizado); // Actualizar el objeto "data_countingNumber_obj" con la informacion del objeto "data_countingNumber_obj_actualizado"
        
                    console.log(" ---------------------------------------- ");
                    console.log("|  data_countingNumber_obj_actualizado:  |");
                    console.log(" ---------------------------------------- ");
                    //console.log(data_countingNumber_obj);
                    if (btn_accion == "PAGADO") {
                        console.log(" ------------------------------------------------------------------------------------------------------------------------------------------ ");
                        console.log("|  " + JSON.stringify(data_countingNumber_obj_actualizado) + "  |");
                        console.log(" ------------------------------------------------------------------------------------------------------------------------------------------ ");
                    }
                    if (btn_accion == "PAGO_BORRADO") {
                        console.log(" ----------------------------------------------------------------------------------------------------------------------------------------------- ");
                        console.log("|  " + JSON.stringify(data_countingNumber_obj_actualizado) + "  |");
                        console.log(" ----------------------------------------------------------------------------------------------------------------------------------------------- ");
                    }
                    if (btn_accion == "BOLETO_LIBERADO") {
                        console.log(" ----------------------------------------------------------------------------------------------------------------------------------------------- ");
                        console.log("|  " + JSON.stringify(data_countingNumber_obj_actualizado) + "  |");
                        console.log(" ----------------------------------------------------------------------------------------------------------------------------------------------- ");
                    }
                    if (btn_accion != "PAGADO" && btn_accion != "PAGO_BORRADO" && btn_accion != "BOLETO_LIBERADO") {
                        console.log(" ----------------------------------------------------------------------------------------------------------------------------------------------- ");
                        console.log("|  " + JSON.stringify(data_countingNumber_obj_actualizado) + "  |");
                        console.log(" ----------------------------------------------------------------------------------------------------------------------------------------------- ");
                    }
                    
                    if (reserved_numbers != "" && reserved_numbers != undefined && paid_numbers != "" && paid_numbers != undefined && free_numbers != "" && free_numbers != undefined) {
                        const query = `UPDATE boletos_conteo SET reservados = "${reserved_numbers}", pagados = "${paid_numbers}", libres = "${free_numbers}" WHERE id = 1`;
                        const [results] = await db.query(query); // Cambiado para usar await
        
                        console.log("results - UPDATE - TABLA - boletos_conteo:");
                        console.log(JSON.stringify(results));

                        data_countingNumber_obj = data_countingNumber_obj_actualizado;
        
                        log_activity = logActivity(req, 'API - "/api/numeros/actualizar_conteo_numeros" - CONTEO_NUMEROS_ACTUALIZADO: '+JSON.stringify(data_countingNumber_obj_actualizado)); // Registrar acción
                    } else {
                        console.log("HAY UN ERROR. ALGUNO DE LOS SIGUIENTES DATOS VIENE VACIO O ES 'undefined':");
                        console.log("reserved_numbers: " + reserved_numbers);
                        console.log("paid_numbers: " + paid_numbers);
                        console.log("free_numbers: " + free_numbers);
                    }
                }
                if (pagado_o_noPagado == 1) {
                    console.log("--------------------------------------------------------------------------------------- ");
                    console.log("----------------> ESTE BOLETO YA TIENE EL ESTADO EN 'PAGADO' o '1' <---------------- ");
                    console.log("--------------------------------------------------------------------------------------- ");
                }
                if (pagado_o_noPagado == 0) {
                    console.log("--------------------------------------------------------------------------------------- ");
                    console.log("----------------> ESTE BOLETO YA TIENE EL ESTADO EN 'NO PAGADO' o '0' <---------------- ");
                    console.log("--------------------------------------------------------------------------------------- ");
                }
                    
            }
            */
            

            //res.json(data_boletosConteo_obj);
            res.json(data_boletosConteo_actualizado_obj);
        } else {
            data_countingNumber_obj = {
                status: "Error",
                message: "El array 'received_array_tickets_NUMERO' está vacío",
                received_array_tickets_NUMERO,
                reserved_numbers: null,
                paid_numbers: null,
                free_numbers: null
            }
            res.status(400).json({ error: "Error interno del servidor", data: data_countingNumber_obj });
        }
            
    } catch (error) {
        console.error("Error general en la API:", error);
        const log_error = logError(req, 'Error en la API "/api/numeros/actualizar_conteo_numeros": ' + error.message); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        res.status(500).json({ error: "Error interno del servidor" });
        console.log("");
    }
};

function verificarEstructuraPagado(array) {
    const regex = /^\d+_pagado$/;
    return Array.isArray(array) && array.every(item => regex.test(item));
}

function verificarEstructuraPagoBorrado(array) {
    const regex = /^\d+_pagoBorrado$/;
    return Array.isArray(array) && array.every(item => regex.test(item));
}

function verificarEstructuraBoletoLiberado(array) {
    //const regex = /^\d+_boletoLiberado$/;
    const regex_pagado = /^\d+_boletoLiberado_pagado$/;
    const regex_noPagado = /^\d+_boletoLiberado_noPagado$/;
    const liberado_pagado = Array.isArray(array) && array.every(item => regex_pagado.test(item));
    const liberado_noPagado = Array.isArray(array) && array.every(item => regex_noPagado.test(item));
    if (liberado_pagado) {
        return { message: "liberado_pagado", data: liberado_pagado };
    }
    if (liberado_noPagado) {
        return { message: "liberado_noPagado", data: liberado_noPagado };
    }
    if(!liberado_pagado && !liberado_noPagado)
    {
        return { message: "No aplica", data: false };
    }
    
}

function verificar_estadoa_boleto_liberado(array) {
    let conteo_pagados = 0;
    let conteo_noPagados = 0;
    array.forEach(element => {
        if (element.split("_")[2] == "pagado") {
            conteo_pagados += 1;
        }
        if (element.split("_")[2] == "noPagado") {
            conteo_noPagados += 1;
        }
    });
    
    let conteo_pagado_o_noPagado_obj = {
        tickets_pagados: conteo_pagados,
        tickets_noPagados: conteo_noPagados,
    };


    return conteo_pagado_o_noPagado_obj;
    
}






module.exports = { getNumbersBD, getNumbersPagination, changeStatusNumber, getNumersRandom, 
                    searchNumber, changeStatusMultipleNumbers, getReservedNumbersBD, searchReservedTicket,
                    paidReservedNumbersBD, deletePaidReservedNumbersBD, deleteReservedNumbersBD, 
                    getCountingNumbersBD, updateCountingNumbersBD };