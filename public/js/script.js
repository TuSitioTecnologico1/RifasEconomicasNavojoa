// URLs del servidor backend
//const config_API = config_local;
const config_API = config;

const API_URL = config_API.URL;
const API_STATES_URL = config_API.STATES_URL;
const API_GET_STATES_URL = config_API.GET_STATES_URL;
const API_BUSCAR_URL = config_API.BUSCAR_URL;
const API_CAMBIAR_ESTADO_NUMEROS_URL = config_API.CAMBIAR_ESTADO_NUMEROS_URL;
const API_SAVE_PERSON_DATA_URL = config_API.SAVE_PERSON_DATA_URL;
const API_ADQUIRIR_BOLETO_URL = config_API.ADQUIRIR_BOLETO_URL;
const API_NUMEROS_PAGINACION_URL = config_API.NUMEROS_PAGINACION_URL;
const API_GEOLOCALIZACION_URL = config_API.GEOLOCALIZACION_URL;

/*
console.log("API_URL: "+API_URL);
console.log("API_STATES_URL: "+API_STATES_URL);
console.log("API_GET_STATES_URL: "+API_GET_STATES_URL);
console.log("API_BUSCAR_URL: "+API_BUSCAR_URL);
console.log("API_SAVE_PERSON_DATA_URL: "+API_SAVE_PERSON_DATA_URL);
console.log("API_ADQUIRIR_BOLETO_URL: "+API_ADQUIRIR_BOLETO_URL);
*/

// Elementos o Referencias del DOM
const numberGrid = document.getElementById("number-grid");
const luckMachineModal = document.getElementById("luck-machine-modal");
const closeModalBtn = document.getElementById("close-modal");
const randomBtn = document.getElementById("random-btn");
//const generateBtn = document.getElementById("generate-btn");
const ticketCountSelect = document.getElementById("ticket-count");
const generatedTicketsDiv = document.getElementById("generated-tickets");
const ticketCountText = document.getElementById("ticket-count-text");
const divTicketCountText = document.getElementById("div_ticket-count-text");
const slotMachine = document.getElementById("slot-machine");
const search_btn = document.getElementById('search-btn');
const div_responseSearch = document.getElementById('div_responseSearch');
const chooseNumber_btn = document.getElementById('chooseNumber-btn');
const div_btnMaquinitaSuerte = document.getElementById('div_btnMaquinitaSuerte');
const div_btnElegir = document.getElementById('div_btnElegir');
const div_br = document.getElementById('div_br');
const input_search = document.getElementById('search');
const reserve_btn = document.getElementById('reserve-btn');
const div_selected_tickets_section = document.getElementById('div_selected_tickets_section');
let div_total_selectedTickets_section = document.getElementById('div_total_selectedTickets_section');
const div_text_selectedTickets_section = document.getElementById('div_text_selectedTickets_section');
const span_ticketAvalaible = document.getElementById('span_ticketAvalaible');
const reserve_tickets_section_btn = document.getElementById('reserve-tickets-section-btn');
const div_selected_tickets_container = document.getElementById('div_selected_tickets_container');
const div_ticket_count_container = document.getElementById('div_ticket_count_container');
const div_ticket_count_section = document.getElementById('div_ticket_count_section');
const div_ticket_text = document.getElementById('div_ticket_text');
const person_data_modal = document.getElementById("person-data-modal");
const close_person_modal = document.getElementById("close-person-modal");
const input_numberWhatsApp = document.getElementById("phone");
const main_content = document.getElementById("main-content");
const div_load = document.getElementById("load");
const div_reserveTickets = document.getElementById("div_reserveTickets");
const catidad_boletos_seleccionados_modal_person = document.getElementById("catidad_boletos_seleccionados_modal_person");
const apartar_modal_person_btn = document.getElementById("apartar_modal_person_btn");
const input_modal_whatsapp = document.getElementById("phone");
const input_modal_name = document.getElementById("name");
const input_modal_last_name = document.getElementById("lastname");
const input_modal_select_states = document.getElementById("select_states");
const reserve_tickets_modalPerson = document.getElementById("reserve-tickets-modalPerson");
const redirect_to_whatsapp_modalPerson = document.getElementById("redirect-to-whatsapp-modalPerson");
const darkModeToggle = document.getElementById('dark-mode-toggle');
const form_person_modal = document.getElementById('form_personModal');
const p_modal_person = document.getElementById('p_modal_person');
const p2_modal_person = document.getElementById('p2_modal_person');
const load_2 = document.getElementById('load_2');

// Mostrar el modal si no hay permiso de ubicación
const locationModal = document.getElementById('locationModal');
const content_page = document.getElementById('content_page');
const enableLocationButton = document.getElementById('enableLocation');
const activate_desactivate_function_checkLocation = 1;





function checkLocationPermissionAndGetData() {
    try {
        //console.log("function checkLocationPermissionAndGetData()");
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
                    //const data = await response.json();
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
                        luckMachineModal.style.display = "none";

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



/*
function checkLocationPermission() {
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

            // Obtener la latitud y longitud
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const accuracy = position.coords.accuracy; // Precisión en metros

            let geolocationData = {
                latitude,
                longitude,
                accuracy
            };

            console.log("geolocationData:");
            console.log(geolocationData);

            return geolocationData;

        }, 
        async function (error) {
            //console.log("error: "+JSON.stringify(error));
            //console.log("Error obteniendo la ubicación: " + error.message);
            // Si el usuario rechaza o hay un error
            if (error.code === error.PERMISSION_DENIED) {
                locationModal.style.display = 'block';
                luckMachineModal.style.display = "none";

                alert('Debes activar la ubicación para acceder al sitio.');
                return;
            }
        }, options);
    } else {
        //console.log("Geolocalización no disponible en este navegador.");
        locationModal.style.display = 'block';
        alert('Tu navegador no soporta la geolocalización.');
        return;
    }
}
*/



/* Mostrar el modal al cargar la página
window.onload = () => {
    locationModal.style.display = 'block';
};*/

// Vincular la acción del botón a la solicitud de ubicación
enableLocationButton.addEventListener('click', function() {
    checkLocationPermissionAndGetData();
});



document.addEventListener("DOMContentLoaded", function () {
    if (activate_desactivate_function_checkLocation == 1) {
        checkLocationPermissionAndGetData();
    }
    div_br.innerHTML = '<br><br>';
    getStates();
    let arr_numeros = [];
    initialize();
    //load_navbar();
    //localStorage.clear();
    //console.log(localStorage.getItem('dark-mode'));
});


/*
function load_navbar () {
    try {
        fetch('/pages/navbar3.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('navbar_3').innerHTML = data;
            })
            .catch(error => console.error('Error al cargar el navbar:', error));
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "function load_navbar ()",
            message_error
        };
        console.log(errorObj);
    }
    
}
*/





/*
function toggleMenu() {
    const menu = document.querySelector('.navbar ul');
    menu.classList.toggle('active');
}

var contador = 1;

function navbarMenu (){
    //console.log("menuBar.addEventListener('click', function () {");
    const nav = document.querySelector('nav');

    //console.log("contador:");
    //console.log(contador);

    if (contador === 1) {
        // Deslizar el menú desde la izquierda
        nav.style.transition = 'left 0.3s ease';
        nav.style.left = '0';
        contador = 0;
    } else {
        contador = 1;
        // Ocultar el menú moviéndolo hacia la izquierda
        nav.style.transition = 'left 0.3s ease';
        nav.style.left = '-100%';
    }

    // Mostrar y ocultar submenús
    const submenus = document.querySelectorAll('.submenu');
    
    submenus.forEach(function(submenu) {
        submenu.addEventListener('click', function () {
            const children = submenu.querySelector('.children');
            if (children) {
                children.style.display = (children.style.display === 'none' || children.style.display === '') ? 'block' : 'none';
            }
        });
    });
}

// Asegura el estado del menú al redimensionar la pantalla
window.addEventListener('resize', () => {
    const nav = document.querySelector('.navbar_menu');
    const screenWidth = window.innerWidth;

    if (screenWidth >= 950) {
        nav.style.left = '0'; // Mantener visible en pantallas grandes
    } else {
        nav.style.left = '-100%'; // Ocultar en pantallas pequeñas
    }
});
*/






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



function load_data () {
    try {
        main_content.style = "";
        div_load.removeAttribute("class");
        div_load.innerHTML = "";
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "function load_data ()",
            message_error
        };
        console.log(errorObj);
    }
    
}



async function initialize() {
    try {
        //console.log("Haz entrado a: async function initialize() ");
        // Obtener números de la API
        await getNumbers();

        // Calcular columnas iniciales
        calculateGrid();

        // Renderizar la cuadrícula inicial
        renderVirtualGrid();

        // Escuchar cambios de tamaño de ventana
        window.addEventListener("resize", () => {
            calculateGrid();
            renderVirtualGrid();
        });
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "async function initialize()",
            message_error
        };
        console.log(errorObj);
    }
    
}




