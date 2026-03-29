import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StarRating } from "@/components/StarRating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Flag,
  Eye,
  Calendar,
  MessageSquare,
  Star,
} from "lucide-react";

const VideoPlayer = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { data: video, isLoading } = useQuery({
    queryKey: ["video", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*, channels(id, name, avatar_url, subscriber_count)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*, profiles:user_id(username, display_name, avatar_url)")
        .eq("video_id", id!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: relatedVideos = [] } = useQuery({
    queryKey: ["related-videos", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*, channels(name)")
        .neq("id", id!)
        .order("views", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: ratingData } = useQuery({
    queryKey: ["ratings", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ratings")
        .select("rating")
        .eq("video_id", id!);
      if (error) throw error;
      const avg = data.length > 0 ? data.reduce((s, r) => s + r.rating, 0) / data.length : 0;
      return { average: avg, count: data.length };
    },
    enabled: !!id,
  });

  const handleComment = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to post comments.", variant: "destructive" });
      return;
    }
    if (!comment.trim() || !id) return;

    const { error } = await supabase.from("comments").insert({
      video_id: id,
      user_id: user.id,
      content: comment.trim(),
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Comment posted!" });
      setComment("");
    }
  };

  const handleRate = async (rating: number) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to rate videos.", variant: "destructive" });
      return;
    }
    if (!id) return;

    // Upsert rating
    const { data: existing } = await supabase
      .from("ratings")
      .select("id")
      .eq("video_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      await supabase.from("ratings").update({ rating }).eq("id", existing.id);
    } else {
      await supabase.from("ratings").insert({ video_id: id, user_id: user.id, rating });
    }

    setUserRating(rating);
    toast({ title: "Rating submitted!", description: `You rated this video ${rating} stars.` });
  };

  const formatViews = (n: number) => {
    if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
    return n.toString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
          <Skeleton className="aspect-video w-full rounded-lg mb-4" />
          <Skeleton className="h-8 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/3" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Video not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  const channel = video.channels as any;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {/* Video player area */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <img
                src={video.thumbnail_url || "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=450&fit=crop"}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Video info */}
            <div className="bg-card border border-border rounded-lg p-4 mb-4">
              <h1 className="text-xl font-bold text-foreground mb-2">{video.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {formatViews(video.views)} views
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(video.created_at).toLocaleDateString()}
                </span>
                {video.category && <Badge variant="secondary">{video.category}</Badge>}
              </div>

              {/* Rating section */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-border">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Rate:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => handleRate(star)} className="p-1 hover:scale-110 transition-transform">
                          <Star className={`w-5 h-5 ${star <= userRating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  {ratingData && ratingData.count > 0 && (
                    <div className="text-sm text-muted-foreground">
                      <StarRating rating={ratingData.average} />
                      <span className="ml-2">({ratingData.count} ratings)</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1"><Share2 className="w-4 h-4" />Share</Button>
                  <Button variant="outline" size="sm" className="gap-1"><Flag className="w-4 h-4" />Report</Button>
                </div>
              </div>

              {/* Channel info */}
              <div className="flex items-center justify-between py-4">
                <Link to={`/channel/${channel?.id}`} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {channel?.avatar_url ? (
                      <img src={channel.avatar_url} alt={channel?.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-muted-foreground">{channel?.name?.[0]}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-accent hover:underline">{channel?.name || "Unknown"}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatViews(channel?.subscriber_count || 0)} subscribers
                    </p>
                  </div>
                </Link>
                <Button
                  onClick={() => {
                    if (!user) { toast({ title: "Sign in required", variant: "destructive" }); return; }
                    setIsSubscribed(!isSubscribed);
                  }}
                  className={isSubscribed ? "bg-muted text-foreground hover:bg-muted/80" : ""}
                >
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </Button>
              </div>

              {video.description && (
                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-sm text-foreground whitespace-pre-wrap">{video.description}</p>
                </div>
              )}
            </div>

            {/* Comments */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="w-5 h-5" />
                  Comments ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder={user ? "Add a comment..." : "Sign in to comment"}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      disabled={!user}
                      rows={2}
                    />
                    <div className="flex justify-end">
                      <Button size="sm" onClick={handleComment} disabled={!comment.trim()}>
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  {comments.map((c: any) => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted shrink-0 flex items-center justify-center overflow-hidden">
                        {c.profiles?.avatar_url ? (
                          <img src={c.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-muted-foreground">
                            {(c.profiles?.username || "U")[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-accent">{c.profiles?.display_name || c.profiles?.username || "User"}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(c.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-foreground mt-1">{c.content}</p>
                      </div>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No comments yet. Be the first!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related videos */}
          <aside className="w-full lg:w-80 shrink-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Related Videos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {relatedVideos.map((rv: any) => (
                  <Link key={rv.id} to={`/watch/${rv.id}`} className="flex gap-2 group">
                    <div className="relative shrink-0">
                      <img
                        src={rv.thumbnail_url || "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=170&fit=crop"}
                        alt={rv.title}
                        className="w-40 h-24 object-cover rounded"
                      />
                      {rv.duration && (
                        <span className="absolute bottom-1 right-1 bg-foreground/80 text-background text-xs px-1 rounded">{rv.duration}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium line-clamp-2 group-hover:text-accent">{rv.title}</h3>
                      <p className="text-xs text-accent mt-1">{rv.channels?.name}</p>
                      <p className="text-xs text-muted-foreground">{formatViews(rv.views)} views</p>
                    </div>
                  </Link>
                ))}
                {relatedVideos.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No related videos</p>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VideoPlayer;
