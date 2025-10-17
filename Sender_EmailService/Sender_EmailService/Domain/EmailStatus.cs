using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sender_EmailService.Domain
{
    public enum EmailStatus
    {
        Pending = 0,
        Sending = 1,
        Sent = 2,
        Failed = 3
    }
}
