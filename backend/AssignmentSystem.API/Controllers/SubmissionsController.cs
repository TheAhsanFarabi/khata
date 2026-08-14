using AssignmentSystem.API.Data;
using AssignmentSystem.API.Dtos;
using AssignmentSystem.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AssignmentSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SubmissionsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SubmissionsController(AppDbContext context) { _context = context; }

        [HttpGet("assignment/{assignmentId}")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> GetSubmissionsForAssignment(Guid assignmentId)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var assignment = await _context.Assignments.FindAsync(assignmentId);
            if (assignment == null) return NotFound();

            if (role == nameof(Role.Teacher) && assignment.CreatedByTeacherId != userId)
                return Forbid();

            var submissions = await _context.Submissions
                .Include(s => s.Student)
                .Where(s => s.AssignmentId == assignmentId)
                .Select(s => new {
                    s.Id, s.StudentId, StudentName = s.Student!.Name, s.AnswerText,
                    s.SubmittedAt, Status = s.Status.ToString(), s.Marks, s.Feedback, s.GradedAt
                }).ToListAsync();
            return Ok(submissions);
        }

        [HttpGet("mine")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetMySubmissions()
        {
            var studentId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var submissions = await _context.Submissions
                .Where(s => s.StudentId == studentId)
                .Select(s => new {
                    s.Id, s.AssignmentId, s.AnswerText, s.SubmittedAt, Status = s.Status.ToString(), s.Marks, s.Feedback, s.GradedAt
                }).ToListAsync();
            return Ok(submissions);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllSubmissions()
        {
            var submissions = await _context.Submissions
                .Include(s => s.Student)
                .Include(s => s.Assignment)
                .Select(s => new {
                    s.Id, StudentName = s.Student!.Name, AssignmentTitle = s.Assignment!.Title,
                    s.SubmittedAt, Status = s.Status.ToString(), s.Marks, s.Feedback, s.GradedAt
                }).ToListAsync();
            return Ok(submissions);
        }

        [HttpPost]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> Submit([FromBody] CreateSubmissionDto dto)
        {
            var studentId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var classIdClaim = User.FindFirst("ClassId")?.Value;
            if (string.IsNullOrEmpty(classIdClaim)) return Forbid();
            var classId = Guid.Parse(classIdClaim);

            var assignment = await _context.Assignments.FindAsync(dto.AssignmentId);
            if (assignment == null || !assignment.IsPublished || assignment.ClassId != classId)
                return BadRequest("Invalid assignment or assignment is not available.");

            if (DateTime.UtcNow > assignment.Deadline)
                return BadRequest("Deadline has passed.");

            var existingSubmission = await _context.Submissions
                .FirstOrDefaultAsync(s => s.AssignmentId == dto.AssignmentId && s.StudentId == studentId);

            if (existingSubmission != null)
            {
                if (!assignment.AllowResubmission)
                    return BadRequest("Resubmission is not allowed for this assignment.");
                
                if (existingSubmission.Status == SubmissionStatus.Graded)
                    return BadRequest("Cannot resubmit after being graded.");

                existingSubmission.AnswerText = dto.AnswerText;
                existingSubmission.SubmittedAt = DateTime.UtcNow;
                existingSubmission.Status = SubmissionStatus.Submitted;
                await _context.SaveChangesAsync();
                return Ok(new { id = existingSubmission.Id, message = "Resubmitted successfully" });
            }

            var submission = new Submission
            {
                AssignmentId = dto.AssignmentId,
                StudentId = studentId,
                AnswerText = dto.AnswerText,
                SubmittedAt = DateTime.UtcNow,
                Status = SubmissionStatus.Submitted
            };

            _context.Submissions.Add(submission);
            await _context.SaveChangesAsync();
            return Ok(new { id = submission.Id, message = "Submitted successfully" });
        }

        [HttpPost("{id}/grade")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> Grade(Guid id, [FromBody] GradeSubmissionDto dto)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var submission = await _context.Submissions
                .Include(s => s.Assignment)
                .FirstOrDefaultAsync(s => s.Id == id);
            
            if (submission == null) return NotFound();

            if (role == nameof(Role.Teacher) && submission.Assignment!.CreatedByTeacherId != userId)
                return Forbid();

            if (dto.Marks > submission.Assignment!.MaxMarks)
                return BadRequest($"Marks cannot exceed the maximum marks of {submission.Assignment.MaxMarks}");

            submission.Marks = dto.Marks;
            submission.Feedback = dto.Feedback;
            submission.Status = SubmissionStatus.Graded;
            submission.GradedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            return Ok(new { id = submission.Id, message = "Graded successfully" });
        }
    }
}
