namespace Proj.Services
{
    using System.Security.Claims;

    public interface ITokenService
    {
        string GenerateAccessToken(ClaimsIdentity identity);
        string GenerateRefreshToken();
        string SecretKey { get; }
        string Issuer { get; }
        string Audience { get; }
    }

}
