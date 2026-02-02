// routes/panelRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../db');

// Mostrar el panel de control
router.get('/', async (req, res) => {
    try {
        const [rutas] = await db.query('SELECT * FROM rutas');
        res.render('panel_control_rutas', { rutas });
    } catch (error) {
        console.error('Error al obtener las rutas:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Activar/Desactivar una ruta
router.post('/toggle', async (req, res) => {
    const { id } = req.body;
    try {
        const [ruta] = await db.query('SELECT activa FROM rutas WHERE id = ?', [id]);
        if (ruta.length === 0) {
            return res.status(404).send('Ruta no encontrada');
        }
        const nuevoEstado = !ruta[0].activa;
        await db.query('UPDATE rutas SET activa = ? WHERE id = ?', [nuevoEstado, id]);
        res.redirect('/panel-control-rutas');
    } catch (error) {
        console.error('Error al actualizar la ruta:', error);
        res.status(500).send('Error interno del servidor');
    }
});



// Ver registros de uso de APIs y bloqueos de rutas
router.get('/registros', async (req, res) => {
    try {
        const { ip, metodo, fecha_inicio, fecha_fin } = req.query;

        let condiciones = [];
        let valores = [];

        if (ip) {
            condiciones.push('ip LIKE ?');
            valores.push(`%${ip}%`);
        }

        if (metodo) {
            condiciones.push('metodo LIKE ?');
            valores.push(`%${metodo}%`);
        }

        if (fecha_inicio) {
            condiciones.push('fecha >= ?');
            valores.push(fecha_inicio + ' 00:00:00');
        }

        if (fecha_fin) {
            condiciones.push('fecha <= ?');
            valores.push(fecha_fin + ' 23:59:59');
        }

        const whereClause = condiciones.length ? 'WHERE ' + condiciones.join(' AND ') : '';

        const [apis] = await db.query(`SELECT * FROM uso_apis ${whereClause} ORDER BY ultima_llamada DESC LIMIT 100`, valores);
        const [bloqueos] = await db.query(`SELECT * FROM intentos_bloqueados ${whereClause} ORDER BY fecha DESC LIMIT 100`, valores);

        // Convertir fecha a objeto Date
        apis.forEach(api => api.ultima_llamada = new Date(api.ultima_llamada));
        bloqueos.forEach(b => b.fecha = new Date(b.fecha));

        res.render('panel_logs', {
            apis,
            bloqueos,
            ip,
            metodo,
            fecha_inicio,
            fecha_fin
        });
    } catch (err) {
        console.error('Error cargando registros:', err);
        res.status(500).send('Error al cargar los registros');
    }
});



module.exports = router;










/*
const express = require('express');
const router = express.Router();
//const routesStatus = require('../routesStatus');
const routeStatus = require('../config/routesStatus');
const fs = require('fs');
const path = require('path');

// Ruta para mostrar el panel de control de rutas
router.get('/panel-control-super-admin/rutas', (req, res) => {
  res.render('panel_rutas', { rutas: routesStatus, title: 'Panel Control de Rutas' });
});

// Ruta para actualizar el estado de una ruta (activar/desactivar)
router.post('/panel-control-super-admin/rutas/actualizar', express.urlencoded({ extended: true }), (req, res) => {
  const { ruta, estado } = req.body;

  if (!ruta || typeof estado === 'undefined') {
    return res.status(400).send('Datos incompletos');
  }

  // Actualizar el estado en el objeto
  routesStatus[ruta] = estado === 'true';

  // Guardar el objeto actualizado en routesStatus.js
  // Convertimos a texto JS exportable
  const contenido = 'module.exports = ' + JSON.stringify(routesStatus, null, 2) + ';\n';

  const rutaArchivo = path.join(__dirname, '..', 'routesStatus.js');

  fs.writeFile(rutaArchivo, contenido, (err) => {
    if (err) {
      console.error('Error al guardar routesStatus.js:', err);
      return res.status(500).send('Error al guardar el estado');
    }
    res.redirect('/panel-control-super-admin/rutas');
  });
});

module.exports = router;
*/













/*
const express = require('express');
const router = express.Router();

const routesStatus = require('../config/routesStatus');
const fs = require('fs');
const path = require('path');

// Para que los cambios se guarden, escribimos directamente en el archivo config/routesStatus.js
// Nota: Este método es simple y funciona para prototipos, para producción convendría una base de datos.

const routesStatusPath = path.join(__dirname, '../config/routesStatus.js');

// GET: Mostrar panel de control de rutas
router.get('/panel-control-rutas', (req, res) => {
  res.render('panel_rutas', { routesStatus });
});

// POST: Actualizar estado de una ruta (activar o desactivar)
router.post('/panel-control-rutas', express.urlencoded({ extended: true }), (req, res) => {
  const { route, status } = req.body;

  if (route && (status === 'true' || status === 'false')) {
    routesStatus[route] = status === 'true';

    // Crear contenido para guardar en el archivo config/routesStatus.js
    const fileContent = `module.exports = ${JSON.stringify(routesStatus, null, 2)};\n`;

    // Guardar el archivo
    fs.writeFile(routesStatusPath, fileContent, (err) => {
      if (err) {
        console.error('Error guardando config/routesStatus.js:', err);
        return res.status(500).send('Error guardando la configuración');
      }
      res.redirect('/panel-control-rutas');
    });
  } else {
    res.status(400).send('Datos inválidos');
  }
});

module.exports = router;
*/
