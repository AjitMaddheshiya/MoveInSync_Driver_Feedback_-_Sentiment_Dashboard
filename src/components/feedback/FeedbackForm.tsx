import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { FeatureFlags, FeedbackSection as FeedbackSectionType, FeedbackEntry } from '../../types';
import { feedbackTags } from '../../data/mockData';
import { ThumbsUp, Meh, ThumbsDown, Frown } from 'lucide-react';
import FeedbackSection from './FeedbackSection';
import ProgressIndicator from './ProgressIndicator';
import SuccessScreen from './SuccessScreen';
import './FeedbackForm.css';

interface FormSection {
  entityType: 'driver' | 'trip' | 'app' | 'marshal';
  title: string;
  rating: number;
  tags: string[];
  comment: string;
}

const sectionTitles: Record<string, string> = {
  driver: 'Rate Your Driver',
  trip: 'Rate Your Trip',
  app: 'Rate the Mobile App',
  marshal: 'Rate the Marshal',
};

// Helper function to generate sections from feature flags
const getSectionsFromFeatureFlags = (featureFlags: FeatureFlags): FormSection[] => {
  const enabledSections: FormSection[] = [];
  
  if (featureFlags.driverFeedback) {
    enabledSections.push({
      entityType: 'driver',
      title: sectionTitles.driver,
      rating: 0,
      tags: [],
      comment: '',
    });
  }
  if (featureFlags.tripFeedback) {
    enabledSections.push({
      entityType: 'trip',
      title: sectionTitles.trip,
      rating: 0,
      tags: [],
      comment: '',
    });
  }
  if (featureFlags.appFeedback) {
    enabledSections.push({
      entityType: 'app',
      title: sectionTitles.app,
      rating: 0,
      tags: [],
      comment: '',
    });
  }
  if (featureFlags.marshalFeedback) {
    enabledSections.push({
      entityType: 'marshal',
      title: sectionTitles.marshal,
      rating: 0,
      tags: [],
      comment: '',
    });
  }
  
  return enabledSections;
};

