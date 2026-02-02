const API_CHATBOT_URL = config_API.CHATBOT_URL;


// 🔁 Variable global para saber si ya se abrió el chat alguna vez
let chatOpenedOnce = false;

/**
 * Función que muestra u oculta la ventana del chat.
 * También envía automáticamente el mensaje "hola" la primera vez para recibir las opciones del asistente.
 */
function toggleChat() {
    // 🔍 Obtenemos la ventana del chat por su ID
    const box = document.getElementById('chat-box');

    // 🔍 Obtenemos el botón flotante de abrir chat
    const btn_chat = document.getElementById('chat-toggle');

    // ✅ Verificamos si el chat está visible actualmente
    const isVisible = box.style.display !== 'none';

    if (isVisible) {
        // 🚫 Si ya está abierto, lo ocultamos
        box.style.display = 'none';

        // 👁️ Mostramos de nuevo el botón flotante
        btn_chat.style.display = 'block';

    } else {
        // ✅ Si está cerrado, lo mostramos (quitamos display: none)
        box.style.removeProperty('display');

        // ❌ Ocultamos el botón flotante mientras el chat está abierto
        btn_chat.style.display = 'none';

        // 💬 Solo enviamos el mensaje de bienvenida y las opciones la PRIMERA VEZ
        if (!chatOpenedOnce) {
            // ⏳ Esperamos un poco para que se vea más natural
            setTimeout(() => {
                // 💬 Mostramos el mensaje de bienvenida
                //appendMessage('Asistente', '¡Hola! 👋 ¿En qué puedo ayudarte hoy?');

                // 🧠 Simulamos que el usuario escribió "hola" para obtener las opciones del backend
                fetch(API_CHATBOT_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userMsg: 'hola' })  // 👈 Esto puede activar respuestas con botones
                })
                .then(response => response.json())
                .then(data => {
                    //console.log("data:");
                    //console.log(data);
                    appendMessage('Asistente', {'type': 'text', 'content': '¡Hola! 👋 ¿En qué puedo ayudarte hoy?'});
                    // ✅ Mostramos la respuesta del backend (puede ser texto o array de opciones)
                    appendMessage('Asistente', data);
                })
               /*
                .then(data => {
                    console.log("data:");
                    console.log(data);

                    if (data.type === "text") {
                        // Respuesta tipo texto simple
                        appendMessage('Asistente', data.content);
                    } else if (data.type === "buttons") {
                        // Respuesta con botones: muestra el texto y las opciones
                        appendMessage('Asistente', data.content.text);

                        // Aquí puedes crear botones en el chat o mostrarlos en algún contenedor
                        // Ejemplo sencillo para mostrar opciones como botones:
                        const chatBox = document.getElementById('chat-box');

                        const buttonsContainer = document.createElement('div');
                        buttonsContainer.className = 'chat-buttons';

                        data.content.options.forEach(option => {
                            const btn = document.createElement('button');
                            btn.textContent = option.label;
                            btn.onclick = () => {
                                // Acción al pulsar cada botón, p.ej. enviar el valor al backend
                                enviarMensaje(option.value);
                            };
                            buttonsContainer.appendChild(btn);
                        });

                        chatBox.appendChild(buttonsContainer);
                    } else if (data.type === "error") {
                        appendError(data.content || "Error desconocido");
                    } else {
                        appendMessage('Asistente', "Respuesta no reconocida.");
                    }
                })
                */
                .catch(error => {
                    // ⚠️ Si hay un error en la solicitud, lo mostramos en consola y en el chat
                    console.error("❌ Error al cargar opciones iniciales:", error);
                    appendError("No se pudieron cargar las opciones iniciales.");
                });

            }, 500);

            // 🔒 Marcamos que ya se abrió una vez y no debe repetirse este proceso
            chatOpenedOnce = true;
        }
    }
}






