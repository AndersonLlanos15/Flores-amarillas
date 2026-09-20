// ==========================================
// ESTADOS GLOBALES Y VARIABLES DE CONTROL
// ==========================================
window.isLetterOpen = false;
window.isUniverseActive = false;

let targetCamDist = 180;
let currentCamDist = 180;
const MIN_CAM_DIST = 55;
const MAX_CAM_DIST = 440;
let touchStartPinchDist = 0;

let toName = "Mi Amor Eterno";
let fromName = "Por siempre tu amor";

// Variables Three.js
let scene, camera, renderer;
let starPoints;
let shootingStars = [];
window.targetRotX = 0;
window.targetRotY = 0;
let currentRotX = 0;
let currentRotY = 0;
let isDraggingScene = false;
let prevPointer = { x: 0, y: 0 };

const romanticPhrases = [
"Eres mi sol en días nublados ☀️",
"Tu sonrisa ilumina mi mundo ✨",
"Por mil vidas más a tu lado 🌻",
"Mi lugar favorito es contigo 💛",
"La flor más hermosa del universo",
"Brillas más que todas las estrellas",
"Amor sincero y eterno",
"Gracias por existir en mi vida",
"Tú haces florecer mis mejores días",
"Siempre juntos, mi amor"
];

// ==========================================
// CONTROL DE ZOOM Y FOTO PERSONALIZADA
// ==========================================
window.ajustarZoom = function(delta) {
targetCamDist = Math.max(MIN_CAM_DIST, Math.min(MAX_CAM_DIST, targetCamDist + delta));
if (window.createPetalBurst) {
window.createPetalBurst(window.innerWidth / 2, window.innerHeight / 2, 8);
}
};

window.cargarFotoCarta = function(e) {
if (!e.target || !e.target.files || !e.target.files[0]) return;
const file = e.target.files[0];
const reader = new FileReader();
reader.onload = function(evt) {
const imgEl = document.getElementById('cardPhotoImg');
const contEl = document.getElementById('cardPhotoContainer');
const placeEl = document.getElementById('cardPhotoPlaceholder');
if (imgEl && contEl && placeEl) {
imgEl.src = evt.target.result;
placeEl.classList.add('hidden');
contEl.classList.remove('hidden');
if (window.createPetalBurst) {
window.createPetalBurst(window.innerWidth / 2, window.innerHeight / 2, 25);
}
window.mostrarNotificacion("¡Foto agregada con amor!", "📸");
}
};
reader.readAsDataURL(file);
};

// ==========================================
// APERTURA Y CIERRE DE LA CARTA
// ==========================================
window.abrirCarta = function(e) {
if (e) {
if (e.stopPropagation) e.stopPropagation();
if (e.preventDefault) e.preventDefault();
}

if (window.isLetterOpen) return;
window.isLetterOpen = true;

const waxBtn = document.getElementById('waxSealButton');
const flap = document.getElementById('envelopeTopFlap');
const envSec = document.getElementById('envelopeSection');
const univView = document.getElementById('universeView');

// Explosión dorada en el sello de cera
if (waxBtn) {
    const rect = waxBtn.getBoundingClientRect();
    if (window.createPetalBurst) {
        window.createPetalBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
    }
    waxBtn.style.transform = 'scale(1.25)';
    waxBtn.style.opacity = '0';
    waxBtn.style.pointerEvents = 'none';
}

// Apertura 3D de la solapa
if (flap) {
    flap.style.transform = 'rotateX(180deg)';
}

// Iniciar melodía suavemente si está apagada
if (window.setMusicState && !window.isMusicActive) {
    window.setMusicState(true);
}

setTimeout(() => {
    if (envSec) {
        envSec.style.opacity = '0';
        envSec.style.pointerEvents = 'none';
        envSec.style.transform = 'scale(0.92)';
    }

    // Mostrar girasoles y frases en el espacio 3D
    if (window.sunflowersGroup) window.sunflowersGroup.visible = true;
    if (window.phrasesGroup) window.phrasesGroup.visible = true;

    if (univView) {
        univView.style.opacity = '1';
        univView.style.pointerEvents = 'auto';
    }

    window.isUniverseActive = true;

    if (window.createPetalBurst) {
        window.createPetalBurst(window.innerWidth / 2, window.innerHeight / 2, 35);
    }
}, 550);


};

