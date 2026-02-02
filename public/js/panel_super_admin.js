const config_API = config;

// URLs del servidor backend
const API_GEOLOCALIZACION_URL = config_API.GEOLOCALIZACION_URL;
const API_URL = config_API.URL;
const API_GET_CONFIG_PAGE_URL = config_API.GET_CONFIG_PAGE_URL;
const API_OBTENER_CONTEO_NUMEROS_URL = config_API.OBTENER_CONTEO_NUMEROS_URL;
const API_CREAR_SORTEO_URL = config_API.CREAR_SORTEO_URL;





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
    initialize();
    actualizar_visibilidad_inputs_preSorteo();
    actualizar_visibilidad_select_gandores();
    actualizar_visibilidad_inputs_lugares();
    actualizar_visibilidad_select_bonos();
    actualizar_visibilidad_inputs_bonos();
    actualizar_visibilidad_select_tipoPromoBoletos();
    actualizar_visibilidad_inputs_mensajes();
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







async function initialize() {
    try {
        //console.log("Haz entrado a: async function initialize() ");
        // Obtener números de la API
        await getConfiPage();
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





let arr_configPage = [];
async function getConfiPage() {
    try {
        const response = await fetch(API_GET_CONFIG_PAGE_URL);
        const data = await response.json();
        arr_configPage = data;
        console.log("Configuraciones pagina:", arr_configPage);
    } catch (error) {
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        console.log({
            function: "function getConfiPage()",
            message_error
        });
    }
}





let conteo_numeros = {};

// Obtener el conteo de boletos
async function get_conteo_numeros() {
    console.log("-----> async function get_conteo_numeros() <-----");
    try {
        const response = await fetch(API_OBTENER_CONTEO_NUMEROS_URL);
        const data = await response.json();

        if (data.status === "Success") {
            conteo_numeros = {
                reservados: data.reservados,
                pagados: data.pagados,
                libres: data.libres,
                id_sorteo: data.id_sorteo,
                fecha_creacion: data.fecha_creacion,
                fecha_actualizacion: data.fecha_actualizacion
            };

            //console.log("conteo_numeros:");
            //console.log(conteo_numeros);

            return conteo_numeros;
        } else {
            console.warn("Error desde API:", data.message);
            return {};
        }
    } catch (error) {
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        console.log({
            function: "async function get_conteo_numeros()",
            message_error
        });
        return {};
    }
}





// Actulizar conteo de boletos Reservados, Pagados y Libres
async function actualizar_conteo_boletos() {
    console.log("-----> async function actualizar_conteo_boletos() <-----");
    const conteo = await get_conteo_numeros();

    /*console.log("Reservados:", conteo.reservados);
    console.log("Pagados:", conteo.pagados);
    console.log("Libres:", conteo.libres);
    console.log("ID Sorteo:", conteo.id_sorteo);
    console.log("Fecha de creación:", conteo.fecha_creacion);
    console.log("Fecha de actualización:", conteo.fecha_actualizacion);*/

    document.getElementById("reservados_id_nav").innerText = conteo.reservados;
    document.getElementById("pagados_id_nav").innerText = conteo.pagados;
    document.getElementById("libres_id_nav").innerText = conteo.libres;

    document.getElementById("reservados_id_sidebar").innerText = conteo.reservados;
    document.getElementById("pagados_id_sidebar").innerText = conteo.pagados;
    document.getElementById("libres_id_sidebar").innerText = conteo.libres;
}

actualizar_conteo_boletos();









// ------------------------------------------------------------------------------------------------------------------
// ---------------------> Modal - FORMULARIO MULTIPLES PASOS - Crear Rifa (INICIO) <--------------------------------
// ------------------------------------------------------------------------------------------------------------------

// Variable que rastrea el paso actual - es usada en la funcion "updateSteps()"
let currentStep = 0;

// Obtiene el contenedor del modal del formulario de múltiples pasos
const formMultiplesPasos_modal = document.getElementById("formularioMultiplesPasosModal");

// Obtiene el botón que abre el modal (en este caso con id "btn_crearRifa_panel")
const openModalBtn = document.getElementById("btn_crearRifa_panel");

// Obtiene el botón para cerrar el modal
const closeModalBtn = document.getElementById("closeModalBtn");

// Evento para abrir el modal al hacer clic en el botón de abrir
openModalBtn.addEventListener("click", () => {
    formMultiplesPasos_modal.classList.remove("hidden"); // Muestra el modal quitando la clase 'hidden'
});

// Evento para cerrar el modal al hacer clic en el botón de cerrar
closeModalBtn.addEventListener("click", () => {
    formMultiplesPasos_modal.classList.add("hidden"); // Oculta el modal agregando la clase 'hidden'
    currentStep = 0; // Reinicia la variable que indica el paso actual del formulario (vuelve al paso 0)
    updateSteps(); // Llama a la función que actualiza la UI del formulario para mostrar solo el paso 1
});

// Evento que permite cerrar el modal si se hace clic fuera del contenido (clic en el fondo del modal)
window.addEventListener("click", (e) => {
    if (e.target === formMultiplesPasos_modal) {
        formMultiplesPasos_modal.classList.add("hidden"); // Oculta el modal
    }
});

// -------------------- Manejo del formulario multipaso --------------------

// Obtiene todos los pasos del formulario (cada paso tiene la clase "form-step")
const steps = document.querySelectorAll(".form-step");

// Obtiene los indicadores visuales del progreso (generalmente la barra superior con círculos o pasos)
const progressSteps = document.querySelectorAll(".step");

// Obtiene todos los botones "Next" (siguiente paso)
const nextBtns = document.querySelectorAll(".next");

// Obtiene todos los botones "Previous" (paso anterior)
const prevBtns = document.querySelectorAll(".prev");

// Variable que rastrea el paso actual
//let currentStep = 0;

// Función que actualiza la visibilidad de los pasos del formulario y el progreso visual
function updateSteps() {
    // Activa o desactiva la clase "active" en los pasos del formulario
    steps.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep); // Solo el paso actual tiene "active"
    });
    // Actualiza la barra de progreso (activa los pasos anteriores y el actual)
    progressSteps.forEach((step, index) => {
        step.classList.toggle("active", index <= currentStep);
    });
}

