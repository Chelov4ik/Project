using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Proj.Services
{
    public class TokenService : ITokenService
    {
        private readonly string _issuer = "http://localhost:7236";
        private readonly string _audience = "http://localhost:7236";
        private readonly string _secretKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiMTIzIiwiaWF0IjoxMjN9.R7a-2NEyowJIiOn6PGKRKyZXsL0M5IKa9xidiJoIX2Y"; // Установите ваш секретный ключ

        public string SecretKey => _secretKey;
        public string Issuer => _issuer;
        public string Audience => _audience;

        public string GenerateAccessToken(ClaimsIdentity identity)
        {
            return GenerateToken(identity); // Используем общую реализацию
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
            }
            return Convert.ToBase64String(randomNumber);
        }

        private string GenerateToken(ClaimsIdentity identity)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.UtcNow.AddDays(1), // Устанавливаем время жизни токена
                Issuer = _issuer,
                Audience = _audience,
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