async function handleKeyPress(event) {
    //console.log(" ----------> async function handleKeyPress(event){} <----------");

    // Verifica si la tecla presionada es Enter
    if (event.key === 'Enter') {
        // Obtiene el input del chat
        let input = document.getElementById('chat-input');

        // Obtiene y limpia el mensaje del usuario
        let userMsg = input.value.trim();

        // Si el mensaje está vacío, no hace nada
        if (!userMsg) return;

        // Estructura el mensaje en formato esperado
        userMsg = { 'type': 'text', 'content': userMsg };

        // Muestra el mensaje del usuario en el chat
        appendMessage('Tú', userMsg);

        // Convierte el contenido a minúsculas para estandarizar
        userMsg.content = input.value.trim().toLowerCase();

        // Limpia el campo de entrada
        input.value = '';

        if (typeof userMsg === 'string') {
            try {
                const posibleObjeto = JSON.parse(userMsg);
                if (typeof posibleObjeto === 'object' && posibleObjeto !== null && !Array.isArray(posibleObjeto)) {
                    //console.log('Era un string, pero contenía un objeto JSON');
                }
            } catch (err) {
                //console.log('Es un string común, no JSON');
            }
            
        } else if (typeof userMsg === 'object') {
            //console.log('Ya es un objeto');
            userMsg = userMsg.content;
        }


        try {
            // Marca el tiempo antes de hacer la solicitud (para medir duración)
            const startTime = performance.now();

            // Envía el mensaje al backend mediante fetch
            const response = await fetch(API_CHATBOT_URL, {
                method: "POST",                              // Método POST
                headers: { "Content-Type": "application/json" }, // Indica que se envía JSON
                body: JSON.stringify({ userMsg })            // Convierte el mensaje a JSON
            });
            
            // Si la respuesta tiene otro código de error (distinto de 2xx)
            if (!response.ok) {
                //console.log("response: ", response);
                //appendError("Ocurrió un error inesperado. Código: " + statusCode);
                //return;
            }

            // Marca el tiempo al recibir la respuesta
            const endTime = performance.now();
            const duration = endTime - startTime;

            // Obtiene el código de estado HTTP de la respuesta
            const statusCode = response.status;

            // Imprime en consola cuánto tardó la petición
            //console.log(`Tiempo de respuesta fetch: ${duration.toFixed(2)} ms`);

            // Intenta parsear el cuerpo de la respuesta como JSON
            const data = await response.json();
            
            // Manejo de error 500 (problema interno del servidor)
            if (statusCode === 500) {
                appendError("Estamos teniendo un problema técnico. Intenta nuevamente en unos momentos.");
                return;
            }

            // Manejo de error 503 (mantenimiento en curso)
            if (statusCode === 503 && data?.chatbotMsg === "MANTENIMIENTO_ACTIVO") {
                appendError("El asistente virtual está en mantenimiento temporal. Intenta más tarde.");
                return;
            }

            // Si todo salió bien (código 200)
            if (statusCode === 200) {
                //console.log("data: ", data);

                // Si la respuesta fue rápida, añade un pequeño retraso para naturalidad
                if (duration < 1000) {
                    setTimeout(() => {
                        //appendMessage('Asistente', data.chatbotMsg);
                        appendMessage('Asistente', data);
                    }, 500);
                } else {
                    //appendMessage('Asistente', data.chatbotMsg);
                    appendMessage('Asistente', data);
                }
            }

        } catch (error) {
            // NOTA: Cuando haces una solicitud con fetch, y el navegador no puede ni siquiera conectar, por ejemplo por estar sin red, 
            // obtienes un error del tipo TypeError con un mensaje como "Failed to fetch".
            
            // Si hay un error de red (por ejemplo, sin conexión)
            if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
                appendError("Parece que no tienes conexión a internet. Revisa tu red e intenta nuevamente.");
            } else {
                // Para cualquier otro error no controlado
                appendError("Ocurrió un error inesperado. Intenta de nuevo.");
            }
        }
    }
}





// ========================
// Carga de sonidos para el chatbot
// ========================

let sendSound, receiveSound;

