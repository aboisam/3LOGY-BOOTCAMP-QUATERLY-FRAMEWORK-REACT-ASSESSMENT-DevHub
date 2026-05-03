namespace server.DTOs;

public class CreateResourceDto
{
    public required string Title { get; set; }
    public required string Url { get; set; }
    public string Notes { get; set; } = string.Empty;
    public required string Type { get; set; }       // "article", "video", "tool", "docs", "other"
    public string Tags { get; set; } = string.Empty;
}
