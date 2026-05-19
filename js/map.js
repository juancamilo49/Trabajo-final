import { setZoomVolume, muffleSound, unmuffleSound, playPedal } from './audio.js';

// ──────────────────────────────────────────────
// Leaflet map, markers, filter controls, connector lines
// Both reportes and relatos use custom preview popups
// ──────────────────────────────────────────────

let globalMap = null;
let heatLayer = null;
let heatmapData = [];
let comunasLayer, cicloLayer, muertesLayer, enciclaLayer;
let comunasData = null;
let formMap = null;
let formMarker = null;
let _comunasFormLayer = null;

window.flyToLocation = function (lat, lng, zoom = 15) {
    if (globalMap) {
        globalMap.flyTo([lat, lng], zoom, {
            duration: 1.5,
            easeLinearity: 0.25
        });
    }
};

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

const satelliteUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const satelliteAttribution = 'Tiles &copy; Esri &mdash; Source: Esri...';

let baseTileLayer = null;
let satelliteTileLayer = null;

// ─── MAIN MAP ────────────────────────────────
window.initMainMap = function () {
    if (globalMap) return;

    const medellinCoords = [6.2442, -75.5812];

    globalMap = L.map('main-map-container', {
        zoomControl: false
    }).setView(medellinCoords, 13);

    baseTileLayer = L.tileLayer(cartoDarkMatter, {
        attribution: cartoAttribution,
        subdomains: 'abcd',
        maxZoom: 20
    });

    satelliteTileLayer = L.tileLayer(satelliteUrl, {
        attribution: satelliteAttribution,
        maxZoom: 19,
        className: 'satellite-night-filter'
    });

    baseTileLayer.addTo(globalMap);

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
            let newRadius = 25;
            let newBlur = 15;

            if (zoom >= 16) { newRadius = 45; newBlur = 25; }
            else if (zoom >= 14) { newRadius = 35; newBlur = 20; }
            else if (zoom <= 11) { newRadius = 15; newBlur = 10; }

            heatLayer.setOptions({ radius: newRadius, blur: newBlur });
        }
        
        // Update audio volume based on zoom
        setZoomVolume(globalMap.getZoom());
    });

    // Also update volume during the zoom animation (flyTo)
    // Update volume on zoom and move for smooth flyTo transitions
    globalMap.on('zoom move', () => {
        setZoomVolume(globalMap.getZoom());
    });

    // Subtle pedal sound when panning/moving the map
    globalMap.on('movestart', () => {
        playPedal();
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

    // ── Reportes ──
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
            m.on('click', () => _showReportePreview(p));
            reporteMarkers.addLayer(m);
        });
    }

    // ── Relatos ──
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
                if (window.showRelatoPreview) window.showRelatoPreview(p.id);
            });
            relatoMarkers.addLayer(m);
        });
    }

    // ── Heatmap ──
    if (heatLayer) {
        const allPoints = [
            ..._storedReportes.map(p => [parseFloat(p.lat), parseFloat(p.lng), 0.6]),
            ..._storedRelatos.map(p => [parseFloat(p.lat), parseFloat(p.lng), 1.0])
        ];
        heatLayer.setLatLngs(allPoints);
        
        const heatCb = document.getElementById('filter-heatmap');
        if (heatCb && heatCb.checked) {
            if (!globalMap.hasLayer(heatLayer)) heatLayer.addTo(globalMap);
        } else {
            if (globalMap.hasLayer(heatLayer)) globalMap.removeLayer(heatLayer);
        }
    }

    _calculateAndShowStats();
}

function _calculateAndShowStats() {
    if (!comunasData) return;
    const counts = {};
    _storedReportes.forEach(p => {
        const com = window.getComunaForCoords(p.lat, p.lng);
        if (com && com !== "Desconocida") counts[com] = (counts[com] || 0) + 1;
    });
    _storedRelatos.forEach(p => {
        const com = window.getComunaForCoords(p.lat, p.lng);
        if (com && com !== "Desconocida") counts[com] = (counts[com] || 0) + 1;
    });
    if (window.updateComunaStats) window.updateComunaStats(counts);
}

let _activeReporte = null;

