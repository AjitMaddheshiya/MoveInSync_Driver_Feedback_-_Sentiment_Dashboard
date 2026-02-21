import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Shield, 
  LogOut, 
  Settings, 
  BarChart3, 
  Users, 
  Calendar,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { state, logout, isAdmin } = useApp();
  const { user } = state;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-header-bg"></div>
        <div className="profile-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <span>{user.name.charAt(0)}</span>
          )}
        </div>
        <h1 className="profile-name">{user.name}</h1>
        <div className="profile-role">
          {user.role === 'admin' ? (
            <><Shield size={16} /> Administrator</>
          ) : (
            <><User size={16} /> User</>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-info-card">
          <h3>Account Information</h3>
          <div className="profile-info-list">
            <div className="profile-info-item">
              <Mail size={18} />
              <div className="profile-info-content">
                <span className="profile-info-label">Email Address</span>
                <span className="profile-info-value">{user.email}</span>
              </div>
            </div>
            <div className="profile-info-item">
              <Calendar size={18} />
              <div className="profile-info-content">
                <span className="profile-info-label">Member Since</span>
                <span className="profile-info-value">{memberSince}</span>
              </div>
            </div>
            <div className="profile-info-item">
              <Shield size={18} />
              <div className="profile-info-content">
                <span className="profile-info-label">Account Type</span>
                <span className="profile-info-value role-badge" data-role={user.role}>
                  {user.role === 'admin' ? 'Administrator' : 'Regular User'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-access-card">
          <h3>Your Access Level</h3>
          <div className="access-features">
            {isAdmin() ? (
              <>
                <div className="access-feature granted">
                  <Shield size={20} />
                  <div>
                    <span className="feature-title">Full Dashboard Access</span>
                    <span className="feature-desc">View all metrics, analytics, and reports</span>
                  </div>
                </div>
                <div className="access-feature granted">
                  <BarChart3 size={20} />
                  <div>
                    <span className="feature-title">Analytics & Reports</span>
                    <span className="feature-desc">Access detailed analytics and export reports</span>
                  </div>
                </div>
                <div className="access-feature granted">
                  <Users size={20} />
                  <div>
                    <span className="feature-title">Driver Management</span>
                    <span className="feature-desc">View and manage all driver profiles</span>
                  </div>
                </div>
                <div className="access-feature granted">
                  <Settings size={20} />
                  <div>
                    <span className="feature-title">Settings & Configuration</span>
                    <span className="feature-desc">Configure feature flags and system settings</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="access-feature granted">
                  <BarChart3 size={20} />
                  <div>
                    <span className="feature-title">Basic Dashboard View</span>
                    <span className="feature-desc">View overview metrics and summaries</span>
                  </div>
                </div>
                <div className="access-feature granted">
                  <Users size={20} />
                  <div>
                    <span className="feature-title">View Drivers</span>
                    <span className="feature-desc">View driver list and basic information</span>
                  </div>
                </div>
                <div className="access-feature denied">
                  <Settings size={20} />
                  <div>
                    <span className="feature-title">Settings (Read-only)</span>
                    <span className="feature-desc">Cannot modify system settings</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="profile-actions">
          <button className="profile-action-btn secondary" onClick={() => navigate('/dashboard')}>
            <ChevronRight size={18} />
            Back to Dashboard
          </button>
          <button className="profile-action-btn danger" onClick={handleLogout}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
