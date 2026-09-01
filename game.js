// =============================================
//  SPACE INVADER GAME — Malaika Tauqeer
// =============================================

const gc       = document.getElementById('gameCanvas');
const gctx     = gc.getContext('2d');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const scoreEl  = document.getElementById('scoreVal');
const levelEl  = document.getElementById('levelVal');
const livesEl  = document.getElementById('livesVal');

// Responsive canvas
function resizeGame() {
  const maxW = Math.min(700, window.innerWidth - 32);
  gc.style.width  = maxW + 'px';
  gc.style.height = Math.round(maxW * 0.643) + 'px';
}
resizeGame();
window.addEventListener('resize', resizeGame);

// Game state
const G = { W:700, H:450, running:false, paused:false, score:0, level:1, lives:3, loop:null, keys:{} };

// ---- Player ----
const player = {
  x:350, y:405, w:40, h:20, speed:6, shootCd:0,
  draw() {
    // body
    gctx.fillStyle = '#00d4ff';
    gctx.shadowColor = '#00d4ff'; gctx.shadowBlur = 12;
    gctx.beginPath();
    gctx.moveTo(this.x, this.y - this.h);
    gctx.lineTo(this.x - this.w/2, this.y);
    gctx.lineTo(this.x + this.w/2, this.y);
    gctx.closePath(); gctx.fill();
    // cockpit
    gctx.fillStyle = '#ffffff'; gctx.shadowBlur = 0;
    gctx.beginPath();
    gctx.ellipse(this.x, this.y - 9, 5, 7, 0, 0, Math.PI*2);
    gctx.fill();
    // engine glow
    gctx.fillStyle = 'rgba(0,212,255,0.25)';
    gctx.beginPath();
    gctx.ellipse(this.x, this.y + 3, 10, 5, 0, 0, Math.PI*2);
    gctx.fill();
    gctx.shadowBlur = 0;
  },
  move() {
    if ((G.keys['ArrowLeft']  || G.keys['a']) && this.x - this.w/2 > 5)      this.x -= this.speed;
    if ((G.keys['ArrowRight'] || G.keys['d']) && this.x + this.w/2 < G.W-5)  this.x += this.speed;
    if (this.shootCd > 0) this.shootCd--;
  }
};

// ---- Bullets ----
const bullets  = [];   // player bullets
const eBullets = [];   // enemy bullets

function playerShoot() {
  if (player.shootCd > 0) return;
  bullets.push({ x:player.x, y:player.y - player.h - 2, speed:9, color:'#00d4ff' });
  player.shootCd = 14;
}

// ---- Enemies ----
let enemies = [], enemyDir = 1;

const ETYPES = [
  { color:'#ff4d9e', pts:30, shape:'A' },
  { color:'#a78bfa', pts:20, shape:'B' },
  { color:'#00d4ff', pts:10, shape:'C' }
];

function initEnemies() {
  enemies = [];
  const cols = 10, rows = 3;
  const startX = 55, startY = 60, gx = 58, gy = 48;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      enemies.push({
        x: startX + c*gx, y: startY + r*gy,
        alive: true, type: ETYPES[r],
        t: Math.random()*Math.PI*2,
        shootChance: 0.0003 + G.level * 0.0001
      });
}

