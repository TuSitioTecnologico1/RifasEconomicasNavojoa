// statesApi.js

const logError = require('../utils/log_error');
const db = require('../db'); // Suponiendo que la base de datos está configurada en db.js




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




let arr_states = [];  // Arreglo para almacenar los estados

// Ruta para obtener los estados desde la base de datos
const getStatesBD = async (req, res) => {
    try {
        await checkAndReconnect();

        const query = 'SELECT id, name FROM states'; // Suponiendo que tienes una tabla 'states'
        const [results] = await db.query(query); // Cambiado para usar await
        res.json(results);
        arr_states = results;
        /*db.query(query, (err, results) => {
            if (err) {
                console.error("Error en la consulta:", err);
                const log_error = logError(req, 'Error BD en la API "/api/obtener_estados": ' + err.message); // Registrar acción
                console.log("LOG ERROR:");
                console.log(log_error);
                return res.status(500).json({ error: "Error al obtener los estados" });
            }
            res.json(results);
            arr_states = results;
        });*/
    } catch (error) {
        console.error("Error general en la API:", error);
        const log_error = logError(req, 'Error en la API "/api/obtener_estados": ' + error.message); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        res.status(500).json({ error: "Error interno del servidor" });
        console.log("");
    }
};


// Ruta para obtener los estados almacenados en el arreglo
const getStatesARRAY = (req, res) => {
    try {
        res.json(arr_states);  // Enviar el arreglo con los estados
    } catch (error) {
        const log_error = logError(req, `Error en la API "/api/getStatesARRAY": ${error.message}`); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        res.status(500).json({ error: 'Error al obtener los estados desde el arreglo' });
        console.log("");
    }
};




module.exports = { getStatesBD, getStatesARRAY };




/*
const logError = require('../utils/log_error');
const db = require('../db');  // Conexión a la base de datos


let arr_states = []; // Arreglo que almacenará los estados (caché)

// Función para cargar los estados desde la base de datos
const loadStatesFromDB = (req, res) => {
    try {
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, name FROM states';
            db.query(query, (err, results) => {
                if (err) reject(err);
                arr_states = results;  // Llenar el arreglo con los resultados de la base de datos
                resolve(results);
            });
        });
    } catch (error) {
        const log_error = logError(req, 'Error en la API "/api/getStatesBD": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
    }
};

// Cargar los estados al iniciar la aplicación (en el momento de la carga del servidor)
loadStatesFromDB()
    .then(() => {
        console.log('Estados cargados exitosamente.');
    })
    .catch((err) => {
        //console.error('Error al cargar los estados:', err);
        const log_error = logError(req, 'Error en la API "/api/getStatesBD": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
    });



// Exportamos la función que devuelve los estados (con caché)
module.exports = function getStates() {
    return new Promise((resolve, reject) => {
        if (arr_states.length > 0) {
            resolve(arr_states);  // Si el arreglo ya tiene datos, devolvemos el caché
        } else {
            loadStatesFromDB()
                .then(resolve)
                .catch(reject);
        }
    });
};
*/