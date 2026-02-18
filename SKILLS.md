# Skills Guide

Guide to installing skills for Kabe AI Assistant.

---

## 📦 Custom Skills (trong repo)

Copy từ `skills/` folder:

| Skill | Mô tả | Cách cài |
|-------|-------|----------|
| `obsidian` | Work với Obsidian vaults | Copy vào `~/.openclaw/workspace/skills/` |
| `memory-manager` | Quản lý memory files | Copy vào `~/.openclaw/workspace/skills/` |
| `memory-search` | Search memory | Copy vào `~/.openclaw/workspace/skills/` |
| `skills-search` | Tìm kiếm skills | Copy vào `~/.openclaw/workspace/skills/` |
| `table-image-generator` | Tạo ảnh bảng | Copy vào `~/.openclaw/workspace/skills/` |
| `n8n-automation` | Quản lý n8n workflows | Copy vào `~/.openclaw/workspace/skills/` |
| `crawl4ai` | Web crawler + Zotero | Copy vào `~/.openclaw/workspace/skills/` |
| `zotero` | Zotero API integration | Copy vào `~/.openclaw/workspace/skills/` |

**Lưu ý:** KHÔNG copy `node_modules/` - cài bằng npm sau:

```bash
cd skills/crawl4ai
npm install
```

---

## 🌐 NPM Skills

Cài qua npm:

```bash
# Google Calendar
npm install -g @matonai/google-calendar

# Weather (không cần API key)
npm install -g openclaw-skill-weather
```

---

## 🔐 Credentials (KHÔNG commit)

Tạo file `.env` hoặc lưu vào `~/.bashrc`:

```bash
# Zotero
export ZOTERO_API_KEY="your-key"

# Google Calendar (Maton)
export MATON_API_KEY="your-key"

# n8n
export N8N_API_KEY="your-key"
```

**TUYỆT ĐỐI KHÔNG** đẩy credentials lên git!

---

## ✅ Setup Script

```bash
# 1. Copy skills
cp -r skills/* ~/.openclaw/workspace/skills/

# 2. Install dependencies
cd ~/.openclaw/workspace/skills/crawl4ai && npm install

# 3. Setup credentials
# Thêm vào ~/.bashrc hoặc tạo .env file
```

---

*Last updated: 2026-02-18*
