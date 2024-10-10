// AuthController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Tasks;
using Proj.Models;
using Proj.Services;
using System.Collections.Generic; 

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ITokenService _tokenService;

    public AuthController(IUserService userService, ITokenService tokenService)
    {
        _userService = userService;
        _tokenService = tokenService;
    }

    // Метод для логина
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginModel model)
    {
        var user = _userService.ValidateUser(model.Username, model.Password);
        if (user == null)
        {
            return Unauthorized(new { message = "Invalid credentials" });
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
        _userService.AddRefreshToken(user.Username, refreshToken);

        return Ok(new
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            Id = user.Id,
            User = user.Username,
            Role = user.Status
        });
    }

    // Метод для регистрации
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        // Проверка на наличие обязательных полей
        if (string.IsNullOrWhiteSpace(model.Username) || string.IsNullOrWhiteSpace(model.Password))
        {
            return BadRequest(new { message = "Username and password are required." });
        }

        // Проверка, существует ли пользователь
        if (_userService.UserExists(model.Username))
        {
            return BadRequest(new { message = "User already exists" });
        }

        // Создание нового пользователя
        var user = new User
        {
            Username = model.Username,
            Password = BCrypt.Net.BCrypt.HashPassword(model.Password), // Хеширование пароля
            FirstName = model.FirstName,
            LastName = model.LastName,
            BirthDate = model.BirthDate,
            HireDate = model.HireDate,
            Status = model.Status // Убедитесь, что статус валиден
        };

        // Создание пользователя в базе данных
        await _userService.CreateUser(user);

        return Ok(new { message = "User registered successfully" });
    }

    // Метод для обновления токена
    [HttpPost("refresh-token")]
    public IActionResult RefreshToken([FromBody] string refreshToken)
    {
        var user = _userService.GetUserByRefreshToken(refreshToken);
        if (user == null)
        {
            return Unauthorized(new { message = "Invalid refresh token" });
        }

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Status)
        };

        var identity = new ClaimsIdentity(claims, "Token");
        var newAccessToken = _tokenService.GenerateAccessToken(identity);

        return Ok(new
        {
            AccessToken = newAccessToken,
            RefreshToken = refreshToken // Возврат того же Refresh Token
        });
    }

    // Метод для получения всех пользователей
    [HttpGet("users")]
    [Authorize(Roles = "admin")]
    public IActionResult GetUsers()
    {
        var users = _userService.GetAllUsers();
        return Ok(users);
    }
}