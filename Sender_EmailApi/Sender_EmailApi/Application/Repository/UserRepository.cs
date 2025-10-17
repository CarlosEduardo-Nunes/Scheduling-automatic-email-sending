
using Sender_EmailApi.Application.Interface;
using Sender_EmailApi.Domain.Entities;
using Dapper;

namespace Sender_EmailApi.Application.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly IConnectionFactory _factory;
        public UserRepository(IConnectionFactory factory)
        {
            _factory = factory;
        }

        public async Task<bool> CreateAsync(User user)
        {
            const string sql = @"
            INSERT INTO dbo.Users(UserName, [Password], UserLevelId)
            VALUES (@UserName, @Password, @UserLevelId);";
            using var conn = _factory.Create();
            var rows = await conn.ExecuteAsync(sql, user);
            return rows > 0;
        }

        public async Task<List<UserLevel>> GetALLUserLevel()
        {
            const string sql = @"SELECT TOP (1000) [Id]
                          ,[Level]
                      FROM [Email_Sender].[dbo].[User_Level];";

            using var conn = _factory.Create();
            var rows = await conn.QueryAsync<UserLevel>(sql);
            return rows.AsList();
        }


        public async Task<User?> GetByUserNameAsync(string name)
        {
            const string sql = @"
SELECT TOP 1 Id, UserName, [Password], UserLevelId
FROM dbo.Users
WHERE UserName = @name;";

            using var conn = _factory.Create();
            return await conn.QueryFirstOrDefaultAsync<User>(sql, new { name });
        }




    }
}
