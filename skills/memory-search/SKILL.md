---
name: memory-search
description: Search personal memory using hybrid vector + knowledge graph search. Combines semantic search with relationship-based graph queries. Use when user asks about past conversations, learned knowledge, preferences, or any context that should be in memory.
---

# Memory Search Skill - Metacognition Methodology

Search through Kabe's personal memory system combining:
- **Vector Search** - Semantic similarity using embeddings
- **Knowledge Graph** - Entity relationships and categories

---

## EM'S METACOGNITION LOOP

Áp dụng cho mọi memory search:

| Bước | Hành động | Confidence Check |
|------|-----------|-------------------|
| **PERCEIVE** | User hỏi gì? Info này thuộc loại nào? (decision/preference/knowledge/fact) |
| **PLAN** | Chọn search scope (MEMORY.md, daily notes, Obsidian, all). Confidence: ____% |
| **ACT** | Search với **explicit confidence level** | ≥80%: Answer<br><80%: Hedge/Ask |
| **REFLECT** | "Em tìm đủ rồi chưa?" → Nếu <80% → mở rộng scope hoặc nói "chưa tìm thấy" |

---

## PHÂN LOẠI THÔNG TIN TRONG MEMORY

| Loại | Ví dụ | Chiến Lược Verify |
|------|-------|-------------------|
| **Quyết định** | "Anh đã quyết dùng MiniMax model" | Tìm trong MEMORY.md + daily notes |
| **Preference** | "Anh thích direct communication" | Tìm trong USER.md + SOUL.md |
| **Knowledge** | "PDCA methodology là gì" | Tìm trong knowledge files |
| **Fact/Event** | "Ngày 2026-02-04 đã xảy ra gì" | Tìm trong daily notes |

---

## CROSS-VERIFICATION TRONG MEMORY

### Checklist Search

| Câu hỏi | ✅ / ❌ |
|---------|---------|
| Tìm được ≥1 nguồn trong memory? | ___ |
| Nguồn có từ **MEMORY.md** (long-term) không? | ___ |
| Có trong **daily notes** (context) không? | ___ |
| Thông tin **nhất quán** giữa các nguồn? | ___ |
| Confidence sau search: ____% | ___ |

### Kết quả Search

| Kết quả | Hành động |
|---------|-----------|
| **Tìm thấy + Nhất quán** | Trả lời + ghi source |
| **Tìm thấy + Conflict** | Ghi rõ sources khác nhau + confidence thấp |
| **Không tìm thấy** | Nói "Chưa có trong memory" + offer tạo mới |

---

## CONFIDENCE LEVELS

| Confidence | Hành động |
|------------|-----------|
| **≥90%** | Trả lời tự tin + ghi sources |
| **70-89%** | Trả lời + hedge ("theo nhớ", "có thể") + ghi sources |
| **<70%** | **KHÔNG trả lời confident** → "Em không chắc, tìm thấy X nhưng..." |

---

## When to Use

- User asks about **past conversations**
- User asks what they've **learned before**
- User asks about **preferences** or context
- User asks about **projects, workflows, or decisions**
- User asks "remember this?" hoặc "có nhớ không?"

---

## Examples

### Search Memory
```
Search memory for "PDCA methodology"
```

### Get Context
```
What do I know about Cognee?
```

### Find Related Info
```
Find everything about affiliate business
```

### Check Decision
```
Did I decide to use MiniMax model?
```

---

## Output Format

Return relevant memories with:
- **Vector Score** (0-1, higher = more relevant)
- **Source** (which file: MEMORY.md, daily/2026-02-04.md, Obsidian/...)
- **Category** (from knowledge graph: decision/preference/knowledge)
- **Content snippet**

---

## Notes

- Search works for both **English and Vietnamese**
- Vector search uses **Gemini embeddings**
- Results are limited to top 5 by default
- **Luôn áp dụng Metacognition Loop trước khi trả lời**
- **Ghi rõ source để user verify**
- **Nhất quán vs conflict → ghi rõ**
