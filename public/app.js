// Elementos del DOM
const tabVivo = document.getElementById('tab-vivo');
const tabHistorico = document.getElementById('tab-historico');
const rpmValor = document.getElementById('rpm-valor');
const isoValor = document.getElementById('iso-valor');
const gaugeIndicator = document.getElementById('gauge-indicator');
const connectionDot = document.getElementById('connection-dot');
const connectionStatus = document.getElementById('connection-status');

// Constantes ISO 2372 (en mm/s)
const ISO_THRESHOLDS = {
    GOOD: 4.5,
    ACCEPTABLE: 7.1,
    DAMAGING: 11.2
};

// Funcionalidad de Pestañas
tabVivo.addEventListener('click', () => {
    tabVivo.classList.add('bg-industrial-accent', 'text-white');
    tabVivo.classList.remove('text-gray-400');
    tabHistorico.classList.remove('bg-industrial-accent', 'text-white');
    tabHistorico.classList.add('text-gray-400');
    console.log('Modo: Monitoreo en Vivo');
});

tabHistorico.addEventListener('click', () => {
    tabHistorico.classList.add('bg-industrial-accent', 'text-white');
    tabHistorico.classList.remove('text-gray-400');
    tabVivo.classList.remove('bg-industrial-accent', 'text-white');
    tabVivo.classList.add('text-gray-400');
    console.log('Modo: Análisis Histórico');
});

// Funciones de actualización (placeholder para lógica de gráficas)
function updateRPM(rpm) {
    rpmValor.textContent = Math.round(rpm);
}

function updateISO(vibRMS) {
    const value = vibRMS.toFixed(1);
    isoValor.textContent = value;
    
    // Actualizar gauge (251.2 es la circunferencia del círculo de radio 40)
    const maxValue = 20; // Rango máximo del gauge
    const percentage = Math.min(vibRMS / maxValue, 1);
    const offset = 251.2 * (1 - percentage);
    gaugeIndicator.style.strokeDashoffset = offset;
    
    // Color según zona ISO
    let color;
    if (vibRMS < ISO_THRESHOLDS.GOOD) {
        color = '#22c55e'; // Verde
    } else if (vibRMS < ISO_THRESHOLDS.ACCEPTABLE) {
        color = '#f59e0b'; // Amarillo
    } else if (vibRMS < ISO_THRESHOLDS.DAMAGING) {
        color = '#f97316'; // Naranja
    } else {
        color = '#ef4444'; // Rojo
    }
    gaugeIndicator.style.stroke = color;
}

function updateConnectionStatus(connected) {
    if (connected) {
        connectionDot.classList.remove('bg-gray-500');
        connectionDot.classList.add('connection-connected');
        connectionStatus.textContent = 'Conectado al ESP8266';
    } else {
        connectionDot.classList.remove('connection-connected');
        connectionDot.classList.add('connection-disconnected');
        connectionStatus.textContent = 'Desconectado';
    }
}

console.log('VibSensor UI inicializada. Listo para conectar WebSocket.');