window.cerrarCarta = function(e) {
if (e) {
if (e.stopPropagation) e.stopPropagation();
if (e.preventDefault) e.preventDefault();
}

window.isLetterOpen = false;
window.isUniverseActive = false;

const waxBtn = document.getElementById('waxSealButton');
const flap = document.getElementById('envelopeTopFlap');
const envSec = document.getElementById('envelopeSection');
const univView = document.getElementById('universeView');
const card = document.getElementById('parchmentCard');

// Ocultar girasoles y frases 3D
if (window.sunflowersGroup) window.sunflowersGroup.visible = false;
if (window.phrasesGroup) window.phrasesGroup.visible = false;

if (univView) {
    univView.style.opacity = '0';
    univView.style.pointerEvents = 'none';
}

if (card) {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
}

window.targetRotX = 0;
window.targetRotY = 0;
targetCamDist = 180;
currentCamDist = 180;

setTimeout(() => {
    if (envSec) {
        envSec.style.opacity = '1';
        envSec.style.pointerEvents = 'auto';
        envSec.style.transform = 'scale(1)';
    }
    if (flap) {
        flap.style.transform = 'rotateX(0deg)';
    }
    if (waxBtn) {
        waxBtn.style.opacity = '1';
        waxBtn.style.transform = 'scale(1)';
        waxBtn.style.pointerEvents = 'auto';
    }
}, 350);


};

window.centrarCarta = function(e) {
if (e && e.stopPropagation) e.stopPropagation();
window.targetRotX = 0;
window.targetRotY = 0;
targetCamDist = 180;
const card = document.getElementById('parchmentCard');
if (card) card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
if (window.createPetalBurst) window.createPetalBurst(window.innerWidth / 2, window.innerHeight / 2, 20);
};

// ==========================================
// NOTIFICACIONES Y PERSONALIZACIÓN DE NOMBRES
// ==========================================
window.mostrarNotificacion = function(mensaje, icono = "✨") {
const toast = document.getElementById('appToast');
const msgEl = document.getElementById('toastMessage');
const iconEl = document.getElementById('toastIcon');
if (!toast || !msgEl) return;
msgEl.textContent = mensaje;
if (iconEl) iconEl.textContent = icono;
toast.classList.remove('opacity-0', 'pointer-events-none');
toast.classList.add('opacity-100');
clearTimeout(window.toastTimer);
window.toastTimer = setTimeout(() => {
toast.classList.remove('opacity-100');
toast.classList.add('opacity-0', 'pointer-events-none');
}, 3200);
};

window.abrirModalPersonalizar = function(e) {
if (e && e.stopPropagation) e.stopPropagation();
const modal = document.getElementById('customizerModal');
const inTo = document.getElementById('inputTo');
const inFrom = document.getElementById('inputFrom');
if (inTo) inTo.value = toName;
if (inFrom) inFrom.value = fromName;
if (modal) {
modal.classList.remove('hidden');
modal.classList.add('flex');
}
};

window.cerrarModalPersonalizar = function(e) {
if (e && e.stopPropagation) e.stopPropagation();
const modal = document.getElementById('customizerModal');
if (modal) {
modal.classList.add('hidden');
modal.classList.remove('flex');
}
};

window.guardarPersonalizacion = function(e) {
if (e) {
if (e.preventDefault) e.preventDefault();
if (e.stopPropagation) e.stopPropagation();
}
const inTo = document.getElementById('inputTo');
const inFrom = document.getElementById('inputFrom');
const dispTo = document.getElementById('displayToName');
const dispFrom = document.getElementById('displayFromName');

if (inTo && inTo.value.trim()) {
    toName = inTo.value.trim();
    if (dispTo) dispTo.textContent = toName;
}
if (inFrom && inFrom.value.trim()) {
    fromName = inFrom.value.trim();
    if (dispFrom) dispFrom.textContent = fromName;
}

window.cerrarModalPersonalizar();
if (window.createPetalBurst) window.createPetalBurst(window.innerWidth / 2, window.innerHeight / 2, 25);


};

