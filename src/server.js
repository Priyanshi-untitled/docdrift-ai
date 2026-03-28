'use strict';
 
const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const { scan } = require('./scanOrchestrator');
const { w, C } = require('./reporter');
 
const PORT = process.env.PORT || 3847;
 
function startServer() {
  const app = express();
 
  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));
 
  // ── POST /api/scan ─────────────────────────────────────────────────────────
  app.post('/api/scan', async (req, res) => {
    const { path: inputPath } = req.body;
 
    if (!inputPath || typeof inputPath !== 'string' || !inputPath.trim()) {
      return res.status(400).json({
        error: 'No path provided.',
        hint:  'Send { "path": "/path/to/your/project" } in the request body.'
      });
    }
 
    console.log(w(C.cyan, `\n  🚀 Scan requested: ${inputPath.trim()}`));
 
    const logs = [];
    function onProgress(msg) {
      logs.push(msg);
      process.stdout.write(`\r  ${w(C.gray, '› ' + msg)}                    `);
    }
 
    try {
      const result = await scan(inputPath.trim(), onProgress);
      process.stdout.write('\n');
 
      // Normalize for the old frontend shape too (summary.total = total sections)
      const response = {
        summary: result.summary,
        results: result.results,
        logs
      };
 
      console.log(w(C.green, `  ✓ Scan complete — ${result.results.length} files, trust score: ${result.summary.trustScore}%`));
      return res.json(response);
 
    } catch (err) {
      process.stdout.write('\n');
      console.error(w(C.red, `  ✗ Scan error: ${err.message}`));
      return res.status(400).json({
        error: err.message,
        hint:  err.message.includes('GitHub') ?
          'Clone the repo locally first, then provide the local folder path.' :
          'Make sure the path exists and is a local directory.'
      });
    }
  });
 
  // ── Legacy endpoint alias (/api/scan-live → /api/scan) ────────────────────
  app.post('/api/scan-live', async (req, res) => {
    req.url = '/api/scan';
    app._router.handle(req, res);
  });
 
  // ── Health check ───────────────────────────────────────────────────────────
  app.get('/api/health', (_, res) => {
    res.json({ status: 'ok', version: '2.0.0' });
  });
 
  // ── Fallback: serve index.html for SPA ────────────────────────────────────
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });
 
  app.listen(PORT, () => {
    console.log(w(C.green, `\n  🌐 DocDrift AI Web UI → http://localhost:${PORT}`));
    console.log(w(C.gray,  `  API endpoint: POST http://localhost:${PORT}/api/scan\n`));
    console.log(w(C.gray,  '  Enter a LOCAL folder path in the UI (e.g.  C:\\my-project  or  .)\n'));
  });
}
 
module.exports = { startServer };
 