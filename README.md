# 🚀 VibSensor: Monitoreo Predictivo de Motores AC

**VibSensor** es un sistema integral de hardware y software diseñado para el monitoreo de condición (Condition Monitoring) de motores de corriente alterna (AC). Captura, procesa, visualiza y almacena datos de vibración y RPM a alta frecuencia (~200 Hz) para detectar anomalías mecánicas antes de que se conviertan en fallas críticas, basándose en la norma **ISO 2372**.

---

## ✨ Características Principales

### 📡 Adquisición de Datos (Hardware)
* **Alta Frecuencia:** Muestreo de aceleración y cálculo RMS a 200 Hz utilizando un MPU6050 y un microcontrolador ESP8266.
* **Procesamiento en el Borde (Edge Computing):** Filtro pasa-alto (High-Pass) integrado en C++ para eliminar la componente de la gravedad (1g) antes de la transmisión.
* **Interfaz Local (TFT):** Visualización de gráficas y estado ISO 2372 en tiempo real directamente en el dispositivo físico mediante una pantalla ST7735.
* **Emulador Incluido:** Código para ESP32 que emula el comportamiento mecánico (ruido, armónicos y picos de impacto) para desarrollo de software sin necesidad de hardware físico.

### 💻 Interfaz Web de Alto Rendimiento (Frontend)
* **Ultra-Rápida:** Gráficas en tiempo real construidas sobre `uPlot.js`, manejando buffers de memoria eficientes (`Float32Array`) sin causar fugas de memoria (Memory Leaks).
* **Norma ISO 2372 Visual:** Zonas de colores (Verde, Amarillo, Naranja, Rojo) integradas directamente en el lienzo de la gráfica para un diagnóstico instantáneo.
* **Análisis Histórico:** Reproductor (Playback) de telemetría histórica con control de velocidad (x1 a x10) para auditar comportamientos pasados.

### ⚙️ Servidor y Persistencia (Backend)
* **Arquitectura Resiliente:** Node.js con WebSockets (`ws`) y un sistema "Watchdog" de 2 segundos para detectar desconexiones reales del sensor.
* **Base de Datos Anti-Corrupción:** Implementación de `better-sqlite3` con **Modo WAL** (Write-Ahead Logging) que garantiza lecturas/escrituras concurrentes sin bloquear o corromper el archivo.
* **Decimación Inteligente:** Algoritmo de *downsampling* en base de datos (`NTILE`) que promedia señales y preserva picos de impacto (`MAX`) cuando se consultan rangos de fechas masivos.
* **Exportación Total:** Generación de archivos `.csv` mediante *Streaming* para descargar gigabytes de telemetría sin saturar la RAM del servidor.

---

## 🛠 Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Hardware Real** | ESP8266 (NodeMCU), MPU6050, TFT ST7735, Sensor RPM (IR/Hall) |
| **Emulador** | ESP32 (WiFi SoftAP + WebSocket Server) |
| **Backend** | Node.js, Express.js, `ws`, `better-sqlite3` |
| **Frontend** | HTML5, TailwindCSS, Vanilla JS, uPlot.js |

---

## 📁 Estructura del Proyecto

```text
VibSensor/
├── src/
│   ├── backend.js       # Orquestador del servidor HTTP y WebSockets
│   └── database.js      # Lógica de SQLite (WAL, Decimación, CSV Stream)
├── public/
│   ├── index.html       # Interfaz de usuario (Dashboard)
│   ├── app.js           # Motor de renderizado (uPlot, Buffers, Playback)
│   └── style.css        # TailwindCSS custom classes
├── hardware/
│   ├── esp8266_sensor/  # Firmware C++ para el adquisidor real (TFT + MPU6050)
│   └── esp32_emulator/  # Firmware C++ para emular telemetría del motor
├── package.json         # Dependencias de Node.js
└── README.md            # Documentación
```

---

## 🚀 Instalación y Uso

### 1. Configurar el Hardware (o el Emulador)
1. Abre los archivos de la carpeta `hardware/` con el IDE de Arduino.
2. Sube el código `esp8266_sensor` a tu placa física (requiere las librerías `Adafruit_GFX`, `Adafruit_ST7735` y `WebSocketsServer`).
3. **Alternativa:** Si no tienes el hardware ensamblado, sube el código `esp32_emulator` a un ESP32.
4. Conecta la antena WiFi de tu computadora a la red generada por el microcontrolador (ej. `VibSensor_Emulador` o `SensorMPU`).

### 2. Iniciar el Servidor (Backend)
Asegúrate de tener [Node.js](https://nodejs.org/) instalado.

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/VibSensor.git
cd VibSensor

# Instala las dependencias
npm install

# Inicia el sistema
node src/backend.js
```

### 3. Acceder al Dashboard
Abre tu navegador web (preferiblemente Chrome/Edge basado en Chromium para máximo rendimiento de canvas) y dirígete a:
👉 `http://localhost:3000`

---

## 📊 Criterios de Evaluación ISO 2372 Implementados
El sistema evalúa el valor **RMS de la velocidad de vibración (mm/s)** clasificándolo en:
* 🟢 **Bueno (< 4.5):** Operación normal.
* 🟡 **Satisfactorio (4.5 - 7.1):** Operación continua permitida, pero requiere atención en el próximo mantenimiento.
* 🟠 **Insatisfactorio (7.1 - 11.2):** Operación restringida. Tomar medidas correctivas pronto.
* 🔴 **Inaceptable (> 11.2):** Apagar inmediatamente. Riesgo de daño catastrófico.

---

## 🤝 Contribuciones
Este proyecto nació como un script de Python y ha evolucionado hacia una robusta arquitectura web orientada a la Industria 4.0.

---
*Desarrollado con pasión para el mantenimiento predictivo.* 🔧⚡