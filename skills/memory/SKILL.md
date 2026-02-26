---
name: memory
description: Unified memory system for Clawdbot. Combines file-based memory (Git sync), vector search (Pinecone), and search methodology. Use when: (1) Creating session notes, (2) Searching memory, (3) Committing to git, (4) Memory maintenance.
---

# Memory System

Unified memory system với 2 layers:
1. **File-based** - Git sync (daily notes, long-term)
2. **Vector Search** - Pinecone + OpenAI (semantic)

---

## Setup (Bắt Buộc)

### 1. Tạo Pinecone Index

1. Vào **pinecone.io** → Sign up
2. Create Index:
   - **Name:** `clawdbot-memory`
   - **Dimensions:** `1536`
   - **Metric:** `cosine`
   - **Pod:** `starter` (free)
3. Lấy API Key từ **API Keys** menu

### 2. Lấy OpenAI API Key

1. Vào **platform.openai.com** → API Keys
2. Create new secret key (chỉ cần cho embeddings - $0.02/1M tokens)

### 3. Lưu Credentials

```bash
mkdir -p ~/.claws/credentials

# Pinecone
echo "pcsk_your_key" > ~/.claws/credentials/pinecone.env

# OpenAI
echo "sk-your_key" > ~/.claws/credentials/openai.env
```

### 4. Cài Dependencies

```bash
npm install @pinecone-database/pinecone@6.1.4 openai
```

---

## File Structure

```
workspace/
├── MEMORY.md              # Long-term memory (curated)
└── memory/
    └── YYYY-MM-DD.md     # Daily session notes (raw)
```

---

## Commands

### Vector Operations

```bash
# Upsert file to vector store
node skills/memory/scripts/pinecone-store.js upsert <file>

# Query
node skills/memory/scripts/pinecone-store.js query "tìm..."

# Check status
node skills/memory/scripts/pinecone-store.js status
```

### Git Sync

```bash
# Commit memory changes
git add memory/ memory.md MEMORY.md
git commit -m "Update memory"
git push
```

---

## Metacognition Loop

Áp dụng cho mọi memory search:

| Bước | Hành động |
|------|-----------|
| **PERCEIVE** | User hỏi gì? Loại info? |
| **PLAN** | Chọn search scope |
| **ACT** | Search + confidence level |
| **REFLECT** | Đủ chưa? → Answer hoặc Hedge |

### Confidence Levels

| Confidence | Hành động |
|------------|-----------|
| **≥90%** | Trả lời tự tin + ghi source |
| **70-89%** | Trả lời + hedge + source |
| **<70%** | "Em không chắc" + offer tạo mới |

---

## Khi Nào Dùng

| Method | Use Case |
|--------|----------|
| **Vector Search** | Query ngôn ngữ tự nhiên, tìm ý nghĩa |
| **File Search** | Tìm ngày cụ thể, code, exact keyword |
| **Git Commit** | Sau mỗi memory update quan trọng |

---

## Anti-Patterns

- ❌ "Mental notes" - luôn viết vào file
- ❌ Quên commit sau memory update
- ❌ Dùng uppercase trong tên file memory
- ❌ Trả lời khi confidence <70%

---

## Files

- `skills/memory/scripts/pinecone-store.js` - Vector operations
- `skills/memory/scripts/sync-memory.js` - Git sync

---

**Version:** 2.0.0  
**Updated:** 2026-02-26
