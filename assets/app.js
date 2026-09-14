/* ============ AI 技术学习站 · 应用逻辑 v3（讲义纸面版） ============ */
'use strict';

const PROJ = { rag: window.DATA_RAG, agent: window.DATA_AGENT, nlink: window.DATA_NLINK };
const GEN = window.DATA_GENERAL;
const AIPM = window.DATA_AIPM;
const INTERV = window.DATA_INTERV;
const DOCS = window.DATA_DOCS || { docs: [] };
const PROJ_ORDER = ['rag', 'agent', 'nlink'];
const DEFAULT_ACCENT = '#b4451f';

/* ---------- SVG 图标（Lucide 风格） ---------- */
const ICONS = {
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  flask: '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
  refresh: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  'pen-line': '<path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>',
  book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  zoom: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/>',
  expand: '<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  list: '<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>',
};
const icon = (n, cls) => '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[n] + '</svg>';

/* ---------- 进度存储 ---------- */
const store = {
  key: 'wtl-progress-v1',
  data: { learned: {}, quizBest: {}, qaDone: {}, termDone: {} },
  load() { try { const raw = localStorage.getItem(this.key); if (raw) this.data = Object.assign(this.data, JSON.parse(raw)); } catch (e) {} },
  save() { try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (e) {} },
  reset() { this.data = { learned: {}, quizBest: {}, qaDone: {}, termDone: {} }; try { localStorage.removeItem(this.key); } catch (e) {} },
};
store.load();

/* ---------- 工具 ---------- */
const $ = (s, el) => (el || document).querySelector(s);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function findModule(pid, mid) {
  const p = PROJ[pid]; if (!p) return null;
  return p.modules.find(m => m.id === mid) || null;
}
function moduleIndex(pid, mid) { return PROJ[pid].modules.findIndex(m => m.id === mid); }
const shortTitle = t => t.split('：')[0].split(':')[0];

/* ---------- 代码高亮 ---------- */
const HL = {
  kw: {
    js: 'function|const|let|var|return|await|async|for|of|if|else|while|new|class|true|false|null|undefined|break|continue|import|from|export|this|typeof|in|try|catch|throw|do|switch|case|default',
    ts: 'function|const|let|var|return|await|async|for|of|if|else|while|new|class|true|false|null|undefined|break|continue|import|from|export|this|typeof|in|try|catch|throw|interface|type|implements|extends|readonly',
    rust: 'pub|fn|let|mut|impl|trait|enum|struct|match|if|else|return|async|await|for|in|use|crate|self|Self|true|false|type|where|dyn|move|ref|const|static|Some|None|Ok|Err|loop|while|break|continue',
    kotlin: 'fun|val|var|class|data|object|override|return|if|else|when|for|while|in|is|as|private|public|internal|suspend|import|package|null|true|false|this|super|companion|interface|sealed|with|by|it|lateinit|init',
  },
  re(lang) {
    const str = lang === 'rust' || lang === 'kotlin'
      ? '"(?:[^"\\\\\\n]|\\\\.)*"'
      : '\'(?:[^\'\\\\\\n]|\\\\.)*\'|"(?:[^"\\\\\\n]|\\\\.)*"';
    return new RegExp('(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*)|(' + str + ')|(@[A-Za-z]\\w*)|(\\b\\d+(?:\\.\\d+)?\\b)|([A-Za-z_$][\\w$]*)', 'g');
  },
  run(code, lang) {
    const kw = new Set((this.kw[lang] || this.kw.js).split('|'));
    const re = this.re(lang); let out = '', last = 0, m;
    while ((m = re.exec(code)) !== null) {
      out += esc(code.slice(last, m.index));
      const [full, comment, str, anno, num, word] = m;
      if (comment) out += '<span class="tok-c">' + esc(comment) + '</span>';
      else if (str) out += '<span class="tok-s">' + esc(str) + '</span>';
      else if (anno) out += '<span class="tok-a">' + esc(anno) + '</span>';
      else if (num) out += '<span class="tok-n">' + esc(num) + '</span>';
      else if (word && kw.has(word)) out += '<span class="tok-k">' + esc(word) + '</span>';
      else out += esc(full);
      last = m.index + full.length;
    }
    out += esc(code.slice(last));
    return out;
  },
};
const LANG_LABEL = { js: 'JavaScript', ts: 'TypeScript', rust: 'Rust', kotlin: 'Kotlin' };

function codeblockHTML(c) {
  return '<div class="codeblock"><div class="codeblock-head">' +
    '<span class="codeblock-lang">' + esc(LANG_LABEL[c.lang] || c.lang) + '</span>' +
    '<span class="codeblock-file">' + esc(c.file) + '</span>' +
    (c.lines ? '<span class="codeblock-lines">' + esc(c.lines) + '</span>' : '') +
    '<button class="codeblock-copy" data-code="' + esc(c.code) + '" aria-label="复制代码">' + icon('copy') + '<span>复制</span></button></div>' +
    '<pre><code>' + HL.run(c.code, c.lang || 'js') + '</code></pre>' +
    (c.explain ? '<div class="explain">' + c.explain + '</div>' : '') + '</div>';
}

function bindCopies(root) {
  root.querySelectorAll('.codeblock-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-code');
      const done = () => { btn.querySelector('span').textContent = '已复制'; setTimeout(() => btn.querySelector('span').textContent = '复制', 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
      } else fallbackCopy(text, done);
    });
  });
}
function fallbackCopy(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); done(); } catch (e) {}
  document.body.removeChild(ta);
}

/* ---------- 侧边栏 ---------- */
let openProjects = {};
/* 专项分组（可折叠）——面试速通与 AI PM 共用同一套结构，保证同级外观一致 */
function navGroupHTML(o) {
  return '<div class="nav-proj' + o.open + '" data-pid="' + o.pid + '">' +
    '<button class="nav-proj-head' + (o.active ? ' active' : '') + '" aria-expanded="' + (o.open ? 'true' : 'false') + '">' +
    '<span class="nav-dot" style="background:' + o.color + '"></span>' +
    '<span class="nav-proj-name">' + esc(o.name) + '</span>' +
    '<span class="nav-proj-badge">' + o.done + '/' + o.total + '</span>' +
    '<span class="nav-caret">' + icon('chevron-down') + '</span></button>' +
    '<div class="nav-prog"><i style="width:' + Math.round(o.done / o.total * 100) + '%;background:' + o.color + '"></i></div>' +
    '<div class="nav-list"><div>' + o.items + '</div></div></div>';
}
function renderNav() {
  const cur = parseHash();
  if (cur.pid) openProjects[cur.pid] = true;
  /* 专项分组：进入任一子页都保持展开，点击目录项不再把自己收回去 */
  if (cur.view === 'interv' || cur.view === 'intervModule') openProjects.interv = true;
  if (cur.view === 'aipm' || cur.view === 'aipmModule') openProjects.aipm = true;
  if (cur.view === 'docIndex' || cur.view === 'docModule') openProjects['doc-' + cur.docId] = true;
  let html = '<div class="nav-sec-label">开始</div>' +
    '<div class="nav-proj"><a class="nav-item ' + (cur.view === 'home' ? 'active' : '') + '" href="#/">' +
    '<span class="nav-idx">' + icon('compass') + '</span>学习总览</a></div>';

  html += '<div class="nav-sec-label">课程</div>';
  html += PROJ_ORDER.map(pid => {
    const p = PROJ[pid];
    const learned = p.modules.filter(m => store.data.learned[m.id]).length;
    const pct = Math.round(learned / p.modules.length * 100);
    const open = openProjects[pid] ? ' open' : '';
    const items = ['<a class="nav-item ' + (cur.view === 'proj' && cur.pid === pid ? 'active' : '') + '" href="#/p/' + pid + '"><span class="nav-idx">〇</span>项目概览</a>']
      .concat(p.modules.map((m, i) => {
        const active = cur.view === 'module' && cur.pid === pid && cur.mid === m.id;
        return '<a class="nav-item ' + (active ? 'active' : '') + '" href="#/m/' + pid + '/' + m.id + '">' +
          '<span class="nav-idx">' + (i + 1) + '</span>' + esc(shortTitle(m.title)) +
          (store.data.learned[m.id] ? '<span class="done">' + icon('check') + '</span>' : '') + '</a>';
      }))
      .concat(['<a class="nav-item ' + (cur.view === 'quiz' && cur.pid === pid ? 'active' : '') + '" href="#/q/' + pid + '"><span class="nav-idx">' + icon('zap') + '</span>实战测验</a>']);
    return '<div class="nav-proj' + open + '" data-pid="' + pid + '">' +
      '<button class="nav-proj-head" aria-expanded="' + (open ? 'true' : 'false') + '"><span class="nav-dot" style="background:' + p.colorHex + '"></span>' +
      '<span class="nav-proj-name">' + esc(p.name) + '</span><span class="nav-proj-badge">' + learned + '/' + p.modules.length + '</span>' +
      '<span class="nav-caret">' + icon('chevron-down') + '</span></button>' +
      '<div class="nav-prog"><i style="width:' + pct + '%;background:' + p.colorHex + '"></i></div>' +
      '<div class="nav-list"><div>' + items.join('') + '</div></div></div>';
  }).join('');

  html += '<div class="nav-sec-label">专项</div>' +
    (function () {
      const done = INTERV.modules.filter(m => store.data.learned[m.id]).length;
      const open = openProjects.interv ? ' open' : '';
      const items = '<a class="nav-item' + (cur.view === 'interv' ? ' active' : '') + '" href="#/interv">' +
        '<span class="nav-idx">' + icon('book') + '</span>专项目录' +
        '<span class="nav-proj-badge" style="margin-left:auto">' + INTERV.modules.length + ' 模块</span></a>' +
        INTERV.groups.map(g => {
          const ms = INTERV.modules.filter(m => m.grp === g.key);
          const gDone = ms.filter(m => store.data.learned[m.id]).length;
          const sub = ms.map(m => {
            const active = cur.view === 'intervModule' && cur.mid === m.id;
            return '<a class="nav-item' + (active ? ' active' : '') + '" href="#/interv/m/' + m.id + '">' +
              '<span class="nav-idx">' + m.id.slice(3) + '</span>' + esc(m.title) +
              (store.data.learned[m.id] ? '<span class="done">' + icon('check') + '</span>' : '') + '</a>';
          }).join('');
          return '<div class="nav-grp"><div class="nav-grp-name">' + esc(g.name) +
            '<span class="nav-proj-badge">' + gDone + '/' + ms.length + '</span></div>' + sub + '</div>';
        }).join('');
      return navGroupHTML({
        pid: 'interv', open: open, active: cur.view === 'interv' || cur.view === 'intervModule',
        color: '#b4451f', name: '面试速通', done: done, total: INTERV.modules.length, items: items,
      });
    })() +
    (function () {
      const done = AIPM.modules.filter(m => store.data.learned[m.id]).length;
      const items = '<a class="nav-item' + (cur.view === 'aipm' ? ' active' : '') + '" href="#/aipm">' +
        '<span class="nav-idx">' + icon('book') + '</span>专项目录' +
        '<span class="nav-proj-badge" style="margin-left:auto">' + AIPM.modules.length + ' 模块</span></a>' +
        AIPM.modules.map((m, i) => {
          const active = cur.view === 'aipmModule' && cur.mid === m.id;
          return '<a class="nav-item' + (active ? ' active' : '') + '" href="#/aipm/m/' + m.id + '">' +
            '<span class="nav-idx">' + String(i + 1).padStart(2, '0') + '</span>' + esc(shortTitle(m.title)) +
            (store.data.learned[m.id] ? '<span class="done">' + icon('check') + '</span>' : '') + '</a>';
        }).join('');
      return navGroupHTML({
        pid: 'aipm', open: openProjects.aipm ? ' open' : '', active: cur.view === 'aipm' || cur.view === 'aipmModule',
        color: '#6d28d9', name: 'AI PM 核心能力', done: done, total: AIPM.modules.length, items: items,
      });
    })();

  html += '<div class="nav-sec-label">速通系列</div>' + (DOCS.docs || []).map(doc => {
    const done = doc.modules.filter(m => store.data.learned[m.id]).length;
    const items = '<a class="nav-item' + (cur.view === 'docIndex' && cur.docId === doc.id ? ' active' : '') +
      '" href="#/doc/' + doc.id + '"><span class="nav-idx">' + icon('book') + '</span>模块目录' +
      '<span class="nav-proj-badge" style="margin-left:auto">' + doc.modules.length + ' 模块</span></a>' +
      doc.modules.map((m, i) => {
        const active = cur.view === 'docModule' && cur.docId === doc.id && cur.mid === m.id;
        return '<a class="nav-item' + (active ? ' active' : '') + '" href="#/doc/' + doc.id + '/m/' + m.id + '">' +
          '<span class="nav-idx">' + String(i + 1).padStart(2, '0') + '</span>' + esc(m.title) +
          (store.data.learned[m.id] ? '<span class="done">' + icon('check') + '</span>' : '') + '</a>';
      }).join('');
    return navGroupHTML({
      pid: 'doc-' + doc.id, open: openProjects['doc-' + doc.id] ? ' open' : '',
      active: (cur.view === 'docIndex' || cur.view === 'docModule') && cur.docId === doc.id,
      color: doc.color, name: doc.name, done: done, total: doc.modules.length, items: items,
    });
  }).join('');

  html += '<div class="nav-sec-label">复习</div><div class="nav-proj">' +
    '<a class="nav-item ' + (cur.view === 'interview' ? 'active' : '') + '" href="#/interview"><span class="nav-idx">' + icon('flame') + '</span>面试实战</a>' +
    '<a class="nav-item ' + (cur.view === 'glossary' ? 'active' : '') + '" href="#/glossary"><span class="nav-idx">' + icon('layers') + '</span>术语速查表</a></div>';

  const nav = $('#nav');
  nav.innerHTML = html;
  nav.querySelectorAll('.nav-proj-head').forEach(el => el.addEventListener('click', () => {
    const proj = el.closest('.nav-proj');
    proj.classList.toggle('open');
    const open = proj.classList.contains('open');
    el.setAttribute('aria-expanded', open ? 'true' : 'false');
    const pid = proj.getAttribute('data-pid');
    if (pid) openProjects[pid] = open;   // 记住展开状态，翻页后不自动收回
  }));

  /* 让当前所在条目滚进可视区（只滚侧边栏，不动主页面） */
  const act = nav.querySelector('.nav-item.active');
  if (act && nav.scrollHeight > nav.clientHeight + 4) {
    const nr = nav.getBoundingClientRect(), ar = act.getBoundingClientRect();
    if (ar.top < nr.top || ar.bottom > nr.bottom) nav.scrollTop += ar.top - nr.top - 48;
  }
}