// Asigna funcionalidad a cada botón "Next"
nextBtns.forEach(btn => {
    if (btn.id !== "button_next_RifaInfo") { // Excluir el botón con validación personalizada
        btn.addEventListener("click", () => {
            if (currentStep < steps.length - 1) { // Asegura que no pase del último paso
                currentStep++; // Avanza al siguiente paso
                updateSteps(); // Actualiza visualmente el formulario
            }
        });
    }
});

// Asigna funcionalidad a cada botón "Prev"
prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (currentStep > 0) { // Asegura que no retroceda más allá del primer paso
            currentStep--; // Retrocede al paso anterior
            updateSteps(); // Actualiza visualmente el formulario
        }
    });
});

// Maneja el evento de envío del formulario
/*
document.getElementById("multiStepForm").addEventListener("submit", (e) => {
    console.log('----------> document.getElementById("multiStepForm").addEventListener("submit", (e) => {} <----------');
    console.log("entro 1");
    alert("¡Formulario enviado con éxito!"); // Muestra una alerta de éxito
    console.log("entro 2");
    formMultiplesPasos_modal.classList.add("hidden"); // Cierra el modal
    console.log("entro 3");
    currentStep = 0; // Reinicia el formulario al primer paso
    console.log("entro 4");
    updateSteps(); // Refresca los pasos para que solo el primero esté activo
    console.log("entro 5");
    e.preventDefault(); // Previene el envío real del formulario al backend
    console.log("entro 6");
});
*/





// Escucha el evento 'click' sobre el botón con ID "finish_form_pasos_modal_btn"
document.getElementById("finish_form_pasos_modal_btn").addEventListener("click", async () => {
    try {
        // 🎯 Obtener el formulario y modal
        const form = document.getElementById("multiStepForm");
        const formMultiplesPasos_modal = document.getElementById("formularioMultiplesPasosModal");

        if (!form) return;

        console.log("📤 Enviando datos del formulario con imágenes");

        // 🧠 Crear un objeto FormData que incluirá texto + imágenes
        const formData = new FormData(form); // Ya incluye los archivos si hay inputs type="file"

        // Convertimos campos del formulario a JSON plano
        const contenido_formData = Object.fromEntries(formData.entries());
        console.log("contenido_formData: ", contenido_formData);

        // ✍️ Armamos objetos separados para cada grupo de datos
        let json_infoRifa = {
            titulo: contenido_formData.titulo,
            edicion: contenido_formData.edicion,
            emisiones: contenido_formData.emisiones,
            oportunidades: contenido_formData.oportunidades,
            cantidad_boletos: contenido_formData.cantidad_boletos,
            fecha: contenido_formData.fecha,
        };

        let json_preSorteo = {
            quieres_presorteo: contenido_formData.select_presorteo,
            fecha_presorteo: contenido_formData.fechaPresorteo,
            presorteo: contenido_formData.presorteo,
        };

        let json_lugaresExtras = {
            quieres_mas_lugares: contenido_formData.select_masLugares,
            cantidad_lugares: contenido_formData.select_cantidadLugares,
            premio_lugar_2: contenido_formData.lugar_2,
            premio_lugar_3: contenido_formData.lugar_3,
            premio_lugar_4: contenido_formData.lugar_4,
            premio_lugar_5: contenido_formData.lugar_5,
        };

        let json_bonos = {
            quieres_bonos: contenido_formData.select_bonos,
            tipo_bono_personalizado_1: contenido_formData.tipo_bono_personalizado_1,
            bono_personalizado_1: contenido_formData.bono_personalizado_1,
            tipo_bono_personalizado_2: contenido_formData.tipo_bono_personalizado_2,
            bono_personalizado_2: contenido_formData.bono_personalizado_2,
            tipo_bono_personalizado_3: contenido_formData.tipo_bono_personalizado_3,
            bono_personalizado_3: contenido_formData.bono_personalizado_3,
            tipo_bono_personalizado_4: contenido_formData.tipo_bono_personalizado_4,
            bono_personalizado_4: contenido_formData.bono_personalizado_4,
            tipo_bono_personalizado_5: contenido_formData.tipo_bono_personalizado_5,
            bono_personalizado_5: contenido_formData.bono_personalizado_5,
        };

        // Agrupamos todos los datos JSON en un solo objeto
        const datosRifaJSON = {
            infoRifa: json_infoRifa,
            preSorteo: json_preSorteo,
            lugaresExtras: json_lugaresExtras,
            bonos: json_bonos
        };

        // 🔀 Reemplazamos los campos de texto por el JSON completo serializado
        formData.delete("titulo"); // Eliminamos campos repetidos
        formData.delete("edicion");
        formData.delete("emisiones");
        formData.delete("oportunidades");
        formData.delete("cantidad_boletos");
        formData.delete("fecha");
        // (opcional) eliminar otros campos si ya están en el JSON

        // 📦 Añadimos el JSON serializado como campo "datosRifa"
        formData.append("datosRifa", JSON.stringify(datosRifaJSON));

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        // 🔗 Enviar la petición al servidor
        const response = await fetch(API_CREAR_SORTEO_URL, {
            method: 'POST',
            body: formData, // Incluye archivos + JSON
        });

        const json = await response.json();
        console.log("Respuesta del servidor:", json);

        if (response.ok) {
            alert("✅ Sorteo creado correctamente");
            // Redireccionar, limpiar o lo que necesites
        } else {
            alert("❌ Error: " + (json?.error || "desconocido"));
        }

        // Ocultar modal y resetear pasos
        formMultiplesPasos_modal.classList.add("hidden");
        currentStep = 0;
        updateSteps();

    } catch (error) {
        console.error("❗ Error al enviar la rifa:", error);
        alert("❌ Falló el envío al servidor.");
    }
});



