using Dapper;
using Sender_EmailApi.Application.Interface;
using Sender_EmailApi.Domain.Entities;

namespace Sender_EmailApi.Application.Repository
{
    public class SettingsEmailRepository : ISettingsEmailRepository
    {
        private readonly IConnectionFactory _factory;
        public SettingsEmailRepository(IConnectionFactory factory) => _factory = factory;



        public async Task<Settings_Emails> CreateAsync(Settings_Emails settingsEmail)
        {
            const string sql = @"
INSERT INTO dbo.Settings_Emails
(RecipientEmail, [Description], UserId, Status, ScheduledAt)
OUTPUT INSERTED.Id, INSERTED.RecipientEmail, INSERTED.[Description],
       INSERTED.UserId, INSERTED.Status, INSERTED.ScheduledAt,
       INSERTED.SentAt, INSERTED.CreatedAt
VALUES (@RecipientEmail, @Description, @UserId, @Status, @ScheduledAt);";


            using var conn = _factory.Create();
            return await conn.QuerySingleAsync<Settings_Emails>(sql, settingsEmail);

        }
        public async Task<List<Settings_Emails>> GetAllSettingsEmails()
        {
            const string sql = @"SELECT  [Id]
                  ,[RecipientEmail]
                  ,[Description]
                  ,[UserId]
                  ,[Status]
                  ,[ScheduledAt]
                  ,[SentAt]
                  ,[CreatedAt]
              FROM [Email_Sender].[dbo].[Settings_Emails]
            ;";

            using var conn = _factory.Create();
            var rows = await conn.QueryAsync<Settings_Emails>(sql);
            return rows.AsList();
        }

    }
}
