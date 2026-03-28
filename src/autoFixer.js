const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { log } = require('./utils');

async function autoFix(repoPath, options = {}) {
  const reportPath = path.join(repoPath, 'docdrift-report.json');

  if (!fs.existsSync(reportPath)) {
    log.error('No scan report found! Run "docdrift scan ." first.');
    return;
  }

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
  const lies = report.results.filter(r => r.trustScore < 60 && r.fix);

  if (lies.length === 0) {
    log.success('No lies with suggested fixes found. Documentation looks good!');
    return;
  }

  log.info(`Found ${lies.length} fixable issue(s):\n`);

  const fixesByFile = {};
  for (const lie of lies) {
    if (!fixesByFile[lie.file]) fixesByFile[lie.file] = [];
    fixesByFile[lie.file].push(lie);
  }

  let fixCount = 0;

  for (const [relFile, fileLies] of Object.entries(fixesByFile)) {
    const absPath = path.join(repoPath, relFile);

    if (!fs.existsSync(absPath)) {
      log.warn(`File not found: ${relFile}`);
      continue;
    }

    let content = fs.readFileSync(absPath, 'utf-8');

    for (const lie of fileLies) {
      console.log(chalk.bold(`  📝 ${relFile} › ${lie.title}`));
      console.log(chalk.red(`     Problem: ${lie.issue}`));
      console.log(chalk.green(`     Fix: ${lie.fix.substring(0, 150)}...`));
      console.log('');

      if (!options.dryRun) {
        // Simple replacement strategy: find the section and replace
        // This is a basic approach - a production version would use AST
        const sectionRegex = new RegExp(
          `(#{1,6}\\s+${escapeRegex(lie.title)}[\\s\\S]*?)(?=#{1,6}\\s|$)`,
          'i'
        );

        const match = content.match(sectionRegex);
        if (match) {
          const oldSection = match[1];
          // Create fixed section by appending AI fix as a note
          const fixedSection = oldSection.trimEnd() + '\n\n' +
            `> **📝 Auto-fixed by DocDrift AI** (${new Date().toISOString().split('T')[0]})\n` +
            `> ${lie.fix}\n\n`;

          content = content.replace(oldSection, fixedSection);
          fixCount++;
        }
      }
    }

    if (!options.dryRun && fixCount > 0) {
      fs.writeFileSync(absPath, content, 'utf-8');
      log.success(`Updated: ${relFile}`);
    }
  }

  if (options.dryRun) {
    log.info(`Dry run complete. ${lies.length} fix(es) would be applied.`);
    log.info('Remove --dry-run to apply changes.');
  } else {
    log.success(`Applied ${fixCount} fix(es) across ${Object.keys(fixesByFile).length} file(s).`);
  }

  // Create GitHub PR if requested
  if (options.pr && !options.dryRun && fixCount > 0) {
    log.info('Creating GitHub Pull Request...');
    try {
      const { createFixPR } = require('./githubIntegration');
      await createFixPR(repoPath, fixCount);
    } catch (err) {
      log.error(`PR creation failed: ${err.message}`);
    }
  }
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { autoFix };