try {
    // Intenta cargar el sonido para cuando el usuario envía un mensaje
    sendSound = new Audio('/sounds/chatbot/send_message.mp3');

    // Intenta cargar el sonido para cuando el bot responde
    receiveSound = new Audio('/sounds/chatbot/receive_message_3.mp3');
} catch (e) {
    // Si hay un error cargando los archivos, se muestra en consola
    console.error("No se pudo cargar uno o más archivos de sonido:", e);
}





// ========================
// Función para agregar mensajes al chat
// ========================

/**
 * Agrega un mensaje al área de chat con animación y sonido.
 * @param {string} sender - Nombre del remitente ('Tú' o 'Asistente').
 * @param {string} text - Contenido del mensaje.
 */
function appendMessage(sender, text) {
    try {
        /*
        console.log("sender:");
        console.log(sender);
        console.log("text:");
        console.log(text);
        */
        /*
        console.log("text.content:");
        console.log(text.content);
        console.log("text.content.text:");
        console.log(text.content.text);
        console.log("text.content.show_text:");
        console.log(text.content.show_text);
        console.log("text.content.option:");
        console.log(text.content.options);
        */

        // Obtiene el contenedor de mensajes del chat
        const chat = document.getElementById('chat-messages');

        // Crea un nuevo div para el mensaje
        const msg = document.createElement('div');

        // Determina si el mensaje es del usuario
        const isUser = sender === 'Tú';

        // Asigna clases CSS para estilo según el tipo de mensaje
        msg.className = 'message ' + (isUser ? 'user' : 'bot');

        if (text.type == "buttons") {
            if ('options' in text.content) {
                //console.log('La propiedad "options" está en el objeto');
                // Inserta el texto dentro del mensaje, con el nombre del remitente
                //msg.innerHTML = `<strong>${sender}:</strong><br>${text}`;
                // Verificamos si el texto es un array (opciones de respuesta)
                if (Array.isArray(text.content.options)) {
                    // Si son opciones, añadimos el nombre del remitente
                    msg.innerHTML = `<strong>${sender}:</strong><br>`;
                    
                    if (text.content.action == 1) {
                        // Agregamos el botón al div del mensaje
                        const textNode = document.createElement('label');
                        textNode.textContent = text.content.text;
                        msg.appendChild(textNode);
                    }
                    
                    // Por cada opción, creamos un botón
                    text.content.options.forEach(option => {
                        const button = document.createElement('button');
                        button.textContent = option.label;
                        button.className = 'chat-option-btn';

                        // Cuando se hace clic, se simula que el usuario envía el mensaje
                        button.onclick = () => {
                            //appendMessage('Tú', option.label);  // Muestra lo que eligió
                            handleUserOption(option.label);     // Procesa la opción elegida
                            msg.remove();                 // Quita las opciones (opcional)
                        };

                        // Agregamos el botón al div del mensaje
                        msg.appendChild(button);
                    });
                }
            }
        } 
        if (text.type == "text") {
            // Si es texto normal, lo mostramos con el nombre del remitente
            msg.innerHTML = `<strong>${sender}:</strong><br>${text.content}`;
            
            // Si el mensaje es del Asistente, detectamos redirecciones
            if (!isUser) {
                detectarYRedirigir(text.content);
            }
        }
            

        // Inicialmente oculta el mensaje (para animación)
        msg.classList.add('hidden');

        // Agrega el mensaje al chat
        chat.appendChild(msg);

        // Intenta reproducir el sonido correspondiente (usuario o bot)
        const sound = isUser ? sendSound : receiveSound;
        if (sound) {
            sound.play().catch(err => {
                console.warn("⚠️ Error al reproducir sonido:", err);
                // Opcional: agrega un mensaje de error en el chat si falla el sonido
                appendError("No se pudo reproducir el sonido.");
            });
        }

        // Después de un breve retraso, muestra el mensaje con animación
        setTimeout(() => {
            msg.classList.remove('hidden');   // Quita la clase que lo ocultaba
            msg.classList.add('fade-in');     // Agrega animación de aparición
            chat.scrollTop = chat.scrollHeight; // Hace scroll hacia abajo automáticamente
        }, 10);

    } catch (error) {
        // En caso de error general (DOM, lógica, etc), se muestra en consola
        console.error("❌ Error al agregar mensaje al chat:", error);

        // Y se muestra un mensaje visible en el chat indicando el fallo
        appendError("Ocurrió un error inesperado al mostrar el mensaje.");
    }
}






