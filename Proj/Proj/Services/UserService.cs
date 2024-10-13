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

        public User ValidateUser(string username, string password)
        {
            var user = _context.Users.SingleOrDefault(u => u.Username == username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                return null; // Неверные учетные данные
            }

            return user; // Успешная аутентификация
        }

        public async Task CreateUser(User newUser)
        {
            if (UserExists(newUser.Username))
            {
                throw new Exception("User with this username already exists.");
            }

            newUser.Password = BCrypt.Net.BCrypt.HashPassword(newUser.Password);
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new Exception($"User with ID {id} not found.");
            }

            return user;
        }

        public async Task UpdateUserStatus(int userId, string newStatus)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new Exception($"User with ID {userId} not found.");
            }

            if (newStatus != "admin" && newStatus != "manager" && newStatus != "worker")
            {
                throw new Exception("Invalid status provided.");
            }

            user.Status = newStatus;
            await _context.SaveChangesAsync();
        }

        public async Task AssignTaskToUser(int userId, int taskId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new Exception($"User with ID {userId} not found.");
            }

            var taskExists = await _context.Tasks.AnyAsync(t => t.Id == taskId);
            if (!taskExists)
            {
                throw new Exception($"Task with ID {taskId} not found.");
            }

            if (!user.TaskIds.Contains(taskId))
            {
                user.TaskIds.Add(taskId);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new Exception($"User with ID {id} not found.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

        // Реализуем метод UserExists как public
        public bool UserExists(string username)
        {
            return _context.Users.Any(u => u.Username == username);
        }

        // Реализуем метод AddRefreshToken
        public void AddRefreshToken(string username, string refreshToken)
        {
            var user = _context.Users.SingleOrDefault(u => u.Username == username);
            if (user == null)
            {
                throw new Exception("User not found.");
            }

            user.RefreshToken = refreshToken; // Предполагаем, что поле RefreshToken есть в модели User
            _context.SaveChanges();
        }

        // Реализуем метод GetUserByRefreshToken
        public User GetUserByRefreshToken(string refreshToken)
        {
            return _context.Users.SingleOrDefault(u => u.RefreshToken == refreshToken);
        }
    }
}
