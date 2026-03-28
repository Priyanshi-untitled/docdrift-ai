'use strict';

// ANSI color codes
const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  cyan:   '\x1b[36m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  white:  '\x1b[37m',
  gray:   '\x1b[90m',
  bgRed:  '\x1b[41m',
  bgGreen:'\x1b[42m',
};

const w = (color, str) => `${color}${str}${C.reset}`;

function sep(char = '─', len = 64) {
  return C.gray + char.repeat(len) + C.reset;
}

function scoreColor(score) {
  if (score >= 75) return C.green;
  if (score >= 50) return C.yellow;
  return C.red;
}

function gradeColor(grade) {
  if (grade === 'A') return C.green;
  if (grade === 'B') return C.cyan;
  if (grade === 'C') return C.yellow;
  return C.red;
}

function printSummary(summary, elapsed) {
  console.log('\n' + sep('═'));
  console.log(w(C.bold + C.cyan, '  📊 DOCDRIFT AI — SCAN REPORT'));
  if (elapsed) {
    console.log(w(C.gray, `  Completed in ${(elapsed / 1000).toFixed(2)}s`));
  }
  console.log(sep('═'));

  const gradeStr = `${gradeColor(summary.grade)}${C.bold} ${summary.grade} ${C.reset}`;
  const scoreStr = `${scoreColor(summary.trustScore)}${C.bold}${summary.trustScore}${C.reset}${C.gray}/100${C.reset}`;

  console.log(`\n  ${w(C.bold, 'Trust Score:')}  ${scoreStr}   Grade: ${gradeStr}`);
  console.log(`  ${w(C.gray, summary.message)}\n`);
  console.log(`  ${w(C.green,  '✅ Accurate: ')} ${summary.accurate} file(s)`);
  console.log(`  ${w(C.yellow, '⚠️  Warnings:')} ${summary.warnings} file(s)`);
  console.log(`  ${w(C.red,    '🔴 Critical:')} ${summary.lies} file(s)`);
  console.log(`  ${w(C.gray,   '   Total:   ')} ${summary.total} file(s) scanned\n`);
}

function printResults(results) {
  if (!results || results.length === 0) return;

  const hasIssues = results.filter(r => r.issue);
  if (hasIssues.length === 0) {
    console.log(sep());
    console.log(w(C.green, '  🎉 No issues detected across all scanned files!'));
    console.log(sep());
    return;
  }

  console.log(sep());
  console.log(w(C.bold, '  FLAGGED FILES\n'));

  hasIssues.forEach(r => {
    const col   = scoreColor(r.trustScore);
    const score = `${col}${C.bold}${r.trustScore}%${C.reset}`;
    const icon  = r.trustScore < 50 ? w(C.red, '🔴') : w(C.yellow, '⚠️ ');

    console.log(`  ${icon} ${w(C.bold + C.cyan, r.file)}  ${score}  ${w(C.gray, r.category || '')}`);
    if (r.title && r.title !== r.file.split('/').pop()) {
      console.log(`     ${w(C.gray, r.title)}`);
    }

    // Wrap issue text at 70 chars
    const words   = r.issue.split(' ');
    const lines   = [];
    let   current = '';
    for (const word of words) {
      if ((current + word).length > 68) { lines.push(current.trim()); current = ''; }
      current += word + ' ';
    }
    if (current.trim()) lines.push(current.trim());

    lines.forEach(line => console.log(`     ${w(C.white, line)}`));
    console.log('');
  });

  console.log(sep());
}

// ── SPINNER ──────────────────────────────────────────────────────────────────

const FRAMES = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];

function createSpinner(prefix = '') {
  let i = 0;
  let currentMsg = '';
  const interval = setInterval(() => {
    process.stdout.write(`\r  ${w(C.cyan, FRAMES[i++ % FRAMES.length])}  ${w(C.gray, currentMsg)}   `);
  }, 80);

  return {
    update(msg) { currentMsg = msg; },
    stop()      {
      clearInterval(interval);
      process.stdout.write('\r' + ' '.repeat(80) + '\r');
    }
  };
}

module.exports = { printSummary, printResults, createSpinner, w, C };