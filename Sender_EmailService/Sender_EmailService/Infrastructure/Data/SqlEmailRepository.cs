using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Sender_EmailService.Application.Abstractions;
using Sender_EmailService.Application.Models;

namespace Sender_EmailService.Infrastructure.Data;

public sealed class SqlEmailRepository : IEmailRepository
{
    private readonly string _connString;
    public SqlEmailRepository(IConfiguration cfg)
    {
        _connString = cfg.GetConnectionString("SqlServer")
            ?? throw new InvalidOperationException("Missing connection string 'SqlServer'.");
    }

    private IDbConnection Create() => new SqlConnection(_connString);

    public async Task<IReadOnlyList<EmailToSend>> DequeueNextBatchAsync(int batchSize, CancellationToken ct)
    {
        // SqlEmailRepository.cs  (trocar o filtro de data)
        const string sql = @"
;WITH cte AS (
    SELECT TOP (@batch) Id
    FROM [Email_Sender].[dbo].[Settings_Emails] WITH (ROWLOCK, READPAST, UPDLOCK)
    WHERE [Status] = 0
      AND [ScheduledAt] <= GETDATE()      -- << era SYSUTCDATETIME()
    ORDER BY [ScheduledAt] ASC, [Id] ASC
)
UPDATE t
   SET [Status] = 1
OUTPUT inserted.[Id],
       inserted.[RecipientEmail],
       inserted.[Description],
       inserted.[UserId],
       inserted.[ScheduledAt]
FROM [Email_Sender].[dbo].[Settings_Emails] t
JOIN cte ON cte.Id = t.Id;";


        using var con = Create();
        var rows = await con.QueryAsync(sql, new { batch = batchSize });
        // map manual para nosso modelo
        var list = rows.Select(r => new EmailToSend
        {
            Id = (int)r.Id,
            RecipientEmail = (string)r.RecipientEmail,
            Description = (string)r.Description,
            UserId = (int)r.UserId,
            ScheduledAtUtc = (DateTime)r.ScheduledAt
        }).ToList();

        return list;
    }

    public async Task MarkSentAsync(int id, CancellationToken ct)
    {
        const string sql = @"
UPDATE [Email_Sender].[dbo].[Settings_Emails]
   SET [Status] = 2,
       [SentAt] = GETDATE()               -- << era SYSUTCDATETIME()
 WHERE [Id] = @id;";
        using var con = Create();
        await con.ExecuteAsync(new CommandDefinition(sql, new { id }, cancellationToken: ct));
    }

    public async Task MarkFailedAsync(int id, string? reason, CancellationToken ct)
    {
        const string sql = @"
UPDATE [Email_Sender].[dbo].[Settings_Emails]
   SET [Status] = 3        -- Failed
 WHERE [Id] = @id;";
        using var con = Create();
        await con.ExecuteAsync(new CommandDefinition(sql, new { id }, cancellationToken: ct));

        // Se quiser, aqui dá pra inserir em uma tabela de erros para histórico.
        _ = reason; // placeholder
    }
}
