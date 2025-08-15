// src/components/GymClassListAll/GymClassListAll.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGyms } from "../../store/gyms";
import { fetchGymClassesByGymId } from "../../store/gymClasses";
import "./GymClassListAll.css";

export default function GymClassListAll() {
  const dispatch = useDispatch();
  const gyms = useSelector(state => Object.values(state.gyms.all));
  const classes = useSelector(state => Object.values(state.gymClasses.entries));
  
  const [selectedGymId, setSelectedGymId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    dispatch(fetchGyms());
  }, [dispatch]);

  useEffect(() => {
    if (selectedGymId) {
      dispatch(fetchGymClassesByGymId(selectedGymId));
    }
  }, [dispatch, selectedGymId]);

  const handleGymChange = (e) => {
    setSelectedGymId(e.target.value);
    setSelectedDate(""); // reset date when changing gym
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Filter classes by selected date
  const filteredClasses = selectedDate
    ? classes.filter(c => c.date === selectedDate)
    : classes;

  return (
    <div className="gym-class-list-container">
      <h2>All Gym Classes</h2>

      <div className="gym-select-container">
        <label htmlFor="gym-select">Select a Gym:</label>
        <select id="gym-select" value={selectedGymId} onChange={handleGymChange}>
          <option value="">-- Choose a gym --</option>
          {gyms.map(gym => (
            <option key={gym.id} value={gym.id}>{gym.name}</option>
          ))}
        </select>
      </div>

      {selectedGymId && (
        <div className="date-filter-container">
          <label htmlFor="date-select">Filter by Date:</label>
          <input
            type="date"
            id="date-select"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
      )}

      <div className="gym-class-list">
        {filteredClasses.length > 0 ? (
          filteredClasses.map(gymClass => (
            <div key={gymClass.id} className="gym-class-card">
              <h3>{gymClass.name}</h3>
              <p><strong>Description:</strong> {gymClass.description}</p>
              <p><strong>Date:</strong> {gymClass.date}</p>
              <p><strong>Start Time:</strong> {gymClass.time}</p>
              <p><strong>Duration:</strong> {gymClass.duration} min</p>
              <p><strong>Instructor:</strong> {gymClass.instructor?.firstName || "TBA"}</p>
              <p><strong>Location:</strong> {gymClass.location || "TBA"}</p>
            </div>
          ))
        ) : (
          <p>
            {selectedGymId
              ? "No classes for this gym on the selected date."
              : "Select a gym to see classes."}
          </p>
        )}
      </div>
    </div>
  );
}
