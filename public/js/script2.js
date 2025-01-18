// URLs del servidor backend
const API_GEOLOCALIZACION_URL = "https://rifaseconomicasnavojoa.site/api/obtener_geolocalizacion";





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
    carousel_rifasAbiertas ();
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





/*
document.getElementById('redirectButton').addEventListener('click', function() {
    window.location.href = 'https://rifaseconomicasnavojoa.site/r1-lista';
});
*/





// Datos para agregar dinámicamente secciones
const data = [
    {
        id: '#457',
        title: 'ITALIKA VORT X 300R 2024',
        description: '0KM AGRADECIMIENTO',
        fecha: '10 de enero 2025',
        images: [
            '/img/VORT_X_300R_2024_1.webp',
            '/img/VORT_X_300R_2024_2.webp',
            '/img/VORT_X_300R_2024_3.webp',
        ],
        URL_listaBoletos: "https://rifaseconomicasnavojoa.site/lista-boletos/r1",
        URL_buscarMismosBoletos: "#",
        URL_verificadorBoletos: "https://rifaseconomicasnavojoa.site/verificador/r1",
        visible: 1,
    },
    {
        id: '#458',
        title: 'FORD F-150 RAPTOR 2024',
        description: '0KM AGRADECIMIENTO',
        fecha: '15 de febrero 2025',
        images: [
            '/img/Ford_Lobo_Raptor_High_2024_1.webp',
            '/img/Ford_Lobo_Raptor_High_2024_2.webp',
            '/img/Ford_Lobo_Raptor_High_2024_3.webp',
        ],
        URL_listaBoletos: "#",
        URL_buscarMismosBoletos: "#",
        URL_verificadorBoletos: "#",
        visible: 1,
    },
    {
        id: '#459',
        title: 'CHEVROLET CHEYENNE 2023',
        description: '0KM AGRADECIMIENTO',
        fecha: '20 de marzo 2025',
        images: [
            '/img/chevrolet_cheyenne_2023_1.webp',
            '/img/chevrolet_cheyenne_2023_3.webp',
            '/img/chevrolet_cheyenne_2023_5.webp',
        ],
        URL_listaBoletos: "#",
        URL_buscarMismosBoletos: "#",
        URL_verificadorBoletos: "#",
        visible: 1,
    },
];

function createSection(item) {
    const section = document.createElement('div');
    section.classList.add('section-rifasAbiertas');
    /*
    const imagesHTML = item.images
        .map((src) => `<img src="${src}" alt="Imagen">`)
        .join('');
    */
    // Estructura específica para las imágenes
    const imagesHTML = `
        <div class="image-container-rifasAbiertas">
            <div class="main-image-rifasAbiertas">
            <img src="${item.images[0]}" alt="Imagen principal">
            </div>
            <div class="secondary-images-rifasAbiertas">
            ${item.images.slice(1).map((src) => `<img src="${src}" alt="Imagen secundaria">`).join('')}
            </div>
        </div>
    `;

    section.innerHTML = `
            ${imagesHTML}
            <div class="section-content-rifasAbiertas">
                <h3>${item.id}</h3>
                <h3>${item.title}</h3>
                <p>${item.fecha}</p>
                <div class="buttons-rifasAbiertas">
                    <button class="red">Lista disponible aquí</button>
                    <button class="blue">Buscar los mismos números</button>
                    <button class="orange">Verificador</button>
                </div>
            </div>
        `;
    
    // Añadir eventos a los botones
    const buttons = section.querySelectorAll('.buttons-rifasAbiertas button');
    buttons[0].addEventListener('click', () => {
        window.location.href = ''+item.URL_listaBoletos+''; // URL para "Lista disponible aquí"
    });
    buttons[1].addEventListener('click', () => {
        window.location.href = ''+item.URL_buscarMismosBoletos+''; // URL para "Buscar los mismos números"
    });
    buttons[2].addEventListener('click', () => {
        window.location.href = ''+item.URL_verificadorBoletos+''; // URL para "Verificador"
    });
    
    return section;
}

// Referencia al contenedor
const container = document.getElementById('container-rifasAbiertas');

// Agregar dinámicamente las secciones
data.forEach((item) => {
    if (item.visible == 1) {
        const section = createSection(item);
        container.appendChild(section);
    } else {
        
    }
    
});




