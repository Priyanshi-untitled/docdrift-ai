'use strict';

const { resolvePath, discoverFiles } = require('./scanner');
const { analyzeFile }                = require('./analyzer');
const { computeSummary }             = require('./scoreEngine');

/**
 * Main scan function.
 * @param {string} inputPath  — raw path from user (CLI or API)
 * @param {function} onProgress — optional callback(message) for live logs
 * @returns {{ summary, results }}
 */
async function scan(inputPath, onProgress = () => {}) {
  // 1. Resolve path (throws on invalid)
  onProgress('Resolving target path...');
  const resolvedPath = resolvePath(inputPath);
  onProgress(`Target: ${resolvedPath}`);

  // 2. Discover files
  onProgress('Discovering files in project...');
  const files = discoverFiles(resolvedPath);

  if (files.length === 0) {
    return {
      summary: {
        trustScore: 0,
        total:      0,
        lies:       0,
        warnings:   0,
        accurate:   0,
        grade:      'N/A',
        message:    'No scannable files found. Make sure the path contains .md, .js, .ts, .py or similar files.'
      },
      results: [],
      error: 'NO_FILES'
    };
  }

  onProgress(`Found ${files.length} file(s) to analyze.`);

  // 3. Analyze each file
  const results = [];
  for (const file of files) {
    onProgress(`Analyzing: ${file.relativePath}`);
    const result = analyzeFile(file);
    if (result) results.push(result);
  }

  // 4. Sort: worst first
  results.sort((a, b) => a.trustScore - b.trustScore);

  // 5. Compute summary
  onProgress('Computing trust scores...');
  const summary = computeSummary(results, files);

  onProgress('Scan complete.');
  return { summary, results };
}

module.exports = { scan };