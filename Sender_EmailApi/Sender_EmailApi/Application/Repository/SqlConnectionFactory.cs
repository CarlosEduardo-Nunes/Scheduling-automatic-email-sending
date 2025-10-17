using System.Data;
using Microsoft.Data.SqlClient;               
using Sender_EmailApi.Application.Interface;

namespace Sender_EmailApi.Application.Repository;

public sealed class SqlConnectionFactory : IConnectionFactory
{
    private readonly string _cs;
    public SqlConnectionFactory(string connectionString) => _cs = connectionString;

    public IDbConnection Create() => new SqlConnection(_cs); 
}
