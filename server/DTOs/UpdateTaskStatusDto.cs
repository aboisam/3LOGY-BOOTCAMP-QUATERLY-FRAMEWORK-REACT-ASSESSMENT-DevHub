namespace server.DTOs;

public class UpdateTaskStatusDto
{
    public required string Status { get; set; }   // "todo", "in-progress", "done"
}
