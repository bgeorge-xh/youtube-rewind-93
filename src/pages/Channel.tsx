import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StarRating } from "@/components/StarRating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Video, 
  Calendar, 
  Eye, 
  Play,
  Clock
} from "lucide-react";

// Mock channel data
const mockChannel = {
  id: "ch1",
  name: "HDCYT",
  description: "Home of viral classics from the golden age of internet video. We archive and celebrate the videos that defined a generation.",
  banner: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=300&fit=crop",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
  subscribers: 1200000,
  totalViews: 2500000000,
  joinDate: "May 2007",
  videoCount: 156,
};

const mockVideos = [
  {
    id: "1",
    title: "Charlie Bit My Finger - Original",
    thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=225&fit=crop",
    views: 883000000,
    duration: "0:56",
    uploadDate: "2 years ago",
    rating: 4.7,
  },
  {
    id: "2",
    title: "Charlie Bit My Finger - Again!",
    thumbnail: "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=400&h=225&fit=crop",
    views: 156000000,
    duration: "1:23",
    uploadDate: "1 year ago",
    rating: 4.5,
  },
  {
    id: "3",
    title: "Best of Charlie Compilation",
    thumbnail: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400&h=225&fit=crop",
    views: 45000000,
    duration: "5:42",
    uploadDate: "8 months ago",
    rating: 4.8,
  },
  {
    id: "4",
    title: "Charlie 10 Years Later - Where Are They Now?",
    thumbnail: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=225&fit=crop",
    views: 23000000,
    duration: "12:34",
    uploadDate: "6 months ago",
    rating: 4.6,
  },
  {
    id: "5",
    title: "Making of Charlie Bit My Finger",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop",
    views: 18000000,
    duration: "8:15",
    uploadDate: "4 months ago",
    rating: 4.4,
  },
  {
    id: "6",
    title: "Fan Reactions to Charlie",
    thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=225&fit=crop",
    views: 12000000,
    duration: "6:30",
    uploadDate: "2 months ago",
    rating: 4.3,
  },
];

const formatViews = (views: number) => {
  if (views >= 1000000000) return `${(views / 1000000000).toFixed(1)}B`;
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
};

const Channel = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe.",
        variant: "destructive",
      });
      return;
    }
    setIsSubscribed(!isSubscribed);
    toast({
      title: isSubscribed ? "Unsubscribed" : "Subscribed!",
      description: isSubscribed 
        ? `You unsubscribed from ${mockChannel.name}` 
        : `You subscribed to ${mockChannel.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Channel Banner */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary to-primary/70 overflow-hidden">
          <img 
            src={mockChannel.banner}
            alt="Channel banner"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        {/* Channel Info */}
        <div className="max-w-7xl mx-auto w-full px-4">
          <div className="relative -mt-16 mb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={mockChannel.avatar}
                  alt={mockChannel.name}
                  className="w-32 h-32 rounded-full border-4 border-background shadow-lg"
                />
              </div>

              {/* Channel details */}
              <div className="flex-1 pb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {mockChannel.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {formatViews(mockChannel.subscribers)} subscribers
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    {mockChannel.videoCount} videos
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {formatViews(mockChannel.totalViews)} total views
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {mockChannel.joinDate}
                  </span>
                </div>
              </div>

              {/* Subscribe button */}
              <Button 
                size="lg"
                onClick={handleSubscribe}
                className={isSubscribed ? "bg-muted text-foreground hover:bg-muted/80" : ""}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            </div>
          </div>

          {/* Channel content tabs */}
          <Tabs defaultValue="videos" className="w-full mb-8">
            <TabsList className="w-full justify-start bg-secondary/50 border border-border mb-6 overflow-x-auto">
              <TabsTrigger value="videos" className="gap-2">
                <Play className="w-4 h-4" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="about" className="gap-2">
                About
              </TabsTrigger>
            </TabsList>

            <TabsContent value="videos">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockVideos.map((video) => (
                  <Link key={video.id} to={`/watch/${video.id}`}>
                    <Card className="video-card overflow-hidden group">
                      <div className="relative aspect-video">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                          {video.duration}
                        </span>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-accent">
                          {video.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>{formatViews(video.views)} views</span>
                          <span>•</span>
                          <span>{video.uploadDate}</span>
                        </div>
                        <div className="mt-2">
                          <StarRating rating={video.rating} size="sm" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="about">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">About {mockChannel.name}</h2>
                  <p className="text-muted-foreground mb-6">
                    {mockChannel.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-secondary/30 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-primary">
                        {formatViews(mockChannel.subscribers)}
                      </p>
                      <p className="text-sm text-muted-foreground">Subscribers</p>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-primary">
                        {mockChannel.videoCount}
                      </p>
                      <p className="text-sm text-muted-foreground">Videos</p>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-primary">
                        {formatViews(mockChannel.totalViews)}
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
