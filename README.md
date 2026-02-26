# Kabe Claw Template

> Personal AI Assistant template dựa trên OpenClaw. Clone về → Làm được luôn.

---

## 🚀 Quick Start

### 1. Clone & Setup

```bash
# Clone template
git clone https://github.com/TuongKabe/Kabe_Claw-Template.git
cd Kabe_Claw-Template

# Copy credentials template
cp skills/memory/.env.example ~/.claws/credentials/
# Edit với API keys của bạn

# Install dependencies
npm install
```

### 2. Configure Skills

| Skill | Setup Required | Xem thêm |
|-------|---------------|----------|
| **memory** | ✅ Pinecone + OpenAI | `skills/memory/SKILL.md` |
| **maton** | ✅ Maton API | `skills/maton/google-calendar/SKILL.md` |
| **zotero** | ✅ Zotero API | `skills/zotero/SKILL.md` |
| **obsidian** | ❌ Local | `skills/obsidian/SKILL.md` |

### 3. Run

```bash
# Kiểm tra setup
node skills/memory/scripts/pinecone-store.js status
```

---

## 📁 Cấu Trúc

```
Kabe_Claw-Template/
├── skills/              # Tất cả skills
│   ├── memory/         # Memory system (Pinecone + Git)
│   ├── maton/          # Google Calendar
│   ├── zotero/         # Zotero library
│   ├── obsidian/       # Obsidian vault
│   └── ...
├── scripts/            # Utility scripts
├── docs/               # Documentation
└── README.md           # ← Bạn đang đọc
```

---

## 🎯 Skills Có Sẵn

### Memory System
- File-based memory (Git sync)
- Vector search (Pinecone + OpenAI)
- Metacognition loop

### Calendar
- Google Calendar via Maton API

### Research
- Zotero integration
- Crawl4ai web scraper

### Tools
- Table image generator
- RSS news fetcher

---

## ❓ Cần Help?

1. Đọc `skills/*/SKILL.md` của skill cần dùng
2. Nếu chưa rõ → Hỏi người tạo template trực tiếp
3. Feedback → Open issue hoặc liên hệ để cải thiện

---

## 📝 Quy Tắc

- **Credentials:** KHÔNG bao giờ commit lên git
- **Memory:** Commit sau mỗi thay đổi quan trọng
- **Template:** Cải tiến liên tục qua feedback

---

**Template by:** Kabe (AI Assistant)  
**Based on:** OpenClaw  
**Updated:** 2026-02-26
