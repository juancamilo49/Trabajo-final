// js/scrollytelling.js
// ──────────────────────────────────────────────
// Dynamic story viewer with IntersectionObserver,
// scratch-to-reveal image, and Ecos (anonymous comments)
// ──────────────────────────────────────────────

let scrollyObserver = null;
let _currentRelatoId = null;
let _ecosUnsubscribe = null;

// Eco symbols
const ECO_SYMBOLS = [
    { id: 0, icon: '🕯️', label: 'Vela' },
    { id: 1, icon: '🚲', label: 'Bicicleta' },
    { id: 2, icon: '✦',  label: 'Luz' }
];

window.openRelato = function (docId) {
    _currentRelatoId = docId;

    // Clean up previous ecos listener
    if (_ecosUnsubscribe) { _ecosUnsubscribe(); _ecosUnsubscribe = null; }

    // Auto-disable heatmap for better visibility of the story map
    if (window.toggleMapLayer) {
        window.toggleMapLayer('heatmap', false);
        const heatCheck = document.getElementById('filter-heatmap');
        if (heatCheck) heatCheck.checked = false;
    }

    navigate('story');

    const skeleton = document.getElementById('story-skeleton');
    const content = document.getElementById('story-content');
    const headerEl = document.getElementById('story-header');
    const scrollyEl = document.getElementById('scrolly-text');
    const navEl = document.getElementById('story-nav');

    if (skeleton) skeleton.classList.remove('hidden');
    if (content) content.classList.add('hidden');

    const cache = window._relatosCache || {};
    const relato = cache[docId];

    if (relato) {
        _renderRelato(relato, docId, headerEl, scrollyEl, navEl, skeleton, content);
    } else {
        setTimeout(() => {
            if (skeleton) skeleton.innerHTML = `
                <p class="text-red-400 text-sm mt-10">Error: Archivo no encontrado en caché.</p>
                <button onclick="closeRelato()" class="text-safety mt-4 text-sm">← Volver</button>
            `;
        }, 500);
    }
};

// ─── RENDER RELATO ──────────────────────────
function _renderRelato(relato, docId, headerEl, scrollyEl, navEl, skeleton, content) {
    const idShort = docId.slice(0, 8).toUpperCase();
    const fecha = relato.fecha ? new Date(relato.fecha).toLocaleDateString('es-CO', {
        year: 'numeric', month: 'long', day: 'numeric'
    }) : 'Fecha desconocida';

    // Forensic header
    headerEl.innerHTML = `
        <div class="flex items-center gap-2 mb-4">
            <span class="inline-block w-2 h-2 rounded-full bg-safety animate-pulse"></span>
            <span class="text-safety text-xs tracking-[0.3em] uppercase">Archivo Activo</span>
        </div>
        <div class="bg-white/3 border border-white/10 rounded-lg p-4 font-mono text-xs space-y-1">
            <div class="flex justify-between">
                <span class="text-white/40">ID_ARCHIVO:</span>
                <span class="text-safety">CF-${idShort}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-white/40">COORDENADAS:</span>
                <span class="text-city">${relato.lat.toFixed(6)}, ${relato.lng.toFixed(6)}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-white/40">FECHA_REGISTRO:</span>
                <span class="text-white/70">${fecha}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-white/40">ZONA:</span>
                <span class="text-white/70">${_esc(relato.zona || 'Sin clasificar')}</span>
            </div>
        </div>
        <h1 class="font-display text-3xl md:text-4xl text-white mt-6 font-extrabold leading-tight">${_esc(relato.titulo)}</h1>
    `;

    // Split relato into paragraphs
    const paragraphs = (relato.relato || '')
        .split(/\n\n+/)
        .map(p => p.trim())
        .filter(p => p.length > 0);

    let steps;
    if (paragraphs.length <= 1) {
        const sentences = (relato.relato || '').match(/[^.!?]+[.!?]+/g) || [relato.relato];
        steps = [];
        for (let i = 0; i < sentences.length; i += 3) {
            steps.push(sentences.slice(i, i + 3).join(' ').trim());
        }
    } else {
        steps = paragraphs;
    }

    // Zoom sequence
    const zooms = [15, 16, 17, 18, 17, 16, 15, 18];

    // Build steps HTML
    let stepsHTML = '';

    steps.forEach((text, i) => {
        const zoom = zooms[i % zooms.length];
        const latOff = (Math.random() - 0.5) * 0.003;
        const lngOff = (Math.random() - 0.5) * 0.003;

        // Insert scratch-to-reveal image after the 2nd paragraph
        if (i === 2) {
            stepsHTML += _buildScratchRevealHTML();
        }

        stepsHTML += `
            <div class="step min-h-[50vh] flex items-start pt-8"
                 data-lat="${(relato.lat + latOff).toFixed(6)}"
                 data-lng="${(relato.lng + lngOff).toFixed(6)}"
                 data-zoom="${zoom}">
                <p class="text-base md:text-lg leading-relaxed text-white/85">${_esc(text)}</p>
            </div>
        `;
    });

    // If less than 3 paragraphs, still add scratch after all content
    if (steps.length < 3) {
        stepsHTML += _buildScratchRevealHTML();
    }

    // Add Ecos section at the end
    stepsHTML += _buildEcosHTML(docId);

    scrollyEl.innerHTML = stepsHTML;

    // Prev/Next nav
    _renderStoryNav(docId, navEl);

    // Animate in
    setTimeout(() => {
        if (skeleton) skeleton.classList.add('hidden');
        if (content) content.classList.remove('hidden');

        if (window.flyToLocation) {
            window.flyToLocation(relato.lat, relato.lng, 15);
        }

        _initObserver();

        // Init scratch canvas
        if (window.initScratchReveal) {
            window.initScratchReveal('scratch-canvas', () => {
                const msg = document.getElementById('scratch-revealed-msg');
                if (msg) msg.classList.remove('hidden');
            });
        }

        // Init ecos listener
        _initEcos(docId);

        const panel = document.getElementById('story-panel');
        if (panel) panel.scrollTop = 0;
    }, 400);
}

