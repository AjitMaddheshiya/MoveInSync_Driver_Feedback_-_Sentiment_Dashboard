import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Driver } from '../../types';
import { getScoreBadgeClass, formatDate } from '../../data/mockData';
import { TrendingUp, TrendingDown, Minus, Search } from 'lucide-react';
import './DriverLeaderboard.css';

export default function DriverLeaderboard() {
  const { state, getFilteredDrivers, selectDriver, setSortConfig, setFilterConfig } = useApp();
  const [expandedDriver, setExpandedDriver] = useState<string | null>(null);
  
  const drivers = getFilteredDrivers();
  const { sortConfig, filterConfig } = state;

  const handleSort = (key: string) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc';
    setSortConfig({ key, direction });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterConfig({ searchQuery: e.target.value });
  };

  const toggleExpand = (driverId: string) => {
    setExpandedDriver(expandedDriver === driverId ? null : driverId);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable', trendValue: number) => {
    if (trend === 'up') return <TrendingUp size={16} className="trend-icon trend-up" />;
    if (trend === 'down') return <TrendingDown size={16} className="trend-icon trend-down" />;
    return <Minus size={16} className="trend-icon trend-stable" />;
  };

  const getRowClass = (score: number) => {
    if (score >= 4) return 'row-success';
    if (score >= 2.5) return 'row-warning';
    return 'row-danger';
  };

  return (
    <div className="driver-leaderboard">
      {/* Search and Filters */}
      <div className="leaderboard-filters">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search drivers..."
            value={filterConfig.searchQuery}
            onChange={handleSearch}
            className="input search-input"
          />
        </div>
        
        <select
          className="input filter-select"
          value={filterConfig.scoreRange ? `${filterConfig.scoreRange[0]}-${filterConfig.scoreRange[1]}` : 'all'}
          onChange={(e) => {
            if (e.target.value === 'all') {
              setFilterConfig({ scoreRange: null });
            } else {
              const [min, max] = e.target.value.split('-').map(Number);
              setFilterConfig({ scoreRange: [min, max] });
            }
          }}
        >
          <option value="all">All Scores</option>
          <option value="4-5">4.0 - 5.0 (Good)</option>
          <option value="2.5-3.9">2.5 - 3.9 (Average)</option>
          <option value="0-2.4">Below 2.5 (Poor)</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Driver {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('totalTrips')} className="sortable">
                Trips {sortConfig.key === 'totalTrips' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('averageScore')} className="sortable">
                Avg Score {sortConfig.key === 'averageScore' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Trend</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver: Driver) => (
              <>
                <tr 
                  key={driver.id} 
                  className={`${getRowClass(driver.averageScore)} ${expandedDriver === driver.id ? 'expanded' : ''}`}
                  onClick={() => toggleExpand(driver.id)}
                >
                  <td>
                    <div className="driver-info">
                      <div className="driver-name">{driver.name}</div>
                      <div className="driver-id">{driver.id}</div>
                    </div>
                  </td>
                  <td>{driver.totalTrips}</td>
                  <td>
                    <span className={`badge ${getScoreBadgeClass(driver.averageScore)}`}>
                      {driver.averageScore.toFixed(1)}
                    </span>
                  </td>
                  <td>
                    <div className="trend-cell">
                      {getTrendIcon(driver.trend, driver.trendValue)}
                      <span className="trend-value">
                        {driver.trendValue > 0 ? '+' : ''}{driver.trendValue.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td>
                    {driver.isAlert && (
                      <span className="badge badge-danger">Alert</span>
                    )}
                  </td>
                </tr>
                {expandedDriver === driver.id && driver.recentFeedback.length > 0 && (
                  <tr key={`${driver.id}-expanded`} className="expanded-row">
                    <td colSpan={5}>
                      <div className="expanded-content">
                        <h4>Recent Feedback</h4>
                        <div className="recent-feedback-list">
                          {driver.recentFeedback.map((feedback) => (
                            <div key={feedback.id} className="recent-feedback-item">
                              <span className={`badge ${getScoreBadgeClass(feedback.score)}`}>
                                {feedback.score}
                              </span>
                              <span className="feedback-text">{feedback.text}</span>
                              <span className="feedback-time">{formatDate(feedback.timestamp)}</span>
                            </div>
                          ))}
                        </div>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            selectDriver(driver);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        
        {drivers.length === 0 && (
          <div className="empty-state">
            <p>No drivers found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
