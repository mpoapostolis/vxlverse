import { useState, useMemo } from "react";
import { CreateGalleryModal } from "../components/gallery/CreateGalleryModal";
import { Plus, Search, Filter } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useGalleries } from "../hooks/useGalleries";
import { GalleryFilters } from "../components/gallery/GalleryFilters";
import { Button } from "../components/UI/Button";
import { GalleryCard } from "../components/gallery/GalleryCard";
import { Header } from "../components/layout/Header";
import { Input } from "../components/UI/input";

export function Galleries() {
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { user } = useAuthStore();
  const { galleries, isLoading, mutate } = useGalleries();

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
    }

    return filtered;
  }, [galleries, search, selectedTags, activeTab, user?.id]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                Art Galleries
              </h1>
              <p className="text-gray-400 mt-1">
                Explore stunning 3D art galleries created by our community
              </p>
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
                placeholder="Search galleries..."
                className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 text-white placeholder:text-gray-500 
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
                All Galleries
              </Button>
              {user && (
                <Button
                  size="sm"
                  variant={activeTab === "my" ? "primary" : "outline"}
                  onClick={() => setActiveTab("my")}
                >
                  My Galleries
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        {isFiltersOpen && (
          <div className="mb-6 p-4 bg-white/5 border border-white/10 backdrop-blur-sm ">
            <GalleryFilters selectedTags={selectedTags} onTagsChange={setSelectedTags} />
          </div>
        )}

        {/* Galleries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGalleries.map((gallery) => (
            <GalleryCard key={gallery.id} gallery={gallery} />
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && filteredGalleries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-400 mb-4">No galleries found</p>
            {user && (
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create your first gallery
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