// Obtener números 
async function getNumbers() {
    try {
        //console.log("Se ejecutó: async function getNumbers()");
        const response = await fetch(API_URL);
        const data = await response.json();
        //arr_numeros = data;
        arr_numeros = data.filter(item => item.visible === 1); // Filtrar solo los visibles

        //console.log("arr_numeros:");
        //console.log(arr_numeros);
        
        //calculateGrid();
        //renderVirtualGrid();
        load_data ();
        
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




//const itemWidth = 60; // Ancho de cada número en px
//const itemHeight = 40; // Alto de cada número en px
//const visibleRows = 10; // Cantidad de filas visibles en el viewport
//const containerWidth = 900; // Ancho del contenedor en px (ajústalo según tu diseño)

const itemWidth = 60; // Ancho de cada número en px
const itemHeight = 40; // Alto de cada número en px
const visibleRows = 10; // Cantidad de filas visibles en el viewport
let itemsPerRow = 0; // Cantidad de elementos por fila (calculado dinámicamente)

// Calcular el número de columnas dinámicamente
function calculateGrid() {
    try {
        const numberGrid = document.getElementById("number-grid");
        const containerWidth = numberGrid.offsetWidth; // Ancho actual del contenedor
        itemsPerRow = Math.floor(containerWidth / itemWidth); // Recalcular columnas
        if (itemsPerRow < 1) itemsPerRow = 1; // Asegurarse de que haya al menos una columna
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "function calculateGrid()",
            message_error
        };
        console.log(errorObj);
    }
        
}

// Renderizado virtual
function renderVirtualGrid() {
    try {
        const numberGrid = document.getElementById("number-grid");

        // Crear un espacio ficticio para el scroll
        const totalRows = Math.ceil(arr_numeros.length / itemsPerRow);
        const totalHeight = totalRows * itemHeight;

        // Crear un espaciador para habilitar el scroll
        const spacer = document.createElement("div");
        spacer.style.height = `${totalHeight}px`;
        numberGrid.innerHTML = ""; // Limpiar el contenedor
        numberGrid.appendChild(spacer);

        const renderContainer = document.createElement("div");
        renderContainer.classList.add("virtual-grid");
        numberGrid.appendChild(renderContainer);

        // Manejo de scroll y render inicial
        numberGrid.addEventListener("scroll", () => {
            //console.log("scroll");
            //console.log(numberGrid);
            //console.log("---------------------------------------------------------");
            renderItems(numberGrid, renderContainer);
        });
        renderItems(numberGrid, renderContainer); // Render inicial
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "function renderVirtualGrid()",
            message_error
        };
        console.log(errorObj);
    }
        
}


// Objeto para almacenar los boletos seleccionados
let seleccionados = {};  // Usamos un objeto para recordar el estado de los boletos

// Renderiza los números visibles en la cuadrícula
function renderItems(numberGrid, renderContainer) {
    try {
        const scrollTop = numberGrid.scrollTop;
        const startRow = Math.floor(scrollTop / itemHeight);
        const endRow = startRow + visibleRows + 2; // Renderiza filas adicionales para evitar parpadeos
        const startIdx = startRow * itemsPerRow;
        const endIdx = Math.min(endRow * itemsPerRow, arr_numeros.length);

        renderContainer.innerHTML = ""; // Limpia el contenedor antes de renderizar

        for (let i = startIdx; i < endIdx; i++) {
            const item = arr_numeros[i];
            const numberDiv = document.createElement("div");
            //numberDiv.className = "number virtual-item";
            numberDiv.classList.add("number", "virtual-item", item.disponible ? "available" : "sold");
            numberDiv.id = "ticket_" + item.id;
            numberDiv.textContent = item.numero;

            // Posicionar el elemento dentro de la cuadrícula
            const row = Math.floor(i / itemsPerRow);
            const col = i % itemsPerRow;

            // Asegurar que los elementos no sobrepasen el ancho del contenedor
            const offsetX = col * itemWidth;
            if (offsetX + itemWidth > numberGrid.offsetWidth) {
                continue; // Evitar renderizar elementos fuera del contenedor
            }

            numberDiv.style.transform = `translate(${offsetX}px, ${row * itemHeight}px)`;

            // Estilos basados en `disponible` y estado de selección
            if (item.disponible === 0) {
                numberDiv.style.backgroundColor = "#ffcccc"; // Rojo para no disponible
                numberDiv.style.cursor = "not-allowed";
            } else if (seleccionados[item.id]) {
                numberDiv.style.backgroundColor = "#fff938"; // Amarillo para seleccionado
                numberDiv.style.cursor = "pointer";
            } else {
                numberDiv.style.backgroundColor = "#ccffcc"; // Verde para disponible
                numberDiv.style.cursor = "pointer";
            }

            // Evento de clic en números disponibles
            if (item.disponible) { // Comprobar si el número está disponible
                numberDiv.addEventListener("click", () => {
                    //console.log("seleccionados:");
                    //console.log(seleccionados);
                    // Marcar el boleto como seleccionado o desmarcarlo
                    if (seleccionados[item.id]) {
                        //delete seleccionados[item.id]; // Desmarcar si ya estaba seleccionado
                        //numberDiv.style.backgroundColor = "#ccffcc"; // Volver a verde si se desmarca
                    } else {
                        seleccionados[item.id] = true; // Marcar como seleccionado
                        //numberDiv.style.pointerEvents = "none";
                        numberDiv.style.backgroundColor = "#fff938"; // Cambiar el color a Amarillo cuando se selecciona
                    }
                    // Aquí puedes llamar a cualquier función que necesites para procesar la selección
                    elegir_boleto_cuadricula_para_seleccionados(item.id, item.numero);
                });
            }

            renderContainer.appendChild(numberDiv);
        }
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "function renderItems(numberGrid, renderContainer)",
            message_error
        };
        console.log(errorObj);
    }
        
}









/* Obtener números desde el backend
async function fetchNumbers() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderNumbers(data);
    } catch (error) {
        console.log("error_en_fetchNumbers(): "+error);
    }
    
}


// Renderizar números en la cuadrícula
function renderNumbers(numbers) {
    numberGrid.innerHTML = ""; // Limpiar la cuadrícula
    //console.log("function renderNumbers(numbers) - numbers:");
    //console.log(numbers);
    numbers.forEach((num) => {
        const numberElement = document.createElement("div");
        numberElement.classList.add("number", num.disponible ? "available" : "sold");
        numberElement.id = "ticket_"+num.id;
        numberElement.textContent = num.numero;

        // Cambiar a vendido al hacer clic
        if (num.disponible) {
            numberElement.addEventListener("click", () => {
                //markAsSold(num.id);
                //let numero_seleccionado_cuadricula = numberElement.getElementById("ticket_"+num.id);
                numberElement.style.backgroundColor = "#94c33d"; // Cambiar el color del ticket seleccionado en la cuadricula
                //numberElement.classList.replace('available', 'reserved');
                elegir_boleto_cuadricula_para_seleccionados(num.id, num.numero);
            });
        }
        numberGrid.appendChild(numberElement);
        load_data(); // Oculta la animacion de carga de boletos
    });
}
*/


/*
let currentPage = 1;  // Página inicial
let totalPages = 0;   // Total de páginas
const limit = 10000;    // Número de boletos por página

// Obtener números desde el backend
async function fetchNumbers(page) {
    try {
        const response = await fetch(API_NUMEROS_PAGINACION_URL+`?page=${page}&limit=${limit}`);
        const data = await response.json();
        const numbers = data.numbers;
        totalPages = data.totalPages;  // Total de páginas
        renderNumbers(numbers);
        renderPagination(page);
    } catch (error) {
        console.error("Error al obtener números:", error);
    }
}
*/


/* Renderizar los números en la cuadrícula
function renderNumbers(numbers) {
    const numberGrid = document.getElementById("number-grid");
    numberGrid.innerHTML = "";  // Limpiar los boletos existentes

    numbers.forEach((num) => {
        const numberElement = document.createElement("div");
        numberElement.classList.add("number", num.disponible ? "available" : "sold");
        numberElement.id = `ticket_${num.id}`;
        numberElement.textContent = num.numero;

        // Cambiar a vendido al hacer clic
        if (num.disponible) {
            numberElement.addEventListener("click", () => {
                numberElement.style.backgroundColor = "#94c33d";  // Cambiar color del boleto seleccionado
                elegir_boleto_cuadricula_para_seleccionados(num.id, num.numero);
            });
        }
        numberGrid.appendChild(numberElement);
        load_data(); // Oculta la animacion de carga de boletos
    });
}*/


/*
function renderNumbers(numbers) {
    const numberGrid = document.getElementById("number-grid");
    numberGrid.innerHTML = "";  // Limpiar los boletos existentes

    numbers.forEach((num) => {
        const numberElement = document.createElement("div");
        numberElement.classList.add("number", num.disponible ? "available" : "sold");
        numberElement.id = `ticket_${num.id}`;
        numberElement.textContent = num.numero;

        // Cambiar a vendido al hacer clic
        if (num.disponible) {
            numberElement.addEventListener("click", () => {
                numberElement.style.backgroundColor = "#94c33d";  // Cambiar color del boleto seleccionado
                elegir_boleto_cuadricula_para_seleccionados(num.id, num.numero);
            });
        }
        numberGrid.appendChild(numberElement);
        load_data(); // Oculta la animacion de carga de boletos
    });
}



// Renderizar la paginación (numeración de las páginas)
function renderPagination(currentPage) {
    const paginationContainer = document.getElementById("pagination");

    // Limpiar la paginación anterior
    paginationContainer.innerHTML = "";

    // Botón "Anterior"
    const prevButton = document.createElement("button");
    prevButton.innerText = "Anterior";
    prevButton.onclick = () => changePage(-1);
    prevButton.disabled = currentPage === 1;
    paginationContainer.appendChild(prevButton);

    /* Botones de número de página
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.innerText = i;
        pageButton.onclick = () => changePageTo(i);
        pageButton.disabled = i === currentPage;
        paginationContainer.appendChild(pageButton);
    }*

    // Botón "Siguiente"
    const nextButton = document.createElement("button");
    nextButton.innerText = "Siguiente";
    nextButton.onclick = () => changePage(1);
    nextButton.disabled = currentPage === totalPages;
    paginationContainer.appendChild(nextButton);
}



// Cambiar de página (anterior/siguiente)
function changePage(direction) {
    currentPage += direction;  // Aumentar o disminuir la página
    fetchNumbers(currentPage);  // Obtener boletos de la nueva página
}



// Cambiar a una página específica
function changePageTo(page) {
    currentPage = page;
    fetchNumbers(currentPage);  // Obtener boletos de la página seleccionada
}



// Inicializar con la primera página de boletos
fetchNumbers(currentPage);
*/


