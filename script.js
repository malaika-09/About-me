// =============================================
//  MALAIKA TAUQEER — PORTFOLIO SCRIPTS
//  Particles | Typewriter | Animations | Space Invader Game
// =============================================

// =============================================
//  1. PARTICLE BACKGROUND
// =============================================
const bgCanvas = document.getElementById('bgCanvas');
const bctx = bgCanvas.getContext('2d');

function resizeCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); });

const PCOUNT = 100;
const pts = [];

class Particle {
  constructor() { this.reset(true); }
  reset(rand = false) {
    this.x = Math.random() * bgCanvas.width;
    this.y = rand ? Math.random() * bgCanvas.height : (Math.random() > 0.5 ? -5 : bgCanvas.height + 5);
    this.r = Math.random() * 1.4 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.38;
    this.vy = (Math.random() - 0.5) * 0.38;
    this.alpha = Math.random() * 0.45 + 0.08;
    const rnd = Math.random();
    this.color = rnd > 0.65 ? '#00d4ff' : rnd > 0.35 ? '#7b2fff' : '#ffffff';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < -10 || this.x > bgCanvas.width + 10 || this.y < -10 || this.y > bgCanvas.height + 10) this.reset();
  }
  draw() {
    bctx.beginPath();
    bctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    bctx.fillStyle = this.color;
    bctx.globalAlpha = this.alpha;
    bctx.fill();
    bctx.globalAlpha = 1;
  }
}

for (let i = 0; i < PCOUNT; i++) pts.push(new Particle());

function drawConnections() {
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) {
        bctx.beginPath();
        bctx.moveTo(pts[i].x, pts[i].y);
        bctx.lineTo(pts[j].x, pts[j].y);
        bctx.strokeStyle = `rgba(0,212,255,${0.07 * (1 - d / 110)})`;
        bctx.lineWidth = 0.5;
        bctx.stroke();
      }
    }
  }
}

function animParticles() {
  bctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  pts.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animParticles);
}
animParticles();

// =============================================
//  2. TYPEWRITER
// =============================================
const phrases = [
  'Electrical Engineer',
  'IoT Developer',
  'Embedded Systems Engineer',
  'Python Developer',
  'Teaching Assistant @ UMT',
  'NTDC Engineer Intern',
  'IEEE Student Member',
  'Circuit Catalyst Intern',
  'Problem Solver'
];
let pi = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed');

function typeLoop() {
  if (!typedEl) return;
  const cur = phrases[pi];
  typedEl.textContent = deleting ? cur.substring(0, ci--) : cur.substring(0, ci++);
  let speed = deleting ? 45 : 95;
  if (!deleting && ci > cur.length) { speed = 1800; deleting = true; }
  else if (deleting && ci < 0)     { deleting = false; pi = (pi + 1) % phrases.length; speed = 350; }
  setTimeout(typeLoop, speed);
}
typeLoop();

// =============================================
//  3. NAVBAR SCROLL + ACTIVE LINKS
// =============================================
const navbar = document.getElementById('navbar');
const nls = document.querySelectorAll('.nl');
const secs = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  let cur = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  nls.forEach(l => { l.classList.toggle('active', l.getAttribute('href') === '#' + cur); });
});

// =============================================
//  4. HAMBURGER
// =============================================
const ham = document.getElementById('ham');
const navLinks = document.getElementById('navLinks');
ham.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// =============================================
//  5. SCROLL REVEAL
// =============================================
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// =============================================
//  6. SKILL BARS
// =============================================
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.sf').forEach(bar => {
        const w = bar.getAttribute('data-w');
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
      });
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.25 });
document.querySelectorAll('.skill-cat').forEach(el => skillObs.observe(el));

// =============================================
//  7. COUNTER ANIMATION
// =============================================
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.snum').forEach(el => {
        const target = parseInt(el.getAttribute('data-t'));
        let n = 0;
        const step = Math.max(1, target / 50);
        const t = setInterval(() => {
          n = Math.min(n + step, target);
          el.textContent = Math.floor(n);
          if (n >= target) clearInterval(t);
        }, 35);
      });
      countObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
const statsRow = document.querySelector('.stats-row');
if (statsRow) countObs.observe(statsRow);

