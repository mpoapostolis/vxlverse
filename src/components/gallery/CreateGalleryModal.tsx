import { useState } from "react";
import { X, Image, Loader2 } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { pb } from "../../lib/pocketbase";
import { Input } from "../UI/input";
import { Object3D } from "three";

interface CreateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateGalleryModal({ isOpen, onClose, onSuccess }: CreateGalleryModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();

  if (!isOpen) return null;

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file for the thumbnail");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setThumbnailFile(file);
    setError(null);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate form
    if (!title.trim()) {
      setError("Please enter a gallery title");
      return;
    }

    if (title.length < 3) {
      setError("Gallery title must be at least 3 characters long");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a gallery description");
      return;
    }

    if (!thumbnailFile) {
      setError("Please upload a thumbnail image");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData for PocketBase upload
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("creator", user.id);
      formData.append("paintingCount", "0"); // Initial count is 0
      formData.append("isPublic", "false");
      formData.append("type", "gallery");
      const owner = user.id;
      formData.append("owner", owner);
      const uuid = new Object3D().uuid;
      const currentSceneId = uuid;
      const scenes = [{ id: currentSceneId, objects: [] }];
      const gameConf = JSON.stringify({ scenes, currentSceneId, gridSnap: false });
      formData.append("gameConf", gameConf);

      // Add thumbnail file
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      // Save to PocketBase
      await pb.collection("games").create(formData);

      // Reset form and notify parent component
      setTitle("");
      setDescription("");
      setThumbnailFile(null);
      setThumbnailPreview(null);

      onSuccess();
    } catch (err) {
      console.error("Failed to create gallery:", err);
      setError("Failed to create gallery. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-white/10 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Create New Gallery</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Thumbnail</label>
            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-2 border-dashed border-white/10 hover:border-blue-400/50 transition-all duration-300 group">
              {thumbnailPreview ? (
                <div className="relative h-full">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailFile(null);
                      setThumbnailPreview(null);
                    }}
                    className="absolute top-4 right-4 p-2.5 bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/30 hover:scale-110"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group-hover:bg-white/5 transition-all duration-300">
                  <div className="p-4 bg-gradient-to-br from-blue-500/10 to-violet-500/10 group-hover:scale-110 transition-all duration-300">
                    <Image className="w-8 h-8 text-gray-500 group-hover:text-blue-400 transition-colors duration-300" />
                  </div>
                  <span className="text-sm text-gray-500 group-hover:text-blue-400 mt-4 transition-colors duration-300">
                    Click to upload thumbnail
                  </span>
                  <span className="text-xs text-gray-600 mt-1">Recommended: 1920x1080px</span>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Title</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
              placeholder="Enter gallery title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 resize-none"
              placeholder="Enter gallery description"
              rows={4}
              required
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {description.length}/500 characters
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 disabled:opacity-50 disabled:hover:from-blue-500 disabled:hover:to-violet-500 text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Gallery"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