// ==========================================
// GENERADORES DE TEXTURAS THREE.JS
// ==========================================
function createCircleStarTexture() {
const size = 64;
const c = document.createElement('canvas');
c.width = size;
c.height = size;
const ctx = c.getContext('2d');
const center = size / 2;

const grad = ctx.createRadialGradient(center, center, 0, center, center, center);
grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
grad.addColorStop(0.25, 'rgba(254, 240, 138, 0.9)');
grad.addColorStop(0.6, 'rgba(234, 179, 8, 0.35)');
grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

ctx.fillStyle = grad;
ctx.beginPath();
ctx.arc(center, center, center, 0, Math.PI * 2);
ctx.fill();

const tex = new THREE.CanvasTexture(c);
tex.needsUpdate = true;
return tex;


}

function createSunflowerTexture() {
const size = 256;
const c = document.createElement('canvas');
c.width = size;
c.height = size;
const ctx = c.getContext('2d');
const center = size / 2;

const numPetals = 20;
// Pétalos exteriores
for (let i = 0; i < numPetals; i++) {
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate((i * Math.PI * 2) / numPetals);

    const grad = ctx.createRadialGradient(0, -68, 5, 0, -68, 55);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.45, '#facc15');
    grad.addColorStop(1, '#b45309');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, -68, 13, 44, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// Pétalos interiores escalonados
for (let i = 0; i < numPetals; i++) {
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(((i + 0.5) * Math.PI * 2) / numPetals);

    const grad = ctx.createRadialGradient(0, -52, 4, 0, -52, 42);
    grad.addColorStop(0, '#fff59d');
    grad.addColorStop(0.55, '#eab308');
    grad.addColorStop(1, '#78350f');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, -52, 11, 36, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// Centro del girasol
const coreGrad = ctx.createRadialGradient(center, center, 4, center, center, 42);
coreGrad.addColorStop(0, '#451a03');
coreGrad.addColorStop(0.7, '#270e02');
coreGrad.addColorStop(1, '#140601');

ctx.beginPath();
ctx.arc(center, center, 40, 0, Math.PI * 2);
ctx.fillStyle = coreGrad;
ctx.fill();

ctx.strokeStyle = '#ca8a04';
ctx.lineWidth = 1.4;
ctx.setLineDash([3, 4]);
ctx.beginPath();
ctx.arc(center, center, 30, 0, Math.PI * 2);
ctx.stroke();

const tex = new THREE.CanvasTexture(c);
tex.needsUpdate = true;
return tex;


}

function createPhraseTexture(text) {
const c = document.createElement('canvas');
c.width = 640;
c.height = 140;
const ctx = c.getContext('2d');

ctx.fillStyle = 'rgba(15, 16, 26, 0.88)';
ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
ctx.lineWidth = 3;

const x = 10, y = 10, w = 620, h = 120, r = 35;
ctx.beginPath();
ctx.moveTo(x + r, y);
ctx.lineTo(x + w - r, y);
ctx.quadraticCurveTo(x + w, y, x + w, y + r);
ctx.lineTo(x + w, y + h - r);
ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
ctx.lineTo(x + r, y + h);
ctx.quadraticCurveTo(x, y + h, x, y + h - r);
ctx.lineTo(x, y + r);
ctx.quadraticCurveTo(x, y, x + r, y);
ctx.closePath();
ctx.fill();
ctx.stroke();

ctx.font = 'bold 36px "Dancing Script", cursive, "Montserrat", sans-serif';
ctx.fillStyle = '#fef08a';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.shadowColor = 'rgba(234, 179, 8, 0.95)';
ctx.shadowBlur = 18;
ctx.fillText(text, 320, 70);

const tex = new THREE.CanvasTexture(c);
tex.needsUpdate = true;
return tex;


}

// ==========================================
// ESTRELLAS FUGACES CÓSMICAS
// ==========================================
class CosmicShootingStar {
constructor() {
this.active = false;
this.speed = 4.5 + Math.random() * 3.5;
this.length = 45 + Math.random() * 25;
this.dir = new THREE.Vector3(-1, -0.4, 0.2).normalize();
this.init();
}

init() {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(6);
    const colors = new Float32Array(6);

    colors[0] = 1.0; colors[1] = 0.98; colors[2] = 0.85;
    colors[3] = 0.95; colors[4] = 0.75; colors[5] = 0.15;

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        linewidth: 2
    });

    this.mesh = new THREE.Line(geo, mat);
    scene.add(this.mesh);
    this.reset();
}

