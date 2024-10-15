using Microsoft.AspNetCore.Authorization; // Не забудьте добавить это
using Microsoft.AspNetCore.Mvc;
using Proj.Models;
using Proj.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Proj.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        // Получить все задачи
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MyTask>>> GetAllTasks()
        {
            var tasks = await _taskService.GetAllTasks();
            return Ok(tasks);
        }

        // Получить задачу по ID
        [HttpGet("{id}")]
        public async Task<ActionResult<MyTask>> GetTaskById(int id)
        {
            var task = await _taskService.GetTaskById(id);
            if (task == null)
            {
                return NotFound();
            }
            return Ok(task);
        }

        // Получить задачи по ID пользователя
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<MyTask>>> GetTasksByUserId(int userId)
        {
            var tasks = await _taskService.GetTasksByUserId(userId);
            return Ok(tasks);
        }

        // Создать новую задачу с назначением пользователей
        [HttpPost]
        [Authorize(Roles = "manager, admin")] // Проверка прав доступа
        public async Task<ActionResult<MyTask>> CreateTask([FromBody] CreateTaskDTO createTaskDto)
        {
            var task = new MyTask
            {
                Title = createTaskDto.Title,
                Description = createTaskDto.Description,
                IssuedDate = DateTime.UtcNow,
                Deadline = createTaskDto.Deadline,
                AssignedUserIds = createTaskDto.AssignedUserIds,
                Status = "Issued", // Статус по умолчанию
                Priority = createTaskDto.Priority
            };

            var createdTask = await _taskService.CreateTask(task);

            // Назначаем задачу пользователям
            foreach (var userId in createTaskDto.AssignedUserIds)
            {
                await _taskService.AssignTaskToUser(userId, createdTask.Id);
            }

            return CreatedAtAction(nameof(GetTaskById), new { id = createdTask.Id }, createdTask);
        }

        // Обновить задачу
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, MyTask task)
        {
            if (id != task.Id)
            {
                return BadRequest();
            }

            await _taskService.UpdateTask(task);
            return NoContent();
        }

        // Удалить задачу
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            await _taskService.DeleteTask(id);
            return NoContent();
        }
    }
}
