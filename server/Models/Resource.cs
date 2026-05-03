namespace server.Models;

public class Resource
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Url { get; set; }
    public string Notes { get; set; } = string.Empty;
    public required string Type { get; set; }                  // "article", "video", "tool", "docs", "other"
    public string Tags { get; set; } = string.Empty;           // Comma-separated
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public User? User { get; set; }
}