function _showReportePreview(p) {
    _activeReporte = p;
    _clearConnector();
    muffleSound();
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
    _connectorLine = L.polyline([[p.lat, p.lng], [p.lat, p.lng]], {
        color: '#DFFF00', weight: 1.5, opacity: 0.8, dashArray: '4, 6', className: 'connector-line'
    }).addTo(globalMap);
    _updateConnectorPosition();
    globalMap.on('move zoom', _updateConnectorPosition);
    preview.classList.remove('hidden');
    requestAnimationFrame(() => preview.querySelector('.relato-preview-card').classList.add('is-visible'));
}

function _showEnCiclaPreview(p) {
    _activeReporte = p;
    _clearConnector();
    muffleSound();
    const preview = document.getElementById('relato-preview');
    const content = document.getElementById('relato-preview-content');
    if (!preview || !content) return;
    content.innerHTML = `
        <span class="text-[#2ECC71] text-xs tracking-widest uppercase block mb-2">Estación EnCicla</span>
        <h3 class="font-display text-xl text-white mb-2 font-bold">${_esc(p.name)}</h3>
        <p class="text-white/50 text-xs mb-3 font-mono">${p.lat.toFixed(4)}, ${p.lng.toFixed(4)} • ${p.Num_Puestos || 0} puestos</p>
        <p class="text-white/70 text-sm leading-relaxed mb-4">${_esc(p.descripcion_web || p.Direccion || '')}</p>
        <div class="flex items-center justify-end">
            <button onclick="closeRelatoPreview()" class="text-white/40 text-xs tracking-widest uppercase hover:text-white transition-colors">Cerrar</button>
        </div>
    `;
    _connectorLine = L.polyline([[p.lat, p.lng], [p.lat, p.lng]], {
        color: '#2ECC71', weight: 1.5, opacity: 0.8, dashArray: '4, 6', className: 'connector-line'
    }).addTo(globalMap);
    _updateConnectorPosition();
    globalMap.on('move zoom', _updateConnectorPosition);
    preview.classList.remove('hidden');
    requestAnimationFrame(() => preview.querySelector('.relato-preview-card').classList.add('is-visible'));
}

function _showMuertePreview(p) {
    _activeReporte = p;
    _clearConnector();
    muffleSound();
    const preview = document.getElementById('relato-preview');
    const content = document.getElementById('relato-preview-content');
    if (!preview || !content) return;
    const fecha = p.Fecha_Ocurrencia || p.FECHA || p.fecha || 'N/A';
    const edad = p.Edad || p.EDAD || 'N/A';
    const interaccion = p.Interaccion || p.INTERACCION || 'N/A';
    const lugar = p.Lugar_Ocurrencia || p.DIRECCION || 'N/A';
    const year = p.year || '';
    content.innerHTML = `
        <span class="text-[#FF003C] text-xs tracking-widest uppercase block mb-2 font-bold">Memorial Ciclista ${year}</span>
        <h3 class="font-display text-2xl text-white mb-2 font-bold uppercase tracking-tight">En memoria de quien pedaleaba</h3>
        <p class="text-white/50 text-xs mb-4 font-mono uppercase">${_esc(lugar)}</p>
        <div class="grid grid-cols-2 gap-4 mb-6 bg-white/5 p-4 rounded-lg border border-[#FF003C]/20">
            <div>
                <span class="text-[10px] text-white/30 uppercase block">Fecha</span>
                <span class="text-sm text-white/90">${fecha}</span>
            </div>
            <div>
                <span class="text-[10px] text-white/30 uppercase block">Edad</span>
                <span class="text-sm text-white/90">${edad} años</span>
            </div>
            <div class="col-span-2">
                <span class="text-[10px] text-white/30 uppercase block">Interacción</span>
                <span class="text-sm text-white/90 font-bold text-[#FF003C]">${interaccion}</span>
            </div>
        </div>
        <p class="text-white/40 text-xs italic mb-4">"No es una cifra, es una vida. Por calles seguras para todos."</p>
        <div class="flex items-center justify-end">
            <button onclick="closeRelatoPreview()" class="text-white/40 text-xs tracking-widest uppercase hover:text-white transition-colors">Cerrar Memorial</button>
        </div>
    `;
    _connectorLine = L.polyline([[p.lat, p.lng], [p.lat, p.lng]], {
        color: '#FF003C', weight: 1.5, opacity: 0.8, dashArray: '4, 6', className: 'connector-line'
    }).addTo(globalMap);
    _updateConnectorPosition();
    globalMap.on('move zoom', _updateConnectorPosition);
    preview.classList.remove('hidden');
    requestAnimationFrame(() => preview.querySelector('.relato-preview-card').classList.add('is-visible'));
}