/* ---------- 路由 ---------- */
function parseHash() {
  const h = location.hash.replace(/^#\/?/, '');
  const seg = h.split('/').filter(Boolean);
  if (seg[0] === 'm' && seg[1] && seg[2]) return { view: 'module', pid: seg[1], mid: seg[2] };
  if (seg[0] === 'q' && seg[1]) return { view: 'quiz', pid: seg[1] };
  if (seg[0] === 'p' && seg[1]) return { view: 'proj', pid: seg[1] };
  if (seg[0] === 'aipm' && seg[1] === 'm' && seg[2]) return { view: 'aipmModule', mid: seg[2] };
  if (seg[0] === 'aipm') return { view: 'aipm' };
  if (seg[0] === 'doc' && seg[1] && seg[2] === 'm' && seg[3]) return { view: 'docModule', docId: seg[1], mid: seg[3] };
  if (seg[0] === 'doc' && seg[1]) return { view: 'docIndex', docId: seg[1] };
  if (seg[0] === 'interv' && seg[1] === 'm' && seg[2]) return { view: 'intervModule', mid: seg[2] };
  if (seg[0] === 'interv') return { view: 'interv' };
  if (seg[0] === 'interview') return { view: 'interview' };
  if (seg[0] === 'glossary') return { view: 'glossary' };
  return { view: 'home' };
}
function route() {
  const cur = parseHash();
  const main = $('#main');
  const proj = cur.pid ? PROJ[cur.pid] : null;
  const accent = proj ? proj.colorHex : DEFAULT_ACCENT;
  document.documentElement.style.setProperty('--accent', accent);
  window.scrollTo(0, 0);
  if (progressHandler) { window.removeEventListener('scroll', progressHandler); progressHandler = null; }
  if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }
  if (cur.view === 'home') renderHome(main);
  else if (cur.view === 'proj') renderProjOverview(main, cur.pid);
  else if (cur.view === 'module') renderModule(main, cur.pid, cur.mid);
  else if (cur.view === 'quiz') renderQuiz(main, cur.pid);
  else if (cur.view === 'aipm') renderAipmIndex(main);
  else if (cur.view === 'aipmModule') renderAipmModule(main, cur.mid);
  else if (cur.view === 'interv') renderIntervIndex(main);
  else if (cur.view === 'intervModule') renderIntervModule(main, cur.mid);
  else if (cur.view === 'docIndex') renderDocIndex(main, cur.docId);
  else if (cur.view === 'docModule') renderDocModule(main, cur.docId, cur.mid);
  else if (cur.view === 'interview') renderInterview(main);
  else if (cur.view === 'glossary') renderGlossary(main);
  initReveal(main);
  renderNav();
  $('#sidebar').classList.remove('open');
}

/* ---------- 通用片段 ---------- */
const secH = (t, sub, aux) => '<div class="sec-h"><div class="t">' + t + (aux ? '<span class="aux">' + aux + '</span>' : '') + '</div></div>' + (sub ? '<div class="sec-sub">' + sub + '</div>' : '');
const crumbHTML = parts => '<div class="crumb">' + parts.map(p =>
  (p.href ? '<a href="' + p.href + '">' + esc(p.t) + '</a>' : '<span>' + esc(p.t) + '</span>')
).join('<span class="sep">/</span>') + '</div>';
const refsHTML = refs => '<div class="refs stagger">' + refs.map(r =>
  '<a class="ref-card" href="' + r.url + '" target="_blank" rel="noopener">' +
  '<div class="ref-name">' + esc(r.name) + icon('external') + '</div><div class="ref-why">' + esc(r.why) + '</div></a>').join('') + '</div>';
const modNavHTML = (pid, p, idx) => {
  const prev = idx > 0
    ? '<a href="#/m/' + pid + '/' + p.modules[idx - 1].id + '"><span class="dir">上一课</span>' + esc(shortTitle(p.modules[idx - 1].title)) + '</a>'
    : '<a href="#/p/' + pid + '"><span class="dir">返回</span>项目概览</a>';
  const next = idx < p.modules.length - 1
    ? '<a class="next" href="#/m/' + pid + '/' + p.modules[idx + 1].id + '"><span class="dir">下一课</span>' + esc(shortTitle(p.modules[idx + 1].title)) + '</a>'
    : '<a class="next" href="#/q/' + pid + '"><span class="dir">学完了？去检验</span>实战测验</a>';
  return '<div class="mod-nav">' + prev + next + '</div>';
};

/* ---------- 总览页：讲义封面 + 总目录 ---------- */
function renderHome(main) {
  const totalMods = PROJ_ORDER.reduce((n, p) => n + PROJ[p].modules.length, 0);
  const learnedMods = Object.keys(store.data.learned).filter(id => PROJ_ORDER.some(p => PROJ[p].modules.some(m => m.id === id))).length;
  const qaTotal = GEN.qa.reduce((n, g) => n + g.items.length, 0);
  const qaDone = Object.keys(store.data.qaDone).length;
  const termDone = Object.keys(store.data.termDone).length;

  const tocTable = PROJ_ORDER.map(pid => {
    const p = PROJ[pid];
    const learned = p.modules.filter(mm => store.data.learned[mm.id]).length;
    const rows = p.modules.map((m, i) => {
      const isLearned = !!store.data.learned[m.id];
      return '<tr class="toc-row" data-href="#/m/' + pid + '/' + m.id + '" tabindex="0" role="link" aria-label="' + esc(m.title) + '">' +
        '<td class="no">' + String(i + 1).padStart(2, '0') + '</td>' +
        '<td class="name"><b>' + esc(m.title.split('：')[0]) + '</b><span style="color:var(--tx3)"> — ' + esc(m.title.split('：')[1] || '') + '</span></td>' +
        '<td class="dur">' + m.minutes + ' 分钟 · ' + m.level + '</td>' +
        '<td class="st' + (isLearned ? '' : ' todo') + '">' + (isLearned ? '已学 ✓' : '未学') + '</td></tr>';
    }).join('');
    const quizLearned = store.data.quizBest[pid] != null;
    return '<table class="toc-table"><tbody>' +
      '<tr class="toc-proj-head"><td colspan="4"><span class="dot" style="background:' + p.colorHex + '"></span>' + esc(p.name) +
      '<span class="sub">' + esc(p.en) + ' · ' + learned + '/' + p.modules.length + ' 课</span></td></tr>' +
      rows +
      '<tr class="toc-row quiz-row" data-href="#/q/' + pid + '" tabindex="0" role="link"><td class="no">＋</td>' +
      '<td class="name"><i>实战测验</i> — ' + p.quiz.length + ' 道题，检验这一项目的掌握程度</td>' +
      '<td class="dur">' + (quizLearned ? '最高 ' + store.data.quizBest[pid] + ' 分' : '未作答') + '</td>' +
      '<td class="st' + (quizLearned ? '' : ' todo') + '">' + (quizLearned ? '已测' : '待测') + '</td></tr>' +
      '</tbody></table>';
  }).join('');

  const pathSteps = GEN.path.map(s => {
    const p = PROJ[s.proj];
    return '<a class="path-step" style="--pc:' + (p ? p.colorHex : '#6d28d9') + '" href="' + (s.proj === 'interview' ? '#/interview' : '#/p/' + s.proj) + '">' +
      '<span class="pen">' + icon('pen-line') + '</span><div><h4>' + esc(s.title) + '</h4><p>' + esc(s.desc) + '</p></div></a>';
  }).join('');

  const osMap = [
    { c: '#0c7d6f', t: '大模型应用（RAG）', items: [['run-llama/llama_index', 'RAG 框架标杆'], ['langchain-ai/langchain', 'LLM 应用全家桶'], ['chroma-core/chroma', '向量数据库'], ['Snailclimb/JavaGuide', '本项目语料来源']] },
    { c: '#a16207', t: 'Agent 与工具生态', items: [['All-Hands-AI/OpenHands', '开源自主 Agent'], ['Aider-AI/aider', 'AI 结对编程 CLI'], ['modelcontextprotocol/servers', 'MCP 官方服务'], ['asg017/sqlite-vec', 'SQLite 向量检索']] },
    { c: '#1e5fbb', t: '安卓与硬件', items: [['android/nowinandroid', '官方 MVVM 范例'], ['NordicSemiconductor/Android-BLE-Library', 'BLE 封装'], ['gphoto/libgphoto2', '开源 PTP 实现'], ['developer.android.com', '官方文档']] },
  ].map(g => '<div class="os-card" style="--accent:' + g.c + '"><h3>' + g.t + '</h3><ul>' +
    g.items.map(i => '<li><code>' + i[0] + '</code> — ' + i[1] + '</li>').join('') + '</ul></div>').join('');

  const paths = esc(PROJ.rag.path.split('\\').pop()) + ' · ' + esc(PROJ.agent.path.split('\\').pop()) + ' · ' + esc(PROJ.nlink.path.split('\\').pop());

  main.innerHTML = '<div class="fade-in"><div class="content-col home-wrap">' +
    '<div class="hero">' +
    '<div class="mono-tag">个人学习手册 · PRIVATE STUDY NOTES</div>' +
    '<div class="hero-title">三个项目已经上线了，<span class="accent">背后的技术</span>，现在亲手补上。</div>' +
    '<div class="hero-rule"></div>' +
    '<p>RAG 应用、Agent 架构、端侧 AI 与硬件通信，是 2026 年 AI 产品的三种核心形态。本手册把它们拆成 ' + totalMods + ' 节小课，每节配你自己项目里的真实代码、开源项目参考和面试讲法。学完一课标记一次，进度自动保存在本机。</p>' +
    '</div>' +
    '<div class="stat-strip">' +
    '<div class="stat"><div class="num">' + learnedMods + '<small> / ' + totalMods + '</small></div><div class="lbl">已学懂课程</div></div>' +
    '<div class="stat"><div class="num">' + qaDone + '<small> / ' + qaTotal + '</small></div><div class="lbl">面试题已掌握</div></div>' +
    '<div class="stat"><div class="num">' + termDone + '<small> / ' + GEN.glossary.length + '</small></div><div class="lbl">术语已掌握</div></div>' +
    '<div class="stat"><div class="num">' + PROJ_ORDER.filter(p => store.data.quizBest[p] != null).length + '<small> / 3</small></div><div class="lbl">测验已参与</div></div>' +
    '</div>' +
    secH('总目录', '按推荐顺序读：先面试宝典（RAG），再 WTH（Agent），最后 N-Link（移动端）') + tocTable +
    secH('学习路径', '每学完一个项目，就去面试实战页把对应问答过一遍') +
    '<div class="path-steps">' + pathSteps + '</div>' +
    secH('专项 · Agent 面试速通', '2.4 万行八股长文压成的复习手册，按考点分组') +
    '<a class="path-step" style="--pc:#b4451f" href="#/interv"><span class="pen">' + icon('zap') + '</span>' +
    '<div><h4>' + esc(INTERV.name) + '（' + INTERV.modules.length + ' 模块 · ' +
    INTERV.modules.reduce((n, m) => n + m.quiz.length, 0) + ' 道自测题）</h4>' +
    '<p>必背要点 + 知识卡片 + 图解 + 高频问答（含易错点）+ 自测题。覆盖基础概念、Runtime/Harness、Agent Loop、Checkpoint、上下文工程、ReAct、Planning、Tool Calling、MCP、Skills、Memory、Multi-Agent、安全、评测、框架、成本与系统设计题。</p></div></a>' +
    secH('专项 · 速通系列文档', '按文件划分的独立学习块，每块一套完整小课') +
    '<div class="kcard-grid stagger">' + (DOCS.docs || []).map(d =>
      '<a class="kcard" style="display:block;text-decoration:none;color:inherit" href="#/doc/' + d.id + '">' +
      '<h4><span class="kn" style="background:' + d.color + '">' + d.modules.length + '</span>' + esc(d.name) + '</h4>' +
      '<p style="font-size:12.5px;color:var(--tx2);margin:6px 0 0">' + esc(d.blurb) + '</p></a>').join('') + '</div>' +
    secH('专项 · AI PM 核心能力', '脱离具体项目的通用硬技能，按模块直接套模板') +
    '<a class="path-step" style="--pc:#b4451f" href="#/aipm"><span class="pen">' + icon('pen-line') + '</span>' +
    '<div><h4>AI 产品经理核心能力（8 模块实战）</h4><p>能力差对照 · 全链路工作流 · Prompt 产品化 · 模型选型与成本测算 · 评估体系 · RAG/Agent 设计 · 指标与埋点 · 合规安全。每模块：知识卡片 + 1 道实战题 + 自校验标准。</p></div></a>' +
    secH('开源学习地图', '每个技术方向都有一流的开源代码可以读') + osMap +
    '<div class="foot">基于本地三个项目源码（<span class="mono">' + paths + '</span>）与三份面试文档生成。<br>' +
    '学习进度保存在本机浏览器 · 按 <kbd>/</kbd> 全站搜索 · 纯静态页面，可离线使用，可直接打印。</div>' +
    '</div></div>';

  main.querySelectorAll('.toc-row').forEach(el => {
    const go = () => { location.hash = el.getAttribute('data-href'); };
    el.addEventListener('click', go);
    el.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  });
}

