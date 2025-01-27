const config_API = config;

// URLs del servidor backend
const API_GEOLOCALIZACION_URL = config_API.GEOLOCALIZACION_URL;
const API_URL = config_API.URL;
const API_OBTENER_NUMEROS_APARTADOS_URL = config_API.OBTENER_NUMEROS_APARTADOS_URL;
const API_PAGAR_NUMEROS_APARTADOS_URL = config_API.PAGAR_NUMEROS_APARTADOS_URL;
const API_ELIMINAR_PAGO_NUMEROS_APARTADOS_URL = config_API.ELIMINAR_PAGO_NUMEROS_APARTADOS_URL;
const API_ELIMINAR_NUMEROS_APARTADOS_URL = config_API.ELIMINAR_NUMEROS_APARTADOS_URL;





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
    get_reserved_numbers().then((data) => {
        if (data && data.length > 0) {
            generateTable(data); // Llama a generateTable con los datos cargados
        } else {
            console.log("No hay datos para mostrar en la tabla.");
        }
    });
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
let arr_numeros_apartados = [];
async function get_reserved_numbers() {
    try {
        //console.log("Se ejecutó: async function getNumbers()");
        const response = await fetch(API_OBTENER_NUMEROS_APARTADOS_URL);
        const data = await response.json();
        arr_numeros_apartados = data;
        //arr_numeros_apartados = data.filter(item => item.visible === 1); // Filtrar solo los visibles

        console.log("arr_numeros_apartados:");
        console.log(arr_numeros_apartados);
        
        return arr_numeros_apartados;
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
        return []; // Retorna un arreglo vacío si ocurre un error
    }
    
}





