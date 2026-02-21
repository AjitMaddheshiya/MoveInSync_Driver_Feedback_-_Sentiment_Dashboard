import { MessageSquare, Star, ThumbsUp, AlertTriangle } from 'lucide-react';
import './MetricCard.css';

interface MetricCardProps {
  title: string;
  value: string;
  icon: 'message' | 'star' | 'thumbsUp' | 'alert';
  color?: 'default' | 'success' | 'warning' | 'danger';
}

const iconMap = {
  message: MessageSquare,
  star: Star,
  thumbsUp: ThumbsUp,
  alert: AlertTriangle,
};

export default function MetricCard({ title, value, icon, color = 'default' }: MetricCardProps) {
  const IconComponent = iconMap[icon];

  return (
    <div className={`metric-card metric-card-${color}`}>
      <div className="metric-card-icon">
        <IconComponent size={24} />
      </div>
      <div className="metric-card-content">
        <div className="metric-card-value">{value}</div>
        <div className="metric-card-title">{title}</div>
      </div>
    </div>
  );
}
