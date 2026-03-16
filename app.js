/* ============================================
   IdeaFlow – App Logic
   ============================================ */

// ───── STATE ─────
const STATE = {
  ideas: [],
  currentView: 'dashboard',
  currentIdeaId: null,
  filter: 'all',
  searchQuery: '',
  selectedCat: '💡 Idee',
  selectedPrio: 'medium',
  theme: 'light',
};

// ───── LOCAL DB ─────
const DB = {
  KEY: 'ideaflow_v1',

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      STATE.ideas = raw ? JSON.parse(raw) : [];
      STATE.theme = localStorage.getItem(this.KEY + '_theme') || 'light';
    } catch (e) {
      STATE.ideas = [];
      STATE.theme = 'light';
    }
  },

  save() {
    localStorage.setItem(this.KEY, JSON.stringify(STATE.ideas));
    localStorage.setItem(this.KEY + '_theme', STATE.theme);
  },

  addIdea(idea) {
    STATE.ideas.unshift(idea);
    this.save();
  },

  updateIdea(id, updates) {
    const idx = STATE.ideas.findIndex(i => i.id === id);
    if (idx !== -1) {
      STATE.ideas[idx] = { ...STATE.ideas[idx], ...updates };
      this.save();
    }
  },

  deleteIdea(id) {
    STATE.ideas = STATE.ideas.filter(i => i.id !== id);
    this.save();
  },

  getIdea(id) {
    return STATE.ideas.find(i => i.id === id) || null;
  },

  addTask(ideaId, task) {
    const idea = this.getIdea(ideaId);
    if (idea) {
      idea.tasks.push(task);
      this.save();
    }
  },

  toggleTask(ideaId, taskId) {
    const idea = this.getIdea(ideaId);
    if (idea) {
      const task = idea.tasks.find(t => t.id === taskId);
      if (task) {
        task.done = !task.done;
        this.save();
      }
    }
  },

  deleteTask(ideaId, taskId) {
    const idea = this.getIdea(ideaId);
    if (idea) {
      idea.tasks = idea.tasks.filter(t => t.id !== taskId);
      this.save();
    }
  },

  reorderTasks(ideaId, fromIdx, toIdx) {
    const idea = this.getIdea(ideaId);
    if (idea) {
      const [moved] = idea.tasks.splice(fromIdx, 1);
      idea.tasks.splice(toIdx, 0, moved);
      this.save();
    }
  },
};

