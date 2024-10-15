namespace Proj.Models
{
    public class RegisterDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime HireDate { get; set; }
        public string Status { get; set; } // Статус: "worker", "manager", "admin"
        public string Department { get; set; }
        public string ProfilePicture { get; set; } // URL фотографии профиля
    }
}
