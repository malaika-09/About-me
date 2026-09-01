// =============================================
//  ADMIN PANEL — Malaika Tauqeer Portfolio
//  Full CRUD + localStorage Database
// =============================================

// ---- Default Password ----
const DEFAULT_PW = 'malaika2026';

// ---- DB Keys ----
const KEYS = {
  pw:       'mt_admin_pw',
  projects: 'mt_projects',
  skills:   'mt_skills',
  exp:      'mt_experience',
  certs:    'mt_certifications',
  edu:      'mt_education'
};

// ---- DB Helpers ----
const DB = {
  get: (key) => JSON.parse(localStorage.getItem(key) || '[]'),
  set: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
  getPw: () => localStorage.getItem(KEYS.pw) || DEFAULT_PW,
  setPw: (pw) => localStorage.setItem(KEYS.pw, pw)
};

// ---- ID Generator ----
const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2,5);

// ---- Toast ----
function toast(msg, type='success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = `toast show ${type}`;
  setTimeout(() => t.className = 'toast', 3000);
}

// ---- Modal helpers ----
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.modal));
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// ---- Init default data if empty ----
function initDefaultData() {
  if (!DB.get(KEYS.projects).length) {
    DB.set(KEYS.projects, [
      { id:uid(), name:'Heartbeat & SpO2 Monitor',    icon:'fas fa-heartbeat', desc:'Real-time health monitoring using MAX30102 sensor. Measures heart rate and SpO2 with OLED display.', tags:['Arduino','MAX30102','SpO2','OLED'], github:'https://github.com/malaika-09', live:'', img:'', status:'completed' },
      { id:uid(), name:'Line Following Robot — SoftTech\'25', icon:'fas fa-robot', desc:'Autonomous LFR using IR sensors and PID control. Top 10 at FAST-NUCES SoftTech\'25.', tags:['Arduino','IR Sensors','PID','Robotics'], github:'https://github.com/malaika-09', live:'', img:'', status:'completed' },
      { id:uid(), name:'Space Invader Game',           icon:'fas fa-gamepad', desc:'Classic Space Invader built with Python Pygame. Multiple enemy types, shields, explosions.', tags:['Python','Pygame','Game Dev','OOP'], github:'https://github.com/malaika-09', live:'game.html', img:'', status:'completed' },
      { id:uid(), name:'Virtual Keyboard',             icon:'fas fa-keyboard', desc:'Computer vision based virtual keyboard using Python and OpenCV. Hand gesture typing.', tags:['Python','OpenCV','Computer Vision','Hand Tracking'], github:'https://github.com/malaika-09', live:'', img:'', status:'completed' },
      { id:uid(), name:'Birthday Wish — Hardware & Web', icon:'fas fa-birthday-cake', desc:'Dual-mode birthday wish: Arduino LED matrix hardware + GitHub Pages web version.', tags:['Arduino','LED Matrix','HTML/CSS/JS'], github:'https://github.com/malaika-09', live:'https://malaika-09.github.io', img:'', status:'completed' },
      { id:uid(), name:'Smart Home Automation',        icon:'fas fa-home', desc:'IoT-based home automation using ESP32 and MQTT protocol with mobile dashboard.', tags:['ESP32','MQTT','IoT','Python'], github:'https://github.com/malaika-09', live:'', img:'', status:'completed' },
    ]);
  }
  if (!DB.get(KEYS.skills).length) {
    DB.set(KEYS.skills, [
      { id:uid(), name:'Arduino',         category:'Embedded Systems',        level:92 },
      { id:uid(), name:'ESP32/ESP8266',   category:'Embedded Systems',        level:88 },
      { id:uid(), name:'Embedded C',      category:'Embedded Systems',        level:78 },
      { id:uid(), name:'Python',          category:'Programming',             level:87 },
      { id:uid(), name:'C / C++',         category:'Programming',             level:80 },
      { id:uid(), name:'MATLAB',          category:'Programming',             level:72 },
      { id:uid(), name:'OpenCV',          category:'Programming',             level:68 },
      { id:uid(), name:'MQTT Protocol',   category:'IoT & Connectivity',      level:82 },
      { id:uid(), name:'Sensor Integration', category:'IoT & Connectivity',   level:90 },
      { id:uid(), name:'Proteus/Multisim', category:'EE Tools & Software',    level:85 },
      { id:uid(), name:'Git & GitHub',    category:'Dev Tools',               level:78 },
      { id:uid(), name:'VS Code',         category:'Dev Tools',               level:93 },
    ]);
  }
  if (!DB.get(KEYS.exp).length) {
    DB.set(KEYS.exp, [
      { id:uid(), title:'Embedded & IoT Intern', company:'Circuit Catalyst', duration:'2026 – Present', badge:'present-badge', badgeLabel:'Present', desc:'Working as Embedded Systems and IoT intern building hardware solutions using microcontrollers and sensors.', tags:['ESP32','Arduino','IoT','Embedded C'], icon:'fas fa-microchip' },
      { id:uid(), title:'Engineer Intern — NTDC', company:'National Transmission & Dispatch Company', duration:'Jun 2025 – Jul 2025', badge:'', badgeLabel:'Internship', desc:'Gained hands-on experience at 220kV Wapda Town Grid Station. Observed transformers, circuit breakers and protection systems.', tags:['Power Systems','220kV Grid','Protection Systems'], icon:'fas fa-broadcast-tower' },
      { id:uid(), title:'Teaching Assistant — Signals & Systems', company:'UMT', duration:'Mar 2026 – Jul 2026', badge:'ta-badge', badgeLabel:'TA · Sem 6', desc:'Supported Signals & Systems and Programming Fundamentals courses in 6th semester.', tags:['Signals & Systems','OOP','Lab Sessions'], icon:'fas fa-chalkboard-teacher' },
      { id:uid(), title:'Teaching Assistant — Circuit Analysis', company:'UMT', duration:'Oct 2025 – Feb 2026', badge:'ta-badge', badgeLabel:'TA · Sem 5', desc:'TA for Circuit Analysis. Assisted students with circuit concepts and problem-solving.', tags:['Circuit Analysis','Problem Solving'], icon:'fas fa-chalkboard-teacher' },
      { id:uid(), title:'Teaching Assistant & Peer Tutor — OOP', company:'UMT', duration:'Mar 2025 – Jul 2025', badge:'ta-badge', badgeLabel:'TA + Peer Tutor · Sem 4', desc:'TA for OOP and Programming Fundamentals. Also served as Peer Tutor.', tags:['OOP','Python','Peer Tutoring'], icon:'fas fa-chalkboard-teacher' },
      { id:uid(), title:'Amazon Virtual Assistant', company:'KIPS CSS | PMS', duration:'Mar 2024 – May 2024', badge:'amz-badge', badgeLabel:'Certified', desc:'Amazon VA certified. Product research, listing optimization, Helium10, customer support.', tags:['Amazon FBA','Helium10','Product Research'], icon:'fab fa-amazon' },
      { id:uid(), title:'IEEE Student Member', company:'IEEE', duration:'Nov 2023 – Present', badge:'ieee-badge', badgeLabel:'Active', desc:'Actively involved in electrical/electronics trends. Participated in Tech Fiesta 2024.', tags:['IEEE','Tech Fiesta 2024','Networking'], icon:'fas fa-network-wired' },
    ]);
  }
  if (!DB.get(KEYS.certs).length) {
    DB.set(KEYS.certs, [
      { id:uid(), name:'One Million Prompters',                    org:'Dubai Future Foundation', date:'Jul 2026', tag:'AI',            iconStyle:'ai-icon',    credId:'' },
      { id:uid(), name:'Investment Risk Management',               org:'Coursera',                date:'Jul 2026', tag:'Finance',       iconStyle:'fin-icon',   credId:'' },
      { id:uid(), name:'Critical Thinking in the AI Era',          org:'HP LIFE',                 date:'Jul 2026', tag:'AI',            iconStyle:'ai-icon',    credId:'' },
      { id:uid(), name:'What is Software Development?',            org:'Simplilearn',             date:'Jul 2026', tag:'Dev',           iconStyle:'dev-icon',   credId:'10425974' },
      { id:uid(), name:'Deep Learning with TensorFlow & PyTorch',  org:'Simplilearn',             date:'Jul 2026', tag:'ML',            iconStyle:'ml-icon',    credId:'' },
      { id:uid(), name:'Introduction to Python OpenCV',            org:'Simplilearn',             date:'Mar 2026', tag:'CV',            iconStyle:'cv-icon',    credId:'9948525' },
      { id:uid(), name:'Introduction to OpenCV for Beginners',     org:'Simplilearn',             date:'Apr 2026', tag:'CV',            iconStyle:'cv-icon',    credId:'10049240' },
      { id:uid(), name:'Introduction to Neural Network',           org:'Simplilearn',             date:'Jul 2026', tag:'ML',            iconStyle:'ml-icon',    credId:'10422707' },
      { id:uid(), name:'Image Recognition using Machine Learning', org:'Simplilearn',             date:'Jul 2026', tag:'ML',            iconStyle:'ml-icon',    credId:'10423309' },
      { id:uid(), name:'Image Recognition Basics for Beginners',   org:'Simplilearn',             date:'Jul 2026', tag:'ML',            iconStyle:'ml-icon',    credId:'10422125' },
      { id:uid(), name:'SOFTEC\'25 — Line Following Robot',        org:'FAST NUCES Lahore',       date:'Jun 2025', tag:'Robotics',      iconStyle:'rob-icon',   credId:'' },
      { id:uid(), name:'English Immersion SD100',                  org:'UMT',                     date:'Jun–Aug 2025', tag:'Communication', iconStyle:'lang-icon', credId:'' },
      { id:uid(), name:'Corporate Social Responsibility (CSR)',     org:'UMT',                     date:'Jul 2024', tag:'CSR',           iconStyle:'csr-icon',   credId:'' },
      { id:uid(), name:'Amazon Virtual Assistant',                  org:'KIPS CSS | PMS',          date:'Mar–May 2024', tag:'Business',  iconStyle:'amz-c-icon', credId:'' },
    ]);
  }
  if (!DB.get(KEYS.edu).length) {
    DB.set(KEYS.edu, [
      { id:uid(), title:'Bachelor of Science — Electrical Engineering', inst:'University of Management and Technology (UMT), Lahore', duration:'Oct 2023 – Jul 2027', grade:'3.91 CGPA', desc:'Final year EE student. Focus on Embedded Systems, IoT, Power Systems.', tags:['Circuit Analysis','Embedded Systems','IoT','Control Systems','Power Electronics'] },
      { id:uid(), title:'FSc Pre-Engineering', inst:'Government Graduate College, Lahore', duration:'Aug 2021 – Jun 2023', grade:'', desc:'Built strong foundation in mathematics, physics, and engineering fundamentals.', tags:['Physics','Mathematics','Chemistry'] },
    ]);
  }
}

