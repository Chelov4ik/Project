using Proj.Context;
using Proj.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Proj.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly ITokenService _tokenService;

        public UserService(AppDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        public async Task<AuthResponseDTO> AuthenticateAsync(LoginDTO model)
        {
            var user = _context.Users.SingleOrDefault(u => u.Username == model.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.Password))
            {
                return null; // Неверные учетные данные
            }

            // Создаем ClaimsIdentity на основе данных пользователя
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Status)
        };

            var identity = new ClaimsIdentity(claims, "Token");

            // Генерация Access Token с использованием ClaimsIdentity
            var accessToken = _tokenService.GenerateAccessToken(identity);
            var refreshToken = _tokenService.GenerateRefreshToken();

            // Сохранение Refresh Token в базе данных
            user.RefreshToken = refreshToken; // Обновите свойство RefreshToken в модели User
            await _context.SaveChangesAsync();

            return new AuthResponseDTO
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                Id = user.Id,
                Username = user.Username,
                Role = user.Status
            };

        }
        public User ValidateUser(string username, string password)
        { 
                var user = _context.Users.SingleOrDefault(u => u.Username == username);
                if (user == null)
                {
                    Console.WriteLine($"User not found: {username}");
                    return null; // Неверные учетные данные
                }

                if (!BCrypt.Net.BCrypt.Verify(password, user.Password))
                {
                    Console.WriteLine($"Password mismatch for user: {username}"); 
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
            if (string.IsNullOrEmpty(newUser.Department))
            {
                throw new ArgumentException("Department cannot be null or empty.");
            }

            newUser.RefreshToken = _tokenService.GenerateRefreshToken(); // Генерация refresh token

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync(); // Сохраняем пользователя
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

        public bool UserExists(string username)
        {
            return _context.Users.Any(u => u.Username == username);
        }

        public void AddRefreshToken(string username, string refreshToken)
        {
            var user = _context.Users.SingleOrDefault(u => u.Username == username);
            if (user == null)
            {
                throw new Exception("User not found.");
            }

            user.RefreshToken = refreshToken;
            _context.SaveChanges();
        }

        public object GenerateTokensForUser(User user)
        {
            // Создаем ClaimsIdentity на основе пользователя
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Status) // Добавляем роль пользователя
            };

            var identity = new ClaimsIdentity(claims);

            // Генерация токена доступа
            var accessToken = _tokenService.GenerateAccessToken(identity);
            var refreshToken = _tokenService.GenerateRefreshToken();

            // Сохраняем refresh токен в модели пользователя
            user.RefreshToken = refreshToken;

            // Сохраняем обновленного пользователя в базе данных
            UpdateUser(user);

            return new
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }

        private void UpdateUser(User user)
        {
            // Логика для обновления пользователя в базе данных
            _context.Users.Update(user);
            _context.SaveChanges();
        }

        public User GetUserByRefreshToken(string refreshToken)
        {
            return _context.Users.SingleOrDefault(u => u.RefreshToken == refreshToken);
        }

        // Proj.Services/UserService.cs
        public async Task UpdateUser(int id, UpdateUserDTO updateUserDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new Exception($"User with ID {id} not found.");
            }

            // Обновляем свойства пользователя
            user.Username = updateUserDto.Username ?? user.Username;
            user.FirstName = updateUserDto.FirstName ?? user.FirstName;
            user.LastName = updateUserDto.LastName ?? user.LastName;
            user.BirthDate = updateUserDto.BirthDate != default ? updateUserDto.BirthDate : user.BirthDate;
            user.HireDate = updateUserDto.HireDate != default ? updateUserDto.HireDate : user.HireDate;
            user.Status = updateUserDto.Status ?? user.Status;
            user.TaskIds = updateUserDto.TaskIds ?? user.TaskIds;

            await _context.SaveChangesAsync(); // Сохраняем изменения
        }


        //public async Task UpdateProfilePicture(int userId, string profilePictureUrl)
        //{
        //    var user = await _context.Users.FindAsync(userId);
        //    if (user == null)
        //    {
        //        throw new Exception($"User with ID {userId} not found.");
        //    }
        //
        //    user.ProfilePictureUrl = profilePictureUrl;
        //    await _context.SaveChangesAsync();
        //}

    }
}
