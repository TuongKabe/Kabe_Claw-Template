const fs = require('fs');
const path = require('path');

function getRecentDailyNotes(days = 7) {
    const memoryDir = path.join(process.cwd(), 'memory');
    if (!fs.existsSync(memoryDir)) {
        console.log('No memory/ directory found.');
        return [];
    }

    const files = fs.readdirSync(memoryDir)
        .filter(f => f.match(/^\d{4}-\d{2}-\d{2}\.md$/))
        .sort()
        .reverse()
        .slice(0, days);

    return files.map(f => ({
        name: f,
        path: path.join(memoryDir, f),
        content: fs.readFileSync(path.join(memoryDir, f), 'utf-8')
    }));
}

function extractKeyInsights(content) {
    const insights = [];
    
    // Extract decisions
    const decisionsMatch = content.match(/## Decisions\s*([\s\S]*?)(?=#{2,}|$)/);
    if (decisionsMatch) {
        const lines = decisionsMatch[1].split('\n');
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed && trimmed.startsWith('-')) {
                insights.push({ type: 'decision', text: trimmed.slice(1).trim() });
            }
        });
    }

    // Extract follow-ups
    const followUpsMatch = content.match(/## Follow-ups\s*([\s\S]*?)(?=#{2,}|$)/);
    if (followUpsMatch) {
        const lines = followUpsMatch[1].split('\n');
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed && trimmed.startsWith('-')) {
                insights.push({ type: 'followup', text: trimmed.slice(1).trim() });
            }
        });
    }

    return insights;
}

function updateMemoryMd(insights) {
    const memoryPath = path.join(process.cwd(), 'MEMORY.md');
    
    let existingContent = '';
    if (fs.existsSync(memoryPath)) {
        existingContent = fs.readFileSync(memoryPath, 'utf-8');
    }

    // Add new insights section if needed
    const today = new Date().toISOString().split('T')[0];
    const header = `## ${today}`;
    
    if (insights.length === 0) {
        console.log('No new insights to add.');
        return;
    }

    // Check if section already exists
    if (existingContent.includes(header)) {
        console.log(`Section ${header} already exists.`);
        return;
    }

    // Append new section
    let newSection = `\n${header}\n`;
    insights.forEach(insight => {
        if (insight.type === 'decision') {
            newSection += `- **Decision**: ${insight.text}\n`;
        } else if (insight.type === 'followup') {
            newSection += `- **Follow-up**: ${insight.text}\n`;
        }
    });

    fs.writeFileSync(memoryPath, existingContent + newSection);
    console.log(`Updated MEMORY.md with ${insights.length} new insights.`);
}

function memoryMaintenance() {
    console.log('=== Memory Maintenance ===\n');
    
    // Get recent daily notes
    const recentNotes = getRecentDailyNotes(7);
    console.log(`Found ${recentNotes.length} recent daily notes.\n`);

    // Extract insights
    const allInsights = [];
    recentNotes.forEach(note => {
        const insights = extractKeyInsights(note.content);
        if (insights.length > 0) {
            console.log(`${note.name}: ${insights.length} insights`);
            allInsights.push(...insights);
        }
    });

    console.log(`\nTotal insights to distill: ${allInsights.length}`);

    // Update MEMORY.md
    if (allInsights.length > 0) {
        updateMemoryMd(allInsights);
    }

    console.log('\n=== Maintenance Complete ===');
    console.log('Run `node scripts/commit_memory.js "Memory maintenance"` to save changes.');
}

// Run
memoryMaintenance();