reset() {
    const spawnX = 140 + Math.random() * 190;
    const spawnY = 80 + Math.random() * 140;
    const spawnZ = (Math.random() - 0.5) * 200;

    this.pos = new THREE.Vector3(spawnX, spawnY, spawnZ);
    this.speed = 4.5 + Math.random() * 4.0;
    this.active = true;
    this.mesh.material.opacity = 0.95;
    this.distanceTraveled = 0;
    this.maxDistance = 260 + Math.random() * 80;
}

update() {
    if (!this.active) {
        if (Math.random() < 0.015) this.reset();
        return;
    }

    this.pos.addScaledVector(this.dir, this.speed);
    this.distanceTraveled += this.speed;

    const positions = this.mesh.geometry.attributes.position.array;
    positions[0] = this.pos.x;
    positions[1] = this.pos.y;
    positions[2] = this.pos.z;

    positions[3] = this.pos.x - this.dir.x * this.length;
    positions[4] = this.pos.y - this.dir.y * this.length;
    positions[5] = this.pos.z - this.dir.z * this.length;

    this.mesh.geometry.attributes.position.needsUpdate = true;

    if (this.distanceTraveled > this.maxDistance * 0.7) {
        this.mesh.material.opacity = Math.max(0, 1 - (this.distanceTraveled / this.maxDistance));
    }

    if (this.distanceTraveled >= this.maxDistance) {
        this.active = false;
        this.mesh.material.opacity = 0;
    }
}


}

// ==========================================
// INICIALIZACIÓN DE THREE.JS
// ==========================================
function initThreeScene() {
const container = document.getElementById('webgl-container');
scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x070812, 0.0016);

camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1500);
camera.position.set(0, 0, 180);

renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// 1. Campo estelar (Visible desde el inicio)
const starsCount = 1400;
const starsGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(starsCount * 3);
const starCol = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount; i++) {
    const i3 = i * 3;
    starPos[i3] = (Math.random() - 0.5) * 1100;
    starPos[i3 + 1] = (Math.random() - 0.5) * 1100;
    starPos[i3 + 2] = (Math.random() - 0.5) * 1100;

    const isGold = Math.random() > 0.35;
    starCol[i3] = isGold ? 1.0 : 0.95;
    starCol[i3 + 1] = isGold ? 0.88 : 0.95;
    starCol[i3 + 2] = isGold ? 0.35 : 1.0;
}

starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
starsGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));

const starMat = new THREE.PointsMaterial({
    size: 2.8,
    map: createCircleStarTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending
});
starPoints = new THREE.Points(starsGeo, starMat);
scene.add(starPoints);

// 2. Estrellas fugaces (Visibles desde el inicio)
for (let i = 0; i < 4; i++) {
    shootingStars.push(new CosmicShootingStar());
}

// 3. Grupo de Girasoles 3D (Oculto al inicio)
window.sunflowersGroup = new THREE.Group();
window.sunflowersGroup.visible = false;
scene.add(window.sunflowersGroup);

const sTex = createSunflowerTexture();
const sGeo = new THREE.PlaneGeometry(10, 10);
const sMat = new THREE.MeshBasicMaterial({
    map: sTex,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false
});

for (let i = 0; i < 90; i++) {
    const mesh = new THREE.Mesh(sGeo, sMat.clone());
    const r = 75 + Math.random() * 230;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    mesh.position.x = r * Math.sin(phi) * Math.cos(theta);
    mesh.position.y = r * Math.sin(phi) * Math.sin(theta);
    mesh.position.z = r * Math.cos(phi);

    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.rotation.z = Math.random() * Math.PI;

    const sc = 0.65 + Math.random() * 0.75;
    mesh.scale.set(sc, sc, sc);

    mesh.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.01,
        rotSpeedY: (Math.random() - 0.5) * 0.01,
        originalY: mesh.position.y,
        seed: Math.random() * 100
    };
    window.sunflowersGroup.add(mesh);
}

// 4. Grupo de Frases 3D (Oculto al inicio)
window.phrasesGroup = new THREE.Group();
window.phrasesGroup.visible = false;
scene.add(window.phrasesGroup);

