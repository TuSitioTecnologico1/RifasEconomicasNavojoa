const fs = require('fs');
const useragent = require('useragent');
const path = require('path');

// Ruta del archivo de logs
const logFilePath = path.join(__dirname, '../logs', 'logs.txt');

// Función para registrar actividad
function logActivity(req, action) {
    const timestamp = new Date().toISOString();
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';
    const agent = useragent.parse(req.headers['user-agent']);
    const os = agent.os.toString();
    const browser = agent.toAgent();

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