// Escucha el evento 'click' sobre el botón con ID "finish_form_pasos_modal_btn"
/*
document.getElementById("finish_form_pasos_modal_btn").addEventListener("click", async () => {
    console.log('document.getElementById("finish_form_pasos_modal_btn").addEventListener("click", async () => {');
    try {
        // Obtiene el formulario multipasos por su ID
        const form = document.getElementById("multiStepForm");

        // Obtiene el contenedor del modal que se va a ocultar al finalizar
        const formMultiplesPasos_modal = document.getElementById("formularioMultiplesPasosModal");

        // Verifica que el formulario exista en el DOM antes de continuar
        if (form) {
            // Mensaje de depuración en la consola
            console.log("Formulario enviado desde botón personalizado");

            // Crea un objeto FormData que contiene todos los datos del formulario (inputs, selects, textareas)
            const formData = new FormData(form);
            console.log("formData: ", formData);

            // Convierte el FormData en un objeto plano (tipo JSON) para poder enviarlo con fetch
            const contenido_formData = Object.fromEntries(formData.entries());
            console.log("contenido_formData: ", contenido_formData);

            let json_infoRifa = {
                titulo: contenido_formData.titulo,
                edicion: contenido_formData.edicion,
                emisiones: contenido_formData.emisiones,
                oportunidades: contenido_formData.oportunidades,
                cantidad_boletos: contenido_formData.cantidad_boletos,
                fecha: contenido_formData.fecha,
            };
            console.log("json_infoRifa: ", json_infoRifa);

            let json_precioBoletos = {
                precio: contenido_formData.precio_boleto,
                quieres_promos: contenido_formData.select_quieresPromoBoletos,
                tipo_promo: contenido_formData.select_tipoPromoBoletos,
                promo_personalizada: contenido_formData.tipo_promoPersonalizada,
            };
            console.log("json_precioBoletos: ", json_precioBoletos);

            let json_preSorteo = {
                quieres_presorteo: contenido_formData.select_presorteo,
                fecha_presorteo: contenido_formData.fechaPresorteo,
                presorteo: contenido_formData.presorteo,
            };
            console.log("json_preSorteo: ", json_preSorteo);

            let json_lugaresExtras = {
                quieres_mas_lugares: contenido_formData.select_masLugares,
                cantidad_lugares: contenido_formData.select_cantidadLugares,
                premio_lugar_2: contenido_formData.lugar_2,
                premio_lugar_3: contenido_formData.lugar_3,
                premio_lugar_4: contenido_formData.lugar_4,
                premio_lugar_5: contenido_formData.lugar_5,
            };
            console.log("json_lugaresExtras: ", json_lugaresExtras);

            let json_bonos = {
                quieres_bonos: contenido_formData.select_bonos,
                tipo_bono_personalizado_1: contenido_formData.tipo_bono_personalizado_1,
                bono_personalizado_1: contenido_formData.bono_personalizado_1,
                tipo_bono_personalizado_2: contenido_formData.tipo_bono_personalizado_2,
                bono_personalizado_2: contenido_formData.bono_personalizado_2,
                tipo_bono_personalizado_3: contenido_formData.tipo_bono_personalizado_3,
                bono_personalizado_3: contenido_formData.bono_personalizado_3,
                tipo_bono_personalizado_4: contenido_formData.tipo_bono_personalizado_4,
                bono_personalizado_4: contenido_formData.bono_personalizado_4,
                tipo_bono_personalizado_5: contenido_formData.tipo_bono_personalizado_5,
                bono_personalizado_5: contenido_formData.bono_personalizado_5,
            };
            console.log("json_bonos: ", json_bonos);

            //const arr_datosRifaJSON = [json_infoRifa, json_precioBoletos, json_preSorteo, json_lugaresExtras, json_bonos];

            const payload_datosRifaJSON = {
                infoRifa: json_infoRifa,
                precioBoletos: json_precioBoletos,
                preSorteo: json_preSorteo,
                lugaresExtras: json_lugaresExtras,
                bonos: json_bonos
            };

            try {
                // Realiza una petición POST a la API "/api/crear_sorteo"
                const response = await fetch(API_CREAR_SORTEO_URL, {
                    method: 'POST', // Método HTTP
                    headers: {
                        'Content-Type': 'application/json' // Indica que se enviará JSON
                    },
                    body: JSON.stringify(payload_datosRifaJSON) // Convierte el objeto a JSON y lo envía
                });

                // Espera y convierte la respuesta del servidor a JSON
                const json = await response.json();
                console.log("json: ", json);

                // Si la respuesta fue exitosa
                if (response.ok) {
                    alert('¡Contenido guardado correctamente!'); // Muestra alerta de éxito
                    console.log("response: ", response); // Muestra en consola los datos devueltos por el servidor
                    // window.location.reload(); // Puedes usar esto para recargar la página si lo necesitas
                } else {
                    // Si la respuesta fue con error, muestra un mensaje con el error recibido o uno genérico
                    alert('Error al guardar: ' + (response.error || 'Desconocido'));
                }
            } catch (error) {
                console.error("Error al enviar los datos de la rifa:", error);
            }
            
            

            // Muestra una alerta indicando que el formulario fue enviado (opcional, ya se muestra antes)
            //alert("¡Formulario enviado con éxito!");

            // Oculta el modal al agregar la clase "hidden"
            formMultiplesPasos_modal.classList.add("hidden");

            // Reinicia el paso actual del formulario multipasos a 0 (vuelve al inicio)
            currentStep = 0;

            // Llama a la función que actualiza la interfaz para mostrar el primer paso del formulario
            updateSteps();
        }
    } catch (error) {
        // En caso de error en la petición o en el proceso, muestra el error en consola y alerta al usuario
        console.error(error);
        alert('Falló la petición al servidor.');
    }

});
*/