// ───── TASK AUTO-GENERATOR ─────
const TaskGen = {

  templates: {
    website: [
      { text: 'Doel en doelgroep bepalen', prio: 'hoog' },
      { text: 'Concurrenten en inspiratiesites bekijken', prio: 'medium' },
      { text: 'Wireframes / schermen schetsen', prio: 'hoog' },
      { text: 'Technologie stack kiezen', prio: 'medium' },
      { text: 'Homepage ontwerpen', prio: 'medium' },
      { text: 'Navigatiemenu en structuur opzetten', prio: 'medium' },
      { text: 'Alle content schrijven en verzamelen', prio: 'medium' },
      { text: 'Responsief maken voor mobiel', prio: 'laag' },
      { text: 'Testen in Chrome, Safari, Firefox', prio: 'laag' },
      { text: 'Hosting kiezen en live zetten', prio: 'laag' },
    ],
    app: [
      { text: 'Gebruikerswensen en requirements definiëren', prio: 'hoog' },
      { text: 'Schermflow en wireframes tekenen', prio: 'hoog' },
      { text: 'Datamodel en database ontwerpen', prio: 'hoog' },
      { text: 'Framework en tools kiezen', prio: 'medium' },
      { text: 'UI-componenten bouwen', prio: 'medium' },
      { text: 'App-logica implementeren', prio: 'medium' },
      { text: 'Testen op verschillende apparaten', prio: 'medium' },
      { text: 'Bugs opsporen en oplossen', prio: 'laag' },
      { text: 'App publiceren / lanceren', prio: 'laag' },
    ],
    leren: [
      { text: 'Leerdoelen helder formuleren', prio: 'hoog' },
      { text: 'Beste bronnen en materialen verzamelen', prio: 'hoog' },
      { text: 'Studieplanning opstellen', prio: 'medium' },
      { text: 'Eerste hoofdstuk of module doorwerken', prio: 'medium' },
      { text: 'Aantekeningen maken en samenvatten', prio: 'medium' },
      { text: 'Oefeningen en tests doen', prio: 'medium' },
      { text: 'Kennis toepassen in praktijkproject', prio: 'laag' },
      { text: 'Voortgang evalueren en bijsturen', prio: 'laag' },
    ],
    boek: [
      { text: 'Hoofdonderwerp en boodschap bepalen', prio: 'hoog' },
      { text: 'Doelgroep omschrijven', prio: 'hoog' },
      { text: 'Inhoudsopgave en hoofdstukken plannen', prio: 'hoog' },
      { text: 'Eerste hoofdstuk schrijven', prio: 'medium' },
      { text: 'Schrijfschema maken (dagelijks/wekelijks)', prio: 'medium' },
      { text: 'Alle hoofdstukken schrijven', prio: 'medium' },
      { text: 'Eerste ronde bewerken', prio: 'laag' },
      { text: 'Feedback vragen aan testlezers', prio: 'laag' },
      { text: 'Eindbewerking en opmaak', prio: 'laag' },
    ],
    startup: [
      { text: 'Probleemstelling helder formuleren', prio: 'hoog' },
      { text: 'Doelgroep en markt analyseren', prio: 'hoog' },
      { text: 'Unique Value Proposition bepalen', prio: 'hoog' },
      { text: 'MVP (Minimum Viable Product) definiëren', prio: 'hoog' },
      { text: 'Concurrentieanalyse uitvoeren', prio: 'medium' },
      { text: 'Businessmodel schetsen', prio: 'medium' },
      { text: 'Eerste prototype bouwen', prio: 'medium' },
      { text: 'Testen met echte gebruikers', prio: 'medium' },
      { text: 'Feedback verwerken en itereren', prio: 'laag' },
    ],
    design: [
      { text: 'Projectbriefing en doelen bepalen', prio: 'hoog' },
      { text: 'Moodboard en stijlreferenties verzamelen', prio: 'hoog' },
      { text: 'Kleurenpalet en typografie kiezen', prio: 'medium' },
      { text: 'Logo / merkidentiteit ontwerpen', prio: 'medium' },
      { text: 'Eerste ontwerpen maken (lo-fi)', prio: 'medium' },
      { text: 'Verfijnen tot hi-fi prototype', prio: 'medium' },
      { text: 'Feedback verzamelen', prio: 'laag' },
      { text: 'Definitief ontwerp opleveren', prio: 'laag' },
    ],
    marketing: [
      { text: 'Doelgroep en persona\'s definiëren', prio: 'hoog' },
      { text: 'Marketingkanalen kiezen', prio: 'hoog' },
      { text: 'Kernboodschap en tone of voice bepalen', prio: 'hoog' },
      { text: 'Contentkalender opstellen', prio: 'medium' },
      { text: 'Eerste campagne uitwerken', prio: 'medium' },
      { text: 'Social media profielen opzetten', prio: 'medium' },
      { text: 'KPI\'s en metrics bepalen', prio: 'laag' },
      { text: 'Resultaten analyseren en bijsturen', prio: 'laag' },
    ],
    sport: [
      { text: 'Huidig niveau en doelen bepalen', prio: 'hoog' },
      { text: 'Trainingsschema opstellen', prio: 'hoog' },
      { text: 'Voedingsplan aanpassen', prio: 'medium' },
      { text: 'Eerste week starten', prio: 'medium' },
      { text: 'Voortgang bijhouden', prio: 'medium' },
      { text: 'Blessures voorkomen (warming-up)', prio: 'laag' },
      { text: 'Maandelijks evalueren en aanpassen', prio: 'laag' },
    ],
    default: [
      { text: 'Doel en gewenst resultaat bepalen', prio: 'hoog' },
      { text: 'Research doen en informatie verzamelen', prio: 'hoog' },
      { text: 'Plan van aanpak opstellen', prio: 'hoog' },
      { text: 'Benodigde middelen en tijd inschatten', prio: 'medium' },
      { text: 'Eerste stap uitvoeren', prio: 'medium' },
      { text: 'Voortgang bijhouden', prio: 'medium' },
      { text: 'Obstakels identificeren en oplossen', prio: 'laag' },
      { text: 'Resultaat evalueren en documenteren', prio: 'laag' },
    ],
  },

  keywords: {
    website: ['website', 'site', 'webpagina', 'landing', 'blog', 'portfolio', 'webshop', 'shop', 'online', 'html', 'css', 'wordpress'],
    app: ['app', 'applicatie', 'software', 'programma', 'tool', 'flutter', 'react', 'native', 'android', 'ios', 'mobiel'],
    leren: ['leren', 'studeren', 'cursus', 'training', 'boek', 'lees', 'studie', 'kennis', 'vaardigheid', 'taal', 'programmeren'],
    boek: ['boek', 'schrijven', 'roman', 'verhaal', 'artikel', 'blog', 'tekst', 'publicatie', 'e-book'],
    startup: ['startup', 'bedrijf', 'business', 'onderneming', 'idee', 'product', 'service', 'markt', 'mvp', 'saas'],
    design: ['design', 'ontwerp', 'logo', 'grafisch', 'ui', 'ux', 'figma', 'illustratie', 'branding', 'merk', 'visueel'],
    marketing: ['marketing', 'campagne', 'social', 'advertentie', 'content', 'seo', 'social media', 'instagram', 'linkedin', 'email'],
    sport: ['sport', 'fitness', 'hardlopen', 'gym', 'training', 'gewicht', 'afvallen', 'spier', 'marathon', 'triathlon'],
  },

  detect(text) {
    const lower = text.toLowerCase();
    for (const [key, words] of Object.entries(this.keywords)) {
      if (words.some(w => lower.includes(w))) return key;
    }
    return 'default';
  },

  generate(title, description = '') {
    const combined = `${title} ${description}`;
    const type = this.detect(combined);
    const template = this.templates[type] || this.templates.default;
    return template.map((t, i) => ({
      id: `task_${Date.now()}_${i}`,
      text: t.text,
      prio: t.prio,
      done: false,
      createdAt: Date.now(),
    }));
  },
};

