# Frontend Refactoring Guide - Complete API Integration

## Overview

The React frontend has been completely rewritten with proper API integration, authentication, and error handling. All components now fetch real data from the backend API.

## What Changed

### 1. **New API Infrastructure**

- **`src/utils/api.ts`** - Central API client with automatic header management and JWT token handling
- **`src/utils/authService.ts`** - Authentication service for login/signup
- **`src/utils/userService.ts`** - User profile management
- **`src/utils/mentorService.ts`** - Mentor-related API calls
- **`src/utils/menteeService.ts`** - Mentee-related API calls
- **`src/utils/taskService.ts`** - Task and assignment management
- **`src/utils/analyticsService.ts`** - Analytics and performance metrics

### 2. **New Authentication System**

- **`src/context/AuthContext.tsx`** - Global authentication state management using React Context
- **`src/components/ProtectedRoute.tsx`** - Route protection component

### 3. **Rewritten Components**

- **Login Page** - Now calls backend API with proper error handling and validation
- **Signup Page** - Complete form validation and API integration with role selection
- **ProfileWidget** - Fetches user profile from API and allows editing
- **AssignedUsersWidget** - Loads actual mentors/mentees with their tasks from the API
- **Header Component** - Integrated logout functionality

### 4. **Updated App Structure**

- All routes are now protected by authentication
- AuthProvider wraps the entire application
- Automatic redirect to login for unauthenticated users

## Setup Instructions

### Step 1: Environment Configuration

Create a `.env` file in the frontend directory:

```
VITE_API_URL=http://localhost:8080/api
```

Or copy from `.env.example` and modify as needed.

### Step 2: Install Dependencies

```bash
cd frontend
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown by Vite).

## API Endpoints Used

The frontend expects the backend to provide these endpoints:

### Authentication

- `POST /api/auth/login` - Login user
- `POST /api/auth/signup` - Register new user

### Users

- `GET /api/users/profile` - Get current user profile
- `GET /api/users/{id}` - Get specific user
- `PUT /api/users/{id}` - Update user profile

### Mentors

- `GET /api/mentors/profile` - Get current mentor profile
- `GET /api/mentors/{id}` - Get mentor details
- `GET /api/mentors` - List all mentors
- `GET /api/mentors/skill/{skill}` - Search by skill
- `PUT /api/mentors/{id}` - Update mentor profile

### Mentees

- `GET /api/mentees/profile` - Get current mentee profile
- `GET /api/mentees/{id}` - Get mentee details
- `GET /api/mentees` - List all mentees
- `GET /api/mentees/{id}/mentors` - Get assigned mentors
- `POST /api/mentees/request-mentor` - Request a mentor

### Tasks

- `GET /api/tasks` - List tasks
- `GET /api/tasks/{id}` - Get task details
- `GET /api/tasks/mentor/{mentorId}` - Get tasks created by mentor
- `GET /api/tasks/mentee/{menteeId}` - Get tasks assigned to mentee
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `POST /api/tasks/{id}/comments` - Add comment

### Analytics

- `GET /api/analytics/mentor/{mentorId}` - Mentor performance metrics
- `GET /api/analytics/mentee/{menteeId}` - Mentee progress metrics
- `GET /api/analytics/batch/{batchId}` - Batch analytics

## Authentication Flow

1. **Login/Signup** - User submits credentials
2. **Token Storage** - JWT token is stored in localStorage
3. **Auto Header Injection** - API client automatically adds `Authorization: Bearer {token}` to all requests
4. **Route Protection** - ProtectedRoute checks authentication before allowing access
5. **Logout** - Clears token and redirects to login

## How to Use the Services

### Using Auth Service

```typescript
import { authService } from "@/utils/authService";

// Login
const response = await authService.login({
  email: "user@example.com",
  password: "password",
});

// Token is automatically stored
// Access user data from response
```

### Using User Service

```typescript
import { userService } from "@/utils/userService";

// Get current user
const profile = await userService.getCurrentUser();

// Update profile
await userService.updateProfile(userId, {
  firstName: "John",
  skills: ["React", "TypeScript"],
});
```

### Using Mentor/Mentee Services

```typescript
import { mentorService } from "@/utils/mentorService";
import { menteeService } from "@/utils/menteeService";

// Get mentor profile
const mentor = await mentorService.getCurrentMentorProfile();

// Get assigned mentors for mentee
const mentors = await menteeService.getAssignedMentors(menteeId);
```

## Error Handling

All services include error handling with user-friendly error messages. Components show:

- Loading spinners while fetching data
- Error messages if API calls fail
- Empty states when no data is available

Example:

```typescript
try {
  const data = await userService.getProfile(userId);
  setData(data);
} catch (err: any) {
  setError(err.message || "Failed to load data");
}
```

## Adding New API Calls

To add a new API endpoint:

1. Create/update a service file in `src/utils/`
2. Use the `apiClient` for making requests
3. Add TypeScript interfaces for request/response types
4. Use the service in components with proper error handling

Example:

```typescript
// src/utils/myService.ts
import { apiClient } from "./api";

export interface MyData {
  id: number;
  name: string;
}

export const myService = {
  getData: async (): Promise<MyData> => {
    return apiClient.get<MyData>("/my-endpoint");
  },
};
```

## Backend API Corrections Needed

The backend should ensure:

1. **Authentication Endpoints** return proper JWT tokens
2. **CORS Headers** are configured to allow frontend requests
3. **Token Validation** properly validates JWT in Authorization header
4. **Error Responses** return appropriate HTTP status codes and error messages
5. **Endpoints** match the structure expected by the frontend services

### Example Backend Response Format

```json
{
  "success": true,
  "data": {
    /* actual data */
  },
  "message": "Success"
}
```

## Testing the Integration

1. Start the backend on `http://localhost:8080`
2. Start the frontend on `http://localhost:5173`
3. Test signup at `/signup`
4. Test login at `/login`
5. After login, should see dashboard with real data
6. Edit profile to test updates
7. Click logout to test session termination

## Common Issues & Solutions

### "API connection failed"

- Check backend is running on correct port
- Verify `VITE_API_URL` in `.env` file
- Check browser console for CORS errors

### "Token not found" after login

- Check backend is returning authentication response correctly
- Verify `authService.setToken()` is being called

### Blank dashboard after login

- Check API endpoints match what's expected
- Verify user has proper role and data in database
- Check browser console for API errors

## Next Steps

1. Implement missing endpoints in backend for:
   - Getting assigned mentees for mentors
   - Group management endpoints
   - Admin dashboard endpoints

2. Add form validation enhancements

3. Implement pagination for large lists

4. Add real-time updates with WebSockets if needed

5. Add more comprehensive error handling and retries
