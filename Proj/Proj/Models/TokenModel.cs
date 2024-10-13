namespace Proj.Models
{
    public class TokenModel
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    } 
    public class RefreshToken
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public DateTime Expiration { get; set; }
        public string Username { get; set; } // Связываем с пользователем
    } 
}
