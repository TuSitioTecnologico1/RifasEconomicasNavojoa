// middlewares/auth.js


module.exports = (req, res, next) => {
    console.log(" ");
    console.log('Se ha entrado al middleware "auth.js"');  
    console.log('Sesión actual:', req.session.user);  // Para depurar si la sesión existe
    console.log(" ");
    /*
    if (!req.session.user) {
        return res.status(403).send('Acceso denegado: No autenticado');
    }
    */

    if (!req.session.user) {
        return res.send(`
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Acceso denegado</title>
                <script>
                    setTimeout(function() {
                        window.location.href = "/login"; // Redirigir al login después de 3 segundos
                    }, 3000);
                </script>
            </head>
            <body>
                <h2 style="color: red;">Acceso denegado: No autenticado</h2>
                <p style='font-size: 30px;'>Serás redirigido a la página de inicio de sesión en 3 segundos...</p>
            </body>
            </html>
        `);
    }

    req.user = req.session.user; // El usuario autenticado se guarda en `req.user`
    next();
};





/*
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('Acceso denegado: No hay token');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send('Token inválido');
        }

        req.user = decoded; // Guardamos la información del usuario decodificada
        next();
    });
};
*/







/*
module.exports = (req, res, next) => {
    if (req.session && req.session.user) {
        return next(); // Usuario autenticado, permitir acceso
    } else {
        res.redirect('/login'); // Si no está autenticado, redirigir al login
    }
};
*/
