using Microsoft.EntityFrameworkCore;
using Proj.Context;
using Proj.Models;
using System.Collections.Generic;
using System.Linq; // Не забудьте добавить using для LINQ
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

        public async Task UpdateTask(MyTask task) // Обратите внимание на тип возвращаемого значения
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
    }
}
