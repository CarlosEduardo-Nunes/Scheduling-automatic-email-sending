using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Sender_EmailApi.Application.Interface;
using Sender_EmailApi.Application.Service;

namespace Sender_EmailApi.WebApi.Controllers
{

    [Route("auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService  _authService;


        public AuthController(IAuthService authService) 
        {
            _authService = authService; 
        }


        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromQuery] string userName, [FromQuery] string password)
        {
            var (token, exp, userId) = await _authService.LoginAsync(userName, password);
            if (token is null) return Unauthorized();
            return Ok(new { token, expiresAt = exp, userId });
        }
        public record LoginResponseDto(string Token, DateTime ExpiresAt);
    }
}
