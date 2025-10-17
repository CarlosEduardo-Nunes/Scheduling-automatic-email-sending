using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Sender_EmailService.Application.Abstractions;
using Sender_EmailService.Application.Options;

namespace Sender_EmailService.Worker;

public sealed class EmailBackgroundService : BackgroundService
{
    private readonly ILogger<EmailBackgroundService> _logger;
    private readonly IEmailRepository _repo;
    private readonly IEmailSender _sender;
    private readonly WorkerOptions _opt;

    public EmailBackgroundService(
        ILogger<EmailBackgroundService> logger,
        IEmailRepository repo,
        IEmailSender sender,
        IOptions<WorkerOptions> opt)
    {
        _logger = logger;
        _repo = repo;
        _sender = sender;
        _opt = opt.Value;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Email worker iniciado.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var items = await _repo.DequeueNextBatchAsync(_opt.BatchSize, stoppingToken);

                if (items.Count == 0)
                {
                    await Task.Delay(TimeSpan.FromSeconds(_opt.PollIntervalSeconds), stoppingToken);
                    continue;
                }

                foreach (var email in items)
                {
                    try
                    {
                        var subject = $"Scheduled email ";
                        await _sender.SendAsync(email.RecipientEmail, subject, email.Description, stoppingToken);
                        await _repo.MarkSentAsync(email.Id, stoppingToken);
                        _logger.LogInformation("Email  enviado para {To}.", email.RecipientEmail);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Falha ao enviar Email {Id} para {To}.", email.Id, email.RecipientEmail);
                        await _repo.MarkFailedAsync(email.Id, ex.Message, stoppingToken);
                    }
                }
            }
            catch (OperationCanceledException) { /* ignorado no shutdown */ }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro no loop principal.");
                await Task.Delay(TimeSpan.FromSeconds(_opt.PollIntervalSeconds), stoppingToken);
            }
        }

        _logger.LogInformation("Email worker finalizado.");
    }
}
