namespace AssignmentSystem.API.Models
{
    public class TeacherSubject
    {
        public Guid TeacherId { get; set; }
        public User? Teacher { get; set; }
        public Guid SubjectId { get; set; }
        public Subject? Subject { get; set; }
    }
}
