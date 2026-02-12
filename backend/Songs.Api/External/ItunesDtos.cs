namespace Songs.Api.External;

public sealed class ItunesSearchResponse<T>
{
    public int ResultCount { get; set; }
    public List<T> Results { get; set; } = new();
}

public sealed class ItunesMusicItem
{
    public long TrackId { get; set; }
    public long CollectionId { get; set; }

    public string? TrackName { get; set; }
    public string? CollectionName { get; set; }
    public string? ArtistName { get; set; }

    public string? ArtworkUrl100 { get; set; }
    public DateTime? ReleaseDate { get; set; }

    public string? ShortDescription { get; set; }
    public string? LongDescription { get; set; }
    public string? Description { get; set; }
    public string? PreviewUrl { get; set; }

}
