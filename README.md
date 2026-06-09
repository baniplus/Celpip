# CELPIP 12 — Prep App 🎙🎧

A minimalist, installable **CELPIP preparation app** built as a Progressive Web App (PWA).
It focuses on the areas you asked for — **Speaking, Listening, Grammar, and Natural Speaking** —
with a clear target of **band 12**.

It runs entirely on your device (no account, no server). On iPhone you install it from
Safari in a couple of taps and it behaves like a native app: full-screen, its own icon,
microphone access for speaking practice, and offline support.

## 📲 Install on your iPhone

1. Open the app URL in **Safari** (not Chrome — only Safari can install PWAs on iOS).
2. Tap the **Share** button (the square with an arrow).
3. Scroll down and tap **“Add to Home Screen.”**
4. Tap **Add**. The CELPIP 12 icon appears on your home screen — open it like any app.

> The app URL is published via GitHub Pages once the deploy workflow finishes
> (Settings → Pages shows the live link, typically
> `https://baniplus.github.io/celpip/`).

## ✨ What's inside

| Module | What it does |
| --- | --- |
| **🎙 Speaking** | All **8 official CELPIP task types** with real prep/response timers, in-app **microphone recording + playback**, an answer framework, CLB-12 "power phrases" (tap to hear them), and a self-scoring rubric. |
| **🎧 Listening** | Audio passages across the official part types (Problem Solving, Conversation, Information, News, Viewpoints), played by your device's voice, followed by comprehension questions with explanations and a transcript. |
| **✓ Grammar** | Targeted drills (tenses, conditionals, articles, prepositions, parallelism) with instant feedback that teaches the rule. |
| **💬 Natural Speaking** | Idioms, connectors, smart fillers, contractions, and pronunciation tips, plus a "say it naturally" rephrasing drill — to sound like a 12, not a textbook. |
| **📈 Progress** | Daily streak, session counts, a 14-day activity grid, and your recent speaking self-scores. |

The home screen gives you a rotating **daily plan** so you touch every skill each day.

## 🛠 Tech / running locally

Pure HTML + CSS + vanilla JS modules — no build step.

```bash
# from the project root
python3 -m http.server 8080
# then open http://localhost:8080
```

> A local **HTTP server is required** (not `file://`) because the app uses ES modules
> and a service worker. Microphone recording and speech also require **HTTPS** (or
> `localhost`) — which GitHub Pages provides automatically.

## 📁 Structure

```
index.html              app shell + iOS install meta tags
manifest.webmanifest    PWA manifest (name, icons, standalone)
sw.js                   service worker (offline cache)
css/styles.css          minimalist dark UI
js/app.js               router, timers, recorder, TTS, progress
js/data/*.js            speaking / listening / grammar / natural content
icons/                  app icons (generated)
```

## Notes on the test

CELPIP scores are reported on a scale of **M, 1–12** per skill. Band **12** is the highest
level and reflects highly fluent, accurate, and natural English. The content here mirrors
the official task formats so practice transfers directly to test day.
