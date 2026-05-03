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
public class ResourcesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ResourcesController(AppDbContext context)
    {
        _context = context;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim!);
    }

    // GET /api/resources — Get all resources for the logged-in user
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();
        var resources = await _context.Resources
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new
            {
                r.Id,
                r.Title,
                r.Url,
                r.Notes,
                r.Type,
                r.Tags,
                r.CreatedAt
            })
            .ToListAsync();

        return Ok(resources);
    }

    // GET /api/resources/{id} — Get a single resource
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userId = GetUserId();
        var resource = await _context.Resources
            .Where(r => r.Id == id && r.UserId == userId)
            .Select(r => new
            {
                r.Id,
                r.Title,
                r.Url,
                r.Notes,
                r.Type,
                r.Tags,
                r.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (resource == null)
            return NotFound(new { error = "Resource not found" });

        return Ok(resource);
    }

    // POST /api/resources — Create a new resource
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateResourceDto dto)
    {
        var userId = GetUserId();

        var resource = new Resource
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Url = dto.Url,
            Notes = dto.Notes,
            Type = dto.Type,
            Tags = dto.Tags,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Resources.AddAsync(resource);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = resource.Id }, new
        {
            resource.Id,
            resource.Title,
            resource.Url,
            resource.Notes,
            resource.Type,
            resource.Tags,
            resource.CreatedAt
        });
    }

    // PUT /api/resources/{id} — Update a resource
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateResourceDto dto)
    {
        var userId = GetUserId();
        var resource = await _context.Resources
            .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

        if (resource == null)
            return NotFound(new { error = "Resource not found" });

        resource.Title = dto.Title;
        resource.Url = dto.Url;
        resource.Notes = dto.Notes;
        resource.Type = dto.Type;
        resource.Tags = dto.Tags;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            resource.Id,
            resource.Title,
            resource.Url,
            resource.Notes,
            resource.Type,
            resource.Tags,
            resource.CreatedAt
        });
    }

    // DELETE /api/resources/{id} — Delete a resource
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetUserId();
        var resource = await _context.Resources
            .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

        if (resource == null)
            return NotFound(new { error = "Resource not found" });

        _context.Resources.Remove(resource);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Resource deleted successfully" });
    }
}
