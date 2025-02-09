const config_API = config;

// URLs del servidor backend
const API_GEOLOCALIZACION_URL = config_API.GEOLOCALIZACION_URL;
const API_URL = config_API.URL;
const API_OBTENER_NUMEROS_APARTADOS_URL = config_API.OBTENER_NUMEROS_APARTADOS_URL;
const API_PAGAR_NUMEROS_APARTADOS_URL = config_API.PAGAR_NUMEROS_APARTADOS_URL;
const API_ELIMINAR_PAGO_NUMEROS_APARTADOS_URL = config_API.ELIMINAR_PAGO_NUMEROS_APARTADOS_URL;
const API_ELIMINAR_NUMEROS_APARTADOS_URL = config_API.ELIMINAR_NUMEROS_APARTADOS_URL;
const API_OBTENER_CONTEO_NUMEROS_URL = config_API.OBTENER_CONTEO_NUMEROS_URL;
const API_ACTUALIZAR_CONTEO_NUMEROS_URL = config_API.ACTUALIZAR_CONTEO_NUMEROS_URL;





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
                    const data = await response.json(); // Leer la respuesta JSON
                    //console.log("Datos recibidos:", data);
                }
                if (!response.ok) {
                    console.error("Error en la solicitud:", response.status);
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
            //console.log("No hay datos para mostrar en la tabla.");
            generateTable(data);
        }
    });
    get_number_counting().then((data) => {
        if (data && data.length > 0) {
            // Actualizar todos los elementos con los mismos valores en el navbar y sidebar
            /*
            document.querySelectorAll(".span_navbar_panel_reservados_cantidad_class").forEach(element => element.innerHTML = data[0].reservados);
            document.querySelectorAll(".span_navbar_panel_pagados_cantidad_class").forEach(element => element.innerHTML = data[0].pagados);
            document.querySelectorAll(".span_navbar_panel_libres_cantidad_class").forEach(element => element.innerHTML = data[0].libres);
            */
            document.querySelectorAll(".span_reservados_class").forEach(element => element.innerHTML = data[0].reservados);
            document.querySelectorAll(".span_pagados_class").forEach(element => element.innerHTML = data[0].pagados);
            document.querySelectorAll(".span_libres_class").forEach(element => element.innerHTML = data[0].libres);
        } else {
            //console.log("No hay datos para mostrar.");
            // Actualizar todos los elementos con los mismos valores en el navbar y sidebar
            document.querySelectorAll(".span_reservados_class").forEach(element => element.innerHTML = "-----");
            document.querySelectorAll(".span_pagados_class").forEach(element => element.innerHTML = "-----");
            document.querySelectorAll(".span_libres_class").forEach(element => element.innerHTML = "-----");
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





// Obtener números apartados
let arr_conteo_numeros = [];
async function get_number_counting() {
    try {
        //console.log("Se ejecutó: async function get_number_counting()");
        const response = await fetch(API_OBTENER_CONTEO_NUMEROS_URL);
        const data = await response.json();
        arr_conteo_numeros = data;

        //console.log("arr_conteo_numeros:");
        //console.log(arr_conteo_numeros);
        
        return arr_conteo_numeros;
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





// Obtener números apartados
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

    // Crea un contenedor para la tabla con scroll
    const tableWrapper = document.createElement("div");
    tableWrapper.style.maxHeight = "433px";  // Ajusta la altura máxima según necesites
    tableWrapper.style.overflowY = "auto";  // Activa el scroll vertical si la tabla es muy grande
    tableWrapper.style.border = "1px solid #ddd";  // Opcional, para darle un borde al contenedor

    // Crea la tabla
    const table = document.createElement("table");

    // Crea el encabezado
    const thead = document.createElement("thead");
    thead.id = "thead-verificador";
    thead.classList.add("theadClass_verificador");
    thead.innerHTML = `
        <tr class="thead_tr_class">
            <th><input type="checkbox" id="select-all-checkbox" class="row-checkbox-panel" style="cursor: pointer;"></th>
            <th id="header-boleto">Boleto <span id="boleto-sort" style="cursor: pointer;">↑↓</span></th>
            <th id="header-pagado">Pagado <span id="pagado-sort" style="cursor: pointer;">↑↓</span></th>
            <th id="header-nombre">Nombre <span id="nombre-sort" style="cursor: pointer;">↑↓</span></th>
            <th id="header-estado">Estado <span id="estado-sort" style="cursor: pointer;">↑↓</span></th>
            <th id="header-fecha">Fecha y Hora <span id="fecha-sort" style="cursor: pointer;">↑↓</span></th>
        </tr>
    `;
    table.appendChild(thead);

    // Crea el cuerpo de la tabla
    const tbody = document.createElement("tbody");
    tbody.id = "tbody-verificador";
    tbody.classList.add("tbodyClass_verificador");
    
    // Verificar si hay datos
    if (data.length === 0) {
        // Si no hay datos, agrega una fila con un mensaje
        const noDataRow = document.createElement("tr");
        noDataRow.classList.add("no-data-row");
        noDataRow.innerHTML = `
            <td colspan="6" class="no-data-message">No hay datos disponibles para mostrar.</td>
        `;
        tbody.appendChild(noDataRow);
    } else {
        // Generar filas con los datos
        data.forEach((item, index) => {
            const row = document.createElement("tr");

            // Agregar un id único al tr (opcional, basado en algún valor único del item)
            row.id = `tr_${item.boleto}`;

            // Agregar una clase adicional según una condición o por defecto
            row.classList.add("tbody_tr_class");
            if (item.pagado === "1") {
                row.classList.add("tr_pagado");
            } else {
                row.classList.add("tr_noPagado");
            }

            // Determina el estado y asigna la clase y el texto adecuado
            const isPaid = item.pagado === "1";
            const statusText = isPaid ? "SI" : "NO";
            const statusClass = isPaid
                ? "td_class_panel td_status_pagadoClass_panel td_pagado"
                : "td_class_panel td_status_noPagadoClass_panel td_pagado";

            const isAvailable = item.disponible === "1";
            const statusAvailableText = isAvailable ? "SI" : "NO";
            const statusAvailableClass = isAvailable
                ? "td_class_panel td_status_disponibleClass_panel td_disponible"
                : "td_class_panel td_status_noDisponibleClass_panel td_disponible";

            row.innerHTML = `
                <td class="td_class_panel td_checkbox"><input type="checkbox" class="row-checkbox-panel" id="checkbox_${item.id_boleto.toString()}" name="checkbox_${item.boleto}" data-index="${index}"></td>
                <td id="td_boleto_${item.id_boleto.toString()}" class="td_class_panel td_boleto">${item.boleto}</td>
                <td class="${statusClass}">${statusText}</td>
                <td class="td_class_panel td_nombre">${item.usuario}</td>
                <td class="td_class_panel td_estado">${item.estado}</td>
                <td class="td_class_panel td_fecha_hora">${item.fecha_creacion}</td>
            `;
            tbody.appendChild(row);
        });
    }

    table.appendChild(tbody);
    
    // Agrega la tabla dentro del contenedor con scroll
    tableWrapper.appendChild(table);
    tableContainer.innerHTML = ""; // Limpia el contenedor
    //tableContainer.appendChild(table);
    tableContainer.appendChild(tableWrapper);


    // Función para ordenar la tabla
    let ascending = true; // Variable para controlar la dirección del orden

    // Ordenar por columna
    function sortTable(column) {
        const rows = Array.from(tbody.rows);
        let sortedRows;

        switch (column) {
            case "boleto":
                sortedRows = rows.sort((a, b) => {
                    const aBoleto = parseInt(a.cells[1].textContent.trim());
                    const bBoleto = parseInt(b.cells[1].textContent.trim());
                    return ascending ? aBoleto - bBoleto : bBoleto - aBoleto;
                });
                break;
            case "pagado":
                sortedRows = rows.sort((a, b) => {
                    const aPagado = a.cells[2].textContent.trim();
                    const bPagado = b.cells[2].textContent.trim();
                    return ascending ? aPagado.localeCompare(bPagado) : bPagado.localeCompare(aPagado);
                });
                break;
            case "nombre":
                sortedRows = rows.sort((a, b) => {
                    const aNombre = a.cells[3].textContent.trim();
                    const bNombre = b.cells[3].textContent.trim();
                    return ascending ? aNombre.localeCompare(bNombre) : bNombre.localeCompare(aNombre);
                });
                break;
            case "estado":
                sortedRows = rows.sort((a, b) => {
                    const aEstado = a.cells[4].textContent.trim();
                    const bEstado = b.cells[4].textContent.trim();
                    return ascending ? aEstado.localeCompare(bEstado) : bEstado.localeCompare(aEstado);
                });
                break;
            case "fecha":
                sortedRows = rows.sort((a, b) => {
                    const aFecha = new Date(a.cells[5].textContent.trim());
                    const bFecha = new Date(b.cells[5].textContent.trim());
                    return ascending ? aFecha - bFecha : bFecha - aFecha;
                });
                break;
        }

        // Vuelve a añadir las filas ordenadas
        tbody.innerHTML = "";
        tbody.append(...sortedRows);

        // Cambia la dirección del orden para la próxima vez
        ascending = !ascending;
    }

    // Agregar eventos de ordenación en los encabezados
    document.getElementById("boleto-sort").addEventListener("click", function () {
        sortTable("boleto");
    });
    document.getElementById("pagado-sort").addEventListener("click", function () {
        sortTable("pagado");
    });
    document.getElementById("nombre-sort").addEventListener("click", function () {
        sortTable("nombre");
    });
    document.getElementById("estado-sort").addEventListener("click", function () {
        sortTable("estado");
    });
    document.getElementById("fecha-sort").addEventListener("click", function () {
        sortTable("fecha");
    });


    // Obtener el checkbox del encabezado
    const headerCheckbox = document.getElementById("select-all-checkbox");

    // Obtener todos los checkboxes de las filas
    const checkboxes_tbody = document.querySelectorAll(".tbodyClass_verificador .row-checkbox-panel");

    // Evento para marcar/desmarcar todos los checkboxes
    headerCheckbox.addEventListener("change", function () {
        checkboxes_tbody.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        countChecked(); // Actualizar botones
    });

    // Evento para actualizar el checkbox del encabezado si el usuario cambia la selección manualmente
    checkboxes_tbody.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            // Si todos los checkboxes están seleccionados, marcar el checkbox del thead; si no, desmarcarlo.
            headerCheckbox.checked = checkboxes_tbody.length > 0 && [...checkboxes_tbody].every(cb => cb.checked);
            countChecked();
        });
    });


    // Obtener todos los checkboxes
    const checkboxes = document.querySelectorAll(".row-checkbox-panel");

    // Ejecutar el evento cada vez que se presione un checkbox
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", countChecked);
    });


    // Función para contar los checkboxes seleccionados y manejar el estado de los botones
    function countChecked() {
        //const selectedCheckboxes = document.querySelectorAll(".row-checkbox-panel:checked"); // Checkboxes seleccionados
        const selectedCheckboxes = document.querySelectorAll("tbody .row-checkbox-panel:checked"); // Ahora solo busca en el tbody
        const selectedCount = selectedCheckboxes.length; // Contar los checkboxes seleccionados
        //console.log("selectedCheckboxes:");
        //console.log(selectedCheckboxes);

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
            //console.log("const row = checkbox.closest('tr'):");
            //console.log(row);
            const pagadoCell = row ? row.querySelector("td:nth-child(3)") : null; // Buscar la celda de "Pagado"

            if (pagadoCell) {
                if (pagadoCell.textContent.trim() === "SI") {
                    hasPaid = true; // Hay una fila con "Pagado = SI"
                } else if (pagadoCell.textContent.trim() === "NO") {
                    hasUnpaid = true; // Hay una fila con "Pagado = NO"
                }
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





/* Obtener los datos seleccionados, ignorando el checkbox del <th>
function getSelectedData(data) {
    console.log("function getSelectedData(data)");

    const checkboxes_verify = document.querySelectorAll('input[type="checkbox"]');
    const algunoMarcado = Array.from(checkboxes_verify).some(checkbox => checkbox.checked);
    console.log(algunoMarcado ? "Al menos uno está marcado" : "Ninguno está marcado");

    const checkboxesMarcados = document.querySelectorAll('input[type="checkbox"]:checked');
    console.log(`Checkboxes marcados: ${checkboxesMarcados.length}`);
    checkboxesMarcados.forEach(checkbox => console.log("checkbox.value: "+checkbox.value));

    // Selecciona solo los checkboxes dentro del <tbody> que estén marcados
    const checkboxes = document.querySelectorAll("tbody .row-checkbox-panel:checked");
    console.log("checkboxes:");
    console.log(checkboxes);
    const selectedData = Array.from(checkboxes).map(checkbox => {
        const index = checkbox.getAttribute("data-index");
        return data[index];
    });
    return selectedData;
}*/

// Obtener los datos seleccionados, ignorando el checkbox del <th>
function getSelectedData(data) {
    //console.log("function getSelectedData(data)");

    // Seleccionar solo los checkboxes dentro del <tbody> que estén marcados
    const checkboxes = document.querySelectorAll("tbody .row-checkbox-panel:checked");

    //console.log("checkboxes:");
    //console.log(checkboxes);

    // Mapear los checkboxes seleccionados para extraer los datos correspondientes de la fila
    const selectedData = Array.from(checkboxes).map(checkbox => {
        // Obtener la fila (tr) correspondiente al checkbox
        const row = checkbox.closest("tr");

        // Verificar que la fila se ha encontrado
        //console.log("Fila encontrada:", row);

        // Verificar los selectores de las celdas
        const boletoElement = row.querySelector('td.td_boleto'); // Busca la celda <td> con la clase td_boleto
        //console.log("Boleto element:", boletoElement);
        const statusElement = row.querySelector("td.td_status_noPagadoClass_panel, td.td_status_pagadoClass_panel"); // Como el estado de pago puede tener dos clases (td_status_noPagadoClass_panel o td_status_pagadoClass_panel), usa un selector múltiple (,)
        //console.log("Status element:", statusElement);
        const nombreElement = row.querySelector("td.td_nombre");
        //console.log("Nombre element:", nombreElement);
        const estadoElement = row.querySelector("td.td_estado");
        //console.log("Estado element:", estadoElement);
        const fechaHoraElement = row.querySelector("td.td_fecha_hora");
        //console.log("FechaHora element:", fechaHoraElement);

        // Asegurarse de que las celdas existen antes de acceder a su contenido
        const boleto = boletoElement ? boletoElement.textContent.trim() : "N/A";
        let status = statusElement ? statusElement.textContent.trim() : "N/A";
        const nombre = nombreElement ? nombreElement.textContent.trim() : "N/A";
        const estado = estadoElement ? estadoElement.textContent.trim() : "N/A";
        const fechaHora = fechaHoraElement ? fechaHoraElement.textContent.trim() : "N/A";

        if (status == "SI") {
            status = "1";
        }
        if (status == "NO") {
            status = "0";
        }
        
        const td_boleto_id = boletoElement ? boletoElement.id : null;
        //console.log("ID del td_boleto:", td_boleto_id);
        const boleto_id = td_boleto_id.split("_")[2];
        //console.log("ID del Boleto:", boleto_id);

        let obj_infoBoleto_seleccionado = {
            id_boleto: parseInt(boleto_id),
            boleto,
            pagado: status,
            nombre,
            estado,
            fechaHora
        }

        // Retornar los datos en un objeto
        return obj_infoBoleto_seleccionado;
    });

    //console.log("Datos seleccionados:");
    //console.log(selectedData);
    
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
    //const selectedData = getSelectedData(arr_numeros_apartados);
    const selectedData = getSelectedData();
    //console.log("Datos del(los) checkbox(s) seleccionado(s):");
    //console.log(selectedData);

    pagarBoletos(selectedData);
});

// Funcion para el botón "Pagado"
async function pagarBoletos (data_pagados) {

    // Obtener todos los checkboxes seleccionados
    //const selectedCheckboxes_ = document.querySelectorAll(".row-checkbox-panel:checked");
    const selectedCheckboxes_ = document.querySelectorAll("tbody .row-checkbox-panel:checked"); // Ahora solo busca en el tbody

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
            

            let arr_actualizar_boletos_conteo = [];
            arr_pago_boletos_NUMERO.forEach(element_paid => {
                arr_actualizar_boletos_conteo.push(element_paid + "_pagado");
            });

            //console.log("arr_actualizar_boletos_conteo:");
            //console.log(arr_actualizar_boletos_conteo);

            let response_actualizar_conteo_boletos = await actualizar_boletos_conteo(arr_actualizar_boletos_conteo, "pagado");

            if (response_actualizar_conteo_boletos.ok) {
                const response = await fetch(API_PAGAR_NUMEROS_APARTADOS_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        received_array_ticketsPagados_ID: arr_pago_boletos_ID,
                        received_array_ticketsPagados_NUMERO: arr_pago_boletos_NUMERO,
                    }),
                });

                if (response.ok) {
                    const data = await response.json(); // Leer la respuesta JSON
                    //console.log("Datos recibidos:", data);
                    openModal_personalizado("<p>Se han puesto como pagados los boletos seleccionados.</p>");

                    // Recorre el array y actualiza los boletos correspondientes a pagado
                    arr_numeros_apartados.forEach(boleto => {
                        if (arr_pago_boletos_ID.includes(boleto.id_boleto)) {
                            boleto.pagado = "1";
                        }
                    });

                    // Muestra los cambios de los boletos que se pasaron a "1" que significa "Pagado"
                    //console.log("Boleto(s) actualizado(s) a '1'(Pagado):", arr_numeros_apartados.filter(boleto => arr_pago_boletos_ID.includes(boleto.id_boleto)));

                    
                    // Obtener todos los checkboxes seleccionados
                    //const selectedCheckboxes = document.querySelectorAll(".row-checkbox-panel:checked");
                    const selectedCheckboxes = document.querySelectorAll("tbody .row-checkbox-panel:checked"); // Ahora solo busca en el tbody

                    // Recorrer los checkboxes seleccionados
                    selectedCheckboxes.forEach((checkbox) => {
                        // Encontrar la fila correspondiente al checkbox
                        const row = checkbox.closest("tr");

                        // Encontrar la celda de la columna "Pagado"
                        const pagadoCell = row.querySelector("td:nth-child(3)");

                        // Cambiar el texto a "SI"
                        pagadoCell.textContent = "SI";

                        // Cambiar la clase para reflejar el cambio visualmente
                        pagadoCell.className = "td_class_panel td_status_pagadoClass_panel td_pagado";
                    });

                    // Funcion que desmarca todos los checkboxes
                    uncheckAllCheckboxes();
                }
                if (!response.ok) {
                    console.error("Error en la solicitud:", response.status);
                }
            }

            if (!response_actualizar_conteo_boletos.ok) {
                console.error("Error en la solicitud - API_ACTUALIZAR_CONTEO_NUMEROS_URL:", response_actualizar_conteo_boletos.status);
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
    //const selectedData = getSelectedData(arr_numeros_apartados);
    const selectedData = getSelectedData();
    //console.log("Boton eliminar pago: Datos del(los) checkbox(s) seleccionado(s):");
    //console.log(selectedData);

    eliminarPagoBoletos(selectedData);
});

