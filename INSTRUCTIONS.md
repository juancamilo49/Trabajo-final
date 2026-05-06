# Instructions: Ciclistas Fantasmas (Fase de Ingeniería)

## 1. Integración de Diseño (Stitch MCP)
- Importar el código HTML/CSS del proyecto "Ciclistas Fantasmas Interactive Prototype".
- Respetar los IDs: `#main-map-container`, `#story-overlay`, `#nav-main` y `#participation-zone`.
- Mantener el modo oscuro (#050505) y los acentos neón (#DFFF00) en todas las vistas.

## 2. Lógica del Mapa (Leaflet.js)
- **Mapa Global:** Cargar el mapa en `#main-map-container` centrado en Medellín. 
- **Estilo:** Usar Tiles de "CartoDB Dark Matter".
- **Interacción:** Al hacer scroll en el `#story-overlay`, el mapa debe realizar un `flyTo` hacia las coordenadas específicas del relato actual.
- **Heatmap:** Implementar una capa de puntos de calor (L.heatLayer) que muestre las zonas de mayor incidencia reportadas en Firebase.

## 3. Backend (Firebase)
- **Database:** Crear una instancia de Firestore Database (Tier gratuito).
- **Colección `incidentes`:** 
    - `id`: Autogenerado.
    - `titulo`: String.
    - `relato`: Text (450 palabras máx).
    - `coordenadas`: GeoPoint (Lat/Lng).
    - `fecha`: Timestamp.
    - `imagen_url`: String (referencia a assets de Nano Banana).

## 4. Funcionalidad de Scrollytelling
- Utilizar `IntersectionObserver` para detectar qué párrafo del relato está visible.
- Disparar eventos de cambio de vista en el mapa (zoom, rotación o pan) según el párrafo activo.