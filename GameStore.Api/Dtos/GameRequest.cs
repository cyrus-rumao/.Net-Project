//These are the DTOs DATA TRANSFER OBJECTS
using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.Dtos;

public record GameRequest(
   [Required] string Name,
    [Required] string Genre,
    [Required] decimal Price,
    [Required] DateOnly ReleaseDate
);
