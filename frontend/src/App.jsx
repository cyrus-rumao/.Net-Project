import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, X, Gamepad2, RefreshCw } from "lucide-react";
import api from "./api/axios";

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedGame, setSelectedGame] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    genre: "",
    price: "",
    releaseDate: "",
  });
const handleCreateGame = async (event) => {
  event.preventDefault();

  try {
    setSaving(true);

    const payload = {
      name: formData.name,
      genre: formData.genre,
      price: Number(formData.price),
      releaseDate: formData.releaseDate,
    };

    await api.post("/games", payload);

    await fetchGames();

    setIsCreating(false);

    setFormData({
      name: "",
      genre: "",
      price: "",
      releaseDate: "",
    });
  } catch (err) {
    alert(err.response?.data?.message || "Unable to create game.");
  } finally {
    setSaving(false);
  }
};
  // Fetch all games
  const fetchGames = async () => {
    try {
      setLoading(true);
      setError("");
      ``;

      const response = await api.get("/games");
      setGames(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to fetch games. Check whether the API is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Fetch one game and open details modal
  const openGameDetails = async (id) => {
    try {
      setModalLoading(true);
      setSelectedGame(null);
      setIsEditing(false);

      const response = await api.get(`/games/${id}`);
      setSelectedGame(response.data);
    } catch (err) {
      alert("Unable to load game details.");
    } finally {
      setModalLoading(false);
    }
  };

  // Open edit form
  const openEditForm = () => {
    setFormData({
      name: selectedGame.name,
      genre: selectedGame.genre,
      price: selectedGame.price,
      releaseDate: selectedGame.releaseDate,
    });

    setIsEditing(true);
  };

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Update game
  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...formData,
        price: Number(formData.price),
      };

      await api.put(`/games/${selectedGame.id}`, payload);

      await fetchGames();

      // Reload updated game details
      const response = await api.get(`/games/${selectedGame.id}`);
      setSelectedGame(response.data);

      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to update game.");
    } finally {
      setSaving(false);
    }
  };

  // Delete game
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this game?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/games/${id}`);

      setGames((previous) => previous.filter((game) => game.id !== id));

      setSelectedGame(null);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to delete game.");
    }
  };

  const closeModal = () => {
    setSelectedGame(null);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-5">
          <Gamepad2 size={32} className="text-indigo-400" />

          <div>
            <h1 className="text-2xl font-bold">GameStore</h1>
            <p className="text-sm text-slate-400">
              Manage your game collection
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Games Library</h2>
            <p className="mt-1 text-slate-500">Browse and manage your games.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setFormData({
                  name: "",
                  genre: "",
                  price: "",
                  releaseDate: "",
                });
                setSelectedGame(null);
                setIsEditing(false);
                setIsCreating(true);
              }}
              className="rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
            >
              + Add Game
            </button>

            <button
              onClick={fetchGames}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
            >
              <RefreshCw size={17} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">
            Loading games...
          </div>
        ) : games.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white py-20 text-center">
            <Gamepad2 size={42} className="mx-auto mb-3 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-700">
              No games found
            </h3>
            <p className="mt-1 text-slate-500">
              Your game library is currently empty.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-sm uppercase text-slate-600">
                  <tr>
                    <th className="px-6 py-4">Game</th>
                    <th className="px-6 py-4">Genre</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Release Date</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {games.map((game) => (
                    <tr key={game.id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {game.name}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                          {game.genre}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-700">
                        ${Number(game.price).toFixed(2)}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {game.releaseDate}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openGameDetails(game.id)}
                            title="View details"
                            className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            onClick={() => openGameDetails(game.id)}
                            title="Edit game"
                            className="rounded-lg bg-amber-50 p-2 text-amber-600 hover:bg-amber-100"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() => handleDelete(game.id)}
                            title="Delete game"
                            className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="mt-4 text-sm text-slate-500">
          Total games: {games.length}
        </p>
      </main>
      {/* Create Game Modal */}
      {isCreating && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsCreating(false);
            }
          }}
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                Add New Game
              </h2>

              <button
                onClick={() => setIsCreating(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleCreateGame} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Game Name
                </label>

                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter game name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Genre
                </label>

                <input
                  required
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="e.g. Action RPG"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Price
                </label>

                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Release Date
                </label>

                <input
                  required
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? "Creating..." : "Create Game"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Game details / edit modal */}
      {(selectedGame || modalLoading) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                {isEditing ? "Update Game" : "Game Details"}
              </h2>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            {modalLoading ? (
              <p className="py-10 text-center text-slate-500">
                Loading game details...
              </p>
            ) : isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Game Name
                  </label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Genre
                  </label>
                  <input
                    required
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Price
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Release Date
                  </label>
                  <input
                    required
                    type="date"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : selectedGame ? (
              <div>
                <div className="mb-6 rounded-xl bg-indigo-50 p-5">
                  <Gamepad2 size={40} className="mb-3 text-indigo-600" />
                  <h3 className="text-xl font-bold text-slate-800">
                    {selectedGame.name}
                  </h3>
                  <p className="mt-1 text-sm text-indigo-700">
                    {selectedGame.genre}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-slate-500">Game ID</span>
                    <span className="max-w-[65%] break-all text-right text-sm text-slate-700">
                      {selectedGame.id}
                    </span>
                  </div>

                  <div className="flex justify-between border-b pb-3">
                    <span className="text-slate-500">Price</span>
                    <span className="font-semibold text-slate-800">
                      ${Number(selectedGame.price).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between border-b pb-3">
                    <span className="text-slate-500">Release Date</span>
                    <span className="text-slate-800">
                      {selectedGame.releaseDate}
                    </span>
                  </div>
                </div>

                <div className="mt-7 flex justify-end gap-3">
                  <button
                    onClick={() => handleDelete(selectedGame.id)}
                    className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 font-medium text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={17} />
                    Delete
                  </button>

                  <button
                    onClick={openEditForm}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
                  >
                    <Pencil size={17} />
                    Edit Game
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