function drawEnemy(e) {
  if (!e.alive) return;
  e.t += 0.06;
  const x = e.x, y = e.y + Math.sin(e.t)*2;
  gctx.shadowColor = e.type.color; gctx.shadowBlur = 8;
  gctx.fillStyle   = e.type.color;

  if (e.type.shape === 'A') {
    gctx.beginPath(); gctx.ellipse(x, y, 13, 9, 0, 0, Math.PI*2); gctx.fill();
    gctx.strokeStyle = e.type.color; gctx.lineWidth = 2.5;
    gctx.beginPath();
    gctx.moveTo(x-10,y+5); gctx.lineTo(x-6,y+11);
    gctx.moveTo(x+10,y+5); gctx.lineTo(x+6,y+11);
    gctx.stroke();
    gctx.fillStyle = '#04080f';
    gctx.beginPath(); gctx.ellipse(x-5,y-2,3,4,0,0,Math.PI*2); gctx.fill();
    gctx.beginPath(); gctx.ellipse(x+5,y-2,3,4,0,0,Math.PI*2); gctx.fill();
    gctx.strokeStyle = e.type.color; gctx.lineWidth = 1.5;
    gctx.beginPath();
    gctx.moveTo(x-5,y-9); gctx.lineTo(x-8,y-16);
    gctx.moveTo(x+5,y-9); gctx.lineTo(x+8,y-16);
    gctx.stroke();
  } else if (e.type.shape === 'B') {
    gctx.fillRect(x-12, y-8, 24, 16);
    gctx.fillStyle = '#04080f';
    gctx.fillRect(x-9,y-4,5,6); gctx.fillRect(x+4,y-4,5,6);
    gctx.strokeStyle = e.type.color; gctx.lineWidth = 2;
    gctx.beginPath();
    gctx.moveTo(x-12,y-4); gctx.lineTo(x-18,y-8);
    gctx.moveTo(x-12,y+4); gctx.lineTo(x-18,y+8);
    gctx.moveTo(x+12,y-4); gctx.lineTo(x+18,y-8);
    gctx.moveTo(x+12,y+4); gctx.lineTo(x+18,y+8);
    gctx.stroke();
  } else {
    gctx.beginPath();
    gctx.moveTo(x-14,y+10); gctx.lineTo(x-14,y-4);
    gctx.lineTo(x-8,y-10);  gctx.lineTo(x-4,y-6);
    gctx.lineTo(x+4,y-6);   gctx.lineTo(x+8,y-10);
    gctx.lineTo(x+14,y-4);  gctx.lineTo(x+14,y+10);
    gctx.closePath(); gctx.fill();
    gctx.fillStyle = '#04080f';
    gctx.beginPath(); gctx.ellipse(x-5,y,3,4,0,0,Math.PI*2); gctx.fill();
    gctx.beginPath(); gctx.ellipse(x+5,y,3,4,0,0,Math.PI*2); gctx.fill();
  }
  gctx.shadowBlur = 0;
}

// ---- Shields ----
const shields = [];
function initShields() {
  shields.length = 0;
  [90, 220, 350, 480, 600].forEach(sx => {
    for (let r=0;r<3;r++) for (let c=0;c<5;c++)
      shields.push({ x:sx+c*10, y:340+r*10, alive:true });
  });
}

function drawShields() {
  gctx.fillStyle = '#00ff88';
  shields.forEach(s => { if (s.alive) gctx.fillRect(s.x, s.y, 8, 8); });
}

// ---- Explosions ----
const explosions = [];
function explode(x, y, color) {
  for (let i=0;i<14;i++) {
    const a = (Math.PI*2/14)*i, sp = Math.random()*3+1;
    explosions.push({ x, y, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp, life:30, color, r:Math.random()*3+1 });
  }
}

// ---- Score flashes ----
const sFlashes = [];
function scoreFlash(x, y, pts, color) {
  sFlashes.push({ x, y, txt:'+'+pts, color, life:50, vy:-1 });
}

// ---- Stars ----
const stars = Array.from({length:90}, () => ({
  x:Math.random()*700, y:Math.random()*450,
  r:Math.random()*1.2+0.2, a:Math.random()*0.6+0.2
}));

function drawBg() {
  gctx.fillStyle = '#000814';
  gctx.fillRect(0,0,G.W,G.H);
  stars.forEach(s => {
    gctx.beginPath(); gctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    gctx.fillStyle=`rgba(255,255,255,${s.a})`; gctx.fill();
  });
}

// ---- HUD ----
function drawHUD() {
  gctx.fillStyle = 'rgba(0,212,255,0.1)';
  gctx.fillRect(0, G.H-28, G.W, 28);
  gctx.font = '13px "Share Tech Mono",monospace';
  gctx.fillStyle = '#00d4ff';
  gctx.fillText('SCORE: '+G.score,       15,    G.H-10);
  gctx.fillText('LEVEL: '+G.level,       G.W/2-35, G.H-10);
  gctx.fillText('LIVES: '+'♥'.repeat(G.lives), G.W-120, G.H-10);
}

// ---- Overlay ----
function drawOverlay(title, sub1, sub2='') {
  gctx.fillStyle = 'rgba(0,0,0,0.75)';
  gctx.fillRect(0,0,G.W,G.H);
  gctx.textAlign = 'center';
  gctx.font = 'bold 36px Orbitron,monospace';
  gctx.fillStyle = '#00d4ff';
  gctx.shadowColor = '#00d4ff'; gctx.shadowBlur = 20;
  gctx.fillText(title, G.W/2, G.H/2-30);
  gctx.shadowBlur = 0;
  gctx.font = '15px "Share Tech Mono",monospace';
  gctx.fillStyle = '#8892a4';
  gctx.fillText(sub1, G.W/2, G.H/2+12);
  if (sub2) gctx.fillText(sub2, G.W/2, G.H/2+38);
  gctx.textAlign = 'left';
}

