import { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StarRating } from "@/components/StarRating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Users, Video, Calendar, Eye, Play, Camera, ImagePlus } from "lucide-react";

const formatViews = (views: number) => {
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B`;
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M`;
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K`;
  return views.toString();
};

const Channel = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const { data: channel, isLoading } = useQuery({
    queryKey: ["channel", id, user?.id],
    queryFn: async () => {
      if (id === "me" && user) {
        const { data, error } = await supabase
          .from("channels")
          .select("*")
          .eq("user_id", user.id)
          .single();
        if (error) throw error;
        return data;
      }
      const { data, error } = await supabase
        .from("channels")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id && (id !== "me" || !!user),
  });

  const { data: videos = [] } = useQuery({
    queryKey: ["channel-videos", channel?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("channel_id", channel!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!channel?.id,
  });

  const handleSubscribe = () => {
    if (!user) {
      toast({ title: "Sign in required", variant: "destructive" });
      return;
    }
    setIsSubscribed(!isSubscribed);
    toast({
      title: isSubscribed ? "Unsubscribed" : "Subscribed!",
      description: isSubscribed
        ? `You unsubscribed from ${channel?.name}`
        : `You subscribed to ${channel?.name}`,
    });
  };

  const uploadImage = async (
    file: File,
    bucket: string,
    field: "avatar_url" | "banner_url",
    table: "channels" | "profiles"
  ) => {
    if (!user || !channel) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error: uploadErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (uploadErr) throw uploadErr;

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

    if (table === "channels") {
      const { error } = await supabase.from("channels").update({ [field]: urlData.publicUrl }).eq("id", channel.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("profiles").update({ [field]: urlData.publicUrl }).eq("user_id", user.id);
      if (error) throw error;
    }

    return urlData.publicUrl;
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      await uploadImage(file, "avatars", "avatar_url", "channels");
      // Also update profile avatar
      await uploadImage(file, "avatars", "avatar_url", "profiles");
      queryClient.invalidateQueries({ queryKey: ["channel"] });
      toast({ title: "Avatar updated!" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBanner(true);
    try {
      await uploadImage(file, "channel-banners", "banner_url", "channels");
      queryClient.invalidateQueries({ queryKey: ["channel"] });
      toast({ title: "Banner updated!" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          <Skeleton className="h-48 md:h-64 w-full" />
          <div className="max-w-7xl mx-auto px-4 -mt-16">
            <Skeleton className="w-32 h-32 rounded-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Channel not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  const isOwner = user?.id === channel.user_id;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Banner */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary to-primary/70 overflow-hidden group">
          {channel.banner_url && (
            <img src={channel.banner_url} alt="Channel banner" className="w-full h-full object-cover opacity-80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          {isOwner && (
            <>
              <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
              <button
                onClick={() => bannerInputRef.current?.click()}
                disabled={uploadingBanner}
                className="absolute top-4 right-4 bg-background/80 hover:bg-background text-foreground px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ImagePlus className="w-4 h-4" />
                {uploadingBanner ? "Uploading..." : "Change Banner"}
              </button>
            </>
          )}
        </div>

        {/* Channel Info */}
        <div className="max-w-7xl mx-auto w-full px-4">
          <div className="relative -mt-16 mb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              {/* Avatar with upload */}
              <div className="relative group/avatar">
                <div className="w-32 h-32 rounded-full border-4 border-background shadow-lg bg-muted flex items-center justify-center overflow-hidden">
                  {channel.avatar_url ? (
                    <img src={channel.avatar_url} alt={channel.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-muted-foreground">{channel.name[0]}</span>
                  )}
                </div>
                {isOwner && (
                  <>
                    <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                    >
                      <Camera className="w-6 h-6 text-white" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex-1 pb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{channel.name}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {formatViews(channel.subscriber_count)} subscribers
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    {videos.length} videos
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(channel.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>

              {!isOwner && (
                <Button
                  size="lg"
                  onClick={handleSubscribe}
                  className={isSubscribed ? "bg-muted text-foreground hover:bg-muted/80" : ""}
                >
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="videos" className="w-full mb-8">
            <TabsList className="w-full justify-start bg-secondary/50 border border-border mb-6 overflow-x-auto">
              <TabsTrigger value="videos" className="gap-2"><Play className="w-4 h-4" />Videos</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="videos">
              {videos.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="text-lg font-medium mb-2">No videos yet</p>
                  {isOwner && <p className="text-sm">Click Upload to add your first video!</p>}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos.map((video) => (
                    <Link key={video.id} to={`/watch/${video.id}`}>
                      <Card className="video-card overflow-hidden group">
                        <div className="relative aspect-video">
                          <img
                            src={video.thumbnail_url || "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=225&fit=crop"}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          {video.duration && (
                            <span className="absolute bottom-2 right-2 bg-foreground/80 text-background text-xs px-1.5 py-0.5 rounded">
                              {video.duration}
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-12 h-12 text-white" />
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-accent">{video.title}</h3>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>{formatViews(video.views)} views</span>
                            <span>•</span>
                            <span>{new Date(video.created_at).toLocaleDateString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="about">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">About {channel.name}</h2>
                  <p className="text-muted-foreground mb-6">{channel.description || "No description yet."}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-secondary/30 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{formatViews(channel.subscriber_count)}</p>
                      <p className="text-sm text-muted-foreground">Subscribers</p>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{videos.length}</p>
                      <p className="text-sm text-muted-foreground">Videos</p>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-primary">
                        {formatViews(videos.reduce((sum, v) => sum + v.views, 0))}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Views</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Channel;
