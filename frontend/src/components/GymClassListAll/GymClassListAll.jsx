import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGyms } from "../../store/gyms";
import { fetchGymClassesByGymId } from "../../store/gymClasses";
import { createClassRegistration, removeClassRegistration, fetchClassRegistrations } from "../../store/classRegistration";
import "./GymClassListAll.css";

export default function GymClassListAll() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const gyms = useSelector(state => Object.values(state.gyms.all));
  const classes = useSelector(state => Object.values(state.gymClasses.entries));
  //const registrations = useSelector(state => Object.values(state.classRegistrations?.entries || {}));

  const [selectedGymId, setSelectedGymId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState(null);
  const [localRegistrations, setLocalRegistrations] = useState([]);

  // Fetch gyms on mount
  useEffect(() => {
    dispatch(fetchGyms());
  }, [dispatch]);

  // Fetch classes when a gym is selected
  useEffect(() => {
    if (selectedGymId) {
      dispatch(fetchGymClassesByGymId(selectedGymId));
    }
  }, [dispatch, selectedGymId]);

  // Fetch user registrations
  useEffect(() => {
    if (sessionUser) {
      dispatch(fetchClassRegistrations()).then(res => {
        setLocalRegistrations(Object.values(res.entries || {}));
      });
    }
  }, [dispatch, sessionUser]);

  // Check if user is registered for a class
  const isRegistered = (gymClassId) =>
      localRegistrations.some(reg => reg.gymClassId === gymClassId && reg.userId === sessionUser?.id);

  // Check for time conflicts
  const hasTimeConflict = (gymClass) =>
    localRegistrations.some(reg => {
      const regClass = classes.find(c => c.id === reg.gymClassId);
      if (!regClass) return false;
      return regClass.date === gymClass.date && regClass.time === gymClass.time;
    });

  const handleGymChange = (e) => {
    setSelectedGymId(e.target.value);
    setSelectedDate("");
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleRegister = async (gymClass) => {
    if (!sessionUser) {
      alert("You must be logged in to register for a class.");
      return;
    }

    const result = await dispatch(createClassRegistration({ gymClassId: gymClass.id }));
    if (!result.success) {
      setError(result.message || "Failed to register.");
    } else {
      setError(null);
      setLocalRegistrations(prev => [...prev, { gymClassId: gymClass.id, userId: sessionUser.id, id: result.id }]);
    }
  };

  const handleUnregister = async (gymClassId) => {
    const reg = localRegistrations.find(r => r.gymClassId === gymClassId && r.userId === sessionUser.id);
    if (!reg) return;

    const result = await dispatch(removeClassRegistration(reg.id));
    if (!result.success) {
      setError(result.message || "Failed to unregister.");
    } else {
      setError(null);
      setLocalRegistrations(prev => prev.filter(r => r.id !== reg.id));
    }
  };

  // Disable register button and set title dynamically
  const getRegisterButtonProps = (gymClass) => {
    const registered = isRegistered(gymClass.id);
    const conflict = hasTimeConflict(gymClass);
    const full = gymClass.capacity && localRegistrations.filter(r => r.gymClassId === gymClass.id).length >= gymClass.capacity;

    return {
      disabled: registered || conflict || full,
      title: registered ? "Already registered" : full ? "Class is full" : conflict ? "You have a time conflict" : ""
    };
  };

  const filteredClasses = selectedDate ? classes.filter(c => c.date === selectedDate) : classes;

  return (
    <div className="gym-class-list-container">
      <h2>All Gym Classes</h2>

      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

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
          <input type="date" id="date-select" value={selectedDate} onChange={handleDateChange} />
        </div>
      )}

      <div className="gym-class-list">
        {filteredClasses.length > 0 ? (
          filteredClasses.map(gymClass => {
            const registered = isRegistered(gymClass.id);

            return (
              <div key={gymClass.id} className="gym-class-card">
                <h3>{gymClass.name}</h3>
                <p><strong>Description:</strong> {gymClass.description}</p>
                <p><strong>Date:</strong> {gymClass.date}</p>
                <p><strong>Start Time:</strong> {gymClass.time}</p>
                <p><strong>Duration:</strong> {gymClass.duration} min</p>
                <p><strong>Instructor:</strong> {gymClass.instructor?.firstName || "TBA"}</p>
                <p><strong>Location:</strong> {gymClass.location || "TBA"}</p>

                {registered ? (
                  <button onClick={() => handleUnregister(gymClass.id)}>Unregister</button>
                ) : (
                  <button
                    onClick={() => handleRegister(gymClass)}
                    {...getRegisterButtonProps(gymClass)}
                  >
                    Register
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p>{selectedGymId ? "No classes for this gym on the selected date." : "Select a gym to see classes."}</p>
        )}
      </div>
    </div>
  );
}
