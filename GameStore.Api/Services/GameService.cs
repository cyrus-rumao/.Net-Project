using GameStore.Api.Data;
using GameStore.Api.Dtos;
using GameStore.Api.Models;
using Microsoft.EntityFrameworkCore;
namespace GameStore.Api.Services;

public class GameService(GameStoreContext context) : IGameService
{

    public async Task<List<GameDto>> GetAllAsync()
    {
        Console.WriteLine("GetAllAsync was called!");
        var games = await context.Games
            .AsNoTracking()
            .Select(g => new GameDto(
                g.Id,
                g.Name,
                g.Genre!.Name,
                g.Price,
                g.ReleaseDate
            ))
            .ToListAsync();

        Console.WriteLine($"Games retrieved: {games.Count}");
        return games;
    }
    public async Task<GameDto?> GetByIdAsync(Guid id)
    {
        Console.WriteLine($"GetByIdAsync called with ID: {id}");

        return await context.Games
            .AsNoTracking()
            .Where(g => g.Id == id)
            .Select(g => new GameDto(
                g.Id,
                g.Name,
                g.Genre!.Name,
                g.Price,
                g.ReleaseDate
            ))
            .FirstOrDefaultAsync();


    }
    public async Task<GameDto?> CreateAsync(GameRequest request)
    {

        //find existing game
        var existingGame = await context.Games
            .FirstOrDefaultAsync(g =>
           g.Name.ToLower().Equals(request.Name.ToLower()));

        if (existingGame is not null)
        {
            return null;
        }
        // Find existing genre
        var genre = await context.Genres
            .FirstOrDefaultAsync(g => g.Name == request.Genre);

        // Create genre if it doesn't exist
        if (genre is null)
        {
            genre = new Genre
            {
                Name = request.Genre
            };

            context.Genres.Add(genre);
        }

        // Create game and associate the genre
        var game = new Game
        {
            Name = request.Name,
            Genre = genre, // Important!
            Price = request.Price,
            ReleaseDate = request.ReleaseDate
        };

        context.Games.Add(game);

        await context.SaveChangesAsync();

        return new GameDto(
            game.Id,
            game.Name,
            genre.Name,
            game.Price,
            game.ReleaseDate
        );
    }

    public async Task<GameDto?> UpdateAsync(Guid id, GameRequest request)
    {
        var game = await context.Games
            .Include(g => g.Genre)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (game is null)
        {
            throw new KeyNotFoundException($"Game with ID {id} not found.");
        }

        // Update game properties
        game.Name = request.Name;
        game.Price = request.Price;
        game.ReleaseDate = request.ReleaseDate;

        // Find or create genre
        var genre = await context.Genres
            .FirstOrDefaultAsync(g => g.Name == request.Genre);

        if (genre is null)
        {
            genre = new Genre { Name = request.Genre };
            context.Genres.Add(genre);
        }

        game.Genre = genre;

        await context.SaveChangesAsync();

        return new GameDto(
            game.Id,
            game.Name,
            genre.Name,
            game.Price,
            game.ReleaseDate
        );
    }


    public async Task<bool> DeleteAsync(Guid id)
    {
        var game = await context.Games
            .Include(g => g.Genre)
            .FirstOrDefaultAsync(g => g.Id == id);

        Console.WriteLine($"DeleteAsync called with ID: {id}");
        if (game is null)
        {
            return false;
        }

        context.Games.Remove(game);
        await context.SaveChangesAsync();

        return true;
    }
}
