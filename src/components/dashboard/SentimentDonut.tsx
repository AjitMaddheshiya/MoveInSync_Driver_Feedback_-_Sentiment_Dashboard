import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './SentimentDonut.css';

interface SentimentDonutProps {
  positive: number;
  neutral: number;
  negative: number;
}

const COLORS = {
  positive: '#10B981',
  neutral: '#F59E0B',
  negative: '#EF4444',
};

export default function SentimentDonut({ positive, neutral, negative }: SentimentDonutProps) {
  const data = [
    { name: 'Positive', value: positive, color: COLORS.positive },
    { name: 'Neutral', value: neutral, color: COLORS.neutral },
    { name: 'Negative', value: negative, color: COLORS.negative },
  ].filter(d => d.value > 0);

  const total = positive + neutral + negative;

  if (total === 0) {
    return (
      <div className="sentiment-donut-empty">
        <p>No feedback data available</p>
      </div>
    );
  }

  return (
    <div className="sentiment-donut">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
              const RADIAN = Math.PI / 180;
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);
              return (
                <text
                  x={x}
                  y={y}
                  fill="white"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                  fontWeight={500}
                >
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value}`, 'Count']}
            contentStyle={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span style={{ color: '#1e293b', fontSize: '14px' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="sentiment-center">
        <div className="sentiment-total">{total}</div>
        <div className="sentiment-label">Total</div>
      </div>
    </div>
  );
}
