# Bug Tracking System

## Project Overview
This bug tracking system is developed for my Server Programming class, featuring a React frontend and PHP backend. It efficiently manages bugs across various projects with role-based access control.

## Key Features
- Single Page Application (SPA) with React
- RESTful API backend in PHP
- User Authentication with sessions
- Role-Based Access Control: Admin, Manager, and User roles
- Bug Management: CRUD operations for bugs
- Project Management: Create and manage projects (Admin and Manager)
- User Management: Add, update, and delete users (Admin only)
- Data Visualization: Dynamic views of bugs by project, status, and due date
- Security: Input validation, data sanitization, and password hashing

## Users to Test
- **Admin**: Username: `sam@me.me`, Password: `me`
- **Manager**: Username: `meg@me.me`, Password: `me`
- **User**: Username: `steve@me.me`, Password: `me`

## System Architecture Diagram

```mermaid
graph LR
    A[Web App] <--> B[API]
    B <--> C[Controller]
    C <--> D[(Database)]
```

## Technical Stack
- Frontend: React
- Backend: PHP
- Database: MySQL
- API: RESTful
- Authentication: Sessions

## API Endpoints
- `/api/auth` - Authentication endpoints
- `/api/bugs` - Bug management endpoints
- `/api/projects` - Project management endpoints
- `/api/users` - User management endpoints

## User Roles and Permissions
- **Admin**: Full system access
- **Manager**: Project and bug management across all projects
- **User**: Bug entry and management within assigned project

## Security Measures
- Session-based authentication
- Password hashing using bcrypt
- Parameterized queries to prevent SQL injection
- Input validation on both frontend and backend

## Code Structure

### Frontend
- Components: Reusable React components
- Hooks: API communication services

### Backend
- Index: Entry point for API requests
- Controllers: Handle API requests
- Seed: Initial data for database

## Development
- Frontend: Run `bun run dev` in the frontend directory
- Backend: Ensure your PHP server is running and pointing to the backend directory

## Deployment
- Frontend: Build using `bun run build`, deploy the `build` folder
- Backend: Deploy PHP files to a production PHP server
