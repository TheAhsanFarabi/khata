# Assignment & Submission Management System

A role-based school/college application for evaluating understanding of requirements, system design, API development, frontend implementation, and testing.

## Features
- **Admin**: View and manage system users, classes, and subjects.
- **Teacher**: Create, update, and publish assignments. View submissions and provide grades/feedback.
- **Student**: View available assignments for their class, submit answers, and view grades/feedback.

## Tech Stack
- **Frontend**: Next.js (App Router) + React + TypeScript + Tailwind CSS
- **Backend**: ASP.NET Core Web API (C#, .NET 8)
- **Database**: PostgreSQL via EF Core (Npgsql)
- **Testing**: xUnit + InMemory Database
- **Authentication**: JWT-based authentication

## Project Structure
- `/backend`: ASP.NET Core 8 Web API & xUnit tests
- `/frontend`: Next.js application
- `docker-compose.yml`: Local PostgreSQL setup

## Setup Instructions

### 1. Database Setup (Docker)
Ensure Docker is installed, then run:
```bash
docker compose up -d
```
*Note: EF Core migrations are configured to run automatically on application startup (via `SeedData.cs`), so no manual `dotnet ef database update` is required.*

### 2. Backend Setup
1. Open a terminal and navigate to the backend API folder:
```bash
cd backend/AssignmentSystem.API
```
2. Build and run the API (it will automatically create the DB schema and seed data):
```bash
dotnet run
```
The API will be available at `http://localhost:5000` or `https://localhost:5001`. Swagger UI is at `/swagger`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### 4. Running Tests
To run the xUnit tests verifying business rules:
```bash
cd backend/AssignmentSystem.Tests
dotnet test
```

## Demo Credentials
The system automatically seeds the following users on startup:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@school.com` | `admin123` |
| **Teacher** | `john@school.com` | `teacher123` |
| **Student** | `alice@school.com` | `student123` |

## Assumptions & Design Decisions
1. **JWT Storage**: The JWT is stored in `localStorage` for simplicity in this demo. In a high-security production app, HTTP-only cookies are recommended.
2. **Password Hashing**: Passwords for seeded demo users are stored as plain text per the "placeholder-but-functional" request. In production, ASP.NET Core Identity's `PasswordHasher` or `BCrypt` should be used.
3. **Admin Controllers**: Minimal controllers for `Users`, `Classes`, and `Subjects` were implemented to fulfill the Admin dashboard requirement.
4. **Resubmission**: If an assignment allows resubmission, students can resubmit until the deadline *unless* it has already been graded.

## Known Limitations
- The frontend UI uses simplified mocked views for standard CRUD operations to keep the boilerplate manageable. The backend fully supports these endpoints.
