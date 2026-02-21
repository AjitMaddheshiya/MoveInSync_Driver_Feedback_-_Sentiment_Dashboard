import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Bell, MessageSquare } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
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
        <NavLink 
          to="/feedback" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          end
        >
          <MessageSquare size={20} />
          <span>Feedback Form</span>
        </NavLink>
        
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
      </nav>
      
      <div className="sidebar-footer">
        <div className="sidebar-version">v1.0.0</div>
      </div>
    </aside>
  );
}
