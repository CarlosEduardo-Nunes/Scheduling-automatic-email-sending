using Microsoft.AspNetCore.Mvc;
using Sender_EmailApi.Application.Interface;
using Sender_EmailApi.Application.Repository;
using Sender_EmailApi.Domain.Entities;

namespace Sender_EmailApi.WebApi.Controllers
{
    [Route("SettingsEmail")]
    public class SettingsEmailController : ControllerBase
    {
        private readonly ISettingsEmailService _settingsEmailService;

        public SettingsEmailController(ISettingsEmailService settingsEmailService)
        {
            _settingsEmailService = settingsEmailService;
        }

        [HttpPost("CreateAgenEmail")]
        public async Task<IActionResult> CreateAsync(Settings_Emails settingsEmail)
        {
            try
            {
                var create = await _settingsEmailService.CreateAsync(settingsEmail);
                return  Ok(create);
            }
            catch (Exception ex)
            { 
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetAllSettingsEmails")]
        public async Task<IActionResult> GetAllSettingsEmails()
        {
            try
            {
                var allList = await _settingsEmailService.GetAllSettingsEmails();
                return Ok(allList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
