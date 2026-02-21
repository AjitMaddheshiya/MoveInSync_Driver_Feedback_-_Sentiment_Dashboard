import React from 'react';
import { CheckCircle, LogOut, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './SuccessScreen.css';

export default function SuccessScreen(): React.ReactElement {
  const navigate = useNavigate();
  const { logout } = useApp();

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  const handleSubmitAnother = (): void => {
    window.location.replace('/feedback');
  };

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
          className="btn btn-secondary btn-lg"
          onClick={handleSubmitAnother}
        >
          <PlusCircle size={18} />
          Submit Another Feedback
        </button>
        <button 
          className="btn btn-outline btn-lg"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
