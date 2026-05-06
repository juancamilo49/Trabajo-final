import{initializeApp as e}from"https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";import{addDoc as t,collection as n,getFirestore as r,limit as i,onSnapshot as a,orderBy as o,query as s,serverTimestamp as c}from"https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";var l=Object.defineProperty,u=(e,t)=>{let n={};for(var r in e)l(n,r,{get:e[r],enumerable:!0});return t||l(n,Symbol.toStringTag,{value:`Module`}),n};(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})(),window.initScratchReveal=function(e,t){let n=document.getElementById(e);if(!n)return;let r=n.getContext(`2d`),i=n.parentElement,a=i.offsetWidth,o=i.offsetHeight;n.width=a,n.height=o,d(r,a,o);let s=!1,c=!1,l=Math.max(60,Math.min(a,o)*.15);function u(e,t){r.globalCompositeOperation=`destination-out`,r.beginPath(),r.arc(e,t,l,0,Math.PI*2),r.fill()}function p(e){let t=n.getBoundingClientRect(),r=e.touches?e.touches[0]:e;return{x:r.clientX-t.left,y:r.clientY-t.top}}n.addEventListener(`mousedown`,e=>{s=!0;let t=p(e);u(t.x,t.y)}),n.addEventListener(`mousemove`,e=>{if(s){let t=p(e);u(t.x,t.y),m()}}),n.addEventListener(`mouseup`,()=>{s=!1,m()}),n.addEventListener(`mouseleave`,()=>{s=!1}),n.addEventListener(`touchstart`,e=>{e.preventDefault(),s=!0;let t=p(e);u(t.x,t.y)},{passive:!1}),n.addEventListener(`touchmove`,e=>{if(e.preventDefault(),s){let t=p(e);u(t.x,t.y),m()}},{passive:!1}),n.addEventListener(`touchend`,()=>{s=!1,m()});function m(){c||f(r,a,o)>=55&&(c=!0,n.style.transition=`opacity 0.8s ease`,n.style.opacity=`0`,t&&t())}};function d(e,t,n){let r=e.createImageData(t,n),i=r.data;for(let e=0;e<i.length;e+=4){let t=Math.floor(Math.random()*30)+10;if(i[e]=t,i[e+1]=t,i[e+2]=t,i[e+3]=255,Math.random()<.003){let t=Math.random()<.5?[223,255,0]:[0,245,255];i[e]=t[0],i[e+1]=t[1],i[e+2]=t[2]}}for(let e=0;e<n;e+=3)for(let n=0;n<t;n++){let r=(e*t+n)*4;i[r]=Math.max(0,i[r]-8),i[r+1]=Math.max(0,i[r+1]-8),i[r+2]=Math.max(0,i[r+2]-8)}e.putImageData(r,0,0),e.fillStyle=`rgba(223, 255, 0, 0.15)`,e.font=`11px "JetBrains Mono", monospace`,e.textAlign=`center`,e.fillText(`[ RASCA PARA REVELAR ]`,t/2,n/2-8),e.fillText(`ARCHIVO CLASIFICADO`,t/2,n/2+12)}function f(e,t,n){let r=e.getImageData(0,0,t,n).data,i=0,a=t*n;for(let e=3;e<r.length;e+=32)r[e]===0&&i++;return i/(a/8)*100}document.addEventListener(`DOMContentLoaded`,()=>{console.log(`App Initialized`),window._currentViewId=`home`,console.log(`App Version: 2026-05-06-12:20`);try{window.initMainMap&&window.initMainMap()}catch(e){console.error(`Error initializing map:`,e)}window.initScratchReveal&&setTimeout(()=>{window.initScratchReveal(`hero-scratch-canvas`,()=>{let e=document.getElementById(`hero-scratch-container`);e&&(e.style.pointerEvents=`none`)})},300);let e=0,t=document.getElementById(`nav-main`),n=n=>{let r=n.scrollTop;window.innerWidth<768&&(r>e&&r>100?t.classList.add(`nav-hidden`):t.classList.remove(`nav-hidden`)),e=r};[`relatos-section`,`memorial-section`,`who-we-are-section`].forEach(e=>{let t=document.getElementById(e);t&&t.addEventListener(`scroll`,()=>n(t))}),setTimeout(()=>{[`map-filters`,`stats-panel`,`filters-content`].forEach(e=>{let t=document.getElementById(e);t&&g(t)})},500)});var p=[`section-hero`,`main-map-container`,`relatos-section`,`memorial-section`,`who-we-are-section`,`story-viewer`,`participation-zone`];window.navigate=function(e){let t=window._currentViewId;e===`story`?window._previousViewId=t||`memorial`:window._currentViewId=e,p.forEach(e=>{let t=document.getElementById(e);t&&t.classList.add(`hidden`)}),window.closeRelatoPreview&&window.closeRelatoPreview(),e===`home`?document.getElementById(`section-hero`).classList.remove(`hidden`):e===`map`?(document.getElementById(`main-map-container`).classList.remove(`hidden`),window.invalidateMapSize&&window.invalidateMapSize(),window.globalMap&&t!==`story`&&window.globalMap.setView([6.2442,-75.5812],13),window.updateRelatos&&window._relatosList&&window.updateRelatos(window._relatosList)):e===`relatos`?(document.getElementById(`relatos-section`).classList.remove(`hidden`),typeof m==`function`&&m(),window.refreshRelatosCards&&window.refreshRelatosCards()):e===`memorial`?(document.getElementById(`memorial-section`).classList.remove(`hidden`),window.loadVictimsData&&window.loadVictimsData(),m(`memorial-section`)):e===`who-we-are`?(document.getElementById(`who-we-are-section`).classList.remove(`hidden`),window.renderWhoWeAre&&window.renderWhoWeAre(),m(`who-we-are-section`)):e===`participate`?(document.getElementById(`participation-zone`).classList.remove(`hidden`),window.initFormMap&&window.initFormMap()):e===`story`&&(document.getElementById(`main-map-container`).classList.remove(`hidden`),document.getElementById(`story-viewer`).classList.remove(`hidden`),window.invalidateMapSize&&window.invalidateMapSize())},window.toggleMobileMenu=function(){let e=document.getElementById(`mobile-menu`),t=document.getElementById(`hamburger-btn`);e.classList.contains(`hidden`)?(e.classList.remove(`hidden`),t.classList.add(`is-open`)):closeMobileMenu()},window.closeMobileMenu=function(){document.getElementById(`mobile-menu`).classList.add(`hidden`),document.getElementById(`hamburger-btn`).classList.remove(`is-open`)},window.showRelatoPreview=function(e){let t=(window._relatosCache||{})[e];if(!t)return;let n=document.getElementById(`relato-preview`),r=document.getElementById(`relato-preview-content`),i=(t.relato||``).split(`
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
    `,n.classList.remove(`hidden`),requestAnimationFrame(()=>{n.querySelector(`.relato-preview-card`).classList.add(`is-visible`)})},window.closeRelatoPreview=function(){let e=document.getElementById(`relato-preview`);if(e){let t=e.querySelector(`.relato-preview-card`);t&&t.classList.remove(`is-visible`),setTimeout(()=>{(!t||!t.classList.contains(`is-visible`))&&e.classList.add(`hidden`)},400)}},window.scrollToTopActiveSection=function(){let e=document.querySelector(`.view-section:not(.hidden)`);e&&e.scrollTo({top:0,behavior:`smooth`})};function m(e){let t=document.getElementById(e),n=document.getElementById(`back-to-top-btn`);!t||!n||t.addEventListener(`scroll`,()=>{let e=t.scrollTop>400;n.classList.toggle(`is-visible`,e)})}window._activeRelatosZone=null,window.filterRelatos=function(){let e=(document.getElementById(`relatos-search`)?.value||``).toLowerCase(),t=document.getElementById(`filter-read`)?.checked??!0,n=document.getElementById(`filter-unread`)?.checked??!0,r=document.querySelectorAll(`#relatos-grid .memorial-card`),i=0;r.forEach(r=>{let a=(r.dataset.titulo||``).toLowerCase(),o=(r.dataset.zona||``).toLowerCase(),s=(r.dataset.relato||``).toLowerCase(),c=r.dataset.read===`true`,l=!e||a.includes(e)||s.includes(e),u=!window._activeRelatosZone||o===window._activeRelatosZone.toLowerCase(),d=!1;c&&t&&(d=!0),!c&&n&&(d=!0),l&&u&&d?(r.classList.remove(`hidden`),i++):r.classList.add(`hidden`)});let a=document.getElementById(`relatos-empty`);a&&a.classList.toggle(`hidden`,i>0)},window.setRelatosZoneFilter=function(e,t){window._activeRelatosZone===e?(window._activeRelatosZone=null,document.querySelectorAll(`#relatos-section .zone-chip`).forEach(e=>e.classList.remove(`is-active`))):(window._activeRelatosZone=e,document.querySelectorAll(`#relatos-section .zone-chip`).forEach(e=>e.classList.remove(`is-active`)),t&&t.classList.add(`is-active`)),window.filterRelatos()};function h(e){return(e||``).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}window.toggleMapFilters=function(){let e=document.getElementById(`filters-content`),t=document.getElementById(`filters-chevron`);if(e){let n=e.classList.toggle(`hidden`);n||g(e),t&&(t.style.transform=n?`rotate(0deg)`:`rotate(180deg)`)}},window.toggleStats=function(){let e=document.getElementById(`stats-panel`),t=document.getElementById(`stats-chevron`);if(e){let n=e.classList.toggle(`hidden`);n||g(e),t&&(t.style.transform=n?`rotate(0deg)`:`rotate(180deg)`)}};function g(e){typeof L>`u`||(L.DomEvent.disableScrollPropagation(e),L.DomEvent.disableClickPropagation(e),[`touchstart`,`touchmove`,`touchend`,`pointerdown`,`pointermove`,`pointerup`].forEach(t=>{e.addEventListener(t,e=>{e.stopPropagation()},{passive:!1})}))}window.updateComunaStats=function(e){let t=document.getElementById(`comunas-stats-list`);if(t){if(Object.keys(e).length===0){t.innerHTML=`<span class="text-[10px] text-white/40 italic">No hay relatos registrados</span>`;return}t.innerHTML=Object.entries(e).sort((e,t)=>t[1]-e[1]).map(([e,t])=>`
        <div class="flex items-center justify-between text-[11px] group">
            <span class="text-white/70 group-hover:text-city transition-colors truncate max-w-[120px]">${e}</span>
            <span class="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-city font-mono">${t}</span>
        </div>
    `).join(``)}};var _=null,v=null,y,b,x,S,C=null,w=null,T=null;window.flyToLocation=function(e,t,n=15){_&&_.flyTo([e,t],n,{duration:1.5,easeLinearity:.25})};var E=null,D=null,O=null,k=[],A=[],ee=`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`,j=`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>`;window.initMainMap=function(){_||(_=L.map(`main-map-container`,{zoomControl:!1}).setView([6.2442,-75.5812],13),L.tileLayer(ee,{attribution:j,subdomains:`abcd`,maxZoom:20}).addTo(_),L.control.zoom({position:`bottomright`}).addTo(_),E=L.layerGroup().addTo(_),D=L.layerGroup().addTo(_),L.heatLayer!==void 0&&(v=L.heatLayer([],{radius:25,blur:15,maxZoom:18,max:.6,gradient:{.2:`#FF003C`,.5:`#DFFF00`,1:`#00F5FF`}})),_.on(`zoomend`,()=>{if(v&&_.hasLayer(v)){let e=_.getZoom(),t=25,n=15;e>=16?(t=45,n=25):e>=14?(t=35,n=20):e<=11&&(t=15,n=10),v.setOptions({radius:t,blur:n})}}),(k.length||A.length)&&M(),window.loadComunas())},window.invalidateMapSize=function(){_&&setTimeout(()=>{_.invalidateSize(),M()},150)},window.updateReportes=function(e){k=e,M()},window.updateRelatos=function(e){A=e,M()};function M(){if(_){if(E&&(E.clearLayers(),k.forEach(e=>{let t=L.divIcon({className:`marker-reporte`,html:`<div class="pulse-dot pulse-dot--yellow"></div>`,iconSize:[14,14],iconAnchor:[7,7]}),n=L.marker([e.lat,e.lng],{icon:t});n.on(`click`,()=>te(e)),E.addLayer(n)})),D){D.clearLayers();let e=JSON.parse(localStorage.getItem(`readRelatos`)||`[]`);A.forEach(t=>{let n=e.includes(t.id),r=L.divIcon({className:`marker-relato`,html:`
                    <div class="pulse-dot pulse-dot--cyan ${n?`is-read`:``}">
                        ${n?`<span class="read-check">✔</span>`:``}
                    </div>
                `,iconSize:[18,18],iconAnchor:[9,9]}),i=L.marker([t.lat,t.lng],{icon:r});i.on(`click`,()=>{window.showRelatoPreview&&window.showRelatoPreview(t.id)}),D.addLayer(i)})}if(v){let e=[...k.map(e=>[parseFloat(e.lat),parseFloat(e.lng),.6]),...A.map(e=>[parseFloat(e.lat),parseFloat(e.lng),1])];v.setLatLngs(e);let t=document.getElementById(`filter-heatmap`);t&&t.checked?_.hasLayer(v)||v.addTo(_):_.hasLayer(v)&&_.removeLayer(v)}N()}}function N(){if(!C)return;let e={};k.forEach(t=>{let n=window.getComunaForCoords(t.lat,t.lng);n&&n!==`Desconocida`&&(e[n]=(e[n]||0)+1)}),A.forEach(t=>{let n=window.getComunaForCoords(t.lat,t.lng);n&&n!==`Desconocida`&&(e[n]=(e[n]||0)+1)}),window.updateComunaStats&&window.updateComunaStats(e)}var P=null;function te(e){P=e,I();let t=document.getElementById(`relato-preview`),n=document.getElementById(`relato-preview-content`);if(!t||!n)return;let r=e.fecha?new Date(e.fecha).toLocaleDateString(`es-CO`):``;n.innerHTML=`
        <span class="text-safety text-xs tracking-widest uppercase block mb-2">Reporte ciudadano</span>
        <h3 class="font-display text-xl text-white mb-2 font-bold">${B(e.titulo)}</h3>
        <p class="text-white/50 text-xs mb-3 font-mono">${e.lat.toFixed(4)}, ${e.lng.toFixed(4)} ${r?`• `+r:``}</p>
        <p class="text-white/70 text-sm leading-relaxed mb-4">${B(e.relato)}</p>
        <div class="flex items-center justify-end">
            <button onclick="closeRelatoPreview()" class="text-white/40 text-xs tracking-widest uppercase hover:text-white transition-colors">Cerrar</button>
        </div>
    `,O=L.polyline([[e.lat,e.lng],[e.lat,e.lng]],{color:`#DFFF00`,weight:1.5,opacity:.8,dashArray:`4, 6`,className:`connector-line`}).addTo(_),F(),_.on(`move zoom`,F),t.classList.remove(`hidden`),requestAnimationFrame(()=>t.querySelector(`.relato-preview-card`).classList.add(`is-visible`))}function ne(e){P=e,I();let t=document.getElementById(`relato-preview`),n=document.getElementById(`relato-preview-content`);!t||!n||(n.innerHTML=`
        <span class="text-[#2ECC71] text-xs tracking-widest uppercase block mb-2">Estación EnCicla</span>
        <h3 class="font-display text-xl text-white mb-2 font-bold">${B(e.name)}</h3>
        <p class="text-white/50 text-xs mb-3 font-mono">${e.lat.toFixed(4)}, ${e.lng.toFixed(4)} • ${e.Num_Puestos||0} puestos</p>
        <p class="text-white/70 text-sm leading-relaxed mb-4">${B(e.descripcion_web||e.Direccion||``)}</p>
        <div class="flex items-center justify-end">
            <button onclick="closeRelatoPreview()" class="text-white/40 text-xs tracking-widest uppercase hover:text-white transition-colors">Cerrar</button>
        </div>
    `,O=L.polyline([[e.lat,e.lng],[e.lat,e.lng]],{color:`#2ECC71`,weight:1.5,opacity:.8,dashArray:`4, 6`,className:`connector-line`}).addTo(_),F(),_.on(`move zoom`,F),t.classList.remove(`hidden`),requestAnimationFrame(()=>t.querySelector(`.relato-preview-card`).classList.add(`is-visible`)))}function re(e){P=e,I();let t=document.getElementById(`relato-preview`),n=document.getElementById(`relato-preview-content`);if(!t||!n)return;let r=e.Fecha_Ocurrencia||e.FECHA||e.fecha||`N/A`,i=e.Edad||e.EDAD||`N/A`,a=e.Interaccion||e.INTERACCION||`N/A`,o=e.Lugar_Ocurrencia||e.DIRECCION||`N/A`;n.innerHTML=`
        <span class="text-[#FF003C] text-xs tracking-widest uppercase block mb-2 font-bold">Memorial Ciclista ${e.year||``}</span>
        <h3 class="font-display text-2xl text-white mb-2 font-bold uppercase tracking-tight">En memoria de quien pedaleaba</h3>
        <p class="text-white/50 text-xs mb-4 font-mono uppercase">${B(o)}</p>
        <div class="grid grid-cols-2 gap-4 mb-6 bg-white/5 p-4 rounded-lg border border-[#FF003C]/20">
            <div>
                <span class="text-[10px] text-white/30 uppercase block">Fecha</span>
                <span class="text-sm text-white/90">${r}</span>
            </div>
            <div>
                <span class="text-[10px] text-white/30 uppercase block">Edad</span>
                <span class="text-sm text-white/90">${i} años</span>
            </div>
            <div class="col-span-2">
                <span class="text-[10px] text-white/30 uppercase block">Interacción</span>
                <span class="text-sm text-white/90 font-bold text-[#FF003C]">${a}</span>
            </div>
        </div>
        <p class="text-white/40 text-xs italic mb-4">"No es una cifra, es una vida. Por calles seguras para todos."</p>
        <div class="flex items-center justify-end">
            <button onclick="closeRelatoPreview()" class="text-white/40 text-xs tracking-widest uppercase hover:text-white transition-colors">Cerrar Memorial</button>
        </div>
    `,O=L.polyline([[e.lat,e.lng],[e.lat,e.lng]],{color:`#FF003C`,weight:1.5,opacity:.8,dashArray:`4, 6`,className:`connector-line`}).addTo(_),F(),_.on(`move zoom`,F),t.classList.remove(`hidden`),requestAnimationFrame(()=>t.querySelector(`.relato-preview-card`).classList.add(`is-visible`))}function F(){if(!O||!P||!_)return;let e=[P.lat,P.lng],t=_.getSize(),n=window.innerWidth>=768?L.point(t.x/2,t.y/2):L.point(t.x/2,t.y-120),r=_.containerPointToLatLng(n);O.setLatLngs([e,r])}function I(){_&&_.off(`move zoom`,F),O&&_&&(_.removeLayer(O),O=null),P=null}var R=window.showRelatoPreview;window.showRelatoPreview=function(e){typeof R==`function`&&R(e);let t=(window._relatosCache||{})[e];t&&t.lat&&t.lng&&(P=t,I(),O=L.polyline([[t.lat,t.lng],[t.lat,t.lng]],{color:`#00F5FF`,weight:1.5,opacity:.8,dashArray:`4, 6`,className:`connector-line`}).addTo(_),F(),_.on(`move zoom`,F))};var z=window.closeRelatoPreview;window.closeRelatoPreview=function(){I(),typeof z==`function`&&z()};function B(e){return(e||``).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}function ie(e,t){if(!t||!t[0])return!1;let n=t[0],r=e[0],i=e[1],a=!1;for(let e=0,t=n.length-1;e<n.length;t=e++){let o=n[e][0],s=n[e][1],c=n[t][0],l=n[t][1];s>i!=l>i&&r<(c-o)*(i-s)/(l-s)+o&&(a=!a)}return a}window.getComunaForCoords=function(e,t){if(!C)return`Desconocida`;let n=[t,e];for(let e of C.features){let t=e.geometry;if(!t)continue;let r=t.type,i=t.coordinates;if(r===`Polygon`){if(ie(n,i))return e.properties.NOMBRE||e.properties.name||`Sin Nombre`}else if(r===`MultiPolygon`){for(let t of i)if(ie(n,t))return e.properties.NOMBRE||e.properties.name||`Sin Nombre`}}return`Desconocida`},window.loadComunas=function(e=null){let t=e||_;if(t){if(y&&t===_){t.hasLayer(y)||y.addTo(t);return}fetch(`https://gist.githubusercontent.com/davixcky/ade2468ed713364fd5876a16305608b4/raw/medellin.geojson`).then(e=>{if(!e.ok)throw Error(`No se pudo cargar el archivo GeoJSON`);return e.json()}).then(e=>{let n=L.geoJSON(e,{style:{color:`rgba(0, 245, 255, 0.4)`,weight:1.2,fillColor:`rgba(0, 245, 255, 0.05)`,fillOpacity:.1,dashArray:`4, 8`,interactive:!1},onEachFeature:function(e,t){let n=e.properties.NOMBRE||e.properties.nombre||e.properties.comuna;n&&t.bindTooltip(n.toString().toUpperCase(),{sticky:!0,className:`comuna-tooltip`,direction:`top`,opacity:.7})}});if(t===_){C=e,y=n;let r=document.getElementById(`filter-comunas`);(!r||r.checked)&&n.addTo(t),N()}else n.addTo(t)}).catch(e=>console.warn(`Fallo carga GeoJSON Comunas:`,e.message))}},window.initFormMap=function(){w||document.getElementById(`form-map-container`)&&(w=L.map(`form-map-container`,{zoomControl:!1}).setView([6.2442,-75.5812],12),L.tileLayer(ee,{attribution:j,subdomains:`abcd`,maxZoom:20}).addTo(w),L.control.zoom({position:`bottomright`}).addTo(w),window.loadComunas(w),w.on(`click`,e=>{let{lat:t,lng:n}=e.latlng;if(T)T.setLatLng(e.latlng);else{let t=L.divIcon({className:`marker-reporte`,html:`<div class="pulse-dot pulse-dot--yellow"></div>`,iconSize:[20,20],iconAnchor:[10,10]});T=L.marker(e.latlng,{icon:t}).addTo(w)}if(document.getElementById(`form-lat`).value=t.toFixed(6),document.getElementById(`form-lng`).value=n.toFixed(6),window.getComunaForCoords){let e=window.getComunaForCoords(t,n),r=document.getElementById(`form-comuna`);r&&(r.value=e)}}),setTimeout(()=>w.invalidateSize(),200))},window.loadCiclorrutas=function(){if(!_||b){b&&!_.hasLayer(b)&&b.addTo(_);return}fetch(`https://raw.githubusercontent.com/SiCLas/sigenbici/main/visor/geojson/cicloinfraestructura.geojson`).then(e=>e.json()).then(e=>{b=L.geoJSON(e,{style:function(e){let t=e.properties.tipo||e.properties.TIPO;return{color:t===`Andén`?`#00F5FF`:`#DFFF00`,weight:3,opacity:.8,dashArray:t===`Andén`?`5, 5`:``}},onEachFeature:function(e,t){t.bindTooltip(`Ciclorruta: `+(e.properties.NOMBRE||`Sin nombre`),{sticky:!0})}}).addTo(_)})},window.loadIncidentesSiClas=function(){if(!_||x){x&&!_.hasLayer(x)&&x.addTo(_);return}x=L.layerGroup().addTo(_),fetch(`https://raw.githubusercontent.com/SiCLas/sigenbici/main/visor/puntos/incidentes-viales.geojson`).then(e=>e.json()).then(e=>{let t={...e,features:e.features.filter(e=>{let t=(e.properties.tipo||e.properties.TIPO||``).toLowerCase();return t.includes(`muerte`)||t.includes(`fatal`)})};L.geoJSON(t,{pointToLayer:(e,t)=>{let n=L.divIcon({className:`marker-death`,html:`<div class="pulse-dot pulse-dot--red"></div>`,iconSize:[14,14],iconAnchor:[7,7]});return L.marker(t,{icon:n})},onEachFeature:(e,t)=>{t.on(`click`,n=>{L.DomEvent.stopPropagation(n);let r=e.properties;r.lat=t.getLatLng().lat,r.lng=t.getLatLng().lng,r.year=r.fecha?new Date(r.fecha).getFullYear():``,re(r)})}}).addTo(x)}),[2019,2020,2021,2022,2023,2024].forEach(e=>{fetch(`https://raw.githubusercontent.com/SiCLas/sigenbici/main/visor/admon/ciclistas-muertos-${e}.geojson`).then(e=>e.ok?e.json():null).then(t=>{t&&L.geoJSON(t,{pointToLayer:(e,t)=>{let n=L.divIcon({className:`marker-death`,html:`<div class="pulse-dot pulse-dot--red"></div>`,iconSize:[18,18],iconAnchor:[9,9]});return L.marker(t,{icon:n})},onEachFeature:(t,n)=>{n.on(`click`,r=>{L.DomEvent.stopPropagation(r);let i=t.properties;i.lat=n.getLatLng().lat,i.lng=n.getLatLng().lng,i.year=e,re(i)})}}).addTo(x)}).catch(()=>{})})},window.loadEnCicla=function(){if(!_||S){S&&!_.hasLayer(S)&&S.addTo(_);return}fetch(`https://raw.githubusercontent.com/SiCLas/sigenbici/main/visor/puntos/encicla.geojson`).then(e=>e.json()).then(e=>{S=L.geoJSON(e,{pointToLayer:(e,t)=>{let n=L.divIcon({className:`marker-encicla`,html:`<div class="pulse-dot pulse-dot--emerald"></div>`,iconSize:[16,16],iconAnchor:[8,8]});return L.marker(t,{icon:n})},onEachFeature:(e,t)=>{t.on(`click`,n=>{L.DomEvent.stopPropagation(n);let r=e.properties;r.lat=t.getLatLng().lat,r.lng=t.getLatLng().lng,ne(r)}),e.properties.name&&t.bindTooltip(e.properties.name,{direction:`top`,className:`custom-tooltip`})}}).addTo(_)}).catch(e=>console.error(`Error loading EnCicla:`,e))},window.toggleMapLayer=function(e,t){if(_)switch(e){case`reportes`:t?E&&E.addTo(_):E&&_.removeLayer(E);break;case`relatos`:t?D&&D.addTo(_):D&&_.removeLayer(D);break;case`heatmap`:v&&(t?v.addTo(_):_.removeLayer(v));break;case`comunas`:t?window.loadComunas():y&&_.removeLayer(y);break;case`ciclorrutas`:t?window.loadCiclorrutas():b&&_.removeLayer(b);break;case`muertes`:t?window.loadIncidentesSiClas():x&&_.removeLayer(x);break;case`encicla`:t?window.loadEnCicla():S&&_.removeLayer(S);break}};var ae=`modulepreload`,oe=function(e,t){return new URL(e,t).href},V={},H=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=oe(t,n),t in V)return;V[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:ae,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},U=null,W=null,G=[{id:0,icon:`🕯️`,label:`Vela`},{id:1,icon:`🚲`,label:`Bicicleta`},{id:2,icon:`✦`,label:`Luz`}];window.openRelato=function(e){if(W&&=(W(),null),window.toggleMapLayer){window.toggleMapLayer(`heatmap`,!1);let e=document.getElementById(`filter-heatmap`);e&&(e.checked=!1)}let t=JSON.parse(localStorage.getItem(`readRelatos`)||`[]`);t.includes(e)||(t.push(e),localStorage.setItem(`readRelatos`,JSON.stringify(t))),navigate(`story`);let n=document.getElementById(`story-skeleton`),r=document.getElementById(`story-content`),i=document.getElementById(`story-header`),a=document.getElementById(`scrolly-text`),o=document.getElementById(`story-nav`);n&&n.classList.remove(`hidden`),r&&r.classList.add(`hidden`);let s=(window._relatosCache||{})[e];s?se(s,e,i,a,o,n,r):setTimeout(()=>{n&&(n.innerHTML=`
                <p class="text-red-400 text-sm mt-10">Error: Archivo no encontrado en caché.</p>
                <button onclick="closeRelato()" class="text-safety mt-4 text-sm">← Volver</button>
            `)},500)};function se(e,t,n,r,i,a,o){let s=t.slice(0,8).toUpperCase(),c=e.fecha?new Date(e.fecha).toLocaleDateString(`es-CO`,{year:`numeric`,month:`long`,day:`numeric`}):`Fecha desconocida`;n.innerHTML=`
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
                <span class="text-white/70">${J(e.zona||`Sin clasificar`)}</span>
            </div>
        </div>
        <h1 class="font-display text-3xl md:text-4xl text-white mt-6 font-extrabold leading-tight">${J(e.titulo)}</h1>
    `;let l=(e.relato||``).split(/\n\n+/).map(e=>e.trim()).filter(e=>e.length>0),u;if(l.length<=1){let t=(e.relato||``).match(/[^.!?]+[.!?]+/g)||[e.relato];u=[];for(let e=0;e<t.length;e+=3)u.push(t.slice(e,e+3).join(` `).trim())}else u=l;let d=[15,16,17,18,17,16,15,18],f=``;u.forEach((t,n)=>{let r=d[n%d.length],i=(Math.random()-.5)*.003,a=(Math.random()-.5)*.003;n===2&&(f+=K()),f+=`
            <div class="step min-h-[50vh] flex items-start pt-8"
                 data-lat="${(e.lat+i).toFixed(6)}"
                 data-lng="${(e.lng+a).toFixed(6)}"
                 data-zoom="${r}">
                <p class="text-base md:text-lg leading-relaxed text-white/85">${J(t)}</p>
            </div>
        `}),u.length<3&&(f+=K()),f+=ce(t),r.innerHTML=f,de(t,i),setTimeout(()=>{a&&a.classList.add(`hidden`),o&&o.classList.remove(`hidden`),window.flyToLocation&&window.flyToLocation(e.lat,e.lng,15),fe(),window.initScratchReveal&&window.initScratchReveal(`scratch-canvas`,()=>{let e=document.getElementById(`scratch-revealed-msg`);e&&e.classList.remove(`hidden`)}),le(t);let n=document.getElementById(`story-panel`);n&&(n.scrollTop=0)},400)}function K(){return`
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
    `}function ce(e){return`
        <div class="border-t border-white/10 mt-16 pt-10" id="ecos-section">
            <div class="flex flex-col mb-6">
                <div class="flex items-center gap-3 mb-2">
                    <span class="text-safety text-xs tracking-[0.3em] uppercase font-bold">Ecos del archivo</span>
                    <span class="inline-block w-2 h-2 rounded-full bg-safety animate-ping"></span>
                </div>
                <p class="text-white/40 text-xs leading-relaxed">
                    Un muro anónimo de memoria. Cada eco es un rastro dejado por quienes han transitado este relato.
                    <br><br>
                    <span class="text-white/60 font-bold">Significado:</span><br>
                    🕯️ <span class="text-white/40">Vela: Memoria y respeto</span> &nbsp;&nbsp; 
                    🚲 <span class="text-white/40">Bici: Presencia ciclista</span> &nbsp;&nbsp; 
                    ✦ <span class="text-white/40">Luz: Esperanza y rastro</span>
                </p>
            </div>

            <!-- Eco input -->
            <div class="bg-white/3 border border-white/10 rounded-lg p-4 mb-8">
                <div class="flex gap-3 mb-3">
                    ${G.map(e=>`<button type="button" class="eco-symbol-btn w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-lg hover:border-safety/50 hover:bg-white/5 transition-all" data-sid="${e.id}" title="${e.label}" onclick="selectEcoSymbol(this, ${e.id})">${e.icon}</button>`).join(``)}
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
    `}var q=0;window.selectEcoSymbol=function(e,t){q=t,document.querySelectorAll(`.eco-symbol-btn`).forEach(e=>{e.classList.remove(`border-safety`,`bg-safety/10`),e.classList.add(`border-white/15`)}),e.classList.remove(`border-white/15`),e.classList.add(`border-safety`,`bg-safety/10`)},window.submitEco=async function(e){let t=document.getElementById(`eco-input`);if(!t||!t.value.trim())return;let n=t.value.trim();t.value=``,t.placeholder=`Enviando...`;try{let{addEco:r}=await H(async()=>{let{addEco:e}=await Promise.resolve().then(()=>Y);return{addEco:e}},void 0,import.meta.url);await r(e,n,q),t.placeholder=`Deja un eco...`}catch(e){console.error(`Error sending eco:`,e),t.placeholder=`Error al enviar`,setTimeout(()=>{t.placeholder=`Deja un eco...`},2e3)}};async function le(e){W&&=(W(),null);try{let{listenEcos:t}=await H(async()=>{let{listenEcos:e}=await Promise.resolve().then(()=>Y);return{listenEcos:e}},void 0,import.meta.url);W=t(e,e=>{ue(e)})}catch(e){console.error(`Error loading ecos:`,e)}}function ue(e){let t=document.getElementById(`ecos-list`);if(t){if(e.length===0){t.innerHTML=`<p class="text-white/15 text-xs font-mono">Aún no hay ecos. Sé el primero en dejar uno.</p>`;return}t.innerHTML=e.map((e,t)=>{let n=G.find(t=>t.id===e.simbolo_id)||G[0],r=e.timestamp?.toDate?e.timestamp.toDate().toLocaleDateString(`es-CO`,{month:`short`,day:`numeric`}):``;return`
            <div class="eco-item flex items-start gap-3 py-2 border-b border-white/5" style="animation: eco-fade-in 0.5s ease ${t*.08}s backwards;">
                <span class="text-lg mt-0.5 opacity-60">${n.icon}</span>
                <div class="flex-1 min-w-0">
                    <p class="text-white/70 text-sm font-mono leading-relaxed">${J(e.mensaje)}</p>
                    ${r?`<span class="text-white/15 text-[10px]">${r}</span>`:``}
                </div>
            </div>
        `}).join(``)}}function de(e,t){if(!t)return;let n=window._relatosList||[],r=n.findIndex(t=>t.id===e);if(r===-1||n.length<=1){t.innerHTML=``;return}let i=r>0?n[r-1]:null,a=r<n.length-1?n[r+1]:null;t.innerHTML=`
        ${i?`
            <button onclick="openRelato('${i.id}')" class="flex-1 text-left bg-white/5 border border-white/10 hover:border-safety/30 rounded-lg p-4 transition-colors group">
                <span class="text-[10px] text-white/30 tracking-widest uppercase block mb-1">← Anterior</span>
                <span class="text-sm font-display font-bold group-hover:text-safety transition-colors">${J(i.titulo)}</span>
            </button>
        `:`<div class="flex-1"></div>`}
        ${a?`
            <button onclick="openRelato('${a.id}')" class="flex-1 text-right bg-white/5 border border-white/10 hover:border-city/30 rounded-lg p-4 transition-colors group">
                <span class="text-[10px] text-white/30 tracking-widest uppercase block mb-1">Siguiente →</span>
                <span class="text-sm font-display font-bold group-hover:text-city transition-colors">${J(a.titulo)}</span>
            </button>
        `:`<div class="flex-1"></div>`}
    `}function fe(){let e=document.querySelectorAll(`#scrolly-text .step`);if(e.length===0)return;U&&U.disconnect();let t={root:document.getElementById(`story-panel`),rootMargin:`0px 0px -30% 0px`,threshold:.4};U=new IntersectionObserver(t=>{t.forEach(t=>{if(t.isIntersecting){e.forEach(e=>e.classList.remove(`is-active`)),t.target.classList.add(`is-active`);let n=parseFloat(t.target.dataset.lat),r=parseFloat(t.target.dataset.lng),i=parseInt(t.target.dataset.zoom)||16;!isNaN(n)&&!isNaN(r)&&window.flyToLocation&&window.flyToLocation(n,r,i)}})},t),e.forEach(e=>U.observe(e))}window.closeRelato=function(){U&&U.disconnect(),W&&=(W(),null),window.flyToLocation&&window.flyToLocation(6.2442,-75.5812,13);let e=window._previousViewId||`memorial`;navigate(e)};function J(e){return(e||``).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}var Y=u({addDoc:()=>t,addEco:()=>he,collection:()=>n,db:()=>X,listenEcos:()=>ge,onSnapshot:()=>a,orderBy:()=>o,query:()=>s,serverTimestamp:()=>c}),pe={apiKey:`AIzaSyDQjCjijV1TTgnBS3GHX56eTEAQqweYk0U`,authDomain:`ciclistas-fantasmas-cf99.firebaseapp.com`,projectId:`ciclistas-fantasmas-cf99`,storageBucket:`ciclistas-fantasmas-cf99.firebasestorage.app`,messagingSenderId:`21053803698`,appId:`1:21053803698:web:a358fb0fd520025a4f4dab`},me,X;try{me=e(pe),X=r(me),console.log(`Firebase initialized`)}catch{console.warn(`Firebase no está configurado aún o las credenciales son incorrectas.`)}async function he(e,r,i){return X?t(n(X,`incidentes`,e,`ecos`),{mensaje:r.slice(0,140),simbolo_id:i,timestamp:c()}):null}function ge(e,t){return X?a(s(n(X,`incidentes`,e,`ecos`),o(`timestamp`,`desc`),i(50)),e=>{let n=[];e.forEach(e=>{n.push({id:e.id,...e.data()})}),t(n)}):()=>{}}window._relatosCache={},window._relatosList=[],window._lastZonas=new Set,document.addEventListener(`DOMContentLoaded`,()=>{let e=document.getElementById(`incident-form`);e&&e.addEventListener(`submit`,async r=>{r.preventDefault();let i=document.getElementById(`form-title`).value,a=document.getElementById(`form-story`).value,o=document.getElementById(`form-lat`).value,s=document.getElementById(`form-lng`).value,c=document.getElementById(`form-feedback`);if(!o||!s){c.textContent=`Por favor, selecciona un punto en el mapa primero.`,c.classList.remove(`hidden`);return}if(!X){c.textContent=`Error: Firebase no está configurado.`,c.classList.remove(`hidden`);return}try{c.textContent=`Guardando reporte…`,c.classList.remove(`hidden`);let r=parseFloat(o),l=parseFloat(s),u=window.getComunaForCoords?window.getComunaForCoords(r,l):``;await t(n(X,`incidentes`),{titulo:i,relato:a.slice(0,450*5),coordenadas:{lat:r,lng:l},fecha:new Date,tipo:`reporte`,zona:u,imagen_url:``}),c.textContent=`¡Reporte enviado exitosamente de forma anónima!`,setTimeout(()=>{alert(`Tu reporte ha sido guardado en el archivo vivo.`),window.navigate&&window.navigate(`map`)},100),e.reset(),document.getElementById(`form-lat`).value=``,document.getElementById(`form-lng`).value=``}catch(e){console.error(`Error adding document: `,e),c.textContent=`Error al guardar el reporte.`}}),X&&a(n(X,`incidentes`),e=>{let t=[],n=[],r=[],i=new Set,a={};e.forEach(e=>{let o=e.data();if(!o.coordenadas)return;let s=parseFloat(o.coordenadas.lat),c=parseFloat(o.coordenadas.lng);if(isNaN(s)||isNaN(c))return;let l=o.zona||``;!l&&window.getComunaForCoords&&(l=window.getComunaForCoords(s,c));let u={id:e.id,lat:s,lng:c,titulo:o.titulo||`Sin título`,relato:o.relato||``,zona:l,fecha:o.fecha?.toDate?o.fecha.toDate().toISOString():o.fecha||null};(o.tipo===`relato`||o.tipo===`reporte`)&&l&&l!==`Desconocida`&&l!==`Fuera de Medellín`&&(a[l]=(a[l]||0)+1),o.tipo===`relato`?(n.push(u),r.push(u),u.zona&&i.add(u.zona),window._relatosCache[e.id]=u):t.push(u)}),window.updateComunaStats&&window.updateComunaStats(a),r.sort((e,t)=>e.titulo.localeCompare(t.titulo)),window._relatosList=r,console.log(`Firebase → ${t.length} reportes, ${n.length} relatos`),window.updateReportes&&window.updateReportes(t),window.updateRelatos&&window.updateRelatos(n),window._lastZonas=i,_e(r,i)})}),window.refreshRelatosCards=function(){window._relatosList&&window._relatosList.length>0&&(_e(window._relatosList,window._lastZonas),window.filterRelatos&&window.filterRelatos())};function _e(e,t){let n=document.getElementById(`relatos-grid`),r=document.getElementById(`relatos-loading-text`),i=document.getElementById(`relatos-zones`);if(!n)return;if(n.querySelectorAll(`.memorial-skeleton`).forEach(e=>e.remove()),r&&r.classList.add(`hidden`),i&&(i.innerHTML=`<button class="zone-chip is-active" onclick="setRelatosZoneFilter(null, this)">Todas</button>`+Array.from(t).sort().map(e=>`<button class="zone-chip" onclick="setRelatosZoneFilter('${e}', this)">${e}</button>`).join(``)),e.length===0){n.innerHTML=`<p class="text-white/30 col-span-full text-center py-12">No hay relatos en el archivo.</p>`;return}let a=JSON.parse(localStorage.getItem(`readRelatos`)||`[]`),o=[`#DFFF00`,`#00F5FF`,`#FF003C`,`#FF6B35`,`#C77DFF`];n.innerHTML=e.map((e,t)=>{let n=(e.relato||``).split(`
`)[0].slice(0,120),r=e.fecha?new Date(e.fecha).toLocaleDateString(`es-CO`,{year:`numeric`,month:`short`}):``,i=o[t%o.length],s=e.id.slice(0,8).toUpperCase(),c=a.includes(e.id);return`
            <article class="memorial-card group cursor-pointer ${c?`is-read`:``}" 
                     data-titulo="${Z(e.titulo)}" 
                     data-zona="${Z(e.zona)}" 
                     data-relato="${Z(n)}"
                     data-read="${c}"
                     onclick="openRelato('${e.id}')">
                <div class="relative h-48 overflow-hidden bg-white/5 rounded-t-lg">
                    <div class="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/80"></div>
                    <div class="absolute inset-0 grain-overlay"></div>
                    <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
                    <!-- Accent line -->
                    <div class="absolute top-0 left-0 w-full h-1 transition-all duration-500 group-hover:h-2" style="background:${i};box-shadow:0 0 12px ${i}"></div>
                    <!-- Read check -->
                    ${c?`<div class="absolute top-3 left-3 bg-safety text-background rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg z-10">✔</div>`:``}
                    <!-- File ID -->
                    <span class="absolute top-3 right-3 text-[10px] tracking-widest text-white/30 font-mono">CF-${s}</span>
                    <!-- Coords -->
                    <span class="absolute bottom-3 left-3 text-[10px] tracking-widest text-white/40 font-mono">${e.lat.toFixed(4)}, ${e.lng.toFixed(4)}</span>
                </div>
                <div class="p-4 border border-t-0 border-white/10 rounded-b-lg group-hover:border-white/20 transition-colors bg-background">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[10px] tracking-widest uppercase" style="color:${i}">${Z(e.zona)||`Medellín`}</span>
                        <span class="text-[10px] text-white/30">${r}</span>
                    </div>
                    <h3 class="memorial-card-title font-display text-lg font-bold mb-2 group-hover:text-safety transition-colors leading-tight">${Z(e.titulo)}</h3>
                    <p class="text-white/40 text-xs leading-relaxed line-clamp-2">${Z(n)}…</p>
                </div>
            </article>
        `}).join(``),window.filterRelatos&&window.filterRelatos()}function Z(e){return(e||``).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}var Q=[],$=!1;window.loadVictimsData=async function(){if($)return;let e=document.getElementById(`victims-loading`);e&&e.classList.remove(`hidden`);try{let t=[2019,2020,2021,2022,2023,2024].map(e=>fetch(`https://raw.githubusercontent.com/SiClas/sigenbici/main/visor/admon/ciclistas-muertos-${e}.geojson`).then(e=>e.ok?e.json():null).then(t=>t?t.features.map(t=>({...t.properties,year:e})):[]).catch(()=>[])),n=fetch(`https://raw.githubusercontent.com/SiClas/sigenbici/main/visor/puntos/incidentes-viales.geojson`).then(e=>e.json()).then(e=>e.features.filter(e=>{let t=(e.properties.tipo||e.properties.TIPO||``).toLowerCase();return t.includes(`muerte`)||t.includes(`fatal`)}).map(e=>({...e.properties,year:e.properties.fecha?new Date(e.properties.fecha).getFullYear():`N/A`}))).catch(()=>[]);Q=(await Promise.all([...t,n])).flat(),Q=ve(Q),$=!0,e&&e.classList.add(`hidden`),window.renderVictimsList()}catch(t){console.error(`Error loading victims data:`,t),e&&(e.innerHTML=`<span class="text-red-500">Error al cargar datos.</span>`)}};function ve(e){let t=new Set;return e.filter(e=>{let n=`${e.Fecha_Ocurrencia||e.FECHA||e.fecha||``}-${e.Edad||e.EDAD||``}`.toLowerCase();return!n||n===`-`||t.has(n)?!1:(t.add(n),!0)})}window.renderVictimsList=function(){let e=document.getElementById(`victims-grid`);if(!e)return;let t=document.getElementById(`victim-filter-year`).value,n=document.getElementById(`victim-filter-cause`).value,r=document.getElementById(`victim-search`).value.toLowerCase(),i=parseInt(document.getElementById(`age-min`).value),a=parseInt(document.getElementById(`age-max`).value),o=Q.filter(e=>{let o=e.year.toString(),s=(e.Interaccion||e.INTERACCION||e.tipo||e.TIPO||``).toLowerCase(),c=(e.Lugar_Ocurrencia||e.DIRECCION||``).toLowerCase(),l=parseInt(e.Edad||e.EDAD);isNaN(l)&&(l=-1);let u=t===`all`||o===t,d=!0;n!==`all`&&(n===`Auto`?d=s.includes(`auto`)||s.includes(`particular`):n===`Bus`?d=s.includes(`bus`)||s.includes(`tpv`):n===`Camion`?d=s.includes(`camion`)||s.includes(`volqueta`):n===`Moto`?d=s.includes(`moto`):n===`Caida`&&(d=s.includes(`caida`)||s.includes(`objeto`)));let f=!r||c.includes(r)||s.includes(r),p=!0;return p=l===-1?i===0&&a===100:l>=i&&l<=a,u&&d&&f&&p});e.innerHTML=o.map(e=>{let t=e.Fecha_Ocurrencia||e.FECHA||e.fecha||`N/A`,n=e.Edad||e.EDAD||`N/A`,r=e.Interaccion||e.INTERACCION||`N/A`,i=e.Lugar_Ocurrencia||e.DIRECCION||`Desconocido`;return`
            <div class="victim-card bg-white/5 border border-white/10 p-5 rounded-xl hover:border-[#FF003C]/40 transition-all group relative overflow-hidden">
                <div class="absolute -right-4 -top-4 w-20 h-20 bg-[#FF003C]/5 rounded-full group-hover:bg-[#FF003C]/10 transition-colors"></div>
                
                <span class="text-[10px] text-[#FF003C] font-bold tracking-widest uppercase mb-1 block">${e.year}</span>
                <h3 class="text-white font-display text-sm font-bold uppercase mb-3 leading-tight">En memoria</h3>
                
                <div class="space-y-3 relative z-10">
                    <div class="flex items-start gap-2">
                        <span class="material-symbols-outlined text-white/30 text-sm mt-0.5">calendar_today</span>
                        <div class="flex flex-col">
                            <span class="text-[9px] text-white/40 uppercase">Fecha</span>
                            <span class="text-xs text-white/80">${t}</span>
                        </div>
                    </div>
                    
                    <div class="flex items-start gap-2">
                        <span class="material-symbols-outlined text-white/30 text-sm mt-0.5">person</span>
                        <div class="flex flex-col">
                            <span class="text-[9px] text-white/40 uppercase">Edad</span>
                            <span class="text-xs text-white/80">${n} años</span>
                        </div>
                    </div>

                    <div class="flex items-start gap-2">
                        <span class="material-symbols-outlined text-[#FF003C]/50 text-sm mt-0.5">warning</span>
                        <div class="flex flex-col">
                            <span class="text-[9px] text-white/40 uppercase">Interacción</span>
                            <span class="text-xs text-white font-bold">${r}</span>
                        </div>
                    </div>

                    <div class="h-px bg-white/5 my-2"></div>
                    
                    <p class="text-[10px] text-white/40 italic line-clamp-2">${i}</p>
                </div>
            </div>
        `}).join(``),o.length===0&&$&&(e.innerHTML=`
            <div class="col-span-full py-10 text-center opacity-30">
                <p class="text-sm uppercase tracking-widest">No se encontraron registros</p>
            </div>
        `)},window.updateAgeRange=function(){let e=document.getElementById(`age-min`),t=document.getElementById(`age-max`),n=document.getElementById(`age-range-value`),r=parseInt(e.value),i=parseInt(t.value);if(r>i){let e=r;r=i,i=e}n.textContent=`${r} - ${i}`,window.renderVictimsList()},window.resetMemorialFilters=function(){document.getElementById(`victim-filter-year`).value=`all`,document.getElementById(`victim-filter-cause`).value=`all`,document.getElementById(`victim-search`).value=``,document.getElementById(`age-min`).value=0,document.getElementById(`age-max`).value=100,document.getElementById(`age-range-value`).textContent=`0 - 100`,window.renderVictimsList()},window.toggleMemorialFilters=function(){let e=document.getElementById(`memorial-filters-container`);e&&(e.classList.toggle(`hidden`),e.classList.toggle(`is-visible`))};var ye=[{name:`Andrés`,role:`Mensajero Mensajería Urbana`,reason:`Usa la bici porque es la forma más rápida de cruzar el tráfico de Medellín. Para él, la bici es libertad y su herramienta de trabajo.`,image:`https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&q=80&w=400`},{name:`Mariana`,role:`Estudiante Universitaria`,reason:`Se mueve en bici para ahorrar tiempo y dinero. Además, siente que es su pequeña contribución para reducir la contaminación en el valle.`,image:`https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400`},{name:`Don Roberto`,role:`Trabajador de Construcción`,reason:`Ha usado la bicicleta toda su vida. Es su medio de transporte fiel desde hace 30 años para llegar a las obras desde su barrio.`,image:`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400`},{name:`Elena`,role:`Activista Ciclista`,reason:`La bicicleta es un acto político. La usa para reclamar el derecho al espacio público y promover ciudades más humanas.`,image:`https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400`},{name:`Mateo`,role:`Padre de familia`,reason:`Lleva a su hijo al colegio en una bici de carga. Quiere que su hijo crezca viendo la ciudad desde otra perspectiva, no desde un auto.`,image:`https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400`},{name:`Sofía`,role:`Diseñadora Freelance`,reason:`La bicicleta le ayuda a despejar la mente. Es su momento de meditación diaria antes de sentarse frente a la pantalla.`,image:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400`}];window.renderWhoWeAre=function(){let e=document.getElementById(`who-we-are-grid`);e&&(e.innerHTML=ye.map(e=>`
        <div class="flip-card h-80 perspective cursor-pointer" onclick="this.classList.toggle('is-flipped')">
            <div class="card-inner relative preserve-3d w-full h-full duration-700 transition-transform">
                <!-- Front -->
                <div class="absolute inset-0 backface-hidden rounded-xl overflow-hidden border border-white/10 bg-black/20">
                    <img src="${e.image}" class="w-full h-full object-cover grayscale opacity-60 transition-all duration-500" alt="${e.name}">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                    <div class="absolute bottom-4 left-4">
                        <h3 class="text-xl font-display font-bold text-safety">${e.name}</h3>
                        <p class="text-xs text-white/60 uppercase tracking-widest">${e.role}</p>
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
                    <p class="text-sm font-medium leading-relaxed">${e.reason}</p>
                    <span class="text-[10px] mt-6 opacity-40 uppercase font-bold tracking-tighter">Click para volver</span>
                </div>
            </div>
        </div>
    `).join(``))};