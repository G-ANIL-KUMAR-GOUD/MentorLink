# Backend API Improvements Required

## Overview

The React frontend expects specific API endpoints and response formats. This document outlines what needs to be implemented or fixed in the backend.

## Required Endpoints by Category

### 1. Authentication (CRITICAL)

#### POST /api/auth/login

**Current Status**: ✅ Implemented

**Expected Request**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Expected Response** (200 OK):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "role": "MENTOR",
  "userId": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Issues to Fix**:

- Ensure response includes all required fields
- Token must be valid JWT
- Response should include user email and names

---

#### POST /api/auth/signup

**Current Status**: ❌ Not Implemented

**Expected Request**:

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "roleId": 3
}
```

**Expected Response** (201 Created):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "role": "MENTEE",
  "userId": 2,
  "email": "newuser@example.com",
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Action Required**:

- Implement signup endpoint in AuthController
- Validate email doesn't already exist
- Hash password before saving
- Generate JWT token
- Return user info with token

---

### 2. User Management

#### GET /api/users/profile

**Current Status**: ⚠️ Partially Implemented (need to add endpoint)

**Expected Response** (200 OK):

```json
{
  "userId": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "skills": ["React", "TypeScript"],
  "bio": "Software Engineer",
  "profileImageUrl": null
}
```

**Action Required**:

- Create endpoint in UserController
- Use JWT token from Authorization header to identify user
- Return current authenticated user's profile

---

#### PUT /api/users/{id}

**Current Status**: ✅ Partially Implemented - Update Required

**Expected Request**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "skills": ["React", "TypeScript", "Node.js"],
  "bio": "Experienced developer"
}
```

**Expected Response** (200 OK):

```json
{
  "userId": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "skills": ["React", "TypeScript", "Node.js"],
  "bio": "Experienced developer"
}
```

---

### 3. Mentor Management

#### GET /api/mentors/profile

**Current Status**: ❌ Not Implemented

**Expected Response** (200 OK):

```json
{
  "mentorId": 1,
  "userId": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "skills": ["React", "TypeScript"],
  "bio": "Lead Frontend Engineer",
  "averageRating": 4.5,
  "experience": "5 years",
  "menteeCount": 3
}
```

**Action Required**:

- Create endpoint in MentorController
- Fetch current authenticated user's mentor profile
- Include performance metrics

---

#### GET /api/mentors/{id}

**Current Status**: ❌ Not Implemented

**Expected Response** (200 OK):

```json
{
  "mentorId": 1,
  "userId": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "skills": ["React", "TypeScript"],
  "bio": "Lead Frontend Engineer",
  "averageRating": 4.5,
  "experience": "5 years",
  "menteeCount": 3
}
```

---

#### PUT /api/mentors/{id}

**Current Status**: ❌ Not Implemented