function elegir_boleto_cuadricula_para_seleccionados(id_boleto, numero_boleto) {
    try {
        //console.log("Haz entrado a: function elegir_boleto_cuadricula_para_seleccionados(id_boleto, numero_boleto) ");
        //console.log("id_boleto:");
        //console.log(id_boleto);
        //console.log("numero_boleto:");
        //console.log(numero_boleto);
        const total_div_selected_tickets = div_selected_tickets_section.querySelectorAll("div"); // Selecciona todos los div dentro

        if (total_div_selected_tickets.length >= 1) { // Verifica si almenos hay un boleto seleccionado
            for (let i = 0; i < total_div_selected_tickets.length; i++) { // Recorre los boletos seleccionados
                const div_value = total_div_selected_tickets[i].innerText; // Obtiene el valor del DIV(en este caso el numero del boleto) en la posicion i(0,1,2,3..., etc)
                if (div_value == numero_boleto) { // Verifica si el boleto elegido de la cuadricula ya existe entre los boletos seleccionados
                    alert('Ya haz seleccionado este boleto.');
                    return;
                }
            }
        }

        let style_divSelectedTicketsSection = `
            width: 50px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #7fc241;
            font-weight: bold;
            cursor: pointer;
            font-size: 13px;
            border-radius: 5px;
            text-align: center;`;
        
        //div_selected_tickets_section.setAttribute("style", style_divSelectedTicketsSection);
        div_selected_tickets_section.innerHTML += '<div id="div_selected_tickets_ticketID_'+id_boleto+'" class="div_selected_spanTicket" style="'+style_divSelectedTicketsSection+'">'+numero_boleto+'</div>';
        
        let total_div_selected_tickets2 = div_selected_tickets_section.querySelectorAll("div"); // Selecciona todos los div dentro
        
        if (total_div_selected_tickets2.length == 1) {
            div_total_selectedTickets_section.innerHTML = total_div_selected_tickets2.length+ ' BOLETO SELECCIONADO'
        }else{
            div_total_selectedTickets_section.innerHTML = total_div_selected_tickets2.length+ ' BOLETOS SELECCIONADOS'
        }
        
        div_text_selectedTickets_section.innerHTML = 'Para eliminar haz click en el boleto';
        div_reserveTickets.style = "";
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "function elegir_boleto_cuadricula_para_seleccionados(id_boleto, numero_boleto)",
            message_error
        };
        console.log(errorObj);
    }
        
}



/* Cargar estados desde la BD
async function getStates() {
    try {
        const response = await fetch(API_GET_STATES_URL);
        const data = await response.json();
        //console.log("async function getStatesBD() - data: ");
        //console.log(data);
        return data;
    } catch (error) {
        console.log("error_en_getStates(): "+error);
    }
}
*/
// Función para realizar la consulta a la API que llena el arreglo
function getStates() {
    try {
        fetch(API_GET_STATES_URL)
            .then(response => response.json())
            .then(data => {
                //console.log('Estados cargados:', data);
                // Aquí puedes manipular los datos como necesites, por ejemplo, mostrarlos en la página.
            })
            .catch(error => {
                console.error('Error al obtener los estados:', error);
            });
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "function getStates()",
            message_error
        };
        console.log(errorObj);
    }
        
}



// Obtener estados desde el backend
async function get_API_States() {
    try {
        const response = await fetch(API_STATES_URL);
        const data = await response.json();
        //console.log("async function get_API_States() - data: ");
        //console.log(data);
        return data;
    } catch (error) {
        //console.log("error_en_get_API_States(): "+error);
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "function get_API_States()",
            message_error
        };
        console.log(errorObj);
    }
    
}



// Marcar número como vendido
async function markAsSold(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            alert("Número vendido con éxito.");
            fetchNumbers(); // Volver a cargar los números
        }
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "function markAsSold(id)",
            message_error
        };
        console.log(errorObj);
    }
    
}



// Abrir el modal
randomBtn.addEventListener("click", () => {
    checkLocationPermission();
    luckMachineModal.style.display = "block";
});



// Cerrar el modal
closeModalBtn.addEventListener("click", () => {
    luckMachineModal.style.display = "none";
    //boletosModal_para_boletosSeleccionados();
    reset_modal();
});



close_person_modal.addEventListener("click", () => {
    person_data_modal.style.display = "none";
    form_person_modal.reset();
    reserve_tickets_modalPerson.style = "";
    redirect_to_whatsapp_modalPerson.style.display = "none";
    p_modal_person.innerHTML = "¡Al finalizar serás redirigido a whatsapp para enviar la información de tu boleto!";
    p2_modal_person.innerHTML = "";
    p2_modal_person.style.display = "none";
});



// Reestablecer el modal
async function reset_modal () {
    var selectValue = ticketCountSelect.value; // Obtiene el valor del option seleccionado
    //console.log(ticketCountSelect);

    div_ticket_text.innerHTML = "";
    div_ticket_text.innerHTML = 'HAZ CLICK AQUÍ PARA GENERAR <span id="ticket-count-text">'+selectValue+'</span> BOLETO(S) AL AZAR';
    div_ticket_text.style = "";
    div_ticket_count_section.innerHTML = "";
    div_ticket_count_container.style.border = "";
    reserve_btn.style.display = 'none';
}



// Actualizar texto según la cantidad seleccionada
ticketCountSelect.addEventListener("change", () => {
    ticketCountText.textContent = ticketCountSelect.value;
});



// Generar boletos aleatorios
generatedTicketsDiv.addEventListener("click", async () => {
    try {
        let getGeolocationData = await checkLocationPermission();
        //console.log("getGeolocationData:");
        //console.log(getGeolocationData);

        generatedTicketsDiv.classList.add("deshabilitado");

        const count = parseInt(ticketCountSelect.value);

        // Mostrar animación
        //generatedTicketsDiv.innerHTML = ""; // Limpiar boletos anteriores
        //divTicketCountText.innerHTML = "";
        div_ticket_text.innerHTML = "";
        div_ticket_text.style = "";
        div_ticket_count_section.innerHTML = "";
        div_ticket_count_container.style.border = "";
        reserve_btn.style.display = 'none';
        slotMachine.style.display = "block"; // Mostrar máquina tragamonedas
        ticketCountSelect.disabled = "true";


        // Llamar al backend para generar los boletos
        const response = await fetch(`${API_URL}/random?count=${count}`);
        const data = await response.json();
        //console.log("data:");
        //console.log(data);

        if (data.success) {
            //console.log(data);
            //console.log("data.numbers:");
            //console.log(data.numbers);
            
            // Simular tiempo de animación (2 segundos)
            setTimeout(async () => {

                // Ocultar maquina tragamonedas
                slotMachine.style.display = "none"; // Ocultar máquina tragamonedas

                // Mostrar los números generados
                const tickets = data.numbers.map(num => `${num.numero}`);
                //console.log(tickets);

                div_ticket_count_container.style.border = "2px solid #00b707";
                
                data.numbers.map(dataNumbers => {
                    //console.log(dataNumbers);
                    div_ticket_count_section.innerHTML += '<div id="ticketID_'+dataNumbers.id+'" class="ticketClass" style="color: rgb(76, 175, 80); overflow: auto; max-height: 100px; z-index: 1000;">'+dataNumbers.numero+',</div>';
                });


                // Agrupa los números en filas de 5 elementos
                const filas = [];
                const numerosPorFila = 5; // Números por fila
                for (let i = 0; i < tickets.length; i += numerosPorFila) {
                    filas.push(tickets.slice(i, i + numerosPorFila).join(", "));
                }

                //generatedTicketsDiv.innerHTML = tickets;
                //divTicketCountText.innerHTML = '<h3 style="color: rgb(76, 175, 80); overflow: auto; max-height: 100px; z-index: 1000;">'+filas+'</h3>';
                //divTicketCountText.innerHTML += 'HAZ CLICK AQUÍ PARA GENERAR <span id="ticket-count-text">'+tickets.length+'</span> BOLETO(S) AL AZAR';
                ticketCountSelect.removeAttribute("disabled");
                div_ticket_text.style.paddingTop = "20px";
                div_ticket_text.innerHTML = 'HAZ CLICK AQUÍ PARA GENERAR <span id="ticket-count-text">'+tickets.length+'</span> BOLETO(S) AL AZAR';
                reserve_btn.style = '';
                generatedTicketsDiv.classList.remove("deshabilitado");
                
            }, 4000); // 2 segundos de animación

            
        } else {
            //generatedTicketsDiv.innerHTML = "No hay suficientes números disponibles.";
            divTicketCountText.innerHTML = "No hay suficientes números disponibles.";
        }
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "generatedTicketsDiv.addEventListener('click', async () => {",
            message_error
        };
        console.log(errorObj);
    }

});



reserve_btn.addEventListener("click", async () => {
    boletosModal_para_boletosSeleccionados();
    fill_select();
    //console.log("Click en apartar de la maquinita de la suerte");
    //reset_modal();
});



/*
search_btn.addEventListener('click', async (event) => {
    const searchValue = document.getElementById('search').value.trim();

    //console.log(searchValue);
    if (searchValue.length !== 5) {
        //event.preventDefault();
        alert('El número debe tener exactamente 5 dígitos.');
        return;
    }

    if(!/^\d+$/.test(searchValue)){ // Validar si el valor contiene solo números
        alert('Solo debes ingresar números.');
        return;
    }

    if (!searchValue) {
        alert("Por favor ingresa un número.");
        return;
    }

    // Hacer una solicitud al servidor
    const response = await fetch("http://localhost:5000/api/buscar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number_search: searchValue }),
    });

    const result = await response.json();

    if (result.found) {
        if (result.available == 1) {
            //alert(`¡Número ${result.number_search} encontrado!`);
            div_responseSearch.innerHTML = '<div class="div_alinear"><img src="img/comprobar.png" alt="exist" class="img_exist"><span>Número disponible</span></div>';
            //div_responseSearch.innerHTML += '<br><div class="chosen_numbers"><span id="span_ticketAvalaible">Estos serían tus números: '+result.number_search+'</span></div>';
            span_ticketAvalaible.innerHTML = 'Estos serían tus números: '+result.number_search;
            //div_responseSearch.innerHTML += '<br><button id="chooseNumber-btn">Elegir</button>';
            chooseNumber_btn.style = '';
            //div_btnMaquinitaSuerte.innerHTML = '';
            randomBtn.style.display = 'none';
            div_br.innerHTML = '<br>';
        }else{
            div_responseSearch.innerHTML = '<div class="div_alinear"><img src="img/cancelar.png" alt="exist" class="img_exist"><span>Número no disponible</span></div>';
        }
        
    } else {
        //alert(`Número ${searchValue} NO encontrado.`);
        div_responseSearch.innerHTML = '<div class="div_alinear"><img src="img/cancelar.png" alt="exist" class="img_exist"><span>Número no disponible</span></div>';
    }
    

    
});
*/



