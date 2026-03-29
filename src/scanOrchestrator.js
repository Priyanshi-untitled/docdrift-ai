'use strict';

const { resolvePath, discoverFiles }          = require('./scanner');
const { analyzeFile }                          = require('./analyzer');
const { computeSummary }                       = require('./scoreEngine');
const { cloneRepo, cleanupTempRepo, isValidGithubUrl } = require('./githubCloner');

function isGithubUrl(input) {
  const s = (input || '').trim();
  return s.startsWith('http://') || s.startsWith('https://') || s.includes('github.com');
}

async function scan(inputPath, onProgress = () => {}) {
  const input = (inputPath || '').trim();
  let clonedPath = null;
  let sourceType = 'local';

  try {
    let resolvedPath;

    if (isGithubUrl(input)) {
      sourceType = 'github';
      onProgress('GitHub URL detected — cloning repository...');
      clonedPath   = await cloneRepo(input, onProgress);
      resolvedPath = clonedPath;
    } else {
      onProgress('Resolving target path...');
      resolvedPath = resolvePath(input);
      onProgress(`Target: ${resolvedPath}`);
    }

    onProgress('Discovering files in project...');
    const files = discoverFiles(resolvedPath);

    if (files.length === 0) {
      return {
        summary: {
          trustScore: 0, total: 0, lies: 0, warnings: 0, accurate: 0,
          grade: 'N/A',
          message: 'No scannable files found. Make sure the repo contains .md, .js, .ts, .py or similar files.'
        },
        results: [], sourceType, error: 'NO_FILES'
      };
    }

    onProgress(`Found ${files.length} file(s) to analyze.`);

    const results = [];
    for (const file of files) {
      onProgress(`Analyzing: ${file.relativePath}`);
      const result = analyzeFile(file);
      if (result) results.push(result);
    }

    results.sort((a, b) => a.trustScore - b.trustScore);

    onProgress('Computing trust scores...');
    const summary = computeSummary(results, files);

    onProgress('Scan complete.');
    return { summary, results, sourceType };

  } finally {
    if (clonedPath) cleanupTempRepo(clonedPath);
  }
}

module.exports = { scan };
