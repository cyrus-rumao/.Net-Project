using GameStore.Api.Dtos;
//This is only the interface to tell what each will do not the actual interface implementation. The actual implementation will be in the GameService.cs file
namespace GameStore.Api.Services;

public interface IGameService
{
    Task<List<GameDto>> GetAllAsync();

    Task<GameDto?> GetByIdAsync(Guid id);

    Task<GameDto?> CreateAsync(GameRequest request);

    Task<GameDto?> UpdateAsync(Guid id, GameRequest request);

    Task<bool> DeleteAsync(Guid id);
}