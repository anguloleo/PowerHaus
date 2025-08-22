import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUserMetric, editUserMetric } from "../../store/userMetrics"; // make sure you have update action
import { useModal } from "../../context/Modal";
import './UserMetricsFormModal.css';

export default function UserMetricsFormModal({ metric }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const currentUser = useSelector(state => state.session.user);

  
  const [formData, setFormData] = useState({
    date: "",
    weightLbs: "",
    heightFeet: "",
    heightInches: "",
    bodyFatPercentage: "",
    photoUrl: "",
  });

  useEffect(() => {
    if (metric) {
      setFormData({
        date: metric.date || "",
        weightLbs: metric.weightLbs || "",
        heightFeet: metric.heightFeet || "",
        heightInches: metric.heightInches || "",
        bodyFatPercentage: metric.bodyFatPercentage || "",
        photoUrl: metric.photoUrl || "",
      });
    }
  }, [metric]);

  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const metricData = {
      ...formData,
      userId: currentUser?.id
    };

    try {
      if (metric) {
        await dispatch(editUserMetric(metric.id, metricData)); 
      } else {
        await dispatch(createUserMetric(metricData)); 
      }
      closeModal();
      window.location.href = "/user-metrics";
    } catch (res) {
      const data = await res.json();
      if (data?.errors) setErrors(data.errors);
    }
  };

  return (
    <div className="modal-container metrics-modal">
      <div className="modal-header">
        <h2>{metric ? "Edit Progress Entry" : "Add Progress Entry"}</h2>
        <button className="close-button" onClick={closeModal}>&times;</button>
      </div>

      {errors.length > 0 && (
        <ul className="form-errors">
          {errors.map((err, i) => <li key={i}>{err}</li>)}
        </ul>
      )}

      <form className="metrics-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Weight (lbs):</label>
          <input type="number" name="weightLbs" value={formData.weightLbs} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group small">
            <label>Height (ft):</label>
            <input type="number" name="heightFeet" value={formData.heightFeet} onChange={handleChange} required />
          </div>

          <div className="form-group small">
            <label>Height (in):</label>
            <input type="number" name="heightInches" value={formData.heightInches} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Body Fat %:</label>
          <input type="number" step="0.1" name="bodyFatPercentage" value={formData.bodyFatPercentage} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Progress Photo URL:</label>
          <input type="url" name="photoUrl" value={formData.photoUrl} onChange={handleChange} />
        </div>

        <button type="submit">{metric ? "Save Changes" : "Save Entry"}</button>
      </form>
    </div>
  );
}