// ====================================================
//  LOGIN
// ====================================================
const loginWrap = document.getElementById('loginWrap');
const adminWrap = document.getElementById('adminWrap');
const pwInput   = document.getElementById('pwInput');
const loginBtn  = document.getElementById('loginBtn');
const loginError= document.getElementById('loginError');
const togglePw  = document.getElementById('togglePw');

function doLogin() {
  const val = pwInput.value.trim();
  if (!val) { loginError.textContent = 'Please enter password'; return; }
  if (val === DB.getPw()) {
    loginWrap.style.display = 'none';
    adminWrap.style.display = 'flex';
    initDefaultData();
    renderAll();
    updateDashStats();
  } else {
    loginError.textContent = 'Incorrect password. Try again.';
    pwInput.value = '';
    pwInput.focus();
  }
}

loginBtn.addEventListener('click', doLogin);
pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
togglePw.addEventListener('click', () => {
  pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
  togglePw.className = `fas fa-eye${pwInput.type==='password'?'':'-slash'} toggle-pw`;
});

// Check session
if (sessionStorage.getItem('mt_admin_session') === '1') {
  loginWrap.style.display = 'none';
  adminWrap.style.display = 'flex';
  initDefaultData();
  renderAll();
  updateDashStats();
} else {
  pwInput.focus();
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('mt_admin_session');
  location.reload();
});

