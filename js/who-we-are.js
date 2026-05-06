// js/who-we-are.js

const CYCLISTS_PROFILES = [
    {
        name: "Andrés",
        role: "Mensajero Mensajería Urbana",
        reason: "Usa la bici porque es la forma más rápida de cruzar el tráfico de Medellín. Para él, la bici es libertad y su herramienta de trabajo.",
        image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&q=80&w=400"
    },
    {
        name: "Mariana",
        role: "Estudiante Universitaria",
        reason: "Se mueve en bici para ahorrar tiempo y dinero. Además, siente que es su pequeña contribución para reducir la contaminación en el valle.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"
    },
    {
        name: "Don Roberto",
        role: "Trabajador de Construcción",
        reason: "Ha usado la bicicleta toda su vida. Es su medio de transporte fiel desde hace 30 años para llegar a las obras desde su barrio.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"
    },
    {
        name: "Elena",
        role: "Activista Ciclista",
        reason: "La bicicleta es un acto político. La usa para reclamar el derecho al espacio público y promover ciudades más humanas.",
        image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400"
    },
    {
        name: "Mateo",
        role: "Padre de familia",
        reason: "Lleva a su hijo al colegio en una bici de carga. Quiere que su hijo crezca viendo la ciudad desde otra perspectiva, no desde un auto.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"
    },
    {
        name: "Sofía",
        role: "Diseñadora Freelance",
        reason: "La bicicleta le ayuda a despejar la mente. Es su momento de meditación diaria antes de sentarse frente a la pantalla.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400"
    }
];

window.renderWhoWeAre = function() {
    const grid = document.getElementById('who-we-are-grid');
    if (!grid) return;

    grid.innerHTML = CYCLISTS_PROFILES.map(profile => `
        <div class="flip-card h-80 perspective cursor-pointer" onclick="this.classList.toggle('is-flipped')">
            <div class="card-inner relative preserve-3d w-full h-full duration-700 transition-transform">
                <!-- Front -->
                <div class="absolute inset-0 backface-hidden rounded-xl overflow-hidden border border-white/10 bg-black/20">
                    <img src="${profile.image}" class="w-full h-full object-cover grayscale opacity-60 transition-all duration-500" alt="${profile.name}">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                    <div class="absolute bottom-4 left-4">
                        <h3 class="text-xl font-display font-bold text-safety">${profile.name}</h3>
                        <p class="text-xs text-white/60 uppercase tracking-widest">${profile.role}</p>
                    </div>
                    <!-- Hint icon -->
                    <div class="absolute top-4 right-4 text-white/20">
                        <span class="material-symbols-outlined text-sm">touch_app</span>
                    </div>
                </div>
                <!-- Back -->
                <div class="absolute inset-0 backface-hidden rotate-y-180 bg-safety text-background p-8 rounded-xl flex flex-col justify-center items-center text-center">
                    <span class="material-symbols-outlined text-4xl mb-4">directions_bike</span>
                    <h3 class="text-xl font-display font-bold mb-2 uppercase">¿Por qué usa la bici?</h3>
                    <p class="text-sm font-medium leading-relaxed">${profile.reason}</p>
                    <span class="text-[10px] mt-6 opacity-40 uppercase font-bold tracking-tighter">Click para volver</span>
                </div>
            </div>
        </div>
    `).join('');
}

