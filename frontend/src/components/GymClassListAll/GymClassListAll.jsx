import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGyms } from "../../store/gyms";
import { fetchGymClassesByGymId } from "../../store/gymClasses";
import { useNavigate } from "react-router-dom";
import {
  createClassRegistration,
  removeClassRegistration,
  fetchClassRegistrations,
} from "../../store/classRegistration";
import { useModal } from "../../context/Modal";
import ConfirmActionModal from "../ConfirmActionModal";
import "./GymClassListAll.css";

export default function GymClassListAll() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent } = useModal();
  const sessionUser = useSelector((state) => state.session.user);

  const gyms = useSelector((state) => Object.values(state.gyms.all));
  const classes = useSelector((state) => Object.values(state.gymClasses.entries));
  const registrationsFromStore = useSelector((state) =>
    Object.values(state.classRegistration.entries)
  );

  const [selectedGymId, setSelectedGymId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState(null);
  const [successMessages, setSuccessMessages] = useState({});
  const [localRegistrations, setLocalRegistrations] = useState(registrationsFromStore);

  // Sync local registrations with Redux store
  useEffect(() => {
    setLocalRegistrations(registrationsFromStore);
  }, [registrationsFromStore]);

  // Fetch gyms on mount
  useEffect(() => {
    dispatch(fetchGyms());
  }, [dispatch]);

  // Fetch registrations on mount if logged in
  useEffect(() => {
    if (sessionUser) {
      dispatch(fetchClassRegistrations());
    }
  }, [dispatch, sessionUser]);

  // Fetch classes when a gym is selected
  useEffect(() => {
    if (selectedGymId) {
      dispatch(fetchGymClassesByGymId(selectedGymId));
    }
  }, [dispatch, selectedGymId]);

  const isRegistered = (gymClassId) =>
    localRegistrations.some(
      (reg) => reg.gymClassId === gymClassId && reg.userId === sessionUser?.id
    );

  const hasTimeConflict = (gymClass) =>
    localRegistrations.some((reg) => {
      const regClass = classes.find((c) => c.id === reg.gymClassId);
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

  // Handle Register with ConfirmActionModal
  const handleRegister = (gymClass) => {
    if (!sessionUser) {
      alert("You must be logged in to register for a class.");
      return;
    }

    const registrationsCount = localRegistrations.filter(
      (r) => r.gymClassId === gymClass.id
    ).length;
    if (gymClass.capacity && registrationsCount >= gymClass.capacity) {
      alert("Sorry, this class is full.");
      return;
    }

    if (hasTimeConflict(gymClass)) {
      alert("You have a time conflict with another class.");
      return;
    }

    setModalContent(
      <ConfirmActionModal
        actionName="Register"
        message={`Are you sure you want to register for "${gymClass.name}"?`}
        confirmText="Yes, register me"
        cancelText="Cancel"
        actionColor="#28a745"
        onConfirm={async () => {
          const result = await dispatch(
            createClassRegistration({ gymClassId: gymClass.id })
          );
          if (!result.success) {
            setError(result.message || "Failed to register.");
          } else {
            setError(null);
            setLocalRegistrations((prev) => [
              ...prev,
              { userId: sessionUser.id, gymClassId: gymClass.id },
            ]);
            setSuccessMessages((prev) => ({
              ...prev,
              [gymClass.id]: `Successfully registered for ${gymClass.name}!`,
            }));
            setTimeout(() => {
              setSuccessMessages((prev) => {
                const copy = { ...prev };
                delete copy[gymClass.id];
                return copy;
              });
            }, 3000);
          }
        }}
      />
    );
  };

  // Handle Unregister with ConfirmActionModal
  const handleUnregister = (gymClass) => {
    const reg = localRegistrations.find(
      (r) => r.gymClassId === gymClass.id && r.userId === sessionUser.id
    );
    if (!reg) return;

    setModalContent(
      <ConfirmActionModal
        actionName="Unregister"
        message={`Are you sure you want to unregister from "${gymClass.name}"?`}
        confirmText="Yes, unregister me"
        cancelText="Cancel"
        actionColor="#d9534f"
        onConfirm={async () => {
          const result = await dispatch(removeClassRegistration(reg.id));
          if (!result.success) {
            setError(result.message || "Failed to unregister.");
          } else {
            setError(null);
            setLocalRegistrations((prev) =>
              prev.filter(
                (r) =>
                  r.gymClassId !== gymClass.id || r.userId !== sessionUser.id
              )
            );
          }
        }}
      />
    );
  };

  const getRegisterButtonProps = (gymClass) => {
    const registered = isRegistered(gymClass.id);
    const conflict = hasTimeConflict(gymClass);
    const full =
      gymClass.capacity &&
      localRegistrations.filter((r) => r.gymClassId === gymClass.id).length >=
        gymClass.capacity;

    return {
      disabled: registered || conflict || full,
      title: registered
        ? "Already registered"
        : full
        ? "Class is full"
        : conflict
        ? "You have a time conflict"
        : "",
    };
  };

  const filteredClasses = selectedDate
    ? classes.filter((c) => c.date === selectedDate)
    : classes;

  const formatTime12Hour = (time24) => {
    if (!time24) return "";
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const sortedClasses = filteredClasses.slice().sort((a, b) => {
    if (a.date === b.date) return a.time.localeCompare(b.time);
    return a.date.localeCompare(b.date);
  });

  return (
    <div className="gym-class-list-container">
      <h2>All Gym Classes</h2>

      {sessionUser?.role === "admin" && (
        <button
          className="create-class-btn"
          onClick={() => navigate("/classes/new")}
        >
          Create New Class
        </button>
      )}

      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

      <div className="gym-select-container">
        <label htmlFor="gym-select">Select a Gym:</label>
        <select id="gym-select" value={selectedGymId} onChange={handleGymChange}>
          <option value="">-- Choose a gym --</option>
          {gyms.map((gym) => (
            <option key={gym.id} value={gym.id}>
              {gym.name}
            </option>
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
        {sortedClasses.length > 0 ? (
          sortedClasses.map((gymClass) => {
            const registered = isRegistered(gymClass.id);
            const registrationsCount = localRegistrations.filter(
              (r) => r.gymClassId === gymClass.id
            ).length;
            const spotsAvailable = gymClass.capacity
              ? gymClass.capacity - registrationsCount
              : "N/A";

            // Lookup gym by ID
            const gym = gyms.find((g) => g.id === gymClass.gymId);

            return (
              <div key={gymClass.id} className="gym-class-card">
                <h3>{gymClass.name}</h3>
                <p>
                  <strong>Gym:</strong> {gym ? gym.name : "Unknown"}
                </p>
                <p>
                  <strong>Description:</strong> {gymClass.description}
                </p>
                <p>
                  <strong>Date:</strong> {gymClass.date}
                </p>
                <p>
                  <strong>Time:</strong> {formatTime12Hour(gymClass.time)}
                </p>
                <p>
                  <strong>Duration:</strong> {gymClass.duration} min
                </p>
                <p>
                  <strong>Instructor:</strong>{" "}
                  {gymClass.instructor?.firstName || "TBA"}
                </p>
                <p>
                  <strong>Location:</strong> {gymClass.location || "TBA"}
                </p>
                <p>
                  <strong>Capacity:</strong> {gymClass.capacity || "N/A"}
                </p>
                <p>
                  <strong>Spots Available:</strong> {spotsAvailable}
                </p>

                {sessionUser?.role === "admin" && (
                  <button
                    className="edit"
                    onClick={() => navigate(`/classes/${gymClass.id}/edit`)}
                  >
                    Edit
                  </button>
                )}

                {sessionUser?.role === "member" &&
                  (registered ? (
                    <button
                      className="unregister"
                      onClick={() => handleUnregister(gymClass)}
                    >
                      Unregister
                    </button>
                  ) : (
                    <button
                      className="register"
                      onClick={() => handleRegister(gymClass)}
                      {...getRegisterButtonProps(gymClass)}
                    >
                      Register
                    </button>
                  ))}

                {successMessages[gymClass.id] && (
                  <div className="success-popup-inline">
                    {successMessages[gymClass.id]}
                  </div>
                )}
              </div>
            );
          })
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