function _updateConnectorPosition() {
    if (!_connectorLine || !_activeReporte || !globalMap) return;
    const markerLatLng = [_activeReporte.lat, _activeReporte.lng];
    const size = globalMap.getSize();
    const isDesktop = window.innerWidth >= 768;
    const targetPoint = isDesktop ? L.point(size.x / 2, size.y / 2) : L.point(size.x / 2, size.y - 120);
    const targetLatLng = globalMap.containerPointToLatLng(targetPoint);
    _connectorLine.setLatLngs([markerLatLng, targetLatLng]);
}

function _clearConnector() {
    if (globalMap) globalMap.off('move zoom', _updateConnectorPosition);
    if (_connectorLine && globalMap) {
        globalMap.removeLayer(_connectorLine);
        _connectorLine = null;
    }
    _activeReporte = null;
}

const _originalShowRelato = window.showRelatoPreview;
window.showRelatoPreview = function (docId) {
    if (typeof _originalShowRelato === 'function') _originalShowRelato(docId);
    muffleSound();
    const cache = window._relatosCache || {};
    const relato = cache[docId];
    if (relato && relato.lat && relato.lng) {
        _activeReporte = relato;
        _clearConnector();
        _connectorLine = L.polyline([[relato.lat, relato.lng], [relato.lat, relato.lng]], {
            color: '#00F5FF', weight: 1.5, opacity: 0.8, dashArray: '4, 6', className: 'connector-line'
        }).addTo(globalMap);
        _updateConnectorPosition();
        globalMap.on('move zoom', _updateConnectorPosition);
    }
};

const _originalClose = window.closeRelatoPreview;
window.closeRelatoPreview = function () {
    _clearConnector();
    unmuffleSound();
    if (typeof _originalClose === 'function') _originalClose();
};