/**
 * Detecta palabras clave en el mensaje del asistente y redirige (hace scroll) a una sección específica del HTML.
 * @param {string} mensaje - El contenido del mensaje enviado por el asistente.
 */
function detectarYRedirigir(mensaje) {
    //console.log("function detectarYRedirigir(mensaje) {");
    const lowerMsg = mensaje.toLowerCase();

    // Verificamos si el mensaje debe redirigir a una sección
    if (lowerMsg.includes("comprar")) {
        const seccion = document.getElementById('main-content');

        if (seccion) {
            // Aplicamos desenfoque al resto del sitio, excepto el main (incluye chat)
            //document.getElementById('blur-wrapper').classList.add('blur-fondo');

            // Lista de IDs que NO deben recibir el estilo
            const excluir = ['blur-wrapper-mainContent']; // <-- aquí pones los IDs a excluir

            // Recorre todos los divs con clase 'div_blur_wrapper_class'. Aplicamos desenfoque al resto del sitio, excepto el main (incluye chat)
            document.querySelectorAll('.div_blur_wrapper_class').forEach(div => {
                if (!excluir.includes(div.id)) {
                    div.classList.add('blur-fondo');
                }
            });

            // Hacemos scroll hacia la sección deseada
            seccion.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Añadimos una clase de resaltado visual
            seccion.classList.add('resaltar-seccion');

            // Quitamos blur y resaltado luego de unos segundos
            setTimeout(() => {
                seccion.classList.remove('resaltar-seccion');
                //document.getElementById('blur-wrapper').classList.remove('blur-fondo');

                // Lista de IDs que NO deben recibir el estilo
                const excluir = ['blur-wrapper-mainContent']; // <-- aquí pones los IDs a excluir

                // Recorre todos los divs con clase 'div_blur_wrapper_class'. Quitamos desenfoque al resto del sitio, excepto el main (incluye chat)
                document.querySelectorAll('.div_blur_wrapper_class').forEach(div => {
                    if (!excluir.includes(div.id)) {
                        div.classList.remove('blur-fondo');
                    }
                });
            }, 5000);

            /* Mensajes flotantes específicos
            mostrarMensajeSobreElemento("Aquí puedes buscar un boleto por su número", 'search');
            
            setTimeout(() => {
                mostrarMensajeSobreElemento("Esta es la Maquinita de la Suerte", 'random-btn');
            }, 2000);
            
            setTimeout(() => {
                mostrarMensajeSobreElemento("Aquí se muestran los boletos disponibles", 'number-grid');
            }, 4000);
            */

            iniciarTour();
            
            // Mensaje flotante informativo
            const mensajeFlotante = document.createElement('div');
            mensajeFlotante.className = 'mensaje-flotante';
            mensajeFlotante.textContent = "Aquí puedes ver cómo comprar boletos";
            
            document.body.appendChild(mensajeFlotante);
            
            setTimeout(() => {
                mensajeFlotante.remove();
            }, 4500);
            
        }
    }
}



function mostrarMensajeSobreElemento(texto, idElemento) {
    //console.log("function mostrarMensajeSobreElemento(texto, idElemento) {");

    const elemento = document.getElementById(idElemento);
    if (!elemento) {
        console.warn("❌ No se encontró el elemento con ID:", idElemento);
        return;
    }

    // Asegúrate de que el elemento sea visible antes de medir
    setTimeout(() => {
        const rect = elemento.getBoundingClientRect();

        const mensaje = document.createElement('div');
        mensaje.className = 'mensaje-flotante-personalizado';
        mensaje.textContent = texto;

        // Posicionamiento flotante centrado arriba del elemento
        mensaje.style.position = 'absolute';
        mensaje.style.top = `${rect.top + window.scrollY - 60}px`;
        mensaje.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;

        document.body.appendChild(mensaje);

        // Quitar mensaje tras unos segundos
        setTimeout(() => {
            mensaje.remove();
        }, 4500);
    }, 300); // Esperamos un poco para que el scroll termine
}









