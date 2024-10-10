using System.Collections.Generic;
using System.Threading.Tasks;
using Proj.Models;

namespace Proj.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<MyTask>> GetAllTasks();
        Task<MyTask> GetTaskById(int id);
        Task<MyTask> CreateTask(MyTask task);
        Task UpdateTask(MyTask task);
        Task DeleteTask(int id);
        Task<IEnumerable<MyTask>> GetTasksByUserId(int userId); // Новый метод
    }
}