/* Datos para la tabla (puedes reemplazar con datos dinámicos)
const data = [
    { boleto: "00000", pagado: "0", disponible: "0", oportunidades: "1", usuario: "SAUL EDUARDO LEAL ONTIVEROS", telefono: "6421123456", estado: "Baja California Sur", fecha_creacion: "2025-01-03 17:13:04" },
    { boleto: "36286", pagado: "1", disponible: "0", oportunidades: "1", usuario: "SAUL EDUARDO LEAL ONTIVEROS", telefono: "6421123456", estado: "Baja California Sur", fecha_creacion: "2025-01-03 17:13:04" },
    { boleto: "54710", pagado: "1", disponible: "0", oportunidades: "1", usuario: "SAUL EDUARDO LEAL ONTIVEROS", telefono: "6421123456", estado: "Baja California Sur", fecha_creacion: "2025-01-03 17:13:04" }
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

        // Agregar un id único al tr (opcional, basado en algún valor único del item)
        row.id = `tr_${item.boleto}`;

        // Agregar una clase adicional según una condición o por defecto
        row.classList.add("tr_class");
        if (item.pagado === "1") {
            row.classList.add("tr_pagado");
        } else {
            row.classList.add("tr_noPagado");
        }

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
            <td class'td_class_panel td_checkbox'><input type="checkbox" class="row-checkbox-panel" data-index="${index}"></td>
            <td class'td_class_panel td_boleto'>${item.boleto}</td>
            <td class="${statusClass}">${statusText}</td>
            <td class'td_class_panel td_nombre'>${item.usuario}</td>
            <td class'td_class_panel td_estado'>${item.estado}</td>
            <td class'td_class_panel td_fecha_hora'>${item.fecha_creacion}</td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Agrega la tabla al contenedor
    tableContainer.innerHTML = ""; // Limpia el contenedor
    tableContainer.appendChild(table);

    /* Configura evento para permitir solo un checkbox seleccionado a la vez
    const checkboxes = document.querySelectorAll(".row-checkbox-panel");
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                checkboxes.forEach(cb => {
                    if (cb !== checkbox) cb.checked = false; // Desmarca otros checkboxes
                });
            }
        });
    });*/

    // Obtener todos los checkboxes
    const checkboxes = document.querySelectorAll(".row-checkbox-panel");

    // Ejecutar el evento cada vez que se presione un checkbox
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", countChecked);
    });

    /* Función para contar los checkboxes seleccionados
    function countChecked() {
        const selectedCount = document.querySelectorAll(".row-checkbox-panel:checked").length; // Contar los checkboxes marcados
        //console.log("Total checkboxes seleccionados:", selectedCount);
        if (selectedCount > 1) {
            document.getElementById("btn_detalles_panel").disabled = true;
        } else {
            document.getElementById("btn_detalles_panel").disabled = false;
        }
    }*/
    // Función para contar los checkboxes seleccionados y manejar el estado de los botones
    function countChecked() {
        const selectedCheckboxes = document.querySelectorAll(".row-checkbox-panel:checked"); // Checkboxes seleccionados
        const selectedCount = selectedCheckboxes.length; // Contar los checkboxes seleccionados

        // Botones a controlar
        const btnDetalles = document.getElementById("btn_detalles_panel");
        const btnPagado = document.getElementById("btn_pagado_panel");
        const btnEliminarPago = document.getElementById("btn_eliminarPago_panel");
        const btnEliminarApartado = document.getElementById("btn_eliminarApartado_panel");

        btnEliminarApartado.disabled = selectedCount === 0;

        // Control del botón "Detalles" (deshabilitar si hay más de 1 checkbox seleccionado o si no hay ningun checkbox seleccionado)
        btnDetalles.disabled = selectedCount > 1 || selectedCount === 0;

        // Variables para determinar si los botones "Pagado" y "Eliminar Pago" deben estar habilitados o deshabilitados
        let hasPaid = false; // Indica si hay filas con "Pagado = SI"
        let hasUnpaid = false; // Indica si hay filas con "Pagado = NO"

        // Revisar las celdas "Pagado" de las filas seleccionadas
        selectedCheckboxes.forEach((checkbox) => {
            const row = checkbox.closest("tr"); // Obtener la fila del checkbox
            const pagadoCell = row.querySelector("td:nth-child(3)"); // Celda "Pagado"

            if (pagadoCell.textContent.trim() === "SI") {
                hasPaid = true; // Hay una fila con "Pagado = SI"
            } else if (pagadoCell.textContent.trim() === "NO") {
                hasUnpaid = true; // Hay una fila con "Pagado = NO"
            }
        });

        // Si hay una mezcla de "SI" y "NO", deshabilitar ambos botones
        const hasMixedStates = hasPaid && hasUnpaid;

        // Actualizar el estado de los botones "Pagado" y "Eliminar Pago"
        btnPagado.disabled = hasMixedStates || hasPaid || selectedCount === 0; // Deshabilitar si hay mezcla, si todos son "SI" o no hay selección
        btnEliminarPago.disabled = hasMixedStates || hasUnpaid || selectedCount === 0; // Deshabilitar si hay mezcla, si todos son "NO" o no hay selección
    }

    // Llamar a la función para inicializar el estado de los botones al cargar la tabla
    countChecked();
}





// Obtener los datos seleccionados, ignorando el checkbox del <th>
function getSelectedData(data) {
    // Selecciona solo los checkboxes dentro del <tbody> que estén marcados
    const checkboxes = document.querySelectorAll("tbody .row-checkbox-panel:checked");
    const selectedData = Array.from(checkboxes).map(checkbox => {
        const index = checkbox.getAttribute("data-index");
        return data[index];
    });
    return selectedData;
}





