import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VideoCard } from "./VideoCard";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";

const CATEGORIES = ["All", "Classic", "Meme", "YTP"];

const fetchVideos = async (search: string, category: string) => {
  let query = supabase
    .from("videos")
    .select("*, channels(name, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(30);

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }
  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

interface VideoGridProps {
  searchQuery?: string;
}

export const VideoGrid = ({ searchQuery = "" }: VideoGridProps) => {
  const [category, setCategory] = useState("All");

  const { data: videos, isLoading } = useQuery({
    queryKey: ["videos", searchQuery, category],
    queryFn: () => fetchVideos(searchQuery, category),
  });

  const heading = searchQuery
    ? `Results for "${searchQuery}"`
    : "Videos Being Watched Right Now";

  if (isLoading) {
    return (
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">{heading}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-video w-full rounded" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">{heading}</h2>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {CATEGORIES.map((cat) => (
          <Badge
            key={cat}
            variant={category === cat ? "default" : "outline"}
            className="cursor-pointer text-sm px-3 py-1 transition-colors"
            onClick={() => setCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {!videos || videos.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium mb-2">No videos found</p>
          <p className="text-sm">
            {searchQuery ? "Try a different search term" : "Be the first to upload a video!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <VideoCard
                id={video.id}
                title={video.title}
                thumbnail={video.thumbnail_url || "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=320&h=180&fit=crop"}
                channel={(video.channels as any)?.name || "Unknown Channel"}
                views={video.views}
                uploadDate={new Date(video.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                duration={video.duration || "0:00"}
                rating={0}
                ratingCount={0}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