async function search_number() {
    try {
        //console.log("Haz entrado a: async function search_number()");
        const searchValue = document.getElementById('search').value.trim();

        //console.log(searchValue);
        if (searchValue.length !== 5) {
            //event.preventDefault();
            alert('El número debe tener exactamente 5 dígitos.');
            return;
        }

        if(!/^\d+$/.test(searchValue)){ // Validar si el valor contiene solo números
            alert('Solo debes ingresar números.');
            return;
        }

        if (!searchValue) {
            alert("Por favor ingresa un número.");
            return;
        }

        /* Hacer una solicitud al servidor
        const response = await fetch(API_BUSCAR_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ number_search: searchValue }),
        });

        const result = await response.json();
        //console.log("result - async function search_number():");
        //console.log(result);
        */

        /*
        let style_modo_oscuro;
        if (savedTheme) {
            style_modo_oscuro = `
                    color: white;
                `;
        }else{
            style_modo_oscuro = `
                    color: black;
                `;
        }
        */
        let style_disponible = `
            color: #02b702;
        `;
        let style_noDisponible = `
            color: red;
        `;
        //const input_search_querySelector = document.querySelectorAll('.searchClass');
        
        //console.log("arr_numeros:");
        //console.log(arr_numeros);

        const get_dataJSON_buscarNumero = buscar_numero(searchValue);
        //console.log("get_dataJSON_buscarNumero:");
        //console.log(get_dataJSON_buscarNumero);

        //if (result.found) {
            //if (result.available == 1) {
        if (get_dataJSON_buscarNumero.found) {
            if (get_dataJSON_buscarNumero.available == 1) {
                //alert(`¡Número ${result.number_search} encontrado!`);
                div_responseSearch.innerHTML = '<div class="div_alinear"><img src="img/comprobar_4_11zon.webp" alt="exist" class="img_exist"><span class="">Número disponible</span></div>';
                //div_responseSearch.innerHTML += '<br><div class="chosen_numbers"><span id="span_ticketAvalaible">Estos serían tus números: '+result.number_search+'</span></div>';
                span_ticketAvalaible.innerHTML = 'Estos serían tus números: <span class="" style="'+style_disponible+'">'+get_dataJSON_buscarNumero.number_search+"</span>";
                //div_responseSearch.innerHTML += '<br><button id="chooseNumber-btn">Elegir</button>';
                chooseNumber_btn.style = '';
                //div_btnMaquinitaSuerte.innerHTML = '';
                randomBtn.style.display = 'none';
                div_br.innerHTML = '<br>';
                input_search.style.border = "5px solid #7fc241"; /* Borde de 5px color verde */
                //console.log(input_search_querySelector);
                /*input_search_querySelector.forEach(inputSearch => {
                    //console.log(inputSearch);
                    //console.log(inputSearch);
                    inputSearch.style.border= "5px solid #7fc241";
                });
                */
                
                
            }else{
                input_search.style.border = "5px solid #ff3e3e"; /* Borde de 5px color rojo */
                div_responseSearch.innerHTML = '<div class="div_alinear"><img src="img/cancelar_3_11zon.webp" alt="exist" class="img_exist"><span>Número no disponible</span></div>';
                span_ticketAvalaible.innerHTML = '';
                chooseNumber_btn.style.display = 'none';
            }
            
        } else {
            //alert(`Número ${searchValue} NO encontrado.`);
            input_search.style.border = "5px solid orange"; /* Borde de 5px color naranja */
            div_responseSearch.innerHTML = '<div class="div_alinear"><img src="img/cancelar_3_11zon.webp" alt="exist" class="img_exist"><span>Número no existe.</span></div>';
            span_ticketAvalaible.innerHTML = '';
            chooseNumber_btn.style.display = 'none';
        }
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "async function search_number()",
            message_error
        };
        console.log(errorObj);
    }
    
}



function buscar_numero (number_search) {
    try {
        let number_found = 0;
        for (let j = 0; j < arr_numeros.length; j++) {
            const data_numbers = arr_numeros[j];
            //console.log("data_numbers:");
            //console.log(data_numbers)
            
            const numberData = data_numbers.numero;
            //console.log("numberData: " + numberData);
            if (numberData.includes(number_search)) {    
                //console.log("Se encontro el numero: " + number_search);
                //console.log(data_numbers.includes(number_search));
                number_found = 1;
                
                //let arr_to_JSON = JSON.stringify(data_numbers);
                let dataNumber_available = data_numbers.disponible;
                //console.log("dataNumber_available: "+dataNumber_available);
                
                let data_json = {
                    found: true, 
                    number_search, 
                    available: dataNumber_available
                }
                
                return data_json;
            }
        }
        if (number_found == 0) {
            return { found: false };
        }
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "function buscar_numero (number_search)",
            message_error
        };
        console.log(errorObj);
    }
    
}



chooseNumber_btn.addEventListener("click", async () => {
    try {
        //div_btnMaquinitaSuerte.innerHTML = '<br><br><br><button id="random-btn">Maquinita de la Suerte</button>';
        
        let span_ticketAvalaible_split = span_ticketAvalaible.textContent.split(':');


        const total_div_selected_tickets = div_selected_tickets_section.querySelectorAll("div"); // Selecciona todos los div dentro

        if (total_div_selected_tickets.length >= 1) { // Verifica si almenos hay un boleto seleccionado
            for (let i = 0; i < total_div_selected_tickets.length; i++) { // Recorre los boletos seleccionados
                const div_value = total_div_selected_tickets[i].innerText; // Obtiene el valor del DIV(en este caso el numero del boleto) en la posicion i(0,1,2,3..., etc)
                if (div_value == span_ticketAvalaible_split[1].trim()) { // Verifica si el boleto ya existe entre los boletos seleccionados
                    alert('Ya haz seleccionado este boleto.');
                    return;
                }
            }
        }


        randomBtn.style = '';
        div_responseSearch.innerHTML = '';
        chooseNumber_btn.style.display = 'none';
        div_br.innerHTML = '<br><br>';

        let style_divSelectedTicketsSection = `
            width: 50px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #7fc241;
            font-weight: bold;
            cursor: pointer;
            font-size: 13px;
            border-radius: 5px;
            text-align: center;`;
        
        
        //div_selected_tickets_section.setAttribute("style", style_divSelectedTicketsSection);
        div_selected_tickets_section.innerHTML += '<div id="div_selected_tickets_'+span_ticketAvalaible_split[1].trim()+'" class="div_selected_spanTicket" style="'+style_divSelectedTicketsSection+'">'+span_ticketAvalaible_split[1].trim()+'</div>';
        
        
        let total_div_selected_tickets2 = div_selected_tickets_section.querySelectorAll("div"); // Selecciona todos los div dentro
        
        if (total_div_selected_tickets2.length == 1) {
            div_total_selectedTickets_section.innerHTML = total_div_selected_tickets2.length+ ' BOLETO SELECCIONADO'
        }else{
            div_total_selectedTickets_section.innerHTML = total_div_selected_tickets2.length+ ' BOLETOS SELECCIONADOS'
        }
        
        div_text_selectedTickets_section.innerHTML = 'Para eliminar haz click en el boleto';
        
        div_reserveTickets.style = "";
        input_search.value = '';
        span_ticketAvalaible.innerHTML = '';
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "chooseNumber_btn.addEventListener('click', async () => {",
            message_error
        };
        console.log(errorObj);
    }

});



//let contador_input_search = 0;
// Añadir un evento para detectar cambios en el input
input_search.addEventListener('input', (e) => { // Este evento se activa cada vez que el usuario escribe, borra o pega algo en el campo de entrada.
    //console.log("Haz entrado a: input_search.addEventListener('input', (e)");
    //contador_input_search++;
    //if (contador_input_search == 1) {
        //getNumbers();
    //}
    const maxLength = 5;
    const value = e.target.value.replace(/\D/g, ''); // Eliminar caracteres no numéricos
    const paddedValue = value.padStart(maxLength, '0'); // Añadir ceros a la izquierda
    e.target.value = paddedValue.slice(-maxLength); // Mantener solo los últimos `maxLength` caracteres
    search_number();
});



input_search.addEventListener('focus', (e) => { // Este evento se activa cada vez que el usuario hace click sobre el input
    const maxLength = 5;
    e.target.value = e.target.value.padStart(maxLength, '0');
    input_search.style.fontFamily = 'inherit';
    input_search.style.color = 'black';
    input_search.style.fontSize = '18px';
});



/*
input_search.addEventListener('blur', (e) => { // Este evento se activa cada vez que el usuario hace click fuera del input
    if (e.target.value === '00000') {
        e.target.value = '';
    }
});
*/



function toggleMenu() {
    const menu = document.querySelector('.navbar ul');
    menu.classList.toggle('active');
}



