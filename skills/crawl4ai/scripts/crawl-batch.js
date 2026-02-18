const fs = require('fs');
const { crawl, saveToZotero, translate } = require('./crawl-save');

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const file = process.argv[2] || 'urls.txt';
    const translateFlag = process.argv.includes('--translate');

    if (!fs.existsSync(file)) {
        console.log(`File not found: ${file}`);
        console.log('Usage: node crawl-batch.js <file.txt> [--translate]');
        console.log('Create a file with one URL per line');
        process.exit(1);
    }

    const urls = fs.readFileSync(file, 'utf-8')
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);

    console.log(`Found ${urls.length} URLs`);
    console.log(`Translate: ${translateFlag ? 'Yes' : 'No'}`);
    console.log('');

    let success = 0;
    let failed = 0;

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        console.log(`[${i + 1}/${urls.length}] Crawling: ${url.slice(0, 60)}...`);

        try {
            const result = await crawl(url);

            if (translateFlag) {
                result.title = await translate(result.title);
                result.abstract = await translate(result.abstract);
            }

            await saveToZotero(result);
            console.log(`  ✓ Saved: ${result.title.slice(0, 40)}...`);
            success++;
        } catch (e) {
            console.log(`  ✗ Error: ${e.message.slice(0, 60)}`);
            failed++;
        }

        // Rate limit
        if (i < urls.length - 1) {
            await delay(1000);
        }
    }

    console.log('');
    console.log('=== Done ===');
    console.log(`Success: ${success}`);
    console.log(`Failed: ${failed}`);
}

main();
