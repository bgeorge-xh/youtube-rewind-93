import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, HelpCircle, Users, Play, Star, TrendingUp, Clock } from "lucide-react";

const encyclopediaEntries = [
  {
    title: "Charlie Bit My Finger",
    category: "Viral Videos",
    views: "883M",
    year: "2007",
    description: "One of the most viewed videos of the early YouTube era, featuring two British brothers.",
  },
  {
    title: "Evolution of Dance",
    category: "Entertainment",
    views: "307M",
    year: "2006",
    description: "Judson Laipply's iconic dance routine through decades of popular music.",
  },
  {
    title: "David After Dentist",
    category: "Viral Videos",
    views: "140M",
    year: "2009",
    description: "A young boy's hilarious reaction after dental surgery became an internet phenomenon.",
  },
  {
    title: "Keyboard Cat",
    category: "Memes",
    views: "72M",
    year: "2007",
    description: "The legendary feline musician that became one of the first major video memes.",
  },
  {
    title: "Numa Numa",
    category: "Viral Videos",
    views: "56M",
    year: "2004",
    description: "Gary Brolsma's lip-sync to O-Zone's 'Dragostea Din Tei' predates YouTube itself.",
  },
];

const helpArticles = [
  {
    title: "Getting Started with ViewPort",
    category: "Basics",
    icon: Play,
    description: "Learn how to navigate, search, and discover videos on ViewPort.",
  },
  {
    title: "Creating Your Channel",
    category: "Creators",
    icon: Users,
    description: "Step-by-step guide to setting up and customizing your channel.",
  },
  {
    title: "Understanding Ratings",
    category: "Features",
    icon: Star,
    description: "How our 5-star rating system works and why it matters.",
  },
  {
    title: "Video Upload Guide",
    category: "Creators",
    icon: TrendingUp,
    description: "Best practices for uploading and optimizing your videos.",
  },
];

const communityArticles = [
  {
    title: "The Golden Age of YouTube Poop",
    author: "RetroFan2007",
    date: "2 days ago",
    likes: 342,
    description: "A deep dive into the absurdist remix culture that defined early YouTube.",
  },
  {
    title: "How to Edit Like It's 2008",
    author: "VintageEditor",
    date: "1 week ago",
    likes: 189,
    description: "Tutorial on recreating classic YouTube editing styles with modern tools.",
  },
  {
    title: "The Rise of Let's Play Culture",
    author: "GamingHistorian",
    date: "3 days ago",
    likes: 521,
    description: "Tracing gaming content from its humble beginnings to mainstream entertainment.",
  },
];

const PortWiki = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Hero Section */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Book className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">PortWiki</h1>
          </div>
          <p className="text-muted-foreground">
            Your comprehensive knowledge base for classic videos, platform guides, and community wisdom.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="encyclopedia" className="w-full">
          <TabsList className="w-full justify-start bg-secondary/50 border border-border mb-6">
            <TabsTrigger value="encyclopedia" className="gap-2">
              <Play className="w-4 h-4" />
              Video Encyclopedia
            </TabsTrigger>
            <TabsTrigger value="help" className="gap-2">
              <HelpCircle className="w-4 h-4" />
              Help Center
            </TabsTrigger>
            <TabsTrigger value="community" className="gap-2">
              <Users className="w-4 h-4" />
              Community Wiki
            </TabsTrigger>
          </TabsList>

          {/* Encyclopedia Tab */}
          <TabsContent value="encyclopedia" className="space-y-4">
            <div className="grid gap-4">
              {encyclopediaEntries.map((entry) => (
                <Card key={entry.title} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-accent hover:underline">
                          {entry.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{entry.category}</Badge>
                          <span className="text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {entry.year}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-foreground">{entry.views}</span>
                        <p className="text-xs text-muted-foreground">views</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{entry.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Help Center Tab */}
          <TabsContent value="help" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {helpArticles.map((article) => (
                <Card key={article.title} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <article.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base text-accent hover:underline">
                          {article.title}
                        </CardTitle>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {article.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{article.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Community Wiki Tab */}
          <TabsContent value="community" className="space-y-4">
            <div className="grid gap-4">
              {communityArticles.map((article) => (
                <Card key={article.title} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-accent hover:underline">
                        {article.title}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 text-primary" />
                        {article.likes}
                      </div>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <span className="text-accent hover:underline cursor-pointer">
                        {article.author}
                      </span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{article.description}</p>
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

export default PortWiki;
