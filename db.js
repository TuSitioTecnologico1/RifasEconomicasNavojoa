// db.js


const mysql = require('mysql2/promise');
require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env

// Crear un pool de conexiones a la base de datos
const db = mysql.createPool({
    host: process.env.HOST,         // Host de la base de datos
    user: process.env.USER_BD,      // Usuario de la base de datos
    password: process.env.PASS,     // Contraseña de la base de datos
    database: process.env.DATABASE, // Nombre de la base de datos
    timezone: '-07:00',             // Zona horaria (si es necesario para tu caso)
    waitForConnections: true,       // Esperar si todas las conexiones están en uso
    connectionLimit: 10,            // Número máximo de conexiones en el pool
    queueLimit: 0,                  // Límite de cola (0 = sin límite)
});

// Verificar la conexión inicial
(async () => {
    try {
        const connection = await db.getConnection();
        console.log('Conexión a la base de datos exitosa');
        connection.release(); // Liberar la conexión de vuelta al pool
    } catch (err) {
        console.error('Error conectando a la base de datos:', err);
        process.exit(1); // Salir si hay error de conexión
    }
})();

module.exports = db; // Exportar el pool para usarlo en otros archivos





/*
const mysql = require('mysql2');
require('dotenv').config();  // Cargar las variables de entorno desde el archivo .env



// Crear la conexión a la base de datos utilizando las variables de entorno
const db = mysql.createConnection({
    host: process.env.HOST,       // Host de la base de datos
    user: process.env.USER_BD,    // Usuario de la base de datos
    password: process.env.PASS,   // Contraseña de la base de datos
    database: process.env.DATABASE, // Nombre de la base de datos
    timezone: '-07:00',           // Zona horaria (si es necesario para tu caso)
});

// Verificar la conexión
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        process.exit(1); // Salir si hay error de conexión
    } else {
        console.log('Conexión a la base de datos exitosa');
    }
});

/*
db.query('SELECT NOW() AS fecha_actual', (err, results) => {
    if (err) throw err;
    console.log('Fecha actual:', results[0].fecha_actual);
});
*



module.exports = db;  // Exportar la conexión para usarla en otros archivos
*/