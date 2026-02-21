import { useState } from 'react';
import { Star } from 'lucide-react';
import './StarRating.css';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label?: string;
}

export default function StarRating({ value, onChange, disabled = false, label }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const handleKeyDown = (e: React.KeyboardEvent, rating: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(rating);
    }
    if (e.key === 'ArrowRight' && value < 5) {
      onChange(value + 1);
    }
    if (e.key === 'ArrowLeft' && value > 1) {
      onChange(value - 1);
    }
  };

  return (
    <div className="star-rating-container">
      {label && <label className="star-rating-label">{label}</label>}
      <div 
        className="star-rating" 
        role="radiogroup" 
        aria-label={label || 'Rating'}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-button ${(hoverValue || value) >= star ? 'filled' : ''} ${disabled ? 'disabled' : ''}`}
            onClick={() => !disabled && onChange(star)}
            onMouseEnter={() => !disabled && setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            onKeyDown={(e) => handleKeyDown(e, star)}
            disabled={disabled}
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <Star 
              size={28} 
              fill={(hoverValue || value) >= star ? 'currentColor' : 'none'}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