// ====================================================
//  TABS
// ====================================================
const tabTitles = { dashboard:'Dashboard', projects:'Projects', skills:'Skills', experience:'Experience', certifications:'Certifications', education:'Education', settings:'Settings' };

document.querySelectorAll('.sn[data-tab]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const tab = link.dataset.tab;
    document.querySelectorAll('.sn').forEach(s => s.classList.remove('active'));
    link.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    document.getElementById('adminPageTitle').textContent = tabTitles[tab];
    // Close sidebar on mobile
    document.getElementById('adminSidebar').classList.remove('open');
  });
});

document.getElementById('sidebarToggle').addEventListener('click', () => {
  document.getElementById('adminSidebar').classList.toggle('open');
});

// ====================================================
//  RENDER ALL
// ====================================================
function renderAll() {
  renderProjects();
  renderSkills();
  renderExp();
  renderCerts();
  renderEdu();
}

function updateDashStats() {
  document.getElementById('ds-projects').textContent = DB.get(KEYS.projects).length;
  document.getElementById('ds-skills').textContent   = DB.get(KEYS.skills).length;
  document.getElementById('ds-exp').textContent      = DB.get(KEYS.exp).length;
  document.getElementById('ds-certs').textContent    = DB.get(KEYS.certs).length;
}

// ====================================================
//  PROJECTS CRUD
// ====================================================
let editProjectId = null;

