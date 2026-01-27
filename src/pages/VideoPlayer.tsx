import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StarRating } from "@/components/StarRating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Flag, 
  Clock, 
  Eye, 
  Calendar,
  MessageSquare,
  Star
} from "lucide-react";

// Mock data for demo
const mockVideo = {
  id: "1",
  title: "Charlie Bit My Finger - Classic Viral Video",
  description: "The original viral video that took the internet by storm in 2007. Two British brothers in a moment that became internet history. Charlie bit my finger - again!",
  thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=450&fit=crop",
  views: 883000000,
  uploadDate: "May 22, 2007",
  duration: "0:56",
  channel: {
    id: "ch1",
    name: "HDCYT",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    subscribers: 1200000,
  },
  category: "Entertainment",
  rating: 4.7,
  totalRatings: 2340000,
};

const mockComments = [
  {
    id: "c1",
    user: "RetroFan2007",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=50&h=50&fit=crop",
    content: "This video defined an entire generation of internet culture. Classic!",
    likes: 1523,
    date: "2 days ago",
  },
  {
    id: "c2",
    user: "NostalgiaKing",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
    content: "I remember watching this when I was in high school. Time flies!",
    likes: 892,
    date: "1 week ago",
  },
  {
    id: "c3",
    user: "ClassicViewer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
    content: "Still one of the best videos on the internet. 5 stars!",
    likes: 456,
    date: "2 weeks ago",
  },
];

const relatedVideos = [
  {
    id: "2",
    title: "David After Dentist",
    thumbnail: "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=300&h=170&fit=crop",
    views: "140M views",
    channel: "boaborris",
    duration: "1:59",
  },
  {
    id: "3",
    title: "Evolution of Dance",
    thumbnail: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=300&h=170&fit=crop",
    views: "307M views",
    channel: "judsonlaipply",
    duration: "6:00",
  },
  {
    id: "4",
    title: "Keyboard Cat",
    thumbnail: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=170&fit=crop",
    views: "72M views",
    channel: "CharlieSchmidt",
    duration: "0:54",
  },
];

const VideoPlayer = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleComment = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to post comments.",
        variant: "destructive",
      });
      return;
    }
    if (comment.trim()) {
      toast({
        title: "Comment posted!",
        description: "Your comment has been added.",
      });
      setComment("");
    }
  };

  const handleRate = (rating: number) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to rate videos.",
        variant: "destructive",
      });
      return;
    }
    setUserRating(rating);
    toast({
      title: "Rating submitted!",
      description: `You rated this video ${rating} stars.`,
    });
  };

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
        ? `You unsubscribed from ${mockVideo.channel.name}` 
        : `You subscribed to ${mockVideo.channel.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1">
            {/* Video player area */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <img 
                src={mockVideo.thumbnail} 
                alt={mockVideo.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Video info */}
            <div className="bg-card border border-border rounded-lg p-4 mb-4">
              <h1 className="text-xl font-bold text-foreground mb-2">
                {mockVideo.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {mockVideo.views.toLocaleString()} views
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {mockVideo.uploadDate}
                </span>
                <Badge variant="secondary">{mockVideo.category}</Badge>
              </div>

              {/* Rating section */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-border">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Rate this video:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRate(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= userRating
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <StarRating rating={mockVideo.rating} />
                    <span className="ml-2">
                      ({(mockVideo.totalRatings / 1000000).toFixed(1)}M ratings)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    Like
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <ThumbsDown className="w-4 h-4" />
                    Dislike
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Flag className="w-4 h-4" />
                    Report
                  </Button>
                </div>
              </div>

              {/* Channel info */}
              <div className="flex items-center justify-between py-4">
                <Link 
                  to={`/channel/${mockVideo.channel.id}`}
                  className="flex items-center gap-3"
                >
                  <img
                    src={mockVideo.channel.avatar}
                    alt={mockVideo.channel.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-accent hover:underline">
                      {mockVideo.channel.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(mockVideo.channel.subscribers / 1000000).toFixed(1)}M subscribers
                    </p>
                  </div>
                </Link>
                <Button 
                  onClick={handleSubscribe}
                  className={isSubscribed ? "bg-muted text-foreground hover:bg-muted/80" : ""}
                >
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </Button>
              </div>

              {/* Description */}
              <div className="bg-secondary/30 rounded-lg p-4">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {mockVideo.description}
                </p>
              </div>
            </div>

            {/* Comments section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="w-5 h-5" />
                  Comments ({mockComments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add comment */}
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
                      <Button 
                        size="sm" 
                        onClick={handleComment}
                        disabled={!comment.trim()}
                      >
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Comments list */}
                <div className="space-y-4 pt-4 border-t">
                  {mockComments.map((c) => (
                    <div key={c.id} className="flex gap-3">
                      <img
                        src={c.avatar}
                        alt={c.user}
                        className="w-10 h-10 rounded-full shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-accent hover:underline cursor-pointer">
                            {c.user}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {c.date}
                          </span>
                        </div>
                        <p className="text-sm text-foreground mt-1">{c.content}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                            <ThumbsUp className="w-3 h-3" />
                            {c.likes}
                          </button>
                          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                          <button className="text-xs text-muted-foreground hover:text-foreground">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Related videos */}
          <aside className="w-full lg:w-80 shrink-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Related Videos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {relatedVideos.map((video) => (
                  <Link
                    key={video.id}
                    to={`/watch/${video.id}`}
                    className="flex gap-2 group"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-40 h-24 object-cover rounded"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                        {video.duration}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium line-clamp-2 group-hover:text-accent">
                        {video.title}
                      </h3>
                      <p className="text-xs text-accent hover:underline mt-1">
                        {video.channel}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {video.views}
                      </p>
                    </div>
                  </Link>
                ))}
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
