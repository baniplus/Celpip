import { SPEAKING_TASKS, SPEAKING_RUBRIC } from "./data/speaking.js";
import { LISTENING_SETS } from "./data/listening.js";
import { GRAMMAR_SETS } from "./data/grammar.js";
import { NATURAL_CARDS, NATURAL_DRILLS } from "./data/natural.js";

/* ---------- tiny helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const app = $("#app");
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const todayKey = () => new Date().toISOString().slice(0, 10);

/* ---------- persistent store ---------- */
const STORE_KEY = "celpip12.v1";
const store = {
  data: JSON.parse(localStorage.getItem(STORE_KEY) || "{}"),
  save() { localStorage.setItem(STORE_KEY, JSON.stringify(this.data)); },
  get(k, d) { return this.data[k] ?? d; },
  set(k, v) { this.data[k] = v; this.save(); },
};
function logActivity(kind) {
  const log = store.get("activity", {});
  const day = todayKey();
  log[day] = (log[day] || 0) + 1;
  store.set("activity", log);
  bumpStreak();
}
function bumpStreak() {
  const last = store.get("lastDay", null);
  const day = todayKey();
  if (last === day) return;
  let streak = store.get("streak", 0);
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  streak = last === yesterday ? streak + 1 : 1;
  store.set("streak", streak);
  store.set("lastDay", day);
}
function addPoints(kind, n) {
  const stats = store.get("stats", {});
  stats[kind] = (stats[kind] || 0) + n;
  store.set("stats", stats);
}

/* ---------- speech (TTS) ---------- */
const TTS = {
  voices: [],
  init() {
    if (!("speechSynthesis" in window)) return;
    const load = () => { this.voices = speechSynthesis.getVoices(); };
    load();
    speechSynthesis.onvoiceschanged = load;
  },
  pick(name) {
    const en = this.voices.filter(v => /en[-_]/i.test(v.lang));
    if (name === "Woman") return en.find(v => /female|samantha|victoria|karen|moira|tessa|zira/i.test(v.name)) || en[0];
    if (name === "Man") return en.find(v => /male|daniel|alex|fred|aaron|arthur/i.test(v.name)) || en[1] || en[0];
    return en[0];
  },
  speak(text, who, { rate = 0.98 } = {}) {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window)) { resolve(); return; }
      const u = new SpeechSynthesisUtterance(text);
      const v = this.pick(who);
      if (v) u.voice = v;
      u.lang = (v && v.lang) || "en-US";
      u.rate = rate; u.pitch = who === "Man" ? 0.95 : 1.05;
      u.onend = resolve; u.onerror = resolve;
      speechSynthesis.speak(u);
    });
  },
  stop() { if ("speechSynthesis" in window) speechSynthesis.cancel(); },
};