function renderProjects(filter='') {
  const list = document.getElementById('projectsList');
  let data = DB.get(KEYS.projects);
  if (filter) data = data.filter(p => p.name.toLowerCase().includes(filter) || p.desc.toLowerCase().includes(filter) || p.tags.join(' ').toLowerCase().includes(filter));
  if (!data.length) { list.innerHTML = `<div class="empty-state"><i class="fas fa-diagram-project"></i><p>No projects yet. Click "Add Project" to start.</p></div>`; return; }
  list.innerHTML = data.map(p => `
    <div class="item-card">
      <div class="item-card-head">
        <div class="item-card-title"><i class="${p.icon||'fas fa-code'}" style="color:var(--cyan);margin-right:.5rem;"></i>${p.name}</div>
        <div class="item-card-actions">
          <button class="ic-btn ic-edit" onclick="editProject('${p.id}')"><i class="fas fa-pen"></i></button>
          <button class="ic-btn ic-del"  onclick="deleteItem('${p.id}','projects','${p.name.replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <span class="status-badge status-${p.status||'completed'}">${p.status||'completed'}</span>
      <p class="item-card-desc" style="margin-top:.5rem;">${p.desc}</p>
      <div class="item-tags">${(p.tags||[]).map(t=>`<span>${t}</span>`).join('')}</div>
      <div style="display:flex;gap:.5rem;margin-top:.7rem;flex-wrap:wrap;">
        ${p.github?`<a href="${p.github}" target="_blank" style="color:var(--cyan);font-size:.75rem;font-family:var(--fm);text-decoration:none;"><i class="fab fa-github"></i> GitHub</a>`:''}
        ${p.live?`<a href="${p.live}" target="_blank" style="color:var(--green);font-size:.75rem;font-family:var(--fm);text-decoration:none;"><i class="fas fa-external-link-alt"></i> Live</a>`:''}
      </div>
    </div>`).join('');
}

document.getElementById('addProjectBtn').addEventListener('click', () => {
  editProjectId = null;
  document.getElementById('projectModalTitle').textContent = 'Add Project';
  ['pName','pIcon','pDesc','pGithub','pLive','pTags','pImg'].forEach(id => document.getElementById(id).value='');
  document.getElementById('pStatus').value = 'completed';
  openModal('projectModal');
});

document.getElementById('saveProjectBtn').addEventListener('click', () => {
  const name = document.getElementById('pName').value.trim();
  const desc = document.getElementById('pDesc').value.trim();
  if (!name || !desc) { toast('Name and description required!','error'); return; }
  const data = DB.get(KEYS.projects);
  const project = {
    id:      editProjectId || uid(),
    name,
    icon:    document.getElementById('pIcon').value.trim() || 'fas fa-code',
    desc,
    github:  document.getElementById('pGithub').value.trim(),
    live:    document.getElementById('pLive').value.trim(),
    tags:    document.getElementById('pTags').value.split(',').map(t=>t.trim()).filter(Boolean),
    img:     document.getElementById('pImg').value.trim(),
    status:  document.getElementById('pStatus').value
  };
  if (editProjectId) {
    const idx = data.findIndex(p=>p.id===editProjectId);
    if (idx>-1) data[idx]=project;
    toast('Project updated! ✓');
  } else {
    data.push(project);
    toast('Project added! ✓');
  }
  DB.set(KEYS.projects, data);
  renderProjects(); updateDashStats(); closeModal('projectModal');
});

