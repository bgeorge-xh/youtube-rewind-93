import { VideoCard } from "./VideoCard";

// Classic YouTube era video data
const videos = [
  {
    id: "1",
    title: "Charlie Bit My Finger - Again!",
    thumbnail: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=320&h=180&fit=crop",
    channel: "HDCYT",
    views: 885000000,
    uploadDate: "May 22, 2007",
    duration: "0:56",
    rating: 4.8,
    ratingCount: 2145678,
  },
  {
    id: "2",
    title: "Evolution of Dance - By Judson Laipply",
    thumbnail: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=320&h=180&fit=crop",
    channel: "judsonlaipply",
    views: 306000000,
    uploadDate: "Apr 6, 2006",
    duration: "6:00",
    rating: 4.7,
    ratingCount: 892341,
  },
  {
    id: "3",
    title: "Keyboard Cat! - THE ORIGINAL!",
    thumbnail: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=320&h=180&fit=crop",
    channel: "Charlie Schmidt",
    views: 72000000,
    uploadDate: "Jun 7, 2007",
    duration: "0:54",
    rating: 4.9,
    ratingCount: 456123,
  },
  {
    id: "4",
    title: "David After Dentist",
    thumbnail: "https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=320&h=180&fit=crop",
    channel: "boaborteaux",
    views: 140000000,
    uploadDate: "Jan 30, 2009",
    duration: "1:59",
    rating: 4.6,
    ratingCount: 678234,
  },
  {
    id: "5",
    title: "Dramatic Chipmunk",
    thumbnail: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=320&h=180&fit=crop",
    channel: "magnets99",
    views: 48000000,
    uploadDate: "Jun 6, 2007",
    duration: "0:05",
    rating: 4.5,
    ratingCount: 234567,
  },
  {
    id: "6",
    title: "Numa Numa Dance",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=320&h=180&fit=crop",
    channel: "Gary Brolsma",
    views: 56000000,
    uploadDate: "Dec 6, 2006",
    duration: "3:45",
    rating: 4.4,
    ratingCount: 345678,
  },
  {
    id: "7",
    title: "Sneezing Baby Panda",
    thumbnail: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=320&h=180&fit=crop",
    channel: "jimvwmoss",
    views: 279000000,
    uploadDate: "Nov 6, 2006",
    duration: "0:17",
    rating: 4.8,
    ratingCount: 987654,
  },
  {
    id: "8",
    title: "Double Rainbow Full Version",
    thumbnail: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=320&h=180&fit=crop",
    channel: "Yosemitebear62",
    views: 47000000,
    uploadDate: "Jan 8, 2010",
    duration: "3:29",
    rating: 4.3,
    ratingCount: 234123,
  },
  {
    id: "9",
    title: "Star Wars Kid - Original",
    thumbnail: "https://images.unsplash.com/photo-1472457897821-70d3819a0e24?w=320&h=180&fit=crop",
    channel: "viralvideoking",
    views: 32000000,
    uploadDate: "May 19, 2006",
    duration: "1:48",
    rating: 4.2,
    ratingCount: 167890,
  },
  {
    id: "10",
    title: "Leave Britney Alone!",
    thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=320&h=180&fit=crop",
    channel: "itschriscrocker",
    views: 48000000,
    uploadDate: "Sep 10, 2007",
    duration: "4:21",
    rating: 3.9,
    ratingCount: 456789,
  },
  {
    id: "11",
    title: "Potter Puppet Pals: The Mysterious Ticking Noise",
    thumbnail: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=320&h=180&fit=crop",
    channel: "NeilCicierega",
    views: 195000000,
    uploadDate: "Mar 23, 2007",
    duration: "2:05",
    rating: 4.9,
    ratingCount: 876543,
  },
  {
    id: "12",
    title: "Shoes",
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=320&h=180&fit=crop",
    channel: "liam kyle sullivan",
    views: 62000000,
    uploadDate: "Sep 26, 2006",
    duration: "3:21",
    rating: 4.5,
    ratingCount: 345678,
  },
];

export const VideoGrid = () => {
  return (
    <div className="flex-1">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Videos Being Watched Right Now</h2>
        <a href="#" className="text-xs text-accent hover:underline">
          see all »
        </a>
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="animate-fade-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <VideoCard {...video} />
          </div>
        ))}
      </div>

      {/* Load more */}
      <div className="mt-6 text-center">
        <button className="classic-button px-6">
          Load More Videos
        </button>
      </div>
    </div>
  );
};