// Escucha el evento 'click' sobre el botón con id "finish_form_pasos_modal_btn"
/*
document.getElementById("finish_form_pasos_modal_btn").addEventListener("click", async () => {

    try {
        // Obtiene el formulario multipasos usando su ID
        const form = document.getElementById("multiStepForm");

        // Si el formulario fue encontrado correctamente en el DOM...
        if (form) {
            // Imprime un mensaje en la consola del navegador (útil para depurar)
            console.log("Formulario enviado desde botón personalizado");

            
            const res = await fetch('/api/actualizar-contenido', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contenido)
            });
            
            const json = await res.json();
            
            if (json.ok) {
                alert('¡Contenido guardado correctamente!');
                console.log("json: ", json);
                // window.location.reload();
            } else {
                alert('Error al guardar: ' + (json.error || 'Desconocido'));
            }
            

            // Muestra una alerta al usuario indicando que el formulario fue enviado
            alert("¡Formulario enviado con éxito!");

            // Oculta el modal contenedor del formulario agregando la clase "hidden"
            formMultiplesPasos_modal.classList.add("hidden");

            // Reinicia la variable que indica el paso actual del formulario (vuelve al paso 0)
            currentStep = 0;

            // Llama a la función que actualiza la UI del formulario para mostrar solo el paso 1
            updateSteps();
        }
    } catch (error) {
        console.error(err);
        alert('Falló la petición al servidor.');
    }
        
});
*/


// ------------------------------------------------------------------------------------------------------------------
// ----------------------> Modal - FORMULARIO MULTIPLES PASOS - Crear Rifa (FIN) <----------------------------------
// ------------------------------------------------------------------------------------------------------------------










// Esta fucion se ejecuta cuando se quita el foco(click) del input "oportunidades"
// Esta función se ejecuta cuando el usuario quita el foco (clic fuera) del input con id "oportunidades"
document.getElementById("oportunidades").addEventListener("blur", async () => {
    
    // Obtener y limpiar (trim) los valores de los inputs del formulario
    let titulo_rifa = document.getElementById("titulo").value.trim();
    let edicion_rifa = document.getElementById("edicion").value.trim();
    let cantidad_emisiones = document.getElementById("emisiones").value.trim();
    let cantidad_oportunidades = document.getElementById("oportunidades").value.trim();

    // Definimos una lista de campos que deben validarse
    // Cada objeto contiene el id del input, el valor actual, el nombre del campo (para mostrar en errores)
    // y una bandera "debeSerNumero" para validar que sea numérico si es necesario
    const campos = [
        { id: "titulo", valor: titulo_rifa, nombre: "Título de la rifa" },
        { id: "edicion", valor: edicion_rifa, nombre: "Edición" },
        { id: "emisiones", valor: cantidad_emisiones, nombre: "Cantidad de emisiones", debeSerNumero: true },
        { id: "oportunidades", valor: cantidad_oportunidades, nombre: "Cantidad de oportunidades", debeSerNumero: true },
    ];

    // Arreglo para almacenar los mensajes de error que se generen
    let errores = [];

    // Recorremos cada campo para hacer las validaciones necesarias
    campos.forEach(campo => {
        const input = document.getElementById(campo.id); // obtenemos el input por su ID

        // Si el valor está vacío, agregamos un error
        if (campo.valor === "") {
            errores.push(`${campo.nombre} está vacío`);
            input.style.border = "2px solid red"; // marcamos el borde en rojo

        // Si debe ser un número y no lo es, agregamos un error
        } else if (campo.debeSerNumero && isNaN(campo.valor)) {
            errores.push(`${campo.nombre} debe ser un número`);
            input.style.border = "2px solid red";

        // Validación adicional: si el campo es "oportunidades", debe ser al menos 1
        } else if (campo.id === "oportunidades" && parseFloat(campo.valor) < 1) {
            errores.push(`${campo.nombre} no puede ser menor a 1`);
            input.style.border = "2px solid red";

        } else {
            input.style.border = ""; // si está correcto, limpiamos el borde rojo
        }
    });

    // Si hay errores, los mostramos en un alert y salimos de la función
    if (errores.length > 0) {
        alert("Errores:\n- " + errores.join("\n-")); // muestra cada error en una nueva línea
        document.getElementById("cantidad_boletos").value = ""; // limpiamos el campo de boletos
        return;
    }

    // Si todo está correcto, calculamos la cantidad de boletos
    // Dividimos la cantidad de emisiones entre la cantidad de oportunidades
    let cantidad_boletos = parseFloat(cantidad_emisiones) / parseFloat(cantidad_oportunidades);

    // Asignamos el resultado al campo de cantidad de boletos
    document.getElementById("cantidad_boletos").value = cantidad_boletos;
});





