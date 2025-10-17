namespace Sender_EmailApi.Application.Interface
{
    public interface IAuthService
    {
         Task<(string? token, DateTime? expiresAt, int? UserId)> LoginAsync(string userName, string password);
    }
}
