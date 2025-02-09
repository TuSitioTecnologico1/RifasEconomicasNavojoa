// webRoutes.js

const express = require('express');
const router = express.Router();
const logActivity = require('../utils/log_activity_USANDO_ua_parser_js');
const logError = require('../utils/log_error'); // Importar el módulo de logs para los ERRORES de la pagina
const authMiddleware = require('../middlewares/auth'); // Middleware de autenticación
//const db = require('./db'); // Importar la conexión a la base de datos
const { loginUser } = require('../controllers/userController'); // Importar controlador de login




// Página de Login
router.get('/login', (req, res) => {
    res.render('login', { title: 'Iniciar Sesión', error: null });
});

// Manejo del Login
/*
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Aquí deberías verificar credenciales en la base de datos
    //if (username === 'admin' && password === '123456') { // Simulación de usuario
        //req.session.user = { username }; // Guardar sesión
        //return res.redirect('/panel-control');
    //} else {
        //return res.render('login', { title: 'Iniciar Sesión', error: 'Credenciales incorrectas' });
    //}
    
    try {
        // Consulta en la base de datos
        //const [rows] = await pool.query('SELECT id, nombre, username, pass, activo, permiso FROM usuarios WHERE username = ?', [username]);

        //if (rows.length === 0) {
            //return res.render('login', { title: 'Iniciar Sesión', error: 'Usuario no encontrado' });
        //}

        //const user = rows[0];

        // Verificar la contraseña con bcrypt
        //const isMatch = await bcrypt.compare(password, user.password);
        //if (!isMatch) {
            //return res.render('login', { title: 'Iniciar Sesión', error: 'Contraseña incorrecta' });
        //}

        // Guardar datos en la sesión
        //req.session.user = { id: user.id, username: user.username };

        //return res.redirect('/panel-control');
        
        
        // Llamada al controlador de login
        //const usuario = await loginUser(username, password);

        // Guardar el usuario y ek token en la sesión
        //req.session.user = { username: usuario.usuario.username, token: usuario.token };

        // Redirigir al panel de control
        //return res.redirect('/panel-control');
        
    } catch (error) {
        //console.error('Error en el login:', error);
        //return res.status(500).send('Error interno del servidor');

        // Si ocurre un error (usuario no encontrado o contraseñas no coinciden)
        return res.render('login', { title: 'Iniciar Sesión', error: 'Credenciales incorrectas' });
    }
});*/

/*
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("username: ", username);
    console.log("password: ", password);
    console.log(" ");
    try {
        // Llamada al controlador de login
        const usuario = await loginUser(username, password);
        //console.log("usuario: ", usuario);

        // Guardar el usuario y el token en la sesión
        req.session.user = { username: usuario.usuario.username, token: usuario.token };
        //console.log("req.session.user: ", req.session.user);

        // Redirigir al panel de control
        return res.redirect('/panel-control');
        
    } catch (error) {
        // Si ocurre un error (usuario no encontrado o contraseñas no coinciden)
        //return res.render('login', { title: 'Iniciar Sesión', error: 'Credenciales incorrectas' });
        req.flash('error', 'Credenciales incorrectas'); // Usar flash para el error
        return res.redirect('/login');
    }
});
*/

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const usuario = await loginUser(username, password);
        
        // Guardar la información del usuario en la sesión
        req.session.user = { username: usuario.usuario.username, token: usuario.token };
        
        // Si el login es exitoso, redirigir al panel de control
        res.status(200).send('Login exitoso');
        
    } catch (error) {
        // Si las credenciales son incorrectas, responder con un mensaje de error
        //res.status(400).send('Credenciales incorrectas'); // Esto provoca que cuando se hace un inicio de sesion erroneo aparezca el 400 Bad Request en el apartado de "Red" del inspector del navegador
        res.status(401).send('Credenciales incorrectas');

    }
});





