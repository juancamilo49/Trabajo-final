# Design System: Ciclistas Fantasmas (Medellín)
**Versión:** 1.1 - Experiencia Inmersiva SPA
**Concepto:** "La ciudad como archivo vivo". Estética nocturna, seguridad vial y memoria.

## 1. Estructura de Navegación (Single Page Application)
- **#nav-main**: Header fijo, minimalista, con `backdrop-filter: blur(10px)`.
- **#section-hero**: Impacto inicial. Título grande, manifiesto y botón "Explorar Ciudad".
- **#main-map-container**: El mapa global de Medellín (Leaflet.js). Estilo Dark Matter.
- **#stories-gallery**: Cuadrícula de retratos con efecto glitch/estática.
- **#story-overlay**: Capa inmersiva a pantalla completa (z-index: 9999). 
    - Fondo oscuro semitransparente.
    - Layout split-screen: Texto a la izquierda (scroll), Mapa de ruta a la derecha (sticky).
- **#participation-zone**: Formulario para agregar puntos y rutas.

## 2. Paleta de Colores
- **Fondo:** #050505 (Negro profundo).
- **Seguridad:** #DFFF00 (Amarillo neón reflectivo).
- **Ciudad:** #00F5FF (Cian eléctrico).
- **Texto:** #E0E0E0 (Gris claro).

## 3. Interacciones y Efectos
- **Revelación (Scratch):** Las imágenes en el hero y galería usan un filtro de ruido que se disipa al pasar el mouse (hover).
- **No Fatiga:** Transiciones automáticas y suaves. El usuario no debe presionar botones constantemente para avanzar en el relato.
- **Mapa de Calor:** Las rutas ciudadanas se visualizan como un resplandor colectivo (heatmap).

## 4. Tipografía
- **Títulos:** Montserrat (Extra Bold).
- **Cuerpo/Datos:** JetBrains Mono.