// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
var GC = document.getElementById('gc');
function gc() { return document.getElementById('gc'); }
function el(tag,cls,html) { var e=document.createElement(tag); if(cls)e.className=cls; if(html)e.innerHTML=html; return e; }
function mkBtn(txt,cls) { var b=document.createElement('button'); b.className='btn '+(cls||''); b.textContent=txt; return b; }

function mkTControls(target, layout) {
  var div = el('div', 'tctrls');
  layout.forEach(function(l) {
    var b = el('div', 'tbtn' + (l.cls ? ' ' + l.cls : ''));
    b.innerHTML = l.icon;
    if (l.fn) {
        b.addEventListener('mousedown', function(e) { e.preventDefault(); l.fn(); });
        b.addEventListener('touchstart', function(e) { e.preventDefault(); l.fn(); }, {passive:false});
    }
    div.appendChild(b);
  });
  target.appendChild(div);
}

var stopFns = [];
function stopAll() { stopFns.forEach(function(f){ try{f();}catch(e){} }); stopFns = []; }

function addLoop(fn, ms) {
  var id = setInterval(fn, ms);
  stopFns.push(function(){ clearInterval(id); });
  return id;
}
function addKey(fn) {
  document.addEventListener('keydown', fn);
  stopFns.push(function(){ document.removeEventListener('keydown', fn); });
}

function mkDifficulty(target, onChange) {
  var wrap = el('div', 'diff-wrap');
  var label = el('div', 'diff-label', 'SELECT DIFFICULTY');
  wrap.appendChild(label);
  
  var levels = [['EASY',0],['NORMAL',1],['HARD',2]];
  var cur = parseInt(localStorage.getItem('arcade-diff') || '1');
  
  var btns = el('div', 'diff-btns');
  levels.forEach(function(l) {
    var b = el('button', 'diff-btn' + (l[1]===cur ? ' active' : ''));
    b.textContent = l[0];
    b.dataset.d = l[1];
    b.onclick = function() {
      btns.querySelectorAll('.diff-btn').forEach(function(x){x.classList.remove('active');});
      b.classList.add('active');
      localStorage.setItem('arcade-diff', l[1]);
      if(onChange) onChange(l[1]);
    };
    btns.appendChild(b);
  });
  wrap.appendChild(btns);
  target.appendChild(wrap);
  return cur;
}

var BUILDERS = {};

// ─────────────────────────────────────────────
// SCORE SYSTEM
// ─────────────────────────────────────────────
function saveScore(gameId, score) {
  var diff = parseInt(localStorage.getItem('arcade-diff') || '1');
  var key = 'arcade-score-' + gameId + '-' + diff;
  var best = parseInt(localStorage.getItem(key) || '0');
  if (score > best) {
    localStorage.setItem(key, score);
    return true; // New record
  }
  return false;
}

function getBestScore(gameId) {
  var diff = parseInt(localStorage.getItem('arcade-diff') || '1');
  var key = 'arcade-score-' + gameId + '-' + diff;
  return parseInt(localStorage.getItem(key) || '0');
}

// ─────────────────────────────────────────────
// THEME ENGINE
// ─────────────────────────────────────────────
function applyTheme() {
  var theme = localStorage.getItem('arcade-theme') || 'midnight';
  var ui = localStorage.getItem('arcade-ui') || 'modern';
  
  // Clear existing theme and ui classes
  document.body.className = document.body.className.replace(/theme-\w+|ui-\w+/g, '').trim();
  
  document.body.classList.add('theme-' + theme);
  document.body.classList.add('ui-' + ui);
}
applyTheme();
