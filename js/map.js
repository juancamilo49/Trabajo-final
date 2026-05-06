// js/map.js
// ──────────────────────────────────────────────
// Leaflet map, markers, filter controls, connector lines
// Both reportes and relatos use custom preview popups
// ──────────────────────────────────────────────

let globalMap = null;
let heatLayer = null;
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
            radius: 35,
            blur: 20,
            maxZoom: 17,
            max: 0.6,
            gradient: { 0.2: '#FF003C', 0.5: '#DFFF00', 1.0: '#00F5FF' }
        });
    }

    // Apply any data that arrived early
    if (_storedReportes.length || _storedRelatos.length) {
        _renderMarkers();
    }
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
        _storedRelatos.forEach(p => {
            const icon = L.divIcon({
                className: 'marker-relato',
                html: '<div class="pulse-dot pulse-dot--cyan"></div>',
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
