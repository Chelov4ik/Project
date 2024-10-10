using Proj.Models;
using System.Threading.Tasks; 
namespace Proj.Services
{
    
    using System.Collections.Generic;
    using System.Threading.Tasks;

    
        public interface IUserService
        {
            User ValidateUser(string username, string password);
            Task CreateUser(User user);
            bool UserExists(string username);
            void AddRefreshToken(string username, string refreshToken);
            User GetUserByRefreshToken(string refreshToken);
            IEnumerable<User> GetAllUsers(); // Новый метод
        }
    }


