import { useState, useMemo } from "react";
import { CreateGameModal } from "../components/game/CreateGameModal";
import { Plus, Search, Filter } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useGames } from "../hooks/useGames";
import { GameFilters } from "../components/game/GameFilters";
import { Button } from "../components/UI/Button";
import { GameCard } from "../components/game/GameCard";
import { Header } from "../components/layout/Header";
import { Input } from "../components/UI/input";
import { Footer } from "../components/layout/Footer";

export function Games() {
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { user } = useAuthStore();
  const { games, isLoading, mutate } = useGames();

  const filteredGames = useMemo(() => {
    if (!games) return [];
    let filtered = [...games];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (game) =>
          game.title.toLowerCase().includes(searchLower) ||
          game.description.toLowerCase().includes(searchLower)
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((game) => {
        const gameTags = game.tags || [];
        return selectedTags.every((tag) => gameTags.includes(tag));
      });
    }

    if (activeTab === "my" && user) {
      filtered = filtered.filter((game) => game.creator === user.id);
    }

    return filtered;
  }, [games, search, selectedTags, activeTab, user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent  animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <div className="flex-1 container mx-auto  px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                Games
              </h1>
              <p className="text-gray-400 mt-1">Discover and play amazing VXL games</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={Filter}
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              >
                Filters
              </Button>
              {user && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Create
                </Button>
              )}
            </div>
          </div>

          {/* Search and Tabs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search games..."
                className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10  text-white placeholder:text-gray-500 
                         focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                strokeWidth={1.5}
              />
            </div>
            <div className="flex gap-2 self-end">
              <Button
                size="sm"
                variant={activeTab === "all" ? "primary" : "outline"}
                onClick={() => setActiveTab("all")}
              >
                All Games
              </Button>
              {user && (
                <Button
                  size="sm"
                  variant={activeTab === "my" ? "primary" : "outline"}
                  onClick={() => setActiveTab("my")}
                >
                  My Games
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        {isFiltersOpen && (
          <div className="mb-6 p-4 bg-white/5 border border-white/10  backdrop-blur-sm">
            <GameFilters selectedTags={selectedTags} onTagsChange={setSelectedTags} />
          </div>
        )}

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-400 mb-4">No games found</p>
            {user && (
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create your first game
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create Game Modal */}
      <CreateGameModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          mutate();
        }}
      />
      <Footer />
    </div>
  );
}
