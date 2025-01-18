
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
    load_navbar ();
});





function load_navbar () {
    try {
        fetch('/pages/navbar2.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('navbar').innerHTML = data;
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






function toggleMenu() {
    const menu = document.querySelector('.navbar ul');
    menu.classList.toggle('active');
}


var contador = 1;

function navbarMenu (){
    //console.log("menuBar.addEventListener('click', function () {");
    const nav = document.querySelector('nav');
    const ul_menu = document.getElementById('ul_menu');
    console.log("nav:");
    console.log(nav);
    //console.log("contador:");
    //console.log(contador);

    if (contador === 1) {
        // Deslizar el menú hacia adentro (visible)
        nav.style.right = '0'; // Posición visible
        contador = 0;
        ul_menu.style.display = "";
    } else {
        // Ocultar el menú moviéndolo hacia la derecha
        nav.style.right = '-100%'; // Posición fuera de la pantalla
        contador = 1;
        ul_menu.style.display = "none";
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


/* Asegura el estado del menú al redimensionar la pantalla
window.addEventListener('resize', () => {
    const nav = document.querySelector('.navbar_menu');
    const screenWidth = window.innerWidth;

    if (screenWidth >= 950) {
        nav.style.right = '0'; // Mantener visible en pantallas grandes
    } else {
        nav.style.right = '-100%'; // Ocultar en pantallas pequeñas
    }
});
*/