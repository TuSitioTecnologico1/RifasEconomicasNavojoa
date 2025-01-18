// geolocationApi.js

const https = require('https');
const logActivity = require('../utils/log_activity_USANDO_ua_parser_js');
const logError = require('../utils/log_error');
const logGeolocation = require('../utils/log_geolocation');

// Clave API de ipinfo
const apiKey = '3bd8612d14d207';

// Función para obtener la geolocalización
function getGeolocationIPINFO(ip, apiKey, callback) {
    const url = `https://ipinfo.io/${ip}?token=${apiKey}`;
    https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => {
            if (res.statusCode === 200) callback(null, JSON.parse(data));
            else callback(new Error('No se pudo obtener la geolocalización'));
        });
    }).on('error', callback);
}

// Controlador para la API de geolocalización
const getGeolocation = (req, res) => {
    try {
        const log_activity = logActivity(req, 'Visita a la API - /api/obtener_geolocalizacion');
        console.log("LOG ACTIVITY:");
        console.log(log_activity);

        const { latitude, longitude, exactitud } = req.body;
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const geolocationBrowserData = {
            ip: clientIp,
            latitude: latitude,
            longitude: longitude,
            exactitud,
        };

        //console.log(geolocationBrowserData);

        const geolocationBrowserDataJSON = JSON.stringify(geolocationBrowserData);

        const log_activity_2 = logActivity(req, geolocationBrowserDataJSON);
        console.log(log_activity_2);

        getGeolocationIPINFO(clientIp, apiKey, (error, geoData) => {
            if (error) {
                logError(req, `Error al obtener la geolocalización: ${error.message}`);
                return res.status(500).json({ error: 'No se pudo obtener la geolocalización' });
            }

            const geolocationData = {
                ip: geoData.ip,
                city: geoData.city,
                region: geoData.region,
                country: geoData.country,
                latitude_longitude: geoData.loc,
                exactitud,
            };

             // Convertir a JSON
            const geolocationDataJSON = JSON.stringify(geolocationData);

            logGeolocation(req, `GEOLOCATION - IPINFO.IO: ${geolocationDataJSON}`);
            logGeolocation(req, `GEOLOCATION - BROWSER: ${geolocationBrowserDataJSON}`);

            res.json(geolocationDataJSON);
        });
    } catch (error) {
        logError(req, `Error en la API "/obtener_geolocalizacion": ${error.message}`);
        const log_error = logError(req, 'Error en la API "/api/getStates": '+error+''); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
        res.status(500).send('Error interno del servidor');
    }
};

module.exports = { getGeolocation };