/**
 * Simula que el usuario escribe una opción y presiona Enter.
 * @param {string} optionText - Texto de la opción seleccionada.
 */
function handleUserOption(optionText) {
    // Pone la opción como si el usuario la hubiera escrito
    document.getElementById('chat-input').value = optionText;

    // Crea un evento de tecla "Enter"
    const event = new KeyboardEvent('keypress', { key: 'Enter' });

    // Llama a la función que maneja el envío
    handleKeyPress(event);
}





// ========================
// Función auxiliar para mostrar errores visibles en el chat
// ========================

/**
 * Muestra un mensaje de error visual en el chat.
 * @param {string} errorText - Texto del error a mostrar.
 */
function appendError(errorText) {
    // Obtiene el área de mensajes
    const chat = document.getElementById('chat-messages');

    // Crea un div para el error
    const errorMsg = document.createElement('div');

    // Asigna clase de estilo para errores
    errorMsg.className = 'message error';

    // Inserta el texto del error con formato
    errorMsg.innerHTML = `<strong>Error:</strong><br>${errorText}`;

    // Agrega el mensaje al chat
    chat.appendChild(errorMsg);

    // Hace scroll hacia el fondo del chat automáticamente
    chat.scrollTop = chat.scrollHeight;
}















const pasosTour = [
    {
        elemento: 'step1',
        mensaje: 'Aquí puedes buscar un boleto por número.',
    },
    {
        elemento: 'step2',
        mensaje: 'Este botón lanza la Maquinita de la Suerte.',
    },
    {
        elemento: 'step3',
        mensaje: 'Aquí puedes seleccionar los boletos dando click sobre los deseados.',
    }
];

let pasoActual = 0;
let overlay, tooltip;

function iniciarTour() {
    //console.log("function iniciarTour() {");
    crearOverlay();
    mostrarPaso(pasoActual);
}

function crearOverlay() {
    //console.log("function crearOverlay() {");
    //overlay = document.createElement('div');
    //overlay.className = 'tour-overlay';
    //document.body.appendChild(overlay);
}

function mostrarPaso(indice) {
    //console.log("function mostrarPaso(indice) {");
    const paso = pasosTour[indice];
    //const el = document.getElementById(paso.elemento);
    const el = document.querySelector(`.${paso.elemento}`);
    if (!el) return;

    if (tooltip) tooltip.remove();

    const rect = el.getBoundingClientRect();

    tooltip = document.createElement('div');
    tooltip.className = 'tour-tooltip';
    tooltip.innerHTML = `
    ${paso.mensaje}
    <div class="tour-buttons">
      <button onclick="anteriorPaso()" ${indice === 0 ? 'disabled' : ''}>◀ Anterior</button>
      <button onclick="siguientePaso()">${indice === pasosTour.length - 1 ? 'Finalizar' : 'Siguiente ▶'}</button>
    </div>
  `;

    tooltip.style.top = `${rect.top + window.scrollY - 10}px`;
    tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;

    document.body.appendChild(tooltip);
}

function siguientePaso() {
    //console.log("function siguientePaso() {");
    if (pasoActual < pasosTour.length - 1) {
        pasoActual++;
        mostrarPaso(pasoActual);
    } else {
        finalizarTour();
    }
}

function anteriorPaso() {
    //console.log("function anteriorPaso() {");
    if (pasoActual > 0) {
        pasoActual--;
        mostrarPaso(pasoActual);
    }
}

function finalizarTour() {
    //console.log("function finalizarTour() {");
    if (overlay) overlay.remove();
    if (tooltip) tooltip.remove();
    pasoActual = 0;
}





