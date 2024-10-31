namespace Proj.Models
{
    using System;
    using System.Collections.Generic;

    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; } // Хранить пароль в виде хеша
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime HireDate { get; set; }
        public string Status { get; set; } // Например, "worker", "manager", "admin"
        public List<int> TaskIds { get; set; } = new List<int>(); // Хранить ID задач
        public string RefreshToken { get; set; } // Добавлено поле для хранения Refresh Token
        public string Department { get; set; }

        // Поле для хранения URL фотографии профиля
        //public string? ProfilePictureUrl { get; set; } // Путь к фотографии профиля
    }

}

