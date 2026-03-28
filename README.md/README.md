<div align="center">

```
██████╗  ██████╗  ██████╗██████╗ ██████╗ ██╗███████╗████████╗     █████╗ ██╗
██╔══██╗██╔═══██╗██╔════╝██╔══██╗██╔══██╗██║██╔════╝╚══██╔══╝    ██╔══██╗██║
██║  ██║██║   ██║██║     ██║  ██║██████╔╝██║█████╗     ██║       ███████║██║
██║  ██║██║   ██║██║     ██║  ██║██╔══██╗██║██╔══╝     ██║       ██╔══██║██║
██████╔╝╚██████╔╝╚██████╗██████╔╝██║  ██║██║██║        ██║       ██║  ██║██║
╚═════╝  ╚═════╝  ╚═════╝╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝        ╚═╝       ╚═╝  ╚═╝╚═╝
```

### 🔍 Documentation Integrity Scanner

**Find the drift between what your code does and what your docs claim.**

[![Node.js](https://img.shields.io/badge/Node.js-≥16-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://docdrift-ai.onrender.com)
[![Works Offline](https://img.shields.io/badge/No%20API%20Key%20Required-Works%20Offline-success?style=flat-square)]()

DocDrift AI scans your project files and flags stale documentation, unfinished code markers, misleading claims, and the gap between what your code *does* and what your docs *say it does.*

[🌐 Live Demo](https://docdrift-ai.onrender.com) · [Quick Start](#quick-start) · [API Reference](#api-reference) · [Deploy](#deployment)

</div>

---

## What It Detects

```
  🔴 src/auth.js            24%   CRITICAL
     12 TODO/FIXME markers in production code.
     8 console.log statements — debug code left in.

  ⚠️  README.md             51%   WARNING
     Missing sections: api, contributing, license.
     Contains unverified claim: "zero config".

  ✅ CHANGELOG.md           91%   VERIFIED
     No issues detected.
```

DocDrift assigns every file a **Trust Score** from 0–100 based on detected issues. The overall project gets a weighted grade (A through F).

---

## Features

| Feature | Description |
|---|---|
| 🧠 Semantic Analysis | Detects vague, empty, and placeholder documentation |
| 🔍 Hallucination Detection | Flags unverifiable claims in docs and comments |
| 🔄 Drift Engine | Identifies TODOs, debug code, and missing doc sections |
| 📊 Trust Score | Weighted integrity score across your entire codebase |
| 💻 CLI Tool | Terminal runner with colored output and live scan progress |
| 🌐 Web Dashboard | Real-time scanner UI — open browser and scan immediately |
| 🔌 Works Offline | No external API calls required — runs entirely on your machine |
| 🗂 Multi-format | Scans `.md`, `.js`, `.ts`, `.py`, `.json`, `.yaml` and more |

---

## Quick Start

**Requirements:** Node.js 16 or higher. No API keys needed.

```bash
# 1. Clone the repository
git clone https://github.com/YOUR-USERNAME/docdrift-ai.git
cd docdrift-ai

# 2. Install dependencies
npm install

# 3. Start the web dashboard
npm start
# Open http://localhost:3847 in your browser

# 4. Or scan directly from terminal
node src/index.js scan .
node src/index.js scan /path/to/your/project
```

---

## Live Demo

**[https://docdrift-ai.onrender.com](https://docdrift-ai.onrender.com)**

1. Open the link above
2. Type `.` in the input box (scans the deployed project itself)
3. Click **START SCAN**
4. Real results appear within seconds

> First load may take up to 60 seconds — the free Render instance sleeps when inactive. After the first request it responds immediately.

---

## Usage

### Web Dashboard

```bash
npm start
```

Open `http://localhost:3847` and enter the path to any local project folder:

```
C:\Users\me\my-project        Windows absolute path
/home/user/projects/api       Linux or macOS absolute path
.                             Scan the current directory
../other-project              Relative path
```

**Scanning a GitHub repository:**

GitHub URLs cannot be scanned directly. Clone the repository first, then point DocDrift at the local folder:

```bash
git clone https://github.com/username/repo-name  my-local-copy
node src/index.js scan my-local-copy
```

### CLI Tool

```bash
node src/index.js scan <path>
```

Example output:

```
  DocDrift AI — Documentation Integrity Scanner v2.0.0

  › Resolving target path...
  › Found 7 file(s) to analyze.
  › Analyzing: README.md
  › Analyzing: src/index.js
  › Computing trust scores...

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
     12 TODO/FIXME markers in production code. 8 console.log
     statements — likely debug code left in production.

  ⚠️  README.md  51%  Documentation
     Missing key sections: api, contributing, license.
  ════════════════════════════════════════════════════════════════
```

---

## What Gets Scanned

### Documentation (`.md`, `.txt`, `.rst`)
- Empty or near-empty files (under 20 words)
- Missing standard README sections: Installation, Usage, API, License
- TODO or FIXME markers left inside documentation
- Vague filler language that adds no meaning
- Unverifiable superlative claims in project descriptions

### Source Code (`.js`, `.ts`, `.py`, `.go`, `.rb`, and more)
- TODO, FIXME, HACK, and BUG markers in production code
- Excessive debug logging statements left in
- Files over 100 lines with under 3% comment coverage
- Empty comment blocks

### Configuration (`.json`, `.yaml`, `.toml`)
- Hardcoded credentials or API keys
- Missing required fields in `package.json`
- The `main` field pointing to a file that does not exist
- Malformed JSON structure

---

## Scoring System

Each file receives a Trust Score from 0 to 100. Files are weighted by category:

| Category | Weight | Reason |
|---|---|---|
| Documentation | 2.0× | Most visible to users and contributors |
| Configuration | 1.5× | Errors here can cause security issues |
| Source Code | 1.0× | Baseline weight |

The overall project score is the weighted average. Grades follow the standard A–F scale.

---

## Project Structure

```
docdrift-ai/
├── src/
│   ├── index.js              Entry point — handles CLI and server mode
│   ├── server.js             Express web server and REST API
│   ├── cli.js                Terminal interface with spinner and colored output
│   ├── scanOrchestrator.js   Coordinates the scan pipeline end to end
│   ├── scanner.js            File discovery and path resolution
│   ├── analyzer.js           Rule-based content analysis engine
│   ├── scoreEngine.js        Weighted trust score calculation
│   └── reporter.js           Terminal colors and progress display
├── public/
│   └── index.html            Web dashboard (self-contained, no build step)
├── render.yaml               Render.com deployment configuration
├── vercel.json               Vercel deployment configuration
└── package.json
```

---

## API Reference

### POST /api/scan

Scan a local directory and return integrity results.

**Request body:**
```json
{
  "path": "/absolute/path/to/project"
}
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
    },
    {
      "file": "CHANGELOG.md",
      "category": "Documentation",
      "trustScore": 91,
      "issue": null
    }
  ]
}
```

### GET /api/health

```json
{ "status": "ok", "version": "2.0.0" }
```

---

## Deployment

### Render — Full Stack (Recommended)

Deploys both the backend and the web dashboard. The live demo runs on Render's free plan.

1. Fork this repository on GitHub
2. Go to [render.com](https://render.com) and create a new **Web Service**
3. Connect your GitHub repository
4. Render auto-detects `render.yaml` — no manual configuration needed
5. Select the **Free** instance type and click **Deploy**

Live within approximately 3 minutes.

### Vercel — Frontend Only

Serves the dashboard as a static site. The scan API will not be available — the demo button still works.

```bash
npm install -g vercel
vercel --prod
```

---

## Troubleshooting

| Error | Solution |
|---|---|
| `Cannot find module './scanOrchestrator'` | Ensure `src/scanOrchestrator.js` is committed and pushed to GitHub |
| `Path does not exist` | Use an absolute path or `.` for the current directory |
| GitHub URL entered in scanner | Clone the repository locally first, then provide the folder path |
| `No scannable files found` | Confirm the folder contains `.md`, `.js`, `.ts`, or similar files |
| Render not responding | Free instances sleep after inactivity — the first request takes up to 60 seconds |

---

## Contributing

Issues and pull requests are welcome.

```bash
git clone https://github.com/YOUR-USERNAME/docdrift-ai.git
cd docdrift-ai
npm install
node src/index.js scan .
```

Run `node src/index.js scan .` after making changes — DocDrift will scan itself and flag any issues you introduced.

---

## License

MIT © 2025

---

<div align="center">

*"Your documentation should be as honest as your code."*

</div>