// =============================================
//  8. SMOOTH SCROLL
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// =============================================
//  9. CONTACT FORM
// =============================================
const cForm = document.getElementById('cForm');
if (cForm) {
  cForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = cForm.querySelector('button');
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg,#00ff88,#00d4ff)';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.style.background = '';
      btn.disabled = false;
      cForm.reset();
    }, 3000);
  });
}

// =============================================
//  10. MOUSE PARALLAX ON HERO ORBIT
// =============================================
const orbitWrap = document.querySelector('.orbit-wrap');
if (orbitWrap) {
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 18;
    const y = (e.clientY / window.innerHeight - 0.5) * 18;
    orbitWrap.style.transform = `translate(${x}px,${y}px)`;
  });
}

// =============================================
//  11. SPACE INVADER GAME
// =============================================
const gc = document.getElementById('gameCanvas');
const gctx = gc.getContext('2d');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const scoreEl = document.getElementById('scoreVal');
const levelEl = document.getElementById('levelVal');
const livesEl = document.getElementById('livesVal');

// Resize game canvas responsively
function resizeGame() {
  const maxW = Math.min(700, window.innerWidth - 32);
  gc.style.width = maxW + 'px';
  gc.style.height = Math.round(maxW * 0.643) + 'px';
}
resizeGame();
window.addEventListener('resize', resizeGame);

const G = {
  W: 700, H: 450,
  running: false, paused: false, over: false,
  score: 0, level: 1, lives: 3,
  loop: null, frame: 0,
  keys: {}
};

// Player
const player = {
  x: 340, y: 400, w: 40, h: 20, speed: 6,
  color: '#00d4ff', shootCd: 0,
  draw() {
    // ship body
    gctx.fillStyle = this.color;
    gctx.beginPath();
    gctx.moveTo(this.x, this.y - this.h);
    gctx.lineTo(this.x - this.w / 2, this.y);
    gctx.lineTo(this.x + this.w / 2, this.y);
    gctx.closePath();
    gctx.fill();
    // engine glow
    gctx.fillStyle = 'rgba(0,212,255,0.3)';
    gctx.beginPath();
    gctx.ellipse(this.x, this.y + 3, 10, 5, 0, 0, Math.PI * 2);
    gctx.fill();
    // cockpit
    gctx.fillStyle = '#fff';
    gctx.beginPath();
    gctx.ellipse(this.x, this.y - 8, 5, 7, 0, 0, Math.PI * 2);
    gctx.fill();
  },
  move() {
    if ((G.keys['ArrowLeft'] || G.keys['a']) && this.x - this.w / 2 > 0) this.x -= this.speed;
    if ((G.keys['ArrowRight'] || G.keys['d']) && this.x + this.w / 2 < G.W) this.x += this.speed;
    if (this.shootCd > 0) this.shootCd--;
  }
};

// Bullets
const bullets = [];
const eBullets = [];

function shoot() {
  if (player.shootCd > 0) return;
  bullets.push({ x: player.x, y: player.y - player.h, w: 3, h: 12, speed: 9, color: '#00d4ff' });
  player.shootCd = 14;
}

// Enemies
let enemies = [];
let enemyDir = 1;
let enemyDropped = false;

const ENEMY_ROWS = 3;
const ENEMY_COLS = 10;
const ENEMY_TYPES = [
  { color: '#ff4d9e', pts: 30, shape: 'A' },
  { color: '#a78bfa', pts: 20, shape: 'B' },
  { color: '#00d4ff', pts: 10, shape: 'C' }
];

function initEnemies() {
  enemies = [];
  const startX = 55, startY = 60;
  const gapX = 58, gapY = 48;
  for (let r = 0; r < ENEMY_ROWS; r++) {
    for (let c = 0; c < ENEMY_COLS; c++) {
      enemies.push({
        x: startX + c * gapX, y: startY + r * gapY,
        w: 30, h: 22,
        alive: true,
        type: ENEMY_TYPES[r],
        animT: Math.random() * Math.PI * 2,
        shootChance: 0.0003 + G.level * 0.0001
      });
    }
  }
}