// Quitar numero de seleccionados
div_selected_tickets_section.addEventListener("click", function(event) {
    try {
        //console.log('div_selected_tickets_section.addEventListener("click", function(event)');
        //console.log("event: "+event);
        
        const total_div_selected_tickets = div_selected_tickets_section.querySelectorAll("div"); // Selecciona todos los div dentro
        //console.log(total_div_selected_tickets);
        //console.log(total_div_selected_tickets.length);
        //console.log(total_div_selected_tickets[0].id);

        if (total_div_selected_tickets.length > 1) {
            //const div_content = div_selected_tickets_section.textContent; // Obtiene el texto del div
            //console.log("number_ticket: "+div_content);
            if (event.target.tagName === 'DIV') { // Verifica si el elemento clicado es un DIV
                //console.log(event.target.id); // Obtiene el id del DIV al cual se le ha dado click
                if (event.target.id != "div_selected_tickets_section") {
                    //console.log("event.target.id: "+event.target.id);
                    //console.log("event.target.innerText: "+event.target.innerText);

                    let id_ticket_selected = document.getElementById(event.target.id);
                    id_ticket_selected.remove();
                    
                    let number_ticket_selected = event.target.innerText; // Obtiene el numero del ticket que se quito de los seleccionados
                    const id_ticket_selected_cuadricula = parseInt(number_ticket_selected) + 10; // Le sumamos 10 al numero porque en la bd el id el 1 es el 11, el 2 el 12, etc...

                    if (seleccionados.hasOwnProperty(id_ticket_selected_cuadricula)) { // Verifica si la propiedad existe antes de intentar eliminarla.
                        delete seleccionados[id_ticket_selected_cuadricula]; // Eliminar el contenido de un objeto en JavaScript por una clave específica
                    }
                    //console.log("seleccionados:");
                    //console.log(seleccionados);
                    
                    //const ticket_seleccionado_cuadricula = document.querySelector(".reserved");
                    const ticket_seleccionado_cuadricula = document.getElementById("ticket_"+id_ticket_selected_cuadricula.toString()); // Obtenemos el id del ticket que habiamos seleccionado en la cuadricula (color amarilo)
                    //ticket_seleccionado_cuadricula.style = ""; // Se quita el color amaarilla para que quede disponible de nuevo
                    //ticket_seleccionado_cuadricula.style = "transform: translate(540px, 120px);background-color: rgb(204, 255, 204);cursor: pointer;"; // Se quita el color amaarilla para que quede disponible de nuevo
                    
                    // Obtener los estilos computados del elemento
                    var styles_ticket_seleccionado_cuadricula = window.getComputedStyle(ticket_seleccionado_cuadricula);

                    // Acceder a un estilo específico, por ejemplo, el color de fondo
                    var transform_ticket_seleccionado_cuadricula = styles_ticket_seleccionado_cuadricula.transform;
                    //console.log(transform_ticket_seleccionado_cuadricula);

                    ticket_seleccionado_cuadricula.style.transform = transform_ticket_seleccionado_cuadricula;
                    ticket_seleccionado_cuadricula.style.backgroundColor = "rgb(204, 255, 204)";
                    ticket_seleccionado_cuadricula.style.cursor = "pointer";
                    //const div = document.querySelector('.number.reserved');
                    //div.classList.replace('reserved', 'available'); // Reemplazar la clase "reserved" por "available"

                    const total_div_selected_tickets2 = div_selected_tickets_section.querySelectorAll("div");
                    
                    if (total_div_selected_tickets2.length == 1) {
                        div_total_selectedTickets_section.innerHTML = total_div_selected_tickets2.length+ ' BOLETO SELECCIONADO'
                    }else{
                        div_total_selectedTickets_section.innerHTML = total_div_selected_tickets2.length+ ' BOLETOS SELECCIONADOS'
                    }
                    
                }
                
            }
        }
        if (total_div_selected_tickets.length == 1) {
            if (event.target.tagName === 'DIV') { // Verifica si el elemento clicado es un DIV
                //console.log(event.target.id); // Obtiene el id del DIV al cual se le ha dado click
                if (event.target.id != "div_selected_tickets_section") {
                    let number_ticket_selected = event.target.innerText;
                    const id_ticket_selected_cuadricula = parseInt(number_ticket_selected) + 10;

                    if (seleccionados.hasOwnProperty(id_ticket_selected_cuadricula)) { // Verifica si la propiedad existe antes de intentar eliminarla.
                        delete seleccionados[id_ticket_selected_cuadricula]; // Eliminar el contenido de un objeto en JavaScript por una clave específica
                    }
                    //console.log("seleccionados:");
                    //console.log(seleccionados);

                    const ticket_seleccionado_cuadricula = document.getElementById("ticket_"+id_ticket_selected_cuadricula.toString());
                    //ticket_seleccionado_cuadricula.style = "";
                    // Obtener los estilos computados del elemento
                    var styles_ticket_seleccionado_cuadricula = window.getComputedStyle(ticket_seleccionado_cuadricula);
                    // Acceder a un estilo específico, por ejemplo, el color de fondo
                    var transform_ticket_seleccionado_cuadricula = styles_ticket_seleccionado_cuadricula.transform;
                    //console.log(transform_ticket_seleccionado_cuadricula);
                    ticket_seleccionado_cuadricula.style.transform = transform_ticket_seleccionado_cuadricula;
                    ticket_seleccionado_cuadricula.style.backgroundColor = "rgb(204, 255, 204)";
                    ticket_seleccionado_cuadricula.style.cursor = "pointer";
                }
            }

            if (event.target.id != "div_selected_tickets_section") {
                div_selected_tickets_section.innerHTML = '';
                div_selected_tickets_section.style = '';
                div_text_selectedTickets_section.innerHTML = '';
                div_total_selectedTickets_section.innerHTML = '';
                div_reserveTickets.style.display = "none";
            }
            return;
        }
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "div_selected_tickets_section.addEventListener('click', function(event) {",
            message_error
        };
        console.log(errorObj);
    }
    
});



reserve_tickets_section_btn.addEventListener("click", async (event) => {
    
    const total_boletos_seleccionados = div_total_selectedTickets_section.innerText;
    catidad_boletos_seleccionados_modal_person.innerHTML = total_boletos_seleccionados;

    person_data_modal.style.display = "block";
    fill_select();

});



async function boletosModal_para_boletosSeleccionados() {
    try {
        //console.log("async function boletosModal_para_boletosSeleccionados()");
        let verificar_boletos = await verificarBoletosExistenEnApartados();
        //console.log(verificar_boletos);
        //console.log(verificar_boletos.length);

        let arr_ticketsApartados_ruletaSuerte = verificar_boletos[0];
        //console.log(arr_ticketsApartados_ruletaSuerte);

        let arr_ticketsNoApartados_ruletaSuerte = verificar_boletos[1];
        //console.log(arr_ticketsNoApartados_ruletaSuerte);

        let style_divSelectedTicketsSection = `
                    width: 50px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #7fc241;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: 13px;
                    border-radius: 5px;
                    text-align: center;`;

        if (verificar_boletos.length > 0) {
            if (arr_ticketsApartados_ruletaSuerte.length == 0) {
                for (let z = 0; z < arr_ticketsNoApartados_ruletaSuerte.length; z++) {
                    const ticket_ruletaSuerte = arr_ticketsNoApartados_ruletaSuerte[z];
                    //console.log("ticket_ruletaSuerte:");
                    //console.log(ticket_ruletaSuerte);
                    div_selected_tickets_section.innerHTML += '<div id="div_selected_tickets_'+ticket_ruletaSuerte.split('|')[0]+'" class="div_selected_spanTicket" style="'+style_divSelectedTicketsSection+'">'+ticket_ruletaSuerte.split('|')[1]+'</div>';
                }
                
                const div_total_tickets_seleccionados_actuales = div_total_selectedTickets_section.textContent;
                const total_tickets_seleccionados_actuales = div_total_tickets_seleccionados_actuales.split(" ")[0];

                const totalTickets = arr_ticketsNoApartados_ruletaSuerte.length + parseInt(total_tickets_seleccionados_actuales);

                //if (arr_ticketsNoApartados_ruletaSuerte.length == 1) {
                if(totalTickets == 1) {
                    //div_total_selectedTickets_section.innerHTML = arr_ticketsNoApartados_ruletaSuerte.length+ ' BOLETO SELECCIONADO';
                    div_total_selectedTickets_section.innerHTML = totalTickets+ ' BOLETO SELECCIONADO';
                    catidad_boletos_seleccionados_modal_person.innerHTML = totalTickets+ ' BOLETO SELECCIONADO';
                }else{
                    //div_total_selectedTickets_section.innerHTML = arr_ticketsNoApartados_ruletaSuerte.length+ ' BOLETOS SELECCIONADOS';
                    div_total_selectedTickets_section.innerHTML = totalTickets+ ' BOLETOS SELECCIONADOS';
                    catidad_boletos_seleccionados_modal_person.innerHTML = totalTickets+ ' BOLETO SELECCIONADOS';
                }

                div_text_selectedTickets_section.innerHTML = 'Para eliminar haz click en el boleto';
                
            }else{
                alert("Algunos boletos que estan generados ya los tienes seleccionados.");
                person_data_modal.style.display = "none";
            }
        }else{
            let getTicketsMaquinitaSuerte = div_ticket_count_section.querySelectorAll("div");

            getTicketsMaquinitaSuerte.forEach((divMaquinita) => {
                let getID_ticketMaquinita = divMaquinita.id;
                let getVALUE_ticketMaquinita = divMaquinita.innerText;
                //console.log("getVALUE_ticketMaquinita.split: "+getVALUE_ticketMaquinita.split(",")[0]);
                //let get_IdAndValue_ticketMaquinita = getID_ticketMaquinita+"|"+getVALUE_ticketMaquinita.split(',')[0];
                div_selected_tickets_section.innerHTML += '<div id="div_selected_tickets_'+getID_ticketMaquinita+'" class="div_selected_spanTicket" style="'+style_divSelectedTicketsSection+'">'+getVALUE_ticketMaquinita.split(",")[0]+'</div>';
                if (getTicketsMaquinitaSuerte.length == 1) {
                    div_total_selectedTickets_section.innerHTML = getTicketsMaquinitaSuerte.length+ ' BOLETO SELECCIONADO'
                }else{
                    div_total_selectedTickets_section.innerHTML = getTicketsMaquinitaSuerte.length+ ' BOLETOS SELECCIONADOS'
                }
            });

            if (getTicketsMaquinitaSuerte.length > 0) {
                div_text_selectedTickets_section.innerHTML = 'Para eliminar haz click en el boleto';
            }
            
        }

        div_reserveTickets.style = "";

        const total_boletos_seleccionados = div_total_selectedTickets_section.innerText;
        catidad_boletos_seleccionados_modal_person.innerHTML = total_boletos_seleccionados;

        luckMachineModal.style.display = "none";
        person_data_modal.style.display = "block";
        
        reset_modal();
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "async function boletosModal_para_boletosSeleccionados()",
            message_error
        };
        console.log(errorObj);
    }

}



