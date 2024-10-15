using Proj.Models;
using System.Threading.Tasks;

namespace Proj.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<MyTask>> GetAllTasks();
        Task<MyTask> GetTaskById(int id);
        Task<MyTask> CreateTask(MyTask task);
        Task UpdateTask(MyTask task);
        Task DeleteTask(int id);
        Task<IEnumerable<MyTask>> GetTasksByUserId(int userId);

        // Добавьте этот метод
        Task AssignTaskToUser(int userId, int taskId);
    }
}
