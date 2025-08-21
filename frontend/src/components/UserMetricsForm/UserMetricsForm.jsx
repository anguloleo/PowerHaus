import { useState } from "react";
import { useDispatch } from "react-redux";
import { createUserMetric } from "../../store/userMetrics";

export default function UserMetricsForm() {
  const dispatch = useDispatch();

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
      setFormData({
        date: "",
        weightLbs: Number(formData.weightLbs),
        heightFeet: Number(formData.heightFeet),
        heightInches: Number(formData.heightInches),
        bodyFatPercentage: formData.bodyFatPercentage ? Number(formData.bodyFatPercentage) : null,
        photoUrl: "",
      });
    } catch (err) {
      console.error("Failed to create user metric:", err);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Add Progress Entry</h2>
      <form onSubmit={handleSubmit}>
        {/* Date */}
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Weight */}
        <div>
          <label htmlFor="weightLbs">Weight (lbs):</label>
          <input
            type="number"
            id="weightLbs"
            name="weightLbs"
            value={formData.weightLbs}
            onChange={handleChange}
            required
          />
        </div>

        {/* Height */}
        <div>
          <label htmlFor="heightFeet">Height (ft):</label>
          <input
            type="number"
            id="heightFeet"
            name="heightFeet"
            value={formData.heightFeet}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="heightInches">Height (in):</label>
          <input
            type="number"
            id="heightInches"
            name="heightInches"
            value={formData.heightInches}
            onChange={handleChange}
            required
          />
        </div>

        {/* Body Fat */}
        <div>
          <label htmlFor="bodyFatPercentage">Body Fat %:</label>
          <input
            type="number"
            step="0.1"
            id="bodyFatPercentage"
            name="bodyFatPercentage"
            value={formData.bodyFatPercentage}
            onChange={handleChange}
          />
        </div>

        {/* Photo URL */}
        <div>
          <label htmlFor="photoUrl">Progress Photo URL:</label>
          <input
            type="url"
            id="photoUrl"
            name="photoUrl"
            value={formData.photoUrl}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Save Entry</button>
      </form>
    </div>
  );
}
