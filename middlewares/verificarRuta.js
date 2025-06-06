// middlewares/verificarRuta.js

/*
--->Middleware para verificar el estado de las rutas
Middleware en Express que verifique si una ruta está activa antes de permitir el acceso. 
Este middleware consultará la base de datos para determinar el estado de la ruta.
*/

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
