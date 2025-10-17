using Sender_EmailApi.Domain.Entities;

namespace Sender_EmailApi.Application.Interface
{
    public interface IUserService
    {
        Task<(bool Success, string Message)> Register(User user);

        Task<List<UserLevel>> GetALLUserLevel();
    }
}
