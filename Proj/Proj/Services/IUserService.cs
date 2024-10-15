using Proj.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Proj.Services
{
    public interface IUserService
    {
        User ValidateUser(string username, string password);
        Task CreateUser(User user);
        bool UserExists(string username);
        void AddRefreshToken(string username, string refreshToken);
        User GetUserByRefreshToken(string refreshToken);
        Task<IEnumerable<User>> GetAllUsers();
        Task<User> GetUserById(int id);
        Task UpdateUserStatus(int userId, string newStatus);
        Task AssignTaskToUser(int userId, int taskId);
        Task DeleteUser(int id);
        object GenerateTokensForUser(User user);
        Task<AuthResponseDTO> AuthenticateAsync(LoginDTO model);
         Task UpdateProfilePicture(int userId, string profilePictureUrl);
    }
}