/* ---------- 项目概览页 ---------- */
function renderProjOverview(main, pid) {
  const p = PROJ[pid];
  const stackRows = p.overview.stack.map(r => '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>').join('');
  const tiles = p.overview.numbers.map(n =>
    '<div class="stat-tile" style="--pc:' + p.colorHex + '"><div class="v">' + esc(n[0]) + '</div><div class="k">' + esc(n[1]) + '</div></div>').join('');
  const flow = p.overview.flow.map(s => '<div class="flow-item">' + esc(s) + '</div>').join('');
  const links = (p.repo ? ' · <a href="' + p.repo + '" target="_blank" rel="noopener">GitHub 仓库</a>' : '') +
    (p.live ? ' · <a href="' + p.live + '" target="_blank" rel="noopener">在线访问</a>' : '');

  main.innerHTML = '<div class="fade-in"><div class="content-col" style="max-width:1080px">' +
    crumbHTML([{ t: '学习总览', href: '#/' }, { t: p.name }]) +
    '<h1 class="page-title" style="color:' + p.colorHex + '">' + esc(p.name) + '</h1>' +
    '<div class="chips"><span>' + esc(p.en) + '</span><span>·</span>' + p.tags.map(t => '<span>' + esc(t) + '</span>').join(' <span>·</span> ') + '</div>' +
    '<p class="summary-lead">' + esc(p.blurb) + '</p>' +
    '<p class="page-meta">源码 <code>' + esc(p.path) + '</code>' + links + '</p>' +
    secH('关键技术栈') +
    '<div class="stack-panel"><table class="stack-table">' + stackRows + '</table></div>' +
    secH('关键数字', '面试弹药，张口就来') +
    '<div class="stat-tiles stagger">' + tiles + '</div>' +
    secH('系统全景流程') +
    '<div class="stack-panel"><div class="flow" style="--pc:' + p.colorHex + '">' + flow + '</div></div>' +
    secH('开源项目参考') + refsHTML(p.overview.refs) +
    '<div class="mod-nav">' +
    '<a href="#/m/' + pid + '/' + p.modules[0].id + '"><span class="dir">开始学习</span>第一课 · ' + esc(shortTitle(p.modules[0].title)) + '</a>' +
    '<a class="next" href="#/q/' + pid + '"><span class="dir">检验成果</span>实战测验</a></div>' +
    '</div></div>';
}

