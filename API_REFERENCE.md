# DevShelf API Reference 📡

> **Base URL:** `https://localhost:7001`
>
> All endpoints under `/api/` that require authentication expect a `Bearer` token in the `Authorization` header.

---

## Table of Contents

- [Authentication](#authentication)
- [Profile](#profile)
- [Snippets](#snippets)
- [Resources](#resources)
- [Tasks](#tasks)
- [Dashboard](#dashboard)

---

## Authentication

### POST `/api/auth/register`

Create a new user account.

**Auth Required:** No

**Request Body:**
```json
{
  "userName": "johndoe",
  "email": "john@example.com",
  "password": "MyPassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Registration successful"
}
```

**Error Response (400):**
```json
{
  "error": "Email already taken"
}
```

---

### POST `/api/auth/login`

Log in and receive a JWT token.

**Auth Required:** No

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "MyPassword123"
}
```

**Success Response (200):**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "userName": "johndoe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400):**
```json
{
  "error": "Invalid email or password"
}
```

> **💡 Important:** Save the `token` from the login response. You need it for all protected endpoints. Send it as: `Authorization: Bearer <token>`

---

## Profile

### GET `/api/profile`

Get the authenticated user's profile information.

**Auth Required:** Yes (Bearer token)

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Success Response (200):**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "userName": "johndoe",
  "email": "john@example.com",
  "fetchedAt": "2026-05-02T10:30:00Z"
}
```

**Error Response (401):**
```json
{
  "error": "Invalid token: missing required claims"
}
```

---

## Snippets

All snippet endpoints require authentication. Each user can only see/edit/delete their own snippets.

### GET `/api/snippets`

Get all snippets for the logged-in user.

**Auth Required:** Yes

**Success Response (200):**
```json
[
  {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "React useEffect Cleanup",
    "description": "How to clean up subscriptions in useEffect",
    "code": "useEffect(() => {\n  const controller = new AbortController();\n  fetch(url, { signal: controller.signal });\n  return () => controller.abort();\n}, [url]);",
    "language": "javascript",
    "tags": "react,hooks,useEffect",
    "createdAt": "2026-05-01T14:30:00Z",
    "updatedAt": "2026-05-01T14:30:00Z"
  }
]
```

> Returns an empty array `[]` if the user has no snippets.

---

### GET `/api/snippets/{id}`

Get a single snippet by ID.

**Auth Required:** Yes

**Success Response (200):**
```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "title": "React useEffect Cleanup",
  "description": "How to clean up subscriptions in useEffect",
  "code": "useEffect(() => {\n  const controller = new AbortController();\n  fetch(url, { signal: controller.signal });\n  return () => controller.abort();\n}, [url]);",
  "language": "javascript",
  "tags": "react,hooks,useEffect",
  "createdAt": "2026-05-01T14:30:00Z",
  "updatedAt": "2026-05-01T14:30:00Z"
}
```

**Error Response (404):**
```json
{
  "error": "Snippet not found"
}
```

---

### POST `/api/snippets`

Create a new snippet.

**Auth Required:** Yes

**Request Body:**
```json
{
  "title": "Array Destructuring",
  "description": "ES6 array destructuring example",
  "code": "const [first, second, ...rest] = [1, 2, 3, 4, 5];",
  "language": "javascript",
  "tags": "es6,destructuring"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | string | ✅ | Snippet title |
| description | string | ❌ | Optional description |
| code | string | ✅ | The actual code |
| language | string | ✅ | Programming language |
| tags | string | ❌ | Comma-separated tags |

**Success Response (201):**
```json
{
  "id": "new-uuid-here",
  "title": "Array Destructuring",
  "description": "ES6 array destructuring example",
  "code": "const [first, second, ...rest] = [1, 2, 3, 4, 5];",
  "language": "javascript",
  "tags": "es6,destructuring",
  "createdAt": "2026-05-02T10:00:00Z",
  "updatedAt": "2026-05-02T10:00:00Z"
}
```

---

### PUT `/api/snippets/{id}`

Update an existing snippet.

**Auth Required:** Yes

**Request Body:** Same shape as POST (all fields required in body)

```json
{
  "title": "Array Destructuring (Updated)",
  "description": "ES6 array destructuring with defaults",
  "code": "const [first = 0, second = 0] = [];",
  "language": "javascript",
  "tags": "es6,destructuring,defaults"
}
```

**Success Response (200):** Returns the updated snippet object.

**Error Response (404):**
```json
{
  "error": "Snippet not found"
}
```

---

### DELETE `/api/snippets/{id}`

Delete a snippet.

**Auth Required:** Yes

**Success Response (200):**
```json
{
  "message": "Snippet deleted successfully"
}
```

**Error Response (404):**
```json
{
  "error": "Snippet not found"
}
```

---

## Resources

All resource endpoints require authentication. Each user can only see/edit/delete their own resources.

### GET `/api/resources`

Get all resources for the logged-in user.

**Auth Required:** Yes

**Success Response (200):**
```json
[
  {
    "id": "uuid-here",
    "title": "React Documentation",
    "url": "https://react.dev",
    "notes": "Official React docs — great for hooks reference",
    "type": "docs",
    "tags": "react,documentation,official",
    "createdAt": "2026-05-01T09:00:00Z"
  }
]
```

---

### GET `/api/resources/{id}`

Get a single resource by ID.

**Auth Required:** Yes

**Success Response (200):** Single resource object.

**Error Response (404):**
```json
{
  "error": "Resource not found"
}
```

---

### POST `/api/resources`

Create a new resource.

**Auth Required:** Yes

**Request Body:**
```json
{
  "title": "MDN Web Docs",
  "url": "https://developer.mozilla.org",
  "notes": "Best reference for vanilla JS and Web APIs",
  "type": "docs",
  "tags": "javascript,reference,mdn"
}
```

| Field | Type | Required | Valid Values |
|-------|------|----------|-------------|
| title | string | ✅ | Resource title |
| url | string | ✅ | Full URL |
| notes | string | ❌ | Optional notes |
| type | string | ✅ | `article`, `video`, `tool`, `docs`, `other` |
| tags | string | ❌ | Comma-separated tags |

**Success Response (201):** Returns the created resource object.

---

### PUT `/api/resources/{id}`

Update an existing resource.

**Auth Required:** Yes

**Request Body:** Same shape as POST.

**Success Response (200):** Returns the updated resource object.

**Error Response (404):**
```json
{
  "error": "Resource not found"
}
```

---

### DELETE `/api/resources/{id}`

Delete a resource.

**Auth Required:** Yes

**Success Response (200):**
```json
{
  "message": "Resource deleted successfully"
}
```

---

## Tasks

All task endpoints require authentication. Each user can only see/edit/delete their own tasks.

### GET `/api/tasks`

Get all tasks for the logged-in user.

**Auth Required:** Yes

**Success Response (200):**
```json
[
  {
    "id": "uuid-here",
    "title": "Build login page",
    "description": "Create a login form with email and password fields",
    "status": "in-progress",
    "priority": "high",
    "project": "DevShelf",
    "dueDate": "2026-05-10T00:00:00Z",
    "createdAt": "2026-05-01T08:00:00Z",
    "updatedAt": "2026-05-02T14:30:00Z"
  }
]
```

---

### GET `/api/tasks/{id}`

Get a single task by ID.

**Auth Required:** Yes

**Success Response (200):** Single task object.

**Error Response (404):**
```json
{
  "error": "Task not found"
}
```

---

### POST `/api/tasks`

Create a new task.

**Auth Required:** Yes

**Request Body:**
```json
{
  "title": "Implement snippet form",
  "description": "Create a controlled form for adding new code snippets",
  "status": "todo",
  "priority": "high",
  "project": "DevShelf",
  "dueDate": "2026-05-15T00:00:00Z"
}
```

| Field | Type | Required | Valid Values |
|-------|------|----------|-------------|
| title | string | ✅ | Task title |
| description | string | ❌ | Task description |
| status | string | ❌ | `todo` (default), `in-progress`, `done` |
| priority | string | ❌ | `low`, `medium` (default), `high` |
| project | string | ❌ | Project name |
| dueDate | datetime | ❌ | ISO 8601 format or null |

**Success Response (201):** Returns the created task object.

---

### PUT `/api/tasks/{id}`

Update a task (all fields).

**Auth Required:** Yes

**Request Body:** Same shape as POST.

**Success Response (200):** Returns the updated task object.

---

### PATCH `/api/tasks/{id}/status`

Quick status update — change only the status of a task.

**Auth Required:** Yes

**Request Body:**
```json
{
  "status": "done"
}
```

| Field | Type | Required | Valid Values |
|-------|------|----------|-------------|
| status | string | ✅ | `todo`, `in-progress`, `done` |

**Success Response (200):**
```json
{
  "id": "uuid-here",
  "title": "Build login page",
  "status": "done",
  "updatedAt": "2026-05-02T16:00:00Z"
}
```

**Error Response (400):**
```json
{
  "error": "Invalid status. Must be: todo, in-progress, or done"
}
```

---

### DELETE `/api/tasks/{id}`

Delete a task.

**Auth Required:** Yes

**Success Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

---

## Dashboard

### GET `/api/dashboard/stats`

Get summary statistics and recent items for the logged-in user.

**Auth Required:** Yes

**Success Response (200):**
```json
{
  "totals": {
    "snippets": 12,
    "resources": 8,
    "tasks": 15
  },
  "tasksByStatus": {
    "todo": 5,
    "inProgress": 4,
    "done": 6
  },
  "recent": {
    "snippets": [
      {
        "id": "uuid",
        "title": "useEffect Cleanup",
        "language": "javascript",
        "createdAt": "2026-05-02T10:00:00Z"
      }
    ],
    "resources": [
      {
        "id": "uuid",
        "title": "React Docs",
        "type": "docs",
        "createdAt": "2026-05-01T09:00:00Z"
      }
    ],
    "tasks": [
      {
        "id": "uuid",
        "title": "Build login page",
        "status": "in-progress",
        "priority": "high",
        "createdAt": "2026-05-01T08:00:00Z"
      }
    ]
  }
}
```

> **Note:** Recent items return the 5 most recently created items in each category.

---

## Error Handling

All endpoints follow a consistent error format:

| Status Code | Meaning | When It Happens |
|-------------|---------|-----------------|
| `200` | OK | Request succeeded |
| `201` | Created | New resource created (POST) |
| `400` | Bad Request | Invalid input data |
| `401` | Unauthorized | Missing or invalid JWT token |
| `404` | Not Found | Resource doesn't exist or belongs to another user |

**Error Response Format:**
```json
{
  "error": "Human-readable error message"
}
```

---

## How to Use the Authorization Header

After logging in, you receive a JWT token. Include it in every request to protected endpoints:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIi...
```

In Axios (JavaScript):
```javascript
// Option 1: Per request
axios.get('/api/snippets', {
  headers: { Authorization: `Bearer ${token}` }
});

// Option 2: Axios interceptor (recommended)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