// Escucha el clic del botón personalizado del paso 1 (Información de la rifa)
document.getElementById("button_next_RifaInfo").addEventListener("click", () => {

    // Lista de campos a validar con sus nombres descriptivos
    const campos = [
        { id: "titulo", nombre: "Título de la rifa" },
        { id: "edicion", nombre: "Edición", debeSerNumero: true },
        { id: "emisiones", nombre: "Emisiones", debeSerNumero: true },
        { id: "oportunidades", nombre: "Oportunidades", debeSerNumero: true },
        { id: "fecha", nombre: "Fecha" },
        { id: "rifa_activa", nombre: "Estado de la rifa" },
    ];

    // Arreglo para acumular mensajes de error
    let errores = [];

    // Recorre todos los campos definidos
    campos.forEach(campo => {
        const input = document.getElementById(campo.id); // Obtiene el input por ID
        const valor = input.value.trim(); // Elimina espacios en blanco

        // Si el campo está vacío
        if (valor === "") {
            errores.push(`${campo.nombre} está vacío`);
            input.style.border = "2px solid red"; // Pinta borde rojo
        }
        // Si se espera que sea número y no lo es
        else if (campo.debeSerNumero && isNaN(valor)) {
            errores.push(`${campo.nombre} debe ser numérico`);
            input.style.border = "2px solid red"; // Pinta borde rojo
        }
        // Si todo está correcto, limpiar el borde (por si antes falló)
        else {
            input.style.border = "";
        }
    });

    // Si hay errores, mostrar alert y no continuar al siguiente paso
    if (errores.length > 0) {
        alert("Errores:\n- " + errores.join("\n- ")); // Muestra lista de errores
        document.getElementById("cantidad_boletos").value = ""; // Limpia campo de boletos
        return; // Detiene la función aquí: NO avanza al siguiente paso
    }

    // ✅ Si no hay errores, proceder a calcular la cantidad de boletos

    // Convertir valores a número flotante
    const emisiones = parseFloat(document.getElementById("emisiones").value);
    const oportunidades = parseFloat(document.getElementById("oportunidades").value);

    // Calcular cantidad de boletos
    const cantidad_boletos = emisiones / oportunidades;

    // Asignar el resultado al input correspondiente
    document.getElementById("cantidad_boletos").value = cantidad_boletos;

    // Mostrar en consola para depuración
    //console.log("BOLETOS:", cantidad_boletos);

    // ✅ Avanzar al siguiente paso solo si no estamos en el último
    if (currentStep < steps.length - 1) {
        currentStep++;         // Aumenta el paso actual
        updateSteps();         // Actualiza visualmente los pasos y el progreso
    }
});





document.getElementById("select_presorteo").addEventListener("change", actualizar_visibilidad_inputs_preSorteo);

function actualizar_visibilidad_inputs_preSorteo() {
    //console.log("function actualizar_inputs_PreSorteo() {}");
    let opcion = document.getElementById("select_presorteo").value;
    let input_detalles_presorteo = document.getElementById("div_presorteo");
    let input_fecha_presorteo = document.getElementById("div_fechaPresorteo");

    if (opcion == 0) {
        //console.log("if (opcion == 0) {");
        //input_detalles_presorteo.disabled = true;
        input_detalles_presorteo.style.display = "none";
        input_fecha_presorteo.style.display = "none";
    }
    if (opcion == 1) {
        //console.log("if (opcion == 1) {");
        //input_detalles_presorteo.disabled = false;
        input_detalles_presorteo.style.display = "";
        input_fecha_presorteo.style.display = "block";
    }
}





// Ejecutar al cambiar el select para elegir si quieres promos en los boletos
document.getElementById("select_quieresPromoBoletos").addEventListener("change", actualizar_visibilidad_select_tipoPromoBoletos);

function actualizar_visibilidad_select_tipoPromoBoletos() {
    //console.log("function actualizar_visibilidad_select_tipoPromoBoletos() {}");
    let opcion = document.getElementById("select_quieresPromoBoletos").value;
    let div_tipoPromoBoeletos = document.getElementById("div_tipoPromoBoletos");

    if (opcion == 0) {
        div_tipoPromoBoeletos.style.display = "none";
    }
    if (opcion == 1) {
        div_tipoPromoBoeletos.style.display = "block";
    }
}



// Ejecutar al cambiar el select para elegir si quieres alguna promo definida o una personalizada
document.getElementById("select_tipoPromoBoletos").addEventListener("change", actualizar_visibilidad_input_promoBoletosPersonalizada);

function actualizar_visibilidad_input_promoBoletosPersonalizada() {
    //console.log("function actualizar_visibilidad_input_promoBoletosPersonalizada() {}");
    let opcion = document.getElementById("select_tipoPromoBoletos").value;
    let tipo_promoPersonalizada = document.getElementById("tipo_promoPersonalizada");

    if (opcion == "promo_personalizada") {
        tipo_promoPersonalizada.style.display = "block";
    }else {
        tipo_promoPersonalizada.style.display = "none";
    }
}





document.getElementById("select_masLugares").addEventListener("change", actualizar_visibilidad_select_gandores);

function actualizar_visibilidad_select_gandores() {
    //console.log("function actualizar_select_gandores() {}");
    let opcion = document.getElementById("select_masLugares").value;
    let div_select_cantidadLugares = document.getElementById("div_select_cantidadLugares");

    if (opcion == 0) {
        //console.log("if (opcion == 0) {");
        div_select_cantidadLugares.style.display = "none";
        document.getElementById("select_cantidadLugares").value = "";
        actualizar_visibilidad_inputs_lugares();
    }
    if (opcion == 1) {
        //console.log("if (opcion == 1) {");
        div_select_cantidadLugares.style.display = "block";
    }
}