/* ---------- 课程页（正文 + 本页目录） ---------- */
let progressHandler = null;
let tocObserver = null;
function renderModule(main, pid, mid) {
  const p = PROJ[pid], m = findModule(pid, mid);
  if (!m) { location.hash = '#/'; return; }
  const idx = moduleIndex(pid, mid);
  const learned = !!store.data.learned[m.id];

  const sectionsHTML = m.sections.map((sec, si) => {
    let h = '<div class="card" id="sec-' + si + '"><h3>' + esc(sec.h) + '</h3>' + (sec.body || '');
    if (sec.code) h += sec.code.map(codeblockHTML).join('');
    return h + '</div>';
  }).join('');

  const demoHTML = m.demo === 'tfidf' ? demoTfidfHTML() : m.demo === 'backoff' ? demoBackoffHTML() : '';

  const callouts =
    (m.pmNote ? '<div class="callout callout-pm"><div class="co-head">' + icon('info') + '产品视角 · 这个技术为什么重要</div><p>' + esc(m.pmNote) + '</p></div>' : '') +
    (m.warn ? '<div class="callout callout-warn"><div class="co-head">' + icon('alert') + esc(m.warn.title) + '</div>' + m.warn.body + '</div>' : '') +
    (m.hook ? '<div class="callout callout-hook"><div class="co-head">' + icon('flame') + '面试讲法</div><p>' + esc(m.hook) + '</p></div>' : '');

  const refs = (m.refs && m.refs.length)
    ? secH('本课开源参考') + refsHTML(m.refs) : '';

  const tocItems = m.sections.map((sec, si) =>
    '<a class="toc-link" data-toc="sec-' + si + '" href="#sec-' + si + '">' + esc(sec.h) + '</a>').join('') +
    '<a class="toc-link" data-toc="sec-end" href="#lesson-notes-end">本课小结</a>';

  const contentHTML =
    crumbHTML([{ t: '学习总览', href: '#/' }, { t: p.name, href: '#/p/' + pid }, { t: '第 ' + (idx + 1) + ' 课，共 ' + p.modules.length + ' 课' }]) +
    '<h1 class="page-title">' + esc(m.title) + '</h1>' +
    '<div class="chips"><span class="lvl lvl-' + m.level + '">' + m.level + '</span>' +
    '<span class="chip">' + icon('clock') + '约 ' + m.minutes + ' 分钟</span>' +
    '<span class="chip"><span class="chip-dot" style="background:' + p.colorHex + '"></span>' + esc(p.name) + '</span></div>' +
    '<p class="summary-lead">' + esc(m.summary) + '</p>' +
    '<button class="btn ' + (learned ? 'btn-primary done' : 'btn-ghost') + '" id="learnBtn" style="margin-top:18px">' + icon('check') + (learned ? '已学懂（点击取消）' : '标记为已学懂') + '</button>' +
    demoHTML +
    '<div class="sec">' + sectionsHTML + '</div>' +
    callouts + refs +
    modNavHTML(pid, p, idx) +
    '<div id="lesson-notes-end"></div>';

  main.innerHTML = '<div class="fade-in">' +
    '<div class="read-progress" id="readProgress"></div>' +
    '<div class="content-col">' + contentHTML + '</div>' +
    '</div>' + tocPanelHTML(tocItems);

  $('#learnBtn').addEventListener('click', () => {
    if (store.data.learned[m.id]) delete store.data.learned[m.id];
    else store.data.learned[m.id] = 1;
    store.save(); renderModule(main, pid, mid);
  });
  bindCopies(main);
  bindTocPanel(main);
  if (m.demo === 'tfidf') initTfidfDemo(main);
  if (m.demo === 'backoff') initBackoffDemo(main);

  /* 阅读进度（rAF 节流） */
  let ticking = false;
  progressHandler = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const bar = $('#readProgress');
      if (bar) {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        bar.style.width = (max > 0 ? Math.min(100, h.scrollTop / max * 100) : 0) + '%';
      }
      ticking = false;
    });
  };
  window.addEventListener('scroll', progressHandler, { passive: true });

  /* 本页目录 scrollspy */
  const targets = m.sections.map((_, si) => document.getElementById('sec-' + si)).filter(Boolean);
  targets.push(document.getElementById('lesson-notes-end'));
  if ('IntersectionObserver' in window && targets.length) {
    tocObserver = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        main.querySelectorAll('.toc-link').forEach(l => l.classList.toggle('active', l.getAttribute('data-toc') === en.target.id));
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    targets.forEach(t => tocObserver.observe(t));
  }
  main.querySelectorAll('.toc-link').forEach(l => l.addEventListener('click', e => {
    e.preventDefault();
    const t = document.getElementById(l.getAttribute('data-toc'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
}

/* ---------- 测验页 ---------- */
function renderQuiz(main, pid) {
  const p = PROJ[pid];
  const answered = {};
  let correct = 0, done = 0;

  const items = p.quiz.map((q, qi) => {
    const opts = q.opts.map((o, oi) =>
      '<button class="opt" data-q="' + qi + '" data-o="' + oi + '"><span class="ol">' + String.fromCharCode(65 + oi) + '</span><span>' + esc(o) + '</span></button>').join('');
    return '<div class="quiz-item"><div class="quiz-q"><span class="qno">' + String(qi + 1).padStart(2, '0') + '</span><span>' + esc(q.q) + '</span></div>' +
      opts + '<div class="quiz-explain" id="ex-' + qi + '"><div><div class="quiz-explain-inner">' + icon('info') + '<span>' + esc(q.why) + '</span></div></div></div></div>';
  }).join('');

  main.innerHTML = '<div class="fade-in"><div class="content-col">' +
    crumbHTML([{ t: '学习总览', href: '#/' }, { t: p.name, href: '#/p/' + pid }, { t: '实战测验' }]) +
    '<h1 class="page-title">' + esc(p.name) + ' · 实战测验</h1>' +
    '<div class="chips"><span class="chip">' + icon('zap') + p.quiz.length + ' 道题</span><span class="chip">点击选项即时判分</span><span class="chip">可反复刷</span></div>' +
    '<div class="quiz-score" id="scoreBox" style="display:none" aria-live="polite"></div>' +
    '<div class="stagger">' + items + '</div>' +
    '<div class="mod-nav"><span></span><a class="next" href="#/interview"><span class="dir">下一步</span>面试实战</a></div>' +
    '</div></div>';

  main.querySelectorAll('.opt').forEach(btn => btn.addEventListener('click', () => {
    const qi = +btn.getAttribute('data-q'), oi = +btn.getAttribute('data-o');
    if (answered[qi] !== undefined) return;
    answered[qi] = oi; done++;
    const item = btn.closest('.quiz-item');
    const ok = oi === p.quiz[qi].a;
    if (ok) correct++;
    item.querySelectorAll('.opt').forEach(ob => {
      const o = +ob.getAttribute('data-o');
      ob.disabled = true;
      if (o === p.quiz[qi].a) ob.classList.add('correct');
      else if (o === oi && !ok) ob.classList.add('wrong');
    });
    item.querySelector('.quiz-explain').classList.add('show');
    if (done === p.quiz.length) {
      const score = Math.round(correct / p.quiz.length * 100);
      const best = store.data.quizBest[pid];
      if (best == null || score > best) { store.data.quizBest[pid] = score; store.save(); }
      const box = $('#scoreBox');
      box.style.display = 'flex';
      box.innerHTML = '<span class="big">' + score + '</span><span>本次 ' + correct + ' / ' + p.quiz.length + ' 题' +
        (score === 100 ? ' · 满分，这个项目可以出师了' : ' · 错题看解析，再刷一轮') +
        '<br>历史最高 <b>' + Math.max(score, best == null ? 0 : best) + ' 分</b></span>' +
        '<button class="btn btn-ghost btn-sm" id="retryBtn" style="margin-left:auto">' + icon('refresh') + '重新测验</button>';
      $('#retryBtn').addEventListener('click', () => renderQuiz(main, pid));
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }));
}

/* ---------- 面试实战页 ---------- */
function renderInterview(main) {
  const qaTotal = GEN.qa.reduce((n, g) => n + g.items.length, 0);
  const groups = GEN.qa.map(g => {
    const pj = PROJ[g.proj];
    const items = g.items.map((it, ii) => {
      const key = g.proj + '-' + ii;
      const done = !!store.data.qaDone[key];
      return '<div class="qa' + (done ? ' open done-learn' : '') + '" data-key="' + key + '">' +
        '<div class="qa-head" role="button" tabindex="0" aria-expanded="' + (done ? 'true' : 'false') + '">' +
        (it.fire ? '<span class="fire" title="2026 时效热点">' + icon('flame') + '</span>' : '<span class="no-fire"></span>') +
        '<span class="q-text">' + esc(it.q) + '</span>' +
        '<button class="master-btn' + (done ? ' on' : '') + '" data-master="' + key + '">' + (done ? '已掌握' : '标记掌握') + '</button>' +
        '<span class="arrow">' + icon('chevron-down') + '</span></div>' +
        '<div class="qa-body"><div><ul>' + it.pts.map(pt => '<li>' + esc(pt) + '</li>').join('') + '</ul></div></div></div>';
    }).join('');
    return '<div class="qa-group" style="--pc:' + pj.colorHex + '"><div class="qa-group-title">' + esc(g.title) + '</div>' + items + '</div>';
  }).join('');

  const numCards = GEN.numberCards.map(n => {
    const pj = PROJ[n.proj];
    return '<button class="flip" style="--accent:' + pj.colorHex + '" aria-label="翻面查看细节"><div class="flip-inner">' +
      '<div class="flip-face flip-front"><span class="ff-num">' + esc(n.num) + '</span><span class="ff-corner">' + esc(pj.name.split('（')[0].split(' (')[0]) + '</span>' +
      '<span class="ff-lbl">' + esc(n.lbl) + '</span></div>' +
      '<div class="flip-face flip-back"><p>' + esc(n.back) + '</p></div></div></button>';
  }).join('');

  const hot = GEN.hotTerms.map(h => '<div class="term-card"><h4>' + esc(h.t) + '</h4><p>' + esc(h.d) + '</p>' +
    '<p class="apply">结合项目 — ' + esc(h.hook) + '</p></div>').join('');
  const tips = GEN.tips.map(t => '<div class="term-card"><h4>' + esc(t.t) + '</h4><p>' + esc(t.d) + '</p></div>').join('');
  const notes = GEN.introNotes.map(n => '<li><b>' + esc(n[0]) + '</b> — ' + esc(n[1]) + '</li>').join('');
  const introHTML = '<div class="card"><p style="font-size:14.5px;line-height:2.1;max-width:44em">' + GEN.intro30 + '</p>' +
    '<ul style="margin-top:14px;max-width:44em">' + notes + '</ul></div>';

  main.innerHTML = '<div class="fade-in"><div class="content-col" style="max-width:1040px">' +
    crumbHTML([{ t: '学习总览', href: '#/' }, { t: '面试实战' }]) +
    '<h1 class="page-title">面试实战</h1>' +
    '<div class="chips"><span class="chip">' + icon('flame') + qaTotal + ' 道高频题</span>' +
    '<span class="chip">' + Object.keys(store.data.qaDone).length + ' 已掌握</span>' +
    '<span class="chip">琥珀色火苗 = 2026 时效热点</span></div>' +
    secH('30 秒自我介绍', '背熟版——数字先行，标签开门') + introHTML +
    secH('数字弹药卡', '点击翻面看细节，面试前快速过一遍') +
    '<div class="flip-grid stagger">' + numCards + '</div>' +
    secH('通用加分策略') + tips +
    secH('2026 行业热词', '每个词都要能结合自己的项目讲出实践') + hot +
    secH('高频问答库', '点开看参考答案要点，掌握一条打卡一条') +
    groups + '</div></div>';

  main.querySelectorAll('.qa-head').forEach(h => {
    const toggle = () => {
      const qa = h.closest('.qa');
      qa.classList.toggle('open');
      h.setAttribute('aria-expanded', qa.classList.contains('open') ? 'true' : 'false');
    };
    h.addEventListener('click', e => { if (e.target.closest('.master-btn')) return; toggle(); });
    h.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('.master-btn')) { e.preventDefault(); toggle(); }
    });
  });
  main.querySelectorAll('[data-master]').forEach(btn => btn.addEventListener('click', e => {
    e.stopPropagation();
    const key = btn.getAttribute('data-master');
    if (store.data.qaDone[key]) delete store.data.qaDone[key]; else store.data.qaDone[key] = 1;
    store.save();
    const qa = btn.closest('.qa');
    const wasOpen = qa.classList.contains('open');
    renderInterview(main);
    const el = main.querySelector('[data-key="' + key + '"]');
    if (el) { if (wasOpen) el.classList.add('open'); el.scrollIntoView({ block: 'center' }); }
  }));
  main.querySelectorAll('.flip').forEach(f => f.addEventListener('click', () => f.classList.toggle('flipped')));
}

/* ---------- 术语表页 ---------- */
let glossFilter = '全部';
function renderGlossary(main) {
  const tags = ['全部', 'RAG', 'Agent', '安卓', '系统', 'AI'];
  const filterHTML = '<div class="gloss-filter">' + tags.map(t =>
    '<button class="gf' + (glossFilter === t ? ' active' : '') + '" data-f="' + t + '">' + t + '</button>').join('') + '</div>';
  const q = (renderGlossary.q || '').toLowerCase();
  const list = GEN.glossary.filter(g => (glossFilter === '全部' || g.tag === glossFilter) &&
    (!q || g.t.toLowerCase().includes(q) || g.d.toLowerCase().includes(q)));
  const rows = list.map(g => {
    const done = !!store.data.termDone[g.t];
    return '<div class="term-card"><h4>' + esc(g.t) +
      '<span class="term-tag">' + esc(g.tag) + '</span></h4><p>' + esc(g.d) + '</p>' +
      '<button class="master-btn' + (done ? ' on' : '') + '" data-term="' + esc(g.t) + '" style="margin-top:10px">' + (done ? '已掌握' : '标记掌握') + '</button></div>';
  }).join('');

  main.innerHTML = '<div class="fade-in"><div class="content-col" style="max-width:1040px">' +
    crumbHTML([{ t: '学习总览', href: '#/' }, { t: '术语速查表' }]) +
    '<h1 class="page-title">术语速查表</h1>' +
    '<div class="chips"><span class="chip">' + GEN.glossary.length + ' 个术语</span><span class="chip">' + Object.keys(store.data.termDone).length + ' 已掌握</span></div>' +
    filterHTML +
    '<div class="search-inner" style="max-width:420px;margin-bottom:14px">' +
    '<span>' + icon('search') + '</span>' +
    '<input id="glossSearch" type="search" placeholder="在术语表内搜索" value="' + esc(renderGlossary.q || '') + '" ' +
    'style="width:100%;background:var(--panel);border:1px solid var(--line);border-radius:5px;color:var(--tx);padding:9px 12px 9px 34px;font-size:13px;outline:none">' +
    '</div>' +
    (rows ? '<div class="stagger">' + rows + '</div>' : '<p style="color:var(--tx3)">没有匹配的术语</p>') + '</div></div>';

  main.querySelectorAll('[data-f]').forEach(b => b.addEventListener('click', () => { glossFilter = b.getAttribute('data-f'); renderGlossary(main); }));
  const inp = $('#glossSearch');
  inp.addEventListener('input', e => { renderGlossary.q = e.target.value; renderGlossary(main); const el = $('#glossSearch'); el.focus(); el.setSelectionRange(el.value.length, el.value.length); });
  main.querySelectorAll('[data-term]').forEach(btn => btn.addEventListener('click', () => {
    const t = btn.getAttribute('data-term');
    if (store.data.termDone[t]) delete store.data.termDone[t]; else store.data.termDone[t] = 1;
    store.save(); renderGlossary(main);
  }));
}

/* ---------- 互动实验 1：TF-IDF 检索模拟器 ---------- */
const DEMO_DOCS = [
  { title: 'RAG 如何降低幻觉', text: 'RAG 通过检索真实资料并要求模型仅基于资料回答，同时标注来源引用，可以显著降低幻觉，让答案可溯源、可验证。' },
  { title: 'Agent 工具调用入门', text: 'Agent 通过工具调用操作文件和命令，规划步骤并验证结果，把聊天机器人变成能干活的智能体。' },
  { title: '蓝牙连不上相机的排查', text: '相机蓝牙断连通常是后台被杀或心跳超时，检查前台服务和自动重连设置，必要时用 USB 有线兜底。' },
  { title: 'StateFlow 状态管理', text: 'StateFlow 让界面随数据自动刷新，配合 ViewModel 和协程处理耗时任务，屏幕旋转也不丢状态。' },
  { title: 'MCP 协议是什么', text: 'MCP 统一了智能体连接外部工具的协议，工具即插即用，被称为 AI 的 USB-C，各家大厂都已支持。' },
  { title: '简历优化建议', text: '优化简历要对照岗位 JD，突出匹配的技能与成果，用数字说话，保持真实、不编造经历。' },
];
function tokA(text) {
  return text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, ' ').split(/\s+/).filter(Boolean);
}
function tokB(text) {
  const base = tokA(text), out = [];
  for (const t of base) {
    if (/[\u4e00-\u9fa5]/.test(t)) {
      if (t.length === 1) out.push(t);
      else for (let i = 0; i < t.length - 1; i++) out.push(t.slice(i, i + 2));
    } else out.push(t);
  }
  return out;
}
function buildIndex(tok) {
  const docs = DEMO_DOCS.map(d => ({ ...d, tokens: tok(d.title + ' ' + d.text) }));
  const df = new Map(), N = docs.length;
  docs.forEach(d => new Set(d.tokens).forEach(t => df.set(t, (df.get(t) || 0) + 1)));
  const idf = new Map([...df.entries()].map(([t, n]) => [t, Math.log(N / (1 + n))]));
  docs.forEach(d => {
    const tf = new Map(); d.tokens.forEach(t => tf.set(t, (tf.get(t) || 0) + 1));
    const v = new Map(); for (const [t, c] of tf) v.set(t, (c / d.tokens.length) * (idf.get(t) || 0));
    d.vec = v;
  });
  return { docs, idf };
}
function cosine(v1, v2) {
  let dot = 0, n1 = 0, n2 = 0;
  for (const [t, x] of v1) { if (v2.has(t)) dot += x * v2.get(t); n1 += x * x; }
  for (const [, x] of v2) n2 += x * x;
  return (n1 && n2) ? dot / (Math.sqrt(n1) * Math.sqrt(n2)) : 0;
}
function queryVec(text, idf, tok) {
  const tokens = tok(text); const tf = new Map();
  tokens.forEach(t => tf.set(t, (tf.get(t) || 0) + 1));
  const v = new Map();
  for (const [t, c] of tf) v.set(t, (c / tokens.length) * (idf.get(t) || 0));
  return v;
}
function demoTfidfHTML() {
  return '<div class="demo-box"><div class="demo-label">' + icon('flask') + '互动实验 · TF-IDF 检索模拟器</div>' +
    '<p>6 篇迷你文档，算法与 vectorstore.js 完全一致。对比两个版本：<b style="color:var(--warn)">版本 A = 你的实现</b>（连续中文整句成一个 token），<b style="color:var(--acc-deep)">版本 B = bigram 改进版</b>。</p>' +
    '<input type="text" id="tfidfQ" placeholder="输入检索问题，如：RAG 怎么降低幻觉" value="RAG 怎么降低幻觉" aria-label="检索查询">' +
    '<button class="demo-btn" id="tfidfGo">' + icon('search') + '检索</button> ' +
    '<button class="demo-btn secondary" id="tfidfTry2">换个例子：Agent 干活</button>' +
    '<div id="tfidfOut"></div></div>';
}
function initTfidfDemo(main) {
  const out = $('#tfidfOut');
  const run = q => {
    if (!q.trim()) { out.innerHTML = '<p class="demo-note">先输入一个问题</p>'; return; }
    const ia = buildIndex(tokA), ib = buildIndex(tokB);
    const va = queryVec(q, ia.idf, tokA), vb = queryVec(q, ib.idf, tokB);
    const ra = ia.docs.map(d => ({ d, s: cosine(va, d.vec) })).sort((x, y) => y.s - x.s);
    const rb = ib.docs.map(d => ({ d, s: cosine(vb, d.vec) })).sort((x, y) => y.s - x.s);
    const ta = [...va.keys()], tb = [...vb.keys()];
    const col = (ver, res, tokens, color, note) => {
      const max = Math.max(res[0].s, 0.0001);
      return '<div><div class="tfidf-head"><span class="vname" style="color:' + color + '">版本 ' + ver + '</span>' +
        '<span class="badge">' + note + '</span></div>' +
        '<div class="token-row">' + tokens.map(t => '<b>' + esc(t) + '</b>').join(' / ') + '</div>' +
        res.map((r, i) => '<div class="doc-row"><div class="doc-title"><span class="rank">#' + (i + 1) + '</span>' + esc(r.d.title) +
          '<span class="score" style="color:' + (r.s > 0 ? color : 'var(--tx3)') + '">' + r.s.toFixed(3) + '</span></div>' +
          '<div class="score-bar"><i style="width:' + Math.round(r.s / max * 100) + '%;background:' + color + '"></i></div>' +
          '<div class="doc-snippet">' + esc(r.d.text.slice(0, 52)) + '…</div></div>').join('') + '</div>';
    };
    out.innerHTML = '<div class="tfidf-cols">' +
      col('A', ra, ta, 'var(--warn)', '你的实现：中文整句当一个 token') +
      col('B', rb, tb, 'var(--acc-deep)', '改进：中文按两字切分（bigram）') + '</div>';
    out.innerHTML += '<p class="demo-note">' +
      (ra[0].d.title === rb[0].d.title
        ? '两个版本第一名相同——当查询里的中文词恰好被标点/空格隔开、或直接是英文术语时，A 也能命中。试试「相机蓝牙一直断连怎么办」这种连贯中文长句，差异就出来了。'
        : '两个版本第一名不同：B 把「' + esc(rb[0].d.title) + '」排到了第一，A 全线 0 分——因为查询里的连贯中文整句在 A 中成了一个超长 token，和任何文档都对不上。这就是中文分词对检索质量的决定性影响。') + '</p>';
  };
  $('#tfidfGo').addEventListener('click', () => run($('#tfidfQ').value));
  $('#tfidfQ').addEventListener('keydown', e => { if (e.key === 'Enter') run($('#tfidfQ').value); });
  $('#tfidfTry2').addEventListener('click', () => { $('#tfidfQ').value = 'Agent 怎么帮我把活干了'; run($('#tfidfQ').value); });
  run($('#tfidfQ').value);
}

/* ---------- 互动实验 2：重连模拟器 ---------- */
const BO_STATES = ['DISCONNECTED', 'CONNECTING', 'BLE_CONNECTED', 'WIFI_UPGRADING', 'FULLY_CONNECTED', 'ERROR_WAITING_RETRY'];
function demoBackoffHTML() {
  return '<div class="demo-box"><div class="demo-label">' + icon('refresh') + '互动实验 · 指数退避重连模拟器</div>' +
    '<p>复刻 ConnectionStateMachine 的真实参数：断线后按 1s → 2s → 4s → 8s → 16s → 30s 重试（这里加速演示），永不放弃。点「模拟断线」看它怎么挣扎，随时点「恢复成功」看归零。</p>' +
    '<div class="bo-states" id="boStates"></div>' +
    '<div class="backoff-line" id="boChips"></div>' +
    '<div class="bo-log" id="boLog"></div>' +
    '<button class="demo-btn danger" id="boBreak">' + icon('zap') + '模拟断线</button> ' +
    '<button class="demo-btn ok" id="boFix">' + icon('check') + '模拟恢复成功</button> ' +
    '<button class="demo-btn secondary" id="boReset">重置</button></div>';
}
function initBackoffDemo(main) {
  let broken = false, running = false, timer = null;
  const pills = $('#boStates'), chips = $('#boChips'), log = $('#boLog');
  const paint = cur => {
    pills.innerHTML = BO_STATES.map(s =>
      '<span class="state-pill' + (s === cur ? (s === 'ERROR_WAITING_RETRY' ? ' cur err' : ' cur') : '') + '">' + s + '</span>').join('');
  };
  const paintChips = active => {
    chips.innerHTML = [1, 2, 4, 8, 16, 30, 30].map((d, i) =>
      '<span class="bo' + (i === active ? ' active' : '') + (i < active ? ' ok' : '') + '">' + d + 's</span>').join('');
  };
  paint('FULLY_CONNECTED'); paintChips(-1);
  const reset = () => { broken = false; running = false; clearTimeout(timer); paint('FULLY_CONNECTED'); paintChips(-1); log.textContent = ''; $('#boBreak').disabled = false; };
  $('#boBreak').addEventListener('click', () => {
    if (running) return; broken = true; running = true; $('#boBreak').disabled = true;
    log.textContent = 'BLE 心跳连续 3 次失败 → 判定掉线';
    paint('ERROR_WAITING_RETRY'); paintChips(0);
    const delays = [1, 2, 4, 8, 16, 30, 30]; let i = 0;
    const tick = () => {
      if (!broken) return;
      log.textContent = '第 ' + (i + 1) + ' 次重试 · 本次等待 ' + delays[i] + 's' + (i === 0 ? '（初始间隔 1s）' : '（上次 ' + delays[i - 1] + 's × 2）') + ' · 永不放弃';
      paintChips(i);
      i = Math.min(i + 1, delays.length - 1);
      timer = setTimeout(tick, 900);
    };
    timer = setTimeout(tick, 900);
  });
  $('#boFix').addEventListener('click', () => {
    if (!broken) return; broken = false;
    log.textContent = '重连成功！resetRetry() → 退避间隔归零';
    const seq = ['CONNECTING', 'BLE_CONNECTED', 'WIFI_UPGRADING', 'FULLY_CONNECTED']; let i = 0;
    paintChips(-1);
    const step = () => {
      if (i < seq.length) { paint(seq[i]); i++; timer = setTimeout(step, 450); }
      else { running = false; $('#boBreak').disabled = false; log.textContent = 'FULLY_CONNECTED —— 退避计数已归零，下一次断线从 1s 重新开始'; }
    };
    step();
  });
  $('#boReset').addEventListener('click', reset);
}

/* ---------- 专项：AI 产品经理核心能力 ---------- */
function renderAipmIndex(main) {
  const done = AIPM.modules.filter(m => store.data.learned[m.id]).length;
  const rows = AIPM.modules.map((m, i) => {
    const ok = !!store.data.learned[m.id];
    return '<tr class="toc-row" data-href="#/aipm/m/' + m.id + '" tabindex="0" role="link" aria-label="' + esc(m.title) + '">' +
      '<td class="no">' + String(i + 1).padStart(2, '0') + '</td>' +
      '<td class="name"><b>' + esc(m.title) + '</b></td>' +
      '<td class="dur">' + m.cards.length + ' 卡 · ' + m.minutes + ' 分钟</td>' +
      '<td class="st' + (ok ? '' : ' todo') + '">' + (ok ? '已完成 ✓' : '未完成') + '</td></tr>';
  }).join('');

  main.innerHTML = '<div class="fade-in"><div class="content-col" style="max-width:1080px">' +
    crumbHTML([{ t: '学习总览', href: '#/' }, { t: AIPM.name }]) +
    '<h1 class="page-title">' + esc(AIPM.name) + '</h1>' +
    '<div class="chips"><span class="chip">' + icon('book') + AIPM.modules.length + ' 个模块</span>' +
    '<span class="chip">' + done + ' 已完成</span><span class="chip">每模块 1 道实战题</span></div>' +
    '<p class="summary-lead">' + esc(AIPM.intro) + '</p>' +
    '<div class="callout callout-hook"><div class="co-head">' + icon('flame') + '使用方法</div>' +
    '<p>每个模块三步走：读知识卡片（模板/公式/清单，可直接搬进工作文档）→ 合上页面写实战题的产出物 → 展开校验标准逐条对照。写不出来再回来翻卡片，这才算学会。</p></div>' +
    secH('模块目录') +
    '<table class="toc-table"><tbody>' + rows + '</tbody></table>' +
    '</div></div>';

  main.querySelectorAll('.toc-row').forEach(el => {
    const go = () => { location.hash = el.getAttribute('data-href'); };
    el.addEventListener('click', go);
    el.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  });
}

function renderAipmModule(main, mid) {
  const m = AIPM.modules.find(x => x.id === mid);
  if (!m) { location.hash = '#/aipm'; return; }
  const idx = AIPM.modules.indexOf(m);
  const done = !!store.data.learned[m.id];

  const cardsHTML = m.cards.map((c, i) =>
    '<div class="kcard"><h4><span class="kn">' + String(i + 1).padStart(2, '0') + '</span>' + esc(c.t) + '</h4>' + c.body + '</div>').join('');

  const checkHTML =
    '<div class="check-block" id="checkBlock"><button class="check-toggle" id="checkToggle" aria-expanded="false">' +
    icon('check') + '做完练习了？展开校验标准（先别偷看）</button>' +
    '<div class="check-body"><div><div class="check-inner">' +
    '<h5>合格判定标准（逐条打勾，全部满足才算过）</h5><ul>' +
    m.exercise.pass.map(p => '<li>' + esc(p) + '</li>').join('') + '</ul>' +
    '<h5>核心得分点（合格之上拉开差距的地方）</h5><ul>' +
    m.exercise.points.map(p => '<li>' + esc(p) + '</li>').join('') + '</ul>' +
    '</div></div></div></div>';

  const prev = idx > 0
    ? '<a href="#/aipm/m/' + AIPM.modules[idx - 1].id + '"><span class="dir">上一模块</span>' + esc(AIPM.modules[idx - 1].title) + '</a>'
    : '<a href="#/aipm"><span class="dir">返回</span>专项目录</a>';
  const next = idx < AIPM.modules.length - 1
    ? '<a class="next" href="#/aipm/m/' + AIPM.modules[idx + 1].id + '"><span class="dir">下一模块</span>' + esc(AIPM.modules[idx + 1].title) + '</a>'
    : '<a class="next" href="#/interview"><span class="dir">专项完成？去复习</span>面试实战</a>';

  main.innerHTML = '<div class="fade-in"><div class="content-col" style="max-width:1080px">' +
    crumbHTML([{ t: '学习总览', href: '#/' }, { t: AIPM.name, href: '#/aipm' }, { t: '模块 ' + (idx + 1) + '，共 ' + AIPM.modules.length + ' 个' }]) +
    '<h1 class="page-title">' + esc(m.title) + '</h1>' +
    '<div class="chips"><span class="chip">' + icon('book') + m.cards.length + ' 张知识卡片</span>' +
    '<span class="chip">' + icon('clock') + '约 ' + m.minutes + ' 分钟</span>' +
    '<span class="chip">1 道实战题 + 自校验</span></div>' +
    '<button class="btn ' + (done ? 'btn-primary done' : 'btn-ghost') + '" id="aipmLearnBtn" style="margin-top:18px">' + icon('check') + (done ? '已完成（点击取消）' : '标记为已完成') + '</button>' +
    secH('知识卡片', '模板、公式、清单，可直接搬进你的工作文档') +
    '<div class="kcard-grid stagger">' + cardsHTML + '</div>' +
    secH('实战练习', '真实工作场景，产出真实工作物——先自己写完，再展开校验标准') +
    '<div class="demo-box"><div class="demo-label">' + icon('flask') + '场景任务</div>' +
    '<p><b>场景：</b>' + esc(m.exercise.scene) + '</p>' +
    '<p><b>任务：</b>' + esc(m.exercise.task) + '</p>' +
    '<p style="color:var(--tx3);font-size:12.5px;margin-top:10px">产出物建议用真实文档格式写（表格/一页纸），存在你的工作目录里——这些就是你下次开需求评审时的现成素材。</p>' +
    checkHTML + '</div>' +
    '<div class="mod-nav">' + prev + next + '</div>' +
    '</div></div>';

  $('#aipmLearnBtn').addEventListener('click', () => {
    if (store.data.learned[m.id]) delete store.data.learned[m.id];
    else store.data.learned[m.id] = 1;
    store.save(); renderAipmModule(main, mid);
  });
  $('#checkToggle').addEventListener('click', () => {
    const blk = $('#checkBlock');
    blk.classList.toggle('open');
    $('#checkToggle').setAttribute('aria-expanded', blk.classList.contains('open') ? 'true' : 'false');
  });
}

/* ---------- 专项：Agent 面试速通 ---------- */
const starHTML = n => '<span class="iv-stars" title="面试命中率 ' + n + '/5">' + '★'.repeat(n) + '<i>' + '★'.repeat(5 - n) + '</i></span>';
const lvlHTML = l => '<span class="iv-badge ' + l + '">' + l + '</span>';
const figHTML = imgs => '<div class="iv-fig-grid stagger">' + imgs.map(im =>
  '<figure class="iv-fig"><button class="iv-shot" type="button" data-src="' + im.src + '" data-cap="' + esc(im.cap) + '" aria-label="放大查看：' + esc(im.cap) + '">' +
  '<img src="' + im.src + '" alt="' + esc(im.cap) + '" loading="lazy" decoding="async">' +
  '<span class="iv-zoom">' + icon('expand') + '点击放大</span></button>' +
  '<figcaption>' + esc(im.cap) + '</figcaption></figure>').join('') + '</div>';

/* ---------- 图片放大（全屏灯箱） ---------- */
let lbEl = null;
function ensureLightbox() {
  if (lbEl) return lbEl;
  lbEl = document.createElement('div');
  lbEl.className = 'lb';
  lbEl.id = 'lightbox';
  lbEl.hidden = true;
  lbEl.innerHTML = '<div class="lb-backdrop" data-lb-close></div>' +
    '<figure class="lb-box"><img id="lbImg" alt=""><figcaption id="lbCap"></figcaption>' +
    '<button class="lb-close" data-lb-close aria-label="关闭放大">' + icon('x') + '</button></figure>';
  document.body.appendChild(lbEl);
  lbEl.addEventListener('click', e => { if (e.target.hasAttribute('data-lb-close')) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !lbEl.hidden) closeLightbox();
  });
  return lbEl;
}
function openLightbox(src, cap) {
  const el = ensureLightbox();
  el.querySelector('#lbImg').src = src;
  el.querySelector('#lbCap').textContent = cap || '';
  el.hidden = false;
  document.body.classList.add('lb-open');
  el.querySelector('.lb-close').focus();
}
function closeLightbox() {
  if (!lbEl || lbEl.hidden) return;
  lbEl.hidden = true;
  document.body.classList.remove('lb-open');
  const img = lbEl.querySelector('#lbImg');
  if (img) img.removeAttribute('src');
}
/* ---------- 本页目录：停靠在侧边栏右侧留白区的悬浮面板 ---------- */
const TOC_W = 176;
function tocPanelHTML(links) {
  return '<button class="toc-fab" id="tocFab" type="button" aria-expanded="false" aria-controls="tocPanel" title="展开 / 收起本页目录">' +
    icon('list') + '<span>目录</span></button>' +
    '<div class="toc-backdrop" id="tocBackdrop" hidden></div>' +
    '<aside class="toc-panel" id="tocPanel" hidden aria-label="本页目录">' +
    '<div class="toc-panel-head"><span class="toc-panel-label">本 页 目 录</span>' +
    '<button class="toc-close" id="tocClose" type="button" aria-label="收起目录">' + icon('x') + '</button></div>' +
    links + '</aside>';
}
function tocGeom() {
  const sb = document.getElementById('sidebar');
  const content = document.querySelector('#main .content-col');
  if (!sb || !content) return null;
  const sbR = Math.max(sb.getBoundingClientRect().right, 0);
  const cL = content.getBoundingClientRect().left;
  return { sbR: sbR, gutter: cL - sbR };
}
/* 留白太窄时把目录按钮收成圆形图标，避免压到正文 */
function layoutTocFab() {
  const fab = document.getElementById('tocFab');
  if (!fab) return;
  const g = tocGeom(); if (!g) return;
  const compact = g.gutter < 104;
  fab.classList.toggle('compact', compact);
  if (compact) fab.style.left = (g.sbR + 10) + 'px';
}
function positionTocPanel() {
  const panel = document.getElementById('tocPanel');
  const fab = document.getElementById('tocFab');
  const bd = document.getElementById('tocBackdrop');
  if (!panel || panel.hidden || !fab) return;
  const g = tocGeom(); if (!g) return;
  
  const dockX = g.sbR + Math.max(14, (g.gutter - TOC_W) / 2);
  const overlay = g.gutter < TOC_W + 30;
  if (!fab.classList.contains('compact')) fab.style.left = dockX + 'px';
  panel.style.left = dockX + 'px';
  panel.classList.toggle('overlay', overlay);
  if (bd) bd.hidden = !overlay;
}
function setTocOpen(open) {
  const panel = document.getElementById('tocPanel');
  const fab = document.getElementById('tocFab');
  const bd = document.getElementById('tocBackdrop');
  if (!panel || !fab) return;
  fab.setAttribute('aria-expanded', open ? 'true' : 'false');
  fab.classList.toggle('on', open);
  if (open) { panel.hidden = false; positionTocPanel(); }
  else { panel.hidden = true; if (bd) bd.hidden = true; }
}
function bindTocPanel(main) {
  const fab = document.getElementById('tocFab');
  const panel = document.getElementById('tocPanel');
  const bd = document.getElementById('tocBackdrop');
  if (!fab || !panel) return;
  fab.addEventListener('click', () => setTocOpen(panel.hidden));
  const closeBtn = document.getElementById('tocClose');
  if (closeBtn) closeBtn.addEventListener('click', () => setTocOpen(false));
  if (bd) bd.addEventListener('click', () => setTocOpen(false));
  panel.addEventListener('click', e => {
    if (e.target.closest('.toc-link') && panel.classList.contains('overlay')) setTocOpen(false);
  });
  layoutTocFab();
  /* 宽屏默认展开（停靠在留白区）；留白不够宽时默认收起，点按钮临时浮出 */
  const g = tocGeom();
  setTocOpen(!!g && g.gutter >= TOC_W + 30);
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.querySelector('.toc-panel:not([hidden])')) setTocOpen(false);
});
window.addEventListener('resize', () => {
  layoutTocFab();
  if (document.querySelector('.toc-panel:not([hidden])')) positionTocPanel();
});

