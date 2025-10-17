public enum EmailStatus : byte
{
    Pending = 0,
    Sending = 1,
    Sent = 2,
    Failed = 3
}

public class Settings_Emails
{
    public int Id { get; set; }
    public string RecipientEmail { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int UserId { get; set; }

    public EmailStatus Status { get; set; } = EmailStatus.Pending;
    public DateTime ScheduledAt { get; set; }   // antigo TimeForSend
    public DateTime? SentAt { get; set; }
    public DateTime CreatedAt { get; set; }
}
