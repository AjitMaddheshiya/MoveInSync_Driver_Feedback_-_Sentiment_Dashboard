import { Instagram, Linkedin, Youtube, Mail } from 'lucide-react';
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
      
      <footer className="feedback-page-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">🚗</span>
            <span className="footer-text">Driver Feedback</span>
          </div>
          
          <div className="footer-social">
            <a href="https://www.linkedin.com/in/ajit-m2024/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://www.linkedin.com/in/ajit-m2024/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="https://www.linkedin.com/in/ajit-m2024/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
              <Youtube size={20} />
            </a>
            <a href="https://www.linkedin.com/in/ajit-m2024/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/>
              </svg>
            </a>
            <a href="mailto:feedback@driverapp.com" className="social-link" aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
          
          <div className="footer-copyright">
            © 2026 Driver Feedback. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