function drawEnemy(e) {
  if (!e.alive) return;
  e.animT += 0.06;
  const bob = Math.sin(e.animT) * 2;
  const x = e.x, y = e.y + bob;
  gctx.shadowColor = e.type.color;
  gctx.shadowBlur = 8;
  gctx.fillStyle = e.type.color;

  if (e.type.shape === 'A') {
    // Pink top row — alien with antennae
    gctx.beginPath();
    gctx.ellipse(x, y, 13, 9, 0, 0, Math.PI * 2);
    gctx.fill();
    gctx.beginPath();
    gctx.moveTo(x - 10, y + 5); gctx.lineTo(x - 6, y + 11);
    gctx.moveTo(x + 10, y + 5); gctx.lineTo(x + 6, y + 11);
    gctx.strokeStyle = e.type.color; gctx.lineWidth = 2.5;
    gctx.stroke();
    gctx.fillStyle = '#04080f';
    gctx.beginPath();
    gctx.ellipse(x - 5, y - 2, 3, 4, 0, 0, Math.PI * 2);
    gctx.ellipse(x + 5, y - 2, 3, 4, 0, 0, Math.PI * 2);
    gctx.fill();
    // antennae
    gctx.strokeStyle = e.type.color; gctx.lineWidth = 1.5;
    gctx.beginPath();
    gctx.moveTo(x - 5, y - 9); gctx.lineTo(x - 8, y - 15);
    gctx.moveTo(x + 5, y - 9); gctx.lineTo(x + 8, y - 15);
    gctx.stroke();
  } else if (e.type.shape === 'B') {
    // Purple mid row — crab
    gctx.beginPath();
    gctx.rect(x - 12, y - 8, 24, 16);
    gctx.fill();
    gctx.fillStyle = '#04080f';
    gctx.beginPath();
    gctx.rect(x - 9, y - 4, 5, 6); gctx.rect(x + 4, y - 4, 5, 6);
    gctx.fill();
    gctx.strokeStyle = e.type.color; gctx.lineWidth = 2;
    gctx.beginPath();
    gctx.moveTo(x - 12, y - 4); gctx.lineTo(x - 18, y - 8);
    gctx.moveTo(x - 12, y + 4); gctx.lineTo(x - 18, y + 8);
    gctx.moveTo(x + 12, y - 4); gctx.lineTo(x + 18, y - 8);
    gctx.moveTo(x + 12, y + 4); gctx.lineTo(x + 18, y + 8);
    gctx.stroke();
  } else {
    // Cyan bottom row — classic invader
    gctx.beginPath();
    gctx.moveTo(x - 14, y + 10); gctx.lineTo(x - 14, y - 4);
    gctx.lineTo(x - 8, y - 10); gctx.lineTo(x - 4, y - 6);
    gctx.lineTo(x + 4, y - 6); gctx.lineTo(x + 8, y - 10);
    gctx.lineTo(x + 14, y - 4); gctx.lineTo(x + 14, y + 10);
    gctx.closePath(); gctx.fill();
    gctx.fillStyle = '#04080f';
    gctx.beginPath();
    gctx.ellipse(x - 5, y, 3, 4, 0, 0, Math.PI * 2);
    gctx.ellipse(x + 5, y, 3, 4, 0, 0, Math.PI * 2);
    gctx.fill();
  }
  gctx.shadowBlur = 0;
}

// Explosions
const explosions = [];
function explode(x, y, color) {
  for (let i = 0; i < 14; i++) {
    const angle = (Math.PI * 2 / 14) * i;
    const speed = Math.random() * 3 + 1;
    explosions.push({
      x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      life: 30, color, r: Math.random() * 3 + 1
    });
  }
}

// Stars (static background)
const stars = Array.from({ length: 80 }, () => ({
  x: Math.random() * 700, y: Math.random() * 450,
  r: Math.random() * 1.2 + 0.2,
  alpha: Math.random() * 0.6 + 0.2
}));

function drawStars() {
  stars.forEach(s => {
    gctx.beginPath();
    gctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    gctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    gctx.fill();
  });
}

