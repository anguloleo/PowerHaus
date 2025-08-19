import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchGymClass, updateGymClass } from "../../store/gymClasses";

export default function GymClassEditForm() {
  const { classId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const gymClass = useSelector(state => state.gymClasses.entries[classId]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    startTime: "",
    duration: "",
    location: "",
    capacity: "",
    instructorId: ""
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (!gymClass) {
      dispatch(fetchGymClass(classId));
    } else {
      setFormData({
        name: gymClass.name || "",
        description: gymClass.description || "",
        date: gymClass.date || "",
        startTime: gymClass.time || "", // Map backend 'time' to form 'startTime'
        duration: gymClass.duration || "",
        location: gymClass.location || "",
        capacity: gymClass.capacity || "",
        instructorId: gymClass.instructorId || ""
      });
    }
  }, [dispatch, classId, gymClass]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Map startTime back to backend 'time' field
    const payload = { ...formData, time: formData.startTime };

    const updated = await dispatch(updateGymClass(classId, payload));

    if (updated.success) {
      navigate(-1); // go back to previous page
    } else {
      setError(updated.message || "Failed to update class.");
    }
  };

  if (!gymClass) return <p>Loading class...</p>;

  return (
    <div className="gym-class-edit-form">
      <h2>Edit Gym Class</h2>

      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>

        <label>
          Date:
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </label>

        <label>
          Start Time:
          <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
        </label>

        <label>
          Duration (min):
          <input type="number" name="duration" value={formData.duration} onChange={handleChange} required />
        </label>

        <label>
          Location:
          <input name="location" value={formData.location} onChange={handleChange} />
        </label>

        <label>
          Capacity:
          <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} />
        </label>

        <label>
          Instructor ID:
          <input type="number" name="instructorId" value={formData.instructorId} onChange={handleChange} />
        </label>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
