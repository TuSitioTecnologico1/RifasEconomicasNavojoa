// userApi.js

const logActivity = require('../utils/log_activity_USANDO_ua_parser_js'); // Importar el módulo de logs para la ACTIVIDAD de la pagina
const logError = require('../utils/log_error'); // Importar el módulo de logs para los ERRORES de la pagina
const db = require('../db'); // Suponiendo que la base de datos está configurada en db.js
const UAParser = require('ua-parser-js');





// Ruta para recibir y guardar la info del formulario en la BD
const saveUserInfo = async (req, res) => {
    try {
        const { phone, name, lastname, option, geolocationData, folio } = req.body;

        let log_activity = logActivity(req, `Visita a la API "/api/submit".`);
        console.log("LOG ACTIVITY:", log_activity);

        let get_activityPage = page_activity(req);
        const ip = get_activityPage.ip;
        let browser = JSON.stringify(get_activityPage.browser);
        let device = JSON.stringify(get_activityPage.device);
        
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
            folio,
            ip,
            browser,
            device,
            latitude,
            longitude,
            accuracy,
        };

        console.log("dataPerson:");
        console.log(dataPerson);

        /*console.log(" ");
        console.log("process.env.DATABASE: ");
        console.log(process.env.DATABASE);
        console.log(" ");*/

        let existe_celular = 0;
        /*
        try {
            // Datos que quieres verificar
            let nombreBD = process.env.DATABASE; // Este se obtiene del .env ya que esta declarado en el archivo db.js que esta importado en este archivo arriba
            const tabla = 'users';
            const columna = 'phone';

            // Llamamos a la función y verificamos si existe la columna
            const existe = await columnaExiste(nombreBD, tabla, columna);
            
            if (existe) {
                //console.log(`✅ La columna "${columna}" SÍ existe en la tabla "${tabla}".`);
                logActivity(req, `La columna "${columna}" SI existe en la tabla "${tabla}".`);
                console.log("LOG ACTIVITY:", log_activity);
                // Consulta SQL optimizada que busca cualquier fila donde el campo phone coincida
                // SELECT 1 es una forma ligera de seleccionar sin traer datos innecesarios
                // LIMIT 1 detiene la búsqueda apenas encuentra la primera coincidencia
                const query = 'SELECT 1 FROM users WHERE phone = ? LIMIT 1';

                // Ejecuta la consulta en la base de datos usando el pool 'db'
                // El valor 'phone' reemplaza de forma segura el '?' para evitar inyección SQL
                const [rows] = await db.query(query, [phone]);

                // Verifica si encontró al menos una fila
                if (rows.length > 0) {
                    // Si existe al menos un registro con ese teléfono
                    //console.log("El teléfono ya está registrado");
                    logActivity(req, `El teléfono ya está registrado.`);
                    console.log("LOG ACTIVITY:", log_activity);
                    // Aquí puedes hacer otras acciones, como lanzar error, actualizar, etc.
                    // Por ejemplo:
                    // throw new Error('Teléfono duplicado');
                    
                    existe_celular = 1;
                    
                } else {
                    // Si no existe ningún registro con ese teléfono
                    console.log("El teléfono no existe en la base de datos");
                    // Aquí podrías continuar con el flujo normal, por ejemplo insertar el dato
                }
            } else {
                //console.log(`❌ La columna "${columna}" NO existe en la tabla "${tabla}".`);
                logActivity(req, `La columna "${columna}" NO existe en la tabla "${tabla}".`);
                console.log("LOG ACTIVITY:", log_activity);
            }
        } catch (error) {
            console.error("Error en la consulta nueva:", error);
        }
        */
        
        if (existe_celular == 1) {
            const data_person = {
                phone,
                name,
                lastname,
                option,
                folio,
            };
            
            res.status(409).json({
                status: "conflict",
                message: 'El numero de telefono ya esta registrado.',
                userData: data_person,
                
            });
        } else {
            // Insertar datos en la base de datos
            const query = 'INSERT INTO users (name, lastname, state, phone, folio, ip, browser, device, latitude, longitude, accuracy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const [result] = await db.query(query, [name, lastname, option, phone, folio, ip, browser, device, latitude, longitude, accuracy]);

            const insertedId = result.insertId;

            const insertedDataPerson = {
                userId: insertedId,
                phone,
                name,
                lastname,
                option,
                folio,
            };

            logActivity(req, `Visita a la API "/api/submit" - Información guardada: [ID: ${insertedId}, Nombre: ${name}, Apellidos: ${lastname}, Teléfono: ${phone}, Estado: ${option}, Folio: ${folio}, IP: ${ip}, Browser: ${browser}, Dispositivo: ${device}, Latitud: ${latitude}, Longitud: ${longitude}, Precisión: ${accuracy} metros.]`);
            console.log("LOG ACTIVITY:", log_activity);

            res.status(200).json({
                status: "success",
                message: 'Datos del usuario guardados correctamente.',
                userData: insertedDataPerson,
            });
            /*res.json({
                message: 'Datos del usuario guardados correctamente.',
                userData: insertedDataPerson,
            });*/
        }

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
        const { arr_reservedTickets_ID_and_NUMBER, arr_reservedTicketsNUMERO, userId, name, phone, option, folio } = req.body;
        
        const log_activity = logActivity(req, 'Visita a la API "/api/adquirir_boleto" - La persona ha apartado la cantidad de '+arr_reservedTickets_ID_and_NUMBER.length+' numero(s). Numeros: '+JSON.stringify(arr_reservedTicketsNUMERO)+''); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        
        // Insertar datos en la base de datos
        const query = 'INSERT INTO boletos_adquiridos (id_boleto, boleto, id_usuario, usuario, telefono, estado, folio) VALUES (?, ?, ?, ?, ?, ?, ?)';
        
        const values = arr_reservedTickets_ID_and_NUMBER.map(item => {
            const [id_boleto, boleto] = item.split("_");
            return [id_boleto, boleto, userId, name, phone, option, folio];
        });

        // Insertar todos los boletos adquiridos en una sola consulta
        await Promise.all(values.map(value => db.query(query, value)));
        
        const insertedData = {
            ticket_Id_Number: arr_reservedTickets_ID_and_NUMBER,
            userId,
            userName: name,
            userPhone: phone,
            select_state_option: option,
            folio,
        };

        const query_select_BOLETOS_CONTEO = "SELECT * FROM boletos_conteo";
        const [results_BOLETOS_CONTEO] = await db.query(query_select_BOLETOS_CONTEO); // Cambiado para usar await

        let update_reservados = 0;
        let update_libres = 0;
        let results_update_BOLETOS_CONTEO = [];
        if (results_BOLETOS_CONTEO.length > 0) {
            const conteo = results_BOLETOS_CONTEO[0]; // el primer (y único) resultado

            // El 10 en parseInt(valor, 10) se llama radix o base numérica, y le indica a la función que el número 
            // que estás convirtiendo está en base decimal (base 10), que es el sistema numérico común que usamos.
            update_reservados = parseInt(conteo.reservados, 10) + parseInt(arr_reservedTickets_ID_and_NUMBER.length, 10);
            update_libres = parseInt(conteo.libres, 10) - parseInt(arr_reservedTickets_ID_and_NUMBER.length, 10);

            // Actualiza el conteo de los boletos Reservados, Pagados y Libres
            let query_update_BOLETOS_CONTEO = "UPDATE boletos_conteo SET reservados = ?, libres = ? WHERE id = 1";
            results_update_BOLETOS_CONTEO = await db.query(query_update_BOLETOS_CONTEO, [update_reservados, update_libres]);
            logActivity(req, "La tabla 'boletos_conteo' ha sido actualizada.");
            logActivity(req, results_update_BOLETOS_CONTEO);
        }

        res.status(200).json({
            status: "success",
            message: "Números apartados con éxito.",
            data_server: insertedData,
            data_update_BOLETOS_CONTEO: results_update_BOLETOS_CONTEO,
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





// Ruta para recibir la info del usuario y los boletos que adquirio para guardarlos en la BD
const verifyPhoneUserInfo = async (req, res) => {
    try {
        //console.log("Haz entrado a: /api/adquirir_boleto");
        const { phone } = req.body;
        
        const log_activity = logActivity(req, 'Visita a la API "/api/verificar_telefono_usuario" - La persona ha ingresado el numero '+phone+'.'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);

        // Consulta SQL optimizada que busca cualquier fila donde el campo phone coincida
        // LIMIT 1 detiene la búsqueda apenas encuentra la primera coincidencia
        const query_select_USERS = 'SELECT id, name, lastname, state, phone, fecha_creacion, fecha_modificacion FROM users WHERE phone = ? LIMIT 1';

        // Ejecuta la consulta en la base de datos usando el pool 'db'
        // El valor 'phone' reemplaza de forma segura el '?' para evitar inyección SQL
        const [results_select_USERS] = await db.query(query_select_USERS, [phone]);

        let data_USERS = {};
        if (results_select_USERS.length > 0) {
            const user_data = results_select_USERS[0]; // el primer (y único) resultado
            data_USERS = {
                id: user_data.id,
                name: user_data.name,
                lastname: user_data.lastname,
                state: user_data.state,
                phone: user_data.phone,
                fecha_creacion: user_data.fecha_creacion,
                fecha_modificacion: user_data.fecha_modificacion,
            };

            res.status(409).json({
                status: "conflict",
                message: "El telefono ya existe.",
                data_user: data_USERS,
            });
        }else{
            res.status(200).json({
                status: "success",
                message: "El telefono NO existe",
                data_user: data_USERS,
            });
        }

    } catch (error) {
        console.error("Error general en la API:", error);
        const log_error = logError(req, `Error en la API "/api/verificar_telefono_usuario": ${error}`); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        res.status(500).json({ error: "Error interno del servidor" });
        console.log("");
    }
}





const chatbotInfo = async (req, res) => {
    try {
        const { userMsg } = req.body;

        if (typeof userMsg === 'string') {
            try {
                const posibleObjeto = JSON.parse(userMsg);
                if (typeof posibleObjeto === 'object' && posibleObjeto !== null && !Array.isArray(posibleObjeto)) {
                    console.log('Era un string, pero contenía un objeto JSON');
                    // Registrar el mensaje del usuario en los logs
                    let log_activity = logActivity(req, `Visita a la API "/api/chatbotInfo" - Mensaje del usuario: ${JSON.stringify(userMsg)}.`);
                    console.log("LOG ACTIVITY:");
                    console.log(log_activity);
                }
            } catch (err) {
                console.log('Es un string común, no JSON');
                // Registrar el mensaje del usuario en los logs
                let log_activity = logActivity(req, `Visita a la API "/api/chatbotInfo" - Mensaje del usuario: ${userMsg}.`);
                console.log("LOG ACTIVITY:");
                console.log(log_activity);
            }
            
        } else if (typeof userMsg === 'object') {
            console.log('Ya es un objeto');
            // Registrar el mensaje del usuario en los logs
            let log_activity = logActivity(req, `Visita a la API "/api/chatbotInfo" - Mensaje del usuario: ${JSON.stringify(userMsg)}.`);
            console.log("LOG ACTIVITY:");
            console.log(log_activity);
        }

        // Estructura base de respuesta del chatbot
        let reply = {
            type: "text", // Puede ser "text" o "buttons"
            content: "Lo siento, no entendí eso."
        };

        // --- RESPUESTAS PERSONALIZADAS ---
        // ✅ MENSAJE INICIAL (cuando se abre el asistente)
        if (userMsg == "hola") {
            reply = {
                type: "buttons",
                content: {
                    text: "¡Hola! 👋 ¿En qué puedo ayudarte hoy?",
                    action: 0,
                    options: [
                        { label: "¿Cómo comprar boletos?", value: "como comprar" },
                        { label: "Ver precios de los boletos", value: "precio" },
                        { label: "Metodos de pago", value: "metodos" }
                    ]
                }
            };
        } else if (userMsg.includes('precio')) {
            reply = {
                type: "text",
                content: "Los precios de los boletos se encuentra justo debajo de la imagen donde se muestra el premio, donde dice 'PRECIO DE LOS BOLETOS'."
            };
        } else if (userMsg.includes('compra')) {
            reply = {
                type: "text",
                content: `Tienes 3 formas para comprar boletos:<br><br>
                        &nbsp;&nbsp;1. Puedes elegir la cantidad de boletos que tú quieras de la cuadrícula que está al final de la página.<br>
                        &nbsp;&nbsp;2. Puedes buscar el número directamente en el apartado 'Buscar número'.<br>
                        &nbsp;&nbsp;3. Puedes usar la 'Maquinita de la Suerte' para generar boletos al azar.<br><br>
                        Cada boleto que selecciones se mostrará abajo, donde dice 'HAZ CLICK ABAJO EN TU NÚMERO DE LA SUERTE'.`
            };
        } else if (userMsg.includes('apartar')) {
            reply = {
                type: "text",
                content: "Cuando termines de elegir tus boletos, haz clic en el botón 'APARTAR'. Se mostrará un formulario donde deberás ingresar tu nombre, apellido, teléfono y estado. Luego, se abrirá un chat de WhatsApp con los datos de tu compra, donde deberás enviar tu comprobante de pago."
            };
        } else if (userMsg.includes('metodos') || userMsg.includes('pagar') || userMsg.includes('pago')) {
            reply = {
                type: "text",
                content: "Para saber como enviar tu pago, puedes ir a la seccion <a href='/metodos-pago' target='_blank'><strong>Métodos de Pago</strong></a>, en la cual estarán las cuentas a donde puedes transferir o depositar el pago de tus boletos."
            };
        } else if (userMsg.includes('ayuda')) {
            reply = {
                type: "buttons",
                content: {
                    text: "Claro, estoy aquí para ayudarte. ¿Qué necesitas?",
                    action: 1,
                    options: [
                        { label: "¿Cómo comprar?", value: "comprar" },
                        { label: "Ver precios de los boletos", value: "precios" },
                        { label: "Metodos de pago", value: "metodos" }
                    ]
                }
            };
        }

        // Registrar la respuesta del chatbot en los logs
        log_activity = logActivity(req, `Respuesta del CHATBOT: ${JSON.stringify(reply)}.`);
        console.log("LOG ACTIVITY:");
        console.log(log_activity);

        // Enviar respuesta JSON al cliente
        res.status(200).json(reply);

    } catch (error) {
        console.error("Error general en la API:", error);

        // Registrar error en logs
        const log_error = logError(req, `Error en la API "/api/chatbotInfo": ${error}`);
        console.log("LOG ERROR:");
        console.log(log_error);

        // Aquí decides si es error de disponibilidad
        if (error.message && error.message.toLowerCase().includes("disponible") ) {
            // Error 503: servicio no disponible temporalmente
            await logError(req, `Error 503 en la API "/api/chatbotInfo": ${error}`);
            return res.status(503).json({ type: "error", content: "Servicio no disponible, intenta más tarde." });
        }

        // Enviar respuesta de error
        res.status(500).json({ type: "error", content: "Error interno del servidor" });
    }
}





// Ruta para obtener configuraciones de la pagina desde la base de datos
const getConfigPageBD = async (req, res) => {
    try {
        const query = 'SELECT id, clave, valor, descripcion, activa FROM configuracion_pagina';
        const [results] = await db.query(query); // Cambiado para usar await
        
        // Enviar respuesta JSON al cliente
        res.status(200).json(results);
    } catch (error) {
        console.error("Error general en la API - /api/obtener_configuracionPagina:", error);
        const log_error = logError(req, 'Error en la API "/api/obtener_configuracionPagina": ' + error.message); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        res.status(500).json({ error: "Error interno del servidor" });
        console.log("");
    }

}





// Función auxiliar para insertar boletos en bloques grandes
async function insertarBoletos(connection, cantidad, idRifa) {
    const CHUNK_SIZE = 10000; // Máximo de registros por bloque
    let desde = 0;

    while (desde < cantidad) {
        const values = [];
        const placeholders = [];

        // Generar valores para este bloque
        for (let i = desde; i < Math.min(desde + CHUNK_SIZE, cantidad); i++) {
            const numero = i.toString().padStart(5, "0"); // Formato 00001, 00002...
            values.push(numero, idRifa);
            placeholders.push("(?, ?)");
        }

        // Ejecutar el insert por bloques
        await connection.query(
            `INSERT INTO boletos (numero, id_sorteo) VALUES ${placeholders.join(", ")}`,
            values
        );

        desde += CHUNK_SIZE;
    }

    console.log(`✅ ${cantidad} boletos insertados para la rifa con ID ${idRifa}`);
}


// Ruta para guardar los datos del sorteo
// Controlador para crear un sorteo
const createLottery = async (req, res) => {
    // 🔁 Obtener una conexión del pool de base de datos (usando mysql2/promise)
    const connection = await db.getConnection();

    try {

        // 🔁 Validar que datosRifa existe
        if (!req.body.datosRifa) {
            return res.status(400).json({ error: "No se recibió datosRifa en el cuerpo del formulario." });
        }

        // 🔄 Paso 1: Parsear los datos del formulario que vienen como string en el campo "datosRifa"
        const datos = JSON.parse(req.body.datosRifa);

        // 🔄 Extraer las diferentes secciones del JSON
        const { infoRifa, preSorteo, lugaresExtras, bonos } = datos;

        // 📦 Obtener los archivos subidos desde Multer
        const imagenes = req.files;

        // 📝 Registrar actividad del usuario (opcional, útil para auditoría)
        await logActivity(req, 'Visita a la API "/api/crear_sorteo"');

        // 🔐 Iniciar una transacción para garantizar consistencia en caso de error
        await connection.beginTransaction();

        // 🧩 Insertar el sorteo en la base de datos
        const [result] = await connection.execute(`
            INSERT INTO sorteos (
                titulo_sorteo, edicion, emisiones, oportunidades,
                cantidad_boletos, fecha_sorteo, activo,
                presorteo, fecha_presorteo, lugares, bonos
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            infoRifa.titulo,                      // Título del sorteo
            infoRifa.edicion,                     // Edición del sorteo
            infoRifa.emisiones,                   // Número de emisiones
            infoRifa.oportunidades,               // Número de oportunidades por boleto
            infoRifa.cantidad_boletos,            // Cantidad total de boletos
            infoRifa.fecha,                       // Fecha del sorteo
            1,                                    // Estado activo por defecto
            preSorteo.presorteo,                  // Si hay presorteo
            preSorteo.fecha_presorteo,            // Fecha del presorteo
            JSON.stringify(lugaresExtras),        // Lugares extra como JSON
            JSON.stringify(bonos)                 // Bonos como JSON
        ]);

        // 💾 Guardar el ID del sorteo recién insertado
        const id = result.insertId;

        // 🌐 Generar URLs específicas para esta edición del sorteo
        const ruta_lista = `/lista/r-${id}`;
        const ruta_verificador = `/verificador/r-${id}`;
        const ruta_buscar = `/buscar_mismos_numeros/r-${id}`;

        // 🔄 Actualizar el registro del sorteo con las URLs generadas
        await connection.execute(`
            UPDATE sorteos
            SET url_listaBoletos = ?, url_verificadorBoletos = ?, url_buscarMismosBoletos = ?
            WHERE id = ?
        `, [ruta_lista, ruta_verificador, ruta_buscar, id]);

        // 🧩 Función auxiliar para insertar cada ruta en la tabla "rutas"
        const insertarRuta = async (nombre, path) => {
            await connection.execute(
                'INSERT INTO rutas (nombre, path, tipo, clave) VALUES (?, ?, ?, ?)',
                [nombre, path, "WEB", "NO_APLICA"]
            );
        };

        // 🌐 Insertar las rutas generadas en la tabla "rutas"
        await insertarRuta(`Lista de Boletos - Edición #${id}`, ruta_lista);
        await insertarRuta(`Verificador de Boletos - Edición #${id}`, ruta_verificador);
        await insertarRuta(`Buscar Mismos Números - Edición #${id}`, ruta_buscar);

        // 🎟️ Insertar los boletos numerados relacionados con este sorteo
        await insertarBoletos(connection, infoRifa.cantidad_boletos, id);

        // 📊 Insertar conteo inicial de boletos (todos disponibles al inicio)
        await connection.query(`
            INSERT INTO boletos_conteo (reservados, pagados, libres, id_sorteo)
            VALUES (?, ?, ?, ?)
        `, [
            '0',                           // Reservados
            '0',                           // Pagados
            infoRifa.cantidad_boletos.toString(), // Libres
            id.toString()                  // ID del sorteo
        ]);

        // 🖼️ Insertar cada imagen subida en la tabla "imagenes"
        const sqlImg = `
            INSERT INTO imagenes (id_relacionado, tipo_relacion, ruta)
            VALUES (?, 'sorteo', ?)
        `;

        for (let img of imagenes) {
            const ruta = '/uploads/' + img.filename; // Ruta accesible desde frontend
            await connection.execute(sqlImg, [id, ruta]);
        }

        // ✅ Si todo salió bien, confirmar transacción
        await connection.commit();

        // 📤 Enviar respuesta al cliente con datos útiles
        res.status(200).json({
            status: "success",
            message: "Sorteo guardado exitosamente",
            insertId: id,
            ruta_lista_sorteo_creado: ruta_lista,
            ruta_verificador_sorteo_creado: ruta_verificador,
            ruta_buscarMismosNumeros_sorteo_creado: ruta_buscar
        });

    } catch (error) {
        // ❌ Si ocurre un error, revertir todos los cambios
        await connection.rollback();

        // 🐞 Mostrar el error en consola
        console.error("Error general en la API:", error);

        // 📝 Registrar el error en logs
        await logError(req, `Error en la API "/api/crear_sorteo": ${error}`);

        // ❗ Enviar error al cliente
        res.status(500).json({ error: "Error al crear el sorteo" });
    } finally {
        // 🔚 Liberar la conexión al pool de MySQL
        connection.release();
    }
};

/*
const createLottery = async (req, res) => {
    const connection = await db.getConnection(); // Obtener conexión del pool

    try {
        // Desestructurar el cuerpo de la petición
        const { infoRifa, preSorteo, lugaresExtras, bonos } = req.body;

        // Registrar actividad
        await logActivity(req, 'Visita a la API "/api/crear_sorteo"');

        // Iniciar transacción
        await connection.beginTransaction();

        console.log("infoRifa.cantidad_boletos: ", infoRifa.cantidad_boletos);

        // 1. Insertar el sorteo
        const [result] = await connection.execute(`
            INSERT INTO sorteos (
                titulo_sorteo, edicion, emisiones, oportunidades,
                cantidad_boletos, fecha_sorteo, activo,
                presorteo, fecha_presorteo, lugares, bonos
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            infoRifa.titulo,
            infoRifa.edicion,
            infoRifa.emisiones,
            infoRifa.oportunidades,
            infoRifa.cantidad_boletos,
            infoRifa.fecha,
            1, // Siempre inicia como activo
            preSorteo.presorteo,
            preSorteo.fecha_presorteo,
            JSON.stringify(lugaresExtras), // Convertimos a JSON
            JSON.stringify(bonos)
        ]);

        const id = result.insertId; // ID autogenerado del sorteo
        console.log("id: ", id);

        // 2. Crear las URLs dinámicas
        const ruta_lista = `/lista/r-${id}`;
        const ruta_verificador = `/verificador/r-${id}`;
        const ruta_buscar = `/buscar_mismos_numeros/r-${id}`;

        // 3. Actualizar sorteo con las URLs
        await connection.execute(`
            UPDATE sorteos
            SET url_listaBoletos = ?, url_verificadorBoletos = ?, url_buscarMismosBoletos = ?
            WHERE id = ?
        `, [ruta_lista, ruta_verificador, ruta_buscar, id]);

        // 4. Registrar las rutas en la tabla "rutas"
        const insertarRuta = async (nombre, path) => {
            await connection.execute(
                'INSERT INTO rutas (nombre, path, tipo, clave) VALUES (?, ?, ?, ?)',
                [nombre, path, "WEB", "NO_APLICA"]
            );
        };

        await insertarRuta(`Lista de Boletos - Edición #${id}`, ruta_lista);
        await insertarRuta(`Verificador de Boletos - Edición #${id}`, ruta_verificador);
        await insertarRuta(`Buscar Mismos Números - Edición #${id}`, ruta_buscar);
        
        // 5. Insertar los boletos asociados al sorteo
        await insertarBoletos(connection, infoRifa.cantidad_boletos, id);

        // 6. Insertar los valores iniciales en la tabla boletos_conteo
        await connection.query(`
            INSERT INTO boletos_conteo (reservados, pagados, libres, id_sorteo)
            VALUES (?, ?, ?, ?)
        `, [
            '0', // Inicialmente no hay boletos reservados
            '0', // Ni pagados
            infoRifa.cantidad_boletos.toString(), // Todos están libres
            id.toString()
        ]);

        // 7. Confirmar transacción
        await connection.commit();

        // 8. Enviar respuesta al cliente
        res.status(200).json({
            status: "success",
            message: "Sorteo guardado exitosamente",
            insertId: id,
            ruta_lista_sorteo_creado: ruta_lista,
            ruta_verificador_sorteo_creado: ruta_verificador,
            ruta_buscarMismosNumeros_sorteo_creado: ruta_buscar
        });

    } catch (error) {
        await connection.rollback(); // Si algo falla, revertir
        console.error("Error general en la API:", error);
        await logError(req, `Error en la API "/api/crear_sorteo": ${error}`); // Registrar error
        res.status(500).json({ error: "Error al crear el sorteo" });
    } finally {
        connection.release(); // Liberar la conexión al pool
    }
};
*/
/*
const insertarRuta = async (connection, nombre, path) => {
    const [res] = await connection.query(
        'INSERT INTO rutas (nombre, path, tipo, clave) VALUES (?, ?, ?, ?)',
        [nombre, path, "WEB", "NO_APLICA"]
    );
    console.log("Nombre ruta creada:", nombre);
    console.log("Ruta creada:", path);
    console.log("");
    return res.insertId;
};
*/





// Obtener todos los sorteos
// Controlador para obtener todos los sorteos junto con su imagen destacada
const getLottery = async (req, res) => {
    try {
        // 📝 Registrar actividad del usuario que accede a esta API (opcional pero útil)
        const log_activity = logActivity(req, 'Visita a la API - /api/getLottery');
        console.log("LOG ACTIVITY:", log_activity);

        // 📦 Consulta SQL que trae todos los campos del sorteo
        // e incluye una subconsulta para obtener la PRIMERA imagen asociada al sorteo
        const query = `
            SELECT 
                s.id,                             -- ID del sorteo
                s.titulo_sorteo,                  -- Título del sorteo
                s.edicion,                        -- Edición (ej. 1, 2, 3...)
                s.emisiones,                      -- Número de emisiones
                s.oportunidades,                  -- Oportunidades por boleto
                s.cantidad_boletos,               -- Total de boletos
                s.fecha_sorteo,                   -- Fecha oficial del sorteo
                s.activo,                         -- Estado (1 = activo, 0 = inactivo)
                s.presorteo,                      -- Detalle si hay presorteo
                s.fecha_presorteo,                -- Fecha del presorteo si aplica
                s.lugares,                        -- Información de premios para más lugares (JSON)
                s.bonos,                          -- Bonos personalizados (JSON)
                s.avisos,                         -- Mensajes o avisos extras
                s.url_listaBoletos,               -- Ruta para ver la lista de boletos
                s.url_verificadorBoletos,         -- Ruta para verificar boletos
                s.url_buscarMismosBoletos,        -- Ruta para buscar boletos repetidos

                -- 📸 Subconsulta para traer la PRIMERA imagen asociada como "imagen_destacada"
                (
                    SELECT ruta 
                    FROM imagenes 
                    WHERE tipo_relacion = 'sorteo' AND id_relacionado = s.id 
                    ORDER BY id ASC 
                    LIMIT 1
                ) AS imagen_destacada
            FROM sorteos s
        `;

        // 📡 Ejecutar la consulta en la base de datos
        const [results] = await db.query(query);

        // ✅ Si no hay sorteos, responder con un array vacío
        if (results.length === 0) {
            return res.status(200).json({
                status: "success",
                message: "No hay sorteos disponibles",
                data: [],
            });
        }

        // ✅ Si se encontraron sorteos, responder con ellos
        res.status(200).json({
            status: "success",
            message: "Se han obtenido todos los sorteos exitosamente",
            data: results,
        });

    } catch (error) {
        // ❌ Si ocurre algún error en la API, lo mostramos en consola y registramos
        console.error("Error general en la API:", error);

        const log_error = logError(req, 'Error en la API "/api/getLottery": ' + error.message);
        console.log("LOG ERROR:", log_error);

        // ❗ Enviar error 500 al cliente
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

/*
const getLottery = async (req, res) => {
    try {
        const log_activity = logActivity(req, 'Visita a la API - /api/getLottery');
        console.log("LOG ACTIVITY:", log_activity);

        const query = `
            SELECT 
                id, titulo_sorteo, edicion, emisiones, oportunidades, cantidad_boletos,
                fecha_sorteo, activo, presorteo, fecha_presorteo, lugares, bonos, avisos,
                url_listaBoletos, url_verificadorBoletos, url_buscarMismosBoletos
            FROM sorteos
        `;

        const [results] = await db.query(query);

        if (results.length === 0) {
            return res.status(200).json({
                status: "success",
                message: "No hay sorteos disponibles",
                data: [],
            });
        }

        res.status(200).json({
            status: "success",
            message: "Se han obtenido todos los sorteos exitosamente",
            data: results,
        });

    } catch (error) {
        console.error("Error general en la API:", error);
        const log_error = logError(req, 'Error en la API "/api/getLottery": ' + error.message);
        console.log("LOG ERROR:", log_error);
        res.status(500).json({ error: "Error interno del servidor" });
        console.log("");
    }
};
*/






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





// Creamos una función reutilizable para verificar si una columna existe
async function columnaExiste(baseDeDatos, tabla, columna) {
    // Consulta SQL que busca columnas específicas en el esquema de la base de datos
    const query = `
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = ?     -- nombre de la base de datos
      AND TABLE_NAME = ?       -- nombre de la tabla
      AND COLUMN_NAME = ?      -- nombre de la columna a buscar
  `;

    // Ejecutamos la consulta pasando los valores como parámetros para evitar inyección SQL
    const [result] = await db.query(query, [baseDeDatos, tabla, columna]);

    // Si el resultado contiene al menos una fila, significa que la columna existe
    return result.length > 0;
}





module.exports = { saveUserInfo, savePurchasedTicketsUser, verifyPhoneUserInfo, chatbotInfo, getConfigPageBD,
                    createLottery, getLottery
                };