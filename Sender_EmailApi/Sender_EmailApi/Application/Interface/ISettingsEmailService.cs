using Sender_EmailApi.Domain.Entities;

namespace Sender_EmailApi.Application.Interface
{
    public interface ISettingsEmailService
    {
        Task<Settings_Emails> CreateAsync(Settings_Emails settingsEmail);
        Task<List<Settings_Emails>> GetAllSettingsEmails();
    }
}
