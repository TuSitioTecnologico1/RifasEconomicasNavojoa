// webRoutes.js

const express = require('express');
const router = express.Router();
const logActivity = require('../utils/log_activity_USANDO_ua_parser_js');
const logError = require('../utils/log_error'); // Importar el módulo de logs para los ERRORES de la pagina



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
        //res.render('pages/r1_lista', { title: 'Lista de Boletos' }); // Este se utiliza para renderizar r1_lista.ejs
        res.render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' }); // Este se utiliza para renderizar pronto_iniciaremos.ejs
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
        //res.render('pages/r1_verificador', { title: 'Verificador de Boletos' }); // Este se utiliza para renderizar r1_verificador.ejs
        res.render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' }); // Este se utiliza para renderizar pronto_iniciaremos.ejs
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





module.exports = router;