function _esc(s) { return (s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function isPointInPoly(pt, poly) {
    if (!poly || !poly[0]) return false;
    const ring = poly[0];
    let x = pt[0], y = pt[1];
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        let xi = ring[i][0], yi = ring[i][1];
        let xj = ring[j][0], yj = ring[j][1];
        let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

window.getComunaForCoords = function(lat, lng) {
    if (!comunasData) return "Desconocida";
    const point = [lng, lat];
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

window.loadComunas = function (targetMap = null) {
    const map = targetMap || globalMap;
    if (!map) return;

    // Si ya existe la capa para el mapa global, simplemente la re-añadimos si se quitó
    if (comunasLayer && map === globalMap) {
        if (!map.hasLayer(comunasLayer)) {
            comunasLayer.addTo(map);
        }
        return;
    }

    const url = 'https://gist.githubusercontent.com/davixcky/ade2468ed713364fd5876a16305608b4/raw/medellin.geojson';
    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("No se pudo cargar el archivo GeoJSON");
            return res.json();
        })
        .then(data => {
            const layer = L.geoJSON(data, {
                style: { 
                    color: 'rgba(0, 245, 255, 0.4)', 
                    weight: 1.2, 
                    fillColor: 'rgba(0, 245, 255, 0.05)', 
                    fillOpacity: 0.1, 
                    dashArray: '4, 8',
                    interactive: false // Hacemos que no sea clickable para evitar el cuadro azul/bordes
                },
                onEachFeature: function(feature, layer) {
                    const name = feature.properties.NOMBRE || feature.properties.nombre || feature.properties.comuna;
                    if (name) {
                        layer.bindTooltip(name.toString().toUpperCase(), { 
                            sticky: true, 
                            className: 'comuna-tooltip', 
                            direction: 'top',
                            opacity: 0.7
                        });
                    }
                    // Quitamos los eventos de hover/click para evitar interferencia visual
                }
            });

            if (map === globalMap) {
                comunasData = data; 
                comunasLayer = layer;
                const checkbox = document.getElementById('filter-comunas');
                if (!checkbox || checkbox.checked) layer.addTo(map);
                _calculateAndShowStats();
            } else {
                layer.addTo(map); // Para el mapa del formulario
                _comunasFormLayer = layer;
            }
        })
        .catch(err => console.warn("Fallo carga GeoJSON Comunas:", err.message));
};

window.initFormMap = function() {
    if (formMap) return;
    
    const container = document.getElementById('form-map-container');
    if (!container) return;

    formMap = L.map('form-map-container', {
        zoomControl: false
    }).setView([6.2442, -75.5812], 12);

    L.tileLayer(cartoDarkMatter, {
        attribution: cartoAttribution,
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(formMap);

    L.control.zoom({ position: 'bottomright' }).addTo(formMap);

    // Cargar comunas en el mapa del formulario
    window.loadComunas(formMap);

    formMap.on('click', (e) => {
        const { lat, lng } = e.latlng;
        if (formMarker) {
            formMarker.setLatLng(e.latlng);
        } else {
            const icon = L.divIcon({
                className: 'marker-reporte',
                html: '<div class="pulse-dot pulse-dot--yellow"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
            formMarker = L.marker(e.latlng, { icon }).addTo(formMap);
        }
        document.getElementById('form-lat').value = lat.toFixed(6);
        document.getElementById('form-lng').value = lng.toFixed(6);
        
        if (window.getComunaForCoords) {
            const comuna = window.getComunaForCoords(lat, lng);
            const comunaInput = document.getElementById('form-comuna');
            if (comunaInput) comunaInput.value = comuna;
        }
    });

    setTimeout(() => formMap.invalidateSize(), 200);
};

window.loadCiclorrutas = function() {
    if (!globalMap || cicloLayer) {
        if (cicloLayer && !globalMap.hasLayer(cicloLayer)) cicloLayer.addTo(globalMap);
        return;
    }
    const url = 'https://raw.githubusercontent.com/SiCLas/sigenbici/main/visor/geojson/cicloinfraestructura.geojson';
    fetch(url).then(res => res.json()).then(data => {
        cicloLayer = L.geoJSON(data, {
            style: function(f) {
                const type = f.properties.tipo || f.properties.TIPO;
                return { color: type === 'Andén' ? '#00F5FF' : '#DFFF00', weight: 3, opacity: 0.8, dashArray: type === 'Andén' ? '5, 5' : '' };
            },
            onEachFeature: function(f, layer) { layer.bindTooltip("Ciclorruta: " + (f.properties.NOMBRE || 'Sin nombre'), { sticky: true }); }
        }).addTo(globalMap);
    });
};

window.loadIncidentesSiClas = function() {
    if (!globalMap || muertesLayer) {
        if (muertesLayer && !globalMap.hasLayer(muertesLayer)) muertesLayer.addTo(globalMap);
        return;
    }
    muertesLayer = L.layerGroup().addTo(globalMap);
    const basePuntos = 'https://raw.githubusercontent.com/SiCLas/sigenbici/main/visor/puntos/incidentes-viales.geojson';
    const years = [2019, 2020, 2021, 2022, 2023, 2024];
    const baseMuertes = 'https://raw.githubusercontent.com/SiCLas/sigenbici/main/visor/admon/ciclistas-muertos-';
    fetch(basePuntos).then(res => res.json()).then(data => {
        const onlyMuertes = { ...data, features: data.features.filter(f => {
            const t = (f.properties.tipo || f.properties.TIPO || '').toLowerCase();
            return t.includes('muerte') || t.includes('fatal');
        })};
        L.geoJSON(onlyMuertes, {
            pointToLayer: (f, latlng) => {
                const icon = L.divIcon({ className: 'marker-death', html: '<div class="pulse-dot pulse-dot--red"></div>', iconSize: [14, 14], iconAnchor: [7, 7] });
                return L.marker(latlng, { icon });
            },
            onEachFeature: (f, layer) => {
                layer.on('click', (e) => {
                    L.DomEvent.stopPropagation(e);
                    const p = f.properties;
                    p.lat = layer.getLatLng().lat; p.lng = layer.getLatLng().lng;
                    p.year = p.fecha ? new Date(p.fecha).getFullYear() : '';
                    _showMuertePreview(p);
                });
            }
        }).addTo(muertesLayer);
    });
    years.forEach(year => {
        fetch(`${baseMuertes}${year}.geojson`).then(res => res.ok ? res.json() : null).then(data => {
            if (!data) return;
            L.geoJSON(data, {
                pointToLayer: (f, latlng) => {
                    const icon = L.divIcon({ className: 'marker-death', html: '<div class="pulse-dot pulse-dot--red"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });
                    return L.marker(latlng, { icon });
                },
                onEachFeature: (f, layer) => {
                    layer.on('click', (e) => {
                        L.DomEvent.stopPropagation(e);
                        const p = f.properties;
                        p.lat = layer.getLatLng().lat; p.lng = layer.getLatLng().lng;
                        p.year = year;
                        _showMuertePreview(p);
                    });
                }
            }).addTo(muertesLayer);
        }).catch(() => {});
    });
};

window.loadEnCicla = function() {
    if (!globalMap || enciclaLayer) {
        if (enciclaLayer && !globalMap.hasLayer(enciclaLayer)) enciclaLayer.addTo(globalMap);
        return;
    }
    const url = 'https://raw.githubusercontent.com/SiCLas/sigenbici/main/visor/puntos/encicla.geojson';
    fetch(url).then(res => res.json()).then(data => {
        enciclaLayer = L.geoJSON(data, {
            pointToLayer: (f, latlng) => {
                const icon = L.divIcon({ className: 'marker-encicla', html: '<div class="pulse-dot pulse-dot--emerald"></div>', iconSize: [16, 16], iconAnchor: [8, 8] });
                return L.marker(latlng, { icon });
            },
            onEachFeature: (f, layer) => {
                layer.on('click', (e) => {
                    L.DomEvent.stopPropagation(e);
                    const p = f.properties;
                    p.lat = layer.getLatLng().lat; p.lng = layer.getLatLng().lng;
                    _showEnCiclaPreview(p);
                });
                if (f.properties.name) layer.bindTooltip(f.properties.name, { direction: 'top', className: 'custom-tooltip' });
            }
        }).addTo(globalMap);
    }).catch(err => console.error("Error loading EnCicla:", err));
};

window.toggleMapLayer = function (type, active) {
    if (!globalMap) return;
    switch (type) {
        case 'reportes': active ? (reporteMarkers && reporteMarkers.addTo(globalMap)) : (reporteMarkers && globalMap.removeLayer(reporteMarkers)); break;
        case 'relatos': active ? (relatoMarkers && relatoMarkers.addTo(globalMap)) : (relatoMarkers && globalMap.removeLayer(relatoMarkers)); break;
        case 'heatmap': if (heatLayer) active ? heatLayer.addTo(globalMap) : globalMap.removeLayer(heatLayer); break;
        case 'comunas': active ? window.loadComunas() : (comunasLayer && globalMap.removeLayer(comunasLayer)); break;
        case 'ciclorrutas': active ? window.loadCiclorrutas() : (cicloLayer && globalMap.removeLayer(cicloLayer)); break;
        case 'muertes': active ? window.loadIncidentesSiClas() : (muertesLayer && globalMap.removeLayer(muertesLayer)); break;
        case 'encicla': active ? window.loadEnCicla() : (enciclaLayer && globalMap.removeLayer(enciclaLayer)); break;
    }
};

window.toggleSatelliteMode = function(active) {
    if (!globalMap) return;
    if (active) {
        if (globalMap.hasLayer(baseTileLayer)) globalMap.removeLayer(baseTileLayer);
        satelliteTileLayer.addTo(globalMap);
    } else {
        if (globalMap.hasLayer(satelliteTileLayer)) globalMap.removeLayer(satelliteTileLayer);
        baseTileLayer.addTo(globalMap);
    }
};
