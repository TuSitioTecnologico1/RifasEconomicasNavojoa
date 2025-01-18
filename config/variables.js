
// Variables para las vistas EJS del proeycto.

// config/variables.js
module.exports = {
    appName: "Rifas Economicas Navojoa",
    companyName: "Tu Sitio Tecnologico",
    currentYear: new Date().getFullYear(),
    supportEmail: "tusitiotecnologico@gmail.com",
    
    local_url: "http://localhost:3000",
    online_url: "https://rifaseconomicasnavojoa.site",
    server_url: online_url,

    // views/partials/navbar.ejs
    url_inicio: server_url+"/",
    url_preguntasFrecuentes: server_url+"/preguntas-frecuentes",
    url_contacto: server_url+"/contacto",
    url_metodosDePago: server_url+"/metodos-pago",
    url_verificador: server_url+"/verificador/r1",
    url_edicion1: server_url+"/lista-boletos/r1",

    // views/pages/pronto_iniciaremos.ejs
    url_facebookPage: "https://www.facebook.com/people/Rifas-Econ%C3%B3micas-Navojoa/61571119677271/",
    url_whatsappPage: "#",


};
