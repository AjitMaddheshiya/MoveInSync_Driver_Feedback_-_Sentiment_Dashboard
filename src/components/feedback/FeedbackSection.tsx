import { FeedbackTag, EntityType } from '../../types';
import StarRating from './StarRating';
import TagChip from './TagChip';
import './FeedbackSection.css';

interface FeedbackSectionProps {
  entityType: EntityType;
  title: string;
  tagsAvailable: FeedbackTag[];
  rating: number;
  selectedTags: string[];
  comment: string;
  onRatingChange: (rating: number) => void;
  onTagsChange: (tags: string[]) => void;
  onCommentChange: (comment: string) => void;
  error?: string;
}

const entityIcons: Record<EntityType, string> = {
  driver: '🚗',
  trip: '🗺️',
  app: '📱',
  marshal: '👮',
};

export default function FeedbackSection({
  entityType,
  title,
  tagsAvailable,
  rating,
  selectedTags,
  comment,
  onRatingChange,
  onTagsChange,
  onCommentChange,
  error,
}: FeedbackSectionProps) {
  const handleTagToggle = (tagLabel: string) => {
    if (selectedTags.includes(tagLabel)) {
      onTagsChange(selectedTags.filter(t => t !== tagLabel));
    } else {
      onTagsChange([...selectedTags, tagLabel]);
    }
  };

  const getPlaceholder = () => {
    switch (entityType) {
      case 'driver':
        return 'Tell us about your driver experience...';
      case 'trip':
        return 'Tell us about your trip...';
      case 'app':
        return 'Tell us about your app experience...';
      case 'marshal':
        return 'Tell us about the marshal assistance...';
      default:
        return 'Share your feedback...';
    }
  };

  return (
    <div className={`feedback-section ${error ? 'has-error' : ''}`}>
      <div className="feedback-section-header">
        <span className="feedback-section-icon">{entityIcons[entityType]}</span>
        <h3 className="feedback-section-title">{title}</h3>
      </div>

      <div className="feedback-section-content">
        <div className="feedback-rating-group">
          <StarRating
            value={rating}
            onChange={onRatingChange}
            label="How would you rate your experience?"
          />
          {error && <span className="error-message">{error}</span>}
        </div>

        {tagsAvailable.length > 0 && (
          <div className="feedback-tags-group">
            <label className="feedback-tags-label">Quick Feedback (optional)</label>
            <div className="feedback-tags-list">
              {tagsAvailable.map((tag) => (
                <TagChip
                  key={tag.id}
                  label={tag.label}
                  selected={selectedTags.includes(tag.label)}
                  onClick={() => handleTagToggle(tag.label)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="feedback-comment-group">
          <label className="feedback-comment-label" htmlFor={`comment-${entityType}`}>
            Additional Comments (optional)
          </label>
          <textarea
            id={`comment-${entityType}`}
            className="input feedback-comment-textarea"
            placeholder={getPlaceholder()}
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            maxLength={500}
            rows={3}
          />
          <div className="feedback-comment-counter">
            {comment.length}/500
          </div>
        </div>
      </div>
    </div>
  );
}
