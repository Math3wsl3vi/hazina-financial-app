// components/advisor/StarRating.tsx
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

const StarRating = ({ rating, maxRating = 5 }: StarRatingProps) => {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star
          key={i}
          size={16}
          fill={i < Math.round(rating) ? "#facc15" : "none"} // filled yellow stars
          stroke="#facc15"
        />
      ))}
    </div>
  );
};

export default StarRating;
