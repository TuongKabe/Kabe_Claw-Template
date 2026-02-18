---
name: n8n-automation
description: Manage n8n workflows from OpenClaw via the n8n REST API. Use when the user asks about n8n workflows, automations, executions, or wants to trigger, list, create, activate, or debug n8n workflows. Supports both self-hosted n8n and n8n Cloud instances.
---

# n8n Automation + MCP Integration

Control n8n workflow automation platform via REST API + access n8n docs via MCP + full CRUD+Debug via n8n-custom-mcp.

---

## Quick Navigation

| Topic | Description |
|-------|-------------|
| [Part 1: REST API](#part-1-n8n-rest-api-manage-workflows) | Basic CRUD via REST API |
| [Part 2: n8n MCP Server](#part-2-n8n-mcp-server-query-n8n-docs) | Query n8n documentation |
| [Part 3: n8n-custom-mcp Tools](#part-3-n8n-custom-mcp-tools--skills) | Full CRUD + Test + Debug (RECOMMENDED) |
| [Part 4: RAG Workflow](#part-4-rag-workflow-template) | Build AI Q&A bot |

---

## Part 3: n8n-custom-mcp Tools + Skills

**RECOMMENDED:** Use n8n-custom-mcp MCP Server for full autonomous control.

### MCP Server Benefits
| Old MCP (czlonkowski) | New MCP (n8n-custom-mcp) |
|----------------------|-------------------------|
| List/Get/Execute/Activate | + Create/Update/Delete |
| - | + Trigger Webhook (test mode) |
| - | + Debug Executions |
| - | + List Node Types |

### Sub-Skills Available

1. **n8n-custom-mcp-tools** (`skills/dilomcfly/n8n-automation/skills/n8n-custom-mcp-tools/`)
   - 12 MCP tools for full CRUD + test + debug
   - n8n-skills knowledge (patterns, expressions)
   - Example system prompts

2. **n8n-mcp-tools-expert** - Rules for using MCP tools correctly
3. **n8n-workflow-patterns** - 5 standard workflow patterns
4. **n8n-expression-syntax** - n8n expression syntax guide

### Recommended Usage
When user wants to create/edit/debug n8n workflows:
1. Read `skills/n8n-custom-mcp-tools/SKILL.md`
2. Add relevant n8n-skills knowledge to context
3. Use MCP tools to manage workflows autonomously

### Setup

Set these environment variables (or store in `.n8n-api-config`):

```bash
export N8N_API_URL="https://n8n.tuongkabe.online/api/v1"
export N8N_API_KEY="your-api-key-here"
```

Generate API key: n8n Settings → n8n API → Create an API key.

### Quick Reference

All calls use header `X-N8N-API-KEY` for auth.

#### List Workflows
```bash
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/workflows" | jq '.data[] | {id, name, active}'
```

#### Get Workflow Details
```bash
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/workflows/{id}"
```

#### Activate/Deactivate Workflow
```bash
# Activate
curl -s -X PATCH -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"active": true}' "$N8N_API_URL/workflows/{id}"

# Deactivate
curl -s -X PATCH -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"active": false}' "$N8N_API_URL/workflows/{id}"
```

#### Trigger Workflow (via webhook)
```bash
# Production webhook
curl -s -X POST "$N8N_API_URL/../webhook/{webhook-path}" \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'

# Test webhook
curl -s -X POST "$N8N_API_URL/../webhook-test/{webhook-path}" \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

#### List Executions
```bash
# All recent executions
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/executions?limit=10" | jq '.data[] | {id, workflowId, status, startedAt}'

# Failed executions only
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/executions?status=error&limit=5'

# Executions for specific workflow
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/executions?workflowId={id}&limit=10"
```

#### Get Execution Details
```bash
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/executions/{id}"
```

#### Create Workflow (from JSON)
```bash
curl -s -X POST -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d @workflow.json "$N8N_API_URL/workflows"
```

#### Delete Workflow
```bash
curl -s -X DELETE -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/workflows/{id}"
```

---

## Part 2: n8n MCP Server (Query n8n docs)

Access n8n documentation via official MCP server at `https://n8n.mcp.kapa.ai/`

### MCP Endpoint
```
https://n8n.mcp.kapa.ai/
```

### What it provides:
- Query n8n documentation (nodes, features, troubleshooting)
- Get code examples and best practices
- Search error solutions

### Usage Pattern
When user asks about n8n features/nodes:
1. Query MCP server for relevant documentation
2. Use results to answer accurately with citations

### Example MCP Query
```json
{
  "query": "How to create a workflow with AI Agent and MCP client tool"
}
```

---

## Part 4: RAG Workflow Template

Build an AI agent that can search knowledge bases and answer questions.

### Workflow Structure
```
[Chat Trigger] → [AI Agent] → [MCP Client Tool] → [Response]
                          ↓
                   [LLM Chat Model]
```

### Step-by-step Setup

1. **Add Chat Trigger node**
   - Receives user questions

2. **Add AI Agent node**
   - Agent type: Tools Agent
   - System message: Define agent purpose

3. **Add LLM Chat Model node**
   - Connect to AI Agent model input
   - Use GPT-4o or Claude with tool-calling

4. **Add MCP Client Tool node**
   - Endpoint: `https://n8n.mcp.kapa.ai/`
   - Auth: None (public) or Bearer if required
   - Connect to AI Agent's tools input

5. **Optional: Add Memory node**
   - Window Buffer Memory for multi-turn conversations

### Example Use Cases

| Trigger | Purpose |
|---------|---------|
| Chat Trigger | Internal Q&A bot |
| Webhook | CRM integration |
| Schedule | Daily digest generation |
| PagerDuty | Incident response |

---

## Common Patterns

### Health Check (run periodically)
List active workflows, check recent executions for errors, report status:
```bash
# Count active workflows
ACTIVE=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/workflows?active=true" | jq '.data | length')

# Count failed executions (last 24h)
FAILED=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/executions?status=error&limit=100" | jq '[.data[] | select(.startedAt > (now - 86400 | todate))] | length')

echo "Active workflows: $ACTIVE | Failed (24h): $FAILED"
```

### Debug Failed Execution
1. List failed executions → get execution ID
2. Fetch execution details → find the failing node
3. Check node parameters and input data
4. Suggest fix based on error message

### Workflow Summary
Parse workflow JSON to summarize: trigger type, node count, apps connected, schedule.

---

## API Endpoints Reference

See [references/api-endpoints.md](references/api-endpoints.md) for complete endpoint documentation.

## Knowledge Base

### n8n-skills (from czlonkowski/n8n-skills)

Clone and use these knowledge files:
```bash
git clone https://github.com/czlonkowski/n8n-skills.git
```

**Priority files to add to System Prompt:**
1. `n8n-mcp-tools-expert/SKILL.md` - MCP tool usage rules
2. `n8n-workflow-patterns/SKILL.md` - 5 standard patterns
3. `n8n-expression-syntax/SKILL.md` - Expression syntax guide

### MCP Server for n8n Docs
- Endpoint: `https://n8n.mcp.kapa.ai/`
- Purpose: Query n8n documentation (nodes, features, troubleshooting)

## Tips
- API key has full access on non-enterprise plans
- Rate limits vary by plan (cloud) or are unlimited (self-hosted)
- Webhook URLs are separate from API URLs (no auth header needed)
- Use `?active=true` or `?active=false` to filter workflow listings
- Execution data may be pruned based on n8n retention settings
- MCP server at n8n.mcp.kapa.ai is free for querying n8n docs

## Setup

Set these environment variables (or store in `.n8n-api-config`):

```bash
export N8N_API_URL="https://n8n.tuongkabe.online/api/v1"
export N8N_API_KEY="your-api-key-here"
```

Generate API key: n8n Settings → n8n API → Create an API key.

## Quick Reference

All calls use header `X-N8N-API-KEY` for auth.

### List Workflows
```bash
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/workflows" | jq '.data[] | {id, name, active}'
```

### Get Workflow Details
```bash
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/workflows/{id}"
```

### Activate/Deactivate Workflow
```bash
# Activate
curl -s -X PATCH -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"active": true}' "$N8N_API_URL/workflows/{id}"

# Deactivate
curl -s -X PATCH -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"active": false}' "$N8N_API_URL/workflows/{id}"
```

### Trigger Workflow (via webhook)
```bash
# Production webhook
curl -s -X POST "$N8N_API_URL/../webhook/{webhook-path}" \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'

# Test webhook
curl -s -X POST "$N8N_API_URL/../webhook-test/{webhook-path}" \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

### List Executions
```bash
# All recent executions
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/executions?limit=10" | jq '.data[] | {id, workflowId, status, startedAt}'

# Failed executions only
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/executions?status=error&limit=5"

# Executions for specific workflow
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/executions?workflowId={id}&limit=10"
```

### Get Execution Details
```bash
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/executions/{id}"
```

### Create Workflow (from JSON)
```bash
curl -s -X POST -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d @workflow.json "$N8N_API_URL/workflows"
```

### Delete Workflow
```bash
curl -s -X DELETE -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/workflows/{id}"
```

## Common Patterns

### Health Check (run periodically)
List active workflows, check recent executions for errors, report status:
```bash
# Count active workflows
ACTIVE=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/workflows?active=true" | jq '.data | length')

# Count failed executions (last 24h)
FAILED=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/executions?status=error&limit=100" | jq '[.data[] | select(.startedAt > (now - 86400 | todate))] | length')

echo "Active workflows: $ACTIVE | Failed (24h): $FAILED"
```

### Debug Failed Execution
1. List failed executions → get execution ID
2. Fetch execution details → find the failing node
3. Check node parameters and input data
4. Suggest fix based on error message

### Workflow Summary
Parse workflow JSON to summarize: trigger type, node count, apps connected, schedule.

## API Endpoints Reference

See [references/api-endpoints.md](references/api-endpoints.md) for complete endpoint documentation.

## Tips
- API key has full access on non-enterprise plans
- Rate limits vary by plan (cloud) or are unlimited (self-hosted)
- Webhook URLs are separate from API URLs (no auth header needed)
- Use `?active=true` or `?active=false` to filter workflow listings
- Execution data may be pruned based on n8n retention settings
