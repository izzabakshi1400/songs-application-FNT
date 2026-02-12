using Microsoft.EntityFrameworkCore;
using Songs.Api.Contracts;
using Songs.Api.Data;
using Songs.Api.Models;
using Songs.Api.Services;

namespace Songs.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        app.MapPost("/api/auth/login", async (LoginRequest req, AppDbContext db, JwtTokenService jwt) =>
        {
            var username = req.Username?.Trim() ?? "";
            var password = req.Password ?? "";

            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
                return Results.BadRequest(new { message = "שם משתמש וסיסמה הם שדות חובה." });

            var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user is null)
                return Results.Unauthorized();

            var ok = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            if (!ok)
                return Results.Unauthorized();

            var token = jwt.CreateToken(user.Username, user.DisplayName, TimeSpan.FromHours(6));
            return Results.Ok(new { token, displayName = user.DisplayName });
        });
        app.MapPost("/api/auth/register", async (RegisterRequest req, AppDbContext db, JwtTokenService jwt) =>
        {
            var username = req.Username?.Trim() ?? "";
            var password = req.Password ?? "";
            var displayName = (req.DisplayName ?? "").Trim();

            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
                return Results.BadRequest(new { message = "שם משתמש וסיסמה הם שדות חובה." });

            if (username.Length < 3)
                return Results.BadRequest(new { message = "שם משתמש חייב להיות לפחות 3 תווים." });

            if (password.Length < 4)
                return Results.BadRequest(new { message = "סיסמה חייבת להיות לפחות 4 תווים." });

            // אם לא נתנו שם תצוגה – נשתמש בשם משתמש
            if (string.IsNullOrWhiteSpace(displayName))
                displayName = username;

            var exists = await db.Users.AnyAsync(u => u.Username == username);
            if (exists)
                return Results.Conflict(new { message = "שם משתמש כבר קיים." });

            var user = new User
            {
                Username = username,
                DisplayName = displayName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                RegisteredAtUtc = DateTime.UtcNow
            };

            db.Users.Add(user);
            await db.SaveChangesAsync();

            var token = jwt.CreateToken(user.Username, user.DisplayName, TimeSpan.FromHours(6));
            return Results.Ok(new { token, displayName = user.DisplayName });
        });

    }
}
