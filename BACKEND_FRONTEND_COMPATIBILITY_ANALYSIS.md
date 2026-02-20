# Backend API Compatibility Analysis

## Status: CRITICAL MISMATCHES FOUND ⚠️

This document compares what the React frontend expects vs. what the backend provides.

---

## 1. USER MODEL & DTO MISMATCHES

### Frontend Expects:

```typescript
interface UserProfile {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  skills: string[];
  bio?: string;
  profileImageUrl?: string;
}
```

### Backend Has (User Model):

```java
private Long userId;
private String name;           // ❌ Not firstName/lastName
private String email;
private String passwordHash;
private String profileInfo;    // ❌ Not a "bio" field
```

### Backend AuthResponseDTO:

```java
private String token;
private String role;
private Long userId;
// ❌ MISSING: email, firstName, lastName
```

### Issues:

- ❌ User has single `name` field, not `firstName` and `lastName`
- ❌ AuthResponseDTO doesn't return email
- ❌ AuthResponseDTO doesn't return firstName/lastName
- ❌ No `bio` field in User model
- ❌ No `profileImageUrl` in User model

### Status: Frontend will FAIL on login/signup

---

## 2. AUTHENTICATION ENDPOINTS

### Frontend Expects:

```
POST /api/auth/login   ✅ EXISTS
POST /api/auth/signup  ❌ MISSING
```

### Backend Has:

- ❌ No signup endpoint in AuthController
- ❌ No signup logic in AuthService
- ✅ Login endpoint exists but response is incomplete

### Issues:

- ❌ **CRITICAL**: Signup endpoint not implemented
- ❌ Frontend signup will fail with 404 error

### Status: Signup is BROKEN

---

## 3. MENTOR PROFILE ENDPOINTS

### Frontend Expects:

```
GET /api/mentors/profile              ❌ MISSING
GET /api/mentors/{id}                 ✅ EXISTS
PUT /api/mentors/{id}                 ⚠️ PARTIAL
GET /api/mentors                      ✅ EXISTS
GET /api/mentors/skill/{skill}        ❌ MISSING
```

### Backend Has:

```
GET /api/mentors                      ✅ EXISTS (getMentorProfile is at /api/mentor-profiles/{id})
GET /api/mentors/{id}                 ✅ EXISTS
POST /api/mentors/{id}/skills         ⚠️ skill management
PUT /api/mentor-profiles              ❌ at different URL
```

### Issues:

- ❌ `/api/mentors/profile` endpoint doesn't exist (current user's mentor profile)
- ❌ Update endpoint path mismatch: should be `/api/mentors/{id}` not `/api/mentor-profiles`
- ❌ No search by skill endpoint (`/api/mentors/skill/{skill}`)
- ⚠️ Response DTOs don't match what frontend expects
- ❌ MentorProfileDTO has `userName` instead of `firstName`, `lastName`, `email`

### MentorProfileDTO Issues:

```java
// Current (WRONG)
private String userName;  // ❌ Should be firstName, lastName
private String headline;  // ✅ Good
private Integer experienceYears;  // ✅ But labeled as "experience" in frontend

// Missing
// firstName
// lastName
// email
// averageRating
// menteeCount
```

### Status: Profile endpoints BROKEN

---

## 4. MENTEE PROFILE ENDPOINTS

### Frontend Expects:

```
GET /api/mentees/profile              ❌ MISSING
GET /api/mentees/{id}                 ✅ EXISTS
GET /api/mentees/{id}/mentors         ❌ MISSING
PUT /api/mentees/{id}                 ⚠️ PARTIAL
```

### Backend Has:

```
GET /api/mentees                      ✅ EXISTS
GET /api/mentees/{id}                 ✅ EXISTS
POST /api/mentees                     ⚠️ CREATE only
PUT /api/mentees/{id}/skills          ⚠️ Only skills endpoint
```

### Issues:

