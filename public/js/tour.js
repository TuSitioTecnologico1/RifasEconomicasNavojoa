// tour.js

export class Tour {
  constructor(pasos) {
    this.pasos = pasos;
    this.pasoActual = 0;
    this.overlay = null;
    this.tooltip = null;
  }

  iniciar() {
    this.crearOverlay();
    this.mostrarPaso(this.pasoActual);
  }

  crearOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'tour-overlay';
    document.body.appendChild(this.overlay);
  }

  mostrarPaso(indice) {
    const paso = this.pasos[indice];
    const el = document.getElementById(paso.elemento);
    if (!el) return;

    if (this.tooltip) this.tooltip.remove();

    const rect = el.getBoundingClientRect();

    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tour-tooltip';
    this.tooltip.innerHTML = `
      ${paso.mensaje}
      <div class="tour-buttons">
        <button ${indice === 0 ? 'disabled' : ''}>◀ Anterior</button>
        <button>${indice === this.pasos.length - 1 ? 'Finalizar' : 'Siguiente ▶'}</button>
      </div>
    `;

    this.tooltip.style.top = `${rect.top + window.scrollY - 10}px`;
    this.tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;

    document.body.appendChild(this.tooltip);

    const [btnAnterior, btnSiguiente] = this.tooltip.querySelectorAll('button');
    btnAnterior.addEventListener('click', () => this.anteriorPaso());
    btnSiguiente.addEventListener('click', () => this.siguientePaso());
  }

  siguientePaso() {
    if (this.pasoActual < this.pasos.length - 1) {
      this.pasoActual++;
      this.mostrarPaso(this.pasoActual);
    } else {
      this.finalizar();
    }
  }

  anteriorPaso() {
    if (this.pasoActual > 0) {
      this.pasoActual--;
      this.mostrarPaso(this.pasoActual);
    }
  }

  finalizar() {
    if (this.overlay) this.overlay.remove();
    if (this.tooltip) this.tooltip.remove();
    this.pasoActual = 0;
  }
}










/*
const pasosTour = [
  {
    elemento: 'step1',
    mensaje: 'Este es el botón de inicio.',
  },
  {
    elemento: 'step2',
    mensaje: 'Aquí puedes buscar un boleto por número.',
  },
  {
    elemento: 'step3',
    mensaje: 'Este botón lanza la Maquinita de la Suerte.',
  }
];

let pasoActual = 0;
let overlay, tooltip;

function iniciarTour() {
  crearOverlay();
  mostrarPaso(pasoActual);
}

function crearOverlay() {
  overlay = document.createElement('div');
  overlay.className = 'tour-overlay';
  document.body.appendChild(overlay);
}

function mostrarPaso(indice) {
  const paso = pasosTour[indice];
  const el = document.getElementById(paso.elemento);
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
  if (pasoActual < pasosTour.length - 1) {
    pasoActual++;
    mostrarPaso(pasoActual);
  } else {
    finalizarTour();
  }
}

function anteriorPaso() {
  if (pasoActual > 0) {
    pasoActual--;
    mostrarPaso(pasoActual);
  }
}

function finalizarTour() {
  if (overlay) overlay.remove();
  if (tooltip) tooltip.remove();
  pasoActual = 0;
}
*/