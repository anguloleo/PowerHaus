import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGymClass } from "../../store/gymClasses.js";
import { createClassRegistration } from "../../store/classRegistration.js";
import "./GymClassDetailModal.css";

export default function GymClassDetailModal({ classId, onClose }) {
  const dispatch = useDispatch();
  const gymClass = useSelector((state) => state.gymClasses.entries[classId]);
  const currentUser = useSelector((state) => state.session.user);
  const registrations = useSelector((state) => Object.values(state.classRegistration.entries));

  useEffect(() => {
    if (!gymClass) dispatch(fetchGymClass(classId));
  }, [dispatch, classId, gymClass]);

  if (!gymClass)
    return (
      <div className="modal">
        <div className="modal-content">
          <p>Loading class details...</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );

  // Calculate spots left
  const spotsLeft = gymClass.capacity - (gymClass.attendees?.length || 0);

  // Check if current user is already signed up for this class
  const userRegistration = registrations.find(
    (reg) => reg.userId === currentUser?.id && reg.gymClassId === gymClass.id
  );

  const handleSignUp = async () => {
    if (!currentUser) {
      alert("Please log in to sign up.");
      return;
    }
    if (spotsLeft <= 0) {
      alert("Sorry, this class is full.");
      return;
    }
    if (userRegistration) {
      alert("You are already signed up for this class.");
      return;
    }
    try {
      await dispatch(createClassRegistration({ userId: currentUser.id, gymClassId: classId }));
      alert("You've signed up!");
      onClose();
    } catch (err) {
      alert("Failed to sign up. Please try again.");
    }
  };

  return (
    <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <h2>{gymClass.name}</h2>
        <p>Date: {gymClass.date}</p>
        <p>Time: {gymClass.time}</p>
        <p>Duration: {gymClass.duration} minutes</p>
        <p>Location: {gymClass.location}</p>
        <p>Description: {gymClass.description}</p>
        <p>Instructor: {gymClass.instructor}</p>
        <p>Capacity: {gymClass.capacity}</p>
        <p>Spots left: {spotsLeft}</p>

        <button
          onClick={handleSignUp}
          disabled={spotsLeft <= 0 || !!userRegistration}
        >
          {spotsLeft <= 0
            ? "Class Full"
            : userRegistration
            ? "Already Signed Up"
            : "Sign Up"}
        </button>

        <button onClick={onClose} className="close-btn">
          Close
        </button>
      </div>
    </div>
  );
}
