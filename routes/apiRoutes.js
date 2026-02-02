// apiRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../db'); // Suponiendo que la base de datos está configurada en db.js
const verificarRuta = require('../middlewares/verificarRuta');
const upload = require('../middlewares/subirImagen'); // <-- importamos multer
const { getGeolocation } = require('../apis/geolocationApi');  // Importa las funciones de geolocationApi.js
//const { catchErrors } = require('../apis/erroresApi');  // Importa las funciones de userApi.js
const { getStatesBD, getStatesARRAY } = require('../apis/statesApi');  // Importa las funciones de stateApi.js
const { saveUserInfo, savePurchasedTicketsUser, verifyPhoneUserInfo, 
        chatbotInfo, getConfigPageBD, createLottery, getLottery } = require('../apis/userApi');  // Importa las funciones de userApi.js
const { getNumbersBD, getNumbersPagination, changeStatusNumber, getNumersRandom, 
        searchNumber, changeStatusMultipleNumbers, getReservedNumbersBD, searchReservedTicket, 
        paidReservedNumbersBD, deletePaidReservedNumbersBD, deleteReservedNumbersBD, countNumbersBD } = require('../apis/numbersApi');  // Importa las funciones de numerosApi.js



// Opción A: Middleware Global para todas las APIs
// Verificar todas las rutas en este archivo
router.use(verificarRuta);

// Opción B: Solo en algunas rutas
/* Si prefieres aplicarlo solo a ciertas rutas:
router.get('/numeros', verificarRutaAPI, getNumbersBD);
*/





// Ruta para obtener la geolocalización
router.post('/obtener_geolocalizacion', getGeolocation);  // Llamará a la API para obtener la geolocalización

// Ruta para capturar los errores del frontend
//router.post('/capturar_errores', catchErrors);  // Llamará a la API para capturar los errores del frontend



// Ruta para obtener todos los números
router.get('/numeros', getNumbersBD);  // Llamará a la API para obtener los numeros

// Ruta para obtener todos los números con paginación
router.get('/numeros_paginacion', getNumbersPagination);  // Llamará a la API para obtener los números con paginación

// Ruta para cambiar el estado de un número a vendido
router.put('/numeros/:id', changeStatusNumber);  // Llamará a la API para cambiar el estado de un número a vendido

// Ruta para generar varios números al azar
router.get('/numeros/random', getNumersRandom);  // Llamará a la API para obtener varios números al azar

// Ruta para buscar un número
router.post('/buscar', searchNumber);  // Llamará a la API para buscar un número

// Ruta para cambiar el estado de varios números a vendido
router.post('/numeros/cambiar_estado_numeros', changeStatusMultipleNumbers);  // Llamará a la API para cambiar el estado de varios números a vendido

// Ruta para obtener todos los números
router.get('/numeros_apartados', getReservedNumbersBD);  // Llamará a la API para obtener los numeros apartados

// Ruta para buscar numero(s) apartado(s)
router.get('/buscar_apartdos', searchReservedTicket);  // Llamará a la API para buscar numero(s) apartado(s)

// Ruta para pagar numero(s) apartado(s)
router.post('/numeros/pagar_numeros_apartados', paidReservedNumbersBD);  // Llamará a la API para pagar numero(s) apartado(s)

// Ruta para eliminar pago numero(s) apartado(s)
router.post('/numeros/eliminar_pago_numeros_apartados', deletePaidReservedNumbersBD);  // Llamará a la API para eliminar pago numero(s) apartado(s)

// Ruta para eliminar numero(s) apartado(s)
router.post('/numeros/eliminar_numeros_apartados', deleteReservedNumbersBD);  // Llamará a la API para eliminar pago numero(s) apartado(s)

// Ruta para obtener el conteo de numeros Reservados, Pagados y Libres
router.get('/obtener_conteo_numeros', countNumbersBD);  // Llamará a la API para obtener el conteo de numeros Reservados, Pagados y Libres



// Ruta para obtener los estados desde la base de datos
router.get('/obtener_estados', getStatesBD);  // Llamará a la API para obtener estados de la base de datos

// Ruta para obtener los estados desde el arreglo
router.get('/estados', getStatesARRAY);  // Llamará a la API para obtener los estados almacenados



// Ruta para recibir y guardar la info del formulario en la BD
router.post('/submit', saveUserInfo);  // Llamará a la API para recibir y guardar la info del formulario en la BD

// Ruta para recibir la info del usuario y los boletos que adquirio para guardarlos en la BD
router.post('/adquirir_boleto', savePurchasedTicketsUser);  // Llamará a la API para recibir la info del usuario y los boletos que adquirio para guardarlos en la BD

// Ruta para recibir y consultar la info del formulario en la BD
router.post('/verificar_telefono_usuario', verifyPhoneUserInfo);  // Llamará a la API para recibir y consultar la info del formulario en la BD



// Ruta para recibir y mandar informacion al chatbot
router.post('/chatbot', chatbotInfo);



// Ruta para obtener configuraciones de la pagina desde la base de datos
router.get('/obtener_configuracionPagina', getConfigPageBD);  // Llamará a la API para obtener configuraciones de la pagina desde la base de datos



// Ruta para recibir y guardar la info del sorteo en la BD
/*router.post('/crear_sorteo', createLottery);*/
router.post('/crear_sorteo', upload.array('imagenes', 10), createLottery);


// Ruta para obtener los sorteos creados en la BD
router.get('/obtener_sorteos', getLottery);




module.exports = router;





/*
const express = require('express');
const router = express.Router();

// Importamos las rutas de api2.js
const api2Routes = require('../apis/api2');


// Usar las rutas definidas en api2.js
router.use(api2Routes);


module.exports = router;
*/




