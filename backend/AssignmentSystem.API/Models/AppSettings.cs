using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.API.Models
{
    public class AppSettings
    {
        [Key]
        public Guid Id { get; set; }
        
        // System Toggles
        public bool MaintenanceMode { get; set; } = false;
        public bool AllowPublicRegistration { get; set; } = true;

        // Academic Config
        public string ActiveSemester { get; set; } = "Fall 2026";
        public string AcademicYear { get; set; } = "2026-2027";

        // Grading Scale
        public string GradingScale { get; set; } = "Percentage"; // "Percentage" or "Letter"

        // Platform Limits
        public int MaxFileUploadSizeBytes { get; set; } = 5242880; // 5MB
        public string DefaultTimezone { get; set; } = "UTC";
    }
}
