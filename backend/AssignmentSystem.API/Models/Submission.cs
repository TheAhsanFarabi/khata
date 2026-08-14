using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.API.Models
{
    public class Submission
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid AssignmentId { get; set; }
        public Assignment? Assignment { get; set; }
        public Guid StudentId { get; set; }
        public User? Student { get; set; }
        public string AnswerText { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
        public SubmissionStatus Status { get; set; } = SubmissionStatus.Submitted;
        public int? Marks { get; set; }
        public string? Feedback { get; set; }
        public DateTime? GradedAt { get; set; }
    }
}