function carousel_rifasAbiertas() {
    //console.log("function carousel_rifasAbiertas()");
    const images_carousel = document.querySelector('.carousel-images-rifasAbiertas');
    const totalImages_carousel = document.querySelectorAll('.carousel-images-rifasAbiertas img').length;
    const indicators_carousel = document.querySelectorAll('.indicator-span-rifasAbiertas');
    const prevButton = document.getElementById('btn_prev');
    const btn_listaBoletos = document.getElementById('btn-lista-boletos-rifasAbiertas');
    const nextButton = document.getElementById('btn_next');
    let index = 0;
    let isButtonDisabled = false;
    let isDragging = false; // Variable para controlar si se está arrastrando
    let startX = 0;  // Para almacenar la posición inicial del mouse
    let scrollLeft = 0; // Para almacenar la posición del scroll al iniciar el arrastre

    // URLs o acciones asociadas a cada imagen
    const actions = [
        { url: 'https://rifaseconomicasnavojoa.site/lista-boletos/r1', label: 'Lista disponible' },
        { url: '#', label: 'Lista disponible' },
        { url: '#', label: 'Lista disponible' },
    ];

    // Función para mostrar la imagen actual
    function showImage(index) {
        const offset = -index * 100;
        images_carousel.style.transform = `translateX(${offset}%)`;

        // Actualizar el indicador activo
        indicators_carousel.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        // Actualizar el texto y acción del botón "Lista disponible"
        btn_listaBoletos.textContent = actions[index].label;
        //console.log("btn_listaBoletos: ");
        //console.log(btn_listaBoletos);
        btn_listaBoletos.onclick = () => {
            //console.log("actions:");
            //console.log(actions);
            //console.log(actions[index].url);
            if (actions[index].url !== '#') {
                //console.log("if (actions[index].url !== '#') {");
                //console.log(actions[index].url);
                window.location.href = actions[index].url;
            }
        };
    }

    // Función para manejar la deshabilitación y habilitación de los botones
    function disableButtons() {
        isButtonDisabled = true;
        prevButton.disabled = true;
        nextButton.disabled = true;

        setTimeout(() => {
            isButtonDisabled = false;
            prevButton.disabled = false;
            nextButton.disabled = false;
        }, 1000);
    }

    // Evento para botón "Siguiente"
    nextButton.addEventListener('click', () => {
        if (!isButtonDisabled) {
            index = (index + 1) % totalImages_carousel;
            showImage(index);
            disableButtons();
        }
    });

    // Evento para botón "Anterior"
    prevButton.addEventListener('click', () => {
        if (!isButtonDisabled) {
            index = (index - 1 + totalImages_carousel) % totalImages_carousel;
            showImage(index);
            disableButtons();
        }
        
    });
    /*
    btn_listaBoletos.addEventListener('click', () => {
        window.location.href = 'https://rifaseconomicasnavojoa.site/r1-lista'; // URL para "Lista disponible aquí"
    });
    */

    // Hacer clic en un indicador para saltar a una imagen específica
    indicators_carousel.forEach((indicator, i) => {
        indicator.addEventListener('click', () => {
            index = i;
            showImage(index);
            disableButtons();
        });
    });

    // Desplazamiento automático cada 3 segundos
    setInterval(() => {
        index = (index + 1) % totalImages_carousel;
        showImage(index);
    }, 5000);

    // Inicializar el carrusel
    // Con esto al cargar la página, el botón "Lista disponible" en la primera imagen tendrá la acción correcta asignada.
    showImage(index); // Llamada inicial para configurar el estado

    /* Funcionalidad de arrastre
    images_carousel.addEventListener('mousedown', (e) => {
        console.log("images_carousel.addEventListener('mousedown', (e) => {");
        isDragging = true;
        startX = e.pageX; // Almacenar la posición inicial del mouse
        scrollLeft = images_carousel.scrollLeft; // Almacenar la posición de desplazamiento actual
    });

    images_carousel.addEventListener('mouseleave', () => {
        //console.log("images_carousel.addEventListener('mouseleave', () => {");
        isDragging = false; // Si el mouse sale del carrusel, detiene el arrastre
    });

    images_carousel.addEventListener('mouseup', () => {
        //console.log("images_carousel.addEventListener('mouseup', () => {");
        isDragging = false; // Detiene el arrastre al soltar el mouse
    });

    images_carousel.addEventListener('mousemove', (e) => {
        console.log("images_carousel.addEventListener('mousemove', (e) => {");
        if (!isDragging) return; // Solo se activa si está arrastrando
        e.preventDefault(); // Prevenir el comportamiento por defecto del navegador

        const moveX = e.pageX - startX; // Calcular el movimiento horizontal
        images_carousel.scrollLeft = scrollLeft - moveX; // Actualizar la posición del desplazamiento
    });
    */
}

