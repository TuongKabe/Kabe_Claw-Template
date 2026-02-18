---
name: crawl4ai
description: Web crawling và content extraction cho research. Crawl URLs, extract content, và save vào Zotero. Dùng khi cần thu thập thông tin từ web: nghiên cứu 3D printing, leather craft, design inspiration, hoặc bất kỳ topic nào cần crawling.
---

# Crawl4AI Skill - Research Methodology

Crawl4AI là open-source web crawler #1 trending GitHub, optimized cho LLM.

---

## EM'S METACOGNITION LOOP

Áp dụng cho mọi research task:

| Bước | Hành động | Confidence Check |
|------|-----------|-------------------|
| **PERCEIVE** | Task là gì? Thông tin loại gì? Em có context đủ không? | 🤔 "Unknown unknowns" là gì? |
| **PLAN** | Chọn approach (crawl/browser/search). Confidence ban đầu: ____% | ____% |
| **ACT** | Research với **explicit confidence level** | ≥80%: Answer<br><80%: Hedge/Ask |
| **REFLECT** | "Câu trả lời chắc chắn chưa?" → Nếu <80% → KHÔNG trả lời confident | <80% → Verify thêm |

---

## QUY TẮC: Số Liệu = Phải Verify

### Cross-Verification Checklist

| Câu hỏi | ✅ / ❌ |
|---------|---------|
| Số liệu có **link source** không? | ___ |
| Em đã **mở link** xem chưa? | ___ |
| Số liệu trích dẫn **đúng context** không? | ___ |
| Tìm được **≥2 nguồn** cho thông tin quan trọng? | ___ |
| Thông tin **nhất quán** giữa các nguồn? | ___ |
| Confidence sau cross-check: ____% | ___ |

### Kết quả Cross-Check

| Kết quả | Hành động |
|---------|-----------|
| **Nhất quán** | Dùng số liệu + ghi "[nguồn 1], [nguồn 2]" |
| **Conflict** | Ghi rõ conflict + confidence thấp + khuyên verify |
| **Chỉ 1 nguồn** | Ghi "theo [nguồn], chưa cross-check" |

---

## PHÂN LOẠI THÔNG TIN & CHIẾN LƯỢC VERIFY

| Loại | Ví dụ | Chiến Lược Verify |
|------|-------|-------------------|
| **Sản phẩm** | "Quạt 12V 5A" từ nhiều shop | Liệt kê các nguồn → Specs khác nhau là bình thường |
| **Spec cố định** | "ESP32 có Bluetooth" | Cross-check ≥2 nguồn → **phải nhất quán** |
| **Thông tin chung** | "OpenAI founded 2015" | 1 nguồn tin cậy (official, wiki) |
| **Review/Opinion** | "Sản phẩm này tốt không" | Nhiều nguồn → xem trend chung |

### Checklist Em Tự Hỏi

1. "Thông tin này là **fact** hay **product listing**?"
2. "Fact cần nhất quán → có ≥2 nguồn match?"
3. "Product listing → specs khác nhau là normal → liệt kê?"
4. "Confidence phù hợp với loại chưa?"

---

## CONFIDENCE LEVELS

| Confidence | Hành động |
|------------|-----------|
| **≥90%** | Trả lời tự tin + ghi sources |
| **70-89%** | Trả lời + hedge ("có thể", "ước lượng") + ghi sources |
| **<70%** | **KHÔNG trả lời confident** → Hỏi lại hoặc nói "cần verify" |

---

## Cài đặt

```bash
cd /home/clawdbot/clawd/skills/crawl4ai
npm install
```

## Sử dụng

### Crawl URL và lưu vào Zotero

```bash
node scripts/crawl-save.js <url> [title] [tags]
```

**Ví dụ:**
```bash
# Crawl với title tự động
node scripts/crawl-save.js "https://example.com/article"

# Crawl với title tùy chỉnh
node scripts/crawl-save.js "https://example.com" "Tên bài viết" "tag1,tag2"

# Crawl và translate sang tiếng Việt
node scripts/crawl-save.js "https://example.com" "Tên bài" "tags" --translate
```

### Crawl nhiều URLs

```bash
node scripts/crawl-batch.js urls.txt
```

Tạo file `urls.txt` mỗi dòng 1 URL.

## Scripts

| Script | Mô tả |
|--------|-------|
| `crawl-save.js` | Crawl 1 URL, save vào Zotero |
| `crawl-batch.js` | Crawl nhiều URLs từ file |
| `crawl-translate.js` | Crawl + translate sang tiếng Việt |

## Output

Crawl xong tự động lưu vào Zotero:
- Title: Từ URL hoặc custom
- URL: Link gốc
- Tags: Từ command line
- Content: Extracted text (trong abstractNote)

## Ví dụ Workflow

```bash
# Research 3D printing
node scripts/crawl-save.js "https://3d.example.com/guide" "Hướng dẫn in 3D" "3d,printing,tutorial"

# Research leather craft
node scripts/crawl-save.js "https://leather.example.com" "Kỹ thuật làm da" "leather,craft"

# Research nhiều URLs
node scripts/crawl-save.js urls.txt
```

## Tips

- Dùng `--translate` flag để translate sang tiếng Việt
- Tag theo topic để dễ search trong Zotero
- Crawl rate limit: 1 request/second
- **Luôn áp dụng Metacognition Loop trước khi crawl**
- **Số liệu phải có link verify**
