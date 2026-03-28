<div align="center">

```
██████╗  ██████╗  ██████╗██████╗ ██████╗ ██╗███████╗████████╗     █████╗ ██╗
██╔══██╗██╔═══██╗██╔════╝██╔══██╗██╔══██╗██║██╔════╝╚══██╔══╝    ██╔══██╗██║
██║  ██║██║   ██║██║     ██║  ██║██████╔╝██║█████╗     ██║       ███████║██║
██║  ██║██║   ██║██║     ██║  ██║██╔══██╗██║██╔══╝     ██║       ██╔══██║██║
██████╔╝╚██████╔╝╚██████╗██████╔╝██║  ██║██║██║        ██║       ██║  ██║██║
╚═════╝  ╚═════╝  ╚═════╝╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝        ╚═╝       ╚═╝  ╚═╝╚═╝
```

### 🔍 Documentation Integrity Scanner — *Find the lies your docs are hiding*

[![Node.js](https://img.shields.io/badge/Node.js-≥16-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://docdrift-ai.onrender.com)
[![No API Key](https://img.shields.io/badge/No%20API%20Key-Works%20Offline-success?style=flat-square)]()

**DocDrift AI** scans your codebase and documentation for stale content, misleading claims, TODOs left in production, and the gap between what your code *says* and what it *does.*

[🌐 **Live Demo**](https://docdrift-ai.onrender.com) · [📖 **Docs**](#usage) · [🚀 **Quick Start**](#quick-start) · [🛠 **API**](#api-reference)

</div>

---

## ✨ What It Does

Ever shipped docs that were 6 months out of date? Left a `TODO: add real logic here` in production? Claimed your tool was "zero config" when it definitely isn't?

**DocDrift AI catches all of it.**

```
  🔴 src/auth.js            24%   CRITICAL
     12 TODO/FIXME markers in production code.
     8 console.log statements — debug code left in.

  ⚠️  README.md             51%   WARNING
     Missing sections: api, contributing, license.
     Contains misleading claim: "zero config".

  ✅ CHANGELOG.md           91%   VERIFIED
     No issues detected.
```

---

## 🎯 Features

| Feature | Description |
|---|---|
| 🧠 **Semantic Analysis** | Detects vague, empty, and placeholder documentation |
| 🔍 **Hallucination Detection** | Flags misleading claims like "fastest", "zero config", "100%" |
| 🔄 **Drift Engine** | Finds mismatches between code behaviour and its documentation |
| 📊 **Trust Score** | Weighted integrity score (A–F grade) across your entire project |
| 💻 **CLI Tool** | Run from terminal with colored output and live progress |
| 🌐 **Web Dashboard** | Futuristic real-time scanner UI — no setup needed |
| ⚡ **Zero Dependencies on AI APIs** | Fully offline, no OpenAI/Anthropic key needed |
| 🗂 **Multi-format** | Scans `.md`, `.js`, `.ts`, `.py`, `.json`, `.yaml` and more |

---

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/YOUR-USERNAME/docdrift-ai.git
cd docdrift-ai
npm install

# Start the web dashboard
npm start
# → Open http://localhost:3847

# OR scan directly from terminal
node src/index.js scan .
node src/index.js scan C:/my-project
```

> **Requirements:** Node.js ≥ 16 · No API keys · No internet required

---

## 🌐 Live Demo

👉 **[https://docdrift-ai.onrender.com](https://docdrift-ai.onrender.com)**

1. Open the link
2. Type **`.`** in the input box
3. Click **START SCAN**
4. Watch DocDrift scan itself in real-time 🔍

> ⏱ First load may take 30–60 seconds (free server cold start) — subsequent scans are instant.

---

## 💻 Usage

### Web Dashboard

```bash
npm start
```

Open `http://localhost:3847` and enter any local folder path:

```
C:\Users\me\my-project        ← Windows absolute path
/home/user/projects/my-api    ← Linux/Mac absolute path
.                             ← Current directory
../other-project              ← Relative path
```

> ⚠️ **GitHub URLs won't work directly.** Clone first, then scan:
> ```bash
> git clone https://github.com/someone/repo my-repo
> node src/index.js scan my-repo
> ```

---

### CLI Tool

```bash
node src/index.js scan <path>
```

**Example output:**

```
  DocDrift AI — Documentation Integrity Scanner v2.0.0

  ════════════════════════════════════════════════════════════════
  📊 DOCDRIFT AI — SCAN REPORT   Completed in 0.43s
  ════════════════════════════════════════════════════════════════

  Trust Score:  63/100   Grade:  D
  Significant drift detected. Immediate review needed.

  ✅ Accurate:   2 file(s)
  ⚠️  Warnings:  3 file(s)
  🔴 Critical:   2 file(s)
     Total:      7 file(s) scanned

  FLAGGED FILES

  🔴 src/auth.js  24%  Source Code
     12 TODO/FIXME markers in production code.

  ⚠️  README.md  51%  Documentation
     Missing key sections: api, contributing, license.
  ════════════════════════════════════════════════════════════════
```

---

## 🧠 What Gets Detected

### Documentation Files (`.md`, `.txt`, `.rst`)
- ❌ Empty or near-empty content (< 20 words)
- ❌ Missing critical README sections (Install / Usage / API / License)
- ❌ TODO / FIXME markers inside docs
- ❌ Vague placeholder language (`stuff`, `things`, `foo`, `bar`)
- ❌ Misleading hype claims (`"best"`, `"fastest"`, `"zero config"`, `"100%"`)

### Source Code (`.js`, `.ts`, `.py`, `.go`, etc.)
- ❌ TODO / FIXME / HACK markers left in production
- ❌ Excessive `console.log` debug statements
- ❌ Large files (100+ lines) with < 3% comment coverage
- ❌ Empty comment blocks

### Config Files (`package.json`, `.yaml`, `.toml`)
- ❌ Hardcoded secrets / API keys
- ❌ Missing `description` or `version` in `package.json`
- ❌ `main` field pointing to a non-existent file
- ❌ Malformed JSON

---

## 🏗 Project Structure

```
docdrift-ai/
├── src/
│   ├── index.js              Entry point — CLI + server routing
│   ├── server.js             Express server + REST API
│   ├── cli.js                Terminal runner (spinner, colors, live logs)
│   ├── scanOrchestrator.js   Orchestrates the full scan pipeline
│   ├── scanner.js            File discovery + safe path resolution
│   ├── analyzer.js           Rule-based content analysis engine
│   ├── scoreEngine.js        Weighted trust score calculator
│   └── reporter.js           ANSI terminal colors + spinner
├── public/
│   └── index.html            Web dashboard (single-file, zero dependencies)
├── render.yaml               Render deployment config
├── vercel.json               Vercel deployment config
└── package.json
```

---

## 🛠 API Reference

### `POST /api/scan`

**Request:**
```json
{ "path": "." }
```

**Response:**
```json
{
  "summary": {
    "trustScore": 63,
    "total": 7,
    "lies": 2,
    "warnings": 3,
    "accurate": 2,
    "grade": "D",
    "message": "Significant drift detected."
  },
  "results": [
    {
      "file": "src/auth.js",
      "category": "Source Code",
      "trustScore": 24,
      "issue": "12 TODO/FIXME markers in production code."
    }
  ]
}
```

### `GET /api/health`
```json
{ "status": "ok", "version": "2.0.0" }
```

---

## 🚢 Deployment

### Render (Full Stack — Recommended)

1. Fork this repo on GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Settings auto-fill from `render.yaml`:
   - Build: `npm install`
   - Start: `node src/index.js serve`
   - Plan: **Free**
5. Click **Deploy** — live in ~3 minutes

### Vercel (Frontend Only)

```bash
npm install -g vercel
vercel --prod
```

---

## 🐛 Troubleshooting

| Error | Fix |
|---|---|
| `Cannot find module './scanOrchestrator'` | Make sure `src/scanOrchestrator.js` is committed to git |
| `Path does not exist` | Use absolute path or `"."` for current directory |
| `GitHub URLs not supported` | `git clone <url>` first, then provide the local folder path |
| `No scannable files found` | Ensure folder contains `.md`, `.js`, `.ts`, `.py` etc. |
| Server not responding on Render | Free tier sleeps — wait 30–60s on first request |

---

## 📄 License

MIT © 2025 — Built with ❤️ for hackathons and developers who care about documentation quality.

---

<div align="center">

**If DocDrift helped you, give it a ⭐ on GitHub!**

*"Your docs should be as trustworthy as your code."*

</div>
