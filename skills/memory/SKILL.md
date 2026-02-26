---
name: memory
description: Unified memory system for Clawdbot. Combines file-based memory (Git sync), vector search (Pinecone), and search methodology. Use when: (1) Creating session notes, (2) Searching memory, (3) Committing to git, (4) Memory maintenance.
---

# Memory System

> **Template Goal:** Khi clone về, người dùng biết cách sử dụng và làm được luôn. Thiếu info → Hướng dẫn + hỏi trực tiếp.

---

## 🎯 Skills Có Sẵn Trong Template

| Skill | Mô tả | Dùng khi |
|-------|-------|----------|
| **memory** | File-based memory + Vector search (Pinecone) | Cần search thông minh |
| **maton** | Google Calendar integration | Quản lý lịch |
| **zotero** | Academic library management | Lưu papers |
| **obsidian** | Obsidian vault sync | Ghi chú PKM |
| **rss-news** | Vietnamese news fetcher | Tin tức tự động |

---

## 🧠 Memory System Chi Tiết

### 2 Layers:

| Layer | Công nghệ | Use Case |
|-------|-----------|----------|
| **File-based** | Git sync | Daily notes, long-term memory |
| **Vector Search** | Pinecone + OpenAI | Semantic search (ngôn ngữ tự nhiên) |

### Ai nên dùng?

- ✅ Muốn AI nhớ context qua nhiều sessions
- ✅ Cần search thông tin bằng ngôn ngữ tự nhiên
- ✅ Có nhiều files cần tìm kiếm thông minh

- ❌ Chỉ cần session context đơn giản
- ❌ Không cần semantic search

---

## 📲 Setup Qua WebUI (Chat)

### Bước 1: Giới Thiệu

> " Xin chào! Đây là **Memory System** - hệ thống memory cho Clawdbot.
> 
> **Gồm 2 phần:**
> - 📁 File-based: Lưu notes hàng ngày, sync lên Git
> - 🔍 Vector Search: Search thông minh bằng AI (Pinecone + OpenAI)
> 
> **Bạn có muốn setup không?** [Có] [Không] "

### Bước 2: Xác Nhận

Nếu user chọn **[Có]**:

> " OK! Setup gồm 2 phần:
> 
> 1️⃣ **Pinecone** - Vector database (free tier)
> 2️⃣ **OpenAI** - Tạo embeddings (rẻ, $0.02/1M tokens)
> 
> **Bạn đã có tài khoản chưa?" [Có] [Chưa] "

### Bước 3a: Nếu Chưa Có

> " Tạo tài khoản:
> 
> **Pinecone:** Vào [pinecone.io](https://pinecone.io) → Sign up → Tạo Index:
> - Name: `clawdbot-memory`
> - Dimensions: `1536`
> - Metric: `cosine`
> 
> **OpenAI:** Vào [platform.openai.com](https://platform.openai.com) → API Keys → Create new
> 
> Xong báo em nhé! ✅ "

### Bước 3b: Nếu Đã Có

> "3️⃣ Gửi **Pinecone API Key** của bạn nhé (bắt đầu bằng `pcsk_`)"

Sau khi nhận:

> "✅ Đã lưu Pinecone key!
> 
> 4️⃣ Giờ gửi **OpenAI API Key** nhé (bắt đầu bằng `sk-`)"

Sau khi nhận:

> "✅ Đã lưu OpenAI key!
> 
> 5️⃣ Tạo Pinecone Index:
> - Vào [pinecone.io](https://pinecone.io)
> - Create Index:
>   - Name: `clawdbot-memory`
>   - Dimensions: `1536`
>   - Metric: `cosine`
>   - Pod: `starter`
> 
> Xong báo em để em verify nhé! "

### Bước 4: Verify

> "Để em kiểm tra..."

```bash
node skills/memory/scripts/pinecone-store.js status
```

> "✅ **Setup thành công!**
> 
> **Tiếp theo:**
> - Để index files: `node skills/memory/scripts/pinecone-store.js upsert <file>`
> - Để search: `node skills/memory/scripts/pinecone-store.js query "..."`
> - Docs: `skills/memory/SKILL.md`

---

## ⚠️ Lưu Ý Quan Trọng

- **Credentials KHÔNG bao giờ commit lên git**
- **Free tier Pinecone:** 1 index, 100K vectors
- **OpenAI embedding:** $0.02/1M tokens - rẻ vô cùng

---

## 📝 Commands (Sau Setup)

```bash
# Upsert file to vector store
node skills/memory/scripts/pinecone-store.js upsert <file>

# Query bằng ngôn ngữ tự nhiên
node skills/memory/scripts/pinecone-store.js query "tìm thông tin..."

# Check status
node skills/memory/scripts/pinecone-store.js status
```

---

**Version:** 2.1.0  
**Updated:** 2026-02-26
