import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  count?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export const StarRating = ({
  rating,
  maxRating = 5,
  size = "sm",
  showCount = false,
  count = 0,
  interactive = false,
  onRate,
}: StarRatingProps) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const handleClick = (starIndex: number) => {
    if (interactive && onRate) {
      onRate(starIndex + 1);
    }
  };

  return (
    <div className="inline-flex items-center gap-1">
      <div className="star-rating">
        {Array.from({ length: maxRating }).map((_, index) => {
          const isFilled = index < Math.floor(rating);
          const isHalf = index === Math.floor(rating) && rating % 1 >= 0.5;

          return (
            <Star
              key={index}
              className={`${sizeClasses[size]} ${
                isFilled || isHalf ? "star-filled fill-youtube-star" : "star-empty"
              } ${interactive ? "cursor-pointer hover:scale-110" : ""}`}
              onClick={() => handleClick(index)}
            />
          );
        })}
      </div>
      {showCount && (
        <span className="text-xs text-muted-foreground">
          ({count.toLocaleString()} ratings)
        </span>
      )}
    </div>
  );
};
