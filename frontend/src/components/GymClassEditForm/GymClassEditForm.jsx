import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchGymClass, updateGymClass } from "../../store/gymClasses";
import "./GymClassEditForm.css";

export default function GymClassEditForm() {
  const { classId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const gymClass = useSelector((state) => state.gymClasses.entries[classId]);

  const [instructors, setInstructors] = useState([]);
  const [gyms, setGyms] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    startTime: "",
    duration: "",
    location: "",
    capacity: "",
    instructorId: "",
    gymId: "",
  });

  const [error, setError] = useState(null);

  // Fetch instructors
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

  // Fetch gyms
  useEffect(() => {
    const fetchGyms = async () => {
      const res = await fetch("/api/gyms");
      if (res.ok) {
        const data = await res.json();
        setGyms(data.gyms || []);
      }
    };
    fetchGyms();
  }, []);

  // Fetch gym class if not in store
  useEffect(() => {
    if (!gymClass) {
      dispatch(fetchGymClass(classId));
    } else {
      setFormData({
        name: gymClass.name || "",
        description: gymClass.description || "",
        date: gymClass.date || "",
        startTime: gymClass.time || "",
        duration: gymClass.duration || "",
        location: gymClass.location || "",
        capacity: gymClass.capacity || "",
        instructorId: gymClass.instructorId || "",
        gymId: gymClass.gymId || "",
      });
    }
  }, [dispatch, classId, gymClass]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = { ...formData, time: formData.startTime };

    const updated = await dispatch(updateGymClass(classId, payload));

    if (updated.success) {
      navigate(-1);
    } else {
      setError(updated.message || "Failed to update class.");
    }
  };

  if (!gymClass) return <p>Loading class...</p>;

  return (
    <div className="gym-class-edit-form">
      <h2>Edit Gym Class</h2>

      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>

                <label>
          Gym:
          <select
            name="gymId"
            value={formData.gymId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Gym --</option>
            {gyms.map((gym) => (
              <option key={gym.id} value={gym.id}>
                {gym.name}
              </option>
            ))}
          </select>
        </label>

               <label>
          Instructor:
          <select
            name="instructorId"
            value={formData.instructorId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Instructor --</option>
            {instructors.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.firstName} {inst.lastName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Start Time:
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Duration (min):
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Location:
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </label>

        <label>
          Capacity:
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
          />
        </label>

 



        <button type="submit">Save Changes</button>
        <button
      type="button"
      onClick={() => navigate(-1)}
      style={{ marginLeft: "10px", backgroundColor: "#ccc" }}
    >
      Cancel
    </button>
      </form>
    </div>
  );
}
