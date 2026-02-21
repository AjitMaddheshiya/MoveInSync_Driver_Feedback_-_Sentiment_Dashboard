import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SuccessScreen.css';

export default function SuccessScreen() {
  const navigate = useNavigate();

  return (
    <div className="success-screen">
      <div className="success-icon">
        <CheckCircle size={64} />
      </div>
      <h2 className="success-title">Thank You!</h2>
      <p className="success-message">
        Your feedback has been submitted successfully. We appreciate your input to help us improve our service.
      </p>
      <div className="success-actions">
        <button 
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/dashboard')}
        >
          View Dashboard
        </button>
        <button 
          className="btn btn-secondary btn-lg"
          onClick={() => navigate('/feedback')}
        >
          Submit Another Feedback
        </button>
      </div>
    </div>
  );
}
