import { Link } from "react-router-dom";
import { StarRating } from "./StarRating";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  views: number;
  uploadDate: string;
  duration: string;
  rating: number;
  ratingCount: number;
  onClick?: () => void;
}

export const VideoCard = ({
  id,
  title,
  thumbnail,
  channel,
  views,
  uploadDate,
  duration,
  rating,
  ratingCount,
}: VideoCardProps) => {
  const formatViews = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <Link to={`/watch/${id}`} className="video-card group block">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-t bg-muted">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Duration badge */}
        <span className="absolute bottom-1 right-1 bg-foreground/80 text-background text-xs px-1 py-0.5 rounded font-medium">
          {duration}
        </span>
      </div>

      {/* Info */}
      <div className="p-2.5">
        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1 leading-tight group-hover:text-accent">
          {title}
        </h3>
        <p className="text-xs text-accent hover:underline cursor-pointer mb-1">
          {channel}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
          <span>{formatViews(views)} views</span>
          <span>•</span>
          <span>{uploadDate}</span>
        </div>
        <StarRating rating={rating} showCount count={ratingCount} />
      </div>
    </Link>
  );
};