async function obtenerBoletosApartados () {
    try {
        let get_div_selected_tickets_section = div_selected_tickets_section.querySelectorAll("div");
        //console.log(get_div_selected_tickets_section);
        
        for (let x = 0; x < get_div_selected_tickets_section.length; x++) {
            const element_getTickets = get_div_selected_tickets_section[x];
            //console.log(element_getTickets.innerText);
        }

        return get_div_selected_tickets_section;
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "async function obtenerBoletosApartados()",
            message_error
        };
        console.log(errorObj);
    }
    
}



async function verificarBoletosExistenEnApartados () {
    try {
        let arr_boletosApartados = await obtenerBoletosApartados();
        //console.log(arr_boletosApartados);

        const tickets_ruletaSuerte = div_ticket_count_section.querySelectorAll('div');
        //console.log(tickets_ruletaSuerte);

        let arr_numberTickets_ruletaSuerte = [];
        let arr_boletoYaApartado = [];
        let arr_boletos_apartados_noApartados =[];
        if (arr_boletosApartados.length >= 1) {
            for (let j = 0; j < arr_boletosApartados.length; j++) {
                const divElement_boletoApartado = arr_boletosApartados[j];
                //console.log(divElement_boletoApartado);
                
                const valor_boletoApartado = divElement_boletoApartado.innerText;
                //console.log(valor_boletoApartado);

                tickets_ruletaSuerte.forEach((div) => {
                    //console.log(div)
                    //console.log(div.id);
                    //console.log(div.textContent);
                    const id_boletoMaquinitaSuerte = div.id;
                    const valor_boletoMaquinitaSuerte = div.textContent;
                    let ID_NUMBER_TICKET = id_boletoMaquinitaSuerte+"|"+valor_boletoMaquinitaSuerte.split(',')[0];

                    if (valor_boletoApartado == valor_boletoMaquinitaSuerte.split(",")[0]) {
                        arr_boletoYaApartado.push(valor_boletoMaquinitaSuerte);
                    }else{
                        arr_numberTickets_ruletaSuerte.push(ID_NUMBER_TICKET);
                    }
                });
            }

            const uniqueArr_numberTickets_ruletaSuerte = [...new Set(arr_numberTickets_ruletaSuerte)]; // Elimina los valores duplicados

            arr_boletos_apartados_noApartados.push(arr_boletoYaApartado);
            arr_boletos_apartados_noApartados.push(uniqueArr_numberTickets_ruletaSuerte);
        }

        return arr_boletos_apartados_noApartados;
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "async function verificarBoletosExistenEnApartados()",
            message_error
        };
        console.log(errorObj);
    }
        
}



// Evento que valida la entrada en tiempo real
input_numberWhatsApp.addEventListener("input", () => {
    // Reemplaza cualquier carácter que no sea un número y limita a 10 caracteres
    input_numberWhatsApp.value = input_numberWhatsApp.value.replace(/[^0-9]/g, '').slice(0, 10);
});



// Cargar estados desde el servidor y actualizar el <select>
async function fill_select() {
    try {
        const data = await get_API_States();
        const selectElement = document.getElementById('select_states');
        selectElement.innerHTML = "";
        selectElement.innerHTML = '<option value="no_select_estate">SELECCIONA ESTADO</option>';
        // Agregar las opciones dinámicamente
        data.forEach(state => {
            const option = document.createElement('option');
            option.value = state.id;
            option.textContent = state.name;
            selectElement.appendChild(option);
        });
    } catch (error) {
        //console.error('Error al cargar los estados:', error)
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "async function fill_select()",
            message_error
        };
        console.log(errorObj);
    }
    
}



apartar_modal_person_btn.addEventListener("click", (event) => {
    try {
        let whatsapp = input_modal_whatsapp.value;
        let name = input_modal_name.value;
        let last_name = input_modal_last_name.value;
        let select_states = input_modal_select_states.value;
        //console.log(select_states);
        if (!whatsapp || !name || !last_name || !select_states || select_states == "no_select_estate") {
            alert('¡POR FAVOR, LLENE TODOS LOS DATOS!');
            if (!whatsapp) {
                document.getElementById("phone").style.backgroundColor = "#ffbbbb";
                document.getElementById("phone").style.border = "2px solid red";
            }else{
                document.getElementById("phone").style = "";
            }
            if (!name) {
                document.getElementById("name").style.backgroundColor = "#ffbbbb";
                document.getElementById("name").style.border = "2px solid red";
            }else{
                document.getElementById("name").style = "";
            }
            if (!last_name) {
                document.getElementById("lastname").style.backgroundColor = "#ffbbbb";
                document.getElementById("lastname").style.border = "2px solid red";
            }else{
                document.getElementById("lastname").style = "";
            }
            if (!select_states || select_states == "no_select_estate") {
                document.getElementById("select_states").style.backgroundColor = "#ffbbbb";
                document.getElementById("select_states").style.border = "2px solid red";
            } else {
                document.getElementById("select_states").style = "";
            }
            event.preventDefault(); // Evita el envío del formulario
        }else{
            load_2.style = "";
            reserve_tickets_modalPerson.style.display = "none";
            p_modal_person.style.display = "none";
            save_person_data_modal(whatsapp, name, last_name, select_states);
            event.preventDefault(); // Evita el envío predeterminado del formulario
            /*
            window.open(
                'https://wa.me/526421084845?text=' + 
                '☘️🚨https://www.economicoshuatabampo.com/s2-lista%0A%0A' +
                'Buenos%20dias%20sus%20boletos%20que%20📢daron%20apartados%20🙌🏻%20🍀%20Le%20sugerimos%20verificar%20su%20apartado%20de%20boletos%20🎫%20aquí%20👇🏻%0A' +
                'https://www.economicoshuatabampo.com/s2-verificador%0A%0A' +
                '🚨🍀Recuerde%20que%20son%20🚨%202horas%20de%20apartado🍀%0A%0A' +
                '🚨🚨🧨📢📢%0Aojo,%20cuentas%20actualizadas%20📄🍀%0A' +
                'Métodos%20de%20Pago%20💳%20🏧%0Ahttps://www.economicoshuatabampo.com/pagos%0A%0A' +
                'Nota%20importante%20,%20checar%20que%20su%20pago%20no.se%20allá%20devuelto%20también%20es%20su%20responsabilidad%20gracias',
                '_blank'
            );
            */
            /*
            window.open(
                'https://wa.me/526421084845?text=' + 
                '☘️🚨https://rifaseconomicasnavojoa.site%0A%0A' +
                'Buenos%20dias%20sus%20boletos%20que%20📢daron%20apartados%20🙌🏻%20🍀%20Le%20sugerimos%20verificar%20su%20apartado%20de%20boletos%20🎫%20aquí%20👇🏻%0A' +
                'https://rifaseconomicasnavojoa.site/s2-verificador%0A%0A' +
                '🚨🍀Recuerde%20que%20son%20🚨%202horas%20de%20apartado🍀%0A%0A' +
                '🚨🚨🧨📢📢%0Aojo,%20cuentas%20actualizadas%20📄🍀%0A' +
                'Métodos%20de%20Pago%20💳%20🏧%0Ahttps://rifaseconomicasnavojoa.site/pagos%0A%0A' +
                'Nota%20importante%20,%20checar%20que%20su%20pago%20no.se%20allá%20devuelto%20también%20es%20su%20responsabilidad%20gracias',
                '_blank'
            );
            */

            //window.location.replace("https://rifaseconomicasnavojoa.site");

            
        }

        
    } catch (error) {
        //console.log(error);
        event.preventDefault();
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "apartar_modal_person_btn.addEventListener('click', (event) => {",
            message_error
        };
        console.log(errorObj);
    }
    
});



