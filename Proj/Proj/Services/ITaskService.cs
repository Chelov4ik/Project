﻿using Proj.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Proj.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<MyTask>> GetOverdueTasks();
        Task<IEnumerable<MyTask>> GetAllTasks();
        Task<MyTask> GetTaskById(int id);
        Task<IEnumerable<MyTask>> GetTasksByUserId(int userId);
        Task<MyTask> CreateTask(MyTask task);
        Task UpdateTask(MyTask task);
        Task DeleteTask(int id);
        Task AssignTaskToUser(int userId, int taskId);
        Task CheckAndUpdateOverdueTasks();
    }
}
