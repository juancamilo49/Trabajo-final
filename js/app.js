// js/app.js
// ──────────────────────────────────────────────
// SPA Navigation + Mobile Menu
// ──────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    console.log("App Initialized");
    
    try {
        if (window.initMainMap) window.initMainMap();
    } catch (e) {
        console.error("Error initializing map:", e);
    }

    // ── Hero scratch canvas ──
    if (window.initScratchReveal) {
        // Wait briefly to ensure DOM layout is computed so offsetWidth/Height > 0
        setTimeout(() => {
            window.initScratchReveal('hero-scratch-canvas', () => {
                const container = document.getElementById('hero-scratch-container');
                if (container) {
                    container.style.pointerEvents = 'none';
                }
            });
        }, 300);
    }
});

// All navigable section IDs
const ALL_SECTIONS = [
    'section-hero',
    'main-map-container',
    'memorial-archive',
    'story-viewer',
    'participation-zone'
];

window.navigate = function(viewId) {
    // Hide all
    ALL_SECTIONS.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    // Close any open preview
    if (window.closeRelatoPreview) window.closeRelatoPreview();

    if (viewId === 'home') {
        document.getElementById('section-hero').classList.remove('hidden');
    }
    else if (viewId === 'map') {
        document.getElementById('main-map-container').classList.remove('hidden');
        if (window.invalidateMapSize) window.invalidateMapSize();
    }
    else if (viewId === 'memorial') {
        document.getElementById('memorial-archive').classList.remove('hidden');
        if (typeof _initBackToTop === 'function') _initBackToTop();
    }
    else if (viewId === 'participate') {
        document.getElementById('participation-zone').classList.remove('hidden');
        if (window.initFormMap) window.initFormMap();
    }
    else if (viewId === 'story') {
        // Show both the map background + story viewer panel
        document.getElementById('main-map-container').classList.remove('hidden');
        document.getElementById('story-viewer').classList.remove('hidden');
        if (window.invalidateMapSize) window.invalidateMapSize();
    }
}

// ─── MOBILE MENU ─────────────────────────────
window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('hamburger-btn');
    const isOpen = !menu.classList.contains('hidden');

    if (isOpen) {
        closeMobileMenu();
    } else {
        menu.classList.remove('hidden');
        btn.classList.add('is-open');
    }
}

window.closeMobileMenu = function() {
    document.getElementById('mobile-menu').classList.add('hidden');
    document.getElementById('hamburger-btn').classList.remove('is-open');
}

// ─── RELATO PREVIEW (bottom sheet / popup) ───
window.showRelatoPreview = function(docId) {
    const cache = window._relatosCache || {};
    const relato = cache[docId];
    if (!relato) return;

    const preview = document.getElementById('relato-preview');
    const content = document.getElementById('relato-preview-content');

    const extracto = (relato.relato || '').split('\n')[0].slice(0, 200);

    content.innerHTML = `
        <span class="text-city text-xs tracking-widest uppercase block mb-2">${_esc(relato.zona || 'Medellín')}</span>
        <h3 class="font-display text-2xl text-white mb-3 font-bold">${_esc(relato.titulo)}</h3>
        <p class="text-white/60 text-sm leading-relaxed mb-6">${_esc(extracto)}…</p>
        <div class="flex items-center justify-between gap-4">
            <span class="text-white/30 text-xs">${relato.fecha ? new Date(relato.fecha).toLocaleDateString('es-CO') : ''}</span>
            <button onclick="closeRelatoPreview(); openRelato('${docId}')" class="bg-safety text-background font-display text-sm px-6 py-3 uppercase font-bold hover:bg-white transition-colors">
                Leer Relato →
            </button>
        </div>
    `;

    preview.classList.remove('hidden');
    // Animate in
    requestAnimationFrame(() => {
        preview.querySelector('.relato-preview-card').classList.add('is-visible');
    });
}

window.closeRelatoPreview = function() {
    const preview = document.getElementById('relato-preview');
    if (preview) {
        const card = preview.querySelector('.relato-preview-card');
        if (card) card.classList.remove('is-visible');
        preview.classList.add('hidden');
    }
}

// ─── BACK TO TOP ─────────────────────────────
function _initBackToTop() {
    const memorial = document.getElementById('memorial-archive');
    const btn = document.getElementById('back-to-top');
    if (!memorial || !btn) return;

    memorial.addEventListener('scroll', () => {
        const isScrolled = memorial.scrollTop > 300;
        btn.classList.toggle('opacity-100', isScrolled);
        btn.classList.toggle('pointer-events-auto', isScrolled);
        btn.classList.toggle('translate-y-0', isScrolled);
        
        btn.classList.toggle('opacity-0', !isScrolled);
        btn.classList.toggle('pointer-events-none', !isScrolled);
        btn.classList.toggle('translate-y-4', !isScrolled);
    });
}

// ─── MEMORIAL FILTERING ─────────────────────
let _activeZone = null;

function filterMemorial() {
    const searchTerm = (document.getElementById('memorial-search')?.value || '').toLowerCase();
    const cards = document.querySelectorAll('#memorial-grid .memorial-card');

    let visibleCount = 0;
    cards.forEach(card => {
        const titulo = (card.dataset.titulo || '').toLowerCase();
        const zona = (card.dataset.zona || '').toLowerCase();
        const relato = (card.dataset.relato || '').toLowerCase();

        const matchesSearch = !searchTerm || titulo.includes(searchTerm) || relato.includes(searchTerm);
        const matchesZone = !_activeZone || zona === _activeZone.toLowerCase();

        if (matchesSearch && matchesZone) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });

    const emptyEl = document.getElementById('memorial-empty');
    if (emptyEl) {
        emptyEl.classList.toggle('hidden', visibleCount > 0);
    }
}

function setZoneFilter(zone, btn) {
    // Toggle same zone off
    if (_activeZone === zone) {
        _activeZone = null;
        document.querySelectorAll('.zone-chip').forEach(c => c.classList.remove('is-active'));
    } else {
        _activeZone = zone;
        document.querySelectorAll('.zone-chip').forEach(c => c.classList.remove('is-active'));
        if (btn) btn.classList.add('is-active');
    }
    filterMemorial();
}

function _esc(s) { return (s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
