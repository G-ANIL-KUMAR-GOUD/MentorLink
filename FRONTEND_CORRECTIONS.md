# Frontend Corrections & Workarounds

**Date**: February 20, 2026  
**Status**: ✅ Frontend corrected to handle incomplete backend gracefully

## Summary

The frontend has been updated with defensive programming patterns and fallback logic to gracefully handle the incomplete backend. This allows the application to function with limited backend functionality while providing clear error messages about what still needs to be implemented.

---

## Changes Made

### 1. **API Client Improvements** (`src/utils/api.ts`)

#### What Was Fixed:

- Added better error messages for CORS issues
- Added helpful diagnostics when backend is unreachable
- Clarifies difference between connection errors and 404 errors

#### New Error Messages Show:

```
Failed to reach backend at http://localhost:8080/api

Possible causes:
1. Backend server is not running
2. CORS is not configured (check SecurityConfig.java)
3. Backend port is wrong (check VITE_API_URL)
```

**Impact**: Users now get actionable error messages instead of cryptic "Failed to fetch" errors.

---

### 2. **Auth Service Improvements** (`src/utils/authService.ts`)

#### What Was Fixed:

- Added helpful error message for signup endpoint (not yet implemented)
- Better CORS error handling for login
- Ensures email field is always populated from request if not in response

#### Signup Error Message:

```
Signup endpoint not yet implemented on backend.

Backend must create: POST /api/auth/signup
Backend developer: See documentation for required fields.
```

**Impact**: Clear feedback when signup endpoint is missing, with instructions for backend developer.

---

### 3. **Mentee Service Fallbacks** (`src/utils/menteeService.ts`)

#### What Was Fixed:

**getCurrentMenteeProfile()**

- Tries `/api/mentees/profile` first (primary endpoint)
- Falls back to `/api/users/profile` if 404
- Returns properly formatted data even if response format is wrong
- Uses auth context user data as last resort

**updateMenteeProfile()**

- Tries `/api/mentees/{id}` first
- Falls back to `/api/users/{id}` if 404
- Transforms response to match expected DTO format

**getAssignedMentors()**

- Logs warning when endpoint not found
- Returns empty array instead of crashing
- Allows UI to show "No mentors assigned" message

#### New Endpoints Supported:

```typescript
// Primary (preferred)
GET / api / mentees / profile;

// Fallback alternatives
GET / api / users / profile; // For current user profile
GET / api / users / { id }; // For user updates
```

**Impact**: Dashboard can display partial data even with incomplete backend.

---

### 4. **Mentor Service Fallbacks** (`src/utils/mentorService.ts`)

#### What Was Fixed:

**getCurrentMentorProfile()**

- Tries `/api/mentors/profile` first
- Falls back to `/api/users/profile`
- Returns default values for missing fields (averageRating: 0, menteeCount: 0)

**updateMentorProfile()**

- Tries `/api/mentors/{id}` first
- Falls back to `/api/users/{id}`
- Preserves request data in response even if backend updates partially

#### Impact\*\*: Mentor dashboard loads and functions with fallback data.

---

### 5. **Task Service Transformations** (`src/utils/taskService.ts`)

#### What Was Fixed:

**Task Response Transformation**
The backend Task model is missing `title` and `progress` fields. Added automatic transformation:

```typescript
// Backend returns:
{
  id: 1,
  description: "Learn React",
  status: "IN_PROGRESS",
  createdAt: "2024-10-15"
}

// Frontend transforms to:
{
  id: 1,
  title: "Learn React",              // Uses description as fallback
  description: "Learn React",
  progress: 0,                        // Defaults to 0
  status: "IN_PROGRESS",
  assignedDate: "2024-10-15"
}
```

**Endpoint Fallbacks**:

- `getTasksByMentor()` - Returns empty array with warning if 404
- `getTasksByMentee()` - Returns empty array with warning if 404
- `updateTask()` - Falls back to `/tasks/{id}/status` endpoint
- `addComment()` - Returns mock comment if endpoint not found

#### Documentation:

Added inline comments in taskService:

```typescript
/**
 * IMPORTANT: Backend Task model is missing 'title' and 'progress' fields
 * This service adds fallback/workaround logic:
 * - Uses 'description' as 'title' when title is missing
 * - Defaults 'progress' to 0 when missing
 *
 * TODO: Backend must add 'title' and 'progress' columns to Task table
 */
```

**Impact**: Tasks load and display with proper fields, preventing component crashes.

---

## Error Handling Summary

### What Happens When APIs Are Missing:

| Scenario                            | Behavior                           |
| ----------------------------------- | ---------------------------------- |
| `/api/mentees/profile` missing      | Uses `/api/users/profile` fallback |
| `/api/mentors/profile` missing      | Uses `/api/users/profile` fallback |
| `/api/mentees/{id}/mentors` missing | Shows "No mentors assigned yet"    |
| `/api/tasks/mentor/{id}` missing    | Shows empty task list with warning |
| `/api/tasks/{id}` update missing    | Tries status-only endpoint         |
| `/api/tasks/{id}/comments` missing  | Allows commenting (data not saved) |
| CORS not configured                 | Shows helpful error message        |
| Backend not running                 | Shows helpful connection error     |

### Console Warnings

When non-critical endpoints fail, warnings are logged to help developers:

```
⚠️ Endpoint GET /api/mentees/{id}/mentors not implemented.
   Backend must create this endpoint to show assigned mentors.

⚠️ Endpoint GET /api/tasks/mentor/{mentorId} not fully implemented.
   Showing no tasks for this mentor.

⚠️ Task comments endpoint not implemented.
   Comments will not be saved to backend.
```