romanticPhrases.forEach((phrase, idx) => {
    const pTex = createPhraseTexture(phrase);
    const spMat = new THREE.SpriteMaterial({
        map: pTex,
        transparent: true,
        opacity: 0.95
    });
    const sp = new THREE.Sprite(spMat);
    const r = 95 + Math.random() * 130;
    const ang = (idx / romanticPhrases.length) * Math.PI * 2 + Math.random() * 0.4;
    const yOff = (Math.random() - 0.5) * 110;

    sp.position.x = Math.cos(ang) * r;
    sp.position.y = yOff;
    sp.position.z = Math.sin(ang) * r - 20;

    sp.scale.set(32, 7.5, 1);
    sp.userData = {
        originalY: yOff,
        seed: idx
    };
    window.phrasesGroup.add(sp);
});

scene.add(new THREE.AmbientLight(0xffffff, 1.2));
window.addEventListener('resize', onResize);


}

function onResize() {
if (!camera || !renderer) return;
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
}

// ==========================================
// CONTROLES DE ARRASTRE Y ROTACIÓN 360°
// ==========================================
function handleDragStart(e) {
if (e.target && e.target.closest('button, input, form, #envelopeClickTarget, .wax-seal-container, #closeLetterButton, #cardPhotoFrame')) {
return;
}
if (!window.isUniverseActive) return;

if (e.touches && e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    touchStartPinchDist = Math.hypot(dx, dy);
    return;
}

isDraggingScene = true;
prevPointer = {
    x: e.clientX || (e.touches && e.touches[0].clientX) || 0,
    y: e.clientY || (e.touches && e.touches[0].clientY) || 0
};


}

