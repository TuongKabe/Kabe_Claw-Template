const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getTodayDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function createDailyNote() {
    const date = getTodayDate();
    const memoryDir = path.join(process.cwd(), 'memory');
    const filePath = path.join(memoryDir, `${date}.md`);

    // Create memory directory if not exists
    if (!fs.existsSync(memoryDir)) {
        fs.mkdirSync(memoryDir, { recursive: true });
        console.log(`Created directory: ${memoryDir}`);
    }

    // Check if file already exists
    if (fs.existsSync(filePath)) {
        console.log(`Daily note already exists: ${filePath}`);
        return filePath;
    }

    const template = `# ${date}

## Session Notes

- 

## Decisions

- 

## To Remember

- 

## Follow-ups

- 

`;

    fs.writeFileSync(filePath, template);
    console.log(`Created daily note: ${filePath}`);
    return filePath;
}

// Run
const filePath = createDailyNote();
console.log('\nReady for session!');
