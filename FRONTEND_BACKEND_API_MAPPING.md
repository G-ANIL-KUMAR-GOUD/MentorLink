# Frontend-Backend API Mapping & Gaps

## Visual Flow of Frontend API Calls

### User Journey: Signup → Login → Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND SIGNUP FLOW                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User enters:                                                               │
│  - firstName, lastName, email, password, role                              │
│                                                                              │
│  ↓                                                                          │
│  authService.signup(data)                                                  │
│  ↓                                                                          │
│  POST /api/auth/signup                                                     │
│  {                                                                          │
│    "email": "user@example.com",                                           │
│    "password": "password123",                                             │
│    "firstName": "John",         ← Frontend sends this                      │
│    "lastName": "Doe",           ← Frontend sends this                      │
│    "roleId": 3                                                             │
│  }                                                                          │
│                                                                              │
│  Expected Response:                                                         │
│  {                                                                          │
│    "token": "eyJhbGci...",                                                │
│    "role": "MENTEE",                                                       │
│    "userId": 1,                                                            │
│    "email": "user@example.com",                                           │
│    "firstName": "John",         ← Frontend expects this                    │
│    "lastName": "Doe"            ← Frontend expects this                    │
│  }                                                                          │
│                                                                              │
│  ❌ STATUS: ENDPOINT NOT IMPLEMENTED                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND LOGIN FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  POST /api/auth/login                                                      │
│  {                                                                          │
│    "email": "user@example.com",                                           │
│    "password": "password"                                                  │
│  }                                                                          │
│                                                                              │
│  Current Response:                           Expected Response:             │
│  {                                           {                             │
│    "token": "...",           ✅             "token": "...",  ✅           │
│    "role": "MENTEE",         ✅             "role": "MENTEE", ✅          │
│    "userId": 1               ✅             "userId": 1,     ✅           │
│  }                                          "email": "user@example.com",   │
│                                             "firstName": "John",           │
│                                             "lastName": "Doe"             │
│                                             }                             │
│                                                                              │
│  ⚠️ STATUS: PARTIAL - Missing email, firstName, lastName                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Dashboard API Calls by User Type