// Shields
const shields = [];
function initShields() {
  shields.length = 0;
  const positions = [100, 230, 370, 510, 610];
  positions.forEach(sx => {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        shields.push({ x: sx + c * 10, y: 345 + r * 10, alive: true });
      }
    }
  });
}

function drawShields() {
  shields.forEach(s => {
    if (!s.alive) return;
    gctx.fillStyle = '#00ff88';
    gctx.fillRect(s.x, s.y, 8, 8);
  });
}

// Score flash
const scoreFlashes = [];
function scoreFlash(x, y, pts, color) {
  scoreFlashes.push({ x, y, pts: '+' + pts, color, life: 50, vy: -1 });
}

// Overlay
function drawOverlay(title, sub, sub2 = '') {
  gctx.fillStyle = 'rgba(0,0,0,0.72)';
  gctx.fillRect(0, 0, G.W, G.H);
  gctx.font = 'bold 36px Orbitron,monospace';
  gctx.textAlign = 'center';
  gctx.fillStyle = '#00d4ff';
  gctx.shadowColor = '#00d4ff'; gctx.shadowBlur = 18;
  gctx.fillText(title, G.W / 2, G.H / 2 - 30);
  gctx.shadowBlur = 0;
  gctx.font = '16px "Share Tech Mono",monospace';
  gctx.fillStyle = '#8892a4';
  gctx.fillText(sub, G.W / 2, G.H / 2 + 15);
  if (sub2) gctx.fillText(sub2, G.W / 2, G.H / 2 + 40);
  gctx.textAlign = 'left';
}

// HUD
function drawHUD() {
  gctx.font = '13px "Share Tech Mono",monospace';
  gctx.fillStyle = 'rgba(0,212,255,0.15)';
  gctx.fillRect(0, G.H - 28, G.W, 28);
  gctx.fillStyle = '#00d4ff';
  gctx.fillText('SCORE: ' + G.score, 15, G.H - 10);
  gctx.fillText('LEVEL: ' + G.level, G.W / 2 - 35, G.H - 10);
  gctx.fillText('LIVES: ' + '♥'.repeat(G.lives), G.W - 120, G.H - 10);
}

// Enemy movement speed
function enemySpeed() { return (1.0 + (G.level - 1) * 0.4) * (1 + (30 - enemies.filter(e => e.alive).length) * 0.03); }

