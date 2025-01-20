// config.js

const local_url = "http://localhost:3000";
const online_url = "https://rifaseconomicasnavojoa.site";
const server_url = online_url;

const config = {
    local_url,
    online_url,
    URL: server_url+"/api/numeros",
    //STATES_URL: server_url+"/api/states",
    //GET_STATES_URL: server_url+"/api/getStates",
    STATES_URL: server_url+"/api/estados",
    GET_STATES_URL: server_url+"/api/obtener_estados", 
    BUSCAR_URL : server_url+"/api/buscar",
    CAMBIAR_ESTADO_NUMEROS_URL : server_url+"/api/numeros/cambiar_estado_numeros",
    SAVE_PERSON_DATA_URL : server_url+"/api/submit",
    ADQUIRIR_BOLETO_URL : server_url+"/api/adquirir_boleto",
    NUMEROS_PAGINACION_URL : server_url+"/api/numeros_paginacion",
    GEOLOCALIZACION_URL : server_url+"/api/obtener_geolocalizacion",
    CAPTURAR_ERRORES_URL : server_url+"/api/capturar_errores",
    OBTENER_NUMEROS_APARTADOS: server_url+"/api/numeros_apartados",
    BUSCAR_APARTADOS_URL : server_url+"/api/buscar_apartdos",
    
};



// Exportar el objeto config
if (typeof module !== "undefined" && module.exports) {
    module.exports = config; // Para entornos que soportan CommonJS
}