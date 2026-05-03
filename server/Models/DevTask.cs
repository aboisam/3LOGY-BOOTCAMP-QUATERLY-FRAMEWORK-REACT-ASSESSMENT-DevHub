namespace server.Models;

public class DevTask
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "todo";              // "todo", "in-progress", "done"
    public string Priority { get; set; } = "medium";           // "low", "medium", "high"
    public string Project { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public User? User { get; set; }
}
