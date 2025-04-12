import { useState, useMemo, useRef } from "react";
import { CreateGameModal } from "../components/game/CreateGameModal";
import { Plus, Search, Filter, Sparkles, Palette, Clock, Flame, X } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useGames } from "../hooks/useGames";
import { GameFilters } from "../components/game/GameFilters";
import { Button } from "../components/UI/Button";
import { GameCard } from "../components/game/GameCard";
import { Header } from "../components/layout/Header";
import { Input } from "../components/UI/input";
import { Footer } from "../components/layout/Footer";

export function Games() {
  const [activeTab, setActiveTab] = useState<"all" | "my" | "featured">("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "updated">("newest");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    } else if (activeTab === "featured") {
      // Filter featured games - assuming games have a featured property or using another way to determine featured status
      filtered = filtered.filter((game) => (game as any).featured === true);
    }

    // Sort games based on sortBy value
    if (sortBy === "newest") {
      // Sort by creation date - using pb's created field or lastUpdated as fallback
      filtered.sort((a, b) => {
        const dateA = (a as any).created ? new Date((a as any).created).getTime() : 0;
        const dateB = (b as any).created ? new Date((b as any).created).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sortBy === "popular") {
      // Sort by popularity - using players count or rating as indicators
      filtered.sort((a, b) => {
        const likesA = (a as any).likes?.length || a.players || 0;
        const likesB = (b as any).likes?.length || b.players || 0;
        return likesB - likesA;
      });
    } else if (sortBy === "updated") {
      // Sort by update date - using lastUpdated field
      filtered.sort((a, b) => {
        const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
        const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
        return dateB - dateA;
      });
    }

    return filtered;
  }, [games, search, selectedTags, activeTab, user?.id, sortBy]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent  animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black">
      <Header />

      <div className="flex-1 container   mx-auto  px-4 sm:px-6 lg:px-8 pt-20 pb-8">
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
          <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn animation-delay-300 relative z-10">
            <div className="relative flex-1 group">
              <div
                className={`relative transition-all duration-300 ${isSearchFocused ? "scale-[1.02]" : "scale-100"}`}
              >
                <Input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search by title, description or tags..."
                  className={`w-full h-12 pl-12 pr-4 bg-white/5 border text-white placeholder:text-gray-500 
                           focus:outline-none focus:ring-2 transition-all rounded-lg
                           ${isSearchFocused ? "border-violet-500/50 focus:ring-violet-500/30 shadow-lg shadow-violet-500/10" : "border-white/10 focus:ring-violet-500/10 group-hover:border-white/20"}`}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6">
                  <Search
                    className={`w-5 h-5 transition-colors ${isSearchFocused ? "text-violet-400" : "text-gray-500 group-hover:text-gray-400"}`}
                    strokeWidth={1.5}
                  />
                </div>
                {search && (
                  <button
                    onClick={() => {
                      setSearch("");
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              {search && (
                <div className="absolute -bottom-6 left-0 text-xs text-blue-300 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
                  Found {filteredGames.length} {filteredGames.length === 1 ? "result" : "results"}
                  {(search || selectedTags.length > 0) && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setSelectedTags([]);
                      }}
                      className="ml-3 text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <X size={10} />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Sort buttons */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1 h-12 shadow-sm shadow-blue-500/5">
              <button
                onClick={() => setSortBy("newest")}
                className={`flex items-center px-3 py-1.5 rounded-md transition-all ${sortBy === "newest" ? "bg-blue-500/20 text-blue-300" : "text-gray-400 hover:bg-white/5"}`}
              >
                <Clock size={14} className="mr-1.5" />
                <span>Newest</span>
              </button>
              <button
                onClick={() => setSortBy("popular")}
                className={`flex items-center px-3 py-1.5 rounded-md transition-all ${sortBy === "popular" ? "bg-blue-500/20 text-blue-300" : "text-gray-400 hover:bg-white/5"}`}
              >
                <Flame size={14} className="mr-1.5" />
                <span>Popular</span>
              </button>
              <button
                onClick={() => setSortBy("updated")}
                className={`flex items-center px-3 py-1.5 rounded-md transition-all ${sortBy === "updated" ? "bg-blue-500/20 text-blue-300" : "text-gray-400 hover:bg-white/5"}`}
              >
                <Palette size={14} className="mr-1.5" />
                <span>Updated</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 self-end bg-white/5 border border-white/10 rounded-lg p-1 h-12 shadow-sm shadow-blue-500/5">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex items-center px-4 py-1.5 rounded-md transition-all ${activeTab === "all" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}
              >
                <span>All</span>
              </button>

              <button
                onClick={() => setActiveTab("featured")}
                className={`flex items-center px-4 py-1.5 rounded-md transition-all ${activeTab === "featured" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}
              >
                <Sparkles size={14} className="mr-1.5" />
                <span>Featured</span>
              </button>

              {user && (
                <button
                  onClick={() => setActiveTab("my")}
                  className={`flex items-center px-4 py-1.5 rounded-md transition-all ${activeTab === "my" ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}
                >
                  <span>My Games</span>
                </button>
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
