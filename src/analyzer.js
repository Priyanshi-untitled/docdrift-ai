'use strict';

/**
 * Rule-based documentation integrity analyzer.
 * No external API required — works fully offline.
 */

// ── PATTERNS ────────────────────────────────────────────────────────────────

const TODO_RE    = /\b(TODO|FIXME|HACK|XXX|BUG|TEMP|KLUDGE|REVIEW)\b/g;
const VAGUE_RE   = /\b(stuff|things|etc\.?|blah|foo|bar|placeholder|example|test|dummy|sample|lorem)\b/gi;
const CURSE_RE   = /\b(fuck|shit|crap|damn|hell)\b/gi;
const EMPTY_COMMENT_RE = /\/\/\s*$|\/\*\s*\*\//gm;
const CONSOLE_RE = /console\.(log|warn|error|debug|info)\s*\(/g;

// Doc sections we expect to find in a README / doc file
const EXPECTED_SECTIONS = [
  { key: 'install',      patterns: [/install/i, /setup/i, /getting started/i, /npm install/i, /pip install/i] },
  { key: 'usage',        patterns: [/usage/i, /how to use/i, /example/i, /quick start/i] },
  { key: 'api',          patterns: [/api/i, /reference/i, /endpoint/i, /method/i, /function/i] },
  { key: 'contributing', patterns: [/contribut/i, /pull request/i, /development/i] },
  { key: 'license',      patterns: [/license/i, /MIT/i, /Apache/i, /GPL/i] },
];

// Misleading / over-promised claim patterns
const HYPE_RE = [
  /\b(best|fastest|most (powerful|advanced|complete|comprehensive))\b/i,
  /\b(100%|zero\s+config|no\s+setup|instant(ly)?|automat(ically|ed) everything)\b/i,
  /\b(coming soon|will be added|not yet implemented|work in progress)\b/i,
  /\b(TODO: add (docs|documentation|description|usage))\b/i,
];

// ── HELPERS ─────────────────────────────────────────────────────────────────

function countMatches(str, re) {
  const m = str.match(re);
  return m ? m.length : 0;
}

function extractTitle(content, relativePath) {
  // Try to grab first heading from markdown
  const h1 = content.match(/^#{1,2}\s+(.+)/m);
  if (h1) return h1[1].trim().slice(0, 80);
  // Fall back to filename
  return relativePath.split('/').pop();
}

// ── ANALYZERS ────────────────────────────────────────────────────────────────

function analyzeDoc(file) {
  const { content, relativePath } = file;
  const issues = [];
  const title  = extractTitle(content, relativePath);
  let penalty  = 0;

  // 1. Empty or near-empty doc
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  if (wordCount < 20) {
    issues.push('File is nearly empty (fewer than 20 words). Documentation is effectively missing.');
    penalty += 45;
  } else if (wordCount < 80) {
    issues.push(`Very sparse documentation (${wordCount} words). Lacks meaningful content.`);
    penalty += 25;
  }

  // 2. Check README for expected sections
  const isReadme = /readme/i.test(relativePath);
  if (isReadme && wordCount >= 20) {
    const missingSections = EXPECTED_SECTIONS.filter(s =>
      !s.patterns.some(p => p.test(content))
    );
    if (missingSections.length >= 3) {
      issues.push(`README is missing key sections: ${missingSections.map(s => s.key).join(', ')}.`);
      penalty += missingSections.length * 6;
    }
  }

  // 3. Vague / placeholder language
  const vagueCount = countMatches(content, VAGUE_RE);
  if (vagueCount >= 4) {
    issues.push(`Contains ${vagueCount} vague or placeholder terms (e.g. "stuff", "things", "foo").`);
    penalty += Math.min(vagueCount * 4, 20);
  }

  // 4. Hype / false claims
  for (const re of HYPE_RE) {
    const m = content.match(re);
    if (m) {
      issues.push(`Contains potentially misleading claim: "${m[0]}". Verify this is accurate.`);
      penalty += 12;
    }
  }

  // 5. TODO markers in docs
  const todoCount = countMatches(content, TODO_RE);
  if (todoCount > 0) {
    issues.push(`Contains ${todoCount} TODO/FIXME marker(s) in documentation — indicates unfinished content.`);
    penalty += todoCount * 8;
  }

  // 6. Profanity
  if (CURSE_RE.test(content)) {
    issues.push('Contains inappropriate language — unprofessional for documentation.');
    penalty += 10;
  }

  const trustScore = Math.max(0, Math.min(100, 100 - penalty));
  return {
    file:       relativePath,
    title,
    category:  'Documentation',
    trustScore: Math.round(trustScore),
    issue:      issues.length > 0 ? issues.join(' | ') : null,
    issueCount: issues.length
  };
}

function analyzeCode(file) {
  const { content, relativePath } = file;
  const issues = [];
  const title  = relativePath.split('/').pop();
  let penalty  = 0;

  const lines = content.split('\n');
  const lineCount = lines.length;

  // 1. TODO/FIXME in code
  const todoCount = countMatches(content, TODO_RE);
  if (todoCount > 0) {
    issues.push(`${todoCount} TODO/FIXME/HACK marker(s) left in production code.`);
    penalty += Math.min(todoCount * 7, 30);
  }

  // 2. Console logs left in (JS/TS)
  if (['.js', '.ts', '.jsx', '.tsx'].includes(file.ext)) {
    const consoleCount = countMatches(content, CONSOLE_RE);
    if (consoleCount > 3) {
      issues.push(`${consoleCount} console.log statements — likely debug code left in production.`);
      penalty += Math.min(consoleCount * 3, 18);
    }
  }

  // 3. Empty comments
  const emptyComments = countMatches(content, EMPTY_COMMENT_RE);
  if (emptyComments > 2) {
    issues.push(`${emptyComments} empty comment blocks — suggests incomplete documentation.`);
    penalty += emptyComments * 3;
  }

  // 4. Function/comment mismatch heuristic
  // Find functions that have comments claiming one thing
  const fnNames = [];
  const fnRe = /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\(|(\w+)\s*\(.*\)\s*\{)/g;
  let m;
  while ((m = fnRe.exec(content)) !== null) {
    const name = m[1] || m[2] || m[3];
    if (name && name !== 'if' && name !== 'for' && name !== 'while') fnNames.push(name);
  }

  // Check functions with "get" in name that might "set" or vice versa
  const confusingFns = fnNames.filter(name => {
    const lower = name.toLowerCase();
    return (lower.startsWith('get') && content.includes(`${name}`) && /set[A-Z]/.test(content.slice(content.indexOf(name), content.indexOf(name) + 200))) ||
           (lower.startsWith('is')  && content.match(new RegExp(`${name}[^)]*\\{[^}]*return [^;]*[^;]*true[^;]*false`, 's')));
  });

  if (confusingFns.length > 0) {
    issues.push(`Potentially misleading function names: ${confusingFns.slice(0, 3).join(', ')}.`);
    penalty += confusingFns.length * 5;
  }

  // 5. Very long files with no comments at all
  if (lineCount > 100) {
    const commentLines = lines.filter(l => l.trim().startsWith('//') || l.trim().startsWith('*') || l.trim().startsWith('#')).length;
    const commentRatio = commentLines / lineCount;
    if (commentRatio < 0.03) {
      issues.push(`Large file (${lineCount} lines) with less than 3% comments — poorly documented code.`);
      penalty += 15;
    }
  }

  const trustScore = Math.max(0, Math.min(100, 100 - penalty));
  return {
    file:       relativePath,
    title,
    category:  'Source Code',
    trustScore: Math.round(trustScore),
    issue:      issues.length > 0 ? issues.join(' | ') : null,
    issueCount: issues.length
  };
}

function analyzeConfig(file) {
  const { content, relativePath } = file;
  const issues = [];
  const title  = relativePath.split('/').pop();
  let penalty  = 0;

  // 1. Secrets/keys accidentally committed
  const secretRe = /(?:password|secret|api[_-]?key|token|private[_-]?key)\s*[:=]\s*["']?[a-zA-Z0-9+/]{8,}/gi;
  const secrets = content.match(secretRe);
  if (secrets) {
    issues.push(`Possible hardcoded secret or API key detected — security risk!`);
    penalty += 35;
  }

  // 2. TODO in config
  const todoCount = countMatches(content, TODO_RE);
  if (todoCount > 0) {
    issues.push(`${todoCount} TODO/placeholder(s) in config file — may be incomplete.`);
    penalty += todoCount * 10;
  }

  // 3. package.json specific checks
  if (title === 'package.json') {
    try {
      const pkg = JSON.parse(content);
      if (!pkg.description || pkg.description.trim() === '') {
        issues.push('package.json has no description field.');
        penalty += 8;
      }
      if (!pkg.version) {
        issues.push('package.json has no version field.');
        penalty += 5;
      }
      if (pkg.main && !require('fs').existsSync(require('path').join(require('path').dirname(file.filePath), pkg.main))) {
        issues.push(`package.json "main" field points to a file that doesn't exist: ${pkg.main}`);
        penalty += 20;
      }
    } catch {
      issues.push('package.json is malformed JSON.');
      penalty += 30;
    }
  }

  const trustScore = Math.max(0, Math.min(100, 100 - penalty));
  return {
    file:       relativePath,
    title,
    category:  'Configuration',
    trustScore: Math.round(trustScore),
    issue:      issues.length > 0 ? issues.join(' | ') : null,
    issueCount: issues.length
  };
}

// ── MAIN EXPORT ──────────────────────────────────────────────────────────────

function analyzeFile(file) {
  switch (file.category) {
    case 'doc':    return analyzeDoc(file);
    case 'code':   return analyzeCode(file);
    case 'config': return analyzeConfig(file);
    default:       return null;
  }
}

module.exports = { analyzeFile };