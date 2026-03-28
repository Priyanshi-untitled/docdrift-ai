#!/usr/bin/env node
'use strict';
 
const path = require('path');
 
const BANNER = `
  ██████╗  ██████╗  ██████╗██████╗ ██████╗ ██╗███████╗████████╗
  ██╔══██╗██╔═══██╗██╔════╝██╔══██╗██╔══██╗██║██╔════╝╚══██╔══╝
  ██║  ██║██║   ██║██║     ██║  ██║██████╔╝██║█████╗     ██║
  ██║  ██║██║   ██║██║     ██║  ██║██╔══██╗██║██╔══╝     ██║
  ██████╔╝╚██████╔╝╚██████╗██████╔╝██║  ██║██║██║        ██║
  ╚═════╝  ╚═════╝  ╚═════╝╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝        ╚═╝
`;
 
const [,, command, ...args] = process.argv;
 
async function main() {
  console.log(BANNER);
  console.log('  DocDrift AI — Documentation Integrity Scanner v2.0.0\n');
 
  if (command === 'serve' || command === 'server' || !command) {
    const { startServer } = require('./server');
    startServer();
  } else if (command === 'scan') {
    const targetPath = args[0] || '.';
    const { runCliScan } = require('./cli');
    await runCliScan(targetPath);
  } else {
    console.log('  Usage:');
    console.log('    node src/index.js serve          — Start web dashboard');
    console.log('    node src/index.js scan <path>    — Scan a project\n');
    console.log('  Examples:');
    console.log('    node src/index.js scan .');
    console.log('    node src/index.js scan C:/my-project');
    console.log('    node src/index.js scan ../other-project\n');
    process.exit(0);
  }
}
 
main().catch(err => {
  console.error('\n  ✗ Fatal error:', err.message);
  process.exit(1);
});