### Mentee Dashboard Calls:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MENTEE DASHBOARD INITIALIZATION                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1️⃣  Get Current User Profile                                              │
│  GET /api/users/profile                                                    │
│  Expected Response:                                                         │
│  {                                                                          │
│    "userId": 1,                                                            │
│    "email": "mentee@example.com",                                         │
│    "firstName": "Alice",                                                   │
│    "lastName": "Johnson",                                                  │
│    "skills": ["Python", "Django"],                                        │
│    "bio": "Aspiring backend dev"                                          │
│  }                                                                          │
│  ❌ STATUS: ENDPOINT NOT IMPLEMENTED                                       │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  2️⃣  Get Assigned Mentors                                                  │
│  GET /api/mentees/{menteeId}/mentors                                       │
│  Expected Response:                                                         │
│  [                                                                          │
│    {                                                                        │
│      "mentorId": 1,                                                        │
│      "firstName": "John",                                                  │
│      "lastName": "Doe",                                                    │
│      "email": "john@example.com",                                         │
│      "skills": ["React", "TypeScript"],                                   │
│      "assignedDate": "2024-10-15",                                        │
│      "progress": 65                                                        │
│    }                                                                        │
│  ]                                                                          │
│  ❌ STATUS: ENDPOINT NOT IMPLEMENTED                                       │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  3️⃣  Get Mentor's Mentee Profile                                           │
│  GET /api/mentors/{mentorId}                                               │
│  Expected Response:                                                         │
│  {                                                                          │
│    "mentorId": 1,                                                          │
│    "firstName": "John",                                                    │
│    "lastName": "Doe",                                                      │
│    "email": "john@example.com",                                           │
│    "skills": ["React", "TypeScript"],                                     │
│    "bio": "Senior frontend engineer",                                     │
│    "averageRating": 4.5,                                                  │
│    "experience": "5 years",                                               │
│    "menteeCount": 3                                                        │
│  }                                                                          │
│  ⚠️ STATUS: ENDPOINT EXISTS but returns MentorProfile not MentorProfileDTO │
│  ❌ RESPONSE FORMAT MISMATCH                                               │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  4️⃣  Get Mentor's Tasks                                                    │
│  GET /api/tasks/mentor/{mentorId}                                          │
│  Expected Response:                                                         │
│  [                                                                          │
│    {                                                                        │
│      "id": 1,                                                              │
│      "title": "Learn React",              ❌ Task model has no title       │
│      "description": "Complete the tutorial",                              │
│      "progress": 75,                      ❌ Task model has no progress    │
│      "status": "IN_PROGRESS",                                             │
│      "assignedDate": "2024-10-15",                                        │
│      "dueDate": "2024-11-15"                                              │
│    }                                                                        │
│  ]                                                                          │
│  ⚠️ STATUS: ENDPOINT EXISTS but response missing fields                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Mentor Dashboard Calls:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MENTOR DASHBOARD INITIALIZATION                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1️⃣  Get Current Mentor Profile                                            │
│  GET /api/mentors/profile                                                  │
│  Expected Response:                                                         │
│  {                                                                          │
│    "mentorId": 1,                                                          │
│    "firstName": "John",                                                    │
│    "lastName": "Doe",                                                      │
│    "email": "john@example.com",                                           │
│    "skills": ["React", "TypeScript"],                                     │
│    "bio": "Senior Engineer",                                              │
│    "averageRating": 4.5,                                                  │
│    "experience": "5 years",                                               │
│    "menteeCount": 3                                                        │
│  }                                                                          │
│  ❌ STATUS: ENDPOINT NOT IMPLEMENTED                                       │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  2️⃣  Get Assigned Mentees (for this mentor)                                │
│  GET /api/mentor/{mentorId}/mentees                    ← Doesn't exist     │
│  Alternative used: MentorService.getMenteesForMentor()                    │
│  Response Expected:                                                         │
│  [                                                                          │
│    {                                                                        │
│      "menteeId": 5,                                                        │
│      "firstName": "Alice",                ❌ API returns menteeName only   │
│      "lastName": "Johnson",               ❌ API returns menteeName only   │
│      "email": "alice@example.com",        ❌ Not in MentorMenteeDTO      │
│      "skills": ["Python", "Django"],                                      │
│      "progress": 60                                                        │
│    }                                                                        │
│  ]                                                                          │
│  ❌ STATUS: NO ENDPOINT - Manual DB query in service                      │
│  ❌ RESPONSE FORMAT MISMATCH                                               │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  3️⃣  Get Mentee Profile (for specific mentee)                              │
│  GET /api/mentees/{menteeId}                                               │
│  Expected Response:                                                         │
│  {                                                                          │
│    "menteeId": 5,                                                          │
│    "firstName": "Alice",                                                   │
│    "lastName": "Johnson",                                                  │
│    "email": "alice@example.com",                                          │
│    "skills": ["Python", "Django"],                                        │
│    "bio": "Looking to learn backend"                                      │
│  }                                                                          │
│  ⚠️ STATUS: ENDPOINT EXISTS but returns MenteeProfile                     │
│  ❌ RESPONSE FORMAT MISMATCH - MenteeProfileDTO has userName wrong        │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  4️⃣  Get/Update Tasks for Mentees                                          │
│  GET /api/tasks/mentor/{mentorId}                                          │
│  PUT /api/tasks/{taskId}                                                   │
│  PUT /api/tasks/{taskId}/progress                                         │
│  ❌ STATUS: No update endpoint for progress field                          │
│                                                                              │
│  5️⃣  Create Task for Mentee                                                │
│  POST /api/tasks                                                           │
│  {                                                                          │
│    "title": "Learn React",                ❌ Task model has no title       │
│    "description": "Complete tutorial",                                    │
│    "mentorMenteeMapId": 1,                                               │
│    "dueDate": "2024-11-15"                                               │
│  }                                                                          │
│  ❌ STATUS: ENDPOINT NOT EXPOSED (in TaskService but not Controller)      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component-Level API Expectations

### ProfileWidget Component:

```
MENTEE/MENTOR VARIANT:

Initial Load:
  variant = 'mentee'
  ↓
  Call: menteeService.getCurrentMenteeProfile()
  ↓
  GET /api/mentees/profile
  ❌ ENDPOINT NOT IMPLEMENTED

  OR Can Use:
  GET /api/mentee-profiles/{id}
  ⚠️ BUT: Response is MenteeProfileDTO with wrong format

Edit Skills:
  ↓
  Call: menteeService.updateMenteeProfile(userId, {skills: [...]})
  ↓
  PUT /api/mentees/{userId}
  ❌ NO GENERAL ENDPOINT - Only skill endpoints exist
```

### AssignedUsersWidget Component:

```
MENTEE VARIANT:

Load Mentors:
  ↓
  Call: menteeService.getAssignedMentors(menteeId)
  ↓
  GET /api/mentees/{menteeId}/mentors
  ❌ ENDPOINT NOT IMPLEMENTED

  What exists: MentorMenteeMapRepository can query but no controller endpoint

Load Tasks for Each Mentor:
  ↓
  Call: taskService.getTasksByMentor(mentorId)
  ↓
  GET /api/tasks/mentor/{mentorId}
  ✅ ENDPOINT EXISTS
  ⚠️ BUT: Response missing title and progress fields

Update Task Progress:
  ↓
  Call: taskService.updateTask(taskId, {progress: 50})
  ↓
  PUT /api/tasks/{taskId}
  ❌ NO ENDPOINT for general update
  ✅ Only: PUT /api/tasks/{taskId}/status exists in MenteeController

---

MENTOR VARIANT:

Load Mentees:
  ↓
  Call: mentorService.getMenteesForMentor(mentorId)
  ↓
  NO STANDARD ENDPOINT
  Uses: MentorService.getMenteesForMentor() - manual logic
  Returns: MentorMenteeDTO (incomplete)
  ❌ NEEDS ENDPOINT: GET /api/mentors/{mentorId}/mentees

Load Tasks for Each Mentee:
  ✅ GET /api/tasks/mentor/{mentorId} works

Create New Task:
  ❌ NO EXPOSED ENDPOINT - TaskService.assignTask exists but no endpoint
```

