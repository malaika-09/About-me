// =============================================
//  SHARED NAVIGATION — All Pages
// =============================================

// Inject navbar into every page
function injectNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const pages = [
    { file: 'index.html',        label: 'Home',         icon: 'fa-house' },
    { file: 'about.html',        label: 'About',        icon: 'fa-user' },
    { file: 'skills.html',       label: 'Skills',       icon: 'fa-code' },
    { file: 'projects.html',     label: 'Projects',     icon: 'fa-diagram-project' },
    { file: 'certifications.html', label: 'Certs',      icon: 'fa-certificate' },
    { file: 'education.html',    label: 'Education',    icon: 'fa-graduation-cap' },
    { file: 'contact.html',      label: 'Contact',      icon: 'fa-envelope' },
    { file: 'game.html',         label: '🎮 Game',      icon: '' },
  ];

  const navHTML = `
  <nav class="navbar" id="navbar">
    <a href="index.html" class="nav-logo"><span class="bracket">&lt;</span>MT<span class="bracket">/&gt;</span></a>
    <ul class="nav-links" id="navLinks">
      ${pages.map(p => `
        <li>
          <a href="${p.file}" class="nl ${currentPage === p.file ? 'active' : ''}">
            ${p.icon ? `<i class="fas ${p.icon}"></i>` : ''} ${p.label}
          </a>
        </li>`).join('')}
    </ul>
    <div class="hamburger" id="ham"><span></span><span></span><span></span></div>
  </nav>`;

  document.body.insertAdjacentHTML('afterbegin', navHTML);

  // Hamburger
  const ham = document.getElementById('ham');
  const nl  = document.getElementById('navLinks');
  ham.addEventListener('click', () => nl.classList.toggle('open'));

  // Scroll
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
  });

  // Double click MT logo = open admin panel (secret!)
  const logo = document.querySelector('.nav-logo');
  if (logo) {
    let clickCount = 0, clickTimer;
    logo.addEventListener('click', e => {
      e.preventDefault();
      clickCount++;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        if (clickCount === 1) {
          // single click — go home
          window.location.href = 'index.html';
        }
        clickCount = 0;
      }, 400);
      if (clickCount >= 2) {
        clearTimeout(clickTimer);
        clickCount = 0;
        window.location.href = 'admin.html';
      }
    });
  }

  // Page transition
  document.querySelectorAll('.nl').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href && !href.startsWith('#') && href !== currentPage) {
        e.preventDefault();
        document.body.classList.add('page-exit');
        setTimeout(() => { window.location.href = href; }, 350);
      }
    });
  });
}

// Particle background (shared)
function initParticles(canvasId) {
  const c = document.getElementById(canvasId);
  if (!c) return;
  const ctx = c.getContext('2d');
  c.width = window.innerWidth; c.height = window.innerHeight;
  window.addEventListener('resize', () => { c.width = window.innerWidth; c.height = window.innerHeight; });

  const pts = Array.from({length: 80}, () => ({
    x: Math.random() * c.width, y: Math.random() * c.height,
    r: Math.random() * 1.3 + 0.2,
    vx: (Math.random()-.5)*.35, vy: (Math.random()-.5)*.35,
    a: Math.random()*.4+.08,
    col: Math.random()>.6?'#00d4ff':Math.random()>.4?'#7b2fff':'#fff'
  }));

  function loop() {
    ctx.clearRect(0,0,c.width,c.height);
    pts.forEach(p => {
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<-5||p.x>c.width+5||p.y<-5||p.y>c.height+5){
        p.x=Math.random()*c.width; p.y=Math.random()*c.height;
      }
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.col; ctx.globalAlpha=p.a; ctx.fill(); ctx.globalAlpha=1;
    });
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
      const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
      if(d<100){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
        ctx.strokeStyle=`rgba(0,212,255,${.06*(1-d/100)})`; ctx.lineWidth=.5; ctx.stroke(); }
    }
    requestAnimationFrame(loop);
  }
  loop();
}

// Scroll reveal (shared)
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }});
  }, {threshold:.1, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// Skill bars (shared)
function initSkillBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.querySelectorAll('.sf').forEach(b => { setTimeout(()=>{ b.style.width=b.dataset.w+'%'; },200); });
        obs.unobserve(e.target);
      }
    });
  }, {threshold:.2});
  document.querySelectorAll('.skill-cat').forEach(el => obs.observe(el));
}

// Counter (shared)
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.querySelectorAll('.snum').forEach(el => {
          const t=parseInt(el.dataset.t); let n=0;
          const step=Math.max(1,t/50);
          const tm=setInterval(()=>{ n=Math.min(n+step,t); el.textContent=Math.floor(n); if(n>=t)clearInterval(tm); },35);
        });
        obs.unobserve(e.target);
      }
    });
  }, {threshold:.4});
  document.querySelectorAll('.stats-row').forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  // Don't inject nav on admin page
  if (window.location.pathname.includes('admin')) return;
  injectNav();
  initParticles('bgCanvas');
  initReveal();
  initSkillBars();
  initCounters();
  document.body.classList.add('page-enter');
});