/* ---------- router ---------- */
const routes = {
  "": renderHome,
  "speaking": renderSpeakingList,
  "speaking-task": renderSpeakingTask,
  "listening": renderListeningList,
  "listening-set": renderListeningSet,
  "grammar": renderGrammarList,
  "grammar-set": renderGrammarSet,
  "natural": renderNatural,
  "progress": renderProgress,
};
function go(hash) { location.hash = hash; }
function router() {
  TTS.stop();
  const raw = location.hash.replace(/^#\/?/, "");
  const [name, arg] = raw.split("/");
  const fn = routes[name || ""] || renderHome;
  app.innerHTML = "";
  app.scrollTop = 0;
  window.scrollTo(0, 0);
  fn(arg);
  highlightTab(name || "");
}
window.addEventListener("hashchange", router);

/* ---------- shared UI ---------- */
function header(title, sub, back) {
  return `
  <header class="hd">
    ${back ? `<button class="back" onclick="history.back()" aria-label="Back">‹</button>` : `<span class="logo">≋</span>`}
    <div class="hd-txt"><h1>${esc(title)}</h1>${sub ? `<p>${esc(sub)}</p>` : ""}</div>
  </header>`;
}
function moduleCard(icon, title, desc, hash, tag) {
  return `<button class="mcard" onclick="location.hash='${hash}'">
    <span class="mc-ic">${icon}</span>
    <span class="mc-body"><span class="mc-title">${esc(title)} ${tag ? `<em>${esc(tag)}</em>` : ""}</span>
    <span class="mc-desc">${esc(desc)}</span></span>
    <span class="mc-go">›</span>
  </button>`;
}

/* ---------- HOME ---------- */
function renderHome() {
  const streak = store.get("streak", 0);
  const stats = store.get("stats", {});
  const done = (stats.speaking || 0) + (stats.listening || 0) + (stats.grammar || 0) + (stats.natural || 0);
  const log = store.get("activity", {});
  const todayCount = log[todayKey()] || 0;
  const plan = dailyPlan();

  const v = el(`<div class="view">
    ${header("CELPIP 12", "Speaking · Listening · Grammar")}
    <section class="hero">
      <div class="hero-target"><span class="t-num">12</span><span class="t-lab">target band</span></div>
      <div class="hero-stats">
        <div><b>${streak}</b><span>day streak</span></div>
        <div><b>${done}</b><span>sessions</span></div>
        <div><b>${todayCount}</b><span>today</span></div>
      </div>
    </section>

    <section class="plan">
      <h2>Today's plan</h2>
      <div class="plan-list">
        ${plan.map(p => `<button class="plan-item" onclick="location.hash='${p.hash}'">
          <span class="pi-dot ${todayCount > p.order ? "on" : ""}"></span>
          <span class="pi-txt">${esc(p.label)}</span><span class="pi-go">›</span></button>`).join("")}
      </div>
    </section>

    <section class="modules">
      ${moduleCard("🎙", "Speaking", "All 8 task types · record, time, self-score", "#/speaking", "focus")}
      ${moduleCard("🎧", "Listening", "Audio passages + comprehension", "#/listening", "focus")}
      ${moduleCard("✓", "Grammar", "Targeted drills for CLB 11–12", "#/grammar")}
      ${moduleCard("💬", "Natural Speaking", "Idioms, connectors, sound fluent", "#/natural")}
      ${moduleCard("📈", "Progress", "Streaks and session history", "#/progress")}
    </section>
    <p class="tip">Tip: do all four plan items daily. Consistency beats cramming for a 12.</p>
  </div>`);
  app.append(v);
}
function dailyPlan() {
  // rotate a speaking task & listening set by day so it feels fresh
  const d = new Date().getDate();
  const st = SPEAKING_TASKS[d % SPEAKING_TASKS.length];
  const ls = LISTENING_SETS[d % LISTENING_SETS.length];
  const gs = GRAMMAR_SETS[d % GRAMMAR_SETS.length];
  return [
    { order: 0, label: `Speaking: ${st.title}`, hash: `#/speaking-task/${st.id}` },
    { order: 1, label: `Listening: ${ls.title}`, hash: `#/listening-set/${ls.id}` },
    { order: 2, label: `Grammar: ${gs.title}`, hash: `#/grammar-set/${gs.id}` },
    { order: 3, label: `Natural speaking drill`, hash: `#/natural` },
  ];
}

/* ---------- SPEAKING ---------- */
function renderSpeakingList() {
  const v = el(`<div class="view">
    ${header("Speaking", "8 official task types", true)}
    <div class="list">
      ${SPEAKING_TASKS.map(t => `<button class="row" onclick="location.hash='#/speaking-task/${t.id}'">
        <span class="row-n">${t.id}</span>
        <span class="row-body"><b>${esc(t.title)}</b><small>${t.prep}s prep · ${t.response}s speak</small></span>
        <span class="row-go">›</span></button>`).join("")}
    </div>
  </div>`);
  app.append(v);
}

function renderSpeakingTask(arg) {
  app.innerHTML = ""; TTS.stop();
  const task = SPEAKING_TASKS.find(t => String(t.id) === String(arg)) || SPEAKING_TASKS[0];
  const prompt = task.prompts[Math.floor(Math.random() * task.prompts.length)];
  const v = el(`<div class="view">
    ${header(task.title, `Task ${task.id} · ${task.prep}s prep · ${task.response}s speak`, true)}
    <section class="card">
      <span class="pill">Prompt</span>
      <p class="prompt">${esc(prompt)}</p>
      <button class="ghost sm" id="newPrompt">↻ New prompt</button>
    </section>

    <section class="timer-wrap">
      <div class="timer" id="timer">${task.prep}<small>prep</small></div>
      <div class="rec-row">
        <button class="primary" id="startBtn">Start prep</button>
        <button class="rec" id="recBtn" disabled>● Record</button>
      </div>
      <audio id="player" controls hidden></audio>
      <p class="phase" id="phase">Read the prompt, then start your 30-second prep.</p>
    </section>

    <section class="card">
      <h3>Answer framework</h3>
      <ol class="frame">${task.framework.map(f => `<li>${esc(f)}</li>`).join("")}</ol>
    </section>
    <section class="card">
      <h3>Power phrases <em>(CLB 12)</em></h3>
      <div class="chips">${task.power.map(p => `<button class="chip" data-say="${esc(p)}">${esc(p)} 🔊</button>`).join("")}</div>
    </section>

    <section class="card rubric" id="rubric" hidden>
      <h3>Score your own answer</h3>
      ${SPEAKING_RUBRIC.map(r => `<div class="rub-row">
        <div class="rub-lab"><b>${esc(r.label)}</b><small>${esc(r.hint)}</small></div>
        <div class="rub-stars" data-key="${r.key}">${[1,2,3,4,5].map(n => `<button data-n="${n}">★</button>`).join("")}</div>
      </div>`).join("")}
      <button class="primary" id="saveScore">Save session</button>
    </section>
  </div>`);
  app.append(v);

  // chips speak
  v.querySelectorAll("[data-say]").forEach(b => b.addEventListener("click", () => TTS.speak(b.dataset.say, "Woman")));
  $("#newPrompt", v).addEventListener("click", () => renderSpeakingTask(arg));

  // rubric scoring
  const scores = {};
  v.querySelectorAll(".rub-stars").forEach(group => {
    group.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => {
      const n = +btn.dataset.n; scores[group.dataset.key] = n;
      group.querySelectorAll("button").forEach(b => b.classList.toggle("on", +b.dataset.n <= n));
    }));
  });
  $("#saveScore", v).addEventListener("click", () => {
    logActivity("speaking"); addPoints("speaking", 1);
    const hist = store.get("speakHist", []);
    hist.unshift({ day: todayKey(), task: task.title, scores });
    store.set("speakHist", hist.slice(0, 50));
    toast("Session saved 💪");
    go("#/speaking");
  });

  // timer + recorder
  setupSpeakingFlow(task, v);
}