/* 宽表格包一层横向滚动容器，避免窄屏把整页撑宽 */
function wrapTables(root) {
  root.querySelectorAll('.ktable').forEach(t => {
    if (t.parentElement.classList.contains('tscroll')) return;
    const d = document.createElement('div');
    d.className = 'tscroll';
    t.parentNode.insertBefore(d, t);
    d.appendChild(t);
  });
}

function bindLightbox(root) {
  root.querySelectorAll('.iv-shot').forEach(btn => btn.addEventListener('click', () => {
    openLightbox(btn.getAttribute('data-src'), btn.getAttribute('data-cap'));
  }));
}

function renderIntervIndex(main) {
  const done = INTERV.modules.filter(m => store.data.learned[m.id]).length;
  const totals = {
    cards: INTERV.modules.reduce((n, m) => n + m.cards.length, 0),
    qa: INTERV.modules.reduce((n, m) => n + m.qa.length, 0),
    quiz: INTERV.modules.reduce((n, m) => n + m.quiz.length, 0),
    min: INTERV.modules.reduce((n, m) => n + m.minutes, 0),
  };

  const groups = INTERV.groups.map((g, gi) => {
    const ms = INTERV.modules.filter(m => m.grp === g.key);
    const rows = ms.map(m => {
      const ok = !!store.data.learned[m.id];
      const best = store.data.quizBest['iv-' + m.id];
      return '<tr class="toc-row" data-href="#/interv/m/' + m.id + '" tabindex="0" role="link" aria-label="' + esc(m.title) + '">' +
        '<td class="no">' + m.id.slice(3) + '</td>' +
        '<td class="name"><b>' + esc(m.title) + '</b> ' + lvlHTML(m.lvl) + starHTML(m.star) +
        (m.imgs && m.imgs.length ? '<span class="fig-tag">' + icon('layers') + m.imgs.length + ' 图</span>' : '') + '</td>' +
        '<td class="dur">' + m.minutes + ' 分钟 · ' + m.cards.length + ' 卡 · ' + m.qa.length + ' 问 · ' + m.quiz.length + ' 题</td>' +
        '<td class="st' + (ok ? '' : ' todo') + '">' + (best != null ? '测 ' + best + ' 分' : (ok ? '已过 ✓' : '未学')) + '</td></tr>';
    }).join('');
    const gDone = ms.filter(m => store.data.learned[m.id]).length;
    return '<table class="toc-table"><tbody>' +
      '<tr class="toc-proj-head"><td colspan="4"><span class="dot" style="background:#b4451f"></span>' + esc(g.name) +
      '<span class="sub">' + gDone + ' / ' + ms.length + ' 模块</span></td></tr>' + rows + '</tbody></table>';
  }).join('');

  main.innerHTML = '<div class="fade-in"><div class="content-col" style="max-width:1140px">' +
    crumbHTML([{ t: '学习总览', href: '#/' }, { t: INTERV.name }]) +
    '<h1 class="page-title">' + esc(INTERV.name) + '</h1>' +
    '<div class="chips"><span class="chip">' + icon('book') + INTERV.modules.length + ' 个模块</span>' +
    '<span class="chip">' + icon('clock') + '全程约 ' + Math.round(totals.min / 60 * 10) / 10 + ' 小时</span>' +
    '<span class="chip">' + totals.cards + ' 知识卡片</span>' +
    '<span class="chip">' + totals.qa + ' 道高频问答</span>' +
    '<span class="chip">' + totals.quiz + ' 道自测题</span>' +
    '<span class="chip">' + done + ' 个已过</span></div>' +
    '<p class="summary-lead">' + esc(INTERV.intro) + '</p>' +
    '<div class="callout callout-hook"><div class="co-head">' + icon('flame') + '三步复习法</div>' +
    '<p>一、先读「必背要点」——那几句是要原样复述给面试官的；二、翻知识卡片补齐细节，重点看标红的词；三、合上页面做「高频问答」自测，答不出来的展开对照「易错点」。最后用自测题验收，低于 80 分回头重刷该模块。</p></div>' +
    '<div class="callout callout-warn"><div class="co-head">' + icon('alert') + '优先级怎么排</div>' +
    '<p>时间只剩 2 小时：只刷标了「必考」且命中率 5 星的模块，顺序为 iv-08 Loop → iv-11 Checkpoint → iv-06 Harness/Runtime → iv-12 上下文工程 → iv-19 MCP → iv-21 渐进式披露 → iv-25 Memory。这几个是面试官追问密度最高的。</p></div>' +
    secH('模块目录', '按分组排列，每组内部即推荐复习顺序') + groups +
    '</div></div>';

  main.querySelectorAll('.toc-row').forEach(el => {
    const go = () => { location.hash = el.getAttribute('data-href'); };
    el.addEventListener('click', go);
    el.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  });
}

