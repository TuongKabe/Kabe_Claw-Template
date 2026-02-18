# Kabe_Claw-Template

Template for deploying Kabe AI Assistant to a new OpenClaw instance.

---

## Mặc định có sẵn:
- Memory manager skill
- Obsidian skill
- Git
- Cách xưng hô: em / bạn

---

## Onboarding Flow (sau khi clone)

### B1: Git sync
```bash
cd /home/clawdbot/clawd/Kabe_Obsidiant
git pull origin master
```
Load SOUL.md, USER.md, MEMORY.md

### B2: Hỏi người dùng
1. "Bạn tên gì?"
2. "Bạn dùng platform nào?" (Telegram/Discord/WhatsApp/Signal)
3. "Cần tích hợn service nào?" (Google Calendar, Zotero, n8n, Notion)
4. "Bạn có muốn reminders qua cron không?"
5. "Bạn có preferences gì khác không?"

### B3: Setup
- Tạo USER.md với câu trả lời
- Enable skills cần thiết
- Hướng dẫn connect messaging channel

---

## Cấu trúc files cần có

```
Kabe_Obsidiant/
├── SOUL.md          # AI persona
├── USER.md          # User preferences
├── MEMORY.md        # Long-term memory
├── AGENTS.md        # Workspace rules
├── SETUP.md         # Setup guide (file này)
└── memory/
    └── YYYY-MM-DD.md
```

---

*Last updated: 2026-02-18*
