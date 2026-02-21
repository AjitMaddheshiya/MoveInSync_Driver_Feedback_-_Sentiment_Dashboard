import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Bell, MessageSquare, User, LogOut, Shield, Car } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const { state, logout, isAdmin } = useApp();
  const { user } = state;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <MessageSquare size={24} />
        </div>
        <div className="sidebar-brand">
          <span className="sidebar-brand-title">MoveInSync</span>
          <span className="sidebar-brand-subtitle">Feedback</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {/* Feedback Form - visible to non-admin users only */}
        {!isAdmin() && (
          <NavLink 
            to="/feedback" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end
          >
            <MessageSquare size={20} />
            <span>Feedback Form</span>
          </NavLink>
        )}
        
        {/* Admin-only routes */}
        {isAdmin() && (
          <>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            
            <NavLink 
              to="/drivers" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Users size={20} />
              <span>Drivers</span>
            </NavLink>
          </>
        )}
        
        {/* User-only route */}
        {user && !isAdmin() && (
          <NavLink 
            to="/my-rides" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Car size={20} />
            <span>My Rides</span>
          </NavLink>
        )}

        {/* Profile - visible to logged in users */}
        {user && (
          <NavLink 
            to="/profile" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <User size={20} />
            <span>Profile</span>
          </NavLink>
        )}
      </nav>
      
      {user && (
        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <div className="sidebar-user-avatar">
              {user.name.charAt(0)}
            </div>
            <div className="sidebar-user-details">
              <span className="sidebar-user-name">{user.name}</span>
              <span className="sidebar-user-role">
                {isAdmin() ? <><Shield size={12} /> Admin</> : <><User size={12} /> User</>}
              </span>
            </div>
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout} title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      )}

      {!user && (
        <div className="sidebar-login-prompt">
          <NavLink to="/login" className="sidebar-login-btn">
            Sign In
          </NavLink>
        </div>
      )}
      
      <div className="sidebar-footer">
        <div className="sidebar-version">v1.0.0</div>
      </div>
    </aside>
  );
}
