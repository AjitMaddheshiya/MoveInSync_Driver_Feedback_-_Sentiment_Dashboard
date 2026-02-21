import FeedbackForm from '../components/feedback/FeedbackForm';
import './FeedbackPage.css';

export default function FeedbackPage() {
  return (
    <div className="feedback-page">
      <div className="feedback-page-header">
        <h1 className="page-title">Post-Trip Feedback</h1>
        <p className="feedback-page-subtitle">
          Help us improve our service by sharing your experience
        </p>
      </div>
      <FeedbackForm />
    </div>
  );
}