// Main game loop
function gameLoop() {
  if (!G.running || G.paused) return;
  G.frame++;

  // Clear
  gctx.fillStyle = '#000814';
  gctx.fillRect(0, 0, G.W, G.H);
  drawStars();
  drawShields();

  // Player move & draw
  player.move();
  player.draw();

  // Enemy shoot
  enemies.forEach(e => {
    if (e.alive && Math.random() < e.shootChance) {
      eBullets.push({ x: e.x, y: e.y + 12, w: 3, h: 10, speed: 4 + G.level, color: e.type.color });
    }
  });

  // Move enemies
  let edgeHit = false;
  const aliveEnemies = enemies.filter(e => e.alive);
  aliveEnemies.forEach(e => { e.x += enemySpeed() * enemyDir; });
  aliveEnemies.forEach(e => {
    if (e.x + e.w / 2 >= G.W - 10 || e.x - e.w / 2 <= 10) edgeHit = true;
  });
  if (edgeHit) {
    enemyDir *= -1;
    aliveEnemies.forEach(e => { e.y += 18; });
  }
  enemies.forEach(e => drawEnemy(e));

  // Enemy reaches bottom
  if (aliveEnemies.some(e => e.y + e.h >= player.y - 20)) {
    endGame(); return;
  }

  // Player bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.y -= b.speed;
    gctx.shadowColor = b.color; gctx.shadowBlur = 8;
    gctx.fillStyle = b.color;
    gctx.fillRect(b.x - b.w / 2, b.y, b.w, b.h);
    gctx.shadowBlur = 0;
    if (b.y < 0) { bullets.splice(i, 1); continue; }

    // Hit shield
    let hitShield = false;
    for (let s = shields.length - 1; s >= 0; s--) {
      const sh = shields[s];
      if (!sh.alive) continue;
      if (b.x > sh.x && b.x < sh.x + 8 && b.y > sh.y && b.y < sh.y + 8) {
        sh.alive = false; bullets.splice(i, 1); hitShield = true; break;
      }
    }
    if (hitShield) continue;

    // Hit enemy
    let hit = false;
    for (let j = 0; j < enemies.length; j++) {
      const e = enemies[j];
      if (!e.alive) continue;
      if (b.x > e.x - e.w / 2 && b.x < e.x + e.w / 2 && b.y > e.y - e.h && b.y < e.y + e.h / 2) {
        e.alive = false;
        G.score += e.type.pts;
        scoreEl.textContent = G.score;
        explode(e.x, e.y, e.type.color);
        scoreFlash(e.x, e.y, e.type.pts, e.type.color);
        bullets.splice(i, 1); hit = true; break;
      }
    }
    if (hit) continue;
  }

  // Enemy bullets
  for (let i = eBullets.length - 1; i >= 0; i--) {
    const b = eBullets[i];
    b.y += b.speed;
    gctx.shadowColor = b.color; gctx.shadowBlur = 6;
    gctx.fillStyle = b.color;
    gctx.fillRect(b.x - b.w / 2, b.y, b.w, b.h);
    gctx.shadowBlur = 0;
    if (b.y > G.H) { eBullets.splice(i, 1); continue; }

    // Hit shield
    let hitS = false;
    for (let s = shields.length - 1; s >= 0; s--) {
      const sh = shields[s];
      if (!sh.alive) continue;
      if (b.x > sh.x && b.x < sh.x + 8 && b.y > sh.y && b.y < sh.y + 8) {
        sh.alive = false; eBullets.splice(i, 1); hitS = true; break;
      }
    }
    if (hitS) continue;

    // Hit player
    if (b.x > player.x - player.w / 2 && b.x < player.x + player.w / 2 &&
        b.y > player.y - player.h && b.y < player.y) {
      eBullets.splice(i, 1);
      G.lives--;
      livesEl.textContent = '❤️'.repeat(G.lives);
      explode(player.x, player.y - 10, '#00d4ff');
      if (G.lives <= 0) { endGame(); return; }
    }
  }

  // Explosions
  for (let i = explosions.length - 1; i >= 0; i--) {
    const ex = explosions[i];
    ex.x += ex.vx; ex.y += ex.vy; ex.life--;
    gctx.beginPath();
    gctx.arc(ex.x, ex.y, ex.r, 0, Math.PI * 2);
    gctx.fillStyle = ex.color;
    gctx.globalAlpha = ex.life / 30;
    gctx.fill();
    gctx.globalAlpha = 1;
    if (ex.life <= 0) explosions.splice(i, 1);
  }

  // Score flashes
  for (let i = scoreFlashes.length - 1; i >= 0; i--) {
    const sf = scoreFlashes[i];
    sf.y += sf.vy; sf.life--;
    gctx.font = 'bold 14px "Share Tech Mono",monospace';
    gctx.fillStyle = sf.color;
    gctx.globalAlpha = sf.life / 50;
    gctx.textAlign = 'center';
    gctx.fillText(sf.pts, sf.x, sf.y);
    gctx.textAlign = 'left';
    gctx.globalAlpha = 1;
    if (sf.life <= 0) scoreFlashes.splice(i, 1);
  }

  // All enemies dead — next level!
  if (enemies.filter(e => e.alive).length === 0) { nextLevel(); return; }

  drawHUD();
  G.loop = requestAnimationFrame(gameLoop);
}

function startGame() {
  G.score = 0; G.level = 1; G.lives = 3;
  G.running = true; G.paused = false; G.over = false;
  G.frame = 0;
  player.x = 350; player.y = 400; player.shootCd = 0;
  bullets.length = 0; eBullets.length = 0; explosions.length = 0; scoreFlashes.length = 0;
  enemyDir = 1;
  initEnemies();
  initShields();
  scoreEl.textContent = '0';
  levelEl.textContent = '1';
  livesEl.textContent = '❤️❤️❤️';
  startBtn.innerHTML = '<i class="fas fa-redo"></i> Restart';
  pauseBtn.disabled = false;
  pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
  if (G.loop) cancelAnimationFrame(G.loop);
  G.loop = requestAnimationFrame(gameLoop);
}