// Evento del botón para mostrar datos seleccionados
document.getElementById("btn_detalles_panel").addEventListener("click", () => {
    const selectedCheckbox = document.querySelector(".row-checkbox-panel:checked");
    if (selectedCheckbox) {
        const index = selectedCheckbox.getAttribute("data-index");
        const selectedData = arr_numeros_apartados[index];

        // Determina el estado y asigna la clase y el texto adecuado
        const isPaid = selectedData.pagado === "1";
        const statusPaidText = isPaid ? "SI" : "NO";
        const statusPaidClass = isPaid
            ? "modal-value span_status_disponibleClass_panel"
            : "modal-value span_status_noDisponibleClass_panel";
        /*
        const isAvailable = selectedData.disponible === "1";
        const statusAvailableText = isAvailable ? "SI" : "NO";
        const statusAvailableClass = isAvailable
            ? "modal-value span_status_disponibleClass_panel"
            : "modal-value span_status_noDisponibleClass_panel";
        */

        const modalContent = `
            <p class="p_label_modal_class_panel"><strong><span class="modal-label">Boleto:</span></strong></p>
            <p><span class="modal-value">${selectedData.boleto}</span></p>
            <p class="p_label_modal_class_panel"><strong><span class="modal-label">Pagado:</span></strong></p>
            <p><span class="${statusPaidClass}">${statusPaidText}</span></p>
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


// Evento para el botón "Pagado"
document.getElementById("btn_pagado_panel").addEventListener("click", () => {
    const selectedData = getSelectedData(arr_numeros_apartados);
    //console.log("Datos seleccionados:");
    //console.log(selectedData);

    pagarBoletos(selectedData);
    
});

// Funcion para el botón "Pagado"
async function pagarBoletos (data_pagados) {

    // Obtener todos los checkboxes seleccionados
    const selectedCheckboxes_ = document.querySelectorAll(".row-checkbox-panel:checked");

    let arr_boletos_ya_pagados_table = [];

    // Recorrer los checkboxes seleccionados
    selectedCheckboxes_.forEach((checkbox) => {
        // Encontrar la fila correspondiente al checkbox
        const row = checkbox.closest("tr");

        // Encontrar la celda de la columna "Boleto" que esta en la columna 2
        const boletoCell = row.querySelector("td:nth-child(2)");

        // Obtener el texto actual de la celda "Pagado"
        const textoActual_boletoCell = boletoCell.textContent.trim();
        //console.log("textoActual_boletoCell:");
        //console.log(textoActual_boletoCell);

        // Encontrar la celda de la columna "Pagado" que esta en la columna 3
        const pagadoCell = row.querySelector("td:nth-child(3)");

        // Obtener el texto actual de la celda "Pagado"
        const textoActual_pagadoCell = pagadoCell.textContent.trim();
        //console.log("textoActual_pagadoCell:");
        //console.log(textoActual_pagadoCell);

        if (textoActual_pagadoCell == "SI") {
            arr_boletos_ya_pagados_table.push(textoActual_boletoCell);
        }
        

        // Mostrar el texto en la consola (o usarlo según tu necesidad)
        //console.log(`Texto actual de la celda "Pagado": ${textoActual_pagadoCell}`);
    });

    //console.log("arr_boletos_ya_pagados_table:");
    //console.log(arr_boletos_ya_pagados_table);

    if (arr_boletos_ya_pagados_table.length == 0) {
        //console.log("Datos seleccionados:");
        //console.log(data_pagados);
        
        let arr_pago_boletos_ID = [];
        let arr_pago_boletos_NUMERO = [];
        let arr_boletos_ya_pagados = [];
        data_pagados.forEach(infoBoleto => {
            if (infoBoleto.pagado == "1") {
                arr_boletos_ya_pagados.push(infoBoleto.boleto);
            } else {
                arr_pago_boletos_ID.push(infoBoleto.id_boleto);
                arr_pago_boletos_NUMERO.push(infoBoleto.boleto);
            }
        });

        //console.log("arr_boletos_ya_pagados:");
        //console.log(arr_boletos_ya_pagados);

        //if (arr_boletos_ya_pagados.length == 0) {
        if(true) {
            //console.log("arr_pago_boletos_ID:");
            //console.log(arr_pago_boletos_ID);

            //console.log("arr_pago_boletos_NUMERO:");
            //console.log(arr_pago_boletos_NUMERO);

            const response = await fetch(API_PAGAR_NUMEROS_APARTADOS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    received_array_ticketsPagados_ID: arr_pago_boletos_ID,
                    received_array_ticketsPagados_NUMERO: arr_pago_boletos_NUMERO,
                }),
            });

            if (response.ok) {
                openModal_personalizado("<p>Se han puesto como pagados los boletos seleccionados.</p>");

                // Recorre el array y actualiza los boletos correspondientes a pagado
                arr_numeros_apartados.forEach(boleto => {
                    if (arr_pago_boletos_ID.includes(boleto.id_boleto)) {
                        boleto.pagado = "1";
                    }
                });

                // Muestra los cambios de los boletos que se pasaron a "1" que significa "Pagado"
                console.log("Boleto(s) actualizado(s) a '1'(Pagado):", arr_numeros_apartados.filter(boleto => arr_pago_boletos_ID.includes(boleto.id_boleto)));

                // Obtener todos los checkboxes seleccionados
                const selectedCheckboxes = document.querySelectorAll(".row-checkbox-panel:checked");

                // Recorrer los checkboxes seleccionados
                selectedCheckboxes.forEach((checkbox) => {
                    // Encontrar la fila correspondiente al checkbox
                    const row = checkbox.closest("tr");

                    // Encontrar la celda de la columna "Pagado"
                    const pagadoCell = row.querySelector("td:nth-child(3)");

                    // Cambiar el texto a "SI"
                    pagadoCell.textContent = "SI";

                    // Cambiar la clase para reflejar el cambio visualmente
                    pagadoCell.className = "td_class_panel td_status_pagadoClass_verificador";
                });
            }
            if (!response.ok) {
                console.log(response);
            }
        } else {
            //openModal_personalizado("<p class='p_description1_boletos_modal_panel'>Se han seleccionados boletos que ya estan <label class='label_pagados_modal_panel'>pagados</label>.</p> <p class='p_description2_boletos_modal_panel'>Por favor deseleccionalos para continuar.</p> <p class='p_label_boletos_modal_panel'>BOLETOS:</p> <p class='p_data_boletos_modal_panel'>"+JSON.stringify(arr_boletos_ya_pagados)+"</p>");
        }
    } else {
        openModal_personalizado("<p class='p_description1_boletos_modal_panel'>Se han seleccionados boletos que ya estan <label class='label_pagados_modal_panel'>pagados</label>.</p> <p class='p_description2_boletos_modal_panel'>Por favor deseleccionalos para continuar.</p> <p class='p_label_boletos_modal_panel'>BOLETOS:</p> <p class='p_data_boletos_modal_panel'>"+JSON.stringify(arr_boletos_ya_pagados_table)+"</p>");
    }
        
    
    
    
}


// Evento para el botón "Eliminar Pago"
document.getElementById("btn_eliminarPago_panel").addEventListener("click", () => {
    const selectedData = getSelectedData(arr_numeros_apartados);
    //console.log("Datos seleccionados:");
    //console.log(selectedData);
    eliminarPagoBoletos(selectedData);
    
});

// Funcion para el botón "Eliminar Pago"
async function eliminarPagoBoletos (data_eliminarPago) {

    // Obtener todos los checkboxes seleccionados
    const selectedCheckboxes_ = document.querySelectorAll(".row-checkbox-panel:checked");

    let arr_boletos_ya_noPagados_table = [];

    // Recorrer los checkboxes seleccionados
    selectedCheckboxes_.forEach((checkbox) => {
        // Encontrar la fila correspondiente al checkbox
        const row = checkbox.closest("tr");

        // Encontrar la celda de la columna "Boleto" que esta en la columna 2
        const boletoCell = row.querySelector("td:nth-child(2)");

        // Obtener el texto actual de la celda "Pagado"
        const textoActual_boletoCell = boletoCell.textContent.trim();
        //console.log("textoActual_boletoCell:");
        //console.log(textoActual_boletoCell);

        // Encontrar la celda de la columna "Pagado" que esta en la columna 3
        const noPagadoCell = row.querySelector("td:nth-child(3)");

        // Obtener el texto actual de la celda "Pagado"
        const textoActual_noPagadoCell = noPagadoCell.textContent.trim();
        //console.log("textoActual_noPagadoCell:");
        //console.log(textoActual_noPagadoCell);

        if (textoActual_noPagadoCell == "NO") {
            arr_boletos_ya_noPagados_table.push(textoActual_boletoCell);
        }
        

        // Mostrar el texto en la consola (o usarlo según tu necesidad)
        //console.log(`Texto actual de la celda "Pagado": ${textoActual_noPagadoCell}`);
    });

    //console.log("arr_boletos_ya_noPagados_table:");
    //console.log(arr_boletos_ya_noPagados_table);
    
    if (arr_boletos_ya_noPagados_table == 0) {
        //console.log("Datos seleccionados:");
        //console.log(data_eliminarPago);
        
        let arr_eliminar_pago_boletos_ID = [];
        let arr_eliminar_pago_boletos_NUMERO = [];
        let arr_boletos_ya_NoPagados = [];
        data_eliminarPago.forEach(infoBoleto => {
            
            if (infoBoleto.pagado == "0") {
                arr_boletos_ya_NoPagados.push(infoBoleto.boleto);
            } else {
                arr_eliminar_pago_boletos_ID.push(infoBoleto.id_boleto);
                arr_eliminar_pago_boletos_NUMERO.push(infoBoleto.boleto);
            }
        });
        
        //console.log("arr_boletos_ya_NoPagados:");
        //console.log(arr_boletos_ya_NoPagados);

        //if (arr_boletos_ya_NoPagados.length == 0) {
        if (true) {
            //console.log("arr_eliminar_pago_boletos_ID:");
            //console.log(arr_eliminar_pago_boletos_ID);

            //console.log("arr_eliminar_pago_boletos_NUMERO:");
            //console.log(arr_eliminar_pago_boletos_NUMERO);

            const response = await fetch(API_ELIMINAR_PAGO_NUMEROS_APARTADOS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    received_arr_eliminar_pago_boletos_ID: arr_eliminar_pago_boletos_ID,
                    received_arr_eliminar_pago_boletos_NUMERO: arr_eliminar_pago_boletos_NUMERO,
                }),
            });

            if (response.ok) {
                openModal_personalizado("<p>Se ha borrado el pago de los boletos seleccionados.</p>");

                // Recorre el array y actualiza los boletos correspondientes a pagado
                arr_numeros_apartados.forEach(boleto => {
                    if (arr_eliminar_pago_boletos_ID.includes(boleto.id_boleto)) {
                        boleto.pagado = "0";
                    }
                });

                // Muestra los cambios de los boletos que se pasaron a "0" que significa "No Pagado"
                console.log("Boleto(s) actualizado(s) a '0'(No Pagado):", arr_numeros_apartados.filter(boleto => arr_eliminar_pago_boletos_ID.includes(boleto.id_boleto)));

                // Obtener todos los checkboxes seleccionados
                const selectedCheckboxes = document.querySelectorAll(".row-checkbox-panel:checked");

                // Recorrer los checkboxes seleccionados
                selectedCheckboxes.forEach((checkbox) => {
                    // Encontrar la fila correspondiente al checkbox
                    const row = checkbox.closest("tr");

                    // Encontrar la celda de la columna "Pagado"
                    const pagadoCell = row.querySelector("td:nth-child(3)");

                    // Cambiar el texto a "NO"
                    pagadoCell.textContent = "NO";

                    // Cambiar la clase para reflejar el cambio visualmente
                    pagadoCell.className = "td_class_panel td_status_noPagadoClass_verificador";
                });
            }
            if (!response.ok) {
                console.log(response);
            }
        }else{
            //openModal_personalizado("<p class='p_description1_boletos_modal_panel'>Se han seleccionados boletos que ya estan en <label class='label_pagados_modal_panel'>no pagados</label>.</p> <p class='p_description2_boletos_modal_panel'>Por favor deseleccionalos para continuar.</p> <p class='p_label_boletos_modal_panel'>BOLETOS:</p> <p class='p_data_boletos_modal_panel'>"+JSON.stringify(arr_boletos_ya_NoPagados)+"</p>");
        }
    } else {
        openModal_personalizado("<p class='p_description1_boletos_modal_panel'>Se han seleccionados boletos que ya estan en <label class='label_noPagados_modal_panel'>no pagados</label>.</p> <p class='p_description2_boletos_modal_panel'>Por favor deseleccionalos para continuar.</p> <p class='p_label_boletos_modal_panel'>BOLETOS:</p> <p class='p_data_boletos_modal_panel'>"+JSON.stringify(arr_boletos_ya_noPagados_table)+"</p>");
    }
        

}


// Evento para el botón "Eliminar Apartado"
document.getElementById("btn_eliminarApartado_panel").addEventListener("click", () =>{
    const selectedData = getSelectedData(arr_numeros_apartados);
    //console.log("Datos seleccionados:");
    //console.log(selectedData);
    eliminarApartadoBoletos(selectedData);
});

// Funcion para el botón "Eliminar Pago"
async function eliminarApartadoBoletos (data_eliminarApartado) {
    //console.log("Datos seleccionados:");
    //console.log(data_eliminarApartado);

    let arr_eliminar_apartado_boletos_ID = [];
    let arr_eliminar_apartado_boletos_NUMERO = [];
    data_eliminarApartado.forEach(infoBoleto => {
        arr_eliminar_apartado_boletos_ID.push(infoBoleto.id_boleto);
        arr_eliminar_apartado_boletos_NUMERO.push(infoBoleto.boleto);
    });

    //if (arr_boletos_ya_NoPagados.length == 0) {
    if (true) {
        //console.log("arr_eliminar_apartado_boletos_ID:");
        //console.log(arr_eliminar_apartado_boletos_ID);

        //console.log("arr_eliminar_apartado_boletos_NUMERO:");
        //console.log(arr_eliminar_apartado_boletos_NUMERO);

        // Se hace un peticion "POST" usando "fetch" para hacer eliminar el apartado de la BD
        const response = await fetch(API_ELIMINAR_NUMEROS_APARTADOS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                received_arr_eliminar_boletos_ID: arr_eliminar_apartado_boletos_ID,
                received_arr_eliminar_boletos_NUMERO: arr_eliminar_apartado_boletos_NUMERO,
            }),
        });

        if (response.ok) {
            openModal_personalizado("<p>Se ha eliminado el apartado de los boletos seleccionados.</p>");

            // Eliminar dinamicamente la el boleto de la tabla HTML
            arr_eliminar_apartado_boletos_NUMERO.forEach(boleto => {
                let tr_fila_boleto = document.getElementById("tr_"+boleto); // Buscar el <tr> por su id
                if (tr_fila_boleto) {
                    tr_fila_boleto.remove(); // Eliminar el <tr>
                    console.log(`Se eliminó el boleto: ${boleto}`);
                } else {
                    console.log(`No se encontró el boleto: ${boleto}`);
                }
            });

            // Filtra el array para conservar solo los boletos que NO estén en arr_eliminar_apartado_boletos_ID
            arr_numeros_apartados = arr_numeros_apartados.filter(boleto => !arr_eliminar_apartado_boletos_ID.includes(boleto.id_boleto));

            console.log("Array actualizado después de eliminar los boletos selecionados:", arr_numeros_apartados);
        }
        if (!response.ok) {
            openModal_personalizado("<p>Oopss! Ocurrio un error al eliminar el apartado de los boletos seleccionados.</p>");
            console.log(response);
        }
    } else {
        //openModal_personalizado("<p class='p_description1_boletos_modal_panel'>Se han seleccionados boletos que ya estan en <label class='label_pagados_modal_panel'>no pagados</label>.</p> <p class='p_description2_boletos_modal_panel'>Por favor deseleccionalos para continuar.</p> <p class='p_label_boletos_modal_panel'>BOLETOS:</p> <p class='p_data_boletos_modal_panel'>"+JSON.stringify(arr_boletos_ya_NoPagados)+"</p>");
    }
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

// Función para abrir el modal personalizado con animación
function openModal_personalizado(content) {
    const modal = document.getElementById("info-modal-personalizado-panel");
    const modalBody = document.getElementById("modal-personalizado-body-panel");
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

// Función para cerrar el modal personalizado con animación
function closeModal_personalizado() {
    const modal = document.getElementById("info-modal-personalizado-panel");
    modal.classList.remove("show"); // Quita la clase para la animación
    setTimeout(() => {
        modal.style.display = "none"; // Oculta el modal después de la animación
    }, 300); // El tiempo coincide con la duración de la animación en CSS
}

// Evento para cerrar el modal 
document.getElementById("close-modal-panel").addEventListener("click", closeModal);

// Evento para cerrar el modal personalizado
document.getElementById("close-modal-personalizado-panel").addEventListener("click", closeModal_personalizado);


