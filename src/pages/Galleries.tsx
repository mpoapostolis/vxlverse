import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { CreateGalleryModal } from "../components/gallery/CreateGalleryModal";
import {
  Plus,
  Search,
  Filter,
  Sparkles,
  Palette,
  Clock,
  Flame,
  Layout,
  X,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useGalleries } from "../hooks/useGalleries";
import { GalleryFilters } from "../components/gallery/GalleryFilters";
import { Button } from "../components/UI/Button";
import { GalleryCard } from "../components/gallery/GalleryCard";
import { Header } from "../components/layout/Header";
import { Input } from "../components/UI/input";

export function Galleries() {
  const [activeTab, setActiveTab] = useState<"all" | "my" | "featured">("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "updated">("newest");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  const { user } = useAuthStore();
  const { galleries, isLoading, mutate } = useGalleries();

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await mutate();
    setTimeout(() => setIsRefreshing(false), 800); // Add a slight delay for better UX
  };

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setSearch("");
    setSelectedTags([]);
    searchInputRef.current?.focus();
  }, []);

  // Reset filters when tab changes
  useEffect(() => {
    setSearch("");
    setSelectedTags([]);
  }, [activeTab]);

  const filteredGalleries = useMemo(() => {
    if (!galleries) return [];
    let filtered = [...galleries];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (gallery) =>
          gallery.title.toLowerCase().includes(searchLower) ||
          gallery.description.toLowerCase().includes(searchLower)
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((gallery) => {
        const galleryTags = gallery.tags || [];
        return selectedTags.every((tag) => galleryTags.includes(tag));
      });
    }

    if (activeTab === "my" && user) {
      filtered = filtered.filter((gallery) => gallery.creator.id === user.id);
    } else if (activeTab === "featured") {
      // This is a placeholder for featured galleries
      // In a real implementation, you would filter by a 'featured' property
      filtered = filtered.slice(0, Math.min(6, filtered.length));
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "updated":
        filtered.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
        break;
      case "popular":
        filtered.sort((a, b) => b.paintingCount - a.paintingCount);
        break;
    }

    return filtered;
  }, [galleries, search, selectedTags, activeTab, user?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black">
      <Header />

      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12  relative">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-indigo-500/5 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        {/* Header Section */}
        <div className="flex flex-col gap-6  my-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="animate-fadeIn">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
                Art Galleries
              </h1>
              <p className="text-gray-400 mt-3 max-w-xl text-sm">
                Explore stunning 3D art galleries created by our community. Discover unique virtual
                exhibitions and immersive art spaces.
              </p>
            </div>
            <div className="flex items-center gap-2 animate-fadeIn animation-delay-200">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="relative overflow-hidden group transition-all duration-300 hover:shadow-md hover:shadow-blue-500/10 border border-white/10 bg-white/5 hover:bg-white/10"
              >
                <span className="relative z-10 flex items-center">
                  <Filter size={16} className={`mr-2 ${isFiltersOpen ? "text-blue-400" : ""}`} />
                  <span>Filters</span>
                  {selectedTags.length > 0 && (
                    <span className="ml-2 bg-blue-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {selectedTags.length}
                    </span>
                  )}
                  <ChevronDown
                    size={14}
                    className={`ml-2 transition-transform duration-300 ${isFiltersOpen ? "rotate-180 text-blue-400" : ""}`}
                  />
                </span>
                {isFiltersOpen && (
                  <span className="absolute inset-0 bg-blue-500/20 transform origin-left scale-x-100"></span>
                )}
              </Button>

              {user && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 border border-white/10"
                >
                  <span className="relative z-10 flex items-center">
                    <Plus size={16} className="mr-2" />
                    <span>Create Gallery</span>
                  </span>
                  <span className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                </Button>
              )}
            </div>
          </div>

          {/* Search, Sort and Tabs */}
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
                  Found {filteredGalleries.length}{" "}
                  {filteredGalleries.length === 1 ? "result" : "results"}
                  {(search || selectedTags.length > 0) && (
                    <button
                      onClick={handleClearFilters}
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
                  <span>My Galleries</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div
          ref={filtersRef}
          className={`mb-8 p-6 bg-white/5 border backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-500 ${isFiltersOpen ? "max-h-96 opacity-100 border-blue-500/20 shadow-lg shadow-blue-500/5" : "max-h-0 opacity-0 border-transparent"}`}
        >
          {isFiltersOpen && (
            <div className="animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white flex items-center">
                  <Filter size={18} className="mr-2 text-blue-400" />
                  Filter Galleries
                </h3>
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="text-gray-400 hover:text-white text-sm flex items-center gap-1.5 transition-colors px-2 py-1 rounded-md hover:bg-white/5"
                  >
                    <Trash2 size={14} />
                    <span>Clear filters</span>
                  </button>
                )}
              </div>
              <GalleryFilters selectedTags={selectedTags} onTagsChange={setSelectedTags} />
            </div>
          )}
        </div>

        {/* Galleries Grid/List View */}
        <div
          className={`
          transition-all duration-500 animate-fadeIn
          ${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}
        `}
        >
          {filteredGalleries.map((gallery) => (
            <GalleryCard key={gallery.id} gallery={gallery} />
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && filteredGalleries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-gradient-to-b from-white/5 to-white/2 border border-white/10 rounded-xl shadow-xl animate-fadeIn backdrop-blur-sm">
            <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-lg border border-white/5 animate-pulse">
              {search ? (
                <Search className="w-12 h-12 text-blue-400/70" strokeWidth={1.5} />
              ) : activeTab === "my" ? (
                <Palette className="w-12 h-12 text-violet-400/70" strokeWidth={1.5} />
              ) : (
                <Layout className="w-12 h-12 text-indigo-400/70" strokeWidth={1.5} />
              )}
            </div>
            <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              {search
                ? "No matching galleries found"
                : activeTab === "my"
                  ? "You haven't created any galleries yet"
                  : "No galleries found"}
            </h3>
            <p className="text-gray-400 mb-8 max-w-md text-lg">
              {search
                ? "Try adjusting your search or filters to find what you're looking for"
                : activeTab === "my"
                  ? "Create your first gallery to showcase your art collection"
                  : "Be the first to create an amazing 3D art gallery"}
            </p>
            {user && (
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 px-8 py-3 rounded-lg animate-pulse hover:animate-none"
              >
                <span className="flex items-center">
                  <Plus size={20} className="mr-2" />
                  <span>Create your first gallery</span>
                </span>
              </Button>
            )}
            {!user && search && (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  setSearch("");
                  setSelectedTags([]);
                }}
                className="bg-white/10 hover:bg-white/20 transition-all duration-300 px-8 py-3 rounded-lg"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create Gallery Modal */}
      <CreateGalleryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          mutate();
        }}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 animate-fadeIn">
          <div className="bg-gradient-to-b from-slate-800/90 to-slate-900/90 p-10 rounded-xl shadow-2xl flex flex-col items-center border border-white/5">
            <div className="relative mb-6">
              <div className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-indigo-400 rounded-full animate-spin animate-delay-150" />
            </div>
            <p className="text-xl font-medium bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent animate-pulse">
              Loading galleries...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