function editProject(id) {
  const p = DB.get(KEYS.projects).find(x=>x.id===id);
  if (!p) return;
  editProjectId = id;
  document.getElementById('projectModalTitle').textContent = 'Edit Project';
  document.getElementById('pName').value    = p.name;
  document.getElementById('pIcon').value    = p.icon||'';
  document.getElementById('pDesc').value    = p.desc;
  document.getElementById('pGithub').value  = p.github||'';
  document.getElementById('pLive').value    = p.live||'';
  document.getElementById('pTags').value    = (p.tags||[]).join(', ');
  document.getElementById('pImg').value     = p.img||'';
  document.getElementById('pStatus').value  = p.status||'completed';
  openModal('projectModal');
}

document.getElementById('searchProjects').addEventListener('input', e => renderProjects(e.target.value.toLowerCase()));

// ====================================================
//  SKILLS CRUD
// ====================================================
let editSkillId = null;

function renderSkills(filter='') {
  const list = document.getElementById('skillsList');
  let data = DB.get(KEYS.skills);
  if (filter) data = data.filter(s => s.name.toLowerCase().includes(filter) || s.category.toLowerCase().includes(filter));
  if (!data.length) { list.innerHTML = `<div class="empty-state"><i class="fas fa-code"></i><p>No skills yet.</p></div>`; return; }
  list.innerHTML = data.map(s => `
    <div class="item-card">
      <div class="item-card-head">
        <div class="item-card-title">${s.name}</div>
        <div class="item-card-actions">
          <button class="ic-btn ic-edit" onclick="editSkill('${s.id}')"><i class="fas fa-pen"></i></button>
          <button class="ic-btn ic-del"  onclick="deleteItem('${s.id}','skills','${s.name.replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <p class="item-card-sub">${s.category}</p>
      <div class="skill-bar-mini"><div class="skill-bar-mini-fill" style="width:${s.level}%"></div></div>
      <p style="font-family:var(--fm);font-size:.75rem;color:var(--cyan);">${s.level}%</p>
    </div>`).join('');
}

document.getElementById('addSkillBtn').addEventListener('click', () => {
  editSkillId = null;
  document.getElementById('skillModalTitle').textContent = 'Add Skill';
  document.getElementById('sName').value = '';
  document.getElementById('sLevel').value = 75;
  document.getElementById('sLevelVal').textContent = '75%';
  openModal('skillModal');
});

document.getElementById('saveSkillBtn').addEventListener('click', () => {
  const name = document.getElementById('sName').value.trim();
  if (!name) { toast('Skill name required!','error'); return; }
  const data = DB.get(KEYS.skills);
  const skill = { id: editSkillId || uid(), name, category: document.getElementById('sCat').value, level: parseInt(document.getElementById('sLevel').value) };
  if (editSkillId) {
    const idx = data.findIndex(s=>s.id===editSkillId); if(idx>-1) data[idx]=skill;
    toast('Skill updated! ✓');
  } else { data.push(skill); toast('Skill added! ✓'); }
  DB.set(KEYS.skills, data); renderSkills(); updateDashStats(); closeModal('skillModal');
});

function editSkill(id) {
  const s = DB.get(KEYS.skills).find(x=>x.id===id); if (!s) return;
  editSkillId = id;
  document.getElementById('skillModalTitle').textContent = 'Edit Skill';
  document.getElementById('sName').value  = s.name;
  document.getElementById('sCat').value   = s.category;
  document.getElementById('sLevel').value = s.level;
  document.getElementById('sLevelVal').textContent = s.level + '%';
  openModal('skillModal');
}

document.getElementById('searchSkills').addEventListener('input', e => renderSkills(e.target.value.toLowerCase()));

// ====================================================
//  EXPERIENCE CRUD
// ====================================================
let editExpId = null;

