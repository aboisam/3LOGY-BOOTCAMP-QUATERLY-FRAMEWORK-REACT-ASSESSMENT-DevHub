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
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim!);
    }

    // GET /api/tasks — Get all tasks for the logged-in user
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();
        var tasks = await _context.DevTasks
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new
            {
                t.Id,
                t.Title,
                t.Description,
                t.Status,
                t.Priority,
                t.Project,
                t.DueDate,
                t.CreatedAt,
                t.UpdatedAt
            })
            .ToListAsync();

        return Ok(tasks);
    }

    // GET /api/tasks/{id} — Get a single task
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userId = GetUserId();
        var task = await _context.DevTasks
            .Where(t => t.Id == id && t.UserId == userId)
            .Select(t => new
            {
                t.Id,
                t.Title,
                t.Description,
                t.Status,
                t.Priority,
                t.Project,
                t.DueDate,
                t.CreatedAt,
                t.UpdatedAt
            })
            .FirstOrDefaultAsync();

        if (task == null)
            return NotFound(new { error = "Task not found" });

        return Ok(task);
    }

    // POST /api/tasks — Create a new task
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTaskDto dto)
    {
        var userId = GetUserId();

        var task = new DevTask
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            Status = dto.Status,
            Priority = dto.Priority,
            Project = dto.Project,
            DueDate = dto.DueDate,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _context.DevTasks.AddAsync(task);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = task.Id }, new
        {
            task.Id,
            task.Title,
            task.Description,
            task.Status,
            task.Priority,
            task.Project,
            task.DueDate,
            task.CreatedAt,
            task.UpdatedAt
        });
    }

    // PUT /api/tasks/{id} — Update a task
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTaskDto dto)
    {
        var userId = GetUserId();
        var task = await _context.DevTasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (task == null)
            return NotFound(new { error = "Task not found" });

        task.Title = dto.Title;
        task.Description = dto.Description;
        task.Status = dto.Status;
        task.Priority = dto.Priority;
        task.Project = dto.Project;
        task.DueDate = dto.DueDate;
        task.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            task.Id,
            task.Title,
            task.Description,
            task.Status,
            task.Priority,
            task.Project,
            task.DueDate,
            task.CreatedAt,
            task.UpdatedAt
        });
    }

    // PATCH /api/tasks/{id}/status — Quick status toggle
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateTaskStatusDto dto)
    {
        var userId = GetUserId();
        var task = await _context.DevTasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (task == null)
            return NotFound(new { error = "Task not found" });

        // Validate status value
        var validStatuses = new[] { "todo", "in-progress", "done" };
        if (!validStatuses.Contains(dto.Status.ToLower()))
            return BadRequest(new { error = "Invalid status. Must be: todo, in-progress, or done" });

        task.Status = dto.Status.ToLower();
        task.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            task.Id,
            task.Title,
            task.Status,
            task.UpdatedAt
        });
    }

    // DELETE /api/tasks/{id} — Delete a task
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetUserId();
        var task = await _context.DevTasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (task == null)
            return NotFound(new { error = "Task not found" });

        _context.DevTasks.Remove(task);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Task deleted successfully" });
    }
}
