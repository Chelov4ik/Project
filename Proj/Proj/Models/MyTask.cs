namespace Proj.Models
{
    using System;
    using System.Collections.Generic;

    public class MyTask
    { 
        public int Id { get; set; }
         
        public string Title { get; set; }
         
        public string Description { get; set; }

        // Дата выдачи задачи
        public DateTime IssuedDate { get; set; }

        // Дата дедлайна задачи
        public DateTime Deadline { get; set; }
         
        public List<int> AssignedUserIds { get; set; }
         
        public string Status { get; set; }
        /*
            Issued,
            InProgress,
            Completed,
            NotCompleted
        */
         
        public string Priority { get; set; } 
        /* 
        High,
        Medium,
        Low
        */
         
        public DateTime? CompletedDate { get; set; }
         
        public string? Notes { get; set; }
    }


}
