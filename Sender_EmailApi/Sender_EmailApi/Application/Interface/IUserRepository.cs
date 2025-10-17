using Sender_EmailApi.Domain.Entities;

namespace Sender_EmailApi.Application.Interface
{
    public interface IUserRepository
    {
        Task<bool> CreateAsync(User u);
        Task<List<UserLevel>> GetALLUserLevel();

        Task<User?> GetByUserNameAsync(string name);

    }
}