- ❌ `/api/mentees/profile` endpoint missing (current user's mentee profile)
- ❌ **CRITICAL**: `/api/mentees/{id}/mentors` endpoint missing - Frontend can't get assigned mentors
- ❌ No general update endpoint for mentee profile
- ⚠️ MenteeProfileDTO has `userName` instead of `firstName`, `lastName`, `email`

### Status: Mentee endpoints BROKEN

---

## 5. TASK ENDPOINTS

### Frontend Expects:

```
GET /api/tasks                        ❌ MISSING
GET /api/tasks/{id}                   ❌ MISSING
GET /api/tasks/mentor/{mentorId}      ✅ EXISTS
GET /api/tasks/mentee/{menteeId}      ✅ EXISTS
POST /api/tasks                       ❌ MISSING /assignments endpoint
PUT /api/tasks/{id}                   ⚠️ Partial (only status update)
DELETE /api/tasks/{id}                ❌ MISSING
POST /api/tasks/{id}/comments         ❌ MISSING
GET /api/tasks/{id}/comments          ❌ MISSING
```

### Backend Has:

```
GET /api/tasks/mentor/{mentorId}      ✅ EXISTS
GET /api/tasks/map/{mapId}            ⚠️ Different: uses mapId
No general GET /api/tasks
No DELETE
No comments endpoints
```

### Task Response Format Issues:

```java
// TaskResponseDTO Current (INCOMPLETE)
private Long taskId;
private String description;
// ❌ MISSING: title
private String status;
private LocalDate dueDate;

// Task Model Missing:
// ❌ title field (only description)
// ❌ progress field
// ❌ assignedDate (createdAt exists but not returned in DTO)
// ❌ completedDate
```

### Issues:

- ❌ Task model doesn't have `title` field (only `description`)
- ❌ Task model doesn't have `progress` field
- ❌ No DELETE endpoint
- ❌ No comments functionality
- ❌ TaskResponseDTO missing key fields
- ⚠️ Using mapId instead of userId pattern

### Status: Task endpoints BROKEN

---

## 6. ENDPOINT PATH INCONSISTENCIES

### Frontend Style (Resource-based):

```
GET /api/users/profile
GET /api/users/{id}
PUT /api/users/{id}
GET /api/mentors/profile
GET /api/mentors/{id}
PUT /api/mentors/{id}
```

### Backend Style (Mixed):

```
GET /api/mentors                      ✅ Consistent
GET /api/mentor-profiles/{id}         ❌ Inconsistent
PUT /api/mentor-profiles              ❌ Inconsistent
GET /api/mentors/{id}                 ✅ Different controller
```

### Status: Inconsistent endpoint structure

---

## 7. ANALYTICS ENDPOINTS

### Frontend Expects:

```
GET /api/analytics/mentor/{mentorId}  ✅ EXISTS
GET /api/analytics/mentee/{menteeId}  ✅ EXISTS
GET /api/analytics/batch/{batchId}    ✅ EXISTS
```

### Backend Has:

- ✅ AnalyticsController exists with these endpoints

### Status: ✅ WORKING

---

## 8. CORS CONFIGURATION

### Current Status: ⚠️ MISSING

Backend SecurityConfig has:

```java
.requestMatchers("/api/auth/**").permitAll()
.requestMatchers("/api/admin/**").hasRole("ADMIN")
```

But NO CORS configuration!

### Frontend runs on: `http://localhost:5173`

### Backend runs on: `http://localhost:8080`

### Status: ❌ Frontend WILL GET CORS ERROR

---

## 9. ROLE-BASED ENDPOINTS ISSUE

### SecurityConfig has:

```java
.requestMatchers("/api/mentors/**").hasRole("MENTOR")
.requestMatchers("/api/mentees/**").hasRole("MENTEE")
```

### Problem:

User login returns role as "MENTOR" or "MENTEE" but JWT auth filter needs to map this to correct ROLE authorities.

### Status: ⚠️ Potential permission issues

---

## 10. SUMMARY TABLE

| Feature              | Frontend Expects                  | Backend Has              | Status                 |
| -------------------- | --------------------------------- | ------------------------ | ---------------------- |
| Auth Login           | POST /api/auth/login              | ✅ Exists                | ⚠️ Response incomplete |
| Auth Signup          | POST /api/auth/signup             | ❌ Missing               | ❌ BROKEN              |
| User Profile         | GET /api/users/profile            | ❌ Missing               | ❌ BROKEN              |
| User Data            | firstName, lastName, email        | Single "name" field      | ❌ BROKEN              |
| Mentor Profile       | GET /api/mentors/profile          | ❌ Missing               | ❌ BROKEN              |
| Get Assigned Mentors | GET /api/mentees/{id}/mentors     | ❌ Missing               | ❌ BROKEN              |
| Task CRUD            | Full CRUD                         | Partial (no comments)    | ❌ BROKEN              |
| Task Fields          | title, progress, status           | Only description, status | ❌ BROKEN              |
| Comments             | POST/GET /api/tasks/{id}/comments | ❌ Missing               | ❌ BROKEN              |
| CORS                 | Enabled                           | ❌ Missing               | ❌ BROKEN              |
| Analytics            | GET endpoints                     | ✅ Exists                | ✅ WORKING             |

---

## 11. CRITICAL FIXES NEEDED (Priority Order)

### TIER 1 - BLOCKS EVERYTHING (Do First)

1. **Add CORS Configuration** to SecurityConfig
2. **Implement Signup Endpoint** - POST /api/auth/signup
3. **Update User Model** - Add firstName, lastName fields
4. **Update AuthResponseDTO** - Include email, firstName, lastName
5. **Create /api/users/profile Endpoint** - Get current user
6. **Create /api/mentors/profile Endpoint** - Get current mentor
7. **Create /api/mentees/profile Endpoint** - Get current mentee

### TIER 2 - BLOCKS DASHBOARD (Do Second)

8. **Add task `title` field** to Task model
9. **Add task `progress` field** to Task model
10. **Create /api/mentees/{id}/mentors Endpoint** - Get assigned mentors
11. **Implement PUT /api/mentors/{id}** - Update mentor
12. **Implement PUT /api/mentees/{id}** - Update mentee
13. **Update Task DTOs** - Match frontend expectations

### TIER 3 - COMPLETES FEATURES (Do Third)

14. Implement task DELETE endpoint
15. Implement task comments endpoints
16. Implement search endpoints
17. Fix endpoint paths (consolidate under /api/mentors and /api/mentees)

---

## 12. DETAILED FIXES REQUIRED

### Fix #1: Update User Model

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String email;

    // ADD THESE:
    private String firstName;    // NEW
    private String lastName;     // NEW

    @Deprecated  // Keep for migration
    private String name;

    private String bio;          // NEW
    private String profileImageUrl;  // NEW

    private String passwordHash;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### Fix #2: Update AuthResponseDTO

```java
@Data
@Builder
public class AuthResponseDTO {
    private String token;
    private String role;
    private Long userId;

    // ADD THESE:
    private String email;        // NEW
    private String firstName;    // NEW
    private String lastName;     // NEW
}
```

### Fix #3: Add CORS Configuration

```java
// Add to SecurityConfig
@Bean
public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600);
        }
    };
}
```

### Fix #4: Implement Signup Endpoint

```java
// In AuthController
@PostMapping("/signup")
public ResponseEntity<AuthResponseDTO> signup(@RequestBody SignupRequestDTO dto) {
    return ResponseEntity.ok(authService.signup(dto));
}

// In AuthService
public AuthResponseDTO signup(SignupRequestDTO dto) {
    // Create user
    // Assign role
    // Return token + user info
}
```

### Fix #5: Add /api/users/profile Endpoint

```java
// In UserController
@GetMapping("/profile")
public ResponseEntity<UserProfile> getCurrentUserProfile(
        @AuthenticationPrincipal UserDetails userDetails) {
    return ResponseEntity.ok(userService.getUserByEmail(userDetails.getUsername()));
}
```

### Fix #6: Add /api/mentees/{id}/mentors Endpoint

```java
// In MenteeController
@GetMapping("/{menteeId}/mentors")
public ResponseEntity<List<AssignedMentorDTO>> getAssignedMentors(
        @PathVariable Long menteeId) {
    return ResponseEntity.ok(menteeService.getAssignedMentors(menteeId));
}

// In MenteeService
public List<AssignedMentorDTO> getAssignedMentors(Long menteeId) {
    return mentorMenteeMapRepository.findByMentee_MenteeId(menteeId)
        .stream()
        .map(map -> new AssignedMentorDTO(
            map.getMentor().getMentorId(),
            map.getMentor().getUser().getFirstName(),
            map.getMentor().getUser().getLastName(),
            map.getMentor().getUser().getEmail(),
            map.getMentor().getSkills().stream()
                .map(Skill::getSkillName)
                .collect(Collectors.toList()),
            map.getCreatedAt().toLocalDate().toString()
        ))
        .toList();
}
```

### Fix #7: Update Task Model

```java
@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskId;

    @ManyToOne
    @JoinColumn(name = "map_id", nullable = false)
    private MentorMenteeMap mentorMenteeMap;

    private String title;        // NEW
    private String description;
    private String status;
    private Integer progress = 0;  // NEW
    private LocalDate dueDate;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime completedDate;  // NEW
}
```

### Fix #8: Update MentorProfileDTO

```java
@Data
public class MentorProfileDTO {
    private Long mentorId;
    private Long userId;

    // REPLACE userName with:
    private String firstName;
    private String lastName;
    private String email;

    private String headline;
    private Integer experienceYears;
    private String expertiseArea;

    // ADD THESE:
    private Double averageRating;
    private Integer menteeCount;

    private Set<String> skills;
}
```

### Fix #9: Update MenteeProfileDTO

```java
@Data
public class MenteeProfileDTO {
    private Long menteeId;
    private Long userId;

    // REPLACE userName with:
    private String firstName;
    private String lastName;
    private String email;

    private String currentRole;
    private String education;
    private String goals;
    private String interests;
    private String enrollmentDate;  // NEW
    private Set<String> skills;
}
```

---

## 13. NEW DTOs NEEDED

### SignupRequestDTO

```java
@Data
public class SignupRequestDTO {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private Integer roleId;  // 2 for MENTOR, 3 for MENTEE
}
```

### AssignedMentorDTO

```java
@Data
public class AssignedMentorDTO {
    private Long mentorId;
    private String firstName;
    private String lastName;
    private String email;
    private List<String> skills;
    private String assignedDate;
    private Integer progress;
}
```

### TaskDTO (Complete)

```java
@Data
public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private String status;
    private Integer progress;
    private String assignedDate;
    private String dueDate;
    private String completedDate;
    private String assignedBy;
}
```

---

## 14. MIGRATION GUIDE

### Step 1: Database Migration

```sql
ALTER TABLE users ADD COLUMN first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN last_name VARCHAR(100);
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN profile_image_url VARCHAR(255);

ALTER TABLE tasks ADD COLUMN title VARCHAR(255);
ALTER TABLE tasks ADD COLUMN progress INT DEFAULT 0;
ALTER TABLE tasks ADD COLUMN completed_date DATETIME;

CREATE TABLE task_comments (
    comment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(task_id),
    FOREIGN KEY (author_id) REFERENCES users(user_id)
);
```

### Step 2: Update Models

- Update User, Task models with new fields
- Create Comment model
- Update all DTOs

### Step 3: Update Services

- Implement all missing business logic
- Add profile endpoints
- Add assignment endpoints

### Step 4: Update Controllers

- Add /profile endpoints
- Add /mentors endpoint
- Add comments endpoints
- Consolidate paths

### Step 5: Test

- Test signup flow
- Test login flow
- Test profile retrieval
- Test mentor/mentee assignment
- Test task CRUD

---

## 15. TESTING CHECKLIST

After fixes:

- [ ] CORS enabled - test from localhost:5173
- [ ] Signup creates user and returns token
- [ ] Login returns complete user info
- [ ] GET /api/users/profile works with JWT
- [ ] GET /api/mentors/profile returns mentor data
- [ ] GET /api/mentees/{id}/mentors returns list
- [ ] Task includes title and progress fields
- [ ] Task update saves progress value
- [ ] Comments can be added to tasks
- [ ] All endpoints require authentication
- [ ] Test with React frontend

---

## 16. ESTIMATED TIMELINE

- Tier 1 fixes: **6-8 hours**
- Tier 2 fixes: **4-6 hours**
- Tier 3 fixes: **3-5 hours**
- Testing & fixes: **4-6 hours**

**Total: 17-25 hours of development**

---

## 17. BLOCKING ISSUES

🔴 **CRITICAL** - Frontend cannot function without these:

1. SignUp endpoint
2. CORS configuration
3. User firstName/lastName fields
4. AuthResponseDTO complete fields
5. /api/users/profile endpoint
6. /api/mentees/{id}/mentors endpoint

**Without these 6 items, the frontend will fail immediately on startup.**

---

## Conclusion

The backend has a solid foundation but **requires significant updates** to match the React frontend expectations. The main issues are:

1. **Missing endpoints** for current user profiles
2. **Data model mismatches** (name vs firstName/lastName)
3. **Incomplete DTOs** missing required fields
4. **Missing CORS configuration**
5. **No signup endpoint**
6. **Task fields missing** (title, progress)
7. **No comment system**
8. **Endpoint path inconsistencies**

**Priority**: Fix Tier 1 items FIRST as they block all frontend functionality.
