using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.API.Models
{
    public class Class
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        [Required, MaxLength(100)] public string Name { get; set; } = string.Empty;
        public ICollection<User> Students { get; set; } = new List<User>();
        public ICollection<Subject> Subjects { get; set; } = new List<Subject>();
    }
}