// ─── SCRATCH-TO-REVEAL HTML ─────────────────
function _buildScratchRevealHTML() {
    return `
        <div class="my-12 relative w-full aspect-video rounded-lg overflow-hidden border border-white/10" id="scratch-container">
            <!-- Background image (revealed underneath) -->
            <div class="absolute inset-0 bg-gradient-to-br from-black/80 via-[#0a0a0a] to-black/90 flex items-center justify-center">
                <div class="text-center">
                    <span class="text-6xl mb-4 block opacity-60">🚲</span>
                    <span class="text-white/20 text-xs tracking-widest uppercase">Bicicleta Blanca — Memorial</span>
                </div>
            </div>
            <!-- Scratch canvas overlay -->
            <canvas id="scratch-canvas" class="absolute inset-0 w-full h-full cursor-crosshair" style="touch-action:none;"></canvas>
            <!-- Revealed message -->
            <div id="scratch-revealed-msg" class="hidden absolute bottom-3 left-0 right-0 text-center">
                <span class="bg-safety/20 text-safety text-xs tracking-[0.2em] uppercase px-4 py-2 rounded-full border border-safety/30 backdrop-blur-sm">
                    Memoria recuperada
                </span>
            </div>
        </div>
    `;
}

// ─── ECOS (Anonymous Comments) ──────────────
function _buildEcosHTML(docId) {
    const symbolBtns = ECO_SYMBOLS.map(s =>
        `<button type="button" class="eco-symbol-btn w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-lg hover:border-safety/50 hover:bg-white/5 transition-all" data-sid="${s.id}" title="${s.label}" onclick="selectEcoSymbol(this, ${s.id})">${s.icon}</button>`
    ).join('');

    return `
        <div class="border-t border-white/10 mt-16 pt-10" id="ecos-section">
            <div class="flex items-center gap-3 mb-6">
                <span class="text-safety text-xs tracking-[0.3em] uppercase">Ecos</span>
                <span class="text-white/20 text-xs">— Muro anónimo de memoria</span>
            </div>

            <!-- Eco input -->
            <div class="bg-white/3 border border-white/10 rounded-lg p-4 mb-8">
                <div class="flex gap-3 mb-3">
                    ${symbolBtns}
                </div>
                <div class="flex gap-2">
                    <input type="text" id="eco-input" maxlength="140" placeholder="Deja un eco..." class="flex-1 bg-transparent border-b border-white/15 text-white text-sm py-2 px-1 focus:outline-none focus:border-safety/50 placeholder-white/20 font-mono transition-colors">
                    <button onclick="submitEco('${docId}')" class="text-safety text-xs tracking-widest uppercase px-4 py-2 border border-safety/20 rounded hover:bg-safety/10 transition-colors whitespace-nowrap">
                        Enviar
                    </button>
                </div>
                <span class="text-white/15 text-[10px] mt-2 block">Anónimo • Máximo 140 caracteres</span>
            </div>

            <!-- Eco list -->
            <div id="ecos-list" class="space-y-3">
                <div class="eco-loading text-white/15 text-xs tracking-widest animate-pulse">Cargando ecos...</div>
            </div>
        </div>
    `;
}

let _selectedSymbol = 0;

window.selectEcoSymbol = function (btn, id) {
    _selectedSymbol = id;
    document.querySelectorAll('.eco-symbol-btn').forEach(b => {
        b.classList.remove('border-safety', 'bg-safety/10');
        b.classList.add('border-white/15');
    });
    btn.classList.remove('border-white/15');
    btn.classList.add('border-safety', 'bg-safety/10');
};

