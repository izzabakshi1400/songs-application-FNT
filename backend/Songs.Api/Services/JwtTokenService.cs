using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Songs.Api.Services;

public sealed class JwtTokenService
{
    public SymmetricSecurityKey SigningKey { get; }

    public JwtTokenService(SymmetricSecurityKey signingKey)
    {
        SigningKey = signingKey;
    }

    public string CreateToken(string username, string displayName, TimeSpan validFor)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, username),
            new Claim("displayName", displayName)
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.Add(validFor),
            signingCredentials: new SigningCredentials(SigningKey, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}