/* 通用「学习模块」渲染器：面试速通与速通系列文档共用 */
function renderStudyModule(main, ds, mid, o) {
  const m = ds.modules.find(x => x.id === mid);
  if (!m) { location.hash = o.indexHash; return; }
  const idx = ds.modules.indexOf(m);
  const done = !!store.data.learned[m.id];
  const hasFull = !!o.hasFull && !!m.full && m.full.length > 0;

  /* 必背要点：每条都挂上它回答的那道题（按问题分组，组内保持原顺序） */
  const mustGroups = (function () {
    const map = new Map();
    const pmList = (m.pointMap || []).map(v => (typeof v === 'number' ? { t: 'qa', i: v } : v));
    pmList.forEach((mp, pi) => {
      const key = mp.t === 'none' ? 'none' : mp.t + ':' + mp.i;
      if (!map.has(key)) map.set(key, { mp: mp, pts: [] });
      map.get(key).pts.push(m.points[pi]);
    });
    const rank = { full: 0, qa: 1, none: 2 };
    return [...map.values()]
      .sort((a, b) => rank[a.mp.t] - rank[b.mp.t] || (a.mp.i || 0) - (b.mp.i || 0))
      .map(g => {
        let head;
        if (g.mp.t === 'none') {
          head = '<div class="must-q bare"><span class="mq-tag">通</span>' +
            '<span class="mq-text">通用要点 · 本模块没有对应的原文问题</span></div>';
        } else {
          const isFull = g.mp.t === 'full';
          const src = isFull ? m.full[g.mp.i] : m.qa[g.mp.i];
          head = '<button class="must-q" type="button" data-goto="' +
            (isFull ? 'iv-full-' : 'iv-qa-') + g.mp.i + '" title="跳到这道题的标准回答">' +
            '<span class="mq-tag">问</span>' +
            '<span class="mq-text">' + esc(src.q) + '</span>' +
            (isFull || !o.hasFull ? '' : '<span class="mq-src">精编问答</span>') +
            '<span class="mq-go">' + icon('arrow-right') + '</span></button>';
        }
        return '<div class="must-group">' + head + '<ol>' +
          g.pts.map(p => '<li>' + p + '</li>').join('') + '</ol></div>';
      }).join('');
  })();

  const mustHTML = '<div class="must"><h5>必背要点 · 照着说就能拿分</h5>' +
    '<p class="must-hint">每条要点都标注了它回答的那道题，点问题直接跳到下方的标准回答。</p>' +
    mustGroups + '</div>';

  const cardsHTML = m.cards.map((c, i) =>
    '<div class="kcard"><h4><span class="kn">' + String(i + 1).padStart(2, '0') + '</span>' + esc(c.t) + '</h4>' + c.body + '</div>').join('');

  const qaHTML = m.qa.map((q, i) =>
    '<div class="qa" id="iv-qa-' + i + '" data-i="' + i + '">' +
    '<div class="qa-head" role="button" tabindex="0" aria-expanded="false">' +
    '<span class="no-fire"></span><span class="q-text">' + esc(q.q) + '</span>' +
    '<span class="arrow">' + icon('chevron-down') + '</span></div>' +
    '<div class="qa-body"><div><div class="qa-answer">' + q.a + '</div>' +
    (q.pit ? '<div class="pit">' + icon('alert') + '<div><b>易错点 · </b>' + esc(q.pit) + '</div></div>' : '') +
    '</div></div></div>').join('');

  const quizHTML = m.quiz.map((q, qi) => {
    const opts = q.opts.map((o, oi) =>
      '<button class="opt" data-q="' + qi + '" data-o="' + oi + '"><span class="ol">' + String.fromCharCode(65 + oi) + '</span><span>' + esc(o) + '</span></button>').join('');
    return '<div class="quiz-item"><div class="quiz-q"><span class="qno">' + String(qi + 1).padStart(2, '0') + '</span><span>' + esc(q.q) + '</span></div>' +
      opts + '<div class="quiz-explain" id="ex-' + qi + '"><div><div class="quiz-explain-inner">' + icon('info') + '<span>' + esc(q.why) + '</span></div></div></div></div>';
  }).join('');

  const prev = idx > 0
    ? '<a href="' + o.url(ds.modules[idx - 1]) + '"><span class="dir">上一模块</span>' + esc(ds.modules[idx - 1].title) + '</a>'
    : '<a href="' + o.indexHash + '"><span class="dir">返回</span>模块目录</a>';
  const next = idx < ds.modules.length - 1
    ? '<a class="next" href="' + o.url(ds.modules[idx + 1]) + '"><span class="dir">下一模块</span>' + esc(ds.modules[idx + 1].title) + '</a>'
    : '<a class="next" href="' + o.doneHash + '"><span class="dir">全部刷完？去</span>' + esc(o.doneLabel) + '</a>';

  const fullHTML = hasFull ? m.full.map((q, i) =>
    '<div class="qa qa-full" id="iv-full-' + i + '" data-i="' + i + '">' +
    '<div class="qa-head" role="button" tabindex="0" aria-expanded="false">' +
    '<span class="no-fire"></span><span class="q-text"><span class="fno">' + String(i + 1).padStart(2, '0') + '</span>' + esc(q.q) + '</span>' +
    '<span class="arrow">' + icon('chevron-down') + '</span></div>' +
    '<div class="qa-body"><div><div class="qa-answer qa-answer-full">' + q.a + '</div></div></div></div>').join('') : '';

  /* 本页目录：与正文各章节一一对应 */
  const secDefs = [
    ['iv-s-must', '必背要点'],
    ['iv-s-cards', '知识卡片'],
    m.imgs && m.imgs.length ? ['iv-s-fig', '图解'] : null,
    ['iv-s-qa', '高频问答'],
    hasFull ? ['iv-s-full', '完整标准回答'] : null,
    ['iv-s-quiz', '自测题'],
  ].filter(Boolean);
  const tocHTML = secDefs.map(s =>
    '<a class="toc-link" data-toc="' + s[0] + '" href="#' + s[0] + '">' + esc(s[1]) + '</a>').join('');

  main.innerHTML = '<div class="fade-in">' +
    '<div class="content-col iv-content">' +
    crumbHTML(o.crumb) +
    '<h1 class="page-title">' + esc(m.title) + '</h1>' +
    '<div class="chips"><span class="chip">' + String(idx + 1).padStart(2, '0') + ' / ' + ds.modules.length + '</span>' + lvlHTML(m.lvl) +
    '<span class="chip">' + starHTML(m.star) + '</span>' +
    '<span class="chip">' + icon('clock') + '约 ' + m.minutes + ' 分钟</span>' +
    '<span class="chip">' + m.cards.length + ' 卡 · ' + m.qa.length + ' 问 · ' + m.quiz.length + ' 题' +
    (hasFull ? ' · ' + m.full.length + ' 原文' : '') + '</span>' +
    (m.imgs && m.imgs.length ? '<span class="chip">' + icon('layers') + m.imgs.length + ' 张图解</span>' : '') + '</div>' +
    '<button class="btn ' + (done ? 'btn-primary done' : 'btn-ghost') + '" id="learnBtn" style="margin-top:18px">' + icon('check') + (done ? '已过（点击取消）' : '标记为已过') + '</button>' +
    '<div id="iv-s-must">' + secH('必背要点', '时间不够就只背这一段') + mustHTML + '</div>' +
    '<div id="iv-s-cards">' + secH('知识卡片', '细节、对比表与设计套路') +
    '<div class="kcard-grid stagger">' + cardsHTML + '</div></div>' +
    (m.imgs && m.imgs.length ? '<div id="iv-s-fig">' + secH('图解', '看图记结构，比背文字快；点击图片可放大') + figHTML(m.imgs) + '</div>' : '') +
    '<div id="iv-s-qa">' + secH('高频问答', '先自己口述一遍，再展开对照；红框是易错点') +
    '<div class="iv-qa-list">' + qaHTML + '</div></div>' +
    (hasFull ? '<div id="iv-s-full">' + secH('完整标准回答', '原文全量逐条收录，共 ' + m.full.length + ' 题，未做删减') +
    '<div class="callout callout-pm"><div class="co-head">' + icon('info') + '这一节怎么用</div>' +
    '<p>上面「高频问答」是精编版（要点 + 易错点，适合快速过），这一节是<b>原文全量</b>，题目和答案逐字保留。精编版没看懂、或者想看完整表述的，来这里查；面试前用它查漏补缺。</p></div>' +
    '<div class="iv-qa-list">' + fullHTML + '</div></div>' : '') +
    '<div id="iv-s-quiz">' + secH('自测题', '点击选项即时判分，可反复刷') +
    '<div class="quiz-score" id="scoreBox" style="display:none" aria-live="polite"></div>' +
    '<div class="stagger">' + quizHTML + '</div></div>' +
    '<div class="mod-nav">' + prev + next + '</div>' +
    '</div></div>' + tocPanelHTML(tocHTML);

  $('#learnBtn').addEventListener('click', () => {
    if (store.data.learned[m.id]) delete store.data.learned[m.id];
    else store.data.learned[m.id] = 1;
    store.save(); renderIntervModule(main, mid);
  });

  main.querySelectorAll('.qa-head').forEach(h => {
    const toggle = () => {
      const qa = h.closest('.qa');
      qa.classList.toggle('open');
      h.setAttribute('aria-expanded', qa.classList.contains('open') ? 'true' : 'false');
    };
    h.addEventListener('click', toggle);
    h.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });

  /* 必背要点 → 对应问题：点问题跳到答案并展开 */
  main.querySelectorAll('.must-q[data-goto]').forEach(btn => btn.addEventListener('click', () => {
    const t = document.getElementById(btn.getAttribute('data-goto'));
    if (!t) return;
    const head = t.querySelector('.qa-head');
    if (head && !t.classList.contains('open')) head.click();
    setTimeout(() => {
      const y = t.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
      t.classList.add('flash');
      setTimeout(() => t.classList.remove('flash'), 1800);
    }, 620);
  }));

  /* 本页目录：平滑滚动 + 滚动高亮 */
  if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }
  main.querySelectorAll('.toc-link').forEach(l => l.addEventListener('click', e => {
    e.preventDefault();
    const t = document.getElementById(l.getAttribute('data-toc'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  const tocTargets = secDefs.map(s => document.getElementById(s[0])).filter(Boolean);
  if ('IntersectionObserver' in window && tocTargets.length) {
    tocObserver = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        main.querySelectorAll('.toc-link').forEach(l =>
          l.classList.toggle('active', l.getAttribute('data-toc') === en.target.id));
      });
    }, { rootMargin: '-12% 0px -72% 0px' });
    tocTargets.forEach(t => tocObserver.observe(t));
    const first = main.querySelector('.toc-link');
    if (first) first.classList.add('active');
  }

  wrapTables(main);
  bindTocPanel(main);
  bindLightbox(main);

  const answered = {};
  let correct = 0, count = 0;
  main.querySelectorAll('.opt').forEach(btn => btn.addEventListener('click', () => {
    const qi = +btn.getAttribute('data-q'), oi = +btn.getAttribute('data-o');
    if (answered[qi] !== undefined) return;
    answered[qi] = oi; count++;
    const item = btn.closest('.quiz-item');
    const ok = oi === m.quiz[qi].a;
    if (ok) correct++;
    item.querySelectorAll('.opt').forEach(ob => {
      const o = +ob.getAttribute('data-o');
      ob.disabled = true;
      if (o === m.quiz[qi].a) ob.classList.add('correct');
      else if (o === oi && !ok) ob.classList.add('wrong');
    });
    item.querySelector('.quiz-explain').classList.add('show');
    if (count === m.quiz.length) {
      const score = Math.round(correct / m.quiz.length * 100);
      const key = o.quizKey(m);
      const best = store.data.quizBest[key];
      if (best == null || score > best) { store.data.quizBest[key] = score; store.save(); }
      const box = $('#scoreBox');
      box.style.display = 'flex';
      box.innerHTML = '<span class="big">' + score + '</span><span>本次 ' + correct + ' / ' + m.quiz.length + ' 题' +
        (score === 100 ? ' · 满分' : score >= 80 ? ' · 过关，错题看一眼解析' : ' · 建议重刷本模块') +
        '<br>历史最高 <b>' + Math.max(score, best == null ? 0 : best) + ' 分</b></span>' +
        '<button class="btn btn-ghost btn-sm" id="ivRetryBtn" style="margin-left:auto">' + icon('refresh') + '重新测验</button>';
      $('#ivRetryBtn').addEventListener('click', () => renderIntervModule(main, mid));
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }));

  initReveal(main);
}

/* 面试速通：走通用渲染器，含「原文全量问答」一节 */
function renderIntervModule(main, mid) {
  if (!INTERV.modules.some(x => x.id === mid)) { location.hash = '#/interv'; return; }
  const m = INTERV.modules.find(x => x.id === mid);
  const g = INTERV.groups.find(x => x.key === m.grp) || { name: '' };
  renderStudyModule(main, INTERV, mid, {
    hasFull: true,
    crumb: [{ t: '学习总览', href: '#/' }, { t: INTERV.name, href: '#/interv' }, { t: g.name }],
    indexHash: '#/interv', doneHash: '#/interview', doneLabel: '面试实战',
    url: mm => '#/interv/m/' + mm.id,
    quizKey: mm => 'iv-' + mm.id,
  });
}

/* ---------- 速通系列文档：每份文档一个独立学习块 ---------- */
function docById(id) { return (DOCS.docs || []).find(d => d.id === id); }

function renderDocIndex(main, docId) {
  const doc = docById(docId);
  if (!doc) { location.hash = '#/'; return; }
  const done = doc.modules.filter(m => store.data.learned[m.id]).length;
  const mins = doc.modules.reduce((n, m) => n + m.minutes, 0);
  const rows = doc.modules.map((m, i) => {
    const ok = !!store.data.learned[m.id];
    const best = store.data.quizBest[m.id];
    return '<tr class="toc-row" data-href="#/doc/' + doc.id + '/m/' + m.id + '" tabindex="0" role="link">' +
      '<td class="no">' + String(i + 1).padStart(2, '0') + '</td>' +
      '<td class="name"><b>' + esc(m.title) + '</b> ' + lvlHTML(m.lvl) + starHTML(m.star) + '</td>' +
      '<td class="dur">' + m.minutes + ' 分钟 · ' + m.cards.length + ' 卡 · ' + m.qa.length + ' 问 · ' + m.quiz.length + ' 题</td>' +
      '<td class="st' + (ok ? '' : ' todo') + '">' + (best != null ? '测 ' + best + ' 分' : (ok ? '已过 ✓' : '未学')) + '</td></tr>';
  }).join('');
  main.innerHTML = '<div class="fade-in"><div class="content-col" style="max-width:1140px">' +
    crumbHTML([{ t: '学习总览', href: '#/' }, { t: doc.name }]) +
    '<h1 class="page-title">' + esc(doc.name) + '</h1>' +
    '<div class="chips"><span class="chip">' + icon('book') + doc.modules.length + ' 个模块</span>' +
    '<span class="chip">' + icon('clock') + '全程约 ' + (Math.round(mins / 60 * 10) / 10) + ' 小时</span>' +
    '<span class="chip">' + done + ' 个已过</span></div>' +
    '<p class="summary-lead">' + esc(doc.blurb) + '</p>' +
    secH('模块目录', '按原文顺序排列，建议从上往下过') +
    '<table class="toc-table"><tbody>' +
    '<tr class="toc-proj-head"><td colspan="4"><span class="dot" style="background:' + doc.color + '"></span>' + esc(doc.name) +
    '<span class="sub">' + done + ' / ' + doc.modules.length + ' 模块</span></td></tr>' + rows + '</tbody></table>' +
    '</div></div>';
  main.querySelectorAll('.toc-row').forEach(el => {
    const go = () => { location.hash = el.getAttribute('data-href'); };
    el.addEventListener('click', go);
    el.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  });
}

function renderDocModule(main, docId, mid) {
  const doc = docById(docId);
  if (!doc) { location.hash = '#/'; return; }
  renderStudyModule(main, doc, mid, {
    hasFull: false,
    crumb: [{ t: '学习总览', href: '#/' }, { t: doc.name, href: '#/doc/' + doc.id }],
    indexHash: '#/doc/' + doc.id, doneHash: '#/doc/' + doc.id, doneLabel: doc.name,
    url: mm => '#/doc/' + doc.id + '/m/' + mm.id,
    quizKey: mm => mm.id,
  });
}

/* ---------- 滚动揭示（motion-web skill 规范） ----------
   只给「视口下方」的内容加入场；首屏内容保持原样，不做入场动画。
   未启用（无 IntersectionObserver / reduced-motion / 脚本失败）时不留任何起始态，
   因此内容永远不会卡在隐藏状态。 */
const RV_SEL = '.kcard,.stat-tile,.flip,.term-card,.ref-card,.path-step,.stack-panel,.toc-table,.qa-group,.iv-fig';
let rvObserver = null;
function initReveal(root) {
  if (rvObserver) { rvObserver.disconnect(); rvObserver = null; }
  const html = document.documentElement;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) { html.removeAttribute('data-rv'); return; }
  const vh = window.innerHeight || 800;
  const items = [];
  root.querySelectorAll(RV_SEL).forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.height > 0 && r.top > vh * 0.88) items.push(el);   /* 视口内的一律不加入场 */
  });
  if (!items.length) { html.removeAttribute('data-rv'); return; }
  html.setAttribute('data-rv', 'on');
  /* 同一父容器内按 70ms 错峰（skill standard-list） */
  const byParent = new Map();
  items.forEach(el => {
    const k = el.parentElement;
    if (!byParent.has(k)) byParent.set(k, []);
    byParent.get(k).push(el);
  });
  byParent.forEach(list => list.forEach((el, i) => {
    el.style.setProperty('--rv-d', Math.min(i * 70, 350) + 'ms');
    if (el.classList.contains('iv-fig')) el.classList.add('rv-fig');
    el.classList.add('rv');
  }));
  rvObserver = new IntersectionObserver((ents, obs) => {
    ents.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('rv-in');
      obs.unobserve(el);
      /* 播完只清掉错峰延时；保留 rv/rv-in —— 若移除，.stagger 的入场动画
         会被重新挂上并重播一次。 */
      setTimeout(() => el.style.removeProperty('--rv-d'), 900);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
  items.forEach(el => rvObserver.observe(el));
  /* 兜底：1.2s 后把「已在视口内却仍未揭示」的补上，杜绝卡隐藏 */
  setTimeout(() => {
    items.forEach(el => {
      if (el.classList.contains('rv-in')) return;
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        el.classList.add('rv-in');
        el.style.removeProperty('--rv-d');
      }
    });
  }, 1200);
}

