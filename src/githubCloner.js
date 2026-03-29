'use strict';

const { execSync } = require('child_process');
const fs   = require('fs');
const path = require('path');
const os   = require('os');

/**
 * Check if git is available on this system.
 */
function isGitAvailable() {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract a clean folder name from a GitHub URL.
 * e.g. https://github.com/user/my-repo  →  my-repo
 */
function repoNameFromUrl(url) {
  const parts = url.replace(/\.git$/, '').split('/');
  return parts[parts.length - 1] || 'repo';
}

/**
 * Validate that the URL looks like a real GitHub repo URL.
 */
function isValidGithubUrl(url) {
  return /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\.git)?$/.test(url.trim());
}

/**
 * Clone a public GitHub repo into a temp directory.
 * Returns the cloned folder path.
 * Caller is responsible for cleanup via cleanupTempRepo().
 *
 * @param {string} repoUrl  — GitHub repo URL
 * @param {function} onProgress — optional callback(message)
 * @returns {string} path to cloned folder
 */
async function cloneRepo(repoUrl, onProgress = () => {}) {
  if (!isGitAvailable()) {
    throw new Error('Git is not installed on this server. Cannot clone repositories.');
  }

  if (!isValidGithubUrl(repoUrl)) {
    throw new Error(
      'Invalid GitHub URL. Expected format:\n' +
      '  https://github.com/username/repository-name'
    );
  }

  const repoName  = repoNameFromUrl(repoUrl);
  const tmpBase   = path.join(os.tmpdir(), 'docdrift-scans');
  const cloneId   = `${repoName}-${Date.now()}`;
  const clonePath = path.join(tmpBase, cloneId);

  // Create base temp directory
  if (!fs.existsSync(tmpBase)) {
    fs.mkdirSync(tmpBase, { recursive: true });
  }

  onProgress(`Cloning repository: ${repoUrl}`);
  onProgress(`Target: ${clonePath}`);

  try {
    // --depth 1 = shallow clone (fast, only latest commit)
    // --single-branch = only default branch
    // timeout 60s to avoid hanging on huge repos
    execSync(
      `git clone --depth 1 --single-branch "${repoUrl}" "${clonePath}"`,
      {
        stdio: 'pipe',
        timeout: 60000,  // 60 seconds max
        env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }  // no interactive prompts
      }
    );
  } catch (err) {
    // Clean up partial clone if it exists
    cleanupTempRepo(clonePath);

    const msg = err.stderr?.toString() || err.message || '';
    if (msg.includes('not found') || msg.includes('Repository not found')) {
      throw new Error(`Repository not found or is private: ${repoUrl}\nOnly public repositories can be scanned.`);
    }
    if (msg.includes('timeout') || err.signal === 'SIGTERM') {
      throw new Error('Clone timed out. The repository may be too large. Try a smaller repo.');
    }
    throw new Error(`Failed to clone repository: ${msg.slice(0, 200)}`);
  }

  onProgress(`Repository cloned successfully.`);
  return clonePath;
}

/**
 * Delete a cloned temp repo directory.
 * Call this after scanning is complete.
 */
function cleanupTempRepo(clonePath) {
  if (!clonePath) return;
  try {
    // Only delete paths inside our temp scan dir (safety check)
    const tmpBase = path.join(os.tmpdir(), 'docdrift-scans');
    if (!clonePath.startsWith(tmpBase)) return;

    fs.rmSync(clonePath, { recursive: true, force: true });
  } catch {
    // Best-effort cleanup, ignore errors
  }
}

/**
 * Quick cleanup of old temp dirs (older than 1 hour).
 * Call occasionally to keep disk clean.
 */
function cleanupOldTempDirs() {
  try {
    const tmpBase = path.join(os.tmpdir(), 'docdrift-scans');
    if (!fs.existsSync(tmpBase)) return;
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const entries = fs.readdirSync(tmpBase, { withFileTypes: true });
    entries.forEach(entry => {
      if (!entry.isDirectory()) return;
      const full = path.join(tmpBase, entry.name);
      try {
        const stat = fs.statSync(full);
        if (stat.mtimeMs < oneHourAgo) {
          fs.rmSync(full, { recursive: true, force: true });
        }
      } catch { /* skip */ }
    });
  } catch { /* best effort */ }
}

module.exports = { cloneRepo, cleanupTempRepo, cleanupOldTempDirs, isValidGithubUrl };
