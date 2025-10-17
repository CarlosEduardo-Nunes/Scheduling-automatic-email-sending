using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sender_EmailService.Application.Options
{
    public sealed class SmtpOptions
    {
        public string Host { get; init; } = "";
        public int Port { get; init; }
        public bool UseSsl { get; init; }
        public string User { get; init; } = "";
        public string Password { get; init; } = "";
        public string FromName { get; init; } = "Email Sender Service";
    }

}
