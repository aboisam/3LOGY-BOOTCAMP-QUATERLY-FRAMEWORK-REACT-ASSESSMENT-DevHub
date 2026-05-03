namespace server.DTOs;

public class UpdateSnippetDto
{
    public required string Title { get; set; }
    public string Description { get; set; } = string.Empty;
    public required string Code { get; set; }
    public required string Language { get; set; }
    public string Tags { get; set; } = string.Empty;
}
