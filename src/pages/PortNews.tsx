import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Megaphone, TrendingUp, BookOpen, Clock, Eye, MessageSquare, ThumbsUp } from "lucide-react";

const platformUpdates = [
  {
    title: "ViewPort 2.0: A New Era of Nostalgia",
    date: "January 27, 2026",
    category: "Major Update",
    featured: true,
    description: "We're thrilled to announce the complete redesign of ViewPort, bringing back the classic video experience with modern enhancements.",
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&h=300&fit=crop",
  },
  {
    title: "5-Star Ratings Are Back!",
    date: "January 25, 2026",
    category: "Feature",
    description: "By popular demand, we've restored the beloved 5-star rating system. Express yourself beyond just likes!",
  },
  {
    title: "New Category Sidebar",
    date: "January 20, 2026",
    category: "UI Update",
    description: "Navigate content with our revamped category sidebar, featuring all your favorite classic genres.",
  },
  {
    title: "Channel Customization Coming Soon",
    date: "January 15, 2026",
    category: "Announcement",
    description: "Get ready to personalize your channel with custom backgrounds, colors, and layouts.",
  },
];

const trendingNews = [
  {
    title: "Classic 'Numa Numa' Creator Returns After 15 Years",
    views: "2.3M",
    comments: 4521,
    timeAgo: "3 hours ago",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=170&fit=crop",
    description: "Gary Brolsma announces comeback with new content celebrating internet history.",
  },
  {
    title: "Evolution of Dance 2025 Goes Viral",
    views: "1.8M",
    comments: 2890,
    timeAgo: "6 hours ago",
    thumbnail: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=300&h=170&fit=crop",
    description: "A new generation discovers the magic of dance compilation videos.",
  },
  {
    title: "Top 10 Most Viewed Videos of the 2000s",
    views: "892K",
    comments: 1203,
    timeAgo: "1 day ago",
    thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=170&fit=crop",
    description: "Counting down the videos that defined an era of internet culture.",
  },
];

const blogArticles = [
  {
    title: "Why We Need to Preserve Early Internet Video Culture",
    author: "Sarah Chen",
    authorRole: "Culture Editor",
    date: "January 26, 2026",
    readTime: "8 min read",
    likes: 1243,
    description: "The importance of archiving and celebrating the videos that shaped a generation of content creators.",
  },
  {
    title: "The Psychology Behind Viral Videos: Then vs Now",
    author: "Dr. Marcus Webb",
    authorRole: "Guest Contributor",
    date: "January 24, 2026",
    readTime: "12 min read",
    likes: 892,
    description: "How viewer behavior and content algorithms have evolved over two decades.",
  },
  {
    title: "Creator Spotlight: The Pioneers Who Started It All",
    author: "Jamie Rodriguez",
    authorRole: "Community Manager",
    date: "January 22, 2026",
    readTime: "6 min read",
    likes: 2103,
    description: "Interviews with the original content creators who built their channels from nothing.",
  },
  {
    title: "5 Tips for Building an Authentic Community",
    author: "Alex Turner",
    authorRole: "Creator Success",
    date: "January 20, 2026",
    readTime: "5 min read",
    likes: 567,
    description: "Lessons from classic YouTube that still apply to modern content creation.",
  },
];

const PortNews = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Hero Section */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Newspaper className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">PortNews</h1>
          </div>
          <p className="text-muted-foreground">
            Stay updated with platform news, trending content, and stories from the video community.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="updates" className="w-full">
          <TabsList className="w-full justify-start bg-secondary/50 border border-border mb-6">
            <TabsTrigger value="updates" className="gap-2">
              <Megaphone className="w-4 h-4" />
              Platform Updates
            </TabsTrigger>
            <TabsTrigger value="trending" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending News
            </TabsTrigger>
            <TabsTrigger value="blog" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Industry Blog
            </TabsTrigger>
          </TabsList>

          {/* Platform Updates Tab */}
          <TabsContent value="updates" className="space-y-4">
            {platformUpdates.map((update, index) => (
              <Card 
                key={update.title} 
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  update.featured ? "border-primary/50 bg-primary/5" : ""
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {update.featured && (
                          <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                        )}
                        <Badge variant="secondary">{update.category}</Badge>
                      </div>
                      <CardTitle className="text-xl text-accent hover:underline">
                        {update.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {update.date}
                      </CardDescription>
                    </div>
                    {update.image && (
                      <img 
                        src={update.image} 
                        alt={update.title}
                        className="w-48 h-28 object-cover rounded-lg hidden md:block"
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{update.description}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Trending News Tab */}
          <TabsContent value="trending" className="space-y-4">
            {trendingNews.map((news) => (
              <Card key={news.title} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img 
                      src={news.thumbnail} 
                      alt={news.title}
                      className="w-40 h-24 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-accent hover:underline line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {news.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {news.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {news.comments.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {news.timeAgo}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Industry Blog Tab */}
          <TabsContent value="blog" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {blogArticles.map((article) => (
                <Card key={article.title} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg text-accent hover:underline line-clamp-2">
                      {article.title}
                    </CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-muted" />
                        <span className="text-accent hover:underline">{article.author}</span>
                        <span className="text-muted-foreground">• {article.authorRole}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                        <span>{article.date}</span>
                      </div>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {article.likes.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default PortNews;
