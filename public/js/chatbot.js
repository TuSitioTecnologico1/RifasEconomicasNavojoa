const API_CHATBOT_URL = config_API.CHATBOT_URL;


// 🔁 Variable global para saber si ya se abrió el chat alguna vez
let chatOpenedOnce = false;


// ========================
// VARIABLES PARA CONTROL DE SOPORTE HUMANO - Agregadas el 31-01-2026
// ========================

// Indica si el chat ya pasó del bot a un humano
let modoSoporte = false;

// Cuenta cuántas veces el bot no entendió al usuario
let intentosFallidos = 0;

// Número máximo de errores del bot antes de pasar a soporte
const MAX_INTENTOS_BOT = 2;

// Socket.IO (solo se inicializa cuando se activa soporte humano)
let socket = null;

const mensajesSoportePendientes = [];





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

        marcarMensajesSoporteComoVistos();

        // 💬 Solo enviamos el mensaje de bienvenida y las opciones la PRIMERA VEZ
        if (!chatOpenedOnce) {
            // ⏳ Esperamos un poco para que se vea más natural
            setTimeout(() => {

                fetch(API_CHATBOT_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userMsg: 'hola' })
                })
                .then(response => response.json())
                .then(data => {
                    appendMessage('Asistente', {'type': 'text', 'content': '¡Hola! 👋 ¿En qué puedo ayudarte hoy?'});
                    appendMessage('Asistente', data);
                })
                .catch(error => {
                    console.error("❌ Error al cargar opciones iniciales:", error);
                    appendError("No se pudieron cargar las opciones iniciales.");
                });

            }, 500);

            chatOpenedOnce = true;
        }
    }
}





// ========================
// 🔽 INICIO CÓDIGO AGREGADO
// ACTIVAR SOPORTE HUMANO
// ========================

/**
 * Cambia el chat del modo BOT a modo SOPORTE HUMANO.
 * Inicializa Socket.IO y muestra mensaje informativo al usuario.
 */
function activarSoporteHumano() {
    try {
        console.log("function activarSoporteHumano() {");
        modoSoporte = true;

        appendMessage('Asistente', {
            type: 'text',
            content: '🔔 Te estoy comunicando con un agente de soporte humano. Por favor espera...'
        });

        socket = io();

        socket.emit('soporte:join', {
            pagina: window.location.pathname,
            fecha: new Date()
        });
        
        socket.on('soporte:mensaje', data => {

            appendMessage('Soporte', {
                type: 'text',
                content: data.mensaje
            });

            mensajesSoportePendientes.push(data);

            // ✅ AVISAR ENTREGA (SIEMPRE)
            socket.emit('soporte:mensaje-entregado', {
                messageId: data.messageId
            });

            // ❌ NO marcar visto aquí
        });

        /*
        socket.on('soporte:mensaje', data => {
            appendMessage('Soporte', {
                type: 'text',
                content: data.mensaje
            });

            console.log('📩 messageId recibido:', data.messageId);

            mensajesSoportePendientes.push(data);

            // Si el chat YA está abierto → marcar visto
            if (document.getElementById('chat-box').style.display !== 'none') {
                marcarMensajesSoporteComoVistos();
            }
        });
        */

        // =======================================
        // SOPORTE está escribiendo (UI CLIENTE)
        // =======================================

        socket.on('soporte:soporte-escribiendo', () => {
            document.getElementById('soporte-typing').style.display = 'block';
        });

        socket.on('soporte:soporte-dejo-escribir', () => {
            document.getElementById('soporte-typing').style.display = 'none';
        });

    } catch (error) {
        console.log("try {} catch (error) {} - LINEA 119");
        console.log("Error: ", error);
    }
    
}

// ========================
// 🔼 FIN CÓDIGO AGREGADO
// ========================



function marcarMensajesSoporteComoVistos() {
    mensajesSoportePendientes.forEach(msg => {
        socket.emit('soporte:mensaje-visto', {
            messageId: msg.messageId
        });
    });

    mensajesSoportePendientes.length = 0;
}





// ========================
// PASO 5 - INTERACCIÓN REAL DEL USUARIO
// ========================

const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');

function usuarioInteractuoConChat() {
    if (!modoSoporte || !socket) return;

    // Solo marcar si hay mensajes pendientes
    if (mensajesSoportePendientes.length > 0) {
        marcarMensajesSoporteComoVistos();
    }
}

// Click en cualquier parte del chat
chatBox.addEventListener('click', usuarioInteractuoConChat);

// Focus en el input
chatInput.addEventListener('focus', usuarioInteractuoConChat);







async function handleKeyPress(event) {

    if (event.key === 'Enter') {
        console.log("if (event.key === 'Enter') {");
        let input = document.getElementById('chat-input');
        let userMsg = input.value.trim();
        if (!userMsg) return;

        
        try {
            // ========================
            // 🔽 INICIO CÓDIGO AGREGADO
            // SI YA ESTAMOS EN SOPORTE HUMANO
            // ========================
            if (modoSoporte) {
                //console.log("============================================================================");
                console.log("if (modoSoporte) {");
                //console.log("============================================================================");
                appendMessage('Tú', { type: 'text', content: userMsg });

                socket.emit('soporte:mensaje', {
                    mensaje: userMsg
                });

                input.value = '';
                return;
            }
            // ========================
            // 🔼 FIN CÓDIGO AGREGADO
            // ========================
        } catch (error) {
            console.log("try {} catch (error) {} - LINEA 158");
            appendError("Ocurrió un error inesperado. Intenta de nuevo.");
        }



        userMsg = { 'type': 'text', 'content': userMsg };
        appendMessage('Tú', userMsg);
        userMsg.content = input.value.trim().toLowerCase();
        input.value = '';

        if (typeof userMsg === 'object') {
            console.log("if (typeof userMsg === 'object') {");
            userMsg = userMsg.content;
        }

        try {
            const response = await fetch(API_CHATBOT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userMsg })
            });

            const statusCode = response.status;
            const data = await response.json();

            if (statusCode === 200) {
                console.log("if (statusCode === 200) {");
                appendMessage('Asistente', data);


// ========================
// 🔽 INICIO CÓDIGO AGREGADO
// DETECTAR CUANDO EL BOT NO ENTIENDE
// ========================
                if (data.type === 'text' && data.content.toLowerCase().includes('no entend')) {
                    console.log("if (data.type === 'text' && data.content.toLowerCase().includes('no entend')) {");
                    intentosFallidos++;

                    if (intentosFallidos >= MAX_INTENTOS_BOT) {
                        activarSoporteHumano();
                        return;
                    }
                }else{
                    console.log("else - DETECTAR CUANDO EL BOT NO ENTIENDE");
                }
// ========================
// 🔼 FIN CÓDIGO AGREGADO
// ========================

            }

        } catch (error) {
            console.log("try {} catch (error) {} - LINEA 204");
            appendError("Ocurrió un error inesperado. Intenta de nuevo.");
        }
    }
}





let typingTimeout = null;

document.getElementById('chat-input').addEventListener('input', () => {
    if (!modoSoporte || !socket) return;

    socket.emit('soporte:typing');

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit('soporte:stop-typing');
    }, 1000);
});










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





