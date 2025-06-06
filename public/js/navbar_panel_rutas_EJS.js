const screenWidth = screen.width; // Ancho del monitor
const screenHeight = screen.height; // Alto del monitor
//console.log(`Resolución del monitor: ${screenWidth}x${screenHeight}`);

const availableWidth = screen.availWidth; // Ancho disponible
const availableHeight = screen.availHeight; // Alto disponible
//console.log(`Área de trabajo disponible: ${availableWidth}x${availableHeight}`);

const windowWidth = window.innerWidth; // Ancho de la ventana
const windowHeight = window.innerHeight; // Alto de la ventana
//console.log(`Tamaño de la ventana: ${windowWidth}x${windowHeight}`);

const pixelRatio = window.devicePixelRatio; // Escala del dispositivo
//console.log(`Relación de píxeles del dispositivo: ${pixelRatio}`);





document.addEventListener("DOMContentLoaded", function () {
    
});





// Ahora que el contenido está cargado, inicializa los eventos
const menuBtn = document.getElementById('menu-panel-btn');
const sidebar = document.getElementById('sidebar_panel');
//console.log("menuBtn:", menuBtn);
//console.log("sidebar:", sidebar);

if (sidebar) {
    const sidebarItems = sidebar.querySelectorAll('li > a');

    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    sidebarItems.forEach(item => {
        item.addEventListener('click', function () {
            const parent = this.parentElement;
            if (parent.classList.contains('active')) {
                parent.classList.remove('active');
            } else {
                sidebarItems.forEach(i => i.parentElement.classList.remove('active'));
                parent.classList.add('active');
            }
        });
    });
} else {
    console.error('Sidebar no encontrado en el DOM.');
}





window.addEventListener('resize', () => {
    // Seleccionar el div por su ID
    const sidebar = document.getElementById('sidebar_panel');
    const screenWidth = window.innerWidth;

    if (screenWidth >= 999) {
        // Quitar la clase 'active'
        sidebar.classList.remove('active');
    } else {
        // Agregar la clase 'active'
        //sidebar.classList.add('active');
    }
});