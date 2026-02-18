/**
 * Memory Search Tool for OpenClaw Agent
 * With PIN protection for sensitive content
 */

const { MemorySearchTool } = require('./memory-search');
const { verifyPin, containsSensitiveKeywords } = require('/home/clawdbot/clawd/hybrid-search/pin-auth.js');

class MemorySearch {
  constructor() {
    this.tool = new MemorySearchTool();
  }

  name = 'memory_search';
  description = 'Search personal memory using hybrid vector + knowledge graph search';

  async run(args) {
    try {
      // Check for PIN if accessing sensitive content
      if (args.pin) {
        if (!verifyPin(args.pin)) {
          return { error: '❌ Invalid PIN' };
        }
      }
      
      const query = args.query || args.question || args.search || '';
      
      if (!query) {
        return {
          error: 'Missing query. Usage: memory_search({ query: "your question" })'
        };
      }

      const results = await this.tool.search(query, {
        topK: args.topK || 5
      });

      // Format for agent consumption
      let output = `🔍 Memory Search: "${query}"\n\n`;
      const hasPin = !!args.pin;

      // Vector results with sensitive content check
      if (results.vector_results.length > 0) {
        output += `📊 TOP RESULTS (Vector Search):\n`;
        results.vector_results.forEach((r, i) => {
          const isSensitive = containsSensitiveKeywords(r.content);
          const displayContent = hasPin || !isSensitive 
            ? r.content.substring(0, 200)
            : '🔒 [Content protected - provide PIN to view]';
            
          output += `[${i+1}] Score: ${(r.score * 100).toFixed(1)}% | ${r.source}\n`;
          output += `   ${displayContent}...\n\n`;
        });
      }

      // Knowledge graph results
      if (Object.keys(results.knowledge_graph).length > 0) {
        output += `🔗 KNOWLEDGE GRAPH:\n`;
        Object.entries(results.knowledge_graph).forEach(([cat, items]) => {
          output += `📁 ${cat}:\n`;
          items.forEach(item => output += `   • ${item.substring(0, 100)}\n`);
          output += `\n`;
        });
      }

      if (results.vector_results.length === 0 && Object.keys(results.knowledge_graph).length === 0) {
        output += `❌ No memory found for "${query}"\n`;
      }

      return output;

    } catch (error) {
      return { error: error.message };
    }
  }
}

module.exports = MemorySearch;