// ---- Enemy speed ----
function eSpeed() {
  const alive = enemies.filter(e=>e.alive).length;
  return (1.0 + (G.level-1)*0.4) * (1 + (30-alive)*0.03);
}

// ---- Hit detection helpers ----
function hitShield(bx, by) {
  for (let i=shields.length-1;i>=0;i--) {
    const s=shields[i];
    if (!s.alive) continue;
    if (bx>s.x && bx<s.x+8 && by>s.y && by<s.y+8) { s.alive=false; return true; }
  }
  return false;
}

// ---- Main loop ----
function gameLoop() {
  if (!G.running || G.paused) return;

  drawBg();
  drawShields();
  player.move();
  player.draw();

  // Enemy shooting
  enemies.forEach(e => {
    if (e.alive && Math.random() < e.shootChance)
      eBullets.push({ x:e.x, y:e.y+12, speed:4+G.level, color:e.type.color });
  });

  // Move enemies
  const alive = enemies.filter(e=>e.alive);
  alive.forEach(e => { e.x += eSpeed()*enemyDir; });
  const edgeHit = alive.some(e => e.x+16 >= G.W-8 || e.x-16 <= 8);
  if (edgeHit) { enemyDir*=-1; alive.forEach(e=>{ e.y+=18; }); }
  enemies.forEach(e => drawEnemy(e));

  // Enemy reached player
  if (alive.some(e => e.y+12 >= player.y-20)) { endGame(); return; }

  // Player bullets
  for (let i=bullets.length-1;i>=0;i--) {
    const b=bullets[i];
    b.y -= b.speed;
    gctx.shadowColor=b.color; gctx.shadowBlur=8;
    gctx.fillStyle=b.color;
    gctx.fillRect(b.x-2, b.y, 4, 12);
    gctx.shadowBlur=0;
    if (b.y < 0) { bullets.splice(i,1); continue; }
    if (hitShield(b.x, b.y)) { bullets.splice(i,1); continue; }
    let hit=false;
    for (let j=0;j<enemies.length;j++) {
      const e=enemies[j]; if (!e.alive) continue;
      if (b.x>e.x-14 && b.x<e.x+14 && b.y>e.y-12 && b.y<e.y+12) {
        e.alive=false; G.score+=e.type.pts;
        scoreEl.textContent=G.score;
        explode(e.x,e.y,e.type.color);
        scoreFlash(e.x,e.y,e.type.pts,e.type.color);
        bullets.splice(i,1); hit=true; break;
      }
    }
    if (hit) continue;
  }

  // Enemy bullets
  for (let i=eBullets.length-1;i>=0;i--) {
    const b=eBullets[i];
    b.y += b.speed;
    gctx.shadowColor=b.color; gctx.shadowBlur=6;
    gctx.fillStyle=b.color;
    gctx.fillRect(b.x-2, b.y, 4, 10);
    gctx.shadowBlur=0;
    if (b.y > G.H) { eBullets.splice(i,1); continue; }
    if (hitShield(b.x, b.y)) { eBullets.splice(i,1); continue; }
    if (b.x>player.x-20 && b.x<player.x+20 && b.y>player.y-20 && b.y<player.y+5) {
      eBullets.splice(i,1); G.lives--;
      livesEl.textContent = '❤️'.repeat(Math.max(0,G.lives));
      explode(player.x, player.y-10, '#00d4ff');
      if (G.lives<=0) { endGame(); return; }
    }
  }

  // Explosions
  for (let i=explosions.length-1;i>=0;i--) {
    const ex=explosions[i];
    ex.x+=ex.vx; ex.y+=ex.vy; ex.life--;
    gctx.beginPath(); gctx.arc(ex.x,ex.y,ex.r,0,Math.PI*2);
    gctx.fillStyle=ex.color; gctx.globalAlpha=ex.life/30;
    gctx.fill(); gctx.globalAlpha=1;
    if (ex.life<=0) explosions.splice(i,1);
  }

  // Score flashes
  gctx.font='bold 14px "Share Tech Mono",monospace';
  gctx.textAlign='center';
  for (let i=sFlashes.length-1;i>=0;i--) {
    const f=sFlashes[i]; f.y+=f.vy; f.life--;
    gctx.fillStyle=f.color; gctx.globalAlpha=f.life/50;
    gctx.fillText(f.txt, f.x, f.y);
    gctx.globalAlpha=1;
    if (f.life<=0) sFlashes.splice(i,1);
  }
  gctx.textAlign='left';

  // All dead — level up
  if (enemies.filter(e=>e.alive).length===0) { nextLevel(); return; }

  drawHUD();
  G.loop = requestAnimationFrame(gameLoop);
}

