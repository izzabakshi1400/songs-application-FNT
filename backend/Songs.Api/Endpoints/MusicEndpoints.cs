using Songs.Api.Services;

namespace Songs.Api.Endpoints;

public static class MusicEndpoints
{
    public static void MapMusicEndpoints(this WebApplication app)
    {
        app.MapGet("/api/music/search", async (string term, int? limit, ItunesService svc, CancellationToken ct) =>
        {
            var res = await svc.SearchAsync(term, limit ?? 20, ct);
            return Results.Ok(res);
        }).RequireAuthorization();

        app.MapGet("/api/music/lookup/{id}", async (string id, ItunesService svc, CancellationToken ct) =>
        {
            var res = await svc.LookupAsync(id, ct);
            return res is null ? Results.NotFound(new { message = "פריט לא נמצא." }) : Results.Ok(res);
        }).RequireAuthorization();
    }
}
