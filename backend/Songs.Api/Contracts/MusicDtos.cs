namespace Songs.Api.Contracts;

public sealed record MusicSearchItem(
    string Id,
    string Title,
    string Artist,
    string? Description,
    string? ImageUrl,
    DateTime? ReleaseDate,
    string? PreviewUrl
);

public sealed record MusicSearchResponse(
    string Term,
    List<MusicSearchItem> Items
);

public sealed record MusicDetailsResponse(
    string Id,
    string Title,
    string Artist,
    string? Description,
    string? ImageUrl,
    DateTime? ReleaseDate,
    string? PreviewUrl
);
