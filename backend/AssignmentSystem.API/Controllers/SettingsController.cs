using AssignmentSystem.API.Data;
using AssignmentSystem.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SettingsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SettingsController(AppDbContext context) { _context = context; }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetSettings()
        {
            var settings = await _context.AppSettings.FirstOrDefaultAsync();
            if (settings == null)
            {
                settings = new AppSettings();
                _context.AppSettings.Add(settings);
                await _context.SaveChangesAsync();
            }
            return Ok(settings);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateSettings([FromBody] AppSettings dto)
        {
            var settings = await _context.AppSettings.FirstOrDefaultAsync();
            if (settings == null) return NotFound();

            settings.MaintenanceMode = dto.MaintenanceMode;
            settings.AllowPublicRegistration = dto.AllowPublicRegistration;
            settings.ActiveSemester = dto.ActiveSemester;
            settings.AcademicYear = dto.AcademicYear;
            settings.GradingScale = dto.GradingScale;
            settings.MaxFileUploadSizeBytes = dto.MaxFileUploadSizeBytes;
            settings.DefaultTimezone = dto.DefaultTimezone;

            await _context.SaveChangesAsync();
            return Ok(settings);
        }
    }
}
