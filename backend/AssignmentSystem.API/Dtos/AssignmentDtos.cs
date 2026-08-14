using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.API.Dtos
{
    public class CreateAssignmentDto
    {
        [Required, MaxLength(200)] public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Guid SubjectId { get; set; }
        public Guid ClassId { get; set; }
        public DateTime Deadline { get; set; }
        [Range(1, 1000)] public int MaxMarks { get; set; }
        public bool IsPublished { get; set; }
        public bool AllowResubmission { get; set; }
        public Guid? CreatedByTeacherId { get; set; }
    }
}
