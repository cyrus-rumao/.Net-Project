// using System;

using GameStore.Api.Dtos;
using GameStore.Api.Services;

namespace GameStore.Api.Routes;

public static class GamesRoute
{
    const string GetGameEndpointName = "GetGameById";
    public static void MapGameRoutes(this WebApplication app)
    {
        var group = app.MapGroup("/games").WithTags("Games");

        group.MapGet("/", async (IGameService gameService) =>
        await gameService.GetAllAsync());

        group.MapGet("/{id:guid}", async (IGameService gameService, Guid id) =>
        {
            GameDto? game = await gameService.GetByIdAsync(id);
            if (game is null)
            {
                return Results.NotFound("Game not found.");
            }
            return Results.Ok(game);
        }
        ).WithName(GetGameEndpointName);

        group.MapPost("/", async (GameRequest newGame, IGameService gameService) =>
{
    var createdGame = await gameService.CreateAsync(newGame);

    if (createdGame is null)
    {
        return Results.Conflict(
            "A game with this name already exists."
        );
    }

    return Results.CreatedAtRoute(
        GetGameEndpointName,
        new { id = createdGame.Id },
        createdGame
    );
});

        group.MapPut("/{id:guid}", async (Guid id, GameRequest updatedGame, IGameService gameService) =>
        {
            return await gameService.UpdateAsync(id, updatedGame);
        });

        group.MapDelete("/{id:guid}", async (Guid id, IGameService gameService) =>
        {
            var deletedGame = await gameService.DeleteAsync(id);
            if (deletedGame is false)
            {
                return Results.NotFound("Game not Bruh.");
            }   
            return Results.Ok("Game deleted successfully.");
        });
    }
}
