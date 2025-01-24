const config_API = config;

// URLs del servidor backend
const API_GEOLOCALIZACION_URL = config_API.GEOLOCALIZACION_URL;
const API_URL = config_API.URL;





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
    //localStorage.clear();
    //console.log(localStorage.getItem('dark-mode'));
});





const themeToggleButton = document.getElementById('dark_mode_btn');
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
let arr_numeros = [];
async function get_reserved_numbers() {
    try {
        //console.log("Se ejecutó: async function getNumbers()");
        const response = await fetch(API_URL);
        const data = await response.json();
        arr_numeros = data;
        //arr_numeros = data.filter(item => item.visible === 1); // Filtrar solo los visibles

        //console.log("arr_numeros:");
        //console.log(arr_numeros);
        
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
    { boleto: "00000", pagado: "0", disponible: "0", oportunidades: "1", usuario: "SAUL EDUARDO LEAL ONTIVEROS", telefono: "6421123456", estado: "Baja California Sur", fecha_creacion: "2025-01-03 17:13:04" },
    { boleto: "36286", pagado: "1", disponible: "0", oportunidades: "1", usuario: "SAUL EDUARDO LEAL ONTIVEROS", telefono: "6421123456", estado: "Baja California Sur", fecha_creacion: "2025-01-03 17:13:04" },
    { boleto: "54710", pagado: "1", disponible: "0", oportunidades: "1", usuario: "SAUL EDUARDO LEAL ONTIVEROS", telefono: "6421123456", estado: "Baja California Sur", fecha_creacion: "2025-01-03 17:13:04" }
];
/*
const data = [
    { boleto: "00000", pagado: "1", disponible: "0", oportunidades: "", fecha_creacion: "2025-01-03 17:13:04" },
    { boleto: "36286", pagado: "1", disponible: "0", oportunidades: "", fecha_creacion: "2025-01-03 17:13:04" },
    { boleto: "54710", pagado: "1", disponible: "0", oportunidades: "", fecha_creacion: "2025-01-03 17:13:04" }
];*/

// Función para generar la tabla
function generateTable(data) {
    const tableContainer = document.getElementById("table-panel");

    // Crea la tabla
    const table = document.createElement("table");

    // Crea el encabezado
    const thead = document.createElement("thead");
    thead.id = "thead-verificador";
    thead.classList.add("theadClass_verificador");
    thead.innerHTML = `
        <tr>
            <th><input type="checkbox" class="row-checkbox-panel" disabled style="cursor: pointer;"></th>
            <th>Boleto</th>
            <th>Pagado</th>
            <th>Disponible</th>
            <th>Oportunidades</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Fecha y Hora</th>
        </tr>
    `;
    table.appendChild(thead);

    // Crea el cuerpo de la tabla
    const tbody = document.createElement("tbody");
    tbody.id = "tbody-verificador";
    tbody.classList.add("tbodyClass_verificador");
    data.forEach((item, index) => {
        const row = document.createElement("tr");

        // Determina el estado y asigna la clase y el texto adecuado
        const isPaid = item.pagado === "1";
        const statusText = isPaid ? "SI" : "NO";
        const statusClass = isPaid
            ? "td_class_panel td_status_pagadoClass_verificador "
            : "td_class_panel td_status_noPagadoClass_verificador";
        
        const isAvailable = item.disponible === "1";
        const statusAvailableText = isAvailable ? "SI" : "NO";
        const statusAvailableClass = isAvailable
            ? "td_class_panel td_status_disponibleClass_panel"
            : "td_class_panel td_status_noDisponibleClass_panel";

        row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox-panel" data-index="${index}"></td>
            <td>${item.boleto}</td>
            <td class="${statusClass}">${statusText}</td>
            <td class="${statusAvailableClass}">${statusAvailableText}</td>
            <td>${item.oportunidades}</td>
            <td>${item.usuario}</td>
            <td>${item.estado}</td>
            <td>${item.fecha_creacion}</td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Agrega la tabla al contenedor
    tableContainer.innerHTML = ""; // Limpia el contenedor
    tableContainer.appendChild(table);

    // Configura evento para permitir solo un checkbox seleccionado a la vez
    const checkboxes = document.querySelectorAll(".row-checkbox-panel");
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                checkboxes.forEach(cb => {
                    if (cb !== checkbox) cb.checked = false; // Desmarca otros checkboxes
                });
            }
        });
    });
}

