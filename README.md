<p align="center">
  <a href="https://vitejs.dev/" target="blank"><img src="https://vitejs.dev/logo.svg" width="120" alt="Vite Logo" /></a>
</p>

# WebSocket Client 🚀

Cliente de WebSocket para la comunicación en tiempo real con la API de **Teslo Shop**. Construido con **Vite**, **TypeScript** y **Socket.IO**, permite enviar y recibir mensajes en tiempo real autenticados con JWT.

---

## **Características principales** 🌟

- ⚡ **Vite**: Entorno de desarrollo ultrarrápido.
- 🛠️ **TypeScript**: Tipado estático para un código más robusto.
- 🌐 **Socket.IO Client**: Comunicación en tiempo real con soporte para JWT.
- 🔑 **Autenticación JWT**: Autenticación segura para establecer conexiones con el servidor.
- 🖥️ **Interfaz amigable**: UI simple para enviar y recibir mensajes.

---

## **Requisitos previos** 📋

- **Node.js** y **npm** instalados.

---

## **Pasos de instalación** ⚙️

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/ramon-molinero/ws-client.git
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```

4. Construir la aplicación para producción:
   ```bash
   npm run build
   ```

---

## **Stack de tecnologías** 🛠️

- **Vite**: Herramienta de desarrollo rápida.
- **TypeScript**: Superset de JavaScript.
- **Socket.IO Client**: Comunicación en tiempo real.
- **HTML/CSS**: Estructuración y estilos básicos.

---

## **Funcionalidades principales** 🔍

- **Conexión y desconexión al servidor**: Botones para establecer o finalizar la conexión.
- **Autenticación JWT**: Introducción de un token para autenticar la sesión.
- **Envío y recepción de mensajes**: Formulario para enviar mensajes y lista para visualizar los recibidos.
- **Notificación del estado del servidor**: Indicador visual del estado de conexión (Online/Offline).

---

## **Notas** 📚

Este cliente está configurado para comunicarse con el servidor desplegado en:
```bash
https://teslo-shop-nest-iv2l.onrender.com/socket.io/socket.io.js
