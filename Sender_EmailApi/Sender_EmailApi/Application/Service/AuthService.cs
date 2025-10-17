using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

using Sender_EmailApi.Application.Options;
using Sender_EmailApi.Domain.Entities;
using Sender_EmailApi.Application.Interface;
namespace Sender_EmailApi.Application.Service;

public class AuthService : IAuthService
{
    private readonly IUserRepository _users;
    private readonly PasswordHasher<User> _hasher = new();
    private readonly JwtOptions _jwt;

    public AuthService(IUserRepository users, IOptions<JwtOptions> jwtOptions)
    {
        _users = users;
        _jwt = jwtOptions.Value;
    }

    
    public async Task<(string? token, DateTime? expiresAt, int? UserId)> LoginAsync(string userName, string password)
    {
       
        var user = await _users.GetByUserNameAsync(userName);
        if (user is null) return (null, null,null);

        var result = _hasher.VerifyHashedPassword(user, user.Password, password);
        if (result == PasswordVerificationResult.Failed) return (null, null,null);

        var expires = DateTime.UtcNow.AddMinutes(_jwt.ExpMinutes);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.UniqueName, user.UserName),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new("ulv", user.UserLevelId.ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.SecretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwt.Issuer,
            audience: _jwt.Audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: expires,
            signingCredentials: creds
        );

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);
        return (jwt, expires, user.Id);
    }
}
