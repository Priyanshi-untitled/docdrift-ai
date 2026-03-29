# DocDrift AI 🔍

*Catch what your documentation is hiding — before your users do.*

![Node.js](https://img.shields.io/badge/Node.js-≥16-339933?style=flat-square&logo=node.js&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square) ![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square) ![No API Key](https://img.shields.io/badge/API%20Key-Not%20Required-success?style=flat-square)

---

## 🚀 Overview

DocDrift AI is a documentation integrity scanner that analyzes your project files and assigns a **Trust Score** to each one. It detects stale documentation, TODO markers left in production code, missing README sections, and unverifiable claims — giving developers a clear picture of how trustworthy their project's documentation actually is.

No API key required. Works completely offline. Supports both a web dashboard and a terminal CLI.

🌐 **Live Demo → https://docdrift-ai-2.onrender.com**

---

## ✨ Features

- 📊 **Trust Score Engine** — every file gets a score from 0 to 100 based on detected issues, with an overall project grade from A to F
- 🧠 **Semantic Analysis** — detects vague, sparse, or placeholder documentation
- 🔍 **Hallucination Detection** — flags unverifiable claims and overstatements in docs
- 🔄 **Drift Detection** — identifies the gap between what code does and what docs say
- 💻 **Terminal CLI** — colored output, live progress logs, and spinner animation
- 🌐 **Web Dashboard** — real-time scanner UI, no build step needed
- 🔌 **Fully Offline** — zero external API calls, runs entirely on your machine
- 🗂 **Multi-format Support** — scans `.md`, `.js`, `.ts`, `.py`, `.json`, `.yaml` and more

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML, CSS, JavaScript (single file, no framework) |
| Backend | Node.js, Express.js |
| Analysis Engine | Custom rule-based scanner (no AI API dependency) |
| Deployment | Render (full stack) · Vercel (frontend only) |

---

## 📂 Project Structure
```
docdrift-ai/
├── src/
│   ├── index.js              Entry point — CLI and server routing
│   ├── server.js             Express server and REST API
│   ├── cli.js                Terminal interface with colored output
│   ├── scanOrchestrator.js   Coordinates the full scan pipeline
│   ├── scanner.js            File discovery and path resolution
│   ├── analyzer.js           Rule-based content analysis engine
│   ├── scoreEngine.js        Weighted trust score calculation
│   └── reporter.js           Terminal formatting and spinner
├── public/
│   └── index.html            Web dashboard (self-contained)
├── render.yaml               Render deployment config
├── vercel.json               Vercel deployment config
└── package.json
```

---

## ⚙️ Installation & Setup

**Step 1 — Clone the repository**
```bash
git clone https://github.com/YOUR-USERNAME/docdrift-ai.git
cd docdrift-ai
```

**Step 2 — Install dependencies**
```bash
npm install
```

**Step 3 — Start the web dashboard**
```bash
npm start
# Open http://localhost:3847 in your browser
```

**Step 4 — Or scan directly from terminal**
```bash
node src/index.js scan .
node src/index.js scan /path/to/your/project
```

> Node.js 16 or higher is required. No API key or internet connection needed.

---

## 🌐 Live Demo

The project is deployed and publicly accessible on Render.

**→ https://docdrift-ai-2.onrender.com**

To try it: open the link, type `.` in the input box, and click **START SCAN**.
DocDrift will scan its own deployed codebase and return real results.

> The free Render instance sleeps when inactive. The first request may take
> up to 60 seconds. Subsequent scans respond immediately.

---

## 📡 API Reference

**POST /api/scan** — scan a local folder and receive a full integrity report.
```json
// Request
{ "path": "." }

// Response
{
  "summary": {
    "trustScore": 63,
    "grade": "D",
    "total": 7,
    "accurate": 2,
    "warnings": 3,
    "lies": 2
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

**GET /api/health** — returns `{ "status": "ok", "version": "2.0.0" }`

---

## 🔮 Future Improvements

- **GitHub Integration** — scan a public repo directly by URL without cloning
- **Auto-fix Suggestions** — generate corrected documentation for flagged files
- **CI/CD Plugin** — fail builds when Trust Score drops below a set threshold
- **Historical Reports** — track documentation quality across commits over time
- **Team Dashboard** — multi-project view for engineering teams

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.
```bash
git clone https://github.com/YOUR-USERNAME/docdrift-ai.git
cd docdrift-ai
npm install
node src/index.js scan .   # DocDrift scans itself — great for testing
```

---

## 📜 License

MIT © 2025 — free to use, modify, and distribute.

---

<div align="center">

Built with curiosity and a love for clean documentation.

*"Your docs should be as honest as your code."*

</div>
