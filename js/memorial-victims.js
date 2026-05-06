// js/memorial-victims.js
// ──────────────────────────────────────────────
// Victims listing and filtering logic
// ──────────────────────────────────────────────

let _victimsData = [];
let _isLoaded = false;

window.loadVictimsData = async function() {
    if (_isLoaded) return;
    
    const loadingEl = document.getElementById('victims-loading');
    if (loadingEl) loadingEl.classList.remove('hidden');

    try {
        const years = [2019, 2020, 2021, 2022, 2023, 2024];
        const baseMuertes = 'https://raw.githubusercontent.com/SiClas/sigenbici/main/visor/admon/ciclistas-muertos-';
        const basePuntos = 'https://raw.githubusercontent.com/SiClas/sigenbici/main/visor/puntos/incidentes-viales.geojson';

        const promises = years.map(year => 
            fetch(`${baseMuertes}${year}.geojson`)
                .then(res => res.ok ? res.json() : null)
                .then(data => data ? data.features.map(f => ({ ...f.properties, year })) : [])
                .catch(() => [])
        );

        // Also fetch from incidentes-viales for supplemental data
        const incidentesPromise = fetch(basePuntos)
            .then(res => res.json())
            .then(data => data.features
                .filter(f => {
                    const t = (f.properties.tipo || f.properties.TIPO || '').toLowerCase();
                    return t.includes('muerte') || t.includes('fatal');
                })
                .map(f => ({ ...f.properties, year: f.properties.fecha ? new Date(f.properties.fecha).getFullYear() : 'N/A' }))
            )
            .catch(() => []);

        const results = await Promise.all([...promises, incidentesPromise]);
        _victimsData = results.flat();
        
        // Remove duplicates based on location/date/age if possible
        // For now, simple deduplication by approximate location + date
        _victimsData = _deduplicateVictims(_victimsData);

        _isLoaded = true;
        if (loadingEl) loadingEl.classList.add('hidden');
        window.renderVictimsList();

    } catch (err) {
        console.error("Error loading victims data:", err);
        if (loadingEl) loadingEl.innerHTML = '<span class="text-red-500">Error al cargar datos.</span>';
    }
};

