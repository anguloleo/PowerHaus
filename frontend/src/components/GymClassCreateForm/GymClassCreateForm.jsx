import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createGymClass } from "../../store/gymClasses";
import { fetchGyms } from "../../store/gyms";
import "./GymClassCreateForm.css";

export default function GymClassCreateForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get gyms from Redux store
  const gyms = useSelector(state => Object.values(state.gyms.all));

  const [instructors, setInstructors] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    startTime: "",
    duration: "",
    location: "",
    capacity: "",
    instructorId: "",
    gymId: ""
  });

  const [error, setError] = useState(null);

  // Fetch gyms from Redux
  useEffect(() => {
    dispatch(fetchGyms());
  }, [dispatch]);

  // Fetch instructors from backend
  useEffect(() => {
    const fetchInstructors = async () => {
      const res = await fetch("/api/users?role=instructor");
      if (res.ok) {
        const data = await res.json();
        setInstructors(data.users || []);
      }
    };
    fetchInstructors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Map startTime to backend field 'time'
    const payload = { ...formData, time: formData.startTime };

    try {
      const newClass = await dispatch(createGymClass(payload));
      if (newClass && newClass.id) {
        navigate(`/classes/all`);
      }
    } catch (err) {
      setError(err.message || "Failed to create class.");
    }
  };

  return (
    <div className="gym-class-create-form">
      <h2>Create New Gym Class</h2>

      {error && <div style={{ color: "red" }}>{error}</div>}

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
          Gym:
          <select name="gymId" value={formData.gymId} onChange={handleChange} required>
            <option value="">-- Select Gym --</option>
            {gyms.map(gym => (
              <option key={gym.id} value={gym.id}>{gym.name}</option>
            ))}
          </select>
        </label>

        <label>
          Instructor:
          <select name="instructorId" value={formData.instructorId} onChange={handleChange} required>
            <option value="">-- Select Instructor --</option>
            {instructors.map(inst => (
              <option key={inst.id} value={inst.id}>
                {inst.firstName} {inst.lastName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Location:
          <input name="location" value={formData.location} onChange={handleChange} />
        </label>

        <label>
          Capacity:
          <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} />
        </label>

        <button type="submit">Create Class</button>
      </form>
    </div>
  );
}
