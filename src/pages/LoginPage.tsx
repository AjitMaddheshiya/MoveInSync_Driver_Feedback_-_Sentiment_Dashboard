import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, Mail, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [userType, setUserType] = useState<'admin' | 'user'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo credentials
    if (userType === 'admin') {
      if (email === 'admin@driver.com' || password === 'admin123') {
        login({
          id: 'USR001',
          name: 'Admin User',
          email: email || 'admin@driver.com',
          role: 'admin',
          createdAt: new Date().toISOString(),
        });
        navigate('/dashboard');
      } else {
        setError('Invalid admin credentials. Try: admin@driver.com / admin123');
      }
    } else {
      if (email === 'user@driver.com' || password === 'user123') {
        login({
          id: 'USR002',
          name: 'Regular User',
          email: email || 'user@driver.com',
          role: 'user',
          createdAt: new Date().toISOString(),
        });
        // Both admin and user go to dashboard after login
        navigate('/dashboard');
      } else {
        setError('Invalid user credentials. Try: user@driver.com / user123');
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-bg-shape shape-1"></div>
        <div className="login-bg-shape shape-2"></div>
        <div className="login-bg-shape shape-3"></div>
      </div>

      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon">🚗</span>
            <span className="logo-text">Driver Feedback</span>
          </div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to access your dashboard</p>
        </div>

        <div className="login-type-selector">
          <button
            type="button"
            className={`login-type-btn ${userType === 'admin' ? 'active' : ''}`}
            onClick={() => setUserType('admin')}
          >
            <Shield size={20} />
            <span>Admin</span>
          </button>
          <button
            type="button"
            className={`login-type-btn ${userType === 'user' ? 'active' : ''}`}
            onClick={() => setUserType('user')}
          >
            <User size={20} />
            <span>User</span>
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              <Mail size={16} />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={userType === 'admin' ? 'admin@driver.com' : 'user@driver.com'}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <Lock size={16} />
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={userType === 'admin' ? 'admin123' : 'user123'}
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="login-demo-info">
          <p>Demo Credentials:</p>
          <div className="demo-credentials">
            <span><strong>Admin:</strong> admin@driver.com / admin123</span>
            <span><strong>User:</strong> user@driver.com / user123</span>
          </div>
        </div>

        <div className="login-footer-links">
          <a href="/feedback">Submit Feedback as Guest</a>
        </div>
      </div>
    </div>
  );
}
