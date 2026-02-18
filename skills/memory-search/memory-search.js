/**
 * Memory Search Tool for OpenClaw
 * Provides vector + knowledge graph search for agent
 */

require('dotenv').config({ path: '/home/clawdbot/clawd/hybrid-search/.env' });
const { HybridSearchDB, GeminiEmbedder } = require('/home/clawdbot/clawd/hybrid-search/hybrid-search.js');
const { KnowledgeGraphStore } = require('/home/clawdbot/clawd/hybrid-search/knowledge-graph.js');

class MemorySearchTool {
  constructor() {
    this.db = new HybridSearchDB();
    this.kg = new KnowledgeGraphStore();
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    await this.db.init();
    await this.kg.init();
    this.initialized = true;
  }

  /**
   * Search memory with combined vector + graph search
   */
  async search(query, options = {}) {
    await this.init();

    const { topK = 5, vectorWeight = 0.6, keywordWeight = 0.4 } = options;

    // Vector search
    const embedder = new GeminiEmbedder();
    const vectorResults = await this.db.hybridSearch(query, embedder, {
      topK,
      vectorWeight,
      keywordWeight
    });

    // Knowledge graph search
    const graphResults = await this.kg.search(query, { topK });

    // Combine results
    return {
      query,
      vector_results: vectorResults.map(r => ({
        score: r.scores.vector,
        keyword_score: r.scores.keyword,
        source: r.metadata.source,
        content: r.content.substring(0, 300)
      })),
      knowledge_graph: this.formatGraphResults(graphResults),
      total_vector_results: vectorResults.length,
      total_graph_results: graphResults.length
    };
  }

  formatGraphResults(results) {
    const byCategory = {};
    results.forEach(r => {
      if (!byCategory[r.category]) byCategory[r.category] = [];
      byCategory[r.category].push(r.label.substring(0, 100));
    });
    return byCategory;
  }

  async close() {
    await this.db.close();
    await this.kg.close();
  }
}

module.exports = { MemorySearchTool };
