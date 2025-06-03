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

        // Validar que es un array
        if (!Array.isArray(receivedArray) || receivedArray.length === 0) {
            return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un array no vacío." });
        }

        // Crear la lista de marcadores de posición (?, ?, ?) basada en la longitud del array
        const placeholders = receivedArray.map(() => "?").join(", ");
        const query = `UPDATE numeros SET disponible = 0 WHERE id IN (${placeholders})`;

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

        // Aquí llamas la función async "select_boletos_conteo_tbl_BD(req)" y esperas su resultado
        const query_select_BOLETOS_CONTEO = await select_boletos_conteo_tbl_BD(req);

        let update_reservados = 0;
        let update_pagados = 0;
        let results_update_BOLETOS_CONTEO = "";
        if (query_select_BOLETOS_CONTEO.length > 0) {
            const conteo = query_select_BOLETOS_CONTEO[0]; // el primer (y único) resultado

            // El 10 en parseInt(valor, 10) se llama radix o base numérica, y le indica a la función que el número 
            // que estás convirtiendo está en base decimal (base 10), que es el sistema numérico común que usamos.
            update_reservados = parseInt(conteo.reservados, 10) - parseInt(received_array_ticketsPagados_NUMERO.length, 10);
            update_pagados = parseInt(conteo.pagados, 10) + parseInt(received_array_ticketsPagados_NUMERO.length, 10);

            let query_update_BOLETOS_CONTEO = "UPDATE boletos_conteo SET reservados = ?, pagados = ? WHERE id = 1";
            results_update_BOLETOS_CONTEO = await db.query(query_update_BOLETOS_CONTEO, [update_reservados, update_pagados]);
        }

        res.status(200).json({
            status: "success",
            message: "Números pagados con éxito.",
            received_array_ticketsPagados_ID,
            received_array_ticketsPagados_NUMERO,
            reservados: update_reservados,
            pagados: update_pagados,
            results_update_BOLETOS_CONTEO,
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

        // Aquí llamas la función async "select_boletos_conteo_tbl_BD(req)" y esperas su resultado
        const query_select_BOLETOS_CONTEO = await select_boletos_conteo_tbl_BD(req);

        let update_reservados = 0;
        let update_pagados = 0;
        let results_update_BOLETOS_CONTEO = "";
        if (query_select_BOLETOS_CONTEO.length > 0) {
            const conteo = query_select_BOLETOS_CONTEO[0]; // el primer (y único) resultado

            // El 10 en parseInt(valor, 10) se llama radix o base numérica, y le indica a la función que el número 
            // que estás convirtiendo está en base decimal (base 10), que es el sistema numérico común que usamos.
            update_reservados = parseInt(conteo.reservados, 10) + parseInt(received_arr_eliminar_pago_boletos_NUMERO.length, 10);
            update_pagados = parseInt(conteo.pagados, 10) - parseInt(received_arr_eliminar_pago_boletos_NUMERO.length, 10);

            let query_update_BOLETOS_CONTEO = "UPDATE boletos_conteo SET reservados = ?, pagados = ? WHERE id = 1";
            results_update_BOLETOS_CONTEO = await db.query(query_update_BOLETOS_CONTEO, [update_reservados, update_pagados]);
        }

        res.status(200).json({
            status: "success",
            message: "Se ha borrado el pago de los numeros seleccionados con éxito.",
            received_arr_eliminar_pago_boletos_ID,
            received_arr_eliminar_pago_boletos_NUMERO,
            reservados: update_reservados,
            pagados: update_pagados,
            results_update_BOLETOS_CONTEO,
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
        const { received_arr_eliminar_boletos_ID, received_arr_eliminar_boletos_NUMERO, arr_boletos_pagados, arr_boletos_no_pagados } = req.body;
        //console.log("received_arr_eliminar_boletos_ID:");
        //console.log(received_arr_eliminar_boletos_ID);
        //console.log("received_arr_eliminar_boletos_NUMERO:");
        //console.log(received_arr_eliminar_boletos_NUMERO);

        const log_activity = logActivity(req, 'Visita a la API "/api/numeros/eliminar_numeros_apartados" - Se le eliminara el apartado a la cantidad de '+received_arr_eliminar_boletos_NUMERO.length+' numero(s). Numeros: '+JSON.stringify(received_arr_eliminar_boletos_NUMERO)+''); // Registrar acción
        logActivity(req, "Cantidad de boletos en estado de PAGADO: " + arr_boletos_pagados.length);
        logActivity(req, "Cantidad de boletos en estado de NO PAGADO: " + arr_boletos_no_pagados.length);
        console.log("LOG ACTIVITY:");
        console.log(log_activity);

        // Validar que es un array
        if (!Array.isArray(received_arr_eliminar_boletos_ID) || received_arr_eliminar_boletos_ID.length === 0) {
            return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un array no vacío." });
        }

        // Crear la lista de marcadores de posición (?, ?, ?) basada en la longitud del array
        const placeholders = received_arr_eliminar_boletos_ID.map(() => "?").join(", ");
        const query = `DELETE FROM boletos_adquiridos WHERE id_boleto IN (${placeholders})`;

        // Ejecutar la consulta con los valores del array
        await db.query(query, received_arr_eliminar_boletos_ID);

        // Aquí llamas la función async "select_boletos_conteo_tbl_BD(req)" y esperas su resultado
        const query_select_BOLETOS_CONTEO = await select_boletos_conteo_tbl_BD(req);

        let update_reservados = 0;
        let update_pagados = 0;
        let update_libres = 0;
        let results_update_BOLETOS_CONTEO = "";
        let query_select_BOLETOS_CONTEO_2 = [];
        if (query_select_BOLETOS_CONTEO.length > 0) {
            const conteo = query_select_BOLETOS_CONTEO[0]; // el primer (y único) resultado

            if (parseInt(conteo.libres, 10) < 100000) {
                console.log("BIEN: Los boletos que estan libres son menores a 100000.");
                // El 10 en parseInt(valor, 10) se llama radix o base numérica, y le indica a la función que el número 
                // que estás convirtiendo está en base decimal (base 10), que es el sistema numérico común que usamos.
                update_reservados = parseInt(conteo.reservados, 10) - parseInt(arr_boletos_no_pagados.length, 10);
                update_pagados = parseInt(conteo.pagados, 10) - parseInt(arr_boletos_pagados.length, 10);
                update_libres = parseInt(conteo.libres, 10) + parseInt(received_arr_eliminar_boletos_NUMERO.length, 10);

                // Actualiza el conteo de los boletos Reservados, Pagados y Libres
                let query_update_BOLETOS_CONTEO = "UPDATE boletos_conteo SET reservados = ?, pagados = ?, libres = ? WHERE id = 1";
                results_update_BOLETOS_CONTEO = await db.query(query_update_BOLETOS_CONTEO, [update_reservados, update_pagados, update_libres]);

                if (results_update_BOLETOS_CONTEO.affectedRows > 0 && results_update_BOLETOS_CONTEO.changedRows > 0) {
                    //console.log("Se aplicaron los cambios.");
                    logActivity(req, "Se aplicaron los cambios en la tabla 'boletos_conteo'.");
                    logActivity(req, "affectedRows: " + results_update_BOLETOS_CONTEO.affectedRows);
                    logActivity(req, "changedRows: " + results_update_BOLETOS_CONTEO.changedRows);

                    // Aquí llamas la función async "select_boletos_conteo_tbl_BD(req)" y esperas su resultado, que sera un arreglo de objetos [{id:1, reservados:10, ... etc.}]
                    query_select_BOLETOS_CONTEO_2 = await select_boletos_conteo_tbl_BD(req);
                    
                } else if (results_update_BOLETOS_CONTEO.affectedRows > 0 && results_update_BOLETOS_CONTEO.changedRows === 0) {
                    //console.log("La fila existía, pero los valores eran iguales. No se modificó nada.");
                    logActivity(req, "La fila existía, pero los valores eran iguales. No se modificó nada.");
                } else {
                    //console.log("No se encontró la fila o no se modificó nada.");
                    logActivity(req, "No se encontró la fila o no se modificó nada.");
                }
            }else{
                console.log("ALTO: Los boletos que estan libres son igual o mayor a 100000.");
            }
        }

        // Crear la lista de marcadores de posición (?, ?, ?) basada en la longitud del array
        const placeholders_NUMEROS = received_arr_eliminar_boletos_ID.map(() => "?").join(", ");
        const query_update_NUMEROS = `UPDATE numeros SET disponible = 1 WHERE id IN (${placeholders_NUMEROS})`;

        // Ejecutar la consulta con los valores del array
        const [results_update_NUMEROS] = await db.query(query_update_NUMEROS, received_arr_eliminar_boletos_ID);

        // Comprueba si la consulta se realizo con exito, si se efectuaron los cambios
        if (results_update_NUMEROS.affectedRows > 0 && results_update_NUMEROS.changedRows > 0) {
            //console.log("Se aplicaron los cambios.");
            logActivity(req, "Se aplicaron los cambios en la tabla 'numeros'.");
            logActivity(req, "affectedRows: " + results_update_NUMEROS.affectedRows);
            logActivity(req, "changedRows: " + results_update_NUMEROS.changedRows);
        } else if (results_update_NUMEROS.affectedRows > 0 && results_update_NUMEROS.changedRows === 0) {
            //console.log("La fila existía, pero los valores eran iguales. No se modificó nada.");
            logActivity(req, "La fila existía, pero los valores eran iguales. No se modificó nada.");
        } else {
            //console.log("No se encontró la fila o no se modificó nada.");
            logActivity(req, "No se encontró la fila o no se modificó nada.");
        }

        res.status(200).json({
            status: "success",
            message: "Se ha borrado el pago de los numeros seleccionados con éxito.",
            received_arr_eliminar_boletos_ID,
            received_arr_eliminar_boletos_NUMERO,
            conteo_boletos: query_select_BOLETOS_CONTEO_2,
            numeros: results_update_NUMEROS,
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

// Obtener conteo de numeros Reservados, Pagados y Libres
const countNumbersBD = async(req, res) => {
    try {
        await checkAndReconnect();

        const log_activity = logActivity(req, 'Visita a la API - /api/conteo_numeros'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);

        // Aquí llamas la función async "select_boletos_conteo_tbl_BD(req)" y esperas su resultado
        const query_select_BOLETOS_CONTEO = await select_boletos_conteo_tbl_BD(req);

        if (query_select_BOLETOS_CONTEO.length > 0) {
            const conteo = query_select_BOLETOS_CONTEO[0]; // el primer (y único) resultado
            res.status(200).json({
                status: "Success",
                message: "Conteo de boletos obtenido.",
                reservados: conteo.reservados,
                pagados: conteo.pagados,
                libres: conteo.libres,
                id_sorteo: conteo.id_sorteo,
                fecha_creacion: conteo.fecha_creacion,
                fecha_actualizacion: conteo.fecha_actualizacion
            });
        } else {
            res.status(404).json({
                status: "Fail",
                message: "No se encontró información de conteo."
            });
        }

    } catch (error) {
        console.error("Error general en la API:", error);
        const log_error = logError(req, 'Error en la API "/api/obtener_conteo_numeros": ' + error.message); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        res.status(500).json({ error: "Error interno del servidor" });
        console.log("");
    }
}




async function select_boletos_conteo_tbl_BD(req) {
    try {
        await checkAndReconnect();

        const log_activity = logActivity(req, 'Visita a la FUNCION - select_boletos_conteo_tbl_BD(req)'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);

        const query = "SELECT * FROM boletos_conteo";
        const [results] = await db.query(query); // Cambiado para usar await
        //res.json(results);

        arr_conteo_numeros = results;

        return results;

    } catch (error) {
        console.error("Error general en la FUNCION:", error);
        const log_error = logError(req, 'Error en la FUNCION "select_boletos_conteo_tbl_BD(req)": ' + error.message); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        return log_error;
    }
}




// Actualizar conteo de numeros Reservados, Pagados y Libres
async function updateContNumbersBD(req, cantidad, accion) {
    try {
        await checkAndReconnect();

        const log_activity = logActivity(req, 'Visita a la API - /api/updateContNumbersBD'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        
        const query = "UPDATE boletos_conteo SET reservados = '0', pagados = '0', libres = '100000' WHERE id = 1";
        const [results] = await db.query(query); // Cambiado para usar await
        //res.json(results);
        
        arr_conteo_numeros = results;

        return arr_conteo_numeros;

    } catch (error) {
        console.error("Error general en la API:", error);
        const log_error = logError(req, 'Error en la API "/api/actualizar_conteo_numeros": ' + error.message); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        return log_error;
    }
}


module.exports = { getNumbersBD, getNumbersPagination, changeStatusNumber, getNumersRandom, 
                    searchNumber, changeStatusMultipleNumbers, getReservedNumbersBD, searchReservedTicket,
                    paidReservedNumbersBD, deletePaidReservedNumbersBD, deleteReservedNumbersBD, countNumbersBD};