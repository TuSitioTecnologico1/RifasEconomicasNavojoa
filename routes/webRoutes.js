// webRoutes.js -> /routes/webRoutes.js

const express = require('express');
const router = express.Router();
const logActivity = require('../utils/log_activity_USANDO_ua_parser_js');
const logError = require('../utils/log_error'); // Importar el módulo de logs para los ERRORES de la pagina
const verificarRuta = require('../middlewares/verificarRuta');
const upload = require('../middlewares/subirImagen'); // <-- importamos multer
const db = require('../db');



// Ruta para la página principal
router.get('/', verificarRuta, (req, res) => {
    try {
        //const log_activity = logActivity(req, 'Visita a la Pagina de Inicio(index.html)'); // Registrar acción
        const log_activity = logActivity(req, 'Visita a la Pagina de Inicio(index.ejs)'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");
        //res.sendFile(__dirname + '/../public/index.html'); // Este se utiliza para llamar a index.html
        res.render('index', { title: 'Página Principal' }); // Este se utiliza para renderizar index.ejs
        //res.render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' }); // Este se utiliza para renderizar pronto_iniciaremos.ejs
    } catch (error) {
        const log_error = logError(req, 'Error en la ruta "/": '+error); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para la página donde estan los boletos - https://rifaseconomicasnavojoa.site/lista-boletos/r1
router.get('/lista-boletos/r1', verificarRuta, (req, res) => {
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

// Ruta para la página donde estan los boletos - https://rifaseconomicasnavojoa.site/lista-boletos-plantilla-editable-iframe
router.get('/lista-boletos-plantilla-editable-iframe', verificarRuta, (req, res) => {
    try {
        //const log_activity = logActivity(req, 'Visita a la pagina r1_lista.html'); // Registrar acción
        const log_activity = logActivity(req, 'Visita a la pagina r1_lista_editable_iframe.ejs'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");
        const path = require('path');
        res.render('pages/editables/r1_lista_editable_iframe', { title: 'Lista de Boletos Editable IFrame' }); // Este se utiliza para renderizar r1_lista_editable_iframe.ejs
        //res.render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' }); // Este se utiliza para renderizar pronto_iniciaremos.ejs
    } catch (error) {
        const log_error = logError(req, 'Error en la ruta "/lista-boletos-plantilla-editable-iframe": '+error); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para la página donde estan el verificador de boletos - https://rifaseconomicasnavojoa.site/verificador/r1
router.get('/verificador/r1', verificarRuta, (req, res) => {
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
router.get('/metodos-pago', verificarRuta, (req, res) => {
    try {
        //const log_activity = logActivity(req, 'Visita a la pagina metodos_pago.html'); // Registrar acción
        const log_activity = logActivity(req, 'Visita a la pagina metodos_pago.ejs'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");
        const path = require('path');
        //res.sendFile(path.resolve(__dirname, '../public/pages/metodos_pago.html')); // Este se utiliza para llamar a metodos_pago.html
        res.render('pages/metodos_pago', { title: 'Metodos de Pago' }); // Este se utiliza para renderizar metodos_pago.ejs
        //res.render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' }); // Este se utiliza para renderizar pronto_iniciaremos.ejs
    } catch (error) {
        const log_error = logError(req, 'Error en la ruta "/metodos-pago": '+error); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para la página donde estan las preguntas frecuentes - https://rifaseconomicasnavojoa.site/preguntas-frecuentes
router.get('/preguntas-frecuentes', verificarRuta, (req, res) => {
    try {
        const log_activity = logActivity(req, 'Visita a la pagina preguntas_frecuentes.ejs'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");
        const path = require('path');
        //res.sendFile(path.resolve(__dirname, '../public/pages/preguntas_frecuentes.html')); // Este se utiliza para llamar a metodos_pago.html
        res.render('pages/preguntas_frecuentes', { title: 'Preguntas Frecuentes' }); // Este se utiliza para renderizar metodos_pago.ejs
        //res.render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' }); // Este se utiliza para renderizar pronto_iniciaremos.ejs
    } catch (error) {
        const log_error = logError(req, 'Error en la ruta "/preguntas-frecuentes": '+error); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para la página donde esta el contacto - https://rifaseconomicasnavojoa.site/contacto
router.get('/contacto', verificarRuta, (req, res) => {
    try {
        const log_activity = logActivity(req, 'Visita a la pagina contacto.ejs'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");
        const path = require('path');
        //res.sendFile(path.resolve(__dirname, '../public/pages/contacto.html')); // Este se utiliza para llamar a metodos_pago.html
        res.render('pages/contacto', { title: 'Contacto' }); // Este se utiliza para renderizar metodos_pago.ejs
        //res.render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' }); // Este se utiliza para renderizar pronto_iniciaremos.ejs
    } catch (error) {
        const log_error = logError(req, 'Error en la ruta "/contacto": '+error); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para la página que indica que la rifa esta cerrada - https://rifaseconomicasnavojoa.site/cerrado
router.get('/cerrado', verificarRuta, (req, res) => {
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
router.get('/panel-control', verificarRuta, (req, res) => {
    try {
        const log_activity = logActivity(req, 'Visita a la pagina panel.ejs'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");
        const path = require('path');
        res.render('panel', { title: 'Panel' }); // Este se utiliza para renderizar panel.ejs
        //res.render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' }); // Este se utiliza para renderizar pronto_iniciaremos.ejs
    } catch (error) {
        const log_error = logError(req, 'Error en la ruta "/panel-control": '+error); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para la página donde esta el panel de control - https://rifaseconomicasnavojoa.site/panel-control-super_admin
router.get('/panel-control-super-admin', verificarRuta, async (req, res) => {
    try {
        const log_activity = logActivity(req, 'Visita a la pagina panel_super_admin.ejs - Ruta: "/panel-control-super-admin"'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");
        const path = require('path');

        const [rows] = await db.query(`SELECT id FROM sorteos ORDER BY id DESC LIMIT 1`);
        const ultimoID = rows.length > 0 ? rows[0].id + 1 : 1; // El simbolo '?' es un if-else. Ej: "condición ? valor_si_verdadero : valor_si_falso"
        console.log("Último ID(emision) de la tabla 'sorteos':", ultimoID);

        res.render('panel_super_admin', { title: 'Panel Super Admin', ultima_emision: ultimoID }); // Este se utiliza para renderizar panel_super_admin.ejs
        //res.render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' }); // Este se utiliza para renderizar pronto_iniciaremos.ejs
        
    } catch (error) {
        const log_error = logError(req, 'Error en la ruta "/panel-control-super-admin": '+error); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para la página donde estan los boletos - https://rifaseconomicasnavojoa.site/lista-boletos/r1
// Mostrar rifa dinámica en /r-:id
router.get('/lista/r-:id', verificarRuta, async (req, res) => {
    const rifaId = req.params.id;

    try {
        const [rifaRows] = await db.query('SELECT * FROM rifas WHERE id = ?', [rifaId]);
        if (rifaRows.length === 0) return res.status(404).render('404');

        let log_activity = logActivity(req, 'Visita a la pagina rifa_lista_dinamica.ejs - Ruta: "/r-'+rifaId+'"'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");

        console.log("rifaRows");
        console.log(rifaRows);
        console.log("");

        log_activity = logActivity(req, 'rifaRows: "/r-'+JSON.stringify(rifaRows, null, 2)+'"'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");

        const rifa = rifaRows[0];
        const [boletos] = await db.query('SELECT * FROM boletos WHERE id_rifa = ?', [rifaId]);

        res.render('pages/rifa_lista_dinamica', { rifa, boletos });
        //res.render('pages/r1_lista', { title: 'Lista de Boletos' }); // Este se utiliza para renderizar r1_lista.ejs
    } catch (err) {
        console.error(err);
        res.status(500).send('Error del servidor');
    }
});

// Mostrar formulario para crear rifa
router.get('/crear-rifa', verificarRuta, (req, res) => {
    let log_activity = logActivity(req, 'Visita a la pagina crear_rifa.ejs - Ruta: "/crear-rifa"'); // Registrar acción
    console.log("LOG ACTIVITY:");
    console.log(log_activity);
    console.log("");

    res.render('crear_rifa');
});

// Ruta para la página donde estan los metodos de pago - https://rifaseconomicasnavojoa.site/chat-soporte
router.get('/chat-soporte', verificarRuta, (req, res) => {
    try {
        //const log_activity = logActivity(req, 'Visita a la pagina chat_soporte_prueba.html'); // Registrar acción
        const log_activity = logActivity(req, 'Visita a la pagina chat_soporte_prueba.ejs'); // Registrar acción
        console.log("LOG ACTIVITY:");
        console.log(log_activity);
        console.log("");
        const path = require('path');
        //res.sendFile(path.resolve(__dirname, '../public/pages/chat_soporte_prueba.html')); // Este se utiliza para llamar a chat_soporte_prueba.html
        res.render('pages/chat_soporte_prueba', { title: 'Chat de Soporte' }); // Este se utiliza para renderizar chat_soporte_prueba.ejs
        //res.render('pages/pronto_iniciaremos', { title: 'Pronto Iniciaremos Rifas' }); // Este se utiliza para renderizar pronto_iniciaremos.ejs
    } catch (error) {
        const log_error = logError(req, 'Error en la ruta "/chat-soporte": '+error); // Registrar acción
        console.log("LOG ERROR:");
        console.log(log_error);
        console.log("");
        res.status(500).send('Error interno del servidor');
    }
});



// Procesar formulario directamente desde HTML (con FORM action="/crear-rifa" y method="POST")
/*
router.post('/crear-rifa', verificarRuta, upload.array('imagenes', 10), async (req, res) => {
    const { titulo, descripcion, cantidad } = req.body;
    const imagenes = req.files; // aquí estarán las imágenes

    try {
        const [result] = await db.query('INSERT INTO rifas (titulo, descripcion) VALUES (?, ?)', [titulo, descripcion]);
        const rifaId = result.insertId;

        // Insertar boletos
        const boletos = [];
        for (let i = 1; i <= parseInt(cantidad); i++) {
            const numero = i.toString().padStart(3, '0');
            boletos.push([numero, 'disponible', rifaId]);
        }

        await db.query('INSERT INTO boletos (numero, estado, id_rifa) VALUES ?', [boletos]);

        // Guardar las rutas de imágenes en la tabla `imagenes`
        const sqlImg = `INSERT INTO imagenes (id_relacionado, tipo_relacion, ruta) VALUES (?, 'rifa', ?)`;
        for (let img of imagenes) {
            const ruta = '/uploads/' + img.filename;
            await db.query(sqlImg, [rifaId, ruta]);
        }

        // Guardar la ruta web
        const [result_rutas] = await db.query(
            'INSERT INTO rutas (nombre, path, tipo, clave) VALUES (?, ?, ?, ?)',
            ["Edición Rifa #" + rifaId, "/lista/r-" + rifaId, "WEB", "NO_APLICA"]
        );

        const rutaId = result_rutas.insertId;

        res.redirect(`/r-${rifaId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al crear la rifa');
    }
});
*/



module.exports = router;
