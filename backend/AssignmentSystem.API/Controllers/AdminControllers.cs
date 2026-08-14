using AssignmentSystem.API.Data;
using AssignmentSystem.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UsersController(AppDbContext context) { _context = context; }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.Select(u => new { u.Id, u.Name, u.Email, Role = u.Role.ToString(), u.ClassId }).ToListAsync();
            return Ok(users);
        }

        public class CreateUserDto { 
            public string Name { get; set; } = string.Empty; 
            public string Email { get; set; } = string.Empty; 
            public string Password { get; set; } = string.Empty; 
            public Role Role { get; set; } 
            public Guid? ClassId { get; set; } 
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email)) return BadRequest("Email already exists");
            
            var user = new User { 
                Name = dto.Name, 
                Email = dto.Email, 
                PasswordHash = dto.Password, // Demo: Plain text
                Role = dto.Role, 
                ClassId = dto.Role == Role.Student ? dto.ClassId : null 
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { id = user.Id, message = "User created successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            if (user.Role == Role.Admin) return BadRequest("Cannot delete an Admin account from UI.");
            
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "User deleted successfully" });
        }
    }

    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class ClassesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ClassesController(AppDbContext context) { _context = context; }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetClasses() => Ok(await _context.Classes.ToListAsync());

        public class CreateClassDto { public string Name { get; set; } = string.Empty; }

        [HttpPost]
        public async Task<IActionResult> CreateClass([FromBody] CreateClassDto dto)
        {
            var newClass = new Class { Name = dto.Name };
            _context.Classes.Add(newClass);
            await _context.SaveChangesAsync();
            return Ok(newClass);
        }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class SubjectsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SubjectsController(AppDbContext context) { _context = context; }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetSubjects() => Ok(await _context.Subjects.Include(s => s.Class).Select(s => new { s.Id, s.Name, s.ClassId, ClassName = s.Class!.Name }).ToListAsync());

        public class CreateSubjectDto { public string Name { get; set; } = string.Empty; public Guid ClassId { get; set; } }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateSubject([FromBody] CreateSubjectDto dto)
        {
            var subject = new Subject { Name = dto.Name, ClassId = dto.ClassId };
            _context.Subjects.Add(subject);
            await _context.SaveChangesAsync();
            return Ok(subject);
        }

        public class AssignTeacherDto { public Guid TeacherId { get; set; } }

        [HttpPost("{id}/assign-teacher")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignTeacher(Guid id, [FromBody] AssignTeacherDto dto)
        {
            if (!await _context.Subjects.AnyAsync(s => s.Id == id) || !await _context.Users.AnyAsync(u => u.Id == dto.TeacherId && u.Role == Role.Teacher))
                return BadRequest("Invalid subject or teacher.");
            
            var ts = new TeacherSubject { SubjectId = id, TeacherId = dto.TeacherId };
            _context.TeacherSubjects.Add(ts);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Teacher assigned successfully" });
        }
    }
}
