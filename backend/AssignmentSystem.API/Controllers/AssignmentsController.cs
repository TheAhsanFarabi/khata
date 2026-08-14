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
    public class AssignmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AssignmentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAssignments()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var query = _context.Assignments
                .Include(a => a.Subject)
                .Include(a => a.Class)
                .AsQueryable();

            if (role == nameof(Role.Student))
            {
                var classIdClaim = User.FindFirst("ClassId")?.Value;
                if (string.IsNullOrEmpty(classIdClaim)) return Forbid();
                var classId = Guid.Parse(classIdClaim);
                
                query = query.Where(a => a.IsPublished && a.ClassId == classId);
            }
            else if (role == nameof(Role.Teacher))
            {
                query = query.Where(a => a.CreatedByTeacherId == userId);
            }

            var assignments = await query.Select(a => new
            {
                a.Id, a.Title, a.Description, a.Deadline, a.MaxMarks, a.IsPublished, a.AllowResubmission,
                SubjectName = a.Subject!.Name, ClassName = a.Class!.Name
            }).ToListAsync();
            
            return Ok(assignments);
        }

        [HttpPost]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> CreateAssignment([FromBody] CreateAssignmentDto dto)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (role == nameof(Role.Teacher))
            {
                var isAssigned = await _context.TeacherSubjects
                    .AnyAsync(ts => ts.TeacherId == userId && ts.SubjectId == dto.SubjectId);
                if (!isAssigned) return BadRequest("You are not assigned to teach this subject.");

                var subjectClass = await _context.Subjects.FirstOrDefaultAsync(s => s.Id == dto.SubjectId);
                if (subjectClass == null || subjectClass.ClassId != dto.ClassId)
                    return BadRequest(new { message = "Subject does not belong to the specified class." });
            }

            var assignment = new Assignment
            {
                Title = dto.Title,
                Description = dto.Description,
                SubjectId = dto.SubjectId,
                ClassId = dto.ClassId,
                Deadline = dto.Deadline.ToUniversalTime(),
                MaxMarks = dto.MaxMarks,
                IsPublished = dto.IsPublished,
                AllowResubmission = dto.AllowResubmission,
                CreatedByTeacherId = role == nameof(Role.Teacher) ? userId : (dto.CreatedByTeacherId ?? userId)
            };

            _context.Assignments.Add(assignment);
            await _context.SaveChangesAsync();

            return Ok(new { 
                id = assignment.Id, 
                title = assignment.Title, 
                message = "Assignment created successfully" 
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> UpdateAssignment(Guid id, [FromBody] CreateAssignmentDto dto)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            var assignment = await _context.Assignments.FindAsync(id);
            if (assignment == null) return NotFound();

            if (role == nameof(Role.Teacher) && assignment.CreatedByTeacherId != userId)
                return Forbid();

            if (role == nameof(Role.Teacher) && assignment.SubjectId != dto.SubjectId)
            {
                var isAssigned = await _context.TeacherSubjects.AnyAsync(ts => ts.TeacherId == userId && ts.SubjectId == dto.SubjectId);
                if (!isAssigned) return BadRequest("You are not assigned to teach this subject.");
            }

            assignment.Title = dto.Title;
            assignment.Description = dto.Description;
            assignment.SubjectId = dto.SubjectId;
            assignment.ClassId = dto.ClassId;
            assignment.Deadline = dto.Deadline.ToUniversalTime();
            assignment.MaxMarks = dto.MaxMarks;
            assignment.IsPublished = dto.IsPublished;
            assignment.AllowResubmission = dto.AllowResubmission;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Assignment updated successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> DeleteAssignment(Guid id)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            var assignment = await _context.Assignments.FindAsync(id);
            if (assignment == null) return NotFound();

            if (role == nameof(Role.Teacher) && assignment.CreatedByTeacherId != userId)
                return Forbid();

            _context.Assignments.Remove(assignment);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Assignment deleted successfully" });
        }
    }
}
