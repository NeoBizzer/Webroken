// ============================================
//  WEBROKEN — app.js
// ============================================

// ---- THEME TOGGLE ----
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
let currentTheme  = localStorage.getItem('wb-theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);
themeIcon.textContent = currentTheme === 'dark' ? '☀' : '☽';

themeToggle.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  themeIcon.textContent = currentTheme === 'dark' ? '☀' : '☽';
  localStorage.setItem('wb-theme', currentTheme);
});

// ---- CUSTOM CURSOR ----
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mx = 0, my = 0, tx = 0, ty = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
});
(function animTrail() {
  tx += (mx - tx) * 0.12; ty += (my - ty) * 0.12;
  cursorTrail.style.transform = `translate(${tx - 15}px, ${ty - 15}px)`;
  requestAnimationFrame(animTrail);
})();

// ---- PETALS ----
const petalsBg  = document.getElementById('petalsBg');
const petalChars = ['🌸','🌺','🥀','❦','✿','✦','·','❋','🌹'];
for (let i = 0; i < 18; i++) {
  const p = document.createElement('div');
  p.className = 'petal';
  p.textContent = petalChars[Math.floor(Math.random() * petalChars.length)];
  p.style.left = Math.random() * 100 + 'vw';
  p.style.animationDuration = (8 + Math.random() * 14) + 's';
  p.style.animationDelay    = -(Math.random() * 15) + 's';
  p.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
  petalsBg.appendChild(p);
}

// ---- LOVE FACTS ----
const ALL_FACTS = [
  { icon:'💜', text:'Love activates the same brain regions as cocaine — it is, neurologically, an addiction.', cat:'neuroscience' },
  { icon:'🥀', text:'Heartbreak is physically real. The brain processes emotional pain identically to physical injury.', cat:'psychology' },
  { icon:'🌑', text:'Limerence — the obsessive phase of love — typically lasts 18 months to 3 years before fading.', cat:'science' },
  { icon:'🕯', text:'Looking into a loved one\'s eyes for 4 minutes induces deep feelings of affection — even between strangers.', cat:'experiment' },
  { icon:'✦', text:'Broken heart syndrome is a real medical condition. Severe emotional stress can temporarily stun the heart muscle.', cat:'medicine' },
  { icon:'🌹', text:'People tend to fall in love 3 times in their lifetime — each teaching something different about themselves.', cat:'folklore' },
  { icon:'🌙', text:'The word "love" comes from Sanskrit "lubhyati," meaning desire — desire as the very root of connection.', cat:'etymology' },
  { icon:'💀', text:'Intense romantic love and the grief of loss activate nearly identical brain patterns.', cat:'neuroscience' },
  { icon:'🖤', text:'Unrequited love stimulates the same reward areas as requited love — hope keeps us addicted either way.', cat:'psychology' },
  { icon:'🌿', text:'Holding hands with someone you love measurably reduces pain and lowers stress hormones.', cat:'science' },
  { icon:'❦', text:'Butterflies in the stomach are real — love triggers an adrenaline response that slows digestion.', cat:'biology' },
  { icon:'🫀', text:'Your heartbeat can synchronize with a partner\'s during close proximity — hearts literally beating as one.', cat:'biology' },
  { icon:'🌸', text:'The average person falls in love 7 times before finding their permanent partner.', cat:'statistics' },
  { icon:'☽', text:'Grief and romantic rejection activate identical withdrawal symptoms to substance dependency.', cat:'psychology' },
  { icon:'🕊', text:'Eye contact with a partner for two minutes increases feelings of passionate love by 44%.', cat:'experiment' },
  { icon:'🩸', text:'People who have been hurt in love have a measurably higher pain tolerance — suffering teaches endurance.', cat:'science' },
  { icon:'🕸', text:'Love is the only emotion that can simultaneously be the cause and cure of suffering.', cat:'philosophy' },
  { icon:'🌺', text:'Oxytocin, the "love hormone," is released most intensely not at the height of romance, but during loss.', cat:'biology' },
];

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

