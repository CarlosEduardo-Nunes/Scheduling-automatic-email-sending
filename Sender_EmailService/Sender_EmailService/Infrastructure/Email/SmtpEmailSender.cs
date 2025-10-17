using MailKit.Net.Smtp;
using MimeKit;
using Sender_EmailService.Application.Abstractions;
using Sender_EmailService.Application.Options;

namespace Sender_EmailService.Infrastructure.Email;

public sealed class SmtpEmailSender : IEmailSender
{
    private readonly SmtpOptions _opt;

    public SmtpEmailSender(Microsoft.Extensions.Options.IOptions<SmtpOptions> options)
    {
        _opt = options.Value;
    }

    public async Task SendAsync(string to, string subject, string body, CancellationToken ct)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_opt.FromName, _opt.User));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;

        message.Body = new TextPart("plain")
        {
            Text = body
        };

        using var client = new SmtpClient();
        await client.ConnectAsync(_opt.Host, _opt.Port, _opt.UseSsl, ct);

        if (!string.IsNullOrWhiteSpace(_opt.User))
            await client.AuthenticateAsync(_opt.User, _opt.Password, ct);

        await client.SendAsync(message, ct);
        await client.DisconnectAsync(true, ct);
    }
}
