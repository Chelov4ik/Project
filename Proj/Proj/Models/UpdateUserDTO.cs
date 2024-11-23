namespace Proj.Models
{
    using System;
    using System.Collections.Generic;

    // Proj.Models/UpdateUserDTO.cs
    public class UpdateUserDTO
    {
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime HireDate { get; set; }
        public string Department { get; set; }
        public string Status { get; set; }
        public List<int> TaskIds { get; set; }

        // Поля для проверки пароля
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }

        // Поле для пути аватара
        public string ProfilePicturePath { get; set; }
    }


}

