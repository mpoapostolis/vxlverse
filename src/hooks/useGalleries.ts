import { useState, useEffect } from "react";
import { pb } from "../lib/pocketbase";

export interface Gallery {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  thumbnailUrl?: string;
  gameConf?: {
    scenes: unknown[];
  };
  createdAt: string;
  updated: string;
  creator: string;
  paintingCount: number;
  tags: string[];
  isPublic: boolean;
  type: string;
}

export function useGalleries() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGalleries = async () => {
    setIsLoading(true);
    try {
      // Fetch galleries from PocketBase games collection with type=gallery
      const response = await pb.collection("games").getList(1, 100, {
        filter: 'type = "gallery"',
        sort: "-created",
        expand: "owner",
      });

      // Transform the response to match our Gallery interface
      const fetchedGalleries = response.items.map((item) => {
        // Get the creator information

        // Get the thumbnail URL if it exists
        const thumbnailUrl = item.thumbnail ? pb.files.getURL(item, item.thumbnail) : "";

        // Parse tags if they exist and are stored as a JSON string
        let tags: string[] = [];
        if (item.tags) {
          try {
            tags = typeof item.tags === "string" ? JSON.parse(item.tags) : item.tags;
          } catch (e) {
            console.error("Error parsing tags:", e);
          }
        }

        return {
          id: item.id,
          title: item.title,
          description: item.description,
          thumbnail: item.thumbnail,
          thumbnailUrl,
          createdAt: item.created,
          updated: item.updated,
          creator: item.expand?.owner.email || "Unknown",
          paintingCount: item.gameConf?.scenes?.at(0)?.objects?.length || 0,
          tags,
          isPublic: item.isPublic,
          type: item.type,
        };
      });

      setGalleries(fetchedGalleries);
    } catch (error) {
      console.error("Error fetching galleries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const mutate = async () => {
    await fetchGalleries();
  };

  return { galleries, isLoading, mutate };
}
