// script.js

// Referencias a elementos del DOM
const numberGrid = document.getElementById("number-grid");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const randomBtn = document.getElementById("random-btn");

// Generar números automáticamente
const numbers = [];
for (let i = 1; i <= 100; i++) {
    const paddedNumber = String(i).padStart(5, "0");
    numbers.push({ number: paddedNumber, available: true });
}

// Renderizar números en la cuadrícula
function renderNumbers() {
    numberGrid.innerHTML = ""; // Limpiar cuadrícula
    numbers.forEach((num, index) => {
        const numberElement = document.createElement("div");
        numberElement.classList.add("number", num.available ? "available" : "sold");
        numberElement.textContent = num.number;
        // Marcar números vendidos al hacer clic
        numberElement.addEventListener("click", () => {
            if (num.available) {
                numbers[index].available = false; // Cambiar estado a vendido
                renderNumbers(); // Volver a renderizar
            }
        });
        numberGrid.appendChild(numberElement);
    });
}

// Buscar un número
function searchNumber() {
    const query = searchInput.value.trim();
    if (query === "") {
        alert("Por favor ingresa un número para buscar.");
        return;
    }

    const foundNumber = numbers.find((num) => num.number === query);
    if (foundNumber) {
        alert(
            `El número ${query} está ${
                foundNumber.available ? "disponible" : "vendido"
            }.`
        );
    } else {
        alert(`El número ${query} no existe.`);
    }
}

// Seleccionar número aleatorio disponible
function selectRandomNumber() {
    const availableNumbers = numbers.filter((num) => num.available);
    if (availableNumbers.length === 0) {
        alert("No hay números disponibles.");
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const randomNumber = availableNumbers[randomIndex];
    alert(`Tu número de la suerte es: ${randomNumber.number}`);
}

// Eventos
searchBtn.addEventListener("click", searchNumber);
randomBtn.addEventListener("click", selectRandomNumber);

// Renderizar al inicio
renderNumbers();