export default function FeedbackForm() {
  const navigate = useNavigate();
  const { state, updateFeatureFlags, addFeedback, isUser } = useApp();
  const { featureFlags, user } = state;

  const [quickRating, setQuickRating] = useState<number | null>(null);
  const [sections, setSections] = useState<FormSection[]>(() => 
    getSectionsFromFeatureFlags(featureFlags)
  );

  // Update sections when feature flags change
  useEffect(() => {
    setSections(getSectionsFromFeatureFlags(featureFlags));
    // Reset current step when sections change
    setCurrentStep(0);
  }, [featureFlags.driverFeedback, featureFlags.tripFeedback, featureFlags.appFeedback, featureFlags.marshalFeedback]);

  const [errors, setErrors] = useState<Record<number, string>>({});
  const [touched, setTouched] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const hasEnabledSections = sections.length > 0;
  const totalSteps = sections.length;
  const isMultiStep = totalSteps > 1;

  const handleRatingChange = useCallback((index: number, rating: number) => {
    setSections(prev => prev.map((section, i) => 
      i === index ? { ...section, rating } : section
    ));
    if (errors[index]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
    }
  }, [errors]);

  const handleTagsChange = useCallback((index: number, tags: string[]) => {
    setSections(prev => prev.map((section, i) => 
      i === index ? { ...section, tags } : section
    ));
  }, []);

  const handleCommentChange = useCallback((index: number, comment: string) => {
    setSections(prev => prev.map((section, i) => 
      i === index ? { ...section, comment } : section
    ));
  }, []);

  const handleBlur = useCallback((index: number) => {
    setTouched(prev => ({ ...prev, [index]: true }));
    
    if (sections[index].rating === 0) {
      setErrors(prev => ({ ...prev, [index]: 'Please select a rating' }));
    }
  }, [sections]);

  const validateForm = (): boolean => {
    const newErrors: Record<number, string> = {};
    let isValid = true;

    sections.forEach((section, index) => {
      if (section.rating === 0) {
        newErrors[index] = 'Please select a rating';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create feedback entries
    sections.forEach(section => {
      const score = section.rating;
      let sentiment: 'positive' | 'neutral' | 'negative';
      if (score >= 4) sentiment = 'positive';
      else if (score >= 3) sentiment = 'neutral';
      else sentiment = 'negative';

      const feedbackEntry: FeedbackEntry = {
        id: `FB${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        entityType: section.entityType,
        sentiment,
        score,
        timestamp: new Date().toISOString(),
        text: section.comment,
        tags: section.tags,
        driverId: user?.id || 'GUEST',
        driverName: user?.name || 'Guest User',
      };

      addFeedback(feedbackEntry);
    });

    setIsSubmitting(false);
    setIsSubmitted(true);

    // If logged in user, redirect to their dashboard after showing success
    if (user && !isUser()) {
      setTimeout(() => {
        navigate('/my-rides');
      }, 2000);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      handleBlur(currentStep);
      if (sections[currentStep].rating > 0) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFeatureFlagToggle = (flag: keyof FeatureFlags) => {
    updateFeatureFlags({ [flag]: !featureFlags[flag] });
  };

  if (isSubmitted) {
    return <SuccessScreen />;
  }

  if (!hasEnabledSections) {
    return (
      <div className="feedback-form-empty">
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h2 className="empty-state-title">No Feedback Options Available</h2>
          <p className="empty-state-description">
            Currently, there are no feedback categories enabled. Please check back later or contact support.
          </p>
        </div>
        
        {/* Demo: Feature Flag Controls (for testing) */}
        <div className="feature-flag-controls">
          <h4>Demo: Toggle Feature Flags</h4>
          <div className="feature-flag-list">
            <label className="feature-flag-item">
              <input
                type="checkbox"
                checked={featureFlags.driverFeedback}
                onChange={() => handleFeatureFlagToggle('driverFeedback')}
              />
              <span>Driver Feedback</span>
            </label>
            <label className="feature-flag-item">
              <input
                type="checkbox"
                checked={featureFlags.tripFeedback}
                onChange={() => handleFeatureFlagToggle('tripFeedback')}
              />
              <span>Trip Feedback</span>
            </label>
            <label className="feature-flag-item">
              <input
                type="checkbox"
                checked={featureFlags.appFeedback}
                onChange={() => handleFeatureFlagToggle('appFeedback')}
              />
              <span>App Feedback</span>
            </label>
            <label className="feature-flag-item">
              <input
                type="checkbox"
                checked={featureFlags.marshalFeedback}
                onChange={() => handleFeatureFlagToggle('marshalFeedback')}
              />
              <span>Marshal Feedback</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-form">
      {/* Quick Rating Options at Top */}
      <div className="quick-rating-options">
        <span className="quick-rating-label">How was your experience?</span>
        <div className="quick-rating-buttons">
          <button 
            className={`quick-rating-btn ${quickRating === 5 ? 'active' : ''}`}
            onClick={() => setQuickRating(5)}
            title="Very Satisfied"
          >
            <ThumbsUp size={24} />
            <span>Very Satisfied</span>
          </button>
          <button 
            className={`quick-rating-btn ${quickRating === 4 ? 'active' : ''}`}
            onClick={() => setQuickRating(4)}
            title="Satisfied"
          >
            <Meh size={24} />
            <span>Satisfied</span>
          </button>
          <button 
            className={`quick-rating-btn ${quickRating === 3 ? 'active' : ''}`}
            onClick={() => setQuickRating(3)}
            title="Neutral"
          >
            <Frown size={24} />
            <span>Neutral</span>
          </button>
          <button 
            className={`quick-rating-btn ${quickRating === 2 ? 'active' : ''}`}
            onClick={() => setQuickRating(2)}
            title="Dissatisfied"
          >
            <ThumbsDown size={24} />
            <span>Dissatisfied</span>
          </button>
        </div>
      </div>

      {isMultiStep && (
        <ProgressIndicator 
          currentStep={currentStep} 
          totalSteps={totalSteps}
          titles={sections.map(s => s.title)}
        />
      )}

      <div className="feedback-sections">
        {sections.map((section, index) => (
          <div 
            key={section.entityType} 
            className={`feedback-section-wrapper ${isMultiStep && index !== currentStep ? 'hidden' : ''}`}
          >
            <FeedbackSection
              entityType={section.entityType}
              title={section.title}
              tagsAvailable={feedbackTags[section.entityType] || []}
              rating={section.rating}
              selectedTags={section.tags}
              comment={section.comment}
              onRatingChange={(rating) => handleRatingChange(index, rating)}
              onTagsChange={(tags) => handleTagsChange(index, tags)}
              onCommentChange={(comment) => handleCommentChange(index, comment)}
              error={touched[index] ? errors[index] : undefined}
            />
          </div>
        ))}
      </div>

      <div className="feedback-form-actions">
        {isMultiStep && (
          <>
            <button
              className="btn btn-secondary"
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              Previous
            </button>
            {currentStep < totalSteps - 1 ? (
              <button
                className="btn btn-primary"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                className="btn btn-primary btn-lg"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            )}
          </>
        )}
        {!isMultiStep && (
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Submitting...
              </>
            ) : (
              'Submit Feedback'
            )}
          </button>
        )}
      </div>

      {/* Demo: Feature Flag Controls (for testing) */}
      <div className="feature-flag-controls">
        <h4>Demo: Toggle Feature Flags</h4>
        <div className="feature-flag-list">
          <label className="feature-flag-item">
            <input
              type="checkbox"
              checked={featureFlags.driverFeedback}
              onChange={() => handleFeatureFlagToggle('driverFeedback')}
            />
            <span>Driver Feedback</span>
          </label>
          <label className="feature-flag-item">
            <input
              type="checkbox"
              checked={featureFlags.tripFeedback}
              onChange={() => handleFeatureFlagToggle('tripFeedback')}
            />
            <span>Trip Feedback</span>
          </label>
          <label className="feature-flag-item">
            <input
              type="checkbox"
              checked={featureFlags.appFeedback}
              onChange={() => handleFeatureFlagToggle('appFeedback')}
            />
            <span>App Feedback</span>
          </label>
          <label className="feature-flag-item">
            <input
              type="checkbox"
              checked={featureFlags.marshalFeedback}
              onChange={() => handleFeatureFlagToggle('marshalFeedback')}
            />
            <span>Marshal Feedback</span>
          </label>
        </div>
      </div>
    </div>
  );
}
