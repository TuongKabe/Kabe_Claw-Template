/**
 * Pinecone Vector Store for Clawdbot Memory
 * Usage: node scripts/pinecone-store.js [command] [args]
 * 
 * Commands:
 *   upsert <file> [namespace]  - Upsert file content to index
 *   query <text> [topK]        - Query similar documents
 *   status                     - Check index status
 *   upsert-all [folder]        - Upsert all files in folder
 */

const { Pinecone } = require('@pinecone-database/pinecone');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

// Config
const INDEX_NAME = process.env.PINECONE_INDEX || 'clawdbot-memory';
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSIONS = 1536;

// Load API keys
const PINECONE_KEY = fs.readFileSync(path.join(process.env.HOME || '/home/clawdbot', '.claws/credentials/pinecone.env'), 'utf-8').trim();
const OPENAI_KEY = fs.readFileSync(path.join(process.env.HOME || '/home/clawdbot', '.claws/credentials/openai.env'), 'utf-8').trim();

// Initialize clients
const pc = new Pinecone({ apiKey: PINECONE_KEY });
const openai = new OpenAI({ apiKey: OPENAI_KEY });

/**
 * Get embedding for text using OpenAI
 */
async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
    dimensions: EMBEDDING_DIMENSIONS
  });
  
  return response.data[0].embedding;
}

/**
 * Upsert a document to Pinecone
 */
async function upsertDocument(id, text, metadata = {}) {
  const index = pc.index(INDEX_NAME);
  
  const embedding = await getEmbedding(text);
  
  await index.upsert([{
    id,
    values: embedding,
    metadata: {
      text: text.substring(0, 3000),
      ...metadata
    }
  }]);
  
  console.log(`✅ Upserted: ${id}`);
}

/**
 * Query similar documents
 */
async function querySimilar(text, topK = 5) {
  const embedding = await getEmbedding(text);
  
  const index = pc.index(INDEX_NAME);
  
  const results = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true
  });
  
  return results.matches;
}

/**
 * Check index status
 */
async function status() {
  const stats = await pc.describeIndex(INDEX_NAME);
  
  console.log(`📊 Index: ${INDEX_NAME}`);
  console.log(`   Dimension: ${stats.dimension}`);
  console.log(`   Metric: ${stats.metric}`);
  console.log(`   Status: ${stats.status?.ready}`);
}

/**
 * Upsert all files in a folder
 */
async function upsertFolder(folderPath) {
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.md'));
  
  console.log(`Found ${files.length} markdown files`);
  
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const id = path.basename(file, '.md');
    
    try {
      await upsertDocument(id, content, { 
        source: filePath,
        created: new Date().toISOString()
      });
    } catch (e) {
      console.log(`❌ Failed: ${id} - ${e.message}`);
    }
  }
}

// Main
const [,, command, ...args] = process.argv;

(async () => {
  try {
    switch (command) {
      case 'upsert': {
        const filePath = args[0];
        
        if (!filePath) {
          console.error('Usage: upsert <file> [namespace]');
          process.exit(1);
        }
        
        const content = fs.readFileSync(filePath, 'utf-8');
        const id = path.basename(filePath, '.md');
        
        await upsertDocument(id, content, { 
          source: filePath,
          created: new Date().toISOString()
        });
        break;
      }
      
      case 'query': {
        const text = args[0];
        const topK = parseInt(args[1]) || 5;
        
        if (!text) {
          console.error('Usage: query <text> [topK]');
          process.exit(1);
        }
        
        const results = await querySimilar(text, topK);
        
        console.log(`🔍 Query: "${text}"\n`);
        results.forEach((r, i) => {
          console.log(`${i + 1}. [${(r.score * 100).toFixed(1)}%] ${r.id}`);
          console.log(`   ${r.metadata?.text?.substring(0, 100)}...\n`);
        });
        break;
      }
      
      case 'status':
        await status();
        break;
        
      case 'upsert-all': {
        const folder = args[0] || path.join(process.env.HOME || '/home/clawdbot', '.openclaw/workspace');
        await upsertFolder(folder);
        break;
      }
        
      default:
        console.log(`Pinecone Store for Clawdbot`);
        console.log(`Index: ${INDEX_NAME}`);
        console.log(`\nUsage: node pinecone-store.js [command]`);
        console.log(`  upsert <file>          - Add document`);
        console.log(`  query <text> [topK]    - Search`);
        console.log(`  status                  - Check stats`);
        console.log(`  upsert-all [folder]     - Add all md files`);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
