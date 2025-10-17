using Serilog;
using Sender_EmailService.Application.Abstractions;
using Sender_EmailService.Application.Options;
using Sender_EmailService.Infrastructure.Data;
using Sender_EmailService.Infrastructure.Email;
using Sender_EmailService.Worker;

var builder = Host.CreateApplicationBuilder(args);

// Serilog console
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .CreateLogger();
builder.Logging.ClearProviders();
builder.Logging.AddSerilog();

// Options
builder.Services.Configure<SmtpOptions>(builder.Configuration.GetSection("Smtp"));
builder.Services.Configure<WorkerOptions>(builder.Configuration.GetSection("Worker"));

// Infra registrations
builder.Services.AddSingleton<IEmailRepository, SqlEmailRepository>();
builder.Services.AddSingleton<IEmailSender, SmtpEmailSender>();

// Worker
builder.Services.AddHostedService<EmailBackgroundService>();

// Windows Service metadata
builder.Services.AddWindowsService(opt => opt.ServiceName = "Sender_EmailService");

var app = builder.Build();
app.Run();
