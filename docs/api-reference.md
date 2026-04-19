# API Reference

Updated on 2026-04-19.

## Base URLs

- Unversioned API: `/api`
- Version 1 API: `/api/v1`
- Version 2 API: `/api/v2`

## Authentication

Most endpoints require a bearer token:

```
Authorization: Bearer <access_token>
```

Auth endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

## Core Endpoint Groups

### Claims

- `POST /api/claims` - create claim
- `POST /api/claims/upload` - upload a document and create claim record
- `GET /api/claims` - list claims with paging
- `GET /api/claims/{claim_id}` - claim detail
- `PATCH /api/claims/{claim_id}` - status/priority update
- `DELETE /api/claims/{claim_id}` - delete claim

Bulk claim operations:

- `POST /api/claims/bulk/approve`
- `POST /api/claims/bulk/assign`
- `POST /api/claims/bulk/export`
- `POST /api/claims/bulk/update-status`

### Assignments

- `GET /api/assignments`
- `POST /api/assignments/auto`
- `POST /api/assignments/manual`
- `PATCH /api/assignments/{assignment_id}/reassign`
- `PATCH /api/assignments/{assignment_id}/status`

### Comments

- `GET /api/comments?claim_id={id}`
- `POST /api/comments`
- `PATCH /api/comments/{comment_id}`
- `DELETE /api/comments/{comment_id}`

### Tags

- `GET /api/tags`
- `POST /api/tags`
- `PATCH /api/tags/{tag_id}`
- `POST /api/tags/assign`
- `GET /api/tags/claims/{claim_id}`
- `GET /api/tags/analytics`

### Templates

- `GET /api/templates`
- `POST /api/templates`
- `PATCH /api/templates/{template_id}`
- `POST /api/templates/create-claim`

### Documents

- `POST /api/claims/{claim_id}/documents`
- `GET /api/documents/signed-url?key={storage_key}`

### Policies

- `POST /api/policies/analyze`
- `POST /api/policies/ingest`

## Versioning Headers

Versioned endpoints automatically return:

- `API-Version`
- `API-Deprecated`
- `API-Sunset-Date` (when deprecation is scheduled)

## Common Error Format

```json
{
	"success": false,
	"data": null,
	"error": {
		"code": "http_404",
		"message": "Claim not found",
		"details": null
	},
	"meta": {}
}
```

## Interactive Documentation

- Swagger UI: `/docs`
- ReDoc: `/redoc`
- OpenAPI Spec: `/openapi.json`