async function save_person_data_modal (whatsapp, name, last_name, select_states) {
    try {
        //console.log("async function save_person_data_modal");
        let getGeolocationData = await checkLocationPermission();
        //console.log("getGeolocationData:");
        //console.log(getGeolocationData);

        //console.log("input_modal_whatsapp: "+ input_modal_whatsapp.value);
        //console.log("input_modal_name: "+ input_modal_name.value);
        //console.log("input_modal_last_name: "+ input_modal_last_name.value);
        
        //console.log("whatsapp: " + whatsapp);
        //console.log("name: " + name);
        //console.log("last_name: " + last_name);
        
        const select_state_option_value = input_modal_select_states.options[input_modal_select_states.selectedIndex].text; // Obtiene el texto
        //console.log("select_state_option_value:", select_state_option_value);
        //console.log("input_modal_select_states: "+ input_modal_select_states.value);

        const person_data = {
            phone: input_modal_whatsapp.value,
            name: input_modal_name.value.toUpperCase(),
            lastname: input_modal_last_name.value.toUpperCase(),
            option: select_state_option_value.toUpperCase(),
            geolocationData: getGeolocationData,
        };

        // Hacer una solicitud al servidor
        const response = await fetch(API_SAVE_PERSON_DATA_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(person_data),
        });

        // Verificar si la respuesta tiene éxito
        if (!response.ok) {
            //throw new Error(`Error en la solicitud: ${response.statusText}`);
            console.log("response: ");
            console.log(response);
        }

        const data = await response.json();

        // Manejar los datos de la respuesta
        if (data.userData) {
            const { userId, phone, name, lastname, option } = data.userData;
            const data_ApiSavePerson = {};
            let full_name = name + " " + lastname;
            reservar_boletos_seleccionados(userId, full_name, phone, option);
        } else {
            console.error('Error al guardar los datos:', data.message);
        }


        /* Hacer una solicitud al servidor
        const response = await fetch(API_SAVE_PERSON_DATA_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            //body: JSON.stringify( arr_reservedTickets ),
            body: JSON.stringify(person_data),
        })
        .then(response => response.json())  // Convertir la respuesta en formato JSON
        .then(data => {
            //console.log("data: ");
            //console.log(data);
            if (data.userData) {
                //console.log('Datos del nuevo usuario:', data.userData);
                // Ahora tienes todos los datos insertados en 'userData'
                const { userId, phone, name, lastname, option } = data.userData;
                //console.log('ID del usuario:', userId);
                //console.log('Teléfono:', phone);
                //console.log('Nombre:', name);
                //console.log('Apellido:', lastname);
                //console.log('Estado:', option);
                reservar_boletos_seleccionados(userId, name, option);
            } else {
                //console.log('Error al guardar los datos:', data.message);
                console.log('Error al guardar los datos: '+response);
            }
        })
        .catch(error => {
            console.error('Hubo un error:', error);
            return;
        });
        */
        
        /*
        if (response.ok) {
            //console.log(response);
            alert("Enseguida serás redirigido a WhatsApp.");
            //reservar_boletos_seleccionados();
        }
        
        if (!response.ok) {
            console.error('Error response:', response);
            throw new Error(`Error en la solicitud: ${response.status}`);
            return;
        }
        */

        //const data = await response.json(); // Procesa la respuesta como JSON
        //console.log("Respuesta del servidor:", data);
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "async function save_person_data_modal (whatsapp, name, last_name, select_states)",
            message_error
        };
        console.log(errorObj);
    }
    
}



// Checa si al momento de que la persona envie sus datos tiene boletos seleccionados
async function checar_boletos_seleccionados_persona(userId, name, option) {
    try {
        // Selecciona todos los div dentro (en este caso todos los numeros que se han seleccionado en el rectangulo negro abajo del boton " → APARTAR ← ")
        const total_div_selected_tickets = div_selected_tickets_section.querySelectorAll("div"); 
        let arr_reservedTickets = [];

        if (total_div_selected_tickets.length > 0) { // Verifica si almenos hay un boleto seleccionado
            
        }else{
            alert("No tienes boletos seleccionados!!!");
            return;
        }
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "async function checar_boletos_seleccionados_persona(userId, name, option)",
            message_error
        };
        console.log(errorObj);
    }

}



// Reservar boletos seleccionados
async function reservar_boletos_seleccionados(userId, name, phone, option) {
    try {
        //console.log("async function reservar_boletos_seleccionados");
        let get_numbersDB = arr_numeros;
        //console.log(get_numbersDB); // Array de Objetos JSON Ex: [{id: 11, numero: '00001', disponible: 0}, {id: 12, numero: '00002', disponible: 1}, ..., etc]

        let cont = 1;
        let arr_ticketsNotAvailableBD = [];
        get_numbersDB.forEach((num) => {
            
            if (num.disponible == 0) {
                arr_ticketsNotAvailableBD.push(num);
            }
        });

        //console.log("arr_ticketsNotAvailableBD:");
        //console.log(arr_ticketsNotAvailableBD);


        // Selecciona todos los div dentro (en este caso todos los numeros que se han seleccionado en el rectangulo negro abajo del boton " → APARTAR ← ")
        const total_div_selected_tickets = div_selected_tickets_section.querySelectorAll("div"); 
        //console.log("total_div_selected_tickets:");
        //console.log(total_div_selected_tickets);
        let arr_reservedTickets = [];

        if (total_div_selected_tickets.length > 0) { // Verifica si almenos hay un boleto seleccionado
            for (let i = 0; i < total_div_selected_tickets.length; i++) { // Recorre los boletos seleccionados
                const div_value = total_div_selected_tickets[i].innerText; // Obtiene el valor del DIV(en este caso el numero del boleto) en la posicion i(0,1,2,3..., etc)
                arr_reservedTickets.push(div_value);
            }
            let tickets_notAvailable = findCommonNumbers(arr_reservedTickets, arr_ticketsNotAvailableBD);
            //console.log("tickets_notAvailable:");
            //console.log(tickets_notAvailable);
            //console.log(tickets_notAvailable.length);
            if (tickets_notAvailable.length == 0) {
                mark_multiple_tickets_as_sold(arr_reservedTickets, userId, name, phone, option);
            }else{
                let str_ticketsApartados = "";
                let aux = 1;
                for (let j = 0; j < tickets_notAvailable.length; j++) {
                    const ticketApartado = tickets_notAvailable[j];
                    if (tickets_notAvailable.length == 1) {
                        str_ticketsApartados += ticketApartado;
                    }
                    if (tickets_notAvailable.length > 1) {
                        if (tickets_notAvailable.length == aux) {
                            str_ticketsApartados += ticketApartado;
                        }else{
                            str_ticketsApartados += ticketApartado + ", ";
                        }
                    }
                    aux += 1;

                }
                alert("Estos números que deseas apartar ya no estan disponibles: "+str_ticketsApartados);
            }
        }
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "async function reservar_boletos_seleccionados(userId, name, option)",
            message_error
        };
        console.log(errorObj);
    }

}







function findCommonNumbers(array1, array2) {
    try {
        const array2_numeros = array2.map(item => item.numero);
        return array1.filter(item => array2_numeros.includes(item));
        /*
        return array1.filter(item => {
            const isInArray2 = array2_numeros.includes(item);
            console.log(`¿${item} está en array2? ${isInArray2 ? "Sí" : "No"}`);
            return isInArray2;
        });
        */
    } catch (error) {
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "function findCommonNumbers(array1, array2)",
            message_error
        };
        console.log(errorObj);
    }
    
}



