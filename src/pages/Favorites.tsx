import { Header } from "../components/layout/Header";
import { useAuthStore } from "../stores/authStore";
import { GameCard } from "../components/game/GameCard";
import { useGames } from "../hooks/useGames";
import { Heart } from "lucide-react";
import { Footer } from "../components/layout/Footer";

export function Favorites() {
  const { user } = useAuthStore();
  const { games } = useGames();
  // TODO: Implement actual favorites system
  const favoriteGames = games.slice(0, 3); // Temporary: just show first 3 games

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2  bg-red-500/20 text-red-400">
              <Heart className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-white">Favorite Games</h1>
          </div>
          <p className="text-gray-400">Games you've marked as favorites</p>
        </div>

        {/* Games Grid */}
        {favoriteGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteGames.map((game, index) => (
              <GameCard
                key={game.id}
                game={{
                  ...game,
                  owner: game.creator, // Map creator to owner
                  updated: game.lastUpdated, // Map lastUpdated to updated
                }}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-700 ">
            <div className="p-4  bg-red-500/20 text-red-400 mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <div className="text-gray-400 text-center">
              <p className="mb-2">You haven't favorited any games yet.</p>
              <button className="text-blue-400 hover:text-blue-300 transition-colors">
                Browse games →
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
