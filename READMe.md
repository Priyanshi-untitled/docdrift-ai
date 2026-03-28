DocDrift AI 🔍

Scan your codebase and catch documentation lies before your users do.

DocDrift AI is a documentation integrity scanner that analyzes your project files and assigns a Trust Score — flagging stale docs, unfinished code, missing sections, and misleading claims.
🌐 Live Demo → https://docdrift-ai-1.onrender.com

How It Works
DocDrift reads every .md, .js, .ts, .py, .json, and .yaml file in your project and runs rule-based checks on each one. Every file gets a score from 0–100. The project gets an overall weighted grade (A–F).

What Gets Flagged
In documentation — empty or sparse files, missing README sections (install / usage / API / license), unverifiable claims, TODO markers left inside docs.
In source code — TODO/FIXME/HACK markers in production, excessive debug logging, large files with no comments.
In config files — hardcoded credentials, missing fields in package.json, broken file references.

Getting Started
Clone the repo, run npm install, then npm start and open http://localhost:3847 in your browser.
Requirements: Node.js 16 or higher. No API key needed. Works fully offline.

Two Ways to Use It
Web Dashboard — open the browser, enter a local folder path, click Scan.
Terminal CLI — run node src/index.js scan . or node src/index.js scan /path/to/project directly from command line.

API
Send a POST request to /api/scan with body { "path": "." } — returns a summary with trustScore, grade, total files, and a per-file results array with scores and issues found.

Deployment
Deployed on Render using the included render.yaml. Build command is npm install, start command is node src/index.js serve. Free plan works fine.

License
MIT © 2025
