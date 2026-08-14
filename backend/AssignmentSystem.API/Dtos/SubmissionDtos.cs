using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.API.Dtos
{
    public class CreateSubmissionDto
    {
        public Guid AssignmentId { get; set; }
        [Required] public string AnswerText { get; set; } = string.Empty;
    }
    
    public class GradeSubmissionDto
    {
        [Required] public int Marks { get; set; }
        public string? Feedback { get; set; }
    }
}
