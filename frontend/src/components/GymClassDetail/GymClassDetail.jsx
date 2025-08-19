import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchGymClass } from "../../store/gymClasses.js";
import { createClassRegistration } from "../../store/classRegistration.js";
import "./GymClassDetail.css";

export default function GymClassDetailPage() {
  const { classId } = useParams(); // Get ID from route
  const dispatch = useDispatch();
  const gymClass = useSelector((state) => state.gymClasses.entries[classId]);
  const currentUser = useSelector((state) => state.session.user);
  const registrations = useSelector((state) => state.classRegistration.entries);
  const registrationList = useMemo(
    () => Object.values(registrations),
    [registrations]
  );

  useEffect(() => {
    if (!gymClass) dispatch(fetchGymClass(classId));
  }, [dispatch, classId, gymClass]);

  if (!gymClass) return <p>Loading class details...</p>;

  const spotsLeft =
    gymClass.capacity -
    registrationList.filter((reg) => reg.gymClassId === gymClass.id).length;

  const userRegistration = registrationList.find(
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
      await dispatch(
        createClassRegistration({ userId: currentUser.id, gymClassId: classId })
      );
      alert("You've signed up!");
    } catch (err) {
      alert("Failed to sign up. Please try again.");
    }
  };

  return (
    <div className="gym-class-detail-page">
      <h2>{gymClass.name}</h2>
      <p>Date: {gymClass.date}</p>
      <p>Time: {gymClass.time}</p>
      <p>Duration: {gymClass.duration} minutes</p>
      <p>Gym: {gymClass.gym?.name || "Unknown Gym"}</p>
      <p>Location: {gymClass.location}</p>
      <p>Description: {gymClass.description}</p>
      <p>Instructor: {gymClass.instructor?.firstName || "TBA"}</p>
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
    </div>
  );
}