function _deduplicateVictims(data) {
    const seen = new Set();
    return data.filter(v => {
        const date = v.Fecha_Ocurrencia || v.FECHA || v.fecha || '';
        const age = v.Edad || v.EDAD || '';
        const key = `${date}-${age}`.toLowerCase();
        if (!key || key === '-' || seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

window.renderVictimsList = function() {
    const grid = document.getElementById('victims-grid');
    if (!grid) return;

    const yearFilter = document.getElementById('victim-filter-year').value;
    const causeFilter = document.getElementById('victim-filter-cause').value;
    const searchTerm = document.getElementById('victim-search').value.toLowerCase();
    
    // Age filter values
    const ageMin = parseInt(document.getElementById('age-min').value);
    const ageMax = parseInt(document.getElementById('age-max').value);

    const filtered = _victimsData.filter(v => {
        const year = v.year.toString();
        const interaction = (v.Interaccion || v.INTERACCION || v.tipo || v.TIPO || '').toLowerCase();
        const place = (v.Lugar_Ocurrencia || v.DIRECCION || '').toLowerCase();
        
        // Age parsing
        let ageValue = parseInt(v.Edad || v.EDAD);
        if (isNaN(ageValue)) ageValue = -1; // Unknown

        const matchesYear = yearFilter === 'all' || year === yearFilter;
        
        let matchesCause = true;
        if (causeFilter !== 'all') {
            if (causeFilter === 'Auto') matchesCause = interaction.includes('auto') || interaction.includes('particular');
            else if (causeFilter === 'Bus') matchesCause = interaction.includes('bus') || interaction.includes('tpv');
            else if (causeFilter === 'Camion') matchesCause = interaction.includes('camion') || interaction.includes('volqueta');
            else if (causeFilter === 'Moto') matchesCause = interaction.includes('moto');
            else if (causeFilter === 'Caida') matchesCause = interaction.includes('caida') || interaction.includes('objeto');
        }

        const matchesSearch = !searchTerm || place.includes(searchTerm) || interaction.includes(searchTerm);
        
        // Age range check (if age is unknown, we only show it if the range covers the whole span, 
        // or we can decide to hide/show. Let's show only if within range or if range is default 0-100)
        let matchesAge = true;
        if (ageValue !== -1) {
            matchesAge = ageValue >= ageMin && ageValue <= ageMax;
        } else {
            // If unknown age, show if range is at extremes
            matchesAge = (ageMin === 0 && ageMax === 100);
        }

        return matchesYear && matchesCause && matchesSearch && matchesAge;
    });

    grid.innerHTML = filtered.map(v => {
        const fecha = v.Fecha_Ocurrencia || v.FECHA || v.fecha || 'N/A';
        const edad = v.Edad || v.EDAD || 'N/A';
        const interaccion = v.Interaccion || v.INTERACCION || 'N/A';
        const lugar = v.Lugar_Ocurrencia || v.DIRECCION || 'Desconocido';
        const year = v.year;

        return `
            <div class="victim-card bg-white/5 border border-white/10 p-5 rounded-xl hover:border-[#FF003C]/40 transition-all group relative overflow-hidden">
                <div class="absolute -right-4 -top-4 w-20 h-20 bg-[#FF003C]/5 rounded-full group-hover:bg-[#FF003C]/10 transition-colors"></div>
                
                <span class="text-[10px] text-[#FF003C] font-bold tracking-widest uppercase mb-1 block">${year}</span>
                <h3 class="text-white font-display text-sm font-bold uppercase mb-3 leading-tight">En memoria</h3>
                
                <div class="space-y-3 relative z-10">
                    <div class="flex items-start gap-2">
                        <span class="material-symbols-outlined text-white/30 text-sm mt-0.5">calendar_today</span>
                        <div class="flex flex-col">
                            <span class="text-[9px] text-white/40 uppercase">Fecha</span>
                            <span class="text-xs text-white/80">${fecha}</span>
                        </div>
                    </div>
                    
                    <div class="flex items-start gap-2">
                        <span class="material-symbols-outlined text-white/30 text-sm mt-0.5">person</span>
                        <div class="flex flex-col">
                            <span class="text-[9px] text-white/40 uppercase">Edad</span>
                            <span class="text-xs text-white/80">${edad} años</span>
                        </div>
                    </div>

                    <div class="flex items-start gap-2">
                        <span class="material-symbols-outlined text-[#FF003C]/50 text-sm mt-0.5">warning</span>
                        <div class="flex flex-col">
                            <span class="text-[9px] text-white/40 uppercase">Interacción</span>
                            <span class="text-xs text-white font-bold">${interaccion}</span>
                        </div>
                    </div>

                    <div class="h-px bg-white/5 my-2"></div>
                    
                    <p class="text-[10px] text-white/40 italic line-clamp-2">${lugar}</p>
                </div>
            </div>
        `;
    }).join('');

    if (filtered.length === 0 && _isLoaded) {
        grid.innerHTML = `
            <div class="col-span-full py-10 text-center opacity-30">
                <p class="text-sm uppercase tracking-widest">No se encontraron registros</p>
            </div>
        `;
    }
};

// ─── AGE RANGE SLIDER ────────────────────────
window.updateAgeRange = function() {
    const minInput = document.getElementById('age-min');
    const maxInput = document.getElementById('age-max');
    const display = document.getElementById('age-range-value');

    let min = parseInt(minInput.value);
    let max = parseInt(maxInput.value);

    // Swap if min > max
    if (min > max) {
        let temp = min;
        min = max;
        max = temp;
    }

    display.textContent = `${min} - ${max}`;
    window.renderVictimsList();
};

window.resetMemorialFilters = function() {
    document.getElementById('victim-filter-year').value = 'all';
    document.getElementById('victim-filter-cause').value = 'all';
    document.getElementById('victim-search').value = '';
    document.getElementById('age-min').value = 0;
    document.getElementById('age-max').value = 100;
    document.getElementById('age-range-value').textContent = '0 - 100';
    window.renderVictimsList();
};

window.toggleMemorialFilters = function() {
    const container = document.getElementById('memorial-filters-container');
    if (container) {
        container.classList.toggle('hidden');
        container.classList.toggle('is-visible');
    }
};

