# Contract: [Service / Component Name]

> **Provider**: [Name of the providing service/team]
> **Consumer**: [Name of the consuming service/team]
> **Version**: 1.0.0
> **Swagger / OpenAPI**: [Optional link to Swagger UI, Postman or API Docs]
> **Postman Collection**: [Optional link or export path]
> **Status**: [Draft / Active / Deprecated]

## 1. Overview
[Brief description of what this contract covers. Example: "REST API for User Authentication" or "Event schema for OrderCreated"]

## 2. Endpoints / Interfaces

### `[GET/POST] /api/v1/resource`
[Description of the endpoint]

**Request:**
```json
{
  "field": "type - description"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {}
}
```

**Consumer Guidance (Frontend / Client):**
- **Mock Data**: Use sample response above for offline development / Mock Service Worker (MSW).
- **UI States to handle**:
  - *Loading*: skeleton or spinner while request is in flight.
  - *Empty*: UI display when data is empty or null (`[]` / `{}`).
  - *Error*: map HTTP error codes (Section 4) to user-friendly messages.

## 3. Data Models (Schemas)

### `ResourceObject`
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Unique identifier |
| `name` | string | Yes | Display name |

## 4. Error Handling
| Code | Error Message | Reason |
|---|---|---|
| `400` | `INVALID_INPUT` | The provided schema failed validation |
| `401` | `UNAUTHORIZED` | Missing or invalid token |

## 5. Change Log
- **YYYY-MM-DD**: Initial draft
