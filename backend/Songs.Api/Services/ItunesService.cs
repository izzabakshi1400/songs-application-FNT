using System.Net;
using System.Text.Json;
using Songs.Api.Contracts;
using Songs.Api.External;

namespace Songs.Api.Services;

public sealed class ItunesService
{
    private readonly HttpClient _http;
    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

    public ItunesService(HttpClient http)
    {
        _http = http;
    }

    public async Task<MusicSearchResponse> SearchAsync(string term, int limit = 20, CancellationToken ct = default)
    {
        term = (term ?? "").Trim();
        if (string.IsNullOrWhiteSpace(term))
            return new MusicSearchResponse(term, new List<MusicSearchItem>());

        limit = Math.Clamp(limit, 1, 50);

        var url =
            $"https://itunes.apple.com/search?term={WebUtility.UrlEncode(term)}&entity=song&limit={limit}";

        var json = await _http.GetStringAsync(url, ct);
        var data = JsonSerializer.Deserialize<ItunesSearchResponse<ItunesMusicItem>>(json, JsonOpts)
                   ?? new ItunesSearchResponse<ItunesMusicItem>();

        var items = data.Results
            .Select(ToSearchItem)
            .Where(x => !string.IsNullOrWhiteSpace(x.Title) && !string.IsNullOrWhiteSpace(x.Artist))
            .ToList();

        return new MusicSearchResponse(term, items);
    }

    public async Task<MusicDetailsResponse?> LookupAsync(string id, CancellationToken ct = default)
    {
        if (!long.TryParse(id, out var trackId))
            return null;

        var url = $"https://itunes.apple.com/lookup?id={trackId}";
        var json = await _http.GetStringAsync(url, ct);

        var data = JsonSerializer.Deserialize<ItunesSearchResponse<ItunesMusicItem>>(json, JsonOpts);
        var first = data?.Results?.FirstOrDefault();
        if (first is null) return null;

        var item = ToSearchItem(first);
        return new MusicDetailsResponse(
            item.Id, item.Title, item.Artist, item.Description, item.ImageUrl, item.ReleaseDate, item.PreviewUrl
        );

    }

    private static MusicSearchItem ToSearchItem(ItunesMusicItem x)
    {
        var title = x.TrackName ?? x.CollectionName ?? "(ללא שם)";
        var artist = x.ArtistName ?? "(ללא אומן)";

        // תיאור - לא תמיד קיים
        var desc = x.LongDescription ?? x.ShortDescription ?? x.Description;

        var img = x.ArtworkUrl100;
        if (!string.IsNullOrWhiteSpace(img))
            img = img.Replace("100x100bb", "600x600bb");

        var id = x.TrackId != 0 ? x.TrackId.ToString() : x.CollectionId.ToString();

        return new MusicSearchItem(
     Id: id,
     Title: title,
     Artist: artist,
     Description: desc,
     ImageUrl: img,
     ReleaseDate: x.ReleaseDate,
     PreviewUrl: x.PreviewUrl
 );

    }
}
