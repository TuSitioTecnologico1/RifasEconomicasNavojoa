const API_CHATBOT_URL = config_API.CHATBOT_URL;


// 🔁 Variable global para saber si ya se abrió el chat alguna vez
let chatOpenedOnce = false;

/**
 * Función que muestra u oculta la ventana del chat
 */
function toggleChat() {
    // 🔍 Obtenemos la ventana del chat por su ID
    const box = document.getElementById('chat-box');

    // 🔍 Obtenemos el botón de abrir chat por su ID
    const btn_chat = document.getElementById('chat-toggle');

    // ✅ Verificamos si el chat está visible actualmente
    const isVisible = box.style.display !== 'none';

    if (isVisible) {
        // 🚫 Si ya está abierto, lo ocultamos
        box.style.display = 'none';

        // 👁️ Mostramos de nuevo el botón flotante
        btn_chat.style.display = 'block';

    } else {
        // ✅ Si está cerrado, eliminamos la propiedad display
        // Esto hará que use los estilos por defecto (desde el CSS)
        box.style.removeProperty('display');

        // ❌ Ocultamos el botón flotante mientras el chat está abierto
        btn_chat.style.display = 'none';

        // 💬 Solo enviamos el mensaje automático la PRIMERA VEZ
        if (!chatOpenedOnce) {
            // ⏳ Esperamos un poco para que se vea natural
            setTimeout(() => {
                appendMessage('Asistente', '¡Hola! 👋 ¿En qué puedo ayudarte hoy?');
            }, 500);

            // 🔒 Marcamos que ya se envió el mensaje de bienvenida
            chatOpenedOnce = true;
        }
    }
}



async function handleKeyPress(event) {
    // Verificar si la tecla presionada es Enter
    if (event.key === 'Enter') {
        // Obtener el elemento input del chat por su ID
        let input = document.getElementById('chat-input');

        // Obtener el texto del input y eliminar espacios al inicio y final
        let userMsg = input.value.trim();

        // Mostrar en consola el mensaje del usuario
        console.log("userMsg: ", userMsg);

        // Si el mensaje está vacío (sin texto), salir de la función sin hacer nada
        if (!userMsg) return;

        // Mostrar el mensaje del usuario en la interfaz de chat
        appendMessage('Tú', userMsg);

        // Limpiar el contenido del input para que el usuario pueda escribir otro mensaje
        input.value = '';

        // Convertir el mensaje a minúsculas (puede ser útil para normalizar texto)
        userMsg = userMsg.toLowerCase();

        // Guardar el tiempo justo antes de enviar la solicitud al servidor (medición alta precisión)
        const startTime = performance.now();

        // Enviar una solicitud POST al servidor con el mensaje del usuario en formato JSON
        const response = await fetch(API_CHATBOT_URL, {
            method: "POST", // Método HTTP POST para enviar datos
            headers: { "Content-Type": "application/json" }, // Definir el tipo de contenido JSON
            body: JSON.stringify({ userMsg }), // Convertir el mensaje a cadena JSON en el cuerpo de la petición
        });

        // Guardar el tiempo justo después de recibir la respuesta (headers y status, antes de leer el cuerpo)
        const endTime = performance.now();

        // Calcular la duración de la petición restando los tiempos (resultado en milisegundos)
        const duration = endTime - startTime;

        // Mostrar en consola cuánto tiempo tomó la petición fetch en responder
        console.log(`Tiempo de respuesta fetch: ${duration.toFixed(2)} ms`);

        // Verificar si la respuesta HTTP fue exitosa (códigos 200-299)
        if (!response.ok) {
            // Si hubo un error, imprimir en consola la respuesta para depuración
            console.log("response: ");
            console.log(response);
            // Aquí puedes agregar lógica para mostrar un mensaje de error al usuario, si quieres
        }

        // Obtener el código de estado HTTP de la respuesta
        const statusCode = response.status;

        // Leer el cuerpo de la respuesta y parsearlo como JSON
        const data = await response.json();

        // Si el código de estado indica éxito (200 OK)
        if (statusCode === 200) {
            // Mostrar en consola el objeto JSON recibido del servidor
            console.log("data: ", data);

            // Si la respuesta fue rápida (< 1 segundo), agregar un pequeño retraso antes de mostrar la respuesta del asistente
            if (duration < 1000) {
                // Retrasar medio segundo la aparición del mensaje para mejor UX
                setTimeout(() => {
                    appendMessage('Asistente', data.chatbotMsg);
                }, 500);
            } else {
                // Si tardó 1 segundo o más, mostrar el mensaje inmediatamente
                appendMessage('Asistente', data.chatbotMsg);
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
        // Obtiene el contenedor de mensajes del chat
        const chat = document.getElementById('chat-messages');

        // Crea un nuevo div para el mensaje
        const msg = document.createElement('div');

        // Determina si el mensaje es del usuario
        const isUser = sender === 'Tú';

        // Asigna clases CSS para estilo según el tipo de mensaje
        msg.className = 'message ' + (isUser ? 'user' : 'bot');

        // Inserta el texto dentro del mensaje, con el nombre del remitente
        msg.innerHTML = `<strong>${sender}:</strong><br>${text}`;

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





