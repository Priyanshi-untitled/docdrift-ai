'use strict';

const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const { scan } = require('./scanOrchestrator');
const { cleanupOldTempDirs } = require('./githubCloner');
const { w, C } = require('./reporter');

const PORT = process.env.PORT || 3847;

function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Clean old temp dirs every hour
  setInterval(cleanupOldTempDirs, 60 * 60 * 1000);

  // ── POST /api/scan ────────────────────────────────────────────────────────
  app.post('/api/scan', async (req, res) => {
    let { path: inputPath } = req.body;

    if (!inputPath || typeof inputPath !== 'string' || !inputPath.trim()) {
      return res.status(400).json({
        error: 'No path provided.',
        hint: 'Send { "path": "." } or { "path": "https://github.com/user/repo" }'
      });
    }

    inputPath = inputPath.trim();
    const isGithub = inputPath.startsWith('http') || inputPath.includes('github.com');

    console.log(w(C.cyan, `\n  🚀 Scan: ${inputPath} [${isGithub ? 'GitHub' : 'local'}]`));

    const logs = [];
    function onProgress(msg) {
      logs.push(msg);
      process.stdout.write(`\r  ${w(C.gray, '› ' + msg)}                    `);
    }

    try {
      const result = await scan(inputPath, onProgress);
      process.stdout.write('\n');
      console.log(w(C.green, `  ✓ Done — ${result.results.length} files, score: ${result.summary.trustScore}%`));
      return res.json({ summary: result.summary, results: result.results, sourceType: result.sourceType, logs });
    } catch (err) {
      process.stdout.write('\n');
      console.error(w(C.red, `  ✗ Error: ${err.message}`));
      return res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/scan-live', async (req, res) => { req.url = '/api/scan'; app._router.handle(req, res); });
  app.get('/api/health', (_, res) => res.json({ status: 'ok', version: '2.0.0', githubScan: true }));
  app.get('*', (_, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));

  app.listen(PORT, '0.0.0.0', () => {
    console.log(w(C.green, `\n  🌐 DocDrift AI → http://localhost:${PORT}`));
    console.log(w(C.gray,  `  Scan local path:   { "path": "." }`));
    console.log(w(C.gray,  `  Scan GitHub repo:  { "path": "https://github.com/user/repo" }\n`));
  });
}

module.exports = { startServer };
