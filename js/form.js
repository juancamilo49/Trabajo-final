// js/form.js
// ──────────────────────────────────────────────
// Firebase form submission + real-time data listener
// Populates: map markers, memorial cards, relatos cache
// ──────────────────────────────────────────────
import { db, collection, addDoc, onSnapshot } from './firebase-config.js';

// Global cache for instant relato access
window._relatosCache = {};
window._relatosList = [];  // ordered array for prev/next nav
window._lastZonas = new Set();

document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. FORM SUBMISSION ──────────────────
    const form = document.getElementById('incident-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const title = document.getElementById('form-title').value;
            const story = document.getElementById('form-story').value;
            const lat = document.getElementById('form-lat').value;
            const lng = document.getElementById('form-lng').value;
            const feedback = document.getElementById('form-feedback');

            if (!lat || !lng) {
                feedback.textContent = 'Por favor, selecciona un punto en el mapa primero.';
                feedback.classList.remove('hidden');
                return;
            }

            if (!db) {
                feedback.textContent = 'Error: Firebase no está configurado.';
                feedback.classList.remove('hidden');
                return;
            }

            try {
                feedback.textContent = 'Guardando reporte…';
                feedback.classList.remove('hidden');

                const latVal = parseFloat(lat);
                const lngVal = parseFloat(lng);
                const comuna = window.getComunaForCoords ? window.getComunaForCoords(latVal, lngVal) : "";

                await addDoc(collection(db, "incidentes"), {
                    titulo: title,
                    relato: story.slice(0, 450 * 5),
                    coordenadas: { lat: latVal, lng: lngVal },
                    fecha: new Date(),
                    tipo: "reporte",
                    zona: comuna,
                    imagen_url: ""
                });

                feedback.textContent = '¡Reporte enviado exitosamente de forma anónima!';
                
                // Show native alert for feedback as requested
                setTimeout(() => {
                    alert('Tu reporte ha sido guardado en el archivo vivo.');
                    if (window.navigate) window.navigate('map');
                }, 100);

                form.reset();
                document.getElementById('form-lat').value = '';
                document.getElementById('form-lng').value = '';
            } catch (error) {
                console.error("Error adding document: ", error);
                feedback.textContent = 'Error al guardar el reporte.';
            }
        });
    }

    // ─── 2. REAL-TIME LISTENER ───────────────
    if (db) {
        onSnapshot(collection(db, "incidentes"), (snapshot) => {
            const reportes = [];
            const relatos = [];
            const relatosList = [];
            const zonas = new Set();

            const comunaCounts = {};

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                if (!data.coordenadas) return;

                const lat = parseFloat(data.coordenadas.lat);
                const lng = parseFloat(data.coordenadas.lng);
                if (isNaN(lat) || isNaN(lng)) return;

                // Si no tiene zona asignada, intentamos detectarla si tenemos el detector listo
                let itemComuna = data.zona || "";
                if (!itemComuna && window.getComunaForCoords) {
                    itemComuna = window.getComunaForCoords(lat, lng);
                }

                const item = {
                    id: docSnap.id,
                    lat,
                    lng,
                    titulo: data.titulo || 'Sin título',
                    relato: data.relato || '',
                    zona: itemComuna,
                    fecha: data.fecha?.toDate ? data.fecha.toDate().toISOString() : (data.fecha || null)
                };

                if (data.tipo === 'relato' || data.tipo === 'reporte') {
                    if (itemComuna && itemComuna !== "Desconocida" && itemComuna !== "Fuera de Medellín") {
                        comunaCounts[itemComuna] = (comunaCounts[itemComuna] || 0) + 1;
                    }
                }

                if (data.tipo === 'relato') {
                    relatos.push(item);
                    relatosList.push(item);
                    if (item.zona) zonas.add(item.zona);
                    window._relatosCache[docSnap.id] = item;
                } else {
                    reportes.push(item);
                }
            });

            // Update stats UI
            if (window.updateComunaStats) window.updateComunaStats(comunaCounts);

            // Sort relatos by title for consistent prev/next nav
            relatosList.sort((a, b) => a.titulo.localeCompare(b.titulo));
            window._relatosList = relatosList;

            console.log(`Firebase → ${reportes.length} reportes, ${relatos.length} relatos`);

            // Update map
            if (window.updateReportes) window.updateReportes(reportes);
            if (window.updateRelatos) window.updateRelatos(relatos);

            // Update memorial cards
            window._lastZonas = zonas;
            renderRelatosCards(relatosList, zonas);
        });
    }
});

