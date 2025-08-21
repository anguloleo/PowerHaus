
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
import './BMIChart.css';


const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const metric = payload[0].payload;
    return (
      <div className="bmi-tooltip">
        <p><strong>Date:</strong> {metric.date}</p>
        <p><strong>BMI:</strong> {metric.bmi.toFixed(1)}</p>
        <p><strong>Weight:</strong> {metric.weightLbs} lbs</p>
        {metric.photoUrl && (
          <img
            src={metric.photoUrl}
            alt={`Progress ${metric.date}`}
            className="bmi-tooltip-photo"
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
        className="bmi-photo-dot"
      />
    );
  }
  return <Dot r={4} fill="#FF5A2A" />;
};

export default function BMIChart({ metrics }) {
  if (!metrics || metrics.length === 0) return <p>No metrics recorded yet.</p>;

  return (
    <div className="bmi-chart-container">
      <h2 className="bmi-chart-title">Body Mass Index Tracker</h2>
      <ResponsiveContainer>
        <LineChart data={metrics} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ angle: -45, textAnchor: 'end', fontSize: 12 }} />
          <YAxis
            domain={['dataMin - 2', 'dataMax + 2']}
            label={{ value: 'BMI', angle: -90, position: 'insideLeft' }}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="bmi"
            stroke="#FF5A2A"
            strokeWidth={2}
            dot={<PhotoDot />}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
