#include <WiFi.h>
#include <WebSocketsServer.h>

// Credenciales del Access Point emulado
const char *ssid = "VibSensor_Emulador";
const char *password = "12345678"; // Mínimo 8 caracteres

// Servidor WebSocket en el puerto 81 (como lo espera Node.js)
WebSocketsServer webSocket = WebSocketsServer(81);

unsigned long lastTime = 0;
const int timerDelay = 5; // 5 milisegundos = 200 Hz

void setup() {
  Serial.begin(115200);
  Serial.println("Iniciando Emulador VibSensor...");

  // Configurar ESP32 como Access Point
  WiFi.softAP(ssid, password);
  
  // Por defecto, la IP del Access Point en ESP32 es 192.168.4.1
  IPAddress myIP = WiFi.softAPIP();
  Serial.print("Access Point Iniciado. IP: ");
  Serial.println(myIP);

  // Iniciar servidor WebSocket
  webSocket.begin();
  Serial.println("WebSocket Server iniciado en el puerto 81");
}

void loop() {
  webSocket.loop(); // Mantener vivas las conexiones

  unsigned long currentTime = millis();
  
  // Disparar cada 5ms (200Hz)
  if ((currentTime - lastTime) >= timerDelay) {
    
    // --- GENERACIÓN DE DATOS PLAUSIBLES ---
    float t = currentTime / 1000.0; // Tiempo en segundos
    
    // RPM: Motor nominal de 1800 RPM con ligera fluctuación
    int rpm = 1790 + random(-10, 11); 
    
    // Aceleración: Onda senoidal base (vibración natural) + ruido aleatorio
    float accX = 1.5 * sin(t * 60) + (random(-20, 20) / 100.0);
    float accY = 1.2 * cos(t * 60) + (random(-20, 20) / 100.0);
    
    // RMS: Simulemos un valor estable que oscila entre zona verde y amarilla ISO
    float vibRMS = 1.8 + (random(-2, 3) / 10.0);

    // Construir el JSON exactamente como lo espera el backend
    // Ej: {"timestamp":"12050","rpm":1795,"accX":1.45,"accY":1.12,"vibRMS":1.8}
    String json = "{";
    json += "\"timestamp\":\"" + String(currentTime) + "\",";
    json += "\"rpm\":" + String(rpm) + ",";
    json += "\"accX\":" + String(accX) + ",";
    json += "\"accY\":" + String(accY) + ",";
    json += "\"vibRMS\":" + String(vibRMS);
    json += "}";

    // Enviar a todos los clientes conectados (tu PC con Node.js)
    webSocket.broadcastTXT(json);
    
    lastTime = currentTime;
  }
}