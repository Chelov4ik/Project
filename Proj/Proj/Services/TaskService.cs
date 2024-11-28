using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Proj.Context;
using Proj.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Proj.Services
{
    public class TaskService : ITaskService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<TaskService> _logger;

        public TaskService(AppDbContext context, ILogger<TaskService> logger)
        {
            _context = context;
            _logger = logger;
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
            // Проверяем, если дедлайн задачи меньше текущей даты и статус задачи не "Completed" или "Overdue"
            if (task.Deadline < DateTime.UtcNow && task.Status != "Completed" && task.Status != "Overdue")
            {
                task.Status = "Overdue"; // Обновляем статус задачи
            }

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

        public async Task<IEnumerable<MyTask>> GetOverdueTasks()
        {
            var currentDate = DateTime.UtcNow;
            return await _context.Tasks
                .Where(t => t.Deadline < currentDate && t.Status != "Completed" && t.Status != "Overdue")
                .ToListAsync();
        }


        public async Task CheckAndUpdateOverdueTasks()
        {
            var currentDate = DateTime.UtcNow; // Получаем текущую дату
            var overdueTasks = await _context.Tasks
                .Where(t => t.Deadline < currentDate && t.Status != "Overdue" && t.Status != "Overdue")
                .ToListAsync();

            if (overdueTasks.Any())
            {
                foreach (var task in overdueTasks)
                {
                    task.Status = "Overdue"; // Обновляем статус задачи
                }

                await _context.SaveChangesAsync();
                _logger.LogInformation($"Updated {overdueTasks.Count} overdue tasks.");
            }
            else
            {
                _logger.LogInformation("No overdue tasks to update.");
            }

            // Теперь проверим и удалим задачи, которые просрочены более 2 месяцев
            var twoMonthsAgo = DateTime.UtcNow.AddMonths(-2);
            var tasksToDelete = await _context.Tasks
                .Where(t => t.Deadline < twoMonthsAgo)
                .ToListAsync();

            if (tasksToDelete.Any())
            {
                _context.Tasks.RemoveRange(tasksToDelete);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Deleted {tasksToDelete.Count} overdue tasks older than two months.");
            }
            else
            {
                _logger.LogInformation("No tasks older than two months to delete.");
            }
        }
    }
}
