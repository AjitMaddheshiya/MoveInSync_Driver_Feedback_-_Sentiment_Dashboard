import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Calendar } from 'lucide-react';
import './Header.css';

export default function Header() {
  const { state, dispatch, markAlertRead, clearAllAlerts, getUnreadAlertCount, setDateRange } = useApp();
  const [showAlerts, setShowAlerts] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);

  const unreadCount = getUnreadAlertCount();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (alertRef.current && !alertRef.current.contains(event.target as Node)) {
        setShowAlerts(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRange = e.target.value as 'today' | '7days' | '30days';
    setDateRange(newRange);
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">Driver Sentiment Dashboard</h1>
      </div>
      
      <div className="header-right">
        <div className="date-range-selector">
          <Calendar size={16} />
          <select 
            value={state.dateRange}
            onChange={handleDateRangeChange}
            className="date-range-select"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>
        
        <div className="alert-container" ref={alertRef}>
          <button 
            className="btn btn-ghost alert-button"
            onClick={() => setShowAlerts(!showAlerts)}
            aria-label={`Notifications, ${unreadCount} unread`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="alert-badge">{unreadCount}</span>
            )}
          </button>
          
          {showAlerts && (
            <div className="alert-dropdown">
              <div className="alert-dropdown-header">
                <span>Alerts</span>
                {unreadCount > 0 && (
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={clearAllAlerts}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="alert-list">
                {state.alerts.length === 0 ? (
                  <div className="alert-empty">No alerts</div>
                ) : (
                  state.alerts.map(alert => (
                    <div 
                      key={alert.id} 
                      className={`alert-item ${!alert.isRead ? 'unread' : ''}`}
                      onClick={() => markAlertRead(alert.id)}
                    >
                      <div className="alert-item-icon">
                        <Bell size={14} />
                      </div>
                      <div className="alert-item-content">
                        <div className="alert-item-title">
                          {alert.driverName}
                        </div>
                        <div className="alert-item-score">
                          Score: {alert.currentScore.toFixed(1)} (below {alert.threshold})
                        </div>
                        <div className="alert-item-time">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
