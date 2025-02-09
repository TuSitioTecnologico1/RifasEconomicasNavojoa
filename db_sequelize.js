// db.js


const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env



// ✅ Configuración con mysql2 (para código antiguo)
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME, // Asegurar que coincida con Sequelize
    timezone: '-07:00',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Verificar conexión inicial de mysql2
(async () => {
    try {
        await db.query('SELECT 1'); // Verifica conexión sin obtener y liberar manualmente
        console.log('🟢 Conexión a MySQL (mysql2) exitosa');
    } catch (err) {
        console.error('🔴 Error conectando a MySQL (mysql2):', err);
        process.exit(1); // Salir si hay error de conexión
    }
})();


// ✅ Configuración con Sequelize (para nuevo código)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false // Desactiva el log de las consultas SQL en la consola
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('🟢 Conexión a MySQL (Sequelize) establecida');
    } catch (error) {
        console.error('🔴 Error conectando a MySQL (Sequelize):', error);
        process.exit(1); // Opcional: salir si Sequelize falla
    }
})();



// Exportar ambas conexiones
module.exports = { db, sequelize };