let factsShown = [];
function renderFacts() {
  const grid = document.getElementById('factsGrid');
  const remaining = ALL_FACTS.filter(f => !factsShown.includes(f.text));
  const pool = remaining.length >= 6 ? remaining : ALL_FACTS;
  const pick = shuffleArray(pool).slice(0, 6);
  factsShown = [...factsShown, ...pick.map(f => f.text)];

  grid.innerHTML = '';
  pick.forEach((f, i) => {
    const card = document.createElement('div');
    card.className = 'fact-card';
    card.style.animationDelay = (i * 0.08) + 's';
    card.innerHTML = `
      <span class="fact-icon">${f.icon}</span>
      <p class="fact-text">${f.text}</p>
      <div class="fact-category">${f.cat}</div>
    `;
    grid.appendChild(card);
  });
}
renderFacts();
document.getElementById('shuffleFacts').addEventListener('click', renderFacts);

// ---- DRAWING CANVAS ----
const canvas    = document.getElementById('drawCanvas');
const ctx       = canvas.getContext('2d');
const hint      = document.getElementById('canvasHint');
let painting    = false;
let currentTool = 'pen';
let brushSize   = 6;
let brushColor  = '#c084fc';
let hasDrawn    = false;

function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  canvas.width  = rect.width;
  canvas.height = 500;
  ctx.putImageData(imgData, 0, 0);
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg2').trim() || '#110d0f';
  if (!hasDrawn) fillCanvasBg();
}

function fillCanvasBg() {
  const bg = currentTheme === 'dark' ? '#110d0f' : '#ede5ed';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
fillCanvasBg();

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  if (e.touches) {
    return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
  }
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

canvas.addEventListener('mousedown', e => { painting = true; draw(e); });
canvas.addEventListener('mousemove', e => { if (painting) draw(e); });
canvas.addEventListener('mouseup', () => { painting = false; ctx.beginPath(); });
canvas.addEventListener('mouseleave', () => { painting = false; ctx.beginPath(); });
canvas.addEventListener('touchstart', e => { e.preventDefault(); painting = true; draw(e); }, { passive: false });
canvas.addEventListener('touchmove', e => { e.preventDefault(); if (painting) draw(e); }, { passive: false });
canvas.addEventListener('touchend', () => { painting = false; ctx.beginPath(); });

function draw(e) {
  if (!painting) return;
  if (!hasDrawn) { hint.style.opacity = '0'; hasDrawn = true; }
  const pos = getPos(e);
  ctx.lineWidth   = currentTool === 'eraser' ? brushSize * 3 : brushSize;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  ctx.strokeStyle = currentTool === 'eraser'
    ? (currentTheme === 'dark' ? '#110d0f' : '#ede5ed')
    : brushColor;

  if (currentTool === 'pen') {
    ctx.globalAlpha      = 0.9;
    ctx.shadowBlur       = 8;
    ctx.shadowColor      = brushColor;
  } else {
    ctx.globalAlpha = 1;
    ctx.shadowBlur  = 0;
  }
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

// Brush controls
document.getElementById('brushSize').addEventListener('input', function() {
  brushSize = +this.value;
  document.getElementById('brushSizeVal').textContent = brushSize + 'px';
});
document.getElementById('brushColor').addEventListener('input', function() {
  brushColor = this.value;
});

// Tool buttons
document.querySelectorAll('.tool-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTool = btn.dataset.tool;
  });
});

// Palette
const PALETTE = ['#c084fc','#e879f9','#f43f5e','#ff8fab','#fbbf24','#a3e635','#38bdf8','#34d399','#ffffff','#000000','#8b5cf6','#ec4899','#f97316','#c9a96e','#6366f1'];
const swatchCont = document.getElementById('paletteSwatch');
PALETTE.forEach(col => {
  const s = document.createElement('button');
  s.className = 'swatch';
  s.style.background = col;
  s.title = col;
  s.addEventListener('click', () => {
    brushColor = col;
    document.getElementById('brushColor').value = col;
    document.querySelectorAll('.swatch').forEach(x => x.classList.remove('active'));
    s.classList.add('active');
  });
  swatchCont.appendChild(s);
});

// Clear canvas
document.getElementById('clearCanvas').addEventListener('click', () => {
  fillCanvasBg();
  hasDrawn = false;
  hint.style.opacity = '1';
  ctx.beginPath();
});

