
const local_url = 'http://localhost:3000';
const online_url = 'https://rifaseconomicasnavojoa.site';
const online_test_url = 'https://78f4-38-65-156-128.ngrok-free.app';
const server_url = 'http://localhost:3000';
const config = {
    local_url: 'http://localhost:3000',
    online_url: 'https://rifaseconomicasnavojoa.site',
    online_test_url: 'https://78f4-38-65-156-128.ngrok-free.app',
    server_url: 'http://localhost:3000',
    URL: 'http://localhost:3000/api/numeros',
    STATES_URL: 'http://localhost:3000/api/estados',
    GET_STATES_URL: 'http://localhost:3000/api/obtener_estados',
    BUSCAR_URL: 'http://localhost:3000/api/buscar',
    CAMBIAR_ESTADO_NUMEROS_URL: 'http://localhost:3000/api/numeros/cambiar_estado_numeros',
    SAVE_PERSON_DATA_URL: 'http://localhost:3000/api/submit',
    ADQUIRIR_BOLETO_URL: 'http://localhost:3000/api/adquirir_boleto',
    NUMEROS_PAGINACION_URL: 'http://localhost:3000/api/numeros_paginacion',
    GEOLOCALIZACION_URL: 'http://localhost:3000/api/obtener_geolocalizacion',
    CAPTURAR_ERRORES_URL: 'http://localhost:3000/api/capturar_errores',
    OBTENER_NUMEROS_APARTADOS_URL: 'http://localhost:3000/api/numeros_apartados',
    BUSCAR_APARTADOS_URL: 'http://localhost:3000/api/buscar_apartdos',
    PAGAR_NUMEROS_APARTADOS_URL: 'http://localhost:3000/api/numeros/pagar_numeros_apartados',
    ELIMINAR_PAGO_NUMEROS_APARTADOS_URL: 'http://localhost:3000/api/numeros/eliminar_pago_numeros_apartados',
    ELIMINAR_NUMEROS_APARTADOS_URL: 'http://localhost:3000/api/numeros/eliminar_numeros_apartados',
    OBTENER_CONTEO_NUMEROS_URL: 'http://localhost:3000/api/obtener_conteo_numeros',
    VERIFY_PHONE_DATA_URL: 'http://localhost:3000/api/verificar_telefono_usuario',
    CHATBOT_URL: 'http://localhost:3000/api/chatbot',
};
if (typeof module !== "undefined" && module.exports) {
    module.exports = config;
}