// ───── HELPERS ─────
function uid() {
  return 'idea_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getDeadlineLabel(dateStr) {
  if (!dateStr) return null;
  const deadline = new Date(dateStr);
  const today = new Date();
  today.setHours(0,0,0,0);
  deadline.setHours(0,0,0,0);

  const diffTime = deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: `⚠️ ${Math.abs(diffDays)}d te laat`, class: 'deadline-urgent' };
  if (diffDays === 0) return { text: '⏳ Vandaag!', class: 'deadline-today' };
  if (diffDays === 1) return { text: '📅 Morgen', class: 'deadline-today' };
  if (diffDays < 7) return { text: `📅 over ${diffDays} dagen`, class: '' };
  return { text: `📅 ${formatDate(deadline)}`, class: '' };
}

function getProgress(idea) {
  if (!idea.tasks.length) return 0;
  return Math.round((idea.tasks.filter(t => t.done).length / idea.tasks.length) * 100);
}

function showToast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast show ${type}`;
  setTimeout(() => { el.className = 'toast hidden'; }, 2800);
}

// ───── CONFETTI ─────
function launchConfetti() {
  const count = 100;
  const defaults = { origin: { y: 0.7 }, zIndex: 10000 };

  function fire(particleRatio, opts) {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0'; canvas.style.left = '0';
    canvas.style.width = '100%'; canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const colors = ['#1A73E8', '#4A8FF7', '#34A853', '#FBBC05', '#EA4335'];
    
    for (let i = 0; i < count * particleRatio; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.8,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() * -15) - 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        r: Math.random() * 6 + 4,
        t: 0
      });
    }

    function update() {
      ctx.clearRect(0,0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5; // gravity
        p.t += 0.01;
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        if (p.y > canvas.height) particles.splice(i, 1);
      }
      if (particles.length) requestAnimationFrame(update);
      else document.body.removeChild(canvas);
    }
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    update();
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
}

// ───── EXPORT ─────
const Exporter = {
  toText(id) {
    const idea = DB.getIdea(id);
    if (!idea) return;
    let txt = `IDEALOW PLAN: ${idea.title.toUpperCase()}\n`;
    txt += `Category: ${idea.category} | Priority: ${idea.priority}\n`;
    if (idea.description) txt += `Description: ${idea.description}\n`;
    txt += `\nTASKS:\n`;
    idea.tasks.forEach((t, i) => {
      txt += `${t.done ? '[x]' : '[ ]'} ${t.text}\n`;
    });
    
    navigator.clipboard.writeText(txt).then(() => {
      showToast('Plan gekopieerd naar klembord! 📋', 'success');
    });
  },
  
  toPdf() {
    window.print();
  }
};

// ───── RENDERER ─────
const Renderer = {

  renderStats() {
    const all = STATE.ideas;
    const active = all.filter(i => !i.archived && getProgress(i) < 100);
    const done = all.filter(i => i.archived || getProgress(i) === 100);
    const openTasks = all.reduce((sum, i) => sum + i.tasks.filter(t => !t.done).length, 0);

    document.getElementById('stat-total').textContent  = all.length;
    document.getElementById('stat-active').textContent = active.length;
    document.getElementById('stat-done').textContent   = done.length;
    document.getElementById('stat-tasks').textContent  = openTasks;

    document.getElementById('mini-active').textContent = active.length;
    document.getElementById('mini-done').textContent   = done.length;
  },

  renderCard(idea) {
    const pct = getProgress(idea);
    const total = idea.tasks.length;
    const finished = idea.tasks.filter(t => t.done).length;
    const isDone = pct === 100 || idea.archived;

    const pc = getDeadlineLabel(idea.dueDate);

    const card = document.createElement('div');
    card.className = 'idea-card';
    card.setAttribute('data-id', idea.id);
    card.innerHTML = `
      <div class="card-top">
        <div class="card-meta">
          <span class="card-cat">${idea.category}</span>
          <span class="card-prio prio-${idea.priority}">${idea.priority.charAt(0).toUpperCase() + idea.priority.slice(1)}</span>
          ${pc ? `<span class="deadline-badge ${pc.class}">${pc.text}</span>` : ''}
        </div>
        ${isDone ? '<span class="card-done-badge">✅ Afgerond</span>' : ''}
      </div>
      <div class="card-title">${escHtml(idea.title)}</div>
      ${idea.description ? `<div class="card-desc">${escHtml(idea.description)}</div>` : ''}
      <div class="card-progress">
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill ${isDone ? 'done' : ''}" style="width: ${pct}%"></div>
        </div>
      </div>
      <div class="card-bottom">
        <div class="card-stats">
          <span class="card-stat">📋 ${finished}/${total} taken</span>
          <span class="card-stat">·</span>
          <span class="card-stat">${pct}%</span>
        </div>
        <span class="card-date">${formatDate(idea.createdAt)}</span>
      </div>
    `;

    card.addEventListener('click', () => App.navigate('detail', idea.id));
    return card;
  },

  renderDashboard() {
    this.renderStats();
    const grid = document.getElementById('ideas-grid');
    const empty = document.getElementById('empty-state');
    grid.innerHTML = '';

    let visible = STATE.ideas.filter(i => !i.archived);

    if (STATE.filter === 'active') visible = visible.filter(i => getProgress(i) < 100);
    if (STATE.filter === 'done')   visible = visible.filter(i => getProgress(i) === 100);

    if (STATE.searchQuery) {
      const q = STATE.searchQuery.toLowerCase();
      visible = visible.filter(i =>
        i.title.toLowerCase().includes(q) ||
        (i.description || '').toLowerCase().includes(q)
      );
    }

    if (visible.length === 0) {
      empty.classList.remove('hidden');
    } else {
      empty.classList.add('hidden');
      visible.forEach(idea => grid.appendChild(this.renderCard(idea)));
    }
  },

  renderArchive() {
    const grid = document.getElementById('archive-grid');
    const empty = document.getElementById('archive-empty');
    grid.innerHTML = '';

    const archived = STATE.ideas.filter(i => i.archived);

    if (archived.length === 0) {
      empty.classList.remove('hidden');
    } else {
      empty.classList.add('hidden');
      archived.forEach(idea => grid.appendChild(this.renderCard(idea)));
    }
  },

  renderDetail(id) {
    const idea = DB.getIdea(id);
    if (!idea) { App.navigate('dashboard'); return; }

    const pct = getProgress(idea);
    const finished = idea.tasks.filter(t => t.done).length;
    const total = idea.tasks.length;
    const pc = getDeadlineLabel(idea.dueDate);
    const circumference = 175.9;
    const offset = circumference - (pct / 100) * circumference;

    const view = document.getElementById('view-detail');
    view.innerHTML = `
      <svg style="width:0;height:0;position:absolute"><defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#4A8FF7"/>
          <stop offset="100%" style="stop-color:#1A73E8"/>
        </linearGradient>
      </defs></svg>

      <div class="detail-view">
        <!-- Plan Info Card -->
        <div class="detail-card">
          <div class="detail-header">
            <div class="detail-header-left">
              <div class="detail-meta">
                <span class="card-cat">${idea.category}</span>
                <span class="card-prio prio-${idea.priority}">${idea.priority.charAt(0).toUpperCase() + idea.priority.slice(1)}</span>
                ${pc ? `<span class="deadline-badge ${pc.class}">${pc.text}</span>` : ''}
                ${idea.archived ? '<span class="card-done-badge">✅ Afgerond</span>' : ''}
              </div>
              <h2 class="detail-title">${escHtml(idea.title)}</h2>
              ${idea.description ? `<p class="detail-desc">${escHtml(idea.description)}</p>` : ''}
            </div>
            <div class="detail-progress-ring">
              <svg class="ring-svg" width="72" height="72" viewBox="0 0 60 60">
                <circle class="ring-bg" cx="30" cy="30" r="28"/>
                <circle class="ring-fill ${pct === 100 ? 'done' : ''}" cx="30" cy="30" r="28"
                  style="stroke-dashoffset: ${offset}"/>
              </svg>
              <div class="ring-label">
                <span class="ring-pct">${pct}%</span>
                <span class="ring-lbl">klaar</span>
              </div>
            </div>
          </div>
          <div style="font-size:0.78rem;color:var(--text-ter)">
            📅 Aangemaakt op ${formatDate(idea.createdAt)}
          </div>
        </div>

        <!-- Tasks Card -->
        <div class="tasks-section">
          <div class="tasks-header">
            <div class="tasks-title">
              📋 Taken
              <span class="task-count-badge">${finished}/${total}</span>
            </div>
          </div>
          <ul class="tasks-list" id="tasks-list"></ul>
          ${!idea.archived ? `
          <div class="add-task-form">
            <input type="text" id="add-task-input" class="add-task-input" placeholder="Nieuwe taak toevoegen..." maxlength="120" />
            <button id="add-task-btn" class="add-task-btn">+ Voeg toe</button>
          </div>
          ` : ''}
        </div>

        <!-- Actions -->
        <div class="detail-actions" id="detail-actions">
          <div class="action-group">
            <button class="btn-secondary" id="btn-export-txt">📄 Export Tekst</button>
            <button class="btn-secondary" id="btn-export-pdf">🖨️ PDF / Print</button>
          </div>
          
          ${!idea.archived ? `
            <button class="btn-complete" id="btn-complete" ${pct < 100 ? 'disabled' : ''}>
              ✅ Plan afronden & archiveren
            </button>
          ` : ''}
          <button class="btn-danger" id="btn-delete">
            🗑 Verwijderen
          </button>
        </div>
      </div>
    `;

    this.renderTasksList(id);
    this.bindDetailEvents(id);

    // Animate ring
    setTimeout(() => {
      const fill = view.querySelector('.ring-fill');
      if (fill) fill.style.strokeDashoffset = offset.toString();
    }, 100);
  },

  renderTasksList(ideaId) {
    const idea = DB.getIdea(ideaId);
    if (!idea) return;
    const list = document.getElementById('tasks-list');
    if (!list) return;
    list.innerHTML = '';

    if (idea.tasks.length === 0) {
      list.innerHTML = `<li style="padding:20px 24px;text-align:center;color:var(--text-ter);font-size:0.85rem">
        Nog geen taken. Voeg een taak toe hieronder.
      </li>`;
      return;
    }

    idea.tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.done ? 'completed' : ''}`;
      li.setAttribute('data-task-id', task.id);
      li.setAttribute('draggable', 'true');
      li.innerHTML = `
        <div class="task-item-drag-handle">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </div>
        <input type="checkbox" class="task-checkbox" ${task.done ? 'checked' : ''} />
        <span class="task-text">${escHtml(task.text)}</span>
        <span class="task-prio-dot dot-${task.prio || 'medium'}"></span>
        ${!idea.archived ? `<button class="task-delete-btn" title="Taak verwijderen">✕</button>` : ''}
      `;

      // Drag events
      li.addEventListener('dragstart', () => li.classList.add('dragging'));
      li.addEventListener('dragend', () => li.classList.remove('dragging'));

      const cb = li.querySelector('.task-checkbox');
      cb && cb.addEventListener('change', () => {
        DB.toggleTask(ideaId, task.id);
        const updated = DB.getIdea(ideaId);
        const newPct = getProgress(updated);
        if (newPct === 100) launchConfetti();
        
        this.renderDetail(ideaId);
        this.renderStats();
      });

      const del = li.querySelector('.task-delete-btn');
      del && del.addEventListener('click', (e) => {
        e.stopPropagation();
        DB.deleteTask(ideaId, task.id);
        this.renderDetail(ideaId);
        this.renderStats();
        showToast('Taak verwijderd');
      });

      list.appendChild(li);
    });
  },

  bindDetailEvents(ideaId) {
    // Add task
    const addInput = document.getElementById('add-task-input');
    const addBtn = document.getElementById('add-task-btn');

    const doAdd = () => {
      const val = addInput.value.trim();
      if (!val) { addInput.focus(); return; }
      const task = {
        id: `task_${Date.now()}`,
        text: val,
        prio: 'medium',
        done: false,
        createdAt: Date.now(),
      };
      DB.addTask(ideaId, task);
      addInput.value = '';
      this.renderDetail(ideaId);
      this.renderStats();
      showToast('Taak toegevoegd ✓', 'success');
      setTimeout(() => {
        const input = document.getElementById('add-task-input');
        if (input) input.focus();
      }, 50);
    };

    addBtn && addBtn.addEventListener('click', doAdd);
    addInput && addInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') doAdd();
    });

    // Complete plan
    const btnComplete = document.getElementById('btn-complete');
    btnComplete && btnComplete.addEventListener('click', () => {
      DB.updateIdea(ideaId, { archived: true });
      showToast('🎉 Plan afgerond en gearchiveerd!', 'success');
      App.navigate('dashboard');
    });

    // Delete plan
    const btnDelete = document.getElementById('btn-delete');
    btnDelete && btnDelete.addEventListener('click', () => {
      if (confirm('Weet je zeker dat je dit plan wilt verwijderen? Dit kan niet ongedaan worden.')) {
        DB.deleteIdea(ideaId);
        showToast('Plan verwijderd', '');
        App.navigate('dashboard');
      }
    });

    // Export events
    document.getElementById('btn-export-txt')?.addEventListener('click', () => Exporter.toText(ideaId));
    document.getElementById('btn-export-pdf')?.addEventListener('click', () => Exporter.toPdf());

    // Drag & Drop reorder
    const list = document.getElementById('tasks-list');
    list.addEventListener('dragover', e => {
      e.preventDefault();
      const dragging = document.querySelector('.dragging');
      const siblings = [...list.querySelectorAll('.task-item:not(.dragging)')];
      let nextSibling = siblings.find(sib => e.clientY <= sib.getBoundingClientRect().top + sib.offsetHeight / 2);
      list.insertBefore(dragging, nextSibling);
    });

    list.addEventListener('drop', () => {
      const newItems = [...list.querySelectorAll('.task-item')];
      const idea = DB.getIdea(ideaId);
      const newTasks = newItems.map(item => {
        const tid = item.getAttribute('data-task-id');
        return idea.tasks.find(t => t.id === tid);
      });
      idea.tasks = newTasks;
      DB.save();
      this.renderStats();
    });
  },
};