// Función para abrir el modal con animación
function openModal(content) {
    const modal = document.getElementById("info-modal-panel");
    const modalBody = document.getElementById("modal-body-panel");
    modalBody.innerHTML = content; // Inserta el contenido en el modal
    modal.style.display = "flex"; // Muestra el modal
    setTimeout(() => {
        modal.classList.add("show"); // Agrega la clase para la animación
    }, 10); // Pequeño retraso para asegurar la transición
}

// Función para cerrar el modal con animación
function closeModal() {
    const modal = document.getElementById("info-modal-panel");
    modal.classList.remove("show"); // Quita la clase para la animación
    setTimeout(() => {
        modal.style.display = "none"; // Oculta el modal después de la animación
    }, 300); // El tiempo coincide con la duración de la animación en CSS
}


// Evento del botón para mostrar datos seleccionados
document.getElementById("btn_detalles_panel").addEventListener("click", () => {
    const selectedCheckbox = document.querySelector(".row-checkbox-panel:checked");
    if (selectedCheckbox) {
        const index = selectedCheckbox.getAttribute("data-index");
        const selectedData = data[index];

        // Determina el estado y asigna la clase y el texto adecuado
        const isPaid = selectedData.pagado === "1";
        const statusPaidText = isPaid ? "SI" : "NO";
        const statusPaidClass = isPaid
            ? "modal-value span_status_disponibleClass_panel"
            : "modal-value span_status_noDisponibleClass_panel";
        
        const isAvailable = selectedData.disponible === "1";
        const statusAvailableText = isAvailable ? "SI" : "NO";
        const statusAvailableClass = isAvailable
            ? "modal-value span_status_disponibleClass_panel"
            : "modal-value span_status_noDisponibleClass_panel";

        const modalContent = `
            <p class="p_label_modal_class_panel"><strong><span class="modal-label">Boleto:</span></strong></p>
            <p><span class="modal-value">${selectedData.boleto}</span></p>
            <p class="p_label_modal_class_panel"><strong><span class="modal-label">Pagado:</span></strong></p>
            <p><span class="${statusPaidClass}">${statusPaidText}</span></p>
            <p class="p_label_modal_class_panel"><strong><span class="modal-label">Disponible:</span></strong></p>
            <p><span class="${statusAvailableClass}">${statusAvailableText}</span></p>
            <p class="p_label_modal_class_panel"><strong><span class="modal-label">Oportunidades:</span></strong></p>
            <p><span class="modal-value">${selectedData.oportunidades}</span></p>
            <p class="p_label_modal_class_panel"><strong><span class="modal-label">Nombre:</span></strong></p>
            <p><span class="modal-value">${selectedData.usuario}</span></p>
            <p class="p_label_modal_class_panel"><strong><span class="modal-label">Telefono:</span></strong></p>
            <p><span class="modal-value">${selectedData.telefono}</span></p>
            <p class="p_label_modal_class_panel"><strong><span class="modal-label">Estado:</span></strong></p>
            <p><span class="modal-value">${selectedData.estado}</span></p>
            <p class="p_label_modal_class_panel"><strong><span class="modal-label">Fecha y Hora:</span></strong></p>
            <p><span class="modal-value">${selectedData.fecha_creacion}</span></p>
        `;
        openModal(modalContent);
    } else {
        openModal("<p>No se seleccionó ninguna opción.</p>");
    }
});

// Evento para cerrar el modal
document.getElementById("close-modal-panel").addEventListener("click", closeModal);

// Genera la tabla al cargar la página
generateTable(data);