document.getElementById("button_next_CantidadLugares").addEventListener('click', function () {
    let opcion = document.getElementById("select_masLugares").value;
    if (opcion == 0) {
        document.getElementById("button_next_PremioLugares").click();
    }
});



// Ejecutar al cambiar la cantidad de bonos
document.getElementById("select_cantidadLugares").addEventListener("change", actualizar_visibilidad_inputs_lugares);

function actualizar_visibilidad_inputs_lugares() {
    const cantidad = parseInt(document.getElementById("select_cantidadLugares").value);

    // Ocultamos todos los pares de inputs primero
    for (let i = 1; i <= 5; i++) {
        const detalleInput = document.getElementById(`div_inputGroup_lugar_${i}`);
        if (detalleInput) {
            detalleInput.style.display = "none";
        }
    }

    // Mostramos solo los necesarios según la cantidad elegida
    for (let i = 1; i <= cantidad; i++) {
        const detalleInput = document.getElementById(`div_inputGroup_lugar_${i}`);
        if (detalleInput) {
            detalleInput.style.display = "";
        }
    }
}





document.getElementById("select_bonos").addEventListener("change", actualizar_visibilidad_select_bonos);

function actualizar_visibilidad_select_bonos() {
    //console.log("function actualizar_select_bonos() {}");
    let opcion = document.getElementById("select_bonos").value;
    let div_select_cantidadBonos = document.getElementById("div_select_cantidadBonos");

    if (opcion == 0) {
        //console.log("if (opcion == 0) {");
        div_select_cantidadBonos.style.display = "none";
        document.getElementById("select_cantidadBonos").value = "";
        actualizar_visibilidad_inputs_bonos();
    }
    if (opcion == 1) {
        //console.log("if (opcion == 1) {");
        div_select_cantidadBonos.style.display = "block";
    }
}

document.getElementById("button_back_bonos").addEventListener('click', function () {
    let opcion = document.getElementById("select_masLugares").value;
    if (opcion == 0) {
        document.getElementById("button_back_PremioLugares").click();
    }
});

document.getElementById("button_next_bonos").addEventListener('click', function () {
    let opcion = document.getElementById("select_bonos").value;
    if (opcion == 0) {
        document.getElementById("button_next_detallesBonos").click();
    }
});



// Ejecutar al cambiar la cantidad de bonos
document.getElementById("select_cantidadBonos").addEventListener("change", actualizar_visibilidad_inputs_bonos);

function actualizar_visibilidad_inputs_bonos() {
    const cantidad = parseInt(document.getElementById("select_cantidadBonos").value);

    // Ocultamos todos los pares de inputs primero
    for (let i = 1; i <= 5; i++) {
        const tipoInput = document.getElementById(`tipo_bono_personalizado_${i}`);
        const detalleInput = document.getElementById(`bono_personalizado_${i}`);
        if (tipoInput && detalleInput) {
            tipoInput.style.display = "none";
            detalleInput.style.display = "none";
        }
    }

    // Mostramos solo los necesarios según la cantidad elegida
    for (let i = 1; i <= cantidad; i++) {
        const tipoInput = document.getElementById(`tipo_bono_personalizado_${i}`);
        const detalleInput = document.getElementById(`bono_personalizado_${i}`);
        if (tipoInput && detalleInput) {
            tipoInput.style.display = "block";
            detalleInput.style.display = "block";
        }
    }
}





document.getElementById("select_mensajes").addEventListener("change", actualizar_visibilidad_select_mensajes);

function actualizar_visibilidad_select_mensajes() {
    //console.log("function actualizar_visibilidad_select_mensajes() {}");
    let opcion = document.getElementById("select_mensajes").value;
    let div_select_cantidadMensajes = document.getElementById("div_select_cantidadMensajes");

    if (opcion == 0) {
        //console.log("if (opcion == 0) {");
        div_select_cantidadMensajes.style.display = "none";
        document.getElementById("select_cantidadMensajes").value = "";
        actualizar_visibilidad_inputs_mensajes();
    }
    if (opcion == 1) {
        //console.log("if (opcion == 1) {");
        div_select_cantidadMensajes.style.display = "block";
    }
}

document.getElementById("button_back_mensajes").addEventListener('click', function () {
    let opcion = document.getElementById("select_bonos").value;
    if (opcion == 0) {
        document.getElementById("button_back_detallesBonos").click();
    }
});

document.getElementById("button_next_mensajes").addEventListener('click', function () {
    let opcion = document.getElementById("select_mensajes").value;
    if (opcion == 0) {
        document.getElementById("button_next_detallesMensajes").click();
    }
});



// Ejecutar al cambiar la cantidad de mensajes
document.getElementById("select_cantidadMensajes").addEventListener("change", actualizar_visibilidad_inputs_mensajes);

function actualizar_visibilidad_inputs_mensajes() {
    const cantidad = parseInt(document.getElementById("select_cantidadMensajes").value);

    // Ocultamos todos los div groups que contienen los inputs
    for (let i = 1; i <= 5; i++) {
        //const detalleInput = document.getElementById(`mensaje_${i}`);
        const detalleInput = document.getElementById(`div_inputGroup_mensaje_${i}`);
        if (detalleInput) {
            detalleInput.style.display = "none";
        }
    }

    // Mostramos solo los necesarios según la cantidad elegida
    for (let i = 1; i <= cantidad; i++) {
        //const detalleInput = document.getElementById(`mensaje_${i}`);
        const detalleInput = document.getElementById(`div_inputGroup_mensaje_${i}`);
        if (detalleInput) {
            detalleInput.style.display = "";
        }
    }
}





