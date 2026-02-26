/**
 * Memory Git Sync Script
 * Auto-commit memory changes lên Git
 * 
 * Usage: node sync-memory.js [message]
 *   message - Optional commit message
 * 
 * Cron: Chạy mỗi khi có thay đổi memory quan trọng
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORKSPACE = process.env.WORKSPACE || '/home/clawdbot/.openclaw/workspace';
const REPO = process.env.MEMORY_REPO || 'Clawdbot_memory'; // Hoặc repo chính

const MEMORY_FILES = [
  'memory.md',
  'MEMORY.md',
  'memory/'
];

/**
 * Check if there are changes
 */
function hasChanges() {
  try {
    const status = execSync('git status --porcelain', { 
      cwd: WORKSPACE,
      encoding: 'utf-8' 
    });
    return status.trim().length > 0;
  } catch (e) {
    return false;
  }
}

/**
 * Get changed files
 */
function getChangedFiles() {
  try {
    const status = execSync('git status --porcelain', { 
      cwd: WORKSPACE,
      encoding: 'utf-8' 
    });
    return status.split('\n')
      .filter(line => line.trim())
      .map(line => line.substring(3).trim());
  } catch (e) {
    return [];
  }
}

/**
 * Main sync function
 */
function sync(message) {
  if (!hasChanges()) {
    console.log('ℹ️  No changes to sync');
    return;
  }
  
  const changedFiles = getChangedFiles();
  console.log(`📝 Changed: ${changedFiles.join(', ')}`);
  
  // Add memory files only
  const memoryChanges = changedFiles.filter(f => 
    MEMORY_FILES.some(mf => f.includes(mf.replace('/', '')))
  );
  
  if (memoryChanges.length === 0) {
    console.log('ℹ️  No memory changes to sync');
    return;
  }
  
  try {
    // Add changes
    execSync(`git add ${MEMORY_FILES.join(' ')}`, { cwd: WORKSPACE });
    
    // Commit
    const commitMsg = message || `Memory update: ${new Date().toISOString()}`;
    execSync(`git commit -m "${commitMsg}"`, { cwd: WORKSPACE });
    
    // Pull & push
    console.log('⬇️  Pulling...');
    execSync('git pull --rebase', { cwd: WORKSPACE });
    
    console.log('⬆️  Pushing...');
    execSync('git push', { cwd: WORKSPACE });
    
    console.log('✅ Memory synced to Git!');
  } catch (e) {
    console.error('❌ Sync failed:', e.message);
  }
}

// Run
const [, , ...args] = process.argv;
const message = args.join(' ');
sync(message);
