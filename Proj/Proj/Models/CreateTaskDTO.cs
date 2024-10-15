namespace Proj.Models
{
    using System;
    using System.Collections.Generic;

    public class CreateTaskDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Deadline { get; set; }
        public List<int> AssignedUserIds { get; set; } // Идентификаторы пользователей
        public string Priority { get; set; } // Приоритет задачи
        public string? Notes { get; set; }
    }


}
