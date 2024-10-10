using Proj.Context;
using Proj.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Proj.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public void AddRefreshToken(string username, string refreshToken)
        {
            var token = new RefreshToken
            {
                Token = refreshToken,
                Expiration = DateTime.UtcNow.AddDays(30),
                Username = username
            };

            _context.RefreshTokens.Add(token);
            _context.SaveChanges();
        }

        public User GetUserByRefreshToken(string refreshToken)
        {
            var token = _context.RefreshTokens.SingleOrDefault(t => t.Token == refreshToken);
            if (token == null || token.Expiration < DateTime.UtcNow)
            {
                return null;
            }

            return _context.Users.SingleOrDefault(u => u.Username == token.Username);
        }

        public User ValidateUser(string username, string password)
        {
            // Здесь используйте хеширование паролей в реальных проектах
            // Находим пользователя по имени
            var user = _context.Users.SingleOrDefault(u => u.Username == username);

            // Если пользователь не найден, возвращаем null
            if (user == null)
            {
                return null;
            }

            // Сравниваем введённый пароль с захешированным паролем
            if (!BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                return null; // Неверный пароль
            }

            return user; // Успешная аутентификация
        }

        public async Task CreateUser(User user)
        {
            if (UserExists(user.Username))
            {
                throw new Exception("User already exists.");
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public IEnumerable<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }

        public bool UserExists(string username)
        {
            return _context.Users.Any(u => u.Username == username);
        }
    }
}
