namespace Songs.Api.Contracts;

public record RegisterRequest(string Username, string Password, string? DisplayName);
