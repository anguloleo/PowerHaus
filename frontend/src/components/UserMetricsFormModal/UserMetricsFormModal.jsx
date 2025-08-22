import { useState } from "react";
import { useDispatch } from "react-redux";
import { createUserMetric } from "../../store/userMetrics";
import { useModal } from "../../context/Modal";
import './UserMetricsFormModal.css';

export default function UserMetricsFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [formData, setFormData] = useState({
    date: "",
    weightLbs: "",
    heightFeet: "",
    heightInches: "",
    bodyFatPercentage: "",
    photoUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createUserMetric(formData));
      closeModal();
    } catch (err) {
      console.error("Failed to create user metric:", err);
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-header">
        <h2>Add Progress Entry</h2>
        <button className="close-button" onClick={closeModal}>
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit} className="metrics-form">
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

        <button type="submit" className="submit-button">Save Entry</button>
      </form>
    </div>
  );
}
