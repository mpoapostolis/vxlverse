import useSWR from "swr";
import { pb } from "../lib/pocketbase";

export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  creator: string;
  players?: number;
  rating?: number;
  lastUpdated?: string;
}

const fetcher = async () => {
  const records = await pb.collection("games").getFullList<Game>({
    sort: "-created",
    filter: 'type != "gallery"',
  });
  return records;
};

export function useGames() {
  const { data, error, isLoading, mutate } = useSWR("games", fetcher);

  return {
    games: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
