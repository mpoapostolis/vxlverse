import { Link } from "react-router-dom";
import { Eye, User, Calendar, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Gallery } from "../../hooks/useGalleries";

interface GalleryCardProps {
  gallery: Gallery;
}

export function GalleryCard({ gallery }: GalleryCardProps) {
  return (
    <div className="group bg-gradient-to-br from-slate-800/80 to-slate-900/90 border border-white/10 rounded-lg overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 hover:translate-y-[-4px]">
      <Link to={`/gallery/${gallery.id}`} className="block">
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <img
            src={gallery.thumbnailUrl || "https://api.vxlverse.com/placeholder-gallery.jpg"}
            alt={gallery.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-between p-4">
            <span className="text-white text-sm font-medium">View Gallery</span>
            <span className="bg-blue-500/80 rounded-full p-1.5 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 ease-out">
              <ArrowRight size={16} className="text-white" />
            </span>
          </div>
          {/* Featured badge could be added when that property exists */}
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/gallery/${gallery.id}`} className="block">
          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
            {gallery.title}
          </h3>
        </Link>
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{gallery.description}</p>

        {gallery.tags && gallery.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {gallery.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
            {gallery.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{gallery.tags.length - 3} more</span>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 pt-3 border-t border-white/5">
          <div className="flex items-center justify-between text-xs">
            <Link
              to={`/profile/${gallery.creator.id}`}
              className="flex items-center gap-1.5 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <User size={14} strokeWidth={1.5} />
              <span className="font-medium">{gallery.creator.username}</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Eye size={14} strokeWidth={1.5} />
                <span>{gallery.paintingCount}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} strokeWidth={1.5} />
              <span>{formatDistanceToNow(new Date(gallery.createdAt))} ago</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-blue-400">{gallery.paintingCount}</span>
              <span>paintings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