function nextLevel() {
  G.level++;
  levelEl.textContent = G.level;
  bullets.length = 0; eBullets.length = 0;
  enemyDir = 1;
  initEnemies();
  initShields();

  // Flash level up
  gctx.fillStyle = 'rgba(0,0,0,0.8)';
  gctx.fillRect(0, 0, G.W, G.H);
  gctx.font = 'bold 32px Orbitron,monospace';
  gctx.textAlign = 'center';
  gctx.fillStyle = '#00d4ff';
  gctx.shadowColor = '#00d4ff'; gctx.shadowBlur = 20;
  gctx.fillText('LEVEL ' + G.level, G.W / 2, G.H / 2);
  gctx.shadowBlur = 0;
  gctx.font = '15px "Share Tech Mono",monospace';
  gctx.fillStyle = '#8892a4';
  gctx.fillText('Enemies faster...', G.W / 2, G.H / 2 + 35);
  gctx.textAlign = 'left';

  setTimeout(() => {
    if (G.running) G.loop = requestAnimationFrame(gameLoop);
  }, 1200);
}

function endGame() {
  G.running = false; G.over = true;
  cancelAnimationFrame(G.loop);
  drawOverlay('GAME OVER', 'Score: ' + G.score + '  |  Level: ' + G.level, 'Press Start to play again');
  pauseBtn.disabled = true;
  startBtn.innerHTML = '<i class="fas fa-play"></i> Start Game';
}

function togglePause() {
  if (!G.running) return;
  G.paused = !G.paused;
  pauseBtn.innerHTML = G.paused
    ? '<i class="fas fa-play"></i> Resume'
    : '<i class="fas fa-pause"></i> Pause';
  if (!G.paused) G.loop = requestAnimationFrame(gameLoop);
  else drawOverlay('PAUSED', 'Press Resume to continue');
}

// Draw initial screen
(function drawInitScreen() {
  gctx.fillStyle = '#000814';
  gctx.fillRect(0, 0, G.W, G.H);
  drawStars();
  drawOverlay('SPACE INVADERS', 'Built by Malaika Tauqeer', 'Press Start Game to play!');
})();

// Buttons
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);

// Keyboard
document.addEventListener('keydown', e => {
  G.keys[e.key] = true;
  if ((e.key === ' ' || e.key === 'ArrowUp') && G.running && !G.paused) {
    e.preventDefault(); shoot();
  }
  if (e.key === 'p' || e.key === 'P') togglePause();
});
document.addEventListener('keyup', e => { G.keys[e.key] = false; });

// Mobile controls
const mcLeft  = document.getElementById('mc-left');
const mcRight = document.getElementById('mc-right');
const mcFire  = document.getElementById('mc-fire');

function mcPress(key, state) { G.keys[key] = state; }

if (mcLeft) {
  mcLeft.addEventListener('touchstart',  e => { e.preventDefault(); mcPress('ArrowLeft', true);  });
  mcLeft.addEventListener('touchend',    e => { e.preventDefault(); mcPress('ArrowLeft', false); });
  mcLeft.addEventListener('mousedown',   () => mcPress('ArrowLeft', true));
  mcLeft.addEventListener('mouseup',     () => mcPress('ArrowLeft', false));
}
if (mcRight) {
  mcRight.addEventListener('touchstart', e => { e.preventDefault(); mcPress('ArrowRight', true);  });
  mcRight.addEventListener('touchend',   e => { e.preventDefault(); mcPress('ArrowRight', false); });
  mcRight.addEventListener('mousedown',  () => mcPress('ArrowRight', true));
  mcRight.addEventListener('mouseup',    () => mcPress('ArrowRight', false));
}
if (mcFire) {
  mcFire.addEventListener('touchstart', e => { e.preventDefault(); if (G.running && !G.paused) shoot(); });
  mcFire.addEventListener('click',      () => { if (G.running && !G.paused) shoot(); });
}

// Auto-shoot when left/right held on mobile
setInterval(() => {
  if (G.running && !G.paused && (G.keys['ArrowLeft'] || G.keys['ArrowRight'])) {
    // just move, shoot only on tap
  }
}, 100);
