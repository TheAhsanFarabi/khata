using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.API.Models
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        [Required, MaxLength(100)] public string Name { get; set; } = string.Empty;
        [Required, EmailAddress, MaxLength(150)] public string Email { get; set; } = string.Empty;
        [Required] public string PasswordHash { get; set; } = string.Empty;
        public Role Role { get; set; }
        public Guid? ClassId { get; set; }
        public Class? Class { get; set; }
        public ICollection<TeacherSubject> TeacherSubjects { get; set; } = new List<TeacherSubject>();
    }
}