/* ---------- 全局搜索 ---------- */
let searchIndex = null;
function buildSearchIndex() {
  searchIndex = [];
  PROJ_ORDER.forEach(pid => {
    const p = PROJ[pid];
    p.modules.forEach(m => searchIndex.push({ type: '课程', pid, mid: m.id, proj: p.name, title: m.title, text: m.keywords + ' ' + m.summary }));
  });
  GEN.qa.forEach(g => g.items.forEach(it => searchIndex.push({ type: '面试题', hash: '#/interview', proj: g.title, title: it.q, text: it.pts.join(' ') })));
  AIPM.modules.forEach(m => searchIndex.push({
    type: '专项', hash: '#/aipm/m/' + m.id, proj: AIPM.name, title: m.title,
    text: m.cards.map(c => c.t + ' ' + c.body.replace(/<[^>]+>/g, ' ')).join(' ').slice(0, 400),
  }));
  GEN.glossary.forEach(g => searchIndex.push({ type: '术语', hash: '#/glossary', proj: g.tag, title: g.t, text: g.d }));
  INTERV.modules.forEach(m => searchIndex.push({
    type: '面试', hash: '#/interv/m/' + m.id, proj: INTERV.name, title: m.title,
    text: m.points.join(' ') + ' ' + m.cards.map(c => c.t + ' ' + c.body.replace(/<[^>]+>/g, ' ')).join(' ').slice(0, 500),
  }));
  INTERV.modules.forEach(m => m.qa.forEach(q => searchIndex.push({
    type: '面试题', hash: '#/interv/m/' + m.id, proj: INTERV.name, title: q.q,
    text: q.a.replace(/<[^>]+>/g, ' ') + ' ' + (q.pit || ''),
  })));
  (DOCS.docs || []).forEach(doc => {
    doc.modules.forEach(m => {
      searchIndex.push({
        type: '速通', hash: '#/doc/' + doc.id + '/m/' + m.id, proj: doc.name, title: m.title,
        text: m.points.join(' ') + ' ' + m.cards.map(c => c.t + ' ' + c.body.replace(/<[^>]+>/g, ' ')).join(' ').slice(0, 500),
      });
      m.qa.forEach(q => searchIndex.push({
        type: '速通题', hash: '#/doc/' + doc.id + '/m/' + m.id, proj: doc.name, title: q.q,
        text: q.a.replace(/<[^>]+>/g, ' ') + ' ' + (q.pit || ''),
      }));
    });
  });
}
function doSearch(q) {
  q = q.trim().toLowerCase();
  const box = $('#searchResults');
  if (!q || q.length < 2) { box.classList.remove('show'); return; }
  if (!searchIndex) buildSearchIndex();
  const hits = searchIndex.filter(it => (it.title + ' ' + it.text).toLowerCase().includes(q)).slice(0, 12);
  if (!hits.length) { box.innerHTML = '<div class="sr-item">没有找到「' + esc(q) + '」相关内容</div>'; box.classList.add('show'); return; }
  box.innerHTML = hits.map((h, i) => {
    const text = esc(h.text).replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), mm => '<mark>' + mm + '</mark>');
    return '<div class="sr-item" data-i="' + i + '" tabindex="0" role="option">' +
      '<span class="sr-path">' + esc(h.type) + ' · ' + esc(h.proj) + '</span>' +
      esc(h.title.length > 46 ? h.title.slice(0, 46) + '…' : h.title).replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), mm => '<mark>' + mm + '</mark>') +
      '<div style="font-size:11px;color:var(--tx3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + text.slice(0, 100) + '</div></div>';
  }).join('');
  box.classList.add('show');
  box.querySelectorAll('.sr-item').forEach((el, i) => {
    const go = () => {
      const h = hits[i];
      location.hash = h.mid ? '#/m/' + h.pid + '/' + h.mid : (h.hash || '#/');
      box.classList.remove('show'); $('#globalSearch').value = '';
    };
    el.addEventListener('click', go);
    el.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  });
}

/* ---------- 启动 ---------- */
document.addEventListener('DOMContentLoaded', () => {
  $('#searchIcon').innerHTML = icon('search');
  $('#menuBtn').innerHTML = icon('menu');
  renderNav(); route();
  window.addEventListener('hashchange', route);
  $('#globalSearch').addEventListener('input', e => doSearch(e.target.value));
  document.addEventListener('click', e => { if (!e.target.closest('.search-wrap')) $('#searchResults').classList.remove('show'); });
  document.addEventListener('keydown', e => {
    const typing = /input|textarea/i.test(e.target.tagName);
    if (e.key === '/' && !typing) { e.preventDefault(); $('#globalSearch').focus(); }
    if (e.key === 'Escape') {
      $('#searchResults').classList.remove('show');
      $('#sidebar').classList.remove('open');
      if (typing) e.target.blur();
    }
  });
  $('#menuBtn').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
  $('#resetProgress').addEventListener('click', () => {
    if (confirm('确定要清空所有学习进度（已学懂 / 测验成绩 / 打卡记录）吗？')) { store.reset(); route(); }
  });
});
