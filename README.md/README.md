# DocDrift AI — Documentation Integrity Scanner

> Detects stale docs, TODOs in production, misleading claims, and code-comment drift. No AI API required — works 100% offline.

---

## Quick Start (3 commands)

```bash
# 1. Install dependencies
npm install

# 2. Start the web dashboard
npm start
# → open http://localhost:3847

# 3. OR scan directly from terminal
node src/index.js scan .
node src/index.js scan C:\my-project
node src/index.js scan ../other-repo
```

---

## Installation

**Requirements:** Node.js ≥ 16

```bash
git clone https://github.com/your-username/docdrift-ai
cd docdrift-ai
npm install
```

---

## Usage

### Web Dashboard

```bash
npm start
```

Open **http://localhost:3847** in your browser.

- Enter a **local folder path** in the input box (e.g. `C:\my-project` or `/home/user/repo`)
- Click **START SCAN** — results appear in seconds
- Click **⚡ DEMO** to see a sample result without scanning anything

> ⚠ **GitHub URLs are NOT supported.** Clone repos locally first:
> ```bash
> git clone https://github.com/someone/repo  my-repo
> node src/index.js scan my-repo
> ```

---

### CLI Tool

```bash
# Scan current directory
node src/index.js scan .

# Scan a specific path
node src/index.js scan C:\Users\me\my-project
node src/index.js scan /home/user/projects/api-server
node src/index.js scan ../sibling-project
```

**Example terminal output:**

```
  ▸ Scanning: C:\my-project

  › Resolving target path...
  › Found 12 file(s) to analyze.
  › Analyzing: README.md
  › Analyzing: src/index.js
  ...

  ════════════════════════════════════════════════
  📊 DOCDRIFT AI — SCAN REPORT
  Completed in 0.31s
  ════════════════════════════════════════════════

  Trust Score:  67/100   Grade:  D

  ✅ Accurate:  4 file(s)
  ⚠️  Warnings: 5 file(s)
  🔴 Critical:  3 file(s)

  FLAGGED FILES

  🔴 src/auth.js  24%  Source Code
     12 TODO/FIXME markers in production code. 8 console.log
     statements left in (debug code).

  ⚠️  README.md  51%  Documentation
     Missing sections: api, contributing, license.
```

---

## What Gets Scanned

| File Type       | Checks |
|-----------------|--------|
| `.md`, `.txt`   | Empty/sparse content, missing sections (install/usage/api/license), TODO markers, vague language, hype claims |
| `.js`, `.ts`, `.py`, etc. | TODO/FIXME in code, console.log debug leftovers, zero-comment large files, misleading function names |
| `package.json`, `.yaml` | Missing description/version, hardcoded secrets, broken `main` field |

---

## Project Structure

```
docdrift-ai/
├── src/
│   ├── index.js           Entry point (CLI + server mode)
│   ├── server.js          Express web server + API endpoint
│   ├── cli.js             CLI runner with spinner + colored output
│   ├── scanOrchestrator.js Ties scanner → analyzer → scorer
│   ├── scanner.js         File discovery + safe path resolution
│   ├── analyzer.js        Rule-based content analysis
│   ├── scoreEngine.js     Weighted trust score calculation
│   └── reporter.js        Terminal colors + spinner
├── public/
│   └── index.html         Web dashboard (single file)
├── package.json
└── README.md
```

---

## API

```
POST /api/scan
Content-Type: application/json

{ "path": "C:\\my-project" }
```

**Response:**
```json
{
  "summary": {
    "trustScore": 67,
    "total": 12,
    "lies": 3,
    "warnings": 5,
    "accurate": 4,
    "grade": "D",
    "message": "Significant drift detected."
  },
  "results": [
    {
      "file": "src/auth.js",
      "title": "auth.js",
      "category": "Source Code",
      "trustScore": 24,
      "issue": "12 TODO/FIXME markers in production code."
    }
  ]
}
```

---

## Common Issues

| Problem | Fix |
|---------|-----|
| `Path does not exist` | Use an absolute path or `..` to navigate |
| `GitHub URLs not supported` | `git clone <url> folder` then scan `folder` |
| `No scannable files found` | Make sure the folder has `.md`, `.js`, `.ts`, `.py` etc. |
| `Cannot reach server` | Run `npm start` first |