function fetchConBarraVisual() {
    console.log("function fetchConBarraVisual() {");
    try {
        const barra = document.getElementById('barra-progreso');
        let progreso = 0;

        barra.style.width = '0%';
        barra.style.background = 'linear-gradient(to right, #4caf50, #81c784)';
        barra.textContent = '0%';

        // Simular progreso visual con texto
        const intervalo = setInterval(() => {
            /*
            if (progreso < 90) {
                progreso += Math.floor(Math.random() * 3) + 1; // sube entre 1 y 3%
                if (progreso > 90) {
                    progreso = 90
                };
                barra.style.width = progreso + '%';
                barra.textContent = `Cargando ${progreso}%`;
            }
            */
           if (progreso < 100) {
                progreso += Math.floor(Math.random() * 3) + 1; // sube entre 1 y 3%
                if (progreso > 100) {
                    progreso = 100
                };
                barra.style.width = progreso + '%';
                barra.textContent = `Cargando ${progreso}%`;
            }
            if (progreso == 100) {
                console.log("INTERVENCION 1");
                document.getElementById("button_next_cargando").click();
                clearInterval(intervalo); // 🔴 DETIENE el setInterval
            }
        }, 200);

        

        /*
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        });

        const resultado = await response.json();
        */
        /*
        clearInterval(intervalo);
        barra.style.width = '100%';
        barra.textContent = 'Completado';
        */
        // Reinicia la barra después de 2 segundos
        /*
        setTimeout(() => {
            barra.style.width = '0%';
            barra.textContent = '0%';
        }, 2000);
        */
        //return true;

    } catch (error) {
        clearInterval(intervalo);
        barra.style.background = 'linear-gradient(to right, #e53935, #ef5350)';
        barra.style.width = '100%';
        barra.textContent = 'Error';

        setTimeout(() => {
            barra.style.width = '0%';
            barra.style.background = 'linear-gradient(to right, #4caf50, #81c784)';
            barra.textContent = '0%';
        }, 3000);

        console.error('Error al llamar fetch:', error);
    }
}

document.getElementById("button_next_detallesMensajes").addEventListener('click', fetchConBarraVisual);










// public/js/panel_super_admin.js

const iframe = document.getElementById('vista_previa');
const idsAEditar = [
  'p_edicion_reglon_1',
  'p_edicion_reglon_2',
  'p_edicion_reglon_3',
  'p_edicion_reglon_4',
  'p_fechaRifa',
  'span_listaBoletosAbajo',
  'div_precio_boletos',
  'div_con_boleto_liquidado',
  'div_premios_por_lugar',
  'div_presorteos',
  'div_bono_pronto_pago',
  'div_bono',
  'div_bono_especial',
  'div_pagos_realizados_despues',
  'div_mensajes_tmp_whatsapp',
  'div_bono_envio',
  'span_hazClickAbajo',
  'reserve-tickets-section-btn',
  'chooseNumber-btn',
  'random-btn',
  'h4_blancos_Disponibles',
  'div_footer_1'
  // agrega aquí más IDs de los <p> o <span> que quieras editar
];

if (iframe) { // Verificar que iframe exista antes de usarlo
    // 1) Al cargar el iframe, activa contentEditable en cada elemento
    iframe.onload = () => {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        idsAEditar.forEach(id => {
            const el = doc.getElementById(id);
            if (el) el.contentEditable = 'true';
            else console.warn(`No se encontró elemento con id="${id}"`);
        });
    };
} else {
    //console.warn("iframe no encontrado en el DOM");
}

// 2) Función para leer todos los textos y enviarlos al backend
async function guardarCambios() {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const contenido_iframe = {};

    idsAEditar.forEach(id => {
        const el = doc.getElementById(id);
        if (el) contenido_iframe[id] = el.innerText.trim();
    });

    console.log("contenido_iframe:");
    console.log(contenido_iframe);

    // Llamada a tu API para guardar en JSON o BD
    /*
    const res = await fetch('/api/actualizar-contenido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contenido)
    });
    const json = await res.json();
    if (json.ok) {
        alert('¡Contenido guardado correctamente!');
        // opcional: recarga la página principal para ver cambios fuera del iframe
        // window.location.reload();
    } else {
        alert('Error al guardar.');
    }
    */
}

//document.getElementById('gurdar_cambios_editar_rifa').addEventListener('click', guardarCambios);







// --------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------> Modal - Editar Rifa (INICIO) <------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------

document.getElementById("btn_editarMecanicaRifa_panel").addEventListener("click", openModal_editarRifa);

// Función para abrir el modal editar rifa con animación
function openModal_editarRifa() {
    const modal = document.getElementById("modal_panel_editar_rifa");
    modal.style.display = "flex"; // Muestra el modal
    setTimeout(() => {
        modal.classList.add("show"); // Agrega la clase para la animación
    }, 10); // Pequeño retraso para asegurar la transición
}

// Función para cerrar el modal editar rifa con animación
function closeModal_editarRifa() {
    const modal = document.getElementById("modal_panel_editar_rifa");
    modal.classList.remove("show"); // Quita la clase para la animación
    setTimeout(() => {
        modal.style.display = "none"; // Oculta el modal después de la animación
    }, 300); // El tiempo coincide con la duración de la animación en CSS
}

// Evento para cerrar el modal editar rifa
document.getElementById("close_modal_panel_editar_rifa").addEventListener("click", closeModal_editarRifa);

// --------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------> Modal - Editar Rifa (FIN) <------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------



// public/js/panel_super_admin.js

// ------------- VARIABLES -------------
const iframe_editar = document.getElementById('vista_previa_editar');

