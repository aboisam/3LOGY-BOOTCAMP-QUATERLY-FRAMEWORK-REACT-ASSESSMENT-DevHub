namespace server.DTOs;

public class UpdateResourceDto
{
    public required string Title { get; set; }
    public required string Url { get; set; }
    public string Notes { get; set; } = string.Empty;
    public required string Type { get; set; }
    public string Tags { get; set; } = string.Empty;
}