function setupSpeakingFlow(task, root) {
  const timerEl = $("#timer", root), phaseEl = $("#phase", root);
  const startBtn = $("#startBtn", root), recBtn = $("#recBtn", root);
  const player = $("#player", root), rubric = $("#rubric", root);
  let interval, mediaRecorder, chunks = [], stream;

  function countdown(seconds, label, onDone) {
    clearInterval(interval);
    let t = seconds;
    timerEl.innerHTML = `${t}<small>${label}</small>`;
    interval = setInterval(() => {
      t--;
      timerEl.innerHTML = `${Math.max(t,0)}<small>${label}</small>`;
      timerEl.classList.toggle("warn", t <= 5);
      if (t <= 0) { clearInterval(interval); onDone(); }
    }, 1000);
  }

  startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    phaseEl.textContent = "Prep time — plan your structure.";
    countdown(task.prep, "prep", () => {
      phaseEl.textContent = "Go! Tap Record and speak now.";
      recBtn.disabled = false;
      timerEl.classList.add("ready");
      timerEl.innerHTML = `${task.response}<small>speak</small>`;
      navigator.vibrate && navigator.vibrate(120);
    });
  });

  recBtn.addEventListener("click", async () => {
    if (mediaRecorder && mediaRecorder.state === "recording") { stopRec(); return; }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      phaseEl.textContent = "⚠️ Microphone blocked. Allow mic access in Safari settings to record.";
      rubric.hidden = false; return;
    }
    chunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = e => e.data.size && chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: chunks[0]?.type || "audio/webm" });
      player.src = URL.createObjectURL(blob); player.hidden = false;
      stream.getTracks().forEach(t => t.stop());
      rubric.hidden = false;
      rubric.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    mediaRecorder.start();
    recBtn.textContent = "■ Stop";
    recBtn.classList.add("live");
    phaseEl.textContent = "Recording… speak clearly and keep going.";
    countdown(task.response, "speak", () => stopRec());
  });

  function stopRec() {
    clearInterval(interval);
    if (mediaRecorder && mediaRecorder.state === "recording") mediaRecorder.stop();
    recBtn.textContent = "● Record"; recBtn.classList.remove("live"); recBtn.disabled = true;
    phaseEl.textContent = "Nice. Play it back, then score yourself honestly below.";
  }
}

