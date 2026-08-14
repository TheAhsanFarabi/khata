using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.API.Models
{
    public class Subject
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        [Required, MaxLength(100)] public string Name { get; set; } = string.Empty;
        public Guid ClassId { get; set; }
        public Class? Class { get; set; }
        public ICollection<TeacherSubject> TeacherSubjects { get; set; } = new List<TeacherSubject>();
    }
}