// ---- Controls ----
function startGame() {
  G.score=0; G.level=1; G.lives=3; G.running=true; G.paused=false;
  player.x=350; player.shootCd=0;
  bullets.length=0; eBullets.length=0; explosions.length=0; sFlashes.length=0;
  enemyDir=1;
  initEnemies(); initShields();
  scoreEl.textContent='0'; levelEl.textContent='1'; livesEl.textContent='❤️❤️❤️';
  startBtn.innerHTML='<i class="fas fa-redo"></i> Restart';
  pauseBtn.disabled=false;
  pauseBtn.innerHTML='<i class="fas fa-pause"></i> Pause';
  if (G.loop) cancelAnimationFrame(G.loop);
  G.loop=requestAnimationFrame(gameLoop);
}

function nextLevel() {
  G.level++;
  levelEl.textContent=G.level;
  bullets.length=0; eBullets.length=0; enemyDir=1;
  initEnemies(); initShields();
  // Level up splash
  drawBg();
  gctx.textAlign='center';
  gctx.fillStyle='rgba(0,0,0,0.8)'; gctx.fillRect(0,0,G.W,G.H);
  gctx.font='bold 34px Orbitron,monospace';
  gctx.fillStyle='#00d4ff'; gctx.shadowColor='#00d4ff'; gctx.shadowBlur=22;
  gctx.fillText('LEVEL '+G.level, G.W/2, G.H/2-15);
  gctx.shadowBlur=0;
  gctx.font='15px "Share Tech Mono",monospace';
  gctx.fillStyle='#8892a4';
  gctx.fillText('Enemies are faster...', G.W/2, G.H/2+22);
  gctx.textAlign='left';
  setTimeout(()=>{ if(G.running) G.loop=requestAnimationFrame(gameLoop); }, 1100);
}

function endGame() {
  G.running=false; cancelAnimationFrame(G.loop);
  drawBg();
  drawOverlay('GAME OVER','Score: '+G.score+'  |  Level: '+G.level,'Press Start to play again');
  pauseBtn.disabled=true;
  startBtn.innerHTML='<i class="fas fa-play"></i> Start Game';
}

function togglePause() {
  if (!G.running) return;
  G.paused=!G.paused;
  pauseBtn.innerHTML = G.paused
    ? '<i class="fas fa-play"></i> Resume'
    : '<i class="fas fa-pause"></i> Pause';
  if (!G.paused) G.loop=requestAnimationFrame(gameLoop);
  else drawOverlay('PAUSED','Press Resume to continue');
}

// Initial screen
drawBg();
drawOverlay('SPACE INVADERS','Built by Malaika Tauqeer · Portfolio Project','Press Start Game to play!');

// Button events
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);

// Keyboard
document.addEventListener('keydown', e => {
  G.keys[e.key]=true;
  if ((e.key===' '||e.key==='ArrowUp') && G.running && !G.paused) { e.preventDefault(); playerShoot(); }
  if (e.key==='p'||e.key==='P') togglePause();
});
document.addEventListener('keyup', e => { G.keys[e.key]=false; });

// Mobile buttons
const mcL=document.getElementById('mc-left');
const mcR=document.getElementById('mc-right');
const mcF=document.getElementById('mc-fire');

[['touchstart','touchend',mcL,'ArrowLeft'],['touchstart','touchend',mcR,'ArrowRight']].forEach(([s,e,el,k])=>{
  if(!el) return;
  el.addEventListener(s, ev=>{ev.preventDefault(); G.keys[k]=true;});
  el.addEventListener(e, ev=>{ev.preventDefault(); G.keys[k]=false;});
  el.addEventListener('mousedown', ()=>G.keys[k]=true);
  el.addEventListener('mouseup',   ()=>G.keys[k]=false);
});
if(mcF){
  mcF.addEventListener('click',     ()=>{ if(G.running&&!G.paused) playerShoot(); });
  mcF.addEventListener('touchstart', ev=>{ ev.preventDefault(); if(G.running&&!G.paused) playerShoot(); });
}