/* ---------- LISTENING ---------- */
function renderListeningList() {
  const v = el(`<div class="view">
    ${header("Listening", "Plays on-device · tap to start", true)}
    <div class="list">
      ${LISTENING_SETS.map(s => `<button class="row" onclick="location.hash='#/listening-set/${s.id}'">
        <span class="row-ic">🎧</span>
        <span class="row-body"><b>${esc(s.title)}</b><small>${esc(s.part)}</small></span>
        <span class="row-go">›</span></button>`).join("")}
    </div>
    <p class="tip">Audio uses your device's built-in voices. Turn your volume up and silent mode off.</p>
  </div>`);
  app.append(v);
}

function renderListeningSet(arg) {
  const set = LISTENING_SETS.find(s => s.id === arg) || LISTENING_SETS[0];
  const v = el(`<div class="view">
    ${header(set.title, set.part, true)}
    <section class="card center">
      <button class="primary big" id="playBtn">▶ Play audio</button>
      <button class="ghost sm" id="stopBtn" hidden>■ Stop</button>
      <p class="phase" id="lphase">Listen carefully — you can replay once. Questions unlock after playback.</p>
    </section>
    <section id="qzone" hidden></section>
    <details class="card transcript"><summary>Show transcript</summary>
      <div class="tr">${set.lines.map(l => `<p><b>${esc(l.s)}:</b> ${esc(l.t)}</p>`).join("")}</div>
    </details>
  </div>`);
  app.append(v);

  const playBtn = $("#playBtn", v), stopBtn = $("#stopBtn", v), lphase = $("#lphase", v);
  let played = 0;

  async function play() {
    playBtn.disabled = true; stopBtn.hidden = false;
    lphase.textContent = "▶ Playing…";
    for (const line of set.lines) {
      await TTS.speak(line.t, set.voices === 1 ? "Woman" : line.s);
      if (!document.body.contains(v)) return;
    }
    played++;
    stopBtn.hidden = true; playBtn.disabled = false;
    playBtn.textContent = played >= 2 ? "▶ Replay (used)" : "▶ Replay (1 left)";
    if (played >= 2) playBtn.disabled = true;
    lphase.textContent = "Now answer the questions below.";
    showQuestions();
  }
  playBtn.addEventListener("click", play);
  stopBtn.addEventListener("click", () => { TTS.stop(); stopBtn.hidden = true; playBtn.disabled = false; });

  function showQuestions() {
    const qzone = $("#qzone", v);
    if (!qzone.hidden) return;
    qzone.hidden = false;
    qzone.innerHTML = `<h2 class="qh">Questions</h2>` + set.questions.map((q, qi) => `
      <div class="card q" data-qi="${qi}">
        <p class="qtext">${qi + 1}. ${esc(q.q)}</p>
        <div class="opts">${q.options.map((o, oi) =>
          `<button class="opt" data-oi="${oi}">${esc(o)}</button>`).join("")}</div>
        <p class="why" hidden></p>
      </div>`).join("") + `<button class="primary" id="finishL" hidden>See result</button>`;

    let answered = 0; let correct = 0;
    qzone.querySelectorAll(".q").forEach(card => {
      const qi = +card.dataset.qi; const q = set.questions[qi];
      card.querySelectorAll(".opt").forEach(btn => btn.addEventListener("click", () => {
        if (card.classList.contains("done")) return;
        card.classList.add("done");
        const oi = +btn.dataset.oi;
        card.querySelectorAll(".opt").forEach((b, i) => {
          if (i === q.answer) b.classList.add("right");
          else if (i === oi) b.classList.add("wrong");
          b.disabled = true;
        });
        const why = $(".why", card); why.hidden = false; why.textContent = "💡 " + q.why;
        if (oi === q.answer) correct++;
        answered++;
        if (answered === set.questions.length) {
          const fin = $("#finishL", qzone); fin.hidden = false;
          fin.onclick = () => {
            logActivity("listening"); addPoints("listening", 1);
            const pct = Math.round(correct / set.questions.length * 100);
            toast(`Listening: ${correct}/${set.questions.length} (${pct}%)`);
            go("#/listening");
          };
        }
      }));
    });
  }
}

