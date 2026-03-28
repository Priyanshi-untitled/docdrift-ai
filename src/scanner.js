'use strict';

const fs   = require('fs');
const path = require('path');

// File types we care about, grouped by category
const DOC_EXTENSIONS  = new Set(['.md', '.mdx', '.txt', '.rst', '.adoc']);
const CODE_EXTENSIONS = new Set(['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.rb', '.php', '.cs', '.cpp', '.c', '.h']);
const CONFIG_EXT      = new Set(['.json', '.yaml', '.yml', '.toml', '.env.example']);

const SKIP_DIRS = new Set([
  'node_modules', '.git', '.svn', 'dist', 'build', 'out',
  '.next', '.nuxt', 'coverage', '.nyc_output', '__pycache__',
  'vendor', 'venv', '.venv', 'target', 'bin', 'obj'
]);

const MAX_FILE_SIZE = 200 * 1024; // 200 KB — skip huge files
const MAX_FILES     = 80;          // cap to keep scans fast

/**
 * Resolve the target path safely.
 * Handles absolute paths, relative paths, and ~ home dirs.
 */
function resolvePath(inputPath) {
  if (!inputPath || inputPath.trim() === '') throw new Error('No path provided.');

  let p = inputPath.trim();

  // GitHub URLs — not supported (common mistake)
  if (p.startsWith('http://') || p.startsWith('https://') || p.includes('github.com')) {
    throw new Error(
      'GitHub URLs are not supported. Please clone the repo first:\n' +
      '  git clone <url> my-project\n' +
      '  node src/index.js scan my-project'
    );
  }

  // Expand ~ to home directory
  if (p.startsWith('~')) {
    p = path.join(process.env.HOME || process.env.USERPROFILE || '', p.slice(1));
  }

  // Resolve relative to cwd
  p = path.resolve(process.cwd(), p);

  if (!fs.existsSync(p)) {
    throw new Error(`Path does not exist: ${p}`);
  }

  const stat = fs.statSync(p);
  if (!stat.isDirectory()) {
    throw new Error(`Path is not a directory: ${p}`);
  }

  return p;
}

/**
 * Walk directory recursively, collecting files.
 */
function walkDir(dir, files = [], depth = 0) {
  if (depth > 6 || files.length >= MAX_FILES) return files;

  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return files; // permission denied, skip
  }

  // Sort: docs first, then code
  entries.sort((a, b) => {
    const aIsDoc = DOC_EXTENSIONS.has(path.extname(a.name).toLowerCase());
    const bIsDoc = DOC_EXTENSIONS.has(path.extname(b.name).toLowerCase());
    return (bIsDoc - aIsDoc);
  });

  for (const entry of entries) {
    if (files.length >= MAX_FILES) break;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
        walkDir(fullPath, files, depth + 1);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (DOC_EXTENSIONS.has(ext) || CODE_EXTENSIONS.has(ext) || CONFIG_EXT.has(ext)) {
        try {
          const stat = fs.statSync(fullPath);
          if (stat.size > 0 && stat.size <= MAX_FILE_SIZE) {
            files.push(fullPath);
          }
        } catch { /* skip */ }
      }
    }
  }

  return files;
}

/**
 * Read file safely, return null if unreadable.
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * Main discovery function.
 * Returns array of { filePath, relativePath, ext, category, content }.
 */
function discoverFiles(resolvedPath) {
  const allPaths = walkDir(resolvedPath);

  return allPaths.map(filePath => {
    const ext      = path.extname(filePath).toLowerCase();
    const content  = readFile(filePath);
    const category = DOC_EXTENSIONS.has(ext)  ? 'doc'
                   : CODE_EXTENSIONS.has(ext) ? 'code'
                   : 'config';

    return {
      filePath,
      relativePath : path.relative(resolvedPath, filePath).replace(/\\/g, '/'),
      ext,
      category,
      content: content || ''
    };
  }).filter(f => f.content !== null);
}

module.exports = { resolvePath, discoverFiles };