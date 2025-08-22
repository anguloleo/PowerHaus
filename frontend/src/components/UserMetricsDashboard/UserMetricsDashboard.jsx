import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserMetrics, deleteUserMetric } from '../../store/userMetrics';
import { useModal } from '../../context/Modal';
import BMIChart from '../BMIChart';
import BFPChart from '../BFPChart';
import ConfirmActionModal from '../ConfirmActionModal';
import UserMetricsFormModal from '../UserMetricsFormModal';
import './UserMetricsDashboard.css';

export default function UserMetricsDashboard() {
  const dispatch = useDispatch();
  const { openModal } = useModal();
  const sessionUser = useSelector(state => state.session.user); 
  const metrics = useSelector(state => state.userMetrics.entries);

  useEffect(() => {
    if (sessionUser?.id) {
      dispatch(fetchUserMetrics());
    }
  }, [dispatch, sessionUser]);

  const sortedMetrics = useMemo(() => {
    return [...metrics].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [metrics]);

  const handleDelete = (metric) => {
    openModal({
      content: (
        <ConfirmActionModal
          actionName="Delete Metric"
          message={`Are you sure you want to delete the metric from ${metric.date}?`}
          confirmText="Delete"
          cancelText="Cancel"
          actionColor="#d9534f"
          onConfirm={() => dispatch(deleteUserMetric(metric.id))}
        />
      )
    });
  };

  const handleEdit = (metric) => {
    openModal({ content: <UserMetricsFormModal metric={metric} /> });
  };

  if (!sessionUser) {
    return <p className="umd-message">Please log in to view your metrics.</p>;
  }

  return (
    <div className="umd-container">
      <h1 className="umd-title">{sessionUser.username}’s Fitness Progress</h1>
      
      <div className="umd-chart-wrapper">
        <BMIChart metrics={sortedMetrics} />
      </div>

      <div className="umd-chart-wrapper">
        <BFPChart metrics={sortedMetrics} />
      </div>

      <div className="umd-recent-metrics">
        <h2>Recent Metrics</h2>
        {sortedMetrics.length === 0 ? (
          <p>No metrics recorded yet.</p>
        ) : (
          <table className="umd-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight (lbs)</th>
                <th>BMI</th>
                <th>Body Fat %</th>
                <th>Photo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedMetrics.map(metric => (
                <tr key={metric.id}>
                  <td>{metric.date}</td>
                  <td>{metric.weightLbs}</td>
                  <td>{metric.bmi.toFixed(1)}</td>
                  <td>{metric.bodyFatPercentage}</td>
                  <td>
                    {metric.photoUrl && (
                      <img
                        src={metric.photoUrl}
                        alt={`Progress ${metric.date}`}
                        className="umd-photo"
                      />
                    )}
                  </td>
                  <td>
                    <button
                      className="umd-btn umd-edit-btn"
                      onClick={() => handleEdit(metric)}
                    >
                      Edit
                    </button>
                    <button
                      className="umd-btn umd-delete-btn"
                      onClick={() => handleDelete(metric)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
