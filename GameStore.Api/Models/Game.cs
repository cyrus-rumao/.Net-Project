namespace GameStore.Api.Models;

public class Game
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public required string Name { get; set; }

    public Guid GenreId { get; set; } // Add a foreign key property for Genre
    public Genre? Genre { get; set; } //make type Genre? to allow null values use  '?'
    public decimal Price { get; set; }

    public DateOnly ReleaseDate { get; set; }
}