function renderExp() {
  const list = document.getElementById('expList');
  const data = DB.get(KEYS.exp);
  if (!data.length) { list.innerHTML = `<div class="empty-state"><i class="fas fa-briefcase"></i><p>No experience yet.</p></div>`; return; }
  list.innerHTML = data.map(e => `
    <div class="item-card">
      <div class="item-card-head">
        <div class="item-card-title"><i class="${e.icon||'fas fa-briefcase'}" style="color:var(--cyan);margin-right:.5rem;"></i>${e.title}</div>
        <div class="item-card-actions">
          <button class="ic-btn ic-edit" onclick="editExp('${e.id}')"><i class="fas fa-pen"></i></button>
          <button class="ic-btn ic-del"  onclick="deleteItem('${e.id}','exp','${e.title.replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <p class="item-card-sub">${e.company} · ${e.duration}</p>
      <p class="item-card-desc">${e.desc}</p>
      <div class="item-tags">${(e.tags||[]).map(t=>`<span>${t}</span>`).join('')}</div>
    </div>`).join('');
}

document.getElementById('addExpBtn').addEventListener('click', () => {
  editExpId = null;
  document.getElementById('expModalTitle').textContent = 'Add Experience';
  ['eTitle','eCompany','eDuration','eBadgeLabel','eDesc','eTags','eIcon'].forEach(id => document.getElementById(id).value='');
  document.getElementById('eBadge').value = '';
  openModal('expModal');
});

document.getElementById('saveExpBtn').addEventListener('click', () => {
  const title = document.getElementById('eTitle').value.trim();
  const company = document.getElementById('eCompany').value.trim();
  if (!title || !company) { toast('Title and company required!','error'); return; }
  const data = DB.get(KEYS.exp);
  const exp = {
    id: editExpId || uid(), title, company,
    duration:    document.getElementById('eDuration').value.trim(),
    badge:       document.getElementById('eBadge').value,
    badgeLabel:  document.getElementById('eBadgeLabel').value.trim(),
    desc:        document.getElementById('eDesc').value.trim(),
    tags:        document.getElementById('eTags').value.split(',').map(t=>t.trim()).filter(Boolean),
    icon:        document.getElementById('eIcon').value.trim() || 'fas fa-briefcase'
  };
  if (editExpId) { const idx=data.findIndex(e=>e.id===editExpId); if(idx>-1) data[idx]=exp; toast('Experience updated! ✓'); }
  else { data.push(exp); toast('Experience added! ✓'); }
  DB.set(KEYS.exp, data); renderExp(); updateDashStats(); closeModal('expModal');
});

function editExp(id) {
  const e = DB.get(KEYS.exp).find(x=>x.id===id); if (!e) return;
  editExpId = id;
  document.getElementById('expModalTitle').textContent   = 'Edit Experience';
  document.getElementById('eTitle').value       = e.title;
  document.getElementById('eCompany').value     = e.company;
  document.getElementById('eDuration').value    = e.duration;
  document.getElementById('eBadge').value       = e.badge||'';
  document.getElementById('eBadgeLabel').value  = e.badgeLabel||'';
  document.getElementById('eDesc').value        = e.desc;
  document.getElementById('eTags').value        = (e.tags||[]).join(', ');
  document.getElementById('eIcon').value        = e.icon||'';
  openModal('expModal');
}

// ====================================================
//  CERTIFICATIONS CRUD
// ====================================================
let editCertId = null;

function renderCerts(filter='') {
  const list = document.getElementById('certsList');
  let data = DB.get(KEYS.certs);
  if (filter) data = data.filter(c => c.name.toLowerCase().includes(filter) || c.org.toLowerCase().includes(filter));
  if (!data.length) { list.innerHTML = `<div class="empty-state"><i class="fas fa-certificate"></i><p>No certifications yet.</p></div>`; return; }
  list.innerHTML = data.map(c => `
    <div class="item-card">
      <div class="item-card-head">
        <div class="item-card-title">${c.name}</div>
        <div class="item-card-actions">
          <button class="ic-btn ic-edit" onclick="editCert('${c.id}')"><i class="fas fa-pen"></i></button>
          <button class="ic-btn ic-del"  onclick="deleteItem('${c.id}','certs','${c.name.replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <p class="item-card-sub">${c.org} · ${c.date}</p>
      ${c.credId?`<p style="font-family:var(--fm);font-size:.72rem;color:var(--muted);">ID: ${c.credId}</p>`:''}
      <div class="item-tags" style="margin-top:.5rem;"><span>${c.tag||'General'}</span></div>
    </div>`).join('');
}

