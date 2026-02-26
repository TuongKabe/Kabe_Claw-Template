# Memory System Skill

## Overview

Skill này cung cấp hệ thống memory hoàn chỉnh cho Clawdbot:
- **File-based memory** với Git sync
- **Vector search** với Pinecone + OpenAI embeddings
- **Hybrid retrieval** - kết hợp cả hai

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
2. Create new secret key
3. **Lưu ý:** Chỉ cần cho embeddings (rẻ - $0.02/1M tokens)

### 3. Lưu Credentials

```bash
mkdir -p ~/.claws/credentials

# Pinecone
echo "pcsk_your_pinecone_key" > ~/.claws/credentials/pinecone.env

# OpenAI  
echo "sk-your_openai_key" > ~/.claws/credentials/openai.env
```

### 4. Cài đặt Dependencies

```bash
cd ~/.openclaw/workspace
npm install @pinecone-database/pinecone@6.1.4 openai
```

### 5. Verify

```bash
node ~/.openclaw/workspace/skills/memory-system/scripts/pinecone-store.js status
```

Nếu thấy `Status: true` → Setup thành công!

---

## Sử Dụng

### Vector Operations

```bash
# Upsert một file
node scripts/pinecone-store.js upsert <file_path>

# Query bằng ngôn ngữ tự nhiên
node scripts/pinecone-store.js query "tìm thông tin về..."

# Check status
node scripts/pinecone-store.js status
```

### Git Sync (Memory Files)

```bash
# Commit & push memory changes
cd ~/.openclaw/workspace
git add memory/ memory.md MEMORY.md
git commit -m "Update memory"
git push
```

---

## Memory Architecture

```
┌─────────────────────────────────────────────┐
│           User Query                         │
└─────────────────┬───────────────────────────┘
                  ▼
┌─────────────────────────────────────────────┐
│         Hybrid Retrieval                     │
├─────────────────────────────────────────────┤
│  1. Cache Check (optional)                  │
│  2. Vector Search (Pinecone) - semantic     │
│  3. File Search (grep) - exact match        │
└─────────────────┬───────────────────────────┘
                  ▼
┌─────────────────────────────────────────────┐
│         Merge & Return Results              │
└─────────────────────────────────────────────┘
```

---

## Credentials

| Key | File | Required |
|-----|------|----------|
| Pinecone API | `~/.claws/credentials/pinecone.env` | ✅ |
| OpenAI API | `~/.claws/credentials/openai.env` | ✅ |

**KHÔNG BAO GIỜ commit credentials lên git!**

---

## Khi Nào Dùng Vector Search

| Tình huống | Method |
|------------|--------|
| Query ngôn ngữ tự nhiên | Vector |
| Tìm ý nghĩa, không từ khóa | Vector |
| Gợi ý từ nhiều nguồn | Vector |
| Tìm ngày cụ thể | File search |
| Tìm code/syntax | File search |
| Exact keyword match | File search |

---

## Troubleshooting

### "Missing OpenAI credentials"
→ Kiểm tra `~/.claws/credentials/openai.env`

### "Dimension mismatch"
→ Index dimensions phải là 1536

### "Request failed to reach Pinecone"
→ Kiểm tra network hoặc Pinecone status

---

## Files

- `scripts/pinecone-store.js` - Main vector store script
- `scripts/sync-memory.js` - Git sync automation
- `.env.example` - Credentials template

---

**Version:** 1.0.0  
**Updated:** 2026-02-26
