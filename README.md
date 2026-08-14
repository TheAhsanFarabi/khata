# Khata - Assignment Management System

Khata is a lightweight, role-based academic workflow platform designed for schools and colleges. Built with a clean B2B SaaS design aesthetic, it provides administrators, teachers, and students with a centralized dashboard to manage, submit, and grade coursework seamlessly.

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4 (Light theme, B2B aesthetic)
- **Language**: TypeScript
- **Auth**: Stateless JWT-based authentication

### Backend
- **Framework**: ASP.NET Core 8 Web API
- **Database**: Entity Framework Core (In-Memory Database for rapid prototyping)
- **Architecture**: MVC pattern with robust DTOs and Controllers
- **Auth**: JWT Bearer token authorization

---

## 🔑 Demo Credentials & Seeding Info

The application uses an **In-Memory Database**. Every time the .NET backend starts, `SeedData.cs` automatically populates the database with dummy users, classes, subjects, assignments, and submissions. You do not need to run any migrations to test the app.

You can log into the platform using the following demo credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@khata.com` | `admin123` |
| **Teacher** | `teacher@khata.com` | `teacher123` |
| **Student** | `student@khata.com` | `student123` |

*(Note: In the frontend login page, clicking on the credentials will automatically fill the form for you).*

---

## 🎯 Features

### Admin Workflow
- **User Management**: Register and delete users across all three roles.
- **Academic Structure**: Create and organize Classes and Subjects.
- **System Activity**: Monitor recent assignments and student submissions across the entire platform.
- **Global Settings**: Toggle Maintenance Mode (blocks non-admins), set Academic Year/Semester, and configure platform limits.

### Teacher Workflow
- **Coursework Management**: Create, edit, publish, and delete assignments.
- **Flexible Configurations**: Set max marks, exact deadlines (date and time), and toggle resubmission policies.
- **Grading Pipeline**: View all submissions for a specific assignment, assign scores, and leave constructive feedback.

### Student Workflow
- **Dashboard Overview**: Instantly track total due assignments, submitted work, and graded coursework.
- **Submit Answers**: Clean interface for submitting text-based answers to published coursework.
- **Real-time Statuses**: Keep track of whether an assignment is `Draft`, `Published`, `Late`, `Submitted`, or `Graded`.
- **View Feedback**: Access teacher scores and detailed feedback upon grading.

---

## 🔮 Future Scope

While the current implementation perfectly satisfies the assignment requirements, the following features would be implemented before a production release:

1. **Persistent Database Integration**: Transition from the EF Core In-Memory database to a robust relational database like PostgreSQL or SQL Server.
2. **File Uploads**: Implement cloud storage (e.g., AWS S3, Azure Blob Storage) to allow students to upload PDF/Word documents rather than relying strictly on text-box answers.
3. **Robust Security**: Replace the demo plaintext passwords with cryptographically secure hashing (e.g., BCrypt or Argon2).
4. **Notifications System**: Add email/SMS notifications alerting students of upcoming deadlines and notifying them when a teacher grades their submission.
5. **Pagination & Filtering**: Implement server-side pagination and advanced filtering on the data tables to support schools with thousands of concurrent users.

---

*Developer: Ahsan Farabi, CSE Graduate from UIU, Assignment for Onnorkom Projokti.*
