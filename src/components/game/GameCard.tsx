import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { pb } from "../../lib/pocketbase";
import { Star, Users, Clock, Trash2, Edit3, PlayCircle, Heart } from "lucide-react";
import { useState, memo } from "react";
import { generatePlaceholderColor } from "../../utils/imageOptimizer";

interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  owner: string;
  rating?: number;
  players?: number;
  updated?: string;
  tags?: string[];
}

interface GameCardProps {
  game: Game;
  index: number;
  onDelete?: () => void;
}

const DEFAULT_THUMBNAIL =
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80";

export const GameCard = memo(function GameCard({ game, index = 0, onDelete }: GameCardProps) {
  const { user } = useAuthStore();
  const isOwner = user?.id === game.owner;
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const placeholderColor = generatePlaceholderColor(game.title);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this game?")) return;
    try {
      await pb.collection("games").delete(game.id);
      onDelete?.();
    } catch (error) {
      console.error("Failed to delete game:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative h-[22rem] rounded-xl overflow-hidden bg-gray-900 border border-white/5 hover:border-blue-500/30 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden" style={{ backgroundColor: placeholderColor }}>
        <img
          src={
            game.thumbnail
              ? pb.files.getURL(game, game.thumbnail, { thumb: "300x300" })
              : DEFAULT_THUMBNAIL
          }
          alt={game.title}
          width="300"
          height="200"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-70" />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link to={`/play/${game.id}`}>
            <div className="relative">
              <div className="absolute -inset-1 bg-blue-500 rounded-full opacity-70 blur-md"></div>
              <div className="relative bg-blue-600 p-3 rounded-full shadow-lg shadow-blue-500/40">
                <PlayCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        </div>

        {/* Like button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm bg-black/30 border border-white/10 shadow-lg hover:bg-black/50 transition-all duration-200"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked ? "text-red-500 fill-red-500" : "text-white"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="relative flex-1 p-5 flex flex-col">
        {/* Title and Actions */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-semibold text-white truncate">{game.title}</h3>
          {isOwner && (
            <div className="flex gap-1 flex-shrink-0">
              <Link
                to={`/editor/${game.id}`}
                className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-3">
          {game.description || "No description available"}
        </p>

        {/* Tags */}
        {game.tags && game.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 max-h-12 overflow-y-auto">
            {game.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] font-medium text-blue-300 bg-blue-500/10 rounded-full border border-blue-500/20 whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs mt-auto pt-3 border-t border-gray-800/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-full bg-yellow-500/10">
                <Star className="w-3.5 h-3.5 text-yellow-400" />
              </div>
              <span className="text-yellow-400 font-medium">
                {game.rating?.toFixed(1) || "4.5"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-full bg-blue-500/10">
                <Users className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <span className="text-blue-400 font-medium">{game.players || "128"}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="p-1.5 rounded-full bg-violet-500/10">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <span className="text-violet-400 font-medium">
              {game.updated
                ? new Date(game.updated).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                : new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
