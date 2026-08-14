using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.API.Models
{
    public class Assignment
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        [Required, MaxLength(200)] public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Guid SubjectId { get; set; }
        public Subject? Subject { get; set; }
        public Guid ClassId { get; set; }
        public Class? Class { get; set; }
        public DateTime Deadline { get; set; }
        public int MaxMarks { get; set; }
        public bool IsPublished { get; set; }
        public bool AllowResubmission { get; set; }
        public Guid CreatedByTeacherId { get; set; }
        public User? CreatedByTeacher { get; set; }
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    }
}
