'use strict';

const { scan }                           = require('./scanOrChestrator');
const { printSummary, printResults, createSpinner, w, C } = require('./reporter');

async function runCliScan(inputPath) {
  console.log(w(C.cyan, `  Scanning: ${inputPath}\n`));

  const spinner  = createSpinner();
  const start    = Date.now();
  const logs     = [];

  function onProgress(msg) {
    logs.push(msg);
    spinner.update(msg);
  }

  let scanResult;
  try {
    scanResult = await scan(inputPath, onProgress);
  } catch (err) {
    spinner.stop();
    console.error(w(C.red, `\n  ✗ Scan failed: ${err.message}\n`));
    process.exit(1);
  }

  spinner.stop();

  const elapsed = Date.now() - start;

  // Print recent progress lines
  const recentLogs = logs.slice(-6);
  recentLogs.forEach(log => {
    console.log(`  ${w(C.gray, '›')} ${w(C.dim + C.white, log)}`);
  });

  console.log('');

  if (scanResult.error === 'NO_FILES') {
    console.log(w(C.yellow, '\n  ⚠ No scannable files found!\n'));
    console.log(w(C.gray, '  Make sure the path contains .md, .js, .ts, .py or similar files.\n'));
    process.exit(0);
  }

  printSummary(scanResult.summary, elapsed);
  printResults(scanResult.results);
  console.log('');
}

module.exports = { runCliScan };