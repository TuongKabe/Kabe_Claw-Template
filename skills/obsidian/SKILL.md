---
name: obsidian
description: Work with Obsidian vaults (plain Markdown notes) and automate via obsidian-cli.
homepage: https://help.obsidian.md
---

# Obsidian Skill

Work with Obsidian vaults via git workflow.

---

## EM'S METACOGNITION LOOP

| Bước | Hành động | Confidence |
|------|-----------|------------|
| **PERCEIVE** | Edit gì? (create/update/move/delete) | 🤔 "Unknown unknowns" |
| **PLAN** | Chọn action. Check conf: ___% | ____% |
| **git pull** | **LUÔN pull về TRƯỚC** | ✅ |
| **ACT** | Edit với explicit confidence | ≥80%: Edit<br><80%: Verify |
| **git add+commit** | Commit ngay sau edit | ✅ |
| **git pull --rebase** | An toàn trước push | ✅ |
| **git push** | Push | ✅ |
| **REFLECT** | Conflict? → Communicate | Conflict → Ask |

---

## QUY TẮC VÀNG (BẮT BUỘC)

| Thứ tự | Hành động | Command |
|--------|-----------|---------|
| **1** | `git pull` | **BẮT BUỘC** - Lấy version mới nhất |
| **2** | Edit file | An toàn với latest version |
| **3** | `git add + commit` | Commit ngay |
| **4** | `git pull --rebase` | Kiểm tra conflict |
| **5** | `git push` | Push |

---

## Tại Sao git pull TRƯỚC?

| Trước (SAI) | Sau (ĐÚNG) |
|-------------|-------------|
| Em edit version cũ | Em **LUÔN pull** trước |
| Overwrite changes của anh | Cùng version → merge OK |
| Conflict sau khi push | Rebase **trước** push |

---

## Ví Dụ: Tạo Note Mới

**Anh bảo:** "Tạo note về AI Agents"

| Bước | Hành động | Command/Result |
|------|-----------|----------------|
| 1-2 | PERCEIVE + PLAN | Tạo trong 30 Resources. Conf: 90% |
| 3 | **git pull** | ✅ Latest version |
| 4 | ACT | Tạo file |
| 5 | git add + commit | ✅ |
| 6 | git pull --rebase | ✅ |
| 7 | git push | ✅ |
| 8 | REFLECT | ✅ Done |

---

## Ví Dụ: Update Note

**Anh bảo:** "Thêm workflow vào Clawdbot Framework"

| Bước | Hành động | Command/Result |
|------|-----------|----------------|
| 1-2 | PERCEIVE + PLAN | Update existing note. Conf: 85% |
| 3 | **git pull** | ✅ Latest version |
| 4 | ACT | Append content |
| 5 | git add + commit | ✅ |
| 6 | git pull --rebase | ✅ |
| 7 | git push | ✅ |
| 8 | REFLECT | ✅ Done |

---

## Khi NÀO Em SẼ DỪNG

| Tình huống | Hành động |
|------------|-----------|
| Anh đang edit cùng note | Đợi anh pull + xong rồi mới edit |
| Git conflict khi rebase | Báo anh, không push |
| Requirement không rõ | Clarify với anh |

---

## obsidian-cli Quick Start

Pick a default vault (once):

- `obsidian-cli set-default "<vault-folder-name>"`
- `obsidian-cli print-default` / `obsidian-cli print-default --path-only`

Search

- `obsidian-cli search "query"` (note names)
- `obsidian-cli search-content "query"` (inside notes; shows snippets + lines)

Create

- `obsidian-cli create "Folder/New note" --content "..." --open`
- Requires Obsidian URI handler (`obsidian://…`) working (Obsidian installed).
- Avoid creating notes under "hidden" dot-folders (e.g. `.something/...`) via URI; Obsidian may refuse.

Move/rename (safe refactor)

- `obsidian-cli move "old/path/note" "new/path/note"`
- Updates `[[wikilinks]]` and common Markdown links across the vault (this is the main win vs `mv`).

Delete

- `obsidian-cli delete "path/note"`

Prefer direct edits when appropriate: open the `.md` file and change it; Obsidian will pick it up.

---

## Vault Structure (Typical)

- Notes: `*.md` (plain text Markdown; edit with any editor)
- Config: `.obsidian/` (workspace + plugin settings; usually don't touch from scripts)
- Canvases: `*.canvas` (JSON)
- Attachments: whatever folder you chose in Obsidian settings (images/PDFs/etc.)

---

## Find the active vault(s)

Obsidian desktop tracks vaults here (source of truth):

- `~/Library/Application Support/obsidian/obsidian.json`

`obsidian-cli` resolves vaults from that file; vault name is typically the **folder name** (path suffix).

Fast "what vault is active / where are the notes?"

- If you've already set a default: `obsidian-cli print-default --path-only`
- Otherwise, read `~/Library/Application Support/obsidian/obsidian.json` and use the vault entry with `"open": true`.

Notes

- Multiple vaults common (iCloud vs `~/Documents`, work/personal, etc.). Don't guess; read config.
- Avoid writing hardcoded vault paths into scripts; prefer reading the config or using `print-default`.

---

## Tips

- **Commit often** sau mỗi edit
- **Pull trước khi edit** để tránh conflict
- **Dùng git workflow**, không cần PC online
- **Communicate** khi cùng edit 1 note
- **Ghi rõ confidence** cho mỗi action
