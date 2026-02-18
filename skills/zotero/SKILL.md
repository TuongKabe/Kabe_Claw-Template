---
name: zotero
description: Zotero library management via API. Use when working with research papers, citations, references, or any Zotero-related tasks. Supports: searching library, adding items, managing collections, getting attachments, and BibTeX export.
---

# Zotero Skill

## Configuration

Credentials stored at: `/home/clawdbot/clawd/zotero/.env`
- `ZOTERO_API_KEY`: API key
- `ZOTERO_USER_ID`: User ID

## API Base URL

```
https://api.zotero.org/users/{user_id}/items
```

## Common Operations

### Search Library
```bash
curl -H "Zotero-API-Key: $ZOTERO_API_KEY" \
  "https://api.zotero.org/users/13899544/items?q={query}&limit=20"
```

### Get Collections
```bash
curl -H "Zotero-API-Key: $ZOTERO_API_KEY" \
  "https://api.zotero.org/users/13899544/collections"
```

### Get Item Details
```bash
curl -H "Zotero-API-Key: $ZOTERO_API_KEY" \
  "https://api.zotero.org/users/13899544/items/{item_key}"
```

### Add New Item (JSON)
```bash
curl -X POST \
  -H "Zotero-API-Key: $ZOTERO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"itemType":"journalArticle","title":"Paper Title","creators":[{"creatorType":"author","firstName":"First","lastName":"Last"}]}]}' \
  "https://api.zotero.org/users/13899544/items"
```

### Export as BibTeX
```bash
curl -H "Zotero-API-Key: $ZOTERO_API_KEY" \
  "https://api.zotero.org/users/13899544/items/{item_key}?format=bibtex"
```

### Get Attachments
```bash
curl -H "Zotero-API-Key: $ZOTERO_API_KEY" \
  "https://api.zotero.org/users/13899544/items/{item_key}/children"
```

## Item Types

- `journalArticle`, `book`, `bookSection`, `conferencePaper`, `thesis`, `report`, `webpage`

## Response Formats

- `format=json` (default)
- `format=bibtex`
- `format=ris`
- `format=refer` (referencemanager)

## Tips

- Use `q=` for full-text search
- Use `tag=` to filter by tag
- Use `limit=100` for pagination (max 100 per request)
- Use `sort=dateModified&direction=desc` for recent items