/* ---------- GRAMMAR ---------- */
function renderGrammarList() {
  const v = el(`<div class="view">
    ${header("Grammar", "Targeted drills for a high band", true)}
    <div class="list">
      ${GRAMMAR_SETS.map(s => `<button class="row" onclick="location.hash='#/grammar-set/${s.id}'">
        <span class="row-ic">✓</span>
        <span class="row-body"><b>${esc(s.title)}</b><small>${s.questions.length} questions</small></span>
        <span class="row-go">›</span></button>`).join("")}
    </div>
  </div>`);
  app.append(v);
}
function renderGrammarSet(arg) {
  const set = GRAMMAR_SETS.find(s => s.id === arg) || GRAMMAR_SETS[0];
  const v = el(`<div class="view">
    ${header(set.title, "Tap an answer for instant feedback", true)}
    <div id="gzone">${set.questions.map((q, qi) => `
      <div class="card q" data-qi="${qi}">
        <p class="qtext">${qi + 1}. ${esc(q.q)}</p>
        <div class="opts">${q.options.map((o, oi) =>
          `<button class="opt" data-oi="${oi}">${esc(o)}</button>`).join("")}</div>
        <p class="why" hidden></p>
      </div>`).join("")}</div>
    <button class="primary" id="finishG" hidden>Finish set</button>
  </div>`);
  app.append(v);

  let answered = 0, correct = 0;
  v.querySelectorAll(".q").forEach(card => {
    const qi = +card.dataset.qi, q = set.questions[qi];
    card.querySelectorAll(".opt").forEach(btn => btn.addEventListener("click", () => {
      if (card.classList.contains("done")) return;
      card.classList.add("done");
      const oi = +btn.dataset.oi;
      card.querySelectorAll(".opt").forEach((b, i) => {
        if (i === q.answer) b.classList.add("right");
        else if (i === oi) b.classList.add("wrong");
        b.disabled = true;
      });
      const why = $(".why", card); why.hidden = false; why.textContent = "💡 " + q.why;
      if (oi === q.answer) correct++;
      if (++answered === set.questions.length) {
        const fin = $("#finishG", v); fin.hidden = false;
        fin.onclick = () => {
          logActivity("grammar"); addPoints("grammar", 1);
          toast(`Grammar: ${correct}/${set.questions.length} correct`);
          go("#/grammar");
        };
      }
    }));
  });
}

/* ---------- NATURAL SPEAKING ---------- */
function renderNatural() {
  app.innerHTML = ""; TTS.stop();
  const drill = NATURAL_DRILLS[Math.floor(Math.random() * NATURAL_DRILLS.length)];
  const v = el(`<div class="view">
    ${header("Natural Speaking", "Sound like a 12, not a textbook", true)}
    <section class="card drill">
      <span class="pill">Say it naturally</span>
      <p class="stiff">“${esc(drill.stiff)}”</p>
      <button class="primary" id="reveal">Reveal natural version</button>
      <div id="answer" hidden>
        <p class="natural">“${esc(drill.natural)}” <button class="chip" data-say="${esc(drill.natural)}">🔊</button></p>
        <p class="why2">💡 ${esc(drill.tip)}</p>
        <button class="ghost sm" id="nextDrill">↻ Another</button>
      </div>
    </section>
    ${NATURAL_CARDS.map(c => `<section class="card">
      <h3>${esc(c.title)}</h3>
      <p class="note">${esc(c.note)}</p>
      <div class="nlist">${c.items.map(it => `<div class="nitem">
        <div class="ni-top"><b>${esc(it.phrase)}</b>
          <button class="chip mini" data-say="${esc(it.speak || it.phrase)}">🔊</button></div>
        ${it.use ? `<small>${esc(it.use)}</small>` : ""}</div>`).join("")}</div>
    </section>`).join("")}
    <button class="primary" id="doneN">Mark practiced</button>
  </div>`);
  app.append(v);

  v.querySelectorAll("[data-say]").forEach(b => b.addEventListener("click", () => TTS.speak(b.dataset.say, "Woman")));
  $("#reveal", v).addEventListener("click", () => { $("#answer", v).hidden = false; $("#reveal", v).hidden = true; });
  const nd = $("#nextDrill", v); nd && nd.addEventListener("click", () => renderNatural());
  $("#doneN", v).addEventListener("click", () => { logActivity("natural"); addPoints("natural", 1); toast("Nice — practiced ✓"); go("#/"); });
}

