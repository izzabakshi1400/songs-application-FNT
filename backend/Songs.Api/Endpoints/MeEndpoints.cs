using System.Security.Claims;

namespace Songs.Api.Endpoints;

public static class MeEndpoints
{
    public static void MapMeEndpoints(this WebApplication app)
    {
        app.MapGet("/api/me", (ClaimsPrincipal user) =>
        {
            var displayName = user.Claims.FirstOrDefault(c => c.Type == "displayName")?.Value;
            return Results.Ok(new { username = user.Identity?.Name, displayName });
        }).RequireAuthorization();
    }
}