// Intentamos obtener los controles, pero no asumimos que existan en el DOM
const colorPicker_editar = document.getElementById('color_picker_editar');
const bgcolorPicker_editar = document.getElementById('bgcolor_picker_editar');
const fontSizePicker_editar = document.getElementById('font_size_picker_editar');

const idsAEditar_editar = [
    'p_edicion_reglon_1',
    'p_edicion_reglon_2',
    'p_edicion_reglon_3',
    'p_edicion_reglon_4',
    'p_fechaRifa',
    'span_listaBoletosAbajo',
    'div_precio_boletos',
    'div_con_boleto_liquidado',
    'div_premios_por_lugar',
    'div_presorteos',
    'div_bono_pronto_pago',
    'div_bono',
    'div_bono_especial',
    'div_pagos_realizados_despues',
    'div_mensajes_tmp_whatsapp',
    'div_bono_envio',
    'span_hazClickAbajo',
    'reserve-tickets-section-btn',
    'chooseNumber-btn',
    'random-btn',
    'h4_blancos_Disponibles',
    'div_footer_1'
];

if (iframe_editar) { // Verificar que iframe exista antes de usarlo
    // ------------- 1) AL CARGAR EL IFRAME -------------
    iframe_editar.onload = () => {
        const doc = iframe_editar.contentDocument || iframe_editar.contentWindow.document;

        // Activar contentEditable en cada elemento listados
        idsAEditar_editar.forEach(id => {
            const el = doc.getElementById(id);
            if (el) {
                el.contentEditable = 'true';
                // (Opcional) estilo visual para diferenciar elementos editables
                el.style.outline = '1px dashed #aaa';
                el.style.padding = '2px';
            }
        });

        // Ejecutamos styleWithCSS solo si vamos a usar execCommand más adelante
        // (no “truena” si no vamos a llamar a foreColor u otros)
        try {
            doc.execCommand('styleWithCSS', false, true);
        } catch (e) {
            console.warn('execCommand("styleWithCSS") no es compatible en este navegador');
        }

        // ========== EVENTO: Cambiar color de texto ==========
        if (colorPicker_editar) {
            colorPicker_editar.addEventListener('input', () => {
                const color = colorPicker_editar.value;
                // Solo llamamos execCommand si es posible
                try {
                    doc.execCommand('foreColor', false, color);
                } catch (e) {
                    console.warn('execCommand("foreColor") no es compatible en este navegador');
                }
            });
        }

        // ========== EVENTO: Cambiar color de fondo (highlight) ==========
        if (bgcolorPicker_editar) {
            bgcolorPicker_editar.addEventListener('input', () => {
                const bgColor = bgcolorPicker_editar.value;
                try {
                    // hiliteColor funciona en la mayoría, backColor en navegadores antiguos
                    if (!doc.execCommand('hiliteColor', false, bgColor)) {
                        doc.execCommand('backColor', false, bgColor);
                    }
                } catch (e) {
                    console.warn('execCommand("hiliteColor/backColor") no es compatible en este navegador');
                }
            });
        }

        // ========== EVENTO: Cambiar tamaño de fuente ==========
        if (fontSizePicker_editar) {
            fontSizePicker_editar.addEventListener('change', () => {
                const tamaño = fontSizePicker_editar.value;
                if (tamaño) {
                    try {
                        doc.execCommand('fontSize', false, tamaño);
                    } catch (e) {
                        console.warn('execCommand("fontSize") no es compatible en este navegador');
                    }
                }
                // Si deseas reiniciar el select luego de aplicarlo:
                // fontSizePicker_editar.value = '';
            });
        }
    };
}else {
    //console.warn("iframe no encontrado en el DOM");
}
    

// ------------- 2) FUNCIÓN PARA GUARDAR LOS CAMBIOS -------------
async function guardarCambios_editar() {
    const doc = iframe_editar.contentDocument || iframe_editar.contentWindow.document;
    const contenido_iframeEditar = {};

    idsAEditar_editar.forEach(id => {
        const el = doc.getElementById(id);
        if (el) {
            // innerHTML para capturar estilos inline (color, fondo, tamaño, etc.)
            contenido_iframeEditar[id] = el.innerHTML.trim();
        }
    });

    console.log("contenido_iframeEditar a enviar:");
    console.log(contenido_iframeEditar);

    // Aquí iría tu llamada a la API para guardar en la BD o JSON
    /*
    try {
      const res = await fetch('/api/actualizar-contenido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contenido)
      });
      const json = await res.json();
      if (json.ok) {
        alert('¡Contenido guardado correctamente!');
        // window.location.reload();
      } else {
        alert('Error al guardar: ' + (json.error || 'Desconocido'));
      }
    } catch (err) {
      console.error(err);
      alert('Falló la petición al servidor.');
    }
    */
}

document.getElementById('gurdar_cambios_editar_rifa').addEventListener('click', guardarCambios_editar);












// También podrías permitir edición directa
/*
document.getElementById("vista_previa").onload = () => {
    const iframe = document.getElementById("vista_previa");
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    // Esperamos a que el contenido del iframe esté completamente cargado
    if (doc.readyState === "complete") {
        const h1 = doc.querySelector("h1");
        if (h1) {
            h1.contentEditable = true; // Permite editar el h1 en vivo
        } else {
            console.warn("No se encontró ningún <h1> en el iframe.");
        }
    } else {
        // En caso de que no esté listo aún, esperamos a que lo esté
        doc.addEventListener("DOMContentLoaded", () => {
            const h1 = doc.querySelector("h1");
            if (h1) {
                h1.contentEditable = true;
            } else {
                console.warn("No se encontró ningún <h1> en el iframe después del DOMContentLoaded.");
            }
        });
    }
};
*/
