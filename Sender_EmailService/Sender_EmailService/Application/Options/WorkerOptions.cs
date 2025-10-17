using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sender_EmailService.Application.Options
{
    public sealed class WorkerOptions
    {
        public int BatchSize { get; init; } = 10;
        public int PollIntervalSeconds { get; init; } = 10;
        public int MaxRetryPerEmail { get; init; } = 3;
    }
}