**Expected Request**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "skills": ["React", "TypeScript", "Node.js"],
  "bio": "Updated bio",
  "experience": "6 years"
}
```

**Action Required**:

- Implement profile update for mentors
- Validate user authorization
- Return updated mentor profile

---

### 4. Mentee Management

#### GET /api/mentees/profile

**Current Status**: ❌ Not Implemented

**Expected Response** (200 OK):

```json
{
  "menteeId": 1,
  "userId": 1,
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice@example.com",
  "skills": ["Python", "Django"],
  "bio": "Aspiring backend developer",
  "enrollmentDate": "2024-10-15"
}
```

---

#### GET /api/mentees/{id}/mentors

**Current Status**: ❌ Not Implemented

**Expected Response** (200 OK):

```json
[
  {
    "mentorId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "skills": ["React", "TypeScript"],
    "assignedDate": "2024-10-15",
    "progress": 65
  }
]
```

**Action Required**:

- Fetch mentors assigned to mentee from MentorMenteeMap
- Include practice progress calculation

---

#### POST /api/mentees/request-mentor

**Current Status**: ❌ Not Implemented

**Expected Request**:

```json
{
  "menteeId": 1,
  "mentorId": 2
}
```

**Expected Response** (201 Created):

```json
{
  "menteeId": 1,
  "mentorId": 2,
  "status": "PENDING",
  "requestDate": "2024-11-20"
}
```

---

### 5. Task Management

#### GET /api/tasks/mentor/{mentorId}

**Current Status**: ❌ Not Implemented

**Expected Response** (200 OK):

```json
[
  {
    "id": 1,
    "title": "Learn React Fundamentals",
    "description": "Complete React tutorial",
    "status": "IN_PROGRESS",
    "progress": 75,
    "assignedDate": "2024-10-15",
    "dueDate": "2024-11-15",
    "completedDate": null
  }
]
```

**Action Required**:

- Fetch tasks created by mentor for their mentees
- Include progress percentage

---

#### GET /api/tasks/mentee/{menteeId}

**Current Status**: ❌ Not Implemented

**Expected Response** (200 OK):

```json
[
  {
    "id": 1,
    "title": "Learn React Fundamentals",
    "description": "Complete React tutorial",
    "status": "IN_PROGRESS",
    "progress": 75,
    "assignedDate": "2024-10-15",
    "dueDate": "2024-11-15",
    "completedDate": null
  }
]
```

---

#### POST /api/tasks

**Current Status**: ❌ Needs Update

**Expected Request**:

```json
{
  "taskTitle": "Learn React",
  "taskDescription": "Complete React fundamentals",
  "mentorMenteeMapId": 1,
  "dueDate": "2024-11-15"
}
```

**Expected Response** (201 Created):

```json
{
  "id": 1,
  "title": "Learn React",
  "description": "Complete React fundamentals",
  "status": "NOT_STARTED",
  "progress": 0,
  "assignedDate": "2024-11-20",
  "dueDate": "2024-11-15"
}
```

---

#### PUT /api/tasks/{id}

**Current Status**: ⚠️ Partial Implementation

**Expected Request**:

```json
{
  "status": "IN_PROGRESS",
  "progress": 50,
  "title": "Learn React (Updated)",
  "description": "Updated description"
}
```

**Expected Response** (200 OK):

```json
{
  "id": 1,
  "title": "Learn React (Updated)",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "progress": 50,
  "assignedDate": "2024-10-15"
}
```

---

#### DELETE /api/tasks/{id}

**Current Status**: ✅ Implemented

---

#### POST /api/tasks/{id}/comments

**Current Status**: ❌ Not Implemented

**Expected Request**:

```json
{
  "text": "Great progress!"
}
```

**Expected Response** (201 Created):

```json
{
  "id": 1,
  "author": "john@example.com",
  "text": "Great progress!",
  "createdAt": "2024-11-20T10:30:00Z"
}
```

---

#### GET /api/tasks/{id}/comments

**Current Status**: ❌ Not Implemented

**Expected Response** (200 OK):

```json
[
  {
    "id": 1,
    "author": "john@example.com",
    "text": "Great progress!",
    "createdAt": "2024-11-20T10:30:00Z"
  }
]
```

---

### 6. Analytics

#### GET /api/analytics/mentor/{mentorId}

**Current Status**: ✅ Implemented - Verify Format

**Expected Response** (200 OK):

```json
{
  "mentorId": 1,
  "mentorName": "John Doe",
  "averageRating": 4.5,
  "totalTasks": 10,
  "completedTasks": 8,
  "menteeCount": 3
}
```

---

#### GET /api/analytics/mentee/{menteeId}

**Current Status**: ✅ Implemented - Verify Format

**Expected Response** (200 OK):

```json
{
  "menteeId": 1,
  "menteeName": "Alice Johnson",
  "completedTasks": 5,
  "totalTasks": 8,
  "averageProgress": 62,
  "feedbackCount": 3
}
```

---

## Cross-Cutting Concerns

### 1. CORS Configuration

**Issue**: Frontend can't access backend APIs

**Fix Required in Application.properties or SecurityConfig**:

```properties
spring.web.cors.allowed-origins=http://localhost:5173,http://localhost:3000
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,PATCH,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