// Apartar varios numeros
async function mark_multiple_tickets_as_sold(arr_reservedTickets, userId, name, phone, option) {
    //console.log("async function mark_multiple_tickets_as_sold");
    try {
        //console.log("arr_reservedTickets:");
        //console.log(arr_reservedTickets);
        //const total_div_numberGrid = numberGrid.querySelectorAll("div"); // Selecciona todos los div dentro
        //console.log("total_div_numberGrid:");
        //console.log(total_div_numberGrid);

        //const total_div_selected_tickets_container = div_selected_tickets_container.querySelectorAll("div"); // Selecciona todos los div dentro
        //console.log("total_div_selected_tickets_container:");
        //console.log(total_div_selected_tickets_container);

        const total_div_selected_spanTicket = div_selected_tickets_container.querySelectorAll(".div_selected_spanTicket"); // Selecciona todos los div dentro
        //console.log("total_div_selected_spanTicket:");
        //console.log(total_div_selected_spanTicket);

        let arr_reservedTicketsID = [];
        let arr_reservedTicketsNUMERO = [];
        let arr_reservedTickets_ID_and_NUMBER = [];
        let id_and_numero = "";
        let numeroID;

        //if (total_div_numberGrid.length >= 1) { // Verifica si almenos hay un boleto seleccionado
        if (total_div_selected_spanTicket.length >= 1) {
            // Iterar sobre cada div
            //total_div_numberGrid.forEach((div) => {
                total_div_selected_spanTicket.forEach((div) => {
                //console.log("div.id: "+div.id);  // Imprime el id de cada div
                //console.log("div.innerHTML: "+div.innerHTML);  // Imprime el contenido HTML de cada div
                arr_reservedTickets.forEach((reservedTickets)=>{
                    if (reservedTickets == div.innerHTML) {
                        numeroID = div.id.split('_')[4];
                        //console.log("numeroID:");
                        //console.log(numeroID);
                        //arr_reservedTicketsID.push(div.id.split('_')[1]);
                        arr_reservedTicketsID.push(numeroID);
                        arr_reservedTicketsNUMERO.push(reservedTickets);
                        id_and_numero = numeroID+"_"+reservedTickets;
                        arr_reservedTickets_ID_and_NUMBER.push(id_and_numero);
                    }
                });
            });
        }

        //console.log("arr_reservedTicketsID: ");
        //console.log(arr_reservedTicketsID);

        //console.log("arr_reservedTicketsNUMERO: ");
        //console.log(arr_reservedTicketsNUMERO);

        //console.log("arr_reservedTickets_ID_and_NUMBER: ");
        //console.log(arr_reservedTickets_ID_and_NUMBER);

        // Hacer una solicitud al servidor
        const response = await fetch(API_CAMBIAR_ESTADO_NUMEROS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( arr_reservedTicketsID ),
        });
        
        if (response.ok) {
            //console.log("if (response.ok)");
            const data_to_server = {
                arr_reservedTickets_ID_and_NUMBER: arr_reservedTickets_ID_and_NUMBER,
                userId: userId,
                name: name.toUpperCase(),
                phone:  phone,
                option: option.toUpperCase()
            };
            //console.log("data_to_server:");
            //console.log(data_to_server);

            // Hacer una solicitud al servidor para guardar los numeros aquiridos por la persona
            const response = await fetch(API_ADQUIRIR_BOLETO_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                //body: JSON.stringify(arr_reservedTickets_ID_and_NUMBER, userId, name, option),
                body: JSON.stringify(data_to_server),
            })
            .then(response => response.json())  // Convertir la respuesta en formato JSON
            .then(data => {
                //console.log("data: ");
                //console.log(data);
                if (data.data_server) {
                    //console.log('Datos del nuevo registro en la tabla "boletos_adquiridos":', data.data_server);
                    // Ahora tienes todos los datos insertados en 'data_server'
                    const { ticket_Id_Number, userId, userName, userPhone, select_state_option } = data.data_server;
                    //console.log('ID y NUMERO del boleto:', ticket_Id_Number);
                    //console.log('ID usuario:', userId);
                    //console.log('NOMBRE usuario:', userName);
                    //console.log('Estado seleccionado:', select_state_option);

                    //console.log("arr_reservedTicketsID - if (data.data_server) {");
                    //console.log(arr_reservedTicketsID); //Imprime el siguiente formato: ['64']
                    
                    
                    // El codigo siguiente determina que numeros adquiridos existen en el "arr_numeros" para despues cambiar la propiedad "diponible"de 1 a 0
                    // Normalizar los valores de "arr_reservedTicketsID" para que tengan ceros a la izquierda
                    const formattedArr = arr_reservedTicketsNUMERO.map(num => num.padStart(5, '0')); // Asegura formato. Ejemplo: '00064'
                    //console.log("formattedArr:");
                    //console.log(formattedArr);
                    
                    // Crear un conjunto con los números de arr_reservedTicketsID para búsquedas rápidas
                    const numerosInArr = new Set(formattedArr);
                    //console.log("numerosInArr:");
                    //console.log(numerosInArr);
                    
                    //console.log("arr_numeros:");
                    //console.log(arr_numeros);
                    
                    arr_numeros.forEach(itemArrNum => {
                        //console.log(`Verificando si "${itemArrNum.numero}" está en numerosInArr1...`);
                        if (numerosInArr.has(itemArrNum.numero)) {
                            //console.log(`¡Encontrado! Cambiando "disponible" a 0 para el objeto:`, itemArrNum);
                            itemArrNum.disponible = 0;
                        } else {
                            //console.log(`No encontrado. Sin cambios para:`, itemArrNum);
                        }
                    });


                    arr_reservedTicketsID.forEach(reservedTicketPerson => {
                        //console.log("reservedTicketPerson:");
                        //console.log(reservedTicketPerson);
                        const div_number = document.getElementById("ticket_"+reservedTicketPerson);
                        //console.log("div_number:");
                        //console.log(div_number);
                        if(div_number != undefined && div_number != ""){    
                            div_number.classList.replace('available', 'sold');
                            div_number.style.backgroundColor = "#ffcccc"; // Rojo para no disponible
                            div_number.style.cursor = "not-allowed";
                        }
                    });

                    load_2.style.display = "none";
                    //reserve_tickets_modalPerson.innerHTML = "";
                    reserve_tickets_modalPerson.style.display = "none"
                    p_modal_person.innerHTML = "Ya quedaron apartados tus boletos! Te estamos redirigiendo a WhatsApp..."
                    p_modal_person.style = "";
                    p2_modal_person.innerHTML = "Si no te redirige haz click en el botón";
                    p2_modal_person.style = "";
                    redirect_to_whatsapp_modalPerson.style = "";
                    //redirect_to_whatsapp_modalPerson.style = "";
                    setTimeout(() => {
                        window.open(
                            'https://wa.me/526421084845?text=' + 
                            '☘️🚨https://rifaseconomicasnavojoa.site%0A%0A' +
                            'Buenos%20dias%20sus%20boletos%20que%20📢daron%20apartados%20🙌🏻%20🍀%20Le%20sugerimos%20verificar%20su%20apartado%20de%20boletos%20🎫%20aquí%20👇🏻%0A' +
                            'https://rifaseconomicasnavojoa.site/s2-verificador%0A%0A' +
                            '🚨🍀Recuerde%20que%20son%20🚨%202horas%20de%20apartado🍀%0A%0A' +
                            '🚨🚨🧨📢📢%0Aojo,%20cuentas%20actualizadas%20📄🍀%0A' +
                            'Métodos%20de%20Pago%20💳%20🏧%0Ahttps://rifaseconomicasnavojoa.site/pagos%0A%0A' +
                            'Nota%20importante%20,%20checar%20que%20su%20pago%20no.se%20allá%20devuelto%20también%20es%20su%20responsabilidad%20gracias',
                            '_blank'
                        );
                    }, 1000);
                } else {
                    //console.log('Error al guardar los datos:', data.message);
                    console.log('Error al guardar los datos: ');
                }
            })
            .catch(error => {
                console.error('Hubo un error:', error);
                return;
            });
            
            
            /*
            // Crear un elemento de tipo botón
            const button_redirect_to_whatsapp = document.createElement("button");
            // Establecer el texto del botón
            button_redirect_to_whatsapp.textContent = "Redirigir a WhatsApp";
            // Añadir una clase al botón (opcional)
            button_redirect_to_whatsapp.classList.add("my-button");
            // Establecer un ID al botón (opcional)
            button_redirect_to_whatsapp.id = "redirigir_modal_person_btn";
            // Añadir un evento al botón (opcional)
            button_redirect_to_whatsapp.addEventListener("click", function() {
                alert("¡Has hecho clic en el botón!");
            });
            */

            //alert("Números seleccionados apartados con éxito.");

            //fetchNumbers(); // Volver a cargar los números
            div_selected_tickets_section.innerHTML = '';
            div_total_selectedTickets_section.innerHTML = '';
            div_text_selectedTickets_section.innerHTML = '';
            div_reserveTickets.style.display = "none";
        }
        
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
    } catch (error) {
        //console.error("Error al enviar el array:", error);
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "async function mark_multiple_tickets_as_sold(arr_reservedTickets, userId, name, option)",
            message_error
        };
        console.log(errorObj);
    }
    
}



redirigir_modal_person_btn.addEventListener("click", (event) =>{
    event.preventDefault(); // Evita el envío predeterminado del formulario
    window.open(
        'https://wa.me/526421084845?text=' + 
        '☘️🚨https://rifaseconomicasnavojoa.site%0A%0A' +
        'Buenos%20dias%20sus%20boletos%20que%20📢daron%20apartados%20🙌🏻%20🍀%20Le%20sugerimos%20verificar%20su%20apartado%20de%20boletos%20🎫%20aquí%20👇🏻%0A' +
        'https://rifaseconomicasnavojoa.site/s2-verificador%0A%0A' +
        '🚨🍀Recuerde%20que%20son%20🚨%202horas%20de%20apartado🍀%0A%0A' +
        '🚨🚨🧨📢📢%0Aojo,%20cuentas%20actualizadas%20📄🍀%0A' +
        'Métodos%20de%20Pago%20💳%20🏧%0Ahttps://rifaseconomicasnavojoa.site/pagos%0A%0A' +
        'Nota%20importante%20,%20checar%20que%20su%20pago%20no.se%20allá%20devuelto%20también%20es%20su%20responsabilidad%20gracias',
        '_blank'
    );
});



input_modal_whatsapp.addEventListener("input", (event) => {
    const value_whatsapp = event.target.value;
    if (!value_whatsapp) {
        //input_modal_whatsapp.style.backgroundColor = "#ffbbbb";
        //input_modal_whatsapp.style.border = "2px solid red";
    } else {
        input_modal_whatsapp.style = "";
    }
});



input_modal_name.addEventListener("input", (event) => {
    const value_name = event.target.value;
    if (!value_name) {
        //input_modal_name.style.backgroundColor = "#ffbbbb";
        //input_modal_name.style.border = "2px solid red";
    } else {
        input_modal_name.style = "";
    }
});



input_modal_last_name.addEventListener("input", (event) => {
    const value_lastName = event.target.value;
    if (!value_lastName) {
        //input_modal_last_name.style.backgroundColor = "#ffbbbb";
        //input_modal_last_name.style.border = "2px solid red";
    } else {
        input_modal_last_name.style = "";
    }
});



input_modal_select_states.addEventListener("change", (event) => {
    const value_selectState = event.target.value;
    if (!value_selectState) {
    } else {
        input_modal_select_states.style = "";
    }
});








/*
const timestamp = new Date();
console.log("FECHA y HORA:");
console.log(timestamp);
*/

/*
async function getGoogleLocation() {
    const apiKey = 'AIzaSyAlI9n0wwwoG7HPLh4bvl3RsdSk8JUuD5M';
    const response = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`, {
        method: 'POST'
    });
    const data = await response.json();
    if (data.location) {
        const accuracy = data.accuracy; // Precisión en metros
        const latitude = data.location.lat;
        const longitude = data.location.lng;
        console.log("API de geolocalización de Google Maps");
        console.log('Latitud:', latitude);
        console.log('Longitud:', longitude);
        //console.log('Precisión:', accuracy, 'metros');
        const exactitud = "Precision - "+accuracy+" metros";
        console.log(exactitud);
        const response = await fetch(API_GEOLOCALIZACION_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({latitude, longitude, exactitud}),
        });
        
        if (response.ok) {
            //console.log(response);
            return {latitude, longitude, accuracy};
        }
        if (!response.ok) {
            console.log(response);
        }
    } else {
        console.log('No se pudo obtener la ubicación exacta');
    }
}

getGoogleLocation();
*/




/* Función para inicializar el mapa
async function initMap() {
    const geolocalizacionGoogleMaps = await getGoogleLocation();

    console.log("geolocalizacionGoogleMaps:");
    console.log(geolocalizacionGoogleMaps);

    const latitud = geolocalizacionGoogleMaps.latitude;
    const longitud = geolocalizacionGoogleMaps.longitude;
    console.log("latitud: " + latitud);
    console.log("longitud: " + longitud);

    // Crear el objeto mapa
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: latitud, lng: longitud },  // Coordenadas de ejemplo (Nueva York)
        zoom: 12  // Nivel de zoom
    });

    // Opcional: Agregar un marcador en el mapa
    const marker = new google.maps.Marker({
        position: { lat: latitud, lng: longitud },  // Coordenadas de ejemplo
        map: map,
        //title: 'Ubicación de Nueva York'
    });
}*/













/* Cargar los números al iniciar
fetchNumbers();
*/