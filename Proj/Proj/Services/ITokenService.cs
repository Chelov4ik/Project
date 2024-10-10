namespace Proj.Services
{
    using System.Security.Claims;

    public interface ITokenService
    {
        string GenerateToken(ClaimsIdentity identity); // Генерация основного токена
        string GenerateAccessToken(ClaimsIdentity identity); // Генерация токена доступа
        string GenerateRefreshToken(); // Генерация токена обновления
    }
}
