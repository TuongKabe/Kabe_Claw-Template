const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getDefaultMessage() {
    const date = new Date().toISOString().split('T')[0];
    return `Update memory - ${date}`;
}

function commitMemory(message) {
    const cwd = process.cwd();
    const commitMsg = message || getDefaultMessage();

    try {
        // Stage memory files
        console.log('Staging memory files...');
        execSync('git add memory/ MEMORY.md', { cwd, stdio: 'inherit' });

        // Check if there are changes to commit
        const status = execSync('git status --porcelain', { cwd, encoding: 'utf-8' });
        if (!status.trim()) {
            console.log('No memory changes to commit.');
            return;
        }

        // Commit
        console.log(`Committing: ${commitMsg}`);
        execSync(`git commit -m "${commitMsg}"`, { cwd, stdio: 'inherit' });

        // Push
        console.log('Pushing to remote...');
        execSync('git push', { cwd, stdio: 'inherit' });

        console.log('✅ Memory committed and pushed!');
    } catch (error) {
        console.error('Error committing memory:', error.message);
        process.exit(1);
    }
}

// Run with optional message from command line
const message = process.argv[2] || null;
commitMemory(message);
