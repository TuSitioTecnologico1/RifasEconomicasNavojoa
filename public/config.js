
const local_url = 'http://localhost:3000';
const online_url = 'https://rifaseconomicasnavojoa.site';
const server_url = '';
const config = {
    local_url: 'http://localhost:3000',
    online_url: 'https://rifaseconomicasnavojoa.site',
    server_url: '',
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
    ELIMINAR_NUMEROS_APARTADOS_UR: 'http://localhost:3000/api/numeros/eliminar_numeros_apartados',
};
if (typeof module !== "undefined" && module.exports) {
    module.exports = config;
}