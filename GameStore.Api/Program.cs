using DotNetEnv;
using GameStore.Api.Data;
using GameStore.Api.Routes;
using GameStore.Api.Services;
using Microsoft.EntityFrameworkCore;
Env.Load();

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddValidation();
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "DB_URL environment variable is missing."
    );
}
builder.Services.AddDbContext<GameStoreContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddScoped<IGameService, GameService>();
var app = builder.Build();
app.UseCors("Frontend");
app.MapGet("/", () => "Welcome to the Game Store API! Use /games to get a list of games or /games/{id} to get a specific game by ID.");

app.MapGameRoutes();
app.Run();