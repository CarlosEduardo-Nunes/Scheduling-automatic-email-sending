using System.Data;

namespace Sender_EmailApi.Application.Interface;
public interface IConnectionFactory
{
    IDbConnection Create();
}
