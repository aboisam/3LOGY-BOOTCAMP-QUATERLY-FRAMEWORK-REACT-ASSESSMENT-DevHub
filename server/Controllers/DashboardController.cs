using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using server.Data;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim!);
    }

    // GET /api/dashboard/stats — Get summary stats + recent items
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var userId = GetUserId();

        // Count totals
        var snippetCount = await _context.Snippets.CountAsync(s => s.UserId == userId);
        var resourceCount = await _context.Resources.CountAsync(r => r.UserId == userId);
        var taskCount = await _context.DevTasks.CountAsync(t => t.UserId == userId);

        // Task counts by status
        var todoCount = await _context.DevTasks.CountAsync(t => t.UserId == userId && t.Status == "todo");
        var inProgressCount = await _context.DevTasks.CountAsync(t => t.UserId == userId && t.Status == "in-progress");
        var doneCount = await _context.DevTasks.CountAsync(t => t.UserId == userId && t.Status == "done");

        // Recent snippets (last 5)
        var recentSnippets = await _context.Snippets
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.CreatedAt)
            .Take(5)
            .Select(s => new
            {
                s.Id,
                s.Title,
                s.Language,
                s.CreatedAt
            })
            .ToListAsync();

        // Recent resources (last 5)
        var recentResources = await _context.Resources
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .Take(5)
            .Select(r => new
            {
                r.Id,
                r.Title,
                r.Type,
                r.CreatedAt
            })
            .ToListAsync();

        // Recent tasks (last 5)
        var recentTasks = await _context.DevTasks
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .Take(5)
            .Select(t => new
            {
                t.Id,
                t.Title,
                t.Status,
                t.Priority,
                t.CreatedAt
            })
            .ToListAsync();

        return Ok(new
        {
            totals = new
            {
                snippets = snippetCount,
                resources = resourceCount,
                tasks = taskCount
            },
            tasksByStatus = new
            {
                todo = todoCount,
                inProgress = inProgressCount,
                done = doneCount
            },
            recent = new
            {
                snippets = recentSnippets,
                resources = recentResources,
                tasks = recentTasks
            }
        });
    }
}
