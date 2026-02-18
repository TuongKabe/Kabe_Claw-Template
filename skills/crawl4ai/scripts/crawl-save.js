const https = require('https');
const http = require('http');
const { JSDOM } = require('jsdom');
const { URL } = require('url');

// Config
const ZOTERO_API_KEY = process.env.ZOTERO_API_KEY || 'CIa0ew7OB4xaic0mtvSh0y4L';
const ZOTERO_USER_ID = process.env.ZOTERO_USER_ID || '13899544';

async function crawl(url, options = {}) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const client = parsedUrl.protocol === 'https:' ? https : http;

        client.get(url, { timeout: 30000 }, (res) => {
            let data = '';

            res.on('data', chunk => data += chunk);
            res.on('end', async () => {
                try {
                    const dom = new JSDOM(data, { url });
                    const document = dom.window.document;

                    // Extract content
                    const title = options.title || 
                        document.querySelector('title')?.textContent || 
                        parsedUrl.hostname;

                    // Remove scripts and styles
                    document.querySelectorAll('script, style, nav, footer, aside').forEach(el => el.remove());

                    // Get main content
                    const content = document.querySelector('article, main, .content, #content') || document.body;
                    const text = content?.textContent?.trim() || '';
                    
                    // Get first paragraph as abstract
                    const firstP = document.querySelector('p');
                    const abstract = firstP?.textContent?.slice(0, 500) || text.slice(0, 500);

                    // Extract tags from meta
                    const keywords = document.querySelector('meta[name="keywords"]')?.content || '';
                    const description = document.querySelector('meta[name="description"]')?.content || '';

                    resolve({
                        url,
                        title: title.slice(0, 300),
                        abstract: abstract,
                        content: text.slice(0, 10000),
                        keywords: keywords.split(',').map(k => k.trim()).filter(Boolean)
                    });
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject).setTimeout(30000);
    });
}

async function saveToZotero(item) {
    // Zotero API expects direct JSON array
    const payload = [{
        itemType: 'webpage',
        title: item.title,
        url: item.url,
        abstractNote: item.abstract,
        tags: item.keywords.map(k => ({ tag: k }))
    }];

    const url = `https://api.zotero.org/users/${ZOTERO_USER_ID}/items`;
    
    return new Promise((resolve, reject) => {
        const req = https.request(url, {
            method: 'POST',
            headers: {
                'Zotero-API-Key': ZOTERO_API_KEY,
                'Content-Type': 'application/json'
            }
        }, (res) => {
            let d = '';
            res.on('data', chunk => d += chunk);
            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    resolve(JSON.parse(d));
                } else {
                    reject(new Error(`Zotero API: ${res.statusCode} - ${d}`));
                }
            });
        });

        req.write(JSON.stringify(payload));
        req.end();
    });
}

async function translate(text) {
    if (!text) return text;
    
    return new Promise((resolve) => {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=${encodeURIComponent(text)}`;
        
        https.get(url, (res) => {
            let d = '';
            res.on('data', chunk => d += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(d);
                    const result = parsed[0]?.map(x => x[0])?.join('') || text;
                    resolve(result);
                } catch {
                    resolve(text);
                }
            });
        }).on('error', () => resolve(text));
    });
}

// CLI
async function main() {
    const args = process.argv.slice(2);
    const url = args[0];
    const customTitle = args[1];
    const tagsArg = args[2];
    const translateFlag = args.includes('--translate');

    if (!url) {
        console.log('Usage: node crawl-save.js <url> [title] [tags] [--translate]');
        console.log('Example: node crawl-save.js "https://example.com" "My Title" "tag1,tag2" --translate');
        process.exit(1);
    }

    console.log(`Crawling: ${url}`);

    try {
        // Crawl
        const result = await crawl(url, { title: customTitle });
        console.log(`Title: ${result.title.slice(0, 50)}...`);

        // Translate if requested
        if (translateFlag) {
            console.log('Translating...');
            result.title = await translate(result.title);
            result.abstract = await translate(result.abstract);
        }

        // Add custom tags
        if (tagsArg) {
            const customTags = tagsArg.split(',').map(t => t.trim());
            result.keywords = [...new Set([...result.keywords, ...customTags])];
        }

        // Save to Zotero
        console.log('Saving to Zotero...');
        const saved = await saveToZotero(result);
        console.log(`✓ Saved! Key: ${saved.successful?.[0]?.key || 'unknown'}`);
    } catch (e) {
        console.error('Error:', e.message);
        process.exit(1);
    }
}

module.exports = { crawl, saveToZotero, translate };
main();
