const config_API = config;

// URLs del servidor backend
const API_GEOLOCALIZACION_URL = config_API.GEOLOCALIZACION_URL;
const API_OBTENER_NUMEROS_APARTADOS_URL = config_API.OBTENER_NUMEROS_APARTADOS_URL;





// Elementos o Referencias del DOM

// Mostrar el modal si no hay permiso de ubicación
const locationModal = document.getElementById('locationModal');
const content_page = document.getElementById('content_page');
const enableLocationButton = document.getElementById('enableLocation');
const activate_desactivate_function_checkLocation = 1;



function checkLocationPermissionAndGetData() {
    try {
        // Verificar si la API de geolocalización está disponible en el navegador
        if ("geolocation" in navigator) {
            // Opciones para mejorar la precisión
            const options = {
                enableHighAccuracy: true,  // Solicitar mayor precisión
                timeout: 15000,             // Tiempo de espera para la geolocalización (5 segundos)
                maximumAge: 0             // No usar una ubicación almacenada en caché
            };

            // Solicitar la ubicación del usuario
            navigator.geolocation.getCurrentPosition(async function (position) {
                // Si el usuario concede el permiso
                locationModal.style.display = 'none';
                //content_page.style.display = 'block';
                
                // Obtener la latitud y longitud
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const accuracy = position.coords.accuracy; // Precisión en metros

                // Mostrar la latitud y longitud en la consola
                //console.log("API de geolocalización del navegador");
                //console.log(`Latitud: ${latitude}`);
                //console.log(`Longitud: ${longitude}`);
                //console.log(`Precisión: ${accuracy} metros`);

                const exactitud = "Precision - "+accuracy+" metros";
                const response = await fetch(API_GEOLOCALIZACION_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({latitude, longitude, exactitud}),
                });
                
                if (response.ok) {
                    //console.log(response);
                }
                if (!response.ok) {
                    console.log(response);
                }

                // Puedes enviar estos datos a tu servidor si los necesitas almacenar o procesar
            }, 
            async function (error) {
                //console.log("error: "+JSON.stringify(error));
                //console.log("Error obteniendo la ubicación: " + error.message);
                // Si el usuario rechaza o hay un error
                if (error.code === error.PERMISSION_DENIED) {
                    locationModal.style.display = 'block';
                    alert('Debes activar la ubicación para acceder al sitio.');
                }
            }, options);
        } else {
            //console.log("Geolocalización no disponible en este navegador.");
            locationModal.style.display = 'block';
            alert('Tu navegador no soporta la geolocalización.');
            return;
        }
    } catch (error) {
        //console.log("Ha ocurrido un error, favor de intentar mas tarde: "+error);
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "function checkLocationPermissionAndGetData()",
            message_error
        };
        console.log(errorObj);
    }
        
}



function checkLocationPermission() {
    try {
        return new Promise((resolve, reject) => {
            // Verificar si la API de geolocalización está disponible en el navegador
            if ("geolocation" in navigator) {
                // Opciones para mejorar la precisión
                const options = {
                    enableHighAccuracy: true,  // Solicitar mayor precisión
                    timeout: 15000,             // Tiempo de espera para la geolocalización (15 segundos)
                    maximumAge: 0             // No usar una ubicación almacenada en caché
                };

                // Solicitar la ubicación del usuario
                navigator.geolocation.getCurrentPosition(function (position) {
                    // Si el usuario concede el permiso
                    locationModal.style.display = 'none';

                    // Obtener la latitud y longitud
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const accuracy = position.coords.accuracy; // Precisión en metros

                    let geolocationData = {
                        latitude,
                        longitude,
                        accuracy
                    };

                    //console.log("geolocationData:", geolocationData);

                    resolve(geolocationData); // Resuelve la promesa con los datos
                }, 
                function (error) {
                    // Si el usuario rechaza o hay un error
                    if (error.code === error.PERMISSION_DENIED) {
                        locationModal.style.display = 'block';
                        alert('Debes activar la ubicación para acceder al sitio.');
                        reject(error); // Rechaza la promesa en caso de error
                    }
                }, options);
            } else {
                // Si la geolocalización no está disponible
                locationModal.style.display = 'block';
                alert('Tu navegador no soporta la geolocalización.');
                reject("Geolocalización no disponible");
            }
        });
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "function checkLocationPermission()",
            message_error
        };
        console.log(errorObj);
    }
        
}



// Vincular la acción del botón a la solicitud de ubicación
enableLocationButton.addEventListener('click', function() {
    checkLocationPermissionAndGetData();
});





document.addEventListener("DOMContentLoaded", function () {
    if (activate_desactivate_function_checkLocation == 1) {
        checkLocationPermissionAndGetData();
    }
    get_reserved_numbers();
    //localStorage.clear();
    //console.log(localStorage.getItem('dark-mode'));
});





const themeToggleButton = document.getElementById('theme-dark-toggle');
const body = document.body;

// Verificar si hay un valor guardado en localStorage
const savedTheme = localStorage.getItem('dark-mode') === 'true';
// Aplicar el modo guardado en localStorage al cargar la página
if (savedTheme) {
    body.classList.add('dark-mode');
    themeToggleButton.innerHTML = '<i class="fa fa-moon-o" aria-hidden="true"></i>'; // Ícono de luna para modo oscuro
} else {
    themeToggleButton.innerHTML = '<i class="fa fa-sun-o" aria-hidden="true"></i>'; // Ícono de sol para modo claro
}