Or in SecurityConfig:

```java
@Bean
public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:5173")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                    .allowedHeaders("*")
                    .allowCredentials(true);
        }
    };
}
```

---

### 2. JWT Token Validation

**Issue**: Frontend sends JWT but not properly validated

**Fix Required**:

- Ensure JwtAuthFilter extracts token from Authorization header
- Format: `Authorization: Bearer {token}`
- Validate token signature and expiration
- Set request attributes or SecurityContext with user info

---

### 3. Error Response Format

**Current Status**: ❌ Inconsistent

**Expected Error Response**:

```json
{
  "error": "Invalid email or password",
  "message": "Authentication failed",
  "status": 401
}
```

**Action Required**:

- Implement global exception handler
- Return consistent error format
- Include appropriate HTTP status codes
- Provide meaningful error messages

---

### 4. Response Wrapping

**Current Status**: ❌ Not consistent

**Consider Wrapping Responses**:

```json
{
  "success": true,
  "data": {
    /* actual data */
  },
  "message": "Success"
}
```

Or use standard HTTP status codes (recommended)

---

## Database Schema Checks

Ensure the following relationships exist:

1. **User** → **Role** (Many-to-One)
2. **User** → **Mentor** (One-to-One optional)
3. **User** → **Mentee** (One-to-One optional)
4. **Mentor** ↔ **Mentee** (Many-to-Many through MentorMenteeMap)
5. **MentorMenteeMap** → **Task** (One-to-Many)
6. **Task** → **Comment** (One-to-Many)
7. **MentorMenteeMap** → **Feedback** (One-to-Many)

---

## Dependency Injection Notes

Services that need implementation:

1. `MenteeService` - Get assigned mentors with progress
2. `MentorService` - Get profile, update profile
3. `TaskService` - Full CRUD + comments
4. `CommentService` - Add/get comments
5. `AnalyticsService` - Already implemented, verify results

---

## Security Concerns

1. ✅ JWT validation on all /api/\* endpoints
2. ⚠️ CORS properly configured
3. ⚠️ Password hashing (verify BCrypt is used)
4. ⚠️ SQL injection prevention (use parameterized queries)
5. ⚠️ Input validation on all endpoints
6. ⚠️ Rate limiting (optional but recommended)

---

## Testing the Integration

Use Postman or cURL to test:

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get profile (use token from login response)
curl -X GET http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer {token}"

# Update profile
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"firstName":"John","skills":["React"]}'
```

---

## Priority Order to Implement

1. **CRITICAL** (Blocks all features):
   - Fix CORS
   - Implement signup endpoint
   - Ensure JWT returns all required fields

2. **HIGH** (Blocks dashboard):
   - Implement /api/mentors/profile
   - Implement /api/mentees/profile
   - Implement /api/users/profile
   - Implement /api/mentees/{id}/mentors

3. **MEDIUM** (Blocks task features):
   - Implement task endpoints
   - Implement task comments
   - Update menu endpoints

4. **LOW** (Nice to have):
   - Implement group management endpoints
   - Implement advanced analytics
   - Add caching layer

---

## Validation Checklist

- [ ] CORS is properly configured
- [ ] All endpoints return expected JSON format
- [ ] JWT tokens are 24 hours expiration minimum
- [ ] Password hashing uses BCrypt
- [ ] Error messages are clear and helpful
- [ ] Status codes are appropriate (200, 201, 400, 401, 404, 500)
- [ ] All required fields are returned
- [ ] Data types match expectations (dates as ISO 8601 strings)
- [ ] Null values handled properly
- [ ] List endpoints can be extended for pagination