/* ---------- PROGRESS ---------- */
function renderProgress() {
  app.innerHTML = "";
  const stats = store.get("stats", {});
  const streak = store.get("streak", 0);
  const log = store.get("activity", {});
  const speakHist = store.get("speakHist", []);
  // last 14 days heat row
  const days = [...Array(14)].map((_, i) => {
    const d = new Date(Date.now() - (13 - i) * 864e5).toISOString().slice(0, 10);
    return { d, n: log[d] || 0 };
  });
  const v = el(`<div class="view">
    ${header("Progress", "Keep the streak alive", true)}
    <section class="hero compact">
      <div class="hero-stats wide">
        <div><b>${streak}</b><span>streak</span></div>
        <div><b>${stats.speaking||0}</b><span>speaking</span></div>
        <div><b>${stats.listening||0}</b><span>listening</span></div>
        <div><b>${stats.grammar||0}</b><span>grammar</span></div>
      </div>
    </section>
    <section class="card">
      <h3>Last 14 days</h3>
      <div class="heat">${days.map(d => `<span class="cell lvl${Math.min(d.n,4)}" title="${d.d}: ${d.n}"></span>`).join("")}</div>
    </section>
    <section class="card">
      <h3>Recent speaking self-scores</h3>
      ${speakHist.length ? speakHist.slice(0,8).map(h => {
        const vals = Object.values(h.scores||{}); const avg = vals.length ? (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1) : "–";
        return `<div class="hist-row"><span>${esc(h.task)}</span><b>${avg}/5</b><small>${esc(h.day)}</small></div>`;
      }).join("") : `<p class="note">No speaking sessions yet. Record one to track yourself.</p>`}
    </section>
    <button class="ghost" id="reset">Reset all progress</button>
  </div>`);
  app.append(v);
  $("#reset", v).addEventListener("click", () => {
    if (confirm("Reset all progress and history?")) { localStorage.removeItem(STORE_KEY); store.data = {}; renderProgress(); }
  });
}

/* ---------- bottom tab bar ---------- */
function buildTabs() {
  const tabs = [
    ["", "≋", "Home"], ["speaking", "🎙", "Speak"], ["listening", "🎧", "Listen"],
    ["grammar", "✓", "Grammar"], ["natural", "💬", "Natural"],
  ];
  const bar = el(`<nav class="tabs">${tabs.map(([h, ic, lab]) =>
    `<button data-tab="${h}" onclick="location.hash='#/${h}'"><span>${ic}</span><small>${lab}</small></button>`).join("")}</nav>`);
  document.body.append(bar);
}
function highlightTab(name) {
  document.querySelectorAll(".tabs button").forEach(b => {
    const t = b.dataset.tab;
    const active = (t === "" && name === "") ||
      (t !== "" && (name === t || name === `${t}-task` || name === `${t}-set`));
    b.classList.toggle("on", active);
  });
}

/* ---------- toast ---------- */
let toastT;
function toast(msg) {
  let t = $("#toast");
  if (!t) { t = el(`<div id="toast"></div>`); document.body.append(t); }
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- boot ---------- */
TTS.init();
buildTabs();
if (!location.hash) location.hash = "#/";
router();

// register service worker for installable / offline use
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
