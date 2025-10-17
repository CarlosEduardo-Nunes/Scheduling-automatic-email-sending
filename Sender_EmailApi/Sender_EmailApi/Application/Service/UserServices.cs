using Microsoft.AspNetCore.Identity;
using Sender_EmailApi.Application.Interface;
using Sender_EmailApi.Domain.Entities;

namespace Sender_EmailApi.Application.Service
{
    public class UserServices:IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly PasswordHasher<User> _passwordHasher = new();

        public UserServices(IUserRepository userRepository ) 
        {
            _userRepository = userRepository;
        }

        public async Task<(bool Success, string Message)> Register (User user)
        {
            var CreateUser = new User
            {
                UserName = user.UserName,
                Password = _passwordHasher.HashPassword(null!, user.Password),
                UserLevelId = user.UserLevelId
            };


            var ok = await _userRepository.CreateAsync(CreateUser);
            return ok ? (true, "User successfully created.") : (false, "Failed to create user.");

        }

        public async Task<List<UserLevel>> GetALLUserLevel()
        {
            return await _userRepository.GetALLUserLevel();
        }



        


    }
}
