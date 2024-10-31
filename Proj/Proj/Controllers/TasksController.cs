using Microsoft.AspNetCore.Authorization;
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
        [Authorize(Roles = "manager, admin")]
        public async Task<ActionResult<MyTask>> CreateTask([FromBody] CreateTaskDTO createTaskDto)
        {
            var task = new MyTask
            {
                Title = createTaskDto.Title,
                Description = createTaskDto.Description,
                IssuedDate = DateTime.UtcNow,
                Deadline = createTaskDto.Deadline,
                AssignedUserIds = createTaskDto.AssignedUserIds,
                Status = "Issued",
                Priority = createTaskDto.Priority,
                Notes = createTaskDto.Notes
            };

            var createdTask = await _taskService.CreateTask(task);

            foreach (var userId in createTaskDto.AssignedUserIds)
            {
                await _taskService.AssignTaskToUser(userId, createdTask.Id);
            }

            return CreatedAtAction(nameof(GetTaskById), new { id = createdTask.Id }, createdTask);
        }

        // Обновить задачу
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] MyTask task)
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

        // Обновить процент выполнения задачи (доступ только для worker)
        [HttpPut("{id}/progress")]
        [Authorize(Roles = "worker")]
        public async Task<IActionResult> UpdateTaskProgress(int id, [FromBody] UpdateTaskProgressDTO progressDto)
        {
            var task = await _taskService.GetTaskById(id);
            if (task == null)
            {
                return NotFound($"Задача с ID {id} не найдена.");
            }

            // Обновляем только процент и статус
            task.ProgressPercentage = progressDto.Progress;
            task.Status = progressDto.Status;

            await _taskService.UpdateTask(task);

            return NoContent(); // Успешно выполнено
        }

    }
}