// Ruta para la página principal
router.get('/', (req, res) => {
    try {
        //const log_activity = logActivity(req, 'Visita a la Pagina de Inicio(index.html)'); // Registrar acción
        const log_activity = logActivity(req, 'Visita a la Pagina de Inicio(index.ejs)'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");
        //res.sendFile(__dirname + '/../public/index.html'); // Este se utiliza para llamar a index.html
        //res.render('index', { title: 'Página Principal' }); // Este se utiliza para renderizar index.ejs
        res.render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' }); // Este se utiliza para renderizar pronto_iniciaremos.ejs
    } catch (error) {
        const log_error = logError(req, 'Error en la ruta "/": '+error); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para la página donde estan los boletos - https://rifaseconomicasnavojoa.site/lista-boletos/r1
router.get('/lista-boletos/r1', (req, res) => {
    try {
        //const log_activity = logActivity(req, 'Visita a la pagina r1_lista.html'); // Registrar acción
        const log_activity = logActivity(req, 'Visita a la pagina r1_lista.ejs'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");
        const path = require('path');
        //res.sendFile(path.resolve(__dirname, '../public/pages/r1_lista.html')); // Este se utiliza para llamar a r1_lista.html
        res.render('pages/r1_lista', { title: 'Lista de Boletos' }); // Este se utiliza para renderizar r1_lista.ejs
        //res.render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' }); // Este se utiliza para renderizar pronto_iniciaremos.ejs
    } catch (error) {
        const log_error = logError(req, 'Error en la ruta "/lista-boletos/r1": '+error); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para la página donde estan el verificador de boletos - https://rifaseconomicasnavojoa.site/verificador/r1
router.get('/verificador/r1', (req, res) => {
    try {
        //const log_activity = logActivity(req, 'Visita a la pagina r1_verificador.html'); // Registrar acción
        const log_activity = logActivity(req, 'Visita a la pagina r1_verificador.ejs'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");
        const path = require('path');
        //res.sendFile(path.resolve(__dirname, '../public/pages/r1_verificador.html')); // Este se utiliza para llamar a r1_verificador.html
        res.render('pages/r1_verificador', { title: 'Verificador de Boletos' }); // Este se utiliza para renderizar r1_verificador.ejs
        //res.render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' }); // Este se utiliza para renderizar pronto_iniciaremos.ejs
    } catch (error) {
        const log_error = logError(req, 'Error en la ruta "/verificador/r1": '+error); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para la página donde estan los metodos de pago - https://rifaseconomicasnavojoa.site/metodos-pago
router.get('/metodos-pago', (req, res) => {
    try {
        //const log_activity = logActivity(req, 'Visita a la pagina metodos_pago.html'); // Registrar acción
        const log_activity = logActivity(req, 'Visita a la pagina metodos_pago.ejs'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");
        const path = require('path');
        //res.sendFile(path.resolve(__dirname, '../public/pages/metodos_pago.html')); // Este se utiliza para llamar a metodos_pago.html
        //res.render('pages/metodos_pago', { title: 'Metodos de Pago' }); // Este se utiliza para renderizar metodos_pago.ejs
        res.render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' }); // Este se utiliza para renderizar pronto_iniciaremos.ejs
    } catch (error) {
        const log_error = logError(req, 'Error en la ruta "/metodos-pago": '+error); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para la página donde estan las preguntas frecuentes - https://rifaseconomicasnavojoa.site/preguntas-frecuentes
router.get('/preguntas-frecuentes', (req, res) => {
    try {
        const log_activity = logActivity(req, 'Visita a la pagina preguntas_frecuentes.ejs'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");
        const path = require('path');
        //res.sendFile(path.resolve(__dirname, '../public/pages/preguntas_frecuentes.html')); // Este se utiliza para llamar a metodos_pago.html
        //res.render('pages/preguntas_frecuentes', { title: 'Preguntas Frecuentes' }); // Este se utiliza para renderizar metodos_pago.ejs
        res.render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' }); // Este se utiliza para renderizar pronto_iniciaremos.ejs
    } catch (error) {
        const log_error = logError(req, 'Error en la ruta "/preguntas-frecuentes": '+error); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para la página donde esta el contacto - https://rifaseconomicasnavojoa.site/contacto
router.get('/contacto', (req, res) => {
    try {
        const log_activity = logActivity(req, 'Visita a la pagina contacto.ejs'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");
        const path = require('path');
        //res.sendFile(path.resolve(__dirname, '../public/pages/contacto.html')); // Este se utiliza para llamar a metodos_pago.html
        //res.render('pages/contacto', { title: 'Contacto' }); // Este se utiliza para renderizar metodos_pago.ejs
        res.render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' }); // Este se utiliza para renderizar pronto_iniciaremos.ejs
    } catch (error) {
        const log_error = logError(req, 'Error en la ruta "/contacto": '+error); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para la página que indica que la rifa esta cerrada
router.get('/cerrado', (req, res) => {
    try {
        const log_activity = logActivity(req, 'Visita a la pagina cerrado.html'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");
        const path = require('path');
        //res.sendFile(path.resolve(__dirname, '../public/pages/cerrado.html')); // Este se utiliza para llamar a cerrado.html
        //res.render('pages/cerrado', { title: 'Rifa Cerrada' }); // Este se utiliza para renderizar cerrado.ejs
        res.render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' }); // Este se utiliza para renderizar pronto_iniciaremos.ejs
    } catch (error) {
        const log_error = logError(req, 'Error en la ruta "/cerrado": '+error); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para la página donde esta el panel de control - https://rifaseconomicasnavojoa.site/panel-control
// Ruta para el panel de control - protegiéndola con el middleware de autenticación
router.get('/panel-control', authMiddleware, (req, res) => {
    try {
        /*if (!req.session.user) {
            return res.redirect('/login'); // Redirigir si el usuario no está autenticado
        }*/

        const log_activity = logActivity(req, 'Visita a la pagina panel.ejs'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");
        const path = require('path');

        // Este se utiliza para renderizar panel.ejs
        res.render('panel', { 
            title: 'Panel de Control',
            user: req.user // Aquí pasamos la información del usuario decodificada del token
            //user: req.session.user // Pasar el usuario a la vista
        }); 
        //res.render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' }); // Este se utiliza para renderizar pronto_iniciaremos.ejs
    } catch (error) {
        const log_error = logError(req, 'Error en la ruta "/panel-control": '+error); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await obtenerUsuarios();
        res.json(usuarios); // Devuelve todos los usuarios como JSON
    } catch (error) {
        res.status(500).send('Error al obtener usuarios');
    }
});





// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});





module.exports = router;
