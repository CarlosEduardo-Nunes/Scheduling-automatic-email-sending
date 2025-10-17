using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sender_EmailApi.Application.Interface; 
using Sender_EmailApi.Domain.Entities;

namespace Sender_EmailApi.WebApi.Controllers
{
    [ApiController]
    [Route("User")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService) => _userService = userService;

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            try
            {
                var (ok, msg) = await _userService.Register(user);   
                return ok ? Ok(new { message = msg })                
                         : BadRequest(new { message = msg });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("UserLevelList")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllUserLevel()
        {
            try
            {
                var levels = await _userService.GetALLUserLevel();   
                return Ok(levels);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
