import { useState } from 'react';
import { useApp } from '../context/AppContext';
import MetricCard from '../components/dashboard/MetricCard';
import SentimentDonut from '../components/dashboard/SentimentDonut';
import DriverLeaderboard from '../components/dashboard/DriverLeaderboard';
import FeedbackTimeline from '../components/dashboard/FeedbackTimeline';
import DriverDetailModal from '../components/dashboard/DriverDetailModal';
import './DashboardPage.css';

export default function DashboardPage() {
  const { state, selectDriver } = useApp();
  const { metrics } = state;

  return (
    <div className="dashboard-page">
      {/* Metrics Overview */}
      <section className="dashboard-overview">
        <div className="grid grid-4">
          <MetricCard
            title="Total Feedback"
            value={metrics.totalFeedback.toString()}
            icon="message"
          />
          <MetricCard
            title="Average Score"
            value={metrics.averageScore.toFixed(1)}
            icon="star"
            color={metrics.averageScore >= 4 ? 'success' : metrics.averageScore >= 2.5 ? 'warning' : 'danger'}
          />
          <MetricCard
            title="Positive Rate"
            value={metrics.totalFeedback > 0 
              ? `${Math.round((metrics.positiveCount / metrics.totalFeedback) * 100)}%` 
              : '0%'}
            icon="thumbsUp"
            color="success"
          />
          <MetricCard
            title="Alert Drivers"
            value={metrics.driversBelowThreshold.toString()}
            icon="alert"
            color={metrics.driversBelowThreshold > 0 ? 'danger' : 'default'}
          />
        </div>
      </section>

      {/* Charts Section */}
      <section className="dashboard-charts">
        <div className="grid grid-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Sentiment Distribution</h3>
            </div>
            <SentimentDonut
              positive={metrics.positiveCount}
              neutral={metrics.neutralCount}
              negative={metrics.negativeCount}
            />
          </div>
        </div>
      </section>

      {/* Driver Leaderboard */}
      <section className="dashboard-leaderboard">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Driver Leaderboard</h3>
          </div>
          <DriverLeaderboard />
        </div>
      </section>

      {/* Feedback Timeline */}
      <section className="dashboard-timeline">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Feedback</h3>
          </div>
          <FeedbackTimeline />
        </div>
      </section>

      {/* Driver Detail Modal */}
      {state.selectedDriver && (
        <DriverDetailModal 
          driver={state.selectedDriver}
          onClose={() => selectDriver(null)}
        />
      )}
    </div>
  );
}
