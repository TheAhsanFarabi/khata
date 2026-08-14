using AssignmentSystem.API.Data;
using AssignmentSystem.API.Dtos;
using AssignmentSystem.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AssignmentSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(AppDbContext context, IConfiguration configuration, ILogger<AuthController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            
            // Note: Using plain text password comparison for demo per requirements (placeholder passwords)
            if (user == null || user.PasswordHash != request.Password)
            {
                _logger.LogWarning("Failed login attempt for {Email}", request.Email);
                return Unauthorized(new { message = "Invalid email or password" });
            }

            var settings = await _context.AppSettings.FirstOrDefaultAsync();
            if (settings != null && settings.MaintenanceMode && user.Role != Role.Admin)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, new { message = "System is currently under maintenance. Only administrators can log in." });
            }

            var token = GenerateJwtToken(user);
            
            return Ok(new AuthResponseDto
            {
                Token = token,
                User = new UserDto 
                { 
                    Id = user.Id, 
                    Name = user.Name, 
                    Email = user.Email, 
                    Role = user.Role.ToString(), 
                    ClassId = user.ClassId 
                }
            });
        }

        private string GenerateJwtToken(User user)
        {
            var key = _configuration["Jwt:Key"];
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            if (user.ClassId.HasValue)
            {
                claims.Add(new Claim("ClassId", user.ClassId.Value.ToString()));
            }

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(4),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
