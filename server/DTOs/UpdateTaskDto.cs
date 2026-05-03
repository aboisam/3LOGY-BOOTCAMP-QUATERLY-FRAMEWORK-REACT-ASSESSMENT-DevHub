namespace server.DTOs;

public class UpdateTaskDto
{
    public required string Title { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "todo";
    public string Priority { get; set; } = "medium";
    public string Project { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
}