window.submitEco = async function (docId) {
    const input = document.getElementById('eco-input');
    if (!input || !input.value.trim()) return;

    const msg = input.value.trim();
    input.value = '';
    input.placeholder = 'Enviando...';

    try {
        // Dynamic import to access addEco
        const { addEco } = await import('./firebase-config.js');
        await addEco(docId, msg, _selectedSymbol);
        input.placeholder = 'Deja un eco...';
    } catch (err) {
        console.error('Error sending eco:', err);
        input.placeholder = 'Error al enviar';
        setTimeout(() => { input.placeholder = 'Deja un eco...'; }, 2000);
    }
};

async function _initEcos(docId) {
    if (_ecosUnsubscribe) { _ecosUnsubscribe(); _ecosUnsubscribe = null; }

    try {
        const { listenEcos } = await import('./firebase-config.js');
        _ecosUnsubscribe = listenEcos(docId, (ecos) => {
            _renderEcos(ecos);
        });
    } catch (err) {
        console.error('Error loading ecos:', err);
    }
}

function _renderEcos(ecos) {
    const container = document.getElementById('ecos-list');
    if (!container) return;

    if (ecos.length === 0) {
        container.innerHTML = '<p class="text-white/15 text-xs font-mono">Aún no hay ecos. Sé el primero en dejar uno.</p>';
        return;
    }

    container.innerHTML = ecos.map((eco, i) => {
        const symbol = ECO_SYMBOLS.find(s => s.id === eco.simbolo_id) || ECO_SYMBOLS[0];
        const time = eco.timestamp?.toDate
            ? eco.timestamp.toDate().toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })
            : '';

        return `
            <div class="eco-item flex items-start gap-3 py-2 border-b border-white/5" style="animation: eco-fade-in 0.5s ease ${i * 0.08}s backwards;">
                <span class="text-lg mt-0.5 opacity-60">${symbol.icon}</span>
                <div class="flex-1 min-w-0">
                    <p class="text-white/70 text-sm font-mono leading-relaxed">${_esc(eco.mensaje)}</p>
                    ${time ? `<span class="text-white/15 text-[10px]">${time}</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// ─── PREV/NEXT NAVIGATION ───────────────────
function _renderStoryNav(currentId, navEl) {
    if (!navEl) return;

    const list = window._relatosList || [];
    const idx = list.findIndex(r => r.id === currentId);

    if (idx === -1 || list.length <= 1) {
        navEl.innerHTML = '';
        return;
    }

    const prev = idx > 0 ? list[idx - 1] : null;
    const next = idx < list.length - 1 ? list[idx + 1] : null;

    navEl.innerHTML = `
        ${prev ? `
            <button onclick="openRelato('${prev.id}')" class="flex-1 text-left bg-white/5 border border-white/10 hover:border-safety/30 rounded-lg p-4 transition-colors group">
                <span class="text-[10px] text-white/30 tracking-widest uppercase block mb-1">← Anterior</span>
                <span class="text-sm font-display font-bold group-hover:text-safety transition-colors">${_esc(prev.titulo)}</span>
            </button>
        ` : '<div class="flex-1"></div>'}
        ${next ? `
            <button onclick="openRelato('${next.id}')" class="flex-1 text-right bg-white/5 border border-white/10 hover:border-city/30 rounded-lg p-4 transition-colors group">
                <span class="text-[10px] text-white/30 tracking-widest uppercase block mb-1">Siguiente →</span>
                <span class="text-sm font-display font-bold group-hover:text-city transition-colors">${_esc(next.titulo)}</span>
            </button>
        ` : '<div class="flex-1"></div>'}
    `;
}

// ─── INTERSECTION OBSERVER ──────────────────
function _initObserver() {
    const steps = document.querySelectorAll('#scrolly-text .step');
    if (steps.length === 0) return;

    if (scrollyObserver) scrollyObserver.disconnect();

    const options = {
        root: document.getElementById('story-panel'),
        rootMargin: '0px 0px -30% 0px',
        threshold: 0.4
    };

    scrollyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                steps.forEach(s => s.classList.remove('is-active'));
                entry.target.classList.add('is-active');

                const lat = parseFloat(entry.target.dataset.lat);
                const lng = parseFloat(entry.target.dataset.lng);
                const zoom = parseInt(entry.target.dataset.zoom) || 16;

                if (!isNaN(lat) && !isNaN(lng) && window.flyToLocation) {
                    window.flyToLocation(lat, lng, zoom);
                }
            }
        });
    }, options);

    steps.forEach(step => scrollyObserver.observe(step));
}

// ─── CLOSE RELATO ───────────────────────────
window.closeRelato = function () {
    _currentRelatoId = null;
    if (scrollyObserver) scrollyObserver.disconnect();
    if (_ecosUnsubscribe) { _ecosUnsubscribe(); _ecosUnsubscribe = null; }

    if (window.flyToLocation) {
        window.flyToLocation(6.2442, -75.5812, 13);
    }

    navigate('memorial');
};

function _esc(s) { return (s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
