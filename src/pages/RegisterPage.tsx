import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, ArrowLeft } from 'lucide-react';
import './RegisterPage.css';

interface FormData {
  name: string;
  email: string;
  mobile: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    mobile: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!formData.mobile.trim()) {
      setError('Mobile number is required');
      return;
    }
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    // Simulate registration API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Store user in localStorage (simulating backend)
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = users.find((u: any) => u.email === formData.email || u.username === formData.username);
    
    if (existingUser) {
      setError('User with this email or username already exists');
      setIsLoading(false);
      return;
    }

    users.push({
      id: `USR${Date.now()}`,
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      username: formData.username,
      password: formData.password,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    setSuccess(true);
    setIsLoading(false);

    // Redirect to login after 2 seconds
    setTimeout(() => {
      navigate('/login', { state: { registered: true, email: formData.email } });
    }, 2000);
  };

  if (success) {
    return (
      <div className="register-page">
        <div className="register-background">
          <div className="register-bg-shape shape-1"></div>
          <div className="register-bg-shape shape-2"></div>
          <div className="register-bg-shape shape-3"></div>
        </div>

        <div className="register-container">
          <div className="register-success">
            <div className="success-icon">✓</div>
            <h2>Registration Successful!</h2>
            <p>Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-background">
        <div className="register-bg-shape shape-1"></div>
        <div className="register-bg-shape shape-2"></div>
        <div className="register-bg-shape shape-3"></div>
      </div>

      <div className="register-container">
        <div className="register-header">
          <div className="register-logo">
            <span className="logo-icon">🚗</span>
            <span className="logo-text">Driver Feedback</span>
          </div>
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Fill in your details to register</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              <User size={16} />
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={16} />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile">
              <Phone size={16} />
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">
              <User size={16} />
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <Lock size={16} />
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          {error && <div className="register-error">{error}</div>}

          <button type="submit" className="register-submit" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              <>
                Register
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="register-footer-links">
          <Link to="/login">
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