function handleDragMove(e) {
if (!window.isUniverseActive) return;

// Gesto de pellizco en móviles (Pinch to Zoom)
if (e.touches && e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const currentPinchDist = Math.hypot(dx, dy);
    if (touchStartPinchDist > 0) {
        const diff = touchStartPinchDist - currentPinchDist;
        targetCamDist = Math.max(MIN_CAM_DIST, Math.min(MAX_CAM_DIST, targetCamDist + diff * 0.9));
    }
    touchStartPinchDist = currentPinchDist;
    return;
}

const curX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
const curY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

if (isDraggingScene) {
    const dx = curX - prevPointer.x;
    const dy = curY - prevPointer.y;

    window.targetRotY += dx * 0.003;
    window.targetRotX += dy * 0.003;
    window.targetRotX = Math.max(-Math.PI * 0.35, Math.min(Math.PI * 0.35, window.targetRotX));

    prevPointer = { x: curX, y: curY };
}

const card = document.getElementById('parchmentCard');
if (card && !isDraggingScene) {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const tiltY = ((curX - cx) / cx) * 10;
    const tiltX = -((curY - cy) / cy) * 10;
    card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(12px)`;
}


}

function handleDragEnd(e) {
if (e.touches && e.touches.length < 2) {
touchStartPinchDist = 0;
}
if (!e.touches || e.touches.length === 0) {
isDraggingScene = false;
}
}

window.addEventListener('mousedown', handleDragStart);
window.addEventListener('mousemove', handleDragMove);
window.addEventListener('mouseup', handleDragEnd);

window.addEventListener('touchstart', handleDragStart, { passive: true });
window.addEventListener('touchmove', handleDragMove, { passive: true });
window.addEventListener('touchend', handleDragEnd, { passive: true });

// Zoom con rueda del ratón
window.addEventListener('wheel', (e) => {
if (!window.isUniverseActive) return;
if (e.target && e.target.closest('#aiStudioModal, #customizerModal')) return;
targetCamDist += e.deltaY * 0.3;
targetCamDist = Math.max(MIN_CAM_DIST, Math.min(MAX_CAM_DIST, targetCamDist));
}, { passive: true });

// ==========================================
// RÁFAGAS 2D DE PÉTALOS Y DESTELLOS
// ==========================================
const bCanvas = document.getElementById('burstCanvas');
const bCtx = bCanvas.getContext('2d');
let bW = bCanvas.width = window.innerWidth;
let bH = bCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
bW = bCanvas.width = window.innerWidth;
bH = bCanvas.height = window.innerHeight;
});

const burstParticles = [];

class BurstPetal {
constructor(x, y) {
this.x = x;
this.y = y;
const ang = Math.random() * Math.PI * 2;
const spd = 3.5 + Math.random() * 8.5;
this.vx = Math.cos(ang) * spd;
this.vy = Math.sin(ang) * spd - 2.5;
this.life = 1;
this.decay = 0.009 + Math.random() * 0.012;
this.size = 8 + Math.random() * 11;
this.rot = Math.random() * 360;
this.rotSpd = -3 + Math.random() * 6;
this.color = ['#facc15', '#fef08a', '#fbbf24', '#f59e0b'][Math.floor(Math.random() * 4)];
}

update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.12;
    this.vx *= 0.98;
    this.rot += this.rotSpd;
    this.life -= this.decay;
}

draw() {
    bCtx.save();
    bCtx.translate(this.x, this.y);
    bCtx.rotate((this.rot * Math.PI) / 180);
    bCtx.globalAlpha = Math.max(0, this.life);

    bCtx.fillStyle = this.color;
    bCtx.beginPath();
    bCtx.moveTo(0, -this.size);
    bCtx.quadraticCurveTo(this.size * 0.8, 0, 0, this.size);
    bCtx.quadraticCurveTo(-this.size * 0.8, 0, 0, -this.size);
    bCtx.closePath();
    bCtx.fill();

    bCtx.restore();
}


}

window.createPetalBurst = function(x, y, count = 35) {
for (let i = 0; i < count; i++) {
burstParticles.push(new BurstPetal(x, y));
}
};
window.addEventListener('pointerdown', (e) => {
    if (e.target && e.target.closest('button, input, form, #envelopeClickTarget, .wax-seal-container')) return;
    if (window.isUniverseActive) {
        window.createPetalBurst(e.clientX, e.clientY, 14);
        playChimeNote();
    }
});

// ==========================================
// MÚSICA Y AUDIO
// ==========================================
let audioCtx = null;
window.isMusicActive = false;
let melodyIdx = 0;
let melodyTimer = null;

// Canción fija por defecto: coloca tu archivo de audio en la misma carpeta
window.customAudioUrl = "Ed Sheeran - photograph sub español.mp3";
window.customAudioPlayer = new Audio("Ed Sheeran - photograph sub español.mp3");
window.customAudioPlayer.loop = true;

window.cargarCancionPersonalizada = function(e) {
    if (!e.target || !e.target.files || !e.target.files[0]) return;

if (window.customAudioUrl) {
    URL.revokeObjectURL(window.customAudioUrl);
}
window.customAudioUrl = URL.createObjectURL(file);

if (!window.customAudioPlayer) {
    window.customAudioPlayer = new Audio();
    window.customAudioPlayer.loop = true;
}
window.customAudioPlayer.src = window.customAudioUrl;

if (melodyTimer) clearTimeout(melodyTimer);

const lbl = document.getElementById('customSongLabel');
if (lbl) {
    lbl.textContent = "🎵 " + (file.name.length > 24 ? file.name.substring(0, 22) + "..." : file.name);
}

window.mostrarNotificacion("Canción personalizada cargada", "🎶");

if (window.isMusicActive) {
    window.customAudioPlayer.play().catch(console.error);
}


};

const chimeScale = [
523.25, 659.25, 783.99, 1046.50, 880.00, 783.99, 659.25, 523.25,
587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1046.50, 783.99,
659.25, 587.33, 523.25, 440.00, 523.25, 659.25, 783.99, 523.25
];

function initAudioContext() {
if (!audioCtx) {
const AudioConstructor = window.AudioContext || window.webkitAudioContext;
audioCtx = new AudioConstructor();
}
if (audioCtx.state === 'suspended') {
audioCtx.resume();
}
}

function triggerChimeSound(freq, dur = 1.4, vol = 0.08) {
if (!audioCtx) return;
try {
const osc = audioCtx.createOscillator();
const gain = audioCtx.createGain();
osc.type = 'sine';
osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(vol, audioCtx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + dur);
} catch (err) {
    console.error(err);
}


}

function playChimeNote() {
if (!window.isMusicActive) return;
const note = chimeScale[Math.floor(Math.random() * chimeScale.length)];
triggerChimeSound(note, 1.2, 0.05);
}

function runMelodyLoop() {
if (!window.isMusicActive) return;
const note = chimeScale[melodyIdx % chimeScale.length];
triggerChimeSound(note, 1.8, 0.07);

if (melodyIdx % 4 === 0) {
    triggerChimeSound(note / 2, 2.4, 0.03);
}

melodyIdx++;
const rhythm = [520, 680, 820, 600];
melodyTimer = setTimeout(runMelodyLoop, rhythm[melodyIdx % rhythm.length]);


}

window.setMusicState = function(targetState = null) {
initAudioContext();
window.isMusicActive = targetState !== null ? targetState : !window.isMusicActive;

const musicSvg = document.getElementById('musicSvg');
const musicLabel = document.getElementById('musicLabel');
const musicBtn = document.getElementById('musicBtn');

if (window.isMusicActive) {
    if (musicLabel) musicLabel.innerText = 'Música: Sonando';
    if (musicSvg) musicSvg.style.animationPlayState = 'running';
    if (musicBtn) musicBtn.classList.add('border-yellow-400', 'bg-yellow-500/20');
    
    if (window.customAudioPlayer && window.customAudioUrl) {
        window.customAudioPlayer.play().catch(console.error);
    } else {
        runMelodyLoop();
    }
} else {
    if (musicLabel) musicLabel.innerText = 'Música: Silencio';
    if (musicSvg) musicSvg.style.animationPlayState = 'paused';
    if (musicBtn) musicBtn.classList.remove('border-yellow-400', 'bg-yellow-500/20');
    if (melodyTimer) clearTimeout(melodyTimer);
    if (window.customAudioPlayer) {
        window.customAudioPlayer.pause();
    }
}


};

window.toggleMusica = function(e) {
if (e && e.stopPropagation) e.stopPropagation();
window.setMusicState();
};

// ==========================================
// BUCLE PRINCIPAL DE ANIMACIÓN
// ==========================================
const clock = new THREE.Clock();

function animateLoop() {
requestAnimationFrame(animateLoop);
const delta = clock.getElapsedTime();

// 1. Estrellas de fondo y estrellas fugaces (Siempre activas)
for (let i = 0; i < shootingStars.length; i++) {
    shootingStars[i].update();
}
if (starPoints) starPoints.rotation.y = delta * 0.012;

// 2. Universo 3D de girasoles y frases (Activo solo al abrir la carta)
if (window.isUniverseActive) {
    currentRotX += (window.targetRotX - currentRotX) * 0.08;
    currentRotY += (window.targetRotY - currentRotY) * 0.08;
    currentCamDist += (targetCamDist - currentCamDist) * 0.08;

    if (camera) {
        camera.position.x = currentCamDist * Math.sin(currentRotY) * Math.cos(currentRotX);
        camera.position.y = currentCamDist * Math.sin(currentRotX);
        camera.position.z = currentCamDist * Math.cos(currentRotY) * Math.cos(currentRotX);
        camera.lookAt(0, 0, 0);
    }

    if (window.sunflowersGroup && window.sunflowersGroup.children) {
        for (let i = 0; i < window.sunflowersGroup.children.length; i++) {
            const s = window.sunflowersGroup.children[i];
            s.rotation.x += s.userData.rotSpeedX;
            s.rotation.y += s.userData.rotSpeedY;
            s.position.y = s.userData.originalY + Math.sin(delta * 1.4 + s.userData.seed) * 4;
        }
    }

    if (window.phrasesGroup && window.phrasesGroup.children) {
        for (let i = 0; i < window.phrasesGroup.children.length; i++) {
            const p = window.phrasesGroup.children[i];
            p.position.y = p.userData.originalY + Math.sin(delta * 1.2 + p.userData.seed) * 3.5;
        }
    }
} else {
    if (camera) {
        camera.position.set(0, 0, 180);
        camera.lookAt(0, 0, 0);
    }
}

if (renderer && scene && camera) {
    renderer.render(scene, camera);
}

// 3. Renderizado de ráfagas 2D de pétalos
bCtx.clearRect(0, 0, bW, bH);
for (let i = burstParticles.length - 1; i >= 0; i--) {
    const p = burstParticles[i];
    p.update();
    p.draw();
    if (p.life <= 0) {
        burstParticles.splice(i, 1);
    }
}


}

// Iniciar al cargar la ventana
window.onload = function() {
initThreeScene();
animateLoop();
};