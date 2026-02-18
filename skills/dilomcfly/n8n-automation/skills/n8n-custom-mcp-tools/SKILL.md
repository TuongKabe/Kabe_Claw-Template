---
name: n8n-custom-mcp-tools
description: Full CRUD + Test + Debug tools for n8n via n8n-custom-mcp MCP Server. Access to create, update, delete workflows, trigger webhooks (test mode), and debug executions. Plus n8n-skills knowledge for AI agent expertise.
---

# n8n-custom-mcp Tools + n8n-skills Knowledge

## Overview

12 MCP tools for comprehensive n8n management via `n8n-custom-mcp` server. AI agent can **create, edit, test, and debug workflows autonomously** - no manual browser access needed.

**Prerequisites:**
- n8n-custom-mcp server running at `http://host:3000/mcp`
- n8n API Key configured in MCP server

---

## MCP Tools Reference

### Group 1: Workflow CRUD

#### list_workflows
List all workflows in n8n instance.
```json
{}
```
Returns: Array of workflows with id, name, active status.

#### get_workflow
Get detailed JSON of a workflow (nodes, connections).
```json
{
  "workflow_id": "123"
}
```

#### create_workflow
Create new workflow from JSON.
```json
{
  "name": "Workflow Name",
  "nodes": [...],
  "connections": {...}
}
```

#### update_workflow
Edit workflow (rename, add/remove nodes, update parameters).
```json
{
  "workflow_id": "123",
  "name": "New Name",
  "nodes": [...],
  "connections": {...}
}
```

#### delete_workflow
Delete workflow by ID.
```json
{
  "workflow_id": "123"
}
```

#### activate_workflow
Activate or deactivate a workflow.
```json
{
  "workflow_id": "123",
  "activate": true
}
```

### Group 2: Execution

#### execute_workflow
Execute workflow by ID (triggers without webhook).
```json
{
  "workflow_id": "123"
}
```

#### trigger_webhook
Trigger webhook with optional test mode.
```json
{
  "webhook_path": "my-webhook",
  "method": "POST",
  "test_mode": true,
  "body": {
    "key": "value"
  }
}
```

### Group 3: Monitoring

#### list_executions
List execution history with optional status filter.
```json
{
  "limit": 10,
  "status": "success" // optional: "success", "error", "running"
}
```

#### get_execution
Get detailed execution data (input/output/error for each node).
```json
{
  "execution_id": "abc123"
}
```

### Group 4: Discovery

#### list_node_types
List all node types installed on n8n instance.
```json
{}
```

---

## n8n-skills Knowledge

Add these to System Prompt for AI agent expertise.

### n8n-mcp-tools-expert (Priority 1)

```markdown
# n8n MCP Tools Expert

You have full CRUD access to n8n via MCP tools.

## Critical Rules

1. **Webhook Data Access**
   - Data is ALWAYS under `$json.body`
   - CORRECT: {{ $json.body.email }}
   - WRONG: {{ $json.email }}

2. **Create → Test → Debug Loop**
   - create_workflow → activate_workflow
   - trigger_webhook (test_mode: true)
   - list_executions → get_execution
   - If error → update_workflow → repeat

3. **Execution IDs**
   - list_executions returns execution IDs
   - Use get_execution for debugging
   - Execution data may be pruned after retention period
```

### n8n-workflow-patterns (Priority 2)

```markdown
# n8n Workflow Patterns

## Pattern 1: Webhook Processing
Webhook → Process → Respond to Webhook

## Pattern 2: HTTP API
Trigger → HTTP Request → Transform → Output

## Pattern 3: Database
Trigger → Query → Transform → Store

## Pattern 4: AI Agent
Trigger → AI Agent (tools) → Output

## Pattern 5: Scheduled
Schedule → Fetch → Process → Report
```

### n8n-expression-syntax (Priority 3)

```markdown
# n8n Expression Syntax

## Data Access
- $json.field ← Direct field
- $json.body.field ← Webhook payload
- $input.all[].json.field ← Previous node output

## Code Node (JavaScript)
- Return format: [{json: {...}}]
- Use JavaScript for 95% cases
- Python in n8n has NO external libraries

## Common Operations
- String: {{ $json.name.toUpperCase() }}
- Math: {{ $json.price * 1.1 }}
- Date: {{ new Date().toISOString() }}
```

---

## Example System Prompt

```markdown
# You are an n8n Expert

You have full access to n8n via MCP Server with 12 tools for CRUD, testing, and debugging.

## Workflow Patterns
1. Webhook Processing: Webhook → Process → Respond
2. HTTP API: Trigger → HTTP → Transform → Output
3. Database: Trigger → Query → Transform → Store
4. AI Agent: Trigger → AI Agent → Output
5. Scheduled: Schedule → Fetch → Process → Report

## Rules
- Webhook data: $json.body (NOT $json)
- Code node: return [{json: {...}}]
- Test first: trigger_webhook with test_mode: true
- Debug: get_execution → read error → update_workflow

## Workflow
1. create_workflow → 2. activate_workflow
3. trigger_webhook (test) → 4. list_executions
5. get_execution → 6. If error → update_workflow
7. Repeat until success
```

---

## Usage Examples

### Create & Test Webhook Workflow
```
User: "Create webhook workflow that receives POST, extracts email, saves to Set node"

AI: {
  "name": "Email Webhook Handler",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": { "path": "email-callback", "httpMethod": "POST" },
      "position": [250, 300]
    },
    {
      "name": "Extract Email",
      "type": "n8n-nodes-base.set",
      "parameters": {
        "values": {
          "string": [
            { "name": "subject", "value": "={{ $json.body.subject }}" },
            { "name": "sender", "value": "={{ $json.body.sender }}" }
          ]
        }
      },
      "position": [450, 300]
    }
  ],
  "connections": {
    "Webhook": { "main": [[{ "node": "Extract Email", "type": "main", "index": 0 }]] }
  }
}
→ create_workflow

→ activate_workflow

→ trigger_webhook({
  "webhook_path": "email-callback",
  "method": "POST",
  "test_mode": true,
  "body": { "subject": "Hello", "sender": "test@example.com" }
})

→ list_executions → get_execution
→ "Workflow executed successfully! Email extracted correctly."
```

### Debug Failed Execution
```
→ list_executions({ "status": "error", "limit": 5 })
→ get_execution({ "execution_id": "abc123" })
→ { error: "Cannot read property 'body' of undefined" }
→ update_workflow({
  "workflow_id": "123",
  "nodes": [
    {
      "name": "Webhook",
      "parameters": { "path": "email-callback", "httpMethod": "POST" }
    },
    {
      "name": "Set",
      "parameters": {
        "values": {
          "string": [
            { "name": "subject", "value": "={{ $json.body.subject }}" }
          ]
        }
      }
    }
  ]
})
→ trigger_webhook({ "test_mode": true, ... })
→ Success!
```

---

## MCP Server Setup

### Via Docker Compose
```yaml
services:
  n8n-mcp:
    build: ./n8n-custom-mcp
    ports:
      - "3000:3000"
    environment:
      - N8N_HOST=http://n8n:5678
      - N8N_API_KEY=${N8N_API_KEY}
    command: >
      --stdio "node dist/index.js"
      --port 3000
      --outputTransport streamableHttp
      --streamableHttpPath /mcp
      --cors
```

### Connect to OpenClaw
- Type: MCP (Streamable HTTP)
- URL: `http://host:3000/mcp`
