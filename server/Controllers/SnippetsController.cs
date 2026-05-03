using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using server.Data;
using server.Models;
using server.DTOs;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SnippetsController : ControllerBase
{
    private readonly AppDbContext _context;

    public SnippetsController(AppDbContext context)
    {
        _context = context;
    }

    // Helper: Extract userId from JWT claims
    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim!);
    }

    // GET /api/snippets — Get all snippets for the logged-in user
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();
        var snippets = await _context.Snippets
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => new
            {
                s.Id,
                s.Title,
                s.Description,
                s.Code,
                s.Language,
                s.Tags,
                s.CreatedAt,
                s.UpdatedAt
            })
            .ToListAsync();

        return Ok(snippets);
    }

    // GET /api/snippets/{id} — Get a single snippet by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userId = GetUserId();
        var snippet = await _context.Snippets
            .Where(s => s.Id == id && s.UserId == userId)
            .Select(s => new
            {
                s.Id,
                s.Title,
                s.Description,
                s.Code,
                s.Language,
                s.Tags,
                s.CreatedAt,
                s.UpdatedAt
            })
            .FirstOrDefaultAsync();

        if (snippet == null)
            return NotFound(new { error = "Snippet not found" });

        return Ok(snippet);
    }

    // POST /api/snippets — Create a new snippet
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSnippetDto dto)
    {
        var userId = GetUserId();

        var snippet = new Snippet
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            Code = dto.Code,
            Language = dto.Language,
            Tags = dto.Tags,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _context.Snippets.AddAsync(snippet);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = snippet.Id }, new
        {
            snippet.Id,
            snippet.Title,
            snippet.Description,
            snippet.Code,
            snippet.Language,
            snippet.Tags,
            snippet.CreatedAt,
            snippet.UpdatedAt
        });
    }

    // PUT /api/snippets/{id} — Update an existing snippet
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSnippetDto dto)
    {
        var userId = GetUserId();
        var snippet = await _context.Snippets
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

        if (snippet == null)
            return NotFound(new { error = "Snippet not found" });

        snippet.Title = dto.Title;
        snippet.Description = dto.Description;
        snippet.Code = dto.Code;
        snippet.Language = dto.Language;
        snippet.Tags = dto.Tags;
        snippet.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            snippet.Id,
            snippet.Title,
            snippet.Description,
            snippet.Code,
            snippet.Language,
            snippet.Tags,
            snippet.CreatedAt,
            snippet.UpdatedAt
        });
    }

    // DELETE /api/snippets/{id} — Delete a snippet
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetUserId();
        var snippet = await _context.Snippets
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

        if (snippet == null)
            return NotFound(new { error = "Snippet not found" });

        _context.Snippets.Remove(snippet);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Snippet deleted successfully" });
    }
}
