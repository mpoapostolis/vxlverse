import { Link } from "react-router-dom";
import { Eye, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Gallery } from "../../hooks/useGalleries";

interface GalleryCardProps {
  gallery: Gallery;
}

export function GalleryCard({ gallery }: GalleryCardProps) {
  return (
    <div className="group bg-white/5 border border-white/10  overflow-hidden transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10">
      <Link to={`/gallery/${gallery.id}`} className="block">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={gallery.thumbnailUrl || "https://api.vxlverse.com/placeholder-gallery.jpg"}
            alt={gallery.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <span className="text-white text-sm font-medium">View Gallery</span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/gallery/${gallery.id}`} className="block">
          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
            {gallery.title}
          </h3>
        </Link>
        <p className="text-gray-400 text-sm line-clamp-2 mb-3">{gallery.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <Link
              to={`/profile/${gallery.creator.id}`}
              className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
            >
              <User size={14} />
              <span>{gallery.creator.username}</span>
            </Link>
            <div className="flex items-center gap-1.5">
              <Eye size={14} />
              <span>{gallery.paintingCount} paintings</span>
            </div>
          </div>
          <span>{formatDistanceToNow(new Date(gallery.createdAt))} ago</span>
        </div>
      </div>
    </div>
  );
}
