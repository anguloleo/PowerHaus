import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGymClass } from "../../store/gymClasses";
import { createClassRegistration, removeClassRegistration } from "../../store/classRegistration";
import { useModal } from "../../context/Modal";
import ConfirmActionModal from "../ConfirmActionModal/ConfirmActionModal";
import "./GymClassDetailModal.css";

export default function GymClassDetailModal({ classId }) {
  const classIdInt = parseInt(classId, 10);
  const dispatch = useDispatch();
  const { closeModal, setModalContent } = useModal();

  const gymClass = useSelector((state) => state.gymClasses.entries[classIdInt]);
  const currentUser = useSelector((state) => state.session.user);
  const registrations = useSelector((state) => state.classRegistration.entries);
  const registrationList = useMemo(() => Object.values(registrations), [registrations]);

  const [userRegistration, setUserRegistration] = useState(null);

  useEffect(() => {
    if (!gymClass && !isNaN(classIdInt)) dispatch(fetchGymClass(classIdInt));

    const existingRegistration = registrationList.find(
      (reg) => reg.userId === currentUser?.id && reg.gymClassId === classIdInt
    );
    setUserRegistration(existingRegistration || null);
  }, [dispatch, classIdInt, gymClass, currentUser, registrationList]);

  if (!gymClass) return <p className="loading">Loading class details...</p>;

  const spotsLeft =
    gymClass.capacity - registrationList.filter((reg) => reg.gymClassId === gymClass.id).length;

  // Handle Register
  const handleRegisterClick = () => {
    if (!currentUser) return alert("Please log in to register.");
    if (spotsLeft <= 0) return alert("Sorry, this class is full.");
    if (userRegistration) return alert("You are already registered.");

    setModalContent(
      <ConfirmActionModal
        actionName="Register"
        message="Are you sure you want to register for this class?"
        confirmText="Yes, register me"
        cancelText="Cancel"
        actionColor="#28a745"
        onConfirm={handleConfirmRegister}
      />
    );
  };

  const handleConfirmRegister = async () => {
    try {
      const newRegistration = await dispatch(
        createClassRegistration({ gymClassId: classIdInt })
      );
      setUserRegistration(newRegistration); // update local registration state
      closeModal(); // close confirm modal
    } catch (err) {
      alert("Failed to register. Please try again.");
    }
  };

  // Handle Unregister
  const handleUnregisterClick = () => {
    setModalContent(
      <ConfirmActionModal
        actionName="Unregister"
        message="Are you sure you want to unregister from this class?"
        confirmText="Yes, unregister me"
        cancelText="Cancel"
        actionColor="#d9534f"
        onConfirm={handleConfirmUnregister}
      />
    );
  };

  const handleConfirmUnregister = async () => {
    try {
      await dispatch(removeClassRegistration(userRegistration.id));
      setUserRegistration(null); // update local registration state
      closeModal(); // close confirm modal
    } catch (err) {
      alert("Failed to unregister. Please try again.");
    }
  };

  // Format date & time
  const formattedDate = new Date(`${gymClass.date}T${gymClass.time}`).toLocaleDateString(
    undefined,
    { weekday: "short", year: "numeric", month: "short", day: "numeric" }
  );
  const formattedTime = new Date(`${gymClass.date}T${gymClass.time}`).toLocaleTimeString(
    undefined,
    { hour: "numeric", minute: "2-digit", hour12: true }
  );

  return (
    <div className="modal-container gym-class-modal">
      <div className="modal-header">
        <h2>{gymClass.name}</h2>
        <button className="close-button" onClick={closeModal}>
          &times;
        </button>
      </div>

      <div className="gym-class-info">
        <div className="info-row">
          <strong>Date:</strong> {formattedDate}
        </div>
        <div className="info-row">
          <strong>Time:</strong> {formattedTime}
        </div>
        <div className="info-row">
          <strong>Duration:</strong> {gymClass.duration} min
        </div>
        <div className="info-row">
          <strong>Gym:</strong> {gymClass.gym?.name || "Unknown"}
        </div>
        <div className="info-row">
          <strong>Location:</strong> {gymClass.location}
        </div>
        <div className="info-row">
          <strong>Instructor:</strong> {gymClass.instructor?.firstName || "TBA"}
        </div>
        <div className="info-row">
          <strong>Capacity:</strong> {gymClass.capacity} <strong>Spots left:</strong>{" "}
          {spotsLeft}
        </div>
      </div>
      <div className="info-row">
        <strong>Description:</strong> {gymClass.description || "TBA"}
      </div>

      {/* Only show buttons to logged-in members */}
      {currentUser?.role === "member" && (
        <div className="register-buttons">
          {userRegistration ? (
            <button onClick={handleUnregisterClick}>Unregister</button>
          ) : (
            <button onClick={handleRegisterClick} disabled={spotsLeft <= 0}>
              {spotsLeft <= 0 ? "Class Full" : "Register"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
