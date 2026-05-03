namespace server.DTOs;

public class CreateTaskDto
{
    public required string Title { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "todo";         // "todo", "in-progress", "done"
    public string Priority { get; set; } = "medium";      // "low", "medium", "high"
    public string Project { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
}
