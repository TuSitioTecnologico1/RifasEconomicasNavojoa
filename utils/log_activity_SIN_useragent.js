// Enfoque alternativo sin usar useragent
// Podemos obtener la información del agente de usuario directamente desde el encabezado User-Agent, 
// que es lo que useragent usa internamente, pero sin la necesidad de usar el paquete useragent
// En este caso, extraemos información del agente de usuario (user-agent) directamente sin necesidad de usar el paquete useragent.

const fs = require('fs');
const path = require('path');

// Ruta del archivo de logs
const logFilePath = path.join(__dirname, '../logs', 'logs.txt');

// Función para registrar actividad
function logActivity(req, action) {
    const timestamp = new Date().toISOString();
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';
    const userAgent = req.headers['user-agent']; // Información del navegador y SO directamente
    const os = userAgent.split('(')[1]?.split(')')[0] || 'Unknown OS'; // Extrae la información del SO
    const browser = userAgent.split(' ')[0] || 'Unknown Browser'; // Extrae el navegador (simplificado)

    const logEntry = `[${timestamp}] IP: ${ip}, OS: ${os}, Browser: ${browser}, Action: ${action}\n`;

    // Asegúrate de que la carpeta "logs" exista
    fs.mkdir(path.join(__dirname, '../logs'), { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating logs directory:', err);
            return;
        }

        // Escribir en el archivo de logs
        fs.appendFile(logFilePath, logEntry, (err) => {
            if (err) {
                console.error('Error writing to log file:', err);
            }
        });
    });
}

module.exports = logActivity;
