// config.js

const local_url = "http://localhost:3000";
const online_url = "https://rifaseconomicasnavojoa.site";
const server_url = online_url;

const config = {
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

const config_local = {
    URL: "http://localhost:3000/api/numeros",
    STATES_URL: "http://localhost:3000/api/states",
    GET_STATES_URL: "http://localhost:3000/getStates",
    BUSCAR_URL : "http://localhost:3000/api/buscar",
    NUMEROS_APARTAR_URL : "http://localhost:3000/api/numeros/apartar",
    SAVE_PERSON_DATA_URL : "http://localhost:3000/api/submit",

    
};

// Exportar el objeto config
if (typeof module !== "undefined" && module.exports) {
    module.exports = config; // Para entornos que soportan CommonJS
    module.exports = config_local; // Para entornos que soportan CommonJS
}