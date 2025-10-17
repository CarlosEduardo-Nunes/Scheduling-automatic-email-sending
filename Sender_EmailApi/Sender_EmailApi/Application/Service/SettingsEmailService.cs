using Sender_EmailApi.Application.Interface;
using Sender_EmailApi.Domain.Entities;

namespace Sender_EmailApi.Application.Service
{
    public class SettingsEmailService: ISettingsEmailService
    {
        private readonly ISettingsEmailRepository _settingsEmailRepository;

        public SettingsEmailService(ISettingsEmailRepository settingsEmailRepository    )
        {
            _settingsEmailRepository = settingsEmailRepository;
        }

        public Task<Settings_Emails> CreateAsync(Settings_Emails settingsEmail)
        {
            return _settingsEmailRepository.CreateAsync(settingsEmail); 
        }
        public Task<List<Settings_Emails>> GetAllSettingsEmails()
        {
            return _settingsEmailRepository.GetAllSettingsEmails();
        }
    }
}