// Alternar entre modos y actualizar localStorage
themeToggleButton.addEventListener('click', () => {
    try {
        const isDarkMode = body.classList.toggle('dark-mode');
        localStorage.setItem('dark-mode', isDarkMode);

        // Actualizar el ícono del botón
        themeToggleButton.innerHTML = isDarkMode
            ? '<i class="fa fa-moon-o" aria-hidden="true"></i>' // Modo oscuro activado
            : '<i class="fa fa-sun-o" aria-hidden="true"></i>'; // Modo claro activado
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "themeToggleButton.addEventListener('click', () => {",
            message_error
        };
        console.log(errorObj);
    }
    
});





// Obtener números 
let arr_numeros_apartados = [];
async function get_reserved_numbers() {
    try {
        //console.log("Se ejecutó: async function getNumbers()");
        const response = await fetch(API_OBTENER_NUMEROS_APARTADOS_URL);
        const data = await response.json();
        arr_numeros_apartados = data;
        //arr_numeros_apartados = data.filter(item => item.visible === 1); // Filtrar solo los visibles

        //console.log("arr_numeros_apartados:");
        //console.log(arr_numeros_apartados);
        
        return data;
    } catch (error) {
        //console.log("Ha ocurrido un error, favor de intentar mas tarde: "+error);
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "async function getNumbers()",
            message_error
        };
        console.log(errorObj);
    }
    
}





// Datos para la tabla (puedes reemplazar con datos dinámicos)
const data = [
    { boleto: "00000", usuario: "SAUL EDUARDO LEAL ONTIVEROS", telefono: "6421123456", estado: "SONORA", pagado: "1", fecha_creacion: "2025-01-03 17:13:04" },
    { boleto: "36286", usuario: "SAUL EDUARDO LEAL ONTIVEROS", telefono: "6421123456", estado: "SONORA", pagado: "0", fecha_creacion: "2025-01-03 17:13:04" },
    { boleto: "54710", usuario: "SAUL EDUARDO LEAL ONTIVEROS", telefono: "6421123456", estado: "SONORA", pagado: "1", fecha_creacion: "2025-01-03 17:13:04" }
];

// Función para generar la tabla
function generateTable(data) {
    const tableContainer = document.getElementById("table-verificador");

    // Crea la tabla
    const table = document.createElement("table");

    // Crea el encabezado
    const thead = document.createElement("thead");
    thead.id = "thead-verificador";
    thead.classList.add("theadClass_verificador");
    thead.innerHTML = `
        <tr>
            <th>Boleto</th>
            <th>Pagado</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Teléfono</th>
            <th>Fecha y Hora</th>
        </tr>
    `;
    table.appendChild(thead);

    // Crea el cuerpo de la tabla
    const tbody = document.createElement("tbody");
    tbody.id = "tbody-verificador";
    tbody.classList.add("tbodyClass_verificador");
    data.forEach(item => {
        const row = document.createElement("tr");
        // Determina el estado y asigna la clase y el texto adecuado
        const isPaid = item.pagado === "1";
        const statusText = isPaid ? "SI" : "NO"; // Define el texto a mostrar
        const statusClass = isPaid
            ? "td_status_pagadoClass_verificador td_class_verificador"
            : "td_status_noPagadoClass_verificador td_class_verificador"; // Define la clase CSS
        row.innerHTML = `
            <td>${item.boleto}</td>
            <td class="${statusClass}">${statusText}</td> <!-- Muestra el texto correspondiente -->
            <td>${item.usuario}</td>
            <td>${item.estado}</td>
            <td>${item.telefono}</td>
            <td>${item.fecha_creacion}</td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Agrega la tabla al contenedor
    tableContainer.innerHTML = ""; // Limpia el contenedor
    tableContainer.appendChild(table);
}

// Genera la tabla al cargar la página
//generateTable(data);




const btn_consultar = document.getElementById("consultar-btn");
const loadingIndicator = document.getElementById("loading");

btn_consultar.addEventListener("click", () => {
    try {
        const numero_a_verificar = document.getElementById("search_verificador").value;
        let arr_numeros_apartados_verificados = [];

        if (numero_a_verificar != "" && numero_a_verificar != undefined) {
            if (numero_a_verificar.toString().length === 10) {
                arr_numeros_apartados_verificados = arr_numeros_apartados.filter(
                    item => item.telefono == numero_a_verificar
                );
            }
            if (numero_a_verificar.toString().length === 5) {
                arr_numeros_apartados_verificados = arr_numeros_apartados.filter(
                    item => item.boleto == numero_a_verificar
                );
            }
            if (numero_a_verificar.toString().length !== 10 && numero_a_verificar.toString().length !== 5) {
                alert(
                    "Escribe el número del boleto apartado (5 dígitos) o el teléfono con el que se apartó (10 dígitos)."
                );
            } else {
                // Muestra el indicador de carga
                loadingIndicator.style.display = "block";

                setTimeout(() => {
                    if (arr_numeros_apartados_verificados.length === 0) {
                        alert("No se ha encontrado el boleto o el número de celular.");
                    } else {
                        generateTable(arr_numeros_apartados_verificados);
                    }

                    // Oculta el indicador de carga después de procesar
                    loadingIndicator.style.display = "none";
                }, 500); // Simula un pequeño retraso (500 ms)
            }
        } else {
            alert("Ingresa tu numero de boleto o tu numero de telefono con el cual apartaste boletos.");
        }
            
    } catch (error) {
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        console.error({
            function: "document.getElementById('consultar-btn').addEventListener('click')",
            message_error,
        });

        // Oculta el indicador de carga si ocurre un error
        loadingIndicator.style.display = "none";
    }
});












