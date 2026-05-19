// js/interaction-effects.js
// ──────────────────────────────────────────────
// Scratch-to-Reveal canvas effect
// Covers an image with digital static noise.
// User "scratches" to reveal the image beneath.
// ──────────────────────────────────────────────

import { muffleSound, unmuffleSound } from './audio.js';

window.initScratchReveal = function (canvasId, onRevealed) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;

    // Match canvas to parent size
    const w = parent.offsetWidth;
    const h = parent.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    // Draw digital static noise
    _drawNoise(ctx, w, h);

    // Track state
    let isDrawing = false;
    let revealed = false;
    const brushRadius = Math.max(60, Math.min(w, h) * 0.15);

    // ── Erase on mouse/touch ──
    function erase(x, y) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches ? e.touches[0] : e;
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    }

    // Mouse events
    canvas.addEventListener('mousedown', (e) => { isDrawing = true; muffleSound(); const p = getPos(e); erase(p.x, p.y); });
    canvas.addEventListener('mousemove', (e) => { if (isDrawing) { const p = getPos(e); erase(p.x, p.y); _checkReveal(); } });
    canvas.addEventListener('mouseup', () => { isDrawing = false; unmuffleSound(); _checkReveal(); });
    canvas.addEventListener('mouseleave', () => { if (isDrawing) { isDrawing = false; unmuffleSound(); } });

    // Touch events (mobile)
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); isDrawing = true; muffleSound(); const p = getPos(e); erase(p.x, p.y); }, { passive: false });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); if (isDrawing) { const p = getPos(e); erase(p.x, p.y); _checkReveal(); } }, { passive: false });
    canvas.addEventListener('touchend', () => { isDrawing = false; unmuffleSound(); _checkReveal(); });

    function _checkReveal() {
        if (revealed) return;
        const pct = _getTransparentPercent(ctx, w, h);
        if (pct >= 55) {
            revealed = true;
            canvas.style.transition = 'opacity 0.8s ease';
            canvas.style.opacity = '0';
            if (onRevealed) onRevealed();
        }
    }
};

// ─── Draw noise pattern ─────────────────────
function _drawNoise(ctx, w, h) {
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        // Grayscale noise between #0A0A0A and #2A2A2A
        const v = Math.floor(Math.random() * 30) + 10;
        data[i]     = v;     // R
        data[i + 1] = v;     // G
        data[i + 2] = v;     // B
        data[i + 3] = 255;   // A

        // Occasional bright pixel (scan line effect)
        if (Math.random() < 0.003) {
            const neon = Math.random() < 0.5 ? [223, 255, 0] : [0, 245, 255];
            data[i]     = neon[0];
            data[i + 1] = neon[1];
            data[i + 2] = neon[2];
        }
    }

    // Horizontal scan lines
    for (let y = 0; y < h; y += 3) {
        for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            data[idx]     = Math.max(0, data[idx] - 8);
            data[idx + 1] = Math.max(0, data[idx + 1] - 8);
            data[idx + 2] = Math.max(0, data[idx + 2] - 8);
        }
    }

    ctx.putImageData(imageData, 0, 0);

    // Add text overlay
    ctx.fillStyle = 'rgba(223, 255, 0, 0.15)';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('[ RASCA PARA REVELAR ]', w / 2, h / 2 - 8);
    ctx.fillText('ARCHIVO CLASIFICADO', w / 2, h / 2 + 12);
}

// ─── Calculate transparent percentage ───────
function _getTransparentPercent(ctx, w, h) {
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    let transparent = 0;
    const total = w * h;

    // Sample every 8th pixel for performance
    for (let i = 3; i < data.length; i += 32) {
        if (data[i] === 0) transparent++;
    }

    return (transparent / (total / 8)) * 100;
}
