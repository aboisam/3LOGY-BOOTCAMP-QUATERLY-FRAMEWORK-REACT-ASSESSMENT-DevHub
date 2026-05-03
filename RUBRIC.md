# DevShelf Assessment — Grading Rubric 📊

**Total: 100 points** | **Pass: 60 points** | **Distinction: 85+ points**

---

## Sprint 1 — Authentication & Routing (40 points)

### 1.1 API Service Layer (8 points)

| Criteria | Points | What We Look For |
|----------|--------|------------------|
| Axios instance with `baseURL` from env variable | 2 | Uses `import.meta.env.VITE_API_URL`, not hardcoded URL |
| Request interceptor attaches JWT token | 3 | Token read from `localStorage`, attached as `Bearer <token>` |
| Auth service functions work correctly | 3 | `login()`, `register()`, `logout()`, `getToken()`, `getProfile()` all functional |

### 1.2 Auth Context (10 points)

| Criteria | Points | What We Look For |
|----------|--------|------------------|
| Context created with `createContext()` | 1 | Proper context + provider pattern |
| State managed with `useState` | 2 | `user`, `isLoading`, `error` state variables |
| Session restored with `useEffect` on mount | 3 | Checks for token, fetches profile, handles expired tokens |
| `login()`, `register()`, `logout()` functions work | 3 | Proper state updates after each action |
| `isAuthenticated` derived from user state | 1 | Boolean derived from `!!user.id` |

### 1.3 Login & Register Pages (12 points)

| Criteria | Points | What We Look For |
|----------|--------|------------------|
| Controlled inputs with `useState` | 3 | Each input value tied to state, `onChange` updates state |
| Form validation (required fields) | 2 | Prevents submission with empty fields, shows error messages |
| Form submission calls auth context | 2 | `handleSubmit` calls `login()` or `register()` |
| Error handling and display | 2 | API errors shown to user (inline or toast) |
| Navigation after success | 2 | Login → `/dashboard`, Register → `/login` |
| Loading state on submit button | 1 | Button disabled + text changes during API call |

### 1.4 Protected Routes & Navigation (10 points)

| Criteria | Points | What We Look For |
|----------|--------|------------------|
| `ProtectedRoute` component works | 3 | Redirects to `/login` if not authenticated, shows loading if checking |
| Routes configured correctly in `App.jsx` | 3 | Public routes (login, register) and protected routes (dashboard, snippets, etc.) |
| Navbar conditional rendering | 3 | Shows different links for logged-in vs logged-out users |
| `AuthProvider` wraps the app | 1 | Provider at the top level, context accessible everywhere |

---

## Sprint 2 — Snippets CRUD (25 points)

### 2.1 Data Fetching & Display (10 points)

| Criteria | Points | What We Look For |
|----------|--------|------------------|
| Snippet service with CRUD functions | 2 | `getAll()`, `getById()`, `create()`, `update()`, `remove()` |
| `useEffect` fetches snippets on mount | 3 | Correct dependency array `[]`, loading/error states handled |
| Snippets rendered with `.map()` + `key` prop | 3 | Uses unique `key` (snippet ID), renders card components |
| Loading, error, and empty states | 2 | All three states handled with appropriate UI |

### 2.2 Snippet Card Component (5 points)

| Criteria | Points | What We Look For |
|----------|--------|------------------|
| Receives data via props | 2 | `snippet`, `onEdit`, `onDelete` props used correctly |
| Displays snippet information | 1 | Title, language, description, code preview |
| Edit and Delete buttons call prop functions | 2 | `onClick` handlers call the callback props |

### 2.3 Snippet Form (5 points)

| Criteria | Points | What We Look For |
|----------|--------|------------------|
| Controlled inputs for all fields | 2 | `value` and `onChange` on every input |
| Form validation | 1 | Required fields checked before submit |
| Handles both create and edit modes | 2 | Pre-fills data when editing, clears when creating |

### 2.4 State Updates (5 points)

| Criteria | Points | What We Look For |
|----------|--------|------------------|
| Create: new snippet added to state immutably | 2 | Uses spread or concat, doesn't mutate the array |
| Update: snippet updated in state immutably | 1 | Uses `.map()` to replace the updated item |
| Delete: snippet removed from state immutably | 2 | Uses `.filter()` to remove the item |

---

## Sprint 3 — Resources & Tasks (20 points)

### 3.1 Resources (10 points)

| Criteria | Points | What We Look For |
|----------|--------|------------------|
| Resource service file | 1 | CRUD functions following snippet service pattern |
| Resources page with fetch + display | 3 | `useEffect`, `.map()`, loading/error/empty states |
| Resource card component | 2 | Props-based, displays title, URL, type, notes |
| Resource form with validation | 2 | Controlled inputs, type dropdown, required fields |
| CRUD operations work end-to-end | 2 | Can create, view, edit, and delete resources |