document.getElementById('addCertBtn').addEventListener('click', () => {
  editCertId = null;
  document.getElementById('certModalTitle').textContent = 'Add Certification';
  ['cName','cOrg','cDate','cTag','cCredId'].forEach(id => document.getElementById(id).value='');
  document.getElementById('cIconStyle').value = 'ai-icon';
  openModal('certModal');
});

document.getElementById('saveCertBtn').addEventListener('click', () => {
  const name = document.getElementById('cName').value.trim();
  const org  = document.getElementById('cOrg').value.trim();
  if (!name || !org) { toast('Name and org required!','error'); return; }
  const data = DB.get(KEYS.certs);
  const cert = {
    id: editCertId || uid(), name, org,
    date:      document.getElementById('cDate').value.trim(),
    tag:       document.getElementById('cTag').value.trim(),
    credId:    document.getElementById('cCredId').value.trim(),
    iconStyle: document.getElementById('cIconStyle').value
  };
  if (editCertId) { const idx=data.findIndex(c=>c.id===editCertId); if(idx>-1) data[idx]=cert; toast('Certification updated! ✓'); }
  else { data.push(cert); toast('Certification added! ✓'); }
  DB.set(KEYS.certs, data); renderCerts(); updateDashStats(); closeModal('certModal');
});

function editCert(id) {
  const c = DB.get(KEYS.certs).find(x=>x.id===id); if (!c) return;
  editCertId = id;
  document.getElementById('certModalTitle').textContent = 'Edit Certification';
  document.getElementById('cName').value      = c.name;
  document.getElementById('cOrg').value       = c.org;
  document.getElementById('cDate').value      = c.date;
  document.getElementById('cTag').value       = c.tag||'';
  document.getElementById('cCredId').value    = c.credId||'';
  document.getElementById('cIconStyle').value = c.iconStyle||'ai-icon';
  openModal('certModal');
}

document.getElementById('searchCerts').addEventListener('input', e => renderCerts(e.target.value.toLowerCase()));

// ====================================================
//  EDUCATION CRUD
// ====================================================
let editEduId = null;

function renderEdu() {
  const list = document.getElementById('eduList');
  const data = DB.get(KEYS.edu);
  if (!data.length) { list.innerHTML = `<div class="empty-state"><i class="fas fa-graduation-cap"></i><p>No education yet.</p></div>`; return; }
  list.innerHTML = data.map(e => `
    <div class="item-card">
      <div class="item-card-head">
        <div class="item-card-title">${e.title}</div>
        <div class="item-card-actions">
          <button class="ic-btn ic-edit" onclick="editEdu('${e.id}')"><i class="fas fa-pen"></i></button>
          <button class="ic-btn ic-del"  onclick="deleteItem('${e.id}','edu','${e.title.replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <p class="item-card-sub">${e.inst} · ${e.duration}</p>
      ${e.grade?`<p style="font-family:var(--fm);font-size:.78rem;color:var(--cyan);">Grade: ${e.grade}</p>`:''}
      <p class="item-card-desc">${e.desc}</p>
      <div class="item-tags">${(e.tags||[]).map(t=>`<span>${t}</span>`).join('')}</div>
    </div>`).join('');
}

document.getElementById('addEduBtn').addEventListener('click', () => {
  editEduId = null;
  document.getElementById('eduModalTitle').textContent = 'Add Education';
  ['edTitle','edInst','edDuration','edGrade','edDesc','edTags'].forEach(id => document.getElementById(id).value='');
  openModal('eduModal');
});

document.getElementById('saveEduBtn').addEventListener('click', () => {
  const title = document.getElementById('edTitle').value.trim();
  const inst  = document.getElementById('edInst').value.trim();
  if (!title || !inst) { toast('Title and institution required!','error'); return; }
  const data = DB.get(KEYS.edu);
  const edu = {
    id: editEduId || uid(), title, inst,
    duration: document.getElementById('edDuration').value.trim(),
    grade:    document.getElementById('edGrade').value.trim(),
    desc:     document.getElementById('edDesc').value.trim(),
    tags:     document.getElementById('edTags').value.split(',').map(t=>t.trim()).filter(Boolean)
  };
  if (editEduId) { const idx=data.findIndex(e=>e.id===editEduId); if(idx>-1) data[idx]=edu; toast('Education updated! ✓'); }
  else { data.push(edu); toast('Education added! ✓'); }
  DB.set(KEYS.edu, data); renderEdu(); closeModal('eduModal');
});

