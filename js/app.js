import { SPEAKING_TASKS, SPEAKING_RUBRIC } from "./data/speaking.js";
import { LISTENING_SETS } from "./data/listening.js";
import { GRAMMAR_SETS } from "./data/grammar.js";
import { NATURAL_CARDS, NATURAL_DRILLS } from "./data/natural.js";
import { READING_PASSAGES } from "./data/reading.js";
import { MOCK_EXAMS } from "./data/mock.js";
import { LESSONS, LESSON_SKILL_ORDER } from "./data/lessons.js";

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

/* ---------- speech (TTS) — uses the device's best on-device voice (no APIs) ---------- */
const TTS = {
  voices: [],
  init() {
    if (!("speechSynthesis" in window)) return;
    const load = () => {
      const vs = speechSynthesis.getVoices();
      if (vs && vs.length) this.voices = vs;
    };
    load();
    speechSynthesis.addEventListener("voiceschanged", load);
  },
  englishVoices() {
    const en = this.voices.filter(v => /^en([-_]|$)/i.test(v.lang));
    return (en.length ? en : this.voices).slice().sort((a, b) => this.quality(b) - this.quality(a));
  },
  // Rank voices so the most natural-sounding local voice wins.
  quality(v) {
    const n = (v.name + " " + (v.voiceURI || "")).toLowerCase();
    let s = 0;
    if (/siri/.test(n)) s += 70;                                  // iOS neural Siri voices
    if (/(enhanced|premium|neural|natural)/.test(n)) s += 55;     // downloadable HQ voices
    if (/(google|microsoft)/.test(n)) s += 30;                    // good on Android/desktop
    if (/(ava|samantha|allison|joelle|nicky|zoe|serena|evan|nathan|tom|aaron|noelle)/.test(n)) s += 12;
    if (/(compact|eloquence|fred|albert|bad news|whisper|organ|bells|trinoids|zarvox)/.test(n)) s -= 60; // novelty/low-quality
    if (/en[-_]ca/i.test(v.lang)) s += 14;                        // CELPIP = Canadian English
    if (/en[-_]us/i.test(v.lang)) s += 8;
    if (/en[-_]gb/i.test(v.lang)) s += 4;
    return s;
  },
  best() {
    const en = this.englishVoices();
    const saved = store.get("voiceURI", null);
    if (saved) { const f = en.find(v => v.voiceURI === saved); if (f) return f; }
    return en[0] || this.voices[0] || null;
  },
  // For dialogues, pick a contrasting but still high-quality voice per speaker.
  pick(who) {
    const base = this.best();
    if (who !== "Man" && who !== "Woman") return base;
    const en = this.englishVoices();
    const female = /(female|woman|ava|samantha|allison|victoria|karen|moira|tessa|zoe|serena|kate|joelle|nicky|noelle|zira)/i;
    const male = /(male|man|daniel|alex|aaron|arthur|tom|evan|nathan|oliver|reed|rishi|gordon)/i;
    const want = who === "Woman" ? female : male;
    const avoid = who === "Woman" ? male : female;
    return en.find(v => want.test(v.name)) || en.find(v => !avoid.test(v.name)) || base;
  },
  rate() { return store.get("rate", 0.95); },
  // Split into sentence chunks so intonation resets and we get natural micro-pauses.
  chunks(text) { return (text.match(/[^.!?]+[.!?]*/g) || [text]).map(s => s.trim()).filter(Boolean); },
  async speak(text, who, opts = {}) {
    if (!("speechSynthesis" in window)) return;
    const voice = this.pick(who);
    const rate = opts.rate || this.rate();
    const pitch = opts.pitch != null ? opts.pitch : (who === "Man" ? 0.92 : 1.06);
    const parts = opts.noChunk ? [text] : this.chunks(text);
    for (let i = 0; i < parts.length; i++) {
      await new Promise((resolve) => {
        const u = new SpeechSynthesisUtterance(parts[i]);
        if (voice) u.voice = voice;
        u.lang = (voice && voice.lang) || "en-US";
        u.rate = rate; u.pitch = pitch;
        u.onend = resolve; u.onerror = resolve;
        speechSynthesis.speak(u);
      });
      if (i < parts.length - 1) await new Promise(r => setTimeout(r, 110)); // natural pause
    }
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
  "mock": renderMockList,
  "mock-run": renderMock,
  "lessons": renderLessons,
  "lesson": renderLesson,
  "settings": renderSettings,
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
    <button class="gear" onclick="location.hash='#/settings'" aria-label="Settings">⚙</button>
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
      ${moduleCard("📝", "Mock Exams", "Full timed simulations + estimated band", "#/mock", "new")}
      ${moduleCard("🎙", "Speaking", "All 8 task types · record, time, self-score", "#/speaking", "focus")}
      ${moduleCard("🎧", "Listening", "Audio passages + comprehension", "#/listening", "focus")}
      ${moduleCard("🎓", "Lessons & Tips", "Strategies & tricks for a 12", "#/lessons")}
      ${moduleCard("✓", "Grammar", "Targeted drills for CLB 11–12", "#/grammar")}
      ${moduleCard("💬", "Natural Speaking", "Idioms, connectors, sound fluent", "#/natural")}
      ${moduleCard("📈", "Progress", "Streaks and session history", "#/progress")}
    </section>
    <p class="tip">Tip: tap ⚙ to choose a more natural voice for Listening. Do your daily plan — consistency beats cramming for a 12.</p>
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

/* ---------- shared quiz helper (used by mock listening & reading) ---------- */
function buildQuiz(container, questions, onComplete) {
  container.insertAdjacentHTML("beforeend", questions.map((q, qi) => `
    <div class="card q" data-qi="${qi}">
      <p class="qtext">${qi + 1}. ${esc(q.q)}</p>
      <div class="opts">${q.options.map((o, oi) => `<button class="opt" data-oi="${oi}">${esc(o)}</button>`).join("")}</div>
      <p class="why" hidden></p>
    </div>`).join(""));
  let answered = 0, correct = 0;
  container.querySelectorAll(".q:not(.bound)").forEach(card => {
    card.classList.add("bound");
    const qi = +card.dataset.qi, q = questions[qi];
    card.querySelectorAll(".opt").forEach(btn => btn.addEventListener("click", () => {
      if (card.classList.contains("done")) return;
      card.classList.add("done");
      const oi = +btn.dataset.oi;
      card.querySelectorAll(".opt").forEach((b, i) => {
        if (i === q.answer) b.classList.add("right");
        else if (i === oi) b.classList.add("wrong");
        b.disabled = true;
      });
      const why = $(".why", card);
      if (q.why) { why.hidden = false; why.textContent = "💡 " + q.why; }
      if (oi === q.answer) correct++;
      if (++answered === questions.length) onComplete(correct);
    }));
  });
}

/* ---------- SETTINGS (voice quality) ---------- */
function renderSettings() {
  app.innerHTML = "";
  const en = TTS.englishVoices();
  const current = TTS.best();
  const rate = TTS.rate();
  const v = el(`<div class="view">
    ${header("Settings", "Make the voice sound natural", true)}
    <section class="card">
      <h3>Listening voice</h3>
      <p class="note">Choose the most natural voice installed on your device. The list is ranked best-first; Canadian English matches CELPIP.</p>
      ${en.length ? `<select id="voiceSel" class="select">
        ${en.map(vo => `<option value="${esc(vo.voiceURI)}" ${current && vo.voiceURI === current.voiceURI ? "selected" : ""}>${esc(vo.name)} — ${esc(vo.lang)}</option>`).join("")}
      </select>` : `<p class="note">⏳ Voices are still loading. Tap “Test voice”, or reopen this screen in a second.</p>`}
      <label class="slabel">Speaking speed <b id="rateVal">${rate.toFixed(2)}×</b></label>
      <input id="rateSel" class="range" type="range" min="0.7" max="1.15" step="0.05" value="${rate}" />
      <button class="primary" id="testVoice">🔊 Test voice</button>
    </section>
    <section class="card">
      <h3>Get a much more natural voice (free)</h3>
      <p class="note">Built-in “compact” voices sound robotic. iPhone has free high-quality voices you download once:</p>
      <ol class="frame">
        <li>Open <b>Settings → Accessibility → Spoken Content → Voices → English</b>.</li>
        <li>Pick a voice and download an <b>“Enhanced”</b>, <b>“Premium”</b>, or <b>Siri</b> version (e.g. <i>Ava, Samantha, or a Canadian voice</i>).</li>
        <li>Come back here and select that voice above — listening will sound far more human.</li>
      </ol>
      <p class="note">On Android, install voices via <b>Settings → System → Languages → Text-to-speech</b> (Google TTS).</p>
    </section>
    <button class="ghost" id="resetAll">Reset all progress &amp; settings</button>
  </div>`);
  app.append(v);

  const sel = $("#voiceSel", v);
  if (sel) sel.addEventListener("change", () => store.set("voiceURI", sel.value));
  const rs = $("#rateSel", v), rv = $("#rateVal", v);
  rs.addEventListener("input", () => { rv.textContent = (+rs.value).toFixed(2) + "×"; store.set("rate", +rs.value); });
  $("#testVoice", v).addEventListener("click", () => {
    TTS.stop();
    TTS.speak("Hi there. This is how the listening passages will sound. Let's aim for band twelve.", "Woman");
  });
  $("#resetAll", v).addEventListener("click", () => {
    if (confirm("Reset all progress and settings?")) { localStorage.removeItem(STORE_KEY); store.data = {}; go("#/"); }
  });
}

/* ---------- MOCK EXAMS ---------- */
function renderMockList() {
  app.innerHTML = "";
  const v = el(`<div class="view">
    ${header("Mock Exams", "Simulate test day", true)}
    <section class="card">
      <p class="note">Each mock runs Listening → Reading → Writing → Speaking back to back, then gives you a scored summary with an estimated band. Find a quiet spot and don't pause.</p>
    </section>
    <div class="list">
      ${MOCK_EXAMS.map(m => `<button class="row" onclick="location.hash='#/mock-run/${m.id}'">
        <span class="row-ic">📝</span>
        <span class="row-body"><b>${esc(m.title)}</b><small>${esc(m.blurb)}</small></span>
        <span class="row-go">›</span></button>`).join("")}
    </div>
    <p class="tip">Stamina matters: doing one full mock teaches pacing better than ten single drills.</p>
  </div>`);
  app.append(v);
}

function renderMock(arg) {
  const mock = MOCK_EXAMS.find(m => m.id === arg) || MOCK_EXAMS[0];
  const results = {
    listening: { correct: 0, total: 0 },
    reading: { correct: 0, total: 0 },
    writing: { words: 0, done: false },
    speaking: { recorded: 0, total: 0 }
  };
  let si = 0;

  function progressBar() {
    return `<div class="mock-prog">${mock.sections.map((s, i) =>
      `<span class="mp ${i < si ? "done" : ""} ${i === si ? "cur" : ""}">${esc(s.title.split(" ")[0])}</span>`).join("")}</div>`;
  }
  function sectionHead(extra) {
    const sec = mock.sections[si];
    return `${header(mock.title, `Section ${si + 1} of ${mock.sections.length}`, true)}
      ${progressBar()}
      <section class="card center"><span class="pill">${esc(sec.title)}</span>
      ${sec.minutes ? `<p class="note">Suggested time: ${sec.minutes} minutes${extra || ""}</p>` : (extra ? `<p class="note">${extra.replace(/^ · /, "")}</p>` : "")}</section>`;
  }
  function run() {
    app.innerHTML = ""; TTS.stop(); window.scrollTo(0, 0);
    if (si >= mock.sections.length) return summary();
    const sec = mock.sections[si];
    const next = () => { si++; run(); };
    ({ listening: secListening, reading: secReading, writing: secWriting, speaking: secSpeaking }[sec.type])(sec, next);
  }

  function secListening(sec, next) {
    const sets = sec.setIds.map(id => LISTENING_SETS.find(s => s.id === id)).filter(Boolean);
    results.listening.total += sets.reduce((a, s) => a + s.questions.length, 0);
    const v = el(`<div class="view">${sectionHead(" · play each clip once")}
      <div id="msets"></div>
      <button class="primary" id="msNext" hidden>Continue →</button></div>`);
    app.append(v);
    const wrap = $("#msets", v); let done = 0, corr = 0;
    sets.forEach((set, idx) => {
      const block = el(`<section class="card">
        <span class="pill">Clip ${idx + 1} · ${esc(set.part)}</span>
        <button class="primary" data-p="${idx}">▶ Play clip ${idx + 1}</button>
        <div class="qhost" hidden></div></section>`);
      wrap.append(block);
      const btn = block.querySelector("[data-p]"), qhost = block.querySelector(".qhost");
      let played = false;
      btn.addEventListener("click", async () => {
        if (played) return; played = true; btn.disabled = true; btn.textContent = "▶ Playing…";
        for (const line of set.lines) { await TTS.speak(line.t, set.voices === 1 ? "Woman" : line.s); if (!document.body.contains(v)) return; }
        btn.textContent = "✓ Played"; qhost.hidden = false;
        buildQuiz(qhost, set.questions, c => { corr += c; if (++done === sets.length) { results.listening.correct += corr; $("#msNext", v).hidden = false; } });
      });
    });
    $("#msNext", v).addEventListener("click", next);
  }

  function secReading(sec, next) {
    const ps = sec.passageIds.map(id => READING_PASSAGES.find(p => p.id === id)).filter(Boolean);
    results.reading.total += ps.reduce((a, p) => a + p.questions.length, 0);
    const v = el(`<div class="view">${sectionHead(" · read, then answer")}
      <div id="mread"></div>
      <button class="primary" id="mrNext" hidden>Continue →</button></div>`);
    app.append(v);
    const wrap = $("#mread", v); let done = 0, corr = 0;
    ps.forEach(p => {
      const block = el(`<section class="card">
        <span class="pill">${esc(p.part)}</span>
        <h3>${esc(p.title)}</h3>
        <div class="passage">${esc(p.text).replace(/\n/g, "<br>")}</div>
        <div class="qhost"></div></section>`);
      wrap.append(block);
      buildQuiz(block.querySelector(".qhost"), p.questions, c => { corr += c; if (++done === ps.length) { results.reading.correct += corr; $("#mrNext", v).hidden = false; } });
    });
    $("#mrNext", v).addEventListener("click", next);
  }

  function secWriting(sec, next) {
    const v = el(`<div class="view">${sectionHead("")}
      <section class="card"><span class="pill">Prompt</span><p class="prompt">${esc(sec.prompt)}</p></section>
      <section class="card">
        <textarea id="wt" class="writebox" placeholder="Write your response here…"></textarea>
        <div class="wcount"><span id="wc">0</span> words · target ${sec.minWords}–${sec.maxWords}</div>
        <h3>Self-check before you submit</h3>
        <div class="checks">${sec.checklist.map((c, i) => `<label class="check"><input type="checkbox" data-i="${i}"> <span>${esc(c)}</span></label>`).join("")}</div>
        <button class="primary" id="wSubmit">Submit &amp; continue →</button>
      </section></div>`);
    app.append(v);
    const ta = $("#wt", v), wc = $("#wc", v);
    const count = () => (ta.value.trim().match(/\S+/g) || []).length;
    ta.addEventListener("input", () => {
      const n = count(); wc.textContent = n;
      wc.parentElement.classList.toggle("ok", n >= sec.minWords && n <= sec.maxWords);
    });
    $("#wSubmit", v).addEventListener("click", () => { results.writing.words = count(); results.writing.done = true; next(); });
  }

  function secSpeaking(sec, next) {
    const tasks = sec.taskIds.map(id => SPEAKING_TASKS.find(t => t.id === id)).filter(Boolean);
    results.speaking.total += tasks.length;
    let ti = 0;
    function oneTask() {
      app.innerHTML = ""; TTS.stop(); window.scrollTo(0, 0);
      if (ti >= tasks.length) return next();
      const task = tasks[ti];
      const prompt = task.prompts[Math.floor(Math.random() * task.prompts.length)];
      const v = el(`<div class="view">${header(mock.title, `Speaking ${ti + 1} of ${tasks.length}`, true)}
        <section class="card"><span class="pill">${esc(task.title)}</span><p class="prompt">${esc(prompt)}</p></section>
        <section class="timer-wrap">
          <div class="timer" id="t">${task.prep}<small>prep</small></div>
          <div class="rec-row"><button class="primary" id="start">Start prep</button>
          <button class="rec" id="rec" disabled>● Record</button></div>
          <audio id="pl" controls hidden></audio>
          <p class="phase" id="ph">${task.prep}s prep, then ${task.response}s to speak.</p>
        </section>
        <button class="ghost" id="skip">Skip / Next task →</button></div>`);
      app.append(v);
      const tEl = $("#t", v), ph = $("#ph", v), start = $("#start", v), rec = $("#rec", v), pl = $("#pl", v);
      let iv, mr, chunks = [], stream;
      const cd = (sec2, lab, done) => { clearInterval(iv); let t = sec2; tEl.innerHTML = `${t}<small>${lab}</small>`; iv = setInterval(() => { t--; tEl.innerHTML = `${Math.max(t, 0)}<small>${lab}</small>`; tEl.classList.toggle("warn", t <= 5); if (t <= 0) { clearInterval(iv); done(); } }, 1000); };
      start.addEventListener("click", () => { start.disabled = true; ph.textContent = "Prep — jot keywords."; cd(task.prep, "prep", () => { ph.textContent = "Go! Tap Record."; rec.disabled = false; tEl.classList.add("ready"); tEl.innerHTML = `${task.response}<small>speak</small>`; navigator.vibrate && navigator.vibrate(120); }); });
      const stop = () => { clearInterval(iv); if (mr && mr.state === "recording") mr.stop(); rec.textContent = "● Record"; rec.classList.remove("live"); rec.disabled = true; ph.textContent = "Recorded. Play it back, then continue."; };
      rec.addEventListener("click", async () => {
        if (mr && mr.state === "recording") return stop();
        try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
        catch (e) { ph.textContent = "⚠️ Mic blocked — allow access in Safari settings."; return; }
        chunks = []; mr = new MediaRecorder(stream);
        mr.ondataavailable = e => e.data.size && chunks.push(e.data);
        mr.onstop = () => { pl.src = URL.createObjectURL(new Blob(chunks, { type: chunks[0]?.type || "audio/webm" })); pl.hidden = false; stream.getTracks().forEach(t => t.stop()); results.speaking.recorded++; };
        mr.start(); rec.textContent = "■ Stop"; rec.classList.add("live"); ph.textContent = "Recording…"; cd(task.response, "speak", stop);
      });
      $("#skip", v).addEventListener("click", () => { TTS.stop(); ti++; oneTask(); });
    }
    oneTask();
  }

  function bandFrom(pct) {
    if (pct >= 90) return 11; if (pct >= 80) return 10; if (pct >= 70) return 9;
    if (pct >= 60) return 8; if (pct >= 50) return 7; if (pct >= 40) return 6; return 5;
  }
  function summary() {
    logActivity("mock"); addPoints("mock", 1);
    const l = results.listening, r = results.reading;
    const lPct = l.total ? Math.round(l.correct / l.total * 100) : 0;
    const rPct = r.total ? Math.round(r.correct / r.total * 100) : 0;
    const objPct = (l.total + r.total) ? Math.round((l.correct + r.correct) / (l.total + r.total) * 100) : 0;
    const band = bandFrom(objPct);
    const hist = store.get("mockHist", []);
    hist.unshift({ day: todayKey(), title: mock.title, lPct, rPct, band });
    store.set("mockHist", hist.slice(0, 30));
    app.innerHTML = "";
    const v = el(`<div class="view">${header("Results", mock.title, true)}
      <section class="hero compact"><div class="hero-target"><span class="t-num">${band}+</span><span class="t-lab">est. band</span></div>
        <div class="hero-stats"><div><b>${lPct}%</b><span>listening</span></div><div><b>${rPct}%</b><span>reading</span></div></div></section>
      <section class="card">
        <h3>Breakdown</h3>
        <div class="hist-row"><span>Listening</span><b>${l.correct}/${l.total}</b><small>${lPct}%</small></div>
        <div class="hist-row"><span>Reading</span><b>${r.correct}/${r.total}</b><small>${rPct}%</small></div>
        <div class="hist-row"><span>Writing</span><b>${results.writing.words} words</b><small>${results.writing.done ? "submitted" : "—"}</small></div>
        <div class="hist-row"><span>Speaking</span><b>${results.speaking.recorded}/${results.speaking.total}</b><small>recorded</small></div>
      </section>
      <section class="card"><p class="note">Listening &amp; Reading are auto-scored to estimate your band. Writing and Speaking are practice — review your recordings against the rubric in the Speaking module, and re-read your email against the self-check. The estimate is a guide, not an official score.</p></section>
      <button class="primary" onclick="location.hash='#/mock'">Back to mock exams</button>
    </div>`);
    app.append(v);
  }

  run();
}

/* ---------- LESSONS & TIPS ---------- */
function renderLessons() {
  app.innerHTML = "";
  const bySkill = {};
  LESSONS.forEach(l => { (bySkill[l.skill] = bySkill[l.skill] || []).push(l); });
  const order = LESSON_SKILL_ORDER.filter(s => bySkill[s]);
  const v = el(`<div class="view">
    ${header("Lessons & Tips", "Strategies for a 12", true)}
    ${order.map(skill => `<section>
      <h2>${esc(skill)}</h2>
      <div class="list">${bySkill[skill].map(l => `<button class="row" onclick="location.hash='#/lesson/${l.id}'">
        <span class="row-ic">${l.icon}</span>
        <span class="row-body"><b>${esc(l.title)}</b><small>${esc(l.summary)}</small></span>
        <span class="row-go">›</span></button>`).join("")}</div>
    </section>`).join("")}
  </div>`);
  app.append(v);
}
function renderLesson(arg) {
  app.innerHTML = "";
  const l = LESSONS.find(x => x.id === arg) || LESSONS[0];
  const v = el(`<div class="view">
    ${header(l.title, `${l.skill} · tips`, true)}
    <section class="card"><p class="note">${esc(l.summary)}</p></section>
    <section class="card"><ol class="frame">${l.points.map(p => `<li>${esc(p)}</li>`).join("")}</ol></section>
    ${l.phrases ? `<section class="card"><h3>Try saying these <em>🔊</em></h3>
      <div class="chips">${l.phrases.map(p => `<button class="chip" data-say="${esc(p)}">${esc(p)} 🔊</button>`).join("")}</div></section>` : ""}
    <button class="ghost" id="markDone">Mark studied ✓</button>
  </div>`);
  app.append(v);
  v.querySelectorAll("[data-say]").forEach(b => b.addEventListener("click", () => { TTS.stop(); TTS.speak(b.dataset.say, "Woman"); }));
  $("#markDone", v).addEventListener("click", () => { logActivity("lesson"); addPoints("lesson", 1); toast("Nice — studied ✓"); go("#/lessons"); });
}

/* ---------- bottom tab bar ---------- */
function buildTabs() {
  const tabs = [
    ["", "≋", "Home"], ["speaking", "🎙", "Speak"], ["listening", "🎧", "Listen"],
    ["mock", "📝", "Mock"], ["lessons", "🎓", "Lessons"],
  ];
  const bar = el(`<nav class="tabs">${tabs.map(([h, ic, lab]) =>
    `<button data-tab="${h}" onclick="location.hash='#/${h}'"><span>${ic}</span><small>${lab}</small></button>`).join("")}</nav>`);
  document.body.append(bar);
}
const TAB_MATCH = {
  "": [""],
  speaking: ["speaking", "speaking-task"],
  listening: ["listening", "listening-set"],
  mock: ["mock", "mock-run"],
  lessons: ["lessons", "lesson"],
};
function highlightTab(name) {
  document.querySelectorAll(".tabs button").forEach(b => {
    const t = b.dataset.tab;
    b.classList.toggle("on", (TAB_MATCH[t] || [t]).includes(name));
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