// Funcion para el botón "Eliminar Pago"
async function eliminarPagoBoletos (data_eliminarPago) {

    // Obtener todos los checkboxes seleccionados
    //const selectedCheckboxes_ = document.querySelectorAll(".row-checkbox-panel:checked");
    const selectedCheckboxes_ = document.querySelectorAll("tbody .row-checkbox-panel:checked"); // Ahora solo busca en el tbody

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


            let arr_actualizar_boletos_conteo = [];
            arr_eliminar_pago_boletos_NUMERO.forEach(element_deletePaid => {
                arr_actualizar_boletos_conteo.push(element_deletePaid + "_pagoBorrado");
            });

            //console.log("arr_actualizar_boletos_conteo:");
            //console.log(arr_actualizar_boletos_conteo);

            let response_actualizar_conteo_boletos = await actualizar_boletos_conteo(arr_actualizar_boletos_conteo, "Eliminar_Pago");

            if (response_actualizar_conteo_boletos.ok) {
                const response = await fetch(API_ELIMINAR_PAGO_NUMEROS_APARTADOS_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        received_arr_eliminar_pago_boletos_ID: arr_eliminar_pago_boletos_ID,
                        received_arr_eliminar_pago_boletos_NUMERO: arr_eliminar_pago_boletos_NUMERO,
                    }),
                });

                if (response.ok) {
                    const data = await response.json(); // Leer la respuesta JSON
                    //console.log("Datos recibidos:", data);
                    openModal_personalizado("<p>Se ha borrado el pago de los boletos seleccionados.</p>");

                    // Recorre el array y actualiza los boletos correspondientes a pagado
                    arr_numeros_apartados.forEach(boleto => {
                        if (arr_eliminar_pago_boletos_ID.includes(boleto.id_boleto)) {
                            boleto.pagado = "0";
                        }
                    });

                    // Muestra los cambios de los boletos que se pasaron a "0" que significa "No Pagado"
                    //console.log("Boleto(s) actualizado(s) a '0'(No Pagado):", arr_numeros_apartados.filter(boleto => arr_eliminar_pago_boletos_ID.includes(boleto.id_boleto)));


                    // Obtener todos los checkboxes seleccionados
                    //const selectedCheckboxes = document.querySelectorAll(".row-checkbox-panel:checked");
                    const selectedCheckboxes = document.querySelectorAll("tbody .row-checkbox-panel:checked"); // Ahora solo busca en el tbody

                    // Recorrer los checkboxes seleccionados
                    selectedCheckboxes.forEach((checkbox) => {
                        // Encontrar la fila correspondiente al checkbox
                        const row = checkbox.closest("tr");

                        // Encontrar la celda de la columna "Pagado"
                        const pagadoCell = row.querySelector("td:nth-child(3)");

                        // Cambiar el texto a "NO"
                        pagadoCell.textContent = "NO";

                        // Cambiar la clase para reflejar el cambio visualmente
                        pagadoCell.className = "td_class_panel td_status_noPagadoClass_panel td_pagado";
                    });

                    // Funcion que desmarca todos los checkboxes
                    uncheckAllCheckboxes();
                }
                if (!response.ok) {
                    console.error("Error en la solicitud:", response.status);
                }
            }

            if (!response_actualizar_conteo_boletos.ok) {
                console.error("Error en la solicitud - API_ACTUALIZAR_CONTEO_NUMEROS_URL:", response_actualizar_conteo_boletos.status);
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
    //console.log('document.getElementById("btn_eliminarApartado_panel").addEventListener("click", () =>{');
    //const selectedData = getSelectedData(arr_numeros_apartados);
    const selectedData = getSelectedData();
    //console.log("Datos del(los) checkbox(s) seleccionado(s):");
    //console.log(selectedData);
    
    eliminarApartadoBoletos(selectedData);
});

