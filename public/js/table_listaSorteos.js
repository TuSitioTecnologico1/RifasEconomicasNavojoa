//const config_API = config;

// URLs del servidor backend
const API_OBTENER_SORTEOS_URL = config_API.OBTENER_SORTEOS_URL;





let sorteosOriginales = []; // Lista global que contiene todos los sorteos originales

function nombreMes(index) {
    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    return meses[index] || "";
}


/*
document.addEventListener("DOMContentLoaded", function () {
    get_sorteos().then((data) => {
        if (data && data.length > 0) {
            generateTable_sorteos(data); // Llama a generateTable_sorteos con los datos cargados
        } else {
            console.log("No hay datos para mostrar en la tabla.");
        }
    });
});
*/







// Obtener sorteos 
let arr_sorteos = [];
async function get_sorteos() {
    try {
        //console.log("Se ejecutó: async function get_sorteos()");
        const response = await fetch(API_OBTENER_SORTEOS_URL);
        const json = await response.json();

        // Asegúrate de que json.data sea un array válido
        if (json.status === "success" && Array.isArray(json.data)) {
            arr_sorteos = json.data;
            console.log("arr_sorteos:", arr_sorteos);
            return arr_sorteos;
        } else {
            console.warn("Respuesta inesperada del servidor:", json);
            return [];
        }
        
        return arr_sorteos;
    } catch (error) {
        //console.log("Ha ocurrido un error, favor de intentar mas tarde: "+error);
        // (?.trim()) - Si el valor existe (es decir, no es undefined ni null), ejecuta el método .trim() 
        // y si el valor es undefined o null, la evaluación simplemente devuelve undefined y no intenta llamar a .trim().
        const message_error = String(error).split(":")[1]?.trim() || "Error desconocido";
        //console.log("message_error:");
        //console.log(message_error);
        let errorObj = {
            function: "async function get_sorteos()",
            message_error
        };
        console.log(errorObj);
        return []; // Retorna un arreglo vacío si ocurre un error
    }
    
}







function llenarSelectAños(data) {
    const selectAño = document.getElementById("select_filtroYear");
    const años = [...new Set(data.map(d => new Date(d.fecha_sorteo).getFullYear()))].sort((a, b) => b - a);

    años.forEach(año => {
        const option = document.createElement("option");
        option.value = año;
        option.textContent = año;
        selectAño.appendChild(option);
    });
}







function applyFilters() {
    const filtroEdicion = document.getElementById("input_buscarEdicion").value.toLowerCase();
    const filtroTitulo = document.getElementById("input_buscarTitulo").value.toLowerCase();
    const filtroActivo = document.getElementById("select_filtroActivo").value;
    const filtroAño = document.getElementById("select_filtroYear").value;
    const filtroMes = document.getElementById("select_filtroMes").value;

    const resultados = sorteosOriginales.filter(sorteo => {
        const edicionTexto = `#${sorteo.edicion || ""}`.toLowerCase();
        const tituloTexto = (sorteo.titulo_sorteo || "").toLowerCase();
        const activoTexto = String(sorteo.activo);
        const año = new Date(sorteo.fecha_sorteo).getFullYear().toString();
        const mes = nombreMes(new Date(sorteo.fecha_sorteo).getMonth()).toLowerCase();

        const coincideEdicion = filtroEdicion === "" || edicionTexto.includes(filtroEdicion);
        const coincideTitulo = filtroTitulo === "" || tituloTexto.includes(filtroTitulo);
        const coincideActivo = filtroActivo === "todos" || activoTexto === filtroActivo;
        const coincideAño = filtroAño === "" || año === filtroAño;
        const coincideMes = filtroMes === "" || mes === filtroMes;

        return coincideEdicion && coincideTitulo && coincideActivo && coincideAño && coincideMes;
    });

    generateTable_sorteos(resultados); // Mostrar los resultados filtrados
}







