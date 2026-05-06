import{initializeApp as e}from"https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";import{addDoc as t,collection as n,getFirestore as r,limit as i,onSnapshot as a,orderBy as o,query as s,serverTimestamp as c}from"https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";var l=Object.defineProperty,u=(e,t)=>{let n={};for(var r in e)l(n,r,{get:e[r],enumerable:!0});return t||l(n,Symbol.toStringTag,{value:`Module`}),n};(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})(),window.initScratchReveal=function(e,t){let n=document.getElementById(e);if(!n)return;let r=n.getContext(`2d`),i=n.parentElement,a=i.offsetWidth,o=i.offsetHeight;n.width=a,n.height=o,d(r,a,o);let s=!1,c=!1,l=Math.max(60,Math.min(a,o)*.15);function u(e,t){r.globalCompositeOperation=`destination-out`,r.beginPath(),r.arc(e,t,l,0,Math.PI*2),r.fill()}function p(e){let t=n.getBoundingClientRect(),r=e.touches?e.touches[0]:e;return{x:r.clientX-t.left,y:r.clientY-t.top}}n.addEventListener(`mousedown`,e=>{s=!0;let t=p(e);u(t.x,t.y)}),n.addEventListener(`mousemove`,e=>{if(s){let t=p(e);u(t.x,t.y),m()}}),n.addEventListener(`mouseup`,()=>{s=!1,m()}),n.addEventListener(`mouseleave`,()=>{s=!1}),n.addEventListener(`touchstart`,e=>{e.preventDefault(),s=!0;let t=p(e);u(t.x,t.y)},{passive:!1}),n.addEventListener(`touchmove`,e=>{if(e.preventDefault(),s){let t=p(e);u(t.x,t.y),m()}},{passive:!1}),n.addEventListener(`touchend`,()=>{s=!1,m()});function m(){c||f(r,a,o)>=55&&(c=!0,n.style.transition=`opacity 0.8s ease`,n.style.opacity=`0`,t&&t())}};function d(e,t,n){let r=e.createImageData(t,n),i=r.data;for(let e=0;e<i.length;e+=4){let t=Math.floor(Math.random()*30)+10;if(i[e]=t,i[e+1]=t,i[e+2]=t,i[e+3]=255,Math.random()<.003){let t=Math.random()<.5?[223,255,0]:[0,245,255];i[e]=t[0],i[e+1]=t[1],i[e+2]=t[2]}}for(let e=0;e<n;e+=3)for(let n=0;n<t;n++){let r=(e*t+n)*4;i[r]=Math.max(0,i[r]-8),i[r+1]=Math.max(0,i[r+1]-8),i[r+2]=Math.max(0,i[r+2]-8)}e.putImageData(r,0,0),e.fillStyle=`rgba(223, 255, 0, 0.15)`,e.font=`11px "JetBrains Mono", monospace`,e.textAlign=`center`,e.fillText(`[ RASCA PARA REVELAR ]`,t/2,n/2-8),e.fillText(`ARCHIVO CLASIFICADO`,t/2,n/2+12)}function f(e,t,n){let r=e.getImageData(0,0,t,n).data,i=0,a=t*n;for(let e=3;e<r.length;e+=32)r[e]===0&&i++;return i/(a/8)*100}document.addEventListener(`DOMContentLoaded`,()=>{console.log(`App Initialized`);try{window.initMainMap&&window.initMainMap()}catch(e){console.error(`Error initializing map:`,e)}window.initScratchReveal&&setTimeout(()=>{window.initScratchReveal(`hero-scratch-canvas`,()=>{let e=document.getElementById(`hero-scratch-container`);e&&(e.style.pointerEvents=`none`)})},300)});var p=[`section-hero`,`main-map-container`,`memorial-archive`,`story-viewer`,`participation-zone`];window.navigate=function(e){p.forEach(e=>{let t=document.getElementById(e);t&&t.classList.add(`hidden`)}),window.closeRelatoPreview&&window.closeRelatoPreview(),e===`home`?document.getElementById(`section-hero`).classList.remove(`hidden`):e===`map`?(document.getElementById(`main-map-container`).classList.remove(`hidden`),window.invalidateMapSize&&window.invalidateMapSize()):e===`memorial`?(document.getElementById(`memorial-archive`).classList.remove(`hidden`),typeof m==`function`&&m()):e===`participate`?(document.getElementById(`participation-zone`).classList.remove(`hidden`),window.initFormMap&&window.initFormMap()):e===`story`&&(document.getElementById(`main-map-container`).classList.remove(`hidden`),document.getElementById(`story-viewer`).classList.remove(`hidden`),window.invalidateMapSize&&window.invalidateMapSize())},window.toggleMobileMenu=function(){let e=document.getElementById(`mobile-menu`),t=document.getElementById(`hamburger-btn`);e.classList.contains(`hidden`)?(e.classList.remove(`hidden`),t.classList.add(`is-open`)):closeMobileMenu()},window.closeMobileMenu=function(){document.getElementById(`mobile-menu`).classList.add(`hidden`),document.getElementById(`hamburger-btn`).classList.remove(`is-open`)},window.showRelatoPreview=function(e){let t=(window._relatosCache||{})[e];if(!t)return;let n=document.getElementById(`relato-preview`),r=document.getElementById(`relato-preview-content`),i=(t.relato||``).split(`
`)[0].slice(0,200);r.innerHTML=`
        <span class="text-city text-xs tracking-widest uppercase block mb-2">${h(t.zona||`Medellín`)}</span>
        <h3 class="font-display text-2xl text-white mb-3 font-bold">${h(t.titulo)}</h3>
        <p class="text-white/60 text-sm leading-relaxed mb-6">${h(i)}…</p>
        <div class="flex items-center justify-between gap-4">
            <span class="text-white/30 text-xs">${t.fecha?new Date(t.fecha).toLocaleDateString(`es-CO`):``}</span>
            <button onclick="closeRelatoPreview(); openRelato('${e}')" class="bg-safety text-background font-display text-sm px-6 py-3 uppercase font-bold hover:bg-white transition-colors">
                Leer Relato →
            </button>
        </div>
    `,n.classList.remove(`hidden`),requestAnimationFrame(()=>{n.querySelector(`.relato-preview-card`).classList.add(`is-visible`)})},window.closeRelatoPreview=function(){let e=document.getElementById(`relato-preview`);if(e){let t=e.querySelector(`.relato-preview-card`);t&&t.classList.remove(`is-visible`),e.classList.add(`hidden`)}};function m(){let e=document.getElementById(`memorial-archive`),t=document.getElementById(`back-to-top`);!e||!t||e.addEventListener(`scroll`,()=>{let n=e.scrollTop>300;t.classList.toggle(`opacity-100`,n),t.classList.toggle(`pointer-events-auto`,n),t.classList.toggle(`translate-y-0`,n),t.classList.toggle(`opacity-0`,!n),t.classList.toggle(`pointer-events-none`,!n),t.classList.toggle(`translate-y-4`,!n)})}function h(e){return(e||``).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}var g=null,_=null,v=null,y=null,b=null,x=null,S=null,C=[],w=[],T=`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`,E=`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>`;window.initMainMap=function(){g||(g=L.map(`main-map-container`,{zoomControl:!1}).setView([6.2442,-75.5812],13),L.tileLayer(T,{attribution:E,subdomains:`abcd`,maxZoom:20}).addTo(g),L.control.zoom({position:`bottomright`}).addTo(g),b=L.layerGroup().addTo(g),x=L.layerGroup().addTo(g),L.heatLayer!==void 0&&(_=L.heatLayer([],{radius:35,blur:20,maxZoom:17,max:.6,gradient:{.2:`#FF003C`,.5:`#DFFF00`,1:`#00F5FF`}})),(C.length||w.length)&&D())},window.invalidateMapSize=function(){g&&setTimeout(()=>{g.invalidateSize(),D()},150)},window.updateReportes=function(e){C=e,D()},window.updateRelatos=function(e){w=e,D()};function D(){if(g&&(b&&(b.clearLayers(),C.forEach(e=>{let t=L.divIcon({className:`marker-reporte`,html:`<div class="pulse-dot pulse-dot--yellow"></div>`,iconSize:[14,14],iconAnchor:[7,7]}),n=L.marker([e.lat,e.lng],{icon:t});n.on(`click`,()=>{k(e)}),b.addLayer(n)})),x&&(x.clearLayers(),w.forEach(e=>{let t=L.divIcon({className:`marker-relato`,html:`<div class="pulse-dot pulse-dot--cyan"></div>`,iconSize:[18,18],iconAnchor:[9,9]}),n=L.marker([e.lat,e.lng],{icon:t});n.on(`click`,()=>{window.showRelatoPreview&&window.showRelatoPreview(e.id)}),x.addLayer(n)})),_)){let e=document.getElementById(`main-map-container`);if(e&&e.offsetWidth>0){let e=[...C.map(e=>[parseFloat(e.lat),parseFloat(e.lng),.6]),...w.map(e=>[parseFloat(e.lat),parseFloat(e.lng),1])];_.setLatLngs(e);let t=document.getElementById(`filter-heatmap`);t&&t.checked?g.hasLayer(_)||_.addTo(g):g.hasLayer(_)&&g.removeLayer(_)}}}var O=null;function k(e){O=e,j();let t=document.getElementById(`relato-preview`),n=document.getElementById(`relato-preview-content`);if(!t||!n)return;let r=e.fecha?new Date(e.fecha).toLocaleDateString(`es-CO`):``;n.innerHTML=`
        <span class="text-safety text-xs tracking-widest uppercase block mb-2">Reporte ciudadano</span>
        <h3 class="font-display text-xl text-white mb-2 font-bold">${P(e.titulo)}</h3>
        <p class="text-white/50 text-xs mb-3 font-mono">${e.lat.toFixed(4)}, ${e.lng.toFixed(4)} ${r?`• `+r:``}</p>
        <p class="text-white/70 text-sm leading-relaxed mb-4">${P(e.relato)}</p>
        <div class="flex items-center justify-end">
            <button onclick="closeRelatoPreview()" class="text-white/40 text-xs tracking-widest uppercase hover:text-white transition-colors">Cerrar</button>
        </div>
    `,S=L.polyline([[e.lat,e.lng],[e.lat,e.lng]],{color:`#DFFF00`,weight:1.5,opacity:.8,dashArray:`4, 6`,className:`connector-line`}).addTo(g),A(),g.on(`move zoom`,A),t.classList.remove(`hidden`),requestAnimationFrame(()=>{t.querySelector(`.relato-preview-card`).classList.add(`is-visible`)})}function A(){if(!S||!O||!g)return;let e=[O.lat,O.lng],t=g.getSize(),n=window.innerWidth>=768?L.point(t.x/2,t.y/2):L.point(t.x/2,t.y-120),r=g.containerPointToLatLng(n);S.setLatLngs([e,r])}function j(){g&&g.off(`move zoom`,A),S&&g&&(g.removeLayer(S),S=null),O=null}var M=window.showRelatoPreview;window.showRelatoPreview=function(e){typeof M==`function`&&M(e);let t=(window._relatosCache||{})[e];t&&t.lat&&t.lng&&(O=t,j(),S=L.polyline([[t.lat,t.lng],[t.lat,t.lng]],{color:`#00F5FF`,weight:1.5,opacity:.8,dashArray:`4, 6`,className:`connector-line`}).addTo(g),A(),g.on(`move zoom`,A))};var N=window.closeRelatoPreview;window.closeRelatoPreview=function(){j(),typeof N==`function`&&N()};function P(e){return(e||``).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}window.toggleMapLayer=function(e,t){g&&(e===`reportes`&&(t?g.addLayer(b):g.removeLayer(b)),e===`relatos`&&(t?g.addLayer(x):g.removeLayer(x)),e===`heatmap`&&_&&(t?g.addLayer(_):g.removeLayer(_)))},window.flyToLocation=function(e,t,n=16){g&&g.flyTo([e,t],n,{animate:!0,duration:2.5})},window.initFormMap=function(){if(v){setTimeout(()=>v.invalidateSize(),100);return}v=L.map(`form-map-container`).setView([6.2442,-75.5812],13),L.tileLayer(T,{attribution:E,subdomains:`abcd`,maxZoom:20}).addTo(v),v.on(`click`,function(e){let{lat:t,lng:n}=e.latlng;if(y)y.setLatLng(e.latlng);else{let t=L.divIcon({className:`custom-div-icon`,html:`<div style="background:#DFFF00;width:16px;height:16px;border-radius:50%;box-shadow:0 0 12px #DFFF00;"></div>`,iconSize:[16,16],iconAnchor:[8,8]});y=L.marker(e.latlng,{icon:t}).addTo(v)}document.getElementById(`form-lat`).value=t.toFixed(6),document.getElementById(`form-lng`).value=n.toFixed(6)}),setTimeout(()=>v.invalidateSize(),100)};var ee=`modulepreload`,F=function(e,t){return new URL(e,t).href},I={},R=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=F(t,n),t in I)return;I[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:ee,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},z=null,B=null,V=[{id:0,icon:`🕯️`,label:`Vela`},{id:1,icon:`🚲`,label:`Bicicleta`},{id:2,icon:`✦`,label:`Luz`}];window.openRelato=function(e){if(B&&=(B(),null),window.toggleMapLayer){window.toggleMapLayer(`heatmap`,!1);let e=document.getElementById(`filter-heatmap`);e&&(e.checked=!1)}navigate(`story`);let t=document.getElementById(`story-skeleton`),n=document.getElementById(`story-content`),r=document.getElementById(`story-header`),i=document.getElementById(`scrolly-text`),a=document.getElementById(`story-nav`);t&&t.classList.remove(`hidden`),n&&n.classList.add(`hidden`);let o=(window._relatosCache||{})[e];o?H(o,e,r,i,a,t,n):setTimeout(()=>{t&&(t.innerHTML=`
                <p class="text-red-400 text-sm mt-10">Error: Archivo no encontrado en caché.</p>
                <button onclick="closeRelato()" class="text-safety mt-4 text-sm">← Volver</button>
            `)},500)};function H(e,t,n,r,i,a,o){let s=t.slice(0,8).toUpperCase(),c=e.fecha?new Date(e.fecha).toLocaleDateString(`es-CO`,{year:`numeric`,month:`long`,day:`numeric`}):`Fecha desconocida`;n.innerHTML=`
        <div class="flex items-center gap-2 mb-4">
            <span class="inline-block w-2 h-2 rounded-full bg-safety animate-pulse"></span>
            <span class="text-safety text-xs tracking-[0.3em] uppercase">Archivo Activo</span>
        </div>
        <div class="bg-white/3 border border-white/10 rounded-lg p-4 font-mono text-xs space-y-1">
            <div class="flex justify-between">
                <span class="text-white/40">ID_ARCHIVO:</span>
                <span class="text-safety">CF-${s}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-white/40">COORDENADAS:</span>
                <span class="text-city">${e.lat.toFixed(6)}, ${e.lng.toFixed(6)}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-white/40">FECHA_REGISTRO:</span>
                <span class="text-white/70">${c}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-white/40">ZONA:</span>
                <span class="text-white/70">${Y(e.zona||`Sin clasificar`)}</span>
            </div>
        </div>
        <h1 class="font-display text-3xl md:text-4xl text-white mt-6 font-extrabold leading-tight">${Y(e.titulo)}</h1>
    `;let l=(e.relato||``).split(/\n\n+/).map(e=>e.trim()).filter(e=>e.length>0),u;if(l.length<=1){let t=(e.relato||``).match(/[^.!?]+[.!?]+/g)||[e.relato];u=[];for(let e=0;e<t.length;e+=3)u.push(t.slice(e,e+3).join(` `).trim())}else u=l;let d=[15,16,17,18,17,16,15,18],f=``;u.forEach((t,n)=>{let r=d[n%d.length],i=(Math.random()-.5)*.003,a=(Math.random()-.5)*.003;n===2&&(f+=U()),f+=`
            <div class="step min-h-[50vh] flex items-start pt-8"
                 data-lat="${(e.lat+i).toFixed(6)}"
                 data-lng="${(e.lng+a).toFixed(6)}"
                 data-zoom="${r}">
                <p class="text-base md:text-lg leading-relaxed text-white/85">${Y(t)}</p>
            </div>
        `}),u.length<3&&(f+=U()),f+=W(t),r.innerHTML=f,J(t,i),setTimeout(()=>{a&&a.classList.add(`hidden`),o&&o.classList.remove(`hidden`),window.flyToLocation&&window.flyToLocation(e.lat,e.lng,15),te(),window.initScratchReveal&&window.initScratchReveal(`scratch-canvas`,()=>{let e=document.getElementById(`scratch-revealed-msg`);e&&e.classList.remove(`hidden`)}),K(t);let n=document.getElementById(`story-panel`);n&&(n.scrollTop=0)},400)}function U(){return`
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
    `}function W(e){return`
        <div class="border-t border-white/10 mt-16 pt-10" id="ecos-section">
            <div class="flex items-center gap-3 mb-6">
                <span class="text-safety text-xs tracking-[0.3em] uppercase">Ecos</span>
                <span class="text-white/20 text-xs">— Muro anónimo de memoria</span>
            </div>

            <!-- Eco input -->
            <div class="bg-white/3 border border-white/10 rounded-lg p-4 mb-8">
                <div class="flex gap-3 mb-3">
                    ${V.map(e=>`<button type="button" class="eco-symbol-btn w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-lg hover:border-safety/50 hover:bg-white/5 transition-all" data-sid="${e.id}" title="${e.label}" onclick="selectEcoSymbol(this, ${e.id})">${e.icon}</button>`).join(``)}
                </div>
                <div class="flex gap-2">
                    <input type="text" id="eco-input" maxlength="140" placeholder="Deja un eco..." class="flex-1 bg-transparent border-b border-white/15 text-white text-sm py-2 px-1 focus:outline-none focus:border-safety/50 placeholder-white/20 font-mono transition-colors">
                    <button onclick="submitEco('${e}')" class="text-safety text-xs tracking-widest uppercase px-4 py-2 border border-safety/20 rounded hover:bg-safety/10 transition-colors whitespace-nowrap">
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
    `}var G=0;window.selectEcoSymbol=function(e,t){G=t,document.querySelectorAll(`.eco-symbol-btn`).forEach(e=>{e.classList.remove(`border-safety`,`bg-safety/10`),e.classList.add(`border-white/15`)}),e.classList.remove(`border-white/15`),e.classList.add(`border-safety`,`bg-safety/10`)},window.submitEco=async function(e){let t=document.getElementById(`eco-input`);if(!t||!t.value.trim())return;let n=t.value.trim();t.value=``,t.placeholder=`Enviando...`;try{let{addEco:r}=await R(async()=>{let{addEco:e}=await Promise.resolve().then(()=>X);return{addEco:e}},void 0,import.meta.url);await r(e,n,G),t.placeholder=`Deja un eco...`}catch(e){console.error(`Error sending eco:`,e),t.placeholder=`Error al enviar`,setTimeout(()=>{t.placeholder=`Deja un eco...`},2e3)}};async function K(e){B&&=(B(),null);try{let{listenEcos:t}=await R(async()=>{let{listenEcos:e}=await Promise.resolve().then(()=>X);return{listenEcos:e}},void 0,import.meta.url);B=t(e,e=>{q(e)})}catch(e){console.error(`Error loading ecos:`,e)}}function q(e){let t=document.getElementById(`ecos-list`);if(t){if(e.length===0){t.innerHTML=`<p class="text-white/15 text-xs font-mono">Aún no hay ecos. Sé el primero en dejar uno.</p>`;return}t.innerHTML=e.map((e,t)=>{let n=V.find(t=>t.id===e.simbolo_id)||V[0],r=e.timestamp?.toDate?e.timestamp.toDate().toLocaleDateString(`es-CO`,{month:`short`,day:`numeric`}):``;return`
            <div class="eco-item flex items-start gap-3 py-2 border-b border-white/5" style="animation: eco-fade-in 0.5s ease ${t*.08}s backwards;">
                <span class="text-lg mt-0.5 opacity-60">${n.icon}</span>
                <div class="flex-1 min-w-0">
                    <p class="text-white/70 text-sm font-mono leading-relaxed">${Y(e.mensaje)}</p>
                    ${r?`<span class="text-white/15 text-[10px]">${r}</span>`:``}
                </div>
            </div>
        `}).join(``)}}function J(e,t){if(!t)return;let n=window._relatosList||[],r=n.findIndex(t=>t.id===e);if(r===-1||n.length<=1){t.innerHTML=``;return}let i=r>0?n[r-1]:null,a=r<n.length-1?n[r+1]:null;t.innerHTML=`
        ${i?`
            <button onclick="openRelato('${i.id}')" class="flex-1 text-left bg-white/5 border border-white/10 hover:border-safety/30 rounded-lg p-4 transition-colors group">
                <span class="text-[10px] text-white/30 tracking-widest uppercase block mb-1">← Anterior</span>
                <span class="text-sm font-display font-bold group-hover:text-safety transition-colors">${Y(i.titulo)}</span>
            </button>
        `:`<div class="flex-1"></div>`}
        ${a?`
            <button onclick="openRelato('${a.id}')" class="flex-1 text-right bg-white/5 border border-white/10 hover:border-city/30 rounded-lg p-4 transition-colors group">
                <span class="text-[10px] text-white/30 tracking-widest uppercase block mb-1">Siguiente →</span>
                <span class="text-sm font-display font-bold group-hover:text-city transition-colors">${Y(a.titulo)}</span>
            </button>
        `:`<div class="flex-1"></div>`}
    `}function te(){let e=document.querySelectorAll(`#scrolly-text .step`);if(e.length===0)return;z&&z.disconnect();let t={root:document.getElementById(`story-panel`),rootMargin:`0px 0px -30% 0px`,threshold:.4};z=new IntersectionObserver(t=>{t.forEach(t=>{if(t.isIntersecting){e.forEach(e=>e.classList.remove(`is-active`)),t.target.classList.add(`is-active`);let n=parseFloat(t.target.dataset.lat),r=parseFloat(t.target.dataset.lng),i=parseInt(t.target.dataset.zoom)||16;!isNaN(n)&&!isNaN(r)&&window.flyToLocation&&window.flyToLocation(n,r,i)}})},t),e.forEach(e=>z.observe(e))}window.closeRelato=function(){z&&z.disconnect(),B&&=(B(),null),window.flyToLocation&&window.flyToLocation(6.2442,-75.5812,13),navigate(`memorial`)};function Y(e){return(e||``).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}var X=u({addDoc:()=>t,addEco:()=>re,collection:()=>n,db:()=>Q,listenEcos:()=>ie,onSnapshot:()=>a,orderBy:()=>o,query:()=>s,serverTimestamp:()=>c}),ne={apiKey:`AIzaSyDQjCjijV1TTgnBS3GHX56eTEAQqweYk0U`,authDomain:`ciclistas-fantasmas-cf99.firebaseapp.com`,projectId:`ciclistas-fantasmas-cf99`,storageBucket:`ciclistas-fantasmas-cf99.firebasestorage.app`,messagingSenderId:`21053803698`,appId:`1:21053803698:web:a358fb0fd520025a4f4dab`},Z,Q;try{Z=e(ne),Q=r(Z),console.log(`Firebase initialized`)}catch{console.warn(`Firebase no está configurado aún o las credenciales son incorrectas.`)}async function re(e,r,i){return Q?t(n(Q,`incidentes`,e,`ecos`),{mensaje:r.slice(0,140),simbolo_id:i,timestamp:c()}):null}function ie(e,t){return Q?a(s(n(Q,`incidentes`,e,`ecos`),o(`timestamp`,`desc`),i(50)),e=>{let n=[];e.forEach(e=>{n.push({id:e.id,...e.data()})}),t(n)}):()=>{}}window._relatosCache={},window._relatosList=[],document.addEventListener(`DOMContentLoaded`,()=>{let e=document.getElementById(`incident-form`);e&&e.addEventListener(`submit`,async r=>{r.preventDefault();let i=document.getElementById(`form-title`).value,a=document.getElementById(`form-story`).value,o=document.getElementById(`form-lat`).value,s=document.getElementById(`form-lng`).value,c=document.getElementById(`form-feedback`);if(!o||!s){c.textContent=`Por favor, selecciona un punto en el mapa primero.`,c.classList.remove(`hidden`);return}if(!Q){c.textContent=`Error: Firebase no está configurado.`,c.classList.remove(`hidden`);return}try{c.textContent=`Guardando reporte…`,c.classList.remove(`hidden`),await t(n(Q,`incidentes`),{titulo:i,relato:a.slice(0,450*5),coordenadas:{lat:parseFloat(o),lng:parseFloat(s)},fecha:new Date,tipo:`reporte`,zona:``,imagen_url:``}),c.textContent=`¡Reporte enviado exitosamente de forma anónima!`,e.reset(),document.getElementById(`form-lat`).value=``,document.getElementById(`form-lng`).value=``}catch(e){console.error(`Error adding document: `,e),c.textContent=`Error al guardar el reporte.`}}),Q&&a(n(Q,`incidentes`),e=>{let t=[],n=[],r=[],i=new Set;e.forEach(e=>{let a=e.data();if(!a.coordenadas)return;let o=parseFloat(a.coordenadas.lat),s=parseFloat(a.coordenadas.lng);if(isNaN(o)||isNaN(s))return;let c={id:e.id,lat:o,lng:s,titulo:a.titulo||`Sin título`,relato:a.relato||``,zona:a.zona||``,fecha:a.fecha?.toDate?a.fecha.toDate().toISOString():a.fecha||null};a.tipo===`relato`?(n.push(c),r.push(c),c.zona&&i.add(c.zona),window._relatosCache[e.id]=c):t.push(c)}),r.sort((e,t)=>e.titulo.localeCompare(t.titulo)),window._relatosList=r,console.log(`Firebase → ${t.length} reportes, ${n.length} relatos`),window.updateReportes&&window.updateReportes(t),window.updateRelatos&&window.updateRelatos(n),ae(r,i)})});function ae(e,t){let n=document.getElementById(`memorial-grid`),r=document.getElementById(`memorial-loading-text`),i=document.getElementById(`memorial-zones`);if(!n)return;if(n.querySelectorAll(`.memorial-skeleton`).forEach(e=>e.remove()),r&&r.classList.add(`hidden`),i&&(i.innerHTML=`<button class="zone-chip is-active" onclick="setZoneFilter(null, this)">Todas</button>`+Array.from(t).sort().map(e=>`<button class="zone-chip" onclick="setZoneFilter('${e}', this)">${e}</button>`).join(``)),e.length===0){n.innerHTML=`<p class="text-white/30 col-span-full text-center py-12">No hay relatos en el archivo.</p>`;return}let a=[`#DFFF00`,`#00F5FF`,`#FF003C`,`#FF6B35`,`#C77DFF`];n.innerHTML=e.map((e,t)=>{let n=(e.relato||``).split(`
`)[0].slice(0,120),r=e.fecha?new Date(e.fecha).toLocaleDateString(`es-CO`,{year:`numeric`,month:`short`}):``,i=a[t%a.length],o=e.id.slice(0,8).toUpperCase();return`
            <article class="memorial-card group cursor-pointer" 
                     data-titulo="${$(e.titulo)}" 
                     data-zona="${$(e.zona)}" 
                     data-relato="${$(n)}"
                     onclick="openRelato('${e.id}')">
                <div class="relative h-48 overflow-hidden bg-white/5 rounded-t-lg">
                    <div class="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/80"></div>
                    <div class="absolute inset-0 grain-overlay"></div>
                    <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
                    <!-- Accent line -->
                    <div class="absolute top-0 left-0 w-full h-1 transition-all duration-500 group-hover:h-2" style="background:${i};box-shadow:0 0 12px ${i}"></div>
                    <!-- File ID -->
                    <span class="absolute top-3 right-3 text-[10px] tracking-widest text-white/30 font-mono">CF-${o}</span>
                    <!-- Coords -->
                    <span class="absolute bottom-3 left-3 text-[10px] tracking-widest text-white/40 font-mono">${e.lat.toFixed(4)}, ${e.lng.toFixed(4)}</span>
                </div>
                <div class="p-4 border border-t-0 border-white/10 rounded-b-lg group-hover:border-white/20 transition-colors bg-background">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[10px] tracking-widest uppercase" style="color:${i}">${$(e.zona)||`Medellín`}</span>
                        <span class="text-[10px] text-white/30">${r}</span>
                    </div>
                    <h3 class="font-display text-lg font-bold mb-2 group-hover:text-safety transition-colors leading-tight">${$(e.titulo)}</h3>
                    <p class="text-white/40 text-xs leading-relaxed line-clamp-2">${$(n)}…</p>
                </div>
            </article>
        `}).join(``)}function $(e){return(e||``).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}