// Funcion para el botón "Eliminar Pago"
async function eliminarApartadoBoletos (data_eliminarApartado) {
    //console.log("Datos seleccionados - data_eliminarApartado:");
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


        let arr_actualizar_boletos_conteo = [];
        arr_eliminar_apartado_boletos_NUMERO.forEach(element_deleteTicket => {
            //console.log("element_deleteTicket:");
            //console.log(element_deleteTicket);
            let tr_id = "tr_" + element_deleteTicket;
            //console.log("tr_id:");
            //console.log(tr_id);
            let tr_fila_boleto = document.getElementById(tr_id); // Buscar el <tr> por su id
            //console.log("tr_fila_boleto:");
            //console.log(tr_fila_boleto);
            // Busca dentro del <tr> el <td> con la clase "td_pagado"
            const tdPagado = tr_fila_boleto.querySelector(".td_pagado");
            //console.log("tdPagado:");
            //console.log(tdPagado);
            // Obtén el texto dentro del <td>
            const valor_tdPagado = tdPagado.textContent.trim().toUpperCase();
            //console.log("valor_tdPagado:");
            //console.log(valor_tdPagado);
            if (valor_tdPagado == "SI") {
                arr_actualizar_boletos_conteo.push(element_deleteTicket + "_boletoLiberado_pagado");
            }
            if (valor_tdPagado == "NO") {
                arr_actualizar_boletos_conteo.push(element_deleteTicket + "_boletoLiberado_noPagado");
            }

        });

        //console.log("arr_actualizar_boletos_conteo:");
        //console.log(arr_actualizar_boletos_conteo);

        let response_actualizar_conteo_boletos = await actualizar_boletos_conteo(arr_actualizar_boletos_conteo, "Eliminar_Apartado");

        if (response_actualizar_conteo_boletos.ok) {
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
                const data = await response.json(); // Leer la respuesta JSON
                //console.log("Datos recibidos:", data);
                openModal_personalizado("<p>Se ha eliminado el apartado de los boletos seleccionados.</p>");

                // Eliminar dinamicamente la fila del boleto de la tabla HTML
                arr_eliminar_apartado_boletos_NUMERO.forEach(boleto => {
                    let tr_fila_boleto = document.getElementById("tr_"+boleto); // Buscar el <tr> por su id
                    if (tr_fila_boleto) {
                        tr_fila_boleto.remove(); // Eliminar el <tr>
                        //console.log(`Se eliminó el boleto: ${boleto}`);
                    } else {
                        //console.log(`No se encontró el boleto: ${boleto}`);
                    }
                });

                // Filtra el array para conservar solo los boletos que NO estén en arr_eliminar_apartado_boletos_ID
                arr_numeros_apartados = arr_numeros_apartados.filter(boleto => !arr_eliminar_apartado_boletos_ID.includes(boleto.id_boleto));

                //console.log("Array actualizado después de eliminar los boletos selecionados:", arr_numeros_apartados);

                // Funcion que desmarca todos los checkboxes
                uncheckAllCheckboxes();
            }
            if (!response.ok) {
                openModal_personalizado("<p>Oopss! Ocurrio un error al eliminar el apartado de los boletos seleccionados.</p>");
                console.error("Error en la solicitud:", response.status);
            }
        }

        if (!response_actualizar_conteo_boletos.ok) {
            console.error("Error en la solicitud - API_ACTUALIZAR_CONTEO_NUMEROS_URL:", response_actualizar_conteo_boletos.status);
        }
            
    } else {
        //openModal_personalizado("<p class='p_description1_boletos_modal_panel'>Se han seleccionados boletos que ya estan en <label class='label_pagados_modal_panel'>no pagados</label>.</p> <p class='p_description2_boletos_modal_panel'>Por favor deseleccionalos para continuar.</p> <p class='p_label_boletos_modal_panel'>BOLETOS:</p> <p class='p_data_boletos_modal_panel'>"+JSON.stringify(arr_boletos_ya_NoPagados)+"</p>");
    }
}