// Helper to refresh UI when returning to relatos (to show read status)
window.refreshRelatosCards = function() {
    if (window._relatosList && window._relatosList.length > 0) {
        renderRelatosCards(window._relatosList, window._lastZonas);
        if (window.filterRelatos) window.filterRelatos();
    }
};

// ─── RELATOS CARD RENDERING ─────────────────
function renderRelatosCards(relatos, zonas) {
    const grid = document.getElementById('relatos-grid');
    const loadingText = document.getElementById('relatos-loading-text');
    const zoneContainer = document.getElementById('relatos-zones');
    if (!grid) return;

    // Remove skeletons
    grid.querySelectorAll('.memorial-skeleton').forEach(s => s.remove());
    if (loadingText) loadingText.classList.add('hidden');

    // Render zone chips
    if (zoneContainer) {
        const allBtn = `<button class="zone-chip is-active" onclick="setRelatosZoneFilter(null, this)">Todas</button>`;
        const chips = Array.from(zonas).sort().map(z =>
            `<button class="zone-chip" onclick="setRelatosZoneFilter('${z}', this)">${z}</button>`
        ).join('');
        zoneContainer.innerHTML = allBtn + chips;
    }

    // Render cards
    if (relatos.length === 0) {
        grid.innerHTML = '<p class="text-white/30 col-span-full text-center py-12">No hay relatos en el archivo.</p>';
        return;
    }

    const readIds = JSON.parse(localStorage.getItem('readRelatos') || '[]');

    // Colors for card accents (cycle through)
    const accentColors = ['#DFFF00', '#00F5FF', '#FF003C', '#FF6B35', '#C77DFF'];

    grid.innerHTML = relatos.map((r, i) => {
        const extracto = (r.relato || '').split('\n')[0].slice(0, 120);
        const fecha = r.fecha ? new Date(r.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'short' }) : '';
        const accent = accentColors[i % accentColors.length];
        const idShort = r.id.slice(0, 8).toUpperCase();
        const isRead = readIds.includes(r.id);

        return `
            <article class="memorial-card group cursor-pointer ${isRead ? 'is-read' : ''}" 
                     data-titulo="${_esc(r.titulo)}" 
                     data-zona="${_esc(r.zona)}" 
                     data-relato="${_esc(extracto)}"
                     data-read="${isRead}"
                     onclick="openRelato('${r.id}')">
                <div class="relative h-48 overflow-hidden bg-white/5 rounded-t-lg">
                    <div class="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/80"></div>
                    <div class="absolute inset-0 grain-overlay"></div>
                    <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
                    <!-- Accent line -->
                    <div class="absolute top-0 left-0 w-full h-1 transition-all duration-500 group-hover:h-2" style="background:${accent};box-shadow:0 0 12px ${accent}"></div>
                    <!-- Read check -->
                    ${isRead ? `<div class="absolute top-3 left-3 bg-safety text-background rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg z-10">✔</div>` : ''}
                    <!-- File ID -->
                    <span class="absolute top-3 right-3 text-[10px] tracking-widest text-white/30 font-mono">CF-${idShort}</span>
                    <!-- Coords -->
                    <span class="absolute bottom-3 left-3 text-[10px] tracking-widest text-white/40 font-mono">${r.lat.toFixed(4)}, ${r.lng.toFixed(4)}</span>
                </div>
                <div class="p-4 border border-t-0 border-white/10 rounded-b-lg group-hover:border-white/20 transition-colors bg-background">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[10px] tracking-widest uppercase" style="color:${accent}">${_esc(r.zona) || 'Medellín'}</span>
                        <span class="text-[10px] text-white/30">${fecha}</span>
                    </div>
                    <h3 class="memorial-card-title font-display text-lg font-bold mb-2 group-hover:text-safety transition-colors leading-tight">${_esc(r.titulo)}</h3>
                    <p class="text-white/40 text-xs leading-relaxed line-clamp-2">${_esc(extracto)}…</p>
                </div>
            </article>
        `;
    }).join('');

    if (window.filterRelatos) window.filterRelatos();
}


function _esc(s) { return (s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
