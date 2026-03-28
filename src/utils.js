const chalk = require('chalk');
const crypto = require('crypto');

// ── Branded logging ──
const log = {
  info: (msg) => console.log(chalk.cyan('  ℹ ') + chalk.white(msg)),
  success: (msg) => console.log(chalk.green('  ✓ ') + chalk.white(msg)),
  warn: (msg) => console.log(chalk.yellow('  ⚠ ') + chalk.white(msg)),
  error: (msg) => console.log(chalk.red('  ✗ ') + chalk.white(msg)),
  step: (num, total, msg) => console.log(
    chalk.bold.cyan(`  [${num}/${total}]`) + chalk.white(` ${msg}`)
  ),
  blank: () => console.log(''),
  divider: () => console.log(chalk.gray('  ' + '─'.repeat(58))),
  banner: () => {
    console.log(chalk.cyan.bold(`
  ██████╗  ██████╗  ██████╗██████╗ ██████╗ ██╗███████╗████████╗
  ██╔══██╗██╔═══██╗██╔════╝██╔══██╗██╔══██╗██║██╔════╝╚══██╔══╝
  ██║  ██║██║   ██║██║     ██║  ██║██████╔╝██║█████╗     ██║
  ██║  ██║██║   ██║██║     ██║  ██║██╔══██╗██║██╔══╝     ██║
  ██████╔╝╚██████╔╝╚██████╗██████╔╝██║  ██║██║██║        ██║
  ╚═════╝  ╚═════╝  ╚═════╝╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝        ╚═╝`));
    console.log(chalk.magenta('                                    AI Lie Detector — v2.0.0'));
    console.log(chalk.gray('  Zero setup • Multi-model AI • Auto-fix • Beautiful Dashboard\n'));
  }
};

// ── Progress bar ──
function progressBar(percent, width = 20) {
  const filled = Math.floor(percent / (100 / width));
  const empty = width - filled;
  return chalk.cyan('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
}

// ── Hash for caching ──
function contentHash(content) {
  return crypto.createHash('md5').update(content).digest('hex').substring(0, 12);
}

// ── Sleep utility ──
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Truncate safely ──
function truncate(str, maxLen = 200) {
  if (!str) return '';
  return str.length > maxLen ? str.substring(0, maxLen) + '...' : str;
}

// ── Time ago formatter ──
function timeAgo(days) {
  if (!days && days !== 0) return 'unknown';
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

// ── Score color ──
function scoreColor(score) {
  if (score >= 90) return chalk.green;
  if (score >= 70) return chalk.yellow;
  if (score >= 50) return chalk.hex('#FFA500');
  return chalk.red;
}

function scoreEmoji(score) {
  if (score >= 90) return '✅';
  if (score >= 70) return '⚠️';
  if (score >= 50) return '🟠';
  return '🔴';
}

function scoreLabel(score) {
  if (score >= 90) return chalk.green('ACCURATE');
  if (score >= 70) return chalk.yellow('WARNING');
  if (score >= 50) return chalk.hex('#FFA500')('SUSPICIOUS');
  return chalk.red('LIE DETECTED');
}

module.exports = {
  log, progressBar, contentHash, sleep,
  truncate, timeAgo, scoreColor, scoreEmoji, scoreLabel
};