function editEdu(id) {
  const e = DB.get(KEYS.edu).find(x=>x.id===id); if (!e) return;
  editEduId = id;
  document.getElementById('eduModalTitle').textContent = 'Edit Education';
  document.getElementById('edTitle').value    = e.title;
  document.getElementById('edInst').value     = e.inst;
  document.getElementById('edDuration').value = e.duration;
  document.getElementById('edGrade').value    = e.grade||'';
  document.getElementById('edDesc').value     = e.desc;
  document.getElementById('edTags').value     = (e.tags||[]).join(', ');
  openModal('eduModal');
}

// ====================================================
//  DELETE (shared)
// ====================================================
let deleteTarget = null;

function deleteItem(id, type, name) {
  deleteTarget = { id, type };
  document.getElementById('deleteItemName').textContent = name;
  openModal('deleteModal');
}

document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
  if (!deleteTarget) return;
  const keyMap = { projects:KEYS.projects, skills:KEYS.skills, exp:KEYS.exp, certs:KEYS.certs, edu:KEYS.edu };
  const key = keyMap[deleteTarget.type];
  const data = DB.get(key).filter(i=>i.id!==deleteTarget.id);
  DB.set(key, data);
  const renders = { projects:renderProjects, skills:renderSkills, exp:renderExp, certs:renderCerts, edu:renderEdu };
  renders[deleteTarget.type]();
  updateDashStats();
  toast('Deleted successfully','error');
  closeModal('deleteModal');
  deleteTarget = null;
});

// ====================================================
//  SETTINGS
// ====================================================
document.getElementById('changePwBtn').addEventListener('click', () => {
  const p1 = document.getElementById('newPw1').value.trim();
  const p2 = document.getElementById('newPw2').value.trim();
  const msg = document.getElementById('pwMsg');
  if (!p1) { msg.style.color='#ff6b6b'; msg.textContent='Enter a password'; return; }
  if (p1.length < 6) { msg.style.color='#ff6b6b'; msg.textContent='Min 6 characters'; return; }
  if (p1 !== p2) { msg.style.color='#ff6b6b'; msg.textContent='Passwords do not match'; return; }
  DB.setPw(p1);
  msg.style.color='var(--green)'; msg.textContent='Password changed! ✓';
  document.getElementById('newPw1').value=''; document.getElementById('newPw2').value='';
  toast('Password updated! ✓');
});

// Export
function exportData() {
  const data = { projects:DB.get(KEYS.projects), skills:DB.get(KEYS.skills), experience:DB.get(KEYS.exp), certifications:DB.get(KEYS.certs), education:DB.get(KEYS.edu), exportDate: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
  const a = document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download=`malaika_portfolio_data_${Date.now()}.json`; a.click();
  toast('Data exported! ✓');
}
document.getElementById('exportBtn').addEventListener('click', exportData);
document.getElementById('exportBtn2').addEventListener('click', exportData);

// Import
document.getElementById('importFile').addEventListener('change', function() {
  const file = this.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const d = JSON.parse(e.target.result);
      if (d.projects)      DB.set(KEYS.projects, d.projects);
      if (d.skills)        DB.set(KEYS.skills, d.skills);
      if (d.experience)    DB.set(KEYS.exp, d.experience);
      if (d.certifications)DB.set(KEYS.certs, d.certifications);
      if (d.education)     DB.set(KEYS.edu, d.education);
      renderAll(); updateDashStats();
      toast('Data imported successfully! ✓');
    } catch { toast('Invalid file!','error'); }
  };
  reader.readAsText(file); this.value='';
});

// Reset
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Reset ALL data? This cannot be undone!')) {
    [KEYS.projects,KEYS.skills,KEYS.exp,KEYS.certs,KEYS.edu].forEach(k=>localStorage.removeItem(k));
    initDefaultData(); renderAll(); updateDashStats();
    toast('Data reset to defaults');
  }
});