### 3.2 Tasks (10 points)

| Criteria | Points | What We Look For |
|----------|--------|------------------|
| Task service file (with `updateStatus`) | 2 | CRUD + PATCH status function |
| Tasks page with fetch + display | 2 | `useEffect`, `.map()`, loading/error/empty states |
| Task card with status toggle | 2 | Can change status without opening edit form |
| Task form with validation | 2 | Status/priority dropdowns, date input |
| Status filtering | 2 | Can filter tasks by "All", "Todo", "In Progress", "Done" |

---

## Sprint 4 — Dashboard & Polish (15 points)

### 4.1 Dashboard Page (5 points)

| Criteria | Points | What We Look For |
|----------|--------|------------------|
| Fetches stats from dashboard API | 2 | `useEffect` + `useState` for stats data |
| Displays totals and task breakdown | 2 | Snippet count, resource count, task counts by status |
| Shows recent items | 1 | Last 5 items rendered in a list |

### 4.2 UI Polish (5 points)

| Criteria | Points | What We Look For |
|----------|--------|------------------|
| Consistent styling across pages | 2 | Tailwind classes used consistently, good spacing |
| Toast notifications for actions | 1 | Success/error toasts for create, update, delete |
| Loading spinners (not just text) | 1 | Visual spinner component, not just "Loading..." |
| Proper empty states | 1 | Helpful messages when no data exists |

### 4.3 Bonus Features (5 points)

| Criteria | Points | What We Look For |
|----------|--------|------------------|
| Dark/light mode toggle | 2 | Toggle works, preference saved to `localStorage`, restored on load |
| `React.memo()` on card components | 1 | Applied correctly with explanation comment |
| Deployed to Netlify/Vercel | 2 | Working deployed URL, `_redirects` file for SPA routing |

---

## Code Quality Deductions

These deductions apply across all sprints:

| Issue | Deduction | Description |
|-------|-----------|-------------|
| Console errors | -1 each | Unhandled errors or warnings in browser console (max -5) |
| Unused imports | -0.5 each | Imported but never used (max -3) |
| Hardcoded API URLs | -2 | Not using environment variable |
| Array index as key | -2 | Using `.map((item, index) => <Comp key={index}>` instead of `key={item.id}` |
| Direct state mutation | -3 | `state.push()`, `state.splice()`, or modifying state objects directly |
| Missing error handling | -2 | API calls without try/catch or .catch() |
| Code duplication | -2 | Same logic copy-pasted instead of extracted to shared function/component |

---

## React Topics Coverage

This rubric assesses all topics covered in the bootcamp:

| Topic | Where It's Tested | Sprint |
|-------|-------------------|--------|
| JSX syntax and rules | All components | 1-4 |
| Functional components | All components | 1-4 |
| Props (passing data) | Card + Form components | 2-3 |
| Component composition | Layout, ProtectedRoute, App | 1, 4 |
| Conditional rendering | Auth states, loading, errors, empty | 1-4 |
| Rendering lists with `.map()` + key | Snippets, Resources, Tasks pages | 2-3 |
| `useState` hook | Forms, page state, toggles | 1-4 |
| State vs props | Cards (props) vs Pages (state) | 2-3 |
| Immutable updates | CRUD state management | 2-3 |
| Event handling | Forms, buttons, navigation | 1-4 |
| `useEffect` hook | Data fetching, session restore | 1-4 |
| useEffect dependencies | Detail page `[id]`, mount `[]` | 2 |
| Cleanup functions | AbortController (bonus) | 2 |
| API integration with fetch/axios | All service files | 1-3 |
| Controlled inputs | All form components | 1-3 |
| Form validation | Login, Register, all entity forms | 1-3 |
| Error handling | API errors, form errors | 1-4 |
| React Router | Routes, NavLink, useParams, Navigate | 1-2 |
| Context API | AuthContext | 1 |
| React.memo() | Card components (bonus) | 4 |
| Deployment | Netlify/Vercel (bonus) | 4 |
| Environment variables | VITE_API_URL | 1 |

---

## Grading Summary

| Grade | Points | Description |
|-------|--------|-------------|
| **Distinction** | 85–100 | All sprints complete, polished UI, bonus features |
| **Merit** | 70–84 | Sprints 1-3 complete, good code quality |
| **Pass** | 60–69 | Sprint 1 + most of Sprint 2 working |
| **Fail** | Below 60 | Significant features missing or non-functional |

---

**Assessed by:** _________________________ **Date:** _____________

**Student name:** _________________________ **Score:** ______ / 100
