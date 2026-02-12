using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Songs.Api.Data;
using Songs.Api.Endpoints;
using Songs.Api.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// =======================
// DB
// =======================
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// =======================
// JWT Key (single source of truth)
// =======================
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new Exception("Missing Jwt:Key in configuration");

var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

// =======================
// Services
// =======================
builder.Services.AddSingleton(new JwtTokenService(signingKey));
builder.Services.AddHttpClient<ItunesService>();

// =======================
// JWT Authentication
// =======================
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = signingKey,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });

builder.Services.AddAuthorization();

// =======================
// CORS
// =======================
builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// =======================
// Middleware
// =======================
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseCors("frontend");

app.UseAuthentication();
app.UseAuthorization();

// =======================
// Endpoints
// =======================
app.MapAuthEndpoints();
app.MapMeEndpoints();
app.MapMusicEndpoints();

app.MapGet("/", () => "Songs API is running");

app.Run();