---

## What Works Now

### ✅ Login (Fully Working)

- Email/password authentication
- JWT token handling
- Role-based navigation
- Proper error messages for connection issues

### ✅ Profile Widget (Partially Working)

- Displays user name and email
- Shows skills (if available)
- Can edit skills locally
- Falls back gracefully if profile endpoint missing

### ✅ Assigned Users Widget (Partially Working)

- Shows "No users assigned" gracefully when API returns empty
- Displays task progress bars
- Handles missing mentor/mentee lists

### ✅ Task Operations (With Limitations)

- Tasks display with title (synthesized from description)
- Progress bars work with default progress value
- Status updates work (if endpoint available)
- Comments work locally (not saved without endpoint)

### ⚠️ Signup (Failing as Expected)

- Shows clear error message that endpoint not implemented
- Instructions for backend developer displayed to user

---

## What Still Needs Backend Implementation

### CRITICAL (T1) - App Cannot Start Without These:

1. **POST /api/auth/signup**
   - Required fields: email, password, firstName, lastName, roleId
   - Response: Same as login (token, userId, role, email, firstName, lastName)
   - Error if missing: User cannot create accounts

2. **CORS Configuration**
   - Front: http://localhost:5173
   - Back: http://localhost:8080
   - Error if missing: All API calls fail with "Failed to fetch"

3. **User Model Updates**
   - Add fields: firstName, lastName, bio, profileImageUrl
   - Current state: Only has "name" (loses lastName)
   - Error if missing: Profile widget displays incomplete data

4. **AuthResponseDTO Updates**
   - Add fields: email, firstName, lastName
   - Current state: Only has token, role, userId
   - Error if missing: Frontend can't display user profile

### HIGH (T2) - Dashboard Cannot Load Without These:

5. **GET /api/users/profile** (or similar)
   - Returns current authenticated user profile
   - Frontend fallback when /api/mentees/profile missing

6. **GET /api/mentees/{id}/mentors**
   - Returns assigned mentors for a mentee
   - Empty list shown if endpoint missing
   - Critical for mentee dashboard

7. **Task Model Updates**
   - Add fields: title, progress
   - Current: Uses description as title, progress defaults to 0
   - Workaround active but not ideal

### MEDIUM (T3) - Features Don't Work:

8. **PUT /api/mentors/{id}** and **PUT /api/mentees/{id}**
   - General update endpoints for profile updates
   - Fallback: Uses /api/users/{id}

9. **Task Comment Endpoints**
   - POST /api/tasks/{id}/comments
   - GET /api/tasks/{id}/comments
   - Workaround: Comments work locally but don't persist

---

## Testing the Frontend

### Prerequisites:

1. Frontend running: `npm run dev` (Port 5173)
2. Backend running: `mvn spring-boot:run` (Port 8080)
3. Backend CORS configured for http://localhost:5173

### Steps:

1. **Login Page**
   - Try logging in with existing backend user
   - Check error messages are clear

2. **Signup Page**
   - Try signing up
   - Should see helpful error: "Signup endpoint not implemented"

3. **Dashboard (if login works)**
   - Profile widget should load with user data
   - Assigned users widget should show "No users assigned" or load mentors
   - Tasks should display with generated titles

4. **Check Console**
   - Look for fallback/warning messages
   - No javascript errors should appear

---

## Configuration

### Frontend Environment Variables:

```bash
# .env or .env.local (if needed)
VITE_API_URL=http://localhost:8080/api
```

### Default API URL:

```typescript
// In src/utils/api.ts
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";
```

---

## Code Examples

### Pattern 1: Fallback to Alternative Endpoint

```typescript
try {
  return await apiClient.get<MenteeProfile>("/mentees/profile");
} catch (error: any) {
  if (error.message?.includes("404")) {
    return await apiClient.get<MenteeProfile>("/users/profile");
  }
  throw error;
}
```

### Pattern 2: Return Empty Array on 404

```typescript
try {
  return await apiClient.get<AssignedMentor[]>(`/mentees/${menteeId}/mentors`);
} catch (error: any) {
  if (error.message?.includes("404")) {
    console.warn("Endpoint not implemented...");
    return [];
  }
  throw error;
}
```

### Pattern 3: Response Transformation

```typescript
const transformTaskResponse = (apiTask: any): Task => {
  return {
    id: apiTask.id,
    title: apiTask.title || apiTask.description || 'Untitled',  // Fallback
    progress: apiTask.progress ?? 0,  // Default to 0
    ...
  };
};
```

---

## Next Steps for Backend Developer

### Immediate (to unblock):

1. Add CORS configuration to SecurityConfig
2. Implement POST /api/auth/signup
3. Update User model with firstName, lastName
4. Update AuthResponseDTO

### Short-term (enables dashboard):

5. Create GET /api/users/profile endpoint
6. Create GET /api/mentees/{id}/mentors endpoint
7. Add title and progress to Task model

### Polish (completes features):

8. General PUT endpoints for profile updates
9. Task comment system
10. Complete task filters

---

## Summary

✅ **Frontend is now defensive and resilient**

- Gracefully handles missing endpoints
- Provides helpful error messages
- Uses fallbacks and defaults where possible
- Clear console warnings about missing features

⚠️ **App will not fully function without backend T1 fixes**

- Signup won't work
- CORS will block all requests
- User profiles won't display properly
- Dashboards will be mostly empty

📋 **All required backend changes documented**

- See BACKEND_FRONTEND_COMPATIBILITY_ANALYSIS.md for detailed specs
- Each endpoint has required fields and response format documented
