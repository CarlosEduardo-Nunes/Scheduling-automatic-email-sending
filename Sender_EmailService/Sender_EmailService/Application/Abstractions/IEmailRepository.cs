using Sender_EmailService.Application.Models;

namespace Sender_EmailService.Application.Abstractions;

public interface IEmailRepository
{
    Task<IReadOnlyList<EmailToSend>> DequeueNextBatchAsync(int batchSize, CancellationToken ct);
    Task MarkSentAsync(int id, CancellationToken ct);
    Task MarkFailedAsync(int id, string? reason, CancellationToken ct);
}