// ───── HELPERS ─────
function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// ───── APP CONTROLLER ─────
const App = {

  init() {
    DB.load();
    this.applyTheme();
    this.bindEvents();
    this.navigate('dashboard');
  },

  applyTheme() {
    document.body.classList.toggle('dark-mode', STATE.theme === 'dark');
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-checked', STATE.theme === 'dark');
    }
  },

  toggleTheme() {
    STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme();
    DB.save();
  },

  navigate(view, ideaId = null) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

    // Update nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    // Back btn
    const backBtn = document.getElementById('back-btn');
    const headerNew = document.getElementById('header-new-btn');
    const searchWrap = document.getElementById('search-wrap');

    STATE.currentView = view;
    STATE.currentIdeaId = ideaId;

    if (view === 'dashboard') {
      document.getElementById('view-dashboard').classList.add('active');
      document.getElementById('nav-dashboard').classList.add('active');
      document.getElementById('view-title').textContent = 'Dashboard';
      document.getElementById('view-subtitle').textContent = 'Overzicht van jouw ideeën & plannen';
      backBtn.classList.add('hidden');
      headerNew.classList.remove('hidden');
      searchWrap.classList.remove('hidden');
      Renderer.renderDashboard();

    } else if (view === 'archive') {
      document.getElementById('view-archive').classList.add('active');
      document.getElementById('nav-archive').classList.add('active');
      document.getElementById('view-title').textContent = 'Archief';
      document.getElementById('view-subtitle').textContent = 'Je afgeronde plannen';
      backBtn.classList.add('hidden');
      headerNew.classList.add('hidden');
      searchWrap.classList.add('hidden');
      Renderer.renderArchive();

    } else if (view === 'detail' && ideaId) {
      const idea = DB.getIdea(ideaId);
      if (!idea) { this.navigate('dashboard'); return; }
      document.getElementById('view-detail').classList.add('active');
      document.getElementById('view-title').textContent = idea.title;
      document.getElementById('view-subtitle').textContent = idea.category + ' · ' + formatDate(idea.createdAt);
      backBtn.classList.remove('hidden');
      headerNew.classList.add('hidden');
      searchWrap.classList.add('hidden');

      // Back btn
      backBtn.onclick = () => {
        if (idea.archived) this.navigate('archive');
        else this.navigate('dashboard');
      };

      Renderer.renderDetail(ideaId);
    }
  },

  showModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('hidden');
    document.getElementById('idea-title').value = '';
    document.getElementById('idea-desc').value = '';
    document.getElementById('idea-deadline').value = '';
    document.getElementById('char-count').textContent = '0';
    document.getElementById('toggle-autogen').checked = true;

    // Reset pickers
    document.querySelectorAll('.cat-btn').forEach((b, i) => {
      b.classList.toggle('active', i === 0);
    });
    STATE.selectedCat = '💡 Idee';

    document.querySelectorAll('.prio-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.prio === 'medium');
    });
    STATE.selectedPrio = 'medium';

    setTimeout(() => document.getElementById('idea-title').focus(), 100);
  },

  hideModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.add('hidden');
  },

  createIdea() {
    const titleEl = document.getElementById('idea-title');
    const descEl  = document.getElementById('idea-desc');
    const deadEl  = document.getElementById('idea-deadline');
    const autoGen = document.getElementById('toggle-autogen').checked;

    const title = titleEl.value.trim();
    const desc  = descEl.value.trim();
    const dueDate = deadEl.value;

    if (!title) {
      titleEl.focus();
      titleEl.style.borderColor = 'var(--red-400)';
      setTimeout(() => titleEl.style.borderColor = '', 1500);
      return;
    }

    const tasks = autoGen ? TaskGen.generate(title, desc) : [];

    const idea = {
      id: uid(),
      title,
      description: desc,
      category: STATE.selectedCat,
      priority: STATE.selectedPrio,
      dueDate: dueDate,
      tasks,
      archived: false,
      createdAt: Date.now(),
    };

    DB.addIdea(idea);
    this.hideModal();
    showToast(`✨ Plan "${title}" aangemaakt met ${tasks.length} taken!`, 'success');
    this.navigate('detail', idea.id);
  },

  bindEvents() {
    // Modal open
    document.getElementById('btn-new-idea').addEventListener('click', () => this.showModal());
    document.getElementById('header-new-btn').addEventListener('click', () => this.showModal());
    document.getElementById('empty-cta')?.addEventListener('click', () => this.showModal());

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());

    // Modal close
    document.getElementById('modal-close').addEventListener('click', () => this.hideModal());
    document.getElementById('btn-cancel').addEventListener('click', () => this.hideModal());

    // Click outside modal
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target === document.getElementById('modal-overlay')) this.hideModal();
    });

    // Create idea
    document.getElementById('btn-create').addEventListener('click', () => this.createIdea());

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.hideModal();
    });

    // Nav items
    document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate(btn.dataset.view);
      });
    });

    // Filter tabs
    document.getElementById('filter-tabs').addEventListener('click', (e) => {
      const tab = e.target.closest('.ftab');
      if (!tab) return;
      document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      STATE.filter = tab.dataset.filter;
      Renderer.renderDashboard();
    });

    // Search
    document.getElementById('search-input').addEventListener('input', (e) => {
      STATE.searchQuery = e.target.value;
      Renderer.renderDashboard();
    });

    // Category picker
    document.getElementById('cat-picker').addEventListener('click', (e) => {
      const btn = e.target.closest('.cat-btn');
      if (!btn) return;
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      STATE.selectedCat = btn.dataset.cat;
    });

    // Priority picker
    document.getElementById('prio-picker').addEventListener('click', (e) => {
      const btn = e.target.closest('.prio-btn');
      if (!btn) return;
      document.querySelectorAll('.prio-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      STATE.selectedPrio = btn.dataset.prio;
    });

    // Char count
    document.getElementById('idea-title').addEventListener('input', (e) => {
      document.getElementById('char-count').textContent = e.target.value.length;
    });

    // Empty state CTA (re-bind on render)
    document.addEventListener('click', (e) => {
      if (e.target.id === 'empty-cta') this.showModal();
    });
  },
};

// ───── BOOT ─────
document.addEventListener('DOMContentLoaded', () => App.init());
