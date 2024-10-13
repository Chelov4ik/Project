using Microsoft.AspNetCore.Mvc;
using Proj.Models;
using Proj.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

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
                return BadRequest(ex.Message);
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
                return NotFound(ex.Message);
            }
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(int id, [FromBody] StatusUpdateDto statusUpdateDto)
        {
            try
            {
                if (string.IsNullOrEmpty(statusUpdateDto.Status))
                {
                    return BadRequest("Status cannot be empty.");
                }

                await _userService.UpdateUserStatus(id, statusUpdateDto.Status);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
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
                return NotFound(ex.Message);
            }
        }
    }
}
