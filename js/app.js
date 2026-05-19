import { initAudio, setPageContext, unmuffleSound, playHonk } from './audio.js';

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

    // ── Audio Overlay ──
    const audioOverlay = document.getElementById('audio-overlay');
    if (audioOverlay) {
        document.getElementById('btn-audio-yes')?.addEventListener('click', () => {
            initAudio();
            audioOverlay.style.opacity = '0';
            setTimeout(() => { audioOverlay.classList.add('hidden'); }, 1000);
        });
        document.getElementById('btn-audio-no')?.addEventListener('click', () => {
            audioOverlay.style.opacity = '0';
            setTimeout(() => { audioOverlay.classList.add('hidden'); }, 1000);
        });
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
    // ── Header hide on scroll (mobile) ──
    let lastScroll = 0;
    const header = document.getElementById('nav-main');
    
    const handleSectionScroll = (container) => {
        const currentScroll = container.scrollTop;
        
        // 1. Header hide logic (mobile only)
        if (window.innerWidth < 768) {
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.classList.add('nav-hidden');
            } else {
                header.classList.remove('nav-hidden');
            }
        }
        lastScroll = currentScroll;

        // 2. Back to top button logic
        const btn = document.getElementById('back-to-top-btn');
        if (btn) {
            const isScrolled = currentScroll > 400;
            btn.classList.toggle('is-visible', isScrolled);
        }
    };

    // Attach to sections that scroll
    ['relatos-section', 'memorial-section', 'who-we-are-section'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('scroll', () => handleSectionScroll(el));
    });

    // Initialize map interaction blocking
    setTimeout(() => {
        ['map-filters', 'stats-panel', 'filters-content'].forEach(id => {
            const el = document.getElementById(id);
            if (el) _blockMapInteraction(el);
        });
    }, 500);

    // ── Bicycle Bell Interaction ──
    const bikeLogos = document.querySelectorAll('.logo-icon, .nav-logo img');
    bikeLogos.forEach(logo => {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', (e) => {
            playHonk();
            // Visual feedback
            logo.animate([
                { transform: 'scale(1) rotate(0)' },
                { transform: 'scale(1.2) rotate(15deg)' },
                { transform: 'scale(1) rotate(0)' }
            ], { duration: 300, easing: 'ease-out' });
        });
    });
});

// All navigable section IDs
const ALL_SECTIONS = [
    'section-hero',
    'main-map-container',
    'relatos-section',
    'memorial-section',
    'who-we-are-section',
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

    // Hide back-to-top button on navigation
    const bttBtn = document.getElementById('back-to-top-btn');
    if (bttBtn) bttBtn.classList.remove('is-visible');

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
    else if (viewId === 'relatos') {
        document.getElementById('relatos-section').classList.remove('hidden');
        if (window.refreshRelatosCards) window.refreshRelatosCards();
    }
    else if (viewId === 'memorial') {
        document.getElementById('memorial-section').classList.remove('hidden');
        if (window.loadVictimsData) window.loadVictimsData();
    }
    else if (viewId === 'who-we-are') {
        document.getElementById('who-we-are-section').classList.remove('hidden');
        if (window.renderWhoWeAre) window.renderWhoWeAre();
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
    
    // Update audio context for the new view
    setPageContext(viewId);
    
    // Always unmuffle on navigation to ensure clear sound
    unmuffleSound();
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
        
        // Wait for animation to finish before hiding
        setTimeout(() => {
            if (!card || !card.classList.contains('is-visible')) {
                preview.classList.add('hidden');
            }
        }, 400);
    }
}

// ─── BACK TO TOP (Global) ─────────────────────
window.scrollToTopActiveSection = function() {
    const activeSection = document.querySelector('.view-section:not(.hidden)');
    if (activeSection) {
        activeSection.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ─── RELATOS FILTERING ─────────────────────
window._activeRelatosZone = null;

window.filterRelatos = function() {
    const searchTerm = (document.getElementById('relatos-search')?.value || '').toLowerCase();
    const showRead = document.getElementById('filter-read')?.checked ?? true;
    const showUnread = document.getElementById('filter-unread')?.checked ?? true;
    const cards = document.querySelectorAll('#relatos-grid .memorial-card');

    let visibleCount = 0;
    cards.forEach(card => {
        const titulo = (card.dataset.titulo || '').toLowerCase();
        const zona = (card.dataset.zona || '').toLowerCase();
        const relato = (card.dataset.relato || '').toLowerCase();
        const isRead = card.dataset.read === 'true';

        const matchesSearch = !searchTerm || titulo.includes(searchTerm) || relato.includes(searchTerm);
        const matchesZone = !window._activeRelatosZone || zona === window._activeRelatosZone.toLowerCase();
        
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

    const emptyEl = document.getElementById('relatos-empty');
    if (emptyEl) {
        emptyEl.classList.toggle('hidden', visibleCount > 0);
    }
}

window.setRelatosZoneFilter = function(zone, btn) {
    // Toggle same zone off
    if (window._activeRelatosZone === zone) {
        window._activeRelatosZone = null;
        document.querySelectorAll('#relatos-section .zone-chip').forEach(c => c.classList.remove('is-active'));
    } else {
        window._activeRelatosZone = zone;
        document.querySelectorAll('#relatos-section .zone-chip').forEach(c => c.classList.remove('is-active'));
        if (btn) btn.classList.add('is-active');
    }
    window.filterRelatos();
}


function _esc(s) { return (s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

window.toggleMapFilters = function() {
    const content = document.getElementById('filters-content');
    const chevron = document.getElementById('filters-chevron');
    if (content) {
        const isHidden = content.classList.toggle('hidden');
        if (!isHidden) {
            _blockMapInteraction(content);
        }
        if (chevron) {
            chevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    }
};

window.toggleTooltip = function(btn, event) {
    if (event) event.stopPropagation();
    const container = btn.closest('.info-tooltip-container');
    const isActive = container.classList.contains('active');
    
    // Close all other tooltips
    document.querySelectorAll('.info-tooltip-container').forEach(c => c.classList.remove('active'));
    
    if (!isActive) {
        container.classList.add('active');
    }
};

// Close tooltip when clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('.info-tooltip-container').forEach(c => c.classList.remove('active'));
});

window.toggleStats = function() {
    const panel = document.getElementById('stats-panel');
    const chevron = document.getElementById('stats-chevron');
    if (panel) {
        const isHidden = panel.classList.toggle('hidden');
        if (!isHidden) {
            _blockMapInteraction(panel);
        }
        if (chevron) {
            chevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    }
};

function _blockMapInteraction(el) {
    if (typeof L === 'undefined') return;
    
    // Standard Leaflet blockers
    L.DomEvent.disableScrollPropagation(el);
    L.DomEvent.disableClickPropagation(el);

    // Extra robust blockers for mobile touch
    const events = ['touchstart', 'touchmove', 'touchend', 'pointerdown', 'pointermove', 'pointerup'];
    events.forEach(evt => {
        el.addEventListener(evt, (e) => {
            e.stopPropagation();
        }, { passive: false });
    });
}

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