// Save canvas to gallery
const GALLERY_KEY = 'wb-gallery';
function loadGallery() {
  try { return JSON.parse(localStorage.getItem(GALLERY_KEY)) || []; }
  catch { return []; }
}
function saveGallery(items) {
  localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
}
function renderGallery() {
  const items = loadGallery();
  const grid  = document.getElementById('galleryGrid');
  const empty = document.getElementById('emptyGallery');
  grid.innerHTML = '';
  if (!items.length) { empty.style.display = ''; return; }
  empty.style.display = 'none';
  items.slice().reverse().forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'gallery-item';
    el.style.animationDelay = (i * 0.07) + 's';
    el.innerHTML = `
      <img src="${item.data}" alt="soul art" loading="lazy" />
      <div class="gallery-item-meta">
        <span>${item.time}</span>
      </div>
    `;
    grid.appendChild(el);
  });
}
renderGallery();

document.getElementById('saveCanvas').addEventListener('click', () => {
  if (!hasDrawn) { showToast('paint something first, dear soul ✦'); return; }
  const data  = canvas.toDataURL('image/png');
  const items = loadGallery();
  const time  = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  items.push({ data, time });
  if (items.length > 30) items.shift(); // keep last 30
  saveGallery(items);
  renderGallery();
  showToast('your art has been saved to the gallery ✦');
});

// ---- CONFESSIONS ----
const CONFESS_KEY = 'wb-confessions';
function loadConfessions() {
  try { return JSON.parse(localStorage.getItem(CONFESS_KEY)) || []; }
  catch { return []; }
}
function saveConfessions(items) {
  localStorage.setItem(CONFESS_KEY, JSON.stringify(items));
}

const confessText = document.getElementById('confessText');
const confessName = document.getElementById('confessName');
const confessChar = document.getElementById('confessChar');

confessText.addEventListener('input', () => {
  confessChar.textContent = confessText.value.length + ' / 400';
});

function renderConfessions() {
  const items = loadConfessions();
  const wall  = document.getElementById('confessWall');
  wall.innerHTML = '';
  if (!items.length) {
    wall.innerHTML = '<p style="font-style:italic;color:var(--text3);text-align:center;padding:2rem;">the wall awaits its first confession…</p>';
    return;
  }
  items.slice().reverse().forEach((c, i) => {
    const el = document.createElement('div');
    el.className = 'confession-card';
    el.innerHTML = `
      <div class="confession-name">${c.name || 'anonymous soul'}</div>
      <p class="confession-text">${escapeHTML(c.text)}</p>
      <div class="confession-time">${c.time}</div>
      <button class="like-btn ${c.liked ? 'liked' : ''}" data-idx="${c.id}">
        ${c.liked ? '♥' : '♡'} ${c.likes}
      </button>
    `;
    wall.appendChild(el);
  });

  wall.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.idx;
      const all = loadConfessions();
      const item = all.find(x => x.id === id);
      if (item) {
        item.liked = !item.liked;
        item.likes += item.liked ? 1 : -1;
        saveConfessions(all);
        renderConfessions();
      }
    });
  });
}
renderConfessions();

document.getElementById('submitConfess').addEventListener('click', () => {
  const text = confessText.value.trim();
  if (!text) { showToast('your heart has more to say… ✦'); return; }
  const items = loadConfessions();
  const time  = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  items.push({
    id: Date.now().toString(),
    name: confessName.value.trim(),
    text, time, likes: 0, liked: false
  });
  if (items.length > 60) items.shift();
  saveConfessions(items);
  confessText.value = '';
  confessName.value = '';
  confessChar.textContent = '0 / 400';
  renderConfessions();
  showToast('confession whispered into the void ✦');
});

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ---- BOUQUET MAKER ----
const FLOWERS = [
  { emoji:'🌹', name:'Rose',       meaning:'deep love' },
  { emoji:'🥀', name:'Wilted Rose', meaning:'lost love' },
  { emoji:'🌸', name:'Cherry Blossom', meaning:'fleeting beauty' },
  { emoji:'💐', name:'Bouquet',    meaning:'celebration' },
  { emoji:'🌷', name:'Tulip',      meaning:'perfect love' },
  { emoji:'🌺', name:'Hibiscus',   meaning:'delicate beauty' },
  { emoji:'🌻', name:'Sunflower',  meaning:'adoration' },
  { emoji:'🌼', name:'Daisy',      meaning:'innocence' },
  { emoji:'🍀', name:'Clover',     meaning:'luck & hope' },
  { emoji:'🌿', name:'Foliage',    meaning:'growth' },
  { emoji:'🪷', name:'Lotus',      meaning:'resilience' },
  { emoji:'🫧', name:'Breath',     meaning:'gentle care' },
];

