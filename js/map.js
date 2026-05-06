// js/map.js
// ──────────────────────────────────────────────
// Leaflet map, markers, filter controls, connector lines
// Both reportes and relatos use custom preview popups
// ──────────────────────────────────────────────

let globalMap = null;
let heatLayer = null;
let comunasLayer = null;
let comunasData = null; // Para almacenar el GeoJSON crudo
let formMap = null;
let formMarker = null;

// Layer groups
let reporteMarkers = null;
let relatoMarkers = null;

// Connector line for active report popup
let _connectorLine = null;

// Persistent data
let _storedReportes = [];
let _storedRelatos = [];

// Tile config
const cartoDarkMatter = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const cartoAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// ─── MAIN MAP ────────────────────────────────
window.initMainMap = function () {
    if (globalMap) return;

    const medellinCoords = [6.2442, -75.5812];

    globalMap = L.map('main-map-container', {
        zoomControl: false
    }).setView(medellinCoords, 13);

    L.tileLayer(cartoDarkMatter, {
        attribution: cartoAttribution,
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(globalMap);

    L.control.zoom({ position: 'bottomright' }).addTo(globalMap);

    // Layer groups
    reporteMarkers = L.layerGroup().addTo(globalMap);
    relatoMarkers = L.layerGroup().addTo(globalMap);

    // Heat layer
    if (typeof L.heatLayer !== 'undefined') {
        heatLayer = L.heatLayer([], {
            radius: 25,
            blur: 15,
            maxZoom: 18,
            max: 0.6,
            gradient: { 0.2: '#FF003C', 0.5: '#DFFF00', 1.0: '#00F5FF' }
        });
    }

    // Zoom listener for heatmap optimization
    globalMap.on('zoomend', () => {
        if (heatLayer && globalMap.hasLayer(heatLayer)) {
            const zoom = globalMap.getZoom();
            // Adjust radius based on zoom
            let newRadius = 25;
            let newBlur = 15;

            if (zoom >= 16) { newRadius = 45; newBlur = 25; }
            else if (zoom >= 14) { newRadius = 35; newBlur = 20; }
            else if (zoom <= 11) { newRadius = 15; newBlur = 10; }

            heatLayer.setOptions({ radius: newRadius, blur: newBlur });
        }
    });

    if (_storedReportes.length || _storedRelatos.length) {
        _renderMarkers();
    }

    // Cargar capas administrativas
    window.loadComunas();
};

// ─── INVALIDATE ─────────────────────────────
window.invalidateMapSize = function () {
    if (!globalMap) return;
    setTimeout(() => {
        globalMap.invalidateSize();
        _renderMarkers();
    }, 150);
};

// ─── DATA INGESTION ─────────────────────────
window.updateReportes = function (items) {
    _storedReportes = items;
    _renderMarkers();
};

window.updateRelatos = function (items) {
    _storedRelatos = items;
    _renderMarkers();
};

// ─── RENDER MARKERS + HEATMAP ───────────────
function _renderMarkers() {
    if (!globalMap) return;

    // ── Reportes (yellow, click opens custom preview with connector) ──
    if (reporteMarkers) {
        reporteMarkers.clearLayers();
        _storedReportes.forEach(p => {
            const icon = L.divIcon({
                className: 'marker-reporte',
                html: '<div class="pulse-dot pulse-dot--yellow"></div>',
                iconSize: [14, 14],
                iconAnchor: [7, 7]
            });
            const m = L.marker([p.lat, p.lng], { icon });

            m.on('click', () => {
                _showReportePreview(p);
            });

            reporteMarkers.addLayer(m);
        });
    }

    // ── Relatos (cyan, click opens preview bottom-sheet) ──
    if (relatoMarkers) {
        relatoMarkers.clearLayers();
        const readIds = JSON.parse(localStorage.getItem('readRelatos') || '[]');
        
        _storedRelatos.forEach(p => {
            const isRead = readIds.includes(p.id);
            const icon = L.divIcon({
                className: 'marker-relato',
                html: `
                    <div class="pulse-dot pulse-dot--cyan ${isRead ? 'is-read' : ''}">
                        ${isRead ? '<span class="read-check">✔</span>' : ''}
                    </div>
                `,
                iconSize: [18, 18],
                iconAnchor: [9, 9]
            });
            const m = L.marker([p.lat, p.lng], { icon });
            m.on('click', () => {
                if (window.showRelatoPreview) {
                    window.showRelatoPreview(p.id);
                }
            });
            relatoMarkers.addLayer(m);
        });
    }

    // ── Heatmap ──
    if (heatLayer) {
        const mapContainer = document.getElementById('main-map-container');
        if (mapContainer && mapContainer.offsetWidth > 0) {
            const allPoints = [
                ..._storedReportes.map(p => [parseFloat(p.lat), parseFloat(p.lng), 0.6]),
                ..._storedRelatos.map(p => [parseFloat(p.lat), parseFloat(p.lng), 1.0])
            ];
            heatLayer.setLatLngs(allPoints);
            
            // Respect checkbox state
            const heatCb = document.getElementById('filter-heatmap');
            if (heatCb && heatCb.checked) {
                if (!globalMap.hasLayer(heatLayer)) {
                    heatLayer.addTo(globalMap);
                }
            } else {
                if (globalMap.hasLayer(heatLayer)) {
                    globalMap.removeLayer(heatLayer);
                }
            }
        }
    }
}

let _activeReporte = null;

// ─── REPORTE PREVIEW (custom popup + connector line) ──
function _showReportePreview(p) {
    _activeReporte = p;
    // Remove old connector
    _clearConnector();

    const preview = document.getElementById('relato-preview');
    const content = document.getElementById('relato-preview-content');
    if (!preview || !content) return;

    const fecha = p.fecha ? new Date(p.fecha).toLocaleDateString('es-CO') : '';

    content.innerHTML = `
        <span class="text-safety text-xs tracking-widest uppercase block mb-2">Reporte ciudadano</span>
        <h3 class="font-display text-xl text-white mb-2 font-bold">${_esc(p.titulo)}</h3>
        <p class="text-white/50 text-xs mb-3 font-mono">${p.lat.toFixed(4)}, ${p.lng.toFixed(4)} ${fecha ? '• ' + fecha : ''}</p>
        <p class="text-white/70 text-sm leading-relaxed mb-4">${_esc(p.relato)}</p>
        <div class="flex items-center justify-end">
            <button onclick="closeRelatoPreview()" class="text-white/40 text-xs tracking-widest uppercase hover:text-white transition-colors">Cerrar</button>
        </div>
    `;

    // Create the line
    _connectorLine = L.polyline([[p.lat, p.lng], [p.lat, p.lng]], {
        color: '#DFFF00',
        weight: 1.5,
        opacity: 0.8,
        dashArray: '4, 6',
        className: 'connector-line'
    }).addTo(globalMap);

    // Initial position
    _updateConnectorPosition();

    // Listen for map movements to keep the line connected to the fixed popup area
    globalMap.on('move zoom', _updateConnectorPosition);

    preview.classList.remove('hidden');
    requestAnimationFrame(() => {
        preview.querySelector('.relato-preview-card').classList.add('is-visible');
    });
}

function _updateConnectorPosition() {
    if (!_connectorLine || !_activeReporte || !globalMap) return;

    const markerLatLng = [_activeReporte.lat, _activeReporte.lng];
    
    const size = globalMap.getSize();
    const isDesktop = window.innerWidth >= 768;
    
    // Target the center on desktop, and near the bottom on mobile
    const targetPoint = isDesktop 
        ? L.point(size.x / 2, size.y / 2)
        : L.point(size.x / 2, size.y - 120); // Slightly higher for mobile popup height

    const targetLatLng = globalMap.containerPointToLatLng(targetPoint);
    _connectorLine.setLatLngs([markerLatLng, targetLatLng]);
}

function _clearConnector() {
    if (globalMap) {
        globalMap.off('move zoom', _updateConnectorPosition);
    }
    if (_connectorLine && globalMap) {
        globalMap.removeLayer(_connectorLine);
        _connectorLine = null;
    }
    _activeReporte = null;
}

// Override showRelatoPreview to also add connector
const _originalShowRelato = window.showRelatoPreview;
window.showRelatoPreview = function (docId) {
    if (typeof _originalShowRelato === 'function') {
        _originalShowRelato(docId);
    }
    
    // Add connector if we can find the coordinates
    const cache = window._relatosCache || {};
    const relato = cache[docId];
    if (relato && relato.lat && relato.lng) {
        _activeReporte = relato;
        _clearConnector(); // Clear any previous
        
        _connectorLine = L.polyline([[relato.lat, relato.lng], [relato.lat, relato.lng]], {
            color: '#00F5FF', // Cyan for relatos
            weight: 1.5,
            opacity: 0.8,
            dashArray: '4, 6',
            className: 'connector-line'
        }).addTo(globalMap);
        
        _updateConnectorPosition();
        globalMap.on('move zoom', _updateConnectorPosition);
    }
};

// Override closeRelatoPreview to also clear connector
const _originalClose = window.closeRelatoPreview;
window.closeRelatoPreview = function () {
    _clearConnector();
    if (typeof _originalClose === 'function') {
        _originalClose();
    }
};

function _esc(s) { return (s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// ─── FILTER TOGGLE ──────────────────────────
window.toggleMapLayer = function (layerName, visible) {
    if (!globalMap) return;
    if (layerName === 'reportes') {
        visible ? globalMap.addLayer(reporteMarkers) : globalMap.removeLayer(reporteMarkers);
    }
    if (layerName === 'relatos') {
        visible ? globalMap.addLayer(relatoMarkers) : globalMap.removeLayer(relatoMarkers);
    }
    if (layerName === 'heatmap' && heatLayer) {
        visible ? globalMap.addLayer(heatLayer) : globalMap.removeLayer(heatLayer);
    }
    if (layerName === 'comunas' && comunasLayer) {
        visible ? globalMap.addLayer(comunasLayer) : globalMap.removeLayer(comunasLayer);
    }
};

// ─── FLY-TO ─────────────────────────────────
window.flyToLocation = function (lat, lng, zoom = 16) {
    if (globalMap) {
        globalMap.flyTo([lat, lng], zoom, { animate: true, duration: 2.5 });
    }
};

// ─── FORM MAP ────────────────────────────────
window.initFormMap = function () {
    if (formMap) {
        setTimeout(() => formMap.invalidateSize(), 100);
        return;
    }

    formMap = L.map('form-map-container').setView([6.2442, -75.5812], 13);

    L.tileLayer(cartoDarkMatter, {
        attribution: cartoAttribution,
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(formMap);

    formMap.on('click', function (e) {
        const { lat, lng } = e.latlng;
        if (formMarker) {
            formMarker.setLatLng(e.latlng);
        } else {
            const icon = L.divIcon({
                className: 'custom-div-icon',
                html: '<div style="background:#DFFF00;width:16px;height:16px;border-radius:50%;box-shadow:0 0 12px #DFFF00;"></div>',
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            });
            formMarker = L.marker(e.latlng, { icon }).addTo(formMap);
        }
        document.getElementById('form-lat').value = lat.toFixed(6);
        document.getElementById('form-lng').value = lng.toFixed(6);
    });

    setTimeout(() => formMap.invalidateSize(), 100);
};

// ─── PIP DETECTION ──────────────────────────
function isPointInPoly(pt, poly) {
    // pt: [lng, lat]
    // poly: array of rings, poly[0] is the outer ring
    if (!poly || !poly[0]) return false;
    const ring = poly[0];
    let x = pt[0], y = pt[1];
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        let xi = ring[i][0], yi = ring[i][1];
        let xj = ring[j][0], yj = ring[j][1];
        let intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

window.getComunaForCoords = function(lat, lng) {
    if (!comunasData) return "Desconocida";
    
    const point = [lng, lat]; // GeoJSON usa [lng, lat]
    
    for (const feature of comunasData.features) {
        const geometry = feature.geometry;
        if (!geometry) continue;

        const type = geometry.type;
        const coords = geometry.coordinates;
        
        if (type === 'Polygon') {
            if (isPointInPoly(point, coords)) return feature.properties.NOMBRE || feature.properties.name || "Sin Nombre";
        } else if (type === 'MultiPolygon') {
            for (const polyCoords of coords) {
                if (isPointInPoly(point, polyCoords)) return feature.properties.NOMBRE || feature.properties.name || "Sin Nombre";
            }
        }
    }
    return "Desconocida";
};

// ─── COMUNAS LAYER ──────────────────────────
window.loadComunas = function () {
    if (!globalMap || comunasLayer) return;

    // Nueva URL verificada de GeoJSON de Medellín
    const url = 'https://gist.githubusercontent.com/davixcky/ade2468ed713364fd5876a16305608b4/raw/medellin.geojson';
    
    console.info("Intentando cargar comunas desde:", url);

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("No se pudo cargar el archivo GeoJSON");
            return res.json();
        })
        .then(data => {
            comunasData = data; 
            comunasLayer = L.geoJSON(data, {
                style: function() {
                    return {
                        color: 'rgba(0, 245, 255, 0.5)',
                        weight: 1.5,
                        fillColor: 'rgba(0, 245, 255, 0.05)',
                        fillOpacity: 0.1,
                        dashArray: '4, 8'
                    };
                },
                onEachFeature: function(feature, layer) {
                    const props = feature.properties;
                    // Mapeo de posibles nombres de propiedad según el archivo
                    const name = props.NOMBRE || props.nombre || props.comuna || props.NOMBRE_COMUNA || props.LABEL;
                    
                    if (name) {
                        layer.bindTooltip(name.toString().toUpperCase(), {
                            sticky: true,
                            className: 'comuna-tooltip',
                            direction: 'top'
                        });
                    }

                    layer.on('mouseover', function() {
                        this.setStyle({
                            fillOpacity: 0.25,
                            color: 'rgba(0, 245, 255, 1)',
                            weight: 2
                        });
                    });
                    layer.on('mouseout', function() {
                        if (comunasLayer) comunasLayer.resetStyle(this);
                    });
                }
            });

            // Solo añadir si el checkbox está marcado
            const checkbox = document.getElementById('filter-comunas');
            if (!checkbox || checkbox.checked) {
                comunasLayer.addTo(globalMap);
            }
            
            console.log("Capa de comunas integrada.");
        })
        .catch(err => {
            console.warn("Fallo carga GeoJSON Comunas:", err.message);
            // Fallback opcional si fuera necesario
        });
};
