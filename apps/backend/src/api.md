# AgentLens API

Base URL:

http://localhost:5000

---

# Authentication

## Signup

POST /api/auth/signup

### Body

{
  "name": "Souvik",
  "email": "souvik@example.com",
  "password": "password123"
}

---

## Login

POST /api/auth/login

### Body

{
  "email": "souvik@example.com",
  "password": "password123"
}

### Response

{
  "token": "JWT_TOKEN"
}

Use the JWT for dashboard/user endpoints:

Authorization: Bearer JWT_TOKEN

---

# Projects

## Create Project

POST /api/projects

Authorization: Bearer JWT_TOKEN

### Body

{
  "name": "AI Support Agent"
}

---

## Get Projects

GET /api/projects

Authorization: Bearer JWT_TOKEN

---

## Get Project Overview

GET /api/projects/:id/overview

Authorization: Bearer JWT_TOKEN

Returns:

- project information
- event statistics
- recent events
- recent errors
- token usage
- cost

---

# API Keys

API keys are used by applications sending telemetry to AgentLens.

## Create API Key

POST /api/projects/:id/keys

Authorization: Bearer JWT_TOKEN

### Body

{
  "name": "Development"
}

The API key is shown when it is created.

Store it securely.

---

## Get API Keys

GET /api/projects/:id/keys

Authorization: Bearer JWT_TOKEN

---

## Delete API Key

DELETE /api/projects/:id/keys/:keyId

Authorization: Bearer JWT_TOKEN

---

# Telemetry

## Ingest Event

POST /api/ingest

Authorization: Bearer AGENTLENS_API_KEY

Content-Type: application/json

### Example

{
  "name": "llm.request",
  "type": "llm",
  "traceId": "trace_001",
  "spanId": "span_001",
  "status": "success",
  "duration": 842,
  "model": "gpt-5",
  "inputTokens": 120,
  "outputTokens": 80,
  "cost": 0.0042,
  "payload": {
    "temperature": 0.7
  }
}

---

# Events

## List Events

GET /api/projects/:id/events

Authorization: Bearer JWT_TOKEN

### Pagination

GET /api/projects/:id/events?page=1&limit=20

### Filter by status

GET /api/projects/:id/events?status=error

### Filter by type

GET /api/projects/:id/events?type=llm

### Filter by date

GET /api/projects/:id/events?from=2026-08-20&to=2026-08-23

### Combined

GET /api/projects/:id/events?status=error&type=llm&page=1&limit=20

---

## Get Event

GET /api/projects/:id/events/:eventId

Authorization: Bearer JWT_TOKEN

---

# Analytics

## Project Statistics

GET /api/projects/:id/stats

Authorization: Bearer JWT_TOKEN

Returns:

- total events
- successful events
- errors
- success rate
- error rate
- average latency
- input tokens
- output tokens
- total tokens
- total cost

---

## Project Errors

GET /api/projects/:id/errors

Authorization: Bearer JWT_TOKEN

---

## Project Cost

GET /api/projects/:id/cost

Authorization: Bearer JWT_TOKEN

Returns:

- total cost
- input tokens
- output tokens
- total tokens
- requests
- cost by model

---

# Traces

## List Traces

GET /api/projects/:id/traces

Authorization: Bearer JWT_TOKEN

---

## Get Trace

GET /api/projects/:id/traces/:traceId

Authorization: Bearer JWT_TOKEN

---

# AI

## Analyze Event

POST /api/projects/:id/events/:eventId/analyze

Authorization: Bearer AGENTLENS_API_KEY

The endpoint sends the event to OpenRouter for AI analysis.

### Response

{
  "analysis": {
    "summary": "...",
    "rootCause": "...",
    "impact": "...",
    "recommendation": "...",
    "severity": "high"
  }
}

---

## Get Event Analysis

GET /api/projects/:id/events/:eventId/analysis

Authorization: Bearer AGENTLENS_API_KEY

Returns the previously saved AI analysis.

---

# Health

## Health Check

GET /api/health

No authentication required.

### Response

{
  "status": "ok",
  "service": "AgentLens API",
  "database": "connected"
}