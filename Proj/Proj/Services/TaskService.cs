using Microsoft.EntityFrameworkCore;
using Proj.Context;
using Proj.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Proj.Services
{
    public class TaskService : ITaskService
    {
        private readonly AppDbContext _context;

        public TaskService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<MyTask> CreateTask(MyTask task)
        {
            await _context.Tasks.AddAsync(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<MyTask> GetTaskById(int id)
        {
            return await _context.Tasks.FindAsync(id);
        }

        public async Task<IEnumerable<MyTask>> GetAllTasks()
        {
            return await _context.Tasks.ToListAsync();
        }

        public async Task<IEnumerable<MyTask>> GetTasksByUserId(int userId)
        {
            return await _context.Tasks
                .Where(task => task.AssignedUserIds.Contains(userId))
                .ToListAsync();
        }

        public async Task UpdateTask(MyTask task)
        {
            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task != null)
            {
                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();
            }
        }

        public async Task AssignTaskToUser(int userId, int taskId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new Exception($"User with ID {userId} not found.");
            }

            var taskExists = await _context.Tasks.AnyAsync(t => t.Id == taskId);
            if (!taskExists)
            {
                throw new Exception($"Task with ID {taskId} not found.");
            }

            if (!user.TaskIds.Contains(taskId))
            {
                user.TaskIds.Add(taskId);
                await _context.SaveChangesAsync();
            }
        }
    }
}
