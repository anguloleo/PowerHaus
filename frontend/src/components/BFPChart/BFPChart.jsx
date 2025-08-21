
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot
} from 'recharts';
import './BFPChart.css';


const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const metric = payload[0].payload;
    return (
      <div className="bfp-tooltip">
        <p><strong>Date:</strong> {metric.date}</p>
        <p><strong>Body Fat:</strong> {metric.bodyFatPercentage}%</p>
        <p><strong>Weight:</strong> {metric.weightLbs} lbs</p>
        {metric.photoUrl && (
          <img
            src={metric.photoUrl}
            alt={`Progress ${metric.date}`}
            className="bfp-tooltip-photo"
          />
        )}
      </div>
    );
  }
  return null;
};


const PhotoDot = ({ cx, cy, payload }) => {
  if (payload.photoUrl) {
    return (
      <image
        href={payload.photoUrl}
        x={cx - 12}
        y={cy - 12}
        width={24}
        height={24}
        className="bfp-photo-dot"
      />
    );
  }
  return <Dot r={4} fill="#1E90FF" />;
};

export default function BFPChart({ metrics }) {
  if (!metrics || metrics.length === 0) return <p>No metrics recorded yet.</p>;

  return (
    <div className="bfp-chart-container">
      <h2 className="bfp-chart-title">Body Fat Percentage Tracker</h2>
      <ResponsiveContainer>
        <LineChart data={metrics} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ angle: -45, textAnchor: 'end', fontSize: 12 }} />
          <YAxis domain={[0, 100]} label={{ value: 'Body Fat %', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="bodyFatPercentage"
            stroke="#1E90FF"
            strokeWidth={2}
            dot={<PhotoDot />}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
