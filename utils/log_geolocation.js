//-------------------------------------------------------------------------------------------------
//---------------------------------------> ACTUALMENTE EN USO <------------------------------------
//-------------------------------------------------------------------------------------------------
// Alternativa mas moderna y mantenida: ua-parser-js

const fs = require('fs');
const path = require('path');
const UAParser = require('ua-parser-js');

// Función para obtener la fecha actual en formato DD-MM-AAAA
function getFormattedDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
}

// Funcion para registrar actividad
function logActivity(req, action) {
    const timestamp = new Date().toLocaleString('es-ES', {
        timeZone: 'America/Hermosillo'  // Reemplaza con la zona horaria que necesites
    });

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';
    const userAgent = req.headers['user-agent'];
    
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    const browser = result.browser || 'Unknown BROWSER';
    const cpu = result.cpu || 'Unknown CPU';
    const device = result.device || 'Unknown DEVICE';
    const engine = result.engine || 'Unknown ENGINE';
    const os = result.os || 'Unknown OS';
    const ua = result.ua || 'Unknown UA';

    const logEntry = `[${timestamp}] | IP: ${ip}, OS: ${os}, BROWSER: ${browser}, DEVICE: ${device}, ENGINE: ${engine}, CPU: ${cpu} | ACTION: ${action}\n`;

    const logDir = path.join(__dirname, '../logs/geolocation');
    const logFilePath = path.join(logDir, `${getFormattedDate()}_geolocation.log`);


    // Asegurar que la carpeta "logs" exista
    fs.mkdir(logDir, { recursive: true }, (err) => {
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
    
    return logEntry;
}

module.exports = logActivity;





















/* Alternativa mas moderna y mantenida: ua-parser-js

const fs = require('fs');
const path = require('path');
const UAParser = require('ua-parser-js');

// Ruta del archivo de logs
//const logFilePath = path.join(__dirname, '../logs', 'logs.txt');
const logFilePath = path.join(__dirname, '../logs', 'geolocation.log');

// Funcion para registrar actividad
function logGeolocation(req, action) {
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

    const logEntry = `[${timestamp}] | IP: ${ip}, OS: ${os}, BROWSER: ${browser}, DEVICE: ${device}, ENGINE: ${engine}, CPU: ${cpu} | ACTION: ${action}\n`;
    
    // Asegurate de que la carpeta "logs" exista
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
    
    return logEntry;
}

module.exports = logGeolocation;
*/