// Función para generar la tabla de sorteos y mostrarla en el contenedor indicado
// Función para generar la tabla o tarjetas de sorteos y mostrarla en el contenedor indicado
function generateTable_sorteos(data) {
    const tableContainer = document.getElementById("table-listaSorteos-panel"); // Contenedor donde se mostrará la tabla o las tarjetas

    // Definimos los campos que queremos mostrar en el orden deseado
    const camposVisibles = [
        { key: "edicion", label: "Edición" },
        { key: "titulo_sorteo", label: "Título" },
        { key: "emisiones", label: "Emisiones" },
        { key: "activo", label: "Activo" },
        { key: "fecha_sorteo", label: "Fecha del Sorteo" },
        { key: "id", label: "Id" }, // Aunque esté oculto visualmente, puede ser útil internamente
    ];

    // Campos que queremos ocultar visualmente pero conservar en el DOM (para uso interno)
    const camposOcultos = ["id"];

    // Detectamos el modo de vista seleccionado: "tabla" o "tarjetas"
    const modoVista = document.getElementById("select_vistaTabla")?.value || "tabla";

    // Limpiamos el contenedor antes de generar nuevo contenido
    tableContainer.innerHTML = "";

    // ======== MODO TARJETAS ========
    if (modoVista === "tarjetas") {
        const tarjetasContainer = document.createElement("div");
        tarjetasContainer.classList.add("tarjetas-container");

        data.forEach(item => {
            const tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjeta-item");

            // ----
            // Si el objeto 'item' tiene propiedad "imagen_destacada" y esta no está vacía,
            // se usa como fondo de la tarjeta con estilos CSS para que sea visible y el texto legible.
            if (item.imagen_destacada) {
                tarjeta.style.backgroundImage = `url(${item.imagen_destacada})`;
                tarjeta.style.backgroundSize = "cover";            // Cubrir todo el área
                tarjeta.style.backgroundPosition = "center center"; // Centrar la imagen
                tarjeta.style.position = "relative";                // Para efectos de superposición

                // Añadir una capa semi-transparente oscura para mejorar legibilidad del texto
                const overlay = document.createElement("div");
                overlay.style.position = "absolute";
                overlay.style.top = "0";
                overlay.style.left = "0";
                overlay.style.width = "100%";
                overlay.style.height = "100%";
                overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // negro con 50% de opacidad
                overlay.style.zIndex = "0"; // Detrás del texto

                tarjeta.appendChild(overlay);
            }

            // Crear un contenedor para el contenido textual que esté por encima del overlay
            const contenidoTarjeta = document.createElement("div");
            contenidoTarjeta.style.position = "relative";
            contenidoTarjeta.style.zIndex = "1";
            contenidoTarjeta.style.color = "white"; // texto blanco para contraste con fondo oscuro
            contenidoTarjeta.style.padding = "10px";

            // Generar contenido dinámico según los campos visibles
            camposVisibles.forEach(({ key, label }) => {
                let value = item[key];

                if (key === "edicion" && value !== null) value = "#" + value;
                if (key === "activo") value = value === "1" || value === 1 ? "Sí" : "No";

                const p = document.createElement("p");
                p.innerHTML = `<strong>${label}:</strong> ${value ?? ""}`;

                // Ocultar visualmente si está marcado como oculto
                if (camposOcultos.includes(key)) p.classList.add("campo_oculto_tbl_sorteos");

                contenidoTarjeta.appendChild(p);
            });

            tarjeta.appendChild(contenidoTarjeta); // Añadimos contenido textual encima del overlay

            tarjetasContainer.appendChild(tarjeta);
        });

        // Insertar tarjetas al contenedor
        tableContainer.appendChild(tarjetasContainer);

        // Activar desliz horizontal SOLO si las tarjetas ya existen (opcional)
        habilitarDeslizHorizontal(".tarjetas-container");

        return; // Salimos para no ejecutar el modo tabla
    }

    // ======== MODO TABLA ========
    // Creamos la tabla
    const table = document.createElement("table");
    table.classList.add("tabla_sorteos_superPanel");

    // Creamos un caption (título centrado encima de la tabla)
    const caption = document.createElement("caption");
    caption.textContent = "Sorteos";
    caption.classList.add("titulo_tabla");
    table.appendChild(caption);

    // Creamos el encabezado de la tabla
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Guardamos los índices de columnas que deben ocultarse
    const indicesOcultos = [];

    camposVisibles.forEach(({ key, label }, index) => {
        const th = document.createElement("th");
        th.textContent = label;

        // Si el campo está oculto, lo ocultamos visualmente y registramos su índice
        if (camposOcultos.includes(key)) {
            th.classList.add("campo_oculto_tbl_sorteos");
            indicesOcultos.push(index);
        }

        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Creamos el cuerpo de la tabla
    const tbody = document.createElement("tbody");

    data.forEach(item => {
        const row = document.createElement("tr");

        camposVisibles.forEach(({ key }, index) => {
            const td = document.createElement("td");
            let value = item[key];

            // Modificación personalizada por campo
            if (key === "edicion" && value !== null) value = "#" + value;

            if (key === "activo") {
                value = value === "1" || value === 1 ? "Sí" : "No";
                td.style.backgroundColor = value === "Sí" ? "#28a745" : "#dc3545"; // verde o rojo
                td.style.color = "#ffffff"; // texto blanco
            }

            // Ocultar celda si su índice está marcado como oculto
            if (indicesOcultos.includes(index)) {
                td.classList.add("campo_oculto_tbl_sorteos");
            }

            td.textContent = value !== null ? value : "";
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table); // Agregamos la tabla generada al DOM
}


/*
function generateTable_sorteos(data) {
    const tableContainer = document.getElementById("table-listaSorteos-panel"); // Contenedor donde se mostrará la tabla o las tarjetas

    // Definimos los campos que queremos mostrar en el orden deseado
    const camposVisibles = [
        { key: "edicion", label: "Edición" },
        { key: "titulo_sorteo", label: "Título" },
        { key: "emisiones", label: "Emisiones" },
        { key: "activo", label: "Activo" },
        { key: "fecha_sorteo", label: "Fecha del Sorteo" },
        { key: "id", label: "Id" }, // Aunque esté oculto visualmente, puede ser útil internamente
    ];

    // Campos que queremos ocultar visualmente pero conservar en el DOM (por ejemplo, para acciones futuras en JS)
    const camposOcultos = ["id"];

    // Detectamos el modo de vista seleccionado: "tabla" o "tarjetas"
    const modoVista = document.getElementById("select_vistaTabla")?.value || "tabla";

    // Limpiamos el contenedor antes de generar nuevo contenido
    tableContainer.innerHTML = "";

    // ======== MODO TARJETAS ========
    if (modoVista === "tarjetas") {
        const tarjetasContainer = document.createElement("div");
        tarjetasContainer.classList.add("tarjetas-container");

        data.forEach(item => {
            const tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjeta-item");

            // Generar contenido dinámico según los campos visibles
            camposVisibles.forEach(({ key, label }) => {
                let value = item[key];

                if (key === "edicion" && value !== null) value = "#" + value;
                if (key === "activo") value = value === "1" || value === 1 ? "Sí" : "No";

                const p = document.createElement("p");
                p.innerHTML = `<strong>${label}:</strong> ${value ?? ""}`;

                // Ocultar visualmente si está marcado como oculto
                if (camposOcultos.includes(key)) p.classList.add("campo_oculto_tbl_sorteos");

                tarjeta.appendChild(p);
            });

            tarjetasContainer.appendChild(tarjeta);
        });

        // Insertar tarjetas al contenedor
        tableContainer.appendChild(tarjetasContainer);

        // Si también quieres que en escritorio puedas arrastrar con el mouse como si fuera móvil
        // ✅ Activar desliz horizontal SOLO si las tarjetas ya existen
        habilitarDeslizHorizontal(".tarjetas-container");

        return; // Salimos para no ejecutar el modo tabla
    }

    // ======== MODO TABLA ========
    // Creamos la tabla
    const table = document.createElement("table");
    table.classList.add("tabla_sorteos_superPanel");

    // Creamos un caption (título centrado encima de la tabla)
    const caption = document.createElement("caption");
    caption.textContent = "Sorteos";
    caption.classList.add("titulo_tabla");
    table.appendChild(caption);

    // Creamos el encabezado de la tabla
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Guardamos los índices de columnas que deben ocultarse
    const indicesOcultos = [];

    camposVisibles.forEach(({ key, label }, index) => {
        const th = document.createElement("th");
        th.textContent = label;

        // Si el campo está oculto, lo ocultamos visualmente y registramos su índice
        if (camposOcultos.includes(key)) {
            th.classList.add("campo_oculto_tbl_sorteos");
            indicesOcultos.push(index);
        }

        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Creamos el cuerpo de la tabla
    const tbody = document.createElement("tbody");

    data.forEach(item => {
        const row = document.createElement("tr");

        camposVisibles.forEach(({ key }, index) => {
            const td = document.createElement("td");
            let value = item[key];

            // Modificación personalizada por campo
            if (key === "edicion" && value !== null) value = "#" + value;

            if (key === "activo") {
                value = value === "1" || value === 1 ? "Sí" : "No";
                td.style.backgroundColor = value === "Sí" ? "#28a745" : "#dc3545"; // verde o rojo
                td.style.color = "#ffffff"; // texto blanco
            }

            // Ocultar celda si su índice está marcado como oculto
            if (indicesOcultos.includes(index)) {
                td.classList.add("campo_oculto_tbl_sorteos");
            }

            td.textContent = value !== null ? value : "";
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table); // Agregamos la tabla generada al DOM
}
*/

/*
function generateTable_sorteos(data) {
    const tableContainer = document.getElementById("table-listaSorteos-panel");

    // Lista de campos visibles: clave del objeto + etiqueta a mostrar
    const camposVisibles = [
        { key: "id", label: "Id" },
        { key: "activo", label: "Activo" },
        { key: "edicion", label: "Edición" },
        { key: "titulo_sorteo", label: "Título" },
        { key: "emisiones", label: "Emisiones" },
        { key: "oportunidades", label: "Oportunidades" },
        { key: "cantidad_boletos", label: "Cantidad de Boletos" },
        { key: "fecha_sorteo", label: "Fecha del Sorteo" },
    ];

    // Campos que queremos ocultar visualmente, pero mantener en el DOM
    const camposOcultos = ["id"];

    // Creamos la tabla
    const table = document.createElement("table");
    table.classList.add("tabla_sorteos_superPanel");
    //table.classList.add("tabla_sorteos");

    // Título de la tabla
    const caption = document.createElement("caption");
    caption.textContent = "Sorteos";
    //caption.classList.add("titulo_tabla_sorteos_superPanel");
    caption.classList.add("titulo_tabla");
    table.appendChild(caption);

    // === CREAR ENCABEZADO ===
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Guardaremos los índices de columnas ocultas para aplicarlos también en el tbody
    const indicesOcultos = [];

    camposVisibles.forEach(({ key, label }, index) => {
        const th = document.createElement("th");
        th.textContent = label;

        if (camposOcultos.includes(key)) {
            th.classList.add("campo_oculto_tbl_sorteos");
            indicesOcultos.push(index); // Guardamos el índice de esta columna
        }

        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // === CREAR CUERPO DE LA TABLA ===
    const tbody = document.createElement("tbody");

    data.forEach(item => {
        const row = document.createElement("tr");

        camposVisibles.forEach(({ key }, index) => {
            const td = document.createElement("td");
            let value = item[key];

            // Modificación para campo edicion
            if (key === "edicion" && value !== null) {
                value = "#" + value;
            }

            // Conversión de activo a "Sí"/"No"
            if (key === "activo") {
                value = value === "1" || value === 1 ? "Sí" : "No";

                // Aplicar color de fondo y texto según el valor
                td.style.backgroundColor = value === "Sí" ? "#28a745" : "#dc3545"; // verde o rojo
                td.style.color = "#ffffff"; // texto blanco
            }
            
            // Ocultar celdas según el índice
            if (indicesOcultos.includes(index)) {
                td.classList.add("campo_oculto_tbl_sorteos");
            }

            td.textContent = value !== null ? value : '';
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    // Limpia y agrega la tabla
    tableContainer.innerHTML = "";
    tableContainer.appendChild(table);
}
*/


// Filtro dinámico por contenido de texto
/*
document.getElementById("filtroTablaSorteos").addEventListener("input", function () {
    const filtro = this.value.toLowerCase();
    const filas = document.querySelectorAll(".tabla_sorteos_superPanel tbody tr");

    filas.forEach(fila => {
        const textoFila = fila.textContent.toLowerCase();
        fila.style.display = textoFila.includes(filtro) ? "" : "none";
    });
});
*/






function habilitarDeslizHorizontal(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.warn("Contenedor de tarjetas no encontrado:", containerSelector);
        return; // 🚫 Evita error si no existe aún
    }

    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.classList.add('grabbing');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
        isDown = false;
        container.classList.remove('grabbing');
    });

    container.addEventListener('mouseup', () => {
        isDown = false;
        container.classList.remove('grabbing');
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5;
        container.scrollLeft = scrollLeft - walk;
    });
}









document.addEventListener("DOMContentLoaded", async function () {
    // Llamamos a la API para obtener los sorteos
    const data = await get_sorteos();

    // Verificamos si se obtuvo data válida
    if (data && data.length > 0) {
        // Guardamos una copia original para usar como base en los filtros
        sorteosOriginales = [...data];

        // Llenamos la tabla inicialmente sin filtros
        applyFilters();

        // === Asignar eventos de filtrado dinámico ===

        // Inputs de texto para buscar por edición o título
        document.querySelectorAll("#input_buscarEdicion, #input_buscarTitulo").forEach(input => {
            // Cada vez que el usuario escribe, se aplica el filtro
            input.addEventListener("input", applyFilters);
        });

        // Selects (desplegables) de filtros como Activo, Año, Mes
        document.querySelectorAll("#select_filtroActivo, #select_filtroYear, #select_filtroMes").forEach(select => {
            // Cada vez que cambia una opción del select, se aplica el filtro
            select.addEventListener("change", applyFilters);
        });

        // Botón de "Limpiar Filtros" para restablecer todos los campos
        document.getElementById("btnLimpiar")?.addEventListener("click", () => {
            // Limpiamos todos los campos
            document.getElementById("input_buscarEdicion").value = "";
            document.getElementById("input_buscarTitulo").value = "";
            document.getElementById("select_filtroActivo").value = "todos";
            document.getElementById("select_filtroYear").value = "";
            document.getElementById("select_filtroMes").value = "";

            // Volvemos a aplicar los filtros (mostrará todos los resultados)
            applyFilters();
        });

        // Llenar automáticamente el select con los años encontrados en los datos
        llenarSelectAños(data);

        // === Filtros colapsables (modo responsive) ===

        // Obtenemos referencias a los elementos necesarios
        const toggleBtn = document.getElementById("toggleFiltros"); // Botón para mostrar/ocultar filtros
        const filtrosContainer = document.getElementById("contenedorFiltros"); // Contenedor de todos los filtros

        // Listener para mostrar/ocultar filtros al hacer clic en el botón
        toggleBtn?.addEventListener("click", function () {
            filtrosContainer.classList.toggle("colapsado"); // Alternamos la clase para colapsar o mostrar

            // Cambiamos el texto del botón según el estado
            this.textContent = filtrosContainer.classList.contains("colapsado")
                ? "🔽 Filtros"      // Si está oculto
                : "🔼 Ocultar Filtros"; // Si está visible
        });

        // Función para manejar el comportamiento responsivo al cambiar el tamaño de la ventana
        function manejarResponsiveFiltros() {
            if (window.innerWidth >= 768) {
                // En pantallas grandes, los filtros siempre visibles
                //filtrosContainer.classList.remove("colapsado");
                filtrosContainer.classList.add("colapsado");
                //toggleBtn.style.display = "none"; // Ocultamos el botón
                toggleBtn.style.display = "inline-block"; // Mostramos el botón
            } else {
                // En pantallas pequeñas, filtros colapsados por defecto
                filtrosContainer.classList.add("colapsado");
                toggleBtn.style.display = "inline-block"; // Mostramos el botón
                toggleBtn.textContent = "🔽 Filtros"; // Restablecer texto
            }
        }

        // Ejecutamos la función de responsive al cargar
        manejarResponsiveFiltros();

        // Y también cada vez que el usuario redimensiona la ventana
        window.addEventListener("resize", manejarResponsiveFiltros);

        // Vista alterna: tabla vs tarjetas
        const selectVistaTabla = document.getElementById("select_vistaTabla");

        selectVistaTabla?.addEventListener("change", () => {
            applyFilters(); // Re-renderiza según el modo actual seleccionado
        });

        

    } else {
        // Si no hay datos, mostramos mensaje en consola
        console.log("No hay datos para mostrar en la tabla.");
    }
});













