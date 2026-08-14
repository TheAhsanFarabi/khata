using AssignmentSystem.API.Controllers;
using AssignmentSystem.API.Data;
using AssignmentSystem.API.Dtos;
using AssignmentSystem.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Xunit;

namespace AssignmentSystem.Tests
{
    public class SubmissionsControllerTests
    {
        private AppDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        private SubmissionsController GetController(AppDbContext context, Guid userId, Role role, Guid? classId = null)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Role, role.ToString())
            };
            
            if (classId.HasValue)
                claims.Add(new Claim("ClassId", classId.Value.ToString()));

            var user = new ClaimsPrincipal(new ClaimsIdentity(claims, "TestAuth"));
            var controller = new SubmissionsController(context)
            {
                ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = user } }
            };
            return controller;
        }

        [Fact]
        public async Task Submit_AfterDeadline_ReturnsBadRequest()
        {
            var context = GetDbContext();
            var studentId = Guid.NewGuid();
            var classId = Guid.NewGuid();
            
            var assignment = new Assignment { Id = Guid.NewGuid(), Deadline = DateTime.UtcNow.AddDays(-1), IsPublished = true, ClassId = classId, AllowResubmission = false };
            context.Assignments.Add(assignment);
            await context.SaveChangesAsync();

            var controller = GetController(context, studentId, Role.Student, classId);
            
            var result = await controller.Submit(new CreateSubmissionDto { AssignmentId = assignment.Id, AnswerText = "Late answer" });

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Deadline has passed.", badRequest.Value);
        }

        [Fact]
        public async Task Grade_MarksExceedMax_ReturnsBadRequest()
        {
            var context = GetDbContext();
            var teacherId = Guid.NewGuid();
            
            var assignment = new Assignment { Id = Guid.NewGuid(), MaxMarks = 50, CreatedByTeacherId = teacherId };
            var submission = new Submission { Id = Guid.NewGuid(), AssignmentId = assignment.Id, Assignment = assignment };
            context.Submissions.Add(submission);
            await context.SaveChangesAsync();

            var controller = GetController(context, teacherId, Role.Teacher);
            
            var result = await controller.Grade(submission.Id, new GradeSubmissionDto { Marks = 60, Feedback = "Good" });

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("Marks cannot exceed the maximum marks", badRequest.Value!.ToString());
        }

        [Fact]
        public async Task Grade_TeacherNotCreator_ReturnsForbid()
        {
            var context = GetDbContext();
            var teacherId1 = Guid.NewGuid();
            var teacherId2 = Guid.NewGuid(); 
            
            var assignment = new Assignment { Id = Guid.NewGuid(), MaxMarks = 50, CreatedByTeacherId = teacherId1 };
            var submission = new Submission { Id = Guid.NewGuid(), AssignmentId = assignment.Id, Assignment = assignment };
            context.Submissions.Add(submission);
            await context.SaveChangesAsync();

            var controller = GetController(context, teacherId2, Role.Teacher);
            
            var result = await controller.Grade(submission.Id, new GradeSubmissionDto { Marks = 40 });

            Assert.IsType<ForbidResult>(result);
        }
    }
}
