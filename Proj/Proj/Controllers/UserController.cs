using Microsoft.AspNetCore.Mvc;
using Proj.Models;
using Proj.Services;
using System.Collections.Generic;
using System.Threading.Tasks; 
using Microsoft.AspNetCore.Http;
using System.IO;

namespace Proj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateUser([FromBody] User newUser)
        {
            try
            {
                await _userService.CreateUser(newUser);
                return CreatedAtAction(nameof(GetUserById), new { id = newUser.Id }, newUser);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDTO loginRequest)
        {
            try
            {
                var user = _userService.ValidateUser(loginRequest.Username, loginRequest.Password);
                if (user == null)
                {
                    return Unauthorized(new { message = "Invalid credentials" });
                }

                var tokens = _userService.GenerateTokensForUser(user);
                return Ok(tokens); // Возвращаем access и refresh токены
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            var users = await _userService.GetAllUsers();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            try
            {
                var user = await _userService.GetUserById(id);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(int id, [FromBody] StatusUpdateDto statusUpdateDto)
        {
            try
            {
                if (string.IsNullOrEmpty(statusUpdateDto.Status))
                {
                    return BadRequest(new { message = "Status cannot be empty." });
                }

                await _userService.UpdateUserStatus(id, statusUpdateDto.Status);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                await _userService.DeleteUser(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        // Proj.Controllers/UserController.cs
        [HttpPut("{id}")]
        public async Task<IActionResult> EditUser(int id, [FromBody] UpdateUserDTO updateUserDto)
        {
            try
            {
                await _userService.UpdateUser(id, updateUserDto);
                return NoContent(); // Возвращаем 204 No Content при успешном обновлении
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        //[HttpPost("upload-profile-picture/{userId}")]
        //public async Task<IActionResult> UploadProfilePicture(int userId, IFormFile file)
        //{
        //    if (file == null || file.Length == 0)
        //        return BadRequest(new { message = "No file uploaded." });
        //
        //    var filePath = Path.Combine("wwwroot", "uploads", file.FileName); // Путь для сохранения файла
        //    using (var stream = new FileStream(filePath, FileMode.Create))
        //    {
        //        await file.CopyToAsync(stream);
        //    }
        //
        //    var profilePictureUrl = $"/uploads/{file.FileName}"; // URL для доступа к файлу
        //    await _userService.UpdateProfilePicture(userId, profilePictureUrl);
        //
        //    return Ok(new { Url = profilePictureUrl });
        //}

    }
}
