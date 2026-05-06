// js/app.js
// ──────────────────────────────────────────────
// SPA Navigation + Mobile Menu
// ──────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    console.log("App Initialized");
    window._currentViewId = 'home';
    console.log("App Version: 2026-05-06-12:20");
    
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
    const fromViewId = window._currentViewId;

    // Store previous view if we are going to 'story'
    if (viewId === 'story') {
        window._previousViewId = fromViewId || 'memorial';
    } else {
        window._currentViewId = viewId;
    }

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
        
        // Reset view when going to map (unless returning from story)
        if (window.globalMap && fromViewId !== 'story') {
            window.globalMap.setView([6.2442, -75.5812], 13);
        }

        // Force marker refresh for read status
        if (window.updateRelatos && window._relatosList) window.updateRelatos(window._relatosList);
    }
    else if (viewId === 'memorial') {
        document.getElementById('memorial-archive').classList.remove('hidden');
        if (typeof _initBackToTop === 'function') _initBackToTop();
        if (window.refreshMemorialCards) window.refreshMemorialCards();
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
window._activeZone = null;

window.filterMemorial = function() {
    const searchTerm = (document.getElementById('memorial-search')?.value || '').toLowerCase();
    const showRead = document.getElementById('filter-read')?.checked ?? true;
    const showUnread = document.getElementById('filter-unread')?.checked ?? true;
    const cards = document.querySelectorAll('#memorial-grid .memorial-card');

    let visibleCount = 0;
    cards.forEach(card => {
        const titulo = (card.dataset.titulo || '').toLowerCase();
        const zona = (card.dataset.zona || '').toLowerCase();
        const relato = (card.dataset.relato || '').toLowerCase();
        const isRead = card.dataset.read === 'true';

        const matchesSearch = !searchTerm || titulo.includes(searchTerm) || relato.includes(searchTerm);
        const matchesZone = !window._activeZone || zona === window._activeZone.toLowerCase();
        
        let matchesStatus = false;
        if (isRead && showRead) matchesStatus = true;
        if (!isRead && showUnread) matchesStatus = true;

        if (matchesSearch && matchesZone && matchesStatus) {
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

window.setZoneFilter = function(zone, btn) {
    // Toggle same zone off
    if (window._activeZone === zone) {
        window._activeZone = null;
        document.querySelectorAll('.zone-chip').forEach(c => c.classList.remove('is-active'));
    } else {
        window._activeZone = zone;
        document.querySelectorAll('.zone-chip').forEach(c => c.classList.remove('is-active'));
        if (btn) btn.classList.add('is-active');
    }
    window.filterMemorial();
}

function _esc(s) { return (s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// ─── MAP STATS UI ──────────────────────────
window.toggleStats = function() {
    const panel = document.getElementById('stats-panel');
    const chevron = document.getElementById('stats-chevron');
    if (panel) {
        const isHidden = panel.classList.toggle('hidden');
        if (chevron) {
            chevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    }
};

window.updateComunaStats = function(counts) {
    const list = document.getElementById('comunas-stats-list');
    if (!list) return;
    
    if (Object.keys(counts).length === 0) {
        list.innerHTML = '<span class="text-[10px] text-white/40 italic">No hay relatos registrados</span>';
        return;
    }

    // Sort by count descending
    const sortedComunas = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    
    list.innerHTML = sortedComunas.map(([name, count]) => `
        <div class="flex items-center justify-between text-[11px] group">
            <span class="text-white/70 group-hover:text-city transition-colors truncate max-w-[120px]">${name}</span>
            <span class="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-city font-mono">${count}</span>
        </div>
    `).join('');
};
