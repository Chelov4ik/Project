namespace Proj.Models
{
    public class LoginDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
    public class AuthResponseDTO
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public int Id { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
    }

}
