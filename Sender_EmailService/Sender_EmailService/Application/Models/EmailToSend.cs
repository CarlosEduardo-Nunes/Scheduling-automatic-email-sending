namespace Sender_EmailService.Application.Models;

public sealed class EmailToSend
{
    public int Id { get; init; }
    public string RecipientEmail { get; init; } = default!;
    public string Description { get; init; } = default!;  // corpo do e-mail
    public int UserId { get; init; }
    public DateTime ScheduledAtUtc { get; init; }
}
