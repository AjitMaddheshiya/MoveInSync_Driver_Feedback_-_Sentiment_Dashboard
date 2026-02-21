import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './FeedbackByCategory.css';

interface FeedbackByCategoryProps {
  driverCount: number;
  tripCount: number;
  appCount: number;
  marshalCount: number;
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

export default function FeedbackByCategory({ 
  driverCount, 
  tripCount, 
  appCount, 
  marshalCount 
}: FeedbackByCategoryProps) {
  const data = [
    { name: 'Driver', count: driverCount, fill: COLORS[0] },
    { name: 'Trip', count: tripCount, fill: COLORS[1] },
    { name: 'App', count: appCount, fill: COLORS[2] },
    { name: 'Marshal', count: marshalCount, fill: COLORS[3] },
  ];

  return (
    <div className="feedback-by-category">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            cursor={{ fill: '#f3f4f6' }}
          />
          <Bar 
            dataKey="count" 
            name="Feedback Count"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
