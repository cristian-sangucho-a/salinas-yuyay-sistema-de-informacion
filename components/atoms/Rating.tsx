import { FaStar } from 'react-icons/fa';

interface RatingProps {
  rating?: number;
  maxRating?: number;
  showCount?: boolean;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export default function Rating({ 
  rating = 5, 
  maxRating = 5, 
  showCount = false,
  count = 0,
  size = 'sm',
  color = 'text-[#5A1E02]',
  className = '' 
}: RatingProps) {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: maxRating }, (_, index) => (
        <FaStar 
          key={index} 
          className={`${sizes[size]} ${index < rating ? color : 'text-gray-300'} fill-current`}
        />
      ))}
      {showCount && count > 0 && (
        <span className={`${textSizes[size]} text-[#6B5B52] ml-1`}>
          ({count})
        </span>
      )}
    </div>
  );
}