// Desmarca todos los checkboxes, tanto los que estan en el "tbody" como el que esta en el "thead"
function uncheckAllCheckboxes() {
    // Desmarcar solo los checkboxes del tbody
    document.querySelectorAll("tbody .row-checkbox-panel:checked").forEach(checkbox => {
        checkbox.checked = false;
    });

    // Actualizar el checkbox general del thead
    const headerCheckbox = document.getElementById("select-all-checkbox");
    if (headerCheckbox) {
        headerCheckbox.checked = false;
    }

    // Botones a controlar
    const btnDetalles = document.getElementById("btn_detalles_panel");
    const btnPagado = document.getElementById("btn_pagado_panel");
    const btnEliminarPago = document.getElementById("btn_eliminarPago_panel");
    const btnEliminarApartado = document.getElementById("btn_eliminarApartado_panel");

    btnDetalles.disabled = true;
    btnPagado.disabled = true;
    btnEliminarPago.disabled = true;
    btnEliminarApartado.disabled = true;
}





async function actualizar_boletos_conteo(arr_boletos, boton_click) {
    // Hacer una solicitud al servidor
    const response_updateCountingTickets = await fetch(API_ACTUALIZAR_CONTEO_NUMEROS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arr_boletos),
    });

    if (response_updateCountingTickets.ok) {
        //console.log("Correcto - API_ACTUALIZAR_CONTEO_NUMEROS_URL:");
        const data = await response_updateCountingTickets.json(); // Leer la respuesta JSON
        //console.log("Datos recibidos:", data);
        
        // Actualizar todos los elementos con los mismos valores en el navbar y sidebar
        /*
        document.querySelectorAll(".span_navbar_panel_reservados_cantidad_class").forEach(element => element.innerHTML = data.reserved_numbers_actualizado);
        document.querySelectorAll(".span_navbar_panel_pagados_cantidad_class").forEach(element => element.innerHTML = data.paid_numbers_actualizado);
        document.querySelectorAll(".span_navbar_panel_libres_cantidad_class").forEach(element => element.innerHTML = data.free_numbers_actualizado);
        */
        document.querySelectorAll(".span_reservados_class").forEach(element => element.innerHTML = data.reserved_numbers_actualizado);
        document.querySelectorAll(".span_pagados_class").forEach(element => element.innerHTML = data.paid_numbers_actualizado);
        document.querySelectorAll(".span_libres_class").forEach(element => element.innerHTML = data.free_numbers_actualizado);
    }
    if (!response_updateCountingTickets.ok) {
        //console.log("Error - API_ACTUALIZAR_CONTEO_NUMEROS_URL:");
        console.error("Error en la solicitud:", response_updateCountingTickets.status);
        
        // Actualizar todos los elementos con los mismos valores en el navbar y sidebar
        document.querySelectorAll(".span_reservados_class").forEach(element => element.innerHTML = "-----");
        document.querySelectorAll(".span_pagados_class").forEach(element => element.innerHTML = "-----");
        document.querySelectorAll(".span_libres_class").forEach(element => element.innerHTML = "-----");
    }
    return response_updateCountingTickets;
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








