# Ciclistas Fantasmas 🚴‍♂️👻

**Archivo Digital de las Calles de Medellín.**  
Mapeando la memoria ciclista, la resistencia y el rastro lumínico de quienes transitan la noche.

[![Firebase Deployment](https://img.shields.io/badge/Deploy-Firebase-orange?style=flat-square&logo=firebase)](https://ciclistas-fantasmas-cf99.web.app)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=flat-square)](./LICENSE)

---

## 🌟 Descripción

**Ciclistas Fantasmas** es una Single Page Application (SPA) diseñada para visibilizar la realidad de los ciclistas en Medellín. A través de un mapa interactivo y un archivo vivo de relatos, el proyecto busca:

- **Homenajear**: Recordar a las víctimas de incidentes viales mediante un memorial dedicado.
- **Denunciar**: Mapear puntos críticos de inseguridad y accidentalidad.
- **Conectar**: Compartir historias de resistencia y vida sobre dos ruedas.

## 🚀 Características Principales

- **Mapa Interactivo (Leaflet)**: Visualización de ciclorrutas, zonas de riesgo y memorial de víctimas.
- **Archivo de Relatos**: Historias geolocalizadas enviadas por la comunidad.
- **Memorial de Víctimas**: Base de datos filtrable para conmemorar a los ciclistas fallecidos.
- **Scrollytelling**: Narrativas interactivas que guían al usuario por puntos clave de la ciudad.
- **Heatmap de Riesgo**: Visualización dinámica de la densidad de incidentes reportados.
- **Diseño Premium**: Interfaz oscura con estética futurista/ciberpunk, optimizada para móviles y escritorio.

## 🛠️ Tecnologías

- **Frontend**: Vanilla JavaScript, HTML5, CSS3.
- **Framework de Estilos**: [TailwindCSS](https://tailwindcss.com/).
- **Mapas**: [Leaflet.js](https://leafletjs.com/).
- **Backend/Hosting**: [Firebase](https://firebase.google.com/) (Firestore & Hosting).
- **Herramienta de Construcción**: [Vite](https://vitejs.dev/).

## 📦 Instalación y Uso Local

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/juancamilo49/Trabajo-final.git
    cd Trabajo-final
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` basado en `.env.example` con tus credenciales de Firebase.

4.  **Ejecutar en modo desarrollo:**
    ```bash
    npm run dev
    ```

5.  **Construir para producción:**
    ```bash
    npm run build
    ```

## 🌐 Despliegue

El proyecto está configurado para desplegarse automáticamente en Firebase Hosting:

```bash
firebase deploy
```

## 📄 Licencia

Este proyecto está bajo la Licencia **GNU GPL v3.0**. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

---

*Desarrollado con ❤️ para la comunidad ciclista de Medellín.*