---

## Endpoint Comparison Matrix

| Endpoint                      | Frontend Expects | Backend Status | Response Format        | Notes               |
| ----------------------------- | ---------------- | -------------- | ---------------------- | ------------------- |
| POST /api/auth/signup         | Required         | ❌ Missing     | N/A                    | Critical            |
| GET /api/users/profile        | Required         | ❌ Missing     | N/A                    | Critical            |
| GET /api/mentors/profile      | Required         | ❌ Missing     | N/A                    | Critical            |
| GET /api/mentees/profile      | Required         | ❌ Missing     | N/A                    | Critical            |
| GET /api/mentees/{id}/mentors | Required         | ❌ Missing     | N/A                    | Critical            |
| GET /api/mentors/{id}         | Required         | ✅ Exists      | ❌ Wrong type returned | Fix DTO             |
| GET /api/mentees/{id}         | Required         | ✅ Exists      | ❌ Wrong format        | Fix DTO             |
| GET /api/tasks/mentor/{id}    | Required         | ✅ Exists      | ❌ Missing fields      | Add title, progress |
| PUT /api/tasks/{id}           | Required         | ⚠️ Partial     | ⚠️ Status only         | Add general update  |
| DELETE /api/tasks/{id}        | Required         | ❌ Missing     | N/A                    | Add support         |
| POST /api/tasks/{id}/comments | Required         | ❌ Missing     | N/A                    | Add comment system  |
| GET /api/tasks/{id}/comments  | Required         | ❌ Missing     | N/A                    | Add comment system  |
| GET /api/analytics/\*         | Required         | ✅ Exists      | ⚠️ Check format        | Verify output       |

---

## Data Flow Issues Summary

### Issue 1: User Name Mismatch

```
Frontend sends:           Backend expects:      Backend stores as:
firstName: "John"   →     userName: ?        →  name: "John" (only first)
lastName: "Doe"     →     userName: ?        →  (lost)
```

### Issue 2: Task Data Loss

```
Frontend sends:           Task Model stores:      DTO Returns:
title: "Learn React"  →   (no field)          →  (missing)
progress: 50          →   (no field)          →  (missing)
assignedDate: "..."   →   createdAt           →  (not in DTO)
completedDate: "..."  →   (no field)          →  (missing)
```

### Issue 3: Mentor/Mentee Profile Split

```
Frontend Expects:         Backend Has:
/api/mentors/profile      /api/mentors (list)
                         /api/mentor-profiles/{id} (profile - diff path!)

Frontend Expects:         Backend Has:
/api/mentees/profile      /api/mentees (list)
                         /api/mentee-profiles/{id} (profile - diff path!)
```

### Issue 4: Authorization Wrong Format

```
AuthResponseDTO:          User Model:
firstName: "John"         name: "John" (only)
lastName: "Doe"           (no lastName)
email: "john@example.com" ✅ has email
```

---

## How Frontend Will Fail

### 1. Signup Page

```javascript
// Frontend tries:
const response = await authService.signup({
  email: 'newuser@example.com',
  password: 'password123',
  firstName: 'Jane',
  lastName: 'Smith',
  roleId: 3
})

// Error:
404 POST /api/auth/signup - Not Found
```

### 2. Dashboard Load

```javascript
// Frontend tries:
const profile = await menteeService.getCurrentMenteeProfile()

// Error:
404 GET /api/mentees/profile - Not Found

// Fallback attempt fails
const profile = await menteeService.getMenteeById(userId)
// Returns MenteeProfileDTO with userName instead of firstName/lastName
// Component breaks because it expects firstName/lastName
```

### 3. Mentor List

```javascript
// Frontend tries:
const mentors = await menteeService.getAssignedMentors(menteeId)

// Error:
404 GET /api/mentees/{menteeId}/mentors - Not Found
```

### 4. Task Display

```javascript
// Frontend gets:
{
  id: 1,
  description: "Learn React",
  status: "IN_PROGRESS",
  dueDate: "2024-11-15"
}

// Frontend expects:
{
  id: 1,
  title: "Learn React",           // ❌ Missing!
  description: "...",
  progress: 75,                   // ❌ Missing!
  status: "IN_PROGRESS",
  assignedDate: "2024-10-15",     // ❌ Missing!
  dueDate: "2024-11-15"
}

// Result: Progress bar breaks, title doesn't display
```

---

## Recommendation

🔴 **STOP TESTING FRONTEND UNTIL THESE ARE FIXED:**

1. Implement signup endpoint
2. Add CORS configuration
3. Fix User model (add firstName, lastName)
4. Fix DTOs (email, firstName, lastName)
5. Add /api/users/profile endpoint
6. Add /api/mentees/{id}/mentors endpoint
7. Add task title and progress fields

**Only then will frontend work correctly.**
