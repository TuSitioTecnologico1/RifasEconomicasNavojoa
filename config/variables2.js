const variables = {
    appName: "Rifas Economicas Navojoa",
    companyName: "Tu Sitio Tecnologico",
    currentYear: new Date().getFullYear(),
    supportEmail: "tusitiotecnologico@gmail.com",

    // views/partials/navbar.ejs
    url_inicio: server_url+"/",
    url_preguntasFrecuentes: server_url+"/preguntas-frecuentes",
    url_contacto: server_url+"/contacto",
    url_metodosDePago: server_url+"/metodos-pago",
    url_verificador: server_url+"/verificador/r1",
    url_edicion: {
        url_edicion_1: server_url+"/lista-boletos/r1",
    },

    // views/pages/pronto_iniciaremos.ejs - views/pages/cerrado.ejs
    url_facebookPage: "https://www.facebook.com/people/Rifas-Econ%C3%B3micas-Navojoa/61571119677271/",
    url_whatsappPage: "#",


};

if (typeof module !== "undefined" && module.exports) {
    module.exports = variables;
}