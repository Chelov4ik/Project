using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Proj.Context;
using Proj.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Proj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/user
        [HttpGet]
        [Authorize(Roles = "admin,manager")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // POST: api/user/{userId}/tasks
        [HttpPost("{userId}/tasks")]
        [Authorize(Roles = "admin,manager")]
        public async Task<IActionResult> AssignTaskToUser(int userId, [FromBody] int taskId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound($"User with ID {userId} not found.");
            }

            // Проверяем, существует ли задача
            var taskExists = await _context.Tasks.AnyAsync(t => t.Id == taskId);
            if (!taskExists)
            {
                return NotFound($"Task with ID {taskId} not found.");
            }

            // Добавление ID задачи к пользователю
            if (!user.TaskIds.Contains(taskId))
            {
                user.TaskIds.Add(taskId);
                await _context.SaveChangesAsync();
            }

            return NoContent(); // Успешно добавлено
        }

        // GET: api/user/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "admin,manager")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }

            return user;
        }

        // DELETE: api/user/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent(); // Успешно удалено
        }
    }
}