let currentBouquet = [];
const flowerOpts   = document.getElementById('flowerOptions');
const bouqPreview  = document.getElementById('bouquetPreview');
const bouqEmptyMsg = document.getElementById('bouquetEmptyMsg');

FLOWERS.forEach(f => {
  const el = document.createElement('div');
  el.className = 'flower-option';
  el.innerHTML = `
    <span class="flower-emoji">${f.emoji}</span>
    <span class="flower-name">${f.name}</span>
    <span class="flower-meaning">${f.meaning}</span>
  `;
  el.addEventListener('click', () => {
    if (currentBouquet.length >= 20) { showToast('bouquet is full — 20 flowers max ✦'); return; }
    currentBouquet.push(f.emoji);
    renderBouquetPreview();
  });
  flowerOpts.appendChild(el);
});

function renderBouquetPreview() {
  bouqPreview.innerHTML = '';
  if (!currentBouquet.length) {
    bouqPreview.appendChild(bouqEmptyMsg);
    return;
  }
  currentBouquet.forEach((em, i) => {
    const span = document.createElement('span');
    span.className = 'bouquet-flower-placed';
    span.textContent = em;
    span.style.animationDelay = '0s';
    // slight random rotation for natural feel
    span.style.transform = `rotate(${(Math.random()-0.5)*20}deg)`;
    bouqPreview.appendChild(span);
  });
}

document.getElementById('clearBouquet').addEventListener('click', () => {
  currentBouquet = [];
  renderBouquetPreview();
});

const BOUQUETS_KEY = 'wb-bouquets';
function loadBouquets() {
  try { return JSON.parse(localStorage.getItem(BOUQUETS_KEY)) || []; }
  catch { return []; }
}
function saveBouquets(items) {
  localStorage.setItem(BOUQUETS_KEY, JSON.stringify(items));
}

function renderSentBouquets() {
  const items  = loadBouquets();
  const cont   = document.getElementById('sentBouquets');
  const empty  = document.getElementById('emptyBouquets');
  cont.innerHTML = '';
  if (!items.length) { empty.style.display = ''; return; }
  empty.style.display = 'none';
  items.slice().reverse().forEach((b, i) => {
    const card = document.createElement('div');
    card.className = 'bouquet-card';
    card.style.animationDelay = (i * 0.07) + 's';
    card.innerHTML = `
      <div class="bouquet-to">✦ for ${escapeHTML(b.to || 'someone special')}</div>
      <div class="bouquet-flowers-display">${b.flowers}</div>
      ${b.message ? `<p class="bouquet-msg-text">"${escapeHTML(b.message)}"</p>` : ''}
      <div class="bouquet-timestamp">${b.time}</div>
    `;
    cont.appendChild(card);
  });
}
renderSentBouquets();

document.getElementById('sendBouquet').addEventListener('click', () => {
  if (!currentBouquet.length) { showToast('add at least one flower first ✦'); return; }
  const to      = document.getElementById('bouquetTo').value.trim();
  const message = document.getElementById('bouquetMessage').value.trim();
  const time    = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const items   = loadBouquets();
  items.push({ to, message, flowers: currentBouquet.join(''), time });
  if (items.length > 50) items.shift();
  saveBouquets(items);
  currentBouquet = [];
  document.getElementById('bouquetTo').value      = '';
  document.getElementById('bouquetMessage').value = '';
  renderBouquetPreview();
  renderSentBouquets();
  showToast('your bouquet has been sent into the world 🌹');
});

// ---- TOAST NOTIFICATION ----
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

// ---- SCROLL REVEAL ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section').forEach(s => {
  s.style.opacity = '0';
  s.style.transform = 'translateY(30px)';
  s.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  observer.observe(s);
});
