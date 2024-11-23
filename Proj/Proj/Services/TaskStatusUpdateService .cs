using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Proj.Services;
using Proj.Models; // Импортируем модель задачи

namespace Proj.Services
{
    public class TaskStatusUpdateService : IHostedService, IDisposable
    {
        private readonly ILogger<TaskStatusUpdateService> _logger;
        private readonly IServiceProvider _serviceProvider;
        private Timer _timer;

        public TaskStatusUpdateService(IServiceProvider serviceProvider, ILogger<TaskStatusUpdateService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("TaskStatusUpdateService starting...");

            // Запуск фонової задачи каждую минуту
            _timer = new Timer(ExecuteTaskUpdate, null, TimeSpan.Zero, TimeSpan.FromMinutes(1));
            return Task.CompletedTask;
        }

        private async void ExecuteTaskUpdate(object state)
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var taskService = scope.ServiceProvider.GetRequiredService<ITaskService>();
                    _logger.LogInformation("Updating task statuses...");

                    // Получаем все задачи и проверяем их на просрочку
                    var overdueTasks = await taskService.GetOverdueTasks();

                    foreach (var task in overdueTasks)
                    {
                        // Если задача просрочена более двух месяцев, удаляем её
                        if (task.Deadline < DateTime.UtcNow.AddMonths(-2))
                        {
                            _logger.LogInformation($"Task {task.Id} is more than 2 months overdue and will be deleted.");
                            await taskService.DeleteTask(task.Id);
                        }
                        else
                        {
                            // Если задача просрочена, но меньше двух месяцев, обновляем статус
                            await taskService.CheckAndUpdateOverdueTasks();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occurred while updating task statuses: {ex.Message}");
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("TaskStatusUpdateService stopping...");
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
