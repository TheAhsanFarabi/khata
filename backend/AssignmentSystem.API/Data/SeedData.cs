using AssignmentSystem.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.API.Data
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var context = new AppDbContext(serviceProvider.GetRequiredService<DbContextOptions<AppDbContext>>());
            
            // Use EnsureCreated for InMemory DB (Change back to context.Database.Migrate() when using Postgres)
            context.Database.EnsureCreated();

            if (!context.AppSettings.Any())
            {
                context.AppSettings.Add(new AppSettings());
                context.SaveChanges();
            }

            if (context.Users.Any()) return;

            var class1 = new Class { Name = "Computer Science 101" };
            context.Classes.Add(class1);
            context.SaveChanges();

            // Using plain text passwords for demo credentials as requested in assignment "placeholder-but-functional passwords"
            // (A real app would use a robust PasswordHasher like BCrypt)
            var admin = new User { Name = "Admin User", Email = "admin@khata.com", PasswordHash = "admin123", Role = Role.Admin };
            var teacher1 = new User { Name = "John Teacher", Email = "teacher@khata.com", PasswordHash = "teacher123", Role = Role.Teacher };
            var teacher2 = new User { Name = "Jane Teacher", Email = "jane@khata.com", PasswordHash = "teacher123", Role = Role.Teacher };
            var student1 = new User { Name = "Alice Student", Email = "student@khata.com", PasswordHash = "student123", Role = Role.Student, ClassId = class1.Id };
            var student2 = new User { Name = "Bob Student", Email = "bob@khata.com", PasswordHash = "student123", Role = Role.Student, ClassId = class1.Id };

            context.Users.AddRange(admin, teacher1, teacher2, student1, student2);
            context.SaveChanges();

            var subject1 = new Subject { Name = "Algorithms", ClassId = class1.Id };
            var subject2 = new Subject { Name = "Data Structures", ClassId = class1.Id };
            context.Subjects.AddRange(subject1, subject2);
            context.SaveChanges();

            context.TeacherSubjects.AddRange(
                new TeacherSubject { TeacherId = teacher1.Id, SubjectId = subject1.Id },
                new TeacherSubject { TeacherId = teacher2.Id, SubjectId = subject2.Id }
            );
            context.SaveChanges();

            var assignment1 = new Assignment { Title = "Sorting Algorithms", Description = "Implement Quicksort and Mergesort.", Deadline = DateTime.UtcNow.AddDays(7), MaxMarks = 100, SubjectId = subject1.Id, CreatedByTeacherId = teacher1.Id, ClassId = class1.Id, IsPublished = true };
            var assignment2 = new Assignment { Title = "Graphs", Description = "Explain BFS and DFS.", Deadline = DateTime.UtcNow.AddDays(14), MaxMarks = 50, SubjectId = subject1.Id, CreatedByTeacherId = teacher1.Id, ClassId = class1.Id, IsPublished = true };
            context.Assignments.AddRange(assignment1, assignment2);
            context.SaveChanges();

            var submission1 = new Submission { AssignmentId = assignment1.Id, StudentId = student1.Id, AnswerText = "Here is my Quicksort implementation...", SubmittedAt = DateTime.UtcNow, Status = SubmissionStatus.Submitted };
            context.Submissions.Add(submission1);
            context.SaveChanges();

        }
    }
}
