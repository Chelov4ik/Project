namespace Proj.Models
{
    using System;
    using System.Collections.Generic;

    public class MyTask
    {
        // Уникальный идентификатор задачи
        public int Id { get; set; }

        // Название задачи
        public string Title { get; set; }

        // Описание задачи
        public string Description { get; set; }

        // Дата выдачи задачи
        public DateTime IssuedDate { get; set; }

        // Дата дедлайна задачи
        public DateTime Deadline { get; set; }

        // Список идентификаторов пользователей, назначенных для выполнения задачи
        public List<int> AssignedUserIds { get; set; }

        // Статус задачи (выдано, в процессе, выполнено, не выполнено)
        public string Status { get; set; }
        /*
            Issued,
            InProgress,
            Completed,
            NotCompleted
        */

        // Приоритет задачи (высокий, средний, низкий)
        public string Priority { get; set; } 
        /* 
        High,
        Medium,
        Low
        */

        // Дата завершения задачи (если выполнена)
        public DateTime? CompletedDate { get; set; }

        // Комментарии или заметки к задаче
        public string Notes { get; set; }
    }

}
