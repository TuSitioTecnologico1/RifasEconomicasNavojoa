// middlewares/verificarRuta.js

/*
--->Middleware para verificar el estado de las rutas
Middleware en Express que verifique si una ruta está activa antes de permitir el acceso. 
Este middleware consultará la base de datos para determinar el estado de la ruta.
*/

const db = require('../db');

async function verificarRuta(req, res, next) {
    try {
        // Quitar parámetros de la URL, ejemplo: ?page=1
        const cleanPath = req.originalUrl.split('?')[0];
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const metodo = req.method;

        console.log("cleanPath: ", cleanPath);

        const [rows] = await db.query('SELECT activa, tipo FROM rutas WHERE path = ?', [cleanPath]);
        console.log("rows: ", rows);

        // Si no está registrada, asumimos WEB y negamos acceso
        if (rows.length === 0) {
            await registrarIntentoBloqueado(cleanPath, metodo, 'WEB', req);
            return res.status(404).render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' });
        }

        const { activa, tipo } = rows[0];

        if (!activa) {
            // Registrar intento bloqueado
            await registrarIntentoBloqueado(cleanPath, metodo, tipo, req);

            if (tipo === 'API') {
                return res.status(403).json({ error: 'Esta API está desactivada temporalmente' });
            }

            return res.status(404).render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' });
        }

        // Si es API y está activa, registrar su uso
        if (tipo === 'API') {
            await registrarUsoAPI(cleanPath, metodo, ip);
        }

        next();
    } catch (error) {
        console.error('Error al verificar la ruta:', error);

        if (req.originalUrl.startsWith('/api') || req.headers.accept?.includes('application/json')) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        res.status(500).render('pages/pronto_iniciaremos', { title: 'Error del servidor' });
    }
}

module.exports = verificarRuta;

// 👇 Función para registrar intentos de acceso a rutas desactivadas
async function registrarIntentoBloqueado(path, method, tipo, req) {
    try {
        await db.query(`
            INSERT INTO intentos_bloqueados (path, metodo, tipo, ip_usuario, user_agent)
            VALUES (?, ?, ?, ?)
        `, [
            path,
            method,
            tipo,
            req.ip,
            req.get('User-Agent')
        ]);
    } catch (err) {
        console.error('Error al registrar intento bloqueado:', err);
    }
}

// 👇 Función para registrar el uso de una API activa
async function registrarUsoAPI(path, method, ip) {
    try {
        await db.query(`
            INSERT INTO uso_apis (path, metodo, ip, conteo)
            VALUES (?, ?, ?, 1)
            ON DUPLICATE KEY UPDATE conteo = conteo + 1, ultima_llamada = CURRENT_TIMESTAMP
        `, [path, method, ip]);
    } catch (err) {
        console.error('Error al registrar uso de API:', err);
    }
}

















/*
const db = require('../db');

async function verificarRuta(req, res, next) {
    try {
        // Quitar parámetros de la URL, ejemplo: ?page=1
        const cleanPath = req.originalUrl.split('?')[0];

        console.log("cleanPath: ", cleanPath);

        const [rows] = await db.query('SELECT activa, tipo FROM rutas WHERE path = ?', [cleanPath]);

        console.log("rows: ", rows);

        if (rows.length === 0) {
            // Ruta no registrada: asumimos WEB y mostramos la página
            return res.status(404).render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' });
        }

        const { activa, tipo } = rows[0];

        if (!activa) {
            if (tipo === 'API') {
                return res.status(403).json({ error: 'Esta API está desactivada temporalmente' });
            }
            return res.status(404).render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' });
        }

        next();
    } catch (error) {
        console.error('Error al verificar la ruta:', error);

        if (req.originalUrl.startsWith('/api') || req.headers.accept?.includes('application/json')) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        res.status(500).render('pages/pronto_iniciaremos', { title: 'Error del servidor' });
    }
}

module.exports = verificarRuta;

*/















/*
const db = require('../db');

async function verificarRuta(req, res, next) {
    try {
        console.log("req: ", req);
        console.log("req.originalUrl: ", req.originalUrl);

        const path = req.path;

        console.log("path: ", path);

        const [rows] = await db.query('SELECT activa, tipo FROM rutas WHERE path = ?', [path]);

        console.log("rows: ", rows);

        if (rows.length === 0) {
            // Ruta no encontrada: asumimos que es WEB y mostramos la página
            return res.status(404).render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' });
        }

        const { activa, tipo } = rows[0];

        if (!activa) {
            if (tipo === 'API') {
                return res.status(403).json({ error: 'Esta API está desactivada temporalmente' });
            }
            return res.status(404).render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' });
        }

        next();
    } catch (error) {
        console.error('Error al verificar la ruta:', error);

        // Si es llamada tipo API
        if (req.originalUrl.startsWith('/api') || req.headers.accept?.includes('application/json')) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        res.status(500).render('pages/pronto_iniciaremos', { title: 'Error del servidor' });
    }
}

module.exports = verificarRuta;
*/


















/*
const db = require('../db');

async function verificarRuta(req, res, next) {
    try {
        const path = req.path;

        const [rows] = await db.query('SELECT activa, tipo FROM rutas WHERE path = ?', [path]);

        if (rows.length === 0 || !rows[0].activa) {
            console.log("rows[0].tipo: ", rows[0].tipo);
            // Si es una API, responde con JSON
            if (rows.length > 0 && rows[0].tipo === 'API') {
                return res.status(403).json({ error: 'Esta API está desactivada temporalmente' });
            }

            // Por defecto asumimos WEB
            return res.status(404).render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' });
        }

        next();
    } catch (error) {
        console.error('Error al verificar la ruta:', error);
        // En caso de error, intenta responder adecuadamente según el tipo
        if (req.originalUrl.startsWith('/api') || req.headers.accept?.includes('application/json')) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        res.status(500).send('Error interno del servidor');
    }
}

module.exports = verificarRuta;
*/










/*
const db = require('../db'); // Asegúrate de tener configurada tu conexión a la base de datos

async function verificarRuta(req, res, next) {
    try {
        const path = req.path;
        const [rows] = await db.query('SELECT activa FROM rutas WHERE path = ?', [path]);

        if (rows.length === 0 || !rows[0].activa) {
            return res.status(404).render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' });
        }

        next();
    } catch (error) {
        console.error('Error al verificar la ruta:', error);
        res.status(500).send('Error interno del servidor');
    }
}

module.exports = verificarRuta;
*/