// js/audio.js

let audioCtx;
export let isAudioInitialized = false;

// Audio Buffers
const buffers = {};

// Nodes
let streetSource, voidSource;
let streetGain, voidGain;
let streetFilter;

const FILES = {
    street: '/street_sound.ogg',
    void: '/void.ogg',
    pedal: '/pedal.ogg',
    honk: '/honk.ogg'
};

export async function initAudio() {
    if (isAudioInitialized) return;

    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        // Load all buffers
        const fetchPromises = Object.entries(FILES).map(async ([key, url]) => {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            buffers[key] = await audioCtx.decodeAudioData(arrayBuffer);
        });
        await Promise.all(fetchPromises);

        // Setup Street Loop
        streetSource = audioCtx.createBufferSource();
        streetSource.buffer = buffers['street'];
        streetSource.loop = true;
        streetGain = audioCtx.createGain();
        streetGain.gain.value = 0; // Starts at 0 (will be faded in on map)
        streetFilter = audioCtx.createBiquadFilter();
        streetFilter.type = 'lowpass';
        streetFilter.frequency.value = 20000;
        streetSource.connect(streetFilter);
        streetFilter.connect(streetGain);
        streetGain.connect(audioCtx.destination);
        streetSource.start(0);

        // Setup Void Loop
        voidSource = audioCtx.createBufferSource();
        voidSource.buffer = buffers['void'];
        voidSource.loop = true;
        voidGain = audioCtx.createGain();
        voidGain.gain.value = 0; // Starts muted
        voidSource.connect(voidGain);
        voidGain.connect(audioCtx.destination);
        voidSource.start(0);

        isAudioInitialized = true;
        console.log("Audio dinámico inicializado con nuevos sonidos.");
        
        // Initial state logic based on current page
        setPageContext(window._currentViewId || 'home');
    } catch (e) {
        console.error("Error inicializando audio:", e);
    }
}

let currentZoomLevel = 13;
let isMapActive = false;

function fadeAudioParam(audioParam, targetValue, duration) {
    if (!audioParam || !audioCtx) return;
    const now = audioCtx.currentTime;
    audioParam.cancelScheduledValues(now);
    // ensure we start from current value to prevent jumping
    audioParam.setValueAtTime(audioParam.value, now);
    audioParam.linearRampToValueAtTime(targetValue, now + duration);
}

function updateStreetVolume() {
    if (!isAudioInitialized || !audioCtx) return;
    if (!isMapActive) {
        fadeAudioParam(streetGain.gain, 0, 0.5);
        return;
    }

    let minZoom = 12;
    let maxZoom = 18;
    let clampedZoom = Math.max(minZoom, Math.min(currentZoomLevel, maxZoom));
    
    // Scale volume based on zoom (closer = louder)
    // New range: 0.02 to 0.25 (more subtle)
    let targetVol = 0.02 + ((clampedZoom - minZoom) / (maxZoom - minZoom)) * 0.23;
    
    fadeAudioParam(streetGain.gain, targetVol, 0.5);
}

export function setZoomVolume(zoom) {
    currentZoomLevel = zoom;
    updateStreetVolume();
}

/**
 * Fade audio sources based on the active page/section
 * @param {string} pageId - The ID of the page navigating to (e.g., 'map', 'memorial')
 */
export function setPageContext(pageId) {
    if (!isAudioInitialized || !audioCtx) return;

    if (pageId === 'map' || pageId === 'story') {
        isMapActive = true;
        fadeAudioParam(voidGain.gain, 0, 1.0); // Fade out void
        updateStreetVolume();
    } else if (pageId === 'memorial') {
        isMapActive = false;
        fadeAudioParam(streetGain.gain, 0, 1.0); // Fade out street
        fadeAudioParam(voidGain.gain, 0.15, 2.0); // Slow fade in void (quieter)
    } else {
        // Other pages (home, participate, etc): mute background loops
        isMapActive = false;
        fadeAudioParam(streetGain.gain, 0, 0.5);
        fadeAudioParam(voidGain.gain, 0, 0.5);
    }
}

export function muffleSound() {
    if (!isAudioInitialized || !audioCtx) return;
    fadeAudioParam(streetFilter.frequency, 400, 0.3);
}

export function unmuffleSound() {
    if (!isAudioInitialized || !audioCtx) return;
    fadeAudioParam(streetFilter.frequency, 20000, 0.3);
}

let lastPedalTime = 0;
export function playPedal() {
    // Only play if on the map
    if (!isAudioInitialized || !audioCtx || !isMapActive) return;
    
    const now = audioCtx.currentTime;
    // Throttle to max 1 pedal sound every 4 seconds to avoid fatigue
    if (now - lastPedalTime < 4.0) return;
    
    lastPedalTime = now;
    const source = audioCtx.createBufferSource();
    source.buffer = buffers['pedal'];
    
    // Randomize pitch slightly for variety
    source.playbackRate.value = 0.85 + Math.random() * 0.3; 
    
    const gain = audioCtx.createGain();
    gain.gain.value = 0.12; // Lower volume for pedal
    
    source.connect(gain);
    gain.connect(audioCtx.destination);
    source.start(0);
}

export function playHonk() {
    if (!isAudioInitialized || !audioCtx) return;
    const source = audioCtx.createBufferSource();
    source.buffer = buffers['honk'];
    const gain = audioCtx.createGain();
    gain.gain.value = 0.15; // Lower volume for bell/honk
    source.connect(gain);
    gain.connect(audioCtx.destination);
    source.start(0);
}

export function resumeAudio() {
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}
